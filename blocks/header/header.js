import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on CSS

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Moves instrumentation attributes from an original element to a new one.
 * @param {Element} originalElement The original element with instrumentation.
 * @param {Element} newElement The new element to move instrumentation to.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;

  const attributesToMove = ['data-once', 'data-drupal-form-fields'];

  attributesToMove.forEach(attr => {
    if (originalElement.hasAttribute(attr)) {
      newElement.setAttribute(attr, originalElement.getAttribute(attr));
      originalElement.removeAttribute(attr);
    }
  });
}

/**
 * Parses the fragment into brand, nav, and tools rows.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {Object} An object containing the brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  if (!fragment) return { brandRow: null, navRow: null, toolsRow: null };

  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  const sections = Array.from(fragment.children).filter(el => el.tagName === 'DIV');

  // Rule 2.1: Content Density Discovery (Agnostic)
  // Brand Row: The FIRST section containing a <picture> or branding <img>.
  brandRow = sections.find(section => section.querySelector('picture, img'));

  // Nav Row: The section with the HIGHEST density of <ul> elements.
  let maxUlCount = -1;
  sections.forEach(section => {
    const ulCount = section.querySelectorAll('ul').length;
    if (ulCount > maxUlCount) {
      maxUlCount = ulCount;
      navRow = section;
    }
  });

  // Tools Row: The remaining section(s) containing social links or utility links.
  // Filter out brandRow and navRow, then check remaining for social/utility links
  const remainingSections = sections.filter(section => section !== brandRow && section !== navRow);
  toolsRow = remainingSections.find(section => {
    const links = Array.from(section.querySelectorAll('a'));
    return links.some(link =>
      /facebook|twitter|linkedin|instagram|youtube|contact-us|search/i.test(link.href || link.textContent)
    );
  });

  // Rule 2.2: Wrapper-Aware Root
  const getRoot = (section) => {
    if (!section) return null;
    const wrapper = section.querySelector('.default-content-wrapper');
    return wrapper || section;
  };

  return {
    brandRow: getRoot(brandRow),
    navRow: getRoot(navRow),
    toolsRow: getRoot(toolsRow),
  };
}

/**
 * Creates a chevron SVG element.
 * @returns {HTMLSpanElement} The span element containing the chevron SVG.
 */
function createChevron() {
  const span = document.createElement('span');
  span.innerHTML = CHEVRON_SVG;
  return span;
}

/**
 * Recursively processes a list of menu items to create nested navigation.
 * @param {HTMLUListElement} ulElement The UL element to process.
 * @param {string} parentClass The class to apply to parent LI elements.
 * @param {string} childClass The class to apply to child DIV wrappers.
 */
function processNestedMenu(ulElement, parentClass, childClass) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach(li => {
    if (li.tagName === 'LI') {
      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        li.classList.add(parentClass);
        const link = li.querySelector(':scope > a');
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

        let triggerElement = link;
        if (!triggerElement && textNode) {
          triggerElement = document.createElement('span');
          triggerElement.textContent = textNode.textContent.trim();
          textNode.remove();
          li.prepend(triggerElement);
        }

        if (triggerElement) {
          const chevron = createChevron();
          triggerElement.after(chevron);

          const childDiv = document.createElement('div');
          childDiv.classList.add(childClass);
          childDiv.append(nestedUl); // Move the UL into the new div
          li.append(childDiv);

          // Add click listener for mobile
          chevron.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            childDiv.classList.toggle('active-child'); // Apply active-child to the div
            chevron.querySelector('svg').classList.toggle('rotate-chevron'); // Example class for rotation
            // Close other open siblings at the same level
            Array.from(li.parentNode.children).forEach(sibling => {
              if (sibling !== li && sibling.classList.contains('active')) {
                sibling.classList.remove('active');
                const siblingChildDiv = sibling.querySelector(`:scope > .${childClass}`);
                if (siblingChildDiv) siblingChildDiv.classList.remove('active-child');
                const siblingChevron = sibling.querySelector(':scope > span svg');
                if (siblingChevron) siblingChevron.classList.remove('rotate-chevron');
              }
            });
          });
        }
        processNestedMenu(nestedUl, parentClass, childClass); // Recurse for deeper levels
      }
    }
  });
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row element.
 * @param {Element} navElement The main nav element to append to.
 * @param {function} moveInstrumentationFn The instrumentation function.
 */
