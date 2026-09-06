* =========================================================
   GALAXY PORTFOLIO — SCRIPT.JS
   ========================================================= */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- 1. LOADING SCREEN ---------- */
  const loader = document.getElementById('loader');
  let loaderHidden = false;
 
  function hideLoader() {
    if (loaderHidden || !loader) return;
    loaderHidden = true;
    loader.classList.add('hidden');
  }
 
  // Jalur normal: sembunyikan setelah semua resource (font, AOS, dll) selesai dimuat
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 900);
  });
 
  // Jaring pengaman: kalau event 'load' lambat/gagal (koneksi CDN lambat,
  // resource diblokir, dll), loader TETAP hilang maksimal 3.5 detik
  // supaya pengunjung tidak terjebak layar loading selamanya.
  setTimeout(hideLoader, 3500);
 
  /* ---------- 2. INIT AOS (scroll reveal) ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
 
  /* ---------- 3. STARFIELD CANVAS (bintang bergerak perlahan) ---------- */
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
 
  function createStars() {
    const count = Math.min(160, Math.floor((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.3,
    }));
  }
 
  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 231, 255, ${star.opacity * (0.5 + twinkle * 0.5)})`;
      ctx.fill();
 
      // gerak perlahan ke bawah, lalu wrap ke atas
      if (!prefersReducedMotion) {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }
    }
    requestAnimationFrame(drawStars);
  }
 
  resizeCanvas();
  createStars();
  drawStars();
 
  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });
 
  /* ---------- 4. PARALLAX RINGAN PADA NEBULA SAAT SCROLL ---------- */
  const nebulas = document.querySelectorAll('.nebula');
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nebulas.forEach((nebula, i) => {
        const speed = 0.04 + i * 0.02;
        nebula.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }
 
  /* ---------- 5. CURSOR GLOW INTERAKTIF (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }
 
  /* ---------- 6. TYPING EFFECT PADA HERO ROLE ---------- */
  const typedEl = document.getElementById('typedText');
  const phrases = ['Web Developer', 'UI/UX Enthusiast', 'Pelajar SIJA', 'Digital Creator'];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
 
  function typeLoop() {
    const current = phrases[phraseIndex];
 
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 45 : 90);
  }
  typeLoop();
 
  /* ---------- 7. NAVBAR: efek glassmorphism saat scroll ---------- */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
 
  /* ---------- 8. HAMBURGER MENU (mobile) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
 
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
 
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
 
  /* ---------- 9. ACTIVE MENU SESUAI SECTION (scroll spy) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
 
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
 
  sections.forEach(section => spyObserver.observe(section));
 
  /* ---------- 10. SKILL BAR ANIMATION SAAT DI-SCROLL ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.width + '%';
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
 
  skillFills.forEach(fill => skillObserver.observe(fill));
 
  /* ---------- 11. FORM KONTAK -> KIRIM KE WHATSAPP ---------- */
  // Ganti nomor di bawah ini jika suatu saat nomor WhatsApp berubah.
  const WHATSAPP_NUMBER = '6283199192390';
 
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
 
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
 
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();
 
    // Susun pesan yang akan otomatis terisi di kolom chat WhatsApp
    const waText =
      `Halo Kevin, saya ${name}.\n` +
      `Email: ${email}\n\n` +
      `Pesan:\n${message}`;
 
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
 
    formNote.textContent = 'Membuka WhatsApp...';
    formNote.classList.add('success');
 
    // Buka WhatsApp di tab baru, lalu bersihkan form
    window.open(waUrl, '_blank', 'noopener');
    contactForm.reset();
 
    setTimeout(() => {
      formNote.textContent = '';
      formNote.classList.remove('success');
    }, 4000);
  });
 
});
 
