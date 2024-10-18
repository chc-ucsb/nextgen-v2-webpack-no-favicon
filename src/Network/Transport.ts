// eslint-disable-next-line max-classes-per-file
import { logger } from '../utils';
import { Dictionary } from '../@types';
import { getRandomString } from '../helpers/string';

interface IRequestOptions extends RequestInit {
  callback?: Function;
  callbackObj?: Dictionary;
  errCallback?: Function;
}

/**
 * Logs any errors only if application is in Debug Mode
 * @param {string} err
 */
export const handleError = (err: string): void => {
  if (globalThis?.App?.Config?.debugMode) {
    logger.derror(err);
  }
};

/**
 * Make a network request
 * @param {string} url
 * @param {IRequestOptions} options
 * @returns {Promise<Response>}
 */
const makeRequest = async (url: string, options?: IRequestOptions): Promise<Response> => {
  const res = await fetch(url, options).catch((e) => {
    return options?.errCallback?.(res, options?.callbackObj);
  });
  try {
    if (res) {
      const clonedResponse = res.clone();
      Object.assign(clonedResponse, {
        id: getRandomString(32),
      });

      if (clonedResponse.ok) {
        await options?.callback?.(clonedResponse, options.callbackObj);
      } else {
        handleError(`HTTP Error - ${clonedResponse.status}`);
        await options?.errCallback?.(clonedResponse, options?.callbackObj);
      }

      return clonedResponse;
    }
  } catch (e) {
    if (e) handleError(e);
    return res;
  }
};

class PostTransport {
  body: string;

  constructor(body: string) {
    this.body = body;
  }

  to(url: string, options?: IRequestOptions): Promise<Response> {
    return makeRequest(url, {
      method: 'POST',
      body: this.body,
      ...options,
    });
  }
}

/**
 * await Transport.get('http://google.com')
 * await Transport.post('some=vars').to('http://google.com')
 */
export class Transport {
  static get(url: string, options?: IRequestOptions): Promise<Response> {
    return makeRequest(url, options);
  }

  static post(body: string): PostTransport {
    return new PostTransport(body);
  }
}
