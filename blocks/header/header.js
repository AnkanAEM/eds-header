import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

// Utility function to create an element with classes and attributes
function createEl(tag, classes, attributes) {
  const el = document.createElement(tag);
  if (classes) el.classList.add(...(Array.isArray(classes) ? classes : [classes]));
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  return el;
}

// SVG for the chevron icon
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';

const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';

const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';

const SEARCH_SUBMIT_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {object} An object containing the brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;
  let year80LogoRow = null; // Added for the year 80 logo

  // Identify rows based on content
  for (const child of children) {
    if (child.querySelector('picture, img')) {
      // Check for year-80-logo specifically
      if (child.querySelector('img[alt*="80th Year Logo"]')) {
        year80LogoRow = child;
      } else {
        brandRow = child;
      }
    } else if (child.querySelector('p > a') && child.querySelector('ul')) {
      navRow = child;
    } else if (child.querySelector('ul')) {
      toolsRow = child;
    }
  }

  // Handle default-content-wrapper if present
  const unwrap = (row) => (row && row.children.length === 1 && row.firstElementChild.classList.contains('default-content-wrapper')
    ? row.firstElementChild
    : row);

  return {
    brandRow: unwrap(brandRow),
    navRow: unwrap(navRow),
    toolsRow: unwrap(toolsRow),
    year80LogoRow: unwrap(year80LogoRow), // Return the year 80 logo row
  };
}

/**
 * Recursively parses UL/LI structure for navigation.
 * @param {HTMLUListElement} ulElement The UL element to parse.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function parseNavList(ulElement) {
  const newUl = createEl('ul');
  const listItems = Array.from(ulElement.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI');

  listItems.forEach((li) => {
    const newLi = createEl('li');
    const link = li.querySelector('a');
    const textNodes = Array.from(li.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

    if (link) {
      newLi.append(link);
    } else if (textNodes.length > 0) {
      const span = createEl('span');
      span.textContent = textNodes[0].textContent.trim();
      newLi.append(span);
    }

    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      newLi.classList.add('top-level-li'); // For mobile, identifies expandable parent
      newLi.append(createEl('span', '', { innerHTML: CHEVRON_SVG })); // Add chevron for expandable
      const subMenuContainer = createEl('div', 'has-sub-child');
      // Directly append the parsed nested UL, no extra UL wrapper
      subMenuContainer.append(parseNavList(nestedUl));
      newLi.append(subMenuContainer);
    }
    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row from the fragment.
 * @param {HTMLUListElement} navUl The main navigation UL to populate.
 */
