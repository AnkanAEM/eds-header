import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../../scripts/lib-franklin.js';

// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

const NAV_CLASSES = {
  BRAND: 'nav-brand',
  SECTIONS: 'nav-sections',
  TOOLS: 'nav-tools',
  OVERLAY: 'header__overlay', // Corrected class name
  HAMBURGER_MENU: 'header__hamburger--menu',
  HAMBURGER_HEAD: 'header__hamburger--head',
  HAMBURGER_HEAD_TITLE: 'header__hamburger--head-title',
  HAMBURGER_CLOSE_ICON: 'header__hamburger--close-icon',
  NOTIFICATION_MOBILE: 'header__notification--mobile',
  ACCORDION: 'accordion',
  ACCORDION_ITEM: 'accordion-item',
  ACCORDION_HEADER: 'accordion-header',
  ACCORDION_HEADING: 'accordion-header', // Corrected to use existing class
  ACCORDION_BUTTON: 'accordion-button', // Corrected to use existing class
  ACCORDION_ARROW: 'header__accordion--arrow',
  ACCORDION_COLLAPSE: 'accordion-collapse',
  ACCORDION_BODY: 'accordion-body', // Corrected to use existing class
  DROPDOWN_ITEM: 'dropdown-item',
  NAVBAR: 'header__navbar',
  NAVBAR_COLLAPSE: 'navbar-collapse', // Corrected to use existing class
  NAVBAR_LIST: 'navbar-nav', // Corrected to use existing class
  NAVBAR_ITEM: 'nav-item',
  NAVBAR_LINK: 'nav-link',
  NAVBAR_ITEM_UNDERLINE: 'header__navbar--item-underline',
  NAV_DROPDOWN: 'nav__dropdown',
  NAVBAR_DROPDOWN_COLUMN: 'header__navbar--dropdown-column',
  NAVIGATION_BUTTONS: 'navigation__buttons',
  HEADER_BUTTONS: 'header__buttons',
  HEADER_SEARCH: 'header__search',
  HEADER_SEARCH_SVG_FIND: 'header__search--svg-find',
  GLOBAL_SEARCH_WRAPPER: 'global__search--wrapper',
  CLOSE_SEARCH: 'close-search',
  NOTIFICATION_TRIGGER: 'header__notification--trigger',
  NOTIFICATION_TRIGGER_TEXT: 'header__notification--trigger-text',
  NOTIFICATION_TRIGGER_SVG: 'header__notification--trigger-svg',
  NOTIFICATION_PANEL: 'header__notification--panel',
  HEADER_LOGIN: 'header__login',
  LOGNTEXT: 'logntext', // Corrected to use existing class
  HEADER_HAMBURGER_BUTTON: 'header__hamburger--button',
  HEADER_HAMBURGER_OPEN: 'header__hamburger--open',
  HEADER_HAMBURGER_CLOSE: 'header__hamburger--close',
  NO_SCROLL: 'no-scroll',
  ACTIVE: 'active',
  SHOW: 'show',
  COLLAPSE: 'collapse',
  COLLAPSED: 'collapsed',
  D_NONE: 'd-none',
  D_MD_NONE: 'd-md-none',
  D_FLEX: 'd-flex',
  JUSTIFY_CONTENT_BETWEEN: 'justify-content-between',
  ALIGN_ITEMS_CENTER: 'align-items-center',
  W_100: 'w-100',
  TEXT_BLACK_500: 'text-black-500',
  ARROW: 'arrow',
  HEADER_ARROW_ICON: 'header_arrow_icon',
  NAVIGATION_LINK: 'navigation_link',
  POSITION_ABSOLUTE: 'position-absolute',
  POSITION_FIXED: 'position-fixed',
  TOP_0: 'top-0',
  END_0: 'end-0',
  FLEX_COLUMN: 'flex-column',
  GAP_6: 'gap-6',
  ALIGN_SELF_END: 'align-self-end',
  Z_2: 'z-2',
  MOBILE_MENU_WRAPPER: 'mobile__menu--wrapper',
  SECTION_CONTAINER_PRIMARY: 'section_container--primary',
  PY_3: 'py-3',
  NAVBAR_EXPAND_MD: 'navbar-expand-md',
  NAVBAR_BRAND: 'navbar-brand',
  P_0: 'p-0',
  HEADER_LOGO: 'header__logo',
  HEADER_LOGO_IMAGE: 'header__logo--image',
  GAP_10: 'gap-10',
  BG_WHITE: 'bg-white',
  PT_12: 'pt-12',
  PB_8: 'pb-8',
  BORDER_0: 'border-0',
  ROUNDED_0: 'rounded-0',
  BG_TRANSPARENT: 'bg-transparent',
  D_MD_BLOCK: 'd-md-block',
  TEXT_NOWRAP: 'text-nowrap',
  HEADER_BACKDROP: 'header__backdrop',
  OVERFLOW_HIDDEN: 'overflow-hidden',
  OVERFLOW_Y_AUTO: 'overflow-y-auto',
};

let navFragment;
let navOverlay;

/**
 * Closes all currently open nav sections.
 * @param {Element} nav The <nav> element.
 */
