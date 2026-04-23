import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../../scripts/lib-franklin.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');

/**
 * Manages accessibility attributes and keyboard navigation for menu items.
 * @param {Element} nav The main navigation element.
 */
function setupAccessibility(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
    hamburgerButton.setAttribute('aria-controls', 'menu'); // ID of the mobile menu container
    hamburgerButton.setAttribute('aria-expanded', 'false');
  }

  navSections.querySelectorAll('.nav-sections > ul > li').forEach((l1Item, index) => {
    const hasSubMenu = l1Item.querySelector('.desktop-panel');
    const l1LinkOrSpan = l1Item.querySelector('.link-title a') || l1Item.querySelector('.link-title span');

    if (l1LinkOrSpan) {
      if (hasSubMenu) {
        // For L1 items with sub-menus, the link-title span acts as a button
        l1LinkOrSpan.setAttribute('role', 'button');
        l1LinkOrSpan.setAttribute('aria-expanded', 'false');
        l1LinkOrSpan.setAttribute('aria-controls', `nav-dropdown-${index}`);
        hasSubMenu.id = `nav-dropdown-${index}`;
        l1Item.classList.add('nav-drop'); // Add class for styling
      } else if (l1LinkOrSpan.tagName === 'SPAN') {
        // If it's a span but has no submenu, it should probably be a link or removed
        // For now, ensure it doesn't have button role if no submenu
        l1LinkOrSpan.removeAttribute('role');
        l1LinkOrSpan.removeAttribute('aria-expanded');
        l1LinkOrSpan.removeAttribute('aria-controls');
        l1Item.classList.remove('nav-drop');
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (isDesktop.matches) {
        const openDesktopMenu = navSections.querySelector('.nav-sections > ul > li.nav-drop > [aria-expanded="true"]');
        if (openDesktopMenu) {
          toggleDesktopDropdown(openDesktopMenu.closest('li'), false);
          openDesktopMenu.focus();
        }
      } else {
        // Mobile menu
        if (nav.classList.contains('menu-open')) {
          toggleMobileMenu(nav, false);
          if (hamburgerButton) hamburgerButton.focus();
        }
      }
    }
  });
}

/**
 * Toggles the expanded state of a desktop dropdown menu.
 * @param {Element} l1Item The L1 list item acting as the dropdown parent.
 * @param {boolean|null} forceExpanded Optional: force a specific expanded state.
 */
function toggleDesktopDropdown(l1Item, forceExpanded = null) {
  const l1Button = l1Item.querySelector('[role="button"]');
  const dropdownPanel = l1Item.querySelector('.desktop-panel');

  if (!l1Button || !dropdownPanel) return;

  const isExpanded = forceExpanded !== null ? forceExpanded : l1Button.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    l1Button.setAttribute('aria-expanded', 'false');
    dropdownPanel.classList.add('hidden');
    dropdownPanel.classList.remove('open');
  } else {
    // Close all other open dropdowns
    l1Item.closest('.nav-sections').querySelectorAll('.nav-sections > ul > li.nav-drop > [aria-expanded="true"]').forEach((otherL1Button) => {
      if (otherL1Button !== l1Button) {
        toggleDesktopDropdown(otherL1Button.closest('li'), false);
      }
    });

    l1Button.setAttribute('aria-expanded', 'true');
    dropdownPanel.classList.remove('hidden');
    dropdownPanel.classList.add('open');
  }
}

/**
 * Handles desktop navigation behavior, including dropdowns and outside clicks.
 * @param {Element} nav The main navigation element.
 */
function setupDesktopNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((l1Item) => {
    const l1Button = l1Item.querySelector('[role="button"]');
    const dropdownPanel = l1Item.querySelector('.desktop-panel');

    if (l1Button && dropdownPanel) {
      dropdownPanel.classList.add('hidden'); // Initially hidden

      // Click to toggle dropdown
      l1Button.addEventListener('click', (e) => {
        if (isDesktop.matches) {
          e.preventDefault();
          toggleDesktopDropdown(l1Item);
        }
      });

      // Hover to open dropdown (desktop only)
      l1Item.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleDesktopDropdown(l1Item, true);
        }
      });

      // Hover out to close dropdown (desktop only)
      l1Item.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          toggleDesktopDropdown(l1Item, false);
        }
      });
    }
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      navSections.querySelectorAll('.nav-sections > ul > li.nav-drop > [aria-expanded="true"]').forEach((l1Button) => {
        toggleDesktopDropdown(l1Button.closest('li'), false);
      });
    }
  });
}

