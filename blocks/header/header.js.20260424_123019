import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Replaced the ul/li hamburger with a more semantic SVG icon
const HAMBURGER_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 18H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Creates a hamburger button element.
 * @param {string} label The accessibility label for the button.
 * @returns {HTMLButtonElement} The hamburger button.
 */
function createHamburgerButton(label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'nav');
  button.setAttribute('aria-label', label);
  button.innerHTML = HAMBURGER_SVG; // Use SVG for hamburger
  return button;
}

/**
 * Toggles the expanded state of a navigation section.
 * @param {HTMLElement} section The navigation section element (li.has-child).
 * @param {boolean} expanded The desired expanded state.
 */
function toggleNavSection(section, expanded) {
  if (!section) return;

  section.setAttribute('aria-expanded', expanded);
  const megaMenu = section.querySelector('.mega-menu');
  const chevron = section.querySelector('.has-child > span svg');

  if (megaMenu) {
    if (isDesktop.matches) {
      megaMenu.style.display = expanded ? 'block' : 'none';
      megaMenu.style.opacity = expanded ? '1' : '0';
      megaMenu.style.pointerEvents = expanded ? 'all' : 'none';
    } else {
      // Mobile accordion effect
      megaMenu.style.maxHeight = expanded ? `${megaMenu.scrollHeight}px` : '0';
      megaMenu.style.opacity = expanded ? '1' : '0';
      megaMenu.style.display = 'block'; // Ensure it's block for scrollHeight calculation
      megaMenu.style.pointerEvents = expanded ? 'all' : 'none';
    }
  }

  if (chevron && !isDesktop.matches) {
    chevron.style.transform = expanded ? 'rotate(-180deg)' : 'rotate(90deg)';
  } else if (chevron && isDesktop.matches) {
    chevron.style.transform = ''; // Reset for desktop
  }
}

/**
 * Toggles the expanded state of all main navigation sections.
 * @param {HTMLElement} navSections The container for navigation sections (ul).
 * @param {boolean} expanded The desired expanded state.
 */
function toggleAllNavSections(navSections, expanded = false) {
  if (!navSections) return;
  navSections.querySelectorAll('.main-nav > ul > li.has-child').forEach((section) => {
    toggleNavSection(section, expanded);
  });
}

/**
 * Closes the navigation menu on escape key press.
 * @param {KeyboardEvent} e The keyboard event.
 * @param {HTMLElement} nav The navigation element.
 * @param {HTMLElement} navSections The navigation sections element.
 */
function closeOnEscape(e, nav, navSections) {
  if (!nav || !navSections) return;
  if (e.code === 'Escape') {
    const navSectionExpanded = navSections.querySelector('li.has-child[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleNavSection(navSectionExpanded, false);
      navSectionExpanded.querySelector('a').focus(); // Return focus to the main link
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, navSections, false);
      nav.querySelector('.hamburger button').focus(); // Return focus to hamburger
    }
  }
}

/**
 * Closes the navigation menu when focus is lost.
 * @param {FocusEvent} e The focus event.
 * @param {HTMLElement} nav The navigation element.
 * @param {HTMLElement} navSections The navigation sections element.
 */
function closeOnFocusLost(e, nav, navSections) {
  if (!nav || !navSections) return;
  // Check if the new focus target is outside the entire nav
  if (!nav.contains(e.relatedTarget)) {
    const navSectionExpanded = navSections.querySelector('li.has-child[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleNavSection(navSectionExpanded, false);
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Toggles the entire navigation menu (primarily for mobile).
 * @param {HTMLElement} nav The navigation element.
 * @param {HTMLElement} navSections The navigation sections element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true'); // Toggle the main nav state
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // Collapse all sub-sections when main nav is toggled
  toggleAllNavSections(navSections, false);

  // Add/remove global listeners for escape/focusout
  if (expanded) {
    window.removeEventListener('keydown', (e) => closeOnEscape(e, nav, navSections));
    nav.removeEventListener('focusout', (e) => closeOnFocusLost(e, nav, navSections));
  } else {
    window.addEventListener('keydown', (e) => closeOnEscape(e, nav, navSections));
    nav.addEventListener('focusout', (e) => closeOnFocusLost(e, nav, navSections));
  }
}

/**
 * Parses the fragment structure, identifies rows, and applies top-level wrappers.
 * @param {HTMLElement} fragment The loaded fragment HTML.
 * @returns {Object} An object containing the brand, nav, and tools sections.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandRow = sections.find((section) => section.querySelector('img'));
  const navRow = sections.find((section) => section.querySelector('p > a.button') || section.querySelector('ul'));
  const toolsRow = sections.find((section) => section !== brandRow && section !== navRow);

  return { brandRow, navRow, toolsRow };
}

/**
 * Sets up the desktop navigation behavior (hover, mega-menu).
 * @param {HTMLElement} nav The navigation element.
 */
function setupDesktopNav(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((navSection) => {
    navSection.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        toggleAllNavSections(navSections, false); // Close all others
        toggleNavSection(navSection, true);
      }
    });
    navSection.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        toggleNavSection(navSection, false);
      }
    });
  });

  // Close all menus if clicking outside nav
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      toggleAllNavSections(navSections, false);
    }
  });
}

