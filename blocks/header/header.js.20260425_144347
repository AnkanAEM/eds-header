import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on original CSS

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment to identify brand, nav, and tools sections.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element, year80LogoRow: Element}}
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;
  let year80LogoRow = null;

  // Find brand row (contains logo picture/img)
  brandRow = sections.find((s) => s.querySelector('p > picture, p > img'));

  // Find nav row (contains a link and a ul)
  navRow = sections.find((s) => s.querySelector('p > a') && s.querySelector('ul'));

  // Find tools row (contains social links or contact-us)
  toolsRow = sections.find((s) => s.querySelector('a[href*="contact-us"]') || s.querySelector('a[href="#"]'));

  // Find 80th year logo row (if present and distinct from main brand logo)
  year80LogoRow = sections.find((s) => s.querySelector('.year-80-logo img'));

  return { brandRow, navRow, toolsRow, year80LogoRow };
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.main-nav > ul > li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = expanded ? 'block' : 'none';
    }
    // Also collapse nested sub-menus
    section.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((sub) => {
      sub.classList.remove('active', 'active-child');
      if (sub.previousElementSibling && sub.previousElementSibling.tagName === 'SPAN') {
        sub.previousElementSibling.querySelector('svg').style.transform = 'rotate(90deg)';
      }
    });
  });
}

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  if (!hamburger || !mainNav) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (expanded) {
    mainNav.style.transform = 'translate(-100%,0)';
    mainNav.style.opacity = '0';
    hamburger.classList.remove('is-active');
  } else {
    mainNav.style.transform = 'translate(0,0)';
    mainNav.style.opacity = '1';
    hamburger.classList.add('is-active');
  }

  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
}

/**
 * Sets up desktop navigation behavior.
 * @param {Element} navSections The nav sections element.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    const megaMenu = navSection.querySelector('.mega-menu');
    if (megaMenu) {
      navSection.addEventListener('mouseenter', () => {
        toggleAllNavSections(navSections, false); // Close others
        navSection.setAttribute('aria-expanded', 'true');
        megaMenu.style.display = 'block';
      });
      navSection.addEventListener('mouseleave', () => {
        navSection.setAttribute('aria-expanded', 'false');
        megaMenu.style.display = 'none';
      });
    }
  });

  // Handle nested sub-menus for desktop
  navSections.querySelectorAll('.mega-menu .sub-nav-wrap .top-level-li').forEach((topLevelLi) => {
    const subChild = topLevelLi.querySelector('.has-sub-child');
    if (subChild) {
      topLevelLi.addEventListener('mouseenter', () => {
        subChild.classList.add('active');
      });
      topLevelLi.addEventListener('mouseleave', () => {
        subChild.classList.remove('active');
      });
    }
  });

  navSections.querySelectorAll('.mega-menu .sub-nav-wrap .first-level-li').forEach((firstLevelLi) => {
    const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
    if (innerSubChild) {
      firstLevelLi.addEventListener('mouseenter', () => {
        innerSubChild.classList.add('active-child');
      });
      firstLevelLi.addEventListener('mouseleave', () => {
        innerSubChild.classList.remove('active-child');
      });
    }
  });
}

/**
 * Sets up mobile navigation behavior.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections element.
 * @param {Element} toolsRow The nav tools fragment row.
 */
