import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on original HTML media queries

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

/**
 * Parses the fragment structure into brand, nav, and tools rows.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandRow = sections.find((s) => s.querySelector('p > picture'));
  const navRow = sections.find((s) => s.querySelector('ul'));
  const toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], a[href*="search"]'));
  return { brandRow, navRow, toolsRow };
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
    const chevron = section.querySelector('span svg');
    if (megaMenu) {
      megaMenu.style.display = expanded ? 'block' : 'none';
    }
    if (chevron) {
      chevron.style.transform = expanded ? 'rotate(0deg)' : 'rotate(90deg)';
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const navElement = nav.querySelector('.main-nav');
  if (!hamburger || !navElement) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.classList.toggle('is-active', !expanded);
  navElement.style.transform = expanded ? 'translate(-100%,0)' : 'translate(0,0)';
  navElement.style.opacity = expanded ? '0' : '1';

  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');

  // Accessibility for mobile
  if (!isDesktop.matches) {
    const navLinks = navSections.querySelectorAll('a');
    if (!expanded) {
      navLinks.forEach((link) => link.setAttribute('tabindex', '0'));
    } else {
      navLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
    }
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.main-nav'); // Corrected selector
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
      nav.querySelector('.hamburger').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.main-nav'); // Corrected selector
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Sets up the desktop navigation interactions.
 * @param {Element} navSections The navigation sections container.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    const mainLink = navSection.querySelector('a');
    const megaMenu = navSection.querySelector('.mega-menu');
    const chevron = navSection.querySelector('span svg');

    if (!mainLink || !megaMenu || !chevron) return;

    navSection.setAttribute('aria-expanded', 'false');

    const openMegaMenu = () => {
      if (isDesktop.matches) {
        toggleAllNavSections(navSections, false); // Close all others
        navSection.setAttribute('aria-expanded', 'true');
        megaMenu.style.display = 'block';
        chevron.style.transform = 'rotate(0deg)';
      }
    };

    const closeMegaMenu = () => {
      if (isDesktop.matches) {
        navSection.setAttribute('aria-expanded', 'false');
        megaMenu.style.display = 'none';
        chevron.style.transform = 'rotate(90deg)';
      }
    };

    navSection.addEventListener('mouseenter', openMegaMenu);
    navSection.addEventListener('mouseleave', closeMegaMenu);

    // Handle nested sub-menus
    navSection.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const subChildLink = subChild.querySelector('a');
      const innerSubChild = subChild.querySelector('.has-inner-sub-child');
      const subChevron = subChild.querySelector('span svg');

      if (!subChildLink || !innerSubChild || !subChevron) return;

      const openSubMenu = () => {
        if (isDesktop.matches) {
          subChild.classList.add('active');
          innerSubChild.classList.add('active-child');
          subChevron.style.transform = 'rotate(0deg)';
        }
      };

      const closeSubMenu = () => {
        if (isDesktop.matches) {
          subChild.classList.remove('active');
          innerSubChild.classList.remove('active-child');
          subChevron.style.transform = 'rotate(90deg)';
        }
      };

      subChild.addEventListener('mouseenter', openSubMenu);
      subChild.addEventListener('mouseleave', closeSubMenu);
    });
  });
}

/**
 * Sets up the mobile navigation interactions.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The navigation sections container.
 * @param {Element} navTools The navigation tools container.
 */
