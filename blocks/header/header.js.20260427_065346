import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on original HTML media queries

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_ICON_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const CLOSE_ICON_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_ICON_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';

/**
 * Parses the fragment to identify brand, nav, and tools sections.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {object} An object containing the identified sections.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandRow = sections.find((s) => s.querySelector('p > picture, img'));
  const navRow = sections.find((s) => s.querySelector('p > a') && s.querySelector('ul'));
  const toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], a[href*="search"]'));
  return { brandRow, navRow, toolsRow };
}

/**
 * Creates a hamburger menu button.
 * @param {Element} nav The main nav element.
 * @returns {Element} The hamburger button element.
 */
function createHamburger(nav) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-controls', nav.id); // Control the main nav element
  hamburger.addEventListener('click', () => toggleMenu(nav, nav.querySelector('.nav-sections')));
  return hamburger;
}

/**
 * Toggles the mobile menu open/close state.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 * @param {boolean} forceExpanded Optional boolean to force the expanded state.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = expanded ? '' : 'hidden';

  const mobileNav = nav.querySelector('.main-nav');
  if (mobileNav) {
    if (expanded) {
      mobileNav.style.transform = 'translate(-100%,0)';
      mobileNav.style.opacity = '0';
    } else {
      mobileNav.style.transform = 'translate(0,0)';
      mobileNav.style.opacity = '1';
    }
  }

  // Close search overlay if open
  const searchOverlay = document.querySelector('.search-screen-wrap');
  if (searchOverlay && searchOverlay.style.opacity === '1') {
    const searchLi = document.querySelector('li.search');
    if (searchLi) {
      searchLi.classList.remove('active');
      searchOverlay.style.opacity = '0';
      searchOverlay.style.pointerEvents = 'none';
      searchOverlay.style.transform = 'translate(0,0)';
      const lensIcon = searchLi.querySelector('.lens');
      const closeIcon = searchLi.querySelector('.close');
      if (lensIcon && closeIcon) {
        lensIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    }
  }
}

/**
 * Sets up desktop navigation behavior.
 * @param {Element} navSections The nav sections container.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((navSection) => {
    const megaMenu = navSection.querySelector('.mega-menu');
    const navLink = navSection.querySelector(':scope > a');

    if (megaMenu && navLink) {
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          navSection.classList.add('hover-red');
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
          megaMenu.style.transform = 'translate(0,0)';
          navSection.setAttribute('aria-expanded', 'true');
        }
      });
      navSection.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          navSection.classList.remove('hover-red');
          megaMenu.style.opacity = '0';
          megaMenu.style.pointerEvents = 'none';
          megaMenu.style.transform = 'translate(0,0)'; // Reset transform
          navSection.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Handle nested sub-menus for desktop
    navSection.querySelectorAll('.sub-nav-wrap ul li.top-level-li').forEach((topLevelLi) => {
      const subChild = topLevelLi.querySelector('.has-sub-child');
      if (subChild) {
        topLevelLi.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            topLevelLi.classList.add('active');
            subChild.classList.add('active');
            topLevelLi.setAttribute('aria-expanded', 'true');
          }
        });
        topLevelLi.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            topLevelLi.classList.remove('active');
            subChild.classList.remove('active');
            topLevelLi.setAttribute('aria-expanded', 'false');
          }
        });
      }

      topLevelLi.querySelectorAll('.has-sub-child ul li.first-level-li').forEach((firstLevelLi) => {
        const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
        if (innerSubChild) {
          firstLevelLi.addEventListener('mouseenter', () => {
            if (isDesktop.matches) {
              firstLevelLi.classList.add('active');
              innerSubChild.classList.add('active-child');
              firstLevelLi.setAttribute('aria-expanded', 'true');
            }
          });
          firstLevelLi.addEventListener('mouseleave', () => {
            if (isDesktop.matches) {
              firstLevelLi.classList.remove('active');
              innerSubChild.classList.remove('active-child');
              firstLevelLi.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  });
}

/**
 * Sets up mobile navigation behavior.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 * @param {Element} toolsRow The original tools row from the fragment.
 */
