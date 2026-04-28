import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS media queries

const SVG_SPRITE = {
  ARROW_RIGHT: '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>',
  SEARCH_LENS: '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>',
  SEARCH_CLOSE: '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>',
  MAIL_ICON: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>',
  SUBMIT_ARROW: '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>',
};

/**
 * Moves instrumentation attributes from an old element to a new element.
 * @param {Element} oldElement The old element.
 * @param {Element} newElement The new element.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  Array.from(oldElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-cq-') || attr.name.startsWith('data-once')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Parses the fragment into its structural components.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {Object} An object containing the brand, nav, and tools rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === 1);
  const brandRow = children[0]?.classList.contains('default-content-wrapper') ? children[0] : children[0];
  const navRow = children[1]?.classList.contains('default-content-wrapper') ? children[1] : children[1];
  const toolsRow = children[2]?.classList.contains('default-content-wrapper') ? children[2] : children[2];

  return { brandRow, navRow, toolsRow };
}

/**
 * Creates an SVG icon element.
 * @param {string} svgContent The SVG content as a string.
 * @param {string[]} classNames Optional array of class names to add to the SVG.
 * @returns {Element} The SVG element.
 */
function createSvgIcon(svgContent, classNames = []) {
  const span = document.createElement('span');
  span.innerHTML = svgContent;
  const svg = span.firstElementChild;
  if (svg && classNames.length > 0) {
    svg.classList.add(...classNames);
  }
  return svg;
}

/**
 * Handles the click event for navigation sections to toggle expansion.
 * @param {Event} e The click event.
 */
function handleNavSectionClick(e) {
  const navSection = e.currentTarget;
  const megaMenu = navSection.querySelector('.mega-menu');
  if (!megaMenu) return;

  if (isDesktop.matches) {
    const expanded = navSection.getAttribute('aria-expanded') === 'true';
    const navSectionsContainer = navSection.closest('.main-nav').querySelector('ul');
    if (navSectionsContainer) {
      navSectionsContainer.querySelectorAll('.has-child').forEach((section) => {
        if (section !== navSection) { // Close other open menus
          section.setAttribute('aria-expanded', 'false');
          section.querySelector('.mega-menu')?.classList.remove('active');
        }
      });
    }
    navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    megaMenu.classList.toggle('active', !expanded);
  } else {
    // Mobile behavior: toggle mega-menu display
    const isVisible = megaMenu.style.display === 'block';
    megaMenu.style.display = isVisible ? 'none' : 'block';
    navSection.classList.toggle('active', !isVisible);
    const arrow = navSection.querySelector('.has-child > span svg');
    if (arrow) {
      // Use a class from the allowlist or manage transform directly
      arrow.style.transform = isVisible ? 'rotate(90deg)' : 'rotate(-90deg)';
    }
    navSection.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
  }
}

/**
 * Recursively processes nested ULs for navigation.
 * @param {Element} ulElement The UL element to process.
 */
function processNestedUl(ulElement) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        li.classList.add('has-sub-child');
        const link = li.querySelector(':scope > a');
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        const label = link ? link.textContent.trim() : (textNode ? textNode.textContent.trim() : '');

        if (!link) {
          const tempLink = document.createElement('a');
          tempLink.textContent = label;
          li.prepend(tempLink);
        }

        const span = document.createElement('span');
        span.innerHTML = SVG_SPRITE.ARROW_RIGHT;
        li.append(span);

        // Create a wrapper div for the nested UL to apply mobile toggle styles
        const subChildDiv = document.createElement('div');
        // The original HTML uses 'has-sub-child' for the wrapper around the UL,
        // and 'has-inner-sub-child' for deeper nesting.
        // We'll use 'has-sub-child' for the first level of nested ULs,
        // and 'has-inner-sub-child' for subsequent levels.
        const parentLi = ulElement.closest('li.has-child, li.has-sub-child');
        if (parentLi && parentLi.classList.contains('has-sub-child')) {
          subChildDiv.classList.add('has-inner-sub-child');
        } else {
          subChildDiv.classList.add('has-sub-child');
        }
        moveInstrumentation(nestedUl, subChildDiv);
        subChildDiv.append(nestedUl);
        li.append(subChildDiv);

        li.setAttribute('aria-expanded', 'false'); // Default collapsed

        li.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent parent LI from toggling
          if (!isDesktop.matches) {
            const isExpanded = subChildDiv.classList.contains('active');
            subChildDiv.classList.toggle('active', !isExpanded);
            span.querySelector('svg').style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(-180deg)';
            li.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
          }
        });
        processNestedUl(nestedUl); // Recurse for deeper nesting
      }
    }
  });
}

