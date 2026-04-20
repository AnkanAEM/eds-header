import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Toggles the expanded state and 'is-open' class for a navigation item.
 * @param {HTMLElement} li The list item to toggle.
 * @param {boolean|null} expand If true/false, explicitly sets the state. If null, toggles the current state.
 */
function toggleMenu(li, expand = null) {
  const isExpanded = expand !== null ? expand : li.getAttribute('aria-expanded') === 'false';
  li.setAttribute('aria-expanded', isExpanded);
  li.classList.toggle('is-open', isExpanded);
}

/**
 * Closes all currently open navigation submenus within a given container.
 * @param {HTMLElement} container The root element to search for open menus.
 */
function closeAllMenus(container) {
  container.querySelectorAll('li[aria-expanded="true"]').forEach((li) => {
    toggleMenu(li, false);
  });
}

/**
 * Closes the search overlay.
 * @param {HTMLElement} headerBlock The main header block element.
 * @param {HTMLElement} searchTrigger The search icon/button that opens the search.
 * @param {HTMLElement} searchComponent The actual search form/overlay component.
 */
function closeSearch(headerBlock, searchTrigger, searchComponent) {
  if (headerBlock.classList.contains('search-open')) {
    headerBlock.classList.remove('search-open');
    searchTrigger?.setAttribute('aria-expanded', 'false');
    const searchInput = searchComponent?.querySelector('.cmp-search__input');
    if (searchInput) searchInput.value = ''; // Clear search input on close
  }
}

/**
 * Closes the mobile navigation menu.
 * @param {HTMLElement} headerBlock The main header block element.
 * @param {HTMLElement} hamburgerButton The hamburger button element.
 */
function closeMobileNav(headerBlock, hamburgerButton) {
  if (headerBlock.classList.contains('nav-open')) {
    hamburgerButton.setAttribute('aria-expanded', 'false');
    headerBlock.classList.remove('nav-open');
    document.body.classList.remove('no-scroll');
    closeAllMenus(headerBlock); // Ensure all submenus are closed inside mobile nav
  }
}

