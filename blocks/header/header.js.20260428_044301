import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to match original CSS breakpoint

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

const SVG_MAIL = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';

const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

function createEl(tag, classes = [], attributes = {}) {
  const el = document.createElement(tag);
  if (Array.isArray(classes)) {
    el.classList.add(...classes);
  } else if (typeof classes === 'string' && classes.length > 0) {
    el.classList.add(classes);
  }
  Object.keys(attributes).forEach((key) => el.setAttribute(key, attributes[key]));
  return el;
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter((node) => node.nodeType === 1);
  if (sections.length < 3) return {};

  const getSectionContent = (section) => {
    const wrapper = section.querySelector('.default-content-wrapper');
    return wrapper || section;
  };

  return {
    brandRow: getSectionContent(sections[0]),
    navRow: getSectionContent(sections[1]),
    toolsRow: getSectionContent(sections[2]),
  };
}

function setupBrand(brandRow, nav) {
  if (!brandRow) return;

  const logoDiv = createEl('div', 'logo');
  const logoLink = brandRow.querySelector('a');
  if (logoLink) {
    logoLink.classList.add('hiddenlogo1');
    const picture = logoLink.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Transfer attributes from original img to fragment img
        img.setAttribute('width', '200');
        img.setAttribute('height', '30');
        img.setAttribute('style', 'width: auto;');
        img.setAttribute('loading', 'lazy');
      }
      logoLink.prepend(picture);
    }
    logoDiv.append(logoLink);
  } else {
    // Fallback if no link, just append image
    const picture = brandRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('width', '200');
        img.setAttribute('height', '30');
        img.setAttribute('style', 'width: auto;');
        img.setAttribute('loading', 'lazy');
      }
      logoDiv.append(picture);
    }
  }
  nav.append(logoDiv);
}

function setupHamburger(nav, navSections) {
  const hamburger = createEl('div', 'hamburger', { 'data-once': 'hamburger-click nav-close-search', 'aria-label': 'Open navigation', 'aria-expanded': 'false' });
  const ul = createEl('ul');
  for (let i = 0; i < 3; i += 1) {
    ul.append(createEl('li'));
  }
  hamburger.append(ul);
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.append(hamburger);
}

function setupDesktopNav(navRow, mainNavUl) {
  if (!navRow || !mainNavUl) return;

  let currentLeftDivBuffer = [];

  Array.from(navRow.children).forEach((node) => {
    if (node.nodeType !== 1) return; // Skip non-element nodes

    if (node.tagName === 'P' && node.querySelector('a')) {
      // This is a navigation trigger
      const li = createEl('li', ['has-child', 'hover-red'], {
        itemprop: 'name',
        'data-once': 'nav-close-search',
        'aria-expanded': 'false', // Add aria-expanded for accessibility
      });
      const anchor = node.querySelector('a');
      if (anchor) {
        const clonedAnchor = anchor.cloneNode(true);
        clonedAnchor.setAttribute('itemprop', 'url');
        li.append(clonedAnchor);
        const span = createEl('span');
        span.innerHTML = SVG_CHEVRON;
        li.append(span);
      }

      const megaMenu = createEl('div', 'mega-menu');
      const wrapContainer = createEl('div', ['wrap', 'container']);
      const centerDiv = createEl('div', 'center-div');
      const leftDiv = createEl('div', 'left-div');

      // Flush buffer into leftDiv
      currentLeftDivBuffer.forEach((bufferedNode) => {
        leftDiv.append(bufferedNode);
      });
      currentLeftDivBuffer = []; // Clear buffer

      centerDiv.append(leftDiv);
      wrapContainer.append(centerDiv);
      megaMenu.append(wrapContainer);
      li.append(megaMenu);
      mainNavUl.append(li);

      // Look for the next sibling as the submenu
      let nextSibling = node.nextElementSibling;
      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        const subNavWrap = createEl('div', 'sub-nav-wrap');
        processSubMenu(nextSibling, subNavWrap);
        centerDiv.append(subNavWrap);
        // Remove from fragment to avoid re-processing in the main loop
        nextSibling.remove();
      }
    } else {
      // Buffer non-navigation content (headings, paragraphs, lists not part of a submenu)
      currentLeftDivBuffer.push(node.cloneNode(true));
    }
  });
}

