import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Parses the fragment into logical rows: brand, navigation, and tools.
 * Accounts for the default-content-wrapper nesting.
 * @param {Element} fragment The loaded fragment DOM.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children).map((child) =>
    child.classList.contains('default-content-wrapper') ? child : child.querySelector('.default-content-wrapper') || child
  );

  return {
    brandRow: sections[0],
    navRow: sections[1],
    toolsRow: sections[2],
  };
}

/**
 * Creates an SVG element from a given path data.
 * @param {string} pathData The SVG path data.
 * @param {string} viewBox The SVG viewBox attribute.
 * @param {string} className The class name for the SVG.
 * @returns {Element} The SVG element.
 */
function createSVG(pathData, viewBox, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', 'none');
  if (className) {
    svg.classList.add(className);
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke-width', '0.25');
  svg.append(path);
  return svg;
}

/**
 * Recursively builds the nested UL/LI structure from the fragment.
 * @param {Element} ulElement The parent UL element from the fragment.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function buildNestedList(ulElement) {
  const newUl = document.createElement('ul');
  Array.from(ulElement.children).forEach((li) => {
    const newLi = document.createElement('li');
    const link = li.querySelector('a');
    const nestedUl = li.querySelector('ul');

    if (link) {
      newLi.append(link.cloneNode(true));
    } else if (li.firstChild.nodeType === Node.TEXT_NODE && li.firstChild.textContent.trim()) {
      newLi.textContent = li.firstChild.textContent.trim();
    }

    if (nestedUl) {
      newLi.classList.add('has-child');
      const span = document.createElement('span');
      span.append(createSVG('M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z', '-23.5 -23.5 122.80 122.80', ''));
      newLi.append(span);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      subNavWrap.append(buildNestedList(nestedUl));
      newLi.append(subNavWrap);
    }
    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Sets up the desktop navigation structure.
 * @param {Element} navRow The navigation content row from the fragment.
 * @returns {HTMLUListElement} The decorated main navigation UL.
 */
function setupDesktopNav(navRow) {
  if (!navRow) return null;

  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentMegaMenuLi = null;
  let currentLeftDivContent = [];

  Array.from(navRow.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., "Who We Are")
      const triggerLink = child.querySelector('a');
      currentMegaMenuLi = document.createElement('li');
      currentMegaMenuLi.classList.add('has-child', 'hover-red');
      currentMegaMenuLi.setAttribute('itemprop', 'name');
      currentMegaMenuLi.setAttribute('data-once', 'nav-close-search');

      const linkClone = triggerLink.cloneNode(true);
      linkClone.setAttribute('itemprop', 'url');
      currentMegaMenuLi.append(linkClone);

      const span = document.createElement('span');
      span.append(createSVG('M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z', '-23.5 -23.5 122.80 122.80', ''));
      currentMegaMenuLi.append(span);

      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('mega-menu');
      const wrapContainerDiv = document.createElement('div');
      wrapContainerDiv.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush buffered content into left-div
      if (currentLeftDivContent.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const triggerText = triggerLink.textContent.trim();
        if (triggerText === 'Investor Relations') {
          leftDiv.classList.add('ir-left-div');
        } else if (triggerText === 'newsroom') {
          leftDiv.classList.add('newsroom-left-div');
        } else if (triggerText === 'careers') {
          leftDiv.classList.add('career-left-div');
        }
        currentLeftDivContent.forEach((item) => leftDiv.append(item));
        centerDiv.append(leftDiv);
        currentLeftDivContent = []; // Clear buffer
      }

      wrapContainerDiv.append(centerDiv);
      megaMenuDiv.append(wrapContainerDiv);
      currentMegaMenuLi.append(megaMenuDiv);
      mainNavUl.append(currentMegaMenuLi);
    } else if (child.tagName === 'UL' && currentMegaMenuLi) {
      // This is a submenu (UL) associated with the current trigger
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      const clonedUl = buildNestedList(child);
      subNavWrap.append(clonedUl);

      // Add specific classes based on the parent trigger's text content
      const triggerText = currentMegaMenuLi.querySelector('a').textContent.trim();
      if (triggerText === 'Who We Are') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (triggerText === 'What we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (triggerText === 'Investor Relations') {
        subNavWrap.classList.add('element-block');
        // Special handling for IR, splitting ULs if needed
        const firstLi = clonedUl.querySelector('li');
        if (firstLi && firstLi.nextElementSibling) {
          const firstUlWrapper = document.createElement('ul');
          firstUlWrapper.classList.add('sub-nav-wrap-one-link');
          firstUlWrapper.append(firstLi);
          subNavWrap.append(firstUlWrapper);

          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

          let currentInnerUl = document.createElement('ul');
          Array.from(clonedUl.children).forEach((li, index) => {
            if (index > 0) { // Skip the first li already moved
              if (currentInnerUl.children.length === 2) { // Max 2 items per inner ul
                innerSubNavWrapList.append(currentInnerUl);
                currentInnerUl = document.createElement('ul');
              }
              currentInnerUl.append(li);
            }
          });
          if (currentInnerUl.children.length > 0) {
            innerSubNavWrapList.append(currentInnerUl);
          }
          subNavWrap.append(innerSubNavWrapList);
          clonedUl.remove(); // Remove the original cloned UL
        }
      } else if (triggerText === 'careers') {
        subNavWrap.classList.add('careers-div');
      }

      currentMegaMenuLi.querySelector('.center-div').append(subNavWrap);
    } else if (currentMegaMenuLi) {
      // Buffer other content (headings, paragraphs) for the left-div
      currentLeftDivContent.push(child.cloneNode(true));
    }
  });

  return mainNavUl;
}