export default async function decorate(blockElement) {
  // Create the final <header> element, this will replace the original blockElement
  const headerBlock = document.createElement('header');
  headerBlock.classList.add('header');

  const resp = await loadFragment('/nav');
  if (!resp?.innerHTML) {
    blockElement.remove(); // Remove the original block placeholder if fragment fails to load
    return;
  }

  const navContent = document.createRange().createContextualFragment(resp.innerHTML);

  // Find the main header component and the separate search component within the fragment
  const originalHeaderComponent = navContent.querySelector('.cmp-header[data-component="header"]');
  const searchComponent = navContent.querySelector('.cmp-search');

  if (!originalHeaderComponent) {
    blockElement.remove();
    return;
  }

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');
  headerBlock.append(headerWrapper);

  // --- Hamburger Button (EDS Custom) ---
  // The original site uses an input checkbox. Replacing with a button for better accessibility.
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('nav-hamburger');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  // Using original CSS icon classes for visual fidelity if they exist via pseudo-elements
  hamburgerButton.innerHTML = `
    <span class="icon-hamburger-menu"></span>
    <span class="icon-close-menu"></span>
  `;
  headerWrapper.append(hamburgerButton);

  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !isExpanded);
    headerBlock.classList.toggle('nav-open', !isExpanded);
    document.body.classList.toggle('no-scroll', !isExpanded);
    if (isExpanded) { // If closing mobile nav
      closeAllMenus(headerBlock);
      closeSearch(headerBlock, searchTrigger, searchComponent); // Also close search if open
    }
  });

  // --- Brand / Logo (Original .cmp-header__logo) ---
  const logoWrapper = originalHeaderComponent.querySelector('.cmp-header__logo');
  if (logoWrapper) {
    // Ensure the link is absolute or relative to root
    const logoLink = logoWrapper.querySelector('a');
    if (logoLink && !logoLink.href.startsWith('http')) {
        logoLink.href = new URL(logoLink.href, window.location.origin).pathname; // Normalize href
    }
    logoWrapper.classList.add('header-brand'); // Add EDS class to assist styling if needed
    headerWrapper.append(logoWrapper);
  }

  // --- Navigation (Original .cmp-header__nav-links) ---
  const navLinksWrapper = originalHeaderComponent.querySelector('.cmp-header__nav-links');
  if (navLinksWrapper) {
    navLinksWrapper.classList.add('header-nav'); // Add EDS class to assist styling if needed
    headerWrapper.append(navLinksWrapper);

    navLinksWrapper.querySelectorAll('.cmp-navigation__item').forEach((li) => {
      const anchor = li.querySelector('a');
      const hasSubmenu = li.innesrHTML.includes('<ul'); // Check if it has a submenu (L1 or L2)

      if (hasSubmenu) {
        li.setAttribute('aria-expanded', 'false'); // Initial state

        // Mobile/Tablet click behavior: toggle submenu
        anchor?.addEventListener('click', (e) => {
          // Only toggle on mobile nav open, or if it's a submenu (L1/L2) on desktop
          const isMobileView = headerBlock.classList.contains('nav-open');
          if (isMobileView || li.closest('.cmp-navigation__group.cmp-header__product-items') || li.closest('.cmp-navigation__group.cmp-header__submenu')) {
            e.preventDefault(); // Prevent navigating when opening/closing submenu
            toggleMenu(li);
          }
        });

        // Desktop hover behavior: only for non-mobile views
        li.addEventListener('mouseenter', () => {
          if (!headerBlock.classList.contains('nav-open')) {
            closeAllMenus(navLinksWrapper); // Close any previously open submenus at the same level
            toggleMenu(li, true);
          }
        });
        li.addEventListener('mouseleave', () => {
          if (!headerBlock.classList.contains('nav-open')) {
            toggleMenu(li, false);
          }
        });
      }
    });
  }

  // --- Utility Tools (Original .cmp-header__nav-icons) ---
  const navIconsWrapper = originalHeaderComponent.querySelector('.cmp-header__nav-icons');
  let searchTrigger; // Declare outside for wider scope
  if (navIconsWrapper) {
    navIconsWrapper.classList.add('header-tools'); // Add EDS class to assist styling if needed
    headerWrapper.append(navIconsWrapper);

    searchTrigger = navIconsWrapper.querySelector('.cmp-header__search a');
    if (searchTrigger && searchComponent) {
      // Initialize aria-expanded for search trigger
      searchTrigger.setAttribute('aria-expanded', 'false');

      // Add the search component to the headerBlock (it will be styled as an overlay by CSS)
      searchComponent.classList.add('header-search-overlay'); // Add a class for styling
      headerBlock.append(searchComponent);

      searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isSearchOpen = headerBlock.classList.contains('search-open');
        closeMobileNav(headerBlock, hamburgerButton); // Close mobile nav if open
        closeAllMenus(navLinksWrapper); // Close any open submenus
        
        headerBlock.classList.toggle('search-open', !isSearchOpen);
        searchTrigger.setAttribute('aria-expanded', !isSearchOpen);
        if (!isSearchOpen) {
          searchComponent.querySelector('.cmp-search__input')?.focus();
        } else {
          const searchInput = searchComponent.querySelector('.cmp-search__input');
          if (searchInput) searchInput.value = ''; // Clear input on close
        }
      });

      const searchClearButton = searchComponent.querySelector('.cmp-search__clear');
      searchClearButton?.addEventListener('click', (e) => {
        // Assuming clicking the clear button should also close the overlay for better UX
        e.preventDefault(); // Prevent default form submission or other clear button behavior
        closeSearch(headerBlock, searchTrigger, searchComponent);
      });
    }
  }

  // --- Close menus on Escape key ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav(headerBlock, hamburgerButton);
      closeSearch(headerBlock, searchTrigger, searchComponent);
      closeAllMenus(navLinksWrapper);
    }
  });

  // --- Close menus on outside click ---
  document.addEventListener('click', (e) => {
    if (!headerBlock.contains(e.target)) {
      closeMobileNav(headerBlock, hamburgerButton);
      closeSearch(headerBlock, searchTrigger, searchComponent);
      closeAllMenus(navLinksWrapper);
    }
  });

  // Replace the original block element with the newly constructed header
  blockElement.replaceWith(headerBlock);

  // Move instrumentation from the loaded fragment to the new header block as requested.
  // This typically copies data attributes and other block-level metadata.
  moveInstrumentation(navContent, headerBlock);
}