function setupMobileNav(nav, navSections, navTools) {
  if (!nav || !navSections || !navTools) return;

  const hamburger = nav.querySelector('.hamburger');
  const navElement = nav.querySelector('.main-nav');
  if (!hamburger || !navElement) return;

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Append mobile tools to nav sections for unified mobile menu
  const mobileTools = navTools.cloneNode(true);
  mobileTools.classList.add('mobile-menus-icon');
  mobileTools.classList.remove('desktop-menus-icon');

  const mobileToolsUl = mobileTools.querySelector('ul');
  if (mobileToolsUl) {
    // Modify "Contact Us" to be text for mobile
    const contactUsLi = mobileToolsUl.querySelector('li.mail');
    if (contactUsLi) {
      const contactUsLink = contactUsLi.querySelector('a');
      if (contactUsLink) {
        contactUsLink.innerHTML = contactUsLink.textContent.trim(); // Remove SVG for mobile, keep text
      }
    }

    // Add search screen wrap to mobile search
    const searchLi = mobileToolsUl.querySelector('li.search');
    if (searchLi) {
      const searchScreenWrap = createSearchScreen();
      searchLi.append(searchScreenWrap);

      const searchLink = searchLi.querySelector('a');
      if (searchLink) {
        searchLink.innerHTML = `${SVG_SEARCH_LENS} ${SVG_SEARCH_CLOSE} <span>${searchLink.textContent.trim()}</span>`; // Keep original text
        searchLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          searchLi.classList.toggle('active');
          searchScreenWrap.style.display = searchLi.classList.contains('active') ? 'block' : 'none';
        });
      }
    }
    // Append children directly to the main nav ul
    const mainNavUl = navSections.querySelector('ul');
    if (mainNavUl) {
      mainNavUl.append(...Array.from(mobileToolsUl.children));
    }
  }

  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    const mainLink = navSection.querySelector('a');
    const megaMenu = navSection.querySelector('.mega-menu');
    const chevron = navSection.querySelector('span svg');

    if (!mainLink || !megaMenu || !chevron) return;

    navSection.addEventListener('click', (e) => {
      if (!isDesktop.matches && e.target.closest('a') === mainLink) {
        e.preventDefault();
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        megaMenu.style.display = expanded ? 'none' : 'block';
        chevron.style.transform = expanded ? 'rotate(90deg)' : 'rotate(-90deg)';
      }
    });

    // Handle nested sub-menus for mobile
    navSection.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const subChildLink = subChild.querySelector('a');
      const innerSubChild = subChild.querySelector('.has-inner-sub-child');
      const subChevron = subChild.querySelector('span svg');

      if (!subChildLink || !innerSubChild || !subChevron) return;

      subChild.addEventListener('click', (e) => {
        if (!isDesktop.matches && e.target.closest('a') === subChildLink) {
          e.preventDefault();
          const active = subChild.classList.contains('active');
          subChild.classList.toggle('active', !active);
          innerSubChild.classList.toggle('active-child', !active);
          subChevron.style.transform = active ? 'rotate(90deg)' : 'rotate(-90deg)';
        }
      });
    });
  });
}

/**
 * Sets up accessibility attributes.
 * @param {Element} navSections The navigation sections container.
 */
function setupAccessibility(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    const mainLink = navSection.querySelector('a');
    if (mainLink) {
      mainLink.setAttribute('role', 'button');
      mainLink.setAttribute('aria-haspopup', 'true');
    }
  });

  navSections.querySelectorAll('.has-sub-child').forEach((subChild) => {
    const subChildLink = subChild.querySelector('a');
    if (subChildLink) {
      subChildLink.setAttribute('role', 'button');
      subChildLink.setAttribute('aria-haspopup', 'true');
    }
  });
}

/**
 * Creates the search screen DOM structure.
 * @returns {Element} The search screen wrap element.
 */
