import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import * as Analytics from './Analytics';
import { Dictionary } from './@types';
import { Store } from './Store';
import { ApplicationSettings, Config } from './Config';
import { objPropExists } from './helpers/object';
import { logger } from './utils';
import { Transport } from './Network/Transport';
import { propExists } from './helpers/string';
import { isEmpty } from './helpers/validation';
import { Architect } from './Architect';

export { Config } from './Config';
export class NextGenViewer {
  APP_SETTINGS: Dictionary;
  APP_STATE: Store;

  constructor(settings: Config) {
    /**
     * Step 1. Perform a service check
     */
    this.serviceCheck(settings)

      /**
       * Step 2. Parse the settings and resolve referenced JSON files.
       */
      .then(this.fetchSettings)

      /**
       * Step 3. Use the resolved settings to populate the application state
       */
      .then((settings) => {
        this.APP_SETTINGS = settings;
        this.APP_STATE = new Store(settings);
        if (globalThis?.App?.Charter) this.APP_STATE.Charter = globalThis.App.Charter;
        globalThis.App = this.APP_STATE;

        for (const type of Object.keys(settings.sources)) {
          const data = this.APP_STATE.Config.sources[type];

          if (type === 'charts') {
            data.map((chartConfig, i) => {
              const overlayConfigs = chartConfig.overlays;
              overlayConfigs.map((overlayConfig, j) => {
                if (typeof overlayConfig === 'string') {
                  data[i].overlays[j] = {
                    type: 'single',
                    forLayerId: overlayConfig,
                    timeseriesSourceLayerIds: [overlayConfig],
                  };
                }
              });
            });
          }

          if (type === 'projections') {
            for (const projection of Object.keys(data)) {
              proj4.defs(projection, data[projection]);
            }
            register(proj4);
          }
        }
      })

      /**
       * Step 4. Perform custom defined initialization steps.
       * ex: auth handling (this.APP_SETTINGS?.authentication_url)
       */
      .then(() => this.execCustomInitialization())

      /**
       * Step 5. Start Application initialization
       *   i. Load layer configuration from server.
       *   ii. Build the UI
       */
      .then(() => this.start());
  }

  async serviceCheck(settings: ApplicationSettings): Promise<ApplicationSettings> {
    const showMaintenanceMessage = function () {
      const sheet = window.document.styleSheets[0] as CSSStyleSheet;

      sheet.insertRule(
        'body { text-align: center; padding: 150px; background:#ffffff !important; padding:150px !important; margin:8px !important;}',
        sheet.cssRules.length
      );
      sheet.insertRule('h1 { font-size: 50px !important; }', sheet.cssRules.length);
      sheet.insertRule('body { font: 20px Helvetica, sans-serif !important; color: #333 !important; }', sheet.cssRules.length);
      sheet.insertRule(
        'article { display: block !important; text-align: left !important; width: 650px; margin: 0 auto !important; }',
        sheet.cssRules.length
      );
      sheet.insertRule('a { color: #dc8100 !important; text-decoration: none !important; }', sheet.cssRules.length);
      sheet.insertRule('a:hover { color: #333 !important; text-decoration: none !important; }', sheet.cssRules.length);

      document.body.innerHTML = `
          <article>
            <h1>We&rsquo;ll be back soon!</h1>
            <div>
              <p>Sorry for the inconvenience but we're performing some routine maintenance at the moment. Please try again later.</p>
              <p>Thank you.</p>
            </div>
          </article>
        `;
      throw new Error(`We'll be back soon!`);
    };

    // Manual maintenance mode check
    const maintenanceJsonReq = await Transport.get('./maintenance.json');
    if (maintenanceJsonReq) {
      const res = await maintenanceJsonReq.json();
      // If the `enable` property is set to true, show the maintenance message.
      if (res.enable) showMaintenanceMessage();
    }

    if (objPropExists(settings.sources, 'serviceCheck')) {
      logger.info('Service Check is defined, fetching API data...');

      const req = await Transport.get(settings.sources.serviceCheck);

      if (!req) {
        logger.log('Service Check failed. Attempting to start normally...');
        this.addLoadMask();
        return settings;
      }

      const res = await req.json();

      settings.serviceCheck = res;

      if (res?.down.length) {
        showMaintenanceMessage();
      }

      if (!res?.upcoming.length && !res?.down.length) {
        this.addLoadMask();
      }

      if (res?.upcoming.length) {
        this.addLoadMask();
      }
    } else {
      logger.log('Service Check is undefined. Attempting to start normally...');
      this.addLoadMask();
    }
    return settings;
  }

