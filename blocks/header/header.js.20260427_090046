import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SEARCH_SUBMIT_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

/**
 * Parses the fragment into logical sections.
 * @param {Element} fragment The loaded fragment DOM.
 * @returns {object} An object containing the brandRow, navRow, toolsRow, and year80Logo elements.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;
  let year80Logo = null;

  // Find brand logo (first section with a picture/img)
  brandRow = sections.find((s) => s.querySelector('p > picture, img'));

  // Find 80th year logo (if present, typically a logo with 'year-80-logo' class)
  year80Logo = sections.find((s) => s.querySelector('.year-80-logo img'));

  // Find tools row (section with social links or contact/search)
  toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], a[href*="search"]'));

  // Find nav row (section with a UL, excluding brand and tools)
  navRow = sections.find((s) => s.querySelector('ul') && s !== brandRow && s !== toolsRow && s !== year80Logo);

  return { brandRow, navRow, toolsRow, year80Logo };
}

/**
 * Recursively decorates nested ULs with appropriate classes and wrappers.
 * @param {HTMLUListElement} ulElement The UL element to decorate.
 * @param {number} level The current nesting level (1 for top-level, 2 for sub-level, etc.).
 */
function decorateNestedUl(ulElement, level) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach((li) => {
    const nestedUl = li.querySelector('ul');
    const link = li.querySelector('a');

    if (link) {
      // Add chevron icon if there's a nested UL
      if (nestedUl) {
        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        li.append(span);
      }

      // Add specific classes based on nesting level
      if (level === 1) {
        li.classList.add('top-level-li');
      } else if (level === 2) {
        li.classList.add('first-level-li');
      }
    }

    if (nestedUl) {
      const wrapperDiv = document.createElement('div');
      if (level === 1) {
        wrapperDiv.classList.add('has-sub-child');
      } else if (level === 2) {
        wrapperDiv.classList.add('has-inner-sub-child');
      }
      wrapperDiv.append(nestedUl);
      li.append(wrapperDiv);
      decorateNestedUl(nestedUl, level + 1); // Recurse for deeper levels
    }
  });
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navSections The nav sections element.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  const ul = document.createElement('ul');
  ul.setAttribute('itemscope', '');
  ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLiHasChild = null;
  let leftDivContentBuffer = [];

  Array.from(navSections.children).forEach((child) => {
    const link = child.querySelector('a') || (child.tagName === 'A' ? child : null);
    const isUl = child.tagName === 'UL';

    if (link && !isUl) { // This is a main navigation link (e.g., "Who We Are")
      // Flush any buffered content to the previous mega-menu's left-div
      if (currentLiHasChild && leftDivContentBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const titleElement = currentLiHasChild.querySelector('a');
        if (titleElement) {
          const title = titleElement.textContent;
          const sanitizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        }

        leftDivContentBuffer.forEach((item) => leftDiv.append(item));
        const centerDiv = currentLiHasChild.querySelector('.mega-menu .wrap .center-div');
        if (centerDiv) {
          centerDiv.prepend(leftDiv);
        }
        leftDivContentBuffer = []; // Clear buffer
      }

      currentLiHasChild = document.createElement('li');
      currentLiHasChild.classList.add('has-child', 'hover-red');
      currentLiHasChild.setAttribute('itemprop', 'name');
      currentLiHasChild.setAttribute('data-once', 'nav-close-search');

      const a = document.createElement('a');
      a.setAttribute('itemprop', 'url');
      a.href = link.href;
      a.textContent = link.textContent;
      currentLiHasChild.append(a);

      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      currentLiHasChild.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);
      wrapDiv.append(centerDiv);
      megaMenu.append(wrapDiv);
      currentLiHasChild.append(megaMenu);
      ul.append(currentLiHasChild);
    } else if (isUl && currentLiHasChild) { // This is a UL associated with the current main link
      const subNavWrap = currentLiHasChild.querySelector('.mega-menu .wrap .center-div .sub-nav-wrap');
      if (subNavWrap) {
        const clonedUl = child.cloneNode(true);
        decorateNestedUl(clonedUl, 1); // Decorate nested ULs
        subNavWrap.append(clonedUl);
      }
    } else if (currentLiHasChild) { // Collect other content for left-div
      // Only collect h4, p, and ul elements for the left-div
      if (['H4', 'P', 'UL'].includes(child.tagName)) {
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    }
  });

  // Flush any remaining buffer for the last menu item
  if (currentLiHasChild && leftDivContentBuffer.length > 0) {
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const titleElement = currentLiHasChild.querySelector('a');
    if (titleElement) {
      const title = titleElement.textContent;
      const sanitizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      leftDiv.classList.add(`${sanitizedTitle}-left-div`);
    }
    leftDivContentBuffer.forEach((item) => leftDiv.append(item));
    const centerDiv = currentLiHasChild.querySelector('.mega-menu .wrap .center-div');
    if (centerDiv) {
      centerDiv.prepend(leftDiv);
    }
  }

  navSections.replaceChildren(ul);
}

