import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_ICON_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,16.7z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

/**
 * Parses the fragment to identify the main structural rows.
 * Assumes the fragment has a consistent structure for brand, navigation, and tools.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {Object} An object containing the identified brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify brand row by presence of logo image
  brandRow = sections.find((s) => s.querySelector('.logo > a > img'));

  // Identify tools row by presence of icon-nav
  toolsRow = sections.find((s) => s.querySelector('.icon-nav'));

  // Nav row is the remaining one with a UL that is not part of toolsRow
  navRow = sections.find((s) => s.querySelector('ul') && s !== brandRow && s !== toolsRow);

  return { brandRow, navRow, toolsRow };
}

/**
 * Creates the hamburger menu button.
 * @param {Element} nav The main navigation element.
 * @param {Element} navSections The container for navigation sections.
 * @returns {Element} The created hamburger button.
 */
function createHamburger(nav, navSections) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  return hamburger;
}

/**
 * Manages accessibility features for the navigation, including keyboard navigation and ARIA attributes.
 * @param {Element} nav The main navigation element.
 * @param {Element} navSections The container for navigation sections.
 * @returns {Function} The toggleMenu function for external use.
 */
function setupAccessibility(nav, navSections) {
  if (!nav || !navSections) return;

  /**
   * Toggles all nav sections (top-level dropdowns)
   * @param {Element} sections The container element (navSections)
   * @param {boolean} expanded Whether the element should be expanded or collapsed
   */
  const toggleAllNavSections = (sections, expanded = false) => {
    sections.querySelectorAll('.main-nav > ul > li.has-child').forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) {
        megaMenu.setAttribute('aria-hidden', !expanded);
      }
    });
  };

  /**
   * Toggles the entire nav (mobile menu)
   * @param {Element} navEl The main navigation element
   * @param {Element} navSectionsEl The nav sections within the container element
   * @param {boolean | null} forceExpanded Optional param to force nav expand behavior when not null
   */
  const toggleMenu = (navEl, navSectionsEl, forceExpanded = null) => {
    const expanded = forceExpanded !== null ? forceExpanded : navEl.getAttribute('aria-expanded') === 'true';
    const hamburgerBtn = navEl.querySelector('.hamburger');

    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    navEl.setAttribute('aria-expanded', !expanded);
    // Toggle all top-level nav sections based on main nav expansion
    toggleAllNavSections(navSectionsEl, !expanded && isDesktop.matches); // Only expand on desktop if main nav is open

    // Update hamburger button's ARIA label if it were a button
    // The original HTML uses a div, so no aria-label is needed on the div itself.

    if (navSectionsEl) {
      const navDrops = navSectionsEl.querySelectorAll('.main-nav > ul > li.has-child');
      if (isDesktop.matches) {
        navDrops.forEach((drop) => {
          if (!drop.hasAttribute('tabindex')) {
            drop.setAttribute('tabindex', 0);
            // Add focus listener for desktop dropdowns
            drop.addEventListener('focus', () => {
              // Close other dropdowns when a new one is focused
              toggleAllNavSections(navSectionsEl, false);
              drop.setAttribute('aria-expanded', 'true');
              drop.querySelector('.mega-menu').setAttribute('aria-hidden', 'false');
            });
          }
        });
      } else { // Mobile
        navDrops.forEach((drop) => {
          drop.removeAttribute('tabindex');
          // Remove desktop focus listeners if any
          drop.removeEventListener('focus', () => {}); // Need to remove specific listener
          drop.setAttribute('aria-expanded', 'false');
          drop.querySelector('.megaMenu')?.setAttribute('aria-hidden', 'true');
        });
      }
    }

    if (!expanded || isDesktop.matches) {
      window.addEventListener('keydown', closeOnEscape);
      navEl.addEventListener('focusout', closeOnFocusLost);
    } else {
      window.removeEventListener('keydown', closeOnEscape);
      navEl.removeEventListener('focusout', closeOnFocusLost);
    }
  };

  const closeOnEscape = (e) => {
    if (e.code === 'Escape') {
      const navSectionExpanded = navSections.querySelector('.main-nav > ul > li.has-child[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        toggleAllNavSections(navSections, false);
        navSectionExpanded.focus();
      } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, navSections, false); // Collapse mobile menu
        nav.querySelector('.hamburger').focus();
      }
    }
  };

  const closeOnFocusLost = (e) => {
    if (!nav.contains(e.relatedTarget)) {
      const navSectionExpanded = navSections.querySelector('.main-nav > ul > li.has-child[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        toggleAllNavSections(navSections, false);
      } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, navSections, false);
      }
    }
  };

  // Initial setup for top-level nav sections
  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    navSection.setAttribute('aria-haspopup', 'true');
    navSection.setAttribute('aria-expanded', 'false');
    navSection.querySelector('.mega-menu')?.setAttribute('aria-hidden', 'true');

    navSection.addEventListener('click', (e) => {
      if (isDesktop.matches) {
        e.preventDefault(); // Prevent default link behavior for top-level items
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections, false); // Close others
        navSection.setAttribute('aria-expanded', !expanded);
        navSection.querySelector('.mega-menu')?.setAttribute('aria-hidden', expanded);
      }
    });

    // Mobile sub-menu toggles
    navSection.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach(subChildWrapper => {
      const parentLi = subChildWrapper.closest('li');
      const toggleSpan = parentLi.querySelector('span:has(svg)');
      if (toggleSpan) {
        parentLi.setAttribute('aria-haspopup', 'true');
        parentLi.setAttribute('aria-expanded', 'false');
        subChildWrapper.setAttribute('aria-hidden', 'true');

        toggleSpan.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.stopPropagation();
            const expanded = parentLi.getAttribute('aria-expanded') === 'true';
            parentLi.setAttribute('aria-expanded', !expanded);
            subChildWrapper.setAttribute('aria-hidden', expanded);
            subChildWrapper.classList.toggle('active', !expanded);
            if (parentLi.classList.contains('top-level-li')) { // For first level sub-child
              subChildWrapper.classList.toggle('active-child', !expanded);
            }
            toggleSpan.querySelector('svg').style.transform = !expanded ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        });
      }
    });
  });

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  return toggleMenu;
}