function setupDesktopNav(navRow, navElement, moveInstrumentationFn) {
  if (!navRow || !navElement) return;

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  // Instrumentation for the main UL should come from the navRow if it has a direct UL child
  const originalUl = navRow.querySelector('ul');
  if (originalUl) {
    moveInstrumentationFn(originalUl, mainUl);
  }

  // Iterate through children of navRow to build the desktop navigation
  let currentContentBuffer = [];
  let currentLi = null;

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) return;

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a main nav item trigger (e.g., "Who We Are")
      if (currentLi) {
        // If there was a previous LI, flush its buffer
        const megaMenu = currentLi.querySelector('.mega-menu');
        if (megaMenu) {
          const centerDiv = megaMenu.querySelector('.center-div');
          if (centerDiv) {
            const leftDiv = document.createElement('div');
            let titleText = currentLi.querySelector('a') ? currentLi.querySelector('a').textContent.trim() : currentLi.textContent.trim();
            if (titleText) {
              const sanitizedTitle = titleText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
              leftDiv.classList.add('left-div', `${sanitizedTitle}-left-div`);
            } else {
              leftDiv.classList.add('left-div');
            }

            const h4 = document.createElement('h4');
            h4.classList.add('left-div-heading');
            const h4Link = document.createElement('a');
            h4Link.textContent = titleText;
            h4.append(h4Link);
            leftDiv.append(h4);

            currentContentBuffer.forEach(bufferedEl => leftDiv.append(bufferedEl));
            centerDiv.prepend(leftDiv); // Prepend to ensure left-div is first
          }
        }
        currentContentBuffer = []; // Clear buffer for next LI
      }

      currentLi = document.createElement('li');
      currentLi.classList.add('has-child', 'hover-red');
      moveInstrumentationFn(child, currentLi); // Move instrumentation from P to LI

      const link = child.querySelector('a');
      if (link) {
        const clonedLink = link.cloneNode(true);
        clonedLink.setAttribute('itemprop', 'url');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.append(clonedLink);
        moveInstrumentationFn(link, clonedLink);
      } else {
        const textSpan = document.createElement('span');
        textSpan.textContent = child.textContent.trim();
        currentLi.setAttribute('itemprop', 'name');
        currentLi.append(textSpan);
      }

      const chevron = createChevron();
      currentLi.append(chevron);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      currentLi.append(megaMenu);

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap', 'container');
      megaMenu.append(wrapDiv);

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      wrapDiv.append(centerDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);

      mainUl.append(currentLi);

    } else if (child.tagName === 'UL' && currentLi) {
      // This UL is a sub-navigation for the current main nav item
      const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
      if (subNavWrap) {
        const clonedUl = child.cloneNode(true);
        subNavWrap.append(clonedUl);
        moveInstrumentationFn(child, clonedUl);
        processNestedMenu(clonedUl, 'has-sub-child', 'has-inner-sub-child');
      }
      currentContentBuffer = []; // Clear buffer after consuming UL
    } else if (currentLi) {
      // Collect other content (like P tags with descriptions, or H4s) into the buffer
      currentContentBuffer.push(child.cloneNode(true));
      moveInstrumentationFn(child, currentContentBuffer[currentContentBuffer.length - 1]);
    }
  });

  // Flush any remaining buffer for the last LI
  if (currentLi && currentContentBuffer.length > 0) {
    const megaMenu = currentLi.querySelector('.mega-menu');
    if (megaMenu) {
      const centerDiv = megaMenu.querySelector('.center-div');
      if (centerDiv) {
        const leftDiv = document.createElement('div');
        let titleText = currentLi.querySelector('a') ? currentLi.querySelector('a').textContent.trim() : currentLi.textContent.trim();
        if (titleText) {
          const sanitizedTitle = titleText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add('left-div', `${sanitizedTitle}-left-div`);
        } else {
          leftDiv.classList.add('left-div');
        }

        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = titleText;
        h4.append(h4Link);
        leftDiv.append(h4);

        currentContentBuffer.forEach(bufferedEl => leftDiv.append(bufferedEl));
        centerDiv.prepend(leftDiv);
      }
    }
  }

  navElement.append(mainUl);
}

/**
 * Creates the search screen wrapper with all its internal elements.
 * @param {function} moveInstrumentationFn The instrumentation function.
 * @returns {HTMLDivElement} The search screen wrap element.
 */
