import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.innerHTML = ''; // Idempotency: Clear existing block content

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return;
  }

  // Find the relevant header content from the loaded fragment
  // Assuming navContent contains the .header__wrapper or its children directly
  const sourceHeaderWrapper = navContent.querySelector('.header__wrapper');
  if (!sourceHeaderWrapper) {
    // Minimal fallback: if a header tag exists in the fragment, use it directly
    const headerEl = navContent.querySelector('header');
    if (headerEl) {
        block.append(headerEl);
        moveInstrumentation(navContent, block);
        if (navContent.parentNode) navContent.parentNode.removeChild(navContent);
        return;
    }
    return; // If expected structure not found, exit.
  }

  // Create the main header element that will contain all parts
  const newHeader = document.createElement('header');
  newHeader.className = 'header';
  newHeader.classList.add('position-fixed', 'top-0', 'w-100'); // Replicate original fixed positioning

  // Create an internal wrapper for the desktop layout (brand, main nav, tools)
  const newHeaderWrapper = document.createElement('div');
  newHeaderWrapper.className = 'header-wrapper';
  newHeader.append(newHeaderWrapper);

  // --- Move Global Overlay ---
  // The overlay is conceptually part of the header but needs to be a direct child
  // of the top-level <header> for full-screen behavior.
  const overlay = sourceHeaderWrapper.querySelector('.header__overlay');
  if (overlay) {
    newHeader.append(overlay);
    overlay.classList.add('header-overlay');
    overlay.classList.remove('d-none'); // Ensure it's not hidden by default for mobile logic
  }

  // --- Move Mobile Navigation (Hamburger Menu and its content) ---
  // This also needs to be a direct child of newHeader for full-screen mobile menu behavior.
  const mobileNav = sourceHeaderWrapper.querySelector('.header__hamburger--menu');
  if (mobileNav) {
    newHeader.append(mobileNav);
    mobileNav.classList.add('header-mobile-nav');
    mobileNav.classList.remove('position-fixed', 'd-flex', 'flex-column', 'gap-6'); // Remove original positioning

    // Standardize classes for mobile menu items for consistent styling
    mobileNav.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.add('header-mobile-nav-item');
      const heading = item.querySelector('.accordion-header');
      const button = item.querySelector('.accordion-button');
      const collapse = item.querySelector('.accordion-collapse');
      if (heading) heading.classList.add('header-mobile-nav-heading');
      if (button) {
          button.classList.add('header-mobile-nav-button');
          button.removeAttribute('type'); // Remove type="button" to prevent default submit
          button.setAttribute('aria-expanded', 'false'); // Initial state is closed
          button.classList.remove('collapsed'); // Remove AEM default class
      }
      if (collapse) {
        collapse.classList.add('header-mobile-nav-collapse');
        collapse.classList.remove('collapse', 'show'); // Remove AEM default class
      }

      // Ensure that any rich content within mobile dropdowns also get standardized classes
      collapse?.querySelectorAll('.sublinksNavigator, .subLevelLinks, .seasonalbanner, .dropdown-item').forEach(subContent => {
          subContent.classList.add('header-mobile-dropdown-content');
          subContent.querySelectorAll('ul').forEach(ul => ul.classList.add('header-mobile-submenu'));
          subContent.querySelectorAll('li').forEach(li => li.classList.add('header-mobile-submenu-item'));
          subContent.querySelectorAll('a').forEach(a => a.classList.add('header-mobile-submenu-link'));
      });
    });

    // Move social and app links for mobile if they are separate from main mobile nav content
    const mobileAppSection = mobileNav.querySelector('.header__accordion--app');
    if (mobileAppSection) mobileAppSection.classList.add('header-mobile-app-links');
    const mobileSocials = mobileNav.querySelector('.header__socials');
    if (mobileSocials) mobileSocials.classList.add('header-mobile-socials');
  }

  // --- Process Desktop Navigation (`header__navbar`) ---
  // This element contains the logo, main navigation list, and desktop tools.
  const desktopNavbar = sourceHeaderWrapper.querySelector('.header__navbar');
  if (desktopNavbar) {
    desktopNavbar.classList.add('header-desktop-nav-container');

    // Extract and move Brand/Logo
    const brandLink = desktopNavbar.querySelector('.header__logo');
    if (brandLink) {
      newHeaderWrapper.append(brandLink);
      brandLink.classList.add('header-brand');
    }

    // Extract and move Main Desktop Navigation List
    const mainDesktopNavList = desktopNavbar.querySelector('.header__navbar--collapse');
    if (mainDesktopNavList) {
      const ulElement = mainDesktopNavList.querySelector('.header__navbar--list');
      if(ulElement) {
        ulElement.classList.add('header-main-nav'); // Standard class for the main UL
        newHeaderWrapper.append(ulElement);

        ulElement.querySelectorAll('.header__navbar--item').forEach(item => {
          item.classList.add('header-nav-item'); // Standardize L0 item class
          const desktopDropdown = item.querySelector('.header__navbar--dropdown');
          if (desktopDropdown) {
            item.classList.add('has-dropdown');
            desktopDropdown.classList.add('header-dropdown-wrapper'); // Standardize dropdown container
            desktopDropdown.removeAttribute('aria-labelledby'); // Remove specific AEM aria attribute
            desktopDropdown.classList.remove('position-fixed', 'w-100', 'start-0', 'pt-12', 'pb-8'); // Remove conflicting styles

            // Standardize classes for content within desktop dropdowns (L1/L2, banners, etc.)
            desktopDropdown.querySelectorAll('.sublinksNavigator, .subLevelLinks, .seasonalbanner, .dropdown-item').forEach(subContent => {
                subContent.classList.add('header-dropdown-subitem');
                subContent.querySelectorAll('ul').forEach(ul => ul.classList.add('header-submenu'));
                subContent.querySelectorAll('li').forEach(li => li.classList.add('header-submenu-item'));
                subContent.querySelectorAll('a').forEach(a => a.classList.add('header-submenu-link'));
            });
          }
        });
      }
    }

    // Extract and move Desktop Utility Tools
    const desktopTools = desktopNavbar.querySelector('.navigation__buttons');
    if (desktopTools) {
      newHeaderWrapper.append(desktopTools);
      desktopTools.classList.add('header-tools'); // Standard class for tools container

      // Standardize classes for individual tool elements
      desktopTools.querySelectorAll('.header__search, .header__notification--trigger, .header__login, .header__hamburger--button').forEach(tool => {
        // Extract a simpler class name for styling
        const baseClass = tool.className.split(' ').find(cls => cls.startsWith('header__'))?.split('__')[1];
        if (baseClass) {
          tool.classList.add(`header-tool-${baseClass}`);
        }
        // Ensure hamburger button has correct aria attributes for state management
        if (tool.classList.contains('header__hamburger--button')) {
            tool.setAttribute('aria-haspopup', 'true');
            tool.setAttribute('aria-expanded', 'false');
        }
      });

      // Move search and notification panels to be direct children of newHeader for proper absolute positioning
      const searchPanel = desktopTools.querySelector('.global__search--wrapper');
      if (searchPanel) {
        newHeader.append(searchPanel);
        searchPanel.classList.add('header-search-panel');
      }
      const notificationPanel = desktopTools.querySelector('.header__notification--panel');
      if (notificationPanel) {
        newHeader.append(notificationPanel);
        notificationPanel.classList.add('header-notification-panel');
      }
    }
  }

  // Append the fully constructed header to the block
  block.append(newHeader);

  // --- Interaction Logic ---
  const desktopBreakpoint = 900; 
  const isDesktop = () => window.innerWidth >= desktopBreakpoint;

  function closeAllDropdowns(container = newHeader) {
    container.querySelectorAll('[aria-expanded="true"]').forEach(el => {
      el.setAttribute('aria-expanded', 'false');
      const nextSibling = el.nextElementSibling;
      if (nextSibling) {
        nextSibling.classList.remove('is-open');
      }
    });
    newHeader.querySelector('.header-search-panel')?.classList.remove('is-open');
    newHeader.querySelector('.header-notification-panel')?.classList.remove('is-open');
  }

  function handleHamburgerMenu() {
    const hamburgerBtn = newHeader.querySelector('.header-tool-hamburger--button');
    const mobileMenu = newHeader.querySelector('.header-mobile-nav');
    const headerOverlay = newHeader.querySelector('.header-overlay');
    const mobileCloseBtn = mobileMenu?.querySelector('.header__hamburger--close-icon');

    if (!hamburgerBtn || !mobileMenu || !headerOverlay) return;

    const toggleMenu = (open) => {
      const shouldOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', shouldOpen);
      headerOverlay.classList.toggle('is-open', shouldOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(shouldOpen));
      document.body.classList.toggle('no-scroll', shouldOpen);
      if (!shouldOpen) {
        closeAllDropdowns(mobileMenu); // Close any open submenus when closing main mobile menu
      }
    };

    // Remove existing listeners to prevent duplicates (idempotency)
    hamburgerBtn.removeEventListener('click', toggleMenu);
    mobileCloseBtn?.removeEventListener('click', toggleMenu);
    headerOverlay.removeEventListener('click', toggleMenu);

    hamburgerBtn.addEventListener('click', () => toggleMenu());
    mobileCloseBtn?.addEventListener('click', () => toggleMenu(false));
    headerOverlay.addEventListener('click', () => toggleMenu(false)); // Close on overlay click
  }

  function setupDesktopNavDropdowns() {
    const navItems = newHeader.querySelectorAll('.header-main-nav > .header-nav-item.has-dropdown');

    navItems.forEach(item => {
      const link = item.querySelector('a'); // L0 trigger
      const dropdown = item.querySelector('.header-dropdown-wrapper'); // L1 container

      if (!link || !dropdown) return;

      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      const openDropdown = () => {
        if (isDesktop()) {
          closeAllDropdowns(newHeaderWrapper); // Close other L0 dropdowns in desktop nav
          link.setAttribute('aria-expanded', 'true');
          dropdown.classList.add('is-open');
        }
      };

      const closeDropdown = (e) => {
        if (isDesktop() && !item.contains(e.relatedTarget)) {
          link.setAttribute('aria-expanded', 'false');
          dropdown.classList.remove('is-open');
        }
      };

      // Remove existing listeners before adding to prevent duplicates
      item.removeEventListener('mouseenter', openDropdown);
      item.removeEventListener('mouseleave', closeDropdown);
      item.addEventListener('mouseenter', openDropdown);
      item.addEventListener('mouseleave', closeDropdown);

      // Setup for nested submenus (L1/L2) within the desktop dropdown
      item.querySelectorAll('.header-dropdown-subitem.has-dropdown').forEach(subItem => {
        const subLink = subItem.querySelector('a');
        const subMenu = subItem.querySelector('.header-submenu');

        if (!subLink || !subMenu) return;

        subLink.setAttribute('aria-haspopup', 'true');
        subLink.setAttribute('aria-expanded', 'false');

        const openSubMenu = () => {
          if (isDesktop()) {
            // Close other sibling submenus at this level
            subItem.parentNode.querySelectorAll('.header-dropdown-subitem.has-dropdown > a[aria-expanded="true"]').forEach(otherSubLink => {
                if (otherSubLink !== subLink) {
                    otherSubLink.setAttribute('aria-expanded', 'false');
                    otherSubLink.nextElementSibling?.classList.remove('is-open');
                }
            });
            subLink.setAttribute('aria-expanded', 'true');
            subMenu.classList.add('is-open');
          }
        };

        const closeSubMenu = (e) => {
          if (isDesktop() && !subItem.contains(e.relatedTarget)) {
            subLink.setAttribute('aria-expanded', 'false');
            subMenu.classList.remove('is-open');
          }
        };

        subItem.removeEventListener('mouseenter', openSubMenu);
        subItem.removeEventListener('mouseleave', closeSubMenu);
        subItem.addEventListener('mouseenter', openSubMenu);
        subItem.addEventListener('mouseleave', closeSubMenu);
      });
    });
  }

  function setupMobileNavAccordion() {
    const mobileNavItems = newHeader.querySelectorAll('.header-mobile-nav-item');

    mobileNavItems.forEach(item => {
      const button = item.querySelector('.header-mobile-nav-button');
      const collapsePanel = item.querySelector('.header-mobile-nav-collapse');

      if (!button || !collapsePanel) return;

      // Remove existing listeners before adding to prevent duplicates
      button.removeEventListener('click', handleButtonClick);
      button.addEventListener('click', handleButtonClick);

      function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent document.click from closing immediately

        const isOpen = button.getAttribute('aria-expanded') === 'true';

        // Close other open mobile nav items (L0) in the main mobile menu
        mobileNavItems.forEach(otherItem => {
          const otherButton = otherItem.querySelector('.header-mobile-nav-button');
          const otherCollapse = otherItem.querySelector('.header-mobile-nav-collapse');
          if (otherButton && otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
            otherButton.setAttribute('aria-expanded', 'false');
            otherCollapse?.classList.remove('is-open');
            // Also close any nested open submenus within other items
            otherCollapse?.querySelectorAll('[aria-expanded="true"]').forEach(el => {
                el.setAttribute('aria-expanded', 'false');
                el.nextElementSibling?.classList.remove('is-open');
            });
          }
        });

        button.setAttribute('aria-expanded', String(!isOpen));
        collapsePanel.classList.toggle('is-open', !isOpen);

        // Setup for nested submenus within mobile accordion (L1/L2)
        collapsePanel.querySelectorAll('.header-mobile-submenu-item').forEach(subItem => {
            const subLink = subItem.querySelector('.header-mobile-submenu-link');
            const subMenu = subItem.querySelector('.header-mobile-submenu');
            if (subLink && subMenu) {
                subLink.setAttribute('aria-expanded', 'false'); // Initial state for nested submenus
                subLink.setAttribute('aria-haspopup', 'true');

                // Remove existing listeners before adding
                subLink.removeEventListener('click', handleSubLinkClick);
                subLink.addEventListener('click', handleSubLinkClick);
            }

            function handleSubLinkClick(subE) {
                subE.preventDefault();
                subE.stopPropagation();
                const subIsOpen = subLink.getAttribute('aria-expanded') === 'true';
                // Close other sibling submenus at this level
                subItem.parentNode.querySelectorAll('.header-mobile-submenu-item > .header-mobile-submenu-link[aria-expanded="true"]').forEach(otherSubLink => {
                    if (otherSubLink !== subLink) {
                        otherSubLink.setAttribute('aria-expanded', 'false');
                        otherSubLink.nextElementSibling?.classList.remove('is-open');
                    }
                });
                subLink.setAttribute('aria-expanded', String(!subIsOpen));
                subMenu.classList.toggle('is-open', !subIsOpen);
            }
        });
      }
    });
  }

  function setupToolInteractions() {
    const searchTrigger = newHeader.querySelector('.header-tool-search');
    const searchPanel = newHeader.querySelector('.header-search-panel');
    const searchClose = searchPanel?.querySelector('.close-search');

    if (searchTrigger && searchPanel && searchClose) {
        // Remove existing listeners before adding
        searchTrigger.removeEventListener('click', handleSearchTriggerClick);
        searchClose.removeEventListener('click', handleSearchCloseClick);
        searchPanel.removeEventListener('click', handlePanelClick);

        searchTrigger.addEventListener('click', handleSearchTriggerClick);
        searchClose.addEventListener('click', handleSearchCloseClick);
        searchPanel.addEventListener('click', handlePanelClick); // Keep panel open on internal clicks

        function handleSearchTriggerClick(e) {
            e.stopPropagation();
            const isOpen = searchPanel.classList.contains('is-open');
            closeAllDropdowns(); // Close other open elements
            searchPanel.classList.toggle('is-open', !isOpen);
        }

        function handleSearchCloseClick() {
            searchPanel.classList.remove('is-open');
        }

        function handlePanelClick(e) {
            e.stopPropagation();
        }
    }

    const notificationTrigger = newHeader.querySelector('.header-tool-notification--trigger');
    const notificationPanel = newHeader.querySelector('.header-notification-panel');

    if (notificationTrigger && notificationPanel) {
        // Remove existing listeners before adding
        notificationTrigger.removeEventListener('click', handleNotificationTriggerClick);
        notificationPanel.removeEventListener('click', handlePanelClick);

        notificationTrigger.addEventListener('click', handleNotificationTriggerClick);
        notificationPanel.addEventListener('click', handlePanelClick); // Keep panel open on internal clicks

        function handleNotificationTriggerClick(e) {
            e.stopPropagation();
            const isOpen = notificationPanel.classList.contains('is-open');
            closeAllDropdowns(); // Close other open elements
            notificationPanel.classList.toggle('is-open', !isOpen);
        }

        function handlePanelClick(e) {
            e.stopPropagation();
        }
    }
  }

  function applyGlobalInteractions() {
    // Close on escape key
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);

    function handleEscapeKey(e) {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        newHeader.querySelector('.header-mobile-nav')?.classList.remove('is-open');
        newHeader.querySelector('.header-overlay')?.classList.remove('is-open');
        newHeader.querySelector('.header-tool-hamburger--button')?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    }

    // Close on outside click for desktop dropdowns and tools panels
    document.removeEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleOutsideClick);

    function handleOutsideClick(e) {
        // If desktop, close desktop dropdowns and panels
        if (isDesktop()) {
            const isClickInsideHeader = newHeader.contains(e.target);
            if (!isClickInsideHeader) {
                closeAllDropdowns();
            }
        }
        // Mobile menu outside click is handled by the overlay already, so no need to duplicate logic here for mobile. 
        // However, if any tool panels are open in mobile context, they also need to be closed.
        const mobileNav = newHeader.querySelector('.header-mobile-nav');
        const searchPanel = newHeader.querySelector('.header-search-panel');
        const notificationPanel = newHeader.querySelector('.header-notification-panel');
        const hamburgerBtn = newHeader.querySelector('.header-tool-hamburger--button');

        const searchTrigger = newHeader.querySelector('.header-tool-search');
        const notificationTrigger = newHeader.querySelector('.header-tool-notification--trigger');

        // Close search/notification panels if clicked outside and they are open
        if (searchPanel?.classList.contains('is-open') && !searchPanel.contains(e.target) && !searchTrigger?.contains(e.target)) {
            searchPanel.classList.remove('is-open');
        }
        if (notificationPanel?.classList.contains('is-open') && !notificationPanel.contains(e.target) && !notificationTrigger?.contains(e.target)) {
            notificationPanel.classList.remove('is-open');
        }
    }
  }

  // Apply all interactions
  handleHamburgerMenu();
  setupDesktopNavDropdowns();
  setupMobileNavAccordion();
  setupToolInteractions();
  applyGlobalInteractions();

  // Final instrumentation and cleanup
  moveInstrumentation(navContent, block); 

  // Safely remove the loaded fragment from the DOM after instrumentation
  if (navContent.parentNode) {
    navContent.parentNode.removeChild(navContent);
  }
}
