import './style.css';
import { createScene } from './scene/Scene';
import { setupScroll } from './animation/scroll';
import { setupNavigation } from './ui/navigation';
import { setupLoading } from './ui/loading';

const root = document.querySelector('#app');
if (!root) throw new Error('App root not found');

const scene = createScene(document.querySelector('#webgl') as HTMLElement);
setupScroll(scene);
setupNavigation();
setupLoading();
scene.start();
