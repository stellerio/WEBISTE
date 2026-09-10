export type SceneController = { start: () => void; setScroll: (progress: number) => void };

export function createScene(mount: HTMLElement): SceneController {
  const canvas = document.createElement('canvas');
  canvas.className = 'scene-canvas';
  mount.replaceChildren(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  let progress = 0;
  let raf = 0;
  let width = 0;
  let height = 0;

  const resize = () => { width = canvas.width = innerWidth * devicePixelRatio; height = canvas.height = innerHeight * devicePixelRatio; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; };
  addEventListener('resize', resize); resize();

  const draw = (time: number) => {
    const t = time * 0.00025;
    ctx.clearRect(0, 0, width, height);
    const cx = width * (.5 + Math.sin(progress * Math.PI) * .08);
    const cy = height * (.47 - progress * .06);
    const scale = Math.min(width, height) * (.15 + progress * .08);
    for (let i = 0; i < 34; i++) {
      const a = i * 2.399 + t * (i % 3 ? .35 : -.2) + progress * 2.5;
      const r = scale * (.45 + ((i * 37) % 100) / 140);
      const x = cx + Math.cos(a) * r * 1.7;
      const y = cy + Math.sin(a * 1.13) * r * .42;
      const s = scale * (.28 + ((i * 17) % 90) / 180);
      const g = ctx.createRadialGradient(x, y, 0, x, y, s);
      g.addColorStop(0, 'rgba(245,251,255,.52)');
      g.addColorStop(.45, 'rgba(170,218,242,.18)');
      g.addColorStop(1, 'rgba(100,170,210,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  return { start: () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }, setScroll: (v) => { progress = Math.max(0, Math.min(1, v)); } };
}
