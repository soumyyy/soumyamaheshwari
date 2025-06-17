document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const header = document.querySelector('.header');

  const handleScroll = () => {
    // Update scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    // Show/hide header
    if (header) {
      if (window.scrollY > 50) {
        header.classList.remove('visible');
        header.classList.add('hidden');
      } else {
        header.classList.add('visible');
        header.classList.remove('hidden');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
});
