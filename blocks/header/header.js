import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Moves instrumentation attributes from original element to new element.
 * @param {Element} originalElement The original element.
 * @param {Element} newElement The new element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  [...originalElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element, year80Logo: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === Node.ELEMENT_NODE);

  const getChildContentWrapper = (element) => {
    if (!element) return null;
    const wrapper = element.querySelector('.default-content-wrapper');
    return wrapper || element; // Return wrapper if exists, else the element itself
  };

  const brandRow = children[0] ? getChildContentWrapper(children[0]) : null;
  const navRow = children[1] ? getChildContentWrapper(children[1]) : null;
  const toolsRow = children[2] ? getChildContentWrapper(children[2]) : null;

  // Check for the 80th year logo within the brandRow or as a separate element
  let year80Logo = null;
  if (brandRow) {
    year80Logo = brandRow.querySelector('.year-80-logo');
    if (year80Logo) {
      // If found, remove it from brandRow to process separately
      year80Logo.remove();
    }
  }
  // If not found in brandRow, check if it's a direct child of the fragment
  if (!year80Logo && children[3] && children[3].classList.contains('year-80-logo')) {
    year80Logo = children[3];
  }

  return { brandRow, navRow, toolsRow, year80Logo };
}

/**
 * Extracts immediate text content from an element, ignoring children's text.
 * @param {Element} element The element to extract text from.
 * @returns {string} The immediate text content.
 */
function getImmediateTextContent(element) {
  if (!element) return '';
  return Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join('');
}

/**
 * Recursively decorates a nested UL structure.
 * @param {Element} ulElement The UL element to decorate.
 */
function decorateNestedUl(ulElement) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const nestedUl = li.querySelector(':scope > ul, :scope > div.has-sub-child');
      if (nestedUl) {
        li.classList.add('has-child');
        const link = li.querySelector(':scope > a');
        const textNode = getImmediateTextContent(li); // Get text before any nested UL
        const span = document.createElement('span');
        span.innerHTML = SVG_CHEVRON;
        if (link) {
          link.after(span);
        } else if (textNode) {
          // If no direct link, wrap text in a dummy link for consistency
          const dummyLink = document.createElement('a');
          dummyLink.href = '#'; // Or a more appropriate fallback
          dummyLink.textContent = textNode;
          li.prepend(dummyLink);
          dummyLink.after(span);
        }
        decorateNestedUl(nestedUl); // Recurse for deeper nesting
      }
    }
  });
}

/**
 * Sets up the desktop navigation structure.
 * @param {Element} navRow The navigation row element from the fragment.
 * @returns {Element} The decorated main navigation UL.
 */
function setupDesktopNav(navRow) {
  if (!navRow) return null;

  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLeftDivBuffer = [];

  Array.from(navRow.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., <p><a href="...">Who We Are</a></p>)
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');

      const anchor = child.querySelector('a');
      if (anchor) {
        moveInstrumentation(child, li); // Move instrumentation from original <p> to new <li>
        const newAnchor = document.createElement('a');
        newAnchor.href = anchor.href;
        newAnchor.textContent = anchor.textContent;
        newAnchor.setAttribute('itemprop', 'url');
        li.append(newAnchor);
        newAnchor.insertAdjacentHTML('afterend', SVG_CHEVRON);
      }

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush buffered content into a new left-div
      if (currentLeftDivBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const title = anchor ? anchor.textContent : 'unknown';
        const sanitizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        currentLeftDivBuffer.forEach((bufferedNode) => leftDiv.append(bufferedNode));
        centerDiv.append(leftDiv);
        currentLeftDivBuffer = []; // Clear buffer
      }

      // Check the next sibling for the submenu (UL or DIV)
      let nextSibling = child.nextElementSibling;
      let subNavWrap = null;

      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        moveInstrumentation(nextSibling, subNavWrap); // Move instrumentation from original UL/DIV to new subNavWrap

        // Recursively handle nested ULs
        Array.from(nextSibling.children).forEach((subChild) => {
          if (subChild.tagName === 'UL' || subChild.tagName === 'DIV') {
            const clonedSubChild = subChild.cloneNode(true);
            decorateNestedUl(clonedSubChild);
            subNavWrap.append(clonedSubChild);
          } else {
            // Append other elements directly
            subNavWrap.append(subChild.cloneNode(true));
          }
        });
        nextSibling.remove(); // Remove original sibling from fragment
      }

      if (subNavWrap) {
        centerDiv.append(subNavWrap);
      }

      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
      mainNavUl.append(li);
      child.remove(); // Remove original child from fragment
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      // Buffer non-navigation elements for the next left-div
      currentLeftDivBuffer.push(child.cloneNode(true));
      child.remove(); // Remove original child from fragment
    }
  });

  return mainNavUl;
}

