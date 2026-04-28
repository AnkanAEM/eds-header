import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to match CSS breakpoint

// Utility function to create elements with classes
function createEl(tag, classes = [], attributes = {}) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

// Helper to extract immediate text nodes from an element
function getImmediateText(element) {
  return Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
    .map(node => node.textContent.trim())
    .join(' ');
}

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The loaded header fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}}
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter(el => el.tagName === 'DIV');
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify Brand Row: First section with a picture or img
  brandRow = sections.find(section => section.querySelector('picture, img'));

  // Identify Nav Row: Section with the highest density of <ul> elements
  let maxUlCount = 0;
  sections.forEach(section => {
    const ulCount = section.querySelectorAll('ul').length;
    if (ulCount > maxUlCount) {
      maxUlCount = ulCount;
      navRow = section;
    }
  });

  // Identify Tools Row: Remaining section(s) with social links or utility links
  toolsRow = sections.find(section =>
    section !== brandRow &&
    section !== navRow &&
    (section.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="youtube"]') ||
     section.querySelector('a[href*="contact-us"], a[href*="search"]'))
  );

  // If a row has a .default-content-wrapper, use that as the root for extraction
  const getRoot = (row) => row?.querySelector('.default-content-wrapper') || row;

  return {
    brandRow: getRoot(brandRow),
    navRow: getRoot(navRow),
    toolsRow: getRoot(toolsRow),
  };
}

/**
 * Creates the SVG for the chevron icon.
 * @returns {SVGElement} The SVG element.
 */
function createChevronSvg() {
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
 * Recursively processes a UL element to create nested menus.
 * @param {HTMLUListElement} ulElement The UL element from the fragment.
 * @param {string} parentClass The class to apply to the immediate wrapper (e.g., 'has-sub-child', 'has-inner-sub-child').
 * @returns {HTMLDivElement} The decorated menu wrapper.
 */
function processNestedMenu(ulElement, parentClass = '') {
  if (!ulElement) return null;

  const menuWrapper = createEl('div', [parentClass]);
  const newUl = createEl('ul');
  menuWrapper.append(newUl);

  Array.from(ulElement.children).forEach(li => {
    const newLi = createEl('li');
    let link = li.querySelector('a');
    let textContent = getImmediateText(li);

    if (link) {
      const newLink = createEl('a', [], { href: link.href, target: link.target || '_self' });
      newLink.textContent = link.textContent;
      newLi.append(newLink);
    } else if (textContent) {
      // If no link, but has text, create a span or div for the text
      const textSpan = createEl('span');
      textSpan.textContent = textContent;
      newLi.append(textSpan);
    }

    // Check for nested ULs
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      newLi.classList.add('top-level-li'); // Add this class based on original HTML
      const chevron = createEl('span');
      chevron.append(createChevronSvg());
      newLi.append(chevron);

      const nestedMenu = processNestedMenu(nestedUl, parentClass === 'has-sub-child' ? 'has-inner-sub-child' : 'has-sub-child');
      if (nestedMenu) newLi.append(nestedMenu);
    }
    newUl.append(newLi);
  });
  return menuWrapper;
}

/**
 * Sets up desktop navigation, including mega-menus and their content.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {DocumentFragment} docFrag The document fragment to append elements to.
 * @returns {HTMLUListElement} The decorated main navigation UL.
 */