/**
 * Sets up the mobile navigation.
 * @param {Element} navElement The main nav element.
 * @param {Element} navRow The nav sections element (containing the main UL).
 * @param {Element} toolsRow The nav tools element.
 */
function setupMobileNav(navElement, navRow, toolsRow) {
  if (!navElement || !navRow) return;

  const mobileNavUl = document.createElement('ul');
  mobileNavUl.setAttribute('itemscope', '');
  mobileNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  // Process main navigation links and their sub-menus
  Array.from(navRow.children).forEach((section) => {
    const mainLink = section.querySelector('a');
    if (mainLink) {
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const a = document.createElement('a');
      a.setAttribute('itemprop', 'url');
      a.href = mainLink.href;
      a.textContent = mainLink.textContent;
      li.append(a);

      const span = document.createElement('span');
      span.innerHTML = CHEVRON_SVG;
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);
      wrapDiv.append(centerDiv);
      megaMenu.append(wrapDiv);
      li.append(megaMenu);

      const ulContent = section.querySelector('ul');
      if (ulContent) {
        const clonedUl = ulContent.cloneNode(true);
        decorateNestedUl(clonedUl, 1);
        subNavWrap.append(clonedUl);
      }

      mobileNavUl.append(li);
    }
  });

  // Add mobile tools (Contact Us and Search)
  if (toolsRow) {
    const iconNavMobile = document.createElement('div');
    iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
    const toolsUl = document.createElement('ul');

    const contactUsLi = document.createElement('li');
    contactUsLi.classList.add('mail');
    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const a = document.createElement('a');
      a.href = contactUsLink.href;
      a.innerHTML = MAIL_SVG + contactUsLink.textContent; // Include text for mobile
      contactUsLi.append(a);
    }
    toolsUl.append(contactUsLi);

    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const searchLink = toolsRow.querySelector('a[href*="search"]');
    if (searchLink) {
      const a = document.createElement('a');
      a.href = '#'; // Original HTML uses # for search toggle
      a.setAttribute('data-once', 'search-stop-propagation');
      a.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG + `<span data-once="search-stop-propagation"> ${searchLink.textContent}</span>`;
      searchLi.append(a);
    }

    const searchScreenWrap = createSearchScreen(toolsRow); // Pass toolsRow to get search keywords
    searchLi.append(searchScreenWrap);
    toolsUl.append(searchLi);
    iconNavMobile.append(toolsUl);
    mobileNavUl.append(iconNavMobile);
  }

  // Replace the content of the nav-sections div with the mobile UL
  const navSectionsDiv = navElement.querySelector('.nav-sections');
  if (navSectionsDiv) {
    navSectionsDiv.replaceChildren(mobileNavUl);
  }

  // Add event listeners for mobile menu toggles
  Array.from(mobileNavUl.querySelectorAll('li.has-child > span')).forEach((span) => {
    span.addEventListener('click', (e) => {
      const li = e.currentTarget.closest('li.has-child');
      if (li) {
        li.classList.toggle('active');
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.display = li.classList.contains('active') ? 'block' : 'none';
        }
        // Rotate chevron based on active state
        const svg = e.currentTarget.querySelector('svg');
        if (svg) {
          svg.style.transform = li.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      }
    });
  });

  Array.from(mobileNavUl.querySelectorAll('.has-sub-child > ul > li > span, .has-inner-sub-child > ul > li > span')).forEach((span) => {
    span.addEventListener('click', (e) => {
      const li = e.currentTarget.closest('li');
      const subMenuWrapper = li.querySelector('.has-sub-child, .has-inner-sub-child');
      if (subMenuWrapper) {
        const isActive = subMenuWrapper.classList.toggle('active');
        if (subMenuWrapper.classList.contains('has-inner-sub-child')) {
          subMenuWrapper.classList.toggle('active-child', isActive);
        }
        // Rotate chevron based on active state
        const svg = e.currentTarget.querySelector('svg');
        if (svg) {
          svg.style.transform = isActive ? 'rotate(-180deg)' : 'rotate(90deg)';
        }
      }
    });
  });
}

/**
 * Creates the search screen DOM structure.
 * @param {Element} toolsRow The tools row from the fragment to extract search keywords.
 * @returns {HTMLDivElement} The search screen wrapper.
 */
