import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

/**
 * Closes all dropdowns at a specific level within a container.
 * @param {HTMLElement} container The parent container to search within.
 * @param {number} level The dropdown level to close (0 for L0, 1 for L1, etc.).
 */
function closeAllDropdowns(container, level = 0) {
  const dropdownTriggers = container.querySelectorAll(`[aria-expanded="true"][data-level="${level}"]`);
  dropdownTriggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    const targetId = trigger.dataset.target;
    const targetEl = targetId ? document.getElementById(targetId) : null;
    if (targetEl) {
      targetEl.classList.remove('is-open');
    }
    // Recursively close sub-dropdowns within this trigger's target element
    if (targetEl) {
      closeAllDropdowns(targetEl, level + 1);
    }
  });
}

/**
 * Sets up hover/click interactions for dropdown menus.
 * @param {HTMLElement} navContainer The main navigation container.
 * @param {number} level The current dropdown level (0 for L0, 1 for L1, etc.).
 * @param {number} closeDelay Delay in milliseconds before closing on mouseleave for desktop.
 */
function setupDropdowns(navContainer, level = 0, closeDelay = 100) {
  const dropdownTriggers = navContainer.querySelectorAll(`[data-dropdown-trigger][data-level="${level}"]`);

  dropdownTriggers.forEach((trigger) => {
    const targetId = trigger.dataset.target;
    const targetEl = targetId ? document.getElementById(targetId) : null;
    if (!targetEl) return;

    let timeout;

    const openDropdown = () => {
      clearTimeout(timeout);
      // Close siblings at this level, but only if not current desktop L1 trying to open L2
      // (L1 should not close when opening its L2 on desktop hover)
      if (isDesktop() && level === 1) {
        // Do nothing, L1 stays open to reveal L2
      } else {
        closeAllDropdowns(navContainer, level);
      }
      trigger.setAttribute('aria-expanded', 'true');
      targetEl.classList.add('is-open');
      // Set position for desktop L0 dropdowns to cover full width
      if (isDesktop() && level === 0) {
        targetEl.style.left = '0';
        targetEl.style.width = '100%';
      }
    };

    const closeDropdown = () => {
      timeout = setTimeout(() => {
        trigger.setAttribute('aria-expanded', 'false');
        targetEl.classList.remove('is-open');
        // Recursively close sub-dropdowns when parent closes
        closeAllDropdowns(targetEl, level + 1);
      }, closeDelay);
    };

    if (isDesktop()) {
      trigger.addEventListener('mouseenter', openDropdown);
      trigger.addEventListener('mouseleave', closeDropdown);
      targetEl.addEventListener('mouseenter', openDropdown);
      targetEl.addEventListener('mouseleave', closeDropdown);
    } else { // Mobile interaction always uses click
      trigger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior for menu items with submenus
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });
    }

    // Handle children dropdowns recursively if targetEl itself contains dropdown triggers
    setupDropdowns(targetEl, level + 1, closeDelay);
  });
}

/**
 * Handles escape key to close all active dropdowns.
 * @param {KeyboardEvent} event The keyboard event.
 * @param {HTMLElement} container The main container for dropdowns.
 */
function handleEscapeKey(event, container) {
  if (event.key === 'Escape') {
    closeAllDropdowns(container, 0); // Close all L0 dropdowns
  }
}

