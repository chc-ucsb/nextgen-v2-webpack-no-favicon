/* Matomo */
var _paq = _paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  const u = 'https://edcintl.cr.usgs.gov/piwik/';
  _paq.push(['setTrackerUrl', `${u}piwik.php`]);
  _paq.push(['setSiteId', '3']);
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
g.src = 'https://www.googletagmanager.com/gtag/js?id=UA-77810541-1';
s.parentNode.insertBefore(g, s);

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'UA-77810541-1');
