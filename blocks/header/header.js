import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.hamburger').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.main-nav > ul');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  if (focused.closest('.has-child') && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.closest('.has-child').getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.main-nav > ul'));
    focused.closest('.has-child').setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  document.body.classList.toggle('nav-open', !expanded);
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.has-child > a');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function moveInstrumentation(sourceElement, targetElement) {
  if (sourceElement && targetElement) {
    const cqPath = sourceElement.dataset.cqPath;
    if (cqPath) {
      targetElement.dataset.cqPath = cqPath;
      sourceElement.removeAttribute('data-cq-path');
    }
  }
}

function createSVG(svgContent) {
  const span = document.createElement('span');
  span.innerHTML = svgContent;
  return span.firstElementChild;
}

function createChevronSVG() {
  const svgString = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
  return createSVG(svgString);
}

function createMailSVG() {
  const svgString = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
  return createSVG(svgString);
}

function createSearchSVG(type = 'lens') {
  let svgString = '';
  if (type === 'lens') {
    svgString = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
  } else if (type === 'close') {
    svgString = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
  } else if (type === 'arrow') {
    svgString = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';
  }
  return createSVG(svgString);
}

function setupSearchScreen(searchSection, searchFragmentContent) {
  if (!searchSection || !searchFragmentContent) return;

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');

  const form = document.createElement('form');
  form.action = searchFragmentContent.querySelector('form')?.action || 'https://www.mahindra.com/search';
  form.method = searchFragmentContent.querySelector('form')?.method || 'get';
  form.id = 'search-block-form';
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.append(createSearchSVG('lens'));

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('data-once', 'search-stop-propagation');

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  submitButton.type = 'submit';

  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.setAttribute('data-once', 'search-stop-propagation');
  labelDiv.textContent = searchFragmentContent.querySelector('.submit-button .label')?.textContent || 'Submit';
  submitButton.append(labelDiv);
  submitButton.append(createSearchSVG('arrow'));

  searchWrap.append(searchIconDiv);
  searchWrap.append(searchInput);
  searchWrap.append(submitButton);
  form.append(searchWrap);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.style.display = 'none'; // Initially hidden

  const swiperDiv = document.createElement('div');
  swiperDiv.classList.add('swiper', 'scrollSwiper');
  swiperDiv.setAttribute('data-once', 'search-stop-propagation');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('data-once', 'search-stop-propagation');

  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.setAttribute('data-once', 'search-stop-propagation');
  swiperWrapper.append(swiperSlide);
  swiperDiv.append(swiperWrapper);
  searchResultBox.append(swiperDiv);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.append(swiperScrollbar);

  form.append(searchResultBox);
  wrapDiv.append(form);

  // Popular Keywords
  const popularKeywordsDiv = document.createElement('div');
  popularKeywordsDiv.classList.add('search-suggestions-wrap');
  popularKeywordsDiv.setAttribute('data-once', 'search-stop-propagation');
  const popularLabel = document.createElement('div');
  popularLabel.classList.add('label');
  popularLabel.setAttribute('data-once', 'search-stop-propagation');
  popularLabel.textContent = searchFragmentContent.querySelector('.search-suggestions-wrap .label')?.textContent || 'Popular Keywords:';
  const popularTokensWrap = document.createElement('div');
  popularTokensWrap.classList.add('tokens-wrap');
  popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
  const popularUl = document.createElement('ul');
  popularUl.setAttribute('data-once', 'search-stop-propagation');

  const popularItems = searchFragmentContent.querySelector('.search-suggestions-wrap:first-of-type .tokens-wrap ul');
  if (popularItems) {
    Array.from(popularItems.children).forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = item.textContent;
      popularUl.append(li);
    });
  }
  popularTokensWrap.append(popularUl);
  popularKeywordsDiv.append(popularLabel);
  popularKeywordsDiv.append(popularTokensWrap);
  wrapDiv.append(popularKeywordsDiv);

  // Recommended for you
  const recommendedDiv = document.createElement('div');
  recommendedDiv.classList.add('search-suggestions-wrap');
  recommendedDiv.setAttribute('data-once', 'search-stop-propagation');
  const recommendedLabel = document.createElement('div');
  recommendedLabel.classList.add('label');
  recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
  recommendedLabel.textContent = searchFragmentContent.querySelector('.search-suggestions-wrap:last-of-type .label')?.textContent || 'Recommended for you:';
  const recommendedTokensWrap = document.createElement('div');
  recommendedTokensWrap.classList.add('tokens-wrap');
  recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
  const recommendedUl = document.createElement('ul');
  recommendedUl.setAttribute('data-once', 'search-stop-propagation');

  const recommendedItems = searchFragmentContent.querySelector('.search-suggestions-wrap:last-of-type .tokens-wrap ul');
  if (recommendedItems) {
    Array.from(recommendedItems.children).forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = item.textContent;
      recommendedUl.append(li);
    });
  }
  recommendedTokensWrap.append(recommendedUl);
  recommendedDiv.append(recommendedLabel);
  recommendedDiv.append(recommendedTokensWrap);
  wrapDiv.append(recommendedDiv);

  searchScreenWrap.append(wrapDiv);
  searchSection.append(searchScreenWrap);

  const searchToggle = searchSection.querySelector('a');
  if (searchToggle) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      searchToggle.querySelector('.lens').classList.toggle('active', !searchScreenWrap.classList.contains('active'));
      searchToggle.querySelector('.close').classList.toggle('active', searchScreenWrap.classList.contains('active'));
    });
  }

  searchScreenWrap.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

