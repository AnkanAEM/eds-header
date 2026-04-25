import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS media queries

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_ICON_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const CLOSE_ICON_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_ICON_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element, year80Logo: Element}}
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandRow = sections.find((s) => s.querySelector('p > picture, img'));
  const navRow = sections.find((s) => s.querySelector('p > a') && s.querySelector('ul'));
  // Find toolsRow by looking for social links or contact-us link
  const toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], a[href="#"]'));
  const year80Logo = sections.find((s) => s.classList.contains('year-80-logo'));
  return { brandRow, navRow, toolsRow, year80Logo };
}

/**
 * Sanitizes a string to be used as a CSS class.
 * @param {string} text The input string.
 * @returns {string} The sanitized string.
 */
function sanitizeClassName(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Creates the hamburger menu element.
 * @returns {Element} The hamburger div.
 */
function createHamburger() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  return hamburger;
}

/**
 * Toggles the mobile menu visibility and accessibility attributes.
 * @param {Element} nav The main nav element.
 * @param {Element} hamburger The hamburger button element.
 * @param {boolean} forceExpanded Optional: force a specific expanded state.
 */
function toggleMobileMenu(nav, hamburger, forceExpanded = null) {
  if (!nav || !hamburger) return;

  const isExpanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  document.body.classList.toggle('nav-open', !isExpanded); // Use a class on body for overflow

  // Close search if mobile menu is opened
  const searchScreenWrap = document.querySelector('.search-screen-wrap');
  if (!isExpanded && searchScreenWrap?.classList.contains('active')) {
    toggleSearch(document.querySelector('header'), nav, true);
  }
}

/**
 * Sets up the desktop navigation interactions.
 * @param {Element} navSections The nav-sections element.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.has-child').forEach((li) => {
    const mainLink = li.querySelector('a');
    const megaMenu = li.querySelector('.mega-menu');

    if (mainLink && megaMenu) {
      li.addEventListener('mouseenter', () => {
        megaMenu.style.display = 'block';
        li.classList.add('active'); // Add active class for styling
        mainLink.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        megaMenu.style.display = 'none';
        li.classList.remove('active'); // Remove active class
        mainLink.setAttribute('aria-expanded', 'false');
      });
      mainLink.setAttribute('aria-haspopup', 'true');
      mainLink.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Sets up the mobile navigation interactions.
 * @param {Element} navSections The nav-sections element.
 * @param {Element} toolsRow The original toolsRow fragment content.
 */
function setupMobileNav(navSections, toolsRow) {
  if (!navSections) return;

  navSections.querySelectorAll('.has-child').forEach((li) => {
    const chevron = li.querySelector('span');
    const mainLink = li.querySelector('a');
    const megaMenu = li.querySelector('.mega-menu');

    if (chevron && megaMenu && mainLink) {
      chevron.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = megaMenu.style.display === 'block';
        megaMenu.style.display = isExpanded ? 'none' : 'block';
        li.classList.toggle('active', !isExpanded); // Toggle active class
        chevron.classList.toggle('active', !isExpanded); // Toggle active class on chevron
        mainLink.setAttribute('aria-expanded', !isExpanded);
      });
      mainLink.setAttribute('aria-haspopup', 'true');
      mainLink.setAttribute('aria-expanded', 'false');
    }

    // Handle nested sub-menus
    li.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const subChevron = subChild.querySelector('span');
      const subMenuLink = subChild.querySelector('a');
      if (subChevron && subMenuLink) {
        subChevron.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent parent menu from toggling
          const innerMenu = subChild.querySelector('ul');
          if (innerMenu) {
            const isExpanded = subChild.classList.contains('active');
            subChild.classList.toggle('active', !isExpanded);
            subChevron.classList.toggle('active', !isExpanded);
            subMenuLink.setAttribute('aria-expanded', !isExpanded);
          }
        });
        subMenuLink.setAttribute('aria-haspopup', 'true');
        subMenuLink.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Append tools to navSections for mobile
  if (toolsRow) {
    const mobileToolsWrapper = document.createElement('div');
    mobileToolsWrapper.classList.add('icon-nav', 'mobile-menus-icon');

    const ul = document.createElement('ul');

    const mailLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (mailLink) {
      const mailLi = document.createElement('li');
      mailLi.classList.add('mail');
      const a = document.createElement('a');
      a.href = mailLink.href;
      a.textContent = mailLink.textContent; // Use text content from fragment
      ul.append(mailLi);
      mailLi.append(a);
    }

    const searchLink = toolsRow.querySelector('a[href="#"]');
    if (searchLink) {
      const searchLi = document.createElement('li');
      searchLi.classList.add('search');
      searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const a = document.createElement('a');
      a.href = '#';
      a.innerHTML = SEARCH_ICON_SVG; // Only lens icon initially for mobile
      const searchSpan = document.createElement('span');
      searchSpan.textContent = searchLink.textContent || 'Search'; // Use text content from fragment or default
      a.append(searchSpan);
      searchLi.append(a);
      ul.append(searchLi);
    }
    mobileToolsWrapper.append(ul);
    navSections.append(mobileToolsWrapper);
  }
}

