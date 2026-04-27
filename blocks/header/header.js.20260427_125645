import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

// SVG for the chevron icon
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

// SVG for the mail icon
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';

// SVG for the search lens icon
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';

// SVG for the search close icon
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';

// SVG for the search submit arrow icon
const SEARCH_SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment into its main structural components.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {object} An object containing the brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children);
  // Assuming the structure is always Brand, Nav, Tools
  const brandRow = children[0];
  const navRow = children[1];
  const toolsRow = children[2];
  return { brandRow, navRow, toolsRow };
}

/**
 * Creates a list of keywords from a given element.
 * @param {HTMLElement} element The element containing keywords (e.g., a UL).
 * @returns {HTMLElement} A div containing the label and tokens wrap.
 */
function createKeywordSection(element, labelText) {
  if (!element || element.children.length === 0) return null;

  const keywordsWrap = document.createElement('div');
  keywordsWrap.classList.add('search-suggestions-wrap');

  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.textContent = labelText;
  keywordsWrap.append(labelDiv);

  const tokensWrap = document.createElement('div');
  tokensWrap.classList.add('tokens-wrap');
  const ul = document.createElement('ul');

  Array.from(element.children).forEach(li => {
    const newLi = document.createElement('li');
    newLi.textContent = li.textContent.trim();
    ul.append(newLi);
  });
  tokensWrap.append(ul);
  keywordsWrap.append(tokensWrap);
  return keywordsWrap;
}

/**
 * Creates the search screen DOM.
 * @param {HTMLElement} searchContent The search content from the fragment (if any).
 * @returns {HTMLElement} The search screen wrap element.
 */