function setupMobileNav(nav, navSections, toolsRow) {
  if (!nav || !navSections) return;

  // Combine nav-tools into nav-sections for mobile
  if (toolsRow) {
    const mobileTools = document.createElement('div');
    mobileTools.classList.add('icon-nav', 'mobile-menus-icon');
    const ul = document.createElement('ul');

    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const li = document.createElement('li');
      li.classList.add('mail');
      const a = document.createElement('a');
      a.href = contactUsLink.href;
      a.innerHTML = MAIL_ICON_SVG + contactUsLink.textContent.trim(); // Use text content from fragment
      li.append(a);
      ul.append(li);
    }

    const searchLink = toolsRow.querySelector('a[href*="search"]');
    if (searchLink) {
      const li = document.createElement('li');
      li.classList.add('search');
      const a = document.createElement('a');
      a.href = '#'; // Search functionality handled by JS
      a.innerHTML = SEARCH_ICON_SVG + CLOSE_ICON_SVG + `<span>${searchLink.textContent.trim()}</span>`;
      a.setAttribute('aria-label', 'Toggle search');
      a.setAttribute('aria-controls', 'search-screen-wrap-mobile');

      // Clone the search screen structure from the toolsRow in the fragment
      const originalSearchScreenWrap = toolsRow.querySelector('.search-screen-wrap');
      if (originalSearchScreenWrap) {
        const searchScreenWrap = originalSearchScreenWrap.cloneNode(true);
        searchScreenWrap.id = 'search-screen-wrap-mobile';
        searchScreenWrap.style.display = 'none'; // Hidden by default for mobile
        searchScreenWrap.style.opacity = '0';
        searchScreenWrap.style.pointerEvents = 'none';

        // Ensure form action is dynamic
        const searchForm = searchScreenWrap.querySelector('form');
        if (searchForm && searchLink.href) {
          searchForm.action = searchLink.href;
        }

        a.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = searchScreenWrap.style.display === 'block';
          searchScreenWrap.style.display = isExpanded ? 'none' : 'block';
          searchScreenWrap.style.opacity = isExpanded ? '0' : '1';
          searchScreenWrap.style.pointerEvents = isExpanded ? 'none' : 'all';
          a.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

          const lensIcon = a.querySelector('.lens');
          const closeIcon = a.querySelector('.close');
          if (lensIcon && closeIcon) {
            lensIcon.style.display = isExpanded ? 'block' : 'none';
            closeIcon.style.display = isExpanded ? 'none' : 'block';
          }

          // Close mobile menu if search is opened
          if (!isExpanded) {
            toggleMenu(nav, navSections, false);
          }
        });
        li.append(a);
        li.append(searchScreenWrap);
        ul.append(li);
      }
    }

    mobileTools.append(ul);
    navSections.querySelector('.nav-sections > ul').append(mobileTools);
  }

  // Toggle sub-menus on click for mobile
  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((navSection) => {
    const navLink = navSection.querySelector(':scope > a');
    const chevron = navSection.querySelector(':scope > span');
    const megaMenu = navSection.querySelector('.mega-menu');

    if (navLink && chevron && megaMenu) {
      const toggleMobileSubMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = megaMenu.style.display === 'block';
        megaMenu.style.display = isExpanded ? 'none' : 'block';
        chevron.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)';
        navSection.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      };
      navLink.addEventListener('click', toggleMobileSubMenu);
      chevron.addEventListener('click', toggleMobileSubMenu);
    }

    // Handle nested sub-menus for mobile
    navSection.querySelectorAll('.sub-nav-wrap ul li.top-level-li').forEach((topLevelLi) => {
      const topLevelLink = topLevelLi.querySelector(':scope > a');
      const topLevelChevron = topLevelLi.querySelector(':scope > span');
      const subChild = topLevelLi.querySelector('.has-sub-child');

      if (topLevelLink && topLevelChevron && subChild) {
        const toggleSubChild = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isActive = subChild.classList.contains('active');
          if (isActive) {
            subChild.classList.remove('active');
            topLevelChevron.querySelector('svg').style.transform = 'rotate(90deg)';
            topLevelLi.setAttribute('aria-expanded', 'false');
          } else {
            subChild.classList.add('active');
            topLevelChevron.querySelector('svg').style.transform = 'rotate(-90deg)';
            topLevelLi.setAttribute('aria-expanded', 'true');
          }
        };
        topLevelLink.addEventListener('click', toggleSubChild);
        topLevelChevron.addEventListener('click', toggleSubChild);
      }

      topLevelLi.querySelectorAll('.has-sub-child ul li.first-level-li').forEach((firstLevelLi) => {
        const firstLevelLink = firstLevelLi.querySelector(':scope > a');
        const firstLevelChevron = firstLevelLi.querySelector(':scope > span');
        const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');

        if (firstLevelLink && firstLevelChevron && innerSubChild) {
          const toggleInnerSubChild = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = innerSubChild.classList.contains('active-child');
            if (isActive) {
              innerSubChild.classList.remove('active-child');
              firstLevelChevron.querySelector('svg').style.transform = 'rotate(90deg)';
              firstLevelLi.setAttribute('aria-expanded', 'false');
            } else {
              innerSubChild.classList.add('active-child');
              firstLevelChevron.querySelector('svg').style.transform = 'rotate(-90deg)';
              firstLevelLi.setAttribute('aria-expanded', 'true');
            }
          };
          firstLevelLink.addEventListener('click', toggleInnerSubChild);
          firstLevelChevron.addEventListener('click', toggleInnerSubChild);
        }
      });
    });
  });
}

