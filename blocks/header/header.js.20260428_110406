import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)'); // Adjusted to 1024px based on CSS

/**
 * Moves instrumentation attributes from an old element to a new one.
 * @param {Element} originalElement The original element with attributes.
 * @param {Element} newElement The new element to move attributes to.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  Array.from(originalElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-cmp-') || attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Recursively processes a UL element to create nested navigation.
 * @param {HTMLUListElement} ulElement The UL element to process.
 * @param {number} level The current nesting level.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function processNestedUl(ulElement, level) {
  if (!ulElement) return null;

  const newUl = document.createElement('ul');
  newUl.classList.add('cmp-navigation__group');
  if (level === 0) {
    newUl.classList.add('cmp-header__nav-group');
  } else if (level === 1) {
    newUl.classList.add('cmp-header__product-items');
  } else {
    newUl.classList.add('cmp-header__submenu');
  }

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;

    const newLi = document.createElement('li');
    newLi.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);
    moveInstrumentation(li, newLi);

    const link = li.querySelector('a');
    const nestedUl = li.querySelector(':scope > ul');

    if (link) {
      const newLink = document.createElement('a');
      newLink.classList.add('cmp-navigation__item-link');
      newLink.href = link.href;
      newLink.textContent = link.textContent.trim();
      moveInstrumentation(link, newLink);
      newLi.append(newLink);

      if (level === 0 && nestedUl) {
        newLi.classList.add('cmp-header__nav-products');
      }
    } else {
      // If no direct link, but has text, create a span for non-navigable items
      const labelText = Array.from(li.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
        .map((node) => node.textContent.trim())
        .join('');
      if (labelText) {
        const span = document.createElement('span');
        span.classList.add('cmp-navigation__item-link');
        span.textContent = labelText;
        newLi.append(span);
      }
    }

    if (nestedUl) {
      // Create a wrapper div for category menu if it's a direct child of a level-1 item
      if (level === 1) {
        const categoryMenuDiv = document.createElement('div');
        categoryMenuDiv.classList.add('cmp-header__category-menu');
        const processedNestedUl = processNestedUl(nestedUl, level + 1);
        if (processedNestedUl) {
          categoryMenuDiv.append(processedNestedUl);
        }
        newLi.append(categoryMenuDiv);
      } else {
        const processedNestedUl = processNestedUl(nestedUl, level + 1);
        if (processedNestedUl) {
          newLi.append(processedNestedUl);
        }
      }
    } else if (!link) {
      // If it's a leaf node without a link, it's a non-clickable item
      newLi.classList.add('cmp-header__no-item');
    }

    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Parses the fragment into logical rows.
 * @param {DocumentFragment} fragment The loaded fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  const brandRow = children[0]?.classList.contains('default-content-wrapper') ? children[0] : children[0]?.querySelector(':scope > .default-content-wrapper') || children[0];
  const navRow = children[1]?.classList.contains('default-content-wrapper') ? children[1] : children[1]?.querySelector(':scope > .default-content-wrapper') || children[1];
  const toolsRow = children[2]?.classList.contains('default-content-wrapper') ? children[2] : children[2]?.querySelector(':scope > .default-content-wrapper') || children[2];
  return { brandRow, navRow, toolsRow };
}

/**
 * Sets up the brand section of the header.
 * @param {Element} brandRow The brand row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @returns {Element} The decorated logo container.
 */