function setupDesktopNav(navRow, navUl) {
  if (!navRow || !navUl) return;

  let currentLeftDivContent = [];

  Array.from(navRow.children).filter((node) => node.nodeType === Node.ELEMENT_NODE).forEach((child) => {
    // If it's a paragraph with a link, it's a main nav trigger
    if (child.tagName === 'P' && child.firstElementChild && child.firstElementChild.tagName === 'A') {
      const triggerLink = child.firstElementChild;
      const li = createEl('li', ['has-child', 'hover-red'], { itemprop: 'name' });
      const a = createEl('a', '', {
        itemprop: 'url',
        href: triggerLink.href,
        textContent: triggerLink.textContent,
      });
      li.append(a);
      li.append(createEl('span', '', { innerHTML: CHEVRON_SVG }));

      // Find the next UL sibling, which is the mega menu content
      let nextSibling = child.nextElementSibling;
      while (nextSibling && nextSibling.nodeType !== Node.ELEMENT_NODE) {
        nextSibling = nextSibling.nextElementSibling;
      }

      if (nextSibling && nextSibling.tagName === 'UL') {
        const megaMenu = createEl('div', 'mega-menu');
        const wrap = createEl('div', ['wrap', 'container']);
        const centerDiv = createEl('div', 'center-div');

        // Add buffered content to left-div
        if (currentLeftDivContent.length > 0) {
          const leftDiv = createEl('div', 'left-div');
          const title = triggerLink.textContent.trim();
          const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);

          const h4 = createEl('h4', 'left-div-heading');
          const h4Link = createEl('a', '', { textContent: title });
          h4.append(h4Link);
          leftDiv.append(h4);

          currentLeftDivContent.forEach((content) => {
            if (content.tagName === 'P') {
              const p = createEl('p', content.classList.contains('left-div-subdesc') ? 'left-div-subdesc' : 'left-div-desc');
              p.textContent = content.textContent;
              leftDiv.append(p);
            } else if (content.tagName === 'UL') {
              const ul = createEl('ul');
              Array.from(content.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI').forEach((item) => {
                const itemText = item.textContent.trim();
                const parts = itemText.split(/(\d+\.?\d*|\D+)/).filter(Boolean).map((s) => s.trim());
                const liItem = createEl('li', 'list-text-red');
                if (parts.length > 1) {
                  liItem.textContent = parts[0];
                  const span = createEl('span');
                  span.textContent = parts.slice(1).join(' ');
                  liItem.append(span);
                } else {
                  liItem.textContent = itemText;
                }
                ul.append(liItem);
              });
              leftDiv.append(ul);
            } else if (content.classList.contains('slides')) {
              // Handle newsroom specific content
              const latestPressReleaseDiv = createEl('div', 'latest-two-press-release');
              Array.from(content.children).filter((slide) => slide.nodeType === Node.ELEMENT_NODE).forEach((slide) => {
                const slideWrap = createEl('div', 'slides');
                slideWrap.append(slide.cloneNode(true)); // Clone to avoid moving original elements
                latestPressReleaseDiv.append(slideWrap);
              });
              leftDiv.append(latestPressReleaseDiv);
            } else {
              leftDiv.append(content.cloneNode(true)); // Append other elements as is
            }
          });
          centerDiv.append(leftDiv);
        }
        currentLeftDivContent = []; // Clear buffer after use

        const subNavWrap = createEl('div', 'sub-nav-wrap');
        // Add specific classes for certain menus
        const sanitizedTitle = triggerLink.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (sanitizedTitle === 'who-we-are') subNavWrap.classList.add('about-us-sub-nav');
        if (sanitizedTitle === 'what-we-do') subNavWrap.classList.add('what-we-do');
        if (sanitizedTitle === 'careers') subNavWrap.classList.add('careers-div');
        if (sanitizedTitle === 'investor-relations') subNavWrap.classList.add('element-block');

        // Special handling for Investor Relations to split into two ULs
        if (sanitizedTitle === 'investor-relations') {
          const allLiElements = Array.from(nextSibling.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI');
          const firstLinkLi = allLiElements.find((li) => li.querySelector('a[href*="Disclosures"]'));

          if (firstLinkLi) {
            const singleLinkUl = createEl('ul', 'sub-nav-wrap-one-link');
            singleLinkUl.append(parseNavList(createEl('ul', '', {}, firstLinkLi.outerHTML)));
            subNavWrap.append(singleLinkUl);

            const innerSubNavWrapList = createEl('div', 'inner-sub-nav-wrap-list');
            const remainingLis = allLiElements.filter((li) => li !== firstLinkLi);

            const ul1 = createEl('ul');
            const ul2 = createEl('ul');

            remainingLis.forEach((li, index) => {
              if (index < Math.ceil(remainingLis.length / 2)) {
                ul1.append(li.cloneNode(true)); // Clone to avoid moving original elements
              } else {
                ul2.append(li.cloneNode(true)); // Clone to avoid moving original elements
              }
            });
            innerSubNavWrapList.append(parseNavList(ul1));
            innerSubNavWrapList.append(parseNavList(ul2));
            subNavWrap.append(innerSubNavWrapList);
          } else {
            // Fallback if the specific link is not found
            subNavWrap.append(parseNavList(nextSibling));
          }
        } else {
          subNavWrap.append(parseNavList(nextSibling));
        }

        centerDiv.append(subNavWrap);
        wrap.append(centerDiv);
        megaMenu.append(wrap);
        li.append(megaMenu);
        navUl.append(li);
      }
    } else {
      // Buffer non-navigation content (P, H, other ULs)
      currentLeftDivContent.push(child);
    }
  });
}

