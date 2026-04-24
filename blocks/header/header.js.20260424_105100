import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to original CSS breakpoint

const NAV_CLASSES = {
  MAIN_HEADER: 'main-header',
  WRAP: 'wrap',
  CONTAINER: 'container',
  LOGO: 'logo',
  HAMBURGER: 'hamburger',
  MAIN_NAV: 'main-nav',
  ICON_NAV: 'icon-nav',
  MOBILE_MENUS_ICON: 'mobile-menus-icon',
  DESKTOP_MENUS_ICON: 'desktop-menus-icon',
  HAS_CHILD: 'has-child',
  HOVER_RED: 'hover-red',
  MEGA_MENU: 'mega-menu',
  CENTER_DIV: 'center-div',
  LEFT_DIV: 'left-div',
  LEFT_DIV_HEADING: 'left-div-heading',
  LEFT_DIV_DESC: 'left-div-desc',
  LEFT_DIV_SUBDESC: 'left-div-subdesc',
  LIST_TEXT_RED: 'list-text-red',
  SUB_NAV_WRAP: 'sub-nav-wrap',
  TOP_LEVEL_LI: 'top-level-li',
  HAS_SUB_CHILD: 'has-sub-child',
  HAS_INNER_SUB_CHILD: 'has-inner-sub-child',
  ACTIVE: 'active',
  ACTIVE_CHILD: 'active-child',
  SEARCH: 'search',
  SEARCH_SCREEN_WRAP: 'search-screen-wrap',
  SEARCH_WRAP: 'search-wrap',
  SEARCH_ICON: 'search-icon',
  INPUT_TEXT: 'input-text',
  SEARCH_TEXT: 'searchtext',
  SUBMIT_BUTTON: 'submit-button',
  LABEL: 'label',
  SEARCH_SUGGESTIONS_WRAP: 'search-suggestions-wrap',
  TOKENS_WRAP: 'tokens-wrap',
  LENS: 'lens',
  CLOSE: 'close',
  MAIL: 'mail',
  NAV_UP: 'nav-up',
  SOLID: 'solid',
  WITH_MARQUEE: 'with-marquee',
  YEAR_80_LOGO: 'year-80-logo',
  HIDDEN_LOGO1: 'hiddenlogo1',
  YEARS_80: 'years-80',
  // New classes for state management
  MENU_OPEN: 'menu-open',
  SUBMENU_OPEN: 'submenu-open',
  INNER_SUBMENU_OPEN: 'inner-submenu-open',
  SEARCH_OPEN: 'search-open',
};

const NAV_ARIA_LABELS = {
  OPEN_NAVIGATION: 'Open navigation',
  CLOSE_NAVIGATION: 'Close navigation',
  OPEN_MENU: 'Open menu',
  CLOSE_MENU: 'Close menu',
  OPEN_SUBMENU: 'Open submenu',
  CLOSE_SUBMENU: 'Close submenu',
  OPEN_INNER_SUBMENU: 'Open inner submenu',
  CLOSE_INNER_SUBMENU: 'Close inner submenu',
  OPEN_SEARCH: 'Open search',
  CLOSE_SEARCH: 'Close search',
};

const ARROW_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

function createSvg(svgContent) {
  const span = document.createElement('span');
  span.innerHTML = svgContent;
  return span.firstElementChild;
}

