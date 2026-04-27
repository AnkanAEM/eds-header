import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment HTML into structured rows.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {Object} An object containing the brand, nav, and tools rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === 1);
  const brandRow = children[0];
  const navRow = children[1];
  const toolsRow = children[2];

  // Account for .default-content-wrapper nesting
  const unwrap = (el) => el?.querySelector('.default-content-wrapper')?.firstElementChild || el;

  return {
    brandRow: unwrap(brandRow),
    navRow: unwrap(navRow),
    toolsRow: unwrap(toolsRow),
  };
}

/**
 * Extracts the immediate text content of an element, excluding child elements' text.
 * @param {Element} element The element to extract text from.
 * @returns {string} The immediate text content.
 */
function getImmediateText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

/**
 * Recursively builds a nested UL structure for navigation.
 * @param {HTMLUListElement} ulElement The root UL element from the fragment.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function buildNestedNav(ulElement) {
  const newUl = document.createElement('ul');
  Array.from(ulElement.children).forEach((li) => {
    const newLi = document.createElement('li');
    const link = li.querySelector('a');
    const liText = getImmediateText(li);

    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      newLi.append(newLink);
    } else if (liText) {
      // If no direct link but has text, create a span for the text
      const textSpan = document.createElement('span');
      textSpan.textContent = liText;
      newLi.append(textSpan);
    }

    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      newLi.classList.add('has-sub-child');
      const span = document.createElement('span');
      span.innerHTML = SVG_CHEVRON;
      newLi.append(span);
      const innerDiv = document.createElement('div');
      innerDiv.classList.add('has-inner-sub-child');
      innerDiv.append(buildNestedNav(nestedUl)); // Recursive call
      newLi.append(innerDiv);
    }
    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Sets up the main navigation structure and behavior.
 * @param {Element} navRow The navigation row from the fragment.
 * @param {Element} mainNavContainer The main navigation container element.
 */
