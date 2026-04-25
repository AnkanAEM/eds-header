import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on original HTML media queries

const CHEVRON_SVG = `
  <svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
    <g id="SVGRepo_iconCarrier">
      <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
        <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
      </g>
    </g>
  </svg>
`;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;

    if (isDesktop.matches) {
      const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
      if (navSectionExpanded) {
        toggleAllNavSections(navSections, false); // Collapse all desktop sections
        navSectionExpanded.focus(); // Return focus to the last expanded section
      }
    } else {
      // Mobile: close the entire menu
      const isMenuExpanded = nav.getAttribute('aria-expanded') === 'true';
      if (isMenuExpanded) {
        toggleMenu(nav, navSections, false);
        nav.querySelector('.hamburger').focus();
      }
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;
    if (isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.closest('li.has-child');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    e.preventDefault(); // Prevent default scroll for spacebar
    const dropExpanded = isNavDrop.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.main-nav > ul'), false); // Close others
    isNavDrop.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element (ul.main-nav)
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    // For mobile, also hide the mega-menu
    if (!isDesktop.matches) {
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) {
        megaMenu.style.display = expanded ? 'block' : 'none';
      }
      // Also collapse nested mobile menus
      section.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach(subChild => {
        subChild.classList.remove('active');
        subChild.closest('li').setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element (header block)
 * @param {Element} navSections The nav sections within the container element (ul.main-nav)
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  if (!hamburger || !mainNav) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  mainNav.style.transform = expanded ? 'translate(0,0)' : 'translate(-100%,0)'; // Mobile nav slide effect
  toggleAllNavSections(navSections, expanded && !isDesktop.matches); // Collapse all sections if menu is closing or on desktop

  // Accessibility attributes for hamburger
  hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');

  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.has-child > a'); // Target the direct link in has-child
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createSVG(svgContent) {
  const span = document.createElement('span');
  span.innerHTML = svgContent;
  return span.firstElementChild;
}

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandRow = sections.find(s => s.querySelector('p > picture, p > img, a > picture, a > img'));
  // Nav row contains buttons and ULs
  const navRow = sections.find(s => s.querySelector('p > a.button') && s.querySelector('ul'));
  // Tools row contains links that look like social/contact, but not main nav buttons
  const toolsRow = sections.find(s => s.querySelector('a[href*="contact-us"], a[href*="search"]'));
  return { brandRow, navRow, toolsRow };
}

function setupBrandRow(brandRow, block) {
  if (!brandRow) return;

  const brandDiv = document.createElement('div');
  brandDiv.classList.add('logo');

  const brandLink = brandRow.querySelector('a');
  if (brandLink) {
    brandLink.classList.remove('button'); // Remove button class from fragment
    brandDiv.append(brandLink);
  } else {
    // If no link, just append the image
    const img = brandRow.querySelector('picture, img');
    if (img) brandDiv.append(img);
  }
  block.append(brandDiv);
}

function setupDesktopNav(navRow, mainNavUl) {
  if (!navRow || !mainNavUl) return;

  // Create a temporary container to process children without modifying the original fragment directly
  const tempNavRow = navRow.cloneNode(true);
  const children = Array.from(tempNavRow.children);

  let currentLeftDivContent = [];
  let currentNavLi = null;

  children.forEach((child) => {
    if (child.matches('p > a.button')) {
      // If we were collecting content for a previous left-div, flush it
      if (currentNavLi && currentLeftDivContent.length > 0) {
        const megaMenu = currentNavLi.querySelector('.mega-menu');
        const centerDiv = megaMenu ? megaMenu.querySelector('.center-div') : null;
        if (centerDiv) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div', `${sanitizeClassName(currentNavLi.querySelector('a').textContent)}-left-div`);
          currentLeftDivContent.forEach(content => leftDiv.append(content));
          centerDiv.prepend(leftDiv); // Prepend to maintain order
        }
        currentLeftDivContent = []; // Reset buffer
      }

      const navLink = child.querySelector('a');
      const navTitle = navLink ? navLink.textContent : '';

      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const link = document.createElement('a');
      link.setAttribute('itemprop', 'url');
      link.href = navLink ? navLink.href : '#';
      link.textContent = navTitle;
      li.append(link);

      const span = document.createElement('span');
      span.append(createSVG(CHEVRON_SVG));
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap', 'container');

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      wrapDiv.append(centerDiv);
      megaMenu.append(wrapDiv);
      li.append(megaMenu);
      mainNavUl.append(li);

      currentNavLi = li; // Set current nav item for subsequent content
    } else if (child.matches('ul')) {
      // This UL is a sub-navigation for the *current* `has-child` item
      if (currentNavLi) {
        const megaMenu = currentNavLi.querySelector('.mega-menu');
        const centerDiv = megaMenu ? megaMenu.querySelector('.center-div') : null;
        if (centerDiv) {
          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          // Add specific class based on nav title for styling
          const navTitle = currentNavLi.querySelector('a').textContent;
          subNavWrap.classList.add(`${sanitizeClassName(navTitle)}-sub-nav`);

          const ul = child.cloneNode(true); // Clone the UL for the mega-menu
          ul.querySelectorAll('li').forEach(item => {
            if (item.querySelector('ul')) {
              item.classList.add('top-level-li');
              const itemLink = item.querySelector(':scope > a');
              if (itemLink) {
                const itemSpan = document.createElement('span');
                itemSpan.append(createSVG(CHEVRON_SVG));
                itemLink.after(itemSpan);
              }

              const subUl = item.querySelector(':scope > ul');
              if (subUl) {
                const subChildDiv = document.createElement('div');
                subChildDiv.classList.add('has-sub-child');
                subChildDiv.append(subUl);
                item.append(subChildDiv);

                // Handle inner sub-children
                subUl.querySelectorAll('li').forEach(innerItem => {
                  if (innerItem.querySelector('ul')) {
                    innerItem.classList.add('first-level-li');
                    const innerItemLink = innerItem.querySelector(':scope > a');
                    if (innerItemLink) {
                      const innerItemSpan = document.createElement('span');
                      innerItemSpan.append(createSVG(CHEVRON_SVG));
                      innerItemLink.after(innerItemSpan);
                    }
                    const innerSubUl = innerItem.querySelector(':scope > ul');
                    if (innerSubUl) {
                      const innerSubChildDiv = document.createElement('div');
                      innerSubChildDiv.classList.add('has-inner-sub-child');
                      innerSubChildDiv.append(innerSubUl);
                      innerItem.append(innerSubChildDiv);
                    }
                  }
                });
              }
            }
          });
          subNavWrap.append(ul);
          centerDiv.append(subNavWrap);
        }
      }
    } else {
      // Collect other siblings (like p, h4) for the left-div
      currentLeftDivContent.push(child.cloneNode(true));
    }
  });

  // Flush any remaining content for the last nav item's left-div
  if (currentNavLi && currentLeftDivContent.length > 0) {
    const megaMenu = currentNavLi.querySelector('.mega-menu');
    const centerDiv = megaMenu ? megaMenu.querySelector('.center-div') : null;
    if (centerDiv) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div', `${sanitizeClassName(currentNavLi.querySelector('a').textContent)}-left-div`);
      currentLeftDivContent.forEach(content => leftDiv.append(content));
      centerDiv.prepend(leftDiv);
    }
  }
}

function setupToolsRow(toolsRow, mainNav) { // Changed block to mainNav
  if (!toolsRow || !mainNav) return;

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');

  const allLinks = toolsRow.querySelectorAll('a');
  allLinks.forEach(link => {
    const li = document.createElement('li');
    const clonedLink = link.cloneNode(true); // Clone the link

    if (link.href.includes('contact-us')) {
      li.classList.add('mail');
      // Original HTML has SVG for desktop, text for mobile. Replicate this.
      const desktopSvg = `
        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                    C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                    L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
        </svg>
      `;
      const desktopMailLink = clonedLink.cloneNode(true);
      desktopMailLink.textContent = ''; // Clear text content for desktop icon
      desktopMailLink.append(createSVG(desktopSvg));
      const desktopLi = li.cloneNode(false);
      desktopLi.append(desktopMailLink);
      desktopUl.append(desktopLi); // Append to desktop

      const mobileMailLink = clonedLink.cloneNode(true);
      mobileMailLink.textContent = link.textContent || 'Contact Us'; // Use fragment text or fallback
      const mobileLi = li.cloneNode(false);
      mobileLi.append(mobileMailLink);
      mobileUl.append(mobileLi); // Append to mobile
    } else if (link.textContent.toLowerCase().includes('search')) { // Check for 'search' in textContent
      li.classList.add('search');
      li.setAttribute('data-once', 'search-toggle search-stop-propagation');

      const searchLink = clonedLink.cloneNode(true);
      searchLink.href = '#'; // Search link is typically a hash
      searchLink.setAttribute('data-once', 'search-stop-propagation');

      const lensSvg = `
        <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
        </svg>
      `;
      const closeSvg = `
        <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
          <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
        </svg>
      `;
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = link.textContent || ' Search'; // Use fragment text or fallback

      searchLink.innerHTML = ''; // Clear original text
      searchLink.append(createSVG(lensSvg), createSVG(closeSvg), searchSpan);
      li.append(searchLink);

      // Create search screen wrap (empty for now, will be populated by search block)
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

      // Extract search form and suggestions from toolsRow
      const searchForm = toolsRow.querySelector('form[action*="search"]');
      const searchSuggestions = toolsRow.querySelectorAll('.search-suggestions-wrap');

      if (searchForm) {
        const clonedForm = searchForm.cloneNode(true);
        // Ensure the submit button label is dynamic if possible, or fallback
        const submitButton = clonedForm.querySelector('.submit-button .label');
        if (submitButton) submitButton.textContent = submitButton.textContent || 'Submit';

        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('wrap');
        wrapDiv.setAttribute('data-once', 'search-stop-propagation');
        wrapDiv.append(clonedForm);

        searchSuggestions.forEach(suggestion => {
          wrapDiv.append(suggestion.cloneNode(true));
        });
        searchScreenWrap.append(wrapDiv);
      }

      li.append(searchScreenWrap);

      desktopUl.append(li.cloneNode(true)); // Append to desktop
      mobileUl.append(li.cloneNode(true)); // Append to mobile
    }
  });

  desktopIconNav.append(desktopUl);
  mobileIconNav.append(mobileUl);

  // Append to the main nav element, not the block directly
  const mainNavUlElement = mainNav.querySelector('.main-nav > ul');
  if (mainNavUlElement) {
    mainNavUlElement.append(mobileIconNav); // Mobile icons are inside main-nav in original HTML
    mainNavUlElement.append(desktopIconNav); // Desktop icons are also inside main-nav in original HTML
  }
}

function setupAccessibility(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  navSections.querySelectorAll(':scope > li.has-child').forEach((navSection) => {
    navSection.setAttribute('aria-expanded', 'false');
    navSection.setAttribute('role', 'menuitem');
    const mainLink = navSection.querySelector(':scope > a');
    if (mainLink) {
      mainLink.setAttribute('tabindex', '0'); // Make main nav links focusable
    }

    navSection.addEventListener('click', (e) => {
      if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections, false); // Collapse all others
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      } else {
        // Mobile toggle for sub-menus
        const megaMenu = navSection.querySelector('.mega-menu');
        if (megaMenu) {
          const isExpanded = megaMenu.style.display === 'block';
          megaMenu.style.display = isExpanded ? 'none' : 'block';
          navSection.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        }
      }
    });

    // Handle nested menus for mobile
    navSection.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach(subChild => {
      const parentLi = subChild.closest('li');
      const toggleSpan = parentLi.querySelector(':scope > span');
      if (toggleSpan) {
        toggleSpan.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent parent LI click from firing
          const isActive = subChild.classList.contains('active');
          subChild.classList.toggle('active', !isActive);
          parentLi.setAttribute('aria-expanded', !isActive);
        });
      }
    });
  });

  // Search toggle
  const searchLi = nav.querySelector('li.search');
  if (searchLi) {
    const searchLink = searchLi.querySelector('a');
    const searchScreenWrap = searchLi.querySelector('.search-screen-wrap');
    if (searchLink && searchScreenWrap) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent document click from closing immediately
        const isActive = searchScreenWrap.classList.contains('active');
        searchScreenWrap.classList.toggle('active', !isActive);
        searchLi.classList.toggle('active', !isActive);

        if (!isActive) {
          // Focus search input when opened
          const searchInput = searchScreenWrap.querySelector('#searchInput');
          if (searchInput) searchInput.focus();
        }
      });

      // Close search screen when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchLi.contains(e.target) && searchScreenWrap.classList.contains('active')) {
          searchScreenWrap.classList.remove('active');
          searchLi.classList.remove('active');
        }
      });
    }
  }
}


