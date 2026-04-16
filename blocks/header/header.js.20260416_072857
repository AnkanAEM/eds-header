import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Constants for CSS classes
const CLASS_NAV_WRAPPER = 'nav-wrapper';
const CLASS_NAV_BRAND = 'nav-brand';
const CLASS_NAV_SECTIONS = 'nav-sections';
const CLASS_NAV_TOOLS = 'nav-tools';
const CLASS_NAV_HAMBURGER = 'nav-hamburger';
const CLASS_NAV_HAMBURGER_BUTTON = 'nav-hamburger-button';
const CLASS_NAV_OVERLAY = 'nav-overlay';
const CLASS_NAV_EXPANDED = 'nav-expanded';
const CLASS_NAV_SECTION_MENU = 'nav-section-menu';
const CLASS_NAV_DROPDOWN = 'nav-dropdown';
const CLASS_NAV_DROPDOWN_OPEN = 'nav-dropdown-open';
const CLASS_NAV_CLOSE_BUTTON = 'nav-close-button';

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.querySelector(`.${CLASS_NAV_WRAPPER}`);
    const navSections = nav.querySelector(`.${CLASS_NAV_SECTIONS}`);
    if (navSections && navSections.classList.contains(CLASS_NAV_EXPANDED)) {
      toggleMenu(navSections);
    }
  }
}

function openMenu(navSections) {
  const navWrapper = navSections.closest(`.${CLASS_NAV_WRAPPER}`);
  navSections.classList.add(CLASS_NAV_EXPANDED);
  document.body.style.overflowY = 'hidden';
  navSections.setAttribute('aria-expanded', 'true');
  navWrapper.querySelector(`.${CLASS_NAV_HAMBURGER_BUTTON}`).setAttribute('aria-label', 'Close navigation');
  document.addEventListener('keydown', closeOnEscape);
}

function closeMenu(navSections) {
  const navWrapper = navSections.closest(`.${CLASS_NAV_WRAPPER}`);
  navSections.classList.remove(CLASS_NAV_EXPANDED);
  document.body.style.overflowY = '';
  navSections.setAttribute('aria-expanded', 'false');
  navWrapper.querySelector(`.${CLASS_NAV_HAMBURGER_BUTTON}`).setAttribute('aria-label', 'Open navigation');
  document.removeEventListener('keydown', closeOnEscape);

  // Close any open mobile dropdowns
  navSections.querySelectorAll(`.${CLASS_NAV_DROPDOWN_OPEN}`).forEach((li) => {
    li.classList.remove(CLASS_NAV_DROPDOWN_OPEN);
    li.querySelector(`.${CLASS_NAV_DROPDOWN}`)?.setAttribute('aria-hidden', 'true');
  });
}

function toggleMenu(navSections) {
  if (navSections.classList.contains(CLASS_NAV_EXPANDED)) {
    closeMenu(navSections);
  } else {
    openMenu(navSections);
  }
}

/**
 * Creates an optimized picture element for the logo.
 * This function adheres to common EDS optimization patterns.
 * @param {HTMLImageElement} img The image element to optimize.
 * @returns {HTMLPictureElement} The optimized picture element.
 */
