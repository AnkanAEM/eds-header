import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelectorAll('.nav-sections, .nav-brand');
    const navSectionExpanded = Array.from(navSections).find((s) => s.getAttribute('aria-expanded') === 'true');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  // Only close if focus moves to another element within the page that is NOT in the nav
  if (e.relatedTarget && !nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelectorAll('.nav-sections, .nav-brand');
    const navSectionExpanded = Array.from(navSections).find((s) => s.getAttribute('aria-expanded') === 'true');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    const nav = focused.closest('nav');
    const navSections = nav.querySelectorAll('.nav-sections, .nav-brand');
    toggleAllNavSections(navSections);
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.forEach((section) => {
    if (section.classList.contains('nav-drop')) {
      section.setAttribute('aria-expanded', expanded);
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (isDesktop.matches) {
    toggleAllNavSections(navSections, expanded ? 'false' : 'true');
  } else {
    // On mobile, always collapse all sections when toggling the main menu
    toggleAllNavSections(navSections, false);
  }
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = Array.from(navSections).filter((s) => s.classList.contains('nav-drop'));
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
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
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const navChildren = [...nav.children];
  if (navChildren.length > 0) {
    // First child is brand
    navChildren[0].classList.add('nav-brand');
    // Last child is tools
    navChildren[navChildren.length - 1].classList.add('nav-tools');
    // Everything in between is sections
    for (let i = 1; i < navChildren.length - 1; i += 1) {
      navChildren[i].classList.add('nav-sections');
    }
  }

  const navSections = nav.querySelectorAll('.nav-sections, .nav-brand, .nav-tools');
  navSections.forEach((navSection) => {
    navSection.querySelectorAll('.button-container').forEach((bc) => {
      bc.className = '';
    });
    navSection.querySelectorAll('.button').forEach((b) => {
      b.className = '';
    });

    // Dropdown decoration
    if (navSection.classList.contains('nav-tools')) return;

    const trigger = navSection.querySelector('p');
    const menus = navSection.querySelectorAll('ul');
    const columnMarkers = [...navSection.querySelectorAll('p')].filter((p) => p.textContent.trim().toLowerCase() === 'column');

    if (trigger && menus.length > 0) {
      navSection.classList.add('nav-drop');
      const isMega = columnMarkers.length > 0 || menus.length > 1;
      if (isMega) navSection.classList.add('nav-mega-menu');

      // Create a wrapper for the entire sub-menu
      const menuWrapper = document.createElement('div');
      menuWrapper.className = 'nav-drop-menu';
      
      // Separate the trigger from the content
      const menuContent = document.createElement('div');
      menuContent.className = 'nav-drop-menu-content';
      
      // Group columns
      if (isMega) {
        menus.forEach((ul) => {
          const col = document.createElement('div');
          col.className = 'nav-mega-column';
          col.append(ul);
          menuContent.append(col);
        });
        // Remove column markers from the original DOM
        columnMarkers.forEach((m) => m.remove());
      } else {
        menuContent.append(menus[0]);
      }
      
      menuWrapper.append(menuContent);
      navSection.append(menuWrapper);

      const toggle = (expanded) => {
        const isExpanded = expanded !== undefined ? expanded : navSection.getAttribute('aria-expanded') === 'true';
        if (isDesktop.matches) {
          navSections.forEach((s) => {
            if (s !== navSection) s.setAttribute('aria-expanded', 'false');
          });
        }
        navSection.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      };

      navSection.addEventListener('click', (e) => {
        const isExpanded = navSection.getAttribute('aria-expanded') === 'true';
        if (!isDesktop.matches) {
          if (!isExpanded) {
            e.preventDefault();
            e.stopPropagation();
            nav.dataset.menuLevel = '1';
            nav.querySelector('.nav-title').textContent = trigger.textContent;
            toggle(false); // Force expand
          } else if (e.target.closest('a') && !e.target.closest('.nav-drop-menu')) {
            // Already expanded and clicked trigger again?
            // We can either do nothing or just let the back button handle close.
            e.preventDefault();
          }
        } else {
          if (e.target.closest('a') && !e.target.closest('.nav-drop-menu')) return;
          toggle();
        }
      });

      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches) toggle(false);
      });
    }
  });

  // mobile header (back, title)
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'nav-mobile-header';
  mobileHeader.innerHTML = `<button class="nav-back" aria-label="Back"></button><span class="nav-title">Menu</span>`;
  const backBtn = mobileHeader.querySelector('.nav-back');
  backBtn.addEventListener('click', () => {
    nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => drop.setAttribute('aria-expanded', 'false'));
    nav.dataset.menuLevel = '0';
    mobileHeader.querySelector('.nav-title').textContent = 'Menu';
  });
  nav.prepend(mobileHeader);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>`;
  hamburger.addEventListener('click', () => {
    toggleMenu(nav, navSections);
    // Reset mobile menu level on close
    if (nav.getAttribute('aria-expanded') === 'false') {
      nav.dataset.menuLevel = '0';
      mobileHeader.querySelector('.nav-title').textContent = 'Menu';
    }
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  nav.dataset.menuLevel = '0';
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, false);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, false));

  // click outside to close desktop sub-menus
  window.addEventListener('click', (e) => {
    if (isDesktop.matches) {
      const expandedSection = nav.querySelector('.nav-drop[aria-expanded="true"]');
      if (expandedSection && !expandedSection.contains(e.target)) {
        expandedSection.setAttribute('aria-expanded', 'false');
      }
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
