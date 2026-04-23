import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1200px)'); // Adjusted breakpoint based on original CSS for desktop panels

/**
 * Closes an open menu/panel and removes body scroll lock.
 * @param {HTMLElement} element The menu or panel to close.
 * @param {HTMLElement} trigger The button/element that triggered the menu/panel.
 */
function closeMenu(element, trigger) {
  element.classList.remove('is-open');
  element.setAttribute('aria-expanded', 'false');
  if (element.classList.contains('menu')) { // Only hide mobile menu
    element.setAttribute('aria-hidden', 'true');
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }
  document.body.classList.remove('no-scroll');
}

/**
 * Opens a menu/panel and applies body scroll lock.
 * @param {HTMLElement} element The menu or panel to open.
 * @param {HTMLElement} trigger The button/element that triggered the menu/panel.
 */
function openMenu(element, trigger) {
  element.classList.add('is-open');
  element.setAttribute('aria-expanded', 'true');
  if (element.classList.contains('menu')) { // Only show mobile menu
    element.setAttribute('aria-hidden', 'false');
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'true');
  }
  document.body.classList.add('no-scroll');
}

/**
 * Closes all desktop dropdowns.
 * @param {HTMLElement} navSections The nav sections container.
 */
function closeAllDesktopDropdowns(navSections) {
  navSections.querySelectorAll('.nav-drop.is-open').forEach((drop) => {
    drop.classList.remove('is-open');
    drop.setAttribute('aria-expanded', 'false');
    const panel = drop.querySelector('.desktop-panel');
    if (panel) {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
    }
  });
}

/**
 * Handles Escape key press to close open menus/panels.
 * @param {KeyboardEvent} e The keyboard event.
 * @param {HTMLElement} nav The main navigation element.
 */
function handleEscapeKey(e, nav) {
  if (e.key === 'Escape') {
    const mobileNav = nav.querySelector('.nav-sections-mobile');
    const mobileNavToggle = nav.querySelector('.nav-hamburger button');

    // Close any open desktop dropdowns first
    const navSections = nav.querySelector('.nav-sections');
    if (navSections && isDesktop.matches) {
      const openDesktopDropdowns = navSections.querySelectorAll('.nav-drop.is-open');
      if (openDesktopDropdowns.length > 0) {
        closeAllDesktopDropdowns(navSections);
        return; // Don't close mobile nav if desktop dropdowns were open
      }
    }

    // Close mobile nav if open
    if (mobileNav && mobileNav.classList.contains('is-open')) {
      closeMenu(mobileNav, mobileNavToggle);
      return;
    }

    // Close any open mobile accordions
    const openAccordions = nav.querySelectorAll('.accordion.is-open');
    if (openAccordions.length > 0) {
      openAccordions.forEach((acc) => {
        const panel = acc.nextElementSibling;
        closeMenu(acc, null);
        if (panel) closeMenu(panel, null);
      });
    }
  }
}

/**
 * Sets up accessibility attributes and event listeners.
 * @param {HTMLElement} nav The main navigation element.
 */
function setupAccessibility(nav) {
  // Add Escape key listener to the window
  window.addEventListener('keydown', (e) => handleEscapeKey(e, nav));

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (isDesktop.matches) {
      const navSections = nav.querySelector('.nav-sections');
      if (navSections && !navSections.contains(e.target)) {
        closeAllDesktopDropdowns(navSections);
      }
    }
  });

  // Close mobile nav when clicking outside the menu (but not on hamburger)
  nav.addEventListener('click', (e) => {
    if (!isDesktop.matches) {
      const mobileNav = nav.querySelector('.nav-sections-mobile');
      const hamburger = nav.querySelector('.nav-hamburger button');
      if (mobileNav && mobileNav.classList.contains('is-open') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu(mobileNav, hamburger);
      }
    }
  });
}

/**
 * Parses the fragment structure and applies top-level wrappers and classes.
 * @param {HTMLElement} nav The navigation fragment.
 */