/**
 * Sets up the mobile navigation behavior (hamburger, accordion).
 * @param {HTMLElement} nav The navigation element.
 */
function setupMobileNav(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  // Hamburger button
  const hamburgerWrapper = nav.querySelector('.hamburger');
  if (hamburgerWrapper) {
    const button = hamburgerWrapper.querySelector('button');
    if (button) {
      button.addEventListener('click', () => toggleMenu(nav, navSections));
    }
  }

  // Accordion for main nav items
  navSections.querySelectorAll('li.has-child > a').forEach((link) => {
    const parentLi = link.closest('li.has-child');
    if (parentLi) {
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const expanded = parentLi.getAttribute('aria-expanded') === 'true';
          toggleNavSection(parentLi, !expanded);
        }
      });
      // Also allow chevron to toggle on mobile
      const chevronSpan = parentLi.querySelector(':scope > span');
      if (chevronSpan) {
        chevronSpan.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            const expanded = parentLi.getAttribute('aria-expanded') === 'true';
            toggleNavSection(parentLi, !expanded);
          }
        });
      }
    }
  });

  // Accordion for nested nav items (top-level-li)
  navSections.querySelectorAll('.mega-menu ul li.top-level-li').forEach((topLevelLi) => {
    const nestedLink = topLevelLi.querySelector(':scope > a');
    const nestedChevron = topLevelLi.querySelector(':scope > span');
    const hasSubChild = topLevelLi.querySelector(':scope > .has-sub-child');

    if (nestedLink && nestedChevron && hasSubChild) {
      const toggleNested = (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          e.stopPropagation(); // Prevent parent accordion from closing
          const expanded = hasSubChild.style.maxHeight !== '0px'; // Check current state
          hasSubChild.style.maxHeight = expanded ? '0' : `${hasSubChild.scrollHeight}px`;
          hasSubChild.style.opacity = expanded ? '0' : '1';
          nestedChevron.querySelector('svg').style.transform = expanded ? 'rotate(90deg)' : 'rotate(-180deg)';
        }
      };
      nestedLink.addEventListener('click', toggleNested);
      nestedChevron.addEventListener('click', toggleNested);
    }

    // Handle inner sub-children (first-level-li)
    topLevelLi.querySelectorAll('.has-sub-child > ul > li.first-level-li').forEach((firstLevelLi) => {
      const innerNestedLink = firstLevelLi.querySelector(':scope > a');
      const innerNestedChevron = firstLevelLi.querySelector(':scope > span');
      const hasInnerSubChild = firstLevelLi.querySelector(':scope > .has-inner-sub-child');

      if (innerNestedLink && innerNestedChevron && hasInnerSubChild) {
        const toggleInnerNested = (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            e.stopPropagation();
            const expanded = hasInnerSubChild.style.maxHeight !== '0px';
            hasInnerSubChild.style.maxHeight = expanded ? '0' : `${hasInnerSubChild.scrollHeight}px`;
            hasInnerSubChild.style.opacity = expanded ? '0' : '1';
            innerNestedChevron.querySelector('svg').style.transform = expanded ? 'rotate(90deg)' : 'rotate(-180deg)';
          }
        };
        innerNestedLink.addEventListener('click', toggleInnerNested);
        innerNestedChevron.addEventListener('click', toggleInnerNested);
      }
    });
  });
}

/**
 * Manages accessibility attributes for navigation elements.
 * @param {HTMLElement} nav The navigation element.
 */
function setupAccessibility(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((navSection) => {
    const link = navSection.querySelector(':scope > a');
    if (link) {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('tabindex', '0'); // Make main nav items focusable
    }
  });

  // Add keydown listener for desktop dropdowns
  if (isDesktop.matches) {
    navSections.querySelectorAll('li.has-child > a').forEach((link) => {
      link.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          const parentLi = link.closest('li.has-child');
          const expanded = parentLi.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections, false); // Close all others
          toggleNavSection(parentLi, !expanded);
        }
      });
    });
  }
}