/**
 * Sets up the utility tools section (mail, search, social).
 * @param {Element} toolsRow The tools row element from the fragment.
 * @returns {Element} The decorated tools UL.
 */
function setupTools(toolsRow) {
  if (!toolsRow) return null;

  const desktopToolsUl = document.createElement('ul');
  const mobileToolsUl = document.createElement('ul');

  // Process all ULs in the toolsRow
  Array.from(toolsRow.children).forEach((ul) => {
    if (ul.tagName === 'UL') {
      Array.from(ul.children).forEach((li) => {
        const anchor = li.querySelector('a');
        if (!anchor) return;

        const linkText = anchor.textContent.trim();

        if (linkText.toLowerCase() === 'contact us') {
          const mailLiDesktop = document.createElement('li');
          mailLiDesktop.classList.add('mail');
          const mailAnchorDesktop = anchor.cloneNode(true);
          mailAnchorDesktop.innerHTML = SVG_MAIL; // Replace text with SVG for desktop
          mailLiDesktop.append(mailAnchorDesktop);
          desktopToolsUl.append(mailLiDesktop);
          moveInstrumentation(li, mailLiDesktop);

          const mailLiMobile = document.createElement('li');
          mailLiMobile.classList.add('mail');
          const mailAnchorMobile = anchor.cloneNode(true); // Keep text for mobile
          mailLiMobile.append(mailAnchorMobile);
          mobileToolsUl.append(mailLiMobile);
          moveInstrumentation(li, mailLiMobile);
        } else if (linkText.toLowerCase() === 'search') {
          const searchLiDesktop = document.createElement('li');
          searchLiDesktop.classList.add('search');
          const searchAnchorDesktop = anchor.cloneNode(true);
          searchAnchorDesktop.href = '#';
          searchAnchorDesktop.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE; // Add lens and close SVGs
          searchLiDesktop.append(searchAnchorDesktop);
          desktopToolsUl.append(searchLiDesktop);
          moveInstrumentation(li, searchLiDesktop);

          const searchLiMobile = document.createElement('li');
          searchLiMobile.classList.add('search');
          const searchAnchorMobile = anchor.cloneNode(true);
          searchAnchorMobile.href = '#';
          searchAnchorMobile.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE + `<span> ${linkText}</span>`; // Add lens, close SVGs and text
          searchLiMobile.append(searchAnchorMobile);
          mobileToolsUl.append(searchLiMobile);
          moveInstrumentation(li, searchLiMobile);

          // Create the search screen wrapper and its content
          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          const searchScreenWrapInner = document.createElement('div');
          searchScreenWrapInner.classList.add('wrap');

          const searchForm = document.createElement('form');
          searchForm.action = anchor.href; // Use the search link from the fragment
          searchForm.method = 'get';
          searchForm.id = 'search-block-form';
          searchForm.setAttribute('accept-charset', 'UTF-8');
          searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');

          const searchWrap = document.createElement('div');
          searchWrap.classList.add('search-wrap');

          const searchIconDiv = document.createElement('div');
          searchIconDiv.classList.add('search-icon');
          searchIconDiv.innerHTML = SVG_SEARCH_LENS; // Search icon inside input
          searchWrap.append(searchIconDiv);

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
          submitButton.type = 'submit'; // Ensure it's a submit button
          const submitLabel = document.createElement('div');
          submitLabel.classList.add('label');
          submitLabel.textContent = 'Submit'; // Placeholder, ideally from fragment/metadata
          submitButton.append(submitLabel);
          submitButton.innerHTML += SVG_SUBMIT_ARROW; // Add arrow SVG
          searchWrap.append(submitButton);

          searchForm.append(searchWrap);

          // Placeholder for search results and suggestions (empty as per fragment)
          const searchResultBox = document.createElement('div');
          searchResultBox.classList.add('searchResultBox');
          searchResultBox.style.display = 'none'; // Hidden by default
          searchForm.append(searchResultBox);

          // Dynamically add search suggestions from the fragment if available
          const fragmentSearchScreenWrap = li.querySelector('.search-screen-wrap');
          if (fragmentSearchScreenWrap) {
            const fragmentSearchSuggestions = fragmentSearchScreenWrap.querySelectorAll('.search-suggestions-wrap');
            fragmentSearchSuggestions.forEach((suggestionWrap) => {
              searchScreenWrapInner.append(suggestionWrap.cloneNode(true));
            });
          }

          searchScreenWrapInner.prepend(searchForm); // Prepend form to inner wrap
          searchScreenWrap.append(searchScreenWrapInner);

          searchLiDesktop.append(searchScreenWrap.cloneNode(true)); // Append to desktop
          searchLiMobile.append(searchScreenWrap.cloneNode(true)); // Append to mobile
        }
      });
    }
  });

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  desktopIconNav.append(desktopToolsUl);

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  mobileIconNav.append(mobileToolsUl);

  return { desktopIconNav, mobileIconNav };
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav The main navigation element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = document.querySelector('header .hamburger'); // Select globally as it's outside nav
  if (hamburger) {
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (expanded) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    } else {
      hamburger.classList.add('active');
      nav.classList.add('active');
    }
  }

  // Close search screen if open
  const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');
  if (searchScreenWrap) {
    searchScreenWrap.classList.remove('active');
    const searchLi = nav.querySelector('li.search.active');
    if (searchLi) searchLi.classList.remove('active');
    document.body.classList.remove('search-active');
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  } else {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.querySelector('header .main-nav');
    if (!nav) return;
    const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');
    if (searchScreenWrap) {
      searchScreenWrap.classList.remove('active');
      const searchLi = nav.querySelector('li.search.active');
      if (searchLi) searchLi.classList.remove('active');
      document.body.classList.remove('search-active');
    } else if (!isDesktop.matches && nav.classList.contains('active')) {
      toggleMenu(nav);
    }
  }
}