function createSearchScreen(toolsRow) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');

  const form = document.createElement('form');
  form.action = 'https://www.mahindra.com/search'; // Hardcoded as per original HTML
  form.method = 'get';
  form.id = 'search-block-form';
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.setAttribute('data-once', 'search-stop-propagation');
  searchIcon.innerHTML = SEARCH_LENS_SVG;
  searchWrap.append(searchIcon);

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.classList.add('input-text', 'searchtext');
  inputText.required = true;
  inputText.name = 'key';
  inputText.id = 'searchInput';
  inputText.autocomplete = 'off';
  inputText.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(inputText);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  // Dynamically get "Submit" text from fragment if available, otherwise fallback
  const submitTextElement = toolsRow?.querySelector('li.search .submit-button .label');
  const submitText = submitTextElement ? submitTextElement.textContent : 'Submit';
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> ${submitText} </div>${SEARCH_SUBMIT_SVG}`;
  searchWrap.append(submitButton);
  form.append(searchWrap);

  // Add searchResultBox and search-suggestions-wrap elements
  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper" data-once="search-stop-propagation">
      <div class="swiper-wrapper" data-once="search-stop-propagation">
        <div class="swiper-slide" data-once="search-stop-propagation"></div>
      </div>
    </div>
    <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
  `;
  form.append(searchResultBox);

  wrapDiv.append(form);

  // Dynamically extract popular and recommended keywords from the toolsRow fragment
  const popularKeywordsSection = toolsRow?.querySelector('.search-suggestions-wrap:first-of-type');
  const recommendedKeywordsSection = toolsRow?.querySelector('.search-suggestions-wrap:last-of-type');

  const createSuggestionsDiv = (sectionElement) => {
    if (!sectionElement) return null;

    const suggestionsWrap = document.createElement('div');
    suggestionsWrap.classList.add('search-suggestions-wrap');
    suggestionsWrap.setAttribute('data-once', 'search-stop-propagation');

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.setAttribute('data-once', 'search-stop-propagation');
    const labelText = sectionElement.querySelector('.label')?.textContent;
    if (labelText) {
      labelDiv.textContent = labelText;
    }
    suggestionsWrap.append(labelDiv);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    tokensWrap.setAttribute('data-once', 'search-stop-propagation');

    const ul = document.createElement('ul');
    ul.setAttribute('data-once', 'search-stop-propagation');
    Array.from(sectionElement.querySelectorAll('.tokens-wrap ul li')).forEach(liElement => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = liElement.textContent;
      ul.append(li);
    });
    tokensWrap.append(ul);
    suggestionsWrap.append(tokensWrap);
    return suggestionsWrap;
  };

  const popularSuggestions = createSuggestionsDiv(popularKeywordsSection);
  if (popularSuggestions) {
    wrapDiv.append(popularSuggestions);
  }

  const recommendedSuggestions = createSuggestionsDiv(recommendedKeywordsSection);
  if (recommendedSuggestions) {
    wrapDiv.append(recommendedSuggestions);
  }

  searchScreenWrap.append(wrapDiv);
  return searchScreenWrap;
}

