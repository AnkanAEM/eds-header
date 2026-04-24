import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Toggles body scroll lock.
 * @param {boolean} lock - True to lock, false to unlock.
 */
function toggleBodyScrollLock(lock) {
  document.body.style.overflowY = lock ? 'hidden' : '';
}

/**
 * Closes the mobile navigation menu.
 * @param {Element} nav - The navigation element.
 * @param {Element} navSections - The nav sections element.
 */
function closeMobileMenu(nav, navSections) {
  if (!nav || !navSections) return;
  nav.setAttribute('aria-expanded', 'false');
  nav.classList.remove('active');
  toggleAllNavSections(navSections, false);
  toggleBodyScrollLock(false);
  const hamburgerButton = nav.querySelector('.hamburger');
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
  }
  window.removeEventListener('keydown', closeOnEscape);
  nav.removeEventListener('focusout', closeOnFocusLost);
}

/**
 * Opens the mobile navigation menu.
 * @param {Element} nav - The navigation element.
 * @param {Element} navSections - The nav sections element.
 */
function openMobileMenu(nav, navSections) {
  if (!nav || !navSections) return;
  nav.setAttribute('aria-expanded', 'true');
  nav.classList.add('active');
  // Only toggle nav sections if they exist
  if (navSections) {
    toggleAllNavSections(navSections, true);
  }
  toggleBodyScrollLock(true);
  const hamburgerButton = nav.querySelector('.hamburger');
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-label', 'Close navigation');
  }
  window.addEventListener('keydown', closeOnEscape);
  nav.addEventListener('focusout', closeOnFocusLost);
}

/**
 * Toggles the mobile menu state.
 * @param {Element} nav - The navigation element.
 * @param {Element} navSections - The nav sections element.
 * @param {boolean} [forceExpanded=null] - Optional param to force nav expand behavior.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';

  if (isDesktop.matches) {
    // Desktop behavior: always close mobile menu, open/close dropdowns via hover/click
    closeMobileMenu(nav, navSections);
  } else if (expanded) {
    // Mobile behavior: close menu
    closeMobileMenu(nav, navSections);
  } else {
    // Mobile behavior: open menu
    openMobileMenu(nav, navSections);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const searchScreen = nav.querySelector('.search-screen-wrap'); // Search screen is a direct child of nav-tools li

    if (searchScreen && searchScreen.classList.contains('active')) {
      searchScreen.classList.remove('active');
      const searchToggle = nav.querySelector('.nav-tools .search');
      if (searchToggle) searchToggle.classList.remove('active');
      toggleBodyScrollLock(false);
      return;
    }

    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false); // Force close mobile menu
      const hamburgerButton = nav.querySelector('.hamburger');
      if (hamburgerButton) hamburgerButton.focus();
    } else {
      const navSectionExpanded = navSections?.querySelector('.nav-drop[aria-expanded="true"]');
      if (navSectionExpanded) {
        toggleAllNavSections(navSections, false);
        navSectionExpanded.focus();
      }
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const searchScreen = nav.querySelector('.search-screen-wrap');

    if (searchScreen && searchScreen.classList.contains('active')) {
      searchScreen.classList.remove('active');
      const searchToggle = nav.querySelector('.nav-tools .search');
      if (searchToggle) searchToggle.classList.remove('active');
      toggleBodyScrollLock(false);
      return;
    }

    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    } else {
      toggleAllNavSections(navSections, false);
    }
  }
}

/**
 * Toggles all nav sections (dropdowns/mega menus).
 * @param {Element} sections - The container element for nav sections.
 * @param {boolean} expanded - Whether the sections should be expanded or collapsed.
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      if (expanded) {
        megaMenu.style.display = 'block';
      } else {
        megaMenu.style.display = 'none';
      }
    }
    // Collapse all inner dropdowns as well
    section.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((subChild) => {
      subChild.classList.remove('active', 'active-child');
      subChild.style.display = 'none';
    });
  });
}

/**
 * Sets up desktop navigation behavior (hovers, dropdowns).
 * @param {Element} nav - The navigation element.
 */
