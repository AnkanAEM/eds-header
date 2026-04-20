import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const breakpoints = {
  mobile: '(max-width: 899px)',
  desktop: '(min-width: 900px)',
};

function setupDropdowns(parentEl, level = 0) {
  const dropdownItems = Array.from(parentEl.querySelectorAll(level === 0 ? '> li.has-dropdown' : '> li.has-dropdown, > li.top-level-li, > li.first-level-li'));

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector(':scope > a, :scope > span');
    const dropdownContent = item.querySelector(':scope > .header-dropdown-wrapper, :scope > ul.has-sub-child, :scope > ul.has-inner-sub-child');

    if (!toggle || !dropdownContent) {
      // If it's a simple link without a dropdown, ensure it remains clickable
      if (item.classList.contains('top-level-li') || item.classList.contains('first-level-li')) {
        const directLink = item.querySelector('a');
        if (directLink) {
          directLink.addEventListener('click', (e) => {
            // Allow default navigation for direct links
            // Close all dropdowns if in mobile view
            if (window.matchMedia(breakpoints.mobile).matches) {
              document.querySelector('.header')?.classList.remove('is-open');
              document.querySelector('.header-nav')?.classList.remove('is-open');
              document.body.classList.remove('no-scroll');
              document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
            }
          });
        }
      }
      return;
    }

    let closeTimer = null;
    let isMouseOverDropdown = false;

    const closeSiblingDropdowns = () => {
      Array.from(item.parentNode.children).forEach((sibling) => {
        if (sibling !== item && sibling.classList.contains('is-open')) {
          sibling.classList.remove('is-open');
          sibling.querySelector(':scope > .header-dropdown-wrapper, :scope > ul')?.removeAttribute('aria-expanded');
        }
      });
    };

    const closeDropdown = (force = false) => {
      if (window.matchMedia(breakpoints.desktop).matches && !force && isMouseOverDropdown) {
        // Don't close on desktop if mouse is still over the dropdown
        return;
      }
      clearTimeout(closeTimer);
      item.classList.remove('is-open');
      dropdownContent.removeAttribute('aria-expanded');
    };

    const openDropdown = () => {
      closeSiblingDropdowns();
      item.classList.add('is-open');
      dropdownContent.setAttribute('aria-expanded', 'true');
    };

    // Desktop (hover)
    if (window.matchMedia(breakpoints.desktop).matches) {
      item.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
        isMouseOverDropdown = true;
        openDropdown();
      });

      item.addEventListener('mouseleave', () => {
        isMouseOverDropdown = false;
        closeTimer = setTimeout(() => closeDropdown(), 100); // Small delay to allow moving to sub-menu
      });
    }

    // Mobile (click) and desktop click fallback
    toggle.addEventListener('click', (e) => {
      // Prevent default for anchor tags that are toggles
      if (e.target.tagName === 'A' && dropdownContent) {
        e.preventDefault();
      }
      e.stopPropagation();

      if (item.classList.contains('is-open')) {
        closeDropdown(true);
      } else {
        openDropdown();
      }
    });

    // Close on escape key
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        e.preventDefault();
        closeDropdown(true);
        toggle.focus();
      }
    });

    // Recursively set up dropdowns for nested levels
    const nestedUl = dropdownContent.querySelector(':scope > ul');
    if (nestedUl) {
      setupDropdowns(dropdownContent, level + 1);
    } else if (dropdownContent.classList.contains('header-dropdown-wrapper')) {
      dropdownContent.querySelectorAll('ul').forEach((subUl) => {
        // If the subUl's parent is an li, then the li is the dropdown item
        // Otherwise, the ul itself might be directly nested under mega-menu
        setupDropdowns(subUl.closest('li') || subUl, level + 1);
      });
    }

    // Close on outside click for the root menu, only on mobile
    if (level === 0 && window.matchMedia(breakpoints.mobile).matches) {
      document.addEventListener('click', (event) => {
        if (item.classList.contains('is-open') && !item.contains(event.target) && !toggle.contains(event.target)) {
          closeDropdown(true);
        }
      });
    }
  });
}

