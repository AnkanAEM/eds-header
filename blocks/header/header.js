import { getMetadata } from '/scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default function decorate(block) {
  // The block passed is assumed to be the <header> element itself,
  // which contains the initial navigation structure within a '.wrap' div.
  const wrapElement = block.querySelector('.wrap');

  if (!wrapElement) {
    console.warn('Header block is missing the .wrap element, skipping decoration.');
    return;
  }

  // --- Core Structural Setup ---

  // 1. Create nav-brand wrapper for logos
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand');

  const mainLogo = wrapElement.querySelector('.logo:not(.year-80-logo)');
  if (mainLogo) {
    navBrand.append(mainLogo);
  }
  const year80Logo = wrapElement.querySelector('.logo.year-80-logo');
  if (year80Logo) {
    navBrand.append(year80Logo); // Append the 80th year logo alongside the main logo
  }

  // 2. Create nav-hamburger wrapper
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburger = wrapElement.querySelector('.hamburger');
  if (hamburger) {
    navHamburger.append(hamburger);
  }

  // 3. Create nav-menu wrapper for the main navigation
  const navMenu = document.createElement('div');
  navMenu.classList.add('nav-menu');
  const existingMainNav = wrapElement.querySelector('.main-nav');
  if (existingMainNav) {
    navMenu.append(existingMainNav);
  }

  // 4. Create nav-tools wrapper for contact and search icons
  const navTools = document.createElement('div');
  const mobileIconNav = wrapElement.querySelector('.icon-nav.mobile-menus-icon');
  const desktopIconNav = wrapElement.querySelector('.icon-nav.desktop-menus-icon');
  if (mobileIconNav) {
    navTools.append(mobileIconNav);
  }
  if (desktopIconNav) {
    navTools.append(desktopIconNav);
  }
  // Only add the 'nav-tools' class if there are actual tools present
  if (navTools.children.length > 0) {
    navTools.classList.add('nav-tools');
  }

  // Clear the original content inside the '.wrap' element
  wrapElement.innerHTML = '';

  // Append the new structural elements in the desired order
  wrapElement.append(navBrand, navHamburger, navMenu, navTools);

  // Add the 'nav-wrapper' class to the element that contains all navigation components
  // (which is the '.wrap' element in this case, as it's the main container inside <header>)
  wrapElement.classList.add('nav-wrapper');

  // --- Plugin Calls ---
  setupSubmenuBehaviors(block);
  setupMobileAndSearch(block);
}

// NOTE: The functions 'setupSubmenuBehaviors' and 'setupMobileAndSearch'
// are NOT defined here, as per the instructions. They are assumed to be
// available in the scope where this 'decorate' function is used/imported.