function closeAllMenus(nav, navSections, skipElement = null) {
  navSections.querySelectorAll(`.${NAV_CLASSES.HAS_CHILD}[aria-expanded="true"]`).forEach((section) => {
    if (section !== skipElement) {
      section.setAttribute('aria-expanded', 'false');
      section.classList.remove(NAV_CLASSES.MENU_OPEN);
      const megaMenu = section.querySelector(`.${NAV_CLASSES.MEGA_MENU}`);
      if (megaMenu) megaMenu.classList.remove(NAV_CLASSES.MENU_OPEN);
      const toggleSpan = section.querySelector('span[role="button"]');
      if (toggleSpan) toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);
    }
  });

  navSections.querySelectorAll(`.${NAV_CLASSES.TOP_LEVEL_LI}.${NAV_CLASSES.ACTIVE}`).forEach((topLevelLi) => {
    topLevelLi.classList.remove(NAV_CLASSES.ACTIVE);
    const subChild = topLevelLi.querySelector(`.${NAV_CLASSES.HAS_SUB_CHILD}`);
    if (subChild) subChild.classList.remove(NAV_CLASSES.SUBMENU_OPEN);
    const toggleSpan = topLevelLi.querySelector('span[role="button"]');
    if (toggleSpan) toggleSpan.setAttribute('aria-expanded', 'false');
  });

  navSections.querySelectorAll(`li.${NAV_CLASSES.ACTIVE_CHILD}`).forEach((subChildLi) => {
    subChildLi.classList.remove(NAV_CLASSES.ACTIVE_CHILD);
    const innerSubChild = subChildLi.querySelector(`.${NAV_CLASSES.HAS_INNER_SUB_CHILD}`);
    if (innerSubChild) innerSubChild.classList.remove(NAV_CLASSES.INNER_SUBMENU_OPEN);
    const toggleSpan = subChildLi.querySelector('span[role="button"]');
    if (toggleSpan) toggleSpan.setAttribute('aria-expanded', 'false');
  });

  const searchScreenWrap = nav.querySelector(`.${NAV_CLASSES.SEARCH_SCREEN_WRAP}`);
  if (searchScreenWrap && searchScreenWrap.classList.contains(NAV_CLASSES.SEARCH_OPEN)) {
    searchScreenWrap.classList.remove(NAV_CLASSES.SEARCH_OPEN);
    nav.querySelector(`.${NAV_CLASSES.SEARCH} .${NAV_CLASSES.LENS}`).style.display = 'block';
    nav.querySelector(`.${NAV_CLASSES.SEARCH} .${NAV_CLASSES.CLOSE}`).style.display = 'none';
    nav.querySelector(`.${NAV_CLASSES.SEARCH} a`).setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_SEARCH);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;

    const expandedInnerSubMenu = navSections.querySelector(`li.${NAV_CLASSES.ACTIVE_CHILD}`);
    const expandedSubMenu = navSections.querySelector(`.${NAV_CLASSES.TOP_LEVEL_LI}.${NAV_CLASSES.ACTIVE}`);
    const expandedMegaMenu = navSections.querySelector(`.${NAV_CLASSES.HAS_CHILD}[aria-expanded="true"]`);
    const searchScreenWrap = nav.querySelector(`.${NAV_CLASSES.SEARCH_SCREEN_WRAP}`);

    if (expandedInnerSubMenu) {
      expandedInnerSubMenu.classList.remove(NAV_CLASSES.ACTIVE_CHILD);
      expandedInnerSubMenu.querySelector(`.${NAV_CLASSES.HAS_INNER_SUB_CHILD}`).classList.remove(NAV_CLASSES.INNER_SUBMENU_OPEN);
      const toggleSpan = expandedInnerSubMenu.querySelector('span[role="button"]');
      if (toggleSpan) toggleSpan.setAttribute('aria-expanded', 'false');
      expandedInnerSubMenu.querySelector('a').focus();
    } else if (expandedSubMenu) {
      expandedSubMenu.classList.remove(NAV_CLASSES.ACTIVE);
      expandedSubMenu.querySelector(`.${NAV_CLASSES.HAS_SUB_CHILD}`).classList.remove(NAV_CLASSES.SUBMENU_OPEN);
      const toggleSpan = expandedSubMenu.querySelector('span[role="button"]');
      if (toggleSpan) toggleSpan.setAttribute('aria-expanded', 'false');
      expandedSubMenu.querySelector('a').focus();
    } else if (expandedMegaMenu && isDesktop.matches) {
      closeAllMenus(nav, navSections);
      expandedMegaMenu.focus();
    } else if (searchScreenWrap && searchScreenWrap.classList.contains(NAV_CLASSES.SEARCH_OPEN)) {
      closeAllMenus(nav, navSections);
      nav.querySelector(`.${NAV_CLASSES.SEARCH} a`).focus();
    } else if (!isDesktop.matches) {
      toggleMobileMenu(nav, navSections, false);
      nav.querySelector(`.${NAV_CLASSES.HAMBURGER} button`).focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    closeAllMenus(nav, navSections);
    if (!isDesktop.matches) {
      toggleMobileMenu(nav, navSections, false);
    }
  }
}

