import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on provided CSS

// Utility function to sanitize text for class names
function sanitizeClassName(text) {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

// SVG for the chevron icon, based on the original HTML
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

// SVG for the mail icon, based on the original HTML
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';

// SVG for the search lens icon, based on the original HTML
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';

// SVG for the search close icon, based on the original HTML
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';

// SVG for the search submit arrow icon, based on the original HTML
const SEARCH_SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';


function closeAllMenus(nav, navSections, excludeSection = null) {
  if (!nav || !navSections) return;
  navSections.querySelectorAll('.has-child[aria-expanded="true"]').forEach((section) => {
    if (section !== excludeSection) {
      section.setAttribute('aria-expanded', 'false');
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) megaMenu.style.display = 'none';
      const chevron = section.querySelector('span svg');
      if (chevron) {
        chevron.style.transform = 'rotate(90deg)'; // Reset chevron
      }
    }
  });
  // Close search if open
  const searchIcon = nav.querySelector('.search');
  if (searchIcon && searchIcon.classList.contains('active')) {
    searchIcon.classList.remove('active');
    const searchScreen = nav.querySelector('.search-screen-wrap');
    if (searchScreen) {
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
      searchScreen.style.transform = 'translate(0,0)';
    }
  }
  nav.setAttribute('aria-expanded', 'false');
  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.classList.remove('is-active');
  }
  nav.classList.remove('is-active');
  document.body.style.overflowY = '';
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (expanded) {
    hamburger.classList.remove('is-active');
    nav.classList.remove('is-active');
    closeAllMenus(nav, navSections);
  } else {
    hamburger.classList.add('is-active');
    nav.classList.add('is-active');
  }

  // Close all sub-menus when mobile nav is closed
  if (expanded) {
    navSections.querySelectorAll('.has-child[aria-expanded="true"]').forEach((section) => {
      section.setAttribute('aria-expanded', 'false');
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) megaMenu.style.display = 'none';
      const chevron = section.querySelector('span svg');
      if (chevron) {
        chevron.style.transform = 'rotate(90deg)'; // Reset chevron
      }
    });
  }
}

function toggleSubMenu(e) {
  const listItem = e.currentTarget.closest('li.has-child');
  if (!listItem) return;

  const megaMenu = listItem.querySelector('.mega-menu');
  if (!megaMenu) return;

  const isExpanded = listItem.getAttribute('aria-expanded') === 'true';
  const navElement = listItem.closest('nav');
  const navSections = navElement.querySelector('.main-nav');

  if (isDesktop.matches) {
    closeAllMenus(navElement, navSections, listItem);
    listItem.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    megaMenu.style.display = isExpanded ? 'none' : 'block';
    // Chevron rotation for desktop is handled by CSS hover, no JS needed
  } else {
    // Mobile behavior
    listItem.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    megaMenu.style.display = isExpanded ? 'none' : 'block';
    const chevron = listItem.querySelector('span svg');
    if (chevron) {
      chevron.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(-180deg)';
    }
  }
}

function toggleNestedSubMenu(e) {
  const listItem = e.currentTarget.closest('li');
  if (!listItem) return;

  const subMenu = listItem.querySelector('.has-sub-child, .has-inner-sub-child');
  if (!subMenu) return;

  const isExpanded = subMenu.classList.contains('active');

  if (!isDesktop.matches) { // Only for mobile
    if (isExpanded) {
      subMenu.classList.remove('active');
      e.currentTarget.querySelector('svg').style.transform = 'rotate(90deg)';
    } else {
      // Close other nested sub-menus at the same level
      Array.from(listItem.parentNode.children).forEach((sibling) => {
        const siblingSubMenu = sibling.querySelector('.has-sub-child, .has-inner-sub-child');
        if (sibling !== listItem && siblingSubMenu && siblingSubMenu.classList.contains('active')) {
          siblingSubMenu.classList.remove('active');
          const siblingChevron = sibling.querySelector('span svg');
          if (siblingChevron) siblingChevron.style.transform = 'rotate(90deg)';
        }
      });
      subMenu.classList.add('active');
      e.currentTarget.querySelector('svg').style.transform = 'rotate(-180deg)';
    }
  }
}