function setupSubmenuBehaviors(block) {
    const mobileBreakpoint = 991; // Based on media query in provided CSS

    function isMobile() {
        return window.innerWidth <= mobileBreakpoint;
    }

    /**
     * Closes all active sub-menus (removes 'active' and 'active-child' classes)
     * within a specified container element.
     * @param {HTMLElement} container The element to scope the menu closing to.
     */
    function closeAllMenusInScope(container) {
        container.querySelectorAll('li.has-child.active').forEach(item => {
            item.classList.remove('active');
        });
        container.querySelectorAll('.has-sub-child.active').forEach(item => {
            item.classList.remove('active');
        });
        container.querySelectorAll('.has-inner-sub-child.active-child').forEach(item => {
            item.classList.remove('active-child');
        });
    }

    // --- Desktop Hover Handlers ---

    /**
     * Handles mouse enter for top-level navigation items (li.has-child).
     * Activates the mega-menu dropdown on desktop.
     * `this` refers to the li.has-child element.
     */
    function handleMainItemMouseEnter() {
        if (!isMobile()) {
            this.classList.add('active');
        }
    }

    /**
     * Handles mouse leave for top-level navigation items (li.has-child).
     * Deactivates the mega-menu dropdown and its nested menus on desktop.
     * `this` refers to the li.has-child element.
     */
    function handleMainItemMouseLeave() {
        if (!isMobile()) {
            this.classList.remove('active');
            closeAllMenusInScope(this); // Close any nested open menus when main item is unhovered
        }
    }

    /**
     * Handles mouse enter for sub-level navigation items (li.top-level-li).
     * Activates the nested 'has-sub-child' menu on desktop.
     * `this` refers to the li.top-level-li element.
     */
    function handleSubItemMouseEnter() {
        if (!isMobile()) {
            const subMenuDiv = this.querySelector('.has-sub-child');
            if (subMenuDiv) {
                subMenuDiv.classList.add('active');
            }
        }
    }

    /**
     * Handles mouse leave for sub-level navigation items (li.top-level-li).
     * Deactivates the nested 'has-sub-child' menu and its children on desktop.
     * `this` refers to the li.top-level-li element.
     */
    function handleSubItemMouseLeave() {
        if (!isMobile()) {
            const subMenuDiv = this.querySelector('.has-sub-child');
            if (subMenuDiv) {
                subMenuDiv.classList.remove('active');
                closeAllMenusInScope(subMenuDiv); // Close any nested open menus when sub-item is unhovered
            }
        }
    }

    /**
     * Handles mouse enter for inner sub-level navigation items (li.first-level-li).
     * Activates the 'has-inner-sub-child' menu on desktop.
     * `this` refers to the li.first-level-li element.
     */
    function handleInnerSubItemMouseEnter() {
        if (!isMobile()) {
            const innerSubMenuDiv = this.querySelector('.has-inner-sub-child');
            if (innerSubMenuDiv) {
                innerSubMenuDiv.classList.add('active-child');
            }
        }
    }

    /**
     * Handles mouse leave for inner sub-level navigation items (li.first-level-li).
     * Deactivates the 'has-inner-sub-child' menu on desktop.
     * `this` refers to the li.first-level-li element.
     */
    function handleInnerSubItemMouseLeave() {
        if (!isMobile()) {
            const innerSubMenuDiv = this.querySelector('.has-inner-sub-child');
            if (innerSubMenuDiv) {
                innerSubMenuDiv.classList.remove('active-child');
            }
        }
    }

    // --- Mobile Click Handlers ---

    /**
     * Handles click for top-level navigation items (li.has-child) on mobile.
     * Toggles the 'active' class on the li.has-child to show/hide the mega-menu.
     * Closes other open top-level menus when one is clicked.
     * @param {Event} event The click event.
     */
    function handleMobileMainItemClick(event) {
        if (isMobile()) {
            // Find the closest anchor or span element that was clicked, within an li.has-child
            const clickedLinkOrSpan = event.target.closest('a') || event.target.closest('span');
            const parentLi = clickedLinkOrSpan ? clickedLinkOrSpan.closest('li.has-child') : null;

            // Ensure the click originated from a top-level nav item directly under the main block's ul
            if (parentLi && parentLi.closest('ul') === block.querySelector('ul[itemscope]')) {
                event.preventDefault(); // Prevent navigating
                event.stopPropagation(); // Stop propagation to prevent document click from closing

                const wasActive = parentLi.classList.contains('active');

                // Close all other top-level menus and their nested children
                block.querySelectorAll('ul[itemscope] > li.has-child.active').forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('active');
                        closeAllMenusInScope(li);
                    }
                });

                // Toggle the clicked top-level menu
                if (!wasActive) {
                    parentLi.classList.add('active');
                } else {
                    parentLi.classList.remove('active');
                    closeAllMenusInScope(parentLi); // Close its own nested menus if collapsing
                }
            }
        }
    }

    /**
     * Handles click for sub-level navigation items (li.top-level-li) on mobile.
     * Toggles the 'active' class on the div.has-sub-child to show/hide it.
     * Closes other open sibling sub-menus when one is clicked.
     * @param {Event} event The click event.
     */
    function handleMobileSubItemClick(event) {
        if (isMobile()) {
            const clickedLinkOrSpan = event.target.closest('a') || event.target.closest('span');
            const parentLi = clickedLinkOrSpan ? clickedLinkOrSpan.closest('li.top-level-li') : null;
            const subMenuDiv = parentLi ? parentLi.querySelector('.has-sub-child') : null;

            if (parentLi && subMenuDiv) {
                event.preventDefault();
                event.stopPropagation(); // Prevent propagation to parent menu

                const wasActive = subMenuDiv.classList.contains('active');

                // Close other active sibling sub-menus and their children within the same parent ul
                parentLi.parentNode.querySelectorAll('li.top-level-li').forEach(siblingLi => {
                    const siblingSubMenu = siblingLi.querySelector('.has-sub-child');
                    if (siblingSubMenu && siblingSubMenu !== subMenuDiv && siblingSubMenu.classList.contains('active')) {
                        siblingSubMenu.classList.remove('active');
                        closeAllMenusInScope(siblingSubMenu);
                    }
                });

                // Toggle the clicked sub-menu
                if (!wasActive) {
                    subMenuDiv.classList.add('active');
                } else {
                    subMenuDiv.classList.remove('active');
                    closeAllMenusInScope(subMenuDiv); // Close its own nested menus if collapsing
                }
            }
        }
    }

    /**
     * Handles click for inner sub-level navigation items (li.first-level-li) on mobile.
     * Toggles the 'active-child' class on the div.has-inner-sub-child to show/hide it.
     * Closes other open sibling inner sub-menus when one is clicked.
     * @param {Event} event The click event.
     */
    function handleMobileInnerSubItemClick(event) {
        if (isMobile()) {
            const clickedLinkOrSpan = event.target.closest('a') || event.target.closest('span');
            const parentLi = clickedLinkOrSpan ? clickedLinkOrSpan.closest('li.first-level-li') : null;
            const innerSubMenuDiv = parentLi ? parentLi.querySelector('.has-inner-sub-child') : null;

            if (parentLi && innerSubMenuDiv) {
                event.preventDefault();
                event.stopPropagation(); // Prevent propagation to parent menu

                const wasActive = innerSubMenuDiv.classList.contains('active-child');

                // Close other active sibling inner sub-menus within the same parent ul
                parentLi.parentNode.querySelectorAll('li.first-level-li').forEach(siblingLi => {
                    const siblingInnerSubMenu = siblingLi.querySelector('.has-inner-sub-child');
                    if (siblingInnerSubMenu && siblingInnerSubMenu !== innerSubMenuDiv && siblingInnerSubMenu.classList.contains('active-child')) {
                        siblingInnerSubMenu.classList.remove('active-child');
                    }
                });

                // Toggle the clicked inner sub-menu
                if (!wasActive) {
                    innerSubMenuDiv.classList.add('active-child');
                } else {
                    innerSubMenuDiv.classList.remove('active-child');
                }
            }
        }
    }

    /**
     * Global click handler for mobile to close all menus if the click occurs outside
     * the main navigation area.
     * @param {Event} event The click event.
     */
    function closeAllMenusIfOutside(event) {
        if (isMobile()) {
            const mainHeader = document.querySelector('.main-header'); // Assuming main-header is the outermost container for navigation
            if (mainHeader && !mainHeader.contains(event.target)) {
                closeAllMenusInScope(block); // Close all menus inside the navigation block
            }
        }
    }

    /**
     * Attaches all relevant event listeners (hover for desktop, click for mobile).
     * Clears any previously attached listeners to prevent duplicates.
     */
    function attachListeners() {
        // Clear existing listeners first to prevent duplicates when switching modes
        removeListeners();

        // Select all menu items that can trigger a dropdown
        const topLevelNavItems = block.querySelectorAll('ul[itemscope] > li.has-child');
        const subLevelNavItems = block.querySelectorAll('.mega-menu .sub-nav-wrap ul > li.top-level-li');
        const innerSubLevelNavItems = block.querySelectorAll('.has-sub-child ul > li.first-level-li');

        if (isMobile()) {
            topLevelNavItems.forEach(li => {
                const clickableElements = li.querySelectorAll('a, span'); // Both the link and the arrow span
                clickableElements.forEach(el => el.addEventListener('click', handleMobileMainItemClick));
            });
            subLevelNavItems.forEach(li => {
                const clickableElements = li.querySelectorAll('a, span');
                clickableElements.forEach(el => el.addEventListener('click', handleMobileSubItemClick));
            });
            innerSubLevelNavItems.forEach(li => {
                const clickableElements = li.querySelectorAll('a, span');
                clickableElements.forEach(el => el.addEventListener('click', handleMobileInnerSubItemClick));
            });
            document.addEventListener('click', closeAllMenusIfOutside);
        } else { // Desktop
            topLevelNavItems.forEach(li => {
                li.addEventListener('mouseenter', handleMainItemMouseEnter);
                li.addEventListener('mouseleave', handleMainItemMouseLeave);
            });
            subLevelNavItems.forEach(li => {
                li.addEventListener('mouseenter', handleSubItemMouseEnter);
                li.addEventListener('mouseleave', handleSubItemMouseLeave);
            });
            innerSubLevelNavItems.forEach(li => {
                li.addEventListener('mouseenter', handleInnerSubItemMouseEnter);
                li.addEventListener('mouseleave', handleInnerSubItemMouseLeave);
            });
        }
    }

    /**
     * Removes all event listeners for both desktop and mobile modes.
     */
    function removeListeners() {
        const topLevelNavItems = block.querySelectorAll('ul[itemscope] > li.has-child');
        const subLevelNavItems = block.querySelectorAll('.mega-menu .sub-nav-wrap ul > li.top-level-li');
        const innerSubLevelNavItems = block.querySelectorAll('.has-sub-child ul > li.first-level-li');

        topLevelNavItems.forEach(li => {
            li.removeEventListener('mouseenter', handleMainItemMouseEnter);
            li.removeEventListener('mouseleave', handleMainItemMouseLeave);
            const clickableElements = li.querySelectorAll('a, span');
            clickableElements.forEach(el => el.removeEventListener('click', handleMobileMainItemClick));
        });
        subLevelNavItems.forEach(li => {
            li.removeEventListener('mouseenter', handleSubItemMouseEnter);
            li.removeEventListener('mouseleave', handleSubItemMouseLeave);
            const clickableElements = li.querySelectorAll('a, span');
            clickableElements.forEach(el => el.removeEventListener('click', handleMobileSubItemClick));
        });
        innerSubLevelNavItems.forEach(li => {
            li.removeEventListener('mouseenter', handleInnerSubItemMouseEnter);
            li.removeEventListener('mouseleave', handleInnerSubItemMouseLeave);
            const clickableElements = li.querySelectorAll('a, span');
            clickableElements.forEach(el => el.removeEventListener('click', handleMobileInnerSubItemClick));
        });
        document.removeEventListener('click', closeAllMenusIfOutside);
    }

    // --- Initialization and Resize Handling ---

    // Initial check for mobile mode
    let currentIsMobile = isMobile();

    // Attach event listeners based on the initial mode
    attachListeners();
    // Ensure all menus are closed initially on page load
    closeAllMenusInScope(block);

    // Add a resize event listener to handle changes between mobile/desktop modes
    window.addEventListener('resize', () => {
        const newIsMobile = isMobile();
        if (newIsMobile !== currentIsMobile) {
            currentIsMobile = newIsMobile;
            closeAllMenusInScope(block); // Close all menus when the display mode changes
            attachListeners(); // Re-attach listeners for the new mode
        }
    });

    // Observe the main navigation block for class changes (e.g., when hamburger toggles it)
    // If the main navigation itself becomes inactive (closed), all its submenus should also close.
    // Assuming 'block' is the `nav.main-nav` element and its 'active' class controls overall visibility.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class' && block) {
                if (!block.classList.contains('active')) {
                    // If main-nav becomes inactive (closed by hamburger), close all its submenus
                    closeAllMenusInScope(block);
                }
            }
        });
    });

    if (block) {
        observer.observe(block, { attributes: true });
    }
}

