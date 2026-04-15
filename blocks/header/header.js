import { createOptimizedPicture } from '../../scripts/aem.js';
import { getFragment } from '../../scripts/fragment.js'; // Included as per request, but not directly used in this decoration logic.

export default async function decorate(block) {
  // Find the main header element within the block
  const header = block.querySelector('.main-header');
  if (!header) {
    console.warn('Header element not found in the block.');
    return;
  }

  // --- Hamburger menu toggle for mobile navigation ---
  const hamburger = header.querySelector('.hamburger');
  const mainNav = header.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      hamburger.classList.toggle('active');
      // Ensure search screen is closed if open when opening navigation
      const searchScreenWrap = header.querySelector('.search-screen-wrap');
      const searchIconParent = header.querySelector('.icon-nav .search');
      if (searchScreenWrap && searchScreenWrap.classList.contains('active')) {
        searchScreenWrap.classList.remove('active');
        if (searchIconParent) searchIconParent.classList.remove('active');
      }
    });
  }

  // --- Search overlay toggle ---
  const searchIconParent = header.querySelector('.icon-nav .search');
  const searchScreenWrap = header.