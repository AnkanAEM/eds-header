import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS media queries

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

/**
 * Toggles the expanded state of a navigation section.
 * @param {HTMLElement} section The navigation section to toggle.
 * @param {boolean} expanded True to expand, false to collapse.
 */
function toggleNavSection(section, expanded) {
  if (!section) return;
  section.setAttribute('aria-expanded', expanded);
  if (section.classList.contains('has-child')) {
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = expanded ? 'block' : 'none';
      megaMenu.setAttribute('aria-hidden', !expanded);
    }
  }
}

/**
 * Toggles the expanded state of all navigation sections.
 * @param {HTMLElement} sectionsContainer The container of navigation sections.
 * @param {boolean} expanded True to expand all, false to collapse all.
 */
function toggleAllNavSections(sectionsContainer, expanded = false) {
  if (!sectionsContainer) return;
  sectionsContainer.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    toggleNavSection(section, expanded);
  });
}

/**
 * Toggles the mobile menu open/closed.
 * @param {HTMLElement} nav The main navigation element.
 * @param {HTMLElement} navSections The nav sections container.
 * @param {boolean|null} forceExpanded Optional: force a specific expanded state.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const newExpandedState = !expanded;
  const hamburger = nav.querySelector('.hamburger');

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', newExpandedState);
    // Add/remove 'active' class to hamburger for styling
    if (newExpandedState) {
      hamburger.classList.add('active');
    } else {
      hamburger.classList.remove('active');
    }
  }

  document.body.style.overflowY = (newExpandedState || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', newExpandedState);
  // On desktop, nav should always be visible, on mobile, it's toggled
  nav.style.display = newExpandedState || isDesktop.matches ? '' : 'none';

  // Collapse all sub-menus when mobile nav is closed
  if (!newExpandedState && !isDesktop.matches) {
    toggleAllNavSections(navSections, false);
    navSections.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child')
      .forEach((el) => el.classList.remove('active', 'active-child'));
  }
}

/**
 * Sets up accessibility attributes and event listeners.
 * @param {HTMLElement} nav The main navigation element.
 * @param {HTMLElement} navSections The nav sections container.
 */
function setupAccessibility(nav, navSections) {
  if (!nav || !navSections) return;

  // Hamburger button accessibility
  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-controls', 'nav-sections-list');
    hamburger.setAttribute('aria-expanded', 'false'); // Initial state
  }

  // Nav sections list accessibility
  const navSectionsList = navSections.querySelector('ul');
  if (navSectionsList) {
    navSectionsList.id = 'nav-sections-list';
  }

  // Desktop dropdown accessibility
  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    const link = section.querySelector('a');
    if (link) {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false'); // Initial state
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) {
        link.setAttribute('aria-controls', megaMenu.id || `mega-menu-${link.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        megaMenu.id = megaMenu.id || `mega-menu-${link.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        megaMenu.setAttribute('aria-hidden', 'true'); // Initial state
      }
    }
  });

  // Escape key to close menu
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, navSections, false);
      if (hamburger) hamburger.focus();
    }
  });

  // Close menu on focus lost (desktop only)
  if (isDesktop.matches) {
    nav.addEventListener('focusout', (e) => {
      if (!nav.contains(e.relatedTarget)) {
        toggleAllNavSections(navSections, false);
      }
    });
  }
}

/**
 * Handles desktop navigation behavior (hovers, dropdowns).
 * @param {HTMLElement} nav The main navigation element.
 */
function setupDesktopNav(nav) {
  if (!nav) return;

  nav.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    const link = section.querySelector('a');
    const megaMenu = section.querySelector('.mega-menu');

    if (link && megaMenu) {
      // Hover to open/close mega menu
      section.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(nav.querySelector('.nav-sections'), false); // Close others
          toggleNavSection(section, true);
        }
      });
      section.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          toggleNavSection(section, false);
        }
      });

      // Click for accessibility on desktop (if needed, otherwise hover is primary)
      link.addEventListener('click', (e) => {
        if (isDesktop.matches) {
          e.preventDefault(); // Prevent navigation on click if it's a menu toggle
          const expanded = section.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(nav.querySelector('.nav-sections'), false);
          toggleNavSection(section, !expanded);
        }
      });
    }
  });
}

/**
 * Handles mobile navigation behavior (hamburger, accordions).
 * @param {HTMLElement} nav The main navigation element.
 */
