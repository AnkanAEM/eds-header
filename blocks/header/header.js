import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * Moves instrumentation attributes from an original element to a new one.
 * @param {Element} originalElement The original element from the fragment.
 * @param {Element} newElement The newly created or transformed element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  [...originalElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-cmp-') || attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Recursively decorates navigation list items.
 * @param {HTMLUListElement} ulElement The UL element to decorate.
 * @param {number} level The current navigation level (0 for top-level).
 * @param {boolean} isMobile Whether the navigation is for mobile.
 */
function decorateNavList(ulElement, level, isMobile) {
  if (!ulElement) return;

  // Add specific classes based on level and context
  if (level === 0) {
    ulElement.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  } else if (level === 1) {
    ulElement.classList.add('cmp-navigation__group', 'cmp-header__product-items');
  } else if (level >= 2) {
    ulElement.classList.add('cmp-navigation__group', 'cmp-header__submenu');
  }

  // Handle the 'category-menu' wrapper for level 1 and above
  if (level >= 1) {
    const categoryMenuDiv = document.createElement('div');
    categoryMenuDiv.classList.add('cmp-header__category-menu');
    moveInstrumentation(ulElement, categoryMenuDiv);

    // Move children from original UL to the new div
    while (ulElement.firstChild) {
      categoryMenuDiv.append(ulElement.firstChild);
    }
    ulElement.append(categoryMenuDiv); // Append the new div back to the original UL
  }

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType === Node.ELEMENT_NODE) {
      li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);
      moveInstrumentation(li, li);

      const linkElement = li.querySelector('a');
      const nestedUl = li.querySelector('ul');

      if (linkElement) {
        linkElement.classList.add('cmp-navigation__item-link');
        moveInstrumentation(linkElement, linkElement);

        if (nestedUl) {
          li.classList.add('cmp-header__nav-products');

          // Add chevron and ARIA attributes for toggleable items
          const chevron = document.createElement('span');
          chevron.classList.add('icon-chevron-right');
          linkElement.append(chevron);

          linkElement.setAttribute('role', 'button');
          linkElement.setAttribute('aria-expanded', 'false');
          const submenuId = `nav-submenu-${level}-${Array.from(li.parentNode.children).indexOf(li)}`;
          linkElement.setAttribute('aria-controls', submenuId);
          nestedUl.id = submenuId;

          if (isMobile) {
            linkElement.addEventListener('click', (event) => {
              event.preventDefault();
              event.stopPropagation();
              const isExpanded = linkElement.getAttribute('aria-expanded') === 'true';
              linkElement.setAttribute('aria-expanded', !isExpanded);
              nestedUl.style.display = isExpanded ? 'none' : 'flex';
              chevron.classList.toggle('active', !isExpanded);
            });
          }
          decorateNavList(nestedUl, level + 1, isMobile);
        } else {
          li.classList.add('cmp-header__no-items');
          if (isMobile) {
            const linkText = linkElement.textContent.toLowerCase();
            if (linkText.includes('recipes')) {
              li.classList.add('mobile-icon-recipes');
            } else if (linkText.includes('media')) {
              li.classList.add('mobile-icon-media');
            } else if (linkText.includes('about us')) {
              li.classList.add('mobile-icon-about-us');
            }
          }
        }
      } else {
        // Handle cases where LI might contain other elements or just text without a link
        // This might be a policy item or similar, handled in mobile-list later
        if (li.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = li.textContent.trim();
          li.textContent = '';
          li.append(span);
        }
      }
    }
  });
}

