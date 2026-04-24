import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Closes all expanded navigation sections and the mobile menu.
 * @param {Element} nav The <nav> element.
 */
function closeAllNav(nav) {
  nav.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
  nav.querySelectorAll('.main-nav .has-child[aria-expanded="true"]').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = 'none';
    }
  });
  nav.querySelectorAll('.has-sub-child[aria-expanded="true"]').forEach((subChild) => {
    subChild.setAttribute('aria-expanded', 'false');
    subChild.style.display = 'none';
  });
  nav.querySelectorAll('.has-inner-sub-child[aria-expanded="true"]').forEach((innerSubChild) => {
    innerSubChild.setAttribute('aria-expanded', 'false');
    innerSubChild.style.display = 'none';
  });

  const searchToggle = nav.querySelector('.icon-nav .search > a');
  const searchScreen = nav.querySelector('.search-screen-wrap');
  if (searchScreen && searchScreen.classList.contains('active')) {
    searchScreen.classList.remove('active');
    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
    }
  }
}

/**
 * Handles keyboard accessibility for navigation.
 * @param {KeyboardEvent} e The keyboard event.
 */
function handleNavKeydown(e) {
  const nav = e.currentTarget.closest('nav');
  if (e.code === 'Escape') {
    closeAllNav(nav);
  } else if (e.code === 'Enter' || e.code === 'Space') {
    const target = e.target;
    if (target.closest('.has-child') || target.closest('.top-level-li') || target.closest('.first-level-li')) {
      e.preventDefault();
      target.click(); // Simulate click to toggle expansion
    }
  }
}

/**
 * Toggles the expanded state of a navigation section.
 * @param {HTMLElement} element The element to toggle.
 * @param {boolean} forceExpanded Optional boolean to force expanded state.
 */
