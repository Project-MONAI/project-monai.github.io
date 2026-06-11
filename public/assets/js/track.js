/**
 * Lightweight GA4 event helper.
 * Usage: add data-track="event_name" plus optional data-track-* params to any
 * clickable element, e.g.
 *   <a data-track="cta_click" data-track-cta-id="hero_get_started" ...>
 * data-track-cta-id -> GA4 param cta_id. No-ops if gtag is absent/blocked.
 * window.track(name, params) is exposed for imperative callers.
 */
(function () {
  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params || {});
  }

  window.track = send;

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
    if (!el) return;
    var params = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name.indexOf('data-track-') === 0) {
        params[attr.name.slice(11).replace(/-/g, '_')] = attr.value;
      }
    }
    send(el.getAttribute('data-track'), params);
  }, { capture: true });
})();