function setupDesktopNav(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((navSection) => {
    const megaMenu = navSection.querySelector('.mega-menu');
    if (!megaMenu) return;

    navSection.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        toggleAllNavSections(navSections, false); // Collapse others
        navSection.setAttribute('aria-expanded', 'true');
        megaMenu.style.display = 'block';
      }
    });

    navSection.addEventListener('mouseleave', (e) => {
      if (isDesktop.matches && navSection.getAttribute('aria-expanded') === 'true') {
        // Check if the mouse is still within the navSection or its megaMenu
        const isHoveringNavSection = navSection.contains(e.relatedTarget);
        const isHoveringMegaMenu = megaMenu.contains(e.relatedTarget);

        if (!isHoveringNavSection && !isHoveringMegaMenu) {
          navSection.setAttribute('aria-expanded', 'false');
          megaMenu.style.display = 'none';
        }
      }
    });

    // Handle clicks for sub-levels within mega menu
    megaMenu.querySelectorAll('.top-level-li').forEach((topLevelLi) => {
      const subChild = topLevelLi.querySelector('.has-sub-child');
      if (subChild) {
        topLevelLi.querySelector('a')?.addEventListener('click', (e) => {
          if (isDesktop.matches) {
            e.preventDefault();
            const isActive = subChild.classList.contains('active');
            // Close other top-level-li sub-children in the same mega menu
            topLevelLi.closest('.mega-menu').querySelectorAll('.top-level-li .has-sub-child').forEach((otherSubChild) => {
              if (otherSubChild !== subChild && otherSubChild.classList.contains('active')) {
                otherSubChild.classList.remove('active');
                otherSubChild.style.display = 'none';
                otherSubChild.querySelectorAll('.has-inner-sub-child').forEach(inner => {
                  inner.classList.remove('active-child');
                  inner.style.display = 'none';
                });
              }
            });

            subChild.classList.toggle('active', !isActive);
            subChild.style.display = !isActive ? 'block' : 'none';
          }
        });
      }
    });

    megaMenu.querySelectorAll('.first-level-li').forEach((firstLevelLi) => {
      const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
      if (innerSubChild) {
        firstLevelLi.querySelector('a')?.addEventListener('click', (e) => {
          if (isDesktop.matches) {
            e.preventDefault();
            const isActive = innerSubChild.classList.contains('active-child');
            // Close other first-level-li inner sub-children in the same sub-child
            firstLevelLi.closest('.has-sub-child').querySelectorAll('.first-level-li .has-inner-sub-child').forEach((otherInnerSubChild) => {
              if (otherInnerSubChild !== innerSubChild && otherInnerSubChild.classList.contains('active-child')) {
                otherInnerSubChild.classList.remove('active-child');
                otherInnerSubChild.style.display = 'none';
              }
            });

            innerSubChild.classList.toggle('active-child', !isActive);
            innerSubChild.style.display = !isActive ? 'block' : 'none';
          }
        });
      }
    });
  });
}

/**
 * Sets up mobile navigation behavior (hamburger, accordion).
 * @param {Element} nav - The navigation element.
 */
function setupMobileNav(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((navSection) => {
    const megaMenu = navSection.querySelector('.mega-menu');
    if (!megaMenu) return;

    const navSectionLink = navSection.querySelector('a');
    if (navSectionLink) {
      navSectionLink.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          // Close other top-level sections
          navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((otherSection) => {
            if (otherSection !== navSection && otherSection.getAttribute('aria-expanded') === 'true') {
              otherSection.setAttribute('aria-expanded', 'false');
              const otherMegaMenu = otherSection.querySelector('.mega-menu');
              if (otherMegaMenu) otherMegaMenu.style.display = 'none';
              // Collapse all inner dropdowns of other sections
              otherSection.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((subChild) => {
                subChild.classList.remove('active', 'active-child');
                subChild.style.display = 'none';
              });
            }
          });

          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          megaMenu.style.display = expanded ? 'none' : 'block';
        }
      });
    }

    // Handle clicks for sub-levels within mega menu
    megaMenu.querySelectorAll('.top-level-li').forEach((topLevelLi) => {
      const subChild = topLevelLi.querySelector('.has-sub-child');
      if (subChild) {
        const topLevelLink = topLevelLi.querySelector('a');
        if (topLevelLink) {
          topLevelLink.addEventListener('click', (e) => {
            if (!isDesktop.matches) {
              e.preventDefault();
              const isActive = subChild.classList.contains('active');
              // Close other top-level-li sub-children in the same mega menu
              topLevelLi.closest('.mega-menu').querySelectorAll('.top-level-li .has-sub-child').forEach((otherSubChild) => {
                if (otherSubChild !== subChild && otherSubChild.classList.contains('active')) {
                  otherSubChild.classList.remove('active');
                  otherSubChild.style.display = 'none';
                  otherSubChild.querySelectorAll('.has-inner-sub-child').forEach(inner => {
                    inner.classList.remove('active-child');
                    inner.style.display = 'none';
                  });
                }
              });

              subChild.classList.toggle('active', !isActive);
              subChild.style.display = !isActive ? 'block' : 'none';
            }
          });
        }
      }
    });

    megaMenu.querySelectorAll('.first-level-li').forEach((firstLevelLi) => {
      const innerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
      if (innerSubChild) {
        const firstLevelLink = firstLevelLi.querySelector('a');
        if (firstLevelLink) {
          firstLevelLink.addEventListener('click', (e) => {
            if (!isDesktop.matches) {
              e.preventDefault();
              const isActive = innerSubChild.classList.contains('active-child');
              // Close other first-level-li inner sub-children in the same sub-child
              firstLevelLi.closest('.has-sub-child').querySelectorAll('.first-level-li .has-inner-sub-child').forEach((otherInnerSubChild) => {
                if (otherInnerSubChild !== innerSubChild && otherInnerSubChild.classList.contains('active-child')) {
                  otherInnerSubChild.classList.remove('active-child');
                  otherInnerSubChild.style.display = 'none';
                }
              });

              innerSubChild.classList.toggle('active-child', !isActive);
              innerSubChild.style.display = !isActive ? 'block' : 'none';
            }
          });
        }
      }
    });
  });
}

