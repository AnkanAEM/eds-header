import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Toggles the expanded state of a navigation section.
 * @param {HTMLElement} section The navigation section to toggle.
 * @param {boolean} expanded The desired expanded state (true for expanded, false for collapsed).
 */
function toggleNavSection(section, expanded) {
  if (!section) return;
  section.setAttribute('aria-expanded', expanded);
  const megaMenu = section.querySelector('.mega-menu');
  if (megaMenu) {
    if (!isDesktop.matches) {
      // For mobile, toggle display directly
      megaMenu.style.display = expanded ? 'block' : 'none';
    }
    megaMenu.setAttribute('aria-hidden', !expanded);
  }
}

/**
 * Toggles all navigation sections to a collapsed state, or expands a specific one.
 * @param {HTMLElement} navSections The container for navigation sections.
 * @param {HTMLElement} currentSection The section to potentially expand (only on desktop).
 */
function toggleAllNavSections(navSections, currentSection = null) {
  if (!navSections) return;
  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    const isCurrent = section === currentSection;
    // On desktop, only expand the current section if it's not already expanded
    // On mobile, always collapse others
    const expanded = isCurrent && isDesktop.matches && section.getAttribute('aria-expanded') === 'false';
    toggleNavSection(section, expanded);
  });
}

/**
 * Toggles the main navigation menu for mobile.
 * @param {HTMLElement} nav The main navigation element.
 * @param {HTMLElement} navSections The nav sections container.
 * @param {boolean|null} forceExpanded Optional param to force nav expand behavior.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const newExpandedState = !expanded; // Toggle the state
  const hamburgerButton = nav.closest('.wrap')?.querySelector('.hamburger');

  document.body.style.overflowY = (newExpandedState || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', newExpandedState);
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-label', newExpandedState ? 'Close navigation' : 'Open navigation');
  }

  // Collapse all sub-menus when the main menu is toggled
  toggleAllNavSections(navSections, null);

  // Manage event listeners for accessibility
  if (newExpandedState) { // If menu is now open
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else { // If menu is now closed
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Handles closing navigation on Escape key press.
 * @param {KeyboardEvent} e The keyboard event.
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const navSections = nav.querySelector('.nav-sections');
    const currentlyExpandedSection = navSections?.querySelector('.nav-sections > ul > li.has-child[aria-expanded="true"]');
    const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');

    if (searchScreenWrap) {
      // Close search overlay first
      const searchLi = searchScreenWrap.closest('li.search');
      if (searchLi) {
        searchLi.classList.remove('active');
        searchScreenWrap.style.display = 'none';
        const lensIcon = searchLi.querySelector('.lens');
        const closeIcon = searchLi.querySelector('.close');
        if (lensIcon && closeIcon) {
          lensIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
        searchLi.querySelector('a')?.focus(); // Return focus to search icon
      }
    } else if (currentlyExpandedSection && isDesktop.matches) {
      // Close desktop mega-menu
      toggleNavSection(currentlyExpandedSection, false);
      currentlyExpandedSection.querySelector('a')?.focus(); // Return focus to the parent link
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // Close mobile main menu
      toggleMenu(nav, navSections, false);
      nav.closest('.wrap')?.querySelector('.hamburger')?.focus(); // Return focus to hamburger
    }
  }
}

/**
 * Handles closing navigation when focus is lost.
 * @param {FocusEvent} e The focus event.
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav) return;
  // Check if the focus is still within the navigation or its children
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const currentlyExpandedSection = navSections?.querySelector('.nav-sections > ul > li.has-child[aria-expanded="true"]');
    const searchScreenWrap = nav.querySelector('.search-screen-wrap.active');

    if (searchScreenWrap) {
      // Do nothing, search overlay has its own focus management
    } else if (currentlyExpandedSection && isDesktop.matches) {
      // Close desktop mega-menu
      toggleNavSection(currentlyExpandedSection, false);
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // Close mobile main menu
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Sets up accessibility attributes and event listeners for navigation items.
 * @param {HTMLElement} nav The main navigation element.
 */
