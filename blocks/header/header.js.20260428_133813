import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Creates an SVG element from a given path data.
 * @param {string} pathData The SVG path data.
 * @returns {SVGElement} The created SVG element.
 */
function createSVG(pathData) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'Group_65');
  g.setAttribute('data-name', 'Group 65');
  g.setAttribute('transform', 'translate(-831.568 -384.448)');
  svg.append(g);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', '#030408');
  g.append(path);

  return svg;
}

/**
 * Creates a mail SVG element.
 * @returns {SVGElement} The created mail SVG element.
 */
function createMailSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('version', '1.1');
  svg.setAttribute('id', 'Layer_1');
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('viewBox', '0 0 48 38.4');
  svg.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
  svg.setAttribute('xml:space', 'preserve');
  svg.setAttribute('width', '21');
  svg.setAttribute('height', '21');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z');
  svg.append(path);
  return svg;
}

/**
 * Creates a search lens SVG element.
 * @returns {SVGElement} The created search lens SVG element.
 */
function createSearchLensSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');
  svg.classList.add('lens');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
  path.setAttribute('stroke-width', '0.25');
  svg.append(path);
  return svg;
}

/**
 * Creates a search close SVG element.
 * @returns {SVGElement} The created search close SVG element.
 */
function createSearchCloseSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 50 50');
  svg.classList.add('close');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
  svg.append(path);
  return svg;
}

/**
 * Creates a submit arrow SVG element.
 * @returns {SVGElement} The created submit arrow SVG element.
 */
function createSubmitArrowSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '12');
  svg.setAttribute('height', '8');
  svg.setAttribute('viewBox', '0 0 12 8');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
  path.setAttribute('fill', 'black');
  svg.append(path);
  return svg;
}

/**
 * Moves instrumentation attributes from an original element to a new element.
 * @param {Element} originalElement The original element from the fragment.
 * @param {Element} newElement The newly created or decorated element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  [...originalElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const navSectionExpanded = nav.querySelector('.has-child.is-active');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.classList.remove('is-active');
      const megaMenu = navSectionExpanded.querySelector('.mega-menu');
      if (megaMenu) {
        megaMenu.style.display = 'none';
      }
      navSectionExpanded.focus(); // Return focus to the parent menu item
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
      const hamburger = nav.closest('.main-header').querySelector('.hamburger');
      if (hamburger) hamburger.focus(); // Return focus to the hamburger
    }

    // Close search if open
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    const searchElement = document.querySelector('.search.is-active');
    if (searchScreenWrap && searchElement && searchScreenWrap.style.display === 'block') {
      searchScreenWrap.style.display = 'none';
      searchElement.classList.remove('is-active');
      const searchLink = searchElement.querySelector('a');
      if (searchLink) {
        searchLink.querySelector('.lens')?.style.setProperty('display', 'block');
        searchLink.querySelector('.close')?.style.setProperty('display', 'none');
        searchLink.querySelector('span')?.style.setProperty('display', 'block');
      }
      document.body.style.overflowY = '';
      searchLink.focus(); // Return focus to the search icon
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSectionExpanded = nav.querySelector('.has-child.is-active');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.classList.remove('is-active');
      const megaMenu = navSectionExpanded.querySelector('.mega-menu');
      if (megaMenu) {
        megaMenu.style.display = 'none';
      }
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
    }
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.closest('.main-header').querySelector('.hamburger');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  if (hamburger) {
    hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    hamburger.classList.toggle('is-active', expanded);
  }
  nav.classList.toggle('is-active', expanded);

  // enable menu collapse on escape keypress
  if (expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Parses the fragment into brand, nav, and tools rows.
 * @param {Element} fragment The fragment element.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE && !child.matches('style, script, link'),
  );

  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify brand row: contains a picture or img
  brandRow = children.find((child) => child.querySelector('picture, img'));

  // Identify nav row: contains multiple p > a elements followed by ul
  navRow = children.find((child) => {
    const pLinks = child.querySelectorAll('p > a');
    return pLinks.length > 0 && Array.from(pLinks).some((link) => link.nextElementSibling?.tagName === 'UL');
  });

  // Identify tools row: contains ul elements, typically for social or utility links
  toolsRow = children.find((child) => child !== brandRow && child !== navRow && child.querySelector('ul'));

  // Handle default-content-wrapper if present
  const unwrap = (row) => (row && row.classList.contains('default-content-wrapper') ? row.firstElementChild : row);

  return {
    brandRow: unwrap(brandRow),
    navRow: unwrap(navRow),
    toolsRow: unwrap(toolsRow),
  };
}

/**
 * Sets up the brand logo.
 * @param {Element} brandRow The brand row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @returns {Element} The created logo container.
 */
