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
  // Work tiles: silent film loops play only while their tile is on screen.
  const saveData = navigator.connection && navigator.connection.saveData;
  const films = document.querySelectorAll('.tile-film video');
  if (!still && !saveData && films.length && 'IntersectionObserver' in window) {
    const tick = (video, fill) => {
      if (video.paused) return;
      if (video.duration) fill.style.transform = `scaleX(${video.currentTime / video.duration})`;
      requestAnimationFrame(() => tick(video, fill));
    };
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const video = e.target;
        if (e.isIntersecting) {
          if (!video.src) video.src = video.dataset.src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.4 });
    films.forEach((video) => {
      const box = video.parentElement;
      const fill = box.nextElementSibling && box.nextElementSibling.querySelector('i');
      video.addEventListener('playing', () => {
        box.classList.add('is-playing');
        if (fill) tick(video, fill);
      });
      fio.observe(video);
    });
  }

  const preview = document.querySelector('.film-preview');
  if (preview && !still) { preview.play().catch(() => {}); }
})();