function setupMainNav(navRow, mainNavContainer) {
  if (!navRow) return;

  mainNavContainer.classList.add('main-nav');
  mainNavContainer.setAttribute('data-once', 'initSubChildToggle');
  mainNavContainer.setAttribute('aria-expanded', 'false'); // Default to collapsed for mobile

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNavContainer.append(navUl);

  let currentLeftDivBuffer = [];
  let currentMegaMenuTitle = '';

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    const triggerLinkP = child.querySelector('p > a');
    if (triggerLinkP) {
      // This is a main navigation item (trigger)
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const a = document.createElement('a');
      a.href = triggerLinkP.href;
      a.textContent = triggerLinkP.textContent;
      a.setAttribute('itemprop', 'url');
      li.append(a);

      const spanChevron = document.createElement('span');
      spanChevron.innerHTML = SVG_CHEVRON;
      li.append(spanChevron);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush buffered content into a left-div for the current mega-menu
      if (currentLeftDivBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        if (currentMegaMenuTitle) {
          leftDiv.classList.add(`${currentMegaMenuTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-left-div`);
        }

        const h4 = document.createElement('h4');
        h4.classList.add('left-div-heading');
        const h4Link = document.createElement('a');
        h4Link.textContent = currentMegaMenuTitle;
        if (triggerLinkP.href) h4Link.href = triggerLinkP.href;
        h4.append(h4Link);
        leftDiv.append(h4);

        currentLeftDivBuffer.forEach((bufferedNode) => {
          // Special handling for list-text-red items
          if (bufferedNode.tagName === 'UL') {
            Array.from(bufferedNode.children).forEach(item => {
              // Check if the li contains text content that matches the pattern "NUMBER+ <span>TEXT</span>"
              const textContent = item.textContent.trim();
              if (/\d+\s+/.test(textContent) && item.querySelector('span')) {
                item.classList.add('list-text-red');
              }
            });
          }
          leftDiv.append(bufferedNode);
        });
        centerDiv.append(leftDiv);
        currentLeftDivBuffer = []; // Clear buffer
        currentMegaMenuTitle = ''; // Clear title
      }

      const nextSibling = child.nextElementSibling;
      if (nextSibling && nextSibling.tagName === 'UL') {
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');

        // Determine specific sub-nav wrap classes based on main nav item text
        const navItemText = triggerLinkP.textContent.toLowerCase();
        if (navItemText === 'who we are') {
          subNavWrap.classList.add('about-us-sub-nav');
          const ul1 = document.createElement('ul');
          const ul2 = document.createElement('ul');
          Array.from(nextSibling.children).slice(0, 3).forEach(item => ul1.append(item.cloneNode(true)));
          Array.from(nextSibling.children).slice(3).forEach(item => ul2.append(item.cloneNode(true)));
          if (ul1.children.length > 0) subNavWrap.append(buildNestedNav(ul1));
          if (ul2.children.length > 0) subNavWrap.append(buildNestedNav(ul2));
        } else if (navItemText === 'what we do' || navItemText === 'careers') {
          subNavWrap.classList.add(navItemText.replace(/\s+/g, '-')); // Use the exact class from original HTML
          subNavWrap.append(buildNestedNav(nextSibling));
        } else if (navItemText === 'investor relations') {
          subNavWrap.classList.add('element-block');
          const firstLinkIsPdf = nextSibling.querySelector(':scope > li > a[href$=".pdf"]');
          if (firstLinkIsPdf) {
            const oneLinkUl = document.createElement('ul');
            oneLinkUl.classList.add('sub-nav-wrap-one-link');
            const firstLi = firstLinkIsPdf.closest('li');
            if (firstLi) oneLinkUl.append(firstLi.cloneNode(true));
            subNavWrap.append(oneLinkUl);
          }
          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
          const remainingLIs = Array.from(nextSibling.children).filter((liItem) => {
            const link = liItem.querySelector('a');
            return link && !link.href.endsWith('.pdf');
          });

          const ul1 = document.createElement('ul');
          const ul2 = document.createElement('ul');
          remainingLIs.forEach((liItem, index) => {
            if (index < Math.ceil(remainingLIs.length / 2)) {
              ul1.append(liItem.cloneNode(true));
            } else {
              ul2.append(liItem.cloneNode(true));
            }
          });
          if (ul1.children.length > 0) innerSubNavWrapList.append(buildNestedNav(ul1));
          if (ul2.children.length > 0) innerSubNavWrapList.append(buildNestedNav(ul2));
          if (innerSubNavWrapList.children.length > 0) subNavWrap.append(innerSubNavWrapList);
        } else if (navItemText === 'newsroom') {
          // Newsroom has a different structure with two Uls directly
          const newsroomUl1 = document.createElement('ul');
          const newsroomUl2 = document.createElement('ul');
          Array.from(nextSibling.children).slice(0, 2).forEach(item => newsroomUl1.append(item.cloneNode(true)));
          Array.from(nextSibling.children).slice(2).forEach(item => newsroomUl2.append(item.cloneNode(true)));
          if (newsroomUl1.children.length > 0) subNavWrap.append(buildNestedNav(newsroomUl1));
          if (newsroomUl2.children.length > 0) subNavWrap.append(buildNestedNav(newsroomUl2));
        } else {
          subNavWrap.append(buildNestedNav(nextSibling));
        }
        centerDiv.append(subNavWrap);
      }
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
      navUl.append(li);
    } else {
      // Buffer non-navigation content that should go into the next mega-menu's left-div
      currentLeftDivBuffer.push(child.cloneNode(true));
      const hTag = child.querySelector('h1, h2, h3, h4, h5, h6');
      if (hTag) {
        currentMegaMenuTitle = hTag.textContent;
      } else if (child.tagName === 'P' && child.textContent.trim()) {
        const firstWord = child.textContent.trim().split(' ')[0];
        if (firstWord && firstWord.length > 1 && firstWord === firstWord.toUpperCase()) {
          currentMegaMenuTitle = child.textContent;
        }
      }
    }
  });

  // Desktop hover/click behavior for mega menus
  if (isDesktop.matches) {
    navUl.querySelectorAll('.has-child').forEach((li) => {
      li.addEventListener('mouseenter', () => {
        navUl.querySelectorAll('.has-child').forEach((otherLi) => {
          if (otherLi !== li) {
            otherLi.classList.remove('active');
            const otherMegaMenu = otherLi.querySelector('.mega-menu');
            if (otherMegaMenu) {
              otherMegaMenu.style.opacity = '0';
              otherMegaMenu.style.pointerEvents = 'none';
            }
          }
        });
        li.classList.add('active');
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
        }
      });

      li.addEventListener('mouseleave', () => {
        li.classList.remove('active');
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.opacity = '0';
          megaMenu.style.pointerEvents = 'none';
        }
      });
    });

    // Sub-menu toggles for desktop (if any nested Uls exist within mega-menu)
    navUl.querySelectorAll('.has-sub-child > span').forEach((span) => {
      const parentLi = span.closest('li');
      if (parentLi) {
        parentLi.addEventListener('mouseenter', () => {
          parentLi.classList.add('active');
          const subChildDiv = parentLi.querySelector('.has-inner-sub-child');
          if (subChildDiv) {
            subChildDiv.classList.add('active-child');
          }
        });
        parentLi.addEventListener('mouseleave', () => {
          parentLi.classList.remove('active');
          const subChildDiv = parentLi.querySelector('.has-inner-sub-child');
          if (subChildDiv) {
            subChildDiv.classList.remove('active-child');
          }
        });
      }
    });
  } else {
    // Mobile click behavior for sub-menus
    navUl.querySelectorAll('.has-child > span').forEach((span) => {
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentLi = span.closest('li');
        if (parentLi) {
          const megaMenu = parentLi.querySelector('.mega-menu');
          if (megaMenu) {
            const isActive = parentLi.classList.toggle('active');
            megaMenu.style.display = isActive ? 'block' : 'none';
            span.style.transform = isActive ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        }
      });
    });

    navUl.querySelectorAll('.has-sub-child > span').forEach((span) => {
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentLi = span.closest('li');
        if (parentLi) {
          const subChildDiv = parentLi.querySelector('.has-inner-sub-child');
          if (subChildDiv) {
            const isActive = parentLi.classList.toggle('active');
            subChildDiv.classList.toggle('active-child');
            subChildDiv.style.maxHeight = isActive ? `${subChildDiv.scrollHeight}px` : '0';
            subChildDiv.style.opacity = isActive ? '1' : '0';
            span.style.transform = isActive ? 'rotate(-180deg)' : 'rotate(90deg)';
          }
        }
      });
    });
  }
}

