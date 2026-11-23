// Day One motion: highlighter sweep, section reveals, silent film preview.
(() => {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal, mark.sweep');
  if (still || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  }
  const preview = document.querySelector('.film-preview');
  if (preview && !still) { preview.play().catch(() => {}); }
})();
