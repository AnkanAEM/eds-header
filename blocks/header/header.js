import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const DESKTOP_BREAKPOINT = 900; // Define desktop breakpoint

function isDesktop() {
  return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches;
}

/**
 * Closes all open dropdowns in the given container.
 * @param {HTMLElement} container The container to search within.
 */
function closeAllDropdowns(container) {
  container.querySelectorAll('.has-dropdown.is-open')?.forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('a[aria-expanded]')?.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the visibility of a dropdown menu.
 * @param {HTMLElement} element The L0 menu item (<li>) that has the dropdown.
 * @param {boolean} [forceClose=false] If true, forces the dropdown to close.
 */
function toggleDropdown(element, forceClose = false) {
  if (!element?.classList.contains('has-dropdown')) return;

  const anchor = element.querySelector('a[role="button"]');
  if (!anchor) return;

  const isOpen = element.classList.contains('is-open');

  if (forceClose || isOpen) {
    element.classList.remove('is-open');
    anchor.setAttribute('aria-expanded', 'false');
  } else {
    if (isDesktop()) {
      closeAllDropdowns(element.parentElement); // Close other L0 dropdowns
    }
    element.classList.add('is-open');
    anchor.setAttribute('aria-expanded', 'true');
  }
}

export default async function decorate(block) {
  block.innerHTML = ''; // Clear existing content for idempotency

  const header = document.createElement('header');
  header.className = 'header';

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';

  const headerBrand = document.createElement('div');
  headerBrand.className = 'header-brand';

  const headerNav = document.createElement('nav');
  headerNav.className = 'header-nav';
  const headerNavList = document.createElement('ul');
  headerNavList.className = 'header-nav-list';
  headerNav.append(headerNavList);

  const headerTools = document.createElement('div');
  headerTools.className = 'header-tools';

  headerWrapper.append(headerBrand, headerNav, headerTools);
  header.append(headerWrapper);
  block.append(header);

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    console.warn('Navigation fragment not loaded. Skipping header decoration.');
    // Remove empty containers if fragment load fails
    headerBrand.remove();
    headerNav.remove();
    headerTools.remove();
    headerWrapper.remove();
    header.remove();
    return;
  }

  let navConfigData = [];
  try {
    const preElement = navContent.querySelector('pre');
    if (preElement) {
      navConfigData = JSON.parse(preElement.textContent);
      preElement.remove(); // Remove the JSON data block from navContent after parsing
    }
  } catch (e) {
    console.error('Error parsing navigation JSON:', e);
  }

  // --- Process Logo and Tools from remaining navContent children ---
  // Create a temporary container to safely iterate and remove children from navContent.
  // This helps ensure `navContent` only contains actual unused DOM for `moveInstrumentation`.
  const tempFragmentContainer = document.createElement('div');
  tempFragmentContainer.append(...Array.from(navContent.children));

  // --- Extract Logo ---
  const logoLink = tempFragmentContainer.querySelector('a img[alt*="logo" i], a img[src*="logo" i]');
  if (logoLink) {
    const logoAnchor = logoLink.closest('a');
    if (logoAnchor) {
      headerBrand.append(logoAnchor);
      logoAnchor.remove(); // Remove from temporary container
    }
  } else {
    headerBrand.remove();
  }

  // --- Extract Tools ---
  const rawToolElements = [];
  const toolSelectors = [
    '.header__search', // Parent of search icon
    '.header__notification--trigger',
    '.header__login',
    '.header__hamburger--button',
  ];

  toolSelectors.forEach(selector => {
    const tool = tempFragmentContainer.querySelector(selector);
    if (tool) {
      rawToolElements.push(tool);
      tool.remove(); // Remove from temporary container
    }
  });

  // After extracting key elements, append any remaining content back to original navContent
  // (though it should be mostly empty if everything was properly moved)
  navContent.innerHTML = '';
  navContent.append(...Array.from(tempFragmentContainer.children));


  // --- Populate Header Navigation (Mega Menu) from JSON data ---
  navConfigData.forEach(({ l1Label, l1Href, menuHtml }) => {
    const l0Item = document.createElement('li');
    l0Item.className = 'header-nav-item';
    const l0Anchor = document.createElement('a');
    l0Anchor.href = l1Href;
    l0Anchor.textContent = l1Label;
    l0Anchor.setAttribute('role', 'button');
    l0Anchor.setAttribute('aria-expanded', 'false');
    l0Item.append(l0Anchor);

    if (menuHtml) {
      l0Item.classList.add('has-dropdown');
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.className = 'header-dropdown-wrapper';
      dropdownWrapper.innerHTML = menuHtml; // Directly use provided HTML string

      // Add specific classes for styling to the rendered HTML structure
      dropdownWrapper.querySelectorAll('ul:first-child')?.forEach(ul => {
        ul.classList.add('header-dropdown-content');
      });
      dropdownWrapper.querySelectorAll('.header-dropdown-content > li > ul')?.forEach(nestedUl => {
        nestedUl.classList.add('header-sub-dropdown-content');
      });

      // Preserve price badges or new badges if they exist within the menuHtml
      // This ensures any JS on the original site for these is re-applied correctly
      dropdownWrapper.querySelectorAll('.price-badge, .navigation__badge').forEach(badge => {
        if (!badge.parentElement?.matches('a')) { // Ensure badge is within an anchor
          const anchor = badge.closest('a');
          if (anchor) {
            anchor.dataset.badgeAdded = 'true'; // Mark as processed to prevent duplicates by client scripts
          }
        }
      });

      l0Item.append(dropdownWrapper);
    }
    headerNavList.append(l0Item);
  });

  // --- Populate Header Tools ---
  if (rawToolElements.length > 0) {
    rawToolElements.forEach(tool => {
      if (tool.classList.contains('header__search')) {
        const searchButton = document.createElement('button');
        searchButton.className = 'header-tool-button header-search-button';
        searchButton.setAttribute('aria-label', 'Search');
        const searchSvg = tool.querySelector('.header__search--svg-find');
        if (searchSvg) searchButton.innerHTML = searchSvg.outerHTML;
        headerTools.append(searchButton);
      } else if (tool.classList.contains('header__notification--trigger')) {
        headerTools.append(tool); // Move as is
      } else if (tool.classList.contains('header__login')) {
        headerTools.append(tool); // Move as is
      } else if (tool.classList.contains('header__hamburger--button')) {
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.className = 'header-tool-button header-mobile-menu-toggle';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        const hamburgerSvg = tool.querySelector('.header__hamburger--open');
        const closeSvg = tool.querySelector('.header__hamburger--close');
        if (hamburgerSvg) mobileMenuToggle.append(hamburgerSvg);
        if (closeSvg) mobileMenuToggle.append(closeSvg);

        headerTools.append(mobileMenuToggle);

        mobileMenuToggle.addEventListener('click', () => {
          const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
          mobileMenuToggle.setAttribute('aria-expanded', !expanded);
          header.classList.toggle('mobile-menu-open', !expanded);
          document.body.classList.toggle('overflow-hidden', !expanded);
        });
      }
    });
  } else {
    headerTools.remove();
  }
  
  // --- Setup Event Listeners for Navigation ---
  // Desktop (hover) interaction for L0
  if (isDesktop()) {
    headerNavList.querySelectorAll('.header-nav-item.has-dropdown').forEach(l0Item => {
      let timeout;
      l0Item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        toggleDropdown(l0Item);
      });
      l0Item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          toggleDropdown(l0Item, true); // Force close on mouse leave
        }, 200);
      });
    });
  }

  // Mobile (click) interaction for L0
  headerNavList.querySelectorAll('.header-nav-item.has-dropdown > a').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      if (!isDesktop()) {
        event.preventDefault(); // Prevent direct navigation on mobile when opening dropdown
        const parentLi = anchor.closest('.has-dropdown');
        if (parentLi) {
          toggleDropdown(parentLi);
        }
      }
    });
  });

  // Handle outside clicks to close dropdowns
  document.addEventListener('click', (event) => {
    const openDropdowns = headerNavList.querySelectorAll('.has-dropdown.is-open');
    openDropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        toggleDropdown(dropdown, true);
      }
    });
  });

  // Handle escape key to close dropdowns
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openDropdowns = headerNavList.querySelectorAll('.has-dropdown.is-open');
      if (openDropdowns.length > 0) {
        toggleDropdown(openDropdowns[openDropdowns.length - 1], true);
      }
    }
  });

  // Handle window resize to reset dropdown states
  window.addEventListener('resize', () => {
    closeAllDropdowns(headerNavList);
    // Reset mobile menu state on resize to avoid stuck states
    header.classList.remove('mobile-menu-open');
    document.body.classList.remove('overflow-hidden');
    const mobileToggle = headerTools.querySelector('.header-mobile-menu-toggle');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  });

  moveInstrumentation(navContent, block);
}