/**
 * Recursively processes UL elements to create nested menu structures.
 * This function is primarily for mobile menu behavior, adding toggles and ARIA attributes.
 * @param {Element} ulElement The UL element to process.
 * @returns {Element} The processed UL element.
 */
function createRecursiveMenu(ulElement) {
  Array.from(ulElement.children).forEach((li) => {
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      li.classList.add('has-child'); // Add has-child for any LI with a nested UL
      const link = li.querySelector('a');
      if (link) {
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute('aria-haspopup', 'true');
      } else {
        // If it's a text node acting as a parent, wrap it in a span for accessibility
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
        if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          li.replaceChild(span, textNode);
          span.setAttribute('aria-expanded', 'false');
          span.setAttribute('aria-haspopup', 'true');
        }
      }

      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      li.append(span);

      const subChildWrapper = document.createElement('div');
      subChildWrapper.classList.add('has-sub-child'); // Generic class for nested ULs
      subChildWrapper.append(nestedUl); // Append the original nested UL
      subChildWrapper.setAttribute('aria-hidden', 'true');
      li.append(subChildWrapper);

      // Add click listener for mobile to toggle sub-menus
      li.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.stopPropagation();
          const expanded = li.getAttribute('aria-expanded') === 'true';
          li.setAttribute('aria-expanded', !expanded);
          subChildWrapper.setAttribute('aria-hidden', expanded);
          subChildWrapper.classList.toggle('active', !expanded);
          span.querySelector('svg').style.transform = !expanded ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      });
      createRecursiveMenu(nestedUl); // Recurse for deeper levels
    }
  });
  return ulElement;
}

/**
 * Sets up the desktop navigation by enhancing the existing DOM from the fragment.
 * It assumes the fragment already contains the basic mega-menu structure.
 * @param {Element} navRow The navigation row element from the fragment.
 * @returns {Element | null} The processed main UL element or null if navRow is missing.
 */
function setupDesktopNav(navRow) {
  if (!navRow) return null;

  const mainUl = navRow.querySelector('ul');
  if (!mainUl) return null;

  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  Array.from(mainUl.children).forEach((li) => {
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const link = li.querySelector('a');
    if (link) {
      link.setAttribute('itemprop', 'url');
    }

    // Add chevron SVG if not already present
    if (!li.querySelector('span > svg')) {
      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      li.append(span);
    }

    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      // Ensure mega-menu has wrap and container if not already present
      let wrapContainer = megaMenu.querySelector('.wrap.container');
      if (!wrapContainer) {
        wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        wrapContainer.append(...Array.from(megaMenu.children)); // Move existing children
        megaMenu.append(wrapContainer);
      }

      let centerDiv = wrapContainer.querySelector('.center-div');
      if (!centerDiv) {
        centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        centerDiv.append(...Array.from(wrapContainer.children)); // Move existing children
        wrapContainer.append(centerDiv);
      }

      // Process nested ULs within sub-nav-wrap for mobile toggles
      const subNavWrap = centerDiv.querySelector('.sub-nav-wrap');
      if (subNavWrap) {
        Array.from(subNavWrap.children).forEach(child => {
          if (child.tagName === 'UL') {
            createRecursiveMenu(child);
          } else if (child.classList.contains('inner-sub-nav-wrap-list')) {
            Array.from(child.children).forEach(innerUl => {
              if (innerUl.tagName === 'UL') {
                createRecursiveMenu(innerUl);
              }
            });
          }
        });
      }
    }
  });

  return mainUl;
}

