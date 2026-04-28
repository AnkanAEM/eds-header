import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
const SVG_ARROW_RIGHT = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

/**
 * Moves instrumentation attributes from an old element to a new element.
 * @param {Element} oldElement The element to move attributes from.
 * @param {Element} newElement The element to move attributes to.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  [...oldElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Parses the fragment into its structural components.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === Node.ELEMENT_NODE);
  const getChildContent = (el) => (el.classList.contains('default-content-wrapper') ? el.firstElementChild : el);

  const brandRow = children[0] ? getChildContent(children[0]) : null;
  const navRow = children[1] ? getChildContent(children[1]) : null;
  const toolsRow = children[2] ? getChildContent(children[2]) : null;

  return { brandRow, navRow, toolsRow };
}

/**
 * Creates the hamburger menu icon.
 * @returns {Element} The hamburger div.
 */
function createHamburger() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  return hamburger;
}

/**
 * Handles toggling of the mobile navigation menu.
 * @param {Element} nav The main navigation element.
 * @param {Element} hamburger The hamburger icon element.
 */
function toggleMobileMenu(nav, hamburger) {
  if (!nav || !hamburger) return;

  const isExpanded = nav.classList.contains('expanded');
  if (isExpanded) {
    nav.classList.remove('expanded');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  } else {
    nav.classList.add('expanded');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
  }
}

/**
 * Recursively processes nested ULs within a menu.
 * @param {Element} ulElement The UL element to process.
 * @param {boolean} isInnerSubChild Indicates if it's an inner sub-child for class naming.
 */
function processNestedUl(ulElement, isInnerSubChild = false) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        // Find the direct link or text content within the LI
        let linkOrTextElement = li.querySelector(':scope > a');
        if (!linkOrTextElement) {
          const directText = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
          if (directText) {
            const textSpan = document.createElement('span');
            textSpan.textContent = directText.textContent.trim();
            directText.remove();
            linkOrTextElement = document.createElement('a'); // Create a dummy link for consistency
            linkOrTextElement.href = '#';
            linkOrTextElement.append(textSpan);
            li.prepend(linkOrTextElement);
          }
        }

        const arrowSpan = document.createElement('span');
        arrowSpan.innerHTML = SVG_CHEVRON;
        arrowSpan.setAttribute('role', 'button');
        arrowSpan.setAttribute('aria-label', 'Toggle submenu');
        arrowSpan.setAttribute('aria-expanded', 'false');
        li.append(arrowSpan);

        const subChildWrapper = document.createElement('div');
        subChildWrapper.classList.add('has-sub-child');
        if (isInnerSubChild) {
          subChildWrapper.classList.add('has-inner-sub-child');
        }
        moveInstrumentation(nestedUl, subChildWrapper); // Move instrumentation from original UL
        subChildWrapper.append(nestedUl);
        li.append(subChildWrapper);

        // Add click listener for mobile expansion
        arrowSpan.addEventListener('click', (e) => {
          e.stopPropagation();
          const isActive = subChildWrapper.classList.toggle('active');
          li.classList.toggle('active'); // Add active class to parent LI
          arrowSpan.setAttribute('aria-expanded', isActive);
          if (isInnerSubChild) {
            subChildWrapper.classList.toggle('active-child');
          }
        });

        // Recursively process the nested UL
        processNestedUl(nestedUl, true);
      } else {
        // If it's a leaf LI, ensure it has an 'a' tag. If not, wrap its content.
        if (!li.querySelector(':scope > a')) {
          const content = li.innerHTML;
          li.innerHTML = '';
          const a = document.createElement('a');
          a.innerHTML = content;
          a.href = '#'; // Default href if none present
          li.append(a);
        }
      }
    }
  });
}

/**
 * Sets up the desktop navigation structure and behavior.
 * @param {Element} navRow The navigation row from the fragment.
 * @param {Element} mainNav The main nav element to append to.
 */