export default async function decorate(block) {
  block.innerHTML = ''; // Clear block content to ensure idempotency

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const brandContainer = document.createElement('div');
  brandContainer.classList.add('header-brand');
  headerWrapper.append(brandContainer);

  const navContainer = document.createElement('nav');
  navContainer.classList.add('header-nav');
  headerWrapper.append(navContainer);

  const toolsContainer = document.createElement('div');
  toolsContainer.classList.add('header-tools');
  headerWrapper.append(toolsContainer);

  block.append(headerWrapper);

  const fragment = await loadFragment('/nav');
  if (!fragment) {
    console.warn('Nav fragment not found, skipping header decoration.');
    block.remove(); // Remove block if fragment is essential and missing
    return;
  }

  // Use a temporary div to parse the fragment content and extract relevant parts
  const rawNavContent = document.createElement('div');
  // Using outerHTML for fragments that might be the fragment root element itself
  rawNavContent.innerHTML = fragment.outerHTML || fragment.innerHTML || '';

  let logoMoved = false;
  let desktopNavMoved = false;
  let mobileNavMoved = false;
  let toolsMoved = false;

  // Iterate through children of rawNavContent (AEM sections) to classify and move DOM nodes
  Array.from(rawNavContent.children).forEach((section) => {
    // 1. Brand/Logo Area
    if (!logoMoved) {
      const logoLink = section.querySelector('a.navbar-brand');
      if (logoLink && logoLink.querySelector('img')) {
        brandContainer.append(logoLink);
        logoMoved = true;
        return;
      }
    }

    // 2. Desktop Navigation Menu
    if (!desktopNavMoved) {
      const desktopNavList = section.querySelector('ul.navbar-nav.header__navbar--list');
      if (desktopNavList) {
        navContainer.append(desktopNavList);
        desktopNavMoved = true;

        Array.from(desktopNavList.children).forEach((l0Item) => {
          const l0Link = l0Item.querySelector('a.nav-link.header__navbar--link');
          const l1Dropdown = l0Item.querySelector('ul.nav__dropdown.header__navbar--dropdown');

          if (l0Link && l1Dropdown) {
            const dropdownId = `nav-dropdown-l1-${Math.random().toString(36).substring(2, 9)}`;
            l0Link.setAttribute('aria-haspopup', 'true');
            l0Link.setAttribute('aria-expanded', 'false');
            l0Link.setAttribute('data-dropdown-trigger', 'true');
            l0Link.setAttribute('data-target', dropdownId);
            l0Link.setAttribute('data-level', '0');
            l1Dropdown.id = dropdownId;
            l1Dropdown.setAttribute('aria-labelledby', l0Link.id);
            l1Dropdown.classList.add('header-dropdown');
            
            // Set CSS variable for column count if data-column-count is present
            const columnCount = l1Dropdown.dataset.columnCount;
            if (columnCount) {
                l1Dropdown.style.setProperty('--dropdown-columns', columnCount);
            } else {
                l1Dropdown.style.removeProperty('--dropdown-columns');
            }

            // Process L1 columns and potential L2 links within desktop dropdown
            Array.from(l1Dropdown.children).forEach((l1Column) => {
              const sublinksNavigators = l1Column.querySelectorAll('.sublinks__naviagator > .sublinks__navigator--link');
              sublinksNavigators.forEach((l1LinkWrapper) => {
                const l1LinkTitle = l1LinkWrapper.querySelector('a.sublinks__navigator--content--title');
                // L2 links are nested under 'div.d-flex > div' after the L1 title
                const l2ListContainer = l1LinkWrapper.querySelector('.sublinks__navigator--content > div > div:not(.navigation__badge)'); 
                
                if (l1LinkTitle && l2ListContainer && l2ListContainer.children.length > 0) {
                  const l2DropdownId = `nav-dropdown-l2-${Math.random().toString(36).substring(2, 9)}`;
                  l1LinkTitle.setAttribute('aria-haspopup', 'true');
                  l1LinkTitle.setAttribute('aria-expanded', 'false');
                  l1LinkTitle.setAttribute('data-dropdown-trigger', 'true');
                  l1LinkTitle.setAttribute('data-target', l2DropdownId);
                  l1LinkTitle.setAttribute('data-level', '1');
                  l2ListContainer.id = l2DropdownId;
                  l2ListContainer.classList.add('header-dropdown-level2');
                  l2ListContainer.setAttribute('aria-labelledby', l1LinkTitle.id);
                } else if (l1LinkTitle) {
                    // Ensure L1 links without L2 content still navigate correctly without dropdown attributes
                    l1LinkTitle.removeAttribute('aria-haspopup');
                    l1LinkTitle.removeAttribute('aria-expanded');
                    l1LinkTitle.removeAttribute('data-dropdown-trigger');
                    l1LinkTitle.removeAttribute('data-target');
                    l1LinkTitle.removeAttribute('data-level');
                }
              });
            });
          } else if (l0Link) {
              // Ensure L0 links without L1 content still navigate correctly
              l0Link.removeAttribute('aria-haspopup');
              l0Link.removeAttribute('aria-expanded');
              l0Link.removeAttribute('data-dropdown-trigger');
              l0Link.removeAttribute('data-target');
              l0Link.removeAttribute('data-level');
          }
        });
        // Setup interactions for desktop navigation
        setupDropdowns(desktopNavList, 0);
        return;
      }
    }

    // 3. Mobile Navigation (Hamburger Menu)
    if (!mobileNavMoved) {
      const mobileMenu = section.querySelector('nav.header__hamburger--menu');
      if (mobileMenu) {
        navContainer.append(mobileMenu); // Append the entire mobile menu structure
        mobileNavMoved = true;

        // Create and append hamburger toggle button to tools
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.classList.add('header__hamburger-toggle');
        hamburgerBtn.setAttribute('aria-label', 'Open navigation');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.innerHTML = `
          <svg class="icon icon-hamburger" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
          <svg class="icon icon-close" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        `;
        hamburgerBtn.querySelector('.icon-close').style.display = 'none'; // Initially hidden
        toolsContainer.prepend(hamburgerBtn); // Add hamburger to tools

        const headerOverlay = document.createElement('div');
        headerOverlay.classList.add('header__overlay');
        block.append(headerOverlay);

        const toggleMobileMenu = () => {
          const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
          hamburgerBtn.setAttribute('aria-expanded', !expanded);
          mobileMenu.classList.toggle('is-open');
          headerOverlay.classList.toggle('is-open');
          document.body.classList.toggle('no-scroll', !expanded);
          hamburgerBtn.querySelector('.icon-hamburger').style.display = expanded ? 'block' : 'none';
          hamburgerBtn.querySelector('.icon-close').style.display = expanded ? 'none' : 'block';
        };

        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        headerOverlay.addEventListener('click', toggleMobileMenu); // Close on overlay click

        const mobileCloseIcon = mobileMenu.querySelector('.header__hamburger--close-icon');
        if (mobileCloseIcon) {
          mobileCloseIcon.addEventListener('click', toggleMobileMenu);
        }

        // Add IDs and dropdown attributes for mobile accordion items
        mobileMenu.querySelectorAll('.accordion-item.header__accordion--item').forEach((item, i) => {
          const heading = item.querySelector('.accordion-header');
          // The mobile L0 trigger is the span with the arrow icon, not the 'a' link directly.
          const l0Trigger = item.querySelector('.header_arrow_icon'); 
          const collapseDiv = item.querySelector('.accordion-collapse');
          const l0Link = item.querySelector('.header__accordion--button.navigation_link'); // Direct link if no submenu

          if (heading && collapseDiv) {
            const idPrefix = `mobile-panel-${i}-${Math.random().toString(36).substring(2, 5)}`;
            heading.id = `${idPrefix}-heading`;
            collapseDiv.id = `${idPrefix}-collapse`;
            collapseDiv.setAttribute('aria-labelledby', `${idPrefix}-heading`);
            
            if (l0Trigger) { // Item with a submenu
                l0Trigger.setAttribute('aria-haspopup', 'true');
                l0Trigger.setAttribute('aria-expanded', 'false');
                l0Trigger.setAttribute('data-dropdown-trigger', 'true');
                l0Trigger.setAttribute('data-target', collapseDiv.id);
                l0Trigger.setAttribute('data-level', '0');
            } else if (l0Link) { // Item without a submenu, just a direct link
                l0Link.removeAttribute('aria-haspopup');
                l0Link.removeAttribute('aria-expanded');
                l0Link.removeAttribute('data-dropdown-trigger');
                l0Link.removeAttribute('data-target');
                l0Link.removeAttribute('data-level');
            }
            
            // Process nested L1/L2 within mobile accordion body
            collapseDiv.querySelectorAll('.sublinks__navigator--link').forEach((l1LinkWrapper, j) => {
              const l1LinkTitle = l1LinkWrapper.querySelector('a.sublinks__navigator--content--title');
              const l2ListContainer = l1LinkWrapper.querySelector('.sublinks__navigator--content > div > div:not(.navigation__badge)');

              if (l1LinkTitle && l2ListContainer && l2ListContainer.children.length > 0) {
                const l2IdPrefix = `${idPrefix}-l1-${j}-${Math.random().toString(36).substring(2, 5)}`;
                l1LinkTitle.setAttribute('aria-haspopup', 'true');
                l1LinkTitle.setAttribute('aria-expanded', 'false');
                l1LinkTitle.setAttribute('data-dropdown-trigger', 'true');
                l1LinkTitle.setAttribute('data-target', l2IdPrefix);
                l1LinkTitle.setAttribute('data-level', '1');
                l2ListContainer.id = l2IdPrefix;
                l2ListContainer.classList.add('header-dropdown-level2-mobile');
                l2ListContainer.setAttribute('aria-labelledby', l1LinkTitle.id);
              } else if (l1LinkTitle) {
                 l1LinkTitle.removeAttribute('aria-haspopup');
                 l1LinkTitle.removeAttribute('aria-expanded');
                 l1LinkTitle.removeAttribute('data-dropdown-trigger');
                 l1LinkTitle.removeAttribute('data-target');
                 l1LinkTitle.removeAttribute('data-level');
              }
            });
          }
        });
        setupDropdowns(mobileMenu, 0); // Setup mobile dropdowns
        return;
      }
    }

    // 4. Utility Tools (Search, Notification, Login)
    if (!toolsMoved) {
      const searchTool = section.querySelector('.header__search');
      const notificationTool = section.querySelector('.header__notification--trigger');
      const loginTool = section.querySelector('.header__login');
      
      if (searchTool || notificationTool || loginTool) {
        // Append tools that are found, order matters (hamburger is prepended, so others follow)
        if (searchTool) toolsContainer.append(searchTool);
        if (notificationTool) toolsContainer.append(notificationTool);
        if (loginTool) toolsContainer.append(loginTool);
        toolsMoved = true;

        // Search functionality
        if (searchTool) {
          const searchTrigger = searchTool.querySelector('.header__search--svg-find');
          const searchPanel = searchTool.querySelector('.global__search--wrapper');
          const closeSearch = searchTool.querySelector('.close-search');

          if (searchTrigger && searchPanel && closeSearch) {
            const openSearch = () => {
              searchPanel.classList.add('is-open');
              document.body.classList.add('no-scroll');
              searchTrigger.setAttribute('aria-expanded', 'true');
            };
            const closeSearchPanel = () => {
              searchPanel.classList.remove('is-open');
              document.body.classList.remove('no-scroll');
              searchTrigger.setAttribute('aria-expanded', 'false');
            };

            searchTrigger.addEventListener('click', openSearch);
            closeSearch.addEventListener('click', closeSearchPanel);
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && searchPanel.classList.contains('is-open')) {
                closeSearchPanel();
              }
            });
          }
        }

        // Notification functionality
        if (notificationTool) {
          const notificationTrigger = notificationTool.querySelector('.header__notification--trigger-svg');
          const notificationPanel = notificationTool.querySelector('.header__notification--panel');

          if (notificationTrigger && notificationPanel) {
            const toggleNotifications = (e) => {
              e.stopPropagation(); // Prevent document click from immediately closing other dropdowns
              const expanded = notificationTrigger.getAttribute('aria-expanded') === 'true';
              notificationTrigger.setAttribute('aria-expanded', !expanded);
              notificationPanel.classList.toggle('is-open');
            };
            notificationTrigger.setAttribute('aria-haspopup', 'true');
            notificationTrigger.setAttribute('aria-expanded', 'false');
            notificationTrigger.addEventListener('click', toggleNotifications);

            document.addEventListener('click', (e) => {
              if (!notificationTool.contains(e.target) && notificationTrigger.getAttribute('aria-expanded') === 'true') {
                notificationTrigger.setAttribute('aria-expanded', 'false');
                notificationPanel.classList.remove('is-open');
              }
            });
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && notificationTrigger.getAttribute('aria-expanded') === 'true') {
                notificationTrigger.setAttribute('aria-expanded', 'false');
                notificationPanel.classList.remove('is-open');
              }
            });
          }
        }
        return;
      }
    }
  });

  // Global listeners for desktop navigation to close on outside click/escape
  if (desktopNavMoved) {
    document.addEventListener('click', (e) => {
      // Only close if click is outside nav and not within a tool element that manages its own dropdown (like notification)
      if (!navContainer.contains(e.target) && !toolsContainer.contains(e.target)) {
        closeAllDropdowns(navContainer);
      }
    });
    document.addEventListener('keydown', (e) => handleEscapeKey(e, navContainer));
  }

  // Add resize listener for desktop/mobile interaction switching
  let currentViewportIsDesktop = isDesktop();
  window.addEventListener('resize', () => {
    if (isDesktop() !== currentViewportIsDesktop) {
      currentViewportIsDesktop = isDesktop();
      // Re-initialize dropdowns to apply correct event listeners (hover vs click)
      if (desktopNavMoved) {
        closeAllDropdowns(navContainer, 0); // Close any open desktop menus
        setupDropdowns(navContainer.querySelector('.header__navbar--list'), 0); // Re-setup desktop
      }
      if (mobileNavMoved) {
        // Close mobile menu if open
        const mobileMenu = navContainer.querySelector('nav.header__hamburger--menu');
        const hamburgerBtn = toolsContainer.querySelector('.header__hamburger-toggle');
        if (mobileMenu?.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            hamburgerBtn?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            hamburgerBtn?.querySelector('.icon-hamburger').style.display = 'block';
            hamburgerBtn?.querySelector('.icon-close').style.display = 'none';
        }
        closeAllDropdowns(mobileMenu, 0); // Close any open mobile accordions
        setupDropdowns(mobileMenu, 0); // Re-setup mobile
      }
    }
  });

  // Final step for EDS, moves data-attributes and other instrumentation
  moveInstrumentation(fragment, block);
}