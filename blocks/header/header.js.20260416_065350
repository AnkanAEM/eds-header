import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

// Placeholder for internal navigation decoration logic (if any)
function decorateNavInternal(nav) {
  // Implement any specific decoration needed for the navigation structure
  // e.g., adding event listeners, adjusting classes based on content, etc.
}

// Placeholder for navigation utility setup logic (if any)
function setupNavUtilities(nav) {
  // Implement any utilities for the navigation
  // e.g., mobile menu toggle, search functionality, etc.
}

export default async function decorate(block) {
  // Retrieve the nav path from metadata
  const navPath = getMetadata('nav');
  if (!navPath) {
    console.warn('Navigation path not found in metadata. Skipping nav decoration.');
    return;
  }

  // Load the navigation fragment
  const fragment = await loadFragment(navPath);
  if (!fragment) {
    console.warn('Navigation fragment could not be loaded. Skipping nav decoration.');
    return;
  }

  // Clear the existing block content
  block.textContent = '';

  // Create the <nav> element
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Append children from the fragment to the nav element
  const sections = fragment.querySelectorAll(':scope > div');
  sections.forEach((section) => nav.append(section));

  // Assign classes based on position
  if (sections.length > 0) {
    sections[0].classList.add('nav-brand'); // First child is the brand/logo
  }
  if (sections.length > 1) {
    sections[sections.length - 1].classList.add('nav-tools'); // Last child is for tools/icons
  }
  // All children between the first and last are nav-sections
  for (let i = 1; i < sections.length - 1; i++) {
    sections[i].classList.add('nav-sections');
  }

  // Append the fully decorated nav to the block
  block.append(nav);

  // Call hook functions for further decoration and utility setup
  decorateNavInternal(nav);
  setupNavUtilities(nav);
}