function setupBrand(brandRow, docFragment) {
  if (!brandRow) return null;

  const logoContainer = document.createElement('div');
  logoContainer.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(brandRow, logoContainer);

  const picture = brandRow.querySelector('picture');
  const img = brandRow.querySelector('img');
  const p = brandRow.querySelector('p');
  const link = brandRow.querySelector('a') || document.createElement('a'); // Ensure a link always exists

  if (link && p) {
    link.href = link.href || '/'; // Default home link
    link.classList.add('cmp-image__link');
    moveInstrumentation(p, link); // Move instrumentation from p to link

    if (picture) {
      picture.classList.add('w-100', 'd-block');
      link.prepend(picture);
    } else if (img) {
      img.classList.add('cmp-image__image');
      link.prepend(img);
    }
    logoContainer.append(link);
  } else if (picture) {
    picture.classList.add('w-100', 'd-block');
    logoContainer.append(picture);
  } else if (img) {
    img.classList.add('cmp-image__image');
    logoContainer.append(img);
  }

  docFragment.append(logoContainer);
  return logoContainer;
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @returns {Element} The decorated navigation links container.
 */
function setupDesktopNav(navRow, docFragment) {
  if (!navRow) return null;

  const navLinks = document.createElement('div');
  navLinks.classList.add('cmp-header__nav-links');
  moveInstrumentation(navRow, navLinks);

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  navLinks.append(navigation);

  const navElement = document.createElement('nav');
  // navElement.id = 'navigation-fff59bc8e9'; // Removed hardcoded ID
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');
  navigation.append(navElement);

  const mainUlFromFragment = navRow.querySelector('ul');
  if (mainUlFromFragment) {
    const processedMainUl = processNestedUl(mainUlFromFragment, 0);
    if (processedMainUl) {
      navElement.append(processedMainUl);
    }
  }

  // Mobile specific list and social media (from original HTML structure)
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');
  navElement.append(mobileListDiv);

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  mobileListDiv.append(policyUl);

  // Tools from the fragment will populate this later
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  mobileListDiv.append(socialMediaDiv);

  docFragment.append(navLinks);
  return navLinks;
}

/**
 * Sets up the utility tools and social links.
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append to.
 * @param {Element} navElement The main navigation element to append mobile tools to.
 * @returns {Element} The decorated navigation icons container.
 */
function setupTools(toolsRow, docFragment, navElement) {
  if (!toolsRow) return null;

  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');
  moveInstrumentation(toolsRow, navIcons);

  const mobileListDiv = navElement.querySelector('.cmp-header__mobile-list');
  const policyUl = mobileListDiv?.querySelector('.cmp-header__policy');
  const socialMediaDiv = mobileListDiv?.querySelector('.cmp-header__social-media');

  Array.from(toolsRow.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        if (li.nodeType !== Node.ELEMENT_NODE) return;
        const link = li.querySelector('a');
        if (link) {
          const text = link.textContent.trim();
          const href = link.href;
          const sanitizedText = text.toLowerCase().replace(/\s/g, '');

          if (href.includes('instagram.com') || href.includes('facebook.com') || href.includes('twitter.com') || href.includes('youtube.com')) {
            // Social media links
            if (socialMediaDiv) {
              const socialLink = document.createElement('a');
              socialLink.href = href;
              socialLink.target = '_blank';
              // Handle specific typo in original HTML for facebook class
              const iconClass = text.toLowerCase() === 'facebook' ? 'icon-facebok' : `icon-${sanitizedText}`;
              socialLink.classList.add(iconClass);
              socialLink.setAttribute('data-social', sanitizedText);
              moveInstrumentation(link, socialLink);
              socialMediaDiv.append(socialLink);
            }
          } else if (text === 'Accessibility' || text === 'Search' || text === 'Login') {
            // Main header icons
            const iconDiv = document.createElement('div');
            iconDiv.classList.add(`cmp-header__${sanitizedText}`);
            if (text === 'Accessibility' || text === 'Login') {
              iconDiv.classList.add('cmp-header__hide-icon');
            }
            moveInstrumentation(li, iconDiv);

            const iconLink = document.createElement('a');
            iconLink.href = href;
            iconLink.classList.add('cmp-header__icon-img');
            moveInstrumentation(link, iconLink);

            const iconSpan = document.createElement('div');
            // Handle specific original HTML class for Login
            const iconSpanClass = text === 'Login' ? 'icon-profile' : `icon-${sanitizedText}`;
            iconSpan.classList.add(iconSpanClass);
            iconLink.append(iconSpan);

            const iconText = document.createElement('div');
            iconText.classList.add('cmp-header__icon-text');
            iconText.textContent = text;
            iconLink.append(iconText);

            iconDiv.append(iconLink);
            navIcons.append(iconDiv);
          } else {
            // Policy links for mobile
            if (policyUl) {
              const policyLi = document.createElement('li');
              policyLi.classList.add('cmp-header__policy-list');
              moveInstrumentation(li, policyLi);

              const policyLink = document.createElement('a');
              policyLink.href = href;
              policyLink.target = '_self'; // Assuming _self for policy links
              policyLink.textContent = text;
              moveInstrumentation(link, policyLink);
              policyLi.append(policyLink);
              policyUl.append(policyLi);
            }
          }
        }
      });
    }
  });

  docFragment.append(navIcons);
  return navIcons;
}

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element.
 * @param {Element} navSections The nav sections within the container element.
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const hamburgerInput = nav.querySelector('.cmp-header__hamburger');
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';

  if (hamburgerInput) {
    hamburgerInput.checked = expanded;
  }
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');

  // Toggle visibility of mobile menu sections
  const mobileNav = navSections.querySelector('.cmp-navigation');
  if (mobileNav) {
    mobileNav.style.display = (expanded && !isDesktop.matches) ? 'flex' : '';
  }

  // Toggle product items visibility for mobile
  navSections.querySelectorAll('.cmp-header__nav-products').forEach((navProduct) => {
    const productItems = navProduct.querySelector('.cmp-header__product-items');
    if (productItems) {
      if (!isDesktop.matches) {
        // For mobile, initially hide all product items
        productItems.style.display = 'none';
        // Add click listener to toggle product items
        const link = navProduct.querySelector('.cmp-navigation__item-link');
        if (link && !link.dataset.hasClickListener) {
          link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation
            const isProductItemsVisible = productItems.style.display === 'flex';
            productItems.style.display = isProductItemsVisible ? 'none' : 'flex';
            // Toggle chevron icon
            if (isProductItemsVisible) {
              link.classList.remove('is-active');
            } else {
              link.classList.add('is-active');
            }
          });
          link.dataset.hasClickListener = 'true';
        }
      } else {
        // For desktop, revert to CSS-managed display
        productItems.style.display = '';
      }
    }
  });

  // Toggle submenu visibility for mobile
  navSections.querySelectorAll('.cmp-header__product-items .cmp-navigation__item--level-1').forEach((level1Item) => {
    const submenu = level1Item.querySelector('.cmp-header__submenu');
    if (submenu) {
      if (!isDesktop.matches) {
        submenu.style.display = 'none';
        const link = level1Item.querySelector('.cmp-navigation__item-link');
        if (link && !link.dataset.hasClickListener) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const isSubmenuVisible = submenu.style.display === 'flex';
            submenu.style.display = isSubmenuVisible ? 'none' : 'flex';
            if (isSubmenuVisible) {
              link.classList.remove('is-active');
            } else {
              link.classList.add('is-active');
            }
          });
          link.dataset.hasClickListener = 'true';
        }
      } else {
        submenu.style.display = '';
      }
    }
  });
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
  const docFragment = document.createDocumentFragment();

  // Create the main header container
  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  cmpHeader.setAttribute('aria-expanded', 'false'); // Initial state
  docFragment.append(cmpHeader);

  // Create hamburger input
  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  cmpHeader.append(hamburgerInput);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  const logoContainer = setupBrand(brandRow, docFragment);
  if (logoContainer) {
    cmpHeader.append(logoContainer);
  }

  const navLinksContainer = setupDesktopNav(navRow, docFragment);
  if (navLinksContainer) {
    cmpHeader.append(navLinksContainer);
  }

  const navElement = cmpHeader.querySelector('.cmp-navigation'); // Get the actual nav element
  const navIconsContainer = setupTools(toolsRow, docFragment, navElement);
  if (navIconsContainer) {
    cmpHeader.append(navIconsContainer);
  }

  // Append the constructed header to the block
  block.append(cmpHeader);

  // Add event listener for hamburger
  hamburgerInput.addEventListener('change', () => {
    const navSections = cmpHeader.querySelector('.cmp-header__nav-links');
    toggleMenu(cmpHeader, navSections, hamburgerInput.checked);
  });

  // Add Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cmpHeader.getAttribute('aria-expanded') === 'true') {
      const navSections = cmpHeader.querySelector('.cmp-header__nav-links');
      toggleMenu(cmpHeader, navSections, false); // Force close
    }
  });

  // Initial toggle for desktop state
  const navSections = cmpHeader.querySelector('.cmp-header__nav-links');
  toggleMenu(cmpHeader, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(cmpHeader, navSections, isDesktop.matches));
}