function createOptimizedPicture(img) {
  if (!img) return null;

  const picture = document.createElement('picture');
  const src = img.getAttribute('src');
  const alt = img.getAttribute('alt');
  const title = img.getAttribute('title') || alt; // Prefer title, fallback to alt
  const loading = img.getAttribute('loading') || 'lazy';
  const width = img.getAttribute('width');
  const height = img.getAttribute('height');

  // Define breakpoints and widths for responsive images (example values)
  const breakpoints = [
    { media: '(min-width: 1200px)', width: 250 },
    { media: '(min-width: 900px)', width: 200 },
    { media: '(min-width: 600px)', width: 150 },
    { width: 100 } // Default for mobile
  ];

  breakpoints.forEach((bp) => {
    const source = document.createElement('source');
    if (bp.media) source.setAttribute('media', bp.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${src}?width=${bp.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // Fallback for non-webp browsers (original format, smaller size)
  const fallbackSource = document.createElement('source');
  fallbackSource.setAttribute('type', img.src.endsWith('.svg') ? 'image/svg+xml' : 'image/png'); // Preserve SVG if applicable
  fallbackSource.setAttribute('srcset', `${src}?width=100&format=png&optimize=medium`);
  picture.appendChild(fallbackSource);

  const imgEl = document.createElement('img');
  imgEl.setAttribute('src', `${src}?width=100&format=png&optimize=medium`); // Default small src
  imgEl.setAttribute('loading', loading);
  imgEl.setAttribute('alt', alt || '');
  if (title) imgEl.setAttribute('title', title);
  if (width) imgEl.setAttribute('width', width);
  if (height) imgEl.setAttribute('height', height);
  picture.appendChild(imgEl);

  return picture;
}

async function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'nav';
  const navWrapper = document.createElement('div');
  navWrapper.classList.add(CLASS_NAV_WRAPPER);
  nav.append(navWrapper);

  const navFragment = await loadFragment('/nav');
  if (navFragment) {
    // Dynamically classify sections based on content heuristics
    let brandEl = null;
    let sectionsEl = null;
    let toolsEl = null;

    Array.from(navFragment.children).forEach((child) => {
      // Brand section: first child div containing an image or picture
      if (!brandEl && (child.querySelector('picture') || child.querySelector('img')) && child.children.length === 1 && (child.children[0].tagName === 'A' || child.children[0].tagName === 'IMG' || child.children[0].tagName === 'PICTURE')) {
        brandEl = child;
      }
      // Sections (Main Navigation): first child div containing a ul
      else if (!sectionsEl && child.querySelector('ul')) {
        sectionsEl = child;
      }
      // Tools: remaining divs. Group all others into tools.
      else {
        if (!toolsEl) {
          toolsEl = document.createElement('div');
        }
        toolsEl.append(child.cloneNode(true)); // Append cloned content
      }
    });

    // Brand section processing
    if (brandEl) {
      const brandDiv = document.createElement('div');
      brandDiv.classList.add(CLASS_NAV_BRAND);
      let logoLink = brandEl.querySelector('a');
      let logoImg = brandEl.querySelector('img');

      if (!logoLink && logoImg) {
        // If img is direct child of brandEl and no link, create one
        logoLink = document.createElement('a');
        logoLink.href = '/';
        logoLink.append(logoImg);
      } else if (!logoLink && !logoImg) {
         // If no img or link, just append content directly
         brandDiv.append(brandEl.cloneNode(true));
      }

      if (logoLink) {
        const existingImg = logoLink.querySelector('img');
        if (existingImg) {
          const picture = createOptimizedPicture(existingImg);
          if (picture) {
            logoLink.replaceChild(picture, existingImg);
          }
        }
        brandDiv.appendChild(logoLink);
      } else if (logoImg) {
        const picture = createOptimizedPicture(logoImg);
        if (picture) {
            brandDiv.appendChild(picture); // Direct image without link
        } else {
            brandDiv.appendChild(logoImg);
        }
      }
      navWrapper.append(brandDiv);
    }

    // Sections (Main Navigation) processing
    if (sectionsEl) {
      const sectionsDiv = document.createElement('div');
      sectionsDiv.classList.add(CLASS_NAV_SECTIONS);
      sectionsDiv.setAttribute('aria-expanded', 'false');
      sectionsDiv.setAttribute('role', 'navigation');
      sectionsDiv.setAttribute('aria-label', 'Main navigation');

      sectionsEl.querySelectorAll('li').forEach((li) => {
        const ul = li.querySelector('ul');
        if (ul) {
          li.classList.add(CLASS_NAV_SECTION_MENU);
          ul.classList.add(CLASS_NAV_DROPDOWN);
          ul.setAttribute('aria-hidden', 'true');
          ul.setAttribute('role', 'menu');
          li.setAttribute('aria-haspopup', 'true');

          const anchor = li.querySelector('a');
          if (anchor) {
            anchor.setAttribute('role', 'menuitem');
            // Mobile dropdown toggle
            anchor.addEventListener('click', (e) => {
              const isDesktop = window.matchMedia('(min-width: 900px)').matches;
              if (!isDesktop) {
                e.preventDefault();
                li.classList.toggle(CLASS_NAV_DROPDOWN_OPEN);
                ul.setAttribute('aria-hidden', li.classList.contains(CLASS_NAV_DROPDOWN_OPEN) ? 'false' : 'true');
              }
            });
          }
        }
      });
      sectionsDiv.append(sectionsEl.cloneNode(true)); // Append processed content
      navWrapper.append(sectionsDiv);
    }

    // Tools section processing
    if (toolsEl) {
      const toolsDiv = document.createElement('div');
      toolsDiv.classList.add(CLASS_NAV_TOOLS);
      toolsDiv.append(toolsEl);
      navWrapper.append(toolsDiv);
    }

    // Hamburger icon for mobile navigation
    const hamburger = document.createElement('div');
    hamburger.classList.add(CLASS_NAV_HAMBURGER);
    const hamburgerButton = document.createElement('button');
    hamburgerButton.classList.add(CLASS_NAV_HAMBURGER_BUTTON);
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
    hamburgerButton.setAttribute('aria-controls', CLASS_NAV_SECTIONS);
    hamburgerButton.innerHTML = '&#9776;'; // Hamburger icon
    hamburgerButton.addEventListener('click', () => {
      const sections = navWrapper.querySelector(`.${CLASS_NAV_SECTIONS}`);
      if (sections) toggleMenu(sections);
    });
    hamburger.append(hamburgerButton);
    navWrapper.append(hamburger);

    // Close button for mobile menu
    const closeButton = document.createElement('button');
    closeButton.classList.add(CLASS_NAV_CLOSE_BUTTON);
    closeButton.innerHTML = '&times;'; // 'X' icon
    closeButton.setAttribute('aria-label', 'Close navigation');
    closeButton.addEventListener('click', () => {
      const sections = navWrapper.querySelector(`.${CLASS_NAV_SECTIONS}`);
      if (sections) closeMenu(sections);
    });
    navWrapper.querySelector(`.${CLASS_NAV_SECTIONS}`)?.prepend(closeButton);

    // Add overlay for mobile menu
    const navOverlay = document.createElement('div');
    navOverlay.classList.add(CLASS_NAV_OVERLAY);
    navOverlay.addEventListener('click', () => {
      const sections = navWrapper.querySelector(`.${CLASS_NAV_SECTIONS}`);
      if (sections) closeMenu(sections);
    });
    nav.append(navOverlay);

    // Move instrumentation classes from fragment root to the block
    moveInstrumentation(navFragment, block);

  } else {
    block.innerHTML = '<p>Navigation fragment not found. Please ensure a /nav fragment exists.</p>';
  }

  block.append(nav);
}

export default decorate;
