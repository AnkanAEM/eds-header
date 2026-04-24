import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to original CSS breakpoint

function closeAllMenus(nav) {
  // Close top-level mega menus
  nav.querySelectorAll('.nav-sections .has-child[aria-expanded="true"]').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = 'none';
    }
  });

  // Close mobile accordion sub-menus
  nav.querySelectorAll('.nav-sections .has-sub-child[aria-expanded="true"]').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
    // For mobile, these are usually direct children of the LI and control their display
    section.querySelector('ul').style.display = 'none'; // Assuming the UL is the collapsible part
  });

  // Close mobile accordion inner-sub-menus
  nav.querySelectorAll('.nav-sections .has-inner-sub-child[aria-expanded="true"]').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
    // For mobile, these are usually direct children of the LI and control their display
    section.querySelector('ul').style.display = 'none'; // Assuming the UL is the collapsible part
  });

  // Close search screen
  const searchScreen = nav.querySelector('.search-screen-wrap');
  if (searchScreen && searchScreen.classList.contains('active')) {
    searchScreen.classList.remove('active');
    const searchToggle = nav.querySelector('.nav-tools .search > a');
    if (searchToggle) {
      searchToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('no-scroll');
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) { // Mobile nav open
      toggleMenu(nav, false);
    } else { // Desktop nav or search open
      closeAllMenus(nav);
    }
  }
}

function handleOutsideClick(event) {
  const nav = document.getElementById('nav');
  if (!nav.contains(event.target)) {
    // If mobile nav is open, close it
    if (nav.getAttribute('aria-expanded') === 'true' && !isDesktop.matches) {
      toggleMenu(nav, false);
    }
    // Always close all sub-menus and search on outside click
    closeAllMenus(nav);
  }
}

function setupAccessibility(nav) {
  window.addEventListener('keydown', closeOnEscape);
  document.addEventListener('click', handleOutsideClick);

  // Set initial aria-expanded for top-level nav items with children
  nav.querySelectorAll('.nav-sections > ul > li.has-child').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });

  // Set initial aria-expanded for mobile sub-menus
  nav.querySelectorAll('.nav-sections .has-sub-child, .nav-sections .has-inner-sub-child').forEach((sub) => {
    sub.setAttribute('aria-expanded', 'false');
  });

  // Set initial aria-expanded for search toggle
  const searchToggle = nav.querySelector('.nav-tools .search > a');
  if (searchToggle) {
    searchToggle.setAttribute('aria-expanded', 'false');
  }
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.classList.toggle('no-scroll', !expanded);

  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    hamburgerButton.setAttribute('aria-expanded', !expanded);
  }

  // Close all sub-menus when mobile nav is closed
  if (!expanded) {
    closeAllMenus(nav);
  }
}

function setupMobileNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Hamburger button (already created in parseStructure, just add listener)
  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  if (hamburgerButton) {
    hamburgerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(nav);
    });
  }

  // Mobile accordion for nested menus
  navSections.querySelectorAll('li.has-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = e.currentTarget.closest('li.has-child');
      const megaMenu = parentLi.querySelector('.mega-menu');
      const isExpanded = parentLi.getAttribute('aria-expanded') === 'true';

      // Close other open top-level menus
      navSections.querySelectorAll('li.has-child[aria-expanded="true"]').forEach((otherLi) => {
        if (otherLi !== parentLi) {
          otherLi.setAttribute('aria-expanded', 'false');
          const otherMegaMenu = otherLi.querySelector('.mega-menu');
          if (otherMegaMenu) otherMegaMenu.style.display = 'none';
        }
      });

      parentLi.setAttribute('aria-expanded', !isExpanded);
      if (megaMenu) {
        megaMenu.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });

  navSections.querySelectorAll('.mega-menu .has-sub-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = e.currentTarget.closest('.has-sub-child');
      const nestedUl = parentLi.querySelector('ul'); // The UL is the collapsible part
      const isExpanded = parentLi.getAttribute('aria-expanded') === 'true';

      // Close other open sub-menus at the same level
      parentLi.closest('ul').querySelectorAll('.has-sub-child[aria-expanded="true"]').forEach((otherLi) => {
        if (otherLi !== parentLi) {
          otherLi.setAttribute('aria-expanded', 'false');
          const otherNestedUl = otherLi.querySelector('ul');
          if (otherNestedUl) otherNestedUl.style.display = 'none';
        }
      });

      parentLi.setAttribute('aria-expanded', !isExpanded);
      if (nestedUl) {
        nestedUl.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });

  navSections.querySelectorAll('.has-sub-child .has-inner-sub-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = e.currentTarget.closest('.has-inner-sub-child');
      const nestedUl = parentLi.querySelector('ul'); // The UL is the collapsible part
      const isExpanded = parentLi.getAttribute('aria-expanded') === 'true';

      // Close other open inner-sub-menus at the same level
      parentLi.closest('ul').querySelectorAll('.has-inner-sub-child[aria-expanded="true"]').forEach((otherLi) => {
        if (otherLi !== parentLi) {
          otherLi.setAttribute('aria-expanded', 'false');
          const otherNestedUl = otherLi.querySelector('ul');
          if (otherNestedUl) otherNestedUl.style.display = 'none';
        }
      });

      parentLi.setAttribute('aria-expanded', !isExpanded);
      if (nestedUl) {
        nestedUl.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });
}

function setupDesktopNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      li.addEventListener('mouseenter', () => {
        closeAllMenus(nav); // Close any other open menus
        li.setAttribute('aria-expanded', 'true');
        megaMenu.style.display = 'block';
      });
      li.addEventListener('mouseleave', () => {
        li.setAttribute('aria-expanded', 'false');
        megaMenu.style.display = 'none';
      });
    }
  });

  // Search functionality on desktop
  const searchToggle = nav.querySelector('.nav-tools .search > a');
  const searchScreenWrap = nav.querySelector('.search-screen-wrap');
  if (searchToggle && searchScreenWrap) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';
      closeAllMenus(nav); // Close any open nav menus
      searchToggle.setAttribute('aria-expanded', !isExpanded);
      searchScreenWrap.classList.toggle('active', !isExpanded);
      document.body.classList.toggle('no-scroll', !isExpanded);
      if (!isExpanded) {
        const searchInput = searchScreenWrap.querySelector('.searchtext');
        if (searchInput) searchInput.focus();
      }
    });

    // Close search on clicks outside search area
    searchScreenWrap.addEventListener('click', (e) => e.stopPropagation());
  }
}

function parseStructure(nav) {
  const children = [...nav.children];

  // Identify Brand section (first div with image/link)
  const brandDiv = children.find((div) => div.querySelector('picture, img, a'));
  if (brandDiv) {
    brandDiv.classList.add('nav-brand');
    // Ensure logo is wrapped in a link if not already
    let brandLink = brandDiv.querySelector('a');
    if (!brandLink) {
      brandLink = document.createElement('a');
      brandLink.href = '/'; // Default home link
      brandLink.append(...brandDiv.children);
      brandDiv.append(brandLink);
    }
    // Apply original logo classes
    const logoImg = brandLink.querySelector('img');
    if (logoImg) {
      brandDiv.classList.add('logo');
      logoImg.classList.add('hiddenlogo1');
      if (logoImg.alt && logoImg.alt.includes('80th Year')) { // Specific handling for 80th year logo
        brandDiv.classList.add('year-80-logo');
        logoImg.classList.add('years-80');
      }
    }
  }

  // Identify Sections (div containing ULs for navigation)
  const sectionsDiv = children.find((div) => div.querySelector('ul'));
  if (sectionsDiv) {
    sectionsDiv.classList.add('nav-sections');
    const ul = sectionsDiv.querySelector('ul');
    if (ul) {
      ul.classList.add('main-nav'); // Apply original main-nav class to the ul
      ul.setAttribute('itemscope', '');
      ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
      ul.setAttribute('data-once', 'initSubChildToggle');

      // Process each top-level LI
      ul.querySelectorAll(':scope > li').forEach((li) => {
        li.setAttribute('itemprop', 'name');
        const link = li.querySelector('a');
        if (link) {
          link.setAttribute('itemprop', 'url');
        }

        // Check if it has a child mega-menu
        const megaMenu = li.querySelector('div.mega-menu'); // Assuming mega-menu is a direct child div
        if (megaMenu) {
          li.classList.add('has-child', 'hover-red');
          li.setAttribute('data-once', 'nav-close-search');
          // Move the mega-menu inside the li, if it's not already
          if (megaMenu.parentElement !== li) {
            li.append(megaMenu);
          }
          // Add span for mobile toggle icon
          const span = document.createElement('span');
          span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
          li.append(span);

          // Decorate mega-menu structure
          const wrapContainer = megaMenu.querySelector('.wrap.container');
          if (wrapContainer) {
            const centerDiv = document.createElement('div');
            centerDiv.classList.add('center-div');

            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            centerDiv.append(leftDiv);

            const subNavWrap = document.createElement('div');
            subNavWrap.classList.add('sub-nav-wrap');
            centerDiv.append(subNavWrap);

            // Move existing direct children of wrapContainer into leftDiv or subNavWrap
            [...wrapContainer.children].forEach((child) => {
              if (child.tagName === 'DIV' && child !== centerDiv) {
                // Heuristic: if it contains H4 or P, it's likely left-div content
                if (child.querySelector('h4, p')) {
                  leftDiv.append(child);
                } else if (child.querySelector('ul')) { // Heuristic: if it contains UL, it's sub-nav-wrap content
                  subNavWrap.append(child);
                }
              }
            });

            // Now append the newly structured centerDiv
            wrapContainer.append(centerDiv);

            // Apply specific classes based on original HTML structure heuristics
            const liLinkHref = link ? link.href : '';
            if (liLinkHref.includes('about-us')) {
              subNavWrap.classList.add('about-us-sub-nav');
            } else if (liLinkHref.includes('our-business')) {
              subNavWrap.classList.add('what-we-do');
            } else if (liLinkHref.includes('investor-relations')) {
              leftDiv.classList.add('ir-left-div');
              subNavWrap.classList.add('element-block');
              const innerSubNavWrapList = document.createElement('div');
              innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
              [...subNavWrap.children].forEach((child) => {
                if (child.tagName === 'UL') {
                  if (child.children.length > 1) { // Heuristic for lists to be grouped
                    innerSubNavWrapList.append(child);
                  } else if (child.children.length === 1) { // Heuristic for single link list
                    child.classList.add('sub-nav-wrap-one-link');
                  }
                }
              });
              if (innerSubNavWrapList.children.length > 0) {
                subNavWrap.append(innerSubNavWrapList);
              }
            } else if (liLinkHref.includes('newsroom')) {
              leftDiv.classList.add('newsroom-left-div');
            } else if (liLinkHref.includes('career')) {
              leftDiv.classList.add('career-left-div');
              subNavWrap.classList.add('careers-div');
            }

            // Process nested ULs for mobile accordion
            subNavWrap.querySelectorAll('li > ul').forEach((nestedUl) => {
              const parentOfNestedUl = nestedUl.parentElement;
              parentOfNestedUl.classList.add('has-sub-child');
              const nestedSpan = document.createElement('span');
              nestedSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
              parentOfNestedUl.append(nestedSpan);
              // Ensure nestedUl is a direct sibling of the span for correct mobile accordion logic
              parentOfNestedUl.append(nestedUl);
            });

            // Process deeply nested ULs for mobile accordion
            subNavWrap.querySelectorAll('.has-sub-child li > ul').forEach((deeplyNestedUl) => {
              const parentOfDeeplyNestedUl = deeplyNestedUl.parentElement;
              parentOfDeeplyNestedUl.classList.add('has-inner-sub-child');
              const deeplyNestedSpan = document.createElement('span');
              deeplyNestedSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
              parentOfDeeplyNestedUl.append(deeplyNestedSpan);
              // Ensure deeplyNestedUl is a direct sibling of the span for correct mobile accordion logic
              parentOfDeeplyNestedUl.append(deeplyNestedUl);
            });
          }
        }
      });
    }
  }

  // Identify Tools section (div containing utility links/icons)
  const toolsDiv = children.find((div) => div.querySelector('.icon-nav'));
  if (toolsDiv) {
    toolsDiv.classList.add('nav-tools');
    // The search-screen-wrap and its contents are already present in the fragment
    // We just need to ensure it's correctly positioned relative to the search icon.
    // It's already a sibling of the <a> tag within the .search li, which is fine.
    const searchForm = toolsDiv.querySelector('#search-block-form');
    if (searchForm) {
      searchForm.action = '/search'; // Ensure dynamic search action
    }
  }

  // Rearrange the nav structure to match the original HTML's .wrap > .logo, .hamburger, .main-nav, .logo.year-80-logo
  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap', 'container'); // Add container class as per original HTML

  if (brandDiv) headerWrap.append(brandDiv);

  // Create hamburger button and wrap it in a div with class 'nav-hamburger'
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger'); // Custom class for the button wrapper
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger'); // Use original class name
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = `
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  `;
  hamburgerButton.append(hamburger);
  navHamburger.append(hamburgerButton);
  headerWrap.append(navHamburger);


  if (sectionsDiv) {
    const mainNavUl = sectionsDiv.querySelector('ul');
    if (mainNavUl) {
      // Move the mobile-menus-icon and desktop-menus-icon (nav-tools) inside the .main-nav ul as per original structure
      const mobileIconNav = nav.querySelector('.mobile-menus-icon');
      const desktopIconNav = nav.querySelector('.desktop-menus-icon');

      if (mobileIconNav) mainNavUl.append(mobileIconNav);
      if (desktopIconNav) mainNavUl.append(desktopIconNav);

      sectionsDiv.replaceChildren(mainNavUl); // Ensure only the UL is the direct child of nav-sections
      headerWrap.append(sectionsDiv);
    }
  }

  // Find the year-80-logo and place it correctly
  const year80Logo = children.find((div) => div.classList.contains('year-80-logo'));
  if (year80Logo) {
    headerWrap.append(year80Logo);
  }

  nav.replaceChildren(headerWrap);
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

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav'); // Apply original main-nav class to the nav element itself
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Apply top-level header classes
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  // Parse and structure the fragment content
  parseStructure(nav);

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  const wrapElement = nav.querySelector('.wrap.container');
  if (wrapElement) {
    headerContainer.append(wrapElement); // Move the wrap into the container
  }

  block.append(headerContainer);

  // Setup interactions
  setupAccessibility(nav);

  // Mobile setup
  setupMobileNav(nav);

  // Desktop setup
  setupDesktopNav(nav);

  // Initial state for mobile/desktop
  const initialExpanded = isDesktop.matches;
  nav.setAttribute('aria-expanded', initialExpanded);
  // Only apply no-scroll if mobile and nav is closed initially
  document.body.classList.toggle('no-scroll', !initialExpanded && !isDesktop.matches);

  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, isDesktop.matches);
    closeAllMenus(nav); // Ensure all menus are closed on resize
  });
}
