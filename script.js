document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections  = Array.from(document.querySelectorAll('main section[id]'));

  /* ---------- Header berubah warna saat discroll ---------- */
  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Menu mobile (burger) ---------- */
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  /* ---------- Highlight menu aktif sesuai section terlihat ---------- */
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Animasi reveal saat elemen masuk viewport ---------- */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

});