function setupMobileAndSearch(block) {
    const body = document.body;
    const html = document.documentElement; // Using html element for overflow for better compatibility
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const searchToggles = document.querySelectorAll('.icon-nav .search a'); // Both mobile and desktop search icons
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    const searchInput = document.getElementById('searchInput');

    // Helper function to lock/unlock body scroll
    function toggleBodyScrollLock(lock) {
        if (lock) {
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        } else {
            html.style.overflow = '';
            body.style.overflow = '';
        }
    }

    // Function to close all open menus and unlock scroll
    function closeAllMenus() {
        // Close hamburger menu if open
        if (hamburger && mainNav && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
        }

        // Close search overlay if open
        document.querySelectorAll('.icon-nav .search').forEach(li => li.classList.remove('active'));
        if (searchScreenWrap && searchScreenWrap.classList.contains('active-search-overlay')) {
            searchScreenWrap.classList.remove('active-search-overlay');
            if (searchInput) searchInput.blur(); // Remove focus from search input
        }
        
        // Collapse all open sub-menus (mega-menu, has-sub-child, has-inner-sub-child)
        document.querySelectorAll('.main-nav ul li.active').forEach(li => {
            li.classList.remove('active');
            li.querySelector('.mega-menu')?.classList.remove('active');
            li.querySelector('.has-sub-child')?.classList.remove('active');
            // For the deepest nested has-inner-sub-child, ensure it's closed
            li.querySelectorAll('.has-inner-sub-child.active-child').forEach(innerChild => {
                innerChild.classList.remove('active-child');
            });
        });
        
        // Unlock body scroll
        toggleBodyScrollLock(false);
    }

    // 1. Hamburger menu toggle behavior
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from immediately closing
            const isActive = hamburger.classList.contains('active');

            // If search is open, close it first
            if (searchScreenWrap && searchScreenWrap.classList.contains('active-search-overlay')) {
                // Remove active class from all search toggles
                searchToggles.forEach(toggle => toggle.closest('.search').classList.remove('active'));
                searchScreenWrap.classList.remove('active-search-overlay');
                if (searchInput) searchInput.blur();
            }

            // Toggle hamburger and main navigation active states
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
            toggleBodyScrollLock(!isActive); // Lock scroll if opening, unlock if closing

            // If opening the main nav, ensure all sub-menus are collapsed initially
            if (hamburger.classList.contains('active')) {
                document.querySelectorAll('.main-nav ul li.active').forEach(li => {
                    li.classList.remove('active');
                    li.querySelector('.mega-menu')?.classList.remove('active');
                    li.querySelector('.has-sub-child')?.classList.remove('active');
                });
                document.querySelectorAll('.main-nav ul li .has-inner-sub-child.active-child').forEach(innerChild => {
                    innerChild.classList.remove('active-child');
                });
            }
        });
    }

    // 2. Search overlay toggle behavior
    if (searchToggles.length > 0 && searchScreenWrap && searchInput) {
        searchToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                e.stopPropagation(); // Prevent document click from immediately closing

                const parentLi = toggle.closest('.search');
                const isActive = parentLi.classList.contains('active');

                // Close mobile nav if open
                if (hamburger && mainNav && hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('active');
                }
                
                // Toggle search active state
                parentLi.classList.toggle('active');
                searchScreenWrap.classList.toggle('active-search-overlay');
                toggleBodyScrollLock(!isActive);

                if (!isActive) {
                    searchInput.focus(); // Focus input when opening
                } else {
                    searchInput.blur(); // Blur input when closing
                }
                
                // Collapse all sub-menus when search opens/closes
                document.querySelectorAll('.main-nav ul li.active').forEach(li => {
                    li.classList.remove('active');
                    li.querySelector('.mega-menu')?.classList.remove('active');
                    li.querySelector('.has-sub-child')?.classList.remove('active');
                });
                document.querySelectorAll('.main-nav ul li .has-inner-sub-child.active-child').forEach(innerChild => {
                    innerChild.classList.remove('active-child');
                });
            });
        });

        // Prevent clicks inside the search screen wrap from closing it immediately
        searchScreenWrap.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 3. Sub-menu toggles for navigation (mobile view)
    // Targets any SVG that is a direct child of a span within an LI that can have a sub-menu
    document.querySelectorAll('.main-nav li > span > svg').forEach(svgToggle => {
        svgToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up to parent LI or document
            e.preventDefault(); // Prevent any default SVG link behavior

            const parentLi = svgToggle.closest('li');
            const isActive = parentLi.classList.contains('active');

            // Close all sibling active menus at the same level
            // This ensures only one sub-menu is open at any given level
            Array.from(parentLi.parentNode.children).forEach(siblingLi => {
                if (siblingLi !== parentLi && siblingLi.classList.contains('active')) {
                    siblingLi.classList.remove('active');
                    siblingLi.querySelector('.mega-menu')?.classList.remove('active');
                    siblingLi.querySelector('.has-sub-child')?.classList.remove('active');
                    siblingLi.querySelector('.has-inner-sub-child')?.classList.remove('active-child'); 
                }
            });

            // Toggle 'active' class on the direct parent LI
            parentLi.classList.toggle('active', !isActive);

            // Find the corresponding menu container (.mega-menu, .has-sub-child, or .has-inner-sub-child)
            const targetMenu = parentLi.querySelector('.mega-menu, .has-sub-child, .has-inner-sub-child');
            if (targetMenu) {
                // Toggle the specific active class based on the container type
                if (targetMenu.classList.contains('mega-menu') || targetMenu.classList.contains('has-sub-child')) {
                    targetMenu.classList.toggle('active', !isActive);
                } else if (targetMenu.classList.contains('has-inner-sub-child')) {
                    targetMenu.classList.toggle('active-child', !isActive);
                }
            }
        });
    });

    // 4. Close menus when clicking outside
    document.addEventListener('click', (e) => {
        const isHamburgerOpen = hamburger && hamburger.classList.contains('active');
        const isSearchOpen = searchScreenWrap && searchScreenWrap.classList.contains('active-search-overlay');
        
        if (isHamburgerOpen || isSearchOpen) {
            const isClickInsideMainNav = mainNav && mainNav.contains(e.target);
            const isClickInsideHamburger = hamburger && hamburger.contains(e.target);
            const isClickInsideSearch = searchScreenWrap && searchScreenWrap.contains(e.target);
            const isClickOnSearchToggle = Array.from(searchToggles).some(toggle => toggle.contains(e.target));

            // If a menu is open and the click is outside all menu-related elements, close all.
            if ((isHamburgerOpen && !isClickInsideMainNav && !isClickInsideHamburger) || 
                (isSearchOpen && !isClickInsideSearch && !isClickOnSearchToggle)) {
                closeAllMenus();
            }
        }
    });

    // 5. Close menus on window resize (especially for desktop breakpoint transition)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Assuming 992px is the desktop breakpoint based on provided CSS media queries
            if (window.innerWidth >= 992) { 
                closeAllMenus(); // Ensure menus are closed on desktop view
            }
        }, 150); // Debounce to prevent excessive calls during resizing
    });

    // 6. Initial state check on load for larger screens
    // Ensure menus are closed if loaded directly into a desktop view
    if (window.innerWidth >= 992) {
        closeAllMenus(); 
    }
}