function setupDesktopNav(navRow) {
  if (!navRow) return null;

  const mainNavUl = createEl('ul', [], { itemscope: '', itemtype: 'http://www.schema.org/SiteNavigationElement' });
  const children = Array.from(navRow.children).filter(el => el.nodeType === Node.ELEMENT_NODE);

  let buffer = []; // Buffer for non-navigation content (left-div content)

  children.forEach(child => {
    // Ignore comments and empty text nodes
    if (child.nodeType === Node.COMMENT_NODE || (child.nodeType === Node.TEXT_NODE && !child.textContent.trim())) {
      return;
    }

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a main navigation trigger
      const navTriggerLink = child.querySelector('a');
      const navTriggerText = navTriggerLink.textContent.trim();
      const navTriggerHref = navTriggerLink.href;

      const li = createEl('li', ['has-child', 'hover-red'], { itemprop: 'name' });
      const a = createEl('a', [], { itemprop: 'url', href: navTriggerHref });
      a.textContent = navTriggerText;
      li.append(a);

      const chevronSpan = createEl('span');
      chevronSpan.append(createChevronSvg());
      li.append(chevronSpan);

      const megaMenu = createEl('div', ['mega-menu']);
      const megaMenuWrap = createEl('div', ['wrap', 'container']);
      const centerDiv = createEl('div', ['center-div']);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);

      // Create and flush buffer to left-div
      if (buffer.length > 0) {
        const leftDiv = createEl('div', ['left-div']);
        // Semantic class generation
        const sanitizedTitle = navTriggerText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);

        buffer.forEach(bufferedItem => leftDiv.append(bufferedItem));
        centerDiv.append(leftDiv);
        buffer = []; // Clear buffer after flushing
      }

      mainNavUl.append(li);
    } else if (child.tagName === 'UL') {
      // This is a sub-navigation UL, attach it to the most recent mega-menu
      const lastLi = mainNavUl.lastElementChild;
      if (lastLi && lastLi.classList.contains('has-child')) {
        const megaMenu = lastLi.querySelector('.mega-menu');
        const centerDiv = megaMenu.querySelector('.center-div');
        const subNavWrap = createEl('div', ['sub-nav-wrap']);
        centerDiv.append(subNavWrap);

        // Recursively process the UL and its children
        const processedMenu = processNestedMenu(child);
        if (processedMenu) {
          // Flatten the structure if it's just a single UL
          if (processedMenu.firstElementChild.tagName === 'UL') {
            subNavWrap.append(processedMenu.firstElementChild);
          } else {
            subNavWrap.append(processedMenu);
          }
        }
      }
    } else if (child.tagName === 'H4' || child.tagName === 'P' || child.querySelector('img')) {
      // Collect other content into the buffer for the next left-div
      buffer.push(child.cloneNode(true));
    }
  });

  return mainNavUl;
}

/**
 * Sets up the brand logo and link.
 * @param {Element} brandRow The brand row element from the fragment.
 * @param {DocumentFragment} docFrag The document fragment to append elements to.
 */
function setupBrand(brandRow) {
  if (!brandRow) return null;

  const logoDiv = createEl('div', ['logo']);
  const logoLink = brandRow.querySelector('a');
  const logoImg = brandRow.querySelector('img');

  if (logoLink && logoImg) {
    const a = createEl('a', [], { href: logoLink.href });
    const img = createEl('img', [], {
      src: logoImg.src || logoImg.closest('picture')?.querySelector('source')?.srcset || '',
      alt: logoImg.alt || 'Brand Logo',
      title: logoImg.title || 'Brand Logo',
      width: logoImg.width || '200',
      height: logoImg.height || '30',
      loading: 'lazy',
    });
    img.classList.add('hiddenlogo1'); // Add original class
    if (logoImg.classList.contains('years-80')) {
      img.classList.add('years-80');
      logoDiv.classList.add('year-80-logo');
    }
    a.append(img);
    logoDiv.append(a);
  } else if (logoImg) {
    // Fallback if no link, but image exists
    const img = createEl('img', [], {
      src: logoImg.src || logoImg.closest('picture')?.querySelector('source')?.srcset || '',
      alt: logoImg.alt || 'Brand Logo',
      title: logoImg.title || 'Brand Logo',
      width: logoImg.width || '200',
      height: logoImg.height || '30',
      loading: 'lazy',
    });
    img.classList.add('hiddenlogo1');
    if (logoImg.classList.contains('years-80')) {
      img.classList.add('years-80');
      logoDiv.classList.add('year-80-logo');
    }
    logoDiv.append(img);
  }
  return logoDiv;
}

/**
 * Sets up the tools section (contact, search, social icons).
 * @param {Element} toolsRow The tools row element from the fragment.
 * @returns {HTMLDivElement} The decorated tools div.
 */