/**
 * Sets up accessibility attributes and event listeners.
 * @param {Element} nav - The navigation element.
 */
function setupAccessibility(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((navSection) => {
      navSection.setAttribute('aria-haspopup', 'true');
      navSection.setAttribute('aria-expanded', 'false');
    });
  }

  // Hamburger button accessibility
  const hamburgerButton = nav.querySelector('.hamburger');
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-controls', 'nav');
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
  }

  // Search toggle accessibility
  const searchToggle = nav.querySelector('.nav-tools .search');
  if (searchToggle) {
    const searchLink = searchToggle.querySelector('a');
    if (searchLink) {
      searchLink.setAttribute('aria-haspopup', 'dialog');
      searchLink.setAttribute('aria-expanded', 'false');
    }
  }
}

/**
 * Parses the fragment structure and applies top-level wrappers and classes.
 * @param {Element} nav - The navigation element.
 * @returns {Object} - An object containing references to the brand, sections, and tools rows.
 */
function parseStructure(nav) {
  if (!nav) return {};

  const children = Array.from(nav.children);
  let navBrand = null;
  let navSections = null;
  let navTools = null;

  // Identify Brand Row: Contains an <img>
  const brandRow = children.find((child) => child.querySelector('img'));
  if (brandRow) {
    brandRow.classList.add('nav-brand');
    navBrand = brandRow;
  }

  // Identify Nav Sections: Contains ul elements for main navigation
  const navSectionsEl = children.find((child) => child.querySelector('ul') && !child.classList.contains('nav-tools'));
  if (navSectionsEl) {
    navSectionsEl.classList.add('nav-sections');
    navSections = navSectionsEl;
  }

  // Identify Tools Row: Contains social media links or utility CTAs
  const toolsRow = children.find((child) => child.classList.contains('icon-nav') || (child.querySelector('ul') && child !== navSections));
  if (toolsRow) {
    toolsRow.classList.add('nav-tools');
    navTools = toolsRow;
  }

  return { navBrand, navSections, navTools };
}

/**
 * Decorates the main navigation menu structure.
 * @param {Element} navSections - The nav sections element.
 */