function setupBrand(brandRow, docFragment) {
  if (!brandRow) return null;

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  moveInstrumentation(brandRow, logoDiv);

  let link = brandRow.querySelector('a');
  const img = brandRow.querySelector('img');

  if (!link) {
    link = document.createElement('a');
    link.href = '/'; // Default home link if not present
  }

  if (img) {
    link.innerHTML = ''; // Clear existing content to re-append img
    link.append(img);
    img.classList.add('hiddenlogo1'); // Add class from original HTML
    img.setAttribute('alt', img.getAttribute('alt') || 'Mahindra Brand Logo');
    img.setAttribute('title', img.getAttribute('title') || 'Mahindra Brand Logo');
    img.setAttribute('width', img.getAttribute('width') || '200');
    img.setAttribute('height', img.getAttribute('height') || '30');
    img.setAttribute('loading', 'lazy');
    img.style.width = 'auto';
  }
  logoDiv.append(link);

  docFragment.append(logoDiv);
  return logoDiv;
}

/**
 * Sets up desktop navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @returns {Element} The created main nav element.
 */
function setupDesktopNav(navRow, docFragment) {
  if (!navRow) return null;

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  moveInstrumentation(navRow, mainNav);

  const ul = document.createElement('ul');
  ul.setAttribute('itemscope', '');
  ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(ul);

  let currentLeftDivContent = [];
  const svgPathData = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';

  Array.from(navRow.children).forEach((child) => {
    // Skip empty text nodes and comments
    if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.COMMENT_NODE) {
      return;
    }

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., "Who We Are")
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');
      moveInstrumentation(child, li);

      const a = child.querySelector('a');
      if (a) {
        a.setAttribute('itemprop', 'url');
        li.append(a);
      }

      const span = document.createElement('span');
      span.append(createSVG(svgPathData));
      li.append(span);

      // Find the next sibling UL which is the mega-menu content
      let nextSibling = child.nextElementSibling;
      while (nextSibling && (nextSibling.nodeType === Node.TEXT_NODE || nextSibling.nodeType === Node.COMMENT_NODE)) {
        nextSibling = nextSibling.nextElementSibling;
      }

      if (nextSibling && nextSibling.tagName === 'UL') {
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        moveInstrumentation(nextSibling, megaMenu);

        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        megaMenu.append(wrapContainer);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        wrapContainer.append(centerDiv);

        // Populate left-div with buffered content
        if (currentLeftDivContent.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          centerDiv.append(leftDiv);

          currentLeftDivContent.forEach((contentNode) => {
            if (contentNode.tagName === 'H4') {
              contentNode.classList.add('left-div-heading');
            } else if (contentNode.tagName === 'P') {
              if (contentNode.textContent.includes('#')) {
                contentNode.classList.add('left-div-subdesc');
              } else {
                contentNode.classList.add('left-div-desc');
              }
            } else if (contentNode.tagName === 'UL') {
              Array.from(contentNode.children).forEach((listItem) => {
                listItem.classList.add('list-text-red');
                const spanElement = document.createElement('span');
                const textNodes = Array.from(listItem.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                if (textNodes.length > 1) {
                  spanElement.textContent = textNodes[1].textContent.trim();
                  listItem.textContent = textNodes[0].textContent.trim();
                  listItem.append(spanElement);
                }
              });
            }
            leftDiv.append(contentNode);
          });
          currentLeftDivContent = []; // Clear buffer after flushing
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        // Recursively process the UL for nested menus
        const processNestedUl = (parentUl, targetElement) => {
          Array.from(parentUl.children).forEach((originalLi) => {
            const newLi = document.createElement('li');
            moveInstrumentation(originalLi, newLi);

            const originalLink = originalLi.querySelector('a');
            const originalTextNodes = Array.from(originalLi.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            const liText = originalLink ? originalLink.textContent.trim() : originalTextNodes[0]?.textContent.trim();

            if (originalLink) {
              newLi.append(originalLink);
            } else if (liText) {
              const tempA = document.createElement('a');
              tempA.textContent = liText;
              newLi.append(tempA);
            }

            const nestedUl = originalLi.querySelector('ul');
            if (nestedUl) {
              newLi.classList.add('top-level-li'); // Add class for items with sub-menus
              const nestedSpan = document.createElement('span');
              nestedSpan.append(createSVG(svgPathData));
              newLi.append(nestedSpan);

              const hasSubChildDiv = document.createElement('div');
              hasSubChildDiv.classList.add('has-sub-child');
              moveInstrumentation(nestedUl, hasSubChildDiv);
              newLi.append(hasSubChildDiv);

              const innerUl = document.createElement('ul');
              hasSubChildDiv.append(innerUl);
              processNestedUl(nestedUl, innerUl); // Recurse for deeper nesting
            } else {
              // Check if it's a first-level-li based on the example structure
              const parentOfNewLi = newLi.parentElement;
              if (parentOfNewLi && parentOfNewLi.closest('.has-sub-child')) {
                newLi.classList.add('first-level-li');
              }
            }

            targetElement.append(newLi);
          });
        };

        const topLevelUl = document.createElement('ul');
        subNavWrap.append(topLevelUl);
        processNestedUl(nextSibling, topLevelUl);
        ul.append(li);
        li.append(megaMenu);
      }
    } else {
      // Buffer non-navigation content for the next mega-menu's left-div
      currentLeftDivContent.push(child.cloneNode(true));
    }
  });

  docFragment.append(mainNav);
  return mainNav;
}