function setupAccessibility(nav) {
  if (!nav) return;

  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Setup top-level nav items with children
  navSections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((navSection) => {
    const anchor = navSection.querySelector('a');
    if (anchor) {
      anchor.setAttribute('role', 'button');
      anchor.setAttribute('aria-haspopup', 'true');
      anchor.setAttribute('aria-expanded', 'false');
      // No tabindex="0" needed for anchors as they are naturally focusable
    }

    // Desktop hover/click for top-level
    if (isDesktop.matches) {
      navSection.addEventListener('mouseenter', () => toggleNavSection(navSection, true));
      navSection.addEventListener('mouseleave', () => toggleNavSection(navSection, false));
      // Click handler for desktop to toggle, in case hover is not enough or for keyboard users
      navSection.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigation on click
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleNavSection(navSection, !expanded);
      });
    } else {
      // Mobile click for accordion behavior
      navSection.addEventListener('click', (e) => {
        // Only toggle if the click is on the top-level li or its direct children, not nested sub-menus
        if (e.target.closest('li.has-child') === navSection) {
          e.preventDefault(); // Prevent navigation
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleNavSection(navSection, !expanded);
        }
      });
    }

    // Setup nested sub-child items for mobile accordion
    navSection.querySelectorAll('.mega-menu .has-sub-child').forEach((subChildLi) => {
      const subChildAnchor = subChildLi.querySelector('a');
      if (subChildAnchor) {
        subChildAnchor.setAttribute('role', 'button');
        subChildAnchor.setAttribute('aria-haspopup', 'true');
        // aria-expanded will be managed by the 'active' class
      }

      if (!isDesktop.matches) {
        subChildLi.addEventListener('click', (e) => {
          // Only toggle if the click is on this specific sub-child li or its direct children
          if (e.target.closest('li.has-sub-child') === subChildLi) {
            e.stopPropagation(); // Prevent parent menu from closing
            const isActive = subChildLi.classList.toggle('active');
            const innerSubChild = subChildLi.querySelector('.has-inner-sub-child');
            if (innerSubChild) {
              innerSubChild.classList.toggle('active-child', isActive);
              // For mobile, manage max-height for smooth accordion animation
              innerSubChild.style.maxHeight = isActive ? `${innerSubChild.scrollHeight}px` : '0';
            }
          }
        });
      }
    });
  });

  // Setup search functionality
  const searchLi = nav.querySelector('li.search');
  const searchLink = searchLi?.querySelector('a');
  const searchScreenWrap = searchLi?.querySelector('.search-screen-wrap');
  const lensIcon = searchLink?.querySelector('.lens');
  const closeIcon = searchLink?.querySelector('.close');

  if (searchLink && searchScreenWrap && lensIcon && closeIcon) {
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = searchLi.classList.toggle('active');
      searchScreenWrap.style.display = isActive ? 'block' : 'none';
      lensIcon.style.display = isActive ? 'none' : 'block';
      closeIcon.style.display = isActive ? 'block' : 'none';
      if (isActive) {
        searchScreenWrap.querySelector('#searchInput')?.focus();
      } else {
        searchLink.focus();
      }
    });
  }
}

/**
 * Parses the fragment structure and applies EDS classes.
 * This function now *augments* the existing DOM from the fragment,
 * rather than rebuilding it from scratch.
 * @param {HTMLElement} nav The navigation element.
 */