/**
 * Sets up the tools section, including contact and search functionality.
 * It assumes the toolsRow from the fragment already contains the basic structure.
 * @param {Element} toolsRow The tools row element from the fragment.
 * @returns {Element | null} The processed tools container or null if toolsRow is missing.
 */
async function setupTools(toolsRow) {
  if (!toolsRow) return null;

  const toolsContainer = document.createElement('div');
  toolsContainer.classList.add('nav-tools'); // Add nav-tools class

  const desktopIconNav = toolsRow.querySelector('.icon-nav.desktop-menus-icon');
  const mobileIconNav = toolsRow.querySelector('.icon-nav.mobile-menus-icon');

  if (desktopIconNav) toolsContainer.append(desktopIconNav);
  if (mobileIconNav) toolsContainer.append(mobileIconNav);

  // Process mail links
  toolsContainer.querySelectorAll('li.mail > a').forEach(link => {
    if (!link.querySelector('svg')) { // Add SVG if not already present
      link.innerHTML = MAIL_SVG + link.innerHTML; // Prepend SVG
    }
  });

  // Process search links and search screen
  toolsContainer.querySelectorAll('li.search > a').forEach(link => {
    if (!link.querySelector('.lens')) { // Add search icon if not present
      link.innerHTML = SEARCH_ICON_SVG + link.innerHTML;
    }
    if (!link.querySelector('.close')) { // Add close icon if not present
      link.innerHTML = link.innerHTML + CLOSE_SVG;
    }
  });

  const searchScreenWrap = toolsRow.querySelector('.search-screen-wrap');
  if (searchScreenWrap) {
    // Ensure search form elements have SVGs and correct attributes
    const searchForm = searchScreenWrap.querySelector('form');
    if (searchForm) {
      const searchIconDiv = searchForm.querySelector('.search-icon');
      if (searchIconDiv && !searchIconDiv.querySelector('svg')) {
        searchIconDiv.innerHTML = SEARCH_ICON_SVG;
      }
      const submitButton = searchForm.querySelector('.submit-button');
      if (submitButton) {
        // Ensure submit button has label and SVG
        if (!submitButton.querySelector('.label')) {
          const label = document.createElement('div');
          label.classList.add('label');
          label.textContent = 'Submit'; // This label is part of the UI, not dynamic content
          submitButton.prepend(label);
        }
        if (!submitButton.querySelector('svg')) {
          submitButton.append(SUBMIT_ARROW_SVG);
        }
      }
    }
    toolsContainer.append(searchScreenWrap); // Append the search screen wrap
  }

  // Add event listeners for search toggle
  toolsContainer.querySelectorAll('.search[data-once*="search-toggle"] > a').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchLi = toggle.closest('.search');
      const currentSearchScreenWrap = toolsContainer.querySelector('.search-screen-wrap'); // Select from toolsContainer
      if (currentSearchScreenWrap) {
        currentSearchScreenWrap.classList.toggle('active');
        searchLi.classList.toggle('active');
      }
    });
  });

  return toolsContainer;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = ''; // Clear existing content

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // --- Brand Section ---
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand', 'logo');
  if (brandRow) {
    const brandLink = brandRow.querySelector('a');
    if (brandLink) {
      navBrand.append(brandLink.cloneNode(true));
    }
  }

  // --- Navigation Sections ---
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');
  const desktopNavUl = setupDesktopNav(navRow);
  if (desktopNavUl) {
    navSections.append(desktopNavUl);
  }
  nav.append(navSections); // Append navSections to the nav element

  // --- Tools Section ---
  const navTools = await setupTools(toolsRow); // Await setupTools
  if (navTools) {
    // The setupTools function now returns the full navTools div with search screen
    // We need to append the icon-navs to the main nav for mobile, and the search screen to the header wrap
    const mobileIconNav = navTools.querySelector('.icon-nav.mobile-menus-icon');
    if (mobileIconNav) {
      navSections.append(mobileIconNav); // Mobile icons go inside navSections for mobile menu
      mobileIconNav.remove(); // Remove from navTools to prevent duplication
    }
    // The desktop icon nav and search screen wrap will be appended to headerWrap later
  }

  // --- 80-year logo ---
  const year80Logo = document.createElement('div');
  year80Logo.classList.add('logo', 'year-80-logo');
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.width = '74';
  year80Img.height = '60';
  year80Img.loading = 'lazy';
  year80Link.append(year80Img);
  year80Logo.append(year80Link);

  // --- Assemble Header ---
  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');

  const hamburger = createHamburger(nav, navSections);
  headerWrap.append(navBrand, hamburger, nav, navTools, year80Logo); // Order based on original HTML

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(headerWrap);

  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');
  block.append(containerDiv);

  // Final accessibility and toggle setup
  setupAccessibility(nav, navSections);
}