function createSearchScreenWrap(moveInstrumentationFn) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys'); // Add this attribute
  wrapDiv.append(searchForm);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchForm.append(searchWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.innerHTML = SEARCH_SVG;
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
  submitButton.type = 'submit';
  submitButton.classList.add('submit-button');
  searchWrap.append(submitButton);

  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = 'Submit';
  submitButton.append(submitLabel);
  submitButton.innerHTML += SUBMIT_ARROW_SVG;

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initial state
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

  // Popular Keywords
  const popularKeywordsWrap = document.createElement('div');
  popularKeywordsWrap.classList.add('search-suggestions-wrap');
  wrapDiv.append(popularKeywordsWrap);

  const popularLabel = document.createElement('div');
  popularLabel.classList.add('label');
  popularLabel.textContent = 'Popular Keywords:';
  popularKeywordsWrap.append(popularLabel);

  const popularTokensWrap = document.createElement('div');
  popularTokensWrap.classList.add('tokens-wrap');
  popularKeywordsWrap.append(popularTokensWrap);

  const popularUl = document.createElement('ul');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach(keyword => {
    const keywordLi = document.createElement('li');
    keywordLi.textContent = keyword;
    popularUl.append(keywordLi);
  });
  popularTokensWrap.append(popularUl);

  // Recommended for you
  const recommendedWrap = document.createElement('div');
  recommendedWrap.classList.add('search-suggestions-wrap');
  wrapDiv.append(recommendedWrap);

  const recommendedLabel = document.createElement('div');
  recommendedLabel.classList.add('label');
  recommendedLabel.textContent = 'Recommended for you:';
  recommendedWrap.append(recommendedLabel);

  const recommendedTokensWrap = document.createElement('div');
  recommendedTokensWrap.classList.add('tokens-wrap');
  recommendedWrap.append(recommendedTokensWrap);

  const recommendedUl = document.createElement('ul');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach(keyword => {
    const keywordLi = document.createElement('li');
    keywordLi.textContent = keyword;
    recommendedUl.append(keywordLi);
  });
  recommendedTokensWrap.append(recommendedUl);

  // Apply instrumentation to the search screen wrap and its children
  // This is a bit tricky as the original fragment might not have a single element for the whole search screen.
  // We'll apply it to the top-level searchScreenWrap if the original search LI had it.
  const originalSearchLi = document.querySelector('.main-header .wrap li.search');
  if (originalSearchLi) {
    moveInstrumentationFn(originalSearchLi, searchScreenWrap);
    moveInstrumentationFn(originalSearchLi.querySelector('.search-screen-wrap .wrap'), wrapDiv);
    moveInstrumentationFn(originalSearchLi.querySelector('form'), searchForm);
    moveInstrumentationFn(originalSearchLi.querySelector('.search-wrap'), searchWrap);
    moveInstrumentationFn(originalSearchLi.querySelector('.search-icon'), searchIconDiv);
    moveInstrumentationFn(originalSearchLi.querySelector('input.searchtext'), searchInput);
    moveInstrumentationFn(originalSearchLi.querySelector('button.submit-button'), submitButton);
    moveInstrumentationFn(originalSearchLi.querySelector('.submit-button .label'), submitLabel);
    moveInstrumentationFn(originalSearchLi.querySelector('.searchResultBox'), searchResultBox);
    moveInstrumentationFn(originalSearchLi.querySelector('.search-suggestions-wrap'), popularKeywordsWrap);
    moveInstrumentationFn(originalSearchLi.querySelector('.search-suggestions-wrap .tokens-wrap'), popularTokensWrap);
    moveInstrumentationFn(originalSearchLi.querySelectorAll('.search-suggestions-wrap')[1], recommendedWrap);
    moveInstrumentationFn(originalSearchLi.querySelectorAll('.search-suggestions-wrap .tokens-wrap')[1], recommendedTokensWrap);
  }

  return searchScreenWrap;
}


/**
 * Sets up utility and social tools.
 * @param {Element} toolsRow The tools row element.
 * @param {Element} navElement The main nav element to append to.
 * @param {function} moveInstrumentationFn The instrumentation function.
 */