function decorateNavInternal(nav) {
  // Define media query for desktop vs. mobile interactions
  const isDesktop = window.matchMedia('(min-width: 992px)');

  // Helper function to reset all open menus
  const resetMenus = (contextElement = nav) => {
    contextElement.querySelectorAll('.has-child.active').forEach(li => {
      li.classList.remove('active');
      li.setAttribute('aria-expanded', 'false');
    });
    contextElement.querySelectorAll('.has-sub-child.active').forEach(div => {
      div.classList.remove('active');
      const parentLi = div.closest('li');
      if (parentLi) parentLi.setAttribute('aria-expanded', 'false');
    });
    contextElement.querySelectorAll('.has-inner-sub-child.active-child').forEach(div => {
      div.classList.remove('active-child');
      const parentLi = div.closest('li');
      if (parentLi) parentLi.setAttribute('aria-expanded', 'false');
    });
  };

  // Add event listener for media query changes to reset menu states
  isDesktop.addEventListener('change', (e) => {
    // Only reset if transitioning to mobile, or if we want consistent behavior
    // For simplicity, reset on any change to ensure correct interaction mode is active.
    resetMenus();
  });

  // Handle top-level navigation items
  const topLevelNavItems = nav.querySelectorAll('.main-nav > ul > li.has-child');
  topLevelNavItems.forEach(li => {
    const link = li.querySelector('a');
    const toggleArrow = li.querySelector('a > span'); // The SVG arrow for mobile toggle

    // Initialize aria-expanded state
    li.setAttribute('aria-expanded', 'false');

    if (isDesktop.matches) {
      // Desktop: Hover behavior
      li.addEventListener('mouseenter', () => {
        li.classList.add('active');
        li.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        li.classList.remove('active');
        li.setAttribute('aria-expanded', 'false');
      });
    } else {
      // Mobile: Click behavior for top-level menu
      if (toggleArrow) {
        toggleArrow.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const isActive = li.classList.contains('active');

          // Close all other open top-level menus and their sub-menus
          topLevelNavItems.forEach(otherLi => {
            if (otherLi !== li && otherLi.classList.contains('active')) {
              otherLi.classList.remove('active');
              otherLi.setAttribute('aria-expanded', 'false');
              // Also collapse any open nested menus within this inactive top-level item
              otherLi.querySelectorAll('.has-sub-child.active').forEach(subChild => {
                subChild.classList.remove('active');
                const parentOfSubChild = subChild.closest('li');
                if (parentOfSubChild) parentOfSubChild.setAttribute('aria-expanded', 'false');
              });
              otherLi.querySelectorAll('.has-inner-sub-child.active-child').forEach(innerSubChild => {
                innerSubChild.classList.remove('active-child');
                const parentOfInnerSubChild = innerSubChild.closest('li');
                if (parentOfInnerSubChild) parentOfInnerSubChild.setAttribute('aria-expanded', 'false');
              });
            }
          });

          // Toggle the clicked top-level menu
          li.classList.toggle('active');
          li.setAttribute('aria-expanded', (!isActive).toString());
        });
      }
    }

    // Handle nested sub-menus (always click-based within mega-menu structure)
    // Level 2: li.top-level-li with div.has-sub-child
    const subChildrenContainers = li.querySelectorAll('.mega-menu .sub-nav-wrap .top-level-li');
    subChildrenContainers.forEach(subLevelLi => {
      const subChildToggle = subLevelLi.querySelector('a > span');
      const subMenuDiv = subLevelLi.querySelector('.has-sub-child');

      if (subMenuDiv) subMenuDiv.setAttribute('aria-expanded', 'false'); // Initialize

      if (subChildToggle && subMenuDiv) {
        subChildToggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const isSubActive = subMenuDiv.classList.contains('active');

          // Close other active sub-child siblings at the same level
          subLevelLi.parentElement.querySelectorAll('.has-sub-child.active').forEach(otherSubMenuDiv => {
            if (otherSubMenuDiv !== subMenuDiv) {
              otherSubMenuDiv.classList.remove('active');
              const otherSubParentLi = otherSubMenuDiv.closest('li');
              if (otherSubParentLi) otherSubParentLi.setAttribute('aria-expanded', 'false');
              // Also close any innermost menus within these siblings
              otherSubMenuDiv.querySelectorAll('.has-inner-sub-child.active-child').forEach(innerSubChild => {
                innerSubChild.classList.remove('active-child');
                const parentOfInnerSubChild = innerSubChild.closest('li');
                if (parentOfInnerSubChild) parentOfInnerSubChild.setAttribute('aria-expanded', 'false');
              });
            }
          });

          // Toggle the clicked sub-menu
          subMenuDiv.classList.toggle('active');
          subMenuDiv.setAttribute('aria-expanded', (!isSubActive).toString());
        });
      }

      // Level 3: li.first-level-li with div.has-inner-sub-child
      const innerSubChildrenContainers = subLevelLi.querySelectorAll('.has-sub-child > ul > li.first-level-li');
      innerSubChildrenContainers.forEach(innerSubLevelLi => {
        const innerSubChildToggle = innerSubLevelLi.querySelector('a > span');
        const innerSubMenuDiv = innerSubLevelLi.querySelector('.has-inner-sub-child');

        if (innerSubMenuDiv) innerSubMenuDiv.setAttribute('aria-expanded', 'false'); // Initialize

        if (innerSubChildToggle && innerSubMenuDiv) {
          innerSubChildToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isInnerSubActive = innerSubMenuDiv.classList.contains('active-child');

            // Close other active inner-sub-child siblings at the same level
            innerSubLevelLi.parentElement.querySelectorAll('.has-inner-sub-child.active-child').forEach(otherInnerSubMenuDiv => {
              if (otherInnerSubMenuDiv !== innerSubMenuDiv) {
                otherInnerSubMenuDiv.classList.remove('active-child');
                const otherInnerSubParentLi = otherInnerSubMenuDiv.closest('li');
                if (otherInnerSubParentLi) otherInnerSubParentLi.setAttribute('aria-expanded', 'false');
              }
            });

            // Toggle the clicked innermost sub-menu
            innerSubMenuDiv.classList.toggle('active-child');
            innerSubMenuDiv.setAttribute('aria-expanded', (!isInnerSubActive).toString());
          });
        }
      });
    });
  });
}