function closeAllNavSections(nav) {
  nav.querySelectorAll(`.${NAV_CLASSES.NAVBAR_ITEM}[aria-expanded="true"]`).forEach((section) => {
    toggleNavSection(section, false);
  });
  // Also close any open mobile accordions
  const mobileMenu = nav.querySelector(`.${NAV_CLASSES.HAMBURGER_MENU}`);
  if (mobileMenu) {
    mobileMenu.querySelectorAll(`.${NAV_CLASSES.ACCORDION_ITEM}.${NAV_CLASSES.SHOW}`).forEach((item) => {
      const collapseElement = item.querySelector(`.${NAV_CLASSES.ACCORDION_COLLAPSE}`);
      const arrowElement = item.querySelector(`.${NAV_CLASSES.ACCORDION_ARROW}`);
      toggleAccordionItem(item, collapseElement, arrowElement, true); // Force close without closing others
    });
  }
  if (navOverlay) {
    navOverlay.classList.add(NAV_CLASSES.D_NONE);
  }
  document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
}

/**
 * Toggles a specific navigation section (L1 item).
 * @param {HTMLElement} section The L1 navigation item element.
 * @param {boolean} expanded True to expand, false to collapse.
 */
function toggleNavSection(section, expanded) {
  section.setAttribute('aria-expanded', expanded);
  const dropdown = section.querySelector(`.${NAV_CLASSES.NAV_DROPDOWN}`);
  if (dropdown) {
    if (expanded) {
      dropdown.classList.add(NAV_CLASSES.SHOW);
      dropdown.querySelectorAll(`.${NAV_CLASSES.NAVBAR_DROPDOWN_COLUMN}`).forEach((col, i) => {
        // Stagger animation for dropdown columns
        col.style.transitionDelay = `${i * 0.05}s`;
        col.style.opacity = 1;
      });
    } else {
      dropdown.classList.remove(NAV_CLASSES.SHOW);
      dropdown.querySelectorAll(`.${NAV_CLASSES.NAVBAR_DROPDOWN_COLUMN}`).forEach((col) => {
        col.style.opacity = 0;
        col.style.transitionDelay = '0s'; // Reset delay
      });
    }
  }
}

/**
 * Handles desktop navigation hover and click behavior.
 * @param {Element} nav The main nav element.
 */
function setupDesktopNav(nav) {
  const navSections = nav.querySelector(`.${NAV_CLASSES.NAVBAR_LIST}`);
  if (!navSections) return;

  navSections.querySelectorAll(`.${NAV_CLASSES.NAVBAR_ITEM}`).forEach((navSection) => {
    const hasDropdown = navSection.classList.contains('nav-drop');
    if (hasDropdown) {
      // Hover behavior for desktop
      navSection.addEventListener('mouseenter', () => {
        closeAllNavSections(nav);
        toggleNavSection(navSection, true);
        navOverlay.classList.remove(NAV_CLASSES.D_NONE);
      });

      // Keep dropdown open if focus is within it
      navSection.addEventListener('focusin', () => {
        closeAllNavSections(nav);
        toggleNavSection(navSection, true);
        navOverlay.classList.remove(NAV_CLASSES.D_NONE);
      });

      navSection.addEventListener('mouseleave', (e) => {
        // Only close if not moving to a child element
        if (!navSection.contains(e.relatedTarget)) {
          toggleNavSection(navSection, false);
          navOverlay.classList.add(NAV_CLASSES.D_NONE);
        }
      });

      const dropdown = navSection.querySelector(`.${NAV_CLASSES.NAV_DROPDOWN}`);
      if (dropdown) {
        dropdown.addEventListener('mouseleave', (e) => {
          if (!navSection.contains(e.relatedTarget)) {
            toggleNavSection(navSection, false);
            navOverlay.classList.add(NAV_CLASSES.D_NONE);
          }
        });
      }
    }
  });

  // Close all nav sections when clicking outside the nav or overlay
  document.addEventListener('click', (e) => {
    const headerContainer = nav.closest('.header');
    if (headerContainer && !headerContainer.contains(e.target) && !navOverlay.contains(e.target)) {
      closeAllNavSections(nav);
    }
  });

  // Close all nav sections when focus leaves the nav
  nav.addEventListener('focusout', (e) => {
    const headerContainer = nav.closest('.header');
    if (headerContainer && !headerContainer.contains(e.relatedTarget)) {
      closeAllNavSections(nav);
    }
  });
}

/**
 * Toggles the mobile menu (hamburger menu).
 * @param {Element} nav The main nav element.
 * @param {boolean} forceClose Optional param to force menu close.
 */
