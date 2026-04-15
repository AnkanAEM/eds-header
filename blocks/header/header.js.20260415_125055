import {
  decorateButtons,
  decorateBlockHrs,
  // Add other necessary utility functions from aem.js if needed
} from '../../scripts/aem.js';
import { loadFragment } from '../../fragments/fragments.js'; // Assuming fragments.js provides loadFragment

/**
 * Decorates the header block with standard EDS navigation structure.
 *
 * This function is designed to take an existing HTML structure for a header
 * (typically wrapped in an AEM block div) and reorganize it into the
 * standardized EDS (Experience Delivery System) navigation components:
 * nav-wrapper, nav-brand, nav-sections, and nav-tools.
 *
 * @param {Element} block The block element containing the header structure.
 */
export default function decorate(block) {
  // Find the actual <header> element within the block.
  // The provided HTML shows an outer div (likely AEM's block wrapper)
  // which contains another div, which then contains the <header> element.
  // We'll extract the <header> and any sibling <style> tags (for mobile header styling).
  const headerContainer = block.firstElementChild; // The div directly inside the block
  let actualHeader;
  let styleTag;

  // Extract header and potential style tag from the redundant container
  if (headerContainer) {
    actualHeader = headerContainer.querySelector('header');
    styleTag = headerContainer.querySelector('style'); // Keep the dynamic styles if present
    
    // Lift the header and style tag directly into the block, removing the redundant div
    if (actualHeader) {
      block.append(actualHeader);
    }
    if (styleTag) {
      block.append(styleTag);
    }
    headerContainer.remove(); // Remove the now empty redundant container
  }

  // Ensure we have an actual <header> element to work with
  if (!actualHeader) {
    console.warn('Header element not found within the block.', block);
    return;
  }

  // Extract relevant elements from the existing header structure
  const headerContentWrap = actualHeader.querySelector('.container > .wrap');
  if (!headerContentWrap) {
    console.warn('Header content wrapper (.container > .wrap) not found.', actualHeader);
    return;
  }

  const logoElements = headerContentWrap.querySelectorAll('.logo');
  const hamburgerElement = headerContentWrap.querySelector('.hamburger');
  const mainNavigationElement = headerContentWrap.querySelector('.main-nav');

  // Clear the original header's content to rebuild it with the new structure
  actualHeader.innerHTML = '';

  // 1. Create the main nav-wrapper
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');

  // 2. Create nav-brand and populate with logos
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand');
  logoElements.forEach((logo) => navBrand.append(logo));

  // 3. Create nav-sections and populate with main navigation and hamburger
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');

  if (hamburgerElement) {
    navSections.append(hamburgerElement); // Hamburger button for mobile menu toggle
  }

  if (mainNavigationElement) {
    const mainUl = mainNavigationElement.querySelector('ul[itemscope]');
    if (mainUl) {
      navSections.append(mainUl); // The primary navigation links
    }
  }

  // 4. Create nav-tools and populate with utility icons (contact, search)
  // The original HTML places these inside the main-nav, so we extract them.
  const navTools = document.createElement('div');
  navTools.classList.add('nav-tools');

  // Extract mobile and desktop icon navigation, assuming they contain tool links
  // The structure has two .icon-nav elements inside main-nav: mobile-menus-icon and desktop-menus-icon
  // We'll move them to navTools, letting CSS handle their visibility.
  if (mainNavigationElement) {
    const mobileIcons = mainNavigationElement.querySelector('.icon-nav.mobile-menus-icon');
    const desktopIcons = mainNavigationElement.querySelector('.icon-nav.desktop-menus-icon');

    if (mobileIcons) {
      navTools.append(mobileIcons);
    }
    if (desktopIcons) {
      navTools.append(desktopIcons);
    }
  }


  // Append the new structural elements to the nav-wrapper
  navWrapper.append(navBrand, navSections, navTools);

  // Append the fully structured nav-wrapper back to the actual <header>
  actualHeader.append(navWrapper);

  // Re-append the style tag to the block if it was extracted,
  // or decide to move it to <head> in aem.js if it's generic page-level style.
  // For now, keeping it as a sibling of header in the block for simplicity.
  if (styleTag) {
    block.append(styleTag);
  }
}