/**
 * Sets up the utility tools (contact, search, social).
 * @param {Element} toolsRow The tools row from the fragment.
 * @param {Element} nav The main nav element.
 */
function setupTools(toolsRow, nav) {
  if (!toolsRow || !nav) return;

  const desktopIconNav = createEl('div', ['icon-nav', 'desktop-menus-icon']);
  const desktopUl = createEl('ul');
  desktopIconNav.append(desktopUl);

  const mobileIconNav = createEl('div', ['icon-nav', 'mobile-menus-icon']);
  const mobileUl = createEl('ul');
  mobileIconNav.append(mobileUl);

  Array.from(toolsRow.children).filter((node) => node.nodeType === Node.ELEMENT_NODE).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI').forEach((li) => {
        const link = li.querySelector('a');
        if (!link) return;

        if (link.textContent.toLowerCase() === 'contact us') {
          // Desktop Contact Us
          const desktopLi = createEl('li', 'mail');
          const desktopA = createEl('a', '', { href: link.href, innerHTML: MAIL_SVG });
          desktopLi.append(desktopA);
          desktopUl.append(desktopLi);

          // Mobile Contact Us
          const mobileLi = createEl('li', 'mail');
          const mobileA = createEl('a', '', { href: link.href, textContent: link.textContent }); // Use dynamic textContent
          mobileLi.append(mobileA);
          mobileUl.append(mobileLi);
        } else if (link.textContent.toLowerCase() === 'search') {
          // Desktop Search
          const desktopLi = createEl('li', 'search', { 'data-once': 'search-toggle search-stop-propagation' });
          const desktopA = createEl('a', '', { href: '#', 'data-once': 'search-stop-propagation' });
          desktopA.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
          desktopLi.append(desktopA);
          desktopLi.append(createSearchScreen(li)); // Pass the original LI to extract dynamic content
          desktopUl.append(desktopLi);

          // Mobile Search
          const mobileLi = createEl('li', 'search', { 'data-once': 'search-toggle search-stop-propagation' });
          const mobileA = createEl('a', '', { href: '#', 'data-once': 'search-stop-propagation' });
          mobileA.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
          mobileA.append(createEl('span', '', { textContent: ` ${link.textContent}`, 'data-once': 'search-stop-propagation' })); // Use dynamic textContent
          mobileLi.append(mobileA);
          mobileLi.append(createSearchScreen(li)); // Pass the original LI to extract dynamic content
          mobileUl.append(mobileLi);
        }
      });
    }
  });
  nav.append(desktopIconNav);
  nav.append(mobileIconNav);
}

/**
 * Creates the search screen DOM structure.
 * @param {Element} originalLi The original LI element from the fragment containing search data.
 * @returns {Element} The search screen wrap element.
 */