function parseStructure(nav) {
  if (!nav) return;

  // Identify the main structural elements based on their content
  const brandRow = nav.querySelector('div:has(img)');
  const navSectionsRow = nav.querySelector('div:has(p a.button)'); // Assuming top-level nav items are buttons in P tags
  const toolsRow = nav.querySelector('div:has(ul li a[href*="contact-us"], ul li a[href*="search"])'); // Identify by utility links

  if (brandRow) {
    brandRow.classList.add('nav-brand');
    const brandLink = brandRow.querySelector('a');
    if (brandLink) {
      brandLink.classList.add('logo');
      const img = brandLink.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.alt = img.alt || 'Brand Logo';
        img.title = img.title || 'Brand Logo Image';
      }
    }
  }

  if (navSectionsRow) {
    navSectionsRow.classList.add('nav-sections');
    const ul = navSectionsRow.querySelector('ul'); // Expecting a top-level UL
    if (ul) {
      ul.setAttribute('itemscope', '');
      ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

      Array.from(ul.children).forEach((li) => {
        // Top-level nav item
        li.classList.add('has-child', 'hover-red'); // Assuming all top-level LIs can have children and hover effect
        li.setAttribute('itemprop', 'name');

        const link = li.querySelector('a');
        if (link) {
          link.setAttribute('itemprop', 'url');
        }

        // Add SVG icon for dropdown if not already present
        if (!li.querySelector('span svg')) {
          const svgSpan = document.createElement('span');
          svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          li.append(svgSpan);
        }

        const megaMenu = li.querySelector('div'); // Assuming the mega-menu content is a direct div child of the LI
        if (megaMenu) {
          megaMenu.classList.add('mega-menu');
          megaMenu.setAttribute('aria-hidden', 'true');

          const wrapContainer = megaMenu.querySelector('div.wrap.container') || document.createElement('div');
          if (!wrapContainer.classList.contains('wrap')) wrapContainer.classList.add('wrap', 'container');

          const centerDiv = wrapContainer.querySelector('div.center-div') || document.createElement('div');
          if (!centerDiv.classList.contains('center-div')) centerDiv.classList.add('center-div');

          // Move existing content into centerDiv if not already there
          if (!centerDiv.contains(megaMenu.firstElementChild) && megaMenu.firstElementChild !== wrapContainer) {
            Array.from(megaMenu.children).forEach(child => centerDiv.append(child));
          }

          // Ensure wrapContainer and centerDiv are correctly nested
          if (!wrapContainer.contains(centerDiv)) wrapContainer.append(centerDiv);
          if (!megaMenu.contains(wrapContainer)) megaMenu.append(wrapContainer);

          const subNavWrap = centerDiv.querySelector('div.sub-nav-wrap') || document.createElement('div');
          if (!subNavWrap.classList.contains('sub-nav-wrap')) subNavWrap.classList.add('sub-nav-wrap');

          // Identify and classify left-div content
          const leftDiv = centerDiv.querySelector('div:not(.sub-nav-wrap)');
          if (leftDiv) {
            leftDiv.classList.add('left-div');
            // Add specific classes based on content, if needed (e.g., 'newsroom-left-div')
            if (leftDiv.textContent.toLowerCase().includes('newsroom')) {
              leftDiv.classList.add('newsroom-left-div');
            } else if (leftDiv.textContent.toLowerCase().includes('careers')) {
              leftDiv.classList.add('career-left-div');
            } else if (leftDiv.textContent.toLowerCase().includes('investor relations')) {
              leftDiv.classList.add('ir-left-div');
            }

            const h4 = leftDiv.querySelector('h4');
            if (h4) h4.classList.add('left-div-heading');
            const pDesc = leftDiv.querySelector('p:first-of-type');
            if (pDesc) pDesc.classList.add('left-div-desc');
            const pSubDesc = leftDiv.querySelector('p:nth-of-type(2)');
            if (pSubDesc) pSubDesc.classList.add('left-div-subdesc');

            leftDiv.querySelectorAll('ul li').forEach(listItem => {
              if (listItem.textContent.includes('Industries') || listItem.textContent.includes('Consolidated ROE')) {
                listItem.classList.add('list-text-red');
              }
            });

            // Handle newsroom specific content (e.g., latest-two-press-release)
            const newsroomContent = leftDiv.querySelector('.slides'); // Assuming this structure comes from fragment
            if (newsroomContent) {
              const latestTwoPressRelease = document.createElement('div');
              latestTwoPressRelease.classList.add('latest-two-press-release');
              Array.from(leftDiv.querySelectorAll('.slides')).forEach(slide => latestTwoPressRelease.append(slide));
              leftDiv.append(latestTwoPressRelease);
            }
          }

          // Process nested ULs within subNavWrap
          Array.from(centerDiv.querySelectorAll('ul')).forEach((nestedUl, index) => {
            // If it's the first UL and it's not already in subNavWrap, move it
            if (index === 0 && !subNavWrap.contains(nestedUl)) {
              subNavWrap.append(nestedUl);
            } else if (index > 0 && !subNavWrap.contains(nestedUl)) {
              // For subsequent ULs, wrap them in a div if they are part of a multi-column layout
              const innerSubNavWrapList = centerDiv.querySelector('.inner-sub-nav-wrap-list') || document.createElement('div');
              if (!innerSubNavWrapList.classList.contains('inner-sub-nav-wrap-list')) {
                innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
                subNavWrap.append(innerSubNavWrapList);
              }
              innerSubNavWrapList.append(nestedUl);
            }

            // Apply classes to nested LIs and add SVG for sub-children
            Array.from(nestedUl.children).forEach(nestedLi => {
              const nestedLink = nestedLi.querySelector('a');
              if (nestedLink && nestedLink.textContent.toLowerCase() === 'industries') {
                nestedLi.classList.add('top-level-li');
                subNavWrap.classList.add('what-we-do'); // Specific class for "What we do" mega-menu
              } else if (nestedLink && nestedLink.textContent.toLowerCase() === 'leadership programs') {
                nestedLi.classList.add('top-level-li');
                subNavWrap.classList.add('careers-div'); // Specific class for "Careers" mega-menu
              } else if (nestedLink && nestedLink.textContent.toLowerCase() === 'disclosures under regulation 46 and 62 of sebi (lodr)') {
                nestedUl.classList.add('sub-nav-wrap-one-link');
                subNavWrap.classList.add('element-block');
              } else if (nestedLi.closest('.inner-sub-nav-wrap-list')) {
                // These are the second level of lists in IR
              } else {
                nestedLi.classList.add('level-0-li'); // Default level for direct children of sub-nav-wrap UL
              }

              const innerUl = nestedLi.querySelector('ul');
              if (innerUl) {
                nestedLi.classList.add('has-sub-child');
                if (!nestedLi.querySelector('span svg')) { // Add SVG if not present
                  const nestedSvgSpan = document.createElement('span');
                  nestedSvgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
                  nestedLi.append(nestedSvgSpan);
                }

                const innerSubChildDiv = document.createElement('div');
                innerSubChildDiv.classList.add('has-inner-sub-child');
                innerSubChildDiv.append(innerUl);
                nestedLi.append(innerSubChildDiv);

                // Apply first-level-li to children of innerUl
                Array.from(innerUl.children).forEach(grandChildLi => {
                  grandChildLi.classList.add('first-level-li');
                  const grandChildUl = grandChildLi.querySelector('ul');
                  if (grandChildUl) {
                    grandChildLi.classList.add('has-sub-child');
                    if (!grandChildLi.querySelector('span svg')) {
                      const grandChildSvgSpan = document.createElement('span');
                      grandChildSvgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
                      grandChildLi.append(grandChildSvgSpan);
                    }
                    const grandChildInnerDiv = document.createElement('div');
                    grandChildInnerDiv.classList.add('has-inner-sub-child');
                    grandChildInnerDiv.append(grandChildUl);
                    grandChildLi.append(grandChildInnerDiv);
                  }
                });
              }
            });
          });
          // Ensure subNavWrap is appended to centerDiv
          if (!centerDiv.contains(subNavWrap)) centerDiv.append(subNavWrap);
        }
      });
    }
  }

  if (toolsRow) {
    toolsRow.classList.add('nav-tools');
    const mobileIcons = document.createElement('div');
    mobileIcons.classList.add('icon-nav', 'mobile-menus-icon');
    const desktopIcons = document.createElement('div');
    desktopIcons.classList.add('icon-nav', 'desktop-menus-icon');

    const ulElements = Array.from(toolsRow.querySelectorAll('ul'));
    if (ulElements.length > 0) {
      // Assuming the first UL is social and the second is utility based on original HTML
      const utilityUl = ulElements[1] || ulElements[0]; // Fallback if only one UL

      if (utilityUl) {
        const processUtilityList = (list, isMobile) => {
          const newUl = document.createElement('ul');
          Array.from(list.children).forEach(li => {
            const link = li.querySelector('a');
            if (link) {
              const newLi = document.createElement('li');
              const newLink = document.createElement('a');
              newLink.href = link.href;
              newLink.textContent = link.textContent; // Keep original text content

              if (link.textContent.toLowerCase() === 'contact us') {
                newLi.classList.add('mail');
                newLink.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>${isMobile ? ` ${link.textContent}` : ''}`;
              } else if (link.textContent.toLowerCase() === 'search') {
                newLi.classList.add('search');
                newLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>${isMobile ? ` ${link.textContent}` : ''}`;

                // Create search screen wrap from fragment content
                const fragmentSearchWrap = li.querySelector('.search-screen-wrap');
                if (fragmentSearchWrap) {
                  newLi.append(fragmentSearchWrap.cloneNode(true)); // Clone to avoid moving it
                }
              }

              newLi.append(newLink);
              newUl.append(newLi);
            }
          });
          return newUl;
        };

        mobileIcons.append(processUtilityList(utilityUl.cloneNode(true), true));
        desktopIcons.append(processUtilityList(utilityUl.cloneNode(true), false));
      }
    }
    toolsRow.replaceChildren(mobileIcons, desktopIcons);
  }

  // Handle the 80th year logo if it exists in the fragment
  const year80LogoDiv = nav.querySelector('div.logo.year-80-logo');
  if (year80LogoDiv) {
    // Ensure it has the correct classes and content
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const img = year80LogoDiv.querySelector('img');
    if (img) {
      img.classList.add('hiddenlogo1', 'years-80');
      img.alt = img.alt || '80th Year Logo Gold';
      img.title = img.title || '80thYearLogo_Gold';
    }
  }
}

/**
 * Decorates the header block.
 * @param {HTMLElement} block The header block element.
 */
export default async function decorate(block) {
  block.classList.add('main-header', 'solid', 'nav-up');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.textContent = 'Navigation fragment not found.';
    return;
  }

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  // Parse the structure and apply initial classes
  parseStructure(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  // Append brand, sections, and tools to wrapDiv in the correct order
  const navBrand = nav.querySelector('.nav-brand');
  const navSections = nav.querySelector('.nav-sections');
  const navTools = nav.querySelector('.nav-tools');
  const year80Logo = nav.querySelector('.logo.year-80-logo');

  if (navBrand) wrapDiv.append(navBrand);

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  wrapDiv.append(hamburger);

  if (navSections) wrapDiv.append(navSections);
  if (navTools) wrapDiv.append(navTools);
  if (year80Logo) wrapDiv.append(year80Logo);

  navWrapper.append(wrapDiv);
  block.append(navWrapper);

  // Late-binding state and event listeners
  setupAccessibility(nav);
  // Initialize menu state based on desktop/mobile
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
}
