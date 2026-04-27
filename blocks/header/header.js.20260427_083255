import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// SVG for chevron icon (from original HTML)
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

// SVG for search icon (from original HTML)
const SEARCH_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';

// SVG for close icon (from original HTML)
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';

// SVG for mail icon (from original HTML)
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on original CSS

/**
 * Parses the fragment to identify the brand, navigation, and tools sections.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element, searchKeywords: Element[], recommendedKeywords: Element[]}} Identified sections.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;
  let searchKeywords = [];
  let recommendedKeywords = [];

  // Identify Brand Row: contains a picture or img
  brandRow = sections.find((s) => s.querySelector('p > picture, img'));

  // Identify Tools Row: contains social links or a contact-us link
  toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], a[href="#"]'));

  // Identify Nav Row: contains both a link (button) and a UL
  navRow = sections.find((s) => s !== brandRow && s !== toolsRow && (s.querySelector('p > a') || s.querySelector('a.button')) && s.querySelector('ul'));

  // Extract search keywords from the toolsRow if available
  const searchScreenWrap = toolsRow?.querySelector('.search-screen-wrap');
  if (searchScreenWrap) {
    const popularKeywordsUl = searchScreenWrap.querySelector('.search-suggestions-wrap:nth-of-type(1) .tokens-wrap ul');
    if (popularKeywordsUl) {
      searchKeywords = Array.from(popularKeywordsUl.children);
    }
    const recommendedKeywordsUl = searchScreenWrap.querySelector('.search-suggestions-wrap:nth-of-type(2) .tokens-wrap ul');
    if (recommendedKeywordsUl) {
      recommendedKeywords = Array.from(recommendedKeywordsUl.children);
    }
  }

  return { brandRow, navRow, toolsRow, searchKeywords, recommendedKeywords };
}

/**
 * Recursively decorates nested ULs with appropriate classes and chevrons.
 * @param {HTMLUListElement} ul The UL element to decorate.
 * @param {string} liClass Class for the current LI level (e.g., 'first-level-li').
 * @param {string} divClass Class for the sub-child container (e.g., 'has-inner-sub-child').
 */
function decorateNestedUl(ul, liClass, divClass) {
  if (!ul) return;

  Array.from(ul.children).forEach((li) => {
    li.classList.add(liClass);
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      const link = li.querySelector('a');
      if (link) {
        // Add chevron to parent LI if it has a nested UL
        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        link.insertAdjacentElement('afterend', span);
      }
      const div = document.createElement('div');
      div.classList.add(divClass);
      div.append(nestedUl);
      li.append(div);
      decorateNestedUl(nestedUl, 'first-level-li', 'has-inner-sub-child'); // Recursively apply classes
    }
  });
}

/**
 * Sets up the desktop navigation structure from the navRow fragment.
 * @param {Element} navSectionsContainer The container for nav sections.
 * @param {Element} navRow The navigation row fragment content.
 */
