import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Creates an SVG element from a given path data string.
 * @param {string} svgContent The full SVG string.
 * @returns {SVGElement} The created SVG element.
 */
function createSVG(svgContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  return doc.documentElement;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;

    const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');
    if (searchScreenWrap) {
      const searchAnchor = nav.querySelector('.icon-nav .search a');
      if (searchAnchor) {
        // eslint-disable-next-line no-use-before-define
        toggleSearchOverlay(searchAnchor, searchScreenWrap, false);
        searchAnchor.focus();
      }
      return;
    }

    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      nav.querySelector('.hamburger').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;

    const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');
    if (searchScreenWrap) {
      const searchAnchor = nav.querySelector('.icon-nav .search a');
      if (searchAnchor) {
        // eslint-disable-next-line no-use-before-define
        toggleSearchOverlay(searchAnchor, searchScreenWrap, false);
      }
      return;
    }

    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element (ul)
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega-menu');
    const arrowSpan = section.querySelector('span svg');
    if (megaMenu) {
      megaMenu.style.opacity = expanded ? '1' : '0';
      megaMenu.style.pointerEvents = expanded ? 'all' : 'none';
      if (arrowSpan) arrowSpan.style.transform = expanded ? 'rotate(-90deg)' : 'rotate(90deg)';
      if (!isDesktop.matches) {
        megaMenu.style.display = expanded ? 'block' : 'none';
      }
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (!isDesktop.matches) {
    toggleAllNavSections(navSections, false); // Collapse all sub-sections on mobile menu toggle
    mainNav.style.transform = expanded ? 'translate(0,0)' : 'translate(-100%,0)';
    mainNav.style.opacity = expanded ? '1' : '0';
    mainNav.style.pointerEvents = expanded ? 'all' : 'none';
    hamburger.classList.toggle('is-active', expanded);
  } else {
    mainNav.style.transform = ''; // Reset transform for desktop
    mainNav.style.opacity = '';
    mainNav.style.pointerEvents = '';
    hamburger.classList.remove('is-active');
  }

  // enable menu collapse on escape keypress and focusout
  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Parses the fragment into brand, nav, and tools sections.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {{brandSections: Element[], navSections: Element[], toolsSections: Element[], year80Logo: Element|null}} Partitioned sections.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandSections = [];
  const navSections = [];
  const toolsSections = [];
  let year80Logo = null;

  let currentPartition = 'brand';

  sections.forEach((section) => {
    const hasLogo = section.querySelector('img[alt*="logo" i], img[src*="logo" i], img[class*="logo" i]');
    const hasSocialLinks = section.querySelector('a[href*="facebook.com" i], a[href*="twitter.com" i], a[href*="linkedin.com" i], a[href*="instagram.com" i], a[href*="youtube.com" i]');
    const hasUtilityLinks = section.querySelector('a[href*="contact-us" i], a[href*="search" i]');
    const is80YearLogo = section.querySelector('.year-80-logo');

    if (is80YearLogo) {
      year80Logo = section.cloneNode(true);
      return; // Skip adding to other sections
    }

    if (currentPartition === 'brand') {
      if (hasLogo) {
        brandSections.push(section);
      } else {
        currentPartition = 'nav';
        navSections.push(section);
      }
    } else if (currentPartition === 'nav') {
      if (hasSocialLinks || hasUtilityLinks) {
        currentPartition = 'tools';
        toolsSections.push(section);
      } else {
        navSections.push(section);
      }
    } else if (currentPartition === 'tools') {
      toolsSections.push(section);
    }
  });

  return { brandSections, navSections, toolsSections, year80Logo };
}

/**
 * Sets up the brand section of the header.
 * @param {Element[]} brandContent The brand content sections from the fragment.
 * @returns {Element} The created brand div.
 */
function setupBrand(brandContent) {
  const brandDiv = document.createElement('div');
  brandDiv.classList.add('logo');

  if (brandContent.length > 0) {
    const firstSection = brandContent[0];
    const logoLink = firstSection.querySelector('p > picture > img')?.closest('a') || firstSection.querySelector('a');
    if (logoLink) {
      const clonedLink = logoLink.cloneNode(true);
      const img = clonedLink.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
      }
      brandDiv.appendChild(clonedLink);
    }
  }
  return brandDiv;
}