function toggleMobileMenu(nav, forceClose = false) {
  const mobileHamburgerMenu = nav.querySelector(`.${NAV_CLASSES.HAMBURGER_MENU}`);
  const hamburgerButton = nav.querySelector(`.${NAV_CLASSES.HEADER_HAMBURGER_BUTTON}`);
  const hamburgerOpenIcon = hamburgerButton.querySelector(`.${NAV_CLASSES.HEADER_HAMBURGER_OPEN}`);
  const hamburgerCloseIcon = hamburgerButton.querySelector(`.${NAV_CLASSES.HEADER_HAMBURGER_CLOSE}`);

  const expanded = mobileHamburgerMenu.classList.contains(NAV_CLASSES.ACTIVE);

  if (forceClose || expanded) {
    mobileHamburgerMenu.classList.remove(NAV_CLASSES.ACTIVE);
    hamburgerOpenIcon.style.opacity = 1;
    hamburgerCloseIcon.style.opacity = 0;
    document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
    navOverlay.classList.add(NAV_CLASSES.D_NONE);
    hamburgerButton.setAttribute('aria-expanded', 'false');
    // Close all mobile accordions when the main menu closes
    mobileHamburgerMenu.querySelectorAll(`.${NAV_CLASSES.ACCORDION_ITEM}.${NAV_CLASSES.SHOW}`).forEach((item) => {
      const collapseElement = item.querySelector(`.${NAV_CLASSES.ACCORDION_COLLAPSE}`);
      const arrowElement = item.querySelector(`.${NAV_CLASSES.ACCORDION_ARROW}`);
      toggleAccordionItem(item, collapseElement, arrowElement, true); // Force close without affecting others
    });
  } else {
    mobileHamburgerMenu.classList.add(NAV_CLASSES.ACTIVE);
    hamburgerOpenIcon.style.opacity = 0;
    hamburgerCloseIcon.style.opacity = 1;
    document.body.classList.add(NAV_CLASSES.NO_SCROLL);
    navOverlay.classList.remove(NAV_CLASSES.D_NONE);
    hamburgerButton.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Toggles an individual accordion item.
 * @param {HTMLElement} item The accordion item element.
 * @param {HTMLElement} collapseElement The collapsible content element.
 * @param {HTMLElement} arrowElement The arrow icon element.
 * @param {boolean} forceClose Optional param to force item close.
 */
function toggleAccordionItem(item, collapseElement, arrowElement, forceClose = false) {
  const isExpanded = item.classList.contains(NAV_CLASSES.SHOW);
  const heading = item.querySelector(`.${NAV_CLASSES.ACCORDION_HEADING}`);
  const toggleButton = heading.querySelector(`.${NAV_CLASSES.ACCORDION_BUTTON}`); // The actual button or link acting as toggle

  // Close all other accordion items first, unless forceClose is true
  if (!forceClose) {
    const allAccordionItems = item.closest(`.${NAV_CLASSES.ACCORDION}`).querySelectorAll(`.${NAV_CLASSES.ACCORDION_ITEM}`);
    allAccordionItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains(NAV_CLASSES.SHOW)) {
        const otherCollapse = otherItem.querySelector(`.${NAV_CLASSES.ACCORDION_COLLAPSE}`);
        const otherArrow = otherItem.querySelector(`.${NAV_CLASSES.ACCORDION_ARROW}`);
        const otherHeading = otherItem.querySelector(`.${NAV_CLASSES.ACCORDION_HEADING}`);
        otherItem.classList.remove(NAV_CLASSES.SHOW);
        otherCollapse.classList.add(NAV_CLASSES.COLLAPSE);
        otherArrow.classList.remove(NAV_CLASSES.COLLAPSED);
        if (otherHeading) otherHeading.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (isExpanded || forceClose) {
    item.classList.remove(NAV_CLASSES.SHOW);
    collapseElement.classList.add(NAV_CLASSES.COLLAPSE);
    arrowElement.classList.remove(NAV_CLASSES.COLLAPSED);
    if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
  } else {
    item.classList.add(NAV_CLASSES.SHOW);
    collapseElement.classList.remove(NAV_CLASSES.COLLAPSE);
    arrowElement.classList.add(NAV_CLASSES.COLLAPSED);
    if (toggleButton) toggleButton.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Sets up mobile navigation with accordion behavior.
 * @param {Element} nav The main nav element.
 */
function setupMobileNav(nav) {
  const mobileHamburgerMenu = nav.querySelector(`.${NAV_CLASSES.HAMBURGER_MENU}`);
  if (!mobileHamburgerMenu) return;

  const accordionItems = mobileHamburgerMenu.querySelectorAll(`.${NAV_CLASSES.ACCORDION_ITEM}`);

  accordionItems.forEach((item) => {
    const heading = item.querySelector(`.${NAV_CLASSES.ACCORDION_HEADER}`);
    const button = heading.querySelector(`.${NAV_CLASSES.ACCORDION_BUTTON}`);
    const collapse = item.querySelector(`.${NAV_CLASSES.ACCORDION_COLLAPSE}`);
    const arrow = heading.querySelector(`.${NAV_CLASSES.ACCORDION_ARROW}`);

    if (heading && button && collapse && arrow) {
      // The button itself is the primary interactive element for the accordion.
      // If it's also a link, the link action should be prevented when expanding.
      button.addEventListener('click', (e) => {
        // Prevent default navigation if the button is a link and has sub-items
        const hasSubItems = collapse.children.length > 0;
        if (button.tagName === 'A' && hasSubItems) {
          e.preventDefault();
        }
        toggleAccordionItem(item, collapse, arrow);
      });

      // Optionally, if the arrow is a separate clickable element for expansion
      // and the button is a direct link, handle it here.
      // In the current structure, the button is the main toggle.
    }
  });

  // Close mobile menu on overlay click
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      toggleMobileMenu(nav, true); // Force close
    });
  }
}

/**
 * Sets up accessibility attributes and event listeners.
 * @param {Element} nav The main nav element.
 */
function setupAccessibility(nav) {
  // Hamburger button accessibility
  const hamburgerButton = nav.querySelector(`.${NAV_CLASSES.HEADER_HAMBURGER_BUTTON}`);
  const mobileHamburgerMenu = nav.querySelector(`.${NAV_CLASSES.HAMBURGER_MENU}`);
  if (hamburgerButton && mobileHamburgerMenu) {
    hamburgerButton.setAttribute('aria-controls', mobileHamburgerMenu.id);
    hamburgerButton.setAttribute('aria-expanded', 'false');
  }

  // Desktop L1 navigation items accessibility
  nav.querySelectorAll(`.${NAV_CLASSES.NAVBAR_ITEM}.nav-drop > .${NAV_CLASSES.D_FLEX} > .${NAV_CLASSES.NAVBAR_LINK}`).forEach((link) => {
    const parentLi = link.closest(`.${NAV_CLASSES.NAVBAR_ITEM}`);
    const dropdown = parentLi.querySelector(`.${NAV_CLASSES.NAV_DROPDOWN}`);
    if (dropdown) {
      const dropdownId = `nav-dropdown-${link.textContent.trim().replace(/\s+/g, '-')}`;
      dropdown.id = dropdownId;
      link.setAttribute('aria-controls', dropdownId);
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');

      // Add keydown listener for desktop dropdowns
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Space') {
          e.preventDefault();
          const isExpanded = link.getAttribute('aria-expanded') === 'true';
          closeAllNavSections(nav); // Close others first
          toggleNavSection(parentLi, !isExpanded);
          if (!isExpanded) {
            navOverlay.classList.remove(NAV_CLASSES.D_NONE);
          } else {
            navOverlay.classList.add(NAV_CLASSES.D_NONE);
          }
        }
      });
    }
  });

  // Mobile accordion accessibility
  nav.querySelectorAll(`.${NAV_CLASSES.ACCORDION_ITEM}`).forEach((item, index) => {
    const heading = item.querySelector(`.${NAV_CLASSES.ACCORDION_HEADER}`);
    const button = heading.querySelector(`.${NAV_CLASSES.ACCORDION_BUTTON}`);
    const collapse = item.querySelector(`.${NAV_CLASSES.ACCORDION_COLLAPSE}`);
    const arrow = heading.querySelector(`.${NAV_CLASSES.ACCORDION_ARROW}`);

    if (heading && button && collapse && arrow) {
      const panelId = `panel-collapse-${index}`;
      const headingId = `panel-heading-${index}`;

      collapse.id = panelId;
      heading.id = headingId;

      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');

      // Add keydown listener for accordion items
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Space') {
          e.preventDefault();
          toggleAccordionItem(item, collapse, arrow);
        }
      });
    }
  });

  // Escape key listener for closing menus
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllNavSections(nav);
      toggleMobileMenu(nav, true); // Force close mobile menu
      if (navOverlay) {
        navOverlay.classList.add(NAV_CLASSES.D_NONE);
      }
      document.body.classList.remove(NAV_CLASSES.NO_SCROLL);

      // Close search if open
      const globalSearchWrapper = nav.querySelector(`.${NAV_CLASSES.GLOBAL_SEARCH_WRAPPER}`);
      if (globalSearchWrapper && globalSearchWrapper.classList.contains(NAV_CLASSES.ACTIVE)) {
        globalSearchWrapper.classList.remove(NAV_CLASSES.ACTIVE);
      }

      // Close notification panel if open
      const notificationPanel = nav.querySelector(`.${NAV_CLASSES.NOTIFICATION_PANEL}`);
      if (notificationPanel && notificationPanel.classList.contains(NAV_CLASSES.ACTIVE)) {
        notificationPanel.classList.remove(NAV_CLASSES.ACTIVE);
      }
    }
  });
}