function setupTools(toolsRow, navElement, moveInstrumentationFn) {
  if (!toolsRow || !navElement) return;

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  moveInstrumentationFn(toolsRow, desktopIconNav);

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  moveInstrumentationFn(toolsRow, mobileIconNav);

  const desktopUl = document.createElement('ul');
  const mobileUl = document.createElement('ul');

  // Create a single search screen wrap instance to be cloned
  const baseSearchScreenWrap = createSearchScreenWrap(moveInstrumentationFn);

  Array.from(toolsRow.children).forEach(child => {
    if (child.nodeType === Node.COMMENT_NODE) return;

    if (child.tagName === 'UL') {
      Array.from(child.children).forEach(li => {
        if (li.tagName === 'LI') {
          const link = li.querySelector('a');
          if (link) {
            const liDesktop = document.createElement('li');
            const liMobile = document.createElement('li');
            moveInstrumentationFn(li, liDesktop);
            moveInstrumentationFn(li, liMobile);

            const desktopLink = link.cloneNode(true);
            const mobileLink = link.cloneNode(true);

            if (link.textContent.toLowerCase().includes('contact us')) {
              liDesktop.classList.add('mail');
              liMobile.classList.add('mail');
              desktopLink.innerHTML = MAIL_SVG; // Replace text with SVG for desktop
              mobileLink.innerHTML = MAIL_SVG + ' Contact Us'; // Keep text for mobile
              liDesktop.append(desktopLink);
              liMobile.append(mobileLink);
            } else if (link.textContent.toLowerCase().includes('search')) {
              liDesktop.classList.add('search');
              liMobile.classList.add('search');

              const searchLinkDesktop = document.createElement('a');
              searchLinkDesktop.href = '#';
              searchLinkDesktop.innerHTML = SEARCH_SVG + CLOSE_SVG;
              searchLinkDesktop.setAttribute('aria-expanded', 'false');
              moveInstrumentationFn(link, searchLinkDesktop);
              liDesktop.append(searchLinkDesktop);

              const searchLinkMobile = document.createElement('a');
              searchLinkMobile.href = '#';
              searchLinkMobile.innerHTML = SEARCH_SVG + CLOSE_SVG + ' <span>Search</span>';
              searchLinkMobile.setAttribute('aria-expanded', 'false');
              moveInstrumentationFn(link, searchLinkMobile);
              liMobile.append(searchLinkMobile);

              const desktopSearchScreenWrap = baseSearchScreenWrap.cloneNode(true);
              const mobileSearchScreenWrap = baseSearchScreenWrap.cloneNode(true);

              liDesktop.append(desktopSearchScreenWrap);
              liMobile.append(mobileSearchScreenWrap);

              // Add click listeners for search toggle
              const toggleSearch = (parentLi, isMobile) => {
                const searchScreen = parentLi.querySelector('.search-screen-wrap');
                const searchIcon = parentLi.querySelector('.lens');
                const closeIcon = parentLi.querySelector('.close');
                const searchTrigger = parentLi.querySelector('a');

                if (!searchScreen || !searchIcon || !closeIcon || !searchTrigger) return;

                const isSearchOpen = searchScreen.classList.contains('active');
                if (isSearchOpen) {
                  searchScreen.classList.remove('active');
                  searchIcon.style.display = 'block';
                  closeIcon.style.display = 'none';
                  document.body.classList.remove('search-open');
                  searchTrigger.setAttribute('aria-expanded', 'false');
                } else {
                  // Close any other open search screens
                  document.querySelectorAll('.search-screen-wrap.active').forEach(openSearch => {
                    openSearch.classList.remove('active');
                    const parent = openSearch.closest('li.search');
                    if (parent) {
                      parent.querySelector('.lens').style.display = 'block';
                      parent.querySelector('.close').style.display = 'none';
                      parent.querySelector('a').setAttribute('aria-expanded', 'false');
                    }
                  });

                  searchScreen.classList.add('active');
                  searchIcon.style.display = 'none';
                  closeIcon.style.display = 'block';
                  document.body.classList.add('search-open');
                  searchTrigger.setAttribute('aria-expanded', 'true');
                  // Focus on the search input
                  const input = searchScreen.querySelector('input.searchtext');
                  if (input) input.focus();
                }
              };

              searchLinkDesktop.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSearch(liDesktop, false);
              });
              searchLinkMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSearch(liMobile, true);
              });

            } else {
              liDesktop.append(desktopLink);
              liMobile.append(mobileLink);
            }
            desktopUl.append(liDesktop);
            mobileUl.append(liMobile);
          }
        }
      });
    }
  });
  desktopIconNav.append(desktopUl);
  mobileIconNav.append(mobileUl);
  navElement.append(desktopIconNav);
  navElement.append(mobileIconNav);
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav The navigation element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior.
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  if (!hamburger || !mainNav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('active');

  if (expanded) {
    nav.classList.remove('active');
    mainNav.classList.remove('active');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  } else {
    nav.classList.add('active');
    mainNav.classList.add('active');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from original header
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const navContent = document.createElement('div');
  navContent.classList.add('container');
  const navWrap = document.createElement('div');
  navWrap.classList.add('wrap');
  navContent.append(navWrap);

  const domFragment = document.createDocumentFragment();

  // Helper to move instrumentation from original fragment element to new element
  const moveInstrumentationFn = (original, newEl) => {
    if (!original || !newEl) return;
    const dataOnce = original.getAttribute('data-once');
    if (dataOnce) {
      newEl.setAttribute('data-once', dataOnce);
    }
    const dataDrupalFormFields = original.getAttribute('data-drupal-form-fields');
    if (dataDrupalFormFields) {
      newEl.setAttribute('data-drupal-form-fields', dataDrupalFormFields);
    }
    // Remove original element's data-once to prevent re-processing
    original.removeAttribute('data-once');
    original.removeAttribute('data-drupal-form-fields');
  };

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand Row
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentationFn(brandRow, logoDiv);

    const link = brandRow.querySelector('a');
    const img = brandRow.querySelector('img');

    if (link && img) {
      const newLink = link.cloneNode(false);
      moveInstrumentationFn(link, newLink);
      const newImg = img.cloneNode(true);
      if (!newImg.src && newImg.srcset) { // Fallback for missing src
        newImg.src = newImg.srcset.split(',')[0].split(' ')[0];
      }
      if (newImg.src) { // Only append if src is valid
        newImg.classList.add('hiddenlogo1'); // Add original class
        newLink.append(newImg);
        logoDiv.append(newLink);
      }
    }
    domFragment.append(logoDiv);
  } else {
    // If brandRow is empty, still create an empty logo div to match structure
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    domFragment.append(logoDiv);
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  // Find original hamburger to move instrumentation
  const originalHamburger = document.querySelector('.main-header .hamburger');
  if (originalHamburger) {
    moveInstrumentationFn(originalHamburger, hamburger);
  }
  domFragment.append(hamburger);

  // 2. Setup Nav Row
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  if (navRow) {
    moveInstrumentationFn(navRow, mainNav); // Apply instrumentation from navRow to mainNav
    setupDesktopNav(navRow, mainNav, moveInstrumentationFn);
  }
  domFragment.append(mainNav);

  // 3. Setup Tools Row
  if (toolsRow) {
    setupTools(toolsRow, mainNav, moveInstrumentationFn);
  } else {
    // If toolsRow is empty, still create empty icon-navs to match structure
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
    desktopIconNav.append(document.createElement('ul')); // Ensure UL exists
    mainNav.append(desktopIconNav);

    const mobileIconNav = document.createElement('div');
    mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
    mobileIconNav.append(document.createElement('ul')); // Ensure UL exists
    mainNav.append(mobileIconNav);
  }

  // Append the 80th year logo if it exists in the original header
  const eightyYearLogoOriginal = document.querySelector('.main-header .wrap .logo.year-80-logo');
  if (eightyYearLogoOriginal) {
    const eightyYearLogoClone = eightyYearLogoOriginal.cloneNode(true);
    domFragment.append(eightyYearLogoClone);
  }

  navWrap.append(domFragment);
  block.append(navContent);

  // --- Event Listeners and Mobile Logic ---
  hamburger.addEventListener('click', () => toggleMobileMenu(block));

  // Close mobile menu on desktop resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      toggleMobileMenu(block, true); // Force close
    }
  });

  // Close mobile menu and search overlay on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (block.classList.contains('active')) {
        toggleMobileMenu(block, true); // Close mobile menu
      }
      const activeSearchScreens = document.querySelectorAll('.search-screen-wrap.active');
      activeSearchScreens.forEach(searchScreen => {
        const parentLi = searchScreen.closest('li.search');
        if (parentLi) {
          const searchTrigger = parentLi.querySelector('a');
          searchScreen.classList.remove('active');
          parentLi.querySelector('.lens').style.display = 'block';
          parentLi.querySelector('.close').style.display = 'none';
          document.body.classList.remove('search-open');
          if (searchTrigger) searchTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}