/**
 * Toggles the search functionality visibility and accessibility attributes.
 * @param {Element} block The main header block.
 * @param {Element} nav The main nav element.
 * @param {boolean} forceClose Optional: force a specific expanded state.
 */
function toggleSearch(block, nav, forceClose = false) {
  const searchToggleButtons = block.querySelectorAll('.search > a');
  const searchScreenWrap = block.querySelector('.search-screen-wrap');
  const searchInput = searchScreenWrap?.querySelector('.searchtext');

  if (!searchToggleButtons.length || !searchScreenWrap || !searchInput) return;

  const isSearchOpen = searchScreenWrap.classList.contains('active');
  const shouldOpen = !isSearchOpen && !forceClose;

  searchScreenWrap.classList.toggle('active', shouldOpen);
  nav.classList.toggle('search-open', shouldOpen);
  document.body.classList.toggle('search-open', shouldOpen);

  searchToggleButtons.forEach((btn) => {
    const lensIcon = btn.querySelector('.lens');
    const closeIcon = btn.querySelector('.close');
    if (lensIcon && closeIcon) {
      lensIcon.style.display = shouldOpen ? 'none' : 'block';
      closeIcon.style.display = shouldOpen ? 'block' : 'none';
      btn.setAttribute('aria-expanded', shouldOpen);
    }
  });

  if (shouldOpen) {
    searchInput.focus();
    // Close mobile menu if search is opened
    const hamburger = block.querySelector('.hamburger');
    if (hamburger?.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu(nav, hamburger, false);
    }
  } else {
    searchInput.value = ''; // Clear search input on close
  }
}