function setupTools(toolsRow) {
  if (!toolsRow) return null;

  const iconNavDesktop = createEl('div', ['icon-nav', 'desktop-menus-icon']);
  const iconNavMobile = createEl('div', ['icon-nav', 'mobile-menus-icon']);
  const ulDesktop = createEl('ul');
  const ulMobile = createEl('ul');

  iconNavDesktop.append(ulDesktop);
  iconNavMobile.append(ulMobile);

  Array.from(toolsRow.children).forEach(child => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach(li => {
        const link = li.querySelector('a');
        if (link) {
          const liDesktop = createEl('li');
          const liMobile = createEl('li');
          const aDesktop = createEl('a', [], { href: link.href, title: link.title || '' });
          const aMobile = createEl('a', [], { href: link.href, title: link.title || '' });

          const linkText = link.textContent.trim().toLowerCase();

          if (linkText === 'contact us') {
            liDesktop.classList.add('mail');
            liMobile.classList.add('mail');
            // Add SVG for desktop, text for mobile
            const mailSvg = `
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4"
                style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
                <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                          C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                          L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
              </svg>`;
            aDesktop.innerHTML = mailSvg;
            aMobile.textContent = 'Contact Us';
          } else if (linkText === 'search') {
            liDesktop.classList.add('search');
            liMobile.classList.add('search');
            liDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
            liMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');

            const searchSvgLens = `
              <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
                <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
              </svg>`;
            const searchSvgClose = `
              <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
              </svg>`;
            const searchSpan = createEl('span', [], { 'data-once': 'search-stop-propagation' });
            searchSpan.textContent = ' Search';
            aDesktop.append(createEl('span', [], { 'data-once': 'search-stop-propagation' })); // Placeholder for SVG if needed
            aDesktop.innerHTML = searchSvgLens + searchSvgClose;
            aMobile.innerHTML = searchSvgLens + searchSvgClose + searchSpan.outerHTML;

            const searchScreenWrap = createEl('div', ['search-screen-wrap'], { 'data-once': 'search-stop-propagation' });
            const searchWrapInner = createEl('div', ['wrap'], { 'data-once': 'search-stop-propagation' });
            searchScreenWrap.append(searchWrapInner);

            const searchForm = createEl('form', [], {
              action: 'https://www.mahindra.com/search',
              method: 'get',
              id: 'search-block-form',
              acceptCharset: 'UTF-8',
              'data-drupal-form-fields': 'edit-keys',
              'data-once': 'search-stop-propagation'
            });
            searchWrapInner.append(searchForm);

            const searchInputWrap = createEl('div', ['search-wrap'], { 'data-once': 'search-stop-propagation' });
            searchForm.append(searchInputWrap);

            const searchIconDiv = createEl('div', ['search-icon'], { 'data-once': 'search-stop-propagation' });
            searchIconDiv.innerHTML = searchSvgLens; // Reuse search lens SVG
            searchInputWrap.append(searchIconDiv);

            const searchInput = createEl('input', ['input-text', 'searchtext'], {
              type: 'text',
              required: '',
              name: 'key',
              id: 'searchInput',
              autocomplete: 'off',
              'data-once': 'search-stop-propagation'
            });
            searchInputWrap.append(searchInput);

            const submitButton = createEl('button', ['submit-button'], { 'data-once': 'search-stop-propagation' });
            submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
                <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
              </svg>`;
            searchInputWrap.append(submitButton);

            // Add search result box and suggestions (empty for now, can be populated dynamically)
            const searchResultBox = createEl('div', ['searchResultBox'], { style: 'display: none;', 'data-once': 'search-stop-propagation' });
            searchResultBox.innerHTML = `
              <div class="swiper scrollSwiper" data-once="search-stop-propagation">
                <div class="swiper-wrapper" data-once="search-stop-propagation">
                  <div class="swiper-slide" data-once="search-stop-propagation"></div>
                </div>
              </div>
              <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>`;
            searchForm.append(searchResultBox);

            const popularKeywords = createEl('div', ['search-suggestions-wrap'], { 'data-once': 'search-stop-propagation' });
            popularKeywords.innerHTML = `
              <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
              <div class="tokens-wrap" data-once="search-stop-propagation">
                <ul data-once="search-stop-propagation">
                  <li data-once="search-stop-propagation">Business</li>
                  <li data-once="search-stop-propagation">FY 21</li>
                  <li data-once="search-stop-propagation">Brands</li>
                  <li data-once="search-stop-propagation">XUV700</li>
                  <li data-once="search-stop-propagation">Global</li>
                  <li data-once="search-stop-propagation">Nanhi Kali</li>
                </ul>
              </div>`;
            searchWrapInner.append(popularKeywords);

            const recommendedKeywords = createEl('div', ['search-suggestions-wrap'], { 'data-once': 'search-stop-propagation' });
            recommendedKeywords.innerHTML = `
              <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
              <div class="tokens-wrap" data-once="search-stop-propagation">
                <ul data-once="search-stop-propagation">
                  <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
                  <li data-once="search-stop-propagation">Leadership Announcement</li>
                  <li data-once="search-stop-propagation">Latest Press Release</li>
                  <li data-once="search-stop-propagation">Brand Guidelines</li>
                </ul>
              </div>`;
            searchWrapInner.append(recommendedKeywords);

            liDesktop.append(searchScreenWrap);
            liMobile.append(searchScreenWrap.cloneNode(true)); // Clone for mobile
          } else {
            // Social icons - assume they are SVGs in original, but here we just use text
            aDesktop.textContent = link.textContent;
            aMobile.textContent = link.textContent;
          }

          liDesktop.prepend(aDesktop);
          ulDesktop.append(liDesktop);

          liMobile.prepend(aMobile);
          ulMobile.append(liMobile);
        }
      });
    }
  });
  return { iconNavDesktop, iconNavMobile };
}

/**
 * Toggles the mobile navigation menu.
 * @param {Element} nav The main nav element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior.
 */
function toggleMenu(block, forceExpanded = null) {
  if (!block) return;

  const mainNav = block.querySelector('.main-nav');
  const hamburger = block.querySelector('.hamburger');

  if (!hamburger || !mainNav) return;

  const expanded = forceExpanded !== null ? forceExpanded : mainNav.getAttribute('aria-expanded') === 'true';

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  mainNav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (!expanded || isDesktop.matches) {
    window.removeEventListener('keydown', (e) => closeOnEscape(e, block));
    block.removeEventListener('focusout', (e) => closeOnFocusLost(e, block));
  } else {
    window.addEventListener('keydown', (e) => closeOnEscape(e, block));
    block.addEventListener('focusout', (e) => closeOnFocusLost(e, block));
  }
}

function closeOnEscape(e, block) {
  if (!block) return;
  if (e.code === 'Escape') {
    const mainNav = block.querySelector('.main-nav');
    const navExpanded = mainNav?.getAttribute('aria-expanded') === 'true';
    if (navExpanded && !isDesktop.matches) {
      toggleMenu(block, false);
    }
  }
}

function closeOnFocusLost(e, block) {
  if (!block || !e.relatedTarget) return;
  if (!block.contains(e.relatedTarget)) {
    const mainNav = block.querySelector('.main-nav');
    const navExpanded = mainNav?.getAttribute('aria-expanded') === 'true';
    if (navExpanded && !isDesktop.matches) {
      toggleMenu(block, false);
    }
  }
}

/**
 * Handles clicks on navigation items to expand/collapse sub-menus.
 * @param {HTMLElement} nav The main navigation element.
 */
function handleNavInteractions(nav) {
  if (!nav) return;

  nav.querySelectorAll('.has-child > a, .has-child > span').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const li = trigger.closest('li.has-child');
      if (!li) return;

      if (!isDesktop.matches) {
        // Mobile behavior: toggle mega-menu visibility
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          const isExpanded = li.classList.toggle('is-expanded');
          megaMenu.style.display = isExpanded ? 'block' : 'none';
        }
      }
    });

    // Handle nested menu toggles
    nav.querySelectorAll('.sub-nav-wrap li.top-level-li > a, .sub-nav-wrap li.top-level-li > span').forEach(nestedTrigger => {
      nestedTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const li = nestedTrigger.closest('li.top-level-li');
        if (!li) return;

        if (!isDesktop.matches) {
          const subMenu = li.querySelector('.has-sub-child, .has-inner-sub-child');
          if (subMenu) {
            const isExpanded = li.classList.toggle('is-expanded');
            subMenu.classList.toggle('active', isExpanded); // Use 'active' for CSS transition
            subMenu.style.maxHeight = isExpanded ? `${subMenu.scrollHeight}px` : '0';
            subMenu.style.opacity = isExpanded ? '1' : '0';
          }
        }
      });
    });
  });

  // Search toggle
  const searchToggle = nav.querySelector('.icon-nav .search > a');
  const searchScreenWrap = nav.querySelector('.search-screen-wrap');
  if (searchToggle && searchScreenWrap) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent closing immediately
      const isActive = searchScreenWrap.classList.toggle('is-active');
      searchScreenWrap.style.opacity = isActive ? '1' : '0';
      searchScreenWrap.style.pointerEvents = isActive ? 'all' : 'none';
      document.body.classList.toggle('search-active', isActive);

      // Toggle search icons
      const lensIcon = searchToggle.querySelector('.lens');
      const closeIcon = searchToggle.querySelector('.close');
      if (lensIcon && closeIcon) {
        lensIcon.style.display = isActive ? 'none' : 'block';
        closeIcon.style.display = isActive ? 'block' : 'none';
      }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchScreenWrap.contains(e.target) && !searchToggle.contains(e.target) && searchScreenWrap.classList.contains('is-active')) {
        searchScreenWrap.classList.remove('is-active');
        searchScreenWrap.style.opacity = '0';
        searchScreenWrap.style.pointerEvents = 'none';
        document.body.classList.remove('search-active');

        const lensIcon = searchToggle.querySelector('.lens');
        const closeIcon = searchToggle.querySelector('.close');
        if (lensIcon && closeIcon) {
          lensIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
      }
    });
  }
}

export default async function decorate(block) {
  // Add root classes from original header
  block.classList.add('main-header', 'solid', 'nav-up');

  // Load nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) {
    block.remove();
    return;
  }

  // Parse fragment into logical rows
  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Create main header structure
  const docFrag = document.createDocumentFragment();
  const containerDiv = createEl('div', ['container']);
  const wrapDiv = createEl('div', ['wrap']);
  containerDiv.append(wrapDiv);
  docFrag.append(containerDiv);

  // 1. Setup Brand Logo
  const logo = setupBrand(brandRow);
  if (logo) wrapDiv.append(logo);

  // 2. Setup Hamburger
  const hamburger = createEl('div', ['hamburger'], { 'data-once': 'hamburger-click nav-close-search' });
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // 3. Setup Main Navigation
  const mainNav = createEl('nav', ['main-nav'], { 'data-once': 'initSubChildToggle' });
  const desktopNavUl = setupDesktopNav(navRow);
  if (desktopNavUl) mainNav.append(desktopNavUl);

  // 4. Setup Tools (Contact, Search, Social)
  const { iconNavDesktop, iconNavMobile } = setupTools(toolsRow);
  if (iconNavMobile) mainNav.append(iconNavMobile); // Mobile icons inside nav for mobile view
  if (iconNavDesktop) desktopNavUl.after(iconNavDesktop); // Desktop icons after main nav ul

  wrapDiv.append(mainNav);

  // Append any 80th year logo if present in the brandRow but not the main logo
  const year80Logo = brandRow.querySelector('.years-80');
  if (year80Logo && !logo.querySelector('.years-80')) {
    const year80LogoDiv = createEl('div', ['logo', 'year-80-logo']);
    const year80Link = year80Logo.closest('a') || createEl('a', [], { href: 'https://www.mahindra.com/' });
    const year80Img = createEl('img', [], {
      src: year80Logo.src || year80Logo.closest('picture')?.querySelector('source')?.srcset || '',
      alt: year80Logo.alt || '80th Year Logo',
      title: year80Logo.title || '80thYearLogo',
      width: year80Logo.width || '74',
      height: year80Logo.height || '60',
      loading: 'lazy',
    });
    year80Img.classList.add('hiddenlogo1', 'years-80');
    year80Link.append(year80Img);
    year80LogoDiv.append(year80Link);
    wrapDiv.append(year80LogoDiv);
  }

  block.append(docFrag);

  // Add event listeners for mobile menu toggle
  hamburger.addEventListener('click', () => toggleMenu(block));
  isDesktop.addEventListener('change', () => toggleMenu(block, isDesktop.matches));
  toggleMenu(block, isDesktop.matches); // Initial state

  // Add event listeners for nav item and search interactions
  handleNavInteractions(block);
}