function setupMobileNav(nav, navSections, toolsRow) {
  if (!nav || !navSections) return;

  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  }

  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    const anchor = navSection.querySelector('a');
    const chevron = navSection.querySelector('span');
    const megaMenu = navSection.querySelector('.mega-menu');

    if (anchor && chevron && megaMenu) {
      const toggleMobileSubMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        megaMenu.style.display = expanded ? 'none' : 'block';
        chevron.querySelector('svg').style.transform = expanded ? 'rotate(90deg)' : 'rotate(-90deg)';
      };
      anchor.addEventListener('click', toggleMobileSubMenu);
      chevron.addEventListener('click', toggleMobileSubMenu);
    }

    // Handle nested sub-menus for mobile
    navSection.querySelectorAll('.mega-menu .sub-nav-wrap .top-level-li').forEach((topLevelLi) => {
      const subChild = topLevelLi.querySelector('.has-sub-child');
      const subChevron = topLevelLi.querySelector('span');
      if (subChild && subChevron) {
        const toggleSubMenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          subChild.classList.toggle('active');
          subChevron.querySelector('svg').style.transform = subChild.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
        };
        topLevelLi.querySelector('a').addEventListener('click', toggleSubMenu);
        subChevron.addEventListener('click', toggleSubMenu);
      }
    });

    navSection.querySelectorAll('.mega-menu .sub-nav-wrap .first-level-li').forEach((firstLevelLi) => {
      const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
      const innerSubChevron = firstLevelLi.querySelector('span');
      if (innerSubChild && innerSubChevron) {
        const toggleInnerSubMenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          innerSubChild.classList.toggle('active-child');
          innerSubChevron.querySelector('svg').style.transform = innerSubChild.classList.contains('active-child') ? 'rotate(-180deg)' : 'rotate(90deg)';
        };
        firstLevelLi.querySelector('a').addEventListener('click', toggleInnerSubMenu);
        innerSubChevron.addEventListener('click', toggleInnerSubMenu);
      }
    });
  });

  // Append mobile tools to nav sections
  if (toolsRow) {
    const mobileMenusIcon = document.createElement('div');
    mobileMenusIcon.classList.add('icon-nav', 'mobile-menus-icon');
    const ul = document.createElement('ul');

    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const newLi = document.createElement('li');
      newLi.classList.add('mail');
      const newLink = contactUsLink.cloneNode(true);
      newLink.innerHTML = contactUsLink.textContent; // Use original text content
      newLi.append(newLink);
      ul.append(newLi);
    }

    const searchLink = toolsRow.querySelector('a[href="#"]');
    if (searchLink) {
      const newLi = document.createElement('li');
      newLi.classList.add('search');
      const newLink = searchLink.cloneNode(true);
      newLink.innerHTML = `${SEARCH_SVG}${CLOSE_SVG}<span> ${searchLink.textContent.trim() || 'Search'}</span>`; // Use original text content
      newLi.append(newLink);
      ul.append(newLi);

      // Add search screen wrap dynamically
      const searchScreenWrap = createSearchScreen(toolsRow);
      newLi.append(searchScreenWrap);

      newLi.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        newLi.classList.toggle('active');
        searchScreenWrap.style.display = newLi.classList.contains('active') ? 'block' : 'none';
        document.body.style.overflowY = newLi.classList.contains('active') ? 'hidden' : '';
      });
    }
    mobileMenusIcon.append(ul);
    navSections.querySelector('.main-nav > ul').append(mobileMenusIcon);
  }

  // Escape key listener for mobile menu and search overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, navSections, true); // Close mobile menu
      }
      const activeSearch = document.querySelector('.main-header .icon-nav.mobile-menus-icon .search.active');
      if (activeSearch) {
        activeSearch.classList.remove('active');
        activeSearch.querySelector('.search-screen-wrap').style.display = 'none';
        document.body.style.overflowY = '';
      }
    }
  });
}

/**
 * Sets up accessibility attributes.
 * @param {Element} navSections The nav sections element.
 */
