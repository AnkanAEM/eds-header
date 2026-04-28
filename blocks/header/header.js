import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on CSS

/**
 * Moves instrumentation attributes from an original element to a new element.
 * This is crucial for AEM's tracking and editing functionalities.
 * @param {Element} originalElement The original element from the fragment.
 * @param {Element} newElement The newly created or decorated element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;

  // Move data-once attributes
  const dataOnce = originalElement.getAttribute('data-once');
  if (dataOnce) {
    newElement.setAttribute('data-once', dataOnce);
    originalElement.removeAttribute('data-once');
  }

  // Move any data-cq-* attributes that might be relevant for instrumentation
  Array.from(originalElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
      originalElement.removeAttribute(attr.name);
    }
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.querySelector('.main-nav');
    const navSections = nav.querySelector('ul[itemscope]');
    if (!nav || !navSections) return;

    const navSectionExpanded = navSections.querySelector('li[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) hamburger.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const header = e.currentTarget;
  if (!header.contains(e.relatedTarget)) {
    const nav = header.querySelector('.main-nav');
    const navSections = nav.querySelector('ul[itemscope]');
    if (!nav || !navSections) return;

    const navSectionExpanded = navSections.querySelector('li[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element (ul[itemscope])
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      if (expanded) {
        megaMenu.style.display = ''; // Reset to CSS default
      } else {
        megaMenu.style.display = 'none'; // Hide mega menu
      }
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element (.main-nav)
 * @param {Element} navSections The nav sections within the container element (ul[itemscope])
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = document.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    document.querySelector('.main-header').addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    document.querySelector('.main-header').removeEventListener('focusout', closeOnFocusLost);
  }
}

function setupMobileNav(nav) {
  if (!nav) return;

  nav.querySelectorAll('li.has-child').forEach((li) => {
    const span = li.querySelector(':scope > span');
    const megaMenu = li.querySelector(':scope > .mega-menu');

    if (span && megaMenu) {
      span.addEventListener('click', () => {
        const isExpanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', !isExpanded);
        megaMenu.style.display = !isExpanded ? 'block' : 'none';
      });
    }

    // Handle nested sub-menus for mobile
    megaMenu?.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const subChildSpan = subChild.querySelector(':scope > span');
      const innerSubChild = subChild.querySelector(':scope > div.has-inner-sub-child');
      if (subChildSpan && innerSubChild) {
        subChildSpan.addEventListener('click', () => {
          const isSubExpanded = subChild.classList.contains('active');
          if (isSubExpanded) {
            subChild.classList.remove('active');
            innerSubChild.classList.remove('active-child');
          } else {
            // Close other open sub-children at the same level
            subChild.closest('ul').querySelectorAll('.has-sub-child.active').forEach((openSub) => {
              openSub.classList.remove('active');
              const openInnerSub = openSub.querySelector(':scope > div.has-inner-sub-child');
              if (openInnerSub) openInnerSub.classList.remove('active-child');
            });
            subChild.classList.add('active');
innerSubChild.classList.add('active-child');
          }
        });
      }
    });
  });
}

function setupSearchFunctionality(block) {
  const searchToggle = block.querySelector('.icon-nav .search > a');
  const searchScreen = block.querySelector('.search-screen-wrap');
  const searchInput = block.querySelector('.search-screen-wrap .input-text');
  const searchForm = block.querySelector('#search-block-form');
  const searchLensIcon = block.querySelector('.icon-nav .search .lens');
  const searchCloseIcon = block.querySelector('.icon-nav .search .close');

  if (!searchToggle || !searchScreen || !searchInput || !searchForm || !searchLensIcon || !searchCloseIcon) {
    return;
  }

  const toggleSearch = (open) => {
    if (open) {
      searchScreen.classList.add('active');
      searchToggle.setAttribute('aria-expanded', 'true');
      searchLensIcon.style.display = 'none';
      searchCloseIcon.style.display = 'block';
      document.body.style.overflowY = 'hidden';
      setTimeout(() => searchInput.focus(), 300); // Focus after transition
    } else {
      searchScreen.classList.remove('active');
      searchToggle.setAttribute('aria-expanded', 'false');
      searchLensIcon.style.display = 'block';
      searchCloseIcon.style.display = 'none';
      document.body.style.overflowY = '';
      searchInput.value = ''; // Clear search input
    }
  };

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent immediate closing
    const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
    toggleSearch(!isExpanded);
  });

  // Close search when clicking outside the search screen
  document.addEventListener('click', (e) => {
    if (searchScreen.classList.contains('active') && !searchScreen.contains(e.target) && !searchToggle.contains(e.target)) {
      toggleSearch(false);
    }
  });

  // Close search on escape key
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && searchScreen.classList.contains('active')) {
      toggleSearch(false);
    }
  });

  // Prevent closing when clicking inside search screen
  searchScreen.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Popular Keywords / Recommended for you click handlers
  block.querySelectorAll('.search-suggestions-wrap .tokens-wrap ul li').forEach((li) => {
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.value = e.target.textContent;
      searchForm.submit();
    });
  });
}

/**
 * Parses the fragment structure into logical rows.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {object} An object containing the brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === 1); // Only element nodes

  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  children.forEach((child) => {
    const potentialWrapper = child.querySelector('.default-content-wrapper');
    const contentRoot = potentialWrapper || child;

    if (contentRoot.querySelector('picture, img')) {
      brandRow = child;
    } else if (contentRoot.querySelector('p > a[href], ul')) {
      // Prioritize nav row as it contains multiple p > a and ul elements
      const links = contentRoot.querySelectorAll('p > a[href]');
      const uls = contentRoot.querySelectorAll('ul');
      if (links.length > 1 || uls.length > 1) {
        navRow = child;
      } else if (!toolsRow) { // If it's not clearly nav, it might be tools, but prefer nav
        toolsRow = child;
      }
    } else if (contentRoot.querySelector('ul')) {
      toolsRow = child;
    }
  });

  // Fallback if identification is ambiguous
  if (!brandRow && children[0]) brandRow = children[0];
  if (!navRow && children[1]) navRow = children[1];
  if (!toolsRow && children[2]) toolsRow = children[2];

  return { brandRow, navRow, toolsRow };
}

/**
 * Creates an SVG element with a path.
 * @returns {SVGElement} The SVG element.
 */
function createChevronSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'Group_65');
  g.setAttribute('data-name', 'Group 65');
  g.setAttribute('transform', 'translate(-831.568 -384.448)');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z');
  path.setAttribute('fill', '#030408');

  g.append(path);
  svg.append(g);
  return svg;
}

/**
 * Recursively processes UL/LI structure.
 * @param {Element} ulElement The <ul> element to process.
 * @param {string} levelClass Class to add to <li> elements for styling (e.g., 'first-level-li').
 * @returns {Element} The processed <ul> element.
 */
function processNestedUl(ulElement, levelClass = '') {
  if (!ulElement || ulElement.tagName !== 'UL') return null;

  const newUl = document.createElement('ul');
  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName !== 'LI') return;

    const newLi = document.createElement('li');
    if (levelClass) newLi.classList.add(levelClass);
    moveInstrumentation(li, newLi); // Move instrumentation from original LI to new LI

    // Extract immediate text content and first anchor
    let link = null;
    let textContent = '';
    Array.from(li.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'A' && !link) {
        link = node.cloneNode(true);
        moveInstrumentation(node, link);
      } else if (node.nodeType === 3) { // Text node
        textContent += node.textContent.trim();
      }
    });

    if (link) {
      newLi.append(link);
    } else if (textContent) {
      newLi.textContent = textContent; // If no link, just put text
    }

    // Check for nested ULs
    const nestedUl = li.querySelector(':scope > ul');
    if (nestedUl) {
      newLi.classList.add('has-child'); // Use has-child for nested ULs as well
      const span = document.createElement('span');
      span.append(createChevronSVG());
      newLi.append(span);

      const nestedDiv = document.createElement('div');
      nestedDiv.classList.add('has-inner-sub-child'); // Use a generic class for nested divisions
      nestedDiv.append(processNestedUl(nestedUl, '')); // Recursive call
      newLi.append(nestedDiv);
    }
    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Sets up the desktop navigation structure.
 * @param {Element} navRow The navigation row from the fragment.
 * @returns {DocumentFragment} The constructed navigation DOM.
 */