function setupDesktopNav(navRow, mainNav) {
  if (!navRow || !mainNav) return;

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  moveInstrumentation(navRow, mainNav); // Move instrumentation from original navRow to mainNav

  let contentBuffer = [];
  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'P' && child.querySelector('a')) {
        // This is a navigation trigger
        const navItem = document.createElement('li');
        navItem.classList.add('has-child', 'hover-red');
        navItem.setAttribute('itemprop', 'name');
        navItem.setAttribute('data-once', 'nav-close-search');

        const link = child.querySelector('a');
        if (link) {
          moveInstrumentation(child, navItem); // Move instrumentation from original P to navItem
          const clonedLink = link.cloneNode(true);
          clonedLink.setAttribute('itemprop', 'url');
          navItem.append(clonedLink);
        }

        const arrowSpan = document.createElement('span');
        arrowSpan.innerHTML = SVG_CHEVRON;
        navItem.append(arrowSpan);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenu.append(wrapContainer);
        wrapContainer.append(centerDiv);

        // Flush buffer into left-div
        if (contentBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const titleText = link ? link.textContent.trim() : 'untitled';
          const semanticClass = titleText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '-left-div';
          leftDiv.classList.add(semanticClass);

          contentBuffer.forEach(bufferedNode => {
            if (bufferedNode.tagName === 'H4' && bufferedNode.querySelector('a')) {
              const headingLink = bufferedNode.querySelector('a');
              const h4 = document.createElement('h4');
              h4.classList.add('left-div-heading');
              const a = document.createElement('a');
              a.href = headingLink.href;
              a.textContent = headingLink.textContent;
              h4.append(a);
              leftDiv.append(h4);
            } else if (bufferedNode.tagName === 'P') {
              const p = document.createElement('p');
              if (bufferedNode.textContent.includes('#')) {
                p.classList.add('left-div-subdesc');
              } else {
                p.classList.add('left-div-desc');
              }
              p.textContent = bufferedNode.textContent;
              leftDiv.append(p);
            } else if (bufferedNode.tagName === 'UL') {
              const ul = bufferedNode.cloneNode(true);
              Array.from(ul.children).forEach(li => {
                // Check if the LI contains a span, which is the heuristic for 'list-text-red'
                if (li.querySelector('span')) {
                  li.classList.add('list-text-red');
                }
              });
              leftDiv.append(ul);
            } else {
              leftDiv.append(bufferedNode.cloneNode(true));
            }
          });
          centerDiv.append(leftDiv);
          contentBuffer = []; // Clear buffer
        }

        const nextSibling = child.nextElementSibling;
        if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          moveInstrumentation(nextSibling, subNavWrap); // Move instrumentation from original UL/DIV to subNavWrap

          const linkText = link ? link.textContent.toLowerCase() : '';

          if (linkText.includes('who we are')) {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (linkText.includes('what we do')) {
            subNavWrap.classList.add('what-we-do');
          } else if (linkText.includes('investor relations')) {
            subNavWrap.classList.add('element-block');
            const oneLinkUl = document.createElement('ul');
            oneLinkUl.classList.add('sub-nav-wrap-one-link');
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            subNavWrap.append(oneLinkUl);
            subNavWrap.append(innerSubNavWrapList);

            // Distribute LIs into two ULs within innerSubNavWrapList
            const uls = Array.from(nextSibling.children).filter(el => el.tagName === 'UL');
            if (uls.length > 0) {
              const originalLis = Array.from(uls[0].children);
              const firstUl = document.createElement('ul');
              const secondUl = document.createElement('ul');
              originalLis.forEach((li, idx) => {
                if (idx === 0 && li.querySelector('a')) { // First LI goes to sub-nav-wrap-one-link
                  oneLinkUl.append(li.cloneNode(true));
                } else if (idx < 3) { // First few to first ul
                  firstUl.append(li.cloneNode(true));
                } else { // Rest to second ul
                  secondUl.append(li.cloneNode(true));
                }
              });
              innerSubNavWrapList.append(firstUl);
              innerSubNavWrapList.append(secondUl);
              processNestedUl(firstUl);
              processNestedUl(secondUl);
            }
          } else if (linkText.includes('careers')) {
            subNavWrap.classList.add('careers-div');
            const clonedUl = nextSibling.cloneNode(true);
            processNestedUl(clonedUl);
            subNavWrap.append(clonedUl);
          } else {
            const clonedUl = nextSibling.cloneNode(true);
            processNestedUl(clonedUl);
            subNavWrap.append(clonedUl);
          }
          centerDiv.append(subNavWrap);
          navItem.append(megaMenu);
        }
        navUl.append(navItem);
      } else {
        // Collect non-navigation P/UL/etc. into the buffer
        contentBuffer.push(child.cloneNode(true));
      }
    }
  });

  // Handle any remaining buffer content if no more nav items
  if (contentBuffer.length > 0) {
    const lastNavItem = navUl.lastElementChild;
    if (lastNavItem) {
      const megaMenu = lastNavItem.querySelector('.mega-menu');
      if (megaMenu) {
        const centerDiv = megaMenu.querySelector('.center-div');
        if (centerDiv) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div', 'extra-content-left-div');
          contentBuffer.forEach(bufferedNode => {
            if (bufferedNode.tagName === 'H4' && bufferedNode.querySelector('a')) {
              const headingLink = bufferedNode.querySelector('a');
              const h4 = document.createElement('h4');
              h4.classList.add('left-div-heading');
              const a = document.createElement('a');
              a.href = headingLink.href;
              a.textContent = headingLink.textContent;
              h4.append(a);
              leftDiv.append(h4);
            } else if (bufferedNode.tagName === 'P') {
              const p = document.createElement('p');
              if (bufferedNode.textContent.includes('#')) {
                p.classList.add('left-div-subdesc');
              } else {
                p.classList.add('left-div-desc');
              }
              p.textContent = bufferedNode.textContent;
              leftDiv.append(p);
            } else if (bufferedNode.tagName === 'UL') {
              const ul = bufferedNode.cloneNode(true);
              Array.from(ul.children).forEach(li => {
                if (li.querySelector('span')) { // Heuristic for list-text-red
                  li.classList.add('list-text-red');
                }
              });
              leftDiv.append(ul);
            } else {
              leftDiv.append(bufferedNode.cloneNode(true));
            }
          });
          centerDiv.prepend(leftDiv); // Prepend to ensure it appears on the left
        }
      }
    }
  }
}