function toggleSectionExpanded(element, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

/**
 * Parses the brand section from the fragment.
 * @param {Element} navWrapper The main nav wrapper.
 * @param {Element} fragmentChild The fragment div containing the brand.
 */
function parseBrandSection(navWrapper, fragmentChild) {
  const logoDiv = fragmentChild.querySelector('.logo');
  if (logoDiv) {
    navWrapper.append(logoDiv);
  }
}

/**
 * Parses the navigation sections from the fragment.
 * @param {Element} navWrapper The main nav wrapper.
 * @param {Array<Element>} navSectionChildren The fragment divs containing nav items.
 */
function parseNavSections(navWrapper, navSectionChildren) {
  const navSectionsDiv = document.createElement('div');
  navSectionsDiv.classList.add('main-nav');

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  navSectionChildren.forEach((sectionDiv) => {
    const mainLink = sectionDiv.querySelector('p > a');
    const megaMenuContent = sectionDiv.querySelector('ul'); // The main UL for the mega menu

    if (mainLink && megaMenuContent) {
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');

      const link = document.createElement('a');
      link.href = mainLink.href;
      link.textContent = mainLink.textContent;
      link.setAttribute('itemprop', 'url');
      li.append(link);

      // Extract SVG icon from the fragment's original structure
      const originalSvgSpan = sectionDiv.querySelector('p > span');
      if (originalSvgSpan) {
        li.append(originalSvgSpan.cloneNode(true));
      }

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Extract left-div content (paragraphs/divs before the main UL)
      const leftDivContent = Array.from(sectionDiv.children).filter(
        (child) => child.tagName !== 'P' && child.tagName !== 'UL',
      );
      if (leftDivContent.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        leftDivContent.forEach((content) => leftDiv.append(content.cloneNode(true)));
        centerDiv.append(leftDiv);
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      subNavWrap.append(megaMenuContent); // Append the main UL from the fragment

      // Apply specific classes based on the original HTML's structure and content
      if (mainLink.href.includes('about-us')) {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (mainLink.href.includes('our-business')) {
        subNavWrap.classList.add('what-we-do');
      } else if (mainLink.href.includes('investor-relations')) {
        subNavWrap.classList.add('element-block');
        const irLeftDiv = centerDiv.querySelector('.left-div');
        if (irLeftDiv) irLeftDiv.classList.add('ir-left-div');

        // Reconstruct inner-sub-nav-wrap-list if present in the fragment
        const irUl = subNavWrap.querySelector('ul');
        if (irUl) {
          const firstLi = irUl.querySelector('li:first-child');
          if (firstLi && firstLi.textContent.includes('Disclosures Under Regulation')) {
            const singleLinkUl = document.createElement('ul');
            singleLinkUl.classList.add('sub-nav-wrap-one-link');
            singleLinkUl.append(firstLi);

            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

            const remainingLIs = Array.from(irUl.children).slice(1); // Get remaining LIs
            const ul1 = document.createElement('ul');
            const ul2 = document.createElement('ul');

            // Distribute remaining LIs into two Uls (as per original HTML)
            remainingLIs.forEach((item, idx) => {
              if (idx < Math.ceil(remainingLIs.length / 2)) { // Roughly half
                ul1.append(item);
              } else {
                ul2.append(item);
              }
            });
            innerSubNavWrapList.append(ul1, ul2);

            // Clear original UL and append new structure
            irUl.innerHTML = '';
            irUl.append(singleLinkUl, innerSubNavWrapList);
          }
        }
      } else if (mainLink.href.includes('newsroom')) {
        const newsLeftDiv = centerDiv.querySelector('.left-div');
        if (newsLeftDiv) newsLeftDiv.classList.add('newsroom-left-div');
        // The "latest-two-press-release" content is dynamic and not part of the fragment
        // It should be loaded as a separate block or handled by a different mechanism.
        // As per rule 1: "If the fragment is missing a section (e.g., search), do NOT invent it."
        // We will only include what's in the fragment.
      } else if (mainLink.href.includes('career')) {
        const careerLeftDiv = centerDiv.querySelector('.left-div');
        if (careerLeftDiv) careerLeftDiv.classList.add('career-left-div');
        subNavWrap.classList.add('careers-div');
      }

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
      navUl.append(li);
    }
  });
  navSectionsDiv.append(navUl);
  navWrapper.append(navSectionsDiv);
}

/**
 * Parses the tools section from the fragment.
 * @param {Element} navWrapper The main nav wrapper.
 * @param {Element} mobileToolsDiv The fragment div for mobile tools.
 * @param {Element} desktopToolsDiv The fragment div for desktop tools.
 */
function parseToolsSection(navWrapper, mobileToolsDiv, desktopToolsDiv) {
  const toolsSection = document.createElement('div');
  toolsSection.classList.add('icon-nav');

  if (mobileToolsDiv) {
    mobileToolsDiv.classList.add('mobile-menus-icon');
    toolsSection.append(mobileToolsDiv);
  }

  if (desktopToolsDiv) {
    desktopToolsDiv.classList.add('desktop-menus-icon');
    toolsSection.append(desktopToolsDiv);
  }

  navWrapper.append(toolsSection);
}

/**
 * Parses the fragment structure and applies EDS classes.
 * @param {Element} nav The <nav> element to populate.
 * @param {Element} fragment The loaded fragment HTML.
 */
function parseStructure(nav, fragment) {
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('wrap', 'container');

  const children = Array.from(fragment.children);

  // Assuming the fragment structure is generally:
  // 1. Logo (first div with .logo)
  // 2. Main Navigation items (multiple divs, each with a p > a and a ul)
  // 3. Mobile Tools (div with .icon-nav.mobile-menus-icon)
  // 4. Desktop Tools (div with .icon-nav.desktop-menus-icon)
  // 5. Optional: 80th-year logo (div with .logo.year-80-logo)

  let brandSectionFound = false;
  let mobileToolsFound = false;
  let desktopToolsFound = false;
  let year80LogoFound = false;
  const navSectionChildren = [];

  children.forEach((child) => {
    if (child.classList.contains('logo') && !child.classList.contains('year-80-logo') && !brandSectionFound) {
      parseBrandSection(navWrapper, child);
      brandSectionFound = true;
    } else if (child.classList.contains('icon-nav') && child.classList.contains('mobile-menus-icon') && !mobileToolsFound) {
      // Defer appending tools until all nav sections are processed
      // Store reference to the actual fragment element
      mobileToolsFound = child;
    } else if (child.classList.contains('icon-nav') && child.classList.contains('desktop-menus-icon') && !desktopToolsFound) {
      // Defer appending tools until all nav sections are processed
      // Store reference to the actual fragment element
      desktopToolsFound = child;
    } else if (child.classList.contains('logo') && child.classList.contains('year-80-logo') && !year80LogoFound) {
      // Defer appending 80th year logo until after main nav
      year80LogoFound = child;
    } else {
      // Assume remaining divs are main navigation sections
      navSectionChildren.push(child);
    }
  });

  parseNavSections(navWrapper, navSectionChildren);

  // Append tools section after main nav
  parseToolsSection(navWrapper, mobileToolsFound, desktopToolsFound);

  // Append 80th year logo if found
  if (year80LogoFound) {
    navWrapper.append(year80LogoFound);
  }

  nav.append(navWrapper);
}

/**
 * Sets up desktop navigation behavior (hover, dropdowns).
 * @param {Element} nav The <nav> element.
 */
function setupDesktopNav(nav) {
  nav.querySelectorAll('.main-nav > ul > li.has-child').forEach((navSection) => {
    navSection.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        nav.querySelectorAll('.main-nav > ul > li.has-child[aria-expanded="true"]').forEach((expandedSection) => {
          if (expandedSection !== navSection) {
            toggleSectionExpanded(expandedSection, false);
          }
        });
        toggleSectionExpanded(navSection, true);
      }
    });

    // Handle nested dropdowns (e.g., Industries -> Automotive)
    navSection.querySelectorAll('.mega-menu .sub-nav-wrap > ul > li').forEach((parentLi) => {
      const subChildUl = parentLi.querySelector('ul');
      if (subChildUl) {
        parentLi.classList.add('top-level-li');
        const span = parentLi.querySelector('span'); // The SVG span
        if (span) span.remove(); // Remove mobile specific span, will be re-added if needed for mobile

        const subChildWrapper = document.createElement('div');
        subChildWrapper.classList.add('has-sub-child');
        subChildWrapper.append(subChildUl);
        parentLi.append(subChildWrapper);

        parentLi.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            parentLi.closest('.sub-nav-wrap').querySelectorAll('.has-sub-child[aria-expanded="true"]').forEach((expandedSubChild) => {
              if (expandedSubChild !== subChildWrapper) {
                toggleSectionExpanded(expandedSubChild, false);
              }
            });
            toggleSectionExpanded(subChildWrapper, true);
          }
        });

        // Handle inner nested dropdowns (e.g., Automotive -> SUVs)
        subChildWrapper.querySelectorAll('li').forEach((innerParentLi) => {
          const innerSubChildUl = innerParentLi.querySelector('ul');
          if (innerSubChildUl) {
            innerParentLi.classList.add('first-level-li');
            const innerSpan = innerParentLi.querySelector('span'); // The SVG span
            if (innerSpan) innerSpan.remove(); // Remove mobile specific span

            const innerSubChildWrapper = document.createElement('div');
            innerSubChildWrapper.classList.add('has-inner-sub-child');
            innerSubChildWrapper.append(innerSubChildUl);
            innerParentLi.append(innerSubChildWrapper);

            innerParentLi.addEventListener('mouseenter', () => {
              if (isDesktop.matches) {
                innerParentLi.closest('.has-sub-child').querySelectorAll('.has-inner-sub-child[aria-expanded="true"]').forEach((expandedInnerSubChild) => {
                  if (expandedInnerSubChild !== innerSubChildWrapper) {
                    toggleSectionExpanded(expandedInnerSubChild, false);
                  }
                });
                toggleSectionExpanded(innerSubChildWrapper, true);
              }
            });
          }
        });
      }
    });
  });

  nav.addEventListener('mouseleave', () => {
    if (isDesktop.matches) {
      closeAllNav(nav);
    }
  });

  // Search functionality for desktop
  const desktopSearchLink = nav.querySelector('.desktop-menus-icon .search > a');
  const searchScreenWrap = nav.querySelector('.search-screen-wrap');
  if (desktopSearchLink && searchScreenWrap) {
    desktopSearchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = desktopSearchLink.getAttribute('aria-expanded') === 'true';
      closeAllNav(nav);
      toggleSectionExpanded(desktopSearchLink, !isExpanded);
      searchScreenWrap.classList.toggle('active', !isExpanded);
      searchScreenWrap.style.display = isExpanded ? 'none' : 'block'; // Explicitly manage display
    });

    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!searchScreenWrap.contains(e.target) && !desktopSearchLink.contains(e.target)) {
        closeAllNav(nav);
      }
    });
  }
}