function setupDesktopNav(navRow) {
  const navContent = navRow ? navRow.querySelector('.default-content-wrapper') || navRow : null;
  if (!navContent) return new DocumentFragment();

  const navFragment = new DocumentFragment();
  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  moveInstrumentation(navRow, mainNavUl); // Move instrumentation from navRow to mainNavUl

  let currentLi = null;
  let leftDivBuffer = [];

  Array.from(navContent.children).forEach((child) => {
    if (child.nodeType !== 1) return; // Skip non-element nodes

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., "Who We Are")
      if (currentLi) {
        mainNavUl.append(currentLi); // Add previous item if exists
        currentLi = null; // Reset for next item
      }

      const originalP = child;
      const originalA = originalP.querySelector('a');
      if (!originalA) return;

      currentLi = document.createElement('li');
      currentLi.classList.add('has-child', 'hover-red');
      currentLi.setAttribute('itemprop', 'name');
      moveInstrumentation(originalP, currentLi); // Move instrumentation from P to LI

      const newA = document.createElement('a');
      newA.setAttribute('itemprop', 'url');
      newA.href = originalA.href;
      newA.textContent = originalA.textContent;
      moveInstrumentation(originalA, newA); // Move instrumentation from A to newA
      currentLi.append(newA);

      const span = document.createElement('span');
      span.append(createChevronSVG());
      currentLi.append(span);

      // Create mega-menu container
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush leftDivBuffer into the current mega-menu's left-div
      if (leftDivBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        // Dynamically create class based on link text if needed, but ensure it's allowed
        const titleText = originalA.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${titleText}-left-div`);

        leftDivBuffer.forEach((bufferedItem) => {
          leftDiv.append(bufferedItem);
        });
        centerDiv.append(leftDiv);
        leftDivBuffer = []; // Clear buffer
      }

      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      currentLi.append(megaMenu);
    } else if (child.tagName === 'UL' && currentLi) {
      // This is a navigation list for the current trigger
      const megaMenu = currentLi.querySelector('.mega-menu');
      const centerDiv = megaMenu ? megaMenu.querySelector('.center-div') : null;
      if (!centerDiv) return;

      let subNavWrap = centerDiv.querySelector('.sub-nav-wrap');
      if (!subNavWrap) {
        subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);
      }
      moveInstrumentation(child, subNavWrap); // Move instrumentation from UL to subNavWrap

      // Check if the current UL has nested ULs
      const hasNestedUl = child.querySelector('ul');
      if (hasNestedUl) {
        // If it has nested ULs, apply the top-level-li class and process recursively
        const processedUl = processNestedUl(child, 'top-level-li');
        subNavWrap.append(processedUl);
      } else {
        // Otherwise, just append the UL as is, with basic LI decoration
        const newUl = document.createElement('ul');
        Array.from(child.children).forEach((li) => {
          if (li.tagName === 'LI') {
            const newLi = document.createElement('li');
            newLi.classList.add('top-level-li'); // Add top-level-li for direct children
            moveInstrumentation(li, newLi); // Move instrumentation from original LI to new LI
            const link = li.querySelector('a');
            if (link) {
              const newLink = link.cloneNode(true);
              moveInstrumentation(link, newLink);
              newLi.append(newLink);
            } else {
              newLi.textContent = li.textContent.trim();
            }
            newUl.append(newLi);
          }
        });
        subNavWrap.append(newUl);
      }
    } else if (currentLi) {
      // Collect non-navigation siblings (e.g., H4, P, standalone ULs for left-div content)
      // Clone the node to avoid moving it from the original fragment prematurely
      const clonedChild = child.cloneNode(true);
      moveInstrumentation(child, clonedChild);
      leftDivBuffer.push(clonedChild);
    }
  });

  if (currentLi) {
    mainNavUl.append(currentLi);
  }
  navFragment.append(mainNavUl);
  return navFragment;
}

/**
 * Sets up the utility tools and social links.
 * @param {Element} toolsRow The tools row from the fragment.
 * @returns {DocumentFragment} The constructed tools DOM.
 */
function setupTools(toolsRow) {
  const toolsContent = toolsRow ? toolsRow.querySelector('.default-content-wrapper') || toolsRow : null;
  if (!toolsContent) return new DocumentFragment();

  const toolsFragment = new DocumentFragment();

  // Mobile Icons
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);
  toolsFragment.append(mobileIconNav);

  // Desktop Icons
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIconNav.append(desktopUl);
  toolsFragment.append(desktopIconNav);

  let socialLinksUl = null;
  let utilityLinksUl = null;
  let searchFormAction = 'https://www.mahindra.com/search'; // Default search action

  Array.from(toolsContent.children).forEach((child) => {
    if (child.tagName === 'UL') {
      const links = child.querySelectorAll('a');
      if (links.length > 0) {
        const isSocial = Array.from(links).some(link =>
          ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].some(social =>
            link.href.toLowerCase().includes(social)
          )
        );

        if (isSocial) {
          socialLinksUl = child;
        } else {
          utilityLinksUl = child;
        }
      }
    } else if (child.tagName === 'FORM' && child.id === 'search-block-form') {
      searchFormAction = child.getAttribute('action') || searchFormAction;
    }
  });

  // Process utility links (Contact Us, Search)
  if (utilityLinksUl) {
    Array.from(utilityLinksUl.children).forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        const newLiMobile = document.createElement('li');
        const newLiDesktop = document.createElement('li');
        moveInstrumentation(li, newLiMobile); // Move instrumentation from LI to newLiMobile
        moveInstrumentation(li, newLiDesktop); // Move instrumentation from LI to newLiDesktop

        if (link.textContent.toLowerCase() === 'contact us') {
          newLiMobile.classList.add('mail');
          newLiDesktop.classList.add('mail');

          const newLinkMobile = link.cloneNode(true);
          const newLinkDesktop = link.cloneNode(true);
          moveInstrumentation(link, newLinkMobile);
          moveInstrumentation(link, newLinkDesktop);

          // Mobile Contact Us text
          newLinkMobile.textContent = link.textContent; // Use original text
          newLiMobile.append(newLinkMobile);

          // Desktop Contact Us SVG
          const mailSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          mailSvg.setAttribute('version', '1.1');
          mailSvg.setAttribute('id', 'Layer_1');
          mailSvg.setAttribute('x', '0px');
          mailSvg.setAttribute('y', '0px');
          mailSvg.setAttribute('viewBox', '0 0 48 38.4');
          mailSvg.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
          mailSvg.setAttribute('xml:space', 'preserve');
          mailSvg.setAttribute('width', '21');
          mailSvg.setAttribute('height', '21');
          const mailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          mailPath.setAttribute('d', 'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z');
          mailSvg.append(mailPath);
          newLinkDesktop.textContent = ''; // Clear text for desktop
          newLinkDesktop.append(mailSvg);
          newLiDesktop.append(newLinkDesktop);

        } else if (link.textContent.toLowerCase() === 'search') {
          newLiMobile.classList.add('search');
          newLiDesktop.classList.add('search');

          // Search Link with SVG icons
          const createSearchLinkContent = () => {
            const searchA = link.cloneNode(true);
            moveInstrumentation(link, searchA);
            searchA.textContent = ''; // Clear original text

            const lensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            lensSvg.setAttribute('viewBox', '0 0 21 21');
            lensSvg.setAttribute('fill', 'none');
            lensSvg.classList.add('lens');
            moveInstrumentation(link, lensSvg); // Instrumentation for SVG
            const lensPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            lensPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
            lensPath.setAttribute('stroke-width', '0.25');
            moveInstrumentation(link, lensPath); // Instrumentation for path
            lensSvg.append(lensPath);

            const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            closeSvg.setAttribute('viewBox', '0 0 50 50');
            closeSvg.classList.add('close');
            moveInstrumentation(link, closeSvg); // Instrumentation for SVG
            const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            closePath.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
            moveInstrumentation(link, closePath); // Instrumentation for path
            closeSvg.append(closePath);

            const searchSpan = document.createElement('span');
            searchSpan.textContent = ` ${link.textContent}`; // Use original text
            moveInstrumentation(link, searchSpan); // Instrumentation for span

            searchA.append(lensSvg);
            searchA.append(closeSvg);
            searchA.append(searchSpan);
            return searchA;
          };

          newLiMobile.append(createSearchLinkContent());
          newLiDesktop.append(createSearchLinkContent());

          // Search Screen Wrap
          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          moveInstrumentation(link, searchScreenWrap); // Instrumentation for searchScreenWrap

          const searchScreenWrapInner = document.createElement('div');
          searchScreenWrapInner.classList.add('wrap');
          moveInstrumentation(link, searchScreenWrapInner); // Instrumentation for searchScreenWrapInner

          // Form
          const searchForm = document.createElement('form');
          searchForm.setAttribute('action', searchFormAction); // Use dynamic action
          searchForm.setAttribute('method', 'get');
          searchForm.setAttribute('id', 'search-block-form');
          searchForm.setAttribute('accept-charset', 'UTF-8');
          searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
          moveInstrumentation(link, searchForm); // Instrumentation for searchForm

          const searchWrap = document.createElement('div');
          searchWrap.classList.add('search-wrap');
          moveInstrumentation(link, searchWrap); // Instrumentation for searchWrap

          const searchIconDiv = document.createElement('div');
          searchIconDiv.classList.add('search-icon');
          moveInstrumentation(link, searchIconDiv); // Instrumentation for searchIconDiv
          const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          searchIconSvg.setAttribute('viewBox', '0 0 21 21');
          searchIconSvg.setAttribute('fill', 'none');
          moveInstrumentation(link, searchIconSvg); // Instrumentation for searchIconSvg
          const searchIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          searchIconPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
          searchIconPath.setAttribute('stroke-width', '0.25');
          moveInstrumentation(link, searchIconPath); // Instrumentation for path
          searchIconSvg.append(searchIconPath);
          searchIconDiv.append(searchIconSvg);

          const searchInput = document.createElement('input');
          searchInput.setAttribute('type', 'text');
          searchInput.classList.add('input-text', 'searchtext');
          searchInput.setAttribute('required', '');
          searchInput.setAttribute('name', 'key');
          searchInput.setAttribute('id', 'searchInput');
          searchInput.setAttribute('autocomplete', 'off');
          moveInstrumentation(link, searchInput); // Instrumentation for input

          const submitButton = document.createElement('button');
          submitButton.classList.add('submit-button');
          submitButton.setAttribute('type', 'submit');
          moveInstrumentation(link, submitButton); // Instrumentation for button

          const submitLabel = document.createElement('div');
          submitLabel.classList.add('label');
          submitLabel.textContent = ' Submit ';
          moveInstrumentation(link, submitLabel); // Instrumentation for label
          submitButton.append(submitLabel);

          const submitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          submitSvg.setAttribute('width', '12');
          submitSvg.setAttribute('height', '8');
          submitSvg.setAttribute('viewBox', '0 0 12 8');
          submitSvg.setAttribute('fill', 'none');
          moveInstrumentation(link, submitSvg); // Instrumentation for svg
          const submitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          submitPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
          submitPath.setAttribute('fill', 'black');
          moveInstrumentation(link, submitPath); // Instrumentation for path
          submitSvg.append(submitPath);
          submitButton.append(submitSvg);

          searchWrap.append(searchIconDiv);
          searchWrap.append(searchInput);
          searchWrap.append(submitButton);
          searchForm.append(searchWrap);

          // Search Result Box
          const searchResultBox = document.createElement('div');
          searchResultBox.classList.add('searchResultBox');
          searchResultBox.style.display = 'none';
          moveInstrumentation(link, searchResultBox); // Instrumentation for searchResultBox

          const swiper = document.createElement('div');
          swiper.classList.add('swiper', 'scrollSwiper');
          moveInstrumentation(link, swiper); // Instrumentation for swiper
          const swiperWrapper = document.createElement('div');
          swiperWrapper.classList.add('swiper-wrapper');
          moveInstrumentation(link, swiperWrapper); // Instrumentation for swiperWrapper
          const swiperSlide = document.createElement('div');
          swiperSlide.classList.add('swiper-slide');
          moveInstrumentation(link, swiperSlide); // Instrumentation for swiperSlide
          swiperWrapper.append(swiperSlide);
          swiper.append(swiperWrapper);
          searchResultBox.append(swiper);

          const swiperScrollbar = document.createElement('div');
          swiperScrollbar.classList.add('swiper-scrollbar');
          moveInstrumentation(link, swiperScrollbar); // Instrumentation for swiperScrollbar
          searchResultBox.append(swiperScrollbar);
          searchForm.append(searchResultBox);

          // Search Suggestions (Popular Keywords) - Dynamically extract from fragment if available
          const popularKeywordsSection = toolsContent.querySelector('.search-suggestions-wrap .label:contains("Popular Keywords:")')?.closest('.search-suggestions-wrap');
          if (popularKeywordsSection) {
            const popularKeywordsWrap = popularKeywordsSection.cloneNode(true);
            moveInstrumentation(popularKeywordsSection, popularKeywordsWrap);
            searchForm.append(popularKeywordsWrap);
          } else {
            // Fallback if not found in fragment, but ideally should be dynamic
            const popularKeywordsWrap = document.createElement('div');
            popularKeywordsWrap.classList.add('search-suggestions-wrap');
            const popularKeywordsLabel = document.createElement('div');
            popularKeywordsLabel.classList.add('label');
            popularKeywordsLabel.textContent = 'Popular Keywords:';
            const popularKeywordsTokens = document.createElement('div');
            popularKeywordsTokens.classList.add('tokens-wrap');
            const popularKeywordsUl = document.createElement('ul');
            ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach(keyword => {
              const li = document.createElement('li');
              li.textContent = keyword;
              popularKeywordsUl.append(li);
            });
            popularKeywordsTokens.append(popularKeywordsUl);
            popularKeywordsWrap.append(popularKeywordsLabel);
            popularKeywordsWrap.append(popularKeywordsTokens);
            searchForm.append(popularKeywordsWrap);
          }


          // Search Suggestions (Recommended for you) - Dynamically extract from fragment if available
          const recommendedSection = toolsContent.querySelector('.search-suggestions-wrap .label:contains("Recommended for you:")')?.closest('.search-suggestions-wrap');
          if (recommendedSection) {
            const recommendedWrap = recommendedSection.cloneNode(true);
            moveInstrumentation(recommendedSection, recommendedWrap);
            searchForm.append(recommendedWrap);
          } else {
            // Fallback if not found in fragment, but ideally should be dynamic
            const recommendedWrap = document.createElement('div');
            recommendedWrap.classList.add('search-suggestions-wrap');
            const recommendedLabel = document.createElement('div');
            recommendedLabel.classList.add('label');
            recommendedLabel.textContent = 'Recommended for you:';
            const recommendedTokens = document.createElement('div');
            recommendedTokens.classList.add('tokens-wrap');
            const recommendedUl = document.createElement('ul');
            ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach(keyword => {
              const li = document.createElement('li');
              li.textContent = keyword;
              recommendedUl.append(li);
            });
            recommendedTokens.append(recommendedUl);
            recommendedWrap.append(recommendedLabel);
            recommendedWrap.append(recommendedTokens);
            searchForm.append(recommendedWrap);
          }

          searchScreenWrapInner.append(searchForm);
          searchScreenWrap.append(searchScreenWrapInner);

          newLiMobile.append(searchScreenWrap.cloneNode(true)); // Clone for mobile
          newLiDesktop.append(searchScreenWrap); // Use original for desktop
        }
        mobileUl.append(newLiMobile);
        desktopUl.append(newLiDesktop);
      }
    });
  }

  // Process social links
  if (socialLinksUl) {
    const socialNav = document.createElement('div');
    socialNav.classList.add('icon-nav', 'social-menus-icon'); // Assuming a class for social icons
    const socialUl = document.createElement('ul');
    moveInstrumentation(socialLinksUl, socialUl); // Move instrumentation from original UL to new socialUl

    Array.from(socialLinksUl.children).forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        const newLi = document.createElement('li');
        moveInstrumentation(li, newLi); // Move instrumentation from original LI to new LI
        const newLink = link.cloneNode(true);
        moveInstrumentation(link, newLink);

        // Add specific classes for social icons based on href or text content
        const socialName = link.href.toLowerCase().match(/(facebook|twitter|instagram|youtube|linkedin)/)?.[0];
        if (socialName) {
          newLi.classList.add(socialName);
        }
        newLi.append(newLink);
        socialUl.append(newLi);
      }
    });
    socialNav.append(socialUl);
    // Append socialNav to desktopIconNav or a separate container as per design
    desktopIconNav.append(socialNav);
  }

  return toolsFragment;
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
  const headerFragment = new DocumentFragment();
  const mainHeader = document.createElement('header');
  mainHeader.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  mainHeader.setAttribute('data-once', 'header-hover');
  moveInstrumentation(block, mainHeader); // Move instrumentation from block to mainHeader

  const container = document.createElement('div');
  container.classList.add('container');
  const wrap = document.createElement('div');
  wrap.classList.add('wrap');

  mainHeader.append(container);
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  if (brandRow) {
    const brandContent = brandRow.querySelector('.default-content-wrapper') || brandRow;
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentation(brandRow, logoDiv); // Move instrumentation from brandRow to logoDiv

    const link = brandContent.querySelector('a') || document.createElement('a');
    if (!link.href) link.href = '/'; // Default home link
    moveInstrumentation(brandContent.querySelector('a'), link);

    const picture = brandContent.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.setAttribute('width', '200'); // Set default width/height as per original HTML
        img.setAttribute('height', '30');
        img.setAttribute('loading', 'lazy');
        img.style.width = 'auto'; // Re-apply inline style if needed
        link.append(picture);
        moveInstrumentation(picture, link.querySelector('picture')); // Instrumentation for picture
        moveInstrumentation(img, link.querySelector('img')); // Instrumentation for img
      }
    } else {
      // Fallback if no picture, check for direct img
      const img = brandContent.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.setAttribute('width', '200');
        img.setAttribute('height', '30');
        img.setAttribute('loading', 'lazy');
        img.style.width = 'auto';
        link.append(img);
        moveInstrumentation(img, link.querySelector('img'));
      }
    }
    logoDiv.append(link);
    wrap.append(logoDiv);
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  moveInstrumentation(block, hamburger); // Move instrumentation from block to hamburger

  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // 2. Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  moveInstrumentation(block, mainNav); // Move instrumentation from block to mainNav

  mainNav.append(setupDesktopNav(navRow));
  wrap.append(mainNav);

  // 3. Setup Tools (Contact Us, Search)
  mainNav.append(setupTools(toolsRow));

  // 80th year logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  moveInstrumentation(block, year80LogoDiv); // Move instrumentation from block to year80LogoDiv

  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  moveInstrumentation(block, year80Link); // Instrumentation for year80Link

  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.setAttribute('width', '74');
  year80Img.setAttribute('height', '60');
  year80Img.setAttribute('loading', 'lazy');
  moveInstrumentation(block, year80Img); // Instrumentation for year80Img

  year80Link.append(year80Img);
  year80LogoDiv.append(year80Link);
  wrap.append(year80LogoDiv);

  headerFragment.append(mainHeader);
  block.replaceChildren(headerFragment);

  // Post-render initialization and event listeners
  const nav = block.querySelector('.main-nav');
  const navSections = nav.querySelector('ul[itemscope]');
  if (nav && navSections) {
    // Hamburger click event
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

    // Prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    // Desktop nav hover behavior
    if (isDesktop.matches) {
      navSections.querySelectorAll('li.has-child').forEach((li) => {
        li.addEventListener('mouseenter', () => {
          toggleAllNavSections(navSections, false); // Close others
          li.setAttribute('aria-expanded', 'true');
          const megaMenu = li.querySelector('.mega-menu');
          if (megaMenu) megaMenu.style.display = 'block';
        });
        li.addEventListener('mouseleave', () => {
          li.setAttribute('aria-expanded', 'false');
          const megaMenu = li.querySelector('.mega-menu');
          if (megaMenu) megaMenu.style.display = 'none';
        });

        // Handle nested sub-menus for desktop hover
        li.querySelectorAll('.has-sub-child').forEach((subChild) => {
          subChild.addEventListener('mouseenter', () => {
            subChild.classList.add('active');
            const innerSubChild = subChild.querySelector(':scope > div.has-inner-sub-child');
            if (innerSubChild) innerSubChild.classList.add('active-child');
          });
          subChild.addEventListener('mouseleave', () => {
            subChild.classList.remove('active');
            const innerSubChild = subChild.querySelector(':scope > div.has-inner-sub-child');
            if (innerSubChild) innerSubChild.classList.remove('active-child');
          });
        });
      });
    } else {
      setupMobileNav(nav);
    }
  }

  setupSearchFunctionality(block);
}