/**
 * Sets up the main desktop navigation structure.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {Element} navElement The new nav HTML element.
 */
function setupDesktopNav(navRow, navElement) {
  if (!navRow || !navElement) return;

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(navUl);
  moveInstrumentation(navRow, navUl);

  let currentLeftDivBuffer = [];
  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== 1) return; // Skip text and comment nodes

    // Check for default-content-wrapper and use its children if present
    const effectiveChild = child.classList.contains('default-content-wrapper') ? child : child;

    const pLink = effectiveChild.querySelector('p > a');
    const ulElement = effectiveChild.querySelector('ul');

    if (pLink && !ulElement) {
      // Standalone link, not a menu trigger
      const li = document.createElement('li');
      li.setAttribute('itemprop', 'name');
      const a = pLink.cloneNode(true);
      a.setAttribute('itemprop', 'url');
      li.append(a);
      navUl.append(li);
      moveInstrumentation(effectiveChild, li);
      currentLeftDivBuffer = []; // Clear buffer for standalone links
    } else if (pLink && ulElement) {
      // This is a menu trigger with a submenu
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');
      li.setAttribute('aria-expanded', 'false'); // Default collapsed

      const a = pLink.cloneNode(true);
      a.setAttribute('itemprop', 'url');
      li.append(a);

      const span = document.createElement('span');
      span.innerHTML = SVG_SPRITE.ARROW_RIGHT;
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const wrapContainer = document.createElement('div');
      wrapContainer.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush buffer into left-div
      if (currentLeftDivBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const title = pLink.textContent.trim();
        const sanitizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);

        currentLeftDivBuffer.forEach(bufferedNode => leftDiv.append(bufferedNode));
        centerDiv.append(leftDiv);
      }
      currentLeftDivBuffer = []; // Clear buffer after flushing

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      const menuTitle = pLink.textContent.trim();
      if (menuTitle.toLowerCase() === 'what we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (menuTitle.toLowerCase() === 'careers') {
        subNavWrap.classList.add('careers-div');
      } else if (menuTitle.toLowerCase() === 'who we are') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (menuTitle.toLowerCase() === 'investor relations') {
        subNavWrap.classList.add('element-block'); // Specific class for IR
      }

      // Process the UL and its nested structure
      const clonedUl = ulElement.cloneNode(true);
      processNestedUl(clonedUl); // Start recursion
      subNavWrap.append(clonedUl);

      centerDiv.append(subNavWrap);
      wrapContainer.append(centerDiv);
      megaMenu.append(wrapContainer);
      li.append(megaMenu);
      navUl.append(li);
      moveInstrumentation(effectiveChild, li);

      li.addEventListener('click', handleNavSectionClick);

    } else {
      // Collect non-navigation elements into buffer for the next menu item's left-div
      Array.from(effectiveChild.children).forEach(node => {
        // Only clone specific tags that are expected in the left-div
        if (node.tagName === 'H4' || node.tagName === 'P' || node.tagName === 'UL' || node.classList.contains('latest-two-press-release')) {
          currentLeftDivBuffer.push(node.cloneNode(true));
        }
      });
    }
  });
}

/**
 * Sets up the utility tools section.
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {Element} navElement The new nav HTML element.
 */