function processSubMenu(menuElement, parentContainer) {
  if (!menuElement || !parentContainer) return;

  if (menuElement.tagName === 'UL') {
    const ul = createEl('ul');
    Array.from(menuElement.children).forEach((liElement) => {
      if (liElement.tagName === 'LI') {
        const li = createEl('li');
        const anchor = liElement.querySelector('a');
        if (anchor) {
          li.classList.add('top-level-li');
          li.append(anchor.cloneNode(true));
        } else {
          // If LI contains text directly, use it as label
          const textNode = Array.from(liElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
          if (textNode) {
            const span = createEl('span');
            span.textContent = textNode.textContent.trim();
            li.append(span);
          }
        }

        const nestedUl = liElement.querySelector('ul');
        if (nestedUl) {
          const span = createEl('span');
          span.innerHTML = SVG_CHEVRON;
          li.append(span);

          const hasSubChildDiv = createEl('div', 'has-sub-child');
          const innerUl = createEl('ul');
          processRecursiveList(nestedUl, innerUl); // Recursive call
          hasSubChildDiv.append(innerUl);
          li.append(hasSubChildDiv);
        }
        ul.append(li);
      }
    });
    parentContainer.append(ul);
  } else if (menuElement.tagName === 'DIV') {
    // Handle DIV structures within the mega-menu if needed, e.g., for specific layouts
    Array.from(menuElement.children).forEach((child) => {
      processSubMenu(child, parentContainer); // Recurse for nested structures
    });
  }
}

function processRecursiveList(sourceUl, targetUl) {
  if (!sourceUl || !targetUl) return;

  Array.from(sourceUl.children).forEach((liElement) => {
    if (liElement.tagName === 'LI') {
      const li = createEl('li', 'first-level-li');
      const anchor = liElement.querySelector('a');
      if (anchor) {
        li.append(anchor.cloneNode(true));
      } else {
        // If LI contains text directly, use it as label
        const textNode = Array.from(liElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        if (textNode) {
          const span = createEl('span');
          span.textContent = textNode.textContent.trim();
          li.append(span);
        }
      }

      const nestedUl = liElement.querySelector('ul');
      if (nestedUl) {
        const span = createEl('span');
        span.innerHTML = SVG_CHEVRON;
        li.append(span);

        const hasInnerSubChildDiv = createEl('div', 'has-inner-sub-child');
        const innerUl = createEl('ul');
        processRecursiveList(nestedUl, innerUl); // Recursive call
        hasInnerSubChildDiv.append(innerUl);
        li.append(hasInnerSubChildDiv);
      }
      targetUl.append(li);
    }
  });
}

function setupTools(toolsRow, mainNavUl) {
  if (!toolsRow || !mainNavUl) return;

  const desktopIconNav = createEl('div', ['icon-nav', 'desktop-menus-icon']);
  const desktopUl = createEl('ul');

  const mobileIconNav = createEl('div', ['icon-nav', 'mobile-menus-icon']);
  const mobileUl = createEl('ul');

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const linkText = link.textContent.toLowerCase().trim();
          if (linkText === 'contact us') {
            const mailLiDesktop = createEl('li', 'mail');
            const mailLinkDesktop = link.cloneNode(true);
            mailLinkDesktop.innerHTML = SVG_MAIL;
            mailLiDesktop.append(mailLinkDesktop);
            desktopUl.append(mailLiDesktop);

            const mailLiMobile = createEl('li', 'mail');
            const mailLinkMobile = link.cloneNode(true);
            mailLinkMobile.textContent = link.textContent; // Keep text for mobile
            mailLiMobile.append(mailLinkMobile);
            mobileUl.append(mailLiMobile);
          } else if (linkText === 'search') {
            const searchLiDesktop = createEl('li', 'search', { 'data-once': 'search-toggle search-stop-propagation' });
            const searchLinkDesktop = link.cloneNode(true);
            searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
            searchLinkDesktop.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE;
            searchLiDesktop.append(searchLinkDesktop);
            searchLiDesktop.append(createSearchScreen(link.href)); // Pass search action URL
            desktopUl.append(searchLiDesktop);

            const searchLiMobile = createEl('li', 'search', { 'data-once': 'search-toggle search-stop-propagation' });
            const searchLinkMobile = link.cloneNode(true);
            searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
            searchLinkMobile.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE;
            const searchSpan = createEl('span', [], { 'data-once': 'search-stop-propagation' });
            searchSpan.textContent = link.textContent; // Keep text for mobile
            searchLinkMobile.append(searchSpan);
            searchLiMobile.append(searchLinkMobile);
            searchLiMobile.append(createSearchScreen(link.href)); // Pass search action URL
            mobileUl.append(searchLiMobile);
          } else {
            // Generic handling for other links (e.g., social links)
            const genericLiDesktop = createEl('li');
            genericLiDesktop.append(link.cloneNode(true));
            desktopUl.append(genericLiDesktop);

            const genericLiMobile = createEl('li');
            genericLiMobile.append(link.cloneNode(true));
            mobileUl.append(genericLiMobile);
          }
        }
      });
    }
  });

  desktopIconNav.append(desktopUl);
  mobileIconNav.append(mobileUl);
  mainNavUl.append(mobileIconNav); // Mobile tools inside main nav for responsive toggle
  mainNavUl.append(desktopIconNav); // Desktop tools
}