/**
 * Sets up the desktop navigation.
 * @param {Element[]} navContent The navigation content sections from the fragment.
 * @returns {Element} The created main nav ul element.
 */
function setupDesktopNav(navContent) {
  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLi = null;
  let leftDivContentBuffer = [];

  navContent.forEach((section) => {
    Array.from(section.children).forEach((child) => {
      // Check if this child is a primary nav link (P tag with an A tag inside)
      if (child.tagName === 'P' && child.querySelector('a')) {
        const anchor = child.querySelector('a');
        const textContent = anchor.textContent.toLowerCase().trim();

        // If there's content in the buffer, and we're starting a new primary nav item,
        // flush the buffer into the previous currentLi's mega-menu left-div
        if (currentLi && leftDivContentBuffer.length > 0) {
          const megaMenu = currentLi.querySelector('.mega-menu');
          if (megaMenu) {
            const centerDiv = megaMenu.querySelector('.center-div');
            if (centerDiv) {
              const leftDiv = document.createElement('div');
              leftDiv.classList.add('left-div');
              // Add specific classes based on the previous primary nav item's text
              const prevPrimaryNavText = currentLi.querySelector('a')?.textContent.toLowerCase().trim();
              if (prevPrimaryNavText === 'investor relations') {
                leftDiv.classList.add('ir-left-div');
              } else if (prevPrimaryNavText === 'newsroom') {
                leftDiv.classList.add('newsroom-left-div');
              } else if (prevPrimaryNavText === 'careers') {
                leftDiv.classList.add('career-left-div');
              }
              leftDivContentBuffer.forEach(item => leftDiv.appendChild(item));
              centerDiv.prepend(leftDiv); // Prepend to maintain order
            }
          }
          leftDivContentBuffer = []; // Clear buffer
        }

        // Create new primary nav item
        if (currentLi) {
          mainNavUl.appendChild(currentLi);
        }
        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.setAttribute('data-once', 'nav-close-search');
        currentLi.setAttribute('aria-expanded', 'false'); // Default collapsed

        const clonedAnchor = anchor.cloneNode(true);
        clonedAnchor.setAttribute('itemprop', 'url');
        currentLi.appendChild(clonedAnchor);

        const span = document.createElement('span');
        span.appendChild(createSVG('<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>'));
        currentLi.appendChild(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenu.appendChild(wrapContainer);
        wrapContainer.appendChild(centerDiv);
        currentLi.appendChild(megaMenu);

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.appendChild(subNavWrap);

        // Add specific classes for certain menus
        if (textContent === 'who we are') {
          subNavWrap.classList.add('about-us-sub-nav');
        } else if (textContent === 'what we do') {
          subNavWrap.classList.add('what-we-do');
        } else if (textContent === 'investor relations') {
          subNavWrap.classList.add('element-block');
        } else if (textContent === 'careers') {
          subNavWrap.classList.add('careers-div');
        }

      } else if (currentLi) {
        // This is a sub-item or left-div content for the current primary nav item
        if (child.tagName === 'UL') {
          const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
          if (subNavWrap) {
            const ul = child.cloneNode(true);
            recursivelyDecorateUl(ul);

            // Special handling for Investor Relations inner-sub-nav-wrap-list
            if (currentLi.querySelector('a[href*="investor-relations"]')) {
              let innerSubNavWrapList = subNavWrap.querySelector('.inner-sub-nav-wrap-list');
              if (!innerSubNavWrapList) {
                innerSubNavWrapList = document.createElement('div');
                innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
                subNavWrap.appendChild(innerSubNavWrapList);
              }
              innerSubNavWrapList.appendChild(ul);
            } else {
              subNavWrap.appendChild(ul);
            }
          }
        } else {
          // Collect other content for left-div
          leftDivContentBuffer.push(child.cloneNode(true));
        }
      }
    });
  });

  // Flush any remaining buffer for the last primary nav item
  if (currentLi) {
    if (leftDivContentBuffer.length > 0) {
      const megaMenu = currentLi.querySelector('.mega-menu');
      if (megaMenu) {
        const centerDiv = megaMenu.querySelector('.center-div');
        if (centerDiv) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const prevPrimaryNavText = currentLi.querySelector('a')?.textContent.toLowerCase().trim();
          if (prevPrimaryNavText === 'investor relations') {
            leftDiv.classList.add('ir-left-div');
          } else if (prevPrimaryNavText === 'newsroom') {
            leftDiv.classList.add('newsroom-left-div');
          } else if (prevPrimaryNavText === 'careers') {
            leftDiv.classList.add('career-left-div');
          }
          leftDivContentBuffer.forEach(item => leftDiv.appendChild(item));
          centerDiv.prepend(leftDiv);
        }
      }
    }
    mainNavUl.appendChild(currentLi);
  }

  return mainNavUl;
}