/**
 * Sets up the utility tools section (contact, search, social).
 * @param {Element} toolsRow The tools content row from the fragment.
 * @returns {HTMLDivElement} The decorated tools container.
 */
function setupTools(toolsRow) {
  if (!toolsRow) return null;

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  iconNavDesktop.append(desktopUl);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  iconNavMobile.append(mobileUl);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  // Extract popular keywords and recommended for you from the fragment
  const popularKeywordsUl = toolsRow.querySelector('.search-suggestions-wrap:nth-of-type(1) ul');
  const recommendedKeywordsUl = toolsRow.querySelector('.search-suggestions-wrap:nth-of-type(2) ul');

  searchScreenWrap.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            ${createSVG('M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z', '0 0 21 21', '').outerHTML}
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
          ${popularKeywordsUl ? popularKeywordsUl.outerHTML : '<ul></ul>'}
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          ${recommendedKeywordsUl ? recommendedKeywordsUl.outerHTML : '<ul></ul>'}
        </div>
      </div>
    </div>`;

  Array.from(toolsRow.children).forEach((ul) => {
    if (ul.tagName === 'UL') {
      Array.from(ul.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const liDesktop = document.createElement('li');
          const liMobile = document.createElement('li');

          if (link.textContent.toLowerCase() === 'contact us') {
            liDesktop.classList.add('mail');
            liMobile.classList.add('mail');
            const svgDesktop = createSVG('M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z', '0 0 48 38.4', '');
            svgDesktop.setAttribute('width', '21');
            svgDesktop.setAttribute('height', '21');
            const linkDesktop = link.cloneNode(true);
            linkDesktop.textContent = ''; // Clear text for desktop, only show icon
            linkDesktop.append(svgDesktop);
            liDesktop.append(linkDesktop);
            desktopUl.append(liDesktop);

            const linkMobile = link.cloneNode(true);
            liMobile.append(linkMobile); // Keep text for mobile
            mobileUl.append(liMobile);
          } else if (link.textContent.toLowerCase() === 'search') {
            liDesktop.classList.add('search');
            liDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const linkDesktop = link.cloneNode(true);
            linkDesktop.textContent = ''; // Clear text for desktop, only show icon
            linkDesktop.setAttribute('data-once', 'search-stop-propagation');
            linkDesktop.append(createSVG('M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z', '0 0 21 21', 'lens'));
            linkDesktop.append(createSVG('M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z', '0 0 50 50', 'close'));
            liDesktop.append(linkDesktop);
            liDesktop.append(searchScreenWrap.cloneNode(true)); // Append cloned search screen
            desktopUl.append(liDesktop);

            liMobile.classList.add('search');
            liMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const linkMobile = link.cloneNode(true);
            linkMobile.setAttribute('data-once', 'search-stop-propagation');
            linkMobile.append(createSVG('M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z', '0 0 21 21', 'lens'));
            linkMobile.append(createSVG('M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z', '0 0 50 50', 'close'));
            linkMobile.append(document.createElement('span')).textContent = ' Search'; // Keep text for mobile
            liMobile.append(linkMobile);
            liMobile.append(searchScreenWrap.cloneNode(true)); // Append cloned search screen
            mobileUl.append(liMobile);
          }
          // Social links are not explicitly handled as icons in the original HTML,
          // so they are skipped here as per "enhance, don't rebuild" and "universal data sourcing" rules.
        }
      });
    }
  });

  const toolsContainer = document.createElement('div');
  toolsContainer.append(iconNavMobile);
  toolsContainer.append(iconNavDesktop);
  return toolsContainer;
}

/**
 * Toggles the mobile navigation menu.
 * @param {Element} nav The main navigation element.
 * @param {Element} hamburger The hamburger button element.
 * @param {boolean} forceExpanded Forces the expanded state.
 */
function toggleMobileMenu(nav, hamburger, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = expanded ? '' : 'hidden'; // Prevent scrolling when menu is open

  if (expanded) {
    hamburger.classList.remove('is-active');
  } else {
    hamburger.classList.add('is-active');
  }
}

/**
 * Handles clicks on navigation items, especially for mobile submenus.
 * @param {Event} event The click event.
 */
function handleNavItemClick(event) {
  if (isDesktop.matches) return; // Only for mobile

  const targetLi = event.target.closest('li.has-child');
  if (!targetLi) return;

  const subMenu = targetLi.querySelector('.sub-nav-wrap');
  if (subMenu) {
    event.preventDefault(); // Prevent link navigation for menu toggles
    const isActive = subMenu.classList.contains('active');
    // Close all other submenus at the same level
    Array.from(targetLi.parentElement.children).forEach((sibling) => {
      if (sibling !== targetLi) {
        const siblingSubMenu = sibling.querySelector('.sub-nav-wrap');
        if (siblingSubMenu) {
          siblingSubMenu.classList.remove('active');
          const siblingSpan = sibling.querySelector('span svg');
          if (siblingSpan) siblingSpan.style.transform = 'rotate(90deg)';
        }
      }
    });

    if (isActive) {
      subMenu.classList.remove('active');
      const span = targetLi.querySelector('span svg');
      if (span) span.style.transform = 'rotate(90deg)';
    } else {
      subMenu.classList.add('active');
      const span = targetLi.querySelector('span svg');
      if (span) span.style.transform = 'rotate(-180deg)';
    }
  }
}

/**
 * Handles search toggle functionality.
 * @param {Element} searchIcon The search icon element.
 * @param {Element} searchScreen The search screen element.
 */
function handleSearchToggle(searchIcon, searchScreen) {
  if (!searchIcon || !searchScreen) return;

  const toggleSearch = (forceClose = false) => {
    const isActive = forceClose ? false : searchScreen.classList.toggle('active');
    searchIcon.closest('li.search').classList.toggle('active', isActive);
    searchScreen.classList.toggle('active', isActive);

    const lens = searchIcon.querySelector('.lens');
    const close = searchIcon.querySelector('.close');
    if (lens && close) {
      lens.style.display = isActive ? 'none' : 'block';
      close.style.display = isActive ? 'block' : 'none';
    }

    if (isActive) {
      document.body.style.overflowY = 'hidden';
      searchScreen.querySelector('input.searchtext').focus();
    } else {
      document.body.style.overflowY = '';
    }
  };

  searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSearch();
  });

  searchScreen.addEventListener('click', (e) => e.stopPropagation());
  searchScreen.querySelector('.search-wrap').addEventListener('click', (e) => e.stopPropagation());

  // Close search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchScreen.classList.contains('active')) {
      toggleSearch(true);
    }
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.remove();
    return;
  }

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);
  header.append(containerDiv);

  // 1. Brand Row (Logo)
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    let logoLink = brandRow.querySelector('a');
    if (!logoLink) {
      logoLink = document.createElement('a');
      logoLink.href = '/'; // Synthetic link if missing
      const img = brandRow.querySelector('img');
      if (img) logoLink.append(img.cloneNode(true));
    } else {
      logoLink = logoLink.cloneNode(true); // Clone to detach from fragment
    }
    logoDiv.append(logoLink);
    wrapDiv.append(logoDiv);
  }

  // Hamburger menu (mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  mainNav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav
  const desktopNavUl = setupDesktopNav(navRow);
  if (desktopNavUl) {
    mainNav.append(desktopNavUl);
  }

  // Tools (Contact, Search, Social)
  const toolsContainer = setupTools(toolsRow);
  if (toolsContainer) {
    // Append mobile tools to main nav for mobile display
    const mobileTools = toolsContainer.querySelector('.mobile-menus-icon');
    if (mobileTools) mainNav.append(mobileTools);
    // Append desktop tools to wrapDiv
    const desktopTools = toolsContainer.querySelector('.desktop-menus-icon');
    if (desktopTools) wrapDiv.append(desktopTools);
  }

  wrapDiv.append(mainNav);

  // Append 80th-year logo if available in fragment (assuming it's the last element in brandRow)
  const eightyYearLogo = fragment.querySelector('.logo.year-80-logo');
  if (eightyYearLogo) {
    wrapDiv.append(eightyYearLogo.cloneNode(true));
  }

  block.textContent = '';
  block.append(header);

  // Event Listeners and dynamic behavior
  const allNavLinks = mainNav.querySelectorAll('li.has-child > a');
  allNavLinks.forEach((link) => {
    link.addEventListener('click', handleNavItemClick);
  });

  hamburger.addEventListener('click', () => {
    toggleMobileMenu(mainNav, hamburger);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu(mainNav, hamburger, true); // Force close
    }
  });

  // Search functionality
  const desktopSearchLi = wrapDiv.querySelector('.desktop-menus-icon .search');
  const mobileSearchLi = mainNav.querySelector('.mobile-menus-icon .search');

  if (desktopSearchLi) {
    const searchIcon = desktopSearchLi.querySelector('a');
    const searchScreen = desktopSearchLi.querySelector('.search-screen-wrap');
    if (searchIcon && searchScreen) handleSearchToggle(searchIcon, searchScreen);
  }
  if (mobileSearchLi) {
    const searchIcon = mobileSearchLi.querySelector('a');
    const searchScreen = mobileSearchLi.querySelector('.search-screen-wrap');
    if (searchIcon && searchScreen) handleSearchToggle(searchIcon, searchScreen);
  }

  // Close mobile menu on desktop resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      toggleMobileMenu(mainNav, hamburger, true); // Force close mobile menu on desktop
    } else {
      toggleMobileMenu(mainNav, hamburger, false); // Force close mobile menu on mobile
    }
  });

  // Initial state for desktop/mobile
  toggleMobileMenu(mainNav, hamburger, isDesktop.matches); // Set initial state
}