function createSearchScreen() {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  // Fetch search keywords and recommendations dynamically from the fragment or metadata if available
  // For now, these are hardcoded in the original HTML, so we'll replicate that structure
  // but ideally, these would come from the fragment or a dedicated metadata field.
  searchScreenWrap.innerHTML = `
    <div class="wrap">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
        <div class="search-wrap">
          <div class="search-icon">${SVG_SEARCH_LENS}</div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
          <button class="submit-button">
            <div class="label"> Submit </div>
            ${SVG_SUBMIT_ARROW}
          </button>
        </div>
        <div class="searchResultBox" style="display: none;">
          <div class="swiper scrollSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide"></div>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap">
        <div class="label">Popular Keywords:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Business</li>
            <li>FY 21</li>
            <li>Brands</li>
            <li>XUV700</li>
            <li>Global</li>
            <li>Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap">
        <div class="label">Recommended for you:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Annual Report 2021 - 2022</li>
            <li>Leadership Announcement</li>
            <li>Latest Press Release</li>
            <li>Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  return searchScreenWrap;
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
    block.innerHTML = '';
    return;
  }

  // Create main header structure
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');
  header.id = 'nav'; // Add ID for escape key listener

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Parse fragment into logical sections
  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // --- Nav Brand (Logo) ---
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > picture')?.closest('a') || document.createElement('a');
    if (!brandLink.href) brandLink.href = '/'; // Default home link
    brandLink.innerHTML = brandRow.innerHTML; // Keep original image and structure
    logoDiv.append(brandLink);
    wrapDiv.append(logoDiv);
  }

  // --- Hamburger ---
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburgerDiv.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburgerDiv);

  // --- Main Navigation ---
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(navUl);

  if (navRow) {
    const navRowChildren = Array.from(navRow.children);
    let i = 0;
    while (i < navRowChildren.length) {
      const child = navRowChildren[i];

      if (child.tagName === 'P' && child.querySelector('a')) {
        const mainLinkElement = child.querySelector('a');
        const mainLinkText = mainLinkElement.textContent.trim();

        // Check if the next element is a UL, which would contain the mega menu structure
        const nextUl = navRowChildren[i + 1];

        if (nextUl && nextUl.tagName === 'UL') {
          const li = document.createElement('li');
          li.classList.add('has-child', 'hover-red');
          li.setAttribute('itemprop', 'name');
          li.setAttribute('data-once', 'nav-close-search');

          const link = document.createElement('a');
          link.setAttribute('itemprop', 'url');
          link.href = mainLinkElement.href || '#';
          link.textContent = mainLinkText;
          li.append(link);

          const spanChevron = document.createElement('span');
          spanChevron.innerHTML = SVG_CHEVRON;
          li.append(spanChevron);

          const megaMenuDiv = document.createElement('div');
          megaMenuDiv.classList.add('mega-menu');
          const megaMenuWrap = document.createElement('div');
          megaMenuWrap.classList.add('wrap', 'container');
          const centerDiv = document.createElement('div');
          centerDiv.classList.add('center-div');
          megaMenuWrap.append(centerDiv);
          megaMenuDiv.append(megaMenuWrap);

          // Process content before the main UL as left-div content
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const sanitizedTitle = mainLinkText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);

          // Collect all P and H4 elements before the current main UL
          let j = i - 1;
          const tempLeftDivContent = [];
          while (j >= 0 && navRowChildren[j].tagName !== 'P' && navRowChildren[j].tagName !== 'UL') {
            tempLeftDivContent.unshift(navRowChildren[j].cloneNode(true));
            j--;
          }
          // Also check the immediate P tag if it's not the main link itself
          if (navRowChildren[i] && navRowChildren[i].tagName === 'P' && navRowChildren[i] !== child) {
            tempLeftDivContent.unshift(navRowChildren[i].cloneNode(true));
          }

          // If there's content between the previous main nav item and this one, it's for the left-div
          let prevMainNavItemIndex = -1;
          for (let k = i - 1; k >= 0; k--) {
            if (navRowChildren[k].tagName === 'P' && navRowChildren[k].querySelector('a')) {
              prevMainNavItemIndex = k;
              break;
            }
          }

          for (let k = prevMainNavItemIndex + 1; k < i; k++) {
            const contentNode = navRowChildren[k];
            if (contentNode.tagName === 'H4' && contentNode.querySelector('a')) {
              const headingLink = contentNode.querySelector('a');
              const h4 = document.createElement('h4');
              h4.classList.add('left-div-heading');
              const a = document.createElement('a');
              a.href = headingLink.href || '#';
              a.textContent = headingLink.textContent;
              h4.append(a);
              leftDiv.append(h4);
            } else if (contentNode.tagName === 'P') {
              const p = document.createElement('p');
              p.classList.add('left-div-desc');
              p.innerHTML = contentNode.innerHTML;
              leftDiv.append(p);
            } else if (contentNode.tagName === 'UL') {
              const ul = document.createElement('ul');
              Array.from(contentNode.children).forEach(liElement => {
                const liClone = liElement.cloneNode(true);
                if (liElement.classList.contains('list-text-red')) {
                  liClone.classList.add('list-text-red');
                }
                ul.append(liClone);
              });
              leftDiv.append(ul);
            } else {
              leftDiv.append(contentNode.cloneNode(true));
            }
          }

          if (leftDiv.children.length > 0) {
            centerDiv.append(leftDiv);
          }

          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          // Add specific class for "What we do" and "Careers"
          if (mainLinkText.toLowerCase() === 'what we do') {
            subNavWrap.classList.add('what-we-do');
          } else if (mainLinkText.toLowerCase() === 'careers') {
            subNavWrap.classList.add('careers-div');
          } else if (mainLinkText.toLowerCase() === 'about us') {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (mainLinkText.toLowerCase() === 'investor relations') {
            subNavWrap.classList.add('element-block');
          }

          const topLevelUl = document.createElement('ul');
          subNavWrap.append(topLevelUl);

          Array.from(nextUl.children).forEach((liItem) => {
            const topLi = document.createElement('li');
            topLi.classList.add('top-level-li');
            const topLink = liItem.querySelector('a');
            const nestedUl = liItem.querySelector('ul');

            if (topLink) {
              const linkClone = topLink.cloneNode(true);
              topLi.append(linkClone);
            } else {
              const textNode = document.createTextNode(liItem.firstChild.textContent.trim());
              topLi.append(textNode);
            }

            if (nestedUl) {
              const span = document.createElement('span');
              span.innerHTML = SVG_CHEVRON;
              topLi.append(span);

              const hasSubChildDiv = document.createElement('div');
              hasSubChildDiv.classList.add('has-sub-child');
              const innerUl = document.createElement('ul');
              hasSubChildDiv.append(innerUl);

              Array.from(nestedUl.children).forEach((nestedLi) => {
                const firstLevelLi = document.createElement('li');
                firstLevelLi.classList.add('first-level-li');
                const firstLevelLink = nestedLi.querySelector('a');
                const innerNestedUl = nestedLi.querySelector('ul');

                if (firstLevelLink) {
                  const linkClone = firstLevelLink.cloneNode(true);
                  firstLevelLi.append(linkClone);
                } else {
                  const textNode = document.createTextNode(nestedLi.firstChild.textContent.trim());
                  firstLevelLi.append(textNode);
                }

                if (innerNestedUl) {
                  const innerSpan = document.createElement('span');
                  innerSpan.innerHTML = SVG_CHEVRON;
                  firstLevelLi.append(innerSpan);

                  const hasInnerSubChildDiv = document.createElement('div');
                  hasInnerSubChildDiv.classList.add('has-inner-sub-child');
                  const deepestUl = document.createElement('ul');
                  hasInnerSubChildDiv.append(deepestUl);

                  Array.from(innerNestedUl.children).forEach((deepestLi) => {
                    deepestUl.append(deepestLi.cloneNode(true));
                  });
                  firstLevelLi.append(hasInnerSubChildDiv);
                }
                innerUl.append(firstLevelLi);
              });
              topLi.append(hasSubChildDiv);
            }
            topLevelUl.append(topLi);
          });
          centerDiv.append(subNavWrap);
          navUl.append(li);
          li.append(megaMenuDiv);
          i += 2; // Increment to skip the P tag and the UL we just processed
        } else {
          // If it's a P tag with a link but no subsequent UL, treat it as a simple link
          const li = document.createElement('li');
          li.classList.add('hover-red');
          li.setAttribute('itemprop', 'name');
          li.setAttribute('data-once', 'nav-close-search');

          const link = document.createElement('a');
          link.setAttribute('itemprop', 'url');
          link.href = mainLinkElement.href || '#';
          link.textContent = mainLinkText;
          li.append(link);
          navUl.append(li);
          i += 1;
        }
      } else {
        // This handles the "Newsroom" section which has a complex left-div structure
        // and also the "Investor Relations" which has a single link UL
        const nextUl = navRowChildren[i + 1];
        if (child.tagName === 'H4' && nextUl && nextUl.tagName === 'UL') {
          const mainLinkElement = child.querySelector('a');
          const mainLinkText = mainLinkElement ? mainLinkElement.textContent.trim() : child.textContent.trim();

          const li = document.createElement('li');
          li.classList.add('has-child', 'hover-red');
          li.setAttribute('itemprop', 'name');
          li.setAttribute('data-once', 'nav-close-search');

          const link = document.createElement('a');
          link.setAttribute('itemprop', 'url');
          link.href = mainLinkElement ? mainLinkElement.href : '#';
          link.textContent = mainLinkText;
          li.append(link);

          const spanChevron = document.createElement('span');
          spanChevron.innerHTML = SVG_CHEVRON;
          li.append(spanChevron);

          const megaMenuDiv = document.createElement('div');
          megaMenuDiv.classList.add('mega-menu');
          const megaMenuWrap = document.createElement('div');
          megaMenuWrap.classList.add('wrap', 'container');
          const centerDiv = document.createElement('div');
          centerDiv.classList.add('center-div');
          megaMenuWrap.append(centerDiv);
          megaMenuDiv.append(megaMenuWrap);

          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const sanitizedTitle = mainLinkText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);

          // Collect content for the left-div from the fragment, assuming it's before the UL
          let currentContentIndex = i;
          while (currentContentIndex < navRowChildren.length && navRowChildren[currentContentIndex] !== nextUl) {
            const contentNode = navRowChildren[currentContentIndex];
            if (contentNode.tagName === 'H4' && contentNode.querySelector('a')) {
              const headingLink = contentNode.querySelector('a');
              const h4 = document.createElement('h4');
              h4.classList.add('left-div-heading');
              const a = document.createElement('a');
              a.href = headingLink.href || '#';
              a.textContent = headingLink.textContent;
              h4.append(a);
              leftDiv.append(h4);
            } else if (contentNode.tagName === 'P') {
              const p = document.createElement('p');
              p.classList.add('left-div-desc');
              p.innerHTML = contentNode.innerHTML;
              leftDiv.append(p);
            } else if (contentNode.tagName === 'UL') {
              const ul = document.createElement('ul');
              Array.from(contentNode.children).forEach(liElement => {
                const liClone = liElement.cloneNode(true);
                if (liElement.classList.contains('list-text-red')) {
                  liClone.classList.add('list-text-red');
                }
                ul.append(liClone);
              });
              leftDiv.append(ul);
            } else if (contentNode.classList.contains('latest-two-press-release')) {
              leftDiv.append(contentNode.cloneNode(true));
            }
            currentContentIndex++;
          }
          if (leftDiv.children.length > 0) {
            centerDiv.append(leftDiv);
          }

          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          if (mainLinkText.toLowerCase() === 'investor relations') {
            subNavWrap.classList.add('element-block');
          }

          const topLevelUl = document.createElement('ul');
          subNavWrap.append(topLevelUl);

          Array.from(nextUl.children).forEach((liItem) => {
            const topLi = document.createElement('li');
            topLi.classList.add('top-level-li');
            const topLink = liItem.querySelector('a');
            const nestedUl = liItem.querySelector('ul');

            if (topLink) {
              const linkClone = topLink.cloneNode(true);
              topLi.append(linkClone);
            } else {
              const textNode = document.createTextNode(liItem.firstChild.textContent.trim());
              topLi.append(textNode);
            }

            if (nestedUl) {
              const span = document.createElement('span');
              span.innerHTML = SVG_CHEVRON;
              topLi.append(span);

              const hasSubChildDiv = document.createElement('div');
              hasSubChildDiv.classList.add('has-sub-child');
              const innerUl = document.createElement('ul');
              hasSubChildDiv.append(innerUl);

              Array.from(nestedUl.children).forEach((nestedLi) => {
                const firstLevelLi = document.createElement('li');
                firstLevelLi.classList.add('first-level-li');
                const firstLevelLink = nestedLi.querySelector('a');
                const innerNestedUl = nestedLi.querySelector('ul');

                if (firstLevelLink) {
                  const linkClone = firstLevelLink.cloneNode(true);
                  firstLevelLi.append(linkClone);
                } else {
                  const textNode = document.createTextNode(nestedLi.firstChild.textContent.trim());
                  firstLevelLi.append(textNode);
                }

                if (innerNestedUl) {
                  const innerSpan = document.createElement('span');
                  innerSpan.innerHTML = SVG_CHEVRON;
                  firstLevelLi.append(innerSpan);

                  const hasInnerSubChildDiv = document.createElement('div');
                  hasInnerSubChildDiv.classList.add('has-inner-sub-child');
                  const deepestUl = document.createElement('ul');
                  hasInnerSubChildDiv.append(deepestUl);

                  Array.from(innerNestedUl.children).forEach((deepestLi) => {
                    deepestUl.append(deepestLi.cloneNode(true));
                  });
                  firstLevelLi.append(hasInnerSubChildDiv);
                }
                innerUl.append(firstLevelLi);
              });
              topLi.append(hasSubChildDiv);
            }
            topLevelUl.append(topLi);
          });

          // Handle special case for Investor Relations with inner-sub-nav-wrap-list
          if (mainLinkText.toLowerCase() === 'investor relations') {
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            // Assuming the structure is two ULs inside this div
            const uls = Array.from(subNavWrap.querySelectorAll('ul'));
            if (uls.length >= 2) {
              innerSubNavWrapList.append(uls[0]);
              innerSubNavWrapList.append(uls[1]);
            }
            subNavWrap.append(innerSubNavWrapList);
          }

          centerDiv.append(subNavWrap);
          navUl.append(li);
          li.append(megaMenuDiv);
          i = currentContentIndex + 1; // Move past the processed UL
        } else {
          i++; // Move to the next child if not a recognized nav pattern
        }
      }
    }
  }
  wrapDiv.append(navElement);

  // --- Nav Tools (Contact Us, Search, Social) ---
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopToolsUl = document.createElement('ul');
  desktopIconNav.append(desktopToolsUl);

  if (toolsRow) {
    const toolsRowChildren = Array.from(toolsRow.children);

    // Filter for "Contact Us" and "Search"
    const utilityLinksUl = toolsRowChildren.find(ul => ul.querySelector('a[href*="contact-us"], a[href*="search"]'));
    if (utilityLinksUl) {
      Array.from(utilityLinksUl.children).forEach(li => {
        const liClone = li.cloneNode(true);
        const link = liClone.querySelector('a');
        if (!link) return;

        if (link.href.includes('contact-us')) {
          liClone.classList.add('mail');
          link.innerHTML = SVG_MAIL; // Add SVG for desktop
        } else if (link.textContent.toLowerCase().includes('search')) {
          liClone.classList.add('search');
          liClone.setAttribute('data-once', 'search-toggle search-stop-propagation');
          link.setAttribute('data-once', 'search-stop-propagation');
          link.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE;
          const searchScreenWrap = createSearchScreen();
          liClone.append(searchScreenWrap);

          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            liClone.classList.toggle('active');
            searchScreenWrap.style.opacity = liClone.classList.contains('active') ? '1' : '0';
            searchScreenWrap.style.pointerEvents = liClone.classList.contains('active') ? 'all' : 'none';
          });
        }
        desktopToolsUl.append(liClone);
      });
    }
  }
  wrapDiv.append(desktopIconNav); // Append desktop tools to wrap element

  // --- 80th Year Logo ---
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  year80Link.innerHTML = '<img src="https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp" alt="80th Year Logo Gold" title="80thYearLogo_Gold" class="hiddenlogo1 years-80" width="74" height="60" loading="lazy">';
  year80LogoDiv.append(year80Link);
  wrapDiv.append(year80LogoDiv);

  block.textContent = ''; // Clear original block content
  block.append(header); // Append the constructed header

  // Late binding for event listeners and state management
  const mainNav = block.querySelector('.main-nav');
  const navContainer = block.querySelector('header');

  setupDesktopNav(mainNav);
  setupMobileNav(navContainer, mainNav, desktopIconNav.cloneNode(true)); // Pass a clone for mobile setup

  setupAccessibility(mainNav);

  // Initial toggle for mobile view
  toggleMenu(navContainer, mainNav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(navContainer, mainNav, isDesktop.matches));

  // Add global event listeners for menu collapse
  window.addEventListener('keydown', closeOnEscape);
  navContainer.addEventListener('focusout', closeOnFocusLost);
}
