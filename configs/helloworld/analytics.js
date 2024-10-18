/* Matomo */
var _paq = _paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  const u = '//piwik.cr.usgs.gov/';
  _paq.push(['setTrackerUrl', `${u}piwik.php`]);
  _paq.push(['setSiteId', '4']);
  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = `${u}piwik.js`;
  s.parentNode.insertBefore(g, s);
})();
/* End Matomo Code */

/* GOOGLE ANALYTICS */
const d = document;
const g = d.createElement('script');
const s = d.getElementsByTagName('script')[0];
g.type = 'text/javascript';
g.async = true;
g.defer = true;
g.src = 'https://www.googletagmanager.com/gtag/js?id=UA-102809644-1';
s.parentNode.insertBefore(g, s);

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'UA-102809644-1');