function setupDesktopNav(navSectionsContainer, navRow) {
  if (!navSectionsContainer || !navRow) return;

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLi = null;
  let leftDivContentBuffer = [];

  Array.from(navRow.children).forEach((child) => {
    const link = child.querySelector('p > a') || child.querySelector('a.button');

    if (link) {
      // If a new main navigation item (link) is found, create a new li.has-child
      if (currentLi) {
        // Flush buffer to previous currentLi's mega-menu if it exists
        const prevMegaMenuLeftDiv = currentLi.querySelector('.mega-menu .left-div');
        if (prevMegaMenuLeftDiv && leftDivContentBuffer.length > 0) {
          leftDivContentBuffer.forEach((item) => prevMegaMenuLeftDiv.append(item));
          leftDivContentBuffer = []; // Clear buffer
        }
      }

      currentLi = document.createElement('li');
      currentLi.classList.add('has-child', 'hover-red');
      currentLi.setAttribute('itemprop', 'name');
      currentLi.setAttribute('aria-haspopup', 'true');
      currentLi.setAttribute('aria-expanded', 'false');
      currentLi.setAttribute('data-expanded', 'false');

      const a = document.createElement('a');
      a.setAttribute('itemprop', 'url');
      a.href = link.href;
      a.textContent = link.textContent;
      a.setAttribute('role', 'button'); // Add role for accessibility
      currentLi.append(a);

      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      currentLi.append(span);

      mainUl.append(currentLi);

      // Create mega-menu structure
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      // Add semantic class to left-div
      const title = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      leftDiv.classList.add(`${title}-left-div`);

      centerDiv.append(leftDiv);
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);
      wrapDiv.append(centerDiv);
      megaMenu.append(wrapDiv);
      currentLi.append(megaMenu);
    } else if (currentLi) {
      // If not a link, it's either a UL or other content for the mega-menu
      if (child.tagName === 'UL') {
        const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          const clonedUl = child.cloneNode(true);
          decorateNestedUl(clonedUl, 'top-level-li', 'has-sub-child');
          subNavWrap.append(clonedUl);
        }
      } else {
        // Collect other content (h4, p, etc.) for the left-div
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    }
  });

  // Flush any remaining buffer to the last currentLi's mega-menu
  if (currentLi) {
    const prevMegaMenuLeftDiv = currentLi.querySelector('.mega-menu .left-div');
    if (prevMegaMenuLeftDiv && leftDivContentBuffer.length > 0) {
      leftDivContentBuffer.forEach((item) => prevMegaMenuLeftDiv.append(item));
    }
  }

  navSectionsContainer.append(mainUl);
}

/**
 * Creates the search screen wrap element.
 * @param {string} searchFormAction The action URL for the search form.
 * @param {Element[]} popularKeywords The list of popular keyword LIs.
 * @param {Element[]} recommendedKeywords The list of recommended keyword LIs.
 * @param {string} searchButtonText The text for the search button.
 * @returns {Element} The search screen wrap element.
 */
