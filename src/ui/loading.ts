export function setupLoading() {
  const loader = document.querySelector<HTMLElement>('#loading');
  if (!loader) return;
  requestAnimationFrame(() => setTimeout(() => loader.classList.add('done'), 900));
}
