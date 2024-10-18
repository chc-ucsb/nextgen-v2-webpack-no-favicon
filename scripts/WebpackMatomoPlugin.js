const CODE = `
  <script type="text/javascript">
    var _paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="{{BASE_URL}}";
      _paq.push(['setTrackerUrl', u+'piwik.php']);
      _paq.push(['setSiteId', '{{ID}}']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
  </script>
`;

class WebpackMatomoPlugin {
  constructor({ baseUrl, id }) {
    // Taken from the JavaScript Tracking Code under Matomo Settings > Measurables > Tracking Code
    this.baseUrl = baseUrl;

    // The Matomo site ID
    this.id = id;
  }

  doReplace() {
    return CODE.replace(/\{\{BASE_URL\}\}/g, this.baseUrl).replace(/\{\{ID\}\}/g, this.id);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('matomo', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('matomo', ({ html }) => ({
        html: html.replace('</head>', `${this.doReplace()}</head>`),
      }));
    });
  }
}

module.exports = WebpackMatomoPlugin;
