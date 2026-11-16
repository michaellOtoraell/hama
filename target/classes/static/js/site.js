/* Slow background: plays footage if /media/hero.mp4 exists, otherwise a drifting starfield */
const video = document.getElementById('bgVideo');
video.playbackRate = 0.6;
video.addEventListener('error', () => video.remove(), true);
video.querySelector('source').addEventListener('error', () => video.remove());

const cv = document.getElementById('sky'), ctx = cv.getContext('2d');
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
let W, H, stars = [], t = 0;
function size() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
  const n = Math.round(innerWidth * innerHeight / 9000);
  stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.3 + .3) * d, v: (Math.random() * .12 + .03) * d, a: Math.random() * .35 + .12 }));
}
function blob(x, y, r, c) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, c); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function frame() {
  t += .0016;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  blob(W * (.25 + .12 * Math.sin(t * 1.3)), H * (.35 + .1 * Math.cos(t)), W * .55, 'rgba(26,115,232,.16)');
  blob(W * (.78 + .1 * Math.cos(t * .9)), H * (.7 + .1 * Math.sin(t * 1.1)), W * .5, 'rgba(23,169,196,.10)');
  for (const s of stars) {
    s.x -= s.v; if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
    ctx.globalAlpha = s.a * (.7 + .3 * Math.sin(t * 20 + s.y));
    ctx.fillStyle = '#1a73e8'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (!still) requestAnimationFrame(frame);
}
size(); frame(); addEventListener('resize', () => { size(); if (still) frame(); });

/* quote form */
const $ = id => document.getElementById(id);
function toast(m) { const e = $('toast'); e.textContent = m; e.classList.add('on'); setTimeout(() => e.classList.remove('on'), 2600); }
function text() { return 'Hello HAMA Group, I am ' + ($('nm').value.trim() || 'a prospective customer') + '. I need: ' + $('sv').value + '. Details: ' + ($('dt').value.trim() || 'please contact me') + '.'; }
$('quote').onsubmit = e => { e.preventDefault(); window.open('https://wa.me/255715281111?text=' + encodeURIComponent(text()), '_blank', 'noopener'); };
$('viaMail').onclick = () => { location.href = 'mailto:info@hamageneralsupplies.co.tz?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(text()); };

/* conveyor belts: clone each track once so the loop is seamless */
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.querySelectorAll('.belt-track').forEach(track => {
    [...track.children].forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  });
}

/* mobile menu: close the panel, then scroll (Bootstrap blocks anchor clicks that carry data-bs-dismiss) */
const menuEl = $('menu');
document.querySelectorAll('.mlink').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const target = document.querySelector(a.getAttribute('href'));
  const go = () => target && target.scrollIntoView({ behavior: 'smooth' });
  if (window.bootstrap) {
    menuEl.addEventListener('hidden.bs.offcanvas', go, { once: true });
    bootstrap.Offcanvas.getOrCreateInstance(menuEl).hide();
  } else go();
}));