/**
 * Sets up mobile navigation behavior (hamburger, accordion).
 * @param {Element} nav The <nav> element.
 */
function setupMobileNav(nav) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav-sections" aria-label="Open navigation"><ul><li></li><li></li><li></li></ul></button>';
  nav.querySelector('.wrap').prepend(hamburger);

  const navSections = nav.querySelector('.main-nav');
  if (navSections) {
    navSections.id = 'nav-sections';

    // Accordion behavior for main nav items
    navSections.querySelectorAll(':scope > ul > li.has-child').forEach((navSection) => {
      const mainLink = navSection.querySelector(':scope > a');
      let svgSpan = navSection.querySelector(':scope > span');

      // Re-add SVG span if it was removed for desktop
      if (!svgSpan) {
        const originalSvgSpan = document.createElement('span');
        originalSvgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        navSection.append(originalSvgSpan);
        svgSpan = originalSvgSpan;
      }

      if (mainLink && svgSpan) {
        mainLink.setAttribute('role', 'button');
        mainLink.setAttribute('aria-expanded', 'false');
        mainLink.setAttribute('aria-controls', `nav-section-${mainLink.textContent.replace(/\s+/g, '-')}`);
        svgSpan.setAttribute('role', 'button');
        svgSpan.setAttribute('aria-expanded', 'false');
        svgSpan.setAttribute('aria-controls', `nav-section-${mainLink.textContent.replace(/\s+/g, '-')}`);

        const megaMenu = navSection.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.id = `nav-section-${mainLink.textContent.replace(/\s+/g, '-')}`;
          megaMenu.style.display = 'none';
        }

        const toggle = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isExpanded = navSection.getAttribute('aria-expanded') === 'true';
          navSections.querySelectorAll(':scope > ul > li.has-child[aria-expanded="true"]').forEach((openSection) => {
            if (openSection !== navSection) {
              toggleSectionExpanded(openSection, false);
              openSection.querySelector('.mega-menu').style.display = 'none';
            }
          });
          toggleSectionExpanded(navSection, !isExpanded);
          if (megaMenu) {
            megaMenu.style.display = isExpanded ? 'none' : 'block';
          }
        };
        mainLink.addEventListener('click', toggle);
        svgSpan.addEventListener('click', toggle);
      }

      // Accordion behavior for nested items (has-sub-child, has-inner-sub-child)
      navSection.querySelectorAll('.mega-menu .sub-nav-wrap > ul > li').forEach((parentLi) => {
        const subChildWrapper = parentLi.querySelector('.has-sub-child');
        const subChildLink = parentLi.querySelector(':scope > a');
        let subChildSvgSpan = parentLi.querySelector(':scope > span');

        if (!subChildSvgSpan && subChildWrapper) {
          const originalSvgSpan = document.createElement('span');
          originalSvgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          parentLi.append(originalSvgSpan);
          subChildSvgSpan = originalSvgSpan;
        }

        if (subChildWrapper && subChildLink && subChildSvgSpan) {
          subChildLink.setAttribute('role', 'button');
          subChildLink.setAttribute('aria-expanded', 'false');
          subChildLink.setAttribute('aria-controls', `sub-nav-${subChildLink.textContent.replace(/\s+/g, '-')}`);
          subChildSvgSpan.setAttribute('role', 'button');
          subChildSvgSpan.setAttribute('aria-expanded', 'false');
          subChildSvgSpan.setAttribute('aria-controls', `sub-nav-${subChildLink.textContent.replace(/\s+/g, '-')}`);
          subChildWrapper.id = `sub-nav-${subChildLink.textContent.replace(/\s+/g, '-')}`;
          subChildWrapper.style.display = 'none';

          const subToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = parentLi.getAttribute('aria-expanded') === 'true';
            parentLi.closest('.sub-nav-wrap').querySelectorAll('.top-level-li[aria-expanded="true"]').forEach((openSubItem) => {
              if (openSubItem !== parentLi) {
                toggleSectionExpanded(openSubItem, false);
                openSubItem.querySelector('.has-sub-child').style.display = 'none';
              }
            });
            toggleSectionExpanded(parentLi, !isExpanded);
            subChildWrapper.style.display = isExpanded ? 'none' : 'block';
          };
          subChildLink.addEventListener('click', subToggle);
          subChildSvgSpan.addEventListener('click', subToggle);
        }

        // Accordion for inner sub-children
        if (subChildWrapper) {
          subChildWrapper.querySelectorAll('li').forEach((innerParentLi) => {
            const innerSubChildWrapper = innerParentLi.querySelector('.has-inner-sub-child');
            const innerSubChildLink = innerParentLi.querySelector(':scope > a');
            let innerSubChildSvgSpan = innerParentLi.querySelector(':scope > span');

            if (!innerSubChildSvgSpan && innerSubChildWrapper) {
              const originalSvgSpan = document.createElement('span');
              originalSvgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
              innerParentLi.append(originalSvgSpan);
              innerSubChildSvgSpan = originalSvgSpan;
            }

            if (innerSubChildWrapper && innerSubChildLink && innerSubChildSvgSpan) {
              innerSubChildLink.setAttribute('role', 'button');
              innerSubChildLink.setAttribute('aria-expanded', 'false');
              innerSubChildLink.setAttribute('aria-controls', `inner-sub-nav-${innerSubChildLink.textContent.replace(/\s+/g, '-')}`);
              innerSubChildSvgSpan.setAttribute('role', 'button');
              innerSubChildSvgSpan.setAttribute('aria-expanded', 'false');
              innerSubChildSvgSpan.setAttribute('aria-controls', `inner-sub-nav-${innerSubChildLink.textContent.replace(/\s+/g, '-')}`);
              innerSubChildWrapper.id = `inner-sub-nav-${innerSubChildLink.textContent.replace(/\s+/g, '-')}`;
              innerSubChildWrapper.style.display = 'none';

              const innerSubToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isExpanded = innerParentLi.getAttribute('aria-expanded') === 'true';
                innerParentLi.closest('.has-sub-child').querySelectorAll('.first-level-li[aria-expanded="true"]').forEach((openInnerSubItem) => {
                  if (openInnerSubItem !== innerParentLi) {
                    toggleSectionExpanded(openInnerSubItem, false);
                    openInnerSubItem.querySelector('.has-inner-sub-child').style.display = 'none';
                  }
                });
                toggleSectionExpanded(innerParentLi, !isExpanded);
                innerSubChildWrapper.style.display = isExpanded ? 'none' : 'block';
              };
              innerSubChildLink.addEventListener('click', innerSubToggle);
              innerSubChildSvgSpan.addEventListener('click', innerSubToggle);
            }
          });
        }
      });
    });
  }

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.classList.toggle('no-scroll', !expanded);
    hamburger.querySelector('button').setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    hamburger.querySelector('button').setAttribute('aria-expanded', !expanded);

    // Toggle main nav display
    if (navSections) {
      navSections.style.display = expanded ? 'none' : 'block';
      if (!expanded) {
        // When opening, ensure all sub-menus are closed
        navSections.querySelectorAll('.mega-menu, .has-sub-child, .has-inner-sub-child').forEach((menu) => {
          menu.style.display = 'none';
          menu.closest('li[aria-expanded]')?.setAttribute('aria-expanded', 'false');
        });
      }
    }
  });

  // Search functionality for mobile
  const mobileSearchLink = nav.querySelector('.mobile-menus-icon .search > a');
  const searchScreenWrap = nav.querySelector('.search-screen-wrap');
  if (mobileSearchLink && searchScreenWrap) {
    mobileSearchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = mobileSearchLink.getAttribute('aria-expanded') === 'true';
      closeAllNav(nav);
      toggleSectionExpanded(mobileSearchLink, !isExpanded);
      searchScreenWrap.classList.toggle('active', !isExpanded);
      searchScreenWrap.style.display = isExpanded ? 'none' : 'block'; // Explicitly manage display
      document.body.classList.toggle('no-scroll', !isExpanded);
    });

    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!searchScreenWrap.contains(e.target) && !mobileSearchLink.contains(e.target)) {
        closeAllNav(nav);
      }
    });
  }
}