/**
 * Toggles the mobile menu open/closed state.
 * @param {Element} nav The main navigation element.
 * @param {boolean|null} forceExpanded Optional: force a specific expanded state.
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  const mobileMenu = nav.querySelector('.menu');
  const hamburgerButton = nav.querySelector('.nav-hamburger button');
  if (!mobileMenu || !hamburgerButton) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('menu-open');

  if (expanded) {
    // Close menu
    nav.classList.remove('menu-open');
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
  } else {
    // Open menu
    nav.classList.add('menu-open');
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    hamburgerButton.setAttribute('aria-expanded', 'true');
    hamburgerButton.setAttribute('aria-label', 'Close navigation');
  }
}

/**
 * Handles mobile navigation behavior, including hamburger toggle and accordion menus.
 * @param {Element} nav The main navigation element.
 */
function setupMobileNav(nav) {
  const hamburger = nav.querySelector('.nav-hamburger');
  const mobileMenu = nav.querySelector('.menu');
  if (!hamburger || !mobileMenu) return;

  // Initial state for mobile menu
  mobileMenu.classList.add('hidden');
  nav.classList.remove('menu-open');

  hamburger.addEventListener('click', () => toggleMobileMenu(nav));

  const mobileMenuClose = mobileMenu.querySelector('.close-icon');
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => toggleMobileMenu(nav, false));
  }

  const mobileMenuBack = mobileMenu.querySelector('.back-arrow');
  const mobileMenuTitle = mobileMenu.querySelector('.menu-title');
  if (mobileMenuBack && mobileMenuTitle) {
    mobileMenuBack.addEventListener('click', () => {
      const currentPanel = mobileMenu.querySelector('.panel.open');
      if (currentPanel) {
        currentPanel.classList.remove('open');
        currentPanel.style.maxHeight = null;
        const parentAccordion = currentPanel.previousElementSibling;
        if (parentAccordion && parentAccordion.classList.contains('accordion')) {
          parentAccordion.setAttribute('aria-expanded', 'false');
        }
        mobileMenuBack.classList.add('hidden');
        mobileMenuTitle.textContent = 'Menu'; // Reset title
      }
    });
    mobileMenuBack.classList.add('hidden'); // Initially hidden
  }

  mobileMenu.querySelectorAll('.menu-list > li.accordion').forEach((l1Item) => {
    const l1Title = l1Item.querySelector('.menu-title');
    const panel = l1Item.nextElementSibling;

    if (l1Title && panel && panel.classList.contains('panel')) {
      l1Item.setAttribute('aria-expanded', 'false');
      panel.classList.add('hidden');
      panel.style.maxHeight = null;

      l1Title.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = l1Item.getAttribute('aria-expanded') === 'true';

        l1Item.closest('.menu-list').querySelectorAll('li.accordion[aria-expanded="true"]').forEach((otherL1) => {
          if (otherL1 !== l1Item) {
            otherL1.setAttribute('aria-expanded', 'false');
            const otherPanel = otherL1.nextElementSibling;
            if (otherPanel) {
              otherPanel.classList.add('hidden');
              otherPanel.style.maxHeight = null;
            }
          }
        });

        if (isExpanded) {
          l1Item.setAttribute('aria-expanded', 'false');
          panel.classList.add('hidden');
          panel.style.maxHeight = null;
          if (mobileMenuBack) mobileMenuBack.classList.add('hidden');
          if (mobileMenuTitle) mobileMenuTitle.textContent = 'Menu';
        } else {
          l1Item.setAttribute('aria-expanded', 'true');
          panel.classList.remove('hidden');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
          if (mobileMenuBack) mobileMenuBack.classList.remove('hidden');
          if (mobileMenuTitle) mobileMenuTitle.textContent = l1Title.textContent;
        }
      });
    }
  });
}

/**
 * Parses the fragment structure and applies top-level wrappers and classes.
 * @param {Element} nav The fetched fragment's root element.
 */