/**
 * Sets up utility tools (contact, search, social).
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @returns {Element} The created icon nav element.
 */
function setupTools(toolsRow, docFragment) {
  if (!toolsRow) return null;

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  moveInstrumentation(toolsRow, iconNavDesktop);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  moveInstrumentation(toolsRow, iconNavMobile);

  const desktopUl = document.createElement('ul');
  const mobileUl = document.createElement('ul');
  iconNavDesktop.append(desktopUl);
  iconNavMobile.append(mobileUl);

  const utilityLinks = toolsRow.querySelector('ul:last-of-type');

  // Pre-create SVGs to clone
  const mailSvg = createMailSVG();
  const lensSvg = createSearchLensSVG();
  const closeSvg = createSearchCloseSVG();
  const submitArrowSvg = createSubmitArrowSVG();

  if (utilityLinks) {
    Array.from(utilityLinks.children).forEach((li) => {
      const link = li.querySelector('a');
      if (!link) return;

      const desktopLi = document.createElement('li');
      const mobileLi = document.createElement('li');
      moveInstrumentation(li, desktopLi);
      moveInstrumentation(li, mobileLi);

      if (link.textContent.toLowerCase().includes('contact us')) {
        desktopLi.classList.add('mail');
        mobileLi.classList.add('mail');

        const contactLinkDesktop = link.cloneNode(true);
        contactLinkDesktop.innerHTML = ''; // Clear existing text
        contactLinkDesktop.append(mailSvg.cloneNode(true)); // Append cloned SVG
        desktopLi.append(contactLinkDesktop);

        const contactLinkMobile = link.cloneNode(true);
        mobileLi.append(contactLinkMobile); // Mobile keeps text
      } else if (link.textContent.toLowerCase().includes('search')) {
        desktopLi.classList.add('search');
        mobileLi.classList.add('search');
        desktopLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
        mobileLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

        const searchLink = document.createElement('a');
        searchLink.href = '#';
        searchLink.setAttribute('data-once', 'search-stop-propagation');
        searchLink.append(lensSvg.cloneNode(true));
        searchLink.append(closeSvg.cloneNode(true));

        const searchSpan = document.createElement('span');
        searchSpan.append(document.createTextNode(' Search')); // Use createTextNode
        searchLink.append(searchSpan); // Add text for mobile

        const searchScreenWrap = document.createElement('div');
        searchScreenWrap.classList.add('search-screen-wrap');

        const searchWrapInner = document.createElement('div');
        searchWrapInner.classList.add('wrap');
        searchScreenWrap.append(searchWrapInner);

        const searchForm = document.createElement('form');
        searchForm.action = 'https://www.mahindra.com/search';
        searchForm.method = 'get';
        searchForm.id = 'search-block-form';
        searchForm.setAttribute('accept-charset', 'UTF-8');
        searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
        searchWrapInner.append(searchForm);

        const searchInputWrap = document.createElement('div');
        searchInputWrap.classList.add('search-wrap');
        searchForm.append(searchInputWrap);

        const searchIconDiv = document.createElement('div');
        searchIconDiv.classList.add('search-icon');
        searchIconDiv.append(lensSvg.cloneNode(true)); // Re-use lens SVG for input icon
        searchInputWrap.append(searchIconDiv);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.classList.add('input-text', 'searchtext');
        searchInput.required = true;
        searchInput.name = 'key';
        searchInput.id = 'searchInput';
        searchInput.autocomplete = 'off';
        searchInputWrap.append(searchInput);

        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-button');
        const submitLabel = document.createElement('div');
        submitLabel.classList.add('label');
        submitLabel.append(document.createTextNode(' Submit')); // Use createTextNode
        submitButton.append(submitLabel);
        submitButton.append(submitArrowSvg.cloneNode(true)); // Append SVG after label
        searchInputWrap.append(submitButton);

        const searchResultBox = document.createElement('div');
        searchResultBox.classList.add('searchResultBox');
        searchResultBox.style.display = 'none';
        searchForm.append(searchResultBox);

        const swiper = document.createElement('div');
        swiper.classList.add('swiper', 'scrollSwiper');
        searchResultBox.append(swiper);

        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');
        swiper.append(swiperWrapper);

        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');
        swiperWrapper.append(swiperSlide);

        const swiperScrollbar = document.createElement('div');
        swiperScrollbar.classList.add('swiper-scrollbar');
        searchResultBox.append(swiperScrollbar);

        // Popular Keywords (Hardcoded, should come from fragment/metadata)
        // const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
        // const popularKeywordsWrap = document.createElement('div');
        // popularKeywordsWrap.classList.add('search-suggestions-wrap');
        // popularKeywordsWrap.innerHTML = `<div class="label">Popular Keywords:</div>
        //   <div class="tokens-wrap"><ul>${popularKeywords.map((keyword) => `<li>${keyword}</li>`).join('')}</ul></div>`;
        // searchWrapInner.append(popularKeywordsWrap);

        // Recommended for you (Hardcoded, should come from fragment/metadata)
        // const recommendedKeywords = ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'];
        // const recommendedKeywordsWrap = document.createElement('div');
        // recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
        // recommendedKeywordsWrap.innerHTML = `<div class="label">Recommended for you:</div>
        //   <div class="tokens-wrap"><ul>${recommendedKeywords.map((keyword) => `<li>${keyword}</li>`).join('')}</ul></div>`;
        // searchWrapInner.append(recommendedKeywordsWrap);

        desktopLi.append(searchLink, searchScreenWrap);
        mobileLi.append(searchLink.cloneNode(true), searchScreenWrap.cloneNode(true)); // Clone for mobile
      }
      desktopUl.append(desktopLi);
      mobileUl.append(mobileLi);
    });
  }

  docFragment.append(iconNavMobile);
  docFragment.append(iconNavDesktop);
  return { iconNavDesktop, iconNavMobile };
}