/**
 * Creates the search screen HTML structure.
 * @param {Element} toolsRow The tools row from the fragment to extract dynamic content.
 * @returns {Element} The search screen wrapper.
 */
function createSearchScreen(toolsRow) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.setAttribute('aria-hidden', 'true'); // Initially hidden for accessibility

  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = getMetadata('search-page-url') || '/search'; // Dynamic search page URL
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
  searchIconDiv.innerHTML = SVG_SEARCH_LENS;
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
  submitButton.setAttribute('aria-label', 'Submit search');
  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.setAttribute('data-once', 'search-stop-propagation');
  submitLabel.textContent = 'Submit'; // Dynamic label if needed from fragment
  submitButton.append(submitLabel);
  submitButton.innerHTML += SVG_ARROW_RIGHT;
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

  // Extract Popular Keywords and Recommended for you from toolsRow if available
  const popularKeywordsDiv = toolsRow.querySelector('.popular-keywords');
  if (popularKeywordsDiv) {
    const popularKeywords = document.createElement('div');
    popularKeywords.classList.add('search-suggestions-wrap');
    popularKeywords.setAttribute('data-once', 'search-stop-propagation');
    popularKeywords.innerHTML = `
      <div class="label" data-once="search-stop-propagation">${popularKeywordsDiv.querySelector('h4')?.textContent || 'Popular Keywords:'}</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          ${Array.from(popularKeywordsDiv.querySelectorAll('li')).map(li => `<li data-once="search-stop-propagation">${li.textContent}</li>`).join('')}
        </ul>
      </div>
    `;
    searchWrapInner.append(popularKeywords);
  } else {
    // Fallback if not found in fragment
    const popularKeywords = document.createElement('div');
    popularKeywords.classList.add('search-suggestions-wrap');
    popularKeywords.setAttribute('data-once', 'search-stop-propagation');
    popularKeywords.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Business</li>
          <li data-once="search-stop-propagation">FY 21</li>
          <li data-once="search-stop-propagation">Brands</li>
        </ul>
      </div>
    `;
    searchWrapInner.append(popularKeywords);
  }

  const recommendedForYouDiv = toolsRow.querySelector('.recommended-for-you');
  if (recommendedForYouDiv) {
    const recommendedForYou = document.createElement('div');
    recommendedForYou.classList.add('search-suggestions-wrap');
    recommendedForYou.setAttribute('data-once', 'search-stop-propagation');
    recommendedForYou.innerHTML = `
      <div class="label" data-once="search-stop-propagation">${recommendedForYouDiv.querySelector('h4')?.textContent || 'Recommended for you:'}</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          ${Array.from(recommendedForYouDiv.querySelectorAll('li')).map(li => `<li data-once="search-stop-propagation">${li.textContent}</li>`).join('')}
        </ul>
      </div>
    `;
    searchWrapInner.append(recommendedForYou);
  } else {
    // Fallback if not found in fragment
    const recommendedForYou = document.createElement('div');
    recommendedForYou.classList.add('search-suggestions-wrap');
    recommendedForYou.setAttribute('data-once', 'search-stop-propagation');
    recommendedForYou.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
          <li data-once="search-stop-propagation">Leadership Announcement</li>
        </ul>
      </div>
    `;
    searchWrapInner.append(recommendedForYou);
  }

  return searchScreenWrap;
}