function decorateNavSections(navSections) {
  if (!navSections) return;

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  // Find all top-level divs that represent a main nav item or a mega menu section
  const topLevelDivs = Array.from(navSections.children);

  topLevelDivs.forEach((wrapper, index) => {
    const pButton = wrapper.querySelector('p > a.button');
    const ulList = wrapper.querySelector('ul');

    if (pButton && ulList) {
      // This pattern suggests a main nav item with a mega menu
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red', 'nav-drop');
      li.setAttribute('itemprop', 'name');

      const link = document.createElement('a');
      link.setAttribute('itemprop', 'url');
      link.href = pButton.href;
      link.textContent = pButton.textContent;
      li.append(link);

      // Add SVG icon
      const span = document.createElement('span');
      span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      megaMenu.style.display = 'none';

      const wrapContainer = document.createElement('div');
      wrapContainer.classList.add('wrap', 'container');
      megaMenu.append(wrapContainer);

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      wrapContainer.append(centerDiv);

      // Look for a preceding div that might contain the left-div content
      const prevWrapper = topLevelDivs[index - 1];
      if (prevWrapper && !prevWrapper.querySelector('p > a.button') && !prevWrapper.querySelector('ul')) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        // Copy all content from the previous wrapper to the left-div
        while (prevWrapper.firstChild) {
          leftDiv.append(prevWrapper.firstChild);
        }
        // Add specific classes based on the original HTML's content structure
        const linkText = pButton.textContent.toLowerCase();
        if (linkText === 'who we are') {
          leftDiv.classList.add('about-us-left-div');
        } else if (linkText === 'what we do') {
          leftDiv.classList.add('what-we-do-left-div');
        } else if (linkText === 'investor relations') {
          leftDiv.classList.add('ir-left-div');
        } else if (linkText === 'newsroom') {
          leftDiv.classList.add('newsroom-left-div');
        } else if (linkText === 'careers') {
          leftDiv.classList.add('career-left-div');
        }
        centerDiv.append(leftDiv);
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      const linkText = pButton.textContent.toLowerCase();
      if (linkText === 'who we are') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (linkText === 'what we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (linkText === 'investor relations') {
        subNavWrap.classList.add('element-block');
      } else if (linkText === 'careers') {
        subNavWrap.classList.add('careers-div');
      }

      // Process the UL list for the mega menu content
      const megaMenuUl = document.createElement('ul');
      megaMenuUl.setAttribute('itemscope', '');
      megaMenuUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

      Array.from(ulList.children).forEach((originalLi) => {
        const newLi = document.createElement('li');
        newLi.setAttribute('itemprop', 'name');

        const originalLink = originalLi.querySelector('a');
        const originalSubUl = originalLi.querySelector('ul');

        if (originalLink) {
          const newLink = document.createElement('a');
          newLink.setAttribute('itemprop', 'url');
          newLink.href = originalLink.href;
          newLink.textContent = originalLink.textContent;
          if (originalLink.target) newLink.target = originalLink.target;
          newLi.append(newLink);
        } else {
          // If no direct link, but has text content (e.g., "Technology Services")
          const textNode = document.createTextNode(originalLi.firstChild.textContent.trim());
          newLi.append(textNode);
        }

        if (originalSubUl) {
          newLi.classList.add('top-level-li');
          const spanIcon = document.createElement('span');
          spanIcon.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          newLi.append(spanIcon);

          const subChildDiv = document.createElement('div');
          subChildDiv.classList.add('has-sub-child');
          subChildDiv.style.display = 'none';

          const innerUl = document.createElement('ul');
          Array.from(originalSubUl.children).forEach((subLi) => {
            const newSubLi = document.createElement('li');
            const subLiLink = subLi.querySelector('a');
            const subLiSubUl = subLi.querySelector('ul');

            if (subLiLink) {
              const newSubLink = document.createElement('a');
              newSubLink.href = subLiLink.href;
              newSubLink.textContent = subLiLink.textContent;
              if (subLiLink.target) newSubLink.target = subLiLink.target;
              newSubLi.append(newSubLink);
            } else {
              const subLiTextNode = document.createTextNode(subLi.firstChild.textContent.trim());
              newSubLi.append(subLiTextNode);
            }

            if (subLiSubUl) {
              newSubLi.classList.add('first-level-li');
              const innerSpanIcon = document.createElement('span');
              innerSpanIcon.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
              newSubLi.append(innerSpanIcon);

              const innerSubChildDiv = document.createElement('div');
              innerSubChildDiv.classList.add('has-inner-sub-child');
              innerSubChildDiv.style.display = 'none';

              const innerSubUl = document.createElement('ul');
              Array.from(subLiSubUl.children).forEach((innerLi) => {
                const newInnerLi = document.createElement('li');
                const innerLiLink = innerLi.querySelector('a');
                if (innerLiLink) {
                  const newInnerLink = document.createElement('a');
                  newInnerLink.href = innerLiLink.href;
                  newInnerLink.textContent = innerLiLink.textContent;
                  if (innerLiLink.target) newInnerLink.target = innerLiLink.target;
                  newInnerLi.append(newInnerLink);
                }
                innerSubUl.append(newInnerLi);
              });
              innerSubChildDiv.append(innerSubUl);
              newSubLi.append(innerSubChildDiv);
            }
            innerUl.append(newSubLi);
          });
          subChildDiv.append(innerUl);
          newLi.append(subChildDiv);
        }
        megaMenuUl.append(newLi);
      });

      subNavWrap.append(megaMenuUl);
      centerDiv.append(subNavWrap);
      li.append(megaMenu);
      mainUl.append(li);
    } else if (ulList) {
      // This handles cases where a UL is directly in a div, often for multi-column layouts
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');

      // Check for 'investor relations' specific structure
      const isInvestorRelations = navSections.querySelector('.ir-left-div');
      if (isInvestorRelations && topLevelDivs[index - 1]?.querySelector('a.button')?.textContent.toLowerCase() === 'investor relations') {
        subNavWrap.classList.add('element-block');
        const firstLi = ulList.querySelector('li');
        if (firstLi && firstLi.querySelector('a')?.href.includes('Disclosures-under-Reg-46-62')) {
          const singleLinkUl = document.createElement('ul');
          singleLinkUl.classList.add('sub-nav-wrap-one-link');
          singleLinkUl.append(firstLi.cloneNode(true));
          subNavWrap.append(singleLinkUl);

          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

          const remainingLIs = Array.from(ulList.children).slice(1);
          const half = Math.ceil(remainingLIs.length / 2);
          const ul1 = document.createElement('ul');
          const ul2 = document.createElement('ul');

          remainingLIs.slice(0, half).forEach(li => ul1.append(li.cloneNode(true)));
          remainingLIs.slice(half).forEach(li => ul2.append(li.cloneNode(true)));

          innerSubNavWrapList.append(ul1, ul2);
          subNavWrap.append(innerSubNavWrapList);
        } else {
          // Default two-column UL structure for other cases within element-block
          const clonedUl = ulList.cloneNode(true);
          const lis = Array.from(clonedUl.children);
          const half = Math.ceil(lis.length / 2);

          const ul1 = document.createElement('ul');
          const ul2 = document.createElement('ul');

          lis.slice(0, half).forEach(li => ul1.append(li));
          lis.slice(half).forEach(li => ul2.append(li));

          subNavWrap.append(ul1, ul2);
        }
      } else {
        // Default single UL structure for sub-nav-wrap
        subNavWrap.append(ulList.cloneNode(true));
      }

      // Append to the last mega-menu's center-div
      const lastMegaMenuCenterDiv = mainUl.lastElementChild?.querySelector('.mega-menu .center-div');
      if (lastMegaMenuCenterDiv) {
        lastMegaMenuCenterDiv.append(subNavWrap);
      } else {
        // Fallback: if there's a UL without a preceding button, it might be a standalone section.
        // This scenario should be rare if the fragment is structured consistently.
        // For now, we'll append it to a new li, but ideally, the fragment would provide a button.
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red', 'nav-drop');
        li.setAttribute('itemprop', 'name');
        const link = document.createElement('a');
        link.href = '#'; // Fallback link
        link.textContent = 'Unknown Section'; // Fallback text
        li.append(link);
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        wrapContainer.append(centerDiv);
        megaMenu.append(wrapContainer);
        centerDiv.append(subNavWrap);
        li.append(megaMenu);
        mainUl.append(li);
      }
    }
  });

  navSections.innerHTML = ''; // Clear original content
  navSections.append(mainUl);
}