/**
 * Manages ARIA attributes for accessibility.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 */
function setupAccessibility(nav, navSections) {
  if (!nav || !navSections) return;

  nav.setAttribute('aria-expanded', 'false');
  nav.setAttribute('role', 'navigation');

  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((navSection) => {
    navSection.setAttribute('aria-haspopup', 'true');
    navSection.setAttribute('aria-expanded', 'false');
    const navLink = navSection.querySelector(':scope > a');
    if (navLink) {
      navLink.setAttribute('role', 'button');
      navLink.setAttribute('aria-controls', `menu-${navLink.textContent.toLowerCase().replace(/\s/g, '-')}`);
    }
    const megaMenu = navSection.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.id = `menu-${navLink.textContent.toLowerCase().replace(/\s/g, '-')}`;
    }

    // Nested ARIA for sub-menus
    navSection.querySelectorAll('.sub-nav-wrap ul li.top-level-li').forEach((topLevelLi) => {
      topLevelLi.setAttribute('aria-haspopup', 'true');
      topLevelLi.setAttribute('aria-expanded', 'false');
      const topLevelLink = topLevelLi.querySelector(':scope > a');
      const subChild = topLevelLi.querySelector('.has-sub-child');
      if (topLevelLink && subChild) {
        topLevelLink.setAttribute('aria-controls', `submenu-${topLevelLink.textContent.toLowerCase().replace(/\s/g, '-')}`);
        subChild.id = `submenu-${topLevelLink.textContent.toLowerCase().replace(/\s/g, '-')}`;
      }

      topLevelLi.querySelectorAll('.has-sub-child ul li.first-level-li').forEach((firstLevelLi) => {
        firstLevelLi.setAttribute('aria-haspopup', 'true');
        firstLevelLi.setAttribute('aria-expanded', 'false');
        const firstLevelLink = firstLevelLi.querySelector(':scope > a');
        const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
        if (firstLevelLink && innerSubChild) {
          firstLevelLink.setAttribute('aria-controls', `innersubmenu-${firstLevelLink.textContent.toLowerCase().replace(/\s/g, '-')}`);
          innerSubChild.id = `innersubmenu-${firstLevelLink.textContent.toLowerCase().replace(/\s/g, '-')}`;
        }
      });
    });
  });

  // Escape key listener for the entire header
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Close mobile menu
      if (nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav, navSections, false);
      }

      // Close search overlay
      const searchLi = document.querySelector('li.search');
      const searchScreenWrap = document.querySelector('.search-screen-wrap');
      if (searchLi && searchScreenWrap && searchScreenWrap.style.opacity === '1') {
        searchLi.classList.remove('active');
        searchScreenWrap.style.opacity = '0';
        searchScreenWrap.style.pointerEvents = 'none';
        searchScreenWrap.style.transform = 'translate(0,0)';
        searchLi.querySelector('a').setAttribute('aria-expanded', 'false');
        const lensIcon = searchLi.querySelector('.lens');
        const closeIcon = searchLi.querySelector('.close');
        if (lensIcon && closeIcon) {
          lensIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
      }
    }
  });
}