function setupMobileNav(nav, navSections) {
  if (!nav || !navSections) return;

  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  }

  // Add click listeners for main nav items with sub-menus
  navSections.querySelectorAll('li.has-child > a, li.has-child > span').forEach((trigger) => {
    trigger.addEventListener('click', toggleSubMenu);
  });

  // Add click listeners for nested sub-menu items
  navSections.querySelectorAll('.mega-menu li.top-level-li > span, .mega-menu li.first-level-li > span').forEach((trigger) => {
    trigger.addEventListener('click', toggleNestedSubMenu);
  });

  // Close menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus(nav, navSections);
    }
  });
}

function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === 1); // Only element nodes

  const brandRow = children[0];
  const navRow = children[1];
  const toolsRow = children[2];

  return { brandRow, navRow, toolsRow };
}

function setupBrand(brandRow, headerContainer) {
  if (!brandRow) return;

  const brandWrapper = document.createElement('div');
  brandWrapper.classList.add('logo');

  const defaultContentWrapper = brandRow.querySelector('.default-content-wrapper');
  const source = defaultContentWrapper || brandRow;

  const picture = source.querySelector('picture');
  const anchor = source.querySelector('a');

  if (anchor && picture) {
    // If there's an anchor and a picture, assume the picture is the logo
    // Recreate the logo structure: <a href="..."><img ...></a>
    const logoLink = document.createElement('a');
    logoLink.href = anchor.href;
    logoLink.append(picture);
    brandWrapper.append(logoLink);
  } else if (picture) {
    // If only picture, just append it
    brandWrapper.append(picture);
  } else if (anchor) {
    // If only anchor, just append it
    brandWrapper.append(anchor);
  }

  if (brandWrapper.children.length > 0) {
    headerContainer.append(brandWrapper);
  }
}