function createSearchScreen(searchActionUrl) {
  const searchScreenWrap = createEl('div', 'search-screen-wrap', { 'data-once': 'search-stop-propagation' });
  const wrap = createEl('div', 'wrap', { 'data-once': 'search-stop-propagation' });
  searchScreenWrap.append(wrap);

  const form = createEl('form', [], {
    action: searchActionUrl || 'https://www.mahindra.com/search', // Use dynamic URL or fallback
    method: 'get',
    id: 'search-block-form',
    acceptCharset: 'UTF-8',
    'data-drupal-form-fields': 'edit-keys',
    'data-once': 'search-stop-propagation',
  });
  wrap.append(form);

  const searchWrap = createEl('div', 'search-wrap', { 'data-once': 'search-stop-propagation' });
  form.append(searchWrap);

  const searchIcon = createEl('div', 'search-icon', { 'data-once': 'search-stop-propagation' });
  searchIcon.innerHTML = SVG_SEARCH_LENS;
  searchWrap.append(searchIcon);

  const input = createEl('input', ['input-text', 'searchtext'], {
    type: 'text',
    required: '',
    name: 'key',
    id: 'searchInput',
    autocomplete: 'off',
    'data-once': 'search-stop-propagation',
  });
  searchWrap.append(input);

  const submitButton = createEl('button', 'submit-button', { 'data-once': 'search-stop-propagation' });
  const submitLabel = createEl('div', 'label', { 'data-once': 'search-stop-propagation' });
  submitLabel.textContent = 'Submit'; // Hardcoded label, ideally from fragment
  submitButton.append(submitLabel);
  submitButton.innerHTML += SVG_SUBMIT_ARROW; // Append SVG after text
  searchWrap.append(submitButton);

  const searchResultBox = createEl('div', 'searchResultBox', { style: 'display: none;', 'data-once': 'search-stop-propagation' });
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper" data-once="search-stop-propagation">
      <div class="swiper-wrapper" data-once="search-stop-propagation">
        <div class="swiper-slide" data-once="search-stop-propagation"></div>
      </div>
    </div>
    <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
  `;
  form.append(searchResultBox);

  // Popular Keywords (Hardcoded, ideally from fragment or metadata)
  const popularKeywords = createEl('div', 'search-suggestions-wrap', { 'data-once': 'search-stop-propagation' });
  const popularLabel = createEl('div', 'label', { 'data-once': 'search-stop-propagation' });
  popularLabel.textContent = 'Popular Keywords:';
  popularKeywords.append(popularLabel);
  const popularTokensWrap = createEl('div', 'tokens-wrap', { 'data-once': 'search-stop-propagation' });
  const popularUl = createEl('ul', [], { 'data-once': 'search-stop-propagation' });
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach(keyword => {
    const li = createEl('li', [], { 'data-once': 'search-stop-propagation' });
    li.textContent = keyword;
    popularUl.append(li);
  });
  popularTokensWrap.append(popularUl);
  popularKeywords.append(popularTokensWrap);
  wrap.append(popularKeywords);

  // Recommended for you (Hardcoded, ideally from fragment or metadata)
  const recommendedForYou = createEl('div', 'search-suggestions-wrap', { 'data-once': 'search-stop-propagation' });
  const recommendedLabel = createEl('div', 'label', { 'data-once': 'search-stop-propagation' });
  recommendedLabel.textContent = 'Recommended for you:';
  recommendedForYou.append(recommendedLabel);
  const recommendedTokensWrap = createEl('div', 'tokens-wrap', { 'data-once': 'search-stop-propagation' });
  const recommendedUl = createEl('ul', [], { 'data-once': 'search-stop-propagation' });
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach(item => {
    const li = createEl('li', [], { 'data-once': 'search-stop-propagation' });
    li.textContent = item;
    recommendedUl.append(li);
  });
  recommendedTokensWrap.append(recommendedUl);
  recommendedForYou.append(recommendedTokensWrap);
  wrap.append(recommendedForYou);

  return searchScreenWrap;
}


function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('li[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
      nav.querySelector('.hamburger').focus();
    }
    // Close search if open
    const searchScreen = document.querySelector('.search-screen-wrap.active');
    if (searchScreen) {
      searchScreen.classList.remove('active');
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
      document.body.style.overflowY = '';
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;
    toggleAllNavSections(navSections, false);
    toggleMenu(nav, navSections, false);
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.closest('li.has-child');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    e.preventDefault(); // Prevent default scroll behavior for space key
    const dropExpanded = isNavDrop.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(isNavDrop.closest('.main-nav > ul'), false);
    isNavDrop.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element (main-nav > ul)
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    if (!expanded) {
      // Also close any nested expanded menus
      section.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach((sub) => {
        sub.classList.remove('active', 'active-child');
        // Reset chevron rotation
        const chevron = sub.closest('li').querySelector('span svg');
        if (chevron) {
          chevron.style.transform = 'rotate(90deg)';
        }
      });
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element (header nav)
 * @param {Element} navSections The nav sections within the container element (main-nav > ul)
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true'); // Update hamburger aria-expanded

  mainNav.style.transform = expanded ? 'translate(-100%,0)' : 'translate(0,0)';
  mainNav.style.opacity = expanded ? '0' : '1';

  toggleAllNavSections(navSections, !expanded); // Toggle sections to match nav state

  if (hamburger) {
    hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('li.has-child');
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
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function setupMegaMenuInteractions(mainNavUl) {
  if (!mainNavUl) return;

  mainNavUl.querySelectorAll('li.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(mainNavUl, false); // Close others
          li.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          li.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile click handler for top-level nav items
      const chevronSpan = li.querySelector('span');
      if (chevronSpan) {
        chevronSpan.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            e.stopPropagation();
            const expanded = li.getAttribute('aria-expanded') === 'true';
            li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            megaMenu.style.display = expanded ? 'none' : 'block';
            chevronSpan.querySelector('svg').style.transform = expanded ? 'rotate(90deg)' : 'rotate(-180deg)';
          }
        });
      }
    }

    // Nested menu interactions for mobile
    li.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const parentLi = subChild.closest('li');
      const chevron = parentLi.querySelector('span svg'); // Chevron for this level
      if (chevron) {
        chevron.style.transform = 'rotate(90deg)'; // Initial state for mobile
        chevron.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            e.stopPropagation();
            subChild.classList.toggle('active');
            chevron.style.transform = subChild.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        });
      }
    });

    li.querySelectorAll('.has-inner-sub-child').forEach((innerSubChild) => {
      const parentLi = innerSubChild.closest('li');
      const chevron = parentLi.querySelector('span svg'); // Chevron for this level
      if (chevron) {
        chevron.style.transform = 'rotate(90deg)'; // Initial state for mobile
        chevron.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            e.stopPropagation();
            innerSubChild.classList.toggle('active-child');
            chevron.style.transform = innerSubChild.classList.contains('active-child') ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        });
      }
    });
  });
}

function setupSearchInteractions(block) {
  const searchToggleButtons = block.querySelectorAll('.icon-nav .search > a');
  const searchScreen = block.querySelector('.search-screen-wrap');
  const body = document.body;

  if (!searchToggleButtons || !searchScreen) return;

  searchToggleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing

      const isSearchActive = searchScreen.classList.contains('active');

      if (isSearchActive) {
        searchScreen.classList.remove('active');
        searchScreen.style.opacity = '0';
        searchScreen.style.pointerEvents = 'none';
        body.style.overflowY = '';
      } else {
        searchScreen.classList.add('active');
        searchScreen.style.opacity = '1';
        searchScreen.style.pointerEvents = 'all';
        body.style.overflowY = 'hidden';
      }
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (searchScreen.classList.contains('active') && !searchScreen.contains(e.target) && !Array.from(searchToggleButtons).some(btn => btn.contains(e.target))) {
      searchScreen.classList.remove('active');
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
      body.style.overflowY = '';
    }
  });

  // Prevent closing when clicking inside the search screen
  searchScreen.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

export default async function decorate(block) {
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.textContent = '';
    return;
  }

  // Create the main header structure
  const headerContainer = createEl('div', 'container');
  const headerWrap = createEl('div', 'wrap');
  headerContainer.append(headerWrap);
  block.append(headerContainer);

  const navElement = createEl('nav', 'main-nav', {
    id: 'nav',
    'data-once': 'initSubChildToggle',
  });
  const mainNavUl = createEl('ul', [], {
    itemscope: '',
    itemtype: 'http://www.schema.org/SiteNavigationElement',
  });
  navElement.append(mainNavUl);

  // Parse fragment into logical sections
  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  setupBrand(brandRow, headerWrap);

  // 2. Setup Hamburger menu (mobile)
  setupHamburger(navElement, mainNavUl);

  // 3. Setup Main Navigation
  setupDesktopNav(navRow, mainNavUl);

  // 4. Setup Tools/Utility Icons
  setupTools(toolsRow, mainNavUl);

  headerWrap.append(navElement);

  // Add the 80th-year logo if available in the fragment (assuming it's after main nav in original HTML)
  // This part is hardcoded, ideally it should come from the fragment if it's dynamic content.
  const year80LogoDiv = createEl('div', ['logo', 'year-80-logo']);
  const year80LogoLink = createEl('a', [], { href: 'https://www.mahindra.com/' });
  const year80LogoImg = createEl('img', ['hiddenlogo1', 'years-80'], {
    src: 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp', // Placeholder, ideally from fragment
    alt: '80th Year Logo Gold',
    title: '80thYearLogo_Gold',
    width: '74',
    height: '60',
    loading: 'lazy',
  });
  year80LogoLink.append(year80LogoImg);
  year80LogoDiv.append(year80LogoLink);
  headerWrap.append(year80LogoDiv); // Append after main nav

  // Initial state for mobile nav
  navElement.setAttribute('aria-expanded', 'false');
  toggleMenu(navElement, mainNavUl, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(navElement, mainNavUl, isDesktop.matches));

  // Setup mega menu interactions
  setupMegaMenuInteractions(mainNavUl);

  // Setup search interactions
  setupSearchInteractions(block);
}