/**
 * Sets up the utility tools section.
 * @param {Element} toolsRow The tools row from the fragment.
 * @param {Element} nav The main navigation element.
 * @param {Element} headerBlock The main header block element.
 */
function setupTools(toolsRow, nav, headerBlock) {
  if (!toolsRow || !nav || !headerBlock) return;

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIconNav.append(desktopUl);
  nav.append(desktopIconNav);
  moveInstrumentation(toolsRow, desktopIconNav); // Move instrumentation from original toolsRow

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);
  nav.append(mobileIconNav);

  let contactUsLink = null;
  let searchLink = null;
  // Social links are not explicitly handled in the original HTML, so we'll skip them for now
  // If they were in the fragment, we'd iterate through toolsRow.children to find them.

  Array.from(toolsRow.children).forEach(child => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach(li => {
        const link = li.querySelector('a');
        if (link) {
          const text = link.textContent.trim().toLowerCase();
          if (text === 'contact us') {
            contactUsLink = link.cloneNode(true);
          } else if (text === 'search') {
            searchLink = link.cloneNode(true);
          }
        }
      });
    }
  });

  // Add Contact Us
  if (contactUsLink) {
    const mailLiDesktop = document.createElement('li');
    mailLiDesktop.classList.add('mail');
    const mailLinkDesktop = contactUsLink.cloneNode(true);
    mailLinkDesktop.innerHTML = SVG_MAIL; // Desktop icon
    mailLiDesktop.append(mailLinkDesktop);
    desktopUl.append(mailLiDesktop);
    moveInstrumentation(contactUsLink.closest('li'), mailLiDesktop); // Move instrumentation from original li to mailLiDesktop

    const mailLiMobile = document.createElement('li');
    mailLiMobile.classList.add('mail');
    const mailLinkMobile = contactUsLink.cloneNode(true);
    mailLinkMobile.textContent = contactUsLink.textContent; // Mobile text
    mailLiMobile.append(mailLinkMobile);
    mobileUl.append(mailLiMobile);
    moveInstrumentation(contactUsLink.closest('li'), mailLiMobile); // Move instrumentation from original li to mailLiMobile
  }

  // Add Search
  if (searchLink) {
    const searchLiDesktop = document.createElement('li');
    searchLiDesktop.classList.add('search');
    searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const searchLinkDesktop = searchLink.cloneNode(true);
    searchLinkDesktop.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE; // Desktop icons
    searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
    searchLinkDesktop.setAttribute('aria-label', 'Toggle search');
    searchLinkDesktop.setAttribute('aria-expanded', 'false');
    searchLiDesktop.append(searchLinkDesktop);
    desktopUl.append(searchLiDesktop);
    moveInstrumentation(searchLink.closest('li'), searchLiDesktop); // Move instrumentation from original li to searchLiDesktop

    const searchLiMobile = document.createElement('li');
    searchLiMobile.classList.add('search');
    searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const searchLinkMobile = searchLink.cloneNode(true);
    searchLinkMobile.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE + '<span> Search</span>'; // Mobile icons + text
    searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
    searchLinkMobile.setAttribute('aria-label', 'Toggle search');
    searchLinkMobile.setAttribute('aria-expanded', 'false');
    searchLiMobile.append(searchLinkMobile);
    mobileUl.append(searchLiMobile);
    moveInstrumentation(searchLink.closest('li'), searchLiMobile); // Move instrumentation from original li to searchLiMobile

    // Create search screen wrapper
    const searchScreenWrap = createSearchScreen(toolsRow);
    headerBlock.append(searchScreenWrap); // Append search screen to the header block for full-screen overlay

    // Toggle search screen on click
    const toggleSearch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = searchScreenWrap.classList.toggle('active');
      searchLiDesktop.classList.toggle('active');
      searchLiMobile.classList.toggle('active');
      document.body.classList.toggle('search-active'); // For body overflow control

      searchLinkDesktop.setAttribute('aria-expanded', isActive);
      searchLinkMobile.setAttribute('aria-expanded', isActive);
      searchScreenWrap.setAttribute('aria-hidden', !isActive);

      if (isActive) {
        searchScreenWrap.querySelector('#searchInput').focus();
      }
    };

    searchLinkDesktop.addEventListener('click', toggleSearch);
    searchLinkMobile.addEventListener('click', toggleSearch);

    // Close search on escape
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && searchScreenWrap.classList.contains('active')) {
        toggleSearch(e);
      }
    });

    // Close search when clicking outside (only for desktop, mobile has full screen)
    if (isDesktop.matches) {
      document.addEventListener('click', (e) => {
        if (searchScreenWrap.classList.contains('active') && !searchScreenWrap.contains(e.target) && !searchLiDesktop.contains(e.target)) {
          toggleSearch(e);
        }
      });
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

  if (!fragment) {
    block.remove();
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand/Logo
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > picture > a, p > a'); // Check for link wrapping picture or direct link
    if (brandLink) {
      const clonedLink = brandLink.cloneNode(true);
      logoDiv.append(clonedLink);
      moveInstrumentation(brandRow, logoDiv); // Move instrumentation from original brandRow to logoDiv
    } else {
      // Fallback if no link, just append the picture
      const picture = brandRow.querySelector('picture');
      if (picture) {
        logoDiv.append(picture.cloneNode(true));
        moveInstrumentation(brandRow, logoDiv);
      }
    }
    wrap.append(logoDiv);
  }

  // 2. Setup Hamburger
  const hamburger = createHamburger();
  wrap.append(hamburger);

  // 3. Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  wrap.append(mainNav);
  setupDesktopNav(navRow, mainNav);

  // 4. Setup Tools/Icons (Search, Contact, Social)
  setupTools(toolsRow, mainNav, block); // Pass the main block to append search screen

  // 5. Add 80th Year Logo (if present in metadata)
  const year80LogoMeta = getMetadata('80th-year-logo');
  const year80LogoLink = getMetadata('80th-year-logo-link') || 'https://www.mahindra.com/';
  const year80LogoAlt = getMetadata('80th-year-logo-alt') || '80th Year Logo Gold';
  const year80LogoTitle = getMetadata('80th-year-logo-title') || '80thYearLogo_Gold';

  if (year80LogoMeta) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const year80Link = document.createElement('a');
    year80Link.href = year80LogoLink;
    const year80Img = document.createElement('img');
    year80Img.src = year80LogoMeta;
    year80Img.alt = year80LogoAlt;
    year80Img.title = year80LogoTitle;
    year80Img.classList.add('hiddenlogo1', 'years-80');
    year80Img.width = '74';
    year80Img.height = '60';
    year80Img.loading = 'lazy';
    year80Link.append(year80Img);
    year80LogoDiv.append(year80Link);
    wrap.append(year80LogoDiv);
    // No direct instrumentation to move from fragment root for this, as it's metadata-driven.
  }

  // Mobile menu toggle logic
  hamburger.addEventListener('click', () => {
    toggleMobileMenu(mainNav, hamburger);
  });

  // Close mobile menu on resize to desktop
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      mainNav.classList.remove('expanded');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }
  });

  // Close mobile menu on escape key
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && mainNav.classList.contains('expanded')) {
      toggleMobileMenu(mainNav, hamburger);
    }
  });
}