function createSearchScreen(originalLi) {
  const searchScreenWrap = createEl('div', 'search-screen-wrap', { 'data-once': 'search-stop-propagation' });
  const wrap = createEl('div', 'wrap', { 'data-once': 'search-stop-propagation' });
  searchScreenWrap.append(wrap);

  // Extract search form details from the original LI if available
  const originalForm = originalLi.querySelector('form');
  const formAction = originalForm ? originalForm.action : 'https://www.mahindra.com/search'; // Fallback
  const formMethod = originalForm ? originalForm.method : 'get'; // Fallback

  const form = createEl('form', '', {
    action: formAction,
    method: formMethod,
    id: 'search-block-form',
    'accept-charset': 'UTF-8',
    'data-drupal-form-fields': 'edit-keys',
    'data-once': 'search-stop-propagation',
  });
  wrap.append(form);

  const searchWrap = createEl('div', 'search-wrap', { 'data-once': 'search-stop-propagation' });
  form.append(searchWrap);

  const searchIcon = createEl('div', 'search-icon', { 'data-once': 'search-stop-propagation' });
  searchIcon.innerHTML = SEARCH_LENS_SVG;
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
  const submitLabel = originalLi.querySelector('.submit-button .label');
  const labelText = submitLabel ? submitLabel.textContent.trim() : 'Submit'; // Dynamic label
  const label = createEl('div', 'label', { textContent: labelText, 'data-once': 'search-stop-propagation' });
  submitButton.append(label);
  submitButton.innerHTML += SEARCH_SUBMIT_SVG;
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

  // Popular Keywords
  const popularKeywordsSection = originalLi.querySelector('.search-suggestions-wrap:first-of-type');
  if (popularKeywordsSection) {
    const popularKeywords = createEl('div', 'search-suggestions-wrap', { 'data-once': 'search-stop-propagation' });
    const popularLabel = popularKeywordsSection.querySelector('.label');
    if (popularLabel) {
      popularKeywords.append(createEl('div', 'label', { textContent: popularLabel.textContent, 'data-once': 'search-stop-propagation' }));
    }
    const popularTokensWrap = createEl('div', 'tokens-wrap', { 'data-once': 'search-stop-propagation' });
    const popularUl = createEl('ul', '', { 'data-once': 'search-stop-propagation' });
    Array.from(popularKeywordsSection.querySelectorAll('.tokens-wrap ul li')).forEach((li) => {
      popularUl.append(createEl('li', '', { textContent: li.textContent, 'data-once': 'search-stop-propagation' }));
    });
    popularTokensWrap.append(popularUl);
    popularKeywords.append(popularTokensWrap);
    wrap.append(popularKeywords);
  }

  // Recommended for you
  const recommendedKeywordsSection = originalLi.querySelector('.search-suggestions-wrap:last-of-type');
  if (recommendedKeywordsSection) {
    const recommendedKeywords = createEl('div', 'search-suggestions-wrap', { 'data-once': 'search-stop-propagation' });
    const recommendedLabel = recommendedKeywordsSection.querySelector('.label');
    if (recommendedLabel) {
      recommendedKeywords.append(createEl('div', 'label', { textContent: recommendedLabel.textContent, 'data-once': 'search-stop-propagation' }));
    }
    const recommendedTokensWrap = createEl('div', 'tokens-wrap', { 'data-once': 'search-stop-propagation' });
    const recommendedUl = createEl('ul', '', { 'data-once': 'search-stop-propagation' });
    Array.from(recommendedKeywordsSection.querySelectorAll('.tokens-wrap ul li')).forEach((li) => {
      recommendedUl.append(createEl('li', '', { textContent: li.textContent, 'data-once': 'search-stop-propagation' }));
    });
    recommendedTokensWrap.append(recommendedUl);
    recommendedKeywords.append(recommendedTokensWrap);
    wrap.append(recommendedKeywords);
  }

  return searchScreenWrap;
}

/**
 * Toggles the mobile menu visibility and ARIA attributes.
 * @param {Element} nav The main navigation element.
 * @param {boolean} forceExpanded Optional boolean to force expand/collapse state.
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const isCurrentlyExpanded = nav.getAttribute('aria-expanded') === 'true';
  const expanded = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded; // Toggle if not forced
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  if (!hamburger || !mainNav) return;

  document.body.style.overflowY = expanded ? '' : 'hidden'; // Control body scroll
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');

  if (expanded) {
    mainNav.style.transform = 'translate(0,0)';
    mainNav.style.opacity = '1';
    hamburger.classList.add('is-active');
  } else {
    mainNav.style.transform = 'translate(-100%,0)';
    mainNav.style.opacity = '0';
    hamburger.classList.remove('is-active');
  }
}

/**
 * Adds event listeners for mobile navigation interactions.
 * @param {Element} nav The main navigation element.
 */