function parseStructure(nav) {
  const children = Array.from(nav.children);

  // Find existing elements or create wrappers
  let navBrand = nav.querySelector('.nav-brand');
  let navSections = nav.querySelector('.nav-sections');
  let navTools = nav.querySelector('.nav-tools');

  // If not found by class, try to identify by content and wrap
  if (!navBrand) {
    const logoWrapper = children.find((child) => child.querySelector('.logo') || child.querySelector('a[data-logo-name]'));
    if (logoWrapper) {
      navBrand = document.createElement('div');
      navBrand.classList.add('nav-brand');
      logoWrapper.replaceWith(navBrand);
      navBrand.append(logoWrapper);
    }
  }

  if (!navSections) {
    const linksDiv = children.find((child) => child.classList.contains('links') || child.querySelector('.link-title'));
    if (linksDiv) {
      navSections = document.createElement('div');
      navSections.classList.add('nav-sections');
      linksDiv.replaceWith(navSections);
      navSections.append(linksDiv);
    }
  }

  if (!navTools) {
    const rightDiv = children.find((child) => child.classList.contains('right') || child.querySelector('.contact') || child.querySelector('.language') || child.querySelector('.sign-in'));
    if (rightDiv) {
      navTools = document.createElement('div');
      navTools.classList.add('nav-tools', 'right'); // Add 'right' class as per original HTML
      navTools.id = 'nav-tools';
      rightDiv.replaceWith(navTools);
      navTools.append(rightDiv);
    }
  }

  // Ensure main sections have their classes
  if (navBrand) {
    navBrand.classList.add('nav-brand');
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.classList.remove('button');
      brandLink.closest('.button-container')?.classList.remove('button-container');
    }
  }

  if (navSections) {
    navSections.classList.add('nav-sections');
  }

  if (navTools) {
    navTools.classList.add('nav-tools', 'right');
    navTools.id = 'nav-tools';
  }

  // Create or find the main navbar container
  let navbarContainer = nav.querySelector('.navbar.navbar-arena.g-container');
  if (!navbarContainer) {
    navbarContainer = document.createElement('div');
    navbarContainer.classList.add('navbar', 'navbar-arena', 'g-container');
    nav.prepend(navbarContainer);
  } else {
    // Clear existing content if it's already there to re-add in correct order
    navbarContainer.innerHTML = '';
  }

  // Create hamburger button dynamically with a unique ID for aria-controls
  const mobileNavId = `nav-sections-mobile-${Math.random().toString(36).substring(2, 9)}`;
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="${mobileNavId}" aria-label="Open navigation" aria-expanded="false">
                            <span class="nav-hamburger-icon"></span>
                         </button>`;
  navbarContainer.append(hamburger); // Append first, then reorder if needed

  // Append sections in the correct order
  if (navBrand) navbarContainer.append(navBrand);
  if (navSections) navbarContainer.append(navSections);
  if (navTools) navbarContainer.append(navTools);

  // Set the mobileNavId for later use in setupMobileNav
  nav.dataset.mobileNavId = mobileNavId;
}

/**
 * Sets up desktop navigation behavior (dropdowns/mega-menus).
 * @param {HTMLElement} nav The main navigation element.
 */
function setupDesktopNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Find the direct children of .nav-sections that are link-title or desktop-panel
  Array.from(navSections.children).forEach((sectionWrapper) => {
    const navSection = sectionWrapper.querySelector('.link-title');
    const panel = sectionWrapper.querySelector('.desktop-panel');

    if (navSection && panel) {
      // Wrap navSection and panel in a new li.nav-drop if they are not already
      let navDropLi = navSection.closest('li.nav-drop');
      if (!navDropLi) {
        navDropLi = document.createElement('li');
        navDropLi.classList.add('nav-drop');
        sectionWrapper.replaceWith(navDropLi);
        navDropLi.append(sectionWrapper);
      } else {
        // Ensure the panel is a direct sibling of the link-title within the li
        navDropLi.append(panel);
      }

      navSection.setAttribute('aria-expanded', 'false');
      panel.id = panel.id || `nav-panel-${Math.random().toString(36).substring(2, 9)}`; // Ensure panel has an ID
      navSection.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-hidden', 'true');

      // Add hover listeners for desktop
      navDropLi.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          closeAllDesktopDropdowns(navSections); // Close others
          openMenu(navDropLi, null);
          openMenu(panel, null);
        }
      });

      navDropLi.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          closeMenu(navDropLi, null);
          closeMenu(panel, null);
        }
      });

      // Keyboard accessibility for desktop dropdowns
      navSection.addEventListener('keydown', (e) => {
        if (isDesktop.matches && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          const expanded = navDropLi.getAttribute('aria-expanded') === 'true';
          if (expanded) {
            closeMenu(navDropLi, null);
            closeMenu(panel, null);
          } else {
            closeAllDesktopDropdowns(navSections);
            openMenu(navDropLi, null);
            openMenu(panel, null);
            panel.querySelector('a')?.focus(); // Focus first link in panel
          }
        }
      });

      panel.addEventListener('keydown', (e) => {
        if (isDesktop.matches && e.key === 'Escape') {
          e.preventDefault();
          closeMenu(navDropLi, null);
          closeMenu(panel, null);
          navSection.focus(); // Return focus to the trigger
        }
      });
    } else if (navSection) {
      // If it's just a link-title without a panel, ensure it's wrapped in an li
      let navLinkLi = navSection.closest('li.nav-link');
      if (!navLinkLi) {
        navLinkLi = document.createElement('li');
        navLinkLi.classList.add('nav-link');
        sectionWrapper.replaceWith(navLinkLi);
        navLinkLi.append(sectionWrapper);
      }
    }
  });

  // Wrap all direct children of .nav-sections into a <ul> if not already
  let ulElement = navSections.querySelector('ul');
  if (!ulElement) {
    ulElement = document.createElement('ul');
    // Move all current children of navSections into the new ul
    while (navSections.firstElementChild) {
      ulElement.append(navSections.firstElementChild);
    }
    navSections.append(ulElement);
  }
}

/**
 * Sets up mobile navigation behavior (hamburger, accordion).
 * @param {HTMLElement} nav The main navigation element.
 */
function setupMobileNav(nav) {
  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  const navSectionsDesktop = nav.querySelector('.nav-sections');
  const mobileNavId = nav.dataset.mobileNavId; // Get the dynamically generated ID

  if (!hamburgerButton || !navSectionsDesktop || !mobileNavId) return;

  const mobileNavContainer = document.createElement('div');
  mobileNavContainer.classList.add('menu', 'hidden', 'menu-arena', 'nav-sections-mobile');
  mobileNavContainer.id = mobileNavId; // Use the dynamically generated ID
  mobileNavContainer.setAttribute('aria-expanded', 'false');
  mobileNavContainer.setAttribute('aria-hidden', 'true');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  mobileNavContainer.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  mobileNavContainer.append(menuList);

  // Clone and adapt desktop nav sections for mobile accordion
  navSectionsDesktop.querySelectorAll(':scope > ul > li').forEach((desktopListItem) => {
    const mobileListItem = document.createElement('li');
    mobileListItem.classList.add('nav-link');

    const linkTitle = desktopListItem.querySelector('.link-title');
    const panel = desktopListItem.querySelector('.desktop-panel');

    if (linkTitle) {
      const sectionLink = linkTitle.querySelector('a');
      const sectionLabel = sectionLink?.textContent || linkTitle.textContent.trim();

      if (sectionLink) {
        // Direct link
        mobileListItem.innerHTML = `<span class="menu-title">${sectionLink.outerHTML}</span>`;
        mobileListItem.classList.add(sectionLink.textContent.toLowerCase().replace(/\s/g, '-'));
      } else if (panel) {
        // Accordion item with sub-menu
        mobileListItem.classList.add('accordion', sectionLabel.toLowerCase().replace(/\s/g, '-'));
        mobileListItem.innerHTML = `<span class="menu-title">${sectionLabel}</span>`;
        mobileListItem.setAttribute('aria-expanded', 'false');
        panel.id = panel.id || `nav-panel-${Math.random().toString(36).substring(2, 9)}`; // Ensure panel has an ID
        mobileListItem.setAttribute('aria-controls', panel.id);

        const mobilePanel = document.createElement('div');
        mobilePanel.classList.add('panel');
        mobilePanel.id = panel.id;
        mobilePanel.setAttribute('aria-hidden', 'true');

        // Clone the content of the desktop panel's link-grid
        const linkGrid = panel.querySelector('.link-grid');
        if (linkGrid) {
          const clonedLinkGrid = linkGrid.cloneNode(true);
          clonedLinkGrid.querySelectorAll('.links-container').forEach(ul => ul.classList.add('accordian-content'));
          mobilePanel.append(clonedLinkGrid);
        }

        mobileListItem.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent closing parent menu
          const expanded = mobileListItem.getAttribute('aria-expanded') === 'true';
          if (expanded) {
            closeMenu(mobileListItem, null);
            closeMenu(mobilePanel, null);
          } else {
            // Close other open accordions in the same level
            mobileListItem.closest('.menu-list').querySelectorAll('.accordion.is-open').forEach(openAcc => {
              const openPanel = openAcc.nextElementSibling;
              closeMenu(openAcc, null);
              if (openPanel) closeMenu(openPanel, null);
            });
            openMenu(mobileListItem, null);
            openMenu(mobilePanel, null);
          }
        });
        menuList.append(mobileListItem);
        menuList.append(mobilePanel);
      }
    } else {
      // Handle other direct list items if any (e.g., from nav-tools)
      const clonedItem = desktopListItem.cloneNode(true);
      menuList.append(clonedItem);
    }
  });

  // Add mobileNavContainer to the block, outside the main navbar
  nav.append(mobileNavContainer);

  // Hamburger toggle functionality
  hamburgerButton.addEventListener('click', () => {
    if (mobileNavContainer.classList.contains('is-open')) {
      closeMenu(mobileNavContainer, hamburgerButton);
    } else {
      openMenu(mobileNavContainer, hamburgerButton);
    }
  });

  // Close icon in mobile menu header
  menuHeader.querySelector('.close-icon').addEventListener('click', () => {
    closeMenu(mobileNavContainer, hamburgerButton);
  });

  // Back arrow functionality (if needed for deeper mobile navigation, currently not implemented for L2)
  menuHeader.querySelector('.back-arrow').addEventListener('click', () => {
    // For this structure, it simply closes the menu
    closeMenu(mobileNavContainer, hamburgerButton);
  });
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
    block.remove();
    return;
  }

  // Create a new nav element to hold the fragment content
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('corp-header-block'); // Add main block class
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  // Initial structure parsing and class application
  parseStructure(nav);

  // Setup desktop navigation features
  setupDesktopNav(nav);

  // Setup mobile navigation features
  setupMobileNav(nav);

  // Setup global accessibility features
  setupAccessibility(nav);

  // Append the fully decorated nav to the block
  block.textContent = ''; // Clear original block content
  block.append(nav);

  // Adjust visibility based on desktop media query initially and on change
  const adjustNavVisibility = () => {
    const mobileNav = nav.querySelector('.nav-sections-mobile');
    const hamburger = nav.querySelector('.nav-hamburger button');
    if (isDesktop.matches) {
      document.body.classList.remove('no-scroll');
      if (mobileNav) {
        mobileNav.classList.add('hidden');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.setAttribute('aria-expanded', 'false');
      }
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      closeAllDesktopDropdowns(nav.querySelector('.nav-sections'));
    } else {
      if (mobileNav) {
        mobileNav.classList.remove('hidden');
        if (mobileNav.classList.contains('is-open')) {
          document.body.classList.add('no-scroll');
          mobileNav.setAttribute('aria-hidden', 'false');
          mobileNav.setAttribute('aria-expanded', 'true');
        } else {
          mobileNav.setAttribute('aria-hidden', 'true');
          mobileNav.setAttribute('aria-expanded', 'false');
        }
      }
    }
  };

  adjustNavVisibility();
  isDesktop.addEventListener('change', adjustNavVisibility);
}
