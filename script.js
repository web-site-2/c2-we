/* ═══════════════════════════════════════
   WEDDING INVITATION — script.js
═══════════════════════════════════════ */

// ── WELCOME OVERLAY ──────────────────
function enterSite() {
  const overlay = document.getElementById('welcome-overlay');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  // Auto-start music prompt after enter
}
document.body.style.overflow = 'hidden';

// ── PARTICLES CANVAS ─────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.5 - 0.2;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.radius = Math.random() * 2 + 0.5;
      this.color = Math.random() > 0.5 ? '#c8a96e' : '#ffffff';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.001;
      if (this.y < 0 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── COUNTDOWN TIMER ──────────────────
(function initCountdown() {
  const target = new Date('2025-08-24T16:00:00').getTime();

  function update() {
    const now  = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent  = String(d).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(m).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(s).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
})();

// ── MUSIC PLAYER ─────────────────────
let musicPlaying = false;
function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const icon  = document.getElementById('music-icon');
  const label = document.getElementById('music-label');
  if (musicPlaying) {
    audio.pause();
    icon.className  = 'fas fa-music';
    label.textContent = '♪ Our Song';
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    icon.className  = 'fas fa-pause';
    label.textContent = 'Now Playing…';
    musicPlaying = true;
  }
}

// ── SCROLL REVEAL ────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
})();

// ── FAQ ACCORDION ────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ── RSVP FORM ────────────────────────
function submitRsvp() {
  const name  = document.getElementById('rsvp-name').value.trim();
  const email = document.getElementById('rsvp-email').value.trim();

  if (!name) { alert('Please enter your full name.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.'); return;
  }

  // Simulate submission
  document.getElementById('rsvp-form-box').style.display = 'none';
  document.getElementById('rsvp-success').style.display  = 'block';
}

// ── ADD TO CALENDAR ──────────────────
function addToCalendar() {
  const event = {
    title: 'Sofia & James Wedding',
    start: '20250824T160000',
    end:   '20250825T010000',
    details: 'Wedding ceremony & reception',
    location: 'Chapel of Santa Margherita, Florence, Italy'
  };
  const url = `https://www.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent(event.title)}`
    + `&dates=${event.start}/${event.end}`
    + `&details=${encodeURIComponent(event.details)}`
    + `&location=${encodeURIComponent(event.location)}`;
  window.open(url, '_blank');
}

// ── SHARE INVITATION ─────────────────
async function shareInvite() {
  const shareData = {
    title: 'Sofia & James Wedding Invitation',
    text: 'You are invited to the wedding of Sofia & James on August 24, 2025 in Florence, Italy!',
    url:  window.location.href
  };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch(e) {}
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Copy this link: ' + window.location.href));
  }
}

// ── PARALLAX HERO ────────────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg img');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.25}px)`;
  }
});