/**
 * Toggles the mobile menu
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMobileMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector(`.${NAV_CLASSES.HAMBURGER} button`);

  document.body.classList.toggle('no-scroll', expanded);
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? NAV_ARIA_LABELS.CLOSE_NAVIGATION : NAV_ARIA_LABELS.OPEN_NAVIGATION);

  const mainNav = nav.querySelector(`.${NAV_CLASSES.MAIN_NAV}`);
  if (mainNav) {
    mainNav.classList.toggle(NAV_CLASSES.MENU_OPEN, expanded);
  }

  // Close all sub-menus when mobile menu is closed
  if (!expanded) {
    closeAllMenus(nav, navSections);
  }

  // Add/remove escape key listener
  if (expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function setupMobileNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add(NAV_CLASSES.HAMBURGER);
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="${NAV_ARIA_LABELS.OPEN_NAVIGATION}">
    <ul><li></li><li></li><li></li></ul>
  </button>`;
  hamburger.addEventListener('click', () => toggleMobileMenu(nav, navSections));
  nav.querySelector(`.${NAV_CLASSES.WRAP}`).prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');
  toggleMobileMenu(nav, navSections, false); // Initialize mobile menu as closed
  isDesktop.addEventListener('change', () => toggleMobileMenu(nav, navSections, false)); // Close on desktop resize

  // Mobile accordion for nested menus
  navSections.querySelectorAll(`.${NAV_CLASSES.MAIN_NAV} > ul > li.${NAV_CLASSES.HAS_CHILD}`).forEach((navSection) => {
    const megaMenu = navSection.querySelector(`.${NAV_CLASSES.MEGA_MENU}`);
    if (megaMenu) {
      const toggleSpan = document.createElement('span');
      toggleSpan.innerHTML = ARROW_SVG;
      navSection.append(toggleSpan);
      toggleSpan.setAttribute('role', 'button');
      toggleSpan.setAttribute('aria-expanded', 'false');
      toggleSpan.setAttribute('aria-controls', megaMenu.id || `mega-menu-${Math.random().toString(36).substring(2, 9)}`);
      toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);
      megaMenu.id = toggleSpan.getAttribute('aria-controls');
      megaMenu.classList.remove(NAV_CLASSES.MENU_OPEN); // Hidden by default on mobile

      toggleSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        // Close other top-level menus
        navSections.querySelectorAll(`.${NAV_CLASSES.HAS_CHILD}[aria-expanded="true"]`).forEach((otherSection) => {
          if (otherSection !== navSection) {
            otherSection.setAttribute('aria-expanded', 'false');
            otherSection.classList.remove(NAV_CLASSES.MENU_OPEN);
            otherSection.querySelector(`.${NAV_CLASSES.MEGA_MENU}`).classList.remove(NAV_CLASSES.MENU_OPEN);
            const otherToggleSpan = otherSection.querySelector('span[role="button"]');
            if (otherToggleSpan) otherToggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);
          }
        });

        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navSection.classList.toggle(NAV_CLASSES.MENU_OPEN, !expanded);
        megaMenu.classList.toggle(NAV_CLASSES.MENU_OPEN, !expanded);
        toggleSpan.setAttribute('aria-label', expanded ? NAV_ARIA_LABELS.OPEN_MENU : NAV_ARIA_LABELS.CLOSE_MENU);
      });
    }
  });

  // Handle nested mobile accordions
  navSections.querySelectorAll(`.${NAV_CLASSES.SUB_NAV_WRAP} .${NAV_CLASSES.TOP_LEVEL_LI}`).forEach((topLevelLi) => {
    const subChild = topLevelLi.querySelector(`.${NAV_CLASSES.HAS_SUB_CHILD}`);
    if (subChild) {
      const toggleSpan = document.createElement('span');
      toggleSpan.innerHTML = ARROW_SVG;
      topLevelLi.append(toggleSpan);
      toggleSpan.setAttribute('role', 'button');
      toggleSpan.setAttribute('aria-expanded', 'false');
      toggleSpan.setAttribute('aria-controls', subChild.id || `sub-child-${Math.random().toString(36).substring(2, 9)}`);
      toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_SUBMENU);
      subChild.id = toggleSpan.getAttribute('aria-controls');
      subChild.classList.remove(NAV_CLASSES.SUBMENU_OPEN);

      toggleSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = topLevelLi.classList.contains(NAV_CLASSES.ACTIVE);
        // Close other sub-menus at the same level
        topLevelLi.closest('ul').querySelectorAll(`.${NAV_CLASSES.TOP_LEVEL_LI}.${NAV_CLASSES.ACTIVE}`).forEach((otherLi) => {
          if (otherLi !== topLevelLi) {
            otherLi.classList.remove(NAV_CLASSES.ACTIVE);
            otherLi.querySelector(`.${NAV_CLASSES.HAS_SUB_CHILD}`).classList.remove(NAV_CLASSES.SUBMENU_OPEN);
            const otherToggleSpan = otherLi.querySelector('span[role="button"]');
            if (otherToggleSpan) otherToggleSpan.setAttribute('aria-expanded', 'false');
          }
        });

        topLevelLi.classList.toggle(NAV_CLASSES.ACTIVE, !expanded);
        subChild.classList.toggle(NAV_CLASSES.SUBMENU_OPEN, !expanded);
        toggleSpan.setAttribute('aria-expanded', !expanded);
        toggleSpan.setAttribute('aria-label', expanded ? NAV_ARIA_LABELS.OPEN_SUBMENU : NAV_ARIA_LABELS.CLOSE_SUBMENU);
      });
    }

    // Handle inner sub-children
    subChild?.querySelectorAll('li').forEach((subChildLi) => {
      const innerSubChild = subChildLi.querySelector(`.${NAV_CLASSES.HAS_INNER_SUB_CHILD}`);
      if (innerSubChild) {
        const toggleSpan = document.createElement('span');
        toggleSpan.innerHTML = ARROW_SVG;
        subChildLi.append(toggleSpan);
        toggleSpan.setAttribute('role', 'button');
        toggleSpan.setAttribute('aria-expanded', 'false');
        toggleSpan.setAttribute('aria-controls', innerSubChild.id || `inner-sub-child-${Math.random().toString(36).substring(2, 9)}`);
        toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_INNER_SUBMENU);
        innerSubChild.id = toggleSpan.getAttribute('aria-controls');
        innerSubChild.classList.remove(NAV_CLASSES.INNER_SUBMENU_OPEN);

        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const expanded = subChildLi.classList.contains(NAV_CLASSES.ACTIVE_CHILD);
          // Close other inner sub-menus at the same level
          subChildLi.closest('ul').querySelectorAll(`li.${NAV_CLASSES.ACTIVE_CHILD}`).forEach((otherLi) => {
            if (otherLi !== subChildLi) {
              otherLi.classList.remove(NAV_CLASSES.ACTIVE_CHILD);
              otherLi.querySelector(`.${NAV_CLASSES.HAS_INNER_SUB_CHILD}`).classList.remove(NAV_CLASSES.INNER_SUBMENU_OPEN);
              const otherToggleSpan = otherLi.querySelector('span[role="button"]');
              if (otherToggleSpan) otherToggleSpan.setAttribute('aria-expanded', 'false');
            }
          });

          subChildLi.classList.toggle(NAV_CLASSES.ACTIVE_CHILD, !expanded);
          innerSubChild.classList.toggle(NAV_CLASSES.INNER_SUBMENU_OPEN, !expanded);
          toggleSpan.setAttribute('aria-expanded', !expanded);
          toggleSpan.setAttribute('aria-label', expanded ? NAV_ARIA_LABELS.OPEN_INNER_SUBMENU : NAV_ARIA_LABELS.CLOSE_INNER_SUBMENU);
        });
      }
    });
  });
}

function setupDesktopNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll(`.${NAV_CLASSES.MAIN_NAV} > ul > li.${NAV_CLASSES.HAS_CHILD}`).forEach((navSection) => {
    const megaMenu = navSection.querySelector(`.${NAV_CLASSES.MEGA_MENU}`);
    if (megaMenu) {
      navSection.setAttribute('aria-haspopup', 'true');
      navSection.setAttribute('aria-expanded', 'false');
      megaMenu.classList.remove(NAV_CLASSES.MENU_OPEN); // Hidden by default on desktop

      const toggleSpan = document.createElement('span');
      toggleSpan.innerHTML = ARROW_SVG;
      navSection.append(toggleSpan);
      toggleSpan.setAttribute('role', 'button');
      toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);

      // Desktop hover behavior
      navSection.addEventListener('mouseenter', () => {
        closeAllMenus(nav, navSections, navSection); // Close others
        navSection.setAttribute('aria-expanded', 'true');
        navSection.classList.add(NAV_CLASSES.MENU_OPEN);
        megaMenu.classList.add(NAV_CLASSES.MENU_OPEN);
        toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.CLOSE_MENU);
      });

      navSection.addEventListener('mouseleave', () => {
        // Only close if not hovering over a submenu item within the mega-menu
        if (!megaMenu.contains(document.activeElement)) {
          navSection.setAttribute('aria-expanded', 'false');
          navSection.classList.remove(NAV_CLASSES.MENU_OPEN);
          megaMenu.classList.remove(NAV_CLASSES.MENU_OPEN);
          toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);
        }
      });

      // Keyboard navigation for desktop
      navSection.querySelector('a').addEventListener('focus', () => {
        closeAllMenus(nav, navSections, navSection);
        navSection.setAttribute('aria-expanded', 'true');
        navSection.classList.add(NAV_CLASSES.MENU_OPEN);
        megaMenu.classList.add(NAV_CLASSES.MENU_OPEN);
        toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.CLOSE_MENU);
      });

      megaMenu.addEventListener('focusout', (event) => {
        if (!navSection.contains(event.relatedTarget)) {
          navSection.setAttribute('aria-expanded', 'false');
          navSection.classList.remove(NAV_CLASSES.MENU_OPEN);
          megaMenu.classList.remove(NAV_CLASSES.MENU_OPEN);
          toggleSpan.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_MENU);
        }
      });
    }
  });
}

function setupAccessibility(nav) {
  // Add global escape listener
  window.addEventListener('keydown', closeOnEscape);

  // Add global focusout listener to nav for closing on outside click/tab
  nav.addEventListener('focusout', closeOnFocusLost);

  // Ensure all interactive elements have appropriate ARIA attributes
  nav.querySelectorAll('a, button, [role="button"]').forEach((el) => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('title')) {
      const text = el.textContent.trim();
      if (text) {
        el.setAttribute('aria-label', text);
      }
    }
  });
}

function parseStructure(nav) {
  const navWrapper = document.createElement('div');
  navWrapper.classList.add(NAV_CLASSES.WRAP);

  const fragmentChildren = Array.from(nav.children);
  const brandDiv = fragmentChildren[0];
  const sectionsDiv = fragmentChildren[1];
  const toolsDiv = fragmentChildren[2];
  const year80LogoDiv = fragmentChildren[3];

  // Brand section
  if (brandDiv) {
    const navBrand = document.createElement('div');
    navBrand.classList.add(NAV_CLASSES.LOGO);
    const brandLink = brandDiv.querySelector('a');
    if (brandLink) {
      const brandImg = brandDiv.querySelector('picture img');
      if (brandImg) {
        brandImg.classList.add(NAV_CLASSES.HIDDEN_LOGO1);
        brandLink.innerHTML = '';
        brandLink.append(brandImg);
      }
      navBrand.append(brandLink);
    }
    navWrapper.append(navBrand);
  }

  // Navigation sections
  if (sectionsDiv) {
    const navSections = document.createElement('nav');
    navSections.classList.add(NAV_CLASSES.MAIN_NAV);
    navSections.setAttribute('itemscope', '');
    navSections.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

    const ul = document.createElement('ul');
    // Process each main navigation item
    Array.from(sectionsDiv.children).forEach((sectionContent) => {
      const li = document.createElement('li');
      li.classList.add(NAV_CLASSES.HAS_CHILD, NAV_CLASSES.HOVER_RED);
      li.setAttribute('itemprop', 'name');

      const mainLink = sectionContent.querySelector('p:first-child a');
      if (mainLink) {
        mainLink.setAttribute('itemprop', 'url');
        li.append(mainLink);
      }

      const megaMenu = document.createElement('div');
      megaMenu.classList.add(NAV_CLASSES.MEGA_MENU);
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add(NAV_CLASSES.WRAP, NAV_CLASSES.CONTAINER);
      const centerDiv = document.createElement('div');
      centerDiv.classList.add(NAV_CLASSES.CENTER_DIV);

      // Extract left-div content (headings, paragraphs, list-text-red)
      const leftDiv = document.createElement('div');
      leftDiv.classList.add(NAV_CLASSES.LEFT_DIV);

      // Add specific classes to left-div based on content (dynamic check)
      const mainLinkText = mainLink?.textContent.toLowerCase();
      if (mainLinkText === 'investor relations') {
        leftDiv.classList.add('ir-left-div');
      } else if (mainLinkText === 'newsroom') {
        leftDiv.classList.add('newsroom-left-div');
      } else if (mainLinkText === 'careers') {
        leftDiv.classList.add('career-left-div');
      }

      const leftDivHeading = sectionContent.querySelector('h4');
      if (leftDivHeading) {
        leftDivHeading.classList.add(NAV_CLASSES.LEFT_DIV_HEADING);
        leftDiv.append(leftDivHeading);
      }
      sectionContent.querySelectorAll('p').forEach((p) => {
        const pClone = p.cloneNode(true); // Clone to avoid moving nodes from original fragment
        if (pClone.textContent.includes('#TogetherWeRise')) {
          pClone.classList.add(NAV_CLASSES.LEFT_DIV_SUBDESC);
        } else {
          pClone.classList.add(NAV_CLASSES.LEFT_DIV_DESC);
        }
        leftDiv.append(pClone);
      });
      sectionContent.querySelectorAll('ul li.list-text-red').forEach((item) => leftDiv.append(item.cloneNode(true)));
      sectionContent.querySelectorAll('.latest-two-press-release').forEach((item) => leftDiv.append(item.cloneNode(true)));
      centerDiv.append(leftDiv);

      // Extract sub-nav-wrap content (ULs)
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add(NAV_CLASSES.SUB_NAV_WRAP);

      // Add specific classes to sub-nav-wrap based on content (dynamic check)
      if (mainLinkText === 'about us') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (mainLinkText === 'what we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (mainLinkText === 'investor relations') {
        subNavWrap.classList.add('element-block');
      } else if (mainLinkText === 'careers') {
        subNavWrap.classList.add('careers-div');
      }

      const fragmentLists = sectionContent.querySelectorAll('ul');
      if (fragmentLists.length > 0) {
        fragmentLists.forEach((list) => {
          const listClone = list.cloneNode(true); // Clone to avoid moving nodes
          // Check for specific structures like .sub-nav-wrap-one-link and .inner-sub-nav-wrap-list
          if (list.closest('.sub-nav-wrap-one-link')) {
            listClone.classList.add('sub-nav-wrap-one-link');
            subNavWrap.append(listClone);
          } else if (list.closest('.inner-sub-nav-wrap-list')) {
            let innerListContainer = subNavWrap.querySelector('.inner-sub-nav-wrap-list');
            if (!innerListContainer) {
              innerListContainer = document.createElement('div');
              innerListContainer.classList.add('inner-sub-nav-wrap-list');
              subNavWrap.append(innerListContainer);
            }
            innerListContainer.append(listClone);
          } else {
            subNavWrap.append(listClone);
          }
        });
      }

      // Add classes for nested menus
      subNavWrap.querySelectorAll('li').forEach((liItem) => {
        const nestedUl = liItem.querySelector('ul');
        if (nestedUl) {
          if (liItem.closest(`.${NAV_CLASSES.SUB_NAV_WRAP}`)) {
            liItem.classList.add(NAV_CLASSES.TOP_LEVEL_LI);
            nestedUl.classList.add(NAV_CLASSES.HAS_SUB_CHILD);
          }
          if (liItem.closest(`.${NAV_CLASSES.HAS_SUB_CHILD}`)) {
            liItem.classList.add('first-level-li'); // From original HTML
            nestedUl.classList.add(NAV_CLASSES.HAS_INNER_SUB_CHILD);
          }
        }
      });

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
      ul.append(li);
    });
    navSections.append(ul);
    navWrapper.append(navSections);
  }

  // Tools section
  if (toolsDiv) {
    const iconNav = document.createElement('div');
    iconNav.classList.add(NAV_CLASSES.ICON_NAV, NAV_CLASSES.DESKTOP_MENUS_ICON);
    const ul = document.createElement('ul');

    // Contact Us
    const contactLi = document.createElement('li');
    contactLi.classList.add(NAV_CLASSES.MAIL);
    const contactLink = toolsDiv.querySelector('ul:nth-of-type(2) li:first-child a');
    if (contactLink) {
      contactLink.innerHTML = MAIL_SVG; // Use dynamic SVG
      contactLi.append(contactLink);
    }
    ul.append(contactLi);

    // Search
    const searchLi = document.createElement('li');
    searchLi.classList.add(NAV_CLASSES.SEARCH);
    const searchLink = toolsDiv.querySelector('ul:nth-of-type(2) li:nth-child(2) a');
    if (searchLink) {
      searchLink.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG; // Use dynamic SVGs
      searchLink.setAttribute('aria-label', NAV_ARIA_LABELS.OPEN_SEARCH); // Set initial aria-label
      searchLi.append(searchLink);

      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add(NAV_CLASSES.SEARCH_SCREEN_WRAP);
      const searchWrapContent = document.createElement('div');
      searchWrapContent.classList.add(NAV_CLASSES.WRAP);

      const searchForm = document.createElement('form');
      searchForm.action = searchLink.href;
      searchForm.method = 'get';
      searchForm.id = 'search-block-form';
      searchForm.setAttribute('accept-charset', 'UTF-8');

      const searchInputWrap = document.createElement('div');
      searchInputWrap.classList.add(NAV_CLASSES.SEARCH_WRAP);
      searchInputWrap.innerHTML = `
        <div class="${NAV_CLASSES.SEARCH_ICON}">${SEARCH_LENS_SVG}</div>
        <input type="text" class="${NAV_CLASSES.INPUT_TEXT} ${NAV_CLASSES.SEARCH_TEXT}" required="" name="key" id="searchInput" autocomplete="off">
        <button class="${NAV_CLASSES.SUBMIT_BUTTON}">
          <div class="${NAV_CLASSES.LABEL}"> Submit </div>
          ${SUBMIT_ARROW_SVG}
        </button>
      `;
      searchForm.append(searchInputWrap);

      // Search Result Box (from original HTML)
      const searchResultBox = document.createElement('div');
      searchResultBox.classList.add('searchResultBox');
      searchResultBox.style.display = 'none';
      searchResultBox.innerHTML = `
        <div class="swiper scrollSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide"></div>
          </div>
        </div>
        <div class="swiper-scrollbar"></div>
      `;
      searchForm.append(searchResultBox);
      searchWrapContent.append(searchForm);

      // Popular Keywords (from original HTML)
      const popularKeywords = toolsDiv.querySelector(`.${NAV_CLASSES.SEARCH_SUGGESTIONS_WRAP}:first-of-type`);
      if (popularKeywords) {
        searchWrapContent.append(popularKeywords.cloneNode(true));
      }

      // Recommended for you (from original HTML)
      const recommendedKeywords = toolsDiv.querySelector(`.${NAV_CLASSES.SEARCH_SUGGESTIONS_WRAP}:last-of-type`);
      if (recommendedKeywords) {
        searchWrapContent.append(recommendedKeywords.cloneNode(true));
      }

      searchScreenWrap.append(searchWrapContent);
      searchLi.append(searchScreenWrap);

      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isSearchOpen = searchScreenWrap.classList.contains(NAV_CLASSES.SEARCH_OPEN);
        closeAllMenus(nav, navSections); // Close other menus
        searchScreenWrap.classList.toggle(NAV_CLASSES.SEARCH_OPEN, !isSearchOpen);
        searchLink.querySelector(`.${NAV_CLASSES.LENS}`).style.display = isSearchOpen ? 'block' : 'none';
        searchLink.querySelector(`.${NAV_CLASSES.CLOSE}`).style.display = isSearchOpen ? 'none' : 'block';
        searchLink.setAttribute('aria-label', isSearchOpen ? NAV_ARIA_LABELS.OPEN_SEARCH : NAV_ARIA_LABELS.CLOSE_SEARCH);
        if (!isSearchOpen) {
          searchScreenWrap.querySelector('input').focus();
        }
      });
    }
    ul.append(searchLi);
    iconNav.append(ul);
    navWrapper.append(iconNav);
  }

  // 80-year logo
  if (year80LogoDiv) {
    const yearLogo = document.createElement('div');
    yearLogo.classList.add(NAV_CLASSES.LOGO, NAV_CLASSES.YEAR_80_LOGO);
    const yearLink = year80LogoDiv.querySelector('a');
    if (yearLink) {
      const yearImg = year80LogoDiv.querySelector('picture img');
      if (yearImg) {
        yearImg.classList.add(NAV_CLASSES.HIDDEN_LOGO1, NAV_CLASSES.YEARS_80);
        yearLink.innerHTML = '';
        yearLink.append(yearImg);
      }
      yearLogo.append(yearLink);
    }
    navWrapper.append(yearLogo);
  }

  // Clear original fragment content and append the new structure
  nav.innerHTML = '';
  nav.append(navWrapper);
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
  nav.classList.add(NAV_CLASSES.MAIN_HEADER, NAV_CLASSES.SOLID, NAV_CLASSES.NAV_UP); // Add base header classes

  // The fragment contains top-level divs for brand, sections, tools, and 80-year logo
  // We need to process these children.
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  // Restructure the fragment content into the desired header structure
  parseStructure(nav);

  // Setup desktop and mobile navigation behaviors
  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav);

  block.append(nav);
}