function processNestedLists(ulElement, level = 0) {
  if (!ulElement) return;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const anchor = li.querySelector('a');
      const nestedUl = li.querySelector('ul');

      if (nestedUl) {
        li.classList.add('has-child');
        const span = document.createElement('span');
        span.append(createChevronSVG());
        li.append(span);

        const innerDiv = document.createElement('div');
        if (level === 0) {
          innerDiv.classList.add('has-sub-child');
        } else {
          innerDiv.classList.add('has-inner-sub-child');
        }
        innerDiv.append(nestedUl);
        li.append(innerDiv);

        if (anchor) {
          anchor.addEventListener('click', (e) => {
            if (!isDesktop.matches) {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('active');
              innerDiv.classList.toggle('active', li.classList.contains('active'));
              innerDiv.classList.toggle('active-child', li.classList.contains('active'));
            }
          });
        }
        processNestedLists(nestedUl, level + 1);
      }
    }
  });
}

function setupDesktopNav(navRow, mainNavUl) {
  if (!navRow || !mainNavUl) return;

  let contentBuffer = [];
  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'P' && child.querySelector('a')) {
        // This is a navigation trigger (e.g., <p><a href="...">Title</a></p>)
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red');
        li.setAttribute('itemprop', 'name');
        li.setAttribute('data-once', 'nav-close-search');

        const anchor = child.querySelector('a');
        if (anchor) {
          moveInstrumentation(child, li); // Move instrumentation from <p> to <li>
          anchor.setAttribute('itemprop', 'url');
          li.append(anchor);
        }

        const span = document.createElement('span');
        span.append(createChevronSVG());
        li.append(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');

        // Flush buffer into left-div
        if (contentBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');

          const titleText = anchor ? anchor.textContent.trim() : 'untitled';
          const sanitizedTitle = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);

          contentBuffer.forEach((bufferedItem) => {
            if (bufferedItem.tagName === 'H4') {
              bufferedItem.classList.add('left-div-heading');
              const h4Anchor = bufferedItem.querySelector('a');
              if (!h4Anchor) {
                const tempAnchor = document.createElement('a');
                tempAnchor.textContent = bufferedItem.textContent;
                bufferedItem.textContent = '';
                bufferedItem.append(tempAnchor);
              }
            } else if (bufferedItem.tagName === 'P') {
              if (bufferedItem.textContent.includes('#')) {
                bufferedItem.classList.add('left-div-subdesc');
              } else {
                bufferedItem.classList.add('left-div-desc');
              }
            } else if (bufferedItem.tagName === 'UL') {
              Array.from(bufferedItem.children).forEach((listItem) => {
                if (listItem.tagName === 'LI') {
                  listItem.classList.add('list-text-red');
                  const spanElement = listItem.querySelector('span');
                  if (!spanElement) {
                    const textContent = listItem.textContent.trim();
                    const parts = textContent.split(' ');
                    const lastPart = parts.pop();
                    listItem.textContent = parts.join(' ');
                    const newSpan = document.createElement('span');
                    newSpan.textContent = lastPart;
                    listItem.append(newSpan);
                  }
                }
              });
            } else if (bufferedItem.classList.contains('slides')) {
              // Handle newsroom specific content
              const slidesWrap = document.createElement('div');
              slidesWrap.classList.add('latest-two-press-release');
              slidesWrap.append(bufferedItem);
              leftDiv.append(slidesWrap);
              return; // Skip appending to leftDiv directly, already handled
            }
            leftDiv.append(bufferedItem);
          });
          centerDiv.append(leftDiv);
        }
        contentBuffer = []; // Clear buffer

        // Find the next UL sibling for the sub-navigation
        let nextSibling = child.nextElementSibling;
        while (nextSibling && nextSibling.nodeType !== Node.ELEMENT_NODE) {
          nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling && nextSibling.tagName === 'UL') {
          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          if (sanitizedTitle === 'who-we-are') {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (sanitizedTitle === 'what-we-do') {
            subNavWrap.classList.add('what-we-do');
          } else if (sanitizedTitle === 'investor-relations') {
            subNavWrap.classList.add('element-block');
          } else if (sanitizedTitle === 'careers') {
            subNavWrap.classList.add('careers-div');
          }

          // Handle special structure for Investor Relations
          if (sanitizedTitle === 'investor-relations') {
            const firstUl = document.createElement('ul');
            firstUl.classList.add('sub-nav-wrap-one-link');
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            const secondUl = document.createElement('ul');
            const thirdUl = document.createElement('ul');

            Array.from(nextSibling.children).forEach((item, idx) => {
              if (idx === 0) {
                firstUl.append(item);
              } else if (idx <= 2) {
                secondUl.append(item);
              } else {
                thirdUl.append(item);
              }
            });
            subNavWrap.append(firstUl);
            innerSubNavWrapList.append(secondUl);
            innerSubNavWrapList.append(thirdUl);
            subNavWrap.append(innerSubNavWrapList);

          } else {
            subNavWrap.append(nextSibling);
          }

          processNestedLists(nextSibling);
          centerDiv.append(subNavWrap);
        }
        wrapContainer.append(centerDiv);
        megaMenu.append(wrapContainer);
        li.append(megaMenu);
        mainNavUl.append(li);
      } else {
        // Collect non-navigation elements into the buffer
        contentBuffer.push(child);
      }
    }
  });
}