  async fetchSettings(settings: ApplicationSettings): Promise<ApplicationSettings> {
    const resolved: ApplicationSettings = { ...settings };

    const fetchData = async (url: string): Promise<Dictionary> => (await Transport.get(url)).json();
    const saveData = (data: object, type: string): object => {
      /**
       * Currently, the JSON is written such that the top level property is the type of config file.
       * ```
       * {
       *  "charts": [
       *    ...
       *  ]
       * }
       * ```
       * \
       * If the config file type doesn't follow this convention and is missing from the top level, we just return the data
       * ```
       * [
       *  {...},
       *  ...
       * ]
       * ```
       */
      const tempData: object = objPropExists(data, type) ? data[type] : data;
      resolved.sources[type] = tempData;
      return tempData;
    };

    for (const type of Object.keys(settings.sources).filter((key) => key !== 'serviceCheck')) {
      const source = settings.sources[type];
      let data;
      if (typeof source === 'string' && propExists(source)) {
        data = await fetchData(settings.sources[type]);
      } else if (typeof source === 'object' && !isEmpty(source)) {
        data = source;
      }
      saveData(data, type);
    }

    return resolved;
  }

  async execCustomInitialization(): Promise<void> {
    // TODO: change references to mapper
    if (this.APP_SETTINGS?.authentication_url) {
      // let authenticationUrl = Settings.authentication_url
      // let loadingMask = document.getElementById('initial-loading-message')
      // loadingMask.style.display = 'none'
      // let loginFormWrapper = document.createElement('div')
      // loginFormWrapper.id = 'login-form-wrapper'
      // loginFormWrapper.style.border = '3px solid black'
      // loginFormWrapper.style['border-radius'] = '3px'
      // loginFormWrapper.style.display = 'flex'
      // loginFormWrapper.style['flex-direction'] = 'column'
      // loginFormWrapper.style['justify-content'] = 'center'
      // loginFormWrapper.style['align-items'] = 'center'
      // let loginFormHeader = document.createElement('p')
      // loginFormHeader.style['font-size'] = '16px'
      // loginFormHeader.style['font-weight'] = 'bold'
      // loginFormHeader.style['margin-bottom'] = '0'
      // loginFormHeader.innerHTML = 'Authentication Required.'
      // loginFormWrapper.appendChild(loginFormHeader)
      // let loginForm = document.createElement('form')
      // loginForm.method = 'POST'
      // loginForm.action = authenticationUrl
      // loginForm.id = 'login-form'
      // loginForm.style.width = '200px'
      // loginForm.style.height = '125px'
      // loginForm.style.padding = '10px'
      // let emailField = document.createElement('div')
      // emailField.style.margin = '10px'
      // let emailLabel = document.createElement('label')
      // emailLabel.for = 'email'
      // emailLabel.innerHTML = 'Email:'
      // emailField.appendChild(emailLabel)
      // let emailTextbox = document.createElement('input')
      // emailTextbox.type = 'text'
      // emailTextbox.id = 'email'
      // emailTextbox.name = 'email'
      // emailField.appendChild(emailTextbox)
      // loginForm.appendChild(emailField)
      // let passwordField = document.createElement('div')
      // passwordField.style.margin = '10px'
      // let passwordLabel = document.createElement('label')
      // passwordLabel.for = 'password'
      // passwordLabel.innerHTML = 'Password:'
      // passwordField.appendChild(passwordLabel)
      // let passwordTextbox = document.createElement('input')
      // passwordTextbox.type = 'password'
      // passwordTextbox.id = 'password'
      // passwordTextbox.name = 'password'
      // passwordField.appendChild(passwordTextbox)
      // loginForm.appendChild(passwordField)
      // let submitField = document.createElement('div')
      // submitField.style.margin = '10px'
      // submitField.style['text-align'] = 'right'
      // let submitButton = document.createElement('button')
      // submitButton.type = 'submit'
      // submitButton.id = 'login-submit'
      // submitButton.innerHTML = 'Login'
      // submitField.appendChild(submitButton)
      // loginForm.appendChild(submitField)
      // loginForm.onsubmit = function(e) {
      //   e.preventDefault()
      //   submitButton.innerHTML = "<img src='images/loading.gif'>"
      //   let emailTextbox = document.getElementById('email')
      //   let passwordTextbox = document.getElementById('password')
      //   let email = emailTextbox.value
      //   let password = passwordTextbox.value
      //   Utils.asyncAjax({
      //     url: this.action,
      //     type: this.method,
      //     params: 'email=' + email + '&password=' + password,
      //     callback: function(request) {
      //       let responseJson = JSON.parse(request.responseText)
      //       if (responseJson.success === true) {
      //         mapper.userEmail = email
      //         let loadingMask = document.getElementById('initial-loading-message')
      //         loadingMask.style.display = 'flex'
      //         document.getElementById('initial-loading-mask').removeChild(document.getElementById('login-form-wrapper'))
      //         mapper.getConfigurations(settings)
      //       } else {
      //         let passwordTextbox = document.getElementById('password')
      //         passwordTextbox.value = ''
      //         let loginForm = document.getElementById('login-form')
      //         let errorMessage = document.getElementById('login-error-message')
      //         if (errorMessage === null) {
      //           errorMessage = document.createElement('p')
      //           errorMessage.style.color = 'red'
      //           errorMessage.id = 'login-error-message'
      //           errorMessage.innerHTML = responseJson.errorMessage
      //           loginForm.appendChild(errorMessage)
      //           loginForm.style.height = '170px'
      //         } else {
      //           errorMessage.innerHTML = responseJson.errorMessage
      //         }
      //         submitButton.innerHTML = 'Login'
      //       }
      //     }
      //   })
      // }
      // loginFormWrapper.appendChild(loginForm)
      // document.getElementById('initial-loading-mask').appendChild(loginFormWrapper)
    }

    if (this.APP_SETTINGS?.cssOverride) {
      // TODO: if cssoverride !== 'undefined'
    }
  }