function setupDesktopNav(navRow, navElement) {
  if (!navRow || !navElement) return;

  const navList = document.createElement('ul');
  navList.setAttribute('itemscope', '');
  navList.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  // Use a DocumentFragment to build the nav items for performance
  const navFragment = document.createDocumentFragment();

  const children = Array.from(navRow.children).filter(node => node.nodeType === 1);
  let currentLeftDivBuffer = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a main navigation trigger
      const listItem = document.createElement('li');
      listItem.classList.add('has-child', 'hover-red');
      listItem.setAttribute('itemprop', 'name');
      listItem.setAttribute('aria-expanded', 'false'); // Default collapsed

      const link = child.querySelector('a');
      if (link) {
        const navLink = document.createElement('a');
        navLink.href = link.href;
        navLink.textContent = link.textContent;
        navLink.setAttribute('itemprop', 'url');
        listItem.append(navLink);
      }

      const chevronSpan = document.createElement('span');
      chevronSpan.innerHTML = CHEVRON_SVG;
      listItem.append(chevronSpan);

      // Check for a mega-menu (next sibling that is a UL or DIV)
      let nextSibling = children[i + 1];
      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        megaMenu.style.display = 'none'; // Hidden by default

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        // Process the left-div content buffer
        if (currentLeftDivBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const titleText = link ? link.textContent : 'unknown';
          leftDiv.classList.add(sanitizeClassName(titleText) + '-left-div');
          currentLeftDivBuffer.forEach(bufferItem => leftDiv.append(bufferItem));
          centerDiv.append(leftDiv);
          currentLeftDivBuffer = []; // Clear buffer
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        // Recursively build the sub-navigation
        function buildSubNav(parentEl, targetContainer) {
          if (!parentEl) return;

          // Check if the parent element itself has direct list items or multiple ULs
          const directUls = Array.from(parentEl.children).filter(node => node.nodeType === 1 && node.tagName === 'UL');
          const directLis = Array.from(parentEl.children).filter(node => node.nodeType === 1 && node.tagName === 'LI');

          if (directUls.length > 0) {
            // If there are multiple ULs directly under the parent, treat them as columns
            directUls.forEach(colUl => {
              const columnList = document.createElement('ul');
              Array.from(colUl.children).filter(node => node.tagName === 'LI').forEach(li => {
                const newLi = document.createElement('li');
                const link = li.querySelector('a');
                if (link) {
                  newLi.append(link);
                } else {
                  newLi.textContent = li.textContent.trim(); // Get text content if no link
                }

                // Copy classes from original li
                li.classList.forEach(cls => newLi.classList.add(cls));

                const nestedUl = li.querySelector(':scope > ul');
                if (nestedUl) {
                  newLi.classList.add('top-level-li'); // or first-level-li
                  const nestedChevronSpan = document.createElement('span');
                  nestedChevronSpan.innerHTML = CHEVRON_SVG;
                  newLi.append(nestedChevronSpan);
                  const nestedDiv = document.createElement('div');
                  nestedDiv.classList.add('has-sub-child'); // First level nested
                  buildSubNav(nestedUl, nestedDiv);
                  newLi.append(nestedDiv);
                }
                columnList.append(newLi);
              });
              targetContainer.append(columnList);
            });
          } else if (directLis.length > 0) {
            // If there are direct LIs, create a single UL
            const currentUl = document.createElement('ul');
            directLis.forEach((li) => {
              const newLi = document.createElement('li');
              const link = li.querySelector('a');
              if (link) {
                newLi.append(link);
              } else {
                newLi.textContent = li.textContent.trim();
              }

              // Copy classes from original li
              li.classList.forEach(cls => newLi.classList.add(cls));

              const nestedUl = li.querySelector(':scope > ul');
              if (nestedUl) {
                newLi.classList.add('top-level-li'); // or first-level-li
                const nestedChevronSpan = document.createElement('span');
                nestedChevronSpan.innerHTML = CHEVRON_SVG;
                newLi.append(nestedChevronSpan);
                const nestedDiv = document.createElement('div');
                nestedDiv.classList.add('has-sub-child'); // First level nested
                buildSubNav(nestedUl, nestedDiv);
                newLi.append(nestedDiv);
              }
              currentUl.append(newLi);
            });
            targetContainer.append(currentUl);
          } else {
            // Handle other direct children (e.g., paragraphs, divs)
            Array.from(parentEl.children).filter(node => node.nodeType === 1).forEach(childNode => {
              if (childNode.tagName !== 'UL' && childNode.tagName !== 'LI') {
                targetContainer.append(childNode.cloneNode(true));
              }
            });
          }
        }

        buildSubNav(nextSibling, subNavWrap);
        listItem.append(megaMenu);
        i++; // Skip the UL/DIV as it's been processed
      }

      navFragment.append(listItem);
    } else {
      // Collect non-navigation elements into the buffer
      currentLeftDivBuffer.push(child.cloneNode(true));
    }
  }

  navList.append(navFragment);
  navElement.append(navList);
}