function setupNavUtilities(nav) {
  // 'nav' is expected to be the <nav class="main-nav"> element,
  // which is a child of <header class="main-header">
  if (!nav) {
    console.error("setupNavUtilities: The 'nav' element is not provided.");
    return;
  }

  // Find the main header element to query global navigation components
  const mainHeader = document.querySelector('header.main-header');
  if (!mainHeader) {
    console.error("setupNavUtilities: Main header element not found.");
    return;
  }

  // Collect all search components (button, overlay, input)
  const searchComponents = [];
  mainHeader.querySelectorAll('.icon-nav .search').forEach(searchButton => {
    const searchScreenWrap = searchButton.querySelector('.search-screen-wrap');
    const searchInput = searchScreenWrap ? searchScreenWrap.querySelector('.searchtext') : null;

    if (searchScreenWrap && searchInput) {
      searchComponents.push({
        button: searchButton,
        wrap: searchScreenWrap,
        input: searchInput,
      });
    } else {
      console.warn("setupNavUtilities: Could not find search overlay or input for a search button.", searchButton);
    }
  });

  if (searchComponents.length === 0) {
    // No search functionality found, nothing to set up
    return;
  }

  const hamburgerButton = mainHeader.querySelector('.hamburger');
  const mainNav = nav; // The passed 'nav' parameter is the .main-nav itself

  // --- Helper functions for managing search overlay state ---
  const openSearch = (component) => {
    component.button.classList.add('active'); // Add active class to button (e.g., shows close icon)
    component.wrap.style.display = 'block';   // Make overlay visible
    component.wrap.style.opacity = '1';       // For CSS transitions
    component.wrap.style.visibility = 'visible'; // For CSS transitions
    component.input.focus();                  // Focus on the input field

    // If the mobile navigation is open, close it when search is opened
    if (mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      // Also close any open mega-menus within the main nav
      mainNav.querySelectorAll('.mega-menu.active').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  };

  const closeSearch = (component) => {
    component.button.classList.remove('active'); // Remove active class from button (e.g., shows lens icon)
    component.wrap.style.display = 'none';    // Hide overlay
    component.wrap.style.opacity = '0';        // For CSS transitions
    component.wrap.style.visibility = 'hidden'; // For CSS transitions
    component.input.value = '';                // Clear search input

    // Hide any visible search results or suggestions
    const searchResultBox = component.wrap.querySelector('.searchResultBox');
    if (searchResultBox) {
      searchResultBox.style.display = 'none';
    }
  };

  // --- Event Listeners ---

  // 1. Toggle search overlay when a search button is clicked
  searchComponents.forEach(component => {
    component.button.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      event.stopPropagation(); // Stop propagation from the button itself

      // Close all other open search overlays before opening a new one
      searchComponents.forEach(otherComponent => {
        if (otherComponent !== component && otherComponent.button.classList.contains('active')) {
          closeSearch(otherComponent);
        }
      });

      // Toggle the current search overlay
      if (component.button.classList.contains('active')) {
        closeSearch(component);
      } else {
        openSearch(component);
      }
    });

    // 2. Stop propagation for elements inside the search overlay
    // This prevents clicks within the overlay from triggering global document click listeners
    component.wrap.querySelectorAll('[data-once="search-stop-propagation"]').forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    });
  });

  // 3. Close any active search overlay if a click occurs outside of any search area
  document.addEventListener('click', (event) => {
    searchComponents.forEach(component => {
      const isClickInsideSearchArea = component.wrap.contains(event.target) || component.button.contains(event.target);
      if (component.button.classList.contains('active') && !isClickInsideSearchArea) {
        closeSearch(component);
      }
    });
  });

  // 4. Close any active search overlay if the hamburger menu button is clicked
  if (hamburgerButton) {
    hamburgerButton.addEventListener('click', () => {
      searchComponents.forEach(component => {
        if (component.button.classList.contains('active')) {
          closeSearch(component);
        