/**
 * Recursively decorates ULs for multi-level menus.
 * @param {Element} ul The UL element to decorate.
 */
function recursivelyDecorateUl(ul) {
  Array.from(ul.children).forEach((li) => {
    const innerUl = li.querySelector('ul');
    if (innerUl) {
      li.classList.add('top-level-li');
      const span = document.createElement('span');
      span.appendChild(createSVG('<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>'));
      li.appendChild(span);

      const hasSubChildDiv = document.createElement('div');
      hasSubChildDiv.classList.add('has-sub-child');
      hasSubChildDiv.appendChild(innerUl);
      li.appendChild(hasSubChildDiv);
      recursivelyDecorateUl(innerUl);

      span.addEventListener('click', () => {
        if (!isDesktop.matches) {
          hasSubChildDiv.classList.toggle('active');
          span.querySelector('svg').style.transform = hasSubChildDiv.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      });
      li.querySelector('a').addEventListener('click', (e) => {
        if (!isDesktop.matches && innerUl) { // Only prevent default if there's a sub-menu
          e.preventDefault();
          hasSubChildDiv.classList.toggle('active');
          span.querySelector('svg').style.transform = hasSubChildDiv.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      });
    }

    // Handle inner-sub-child (deeper levels)
    Array.from(li.querySelectorAll('ul > li')).forEach((innerLi) => {
      const deepestUl = innerLi.querySelector('ul');
      if (deepestUl) {
        innerLi.classList.add('first-level-li');
        const span = document.createElement('span');
        span.appendChild(createSVG('<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>'));
        innerLi.appendChild(span);

        const hasInnerSubChildDiv = document.createElement('div');
        hasInnerSubChildDiv.classList.add('has-inner-sub-child');
        hasInnerSubChildDiv.appendChild(deepestUl);
        innerLi.appendChild(hasInnerSubChildDiv);
        recursivelyDecorateUl(deepestUl);

        span.addEventListener('click', () => {
          if (!isDesktop.matches) {
            hasInnerSubChildDiv.classList.toggle('active-child');
            span.querySelector('svg').style.transform = hasInnerSubChildDiv.classList.contains('active-child') ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        });
        innerLi.querySelector('a').addEventListener('click', (e) => {
          if (!isDesktop.matches && deepestUl) { // Only prevent default if there's a sub-menu
            e.preventDefault();
            hasInnerSubChildDiv.classList.toggle('active-child');
            span.querySelector('svg').style.transform = hasInnerSubChildDiv.classList.contains('active-child') ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        });
      }
    });
  });
}

/**
 * Toggles the search overlay visibility and updates icons.
 * @param {Element} anchor The search anchor element.
 * @param {Element} searchScreenWrap The search overlay element.
 * @param {boolean|null} forceExpanded Optional boolean to force state.
 */
function toggleSearchOverlay(anchor, searchScreenWrap, forceExpanded = null) {
  const isActive = forceExpanded !== null ? forceExpanded : !searchScreenWrap.classList.contains('active');
  searchScreenWrap.classList.toggle('active', isActive);

  const lensSvg = anchor.querySelector('.lens');
  const closeSvg = anchor.querySelector('.close');
  const searchSpan = anchor.querySelector('span');

  if (lensSvg) lensSvg.style.display = isActive ? 'none' : 'block';
  if (closeSvg) closeSvg.style.display = isActive ? 'block' : 'none';
  if (searchSpan) searchSpan.style.display = isActive ? 'none' : 'block';

  // Manage focus for accessibility
  if (isActive) {
    const searchInput = searchScreenWrap.querySelector('#searchInput');
    if (searchInput) searchInput.focus();
  } else {
    anchor.focus();
  }
}

/**
 * Sets up the tools section of the header.
 * @param {Element[]} toolsContent The tools content sections from the fragment.
 * @returns {Element} The created tools div.
 */
function setupTools(toolsContent) {
  const toolsDiv = document.createElement('div');
  toolsDiv.classList.add('icon-nav', 'desktop-menus-icon');

  const ul = document.createElement('ul');
  toolsDiv.appendChild(ul);

  toolsContent.forEach((section) => {
    Array.from(section.children).forEach((child) => {
      if (child.tagName === 'UL') {
        Array.from(child.children).forEach((li) => {
          const anchor = li.querySelector('a');
          if (anchor) {
            const newLi = document.createElement('li');
            const clonedAnchor = anchor.cloneNode(true);

            if (clonedAnchor.href.includes('contact-us')) {
              newLi.classList.add('mail');
              const mailSvg = createSVG(`
                <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
                  <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                            C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                            L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
                </svg>
              `);
              clonedAnchor.textContent = '';
              clonedAnchor.appendChild(mailSvg);
            } else if (clonedAnchor.href.includes('search')) {
              newLi.classList.add('search');
              newLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

              const lensSvg = createSVG(`
                <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
                  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
                </svg>
              `);
              const closeSvg = createSVG(`
                <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
                  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
                </svg>
              `);

              clonedAnchor.textContent = '';
              clonedAnchor.append(lensSvg, closeSvg);
              const searchSpan = document.createElement('span');
              searchSpan.setAttribute('data-once', 'search-stop-propagation');
              searchSpan.textContent = ' Search';
              clonedAnchor.appendChild(searchSpan);

              const searchScreenWrap = document.createElement('div');
              searchScreenWrap.classList.add('search-screen-wrap');
              searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

              // Extract search form and suggestions from the fragment's tools section
              const originalSearchScreenWrap = section.querySelector('.search-screen-wrap');
              if (originalSearchScreenWrap) {
                searchScreenWrap.innerHTML = originalSearchScreenWrap.innerHTML;
              } else {
                // Fallback or default structure if not found in fragment
                searchScreenWrap.innerHTML = `
                  <div class="wrap" data-once="search-stop-propagation">
                    <form action="/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
                      <div class="search-wrap" data-once="search-stop-propagation">
                        <div class="search-icon" data-once="search-stop-propagation">
                          ${lensSvg.outerHTML}
                        </div>
                        <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation">
                        <button class="submit-button" data-once="search-stop-propagation">
                          <div class="label" data-once="search-stop-propagation"> Submit </div>
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
                            <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
                        <div class="swiper scrollSwiper" data-once="search-stop-propagation">
                          <div class="swiper-wrapper" data-once="search-stop-propagation">
                            <div class="swiper-slide" data-once="search-stop-propagation">
                            </div>
                          </div>
                        </div>
                        <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
                      </div>
                    </form>
                    <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                      <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
                      <div class="tokens-wrap" data-once="search-stop-propagation">
                        <ul data-once="search-stop-propagation">
                          <li>Business</li>
                          <li>FY 21</li>
                          <li>Brands</li>
                          <li>XUV700</li>
                          <li>Global</li>
                          <li>Nanhi Kali</li>
                        </ul>
                      </div>
                    </div>
                    <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                      <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
                      <div class="tokens-wrap" data-once="search-stop-propagation">
                        <ul data-once="search-stop-propagation">
                          <li>Annual Report 2021 - 2022</li>
                          <li>Leadership Announcement</li>
                          <li>Latest Press Release</li>
                          <li>Brand Guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                `;
              }
              newLi.appendChild(searchScreenWrap);

              clonedAnchor.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSearchOverlay(clonedAnchor, searchScreenWrap);
              });

            } else {
              newLi.appendChild(clonedAnchor);
            }
            ul.appendChild(newLi);
          }
        });
      }
    });
  });

  return toolsDiv;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';

  const header = document.createElement('header');
  header.classList.add('main-header', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');
  header.setAttribute('id', 'nav'); // Add ID for escape key listener
  header.setAttribute('aria-expanded', 'false'); // Default collapsed

  const container = document.createElement('div');
  container.classList.add('container');
  header.appendChild(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.appendChild(wrap);

  const { brandSections, navSections, toolsSections, year80Logo } = parseStructure(fragment);

  // Setup Brand
  const brandElement = setupBrand(brandSections);
  wrap.appendChild(brandElement);

  // Setup Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.appendChild(hamburger);

  // Setup Main Navigation
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  const mainNavUl = setupDesktopNav(navSections);
  navElement.appendChild(mainNavUl);
  wrap.appendChild(navElement);

  // Setup Desktop Tools (icon-nav)
  const desktopToolsElement = setupTools(toolsSections);
  wrap.appendChild(desktopToolsElement);

  // Setup 80th Year Logo (if present in original HTML, assumed to be after main nav)
  if (year80Logo) {
    wrap.appendChild(year80Logo);
  }

  block.appendChild(header);

  // Add event listeners for mobile navigation toggle
  hamburger.addEventListener('click', () => {
    toggleMenu(header, mainNavUl, header.getAttribute('aria-expanded') === 'false');
  });

  // Add event listeners for desktop mega-menu hover
  const setupDesktopHover = () => {
    mainNavUl.querySelectorAll(':scope > li.has-child').forEach((navSection) => {
      const megaMenu = navSection.querySelector('.mega-menu');
      const arrowSpan = navSection.querySelector('span svg');
      if (megaMenu) {
        navSection.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleAllNavSections(mainNavUl, false); // Close other open menus
            navSection.setAttribute('aria-expanded', 'true');
            megaMenu.style.opacity = '1';
            megaMenu.style.pointerEvents = 'all';
            megaMenu.style.transform = 'translate(0,0)';
            if (arrowSpan) arrowSpan.style.transform = 'rotate(-90deg)';
          }
        });
        navSection.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            navSection.setAttribute('aria-expanded', 'false');
            megaMenu.style.opacity = '0';
            megaMenu.style.pointerEvents = 'none';
            megaMenu.style.transform = 'translate(0,0)';
            if (arrowSpan) arrowSpan.style.transform = 'rotate(90deg)';
          }
        });
      }
    });
  };

  // Initial setup
  setupDesktopHover();
  toggleMenu(header, mainNavUl, isDesktop.matches);

  // Listen for desktop/mobile changes
  isDesktop.addEventListener('change', () => {
    toggleMenu(header, mainNavUl, isDesktop.matches);
    if (isDesktop.matches) {
      setupDesktopHover();
    } else {
      // Remove desktop hover listeners on mobile
      mainNavUl.querySelectorAll(':scope > li.has-child').forEach((navSection) => {
        const megaMenu = navSection.querySelector('.mega-menu');
        if (megaMenu) {
          navSection.removeEventListener('mouseenter', () => {}); // Placeholder, actual removal needs named function
          navSection.removeEventListener('mouseleave', () => {}); // Placeholder
        }
      });
    }
  });
}
