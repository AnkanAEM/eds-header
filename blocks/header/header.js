import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * Moves instrumentation attributes from an original element to a new element.
 * @param {Element} originalElement The original element from the fragment.
 * @param {Element} newElement The new element created in the block.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  const attributes = Array.from(originalElement.attributes);
  attributes.forEach((attr) => {
    if (attr.name.startsWith('data-cmp-') || attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Sanitizes a string to be used as a CSS class.
 * @param {string} text The input string.
 * @returns {string} The sanitized string.
 */
function sanitizeClassName(text) {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Toggles the expanded state of a navigation item.
 * @param {HTMLElement} item The navigation item (<li>) to toggle.
 * @param {boolean} expanded The desired expanded state.
 */
function toggleNavItem(item, expanded) {
  if (!item) return;
  item.classList.toggle('cmp-header__nav-products-click', expanded);
  item.setAttribute('aria-expanded', expanded);
  const submenu = item.querySelector('.cmp-header__product-items, .cmp-header__submenu');
  if (submenu) {
    submenu.setAttribute('aria-hidden', !expanded);
  }
}

/**
 * Closes all expanded navigation sections except the one provided.
 * @param {HTMLElement} navGroup The main navigation group.
 * @param {HTMLElement} excludeItem The item to exclude from closing.
 */
function closeAllNavItems(navGroup, excludeItem = null) {
  if (!navGroup) return;
  navGroup.querySelectorAll('.cmp-header__nav-products-click').forEach((item) => {
    if (item !== excludeItem) {
      toggleNavItem(item, false);
    }
  });
}

/**
 * Sets up the mobile navigation behavior.
 * @param {HTMLElement} nav The main nav element.
 * @param {HTMLElement} navSections The nav sections container.
 * @param {HTMLInputElement} hamburger The hamburger checkbox.
 */
function setupMobileNav(nav, navSections, hamburger) {
  if (!nav || !navSections || !hamburger) return;

  hamburger.addEventListener('change', () => {
    const expanded = hamburger.checked;
    nav.setAttribute('aria-expanded', expanded);
    document.body.style.overflowY = expanded ? 'hidden' : '';

    if (!expanded) {
      closeAllNavItems(navSections);
    }
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.checked) {
      hamburger.checked = false;
      hamburger.dispatchEvent(new Event('change'));
    }
  });

  navSections.querySelectorAll('.cmp-navigation__item--level-0').forEach((navItem) => {
    const hasChildren = navItem.querySelector('ul');
    if (hasChildren) {
      const link = navItem.querySelector('.cmp-navigation__item-link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = navItem.classList.contains('cmp-header__nav-products-click');
          closeAllNavItems(navSections, navItem);
          toggleNavItem(navItem, !isExpanded);
        });
      }

      navItem.querySelectorAll('.cmp-navigation__item--level-1').forEach((subNavItem) => {
        const hasSubChildren = subNavItem.querySelector('ul');
        if (hasSubChildren) {
          const subLink = subNavItem.querySelector('.cmp-navigation__item-link');
          if (subLink) {
            subLink.addEventListener('click', (e) => {
              e.preventDefault();
              const isSubExpanded = subNavItem.classList.contains('cmp-header__nav-products-click');
              navItem.querySelectorAll('.cmp-navigation__item--level-1.cmp-header__nav-products-click').forEach((otherSub) => {
                if (otherSub !== subNavItem) {
                  toggleNavItem(otherSub, false);
                }
              });
              toggleNavItem(subNavItem, !isSubExpanded);
            });
          }
        }
      });
    }
  });
}

/**
 * Decorates the navigation list items.
 * @param {HTMLElement} ulElement The <ul> element to decorate.
 * @param {number} level The current nesting level (0 for top-level).
 * @param {boolean} isMobile Whether the current view is mobile.
 */
function decorateNavList(ulElement, level, isMobile) {
  if (!ulElement) return;

  Array.from(ulElement.children).filter(el => el.nodeType === 1).forEach((li) => {
    li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);

    const linkOrStrong = li.querySelector(':scope > a, :scope > strong');
    if (linkOrStrong) {
      const link = linkOrStrong.tagName === 'A' ? linkOrStrong : document.createElement('a');
      if (linkOrStrong.tagName === 'STRONG') {
        link.textContent = linkOrStrong.textContent;
        linkOrStrong.replaceWith(link);
      }
      link.classList.add('cmp-navigation__item-link');

      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        li.classList.add('cmp-header__nav-products');
        // Add specific class for click behavior on mobile
        if (isMobile) {
          li.classList.add('cmp-header__nav-products-click');
          li.setAttribute('aria-expanded', 'false');
        } else {
          li.setAttribute('aria-expanded', 'false'); // Default for desktop, CSS handles hover
        }

        const categoryMenu = document.createElement('div');
        categoryMenu.classList.add('cmp-header__category-menu');
        // Move instrumentation from the text node or p tag before ul, if it exists
        const prevSibling = nestedUl.previousElementSibling;
        if (prevSibling && (prevSibling.tagName === 'P' || prevSibling.nodeType === Node.TEXT_NODE)) {
          moveInstrumentation(prevSibling, categoryMenu);
        }

        while (nestedUl.firstChild) {
          categoryMenu.append(nestedUl.firstChild);
        }
        nestedUl.append(categoryMenu);
        nestedUl.classList.add('cmp-navigation__group', level === 0 ? 'cmp-header__product-items' : 'cmp-header__submenu');
        nestedUl.setAttribute('aria-hidden', 'true');

        decorateNavList(nestedUl, level + 1, isMobile);
      } else {
        li.classList.add('cmp-header__no-items');
      }

      const linkText = link.textContent.toLowerCase();
      if (linkText.includes('recipes')) {
        li.classList.add('mobile-icon-recipes');
      } else if (linkText.includes('media')) {
        li.classList.add('mobile-icon-media');
      } else if (linkText.includes('about us')) {
        li.classList.add('mobile-icon-about-us');
      }
    }
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.classList.add('cmp-header');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const headerContent = document.createDocumentFragment();

  const hamburgerInput = document.createElement('input');
  hamburgerInput.type = 'checkbox';
  hamburgerInput.classList.add('cmp-header__hamburger');
  headerContent.append(hamburgerInput);
  const originalHamburger = fragment.querySelector('.cmp-header__hamburger');
  if (originalHamburger) {
    moveInstrumentation(originalHamburger, hamburgerInput);
  }

  const sections = Array.from(fragment.children).filter(el => el.nodeType === 1);
  if (sections.length < 3) {
    console.warn('Header fragment does not contain expected 3 sections (Brand, Nav, Tools).');
    return;
  }

  const brandSection = sections[0];
  const navSection = sections[1];
  const toolsSection = sections[2];

  // 1. Brand Section (Logo)
  const logoDiv = document.createElement('div');
  const brandLink = brandSection.querySelector('p > picture > img')?.closest('a');
  if (brandLink) {
    const picture = brandLink.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img && img.src) {
        logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
        const newPicture = picture.cloneNode(true);
        const newLink = brandLink.cloneNode(false);
        newLink.append(newPicture);
        logoDiv.append(newLink);
        moveInstrumentation(brandSection, logoDiv);
        headerContent.append(logoDiv);
      }
    }
  }

  // 2. Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationContainer = document.createElement('div');
  navigationContainer.classList.add('navigation');
  const navElement = document.createElement('nav');
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');
  navElement.setAttribute('aria-label', 'Main navigation');
  navElement.setAttribute('aria-expanded', 'false'); // Initial state for main nav
  moveInstrumentation(navSection, navLinksDiv);

  const mainUl = document.createElement('ul');
  mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  let navContentBuffer = [];

  Array.from(navSection.children).forEach((child) => {
    if (child.nodeType === 1) {
      if (child.tagName === 'P' && child.querySelector('a')) {
        if (navContentBuffer.length > 0) {
          const lastLi = mainUl.lastElementChild;
          if (lastLi && lastLi.classList.contains('cmp-header__nav-products')) {
            const lastMenu = lastLi.querySelector('.cmp-header__product-items');
            if (lastMenu) {
              const leftDiv = document.createElement('div');
              const title = lastLi.querySelector('.cmp-navigation__item-link')?.textContent || 'untitled';
              leftDiv.classList.add('left-div', `${sanitizeClassName(title)}-left-div`);
              navContentBuffer.forEach(bufferedNode => leftDiv.append(bufferedNode));
              lastMenu.prepend(leftDiv);
            }
          }
          navContentBuffer = [];
        }
        const li = document.createElement('li');
        const link = child.querySelector('a').cloneNode(true);
        li.append(link);
        moveInstrumentation(child, li);
        mainUl.append(li);
      } else if (child.tagName === 'UL') {
        const lastLi = mainUl.lastElementChild;
        if (lastLi) {
          const clonedUl = child.cloneNode(true);
          lastLi.append(clonedUl);
          moveInstrumentation(child, clonedUl);
        }
      } else if (child.textContent.trim() !== '') {
        navContentBuffer.push(child.cloneNode(true));
      }
    }
  });

  if (navContentBuffer.length > 0) {
    const lastLi = mainUl.lastElementChild;
    if (lastLi && lastLi.classList.contains('cmp-header__nav-products')) {
      const lastMenu = lastLi.querySelector('.cmp-header__product-items');
      if (lastMenu) {
        const leftDiv = document.createElement('div');
        const title = lastLi.querySelector('.cmp-navigation__item-link')?.textContent || 'untitled';
        leftDiv.classList.add('left-div', `${sanitizeClassName(title)}-left-div`);
        navContentBuffer.forEach(bufferedNode => leftDiv.append(bufferedNode));
        lastMenu.prepend(leftDiv);
      }
    }
  }

  decorateNavList(mainUl, 0, !isDesktop.matches);

  navElement.append(mainUl);

  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');

  Array.from(toolsSection.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const newLi = document.createElement('li');
          newLi.classList.add('cmp-header__policy-list');
          newLi.append(link.cloneNode(true));
          moveInstrumentation(li, newLi);

          const href = link.href.toLowerCase();
          if (href.includes('instagram')) {
            const socialLink = link.cloneNode(true);
            socialLink.classList.add('icon-instagram');
            socialLink.removeAttribute('title');
            socialMediaDiv.append(socialLink);
          } else if (href.includes('facebook')) {
            const socialLink = link.cloneNode(true);
            socialLink.classList.add('icon-facebok');
            socialLink.removeAttribute('title');
            socialMediaDiv.append(socialLink);
          } else if (href.includes('twitter')) {
            const socialLink = link.cloneNode(true);
            socialLink.classList.add('icon-twitter');
            socialLink.removeAttribute('title');
            socialMediaDiv.append(socialLink);
          } else if (href.includes('youtube')) {
            const socialLink = link.cloneNode(true);
            socialLink.classList.add('icon-youtube');
            socialLink.removeAttribute('title');
            socialMediaDiv.append(socialLink);
          } else {
            policyUl.append(newLi);
          }
        }
      });
    }
  });

  if (policyUl.children.length > 0) {
    mobileListDiv.append(policyUl);
  }
  if (socialMediaDiv.children.length > 0) {
    mobileListDiv.append(socialMediaDiv);
  }
  if (mobileListDiv.children.length > 0) {
    navElement.append(mobileListDiv);
  }

  navigationContainer.append(navElement);
  navLinksDiv.append(navigationContainer);
  headerContent.append(navLinksDiv);

  // 3. Navigation Icons (Accessibility, Search, Login)
  const navIconsDiv = document.createElement('div');
  let hasIcons = false;

  Array.from(toolsSection.querySelectorAll('ul > li')).forEach((li) => {
    const strong = li.querySelector('strong');
    if (strong) {
      const text = strong.textContent.trim().toLowerCase();
      const iconDiv = document.createElement('div');
      const iconLink = document.createElement('a');
      iconLink.href = '#';
      iconLink.classList.add('cmp-header__icon-img');
      const iconSpan = document.createElement('div');
      const iconText = document.createElement('div');
      iconText.classList.add('cmp-header__icon-text');
      iconText.textContent = strong.textContent.trim();

      if (text === 'accessibility') {
        iconDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
        iconSpan.classList.add('icon-accessibility');
        hasIcons = true;
      } else if (text === 'search') {
        iconDiv.classList.add('cmp-header__search');
        iconSpan.classList.add('icon-search');
        hasIcons = true;
      } else if (text === 'login') {
        iconDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
        iconSpan.classList.add('icon-profile');
        hasIcons = true;
      } else {
        return;
      }
      iconLink.append(iconSpan);
      iconLink.append(iconText);
      iconDiv.append(iconLink);
      navIconsDiv.append(iconDiv);
      moveInstrumentation(li, iconDiv);
    }
  });

  if (hasIcons) {
    navIconsDiv.classList.add('cmp-header__nav-icons');
    moveInstrumentation(toolsSection, navIconsDiv);
    headerContent.append(navIconsDiv);
  }

  block.append(headerContent);

  // Setup mobile navigation interactions only if not desktop
  if (!isDesktop.matches) {
    setupMobileNav(block, navLinksDiv, hamburgerInput);
  }
}
