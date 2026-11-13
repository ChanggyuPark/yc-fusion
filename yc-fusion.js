/* YC Fusion Sixshop integration · 20261113-01
 * Route lock: /fusion AND #page2767366.
 * Loads the embedded-image HTML chunks verbatim and preserves Sixshop header/footer.
 */
(() => {
  'use strict';
  const CFG = {
    pathname: '/fusion',
    pageId: 'page2767366',
    rootId: 'yc-fusion-app',
    routeClass: 'yc-fusion-route-active',
    count: 14,
    utmKey: 'yc_fusion_utm_v1',
    utmKeys: ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']
  };
  if (window.__ycFusionSixshopV1) return;
  window.__ycFusionSixshopV1 = true;

  const d = document;
  const scriptUrl = d.currentScript && d.currentScript.src ?
    d.currentScript.src : 'https://changgyupark.github.io/yc-fusion/yc-fusion.js';
  let generation = 0;
  let loading = false;
  let mountedPage = null;
  let observer = null;
  let lastSearch = '';
  let utm = {};

  function isTarget() {
    return location.pathname.replace(/\/$/, '').toLowerCase() === CFG.pathname &&
      !!d.getElementById(CFG.pageId);
  }
  function collectUtm() {
    const incoming = new URLSearchParams(location.search);
    const result = {};
    let any = false;
    CFG.utmKeys.forEach(k => {
      if (incoming.has(k)) {
        any = true;
        const val = incoming.get(k) || '';
        if (val) result[k] = val;
      }
    });
    try {
      if (any) {
        utm = result;
        sessionStorage.setItem(CFG.utmKey, JSON.stringify(result));
      } else {
        const stored = JSON.parse(sessionStorage.getItem(CFG.utmKey) || '{}');
        utm = stored && typeof stored === 'object' ? stored : {};
      }
    } catch (_) { utm = any ? result : {}; }
  }
  function setFormTracking(root) {
    root.querySelectorAll('a[href]').forEach(a => {
      const raw = a.getAttribute('href');
      if (!raw) return;
      if (/^https?:\/\//i.test(raw)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      let u;
      try { u = new URL(raw, location.href); } catch (_) { return; }
      if (u.hostname !== 'forms.monday.com') return;
      if (!a.dataset.originalFormHref) a.dataset.originalFormHref = raw;
      try { u = new URL(a.dataset.originalFormHref, location.href); } catch (_) { return; }
      CFG.utmKeys.forEach(k => { if (utm[k]) u.searchParams.set(k, utm[k]); });
      a.href = u.toString();
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }
  function animate(root) {
    if (!('IntersectionObserver' in window) ||
        (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('enter');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.13});
    root.querySelectorAll('.section .title, .card, .rolegrid article, .gallery article, .social a, .extension-grid article, .why-support article, .workcell').forEach(el => observer.observe(el));
  }
  function cleanup() {
    generation++;
    if (observer) { observer.disconnect(); observer = null; }
    const root = d.getElementById(CFG.rootId);
    if (root) root.remove();
    d.body?.classList.remove(CFG.routeClass);
    mountedPage = null;
  }
  async function mount() {
    if (loading || !isTarget()) return;
    loading = true;
    const ticket = ++generation;
    try {
      const urls = Array.from({length: CFG.count}, (_, i) =>
        new URL('assets/fusion-part-' + String(i).padStart(2, '0') + '.txt?v=20261113-01', scriptUrl).href
      );
      const parts = await Promise.all(urls.map(async url => {
        const res = await fetch(url);
        if (!res.ok) throw new Error('YC Fusion asset HTTP ' + res.status + ': ' + url);
        return res.text();
      }));
      if (ticket !== generation || !isTarget()) return;
      const page = d.getElementById(CFG.pageId);
      if (!page || !page.parentElement) return;
      const root = d.createElement('div');
      root.id = CFG.rootId;
      root.innerHTML = parts.join('');
      page.insertAdjacentElement('afterend', root);
      mountedPage = page;
      collectUtm();
      setFormTracking(root);
      animate(root);
      d.body.classList.add(CFG.routeClass);
      lastSearch = location.search;
    } catch (error) {
      console.error('[YC Fusion] Landing failed to load:', error);
      d.body?.classList.remove(CFG.routeClass);
    } finally {
      loading = false;
    }
  }
  function sync() {
    const root = d.getElementById(CFG.rootId);
    if (!isTarget()) {
      if (root || mountedPage) cleanup();
      return;
    }
    const page = d.getElementById(CFG.pageId);
    if (!root || !root.isConnected || mountedPage !== page) {
      if (root || mountedPage) cleanup();
      mount();
    } else if (lastSearch !== location.search) {
      collectUtm();
      setFormTracking(root);
      lastSearch = location.search;
    }
  }
  function handleClick(ev) {
    const a = ev.target.closest?.('a[href]');
    const root = d.getElementById(CFG.rootId);
    if (!a || !root || !root.contains(a)) return;
    const href = a.getAttribute('href') || '';
    if (href.includes('forms.monday.com')) {
      collectUtm();
      setFormTracking(root);
    }
  }
  function boot() {
    d.addEventListener('click', handleClick, true);
    sync();
    window.setInterval(sync, 400);
    window.addEventListener('popstate', sync);
    window.addEventListener('pageshow', sync);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();