function setupMobileNavInteraction(nav) {
  if (!nav) return;

  const mainNav = nav.querySelector('.main-nav');
  if (!mainNav) return;

  mainNav.querySelectorAll('.has-child > a').forEach((link) => {
    const parentLi = link.closest('li.has-child');
    const chevron = parentLi.querySelector('span:last-child'); // The chevron span
    const megaMenu = parentLi.querySelector('.mega-menu');

    if (parentLi && chevron && megaMenu) {
      const toggleSubMenu = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent parent link from navigating
        const isMegaMenuExpanded = megaMenu.style.display === 'block';
        megaMenu.style.display = isMegaMenuExpanded ? 'none' : 'block';
        if (isMegaMenuExpanded) {
          chevron.style.transform = 'rotate(90deg)';
        } else {
          chevron.style.transform = 'rotate(-90deg)';
        }
      };
      link.addEventListener('click', toggleSubMenu);
      chevron.addEventListener('click', toggleSubMenu);
    }
  });

  mainNav.querySelectorAll('.has-sub-child .top-level-li > a').forEach((link) => {
    const parentLi = link.closest('li.top-level-li');
    const chevron = parentLi.querySelector('span:last-child');
    const subMenu = parentLi.querySelector('.has-sub-child');

    if (parentLi && chevron && subMenu) {
      const toggleInnerSubMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = subMenu.classList.contains('active');
        if (isActive) {
          subMenu.classList.remove('active');
          chevron.style.transform = 'rotate(90deg)';
        } else {
          subMenu.classList.add('active');
          chevron.style.transform = 'rotate(-90deg)';
        }
      };
      link.addEventListener('click', toggleInnerSubMenu);
      chevron.addEventListener('click', toggleInnerSubMenu);
    }
  });
}

/**
 * Handles search toggle functionality.
 * @param {Element} block The header block element.
 */
function setupSearchToggle(block) {
  const searchTriggers = block.querySelectorAll('.icon-nav .search > a');
  const searchScreen = block.querySelector('.search-screen-wrap');
  const navElement = block.querySelector('nav'); // Get the nav element for aria-expanded

  if (!searchTriggers.length || !searchScreen) return;

  const closeSearch = () => {
    searchScreen.classList.remove('is-active');
    block.classList.remove('search-active');
    searchTriggers.forEach((trigger) => {
      const lensIcon = trigger.querySelector('.lens');
      const closeIcon = trigger.querySelector('.close');
      if (lensIcon && closeIcon) {
        lensIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  };

  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent nav items from closing
      const isExpanded = searchScreen.classList.toggle('is-active');
      block.classList.toggle('search-active', isExpanded);

      const lensIcon = trigger.querySelector('.lens');
      const closeIcon = trigger.querySelector('.close');

      if (lensIcon && closeIcon) {
        lensIcon.style.display = isExpanded ? 'none' : 'block';
        closeIcon.style.display = isExpanded ? 'block' : 'none';
      }

      // Close mobile menu if open
      if (navElement && navElement.getAttribute('aria-expanded') === 'true') {
        toggleMenu(navElement, false); // Force collapse
      }

      // Focus on search input when opened
      if (isExpanded) {
        const searchInput = searchScreen.querySelector('#searchInput');
        if (searchInput) searchInput.focus();
      }
    });
  });

  // Close search screen when clicking outside or pressing escape
  document.addEventListener('click', (e) => {
    // Check if the click is outside the search screen AND not on a search trigger
    const isClickOutsideSearchScreen = !searchScreen.contains(e.target);
    const isClickOnSearchTrigger = Array.from(searchTriggers).some(trigger => trigger.contains(e.target));

    if (isClickOutsideSearchScreen && !isClickOnSearchTrigger && searchScreen.classList.contains('is-active')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchScreen.classList.contains('is-active')) {
      closeSearch();
    }
  });
}

