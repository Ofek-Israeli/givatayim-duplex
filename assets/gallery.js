(function () {
  'use strict';

  /* ---------- lightbox ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var index = 0;

  function preload(i) {
    if (i < 0 || i >= tiles.length) return;
    new Image().src = tiles[i].dataset.full;
  }

  function show(i) {
    index = (i + tiles.length) % tiles.length;
    var tile = tiles[index];
    lbImg.src = tile.dataset.full;
    lbImg.alt = tile.dataset.caption || '';
    lbCap.textContent = tile.dataset.caption || '';
    lbCount.textContent = (index + 1) + ' / ' + tiles.length;
    preload(index + 1);
    preload(index - 1);
  }

  function open(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  tiles.forEach(function (tile, i) {
    tile.addEventListener('click', function () { open(i); });
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { show(index - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(index + 1); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb__fig')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    // RTL: left arrow advances, right arrow goes back
    else if (e.key === 'ArrowLeft') show(index + 1);
    else if (e.key === 'ArrowRight') show(index - 1);
  });

  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    touchX = null;
  }, { passive: true });

  /* ---------- sticky topbar ---------- */
  var topbar = document.getElementById('topbar');
  var hero = document.querySelector('.hero');
  if (topbar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { rootMargin: '-70% 0px 0px 0px' }).observe(hero);
  }

  /* ---------- scroll reveal ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: never leave a section stuck invisible.
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* ---------- youtube embed ---------- */
  // Loads the iframe only once the visitor asks for it, so the page stays fast.
  var wrap = document.getElementById('video-embed');
  if (wrap) {
    var id = wrap.dataset.youtube;
    if (id && id.indexOf('__') !== 0) {
      wrap.innerHTML =
        '<div class="video__frame">' +
        '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1" ' +
        'title="סרטון סיור בדירה" loading="lazy" allowfullscreen ' +
        'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>' +
        '</div>';
    }
  }
})();