/**
 * Decorates the header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up'); // Add classes from original header
  block.setAttribute('data-once', 'header-hover');

  const docFragment = document.createDocumentFragment();

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  docFragment.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand
  setupBrand(brandRow, wrapDiv);

  // 2. Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  const hamburgerUl = document.createElement('ul');
  hamburgerUl.append(document.createElement('li'));
  hamburgerUl.append(document.createElement('li'));
  hamburgerUl.append(document.createElement('li'));
  hamburger.append(hamburgerUl);
  wrapDiv.append(hamburger);

  // 3. Setup Desktop Navigation
  const mainNav = setupDesktopNav(navRow, wrapDiv);
  if (mainNav) {
    mainNav.id = 'nav'; // Assign ID for toggleMenu
    mainNav.setAttribute('aria-expanded', 'false'); // Initial state
  }

  // 4. Setup Tools (Contact, Search, Social)
  const { iconNavDesktop, iconNavMobile } = setupTools(toolsRow, docFragment); // Append to docFragment, not mainNav
  if (iconNavMobile) wrapDiv.append(iconNavMobile);
  if (iconNavDesktop) wrapDiv.append(iconNavDesktop);


  // 5. Add 80th-year logo if available (hardcoded in original HTML, not in fragment)
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
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
  year80LogoDiv.append(year80Link);
  wrapDiv.append(year80LogoDiv);

  block.append(docFragment);

  // --- Event Listeners and Mobile Toggle Logic ---
  const nav = block.querySelector('#nav');
  if (!nav) return;

  // Toggle menu for mobile
  hamburger.addEventListener('click', () => {
    const isExpanded = nav.getAttribute('aria-expanded') === 'true';
    toggleMenu(nav, !isExpanded);
  });

  // Desktop navigation hover/click logic
  const navSections = nav.querySelector('ul');
  if (navSections) {
    navSections.querySelectorAll(':scope > li.has-child').forEach((navSection) => {
      if (!navSection) return;

      const megaMenu = navSection.querySelector('.mega-menu');
      if (!megaMenu) return;

      // Desktop hover
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          navSections.querySelectorAll('.has-child.is-active').forEach((activeSection) => {
            if (activeSection !== navSection) {
              activeSection.classList.remove('is-active');
              const activeMegaMenu = activeSection.querySelector('.mega-menu');
              if (activeMegaMenu) activeMegaMenu.style.display = 'none';
            }
          });
          navSection.classList.add('is-active');
          megaMenu.style.display = 'block';
          navSection.setAttribute('aria-expanded', 'true');
        }
      });

      navSection.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          navSection.classList.remove('is-active');
          megaMenu.style.display = 'none';
          navSection.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile click
      const navSectionLink = navSection.querySelector(':scope > a');
      const navSectionSpan = navSection.querySelector(':scope > span');

      const toggleSubMenu = (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          e.stopPropagation();
          const wasActive = navSection.classList.contains('is-active');
          navSections.querySelectorAll('.has-child.is-active').forEach((activeSection) => {
            activeSection.classList.remove('is-active');
            const activeMegaMenu = activeSection.querySelector('.mega-menu');
            if (activeMegaMenu) activeMegaMenu.style.display = 'none';
            activeSection.setAttribute('aria-expanded', 'false');
          });

          if (!wasActive) {
            navSection.classList.add('is-active');
            megaMenu.style.display = 'block';
            navSection.setAttribute('aria-expanded', 'true');
          } else {
            navSection.setAttribute('aria-expanded', 'false');
          }
        }
      };

      if (navSectionLink) navSectionLink.addEventListener('click', toggleSubMenu);
      if (navSectionSpan) navSectionSpan.addEventListener('click', toggleSubMenu);

      // Handle nested mobile toggles
      navSection.querySelectorAll('.has-sub-child').forEach((subChildDiv) => {
        const parentLi = subChildDiv.closest('li');
        const subChildSpan = parentLi?.querySelector(':scope > span');
        const subChildLink = parentLi?.querySelector(':scope > a');

        // Set initial aria-expanded state for nested menus
        if (parentLi) parentLi.setAttribute('aria-expanded', 'false');

        const toggleInnerSubMenu = (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            e.stopPropagation();
            const wasActive = subChildDiv.classList.contains('active');

            // Close other active siblings at the same level
            Array.from(parentLi.parentElement.children).forEach((siblingLi) => {
              const siblingSubChildDiv = siblingLi.querySelector('.has-sub-child');
              if (siblingSubChildDiv && siblingSubChildDiv !== subChildDiv) {
                siblingSubChildDiv.classList.remove('active');
                siblingLi.querySelector(':scope > span svg')?.style.setProperty('transform', 'rotate(90deg)');
                siblingLi.setAttribute('aria-expanded', 'false');
              }
            });

            if (!wasActive) {
              subChildDiv.classList.add('active');
              subChildSpan?.querySelector('svg')?.style.setProperty('transform', 'rotate(-180deg)');
              if (parentLi) parentLi.setAttribute('aria-expanded', 'true');
            } else {
              subChildDiv.classList.remove('active');
              subChildSpan?.querySelector('svg')?.style.setProperty('transform', 'rotate(90deg)');
              if (parentLi) parentLi.setAttribute('aria-expanded', 'false');
            }
          }
        };
        if (subChildLink) subChildLink.addEventListener('click', toggleInnerSubMenu);
        if (subChildSpan) subChildSpan.addEventListener('click', toggleInnerSubMenu);

        // Handle deepest nested mobile toggles
        subChildDiv.querySelectorAll('.has-inner-sub-child').forEach((innerSubChildDiv) => {
          const innerParentLi = innerSubChildDiv.closest('li');
          const innerSubChildSpan = innerParentLi?.querySelector(':scope > span');
          const innerSubChildLink = innerParentLi?.querySelector(':scope > a');

          // Set initial aria-expanded state for deepest nested menus
          if (innerParentLi) innerParentLi.setAttribute('aria-expanded', 'false');

          const toggleDeepestSubMenu = (e) => {
            if (!isDesktop.matches) {
              e.preventDefault();
              e.stopPropagation();
              const wasActive = innerSubChildDiv.classList.contains('active-child');

              // Close other active siblings at the same level
              Array.from(innerParentLi.parentElement.children).forEach((siblingLi) => {
                const siblingInnerSubChildDiv = siblingLi.querySelector('.has-inner-sub-child');
                if (siblingInnerSubChildDiv && siblingInnerSubChildDiv !== innerSubChildDiv) {
                  siblingInnerSubChildDiv.classList.remove('active-child');
                  siblingLi.querySelector(':scope > span svg')?.style.setProperty('transform', 'rotate(90deg)');
                  siblingLi.setAttribute('aria-expanded', 'false');
                }
              });

              if (!wasActive) {
                innerSubChildDiv.classList.add('active-child');
                innerSubChildSpan?.querySelector('svg')?.style.setProperty('transform', 'rotate(-180deg)');
                if (innerParentLi) innerParentLi.setAttribute('aria-expanded', 'true');
              } else {
                innerSubChildDiv.classList.remove('active-child');
                innerSubChildSpan?.querySelector('svg')?.style.setProperty('transform', 'rotate(90deg)');
                if (innerParentLi) innerParentLi.setAttribute('aria-expanded', 'false');
              }
            }
          };
          if (innerSubChildLink) innerSubChildLink.addEventListener('click', toggleDeepestSubMenu);
          if (innerSubChildSpan) innerSubChildSpan.addEventListener('click', toggleDeepestSubMenu);
        });
      });
    });
  }

  // Search functionality
  const searchToggleElements = block.querySelectorAll('.search[data-once*="search-toggle"]');
  searchToggleElements.forEach((searchElement) => {
    const searchLink = searchElement.querySelector('a');
    const searchScreenWrap = searchElement.querySelector('.search-screen-wrap');
    const searchInput = searchScreenWrap?.querySelector('#searchInput');

    if (searchLink && searchScreenWrap && searchInput) {
      searchLink.setAttribute('aria-expanded', 'false');
      searchLink.setAttribute('aria-controls', 'search-block-form');

      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent search from closing immediately
        const isSearchOpen = searchScreenWrap.style.display === 'block';

        // Close other open mega menus if any
        navSections.querySelectorAll('.has-child.is-active').forEach((activeSection) => {
          activeSection.classList.remove('is-active');
          const activeMegaMenu = activeSection.querySelector('.mega-menu');
          if (activeMegaMenu) activeMegaMenu.style.display = 'none';
          activeSection.setAttribute('aria-expanded', 'false');
        });

        if (isSearchOpen) {
          searchScreenWrap.style.display = 'none';
          searchElement.classList.remove('is-active');
          searchLink.querySelector('.lens')?.style.setProperty('display', 'block');
          searchLink.querySelector('.close')?.style.setProperty('display', 'none');
          searchLink.querySelector('span')?.style.setProperty('display', 'block');
          document.body.style.overflowY = '';
          searchLink.setAttribute('aria-expanded', 'false');
        } else {
          searchScreenWrap.style.display = 'block';
          searchElement.classList.add('is-active');
          searchLink.querySelector('.lens')?.style.setProperty('display', 'none');
          searchLink.querySelector('.close')?.style.setProperty('display', 'block');
          searchLink.querySelector('span')?.style.setProperty('display', 'none');
          document.body.style.overflowY = 'hidden';
          searchInput.focus();
          searchLink.setAttribute('aria-expanded', 'true');
        }
      });

      // Prevent closing when clicking inside the search screen
      searchScreenWrap.addEventListener('click', (e) => e.stopPropagation());

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchElement.contains(e.target) && searchScreenWrap.style.display === 'block') {
          searchScreenWrap.style.display = 'none';
          searchElement.classList.remove('is-active');
          searchLink.querySelector('.lens')?.style.setProperty('display', 'block');
          searchLink.querySelector('.close')?.style.setProperty('display', 'none');
          searchLink.querySelector('span')?.style.setProperty('display', 'block');
          document.body.style.overflowY = '';
          searchLink.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Initial state for mobile/desktop
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
}