/**
 * Decorates the header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // Fetch fragment content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  navFragment = await loadFragment(navPath);

  if (!navFragment) {
    block.remove(); // Remove block if fragment not found
    return;
  }

  // Create main nav element
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add(NAV_CLASSES.NAVBAR, NAV_CLASSES.NAVBAR_EXPAND_MD, NAV_CLASSES.D_FLEX, NAV_CLASSES.JUSTIFY_CONTENT_BETWEEN, NAV_CLASSES.ALIGN_ITEMS_CENTER, NAV_CLASSES.W_100, NAV_CLASSES.BG_WHITE, NAV_CLASSES.SECTION_CONTAINER_PRIMARY, NAV_CLASSES.PY_3);

  // Create header wrapper and append nav
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header__wrapper');
  block.append(headerWrapper);

  const headerContainer = document.createElement('header');
  headerContainer.classList.add('header', 'header--container', NAV_CLASSES.POSITION_FIXED, NAV_CLASSES.TOP_0, NAV_CLASSES.W_100);
  headerWrapper.append(headerContainer);

  navOverlay = document.createElement('div');
  navOverlay.classList.add(NAV_CLASSES.OVERLAY, NAV_CLASSES.D_NONE, NAV_CLASSES.POSITION_FIXED, NAV_CLASSES.TOP_0, NAV_CLASSES.W_100, NAV_CLASSES.H_100);
  headerContainer.append(navOverlay);

  const positionAbsoluteDiv = document.createElement('div');
  positionAbsoluteDiv.classList.add(NAV_CLASSES.POSITION_ABSOLUTE, NAV_CLASSES.W_100);
  headerContainer.append(positionAbsoluteDiv);

  // Mobile Hamburger Menu (initially hidden on desktop)
  const mobileHamburgerMenu = document.createElement('nav');
  mobileHamburgerMenu.id = 'nav-sections-mobile'; // ID for aria-controls
  mobileHamburgerMenu.classList.add(NAV_CLASSES.POSITION_FIXED, NAV_CLASSES.TOP_0, NAV_CLASSES.END_0, NAV_CLASSES.D_FLEX, NAV_CLASSES.FLEX_COLUMN, NAV_CLASSES.GAP_6, NAV_CLASSES.HAMBURGER_MENU);
  positionAbsoluteDiv.append(mobileHamburgerMenu);

  // Mobile Hamburger Head
  const hamburgerHead = document.createElement('div');
  hamburgerHead.classList.add(NAV_CLASSES.ALIGN_SELF_END, NAV_CLASSES.D_FLEX, NAV_CLASSES.JUSTIFY_CONTENT_BETWEEN, NAV_CLASSES.W_100, NAV_CLASSES.D_MD_NONE, NAV_CLASSES.HAMBURGER_HEAD);
  mobileHamburgerMenu.append(hamburgerHead);

  const hamburgerHeadTitle = document.createElement('div');
  hamburgerHeadTitle.classList.add(NAV_CLASSES.HAMBURGER_HEAD_TITLE, NAV_CLASSES.TEXT_BLACK_500);
  // Dynamically set title if available in fragment, otherwise default
  const mobileNotificationTitle = navFragment.querySelector('.header__hamburger--head-title');
  hamburgerHeadTitle.textContent = mobileNotificationTitle ? mobileNotificationTitle.textContent : 'Notifications';
  hamburgerHead.append(hamburgerHeadTitle);

  const closeIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIconSvg.classList.add(NAV_CLASSES.ARROW, NAV_CLASSES.HAMBURGER_CLOSE_ICON);
  closeIconSvg.setAttribute('aria-hidden', 'true');
  closeIconSvg.setAttribute('role', 'icon');
  const closeIconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  closeIconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeIconSvg.append(closeIconUse);
  hamburgerHead.append(closeIconSvg);

  // Mobile Notification Menu (content from fragment)
  const mobileNotificationDiv = navFragment.querySelector(`.${NAV_CLASSES.NOTIFICATION_MOBILE}`);
  if (mobileNotificationDiv) {
    mobileHamburgerMenu.append(mobileNotificationDiv.cloneNode(true)); // Clone to avoid moving from desktop structure
    mobileHamburgerMenu.lastElementChild.classList.add(NAV_CLASSES.D_MD_NONE, NAV_CLASSES.FLEX_COLUMN, NAV_CLASSES.Z_2);
  }

  // Accordion Menu Items (from fragment)
  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add(NAV_CLASSES.D_FLEX, NAV_CLASSES.FLEX_COLUMN, NAV_CLASSES.JUSTIFY_CONTENT_BETWEEN, NAV_CLASSES.MOBILE_MENU_WRAPPER);
  mobileHamburgerMenu.append(mobileMenuWrapper);

  const accordionDiv = document.createElement('div');
  accordionDiv.classList.add(NAV_CLASSES.ACCORDION);
  mobileMenuWrapper.append(accordionDiv);

  // Process L1 sections for mobile accordion
  const navSectionsFragment = navFragment.querySelector('.nav-sections');
  if (navSectionsFragment) {
    navSectionsFragment.querySelectorAll(':scope > ul > li').forEach((l1Item, index) => {
      const section = document.createElement('section');
      section.classList.add(NAV_CLASSES.ACCORDION_ITEM, NAV_CLASSES.D_MD_NONE);

      const heading = document.createElement('h2');
      heading.classList.add(NAV_CLASSES.ACCORDION_HEADER);
      heading.id = `panel-heading-${index}`;

      const link = l1Item.querySelector('a');
      const linkText = link ? link.textContent.trim() : '';
      const linkHref = link ? link.getAttribute('href') : '#';

      const button = document.createElement('button'); // Use button for accordion toggle
      button.classList.add(NAV_CLASSES.ACCORDION_BUTTON, NAV_CLASSES.D_FLEX, NAV_CLASSES.JUSTIFY_CONTENT_BETWEEN, NAV_CLASSES.ALIGN_ITEMS_CENTER, NAV_CLASSES.W_100, NAV_CLASSES.NAVIGATION_LINK);
      // If the L1 item itself is a direct link, wrap it inside the button
      const buttonContent = document.createElement('a');
      buttonContent.href = linkHref;
      buttonContent.textContent = linkText;
      button.append(buttonContent);

      const arrowSpan = document.createElement('span');
      arrowSpan.classList.add(NAV_CLASSES.COLLAPSED, NAV_CLASSES.HEADER_ARROW_ICON);

      const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrowSvg.classList.add(NAV_CLASSES.ARROW, NAV_CLASSES.ACCORDION_ARROW);
      arrowSvg.setAttribute('aria-hidden', 'true');
      arrowSvg.setAttribute('role', 'icon');
      const arrowUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      arrowUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret');
      arrowSvg.append(arrowUse);
      arrowSpan.append(arrowSvg);

      button.append(arrowSpan);
      heading.append(button);
      section.prepend(heading);

      const collapseDiv = document.createElement('div');
      collapseDiv.id = `panel-collapse-${index}`;
      collapseDiv.classList.add(NAV_CLASSES.ACCORDION_COLLAPSE, NAV_CLASSES.COLLAPSE);
      collapseDiv.setAttribute('aria-labelledby', `panel-heading-${index}`);
      collapseDiv.setAttribute('data-label', linkText);

      const accordionBody = document.createElement('div');
      accordionBody.classList.add(NAV_CLASSES.ACCORDION_BODY);
      collapseDiv.append(accordionBody);

      // Append all children of the original L1 item (L2, L3, etc.) into the accordion body
      const l2List = l1Item.querySelector('ul');
      if (l2List) {
        // Clone the entire ul structure and append
        accordionBody.append(l2List.cloneNode(true));
      }
      section.append(collapseDiv);
      accordionDiv.append(section);
    });
  }

  // Social Media Links (from fragment)
  const socialMediaDiv = navFragment.querySelector('.header__socials');
  if (socialMediaDiv) {
    mobileMenuWrapper.append(socialMediaDiv.cloneNode(true));
  }

  // Mobile App Links (from fragment)
  const mobileAppDiv = navFragment.querySelector('.header__app');
  if (mobileAppDiv) {
    mobileMenuWrapper.append(mobileAppDiv.cloneNode(true));
  }

  // Main Navigation (desktop)
  const mainNav = document.createElement('nav');
  mainNav.classList.add(NAV_CLASSES.POSITION_RELATIVE, NAV_CLASSES.TOP_0, NAV_CLASSES.NAVBAR, NAV_CLASSES.W_100);
  headerContainer.append(mainNav);

  const mainNavbarDiv = document.createElement('div');
  mainNavbarDiv.classList.add(NAV_CLASSES.NAVBAR, NAV_CLASSES.NAVBAR_EXPAND_MD, NAV_CLASSES.D_FLEX, NAV_CLASSES.SECTION_CONTAINER_PRIMARY, NAV_CLASSES.PY_3, NAV_CLASSES.JUSTIFY_CONTENT_BETWEEN, NAV_CLASSES.ALIGN_ITEMS_CENTER, NAV_CLASSES.W_100, NAV_CLASSES.BG_WHITE);
  mainNav.append(mainNavbarDiv);

  // Brand Logo (from fragment)
  const navBrandFragment = navFragment.querySelector(`.${NAV_CLASSES.BRAND}`);
  if (navBrandFragment) {
    const brandLink = navBrandFragment.querySelector('a');
    if (brandLink) {
      brandLink.classList.add(NAV_CLASSES.NAVBAR_BRAND, NAV_CLASSES.P_0, NAV_CLASSES.HEADER_LOGO, NAV_CLASSES.POSITION_RELATIVE);
      const img = brandLink.querySelector('img');
      if (img) {
        img.classList.add(NAV_CLASSES.W_100, NAV_CLASSES.H_100, NAV_CLASSES.HEADER_LOGO_IMAGE, NAV_CLASSES.POSITION_ABSOLUTE, NAV_CLASSES.Z_2);
      }
      mainNavbarDiv.append(brandLink.cloneNode(true));
    }
  }

  // Desktop Navigation Sections
  const navCollapseDiv = document.createElement('div');
  navCollapseDiv.classList.add(NAV_CLASSES.COLLAPSE, NAV_CLASSES.NAVBAR_COLLAPSE, NAV_CLASSES.JUSTIFY_CONTENT_CENTER);
  navCollapseDiv.id = 'navbarNavDropdown';
  mainNavbarDiv.append(navCollapseDiv);

  const navList = document.createElement('ul');
  navList.classList.add(NAV_CLASSES.NAVBAR_NAV, NAV_CLASSES.GAP_10);
  navCollapseDiv.append(navList);

  // Populate desktop nav from fragment sections
  if (navSectionsFragment) {
    navSectionsFragment.querySelectorAll(':scope > ul > li').forEach((l1Item, index) => {
      const navItem = document.createElement('li');
      navItem.classList.add(NAV_CLASSES.NAVBAR_ITEM, NAV_CLASSES.TEXT_CENTER);

      const dFlexDiv = document.createElement('div');
      dFlexDiv.classList.add(NAV_CLASSES.D_FLEX);
      navItem.append(dFlexDiv);

      const link = l1Item.querySelector('a');
      if (link) {
        const clonedLink = link.cloneNode(true);
        clonedLink.classList.add(NAV_CLASSES.NAVBAR_LINK);
        clonedLink.id = `navbarDropdownMenuLink${index}`;
        dFlexDiv.append(clonedLink);

        const underlineSpan = document.createElement('span');
        underlineSpan.classList.add(NAV_CLASSES.NAVBAR_ITEM_UNDERLINE);
        dFlexDiv.append(underlineSpan);
      }

      const l2List = l1Item.querySelector('ul');
      if (l2List) {
        navItem.classList.add('nav-drop'); // Mark as dropdown
        const dropdownUl = document.createElement('ul');
        dropdownUl.classList.add(NAV_CLASSES.BG_WHITE, NAV_CLASSES.NAV_DROPDOWN, NAV_CLASSES.POSITION_FIXED, NAV_CLASSES.SECTION_CONTAINER_PRIMARY, NAV_CLASSES.PT_12, NAV_CLASSES.PB_8, NAV_CLASSES.START_0, NAV_CLASSES.W_100, NAV_CLASSES.BORDER_0, NAV_CLASSES.ROUNDED_0);
        dropdownUl.setAttribute('aria-labelledby', `navbarDropdownMenuLink${index}`);
        dropdownUl.style.display = 'grid'; // Enable grid for columns

        // Determine number of columns based on L2 children or a data attribute if available
        const columnCount = l2List.dataset.columnCount || l2List.children.length || 1;
        dropdownUl.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0px, 1fr))`;
        dropdownUl.style.gap = '20px';
        navItem.append(dropdownUl);

        l2List.querySelectorAll(':scope > li').forEach((l2ItemContent) => {
          const dropdownItem = document.createElement('li');
          dropdownItem.classList.add(NAV_CLASSES.DROPDOWN_ITEM, NAV_CLASSES.NAVBAR_DROPDOWN_COLUMN);
          dropdownItem.append(l2ItemContent.cloneNode(true)); // Clone L2 content
          dropdownUl.append(dropdownItem);
        });
      }
      navList.append(navItem);
    });
  }

  // Navigation Buttons (Search, Notification, Login, Hamburger)
  const navButtonsDiv = document.createElement('div');
  navButtonsDiv.classList.add(NAV_CLASSES.NAVIGATION_BUTTONS, NAV_CLASSES.D_FLEX, NAV_CLASSES.ALIGN_ITEMS_CENTER, NAV_CLASSES.GAP_5, NAV_CLASSES.HEADER_BUTTONS);
  mainNavbarDiv.append(navButtonsDiv);

  // Search
  const searchDiv = document.createElement('div');
  searchDiv.classList.add(NAV_CLASSES.BG_TRANSPARENT, NAV_CLASSES.HEADER_SEARCH, 'cursor-pointer');
  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.classList.add(NAV_CLASSES.HEADER_SEARCH_SVG_FIND);
  searchSvg.setAttribute('aria-hidden', 'true');
  searchSvg.setAttribute('role', 'icon');
  const searchUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  searchUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchSvg.append(searchUse);
  searchDiv.append(searchSvg);

  const globalSearchWrapper = navFragment.querySelector(`.${NAV_CLASSES.GLOBAL_SEARCH_WRAPPER}`);
  if (globalSearchWrapper) {
    searchDiv.append(globalSearchWrapper.cloneNode(true)); // Clone to avoid moving
    const clonedSearchWrapper = searchDiv.lastElementChild;
    const closeSearchBtn = clonedSearchWrapper.querySelector(`.${NAV_CLASSES.CLOSE_SEARCH}`);
    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', () => {
        clonedSearchWrapper.classList.remove(NAV_CLASSES.ACTIVE);
        navOverlay.classList.add(NAV_CLASSES.D_NONE);
        document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
      });
    }

    searchDiv.addEventListener('click', () => {
      clonedSearchWrapper.classList.toggle(NAV_CLASSES.ACTIVE);
      if (clonedSearchWrapper.classList.contains(NAV_CLASSES.ACTIVE)) {
        navOverlay.classList.remove(NAV_CLASSES.D_NONE);
        document.body.classList.add(NAV_CLASSES.NO_SCROLL);
      } else {
        navOverlay.classList.add(NAV_CLASSES.D_NONE);
        document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
      }
    });
  }
  navButtonsDiv.append(searchDiv);

  // Notification
  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add(NAV_CLASSES.D_FLEX, NAV_CLASSES.FLEX_COLUMN, NAV_CLASSES.ALIGN_ITEMS_END, NAV_CLASSES.GAP_2, NAV_CLASSES.POSITION_RELATIVE, NAV_CLASSES.NOTIFICATION_TRIGGER);

  const notificationSpan = document.createElement('span');
  notificationSpan.classList.add(NAV_CLASSES.NOTIFICATION_TRIGGER_TEXT, NAV_CLASSES.TEXT_CENTER, NAV_CLASSES.POSITION_ABSOLUTE);
  notificationSpan.setAttribute('data-notification-text', 'true');
  notificationSpan.setAttribute('data-text-color', 'rgb(255,255,255)');
  notificationSpan.setAttribute('data-background-color', '#Db0011');
  notificationSpan.style.color = 'rgb(255, 255, 255)';
  notificationSpan.style.backgroundColor = 'rgb(219, 0, 17)';
  // Dynamically set notification count if available in fragment, otherwise default
  const notificationCount = navFragment.querySelector(`.${NAV_CLASSES.NOTIFICATION_TRIGGER_TEXT}`);
  notificationSpan.textContent = notificationCount ? notificationCount.textContent : '0';
  notificationDiv.append(notificationSpan);

  const bellSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  bellSvg.classList.add('text-blue-400', NAV_CLASSES.NOTIFICATION_TRIGGER_SVG);
  bellSvg.setAttribute('aria-hidden', 'true');
  bellSvg.setAttribute('role', 'icon');
  const bellUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  bellUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon');
  bellSvg.append(bellUse);
  notificationDiv.append(bellSvg);

  const notificationPanel = navFragment.querySelector(`.${NAV_CLASSES.NOTIFICATION_PANEL}`);
  if (notificationPanel) {
    notificationDiv.append(notificationPanel.cloneNode(true)); // Clone to avoid moving
    const clonedNotificationPanel = notificationDiv.lastElementChild;
    clonedNotificationPanel.classList.add(NAV_CLASSES.P_3, NAV_CLASSES.FLEX_COLUMN, NAV_CLASSES.POSITION_ABSOLUTE, NAV_CLASSES.Z_2);

    notificationDiv.addEventListener('click', () => {
      clonedNotificationPanel.classList.toggle(NAV_CLASSES.ACTIVE);
      if (clonedNotificationPanel.classList.contains(NAV_CLASSES.ACTIVE)) {
        navOverlay.classList.remove(NAV_CLASSES.D_NONE);
      } else {
        navOverlay.classList.add(NAV_CLASSES.D_NONE);
      }
    });
  }
  navButtonsDiv.append(notificationDiv);

  // Login
  const loginLink = navFragment.querySelector(`.${NAV_CLASSES.HEADER_LOGIN}`);
  if (loginLink) {
    const clonedLoginLink = loginLink.cloneNode(true);
    clonedLoginLink.classList.add(NAV_CLASSES.D_FLEX, NAV_CLASSES.ALIGN_ITEMS_CENTER, NAV_CLASSES.GAP_2, 'text-blue-400');
    const loginText = clonedLoginLink.querySelector(`.${NAV_CLASSES.LOGNTEXT}`);
    if (loginText) {
      loginText.classList.add(NAV_CLASSES.D_NONE, NAV_CLASSES.D_MD_BLOCK, NAV_CLASSES.TEXT_NOWRAP);
    }
    navButtonsDiv.append(clonedLoginLink);
  }

  // Hamburger Button for mobile
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add(NAV_CLASSES.POSITION_RELATIVE, 'text-blue-400', NAV_CLASSES.HEADER_HAMBURGER_BUTTON);

  const hamburgerOpenSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hamburgerOpenSvg.classList.add(NAV_CLASSES.HEADER_HAMBURGER_OPEN);
  hamburgerOpenSvg.setAttribute('aria-hidden', 'true');
  hamburgerOpenSvg.setAttribute('role', 'icon');
  const hamburgerOpenUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  hamburgerOpenUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon');
  hamburgerOpenSvg.append(hamburgerOpenUse);
  hamburgerButton.append(hamburgerOpenSvg);

  const hamburgerCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hamburgerCloseSvg.classList.add(NAV_CLASSES.POSITION_ABSOLUTE, NAV_CLASSES.START_0, NAV_CLASSES.BOTTOM_0, NAV_CLASSES.HEADER_HAMBURGER_CLOSE);
  hamburgerCloseSvg.setAttribute('aria-hidden', 'true');
  hamburgerCloseSvg.setAttribute('role', 'icon');
  hamburgerCloseSvg.style.opacity = 0; // Initially hidden
  const hamburgerCloseUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  hamburgerCloseUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  hamburgerCloseSvg.append(hamburgerCloseUse);
  hamburgerButton.append(hamburgerCloseSvg);

  navButtonsDiv.append(hamburgerButton);

  hamburgerButton.addEventListener('click', () => toggleMobileMenu(nav, false));
  closeIconSvg.addEventListener('click', () => toggleMobileMenu(nav, true)); // Close mobile menu from inside

  // Append the fully constructed nav to the header container
  headerContainer.append(mainNav);

  // Backdrop
  const headerBackdrop = document.createElement('div');
  headerBackdrop.classList.add(NAV_CLASSES.HEADER_BACKDROP, NAV_CLASSES.D_NONE, NAV_CLASSES.POSITION_RELATIVE, NAV_CLASSES.POSITION_FIXED);
  headerWrapper.append(headerBackdrop);

  // Setup event listeners and accessibility
  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav);

  // Initial state for mobile/desktop
  const onMediaChange = (e) => {
    if (e.matches) {
      // Desktop view
      closeAllNavSections(nav);
      toggleMobileMenu(nav, true); // Ensure mobile menu is closed
      document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
      if (navOverlay) navOverlay.classList.add(NAV_CLASSES.D_NONE);
    } else {
      // Mobile view
      closeAllNavSections(nav);
      // Keep mobile menu closed by default on mobile load, user will open via hamburger
      toggleMobileMenu(nav, true);
      document.body.classList.remove(NAV_CLASSES.NO_SCROLL);
      if (navOverlay) navOverlay.classList.add(NAV_CLASSES.D_NONE);
    }
  };

  isDesktop.addEventListener('change', onMediaChange);
  onMediaChange(isDesktop); // Set initial state
}
