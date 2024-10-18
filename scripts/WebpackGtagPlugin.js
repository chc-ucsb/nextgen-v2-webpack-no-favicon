const getBaseUrl = (url) => {
  return url.slice(0, url.includes('?') ? url.indexOf('?') : undefined);
};

const objToUrlQueryParams = (obj) => {
  return (
    Object.entries(obj)
      // Turn each key-value pair into `key=value`
      .map(([key, val]) => `${key}=${String(val)}`)
      .join('&')
  );
};

const buildUrl = (baseUrl, parameters) => {
  let cleanedUrlBase = getBaseUrl(baseUrl);
  if (!cleanedUrlBase.endsWith('?')) cleanedUrlBase += '?';

  return `${cleanedUrlBase}${objToUrlQueryParams(parameters)}`;
};

const CODE = `
    <script async src="{{URL}}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '{{ID}}');
    </script>
`;

class WebpackGtagPlugin {
  constructor({ baseUrl, id }) {
    // The Google Analytics ID.
    this.id = id;

    // The URL for the GTag library.
    this.url = buildUrl(getBaseUrl(baseUrl || 'https://www.googletagmanager.com/gtag/js?id='), { id });
  }

  doReplace() {
    return CODE.replace(/\{\{URL\}\}/g, this.url).replace(/\{\{ID\}\}/g, this.id);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('gtag', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('gtag', ({ html }) => ({
        html: html.replace('</head>', `${this.doReplace()}</head>`),
      }));
    });
  }
}

module.exports = WebpackGtagPlugin;