function setupTools(toolsRow, navElement) {
  if (!toolsRow || !navElement) return;

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');

  const ulDesktop = document.createElement('ul');
  const ulMobile = document.createElement('ul');

  iconNavDesktop.append(ulDesktop);
  iconNavMobile.append(ulMobile);

  const toolsContent = Array.from(toolsRow.children).filter((node) => node.nodeType === 1);

  toolsContent.forEach((toolSection) => {
    const lists = Array.from(toolSection.querySelectorAll('ul'));
    lists.forEach((list) => {
      Array.from(list.children).forEach((li) => {
        const link = li.querySelector('a');
        if (!link) return;

        const linkText = link.textContent.trim();
        const newLiDesktop = document.createElement('li');
        const newLiMobile = document.createElement('li');
        moveInstrumentation(li, newLiDesktop);
        moveInstrumentation(li, newLiMobile);

        if (link.href.includes('contact-us')) {
          newLiDesktop.classList.add('mail');
          newLiMobile.classList.add('mail');
          const clonedLinkDesktop = link.cloneNode(true);
          clonedLinkDesktop.innerHTML = SVG_SPRITE.MAIL_ICON;
          newLiDesktop.append(clonedLinkDesktop);

          const clonedLinkMobile = link.cloneNode(true);
          clonedLinkMobile.textContent = linkText; // Mobile shows text
          newLiMobile.append(clonedLinkMobile);
        } else if (linkText.toLowerCase() === 'search') {
          newLiDesktop.classList.add('search');
          newLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
          newLiDesktop.setAttribute('aria-expanded', 'false');

          const searchLinkDesktop = document.createElement('a');
          searchLinkDesktop.href = '#';
          searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
          searchLinkDesktop.innerHTML = SVG_SPRITE.SEARCH_LENS + SVG_SPRITE.SEARCH_CLOSE;
          newLiDesktop.append(searchLinkDesktop);

          newLiMobile.classList.add('search');
          newLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
          newLiMobile.setAttribute('aria-expanded', 'false');

          const searchLinkMobile = document.createElement('a');
          searchLinkMobile.href = '#';
          searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
          searchLinkMobile.innerHTML = SVG_SPRITE.SEARCH_LENS + SVG_SPRITE.SEARCH_CLOSE + `<span> ${linkText}</span>`;
          newLiMobile.append(searchLinkMobile);

          // Extract search suggestions from the fragment
          const searchSuggestions = toolSection.querySelector('.search-suggestions-wrap');
          const popularKeywords = searchSuggestions?.querySelector('.tokens-wrap:first-of-type ul');
          const recommendedKeywords = searchSuggestions?.querySelector('.tokens-wrap:last-of-type ul');

          // Search screen for desktop
          const searchScreenWrapDesktop = createSearchScreen(link, popularKeywords, recommendedKeywords);
          newLiDesktop.append(searchScreenWrapDesktop);
          // Search screen for mobile
          const searchScreenWrapMobile = createSearchScreen(link, popularKeywords, recommendedKeywords);
          newLiMobile.append(searchScreenWrapMobile);

          const toggleSearch = (liElement, forceExpanded = null) => {
            const screenWrap = liElement.querySelector('.search-screen-wrap');
            const searchIcon = liElement.querySelector('.lens');
            const closeIcon = liElement.querySelector('.close');

            if (!screenWrap || !searchIcon || !closeIcon) return;

            const expanded = forceExpanded !== null ? forceExpanded : liElement.classList.contains('active');

            if (!expanded) {
              screenWrap.classList.add('active');
              searchIcon.style.display = 'none';
              closeIcon.style.display = 'block';
              liElement.classList.add('active');
              document.body.classList.add('search-open');
              liElement.setAttribute('aria-expanded', 'true');
            } else {
              screenWrap.classList.remove('active');
              searchIcon.style.display = 'block';
              closeIcon.style.display = 'none';
              liElement.classList.remove('active');
              document.body.classList.remove('search-open');
              liElement.setAttribute('aria-expanded', 'false');
            }
          };

          searchLinkDesktop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSearch(newLiDesktop);
          });
          searchLinkMobile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSearch(newLiMobile);
          });

          // Close search on outside click
          document.addEventListener('click', (e) => {
            if (!newLiDesktop.contains(e.target) && newLiDesktop.classList.contains('active')) {
              toggleSearch(newLiDesktop, true);
            }
            if (!newLiMobile.contains(e.target) && newLiMobile.classList.contains('active')) {
              toggleSearch(newLiMobile, true);
            }
          });

          // Close search on Escape key
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              if (newLiDesktop.classList.contains('active')) {
                toggleSearch(newLiDesktop, true);
              }
              if (newLiMobile.classList.contains('active')) {
                toggleSearch(newLiMobile, true);
              }
            }
          });

        } else {
          // Social links or other utility links
          // For social links, we only add them to the mobile menu for now as per original HTML
          newLiMobile.append(link.cloneNode(true));
        }
        ulDesktop.append(newLiDesktop);
        ulMobile.append(newLiMobile);
      });
    });
  });

  navElement.append(iconNavMobile);
  navElement.append(iconNavDesktop);
}