/**
 * Decorates the tools section (social, contact, search).
 * @param {Element} navTools - The nav tools element.
 */
function decorateNavTools(navTools) {
  if (!navTools) return;

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

  const mobileUl = document.createElement('ul');
  const desktopUl = document.createElement('ul');

  // Iterate over all children of navTools, which could be divs or ul directly
  Array.from(navTools.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (!link) return;

        const liCloneMobile = li.cloneNode(true);
        const liCloneDesktop = li.cloneNode(true);

        if (link.textContent.toLowerCase() === 'contact us') {
          liCloneMobile.classList.add('mail');
          liCloneDesktop.classList.add('mail');
          liCloneDesktop.querySelector('a').innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
            C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
            L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
          </svg>`;
        } else if (link.textContent.toLowerCase() === 'search') {
          liCloneMobile.classList.add('search');
          liCloneDesktop.classList.add('search');

          const searchLinkMobile = liCloneMobile.querySelector('a');
          const searchLinkDesktop = liCloneDesktop.querySelector('a');

          // Add search icons and text for mobile
          searchLinkMobile.innerHTML = `
            <svg viewBox="0 0 21 21" fill="none" class="lens">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
            <svg viewBox="0 0 50 50" class="close">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
            </svg>
            <span> Search</span>
          `;
          // Add search icons for desktop
          searchLinkDesktop.innerHTML = `
            <svg viewBox="0 0 21 21" fill="none" class="lens">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
            <svg viewBox="0 0 50 50" class="close">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
            </svg>
          `;

          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          searchScreenWrap.innerHTML = `
            <div class="wrap">
              <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
                <div class="search-wrap">
                  <div class="search-icon">
                    <svg viewBox="0 0 21 21" fill="none">
                      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                    </svg>
                  </div>
                  <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
                  <button class="submit-button">
                    <div class="label"> Submit </div>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                    </svg>
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
          liCloneMobile.append(searchScreenWrap.cloneNode(true));
          liCloneDesktop.append(searchScreenWrap);

          // Add event listener for search toggle
          const toggleSearch = (targetLi) => {
            const screenWrap = targetLi.querySelector('.search-screen-wrap');
            const isActive = targetLi.classList.contains('active');
            if (isActive) {
              targetLi.classList.remove('active');
              screenWrap.classList.remove('active');
              toggleBodyScrollLock(false);
            } else {
              targetLi.classList.add('active');
              screenWrap.classList.add('active');
              toggleBodyScrollLock(true);
            }
          };

          liCloneMobile.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            toggleSearch(liCloneMobile);
          });
          liCloneDesktop.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            toggleSearch(liCloneDesktop);
          });
        } else {
          // Social media links
          const socialLink = li.cloneNode(true);
          // Add specific classes if needed for social icons
          if (link.href.includes('facebook')) socialLink.classList.add('facebook');
          if (link.href.includes('twitter')) socialLink.classList.add('twitter');
          if (link.href.includes('instagram')) socialLink.classList.add('instagram');
          if (link.href.includes('youtube')) socialLink.classList.add('youtube');
          if (link.href.includes('linkedin')) socialLink.classList.add('linkedin');

          desktopUl.append(socialLink);
        }

        if (liCloneMobile.classList.contains('mail') || liCloneMobile.classList.contains('search')) {
          mobileUl.append(liCloneMobile);
        }
        if (liCloneDesktop.classList.contains('mail') || liCloneDesktop.classList.contains('search')) {
          desktopUl.append(liCloneDesktop);
        }
      });
    } else if (child.classList.contains('icon-nav')) {
      // If the fragment already contains icon-nav structure, append its children
      Array.from(child.children).forEach(iconChild => {
        if (iconChild.tagName === 'UL') {
          Array.from(iconChild.children).forEach(li => {
            const link = li.querySelector('a');
            if (!link) return;

            if (link.textContent.toLowerCase() === 'contact us') {
              const liCloneMobile = li.cloneNode(true);
              liCloneMobile.classList.add('mail');
              mobileUl.append(liCloneMobile);

              const liCloneDesktop = li.cloneNode(true);
              liCloneDesktop.classList.add('mail');
              liCloneDesktop.querySelector('a').innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
              </svg>`;
              desktopUl.append(liCloneDesktop);
            } else if (link.textContent.toLowerCase() === 'search') {
              const liCloneMobile = li.cloneNode(true);
              liCloneMobile.classList.add('search');
              liCloneMobile.querySelector('a').innerHTML = `
                <svg viewBox="0 0 21 21" fill="none" class="lens">
                  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                </svg>
                <svg viewBox="0 0 50 50" class="close">
                  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                </svg>
                <span> Search</span>
              `;
              const searchScreenWrapMobile = document.createElement('div');
              searchScreenWrapMobile.classList.add('search-screen-wrap');
              searchScreenWrapMobile.innerHTML = `
                <div class="wrap">
                  <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
                    <div class="search-wrap">
                      <div class="search-icon">
                        <svg viewBox="0 0 21 21" fill="none">
                          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                        </svg>
                      </div>
                      <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
                      <button class="submit-button">
                        <div class="label"> Submit </div>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                        </svg>
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
              liCloneMobile.append(searchScreenWrapMobile);
              mobileUl.append(liCloneMobile);

              const liCloneDesktop = li.cloneNode(true);
              liCloneDesktop.classList.add('search');
              liCloneDesktop.querySelector('a').innerHTML = `
                <svg viewBox="0 0 21 21" fill="none" class="lens">
                  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                </svg>
                <svg viewBox="0 0 50 50" class="close">
                  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                </svg>
              `;
              const searchScreenWrapDesktop = document.createElement('div');
              searchScreenWrapDesktop.classList.add('search-screen-wrap');
              searchScreenWrapDesktop.innerHTML = `
                <div class="wrap">
                  <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
                    <div class="search-wrap">
                      <div class="search-icon">
                        <svg viewBox="0 0 21 21" fill="none">
                          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                        </svg>
                      </div>
                      <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
                      <button class="submit-button">
                        <div class="label"> Submit </div>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                        </svg>
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
              liCloneDesktop.append(searchScreenWrapDesktop);
              desktopUl.append(liCloneDesktop);

              // Add event listener for search toggle
              const toggleSearch = (targetLi) => {
                const screenWrap = targetLi.querySelector('.search-screen-wrap');
                const isActive = targetLi.classList.contains('active');
                if (isActive) {
                  targetLi.classList.remove('active');
                  screenWrap.classList.remove('active');
                  toggleBodyScrollLock(false);
                } else {
                  targetLi.classList.add('active');
                  screenWrap.classList.add('active');
                  toggleBodyScrollLock(true);
                }
              };

              liCloneMobile.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                toggleSearch(liCloneMobile);
              });
              liCloneDesktop.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                toggleSearch(liCloneDesktop);
              });
            } else {
              // Social media links
              const socialLink = li.cloneNode(true);
              if (link.href.includes('facebook')) socialLink.classList.add('facebook');
              if (link.href.includes('twitter')) socialLink.classList.add('twitter');
              if (link.href.includes('instagram')) socialLink.classList.add('instagram');
              if (link.href.includes('youtube')) socialLink.classList.add('youtube');
              if (link.href.includes('linkedin')) socialLink.classList.add('linkedin');

              desktopUl.append(socialLink);
            }
          });
        }
      });
    }
  });

  navTools.innerHTML = ''; // Clear original content

  if (mobileUl.children.length > 0) {
    mobileIconNav.append(mobileUl);
    navTools.append(mobileIconNav);
  }
  if (desktopUl.children.length > 0) {
    desktopIconNav.append(desktopUl);
    navTools.append(desktopIconNav);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = ''; // Clear the block content
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up'); // Add main header classes to the block

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav'); // Add main-nav class to the nav element
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  // Append fragment children directly to nav for initial parsing
  if (fragment) {
    while (fragment.firstElementChild) {
      nav.append(fragment.firstElementChild);
    }
  }

  // Parse structure and apply top-level classes
  const { navBrand, navSections, navTools } = parseStructure(nav);

  // Decorate Brand Row
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.classList.add('logo');
      const img = brandLink.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
      }
    }
    // Add 80th year logo if present in the fragment
    const year80LogoWrapper = nav.querySelector('.logo.year-80-logo');
    if (year80LogoWrapper) {
      // Remove it from nav first, then append to wrapDiv later
      year80LogoWrapper.remove();
    }
    wrapDiv.append(navBrand); // Append navBrand to wrapDiv
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  wrapDiv.append(hamburger);

  // Decorate Nav Sections (main menu)
  if (navSections) {
    decorateNavSections(navSections);
    nav.prepend(navSections); // Ensure navSections is inside the <nav> element
  }

  // Decorate Nav Tools (contact, search, social)
  if (navTools) {
    decorateNavTools(navTools);
    nav.append(navTools); // Ensure navTools is inside the <nav> element
  }

  wrapDiv.append(nav); // Main nav element

  // Re-append 80th year logo if it was found
  if (navBrand) {
    const year80LogoWrapper = navBrand.querySelector('.logo.year-80-logo');
    if (year80LogoWrapper) {
      wrapDiv.append(year80LogoWrapper);
    }
  }

  navWrapper.append(wrapDiv);
  block.append(navWrapper);

  // Initialize menu state and event listeners
  setupAccessibility(nav);
  setupDesktopNav(nav);
  setupMobileNav(nav);

  // Initial toggle based on desktop match
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
}