function setupMobileNav(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Hamburger click to toggle main nav
  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  }

  // Accordion for main nav items on mobile
  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    const link = section.querySelector('a');
    const chevron = section.querySelector('span'); // Assuming chevron is the span
    const megaMenu = section.querySelector('.mega-menu');

    if (link && chevron && megaMenu) {
      const toggle = () => {
        const expanded = section.getAttribute('aria-expanded') === 'true';
        toggleNavSection(section, !expanded);
        chevron.classList.toggle('rotated', !expanded); // Rotate chevron for visual feedback
      };

      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          toggle();
        }
      });
      chevron.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          toggle();
        }
      });
    }
  });

  // Accordion for sub-menus within mega-menus on mobile
  navSections.querySelectorAll('.mega-menu ul li.top-level-li').forEach((topLevelLi) => {
    const topLevelLink = topLevelLi.querySelector('a');
    const topLevelChevron = topLevelLi.querySelector('span');
    const hasSubChild = topLevelLi.querySelector('.has-sub-child');

    if (topLevelLink && topLevelChevron && hasSubChild) {
      const toggleSubMenu = () => {
        const isActive = hasSubChild.classList.contains('active');
        hasSubChild.classList.toggle('active', !isActive);
        topLevelChevron.classList.toggle('rotated', !isActive);
        hasSubChild.setAttribute('aria-expanded', !isActive);
      };
      topLevelLink.addEventListener('click', (e) => {
        if (!isDesktop.matches && !topLevelLink.href.startsWith('http')) { // Only toggle if not a direct link
          e.preventDefault();
          toggleSubMenu();
        }
      });
      topLevelChevron.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          toggleSubMenu();
        }
      });
    }

    // Accordion for inner sub-menus
    topLevelLi.querySelectorAll('.has-sub-child ul li.first-level-li').forEach((firstLevelLi) => {
      const firstLevelLink = firstLevelLi.querySelector('a');
      const firstLevelChevron = firstLevelLi.querySelector('span');
      const hasInnerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');

      if (firstLevelLink && firstLevelChevron && hasInnerSubChild) {
        const toggleInnerSubMenu = () => {
          const isActive = hasInnerSubChild.classList.contains('active-child');
          hasInnerSubChild.classList.toggle('active-child', !isActive);
          firstLevelChevron.classList.toggle('rotated', !isActive);
          hasInnerSubChild.setAttribute('aria-expanded', !isActive);
        };
        firstLevelLink.addEventListener('click', (e) => {
          if (!isDesktop.matches && !firstLevelLink.href.startsWith('http')) {
            e.preventDefault();
            toggleInnerSubMenu();
          }
        });
        firstLevelChevron.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            toggleInnerSubMenu();
          }
        });
      }
    });
  });
}

/**
 * Parses the fragment structure into brand, sections, and tools.
 * @param {HTMLElement} fragment The loaded fragment HTML.
 * @returns {HTMLElement} The constructed navigation wrapper.
 */