/**
 * Sets up accessibility attributes and event listeners.
 * @param {Element} nav The <nav> element.
 */
function setupAccessibility(nav) {
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main Navigation');

  // Add keyboard navigation listeners
  nav.addEventListener('keydown', handleNavKeydown);

  // Add aria-label to search input if it exists
  const searchInput = nav.querySelector('.search-screen-wrap .input-text.searchtext');
  if (searchInput) {
    searchInput.setAttribute('aria-label', 'Search input');
  }
}

/**
 * Loads and decorates the header, mainly the nav.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-header', 'with-marquee', 'solid');

  if (fragment) {
    parseStructure(nav, fragment);
  } else {
    // Handle case where fragment loading fails or is empty
    console.error('Navigation fragment not found or empty.');
    return; // Exit if no fragment to parse
  }

  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav);

  // Initial state for mobile/desktop
  const applyInitialNavState = () => {
    const navSections = nav.querySelector('.main-nav');
    const searchScreenWrap = nav.querySelector('.search-screen-wrap');

    if (isDesktop.matches) {
      nav.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (navSections) navSections.style.display = ''; // Let CSS handle desktop display
      nav.querySelectorAll('.mega-menu, .has-sub-child, .has-inner-sub-child').forEach((menu) => {
        menu.style.display = ''; // Let CSS handle desktop display
        menu.closest('li[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      });
      if (searchScreenWrap) searchScreenWrap.style.display = 'none'; // Ensure search is hidden on desktop init
    } else {
      nav.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (navSections) navSections.style.display = 'none'; // Mobile starts hidden
      nav.querySelectorAll('.mega-menu, .has-sub-child, .has-inner-sub-child').forEach((menu) => {
        menu.style.display = 'none'; // Mobile starts hidden
        menu.closest('li[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      });
      if (searchScreenWrap) searchScreenWrap.style.display = 'none'; // Ensure search is hidden on mobile init
    }
    closeAllNav(nav); // Ensure all sub-menus are closed
  };

  isDesktop.addEventListener('change', applyInitialNavState);
  applyInitialNavState(); // Apply on initial load

  block.append(nav);
}