/**
 * Sets up the utility tools section (contact, search).
 * @param {Element} toolsRow The tools row from the fragment.
 * @param {Element} wrapDiv The main wrap div to append desktop tools to.
 * @param {Element} mainNavContainer The main nav container to append mobile tools to.
 */
function setupTools(toolsRow, wrapDiv, mainNavContainer) {
  if (!toolsRow) return;

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIconNav.append(desktopUl);

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);

  // Create a template for the search screen, to be cloned for desktop and mobile
  const searchScreenWrapTemplate = document.createElement('div');
  searchScreenWrapTemplate.classList.add('search-screen-wrap');
  searchScreenWrapTemplate.setAttribute('aria-hidden', 'true'); // Initially hidden
  const searchWrapInnerTemplate = document.createElement('div');
  searchWrapInnerTemplate.classList.add('wrap');
  searchScreenWrapTemplate.append(searchWrapInnerTemplate);

  const searchFormTemplate = document.createElement('form');
  searchFormTemplate.action = 'https://www.mahindra.com/search';
  searchFormTemplate.method = 'get';
  searchFormTemplate.id = 'search-block-form';
  searchFormTemplate.setAttribute('accept-charset', 'UTF-8');
  searchFormTemplate.setAttribute('data-drupal-form-fields', 'edit-keys');

  const searchInputWrapTemplate = document.createElement('div');
  searchInputWrapTemplate.classList.add('search-wrap');

  const searchIconTemplate = document.createElement('div');
  searchIconTemplate.classList.add('search-icon');
  searchIconTemplate.innerHTML = SVG_SEARCH_LENS;
  searchInputWrapTemplate.append(searchIconTemplate);

  const searchInputTemplate = document.createElement('input');
  searchInputTemplate.type = 'text';
  searchInputTemplate.classList.add('input-text', 'searchtext');
  searchInputTemplate.required = true;
  searchInputTemplate.name = 'key';
  searchInputTemplate.id = 'searchInput';
  searchInputTemplate.autocomplete = 'off';
  searchInputTemplate.setAttribute('aria-label', 'Search'); // Accessibility
  searchInputWrapTemplate.append(searchInputTemplate);

  const submitButtonTemplate = document.createElement('button');
  submitButtonTemplate.classList.add('submit-button');
  submitButtonTemplate.type = 'submit';
  const submitLabelTemplate = document.createElement('div');
  submitLabelTemplate.classList.add('label');
  // Dynamically get "Submit" text from fragment if available, otherwise use default
  const submitTextElement = toolsRow.querySelector('li a[href*="search"] + div.label');
  submitLabelTemplate.textContent = submitTextElement ? submitTextElement.textContent : 'Submit';
  submitButtonTemplate.append(submitLabelTemplate, SVG_SUBMIT_ARROW);
  searchInputWrapTemplate.append(submitButtonTemplate);
  searchFormTemplate.append(searchInputWrapTemplate);

  const searchResultBoxTemplate = document.createElement('div');
  searchResultBoxTemplate.classList.add('searchResultBox');
  searchResultBoxTemplate.style.display = 'none';
  searchResultBoxTemplate.innerHTML = `
    <div class="swiper scrollSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
      </div>
    </div>
    <div class="swiper-scrollbar"></div>
  `;
  searchFormTemplate.append(searchResultBoxTemplate);
  searchWrapInnerTemplate.append(searchFormTemplate);

  // Extract search suggestions dynamically from the fragment
  const searchSuggestions = [];
  toolsRow.querySelectorAll('.search-suggestions-wrap').forEach(suggestionWrap => {
    const label = suggestionWrap.querySelector('.label')?.textContent;
    const keywords = Array.from(suggestionWrap.querySelectorAll('.tokens-wrap ul li')).map(li => li.textContent);
    if (label && keywords.length > 0) {
      searchSuggestions.push({ label, keywords });
    }
  });

  searchSuggestions.forEach((suggestion) => {
    const suggestionWrap = document.createElement('div');
    suggestionWrap.classList.add('search-suggestions-wrap');
    const label = document.createElement('div');
    label.classList.add('label');
    label.textContent = suggestion.label;
    suggestionWrap.append(label);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    const tokensUl = document.createElement('ul');
    suggestion.keywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.textContent = keyword;
      tokensUl.append(li);
    });
    tokensWrap.append(tokensUl);
    suggestionWrap.append(tokensWrap);
    searchWrapInnerTemplate.append(suggestionWrap);
  });

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const liDesktop = document.createElement('li');
          const liMobile = document.createElement('li');
          const aDesktop = document.createElement('a');
          const aMobile = document.createElement('a');

          aDesktop.href = link.href;
          aMobile.href = link.href;

          if (link.textContent.toLowerCase() === 'contact us') {
            liDesktop.classList.add('mail');
            aDesktop.innerHTML = SVG_MAIL;
            aDesktop.setAttribute('aria-label', 'Contact Us');
            liDesktop.append(aDesktop);

            liMobile.classList.add('mail');
            aMobile.textContent = 'Contact Us'; // Mobile uses text label
            aMobile.setAttribute('aria-label', 'Contact Us');
            liMobile.append(aMobile);
          } else if (link.textContent.toLowerCase() === 'search') {
            liDesktop.classList.add('search');
            aDesktop.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE;
            aDesktop.setAttribute('aria-label', 'Search');
            aDesktop.setAttribute('aria-controls', 'search-screen-desktop');
            aDesktop.setAttribute('aria-expanded', 'false');
            liDesktop.append(aDesktop);
            const desktopSearchScreen = searchScreenWrapTemplate.cloneNode(true);
            desktopSearchScreen.id = 'search-screen-desktop';
            liDesktop.append(desktopSearchScreen);
            liDesktop.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const isActive = liDesktop.classList.toggle('active');
              desktopSearchScreen.style.opacity = isActive ? '1' : '0';
              desktopSearchScreen.style.pointerEvents = isActive ? 'all' : 'none';
              desktopSearchScreen.setAttribute('aria-hidden', !isActive);
              aDesktop.setAttribute('aria-expanded', isActive);
              if (isActive) {
                desktopSearchScreen.querySelector('#searchInput').focus();
              }
            });

            liMobile.classList.add('search');
            aMobile.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE;
            const searchSpan = document.createElement('span');
            searchSpan.textContent = ' Search'; // Mobile uses text label
            aMobile.append(searchSpan);
            aMobile.setAttribute('aria-label', 'Search');
            aMobile.setAttribute('aria-controls', 'search-screen-mobile');
            aMobile.setAttribute('aria-expanded', 'false');
            liMobile.append(aMobile);
            const mobileSearchScreen = searchScreenWrapTemplate.cloneNode(true);
            mobileSearchScreen.id = 'search-screen-mobile';
            liMobile.append(mobileSearchScreen);
            liMobile.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const isActive = liMobile.classList.toggle('active');
              mobileSearchScreen.style.opacity = isActive ? '1' : '0';
              mobileSearchScreen.style.pointerEvents = isActive ? 'all' : 'none';
              mobileSearchScreen.setAttribute('aria-hidden', !isActive);
              aMobile.setAttribute('aria-expanded', isActive);
              if (isActive) {
                mobileSearchScreen.querySelector('#searchInput').focus();
              }
            });
          } else {
            // Social links
            aDesktop.title = link.title || link.textContent;
            aDesktop.textContent = link.textContent; // Placeholder for actual social icons
            aDesktop.setAttribute('aria-label', link.title || link.textContent);
            liDesktop.append(aDesktop);
            aMobile.title = link.title || link.textContent;
            aMobile.textContent = link.textContent;
            aMobile.setAttribute('aria-label', link.title || link.textContent);
            liMobile.append(aMobile);
          }
          desktopUl.append(liDesktop);
          mobileUl.append(liMobile);
        }
      });
    }
  });

  wrapDiv.append(desktopIconNav); // Desktop tools outside main nav
  mainNavContainer.append(mobileIconNav); // Mobile tools inside main nav
}