/**
 * Toggles the mobile navigation menu.
 * @param {Element} header The header block element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMobileMenu(header, forceExpanded = null) {
  if (!header) return;

  const hamburgerCheckbox = header.querySelector('.cmp-header__hamburger');
  if (!hamburgerCheckbox) return;

  const isExpanded = forceExpanded !== null ? forceExpanded : hamburgerCheckbox.checked;
  hamburgerCheckbox.checked = isExpanded;
  document.body.style.overflowY = isExpanded ? 'hidden' : '';

  // Reset all sub-menus when main menu is closed
  if (!isExpanded) {
    header.querySelectorAll('.cmp-header__product-items, .cmp-header__submenu').forEach((menu) => {
      menu.style.display = 'none';
      const parentLink = menu.previousElementSibling; // This assumes the UL is a sibling of the link
      if (parentLink && parentLink.classList.contains('cmp-navigation__item-link')) {
        parentLink.setAttribute('aria-expanded', 'false');
        const chevron = parentLink.querySelector('.icon-chevron-right');
        if (chevron) chevron.classList.remove('active');
      }
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.classList.add('cmp-header');
  moveInstrumentation(block, block);

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  const headerFragment = document.createDocumentFragment();

  // Hamburger checkbox
  const hamburgerCheckbox = document.createElement('input');
  hamburgerCheckbox.type = 'checkbox';
  hamburgerCheckbox.classList.add('cmp-header__hamburger');
  hamburgerCheckbox.id = 'mobile-menu-toggle';
  hamburgerCheckbox.setAttribute('aria-label', 'Toggle mobile navigation');
  headerFragment.append(hamburgerCheckbox);
  moveInstrumentation(fragment.firstElementChild, hamburgerCheckbox);

  // Section 1: Brand (Logo)
  const brandSection = fragment.querySelector('div:first-child');
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
    moveInstrumentation(brandSection, logoDiv);

    const picture = brandSection.querySelector('picture');
    const anchor = brandSection.querySelector('p > a');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('cmp-image__image');
        moveInstrumentation(img, img);
      }
      if (anchor) {
        anchor.classList.add('cmp-image__link');
        anchor.innerHTML = '';
        anchor.append(picture);
        logoDiv.append(anchor);
        moveInstrumentation(anchor, anchor);
      } else {
        logoDiv.append(picture);
      }
    }
    headerFragment.append(logoDiv);
  }

  // Section 2: Nav Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  moveInstrumentation(fragment.children[1], navLinksDiv);

  const navElement = document.createElement('nav');
  navElement.id = 'navigation';
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');
  moveInstrumentation(fragment.children[1], navElement);

  const mainUl = document.createElement('ul');
  mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  moveInstrumentation(fragment.children[1].querySelector('ul') || fragment.children[1], mainUl);

  const navSectionContent = Array.from(fragment.children[1].children);

  // Process top-level navigation items
  navSectionContent.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'P') {
        const link = child.querySelector('a');
        if (link) {
          const li = document.createElement('li');
          li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__no-items');
          moveInstrumentation(child, li);
          li.append(link);
          link.classList.add('cmp-navigation__item-link');
          moveInstrumentation(link, link);
          mainUl.append(li);

          if (!isDesktop.matches) {
            const linkText = link.textContent.toLowerCase();
            if (linkText.includes('recipes')) {
              li.classList.add('mobile-icon-recipes');
            } else if (linkText.includes('media')) {
              li.classList.add('mobile-icon-media');
            } else if (linkText.includes('about us')) {
              li.classList.add('mobile-icon-about-us');
            }
          }
        }
      } else if (child.tagName === 'UL') {
        // This is a nested UL for a mega-menu
        const previousLi = mainUl.querySelector('.cmp-navigation__item--level-0:last-child');
        if (previousLi) {
          previousLi.classList.remove('cmp-header__no-items');
          previousLi.classList.add('cmp-header__nav-products-click');
          moveInstrumentation(child, previousLi.querySelector('a') || previousLi);

          decorateNavList(child, 1, !isDesktop.matches);
          previousLi.append(child);

          const topLevelLink = previousLi.querySelector('.cmp-navigation__item-link');
          if (topLevelLink && !topLevelLink.querySelector('.icon-chevron-right')) {
            const chevron = document.createElement('span');
            chevron.classList.add('icon-chevron-right');
            topLevelLink.append(chevron);
            topLevelLink.setAttribute('role', 'button');
            topLevelLink.setAttribute('aria-expanded', 'false');
            const submenuId = `nav-submenu-0-${Array.from(mainUl.children).indexOf(previousLi)}`;
            topLevelLink.setAttribute('aria-controls', submenuId);
            child.id = submenuId;

            if (!isDesktop.matches) {
              topLevelLink.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const isExpanded = topLevelLink.getAttribute('aria-expanded') === 'true';
                topLevelLink.setAttribute('aria-expanded', !isExpanded);
                child.style.display = isExpanded ? 'none' : 'flex';
                chevron.classList.toggle('active', !isExpanded);
              });
            }
          }
        }
      }
    }
  });

  navElement.append(mainUl);

  // Mobile-specific policy and social media links
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');
  moveInstrumentation(fragment.children[1], mobileListDiv);

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  moveInstrumentation(fragment.children[1], policyUl);

  const policyLinkTexts = ['Contact us', 'FAQs', 'Terms of use', 'Privacy Policy'];
  policyLinkTexts.forEach(text => {
    const pElement = navSectionContent.find(child => child.tagName === 'P' && child.textContent.includes(text));
    if (pElement) {
      const li = document.createElement('li');
      li.classList.add('cmp-header__policy-list');
      const link = pElement.querySelector('a');
      if (link) {
        li.append(link);
        moveInstrumentation(pElement, li);
        moveInstrumentation(link, link);
        policyUl.append(li);
      }
    }
  });

  if (policyUl.children.length > 0) {
    mobileListDiv.append(policyUl);
  }

  // Section 3: Tools (Social Media & Utility Icons)
  const toolsSection = fragment.querySelector('div:last-child');
  if (toolsSection) {
    const socialMediaDiv = document.createElement('div');
    socialMediaDiv.classList.add('cmp-header__social-media');
    moveInstrumentation(toolsSection, socialMediaDiv);

    const socialLinksUl = toolsSection.querySelector('ul');
    if (socialLinksUl) {
      Array.from(socialLinksUl.children).forEach(li => {
        const link = li.querySelector('a');
        if (link) {
          const title = link.getAttribute('title') || link.textContent.trim();
          link.setAttribute('data-social', title.toLowerCase());
          link.classList.add(`icon-${title.toLowerCase().replace(/\s/g, '')}`);
          socialMediaDiv.append(link);
          moveInstrumentation(li, link);
        }
      });
    }
    if (socialMediaDiv.children.length > 0) {
      mobileListDiv.append(socialMediaDiv);
    }
  }

  if (mobileListDiv.children.length > 0) {
    navElement.append(mobileListDiv);
  }
  navLinksDiv.append(navElement);
  headerFragment.append(navLinksDiv);

  // Utility Icons (Accessibility, Search, Login)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  moveInstrumentation(fragment.children[2], navIconsDiv);

  const utilityItems = toolsSection ? Array.from(toolsSection.querySelectorAll('ul:last-child li')) : [];
  utilityItems.forEach(li => {
    const text = li.textContent.trim();
    if (text) {
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add(`cmp-header__${text.toLowerCase().replace(/\s/g, '')}`);
      moveInstrumentation(li, iconWrapper);

      const iconLink = document.createElement('a');
      iconLink.href = '#';
      iconLink.classList.add('cmp-header__icon-img');
      iconWrapper.append(iconLink);

      const iconDiv = document.createElement('div');
      iconDiv.classList.add(`icon-${text.toLowerCase().replace(/\s/g, '')}`);
      iconLink.append(iconDiv);

      const iconTextDiv = document.createElement('div');
      iconTextDiv.classList.add('cmp-header__icon-text');
      iconTextDiv.textContent = text;
      iconLink.append(iconTextDiv);

      if (text.toLowerCase() === 'accessibility' || text.toLowerCase() === 'login') {
        iconWrapper.classList.add('cmp-header__hide-icon');
      }
      navIconsDiv.append(iconWrapper);
    }
  });

  headerFragment.append(navIconsDiv);

  block.append(headerFragment);

  // Add event listener for mobile menu toggle
  if (hamburgerCheckbox) {
    hamburgerCheckbox.addEventListener('change', () => toggleMobileMenu(block, hamburgerCheckbox.checked));
    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && hamburgerCheckbox.checked) {
        toggleMobileMenu(block, false);
      }
    });
  }

  // Initial state for desktop vs mobile
  toggleMobileMenu(block, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMobileMenu(block, isDesktop.matches));
}
