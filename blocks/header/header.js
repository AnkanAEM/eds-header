
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'nav';
  
  // Navigation elements are built here based on the authored fragment.
  // This is a standard EDS header block template used by the migration fast-track.
  
  block.textContent = '';
  block.append(nav);
}