function setupAccessibility(navSections) {
  if (!navSections) return;
  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    navSection.setAttribute('aria-haspopup', 'true');
    navSection.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Creates the search screen DOM structure, dynamically populating keywords.
 * @param {Element} toolsRow The tools row from the fragment, containing search suggestions.
 * @returns {Element} The search screen wrap element.
 */
function createSearchScreen(toolsRow) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const searchForm = document.createElement('form');
  searchForm.setAttribute('action', 'https://www.mahindra.com/search');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('id', 'search-block-form');
  searchForm.setAttribute('accept-charset', 'UTF-8');

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.innerHTML = `
    <div class="search-icon">${SEARCH_SVG}</div>
    <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
    <button class="submit-button">
      <div class="label"> Submit </div>
      ${SUBMIT_ARROW_SVG}
    </button>
  `;
  searchForm.append(searchWrap);

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
  wrapDiv.append(searchForm);

  // Dynamically add search suggestions from toolsRow
  const searchSuggestions = toolsRow.querySelectorAll('.search-suggestions-wrap');
  searchSuggestions.forEach((suggestionWrap) => {
    const newSuggestionWrap = suggestionWrap.cloneNode(true);
    wrapDiv.append(newSuggestionWrap);
  });

  searchScreenWrap.append(wrapDiv);
  return searchScreenWrap;
}