function closeOnFocusLost(e) {
  const nav = document.querySelector('header .main-nav');
  if (!nav || nav.contains(e.relatedTarget)) return;

  const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');
  if (searchScreenWrap) {
    searchScreenWrap.classList.remove('active');
    const searchLi = nav.querySelector('li.search.active');
    if (searchLi) searchLi.classList.remove('active');
    document.body.classList.remove('search-active');
  } else if (!isDesktop.matches && nav.classList.contains('active')) {
    toggleMenu(nav, false);
  }
}

/**
 * Decorates the header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'solid', 'nav-up');
  moveInstrumentation(block, header);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const { brandRow, navRow, toolsRow, year80Logo } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('a');
    if (brandLink) {
      const clonedLink = brandLink.cloneNode(true);
      logoDiv.append(clonedLink);
    } else {
      const picture = brandRow.querySelector('picture');
      if (picture) {
        const defaultLink = document.createElement('a');
        defaultLink.href = '/'; // Fallback home link
        defaultLink.append(picture.cloneNode(true));
        logoDiv.append(defaultLink);
      }
    }
    wrapDiv.append(logoDiv);
    moveInstrumentation(brandRow, logoDiv);
  }

  // 2. Setup Hamburger (Mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // 3. Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('aria-expanded', 'false'); // Initial state for mobile

  const desktopNavUl = setupDesktopNav(navRow);
  if (desktopNavUl) {
    mainNav.append(desktopNavUl);
    moveInstrumentation(navRow, mainNav);
  }

  // 4. Setup Tools (Mail, Search, Social)
  if (toolsRow) {
    const { desktopIconNav, mobileIconNav } = setupTools(toolsRow);
    if (desktopIconNav) {
      mainNav.append(desktopIconNav);
      moveInstrumentation(toolsRow, desktopIconNav);
    }
    if (mobileIconNav) {
      mainNav.append(mobileIconNav);
      moveInstrumentation(toolsRow, mobileIconNav);
    }
  }

  wrapDiv.append(mainNav);

  // 5. Add 80th Year Logo (if present in fragment)
  if (year80Logo) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    year80LogoDiv.append(year80Logo.cloneNode(true));
    wrapDiv.append(year80LogoDiv);
    moveInstrumentation(year80Logo, year80LogoDiv);
  }

  containerDiv.append(wrapDiv);
  header.append(containerDiv);
  block.append(header);

  // Event Listeners for mobile menu toggle
  hamburger.addEventListener('click', () => toggleMenu(mainNav));

  // Event Listeners for desktop navigation
  if (desktopNavUl) {
    desktopNavUl.querySelectorAll(':scope > li.has-child').forEach((li) => {
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          li.classList.add('active');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          li.classList.remove('active');
        }
      });
      // Mobile click for parent navigation items
      li.querySelector(':scope > a').addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          li.classList.toggle('active');
          const megaMenu = li.querySelector(':scope > .mega-menu');
          if (megaMenu) {
            megaMenu.style.display = li.classList.contains('active') ? 'block' : 'none';
          }
        }
      });

      // Mobile click for sub-level navigation items with children
      li.querySelectorAll('.sub-nav-wrap li.has-child > span').forEach((span) => {
        span.addEventListener('click', (e) => {
          e.preventDefault();
          const parentLi = span.closest('li.has-child');
          if (parentLi) {
            parentLi.classList.toggle('active');
            const subMenu = parentLi.querySelector(':scope > ul, :scope > div.has-sub-child');
            if (subMenu) {
              subMenu.classList.toggle('active');
            }
            const innerSubMenu = parentLi.querySelector(':scope > .has-inner-sub-child');
            if (innerSubMenu) {
              innerSubMenu.classList.toggle('active-child');
            }
          }
        });
      });
    });
  }

  // Search toggle functionality
  const searchToggleElements = mainNav.querySelectorAll('li.search');
  searchToggleElements.forEach((searchLi) => {
    const searchAnchor = searchLi.querySelector('a');
    const searchScreenWrap = searchLi.querySelector('.search-screen-wrap');
    if (searchAnchor && searchScreenWrap) {
      searchAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing due to focusout
        searchLi.classList.toggle('active');
        searchScreenWrap.classList.toggle('active');
        document.body.classList.toggle('search-active', searchScreenWrap.classList.contains('active'));
      });

      // Close search screen when clicking outside
      searchScreenWrap.addEventListener('click', (e) => {
        if (e.target === searchScreenWrap || e.target === searchScreenWrap.querySelector('.wrap')) {
          searchLi.classList.remove('active');
          searchScreenWrap.classList.remove('active');
          document.body.classList.remove('search-active');
        }
      });
    }
  });

  // Handle window resize for mobile/desktop behavior
  isDesktop.addEventListener('change', () => {
    toggleMenu(mainNav, isDesktop.matches);
    // Reset mobile specific active classes on desktop
    if (isDesktop.matches) {
      mainNav.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflowY = '';
      desktopNavUl.querySelectorAll('li.has-child.active').forEach(li => {
        li.classList.remove('active');
        const megaMenu = li.querySelector(':scope > .mega-menu');
        if (megaMenu) megaMenu.style.display = '';
      });
      mainNav.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach(el => {
        el.classList.remove('active', 'active-child');
      });
    }
  });
}
