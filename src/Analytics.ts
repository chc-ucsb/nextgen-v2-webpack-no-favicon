/**
 * Create a Matomo analytics object.
 * @param {string | number} id
 */
export const createMatomo = (id: string | number): void => {
  const _paq = globalThis._paq || [];
  // Tracker methods like "setCustomDimension" should be called before "trackPageView"
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  ((): void => {
    // TODO: make this base url configurable
    const url = 'https://edcintl.cr.usgs.gov/piwik/';
    _paq.push(['setTrackerUrl', `${url}piwik.php`]);
    _paq.push(['setSiteId', id]);
    const g = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = `${url}piwik.js`;
    s.parentNode?.insertBefore(g, s);
  })();
};

/**
 * Create a Google Analytics object.
 * @param {string} id
 */
export const createGoogleAnalytics = (id: string): void => {
  const url = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  const g = document.createElement('script');
  const s = document.getElementsByTagName('script')[0];
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = url;
  s.parentNode?.insertBefore(g, s);

  globalThis.dataLayer = globalThis.dataLayer || [];
  globalThis.gtag = (...args: Array<string | Date>): void => globalThis.dataLayer.push(args);
  globalThis.gtag('js', new Date());
  globalThis.gtag('config', id);
};

/**
 * Initialize the analytics libraries that are defined in the config.
 * @param {{matomo?: string | number; google?: string}} config
 */
export const init = (config: { matomo?: string | number; google?: string }): void => {
  if (config.matomo) createMatomo(config.matomo);
  if (config.google) createGoogleAnalytics(config.google);
};

/**
 * When called, an activity is reported to matomo and google analytics if they're in the global scope.
 * @param {string} file
 * @param {string} eventCategory
 * @param {string} eventAction
 */
export const reportActivity = (file: string, eventCategory: string, eventAction: string): void => {
  // This function is called from within the cDownloadBtn tool
  if (typeof globalThis.gtag === 'function') {
    // GOOGLE
    globalThis.gtag('event', eventAction, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      event_category: eventCategory,
      // eslint-disable-next-line @typescript-eslint/camelcase
      event_label: file,
    });
  }

  if (typeof globalThis._paq === 'object') {
    // PIWIK
    globalThis._paq.push(['trackEvent', eventCategory, eventAction, file]);
  }
};