/**
 * Creates the search screen element.
 * @param {Element} searchLink The original search link element.
 * @param {Element} popularKeywordsUl The UL element containing popular keywords from the fragment.
 * @param {Element} recommendedKeywordsUl The UL element containing recommended keywords from the fragment.
 * @returns {Element} The search screen wrapper.
 */
function createSearchScreen(searchLink, popularKeywordsUl, recommendedKeywordsUl) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(wrapDiv);

  const form = document.createElement('form');
  form.action = searchLink.href.startsWith('#') ? 'https://www.mahindra.com/search' : searchLink.href; // Default search action
  form.method = 'get';
  form.id = 'search-block-form';
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');
  wrapDiv.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');
  form.append(searchWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.innerHTML = SVG_SPRITE.SEARCH_LENS;
  searchWrap.append(searchIconDiv);

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('input-text', 'searchtext');
  input.required = true;
  input.name = 'key';
  input.id = 'searchInput';
  input.autocomplete = 'off';
  input.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(input);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div>${SVG_SPRITE.SUBMIT_ARROW}`;
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  const swiper = document.createElement('div');
  swiper.classList.add('swiper', 'scrollSwiper');
  swiper.setAttribute('data-once', 'search-stop-propagation');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.setAttribute('data-once', 'search-stop-propagation');
  swiperWrapper.append(swiperSlide);
  swiper.append(swiperWrapper);
  searchResultBox.append(swiper);
  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.append(swiperScrollbar);
  form.append(searchResultBox);

  // Popular Keywords
  if (popularKeywordsUl) {
    const popularKeywordsDiv = document.createElement('div');
    popularKeywordsDiv.classList.add('search-suggestions-wrap');
    popularKeywordsDiv.setAttribute('data-once', 'search-stop-propagation');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.setAttribute('data-once', 'search-stop-propagation');
    popularLabel.textContent = 'Popular Keywords:'; // This label is static in the HTML, so it's acceptable here.
    popularKeywordsDiv.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    popularTokensWrap.append(popularKeywordsUl.cloneNode(true)); // Clone from fragment
    popularKeywordsDiv.append(popularTokensWrap);
    wrapDiv.append(popularKeywordsDiv);
  }

  // Recommended for you
  if (recommendedKeywordsUl) {
    const recommendedDiv = document.createElement('div');
    recommendedDiv.classList.add('search-suggestions-wrap');
    recommendedDiv.setAttribute('data-once', 'search-stop-propagation');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
    recommendedLabel.textContent = 'Recommended for you:'; // This label is static in the HTML, so it's acceptable here.
    recommendedDiv.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    recommendedTokensWrap.append(recommendedKeywordsUl.cloneNode(true)); // Clone from fragment
    recommendedDiv.append(recommendedTokensWrap);
    wrapDiv.append(recommendedDiv);
  }

  return searchScreenWrap;
}

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element.
 * @param {Element} navSections The nav sections within the container element.
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('active');
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  if (!expanded) {
    nav.classList.add('active');
    hamburger.classList.add('active');
    document.body.classList.add('nav-open');
    nav.setAttribute('aria-expanded', 'true');
  } else {
    nav.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('nav-open');
    nav.setAttribute('aria-expanded', 'false');
    // Close all sub-menus when main nav closes
    navSections.querySelectorAll('.mega-menu').forEach(menu => {
      menu.style.display = 'none';
      const parentLi = menu.closest('.has-child');
      if (parentLi) {
        parentLi.classList.remove('active');
        parentLi.setAttribute('aria-expanded', 'false');
        parentLi.querySelector('.has-child > span svg')?.style.transform = 'rotate(90deg)';
      }
    });
    navSections.querySelectorAll('.has-sub-child.active').forEach(sub => {
      sub.classList.remove('active');
      const parentLi = sub.closest('li.has-sub-child');
      if (parentLi) {
        parentLi.setAttribute('aria-expanded', 'false');
        parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
      }
    });
    navSections.querySelectorAll('.has-inner-sub-child.active-child').forEach(sub => {
      sub.classList.remove('active-child');
      const parentLi = sub.closest('li.has-sub-child');
      if (parentLi) {
        parentLi.setAttribute('aria-expanded', 'false');
        parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
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
  const header = document.createElement('header');
  header.classList.add('main-header', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');
  block.append(header);
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand Row
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > picture + a') || brandRow.querySelector('p > a');
    const brandImg = brandRow.querySelector('picture > img');

    if (brandLink && brandImg) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      const img = brandImg.cloneNode(true);
      img.classList.add('hiddenlogo1');
      a.append(img);
      logoDiv.append(a);
      wrap.append(logoDiv);
      moveInstrumentation(brandRow, logoDiv);
    }
  }

  // 2. Setup Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // 3. Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  mainNav.setAttribute('aria-label', 'Main navigation');
  mainNav.setAttribute('aria-expanded', 'false'); // Default collapsed
  wrap.append(mainNav);
  setupDesktopNav(navRow, mainNav);

  // 4. Setup Tools (Search, Contact, Social)
  setupTools(toolsRow, mainNav); // Append tools into mainNav as per original structure

  // 5. Setup 80th Year Logo (if present in fragment, not explicitly in current fragment)
  // Assuming this would be a separate div in the fragment if needed.
  // For now, based on provided HTML, it's a static element in the header.
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
  wrap.append(year80LogoDiv);

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => toggleMenu(mainNav, mainNav, !mainNav.classList.contains('active')));

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleMenu(mainNav, mainNav, true);
    }
  });

  // Initial state for desktop/mobile
  const applyInitialMenuState = () => {
    if (isDesktop.matches) {
      mainNav.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('nav-open');
      mainNav.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-expanded', 'false');

      mainNav.querySelectorAll('.mega-menu').forEach(menu => {
        menu.style.display = ''; // Reset display for desktop
        menu.classList.remove('active');
        const parentLi = menu.closest('.has-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
        }
      });
      mainNav.querySelectorAll('.has-sub-child').forEach(sub => {
        sub.classList.remove('active');
        const parentLi = sub.closest('li.has-sub-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
          parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
        }
      });
      mainNav.querySelectorAll('.has-inner-sub-child').forEach(sub => {
        sub.classList.remove('active-child');
        const parentLi = sub.closest('li.has-sub-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
          parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
        }
      });
    } else {
      mainNav.querySelectorAll('.mega-menu').forEach(menu => {
        menu.style.display = 'none'; // Hide for mobile initially
        menu.classList.remove('active');
        const parentLi = menu.closest('.has-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
        }
      });
      mainNav.querySelectorAll('.has-sub-child').forEach(sub => {
        sub.classList.remove('active');
        const parentLi = sub.closest('li.has-sub-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
          parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
        }
      });
      mainNav.querySelectorAll('.has-inner-sub-child').forEach(sub => {
        sub.classList.remove('active-child');
        const parentLi = sub.closest('li.has-sub-child');
        if (parentLi) {
          parentLi.setAttribute('aria-expanded', 'false');
          parentLi.querySelector('span svg')?.style.transform = 'rotate(90deg)';
        }
      });
    }
  };

  applyInitialMenuState();
  isDesktop.addEventListener('change', applyInitialMenuState);
}