/**
 * Loads and decorates the header.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return;
  }

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover'); // Retain original data-attribute

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle'); // Retain original data-attribute

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // --- Brand Section (logo) ---
  if (brandRow) {
    const navBrand = document.createElement('div');
    navBrand.classList.add('logo');
    const brandLink = brandRow.querySelector('p > a');
    const brandImg = brandRow.querySelector('picture img');

    if (brandLink && brandImg) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      const img = brandImg.cloneNode(true);
      img.classList.add('hiddenlogo1');
      a.append(img);
      navBrand.append(a);
    } else if (brandImg) { // Fallback if link is missing
      const a = document.createElement('a');
      a.href = '/'; // Default home link
      const img = brandImg.cloneNode(true);
      img.classList.add('hiddenlogo1');
      a.append(img);
      navBrand.append(a);
    }
    wrapDiv.append(navBrand);
  }

  // --- Hamburger (for mobile) ---
  const hamburger = createHamburger(nav);
  wrapDiv.append(hamburger);

  // --- Navigation Sections (nav-sections) ---
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections'); // EDS architectural class

  if (navRow) {
    const ul = document.createElement('ul');
    ul.setAttribute('itemscope', '');
    ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

    let currentLi = null;
    let leftDivContentBuffer = [];

    Array.from(navRow.children).forEach((child) => {
      const link = child.querySelector('p > a');
      const isButton = link && link.closest('p');
      const isUl = child.tagName === 'UL';
      const isOtherContent = !isButton && !isUl;

      if (isButton) {
        if (currentLi) {
          ul.append(currentLi); // Append previous li if exists
        }
        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.setAttribute('data-once', 'nav-close-search'); // Retain original data-attribute

        const a = document.createElement('a');
        a.setAttribute('itemprop', 'url');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        currentLi.append(a);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        currentLi.append(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);
        megaMenu.append(megaMenuWrap);
        currentLi.append(megaMenu);

        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');

        // Add specific classes based on menu title (harvested from original HTML)
        const menuTitle = a.textContent.trim().toLowerCase();
        if (menuTitle === 'investor relations') {
          leftDiv.classList.add('ir-left-div');
        } else if (menuTitle === 'newsroom') {
          leftDiv.classList.add('newsroom-left-div');
        } else if (menuTitle === 'careers') {
          leftDiv.classList.add('career-left-div');
        }

        // If there's buffered content, append it to the left-div
        if (leftDivContentBuffer.length > 0) {
          leftDivContentBuffer.forEach((bufferedNode) => leftDiv.append(bufferedNode));
          centerDiv.append(leftDiv);
          leftDivContentBuffer = []; // Clear buffer
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        if (menuTitle === 'what we do') {
          subNavWrap.classList.add('what-we-do');
        } else if (menuTitle === 'about us') {
          subNavWrap.classList.add('about-us-sub-nav');
        } else if (menuTitle === 'investor relations') {
          subNavWrap.classList.add('element-block');
        } else if (menuTitle === 'careers') {
          subNavWrap.classList.add('careers-div');
        }
      } else if (isUl && currentLi) {
        const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          // Clone the UL from the fragment, clean it up, and append
          const clonedUl = child.cloneNode(true);
          clonedUl.querySelectorAll('li').forEach((li) => {
            if (li.children.length > 1 && li.querySelector('ul')) {
              li.classList.add('top-level-li');
              const liSpan = document.createElement('span');
              liSpan.innerHTML = CHEVRON_SVG;
              li.append(liSpan);

              // Handle nested ULs
              Array.from(li.children).forEach((nestedChild) => {
                if (nestedChild.tagName === 'UL') {
                  nestedChild.classList.add('has-sub-child');
                  nestedChild.querySelectorAll('li').forEach((innerLi) => {
                    if (innerLi.children.length > 1 && innerLi.querySelector('ul')) {
                      innerLi.classList.add('first-level-li');
                      const innerLiSpan = document.createElement('span');
                      innerLiSpan.innerHTML = CHEVRON_SVG;
                      innerLi.append(innerLiSpan);
                      const innerUl = innerLi.querySelector('ul');
                      if (innerUl) {
                        innerUl.classList.add('has-inner-sub-child');
                      }
                    }
                  });
                }
              });
            }
          });

          // Special handling for 'Investor Relations' inner-sub-nav-wrap-list
          if (currentLi.querySelector('a').textContent.trim().toLowerCase() === 'investor relations') {
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            // Split the clonedUl's children into two separate ULs for the layout
            const firstHalf = document.createElement('ul');
            const secondHalf = document.createElement('ul');
            Array.from(clonedUl.children).forEach((item, index) => {
              if (index < 3) { // First 3 items go to the first column
                firstHalf.append(item.cloneNode(true));
              } else { // Remaining items go to the second column
                secondHalf.append(item.cloneNode(true));
              }
            });
            // The first item (Disclosures) is a special single link
            const singleLinkUl = document.createElement('ul');
            singleLinkUl.classList.add('sub-nav-wrap-one-link');
            if (firstHalf.children.length > 0) {
              singleLinkUl.append(firstHalf.children[0]); // Move 'Disclosures' to its own ul
            }
            subNavWrap.append(singleLinkUl);
            innerSubNavWrapList.append(firstHalf);
            innerSubNavWrapList.append(secondHalf);
            subNavWrap.append(innerSubNavWrapList);
          } else {
            subNavWrap.append(clonedUl);
          }
        }
      } else if (isOtherContent) {
        // Collect other content (headings, paragraphs, images) into the buffer
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    });
    if (currentLi) {
      ul.append(currentLi); // Append the last li
    }
    navSections.append(ul);
  }
  nav.append(navSections);

  // --- Tools Section (icon-nav desktop) ---
  if (toolsRow) {
    const navTools = document.createElement('div');
    navTools.classList.add('icon-nav', 'desktop-menus-icon');
    const ul = document.createElement('ul');

    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const li = document.createElement('li');
      li.classList.add('mail');
      const a = document.createElement('a');
      a.href = contactUsLink.href;
      a.innerHTML = MAIL_ICON_SVG;
      li.append(a);
      ul.append(li);
    }

    const searchLink = toolsRow.querySelector('a[href*="search"]');
    if (searchLink) {
      const li = document.createElement('li');
      li.classList.add('search');
      li.setAttribute('data-once', 'search-toggle search-stop-propagation'); // Retain original data-attributes
      const a = document.createElement('a');
      a.href = '#';
      a.setAttribute('aria-label', 'Toggle search');
      a.setAttribute('aria-controls', 'search-screen-wrap-desktop');
      a.innerHTML = SEARCH_ICON_SVG + CLOSE_ICON_SVG;
      li.append(a);

      // Clone the search screen structure from the toolsRow in the fragment
      const originalSearchScreenWrap = toolsRow.querySelector('.search-screen-wrap');
      if (originalSearchScreenWrap) {
        const searchScreenWrap = originalSearchScreenWrap.cloneNode(true);
        searchScreenWrap.id = 'search-screen-wrap-desktop';
        searchScreenWrap.style.opacity = '0';
        searchScreenWrap.style.pointerEvents = 'none';
        searchScreenWrap.style.transform = 'translate(0,0)';

        // Ensure form action is dynamic
        const searchForm = searchScreenWrap.querySelector('form');
        if (searchForm && searchLink.href) {
          searchForm.action = searchLink.href;
        }

        li.append(searchScreenWrap);
        ul.append(li);

        // Add event listeners for search toggle
        const searchToggle = () => {
          const isSearchExpanded = li.classList.toggle('active');
          searchScreenWrap.style.opacity = isSearchExpanded ? '1' : '0';
          searchScreenWrap.style.pointerEvents = isSearchExpanded ? 'all' : 'none';
          searchScreenWrap.style.transform = isSearchExpanded ? 'translate(0,0rem)' : 'translate(0,0)';
          a.setAttribute('aria-expanded', isSearchExpanded ? 'true' : 'false');

          // Toggle search icon visibility
          const lensIcon = a.querySelector('.lens');
          const closeIcon = a.querySelector('.close');
          if (lensIcon && closeIcon) {
            lensIcon.style.display = isSearchExpanded ? 'none' : 'block';
            closeIcon.style.display = isSearchExpanded ? 'block' : 'none';
          }
        };
        a.addEventListener('click', (e) => {
          e.preventDefault();
          searchToggle();
        });
      }
    }
    navTools.append(ul);
    nav.append(navTools);
  }

  wrapDiv.append(nav);

  // Add the 80th year logo if it exists in the fragment
  const year80Logo = fragment.querySelector('.year-80-logo');
  if (year80Logo) {
    const clonedLogo = year80Logo.cloneNode(true);
    clonedLogo.classList.add('logo', 'year-80-logo');
    wrapDiv.append(clonedLogo);
  }

  containerDiv.append(wrapDiv);
  header.append(containerDiv);
  block.append(header);

  // Post-append setup for interactivity and accessibility
  const finalNavSections = nav.querySelector('.nav-sections');
  setupDesktopNav(finalNavSections);
  setupMobileNav(nav, finalNavSections, toolsRow); // Pass original toolsRow for content
  setupAccessibility(nav, finalNavSections);

  // Initial mobile menu state based on desktop media query
  toggleMenu(nav, finalNavSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, finalNavSections, isDesktop.matches));
}