function parseStructure(fragment) {
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('container');

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav

  // Hamburger button
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';

  // --- Process Brand Section (first div in fragment) ---
  const brandSection = fragment.children[0];
  if (brandSection) {
    const navBrand = document.createElement('div');
    navBrand.classList.add('logo'); // Use 'logo' class from original HTML
    const brandLink = brandSection.querySelector('a');
    if (brandLink) {
      navBrand.append(brandLink);
    }
    wrap.append(navBrand);
  }

  wrap.append(hamburger);

  // --- Process Nav Sections (second div in fragment) ---
  const sectionsSection = fragment.children[1];
  if (sectionsSection) {
    const navSections = document.createElement('div');
    navSections.classList.add('nav-sections');
    const ul = document.createElement('ul');
    ul.setAttribute('itemscope', '');
    ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

    let currentLi = null;
    let leftDivContentBuffer = [];

    Array.from(sectionsSection.children).forEach((child) => {
      if (child.tagName === 'P' && child.querySelector('a')) {
        // This is a main navigation item (a "Button" in the fragment)
        if (currentLi) {
          ul.append(currentLi);
        }
        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.setAttribute('data-once', 'nav-close-search');

        const link = child.querySelector('a');
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        newLink.setAttribute('itemprop', 'url');
        currentLi.append(newLink);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        currentLi.append(span);

        // Create mega-menu container
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);
        megaMenu.append(megaMenuWrap);
        currentLi.append(megaMenu);

        // Add buffered left-div content
        if (leftDivContentBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          // Add specific class based on link text for styling, if needed
          const sanitizedTitle = newLink.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          leftDiv.classList.add(`${sanitizedTitle}-left-div`);
          leftDivContentBuffer.forEach((bufChild) => leftDiv.append(bufChild));
          centerDiv.append(leftDiv); // Append to centerDiv
          leftDivContentBuffer = []; // Clear buffer
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);
      } else if (child.tagName === 'UL' && currentLi) {
        // This is a menu for the current nav item
        const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          // Process top-level UL
          const newUl = document.createElement('ul');
          Array.from(child.children).forEach((li) => {
            const newLi = document.createElement('li');
            const anchor = li.querySelector('a');
            if (anchor) {
              const newAnchor = document.createElement('a');
              newAnchor.href = anchor.href;
              newAnchor.textContent = anchor.textContent;
              if (anchor.target) newAnchor.target = anchor.target;
              newLi.append(newAnchor);
            } else {
              newLi.textContent = li.firstChild.textContent;
            }

            const nestedUl = li.querySelector('ul');
            if (nestedUl) {
              newLi.classList.add('top-level-li');
              const subMenuChevron = document.createElement('span');
              subMenuChevron.innerHTML = CHEVRON_SVG;
              newLi.append(subMenuChevron);

              const hasSubChild = document.createElement('div');
              hasSubChild.classList.add('has-sub-child');
              hasSubChild.setAttribute('aria-expanded', 'false'); // Initial state
              const innerUl = document.createElement('ul');
              Array.from(nestedUl.children).forEach((nestedLi) => {
                const newNestedLi = document.createElement('li');
                const nestedAnchor = nestedLi.querySelector('a');
                if (nestedAnchor) {
                  const newNestedAnchor = document.createElement('a');
                  newNestedAnchor.href = nestedAnchor.href;
                  newNestedAnchor.textContent = nestedAnchor.textContent;
                  if (nestedAnchor.target) newNestedAnchor.target = nestedAnchor.target;
                  newNestedLi.append(newNestedAnchor);
                } else {
                  newNestedLi.textContent = nestedLi.firstChild.textContent;
                }

                const innerNestedUl = nestedLi.querySelector('ul');
                if (innerNestedUl) {
                  newNestedLi.classList.add('first-level-li');
                  const innerSubMenuChevron = document.createElement('span');
                  innerSubMenuChevron.innerHTML = CHEVRON_SVG;
                  newNestedLi.append(innerSubMenuChevron);

                  const hasInnerSubChild = document.createElement('div');
                  hasInnerSubChild.classList.add('has-inner-sub-child');
                  hasInnerSubChild.setAttribute('aria-expanded', 'false'); // Initial state
                  const deepestUl = document.createElement('ul');
                  Array.from(innerNestedUl.children).forEach((deepestLi) => {
                    const newDeepestLi = document.createElement('li');
                    const deepestAnchor = deepestLi.querySelector('a');
                    if (deepestAnchor) {
                      const newDeepestAnchor = document.createElement('a');
                      newDeepestAnchor.href = deepestAnchor.href;
                      newDeepestAnchor.textContent = deepestAnchor.textContent;
                      if (deepestAnchor.target) newDeepestAnchor.target = deepestAnchor.target;
                      newDeepestLi.append(newDeepestAnchor);
                    } else {
                      newDeepestLi.textContent = deepestLi.firstChild.textContent;
                    }
                    deepestUl.append(newDeepestLi);
                  });
                  hasInnerSubChild.append(deepestUl);
                  newNestedLi.append(hasInnerSubChild);
                }
                innerUl.append(newNestedLi);
              });
              hasSubChild.append(innerUl);
              newLi.append(hasSubChild);
            }
            newUl.append(newLi);
          });
          subNavWrap.append(newUl);
        }
      } else if (currentLi) {
        // Collect non-nav content into buffer for left-div of the current mega-menu
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    });
    if (currentLi) {
      ul.append(currentLi); // Append the last item
    }
    navSections.append(ul);
    nav.append(navSections);
  }

  // --- Process Tools Section (third div in fragment) ---
  const toolsSection = fragment.children[2];
  if (toolsSection) {
    const navTools = document.createElement('div');
    navTools.classList.add('icon-nav', 'desktop-menus-icon'); // Desktop tools
    const mobileNavTools = document.createElement('div');
    mobileNavTools.classList.add('icon-nav', 'mobile-menus-icon'); // Mobile tools

    const desktopUl = document.createElement('ul');
    const mobileUl = document.createElement('ul');

    const utilityLinksUl = toolsSection.querySelector('ul');
    if (utilityLinksUl) {
      Array.from(utilityLinksUl.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          if (link.textContent.toLowerCase() === 'contact us') {
            const mailLiDesktop = document.createElement('li');
            mailLiDesktop.classList.add('mail');
            const mailLinkDesktop = document.createElement('a');
            mailLinkDesktop.href = link.href;
            mailLinkDesktop.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
            mailLiDesktop.append(mailLinkDesktop);
            desktopUl.append(mailLiDesktop);

            const mailLiMobile = document.createElement('li');
            mailLiMobile.classList.add('mail');
            const mailLinkMobile = document.createElement('a');
            mailLinkMobile.href = link.href;
            mailLinkMobile.textContent = link.textContent; // Mobile shows text from fragment
            mailLiMobile.append(mailLinkMobile);
            mobileUl.append(mailLiMobile);
          } else if (link.textContent.toLowerCase() === 'search') {
            const searchLiDesktop = document.createElement('li');
            searchLiDesktop.classList.add('search');
            searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const searchLinkDesktop = document.createElement('a');
            searchLinkDesktop.href = '#'; // Search toggle, not direct link
            searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
            searchLinkDesktop.innerHTML = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path><svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
            searchLinkDesktop.innerHTML += `<span data-once="search-stop-propagation">${link.textContent}</span>`; // Add text for mobile
            searchLiDesktop.append(searchLinkDesktop);

            const searchScreenWrap = li.querySelector('.search-screen-wrap');
            if (searchScreenWrap) {
              searchScreenWrap.setAttribute('aria-hidden', 'true'); // Initial state
              searchLiDesktop.append(searchScreenWrap);
            }
            desktopUl.append(searchLiDesktop);

            const searchLiMobile = document.createElement('li');
            searchLiMobile.classList.add('search');
            searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const searchLinkMobile = document.createElement('a');
            searchLinkMobile.href = '#';
            searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
            searchLinkMobile.innerHTML = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path><svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg><span data-once="search-stop-propagation"> ${link.textContent}</span>';
            if (searchScreenWrap) {
              searchLiMobile.append(searchScreenWrap.cloneNode(true)); // Clone search screen for mobile
            }
            mobileUl.append(searchLiMobile);
          }
        }
      });
    }

    navTools.append(desktopUl);
    mobileNavTools.append(mobileUl);
    wrap.append(mobileNavTools); // Mobile tools are outside <nav> but inside wrap
    nav.append(navTools); // Desktop tools are inside <nav>
  }

  // --- Add 80th year logo if present (fourth div in fragment) ---
  const year80Section = fragment.children[3];
  if (year80Section) {
    const year80Logo = document.createElement('div');
    year80Logo.classList.add('logo', 'year-80-logo');
    const year80Link = year80Section.querySelector('a');
    if (year80Link) {
      year80Logo.append(year80Link);
    }
    wrap.append(year80Logo);
  }

  navWrapper.append(wrap);
  return navWrapper;
}

