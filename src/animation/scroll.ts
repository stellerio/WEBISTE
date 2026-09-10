import type { SceneController } from '../scene/Scene';

export function setupScroll(scene: SceneController) {
  const update = () => { const max = document.documentElement.scrollHeight - innerHeight; const p = max > 0 ? scrollY / max : 0; scene.setScroll(p); document.documentElement.style.setProperty('--scroll', String(p)); };
  addEventListener('scroll', update, { passive: true }); update();
}