export default async function decorate(block) {
  // Clear existing content to ensure idempotency
  block.innerHTML = '';

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return;
  }

  const header = document.createElement('header');
  header.className = 'header';
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';
  const headerBrand = document.createElement('div');
  headerBrand.className = 'header-brand';
  const headerNav = document.createElement('nav');
  headerNav.className = 'header-nav';
  const headerTools = document.createElement('div');
  headerTools.className = 'header-tools';

  header.append(headerWrapper);
  headerWrapper.append(headerBrand, headerNav, headerTools);
  block.append(header);

  const originalMainHeader = navContent.querySelector('header.main-header');
  if (!originalMainHeader) {
    moveInstrumentation(navContent, block); // Still move instrumentation if content is minimal
    return;
  }

  // --- 1. Extract Brand/Logo ---
  const logoContainer = originalMainHeader.querySelector('.logo:not(.year-80-logo)');
  if (logoContainer) {
    headerBrand.append(logoContainer);
  }
  const year80LogoContainer = originalMainHeader.querySelector('.logo.year-80-logo');
  if (year80LogoContainer) {
    headerBrand.append(year80LogoContainer);
  }

  // --- 2. Extract Hamburger Menu (for mobile) ---
  const hamburger = originalMainHeader.querySelector('.hamburger');
  if (hamburger) {
    headerWrapper.prepend(hamburger); // Place hamburger before brand/nav/tools
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      header.classList.toggle('is-open');
      headerNav.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll');
      // Close all dropdowns when hamburger is toggled
      document.querySelectorAll('.header-nav .is-open').forEach(openItem => openItem.classList.remove('is-open'));
    });
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.setAttribute('aria-controls', 'main-navigation');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // --- 3. Extract Primary Navigation (Mega Menu) ---
  const mainNavUl = originalMainHeader.querySelector('nav.main-nav > ul');
  if (mainNavUl) {
    const newNavUl = document.createElement('ul');
    newNavUl.id = 'main-navigation';
    newNavUl.setAttribute('role', 'menubar');

    Array.from(mainNavUl.children).forEach((li) => {
      // Only process actual <li> items, skip icon-nav which might be inside main-nav ul in source
      if (li.tagName === 'LI') {
        const newLi = document.createElement('li');
        newLi.className = li.className; // Maintain original classes like 'has-child', 'hover-red'

        const anchor = li.querySelector(':scope > a');
        const arrowSvg = li.querySelector(':scope > span'); // Arrow SVG

        if (anchor) {
          newLi.append(anchor);
        }
        if (arrowSvg) {
          newLi.append(arrowSvg);
        }

        const megaMenu = li.querySelector('div.mega-menu');
        if (megaMenu) {
          megaMenu.classList.add('header-dropdown-wrapper');
          newLi.append(megaMenu);
        }
        newNavUl.append(newLi);
      }
    });
    headerNav.append(newNavUl);
  }

  // --- 4. Extract Tools ---
  const toolsUl = document.createElement('ul');
  toolsUl.className = 'tools-list';

  // Consolidate mobile and desktop tools to avoid duplicates and ensure all functionality is moved
  const allToolItems = new Map(); // Use a Map to store unique tools by their primary action/label

  // Extract from desktop icon-nav first (preferred)
  const desktopIconNav = originalMainHeader.querySelector('.icon-nav.desktop-menus-icon');
  if (desktopIconNav) {
    Array.from(desktopIconNav.querySelectorAll('li')).forEach(li => {
      if (li.classList.contains('mail')) {
        allToolItems.set('contact', li);
      } else if (li.classList.contains('search')) {
        allToolItems.set('search', li);
      }
    });
  }

  // Extract from mobile icon-nav (if not already captured by desktop or has unique items)
  const mobileIconNav = originalMainHeader.querySelector('.icon-nav.mobile-menus-icon');
  if (mobileIconNav) {
    Array.from(mobileIconNav.querySelectorAll('li')).forEach(li => {
      if (li.classList.contains('mail') && !allToolItems.has('contact')) {
        allToolItems.set('contact', li);
      } else if (li.classList.contains('search') && !allToolItems.has('search')) {
        allToolItems.set('search', li);
      }
    });
  }

  allToolItems.forEach(li => {
    // Ensure search functionality is correctly hooked up
    if (li.classList.contains('search')) {
      const searchLink = li.querySelector('a');
      const searchScreenWrap = li.querySelector('.search-screen-wrap');
      if (searchLink && searchScreenWrap) {
        searchLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent body click from closing it immediately
          li.classList.toggle('active');
          searchScreenWrap.classList.toggle('active');
          document.body.classList.toggle('no-scroll');
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
          if (!li.contains(e.target) && li.classList.contains('active')) {
            li.classList.remove('active');
            searchScreenWrap.classList.remove('active');
            document.body.classList.remove('no-scroll');
          }
        });
        // Close search on escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && li.classList.contains('active')) {
            li.classList.remove('active');
            searchScreenWrap.classList.remove('active');
            document.body.classList.remove('no-scroll');
            searchLink.focus();
          }
        });
      }
    }
    toolsUl.append(li);
  });

  if (toolsUl.children.length > 0) {
    headerTools.append(toolsUl);
  }

  // --- Finalize and add interaction logic ---
  setupDropdowns(headerNav.querySelector('ul'));

  // Handle sticky header scroll behavior
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop > lastScrollTop) {
      // Scrolling down
      header.classList.add('nav-up');
    } else {
      // Scrolling up
      header.classList.remove('nav-up');
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  });

  moveInstrumentation(navContent, block);
}