/**
 * Decorates the header block.
 * @param {HTMLElement} block The header block element.
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
  const navWrapper = parseStructure(fragment);
  block.append(navWrapper);

  const nav = block.querySelector('#nav');
  const navSections = block.querySelector('.nav-sections');

  // Initial state for mobile
  if (!isDesktop.matches) {
    nav.style.display = 'none';
  }

  // Setup event listeners and accessibility
  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav, navSections);

  // Toggle menu on resize
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    if (isDesktop.matches) {
      nav.style.display = ''; // Ensure nav is visible on desktop
      toggleAllNavSections(navSections, false); // Collapse all on desktop resize
    } else {
      nav.style.display = 'none'; // Hide nav on mobile resize
    }
  });

  // Search toggle functionality
  const searchToggleBtn = block.querySelector('.icon-nav .search > a');
  const searchScreen = block.querySelector('.search-screen-wrap');
  const searchCloseBtn = blockScreen.querySelector('.icon-nav .search .close'); // Corrected selector

  if (searchToggleBtn && searchScreen) {
    const toggleSearch = (open) => {
      if (open) {
        searchScreen.style.opacity = '1';
        searchScreen.style.pointerEvents = 'all';
        searchScreen.style.transform = 'translate(0,0)';
        searchToggleBtn.querySelector('.lens').style.display = 'none';
        searchToggleBtn.querySelector('.close').style.display = 'block';
        document.body.style.overflowY = 'hidden';
        searchScreen.setAttribute('aria-hidden', 'false');
      } else {
        searchScreen.style.opacity = '0';
        searchScreen.style.pointerEvents = 'none';
        searchScreen.style.transform = 'translate(0,0rem)';
        searchToggleBtn.querySelector('.lens').style.display = 'block';
        searchToggleBtn.querySelector('.close').style.display = 'none';
        document.body.style.overflowY = '';
        searchScreen.setAttribute('aria-hidden', 'true');
      }
    };

    searchToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = searchScreen.style.opacity === '1';
      toggleSearch(!isOpen);
    });

    // Use a more robust selector for the close button, assuming it's within the search screen or the search link
    const actualSearchCloseBtn = searchScreen.querySelector('.close') || searchToggleBtn.querySelector('.close');
    if (actualSearchCloseBtn) {
      actualSearchCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSearch(false);
      });
    }

    // Close search on escape key
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && searchScreen.style.opacity === '1') {
        toggleSearch(false);
        searchToggleBtn.focus();
      }
    });

    // Stop propagation for search screen elements
    searchScreen.querySelectorAll('[data-once="search-stop-propagation"]').forEach((el) => {
      el.addEventListener('click', (e) => e.stopPropagation());
      el.addEventListener('keydown', (e) => e.stopPropagation());
    });
  }
}