function setupTools(toolsRow, navElement) {
  if (!toolsRow) return;

  const toolIconsDesktop = document.createElement('div');
  toolIconsDesktop.classList.add('icon-nav', 'desktop-menus-icon');

  const toolIconsMobile = document.createElement('div');
  toolIconsMobile.classList.add('icon-nav', 'mobile-menus-icon');

  const ulDesktop = document.createElement('ul');
  const ulMobile = document.createElement('ul');

  const defaultContentWrapper = toolsRow.querySelector('.default-content-wrapper');
  const source = defaultContentWrapper || toolsRow;

  // Extract search suggestions dynamically
  const searchSuggestions = {
    popular: [],
    recommended: [],
  };

  Array.from(source.children).filter(node => node.tagName === 'DIV' || node.tagName === 'UL').forEach((section) => {
    if (section.classList.contains('search-suggestions-wrap')) {
      const label = section.querySelector('.label')?.textContent.trim();
      const tokens = Array.from(section.querySelectorAll('.tokens-wrap ul li')).map(li => li.textContent.trim());
      if (label && tokens.length > 0) {
        if (label.toLowerCase().includes('popular keywords')) {
          searchSuggestions.popular = tokens;
        } else if (label.toLowerCase().includes('recommended for you')) {
          searchSuggestions.recommended = tokens;
        }
      }
    }
  });

  Array.from(source.children).filter(node => node.tagName === 'UL').forEach((ul) => {
    Array.from(ul.children).filter(node => node.tagName === 'LI').forEach((li) => {
      const link = li.querySelector('a');
      if (!link) return;

      const text = link.textContent.trim();
      const href = link.href;

      if (text.toLowerCase() === 'contact us') {
        const mailLiDesktop = document.createElement('li');
        mailLiDesktop.classList.add('mail');
        const mailLinkDesktop = document.createElement('a');
        mailLinkDesktop.href = href;
        mailLinkDesktop.innerHTML = MAIL_SVG;
        mailLiDesktop.append(mailLinkDesktop);
        ulDesktop.append(mailLiDesktop);

        const mailLiMobile = document.createElement('li');
        mailLiMobile.classList.add('mail');
        const mailLinkMobile = document.createElement('a');
        mailLinkMobile.href = href;
        mailLinkMobile.textContent = text; // Mobile shows text
        mailLiMobile.append(mailLinkMobile);
        ulMobile.append(mailLiMobile);
      } else if (text.toLowerCase() === 'search') {
        const createSearchScreen = (searchHref) => {
          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          const wrapDiv = document.createElement('div');
          wrapDiv.classList.add('wrap');
          searchScreenWrap.append(wrapDiv);

          const searchForm = document.createElement('form');
          searchForm.action = searchHref;
          searchForm.method = 'get';
          searchForm.id = 'search-block-form';
          searchForm.setAttribute('accept-charset', 'UTF-8');
          wrapDiv.append(searchForm);

          const searchWrap = document.createElement('div');
          searchWrap.classList.add('search-wrap');
          searchForm.append(searchWrap);

          const searchIconDiv = document.createElement('div');
          searchIconDiv.classList.add('search-icon');
          searchIconDiv.innerHTML = SEARCH_LENS_SVG;
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
          submitButton.innerHTML = `<div class="label"> Submit </div>${SEARCH_SUBMIT_ARROW_SVG}`;
          searchWrap.append(submitButton);

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

          // Popular Keywords
          if (searchSuggestions.popular.length > 0) {
            const popularKeywordsWrap = document.createElement('div');
            popularKeywordsWrap.classList.add('search-suggestions-wrap');
            popularKeywordsWrap.innerHTML = '<div class="label">Popular Keywords:</div>';
            const tokensWrap = document.createElement('div');
            tokensWrap.classList.add('tokens-wrap');
            const ul = document.createElement('ul');
            searchSuggestions.popular.forEach(keyword => {
              const li = document.createElement('li');
              li.textContent = keyword;
              ul.append(li);
            });
            tokensWrap.append(ul);
            popularKeywordsWrap.append(tokensWrap);
            wrapDiv.append(popularKeywordsWrap);
          }

          // Recommended for you
          if (searchSuggestions.recommended.length > 0) {
            const recommendedWrap = document.createElement('div');
            recommendedWrap.classList.add('search-suggestions-wrap');
            recommendedWrap.innerHTML = '<div class="label">Recommended for you:</div>';
            const tokensWrap = document.createElement('div');
            tokensWrap.classList.add('tokens-wrap');
            const ul = document.createElement('ul');
            searchSuggestions.recommended.forEach(keyword => {
              const li = document.createElement('li');
              li.textContent = keyword;
              ul.append(li);
            });
            tokensWrap.append(ul);
            recommendedWrap.append(tokensWrap);
            wrapDiv.append(recommendedWrap);
          }
          return searchScreenWrap;
        };

        const searchLiDesktop = document.createElement('li');
        searchLiDesktop.classList.add('search');
        const searchLinkDesktop = document.createElement('a');
        searchLinkDesktop.href = href;
        searchLinkDesktop.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
        searchLiDesktop.append(searchLinkDesktop);
        searchLiDesktop.append(createSearchScreen(href));
        ulDesktop.append(searchLiDesktop);

        const searchLiMobile = document.createElement('li');
        searchLiMobile.classList.add('search');
        const searchLinkMobile = document.createElement('a');
        searchLinkMobile.href = href;
        searchLinkMobile.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG + `<span> ${text}</span>`;
        searchLiMobile.append(searchLinkMobile);
        searchLiMobile.append(createSearchScreen(href));
        ulMobile.append(searchLiMobile);

        // Add event listener for search toggle
        const toggleSearch = (event) => {
          event.preventDefault();
          event.stopPropagation();
          const currentSearchLi = event.currentTarget.closest('.search');
          const currentSearchScreen = currentSearchLi.querySelector('.search-screen-wrap');
          const isSearchActive = currentSearchLi.classList.toggle('active');

          if (currentSearchScreen) {
            currentSearchScreen.style.opacity = isSearchActive ? '1' : '0';
            currentSearchScreen.style.pointerEvents = isSearchActive ? 'all' : 'none';
            currentSearchScreen.style.transform = isSearchActive ? 'translate(0,0rem)' : 'translate(0,0)';
          }
          // Close other menus when search is active
          if (isSearchActive) {
            const navElement = currentSearchLi.closest('nav');
            const navSections = navElement.querySelector('.main-nav');
            closeAllMenus(navElement, navSections, null); // Close all other menus
            navElement.setAttribute('aria-expanded', 'false'); // Ensure main nav is closed
            const hamburger = navElement.querySelector('.hamburger');
            if (hamburger) hamburger.classList.remove('is-active');
            navElement.classList.remove('is-active');
            document.body.style.overflowY = '';
          }
        };
        searchLiDesktop.querySelector('a').addEventListener('click', toggleSearch);
        searchLiMobile.querySelector('a').addEventListener('click', toggleSearch);
      }
    });
  });

  if (ulDesktop.children.length > 0) {
    toolIconsDesktop.append(ulDesktop);
    navElement.append(toolIconsDesktop);
  }
  if (ulMobile.children.length > 0) {
    toolIconsMobile.append(ulMobile);
    navElement.append(toolIconsMobile);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up'); // Retain original header classes

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.id = 'nav'; // ID for accessibility and JS targeting
  navElement.setAttribute('aria-expanded', 'false'); // Default collapsed
  wrapDiv.append(navElement);

  const domFragment = document.createDocumentFragment();

  // Parse the fragment into logical sections
  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  setupBrand(brandRow, wrapDiv);

  // 2. Setup Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburger);

  // 3. Setup Main Navigation
  setupDesktopNav(navRow, navElement);

  // 4. Setup Tools/Icons (Contact Us, Search)
  setupTools(toolsRow, navElement); // Append tools directly to navElement as per original structure

  // Append the constructed header to the block
  domFragment.append(header);
  block.textContent = '';
  block.append(domFragment);

  // Post-render setup for mobile navigation and event listeners
  const mainNav = block.querySelector('.main-nav');
  if (mainNav) {
    setupMobileNav(block.querySelector('nav'), mainNav);
  }

  // Initial state for desktop/mobile
  const navSections = block.querySelector('.main-nav');
  if (navSections) {
    // Set initial state based on desktop or mobile
    if (isDesktop.matches) {
      navElement.setAttribute('aria-expanded', 'true'); // Desktop nav is always "expanded"
      navElement.classList.add('is-active');
      hamburger.classList.remove('is-active');
    } else {
      navElement.setAttribute('aria-expanded', 'false'); // Mobile nav is initially collapsed
      navElement.classList.remove('is-active');
      hamburger.classList.remove('is-active');
    }

    isDesktop.addEventListener('change', () => {
      if (isDesktop.matches) {
        // Transition to desktop: ensure nav is "expanded" and hamburger is inactive
        navElement.setAttribute('aria-expanded', 'true');
        navElement.classList.add('is-active');
        hamburger.classList.remove('is-active');
        document.body.style.overflowY = '';
        closeAllMenus(navElement, navSections); // Close any open sub-menus
      } else {
        // Transition to mobile: ensure nav is collapsed and hamburger is inactive
        navElement.setAttribute('aria-expanded', 'false');
        navElement.classList.remove('is-active');
        hamburger.classList.remove('is-active');
        document.body.style.overflowY = '';
        closeAllMenus(navElement, navSections); // Close any open sub-menus
      }
    });
  }
}
