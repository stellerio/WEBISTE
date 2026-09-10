export function setupNavigation() {
  document.querySelectorAll<HTMLElement>('[data-scroll]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); document.querySelector(el.dataset.scroll || '')?.scrollIntoView({ behavior: 'smooth' }); }));
}