/**
 * Sets up the search toggle functionality.
 * @param {HTMLElement} searchLi The list item containing the search link and screen.
 */
function setupSearchToggle(searchLi) {
  const searchLink = searchLi.querySelector('a');
  const searchScreen = searchLi.querySelector('.search-screen-wrap');
  if (searchLink && searchScreen) {
    const lensIcon = searchLink.querySelector('.lens');
    const closeIcon = searchLink.querySelector('.close');
    const searchSpan = searchLink.querySelector('span'); // Only for mobile search text

    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent document click from immediately closing
      const isSearchOpen = searchScreen.style.opacity === '1';
      searchScreen.style.opacity = isSearchOpen ? '0' : '1';
      searchScreen.style.pointerEvents = isSearchOpen ? 'none' : 'all';

      if (lensIcon) lensIcon.style.display = isSearchOpen ? 'block' : 'none';
      if (closeIcon) closeIcon.style.display = isSearchOpen ? 'none' : 'block';
      if (searchSpan) searchSpan.style.display = isSearchOpen ? 'block' : 'none';
    });

    // Close search if clicking outside search screen
    document.addEventListener('click', (e) => {
      if (!searchLi.contains(e.target) && searchScreen.style.opacity === '1') {
        searchScreen.style.opacity = '0';
        searchScreen.style.pointerEvents = 'none';
        if (lensIcon) lensIcon.style.display = 'block';
        if (closeIcon) closeIcon.style.display = 'none';
        if (searchSpan) searchSpan.style.display = 'block';
      }
    });
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.remove();
    return;
  }

  // Create main header container
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // --- 1. Brand Row ---
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('img');

    if (brandLink && brandImg) {
      const newBrandLink = brandLink.cloneNode(true);
      newBrandLink.innerHTML = ''; // Clear original content
      newBrandLink.append(brandImg.cloneNode(true));
      logoDiv.append(newBrandLink);
      wrap.append(logoDiv);
    }
  }

  // --- Hamburger for Mobile ---
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburgerDiv.append(createHamburgerButton('Open navigation'));
  wrap.append(hamburgerDiv);

  // --- 2. Nav Row ---
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  if (navRow) {
    let currentLeftDivContent = document.createDocumentFragment();
    let currentMainLink = null;

    Array.from(navRow.children).forEach((child) => {
      // Collect content for left-div until a UL is found
      if (child.tagName !== 'UL' && !currentMainLink) {
        currentLeftDivContent.append(child.cloneNode(true));
      } else if (child.tagName === 'P' && child.querySelector('a.button')) {
        // This is a main nav item title
        currentMainLink = child.querySelector('a.button').cloneNode(true);
        currentMainLink.classList.remove('button'); // Remove default button class
      } else if (child.tagName === 'UL' && currentMainLink) {
        // This UL is the mega-menu content for the currentMainLink
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red');
        li.setAttribute('itemprop', 'name');
        li.setAttribute('data-once', 'nav-close-search');

        li.append(currentMainLink);

        const chevronSpan = document.createElement('span');
        chevronSpan.innerHTML = CHEVRON_SVG;
        li.append(chevronSpan);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        megaMenu.style.display = 'none'; // Hidden by default
        megaMenu.style.opacity = '0';
        megaMenu.style.pointerEvents = 'none';

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        // Inject buffered content into a left-div if available
        if (currentLeftDivContent.hasChildNodes()) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          // Copy any classes from the original left-div if it exists in the fragment
          const originalLeftDiv = navRow.querySelector('.left-div');
          if (originalLeftDiv) {
            leftDiv.classList.add(...originalLeftDiv.classList);
          }
          leftDiv.append(currentLeftDivContent);
          centerDiv.append(leftDiv);
          currentLeftDivContent = document.createDocumentFragment(); // Clear buffer
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        // Copy any classes from the original sub-nav-wrap if it exists in the fragment
        const originalSubNavWrap = navRow.querySelector('.sub-nav-wrap');
        if (originalSubNavWrap) {
          subNavWrap.classList.add(...originalSubNavWrap.classList);
        }
        centerDiv.append(subNavWrap);

        // Recursive function to process nested ULs
        const processNestedUl = (ulElement, parentContainer) => {
          Array.from(ulElement.children).forEach((liElement) => {
            const newLi = document.createElement('li');
            // Copy classes from original li
            newLi.classList.add(...liElement.classList);

            const anchor = liElement.querySelector(':scope > a');
            const nestedUl = liElement.querySelector(':scope > ul');

            if (anchor) {
              newLi.append(anchor.cloneNode(true));
            } else if (liElement.textContent.trim()) {
              // Handle text content directly if no anchor (e.g., "Technology Services")
              const spanText = document.createElement('span');
              spanText.textContent = liElement.textContent.trim();
              newLi.append(spanText);
            }

            if (nestedUl) {
              const nestedChevronSpan = document.createElement('span');
              nestedChevronSpan.innerHTML = CHEVRON_SVG;
              newLi.append(nestedChevronSpan);

              const hasSubChildDiv = document.createElement('div');
              hasSubChildDiv.classList.add('has-sub-child');
              hasSubChildDiv.style.maxHeight = '0'; // For mobile accordion
              hasSubChildDiv.style.opacity = '0'; // For mobile accordion
              // Copy classes from original has-sub-child if present
              const originalHasSubChild = liElement.querySelector(':scope > .has-sub-child');
              if (originalHasSubChild) {
                hasSubChildDiv.classList.add(...originalHasSubChild.classList);
              }

              const innerUl = document.createElement('ul');
              processInnerNestedUl(nestedUl, innerUl); // Process inner nested ULs
              hasSubChildDiv.append(innerUl);
              newLi.append(hasSubChildDiv);
            }
            parentContainer.append(newLi);
          });
        };

        const processInnerNestedUl = (ulElement, parentContainer) => {
          Array.from(ulElement.children).forEach((liElement) => {
            const newLi = document.createElement('li');
            newLi.classList.add(...liElement.classList); // Copy classes

            const anchor = liElement.querySelector(':scope > a');
            const nestedUl = liElement.querySelector(':scope > ul');

            if (anchor) {
              newLi.append(anchor.cloneNode(true));
            } else if (liElement.textContent.trim()) {
              const spanText = document.createElement('span');
              spanText.textContent = liElement.textContent.trim();
              newLi.append(spanText);
            }

            if (nestedUl) {
              const nestedChevronSpan = document.createElement('span');
              nestedChevronSpan.innerHTML = CHEVRON_SVG;
              newLi.append(nestedChevronSpan);

              const hasInnerSubChildDiv = document.createElement('div');
              hasInnerSubChildDiv.classList.add('has-inner-sub-child');
              hasInnerSubChildDiv.style.maxHeight = '0'; // For mobile accordion
              hasInnerSubChildDiv.style.opacity = '0'; // For mobile accordion
              // Copy classes from original has-inner-sub-child if present
              const originalHasInnerSubChild = liElement.querySelector(':scope > .has-inner-sub-child');
              if (originalHasInnerSubChild) {
                hasInnerSubChildDiv.classList.add(...originalHasInnerSubChild.classList);
              }

              const innerUl = document.createElement('ul');
              Array.from(nestedUl.children).forEach((innerLi) => {
                innerUl.append(innerLi.cloneNode(true));
              });
              hasInnerSubChildDiv.append(innerUl);
              newLi.append(hasInnerSubChildDiv);
            }
            parentContainer.append(newLi);
          });
        };

        // If the UL has multiple direct UL children (like in 'Who We Are'), create multiple sub-nav-wrap uls
        const directUls = Array.from(child.children).filter(el => el.tagName === 'UL');
        if (directUls.length > 0) {
          directUls.forEach(directUl => {
            const newUl = document.createElement('ul');
            processNestedUl(directUl, newUl);
            subNavWrap.append(newUl);
          });
        } else {
          const newUl = document.createElement('ul');
          processNestedUl(child, newUl);
          subNavWrap.append(newUl);
        }

        li.append(megaMenu);
        navUl.append(li);
        currentMainLink = null; // Reset for next button/ul pair
      } else {
        // Buffer content that's not a main link or its direct UL
        currentLeftDivContent.append(child.cloneNode(true));
      }
    });
  }
  nav.append(navUl);

  // --- 3. Tools Row ---
  if (toolsRow) {
    const mobileIconNav = document.createElement('div');
    mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

    const mobileUl = document.createElement('ul');
    const desktopUl = document.createElement('ul');

    const toolsChildren = Array.from(toolsRow.children);
    toolsChildren.forEach((child) => {
      if (child.tagName === 'UL') {
        Array.from(child.children).forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const newLiMobile = document.createElement('li');
            const newLiDesktop = document.createElement('li');
            newLiMobile.classList.add(...li.classList); // Copy classes
            newLiDesktop.classList.add(...li.classList); // Copy classes

            if (link.textContent.toLowerCase() === 'contact us') {
              newLiMobile.append(link.cloneNode(true));
              newLiMobile.querySelector('a').textContent = 'Contact Us'; // Ensure text for mobile
              newLiDesktop.innerHTML = link.outerHTML; // Keep original SVG structure for desktop
            } else if (link.textContent.toLowerCase() === 'search') {
              // Mobile search structure
              const mobileSearchLink = document.createElement('a');
              mobileSearchLink.href = '#';
              mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
              mobileSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>
              <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>
              <span data-once="search-stop-propagation">${link.textContent}</span>`;
              newLiMobile.append(mobileSearchLink);

              // Desktop search structure
              const desktopSearchLink = document.createElement('a');
              desktopSearchLink.href = '#';
              desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
              desktopSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>
              <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>`;
              newLiDesktop.append(desktopSearchLink);

              // Add search screen wrap content (same for mobile/desktop)
              const searchScreenWrap = document.createElement('div');
              searchScreenWrap.classList.add('search-screen-wrap');
              searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
              // CRITICAL REJECTION: Hardcoded search form action and keywords
              searchScreenWrap.innerHTML = `
                <div class="wrap" data-once="search-stop-propagation">
                  <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
                    <div class="search-wrap" data-once="search-stop-propagation">
                      <div class="search-icon" data-once="search-stop-propagation">
                        <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>
                      </div>
                      <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation">
                      <button class="submit-button" data-once="search-stop-propagation">
                        <div class="label" data-once="search-stop-propagation"> Submit </div>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>
                      </button>
                    </div>
                    <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
                      <div class="swiper scrollSwiper" data-once="search-stop-propagation">
                        <div class="swiper-wrapper" data-once="search-stop-propagation">
                          <div class="swiper-slide" data-once="search-stop-propagation"></div>
                        </div>
                      </div>
                      <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
                    </div>
                  </form>
                  <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                    <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
                    <div class="tokens-wrap" data-once="search-stop-propagation">
                      <ul data-once="search-stop-propagation">
                        <li data-once="search-stop-propagation">Business</li>
                        <li data-once="search-stop-propagation">FY 21</li>
                        <li data-once="search-stop-propagation">Brands</li>
                        <li data-once="search-stop-propagation">XUV700</li>
                        <li data-once="search-stop-propagation">Global</li>
                        <li data-once="search-stop-propagation">Nanhi Kali</li>
                      </ul>
                    </div>
                  </div>
                  <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                    <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
                    <div class="tokens-wrap" data-once="search-stop-propagation">
                      <ul data-once="search-stop-propagation">
                        <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
                        <li data-once="search-stop-propagation">Leadership Announcement</li>
                        <li data-once="search-stop-propagation">Latest Press Release</li>
                        <li data-once="search-stop-propagation">Brand Guidelines</li>
                      </ul>
                    </div>
                  </div>
                </div>
              `;
              newLiMobile.append(searchScreenWrap.cloneNode(true));
              newLiDesktop.append(searchScreenWrap.cloneNode(true));

              setupSearchToggle(newLiMobile);
              setupSearchToggle(newLiDesktop);
            } else {
              // Social icons (desktop only, as per original HTML)
              newLiDesktop.append(link.cloneNode(true));
            }
            if (newLiMobile.hasChildNodes()) mobileUl.append(newLiMobile);
            if (newLiDesktop.hasChildNodes()) desktopUl.append(newLiDesktop);
          }
        });
      }
    });

    if (mobileUl.hasChildNodes()) mobileIconNav.append(mobileUl);
    if (desktopUl.hasChildNodes()) desktopIconNav.append(desktopUl);

    if (mobileIconNav.hasChildNodes()) navUl.append(mobileIconNav); // Mobile tools inside nav ul
    if (desktopIconNav.hasChildNodes()) nav.append(desktopIconNav); // Desktop tools directly in nav
  }

  wrap.append(nav);

  // --- 80th Year Logo (if present in original HTML, it's outside main nav) ---
  const year80Logo = fragment.querySelector('.year-80-logo');
  if (year80Logo) {
    wrap.append(year80Logo.cloneNode(true));
  }

  block.append(header);

  // Late-binding state and event listeners
  const navSections = nav.querySelector('.main-nav > ul');
  // Initialize menu state based on desktop or mobile
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav);
}