/**
 * Toggles the entire nav for mobile/desktop.
 * @param {Element} mainNav The main navigation element.
 * @param {boolean|null} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(mainNav, forceExpanded = null) {
  if (!mainNav) return;

  const expanded = forceExpanded !== null ? !forceExpanded : mainNav.getAttribute('aria-expanded') === 'true';
  const hamburger = document.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  mainNav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  // Toggle visibility of main-nav
  if (expanded) {
    mainNav.style.transform = 'translate(-100%,0)';
    mainNav.style.opacity = '0';
  } else {
    mainNav.style.transform = 'translate(0,0)';
    mainNav.style.opacity = '1';
  }

  // Close all sub-menus when main menu is toggled
  mainNav.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((el) => {
    el.classList.remove('active', 'active-child');
    if (el.classList.contains('has-sub-child') || el.classList.contains('has-inner-sub-child')) {
      el.style.maxHeight = '0';
      el.style.opacity = '0';
    }
  });

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    mainNav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    mainNav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const header = document.querySelector('.main-header');
    const mainNav = header.querySelector('.main-nav');
    if (mainNav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      toggleMenu(mainNav, false);
    }
    // Close any open search screens
    const openSearch = header.querySelector('.search.active');
    if (openSearch) {
      openSearch.classList.remove('active');
      const screen = openSearch.querySelector('.search-screen-wrap');
      if (screen) {
        screen.style.opacity = '0';
        screen.style.pointerEvents = 'none';
        screen.setAttribute('aria-hidden', 'true');
        openSearch.querySelector('a[aria-controls^="search-screen"]').setAttribute('aria-expanded', 'false');
      }
    }
  }
}

function closeOnFocusLost(e) {
  const mainNav = e.currentTarget;
  if (!mainNav.contains(e.relatedTarget)) {
    if (mainNav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      toggleMenu(mainNav, false);
    }
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

  // Create main header container
  const mainHeader = document.createElement('header');
  mainHeader.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  mainHeader.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Parse the fragment structure
  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('a');
    if (brandLink) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      const img = brandLink.querySelector('picture img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        newImg.title = img.title || '';
        newImg.width = img.width || '200';
        newImg.height = img.height || '30';
        newImg.loading = 'lazy';
        newImg.classList.add('hiddenlogo1');
        a.append(newImg);
      }
      logoDiv.append(a);
    }
    wrapDiv.append(logoDiv);
  }

  // 2. Setup Hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-controls', 'main-nav-content'); // Will point to the main nav
  hamburger.setAttribute('aria-expanded', 'false');
  wrapDiv.append(hamburger);

  // 3. Setup main navigation
  const mainNavContainer = document.createElement('nav');
  mainNavContainer.id = 'main-nav-content'; // ID for aria-controls
  setupMainNav(navRow, mainNavContainer);
  wrapDiv.append(mainNavContainer);

  // 4. Setup utility icons (mail, search)
  setupTools(toolsRow, wrapDiv, mainNavContainer);

  // 5. Add 80th year logo
  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  const yearLogoLink = document.createElement('a');
  yearLogoLink.href = 'https://www.mahindra.com/';
  const yearLogoImg = document.createElement('img');
  yearLogoImg.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  yearLogoImg.alt = '80th Year Logo Gold';
  yearLogoImg.title = '80thYearLogo_Gold';
  yearLogoImg.classList.add('hiddenlogo1', 'years-80');
  yearLogoImg.width = '74';
  yearLogoImg.height = '60';
  yearLogoImg.loading = 'lazy';
  yearLogoLink.append(yearLogoImg);
  yearLogoDiv.append(yearLogoLink);
  wrapDiv.append(yearLogoDiv);

  block.append(mainHeader);

  // Mobile menu toggle logic
  hamburger.addEventListener('click', () => toggleMenu(mainNavContainer));

  // Prevent mobile nav behavior on window resize
  toggleMenu(mainNavContainer, isDesktop.matches); // Initialize state based on desktop
  isDesktop.addEventListener('change', () => toggleMenu(mainNavContainer, isDesktop.matches));
}