/**
 * Decorates the header block with content from the fragment.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // Load nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Parse fragment structure
  const { brandRow, navRow, toolsRow, year80Logo } = parseStructure(fragment);

  // --- nav-brand ---
  if (brandRow) {
    const navBrand = document.createElement('div');
    navBrand.classList.add('logo');
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture, img');

    if (brandLink && brandImg) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      a.append(brandImg);
      navBrand.append(a);
    } else if (brandImg) {
      navBrand.append(brandImg);
    }
    wrapDiv.append(navBrand);
  }

  // --- hamburger for mobile ---
  const hamburger = createHamburger();
  wrapDiv.append(hamburger);

  // --- main-nav ---
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.id = 'nav'; // For accessibility
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile

  if (navRow) {
    const ul = document.createElement('ul');
    ul.setAttribute('itemscope', '');
    ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

    let currentLeftDivContent = [];
    const navRowChildren = Array.from(navRow.children);

    for (let i = 0; i < navRowChildren.length; i += 1) {
      const child = navRowChildren[i];

      // Check if it's a navigation button (p > a)
      const navButton = child.querySelector('p > a');
      if (navButton) {
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red');
        li.setAttribute('itemprop', 'name');
        li.setAttribute('data-once', 'nav-close-search');

        const a = document.createElement('a');
        a.href = navButton.href;
        a.textContent = navButton.textContent;
        a.setAttribute('itemprop', 'url');
        li.append(a);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        li.append(span);

        // Check for immediately following UL as the mega-menu content
        const nextSibling = navRowChildren[i + 1];
        if (nextSibling && nextSibling.tagName === 'UL') {
          const megaMenuDiv = document.createElement('div');
          megaMenuDiv.classList.add('mega-menu');

          const megaMenuWrap = document.createElement('div');
          megaMenuWrap.classList.add('wrap', 'container');
          megaMenuDiv.append(megaMenuWrap);

          const centerDiv = document.createElement('div');
          centerDiv.classList.add('center-div');
          megaMenuWrap.append(centerDiv);

          // Inject collected left-div content if any
          if (currentLeftDivContent.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            leftDiv.classList.add(`${sanitizeClassName(navButton.textContent)}-left-div`);
            currentLeftDivContent.forEach((contentNode) => leftDiv.append(contentNode));
            centerDiv.append(leftDiv);
            currentLeftDivContent = []; // Reset buffer
          }

          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          // Add specific class if present in original HTML
          if (navButton.textContent.toLowerCase() === 'who we are') {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (navButton.textContent.toLowerCase() === 'what we do') {
            subNavWrap.classList.add('what-we-do');
          } else if (navButton.textContent.toLowerCase() === 'investor relations') {
            subNavWrap.classList.add('element-block');
          } else if (navButton.textContent.toLowerCase() === 'careers') {
            subNavWrap.classList.add('careers-div');
          }
          centerDiv.append(subNavWrap);

          // Recursively process nested ULs
          const processNestedUl = (currentUl, parentContainer, level = 0) => {
            const newUl = document.createElement('ul');
            Array.from(currentUl.children).forEach((childLi) => {
              const newLi = document.createElement('li');
              // Copy all content of the li, including potential nested ULs
              Array.from(childLi.childNodes).forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') {
                  // If it's a nested UL, handle it recursively
                  const nestedContainer = document.createElement('div');
                  nestedContainer.classList.add(level === 0 ? 'has-sub-child' : 'has-inner-sub-child');
                  newLi.append(nestedContainer);
                  processNestedUl(node, nestedContainer, level + 1);

                  // Add chevron and specific classes to the parent LI
                  const nestedSpan = document.createElement('span');
                  nestedSpan.innerHTML = CHEVRON_SVG;
                  newLi.append(nestedSpan);
                  if (level === 0) {
                    newLi.classList.add('top-level-li');
                  } else if (level === 1) {
                    newLi.classList.add('first-level-li');
                  }
                } else {
                  // Otherwise, append the node directly
                  newLi.append(node.cloneNode(true));
                }
              });
              newUl.append(newLi);
            });
            parentContainer.append(newUl);
          };

          processNestedUl(nextSibling, subNavWrap);
          i += 1; // Consume the UL sibling
          li.append(megaMenuDiv);
        }
        ul.append(li);
      } else {
        // Collect non-navigation siblings (headings, paragraphs, etc.) for left-div
        currentLeftDivContent.push(child.cloneNode(true));
      }
    }
    nav.append(ul);
  }

  wrapDiv.append(nav);

  // --- nav-tools ---
  if (toolsRow) {
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
    wrapDiv.append(desktopIconNav);

    const desktopUl = document.createElement('ul');
    desktopIconNav.append(desktopUl);

    // Filter tools for desktop: mail and search
    const mailLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (mailLink) {
      const mailLi = document.createElement('li');
      mailLi.classList.add('mail');
      const a = document.createElement('a');
      a.href = mailLink.href;
      a.innerHTML = MAIL_ICON_SVG;
      mailLi.append(a);
      desktopUl.append(mailLi);
    }

    const searchLink = toolsRow.querySelector('a[href="#"]'); // Assuming search link is '#'
    if (searchLink) {
      const searchLi = document.createElement('li');
      searchLi.classList.add('search');
      searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const a = document.createElement('a');
      a.href = '#';
      a.innerHTML = SEARCH_ICON_SVG + CLOSE_ICON_SVG; // Both icons for toggle
      a.setAttribute('aria-label', 'Toggle Search');
      a.setAttribute('aria-expanded', 'false');
      searchLi.append(a);
      desktopUl.append(searchLi);

      // Create search screen wrap
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

      const searchWrapInner = document.createElement('div');
      searchWrapInner.classList.add('wrap');
      searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
      searchScreenWrap.append(searchWrapInner);

      const searchForm = document.createElement('form');
      searchForm.action = searchLink.href; // Use dynamic URL
      searchForm.method = 'get';
      searchForm.id = 'search-block-form';
      searchForm.setAttribute('accept-charset', 'UTF-8');
      searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
      searchForm.setAttribute('data-once', 'search-stop-propagation');
      searchWrapInner.append(searchForm);

      const searchInputWrap = document.createElement('div');
      searchInputWrap.classList.add('search-wrap');
      searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
      searchForm.append(searchInputWrap);

      const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.innerHTML = SEARCH_ICON_SVG;
  searchInputWrap.append(searchIconDiv);

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.classList.add('input-text', 'searchtext');
      searchInput.required = true;
      searchInput.name = 'key';
      searchInput.id = 'searchInput';
      searchInput.autocomplete = 'off';
      searchInput.setAttribute('data-once', 'search-stop-propagation');
      searchInput.setAttribute('aria-label', 'Search input');
      searchInputWrap.append(searchInput);

      const submitButton = document.createElement('button');
      submitButton.classList.add('submit-button');
      submitButton.setAttribute('data-once', 'search-stop-propagation');
      const submitLabel = document.createElement('div');
      submitLabel.classList.add('label');
      submitLabel.setAttribute('data-once', 'search-stop-propagation');
      // Attempt to get "Submit" text dynamically from fragment if available, otherwise default
      const submitTextElement = toolsRow.querySelector('.search-wrap .submit-button .label');
      submitLabel.textContent = submitTextElement ? submitTextElement.textContent.trim() : 'Submit';
      submitButton.append(submitLabel);
      submitButton.innerHTML += SUBMIT_ARROW_SVG;
      searchInputWrap.append(submitButton);

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
      searchForm.append(searchResultBox);

      // Dynamically create search suggestions
      const searchSuggestionsWraps = toolsRow.querySelectorAll('.search-suggestions-wrap');
      searchSuggestionsWraps.forEach((originalSuggestionWrap) => {
        const newSuggestionWrap = document.createElement('div');
        newSuggestionWrap.classList.add('search-suggestions-wrap');
        newSuggestionWrap.setAttribute('data-once', 'search-stop-propagation');

        const labelDiv = document.createElement('div');
        labelDiv.classList.add('label');
        labelDiv.setAttribute('data-once', 'search-stop-propagation');
        labelDiv.textContent = originalSuggestionWrap.querySelector('.label')?.textContent || '';
        newSuggestionWrap.append(labelDiv);

        const tokensWrap = document.createElement('div');
        tokensWrap.classList.add('tokens-wrap');
        tokensWrap.setAttribute('data-once', 'search-stop-propagation');
        newSuggestionWrap.append(tokensWrap);

        const tokensUl = document.createElement('ul');
        tokensUl.setAttribute('data-once', 'search-stop-propagation');
        originalSuggestionWrap.querySelectorAll('.tokens-wrap li').forEach((originalLi) => {
          const newLi = document.createElement('li');
          newLi.setAttribute('data-once', 'search-stop-propagation');
          newLi.textContent = originalLi.textContent;
          tokensUl.append(newLi);
        });
        tokensWrap.append(tokensUl);
        searchWrapInner.append(newSuggestionWrap);
      });

      desktopIconNav.append(searchScreenWrap);
    }
  }

  // Append 80th year logo if present in fragment
  if (year80Logo) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const img = year80Logo.querySelector('img');
    if (img) {
      const a = document.createElement('a');
      a.href = year80Logo.querySelector('a')?.href || '#';
      a.append(img);
      year80LogoDiv.append(a);
    }
    wrapDiv.append(year80LogoDiv);
  }

  block.textContent = ''; // Clear original block content
  block.append(header);

  // --- Event Listeners and Initializations ---
  const navSections = nav.querySelector('ul'); // The main UL inside nav
  if (navSections) {
    // Desktop navigation setup
    setupDesktopNav(navSections);

    // Mobile navigation setup
    setupMobileNav(navSections, toolsRow); // Pass the original toolsRow for mobile integration

    // Hamburger click event
    hamburger.addEventListener('click', () => toggleMobileMenu(nav, hamburger));

    // Initial state for mobile menu
    toggleMobileMenu(nav, hamburger, !isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMobileMenu(nav, hamburger, !isDesktop.matches));
  }

  // Search functionality setup
  setupSearch(block, nav);

  // Close mobile menu or search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isNavOpen = nav.getAttribute('aria-expanded') === 'true';
      const searchScreenWrap = block.querySelector('.search-screen-wrap');
      const isSearchOpen = searchScreenWrap?.classList.contains('active');

      if (isNavOpen) {
        toggleMobileMenu(nav, hamburger, false);
      }
      if (isSearchOpen) {
        toggleSearch(block, nav, true);
      }
    }
  });
}