function setupTools(toolsRow, mainNavUl, searchFragmentContent) {
  if (!toolsRow || !mainNavUl) return;

  const mobileIcons = document.createElement('div');
  mobileIcons.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIcons.append(mobileUl);

  const desktopIcons = document.createElement('div');
  desktopIcons.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIcons.append(desktopUl);

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const anchor = li.querySelector('a');
        if (anchor) {
          if (anchor.textContent.toLowerCase() === 'contact us') {
            const mobileLi = document.createElement('li');
            mobileLi.classList.add('mail');
            const mobileAnchor = anchor.cloneNode(true);
            mobileAnchor.prepend(document.createTextNode(' ')); // Add space before text
            mobileLi.append(mobileAnchor);
            mobileUl.append(mobileLi);

            const desktopLi = document.createElement('li');
            desktopLi.classList.add('mail');
            const desktopAnchor = anchor.cloneNode(true);
            desktopAnchor.textContent = ''; // Remove text for desktop icon
            desktopAnchor.append(createMailSVG());
            desktopLi.append(desktopAnchor);
            desktopUl.append(desktopLi);
            moveInstrumentation(li, desktopLi);
          } else if (anchor.textContent.toLowerCase() === 'search') {
            const searchLi = document.createElement('li');
            searchLi.classList.add('search');
            searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

            const searchAnchor = anchor.cloneNode(true);
            searchAnchor.setAttribute('data-once', 'search-stop-propagation');
            searchAnchor.textContent = ''; // Remove text for desktop icon
            searchAnchor.append(createSearchSVG('lens'));
            searchAnchor.append(createSearchSVG('close'));
            const spanText = document.createElement('span');
            spanText.setAttribute('data-once', 'search-stop-propagation');
            spanText.textContent = ' Search'; // Add search text for mobile
            searchAnchor.append(spanText);

            searchLi.append(searchAnchor);
            setupSearchScreen(searchLi, searchFragmentContent);
            desktopUl.append(searchLi.cloneNode(true)); // Clone for desktop
            mobileUl.append(searchLi); // Use the original for mobile
            moveInstrumentation(li, searchLi);
          }
        }
      });
    }
  });

  mainNavUl.append(mobileIcons);
  mainNavUl.append(desktopIcons);
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

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);
  header.append(containerDiv);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false');

  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(mainNavUl);

  // Use a DocumentFragment for efficient DOM manipulation
  const fragmentContent = document.createDocumentFragment();
  while (fragment.firstElementChild) {
    fragmentContent.append(fragment.firstElementChild);
  }

  // Identify the three main rows based on content
  let brandRow;
  let navRow;
  let toolsRow;
  let searchFragmentContent; // To store the search section content

  Array.from(fragmentContent.children).forEach((child) => {
    if (child.querySelector('picture') || child.querySelector('img')) {
      brandRow = child;
    } else if (child.querySelector('p > a') && child.querySelector('ul')) {
      navRow = child;
    } else if (child.querySelector('ul')) {
      toolsRow = child;
      // Extract search fragment content if available in toolsRow
      const searchLi = toolsRow.querySelector('li.search .search-screen-wrap');
      if (searchLi) {
        searchFragmentContent = searchLi.cloneNode(true);
      }
    }
  });

  // 1. Brand Row
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const anchor = brandRow.querySelector('p > a') || document.createElement('a');
    if (anchor.tagName === 'A') {
      anchor.href = anchor.href || '/'; // Default to root if no href
      const img = brandRow.querySelector('picture img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.setAttribute('loading', 'lazy');
        anchor.append(img);
      } else {
        // If no image, maybe text logo?
        anchor.textContent = brandRow.textContent.trim();
      }
      logoDiv.append(anchor);
    } else if (brandRow.querySelector('picture img')) {
      const tempAnchor = document.createElement('a');
      tempAnchor.href = '/'; // Default to root if no href
      const img = brandRow.querySelector('picture img');
      img.classList.add('hiddenlogo1');
      img.setAttribute('loading', 'lazy');
      tempAnchor.append(img);
      logoDiv.append(tempAnchor);
    }
    wrapDiv.append(logoDiv);
    moveInstrumentation(brandRow, logoDiv);
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrapDiv.append(hamburger);

  hamburger.addEventListener('click', () => toggleMenu(nav, mainNavUl));

  // 2. Nav Row
  if (navRow) {
    setupDesktopNav(navRow, mainNavUl);
    moveInstrumentation(navRow, mainNavUl);
  }

  // 3. Tools Row
  if (toolsRow) {
    setupTools(toolsRow, mainNavUl, searchFragmentContent);
    moveInstrumentation(toolsRow, mainNavUl);
  }

  wrapDiv.append(nav);

  // Add 80th year logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80Anchor = document.createElement('a');
  year80Anchor.href = '/'; // Default to root
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.width = '74';
  year80Img.height = '60';
  year80Img.setAttribute('loading', 'lazy');
  year80Anchor.append(year80Img);
  year80LogoDiv.append(year80Anchor);
  wrapDiv.append(year80LogoDiv);

  block.append(header);

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, mainNavUl, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, mainNavUl, isDesktop.matches));
}