  async start(): Promise<void> {
    await this.APP_STATE.Layers.loadLayerConfiguration();
    this.APP_STATE.Layers.createNewInstanceOfLayersConfig();
    this.buildUI();
  }

  /**
   * Generates the UI components by:
   * 1. Creating a dependency graph.
   * 2. Rendering the components.
   * 3. Displaying the components by adding them to the viewport.
   */
  buildUI(): void {
    const architect = new Architect();
    const _blockConfigs = architect.setBlockIds(this.APP_STATE.Config.sources.template.blocks);
    const _blueprints = architect.buildBlueprints(_blockConfigs);
    this.APP_STATE._blueprints = _blueprints;
    architect.setRelationships(_blueprints);
    architect.performInitialSetup(_blueprints);

    const items = architect.getBlocks(_blueprints);
    const viewportItems = {
      layout: 'border',
      id: 'ViewportItems',
      deferredRender: false,
      items,
    };
    this.APP_STATE.Viewport.addItems(viewportItems);

    this.removeLoadMask();

    // Display message
    if (!isEmpty(this.APP_STATE.Layers?._failedExternalResources)) {
      let message = `<div>${
        globalThis.App.Config.sources.template?.externalServices?.errorMessages.beforeErrorList ?? 'One or more external resources failed to load.'
      }</div><div><ul>`;

      const failedResources = Object.entries(this.APP_STATE.Layers._failedExternalResources);
      failedResources.forEach(([resource, reason]) => {
        message += `<li><b>URL:</b> ${resource} <br /> <b>Reason:</b> ${reason}</li>`;
      });

      message += '</ul></div>';

      Ext.MessageBox.show({
        title: globalThis.App.Config.sources.template?.externalServices?.errorTitle ?? 'Service Error',
        msg: message,
        buttons: Ext.MessageBox.OK,
        autoScroll: true,
      });
    }

    /*
     * If any periodic layers that get the start and end period from a rest endpoint
     * fails to get a response from the endpoint, show a warning message to the user.
     */
    const getFailedLayersHtml = (failedLayers, failedLayerIds, html = ''): string => {
      let htmlStr = html;
      if (Object.prototype.toString.call(failedLayers) === '[object Object]') {
        htmlStr += '<ul style="list-style-type: none;">';

        let prop;
        for (prop of Object.keys(failedLayers)) {
          htmlStr += `<li>${prop}: ${getFailedLayersHtml(failedLayers[prop], failedLayerIds)}</li>`;
        }
        htmlStr += '</ul>';
      } else {
        htmlStr += '[';
        for (let i = 0, len = failedLayers.length; i < len; i += 1) {
          const failedLayer = failedLayers[i];
          if (failedLayer.type === 'folder') {
            htmlStr += '{<ul style="list-style-type: none;">';
            htmlStr += `<li>ID: ${failedLayer.id}</li><li>Title: ${failedLayer.title}</li>`;
            htmlStr += `<li>Folder: ${getFailedLayersHtml(failedLayer.folder, failedLayerIds)}</li>`;
          } else {
            htmlStr += '{<ul style="color: red; list-style-type: none;">';
            htmlStr += `<li>ID: ${failedLayer.id}</li><li>Title: ${failedLayer.title}</li>`;
          }

          htmlStr += '</ul>}';
          if (i < len - 1) htmlStr += ', ';
        }
        htmlStr += ']';
      }

      return htmlStr;
    };

    if (!isEmpty(this.APP_STATE.Layers?._failedLayerIds)) {
      let message;
      if (this.APP_SETTINGS.debug) {
        const { failedLayerIds } = globalThis.App.Layers.layersConfig;
        const failedLayers = this.APP_STATE.Layers.getLayerFolderStructure(this.APP_STATE.Config.sources.layers, failedLayerIds);
        const html = getFailedLayersHtml(failedLayers, failedLayerIds);
        message = `<div style="height: 400px; width: 430px; overflow: auto;"><div>The following layers from the data.json file failed to load and is being removed.</div>${html}</div>`;
        Ext.MessageBox.show({
          title: 'Status',
          msg: message,
          buttons: Ext.MessageBox.OK,
          autoScroll: true,
        });
        delete this.APP_STATE.Layers._failedLayerIds;
      } else {
        message =
          '<div style="height: 50px; width: 500px; overflow: auto;"><div>One or more layers failed to load. Toggle &quotDebug Mode&quot in settings.json for details</div>';
        Ext.MessageBox.show({
          title: 'Status',
          msg: message,
          buttons: Ext.MessageBox.OK,
          autoScroll: true,
        });
        delete this.APP_STATE.Layers._failedLayerIds;
      }
    }

    const serviceCheckResponse = this.APP_SETTINGS.serviceCheck;
    if (serviceCheckResponse?.upcoming.length) {
      const serviceDate = serviceCheckResponse.upcoming[0].utcTimestamp;

      // for some reason javascript likes date utc timestamps in milliseconds
      const jDate = new Date(serviceDate * 1000);

      const part1 = jDate.toLocaleDateString('default', {
        month: 'long',
        day: 'numeric',
      });
      const part2 = jDate.toLocaleDateString('default', {
        year: 'numeric',
      });
      const part3 = jDate.toLocaleTimeString('default', {
        hour: 'numeric',
        minute: 'numeric',
      });

      const formattedDate = `${part1}, ${part2} at ${part3}`;

      const formattedNotice = `This application will be offline temporarily for routine maintenance on ${formattedDate}`;
      Ext.MessageBox.show({
        title: 'Notice',
        msg: formattedNotice,
        buttons: Ext.MessageBox.OK,
        autoScroll: true,
      });
    }
  }

  /**
   * Create and populate a new HTML `div` element for an instance of `Ext.LoadMask`.
   */
  addLoadMask(): void {
    document.body.innerHTML += '<div id="initial-loading-mask"></div>';
    const loadingMask = document.getElementById('initial-loading-mask');
    loadingMask.innerHTML = `
          <div id="initial-loading-message">
            <div id="initial-loading-message-text" class="x-mask-msg-text custom-mask-loading"></div>
          </div>
        `;
  }

  /**
   * Remove the `div` element that contains the `Ext.LoadMask` instance.
   */
  removeLoadMask(): void {
    const loadingMask = document.getElementById('initial-loading-mask');
    loadingMask.parentElement.removeChild(loadingMask);
  }
}
