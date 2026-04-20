import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const breakpoints = {
  desktop: 900,
};

function setupDropdowns(menuItem, isMobile = false) {
  const dropdownToggle = menuItem.querySelector('a');
  const subMenu = menuItem.querySelector('ul');

  if (!dropdownToggle || !subMenu) return;

  let isL0 = menuItem.classList.contains('cmp-navigation__item--level-0');

  // Add ARIA attributes
  dropdownToggle.setAttribute('aria-haspopup', 'true');
  dropdownToggle.setAttribute('aria-expanded', 'false');
  subMenu.setAttribute('aria-hidden', 'true');

  const closeDropdown = () => {
    menuItem.classList.remove('is-open');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    subMenu.setAttribute('aria-hidden', 'true');
  };

  const openDropdown = () => {
    // Close other L0 dropdowns if a new L0 is opened on desktop
    if (!isMobile && isL0) {
      menuItem.closest('.cmp-navigation')?.querySelectorAll('.cmp-navigation__item--level-0.is-open')
        .forEach((openL0) => {
          if (openL0 !== menuItem) {
            openL0.classList.remove('is-open');
            openL0.querySelector('a')?.setAttribute('aria-expanded', 'false');
            openL0.querySelector('ul')?.setAttribute('aria-hidden', 'true');
          }
        });
    }
    menuItem.classList.add('is-open');
    dropdownToggle.setAttribute('aria-expanded', 'true');
    subMenu.setAttribute('aria-hidden', 'false');
  };

  if (isMobile) {
    // Mobile: click to toggle dropdown
    dropdownToggle.addEventListener('click', (e) => {
      // Prevent default for anchor if it has a submenu
      if (subMenu) e.preventDefault();
      if (menuItem.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
  } else {
    // Desktop: hover to open, click to navigate (only if no sub-menu or a direct link)
    menuItem.addEventListener('mouseover', openDropdown);
    menuItem.addEventListener('mouseleave', closeDropdown);

    // Allow L0 parent to be clickable if it has a direct href and no submenu OR if it opens submenu
    // For example, if "Our Products" itself navigates, but also opens a submenu.
    // In the provided HTML, L0 items like "Our Products" have an href.
    dropdownToggle.addEventListener('click', (e) => {
      if (!subMenu && dropdownToggle.href) {
        // If no submenu, act as a regular link
        return;
      }
      // If it has a submenu, prevent default to allow hover-based opening
      // But if user clicks, and dropdown is already open, navigate.
      if (menuItem.classList.contains('is-open') && dropdownToggle.href) {
          // Already open, so navigate on click
          return;
      }
      e.preventDefault();
      openDropdown();
    });
  }

  // Recursively set up dropdowns for sub-levels
  subMenu.querySelectorAll('li').forEach((subMenuItem) => {
    if (subMenuItem.querySelector('ul')) {
      setupDropdowns(subMenuItem, isMobile);
    }
  });

  // Close dropdown on outside click
  if (isL0) {
    document.addEventListener('click', (e) => {
      if (!menuItem.contains(e.target)) {
        closeDropdown();
      }
    });
  }
}

function setupGlobalInteractions(block) {
  const headerWrapper = block.querySelector('.header-wrapper');
  const hamburger = headerWrapper?.querySelector('.cmp-header__hamburger');
  const headerNav = headerWrapper?.querySelector('.header-nav');
  const navList = headerNav?.querySelector('.cmp-navigation__group');

  if (!hamburger || !headerNav || !navList) return;

  // Hamburger / Mobile Menu toggle
  hamburger.addEventListener('change', () => {
    const isOpen = hamburger.checked;
    headerWrapper.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    headerNav.setAttribute('aria-expanded', isOpen);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (hamburger.checked) {
        hamburger.checked = false;
        headerWrapper.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        headerNav.setAttribute('aria-expanded', 'false');
      }
      // Close any open dropdowns
      headerWrapper.querySelectorAll('.cmp-navigation__item.is-open')
        .forEach((openItem) => {
          openItem.classList.remove('is-open');
          openItem.querySelector('a')?.setAttribute('aria-expanded', 'false');
          openItem.querySelector('ul')?.setAttribute('aria-hidden', 'true');
        });
    }
  });

  // Initial setup for navigation dropdowns
  const applyDropdownLogic = () => {
    const isMobile = window.innerWidth < breakpoints.desktop;
    navList.querySelectorAll('.cmp-navigation__item--level-0').forEach((l0Item) => {
      setupDropdowns(l0Item, isMobile);
    });
  };

  applyDropdownLogic();
  window.addEventListener('resize', applyDropdownLogic);

  // Search functionality toggle
  const searchIconLink = headerWrapper.querySelector('.cmp-header__search .cmp-header__icon-img');
  const searchComponent = headerWrapper.querySelector('.cmp-search');

  if (searchIconLink && searchComponent) {
    searchIconLink.addEventListener('click', (e) => {
      e.preventDefault();
      searchComponent.classList.toggle('is-open');
      searchIconLink.setAttribute('aria-expanded', searchComponent.classList.contains('is-open'));
      if (searchComponent.classList.contains('is-open')) {
        searchComponent.querySelector('input')?.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchComponent.contains(e.target) && !searchIconLink.contains(e.target)) {
        searchComponent.classList.remove('is-open');
        searchIconLink.setAttribute('aria-expanded', 'false');
      }
    });
  }

}

export default async function decorate(block) {
  block.textContent = '';

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    block.remove();
    return;
  }

  // Create header structure
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');

  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  block.append(headerWrapper);
  headerWrapper.append(headerBrand, headerNav, headerTools);

  // Extract and move elements from the loaded fragment
  const originalCmpHeader = navContent.querySelector('.cmp-header');
  const originalNavigation = originalCmpHeader?.querySelector('.cmp-navigation');
  const originalLogo = originalCmpHeader?.querySelector('.cmp-header__logo');
  const originalNavIcons = originalCmpHeader?.querySelector('.cmp-header__nav-icons');
  const originalHamburger = originalCmpHeader?.querySelector('.cmp-header__hamburger');
  const originalSearchComponent = navContent.querySelector('.cmp-search');

  if (originalLogo) {
    headerBrand.append(originalLogo);
  }

  // Move Hamburger checkbox to the main header-wrapper for better structural control
  if (originalHamburger) {
    headerWrapper.prepend(originalHamburger);
  }

  if (originalNavigation) {
    headerNav.append(originalNavigation);
    headerNav.setAttribute('aria-expanded', 'false'); // Initial state for mobile menu
  }

  // Move nav icons to header-tools
  if (originalNavIcons) {
    Array.from(originalNavIcons.children).forEach((child) => {
      headerTools.append(child);
    });
    originalNavIcons.remove(); // Remove the original container once children are moved
  }

  // Move search component to header-tools
  if (originalSearchComponent) {
    headerTools.append(originalSearchComponent);
  }

  // Add additional classes for styling if needed (based on AEM original CSS)
  block.classList.add('cmp-header');

  // Set up all interactive elements
  setupGlobalInteractions(block);

  moveInstrumentation(navContent, block);
}