function parseStructure(nav) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('navbar', 'navbar-arena', 'g-container');

  const children = Array.from(nav.children);

  // Brand (expected to be the first div, containing the logo)
  const navBrand = children.shift();
  if (navBrand) {
    navBrand.classList.add('logo-wrapper');
    const logoBlock = navBrand.querySelector('.logo.block');
    if (logoBlock) {
      logoBlock.classList.add('arena');
    }
    wrapper.append(navBrand);
  }

  // Hamburger button for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button"><span class="nav-hamburger-icon"></span></button>';
  wrapper.prepend(hamburger);

  // Main navigation sections (expected to be the 'links' div)
  const navSections = children.shift();
  if (navSections) {
    navSections.classList.add('links', 'nav-sections');
    wrapper.append(navSections);

    const ul = document.createElement('ul');
    navSections.querySelectorAll(':scope > div').forEach((linkTitleDiv) => {
      const li = document.createElement('li');
      li.classList.add('nav-link');

      const linkTitleSpan = linkTitleDiv.querySelector('.link-title span');
      const linkTitleA = linkTitleDiv.querySelector('.link-title a');
      const desktopPanel = linkTitleDiv.querySelector('.desktop-panel');

      if (linkTitleA) {
        li.append(linkTitleA);
      } else if (linkTitleSpan) {
        // If it's a span, we need to wrap its content in a new span for consistency
        const newSpan = document.createElement('span');
        newSpan.classList.add('link-title'); // Re-add link-title class to the new span
        newSpan.textContent = linkTitleSpan.textContent;
        li.append(newSpan);
      }

      if (desktopPanel) {
        li.append(desktopPanel);
        desktopPanel.classList.add('panel');
      }
      ul.append(li);
      linkTitleDiv.remove(); // Remove the original div container
    });
    navSections.prepend(ul);
  }

  // Tools/Right section (expected to be the 'right' div)
  const navTools = children.shift();
  if (navTools) {
    navTools.classList.add('right', 'nav-tools');
    navTools.id = 'nav-right';
    wrapper.append(navTools);

    const contactBlock = navTools.querySelector('.contact.block');
    if (contactBlock) {
      contactBlock.classList.add('contact_wrp_arena', 'user__contact', 'header');
      const contactTitle = contactBlock.querySelector('h4');
      if (contactTitle) contactTitle.classList.add('user__contact-title');
      const phoneIcon = contactBlock.querySelector('.icon-phone');
      if (phoneIcon) phoneIcon.classList.add('user__contact-title');
    }

    const signInWrapper = navTools.querySelector('.sign-in-wrapper');
    if (signInWrapper) {
      const signInBlock = signInWrapper.querySelector('.sign-in.block');
      if (signInBlock) {
        const userDropdown = signInBlock.querySelector('.user__dropdown');
        if (userDropdown) {
          const userAccount = userDropdown.querySelector('.user__account');
          if (userAccount) {
            userAccount.querySelectorAll('a, .sign-in-btn').forEach((item) => {
              item.classList.add('user__account--link');
              const iconSpan = item.querySelector('.user__account__list-icon');
              if (iconSpan) {
                const img = iconSpan.querySelector('img');
                if (img) iconSpan.replaceWith(img);
              }
            });
          }
        }
      }
    }
  }

  // Mobile menu container
  const mobileMenuContainer = document.createElement('div');
  mobileMenuContainer.id = 'menu';
  mobileMenuContainer.classList.add('menu', 'hidden', 'menu-arena');

  const mobileMenuHeader = document.createElement('div');
  mobileMenuHeader.classList.add('menu-header');
  mobileMenuHeader.innerHTML = '<div class="back-arrow"></div><span class="menu-title">Menu</span><span class="close-icon"></span>';
  mobileMenuContainer.append(mobileMenuHeader);

  const mobileMenuList = document.createElement('ul');
  mobileMenuList.classList.add('menu-list');
  mobileMenuContainer.append(mobileMenuList);

  // Populate mobile menu from navSections content
  if (navSections) {
    navSections.querySelectorAll('.nav-sections > ul > li').forEach((l1Item, index) => {
      const mobileLi = document.createElement('li');
      mobileLi.id = `menu-item-${index}`;
      mobileLi.classList.add('nav-link');

      const l1LinkOrSpan = l1Item.querySelector('.link-title a') || l1Item.querySelector('.link-title span');
      if (l1LinkOrSpan) {
        const menuTitleSpan = document.createElement('span');
        menuTitleSpan.classList.add('menu-title');
        if (l1LinkOrSpan.tagName === 'A') {
          menuTitleSpan.append(l1LinkOrSpan.cloneNode(true));
        } else {
          menuTitleSpan.textContent = l1LinkOrSpan.textContent;
        }
        mobileLi.append(menuTitleSpan);
      }

      const desktopPanel = l1Item.querySelector('.desktop-panel');
      if (desktopPanel) {
        mobileLi.classList.add('accordion');
        const mobilePanel = desktopPanel.cloneNode(true);
        mobilePanel.classList.remove('desktop-panel');
        mobilePanel.classList.add('panel');
        mobileMenuList.append(mobileLi, mobilePanel);
      } else {
        mobileMenuList.append(mobileLi);
      }
    });
  }

  // Append sign-in and contact items to mobile menu if they exist in navTools
  if (navTools) {
    const signInLinks = navTools.querySelectorAll('.user__account--link');
    signInLinks.forEach((link) => {
      const mobileLi = document.createElement('li');
      mobileLi.append(link.cloneNode(true));
      mobileMenuList.append(mobileLi);
    });
  }

  // Append the mobile menu container to the main nav
  nav.append(mobileMenuContainer);

  // Replace the original nav content with the structured wrapper
  nav.textContent = '';
  nav.append(wrapper);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('corp-header-block');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  parseStructure(nav);
  setupAccessibility(nav);
  setupDesktopNav(nav);
  setupMobileNav(nav);

  // Initial state and resize listener
  toggleMobileMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMobileMenu(nav, isDesktop.matches);
    if (isDesktop.matches) {
      nav.querySelectorAll('.nav-sections > ul > li.nav-drop > [aria-expanded="true"]').forEach((l1Button) => {
        toggleDesktopDropdown(l1Button.closest('li'), false);
      });
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