function createSearchScreenWrap(searchFormAction, popularKeywords, recommendedKeywords, searchButtonText) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');

  const searchForm = document.createElement('form');
  searchForm.action = searchFormAction;
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchInputWrap.innerHTML = `
    <div class="search-icon">${SEARCH_SVG}</div>
    <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
    <button class="submit-button">
      <div class="label"> ${searchButtonText} </div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
      </svg>
    </button>
  `;
  searchForm.append(searchInputWrap);

  // Search Result Box (empty, as content is dynamic)
  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
      </div>
    </div>
    <div class="swiper-scrollbar"></div>
  `;
  searchForm.append(searchResultBox);

  // Search Suggestions (Popular Keywords)
  const popularKeywordsDiv = document.createElement('div');
  popularKeywordsDiv.classList.add('search-suggestions-wrap');
  popularKeywordsDiv.innerHTML = `
    <div class="label">Popular Keywords:</div>
    <div class="tokens-wrap">
      <ul></ul>
    </div>
  `;
  const popularKeywordsUl = popularKeywordsDiv.querySelector('ul');
  popularKeywords.forEach((li) => popularKeywordsUl.append(li.cloneNode(true)));
  searchForm.append(popularKeywordsDiv);

  // Search Suggestions (Recommended for you)
  const recommendedKeywordsDiv = document.createElement('div');
  recommendedKeywordsDiv.classList.add('search-suggestions-wrap');
  recommendedKeywordsDiv.innerHTML = `
    <div class="label">Recommended for you:</div>
    <div class="tokens-wrap">
      <ul></ul>
    </div>
  `;
  const recommendedKeywordsUl = recommendedKeywordsDiv.querySelector('ul');
  recommendedKeywords.forEach((li) => recommendedKeywordsUl.append(li.cloneNode(true)));
  searchForm.append(recommendedKeywordsDiv);

  searchWrapInner.append(searchForm);
  searchScreenWrap.append(searchWrapInner);
  return searchScreenWrap;
}

/**
 * Sets up the mobile navigation.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 * @param {Element} toolsRow The tools row fragment content.
 * @param {string} searchFormAction The action URL for the search form.
 * @param {Element[]} popularKeywords The list of popular keyword LIs.
 * @param {Element[]} recommendedKeywords The list of recommended keyword LIs.
 */
function setupMobileNav(nav, navSections, toolsRow, searchFormAction, popularKeywords, recommendedKeywords) {
  if (!nav || !navSections) return;

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');

  const mobileNavContainer = document.createElement('nav');
  mobileNavContainer.classList.add('main-nav');
  mobileNavContainer.setAttribute('aria-hidden', 'true'); // Hidden by default

  // Clone and append desktop nav structure for mobile
  const desktopNavUl = navSections.querySelector('ul');
  if (desktopNavUl) {
    const mobileUl = desktopNavUl.cloneNode(true);
    mobileNavContainer.append(mobileUl);
  }

  // Add mobile-specific tools/icons
  const mobileMenusIcon = document.createElement('div');
  mobileMenusIcon.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileToolsUl = document.createElement('ul');

  // Contact Us link
  const contactUsLi = document.createElement('li');
  contactUsLi.classList.add('mail');
  const contactUsLink = toolsRow?.querySelector('a[href*="contact-us"]');
  if (contactUsLink) {
    const a = document.createElement('a');
    a.href = contactUsLink.href;
    a.textContent = contactUsLink.textContent;
    contactUsLi.append(a);
    mobileToolsUl.append(contactUsLi);
  }

  // Search functionality
  const searchLi = document.createElement('li');
  searchLi.classList.add('search');
  const searchLink = toolsRow?.querySelector('a[href="#"]'); // Assuming search link is #
  if (searchLink) {
    const a = document.createElement('a');
    a.href = searchLink.href;
    a.innerHTML = SEARCH_SVG + CLOSE_SVG + ` <span>${searchLink.textContent}</span>`;
    searchLi.append(a);

    const searchScreenWrap = createSearchScreenWrap(searchFormAction, popularKeywords, recommendedKeywords, 'Submit');
    searchLi.append(searchScreenWrap);
    mobileToolsUl.append(searchLi);
  }

  mobileMenusIcon.append(mobileToolsUl);
  mobileNavContainer.append(mobileMenusIcon);

  // Append mobile nav and hamburger to the overall nav container
  nav.prepend(hamburger);
  nav.append(mobileNavContainer);

  // Hamburger click listener
  hamburger.addEventListener('click', () => {
    const isExpanded = nav.classList.toggle('nav-expanded');
    mobileNavContainer.style.transform = isExpanded ? 'translate(0,0)' : 'translate(-100%,0)';
    document.body.style.overflowY = isExpanded ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    mobileNavContainer.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', isExpanded ? 'Close navigation' : 'Open navigation');
  });

  // Mobile nav dropdown toggles
  mobileNavContainer.querySelectorAll('.has-child > a + span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentLi = span.closest('li.has-child');
      if (parentLi) {
        const megaMenu = parentLi.querySelector('.mega-menu');
        if (megaMenu) {
          const isMegaMenuExpanded = megaMenu.style.display === 'block';
          megaMenu.style.display = isMegaMenuExpanded ? 'none' : 'block';
          span.querySelector('svg').style.transform = isMegaMenuExpanded ? 'rotate(90deg)' : 'rotate(-90deg)';
        }
      }
    });
  });

  mobileNavContainer.querySelectorAll('.top-level-li > a + span, .first-level-li > a + span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentLi = span.closest('li.top-level-li, li.first-level-li');
      if (parentLi) {
        const subChildDiv = parentLi.querySelector('.has-sub-child, .has-inner-sub-child');
        if (subChildDiv) {
          const isSubChildExpanded = subChildDiv.classList.toggle('active');
          span.querySelector('svg').style.transform = isSubChildExpanded ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      }
    });
  });

  // Search toggle for mobile
  const mobileSearchLink = mobileToolsUl.querySelector('li.search > a');
  const mobileSearchScreen = mobileToolsUl.querySelector('.search-screen-wrap');

  if (mobileSearchLink && mobileSearchScreen) {
    mobileSearchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isSearchExpanded = mobileSearchScreen.classList.toggle('active'); // Use 'active' class
      mobileSearchScreen.style.display = isSearchExpanded ? 'block' : 'none';
      mobileSearchLink.querySelector('.lens').style.display = isSearchExpanded ? 'none' : 'block';
      mobileSearchLink.querySelector('.close').style.display = isSearchExpanded ? 'block' : 'none';
      document.body.style.overflowY = isSearchExpanded ? 'hidden' : '';
    });

    mobileSearchScreen.addEventListener('click', (e) => e.stopPropagation());
  }
}

/**
 * Sets up accessibility attributes.
 * @param {Element} nav The main nav element.
 */
function setupAccessibility(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child > a').forEach((link) => {
    const li = link.closest('li.has-child');
    if (li && li.querySelector('.mega-menu')) {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', li.getAttribute('data-expanded') || 'false');
    }
  });

  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-label', 'Open navigation');
    hamburger.setAttribute('aria-controls', 'nav');
  }

  const mobileNavContainer = nav.querySelector('.main-nav:not(.nav-sections)');
  if (mobileNavContainer) {
    mobileNavContainer.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Toggles the main navigation menu and its sections.
 * @param {Element} nav The main nav element.
 * @param {boolean} forceExpanded Forces the menu to a specific state (true for expanded, false for collapsed).
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('nav-expanded');

  // Toggle main nav expansion
  nav.classList.toggle('nav-expanded', expanded);
  document.body.style.overflowY = expanded ? 'hidden' : '';

  // Toggle hamburger icon state
  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.classList.toggle('is-active', expanded); // Assuming 'is-active' class for hamburger animation
    hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  }

  // Close all mega-menus and sub-menus when the main menu is closed
  if (!expanded) {
    nav.querySelectorAll('.mega-menu').forEach((megaMenu) => {
      megaMenu.style.display = 'none';
      megaMenu.style.opacity = '0';
      megaMenu.style.pointerEvents = 'none';
    });
    nav.querySelectorAll('li.has-child > a').forEach((link) => {
      link.setAttribute('aria-expanded', 'false');
      link.closest('li.has-child')?.setAttribute('data-expanded', 'false');
    });
    nav.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((sub) => {
      sub.classList.remove('active');
      const chevron = sub.closest('li')?.querySelector('span svg');
      if (chevron) chevron.style.transform = 'rotate(90deg)';
    });

    // Close search screens
    nav.querySelectorAll('.search-screen-wrap').forEach((searchScreen) => {
      searchScreen.classList.remove('active');
      searchScreen.style.display = 'none';
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
      const searchLink = searchScreen.closest('li.search')?.querySelector('a');
      if (searchLink) {
        searchLink.querySelector('.lens').style.display = 'block';
        searchLink.querySelector('.close').style.display = 'none';
      }
    });
  }
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
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav'); // Add main-nav class to the <nav> element

  // Parse fragment sections
  const { brandRow, navRow, toolsRow, searchKeywords, recommendedKeywords } = parseStructure(fragment);

  // Extract search form action and button text from toolsRow
  const searchFormAction = toolsRow?.querySelector('form')?.action || 'https://www.mahindra.com/search';
  const searchButtonText = toolsRow?.querySelector('.submit-button .label')?.textContent || 'Submit';

  // Create main header wrapper
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');

  // Add brand section
  const navBrand = document.createElement('div');
  navBrand.classList.add('logo', 'nav-brand');
  if (brandRow) {
    const brandLink = brandRow.querySelector('p > picture, img')?.closest('a') || document.createElement('a');
    if (!brandLink.href) brandLink.href = '/'; // Default home link
    const brandImg = brandRow.querySelector('picture, img');
    if (brandImg) {
      brandLink.append(brandImg.cloneNode(true));
      navBrand.append(brandLink);
    }
  }
  headerWrap.append(navBrand);

  // Add nav sections
  const navSectionsContainer = document.createElement('div');
  navSectionsContainer.classList.add('main-nav', 'nav-sections'); // Add main-nav to this container as well
  if (navRow) {
    setupDesktopNav(navSectionsContainer, navRow);
  }
  headerWrap.append(navSectionsContainer);

  // Add desktop tools/icons
  const desktopMenusIcon = document.createElement('div');
  desktopMenusIcon.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopToolsUl = document.createElement('ul');

  // Mail icon
  const mailLi = document.createElement('li');
  mailLi.classList.add('mail');
  const contactUsLink = toolsRow?.querySelector('a[href*="contact-us"]');
  if (contactUsLink) {
    const a = document.createElement('a');
    a.href = contactUsLink.href;
    a.innerHTML = MAIL_SVG;
    mailLi.append(a);
    desktopToolsUl.append(mailLi);
  }

  // Search icon
  const searchLi = document.createElement('li');
  searchLi.classList.add('search');
  const searchLink = toolsRow?.querySelector('a[href="#"]'); // Assuming search link is #
  if (searchLink) {
    const a = document.createElement('a');
    a.href = searchLink.href;
    a.innerHTML = SEARCH_SVG + CLOSE_SVG;
    searchLi.append(a);

    const searchScreenWrap = createSearchScreenWrap(searchFormAction, searchKeywords, recommendedKeywords, searchButtonText);
    searchLi.append(searchScreenWrap);
    desktopToolsUl.append(searchLi);
  }
  desktopMenusIcon.append(desktopToolsUl);
  headerWrap.append(desktopMenusIcon);

  // Add 80th year logo if present in the fragment
  const year80Logo = fragment.querySelector('.years-80');
  if (year80Logo) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'year-80-logo');
    const logoLink = year80Logo.closest('a') || document.createElement('a');
    if (!logoLink.href) logoLink.href = '/';
    logoLink.append(year80Logo.cloneNode(true));
    logoDiv.append(logoLink);
    headerWrap.append(logoDiv);
  }

  headerContainer.append(headerWrap);
  nav.append(headerContainer);
  block.append(nav);

  // Setup mobile nav (this will prepend the hamburger)
  setupMobileNav(nav, navSectionsContainer, toolsRow, searchFormAction, searchKeywords, recommendedKeywords);

  // Desktop mega-menu hover logic
  navSectionsContainer.querySelectorAll('li.has-child').forEach((li) => {
    const link = li.querySelector('a');
    const megaMenu = li.querySelector('.mega-menu');

    if (link && megaMenu) {
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
          link.setAttribute('aria-expanded', 'true');
          li.setAttribute('data-expanded', 'true');
        }
      });

      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          megaMenu.style.opacity = '0';
          megaMenu.style.pointerEvents = 'none';
          link.setAttribute('aria-expanded', 'false');
          li.setAttribute('data-expanded', 'false');
        }
      });
    }
  });

  // Desktop search toggle logic
  const desktopSearchLi = desktopToolsUl.querySelector('li.search');
  const desktopSearchLink = desktopSearchLi?.querySelector('a');
  const desktopSearchScreen = desktopSearchLi?.querySelector('.search-screen-wrap');

  if (desktopSearchLink && desktopSearchScreen) {
    desktopSearchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isSearchExpanded = desktopSearchScreen.classList.toggle('active'); // Use 'active' class
      desktopSearchScreen.style.opacity = isSearchExpanded ? '1' : '0';
      desktopSearchScreen.style.pointerEvents = isSearchExpanded ? 'all' : 'none';
      desktopSearchLink.querySelector('.lens').style.display = isSearchExpanded ? 'none' : 'block';
      desktopSearchLink.querySelector('.close').style.display = isSearchExpanded ? 'block' : 'none';
    });

    desktopSearchScreen.addEventListener('click', (e) => e.stopPropagation());
  }

  // Initial setup for desktop/mobile state
  const applyDesktopState = () => {
    const mobileNavEl = nav.querySelector('.main-nav:not(.nav-sections)');
    const mobileSearchScreen = nav.querySelector('.icon-nav.mobile-menus-icon .search-screen-wrap');
    const desktopSearchLink = desktopToolsUl.querySelector('li.search > a');
    const desktopSearchScreen = desktopToolsUl.querySelector('.search-screen-wrap');

    if (isDesktop.matches) {
      nav.classList.remove('nav-expanded');
      document.body.style.overflowY = '';
      navSectionsContainer.querySelectorAll('.mega-menu').forEach((megaMenu) => {
        megaMenu.style.display = ''; // Reset display for desktop hover
        megaMenu.style.opacity = '0';
        megaMenu.style.pointerEvents = 'none';
      });
      navSectionsContainer.querySelectorAll('li.has-child > a').forEach((link) => {
        link.setAttribute('aria-expanded', 'false');
        link.closest('li.has-child')?.setAttribute('data-expanded', 'false');
      });
      navSectionsContainer.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((sub) => {
        sub.classList.remove('active');
        const chevron = sub.closest('li')?.querySelector('span svg');
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      });

      // Ensure mobile nav is hidden
      if (mobileNavEl) {
        mobileNavEl.style.transform = 'translate(-100%,0)';
        mobileNavEl.setAttribute('aria-hidden', 'true');
      }
      if (mobileSearchScreen) {
        mobileSearchScreen.classList.remove('active');
        mobileSearchScreen.style.display = 'none';
      }
      const mobileHamburger = nav.querySelector('.hamburger');
      if (mobileHamburger) {
        mobileHamburger.setAttribute('aria-expanded', 'false');
        mobileHamburger.classList.remove('is-active');
      }
    } else {
      // Reset desktop hover states for mobile
      navSectionsContainer.querySelectorAll('.mega-menu').forEach((megaMenu) => {
        megaMenu.style.opacity = '';
        megaMenu.style.pointerEvents = '';
        megaMenu.style.display = 'none'; // Ensure hidden by default on mobile
      });
      navSectionsContainer.querySelectorAll('li.has-child > a').forEach((link) => {
        link.setAttribute('aria-expanded', 'false');
        link.closest('li.has-child')?.setAttribute('data-expanded', 'false');
      });
      // Ensure desktop search is closed
      if (desktopSearchScreen && desktopSearchLink) {
        desktopSearchScreen.classList.remove('active');
        desktopSearchScreen.style.opacity = '0';
        desktopSearchScreen.style.pointerEvents = 'none';
        desktopSearchLink.querySelector('.lens').style.display = 'block';
        desktopSearchLink.querySelector('.close').style.display = 'none';
      }
    }
  };

  applyDesktopState();
  isDesktop.addEventListener('change', applyDesktopState);

  // Escape key listener to close all menus/search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (nav.classList.contains('nav-expanded')) {
        toggleMenu(nav, false); // Close mobile nav
      }
      // Close desktop search if open
      const desktopSearchLi = desktopToolsUl.querySelector('li.search');
      const desktopSearchLink = desktopSearchLi?.querySelector('a');
      const desktopSearchScreen = desktopSearchLi?.querySelector('.search-screen-wrap');
      if (desktopSearchScreen?.classList.contains('active')) {
        desktopSearchScreen.classList.remove('active');
        desktopSearchScreen.style.opacity = '0';
        desktopSearchScreen.style.pointerEvents = 'none';
        if (desktopSearchLink) {
          desktopSearchLink.querySelector('.lens').style.display = 'block';
          desktopSearchLink.querySelector('.close').style.display = 'none';
        }
      }
    }
  });

  // Setup accessibility attributes after all DOM manipulation
  setupAccessibility(nav);
}