export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  // Create main header container
  const headerContainer = document.createElement('header');
  headerContainer.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  headerContainer.setAttribute('data-once', 'header-hover');
  headerContainer.id = 'nav'; // Assign ID for escape key listener

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  headerContainer.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Parse fragment into logical rows
  const { brandRow, navRow, toolsRow } = parseStructure(fragment.cloneNode(true)); // Clone to avoid modifying original fragment

  // Setup Brand Row
  setupBrandRow(brandRow, wrapDiv);

  // Setup Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(mainNavUl);
  wrapDiv.append(mainNav);

  setupDesktopNav(navRow, mainNavUl);

  // Setup Tools Row (Search, Contact Us, Socials)
  setupToolsRow(toolsRow, mainNav); // Pass mainNav to append tools inside it

  // Append the 80th year logo if it exists in the original HTML structure
  const year80Logo = document.createElement('div');
  year80Logo.classList.add('logo', 'year-80-logo');
  // The content for this logo is hardcoded in the original HTML,
  // so we replicate it directly. If this were dynamic, it would come from the fragment.
  year80Logo.innerHTML = `
    <a href="https://www.mahindra.com/">
      <img src="https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp" alt="80th Year Logo Gold" title="80thYearLogo_Gold" class="hiddenlogo1 years-80" width="74" height="60" loading="lazy">
    </a>
  `;
  wrapDiv.append(year80Logo);

  block.textContent = ''; // Clear block content
  block.append(headerContainer);

  // Add event listeners for mobile menu toggle
  hamburger.addEventListener('click', () => toggleMenu(headerContainer, mainNavUl, null)); // Pass headerContainer as nav
  headerContainer.setAttribute('aria-expanded', 'false'); // Initial state

  // Initial state for mobile/desktop
  toggleMenu(headerContainer, mainNavUl, isDesktop.matches); // Pass headerContainer as nav
  isDesktop.addEventListener('change', () => toggleMenu(headerContainer, mainNavUl, isDesktop.matches));

  // Setup accessibility after DOM is fully constructed
  setupAccessibility(headerContainer); // Pass headerContainer as nav
}