function createSearchScreen(searchContent) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const form = document.createElement('form');
  // Form action and method should be dynamic if possible, but often hardcoded for search
  form.action = searchContent?.querySelector('form')?.action || 'https://www.mahindra.com/search';
  form.method = searchContent?.querySelector('form')?.method || 'get';
  form.id = 'search-block-form';
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  wrapDiv.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  form.append(searchWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.innerHTML = SEARCH_LENS_SVG;
  searchWrap.append(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  // Label "Submit" is hardcoded in original HTML, so keeping it here.
  submitButton.innerHTML = '<div class="label"> Submit </div>' + SEARCH_SUBMIT_ARROW_SVG;
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initially hidden
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
      </div>
    </div>
    <div class="swiper-scrollbar"></div>
  `;
  form.append(searchResultBox);

  // Extract popular keywords and recommended for you from fragment if available
  const popularKeywordsElement = searchContent?.querySelector('.search-suggestions-wrap:nth-of-type(1) ul');
  const recommendedKeywordsElement = searchContent?.querySelector('.search-suggestions-wrap:nth-of-type(2) ul');

  if (popularKeywordsElement) {
    const popularKeywordsSection = createKeywordSection(popularKeywordsElement, 'Popular Keywords:');
    if (popularKeywordsSection) wrapDiv.append(popularKeywordsSection);
  }

  if (recommendedKeywordsElement) {
    const recommendedKeywordsSection = createKeywordSection(recommendedKeywordsElement, 'Recommended for you:');
    if (recommendedKeywordsSection) wrapDiv.append(recommendedKeywordsSection);
  }

  return searchScreenWrap;
}


/**
 * Sets up the desktop navigation structure.
 * @param {HTMLElement} navRow The navigation row from the fragment.
 * @returns {HTMLElement} The decorated main nav element.
 */
function setupDesktopNav(navRow) {
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');

  const ul = document.createElement('ul');
  ul.setAttribute('itemscope', '');
  ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(ul);

  if (!navRow) return mainNav;

  let currentLi = null;
  let buffer = []; // To collect non-UL/P elements for left-div

  Array.from(navRow.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a new top-level nav item trigger
      // Flush buffer to previous item's left-div if it exists
      if (currentLi && buffer.length > 0) {
        const megaMenu = currentLi.querySelector('.mega-menu');
        if (megaMenu) {
          const centerDiv = megaMenu.querySelector('.center-div');
          if (centerDiv) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const link = currentLi.querySelector('a');
            if (link) {
              const sanitizedTitle = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
              leftDiv.classList.add(`${sanitizedTitle}-left-div`);
            }
            buffer.forEach((b) => leftDiv.append(b));
            centerDiv.prepend(leftDiv);
          }
        }
        buffer = []; // Reset buffer
      }

      currentLi = document.createElement('li');
      currentLi.classList.add('has-child', 'hover-red');
      currentLi.setAttribute('itemprop', 'name');
      currentLi.setAttribute('data-once', 'nav-close-search');

      const anchor = child.querySelector('a');
      const newAnchor = document.createElement('a');
      newAnchor.href = anchor.href;
      newAnchor.textContent = anchor.textContent;
      newAnchor.setAttribute('itemprop', 'url');
      currentLi.append(newAnchor);

      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      currentLi.append(span);

      ul.append(currentLi);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      currentLi.append(megaMenu);

      const wrapContainer = document.createElement('div');
      wrapContainer.classList.add('wrap', 'container');
      megaMenu.append(wrapContainer);

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      wrapContainer.append(centerDiv);

    } else if (child.tagName === 'UL' && currentLi) {
      // This UL is the submenu for the current top-level item
      const megaMenu = currentLi.querySelector('.mega-menu');
      if (megaMenu) {
        const centerDiv = megaMenu.querySelector('.center-div');
        if (centerDiv) {
          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          centerDiv.append(subNavWrap);

          // Function to recursively parse and append ULs
          const parseAndAppendUl = (parentUl, targetElement) => {
            Array.from(parentUl.children).forEach((li) => {
              const newLi = document.createElement('li');
              const liAnchor = li.querySelector('a');
              if (liAnchor) {
                const newAnchor = document.createElement('a');
                newAnchor.href = liAnchor.href;
                newAnchor.textContent = liAnchor.textContent;
                if (liAnchor.target) newAnchor.target = liAnchor.target;
                newLi.append(newAnchor);
              } else {
                // If LI has no anchor, it might be a text node or contain other elements
                newLi.textContent = li.textContent.trim();
              }

              const nestedUl = li.querySelector('ul');
              if (nestedUl) {
                newLi.classList.add('top-level-li');
                const span = document.createElement('span');
                span.innerHTML = CHEVRON_SVG;
                newLi.append(span);

                const hasSubChild = document.createElement('div');
                hasSubChild.classList.add('has-sub-child');
                const innerUl = document.createElement('ul');
                hasSubChild.append(innerUl);
                newLi.append(hasSubChild);
                parseAndAppendUl(nestedUl, innerUl);
              }
              targetElement.append(newLi);
            });
          };

          // Check if the fragment UL has multiple direct UL children or just LIs
          const directUls = Array.from(child.children).filter(el => el.tagName === 'LI' && el.querySelector('ul'));
          if (directUls.length > 0) {
            // Complex structure with nested ULs directly under the main UL
            const mainUl = document.createElement('ul');
            parseAndAppendUl(child, mainUl);
            subNavWrap.append(mainUl);
          } else {
            // Simple list or multiple simple lists
            const newUl = document.createElement('ul');
            parseAndAppendUl(child, newUl);
            subNavWrap.append(newUl);
          }
        }
      }
    } else if (currentLi) {
      // Collect non-navigation siblings into the buffer for the left-div
      buffer.push(child.cloneNode(true));
    }
  });

  // Flush any remaining buffer for the last item
  if (currentLi && buffer.length > 0) {
    const megaMenu = currentLi.querySelector('.mega-menu');
    if (megaMenu) {
      const centerDiv = megaMenu.querySelector('.center-div');
      if (centerDiv) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const link = currentLi.querySelector('a');
        if (link) {
          const sanitizedTitle = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        }
        buffer.forEach((b) => leftDiv.append(b));
        centerDiv.prepend(leftDiv);
      }
    }
  }

  return mainNav;
}


/**
 * Sets up the utility tools section (contact, search, social).
 * @param {HTMLElement} toolsRow The tools row from the fragment.
 * @returns {object} An object containing the decorated icon nav elements for desktop and mobile, and the search screen.
 */
function setupTools(toolsRow) {
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulDesktop = document.createElement('ul');
  iconNavDesktop.append(ulDesktop);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulMobile = document.createElement('ul');
  iconNavMobile.append(ulMobile);

  let searchScreenDesktop = null;
  let searchScreenMobile = null;

  if (!toolsRow) return { iconNavDesktop, iconNavMobile, searchScreenDesktop, searchScreenMobile };

  // Find the search content within the toolsRow for dynamic generation
  const searchContent = toolsRow.querySelector('.search-screen-wrap');
  if (searchContent) {
    searchScreenDesktop = createSearchScreen(searchContent);
    searchScreenMobile = createSearchScreen(searchContent);
  }

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const liDesktop = document.createElement('li');
          const liMobile = document.createElement('li');
          const newLinkDesktop = document.createElement('a');
          const newLinkMobile = document.createElement('a');

          newLinkDesktop.href = link.href;
          newLinkMobile.href = link.href;

          if (link.textContent.toLowerCase() === 'contact us') {
            liDesktop.classList.add('mail');
            newLinkDesktop.innerHTML = MAIL_SVG;
            newLinkMobile.textContent = link.textContent; // Mobile shows text
            liMobile.classList.add('mail');
          } else if (link.textContent.toLowerCase() === 'search') {
            liDesktop.classList.add('search');
            liDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
            newLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
            newLinkDesktop.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;

            liMobile.classList.add('search');
            liMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
            newLinkMobile.setAttribute('data-once', 'search-stop-propagation');
            newLinkMobile.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG + `<span> ${link.textContent}</span>`;

            if (searchScreenMobile) {
              liMobile.append(searchScreenMobile);
            }
          } else {
            // Assume social links or other generic links
            newLinkDesktop.title = link.title;
            newLinkDesktop.textContent = link.textContent;
            newLinkMobile.title = link.title;
            newLinkMobile.textContent = link.textContent;
          }
          liDesktop.append(newLinkDesktop);
          ulDesktop.append(liDesktop);

          liMobile.append(newLinkMobile);
          ulMobile.append(liMobile);
        }
      });
    }
  });

  // Append the desktop search screen once to the desktop search li
  const desktopSearchLi = ulDesktop.querySelector('.search');
  if (desktopSearchLi && searchScreenDesktop) {
    desktopSearchLi.append(searchScreenDesktop);
  }

  return { iconNavDesktop, iconNavMobile };
}

/**
 * Handles toggling of the mobile navigation menu and sub-menus.
 * @param {HTMLElement} nav The main navigation element.
 * @param {HTMLElement} navSections The container for navigation sections.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = document.querySelector('.hamburger'); // Select hamburger globally as it's not a child of nav
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  // Toggle hamburger active class
  if (!expanded) {
    hamburger.classList.add('active');
  } else {
    hamburger.classList.remove('active');
  }

  // Close all sub-menus when main nav closes
  if (expanded) {
    navSections.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((sub) => {
      sub.classList.remove('active', 'active-child');
    });
    navSections.querySelectorAll('.mega-menu').forEach((menu) => {
      menu.style.display = 'none';
    });
    navSections.querySelectorAll('.has-child > span').forEach((span) => {
      span.style.transform = 'rotate(90deg)';
    });
  }
}

/**
 * Handles toggling of sub-menus in mobile view.
 * @param {HTMLElement} li The list item representing the menu trigger.
 * @param {HTMLElement} subMenu The sub-menu element to toggle.
 * @param {HTMLElement} chevronSpan The chevron icon span.
 */
function toggleSubMenu(li, subMenu, chevronSpan) {
  if (!li || !subMenu || !chevronSpan) return;

  const isExpanded = subMenu.classList.contains('active') || subMenu.classList.contains('active-child');
  if (isExpanded) {
    subMenu.classList.remove('active', 'active-child');
    chevronSpan.style.transform = 'rotate(90deg)';
    // For mega-menu specifically
    const megaMenu = subMenu.closest('.mega-menu');
    if (megaMenu) megaMenu.style.display = 'none';
  } else {
    // Close other open sub-menus at the same level
    const parentUl = li.closest('ul');
    if (parentUl) {
      Array.from(parentUl.children).forEach((siblingLi) => {
        if (siblingLi !== li) {
          const siblingSubMenu = siblingLi.querySelector('.has-sub-child, .has-inner-sub-child');
          const siblingChevron = siblingLi.querySelector('span');
          if (siblingSubMenu && (siblingSubMenu.classList.contains('active') || siblingSubMenu.classList.contains('active-child'))) {
            siblingSubMenu.classList.remove('active', 'active-child');
            if (siblingChevron) siblingChevron.style.transform = 'rotate(90deg)';
            const siblingMegaMenu = siblingSubMenu.closest('.mega-menu');
            if (siblingMegaMenu) siblingMegaMenu.style.display = 'none';
          }
        }
      });
    }

    subMenu.classList.add(subMenu.classList.contains('has-sub-child') ? 'active' : 'active-child');
    chevronSpan.style.transform = 'rotate(-90deg)'; // Rotate chevron for open state
    // For mega-menu specifically
    const megaMenu = subMenu.closest('.mega-menu');
    if (megaMenu) megaMenu.style.display = 'block';
  }
}


/**
 * Toggles the search screen visibility.
 * @param {HTMLElement} searchLi The search list item.
 */
function toggleSearchScreen(searchLi) {
  if (!searchLi) return;
  const searchScreenWrap = searchLi.querySelector('.search-screen-wrap');
  const searchLens = searchLi.querySelector('.lens');
  const searchClose = searchLi.querySelector('.close');
  const mainHeader = document.querySelector('.main-header');

  if (!searchScreenWrap || !searchLens || !searchClose || !mainHeader) return;

  const isSearchOpen = searchScreenWrap.style.display === 'block';

  if (isSearchOpen) {
    searchScreenWrap.style.display = 'none';
    searchLens.style.display = 'block';
    searchClose.style.display = 'none';
    mainHeader.classList.remove('search-open');
  } else {
    searchScreenWrap.style.display = 'block';
    searchLens.style.display = 'none';
    searchClose.style.display = 'block';
    mainHeader.classList.add('search-open');
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
  block.textContent = ''; // Clear existing content

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');
  block.append(header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > picture > img')?.closest('p')?.querySelector('a') || brandRow.querySelector('p > a');
    if (brandLink) {
      const newLink = document.createElement('a');
      newLink.href = brandLink.href;
      const img = brandLink.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        newImg.title = img.title || '';
        newImg.classList.add('hiddenlogo1');
        newImg.width = img.width || '200';
        newImg.height = img.height || '30';
        newImg.style.width = img.style.width || 'auto';
        newImg.loading = img.loading || 'lazy';
        newLink.append(newImg);
      }
      logoDiv.append(newLink);
    }
    wrap.append(logoDiv);
  }

  // 2. Setup Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  // 3. Setup Main Navigation
  const mainNav = setupDesktopNav(navRow);
  mainNav.id = 'nav'; // Add ID to mainNav for easier reference
  mainNav.setAttribute('aria-expanded', 'false'); // Initial state for accessibility
  wrap.append(mainNav);

  // 4. Setup Tools (Contact, Search, Social)
  const { iconNavDesktop, iconNavMobile } = setupTools(toolsRow);
  mainNav.append(iconNavMobile); // Mobile tools inside nav
  wrap.append(iconNavDesktop); // Desktop tools outside nav

  // 5. Add event listeners for navigation and search
  // Toggle main navigation for mobile
  hamburger.addEventListener('click', () => toggleMenu(mainNav, mainNav.querySelector('ul')));

  // Toggle search screen
  const desktopSearchLi = iconNavDesktop.querySelector('.search');
  const mobileSearchLi = iconNavMobile.querySelector('.search');

  if (desktopSearchLi) {
    desktopSearchLi.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing
      toggleSearchScreen(desktopSearchLi);
    });
    // Close search when clicking outside search screen
    desktopSearchLi.querySelector('.search-screen-wrap')?.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
      if (!desktopSearchLi.contains(e.target)) {
        const searchScreenWrap = desktopSearchLi.querySelector('.search-screen-wrap');
        const searchLens = desktopSearchLi.querySelector('.lens');
        const searchClose = desktopSearchLi.querySelector('.close');
        const mainHeader = document.querySelector('.main-header');
        if (searchScreenWrap && searchScreenWrap.style.display === 'block') {
          searchScreenWrap.style.display = 'none';
          searchLens.style.display = 'block';
          searchClose.style.display = 'none';
          mainHeader.classList.remove('search-open');
        }
      }
    });
  }

  if (mobileSearchLi) {
    mobileSearchLi.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearchScreen(mobileSearchLi);
    });
    // Close search when clicking outside search screen
    mobileSearchLi.querySelector('.search-screen-wrap')?.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
      if (!mobileSearchLi.contains(e.target)) {
        const searchScreenWrap = mobileSearchLi.querySelector('.search-screen-wrap');
        const searchLens = mobileSearchLi.querySelector('.lens');
        const searchClose = mobileSearchLi.querySelector('.close');
        const mainHeader = document.querySelector('.main-header');
        if (searchScreenWrap && searchScreenWrap.style.display === 'block') {
          searchScreenWrap.style.display = 'none';
          searchLens.style.display = 'block';
          searchClose.style.display = 'none';
          mainHeader.classList.remove('search-open');
        }
      }
    });
  }

  // Desktop hover functionality for main nav items
  if (isDesktop.matches) {
    mainNav.querySelectorAll('.has-child').forEach((li) => {
      li.addEventListener('mouseenter', () => {
        mainNav.querySelectorAll('.mega-menu').forEach((menu) => {
          menu.style.opacity = '0';
          menu.style.pointerEvents = 'none';
        });
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
        }
      });
    });

    mainNav.addEventListener('mouseleave', () => {
      mainNav.querySelectorAll('.mega-menu').forEach((menu) => {
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
      });
    });
  }

  // Mobile/Desktop click functionality for sub-menus
  mainNav.querySelectorAll('.has-child > span, .top-level-li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent menu from closing
      const li = span.closest('li');
      const subMenu = li.querySelector('.mega-menu, .has-sub-child, .has-inner-sub-child');
      if (subMenu) {
        toggleSubMenu(li, subMenu, span);
      }
    });
  });

  // Ensure initial state is correct based on desktop/mobile
  isDesktop.addEventListener('change', () => {
    toggleMenu(mainNav, mainNav.querySelector('ul'), isDesktop.matches);
    // Reset mega-menu display for desktop on resize
    if (isDesktop.matches) {
      mainNav.querySelectorAll('.mega-menu').forEach((menu) => {
        menu.style.display = ''; // Reset to CSS default (usually hidden by opacity/pointer-events)
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
      });
      mainNav.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((sub) => {
        sub.classList.remove('active', 'active-child');
      });
      mainNav.querySelectorAll('.has-child > span, .top-level-li > span').forEach((span) => {
        span.style.transform = ''; // Reset to CSS default
      });
    } else {
      // On mobile, ensure mega-menus are initially hidden
      mainNav.querySelectorAll('.mega-menu').forEach((menu) => {
        menu.style.display = 'none';
      });
    }
  });

  // Set initial state for mobile nav
  toggleMenu(mainNav, mainNav.querySelector('ul'), isDesktop.matches);

  // Escape key listener for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu if open
      if (mainNav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(mainNav, mainNav.querySelector('ul'), true);
      }

      // Close desktop search if open
      const desktopSearchScreenWrap = desktopSearchLi?.querySelector('.search-screen-wrap');
      if (desktopSearchScreenWrap && desktopSearchScreenWrap.style.display === 'block') {
        toggleSearchScreen(desktopSearchLi);
      }

      // Close mobile search if open
      const mobileSearchScreenWrap = mobileSearchLi?.querySelector('.search-screen-wrap');
      if (mobileSearchScreenWrap && mobileSearchScreenWrap.style.display === 'block') {
        toggleSearchScreen(mobileSearchLi);
      }
    }
  });
}