// Part 2: Mega-Menu Behaviors
export default function decorate(block) {
  // Ensure we are working with the main header element
  const mainHeader = block.querySelector('.main-header');
  if (!mainHeader) return;

  const mainNav = mainHeader.querySelector('.main-nav');
  if (!mainNav) return;

  const hamburger = mainHeader.querySelector('.hamburger');
  const topLevelListItems = mainNav.querySelectorAll('ul > li.has-child');

  // Helper to remove active classes from all descendant menus of a given element
  function collapseAllSubmenus(parentEl) {
    parentEl.querySelectorAll('.mega-menu').forEach(menu => menu.classList.remove('active'));
    parentEl.querySelectorAll('.has-sub-child').forEach(menu => menu.classList.remove('active'));
    parentEl.querySelectorAll('.has-inner-sub-child').forEach(menu => menu.classList.remove('active-child')); // Specific class for inner sub-menu
    parentEl.querySelectorAll('li.has-child, li.top-level-li, li.first-level-li').forEach(li => {
      li.classList.remove('active', 'active-child'); // Remove active from list items for arrow rotation/state
    });
  }

  // Function to apply menu interaction logic based on screen size
  function applyMenuInteractions() {
    // Reset all menu states before applying new interactions


/**
 * Part 3: Mobile & Utilities (Menu and Search Functionality, Footer Toggles)
 *
 * This script provides the functionality for the mobile menu toggles,
 * search overlay interactions, and footer accordion-style link expansions.
 * It ensures a responsive and interactive user experience for navigation
 * and utility features.
 *
 * - Mobile menu toggle: Handles the hamburger icon click to open/close the main navigation
 *   and its nested sub-menus. It also manages body scrolling.
 * - Search functionality: Manages the search overlay, including opening, closing,
 *   focusing the input, and handling popular keyword clicks.
 * - Footer utilities: Implements accordion-like behavior for nested links in the footer
 *   on mobile viewports.
 * - Responsive adjustments: Includes a resize observer to reset UI states when
 *   switching between desktop and mobile views.
 */
function decorate(block) {
  // --- Mobile Menu Toggle Functionality ---
  function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger[data-once*="hamburger-click"]');
    const mainNav = document.querySelector('nav.main-nav');
    const body = document.body;

    if (hamburger && mainNav) {
      hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburger.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Prevents background scrolling when menu is open
      });
    }

    // Toggle logic for top-level sub-menus in the main navigation
    document.querySelectorAll('nav.main-nav > ul > li.has-child').forEach(li => {
      const toggleSpan = li.querySelector('span'); // The span containing the SVG arrow
      const megaMenu = li.querySelector('.mega-menu');

      if (toggleSpan && megaMenu) {
        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent immediate parent menu close if applicable
          li.classList.toggle('active');
          megaMenu.classList.toggle('active'); // Controls visibility via max-height/opacity
        });
      }
    });

    // Toggle logic for nested 'has-sub-child' (e.g., "What we do > Industries")
    document.querySelectorAll('nav.main-nav .has-sub-child').forEach(subChildWrap => {
      const toggleSpan = subChildWrap.querySelector('span'); // The span containing the SVG arrow
      if (toggleSpan) {
        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          subChildWrap.classList.toggle('active');
          // The CSS uses 'active' on .has-sub-child and 'active-child' on .has-inner-sub-child for different levels
        });
      }
    });

    // Toggle logic for deeply nested 'has-inner-sub-child' (e.g., "Automotive > SUVs")
    document.querySelectorAll('nav.main-nav .has-inner-sub-child').forEach(innerSubChildWrap => {
        const parentLi = innerSubChildWrap.closest('.first-level-li');
        const toggleSpan = parentLi.querySelector('span'); // The span containing the SVG arrow for the first-level-li

        if (toggleSpan) {
            toggleSpan.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                innerSubChildWrap.classList.toggle('active-child'); // This class seems to control visibility from CSS
                // Optionally, add 'active-child' to the parentLi for styling like arrow rotation
                parentLi.classList.toggle('active-child');
            });
        }
    });
  }

  // --- Search Functionality ---
  function setupSearch() {
    const searchIconLi = document.querySelector('.icon-nav .search[data-once*="search-toggle"]');
    const searchTriggerLink = searchIconLi ? searchIconLi.querySelector('a') : null;
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('search-block-form');
    const searchCloseButton = searchIconLi ? searchIconLi.querySelector('.close') : null; // The X icon

    if (searchTriggerLink && searchScreenWrap && searchInput && searchForm && searchCloseButton) {
      searchTriggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents click from propagating to parent elements
        searchIconLi.classList.toggle('active');
        searchScreenWrap.style.display = searchIconLi.classList.contains('active') ? 'block' : 'none'; // Direct style toggle
        document.body.classList.toggle('no-scroll', searchIconLi.classList.contains('active'));

        if (searchIconLi.classList.contains('active')) {
          searchInput.focus();
        } else {
          searchInput.value = ''; // Clear input on close
        }
      });

      // Explicit close button handler
      searchCloseButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          searchIconLi.classList.remove('active');
          searchScreenWrap.style.display = 'none';
          searchInput.value = ''; // Clear input
          document.body.classList.remove('no-scroll');
      });

      // Handle clicking on popular keywords/recommended items
      document.querySelectorAll('.tokens-wrap ul li').forEach(keywordLi => {
        keywordLi.addEventListener('click', (e) => {
          const keyword = e.target.textContent.trim();
          if (searchInput) {
            searchInput.value = keyword;
            searchForm.submit(); // Submit the form programmatically
          }
        });
      });

      // Stop propagation for the search overlay itself to prevent accidental closing from background clicks
      searchScreenWrap.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Close search if clicking outside the search overlay but within the search trigger area
      // (This behavior is more complex and might need a global click listener,
      // but for "stop-propagation" we'll ensure internal clicks are handled.)
    }
  }

  // --- Footer Utilities (Accordion-style links for mobile) ---
  function setupFooterUtilities() {
    // Top-level footer menu items (e.g., "Who we are", "What we do")
    document.querySelectorAll('.footer-main .link-blocks .head small[data-once="footerMobileInner"]').forEach(smallToggle => {
      const parentHead = smallToggle.closest('.head');
      if (parentHead) {
        smallToggle.addEventListener('click', () => {
          parentHead.classList.toggle('active'); // Toggles visibility of .footer-inner-list
        });
      }
    });

    // Nested footer links with 'has-footer-sub-child' (e.g., "Industries")
    document.querySelectorAll('.footer-main .link-blocks .footer-inner-list > li > span[data-once*="footerClickEvent"]').forEach(toggleSpan => {
      const parentLi = toggleSpan.closest('li');
      const subChildDiv = parentLi.querySelector('.has-footer-sub-child');
      if (subChildDiv) {
        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          subChildDiv.classList.toggle('active');
        });
      }
    });

    // Deeply nested footer links with 'has-footer-inner-sub-child' (e.g., "Automotive")
    document.querySelectorAll('.footer-main .has-footer-sub-child > ul > li > span[data-once*="innerFooterClickEvent"]').forEach(toggleSpan => {
      const parentLi = toggleSpan.closest('li');
      const innerSubChildDiv = parentLi.querySelector('.has-footer-inner-sub-child');
      if (innerSubChildDiv) {
        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          innerSubChildDiv.classList.toggle('active-inner-child'); // Based on CSS
        });
      }
    });
  }

  // --- Responsive UI Reset on Resize ---
  function setupResponsiveReset() {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 991; // Based on common breakpoint in CSS

      // Only reset if transitioning from mobile to desktop or vice-versa
      // (This simple check might be enough; more robust solution could track previous state)
      if (!isMobileView) {
        // Reset Mobile Menu State
        const mainNav = document.querySelector('nav.main-nav');
        const hamburger = document.querySelector('.hamburger');
        if (mainNav) mainNav.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');

        // Reset Main Nav Submenu States (desktop mode: all open/hover-based)
        document.querySelectorAll('nav.main-nav ul li.has-child.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('nav.main-nav .mega-menu.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('nav.main-nav .has-sub-child.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('nav.main-nav .has-inner-sub-child.active-child').forEach(el => el.classList.remove('active-child'));


        // Reset Search Overlay State
        const searchIconLi = document.querySelector('.icon-nav .search');
        const searchScreenWrap = document.querySelector('.search-screen-wrap');
        const searchInput = document.getElementById('searchInput');
        if (searchIconLi) searchIconLi.classList.remove('active');
        if (searchScreenWrap) searchScreenWrap.style.display = 'none';
        if (searchInput) searchInput.value = '';

        // Reset Footer Accordion States
        document.querySelectorAll('.footer-main .link-blocks .head.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.footer-main .has-footer-sub-child.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.footer-main .has-footer-inner-sub-child.active-inner-child').forEach(el => el.classList.remove('active-inner-child'));

        // Ensure body scroll is re-enabled
        document.body.classList.remove('no-scroll');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set correct state on page load
  }


  // Initialize all mobile and utility functionalities
  setupMobileMenu();
  setupSearch();
  setupFooterUtilities();
  setupResponsiveReset();
}

// Assuming this script runs within a block decoration context.
// If it's a global script, it might be called on document ready or similar.
// For the purpose of this request, we wrap it in a function named `decorate`.

// Example of how it might be called (not part of the deliverable):
// document.addEventListener('DOMContentLoaded', () => {
//   decorate(document);
// });