/**
 * Decorates the header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  block.classList.add('main-header', 'solid'); // Add base classes

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.remove();
    return;
  }

  const { brandRow, navRow, toolsRow, year80LogoRow } = parseStructure(fragment);

  const docFragment = document.createDocumentFragment();

  const container = createEl('div', 'container');
  docFragment.append(container);

  const wrap = createEl('div', 'wrap');
  container.append(wrap);

  // 1. Brand Logo
  if (brandRow) {
    const logoDiv = createEl('div', 'logo');
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('img');

    if (brandLink && brandImg) {
      const a = createEl('a', '', { href: brandLink.href });
      const img = createEl('img', '', {
        src: brandImg.src,
        alt: brandImg.alt || 'Brand Logo',
        title: brandImg.title || 'Brand Logo',
        width: brandImg.width || '200',
        height: brandImg.height || '30',
        loading: 'lazy',
      });
      a.append(img);
      logoDiv.append(a);
    }
    wrap.append(logoDiv);
  }

  // 2. Hamburger for Mobile
  const hamburger = createEl('div', 'hamburger', { 'data-once': 'hamburger-click nav-close-search' });
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  // 3. Main Navigation
  const nav = createEl('nav', 'main-nav', { 'data-once': 'initSubChildToggle' });
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile
  wrap.append(nav);

  const navUl = createEl('ul', '', { itemscope: '', itemtype: 'http://www.schema.org/SiteNavigationElement' });
  nav.append(navUl);

  setupDesktopNav(navRow, navUl);
  setupTools(toolsRow, nav);

  // 4. Year 80 Logo (dynamic from fragment)
  if (year80LogoRow) {
    const year80LogoDiv = createEl('div', ['logo', 'year-80-logo']);
    const year80Link = year80LogoRow.querySelector('a');
    const year80Img = year80LogoRow.querySelector('img');

    if (year80Link && year80Img) {
      const a = createEl('a', '', { href: year80Link.href });
      const img = createEl('img', '', {
        src: year80Img.src,
        alt: year80Img.alt || '80th Year Logo',
        title: year80Img.title || '80thYearLogo_Gold',
        class: year80Img.className || 'hiddenlogo1 years-80',
        width: year80Img.width || '74',
        height: year80Img.height || '60',
        loading: 'lazy',
      });
      a.append(img);
      year80LogoDiv.append(a);
    }
    wrap.append(year80LogoDiv);
  }

  block.append(docFragment);

  // Event Listeners for Mobile Menu
  hamburger.addEventListener('click', () => toggleMenu(nav));
  isDesktop.addEventListener('change', () => toggleMenu(nav, !isDesktop.matches)); // Toggle based on desktop match
  toggleMenu(nav, !isDesktop.matches); // Set initial state (false for desktop, true for mobile)
  setupMobileNavInteraction(nav);
  setupSearchToggle(block);

  // Desktop hover interactions for mega menus
  if (isDesktop.matches) {
    navUl.querySelectorAll('li.has-child').forEach((li) => {
      const megaMenu = li.querySelector('.mega-menu');
      if (megaMenu) {
        li.addEventListener('mouseenter', () => {
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
          megaMenu.style.transform = 'translate(0,0)';
        });
        li.addEventListener('mouseleave', () => {
          megaMenu.style.opacity = '0';
          megaMenu.style.pointerEvents = 'none';
          megaMenu.style.transform = 'translate(0,0)'; // Reset transform
        });
      }
    });

    // Desktop sub-menu interactions (e.g., for "What we do" -> "Industries")
    navUl.querySelectorAll('.mega-menu .sub-nav-wrap .top-level-li').forEach((li) => {
      const subMenu = li.querySelector('.has-sub-child');
      if (subMenu) {
        li.addEventListener('mouseenter', () => {
          subMenu.classList.add('active');
        });
        li.addEventListener('mouseleave', () => {
          subMenu.classList.remove('active');
        });
      }
    });

    navUl.querySelectorAll('.mega-menu .sub-nav-wrap .has-sub-child .first-level-li').forEach((li) => {
      const innerSubMenu = li.querySelector('.has-inner-sub-child');
      if (innerSubMenu) {
        li.addEventListener('mouseenter', () => {
          innerSubMenu.classList.add('active-child');
        });
        li.addEventListener('mouseleave', () => {
          innerSubMenu.classList.remove('active-child');
        });
      }
    });
  }
}