/**
 * Decorates the header block with content from the fragment.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.remove();
    return;
  }

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'solid', 'nav-up'); // Replicate classes from original HTML

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  const { brandRow, navRow, toolsRow, year80LogoRow } = parseStructure(fragment);

  // --- Nav Brand ---
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > a') || document.createElement('a');
    brandLink.href = brandLink.href || '/';
    const brandImg = brandRow.querySelector('picture, img');
    if (brandImg) {
      brandLink.innerHTML = ''; // Clear existing content if any
      brandLink.append(brandImg);
      brandImg.classList.add('hiddenlogo1'); // Add original class
    }
    logoDiv.append(brandLink);
    wrapDiv.append(logoDiv);
  }

  // --- Hamburger for mobile ---
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-controls', 'main-nav');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // --- Main Navigation ---
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle'); // Replicate data-once
  mainNav.setAttribute('id', 'main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);

  if (navRow) {
    let currentLi = null;
    let leftDivContentBuffer = [];

    Array.from(navRow.children).forEach((child) => {
      const link = child.querySelector('p > a') || (child.tagName === 'A' ? child : null);
      if (link) {
        // If a new main navigation link is found, close the previous one and start a new li
        if (currentLi) {
          navUl.append(currentLi);
        }
        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.setAttribute('data-once', 'nav-close-search'); // Replicate data-once

        const anchor = document.createElement('a');
        anchor.setAttribute('itemprop', 'url');
        anchor.href = link.href;
        anchor.textContent = link.textContent;
        currentLi.append(anchor);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        currentLi.append(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        currentLi.append(megaMenu);

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        // If there's buffered content, create a left-div
        if (leftDivContentBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          // Generate semantic class based on menu title
          const title = anchor.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${title}-left-div`);

          const heading = document.createElement('h4');
          heading.classList.add('left-div-heading');
          const headingLink = document.createElement('a');
          headingLink.textContent = anchor.textContent; // Use menu title for left-div heading
          heading.append(headingLink);
          leftDiv.append(heading);

          leftDivContentBuffer.forEach((contentNode) => leftDiv.append(contentNode));
          centerDiv.append(leftDiv);
          leftDivContentBuffer = []; // Clear buffer
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);
      } else if (currentLi) {
        // Collect non-link content (like ULs, paragraphs, etc.)
        const megaMenu = currentLi.querySelector('.mega-menu');
        const centerDiv = megaMenu.querySelector('.center-div');
        const subNavWrap = centerDiv.querySelector('.sub-nav-wrap');

        if (child.tagName === 'UL') {
          // Process nested ULs for mega menu structure
          const processUl = (ulElement, parentContainer, level = 0) => {
            const newUl = document.createElement('ul');
            Array.from(ulElement.children).forEach((li) => {
              const newLi = document.createElement('li');
              const liLink = li.querySelector('a') || (li.tagName === 'A' ? li : null);
              if (liLink) {
                const anchor = document.createElement('a');
                anchor.href = liLink.href;
                anchor.textContent = liLink.textContent;
                newLi.append(anchor);
              } else {
                // Append all child nodes if no direct link, e.g., text, span, etc.
                Array.from(li.childNodes).forEach(node => newLi.append(node.cloneNode(true)));
              }

              const nestedUl = li.querySelector('ul');
              if (nestedUl) {
                if (level === 0) {
                  newLi.classList.add('top-level-li');
                } else if (level === 1) {
                  newLi.classList.add('first-level-li');
                }

                const subChevron = document.createElement('span');
                subChevron.innerHTML = CHEVRON_SVG;
                newLi.append(subChevron);

                const hasSubChild = document.createElement('div');
                hasSubChild.classList.add(level === 0 ? 'has-sub-child' : 'has-inner-sub-child');
                // Check if original li had 'active' or 'active-child' class
                if (li.classList.contains('active')) {
                  hasSubChild.classList.add('active');
                }
                if (li.classList.contains('active-child')) {
                  hasSubChild.classList.add('active-child');
                }

                processUl(nestedUl, hasSubChild, level + 1); // Recursively process
                newLi.append(hasSubChild);
              }
              newUl.append(newLi);
            });
            parentContainer.append(newUl);
          };
          processUl(child, subNavWrap);
        } else if (child.tagName === 'P' || child.tagName === 'H4' || child.tagName === 'DIV' || child.tagName === 'UL') {
          // Collect other content for the left-div (including lists like "Key Facts")
          leftDivContentBuffer.push(child.cloneNode(true));
        }
      }
    });
    if (currentLi) {
      navUl.append(currentLi); // Append the last created li
    }
  }
  mainNav.append(navUl);
  wrapDiv.append(mainNav);

  // --- Desktop Tools Row ---
  const desktopMenusIcon = document.createElement('div');
  desktopMenusIcon.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');

  if (toolsRow) {
    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const li = document.createElement('li');
      li.classList.add('mail');
      const anchor = contactUsLink.cloneNode(true);
      anchor.innerHTML = MAIL_SVG; // Use SVG for desktop
      li.append(anchor);
      desktopUl.append(li);
    }

    const searchLink = toolsRow.querySelector('a[href="#"]');
    if (searchLink) {
      const li = document.createElement('li');
      li.classList.add('search');
      li.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const anchor = searchLink.cloneNode(true);
      anchor.setAttribute('data-once', 'search-stop-propagation');
      anchor.innerHTML = `${SEARCH_SVG}${CLOSE_SVG}`;
      li.append(anchor);

      // Add search screen wrap dynamically
      const searchScreenWrap = createSearchScreen(toolsRow);
      li.append(searchScreenWrap);

      li.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        searchScreenWrap.style.display = li.classList.contains('active') ? 'block' : 'none';
        document.body.style.overflowY = li.classList.contains('active') ? 'hidden' : '';
      });
      desktopUl.append(li);
    }
  }
  desktopMenusIcon.append(desktopUl);
  wrapDiv.append(desktopMenusIcon);

  // --- 80th Year Logo (if present in fragment) ---
  if (year80LogoRow) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const year80Link = year80LogoRow.querySelector('a');
    if (year80Link) {
      const clonedLink = year80Link.cloneNode(true);
      year80LogoDiv.append(clonedLink);
    }
    wrapDiv.append(year80LogoDiv);
  }

  // Final append to block
  block.textContent = '';
  block.append(header);

  // --- Initialize behaviors ---
  setupDesktopNav(mainNav);
  setupMobileNav(header, mainNav, toolsRow); // Pass header for hamburger and mainNav for sections
  setupAccessibility(mainNav);

  // Initial state for mobile
  toggleMenu(header, mainNav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(header, mainNav, isDesktop.matches));

  // Escape key listener for desktop search overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeSearch = document.querySelector('.main-header .icon-nav.desktop-menus-icon .search.active');
      if (activeSearch) {
        activeSearch.classList.remove('active');
        activeSearch.querySelector('.search-screen-wrap').style.display = 'none';
        document.body.style.overflowY = '';
      }
    }
  });
}