/**
 * Toggles the mobile menu visibility.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections element.
 * @param {boolean} [forceExpanded=null] Optional param to force nav expand behavior.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (expanded) {
    nav.classList.remove('active');
    hamburger.classList.remove('active');
  } else {
    nav.classList.add('active');
    hamburger.classList.add('active');
  }

  // Handle search screen toggle
  const searchIcon = nav.querySelector('.icon-nav .search');
  const searchScreen = nav.querySelector('.search-screen-wrap');
  if (searchIcon && searchScreen) {
    if (!expanded && searchIcon.classList.contains('active')) {
      searchIcon.classList.remove('active');
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
    }
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
      const hamburger = nav.querySelector('.hamburger');
      if (hamburger) hamburger.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  // Create the main header structure
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for accessibility

  const { brandRow, navRow, toolsRow, year80Logo } = parseStructure(fragment);

  // --- Nav Brand ---
  const navBrandDiv = document.createElement('div');
  navBrandDiv.classList.add('logo');
  if (brandRow) {
    const brandLink = brandRow.querySelector('p > picture, img')?.closest('p')?.querySelector('a');
    if (brandLink) {
      const clonedLink = brandLink.cloneNode(true);
      navBrandDiv.append(clonedLink);
    } else {
      // Fallback if link is missing but image exists
      const brandImage = brandRow.querySelector('picture, img');
      if (brandImage) {
        const defaultLink = document.createElement('a');
        defaultLink.href = '/';
        defaultLink.append(brandImage.cloneNode(true));
        navBrandDiv.append(defaultLink);
      } else {
        const defaultLink = document.createElement('a');
        defaultLink.href = '/';
        defaultLink.textContent = 'Home';
        navBrandDiv.append(defaultLink);
      }
    }
  } else {
    // Fallback if brandRow is missing
    const defaultLink = document.createElement('a');
    defaultLink.href = '/';
    defaultLink.textContent = 'Home';
    navBrandDiv.append(defaultLink);
  }
  wrapDiv.append(navBrandDiv);

  // --- Hamburger for Mobile ---
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburgerDiv.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburgerDiv);

  // --- Nav Sections ---
  const navSectionsDiv = document.createElement('div');
  navSectionsDiv.classList.add('nav-sections');
  if (navRow) {
    // Desktop navigation setup
    const desktopNavFragment = navRow.cloneNode(true);
    setupDesktopNav(desktopNavFragment);
    navSectionsDiv.append(desktopNavFragment.querySelector('ul'));
  }
  nav.append(navSectionsDiv);

  // --- Nav Tools (Desktop) ---
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopToolsUl = document.createElement('ul');

  const mailLi = document.createElement('li');
  mailLi.classList.add('mail');
  const contactUsLink = toolsRow ? toolsRow.querySelector('a[href*="contact-us"]') : null;
  if (contactUsLink) {
    const a = document.createElement('a');
    a.href = contactUsLink.href;
    a.innerHTML = MAIL_SVG;
    mailLi.append(a);
  }
  desktopToolsUl.append(mailLi);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkDesktop = toolsRow ? toolsRow.querySelector('a[href*="search"]') : null;
  if (searchLinkDesktop) {
    const a = document.createElement('a');
    a.href = '#'; // Original HTML uses # for search toggle
    a.setAttribute('data-once', 'search-stop-propagation');
    a.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
    searchLiDesktop.append(a);
  }
  const searchScreenDesktop = createSearchScreen(toolsRow);
  searchLiDesktop.append(searchScreenDesktop);
  desktopToolsUl.append(searchLiDesktop);
  iconNavDesktop.append(desktopToolsUl);
  nav.append(iconNavDesktop);

  wrapDiv.append(nav);

  // --- 80th Year Logo (if present) ---
  if (year80Logo) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const year80Link = year80Logo.closest('a') || document.createElement('a');
    if (!year80Link.href) year80Link.href = '/';
    year80Link.innerHTML = '';
    year80Link.append(year80Logo.cloneNode(true));
    year80LogoDiv.append(year80Link);
    wrapDiv.append(year80LogoDiv);
  }

  containerDiv.append(wrapDiv);
  header.append(containerDiv);
  block.append(header);

  // --- Mobile Navigation Setup (after desktop nav is built) ---
  const mobileNavFragment = fragment.cloneNode(true); // Clone for mobile processing
  const { navRow: mobileNavRow, toolsRow: mobileToolsRow } = parseStructure(mobileNavFragment);
  // The navSectionsDiv already exists and will be replaced with mobile content
  if (navSectionsDiv && mobileNavRow) {
    setupMobileNav(nav, mobileNavRow, mobileToolsRow);
  }

  // --- Event Listeners ---
  // Hamburger click
  hamburgerDiv.addEventListener('click', () => toggleMenu(nav, navSectionsDiv));

  // Search toggle
  const searchToggle = header.querySelector('.search[data-once="search-toggle search-stop-propagation"] > a');
  if (searchToggle) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchParentLi = e.currentTarget.closest('li.search');
      const searchScreen = searchParentLi.querySelector('.search-screen-wrap');
      if (searchParentLi && searchScreen) {
        const isActive = searchParentLi.classList.toggle('active');
        searchScreen.style.opacity = isActive ? '1' : '0';
        searchScreen.style.pointerEvents = isActive ? 'all' : 'none';
      }
    });

    // Stop propagation for search screen clicks
    const searchScreenWrap = header.querySelector('.search-screen-wrap');
    if (searchScreenWrap) {
      searchScreenWrap.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  // Close search on clicks outside
  document.addEventListener('click', (e) => {
    const searchLi = header.querySelector('li.search');
    const searchScreen = header.querySelector('.search-screen-wrap');
    if (searchLi && searchScreen && !searchLi.contains(e.target) && searchLi.classList.contains('active')) {
      searchLi.classList.remove('active');
      searchScreen.style.opacity = '0';
      searchScreen.style.pointerEvents = 'none';
    }
  });

  // Initial mobile setup
  toggleMenu(nav, navSectionsDiv, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSectionsDiv, isDesktop.matches));
}
