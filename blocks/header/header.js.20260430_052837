import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * moveInstrumentation - Moves all children of an original element to a new element,
 * and then appends the new element to the original's parent.
 * This function also handles AEM instrumentation comments by ignoring them
 * and ensuring only actual DOM elements are moved.
 *
 * @param {Element} originalElement The original DOM element whose children are to be moved.
 * @param {Element} newElement The new DOM element to which children will be appended.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;

  // Copy classes from originalElement to newElement
  newElement.classList.add(...originalElement.classList);

  // Move all child nodes from originalElement to newElement
  // Use Array.from to create a static list of children, as the list changes during iteration
  Array.from(originalElement.childNodes).forEach((child) => {
    newElement.append(child);
  });

  // If originalElement has a parent, replace originalElement with newElement
  // This ensures AEM instrumentation comments associated with the original element are preserved
  if (originalElement.parentNode) {
    originalElement.parentNode.replaceChild(newElement, originalElement);
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.querySelector('.cmp-header');
    if (!nav) return;

    // Close any open desktop sub-menus
    if (isDesktop.matches) {
      nav.querySelectorAll('.cmp-navigation__item--level-0.is-open').forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
      });
    } else {
      // Close mobile menu
      const hamburger = nav.querySelector('.cmp-header__hamburger');
      if (hamburger && hamburger.checked) {
        hamburger.checked = false;
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    }
  }
}

function setupMobileNavigation(block) {
  if (!block) return;

  const hamburger = block.querySelector('.cmp-header__hamburger');
  const navLinksContainer = block.querySelector('.cmp-header__nav-links');

  if (!hamburger || !navLinksContainer) return;

  hamburger.addEventListener('change', () => {
    const expanded = hamburger.checked;
    hamburger.setAttribute('aria-expanded', expanded);
    if (expanded) {
      document.body.classList.add('menu-open');
      window.addEventListener('keydown', closeOnEscape);
    } else {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
      // Close all submenus when main menu is closed
      navLinksContainer.querySelectorAll('.cmp-navigation__item.is-open').forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Add click listeners for mobile sub-menu toggles
  navLinksContainer.querySelectorAll('.cmp-navigation__item--level-0').forEach((item) => {
    const link = item.querySelector('.cmp-navigation__item-link');
    const subMenu = item.querySelector('.cmp-header__product-items');

    if (link && subMenu) {
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const isOpen = item.classList.contains('is-open');
          // Close all other open level-0 menus
          navLinksContainer.querySelectorAll('.cmp-navigation__item--level-0.is-open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              openItem.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('is-open', !isOpen);
          link.setAttribute('aria-expanded', !isOpen);
        }
      });
    }
  });

  navLinksContainer.querySelectorAll('.cmp-navigation__item--level-1').forEach((item) => {
    const link = item.querySelector('.cmp-navigation__item-link');
    const subMenu = item.querySelector('.cmp-header__submenu');

    if (link && subMenu) {
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const isOpen = item.classList.contains('is-open');
          // Close all other open level-1 menus within the same level-0 parent
          item.closest('.cmp-header__product-items')?.querySelectorAll('.cmp-navigation__item--level-1.is-open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              openItem.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('is-open', !isOpen);
          link.setAttribute('aria-expanded', !isOpen);
        }
      });
    }
  });
}

/**
 * Recursive function to build the navigation structure.
 * @param {Element} ulElement The <ul> element from the fragment.
 * @param {number} level The current navigation level (0 for top-level).
 * @returns {DocumentFragment} The constructed navigation items.
 */
function buildNavItems(ulElement, level) {
  const fragment = document.createDocumentFragment();
  if (!ulElement) return fragment;

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== 1) return; // Skip non-element nodes like comments

    const navItem = document.createElement('li');
    navItem.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);

    let linkElement = li.querySelector('a');
    let linkText = linkElement ? linkElement.textContent : '';
    let linkHref = linkElement ? linkElement.href : '#';
    let isMegaMenu = false;

    // Check for strong tag to identify mega-menu categories
    const strongElement = li.querySelector('strong');
    if (strongElement && !linkElement) { // If strong exists but no direct link, it's a category title
      linkText = strongElement.textContent;
      linkHref = '#'; // Category titles don't have a direct link
      isMegaMenu = true;
    } else if (strongElement && linkElement && strongElement.contains(linkElement)) {
      // If strong wraps the link, it's still a regular link, but might indicate a mega-menu style
      // For this specific header, 'Our Products' is a mega-menu, but its link is direct.
      // We'll rely on the presence of nested ULs to determine mega-menu structure.
      linkText = linkElement.textContent;
      linkHref = linkElement.href;
    }

    const itemLink = document.createElement('a');
    itemLink.classList.add('cmp-navigation__item-link');
    itemLink.href = linkHref;
    itemLink.textContent = linkText;
    itemLink.setAttribute('aria-expanded', 'false'); // Default to collapsed

    navItem.append(itemLink);

    // Find nested ULs for submenus
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      if (level === 0 && li.classList.contains('cmp-header__nav-products')) { // Top-level mega-menu
        navItem.classList.add('cmp-header__nav-products', 'cmp-header__nav-products-click');
        const productItems = document.createElement('ul');
        productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items');

        const categoryMenu = document.createElement('div');
        categoryMenu.classList.add('cmp-header__category-menu');
        productItems.append(categoryMenu);

        const subItemsFragment = buildNavItems(nestedUl, level + 1);
        categoryMenu.append(subItemsFragment);
        navItem.append(productItems);
      } else { // Regular submenu
        const subMenu = document.createElement('ul');
        subMenu.classList.add('cmp-navigation__group', 'cmp-header__submenu');
        const subItemsFragment = buildNavItems(nestedUl, level + 1);
        subMenu.append(subItemsFragment);
        navItem.append(subMenu);
      }
    } else {
      navItem.classList.add('cmp-header__no-items'); // No submenu
      // Ensure top-level items without submenus still get the product class if intended
      if (level === 0) {
        navItem.classList.add('cmp-header__nav-products');
      }
    }

    // Add specific mobile icons based on link text (hardcoded from original CSS)
    const linkTextLower = linkText.toLowerCase();
    if (linkTextLower === 'recipes') {
      navItem.classList.add('mobile-icon-recipes');
    } else if (linkTextLower === 'media') {
      navItem.classList.add('mobile-icon-media');
    } else if (linkTextLower === 'about us') {
      navItem.classList.add('mobile-icon-about-us');
    }

    // Move instrumentation from the original LI to the new navItem
    moveInstrumentation(li, navItem);
    fragment.append(navItem);
  });
  return fragment;
}

function setupUtilityIcons(utilityItemsContainer, targetElement) {
  if (!utilityItemsContainer || !targetElement) return;

  const iconMap = {
    'accessibility': { class: 'icon-accessibility', wrapperClass: 'cmp-header__accessbility', hide: true },
    'search': { class: 'icon-search', wrapperClass: 'cmp-header__search', hide: false },
    'login': { class: 'icon-profile', wrapperClass: 'cmp-header__login', hide: true },
  };

  Array.from(utilityItemsContainer.children).forEach((li) => {
    const strong = li.querySelector('strong');
    if (strong) {
      const textContent = strong.textContent.trim().toLowerCase();
      const iconConfig = iconMap[textContent];

      if (iconConfig) {
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add(iconConfig.wrapperClass);
        if (iconConfig.hide) {
          iconWrapper.classList.add('cmp-header__hide-icon');
        }

        const iconLink = document.createElement('a');
        iconLink.href = li.querySelector('a')?.href || '#'; // Use original link if present
        iconLink.classList.add('cmp-header__icon-img');

        const iconDiv = document.createElement('div');
        iconDiv.classList.add(iconConfig.class);
        iconLink.append(iconDiv);

        const iconText = document.createElement('div');
        iconText.classList.add('cmp-header__icon-text');
        iconText.textContent = strong.textContent.trim(); // Use original casing for display
        iconLink.append(iconText);

        iconWrapper.append(iconLink);
        targetElement.append(iconWrapper);
        moveInstrumentation(li, iconWrapper); // Move instrumentation from original LI
      }
    }
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Preserve original classes on the block
  const originalClasses = Array.from(block.classList);
  block.classList.add('cmp-header');
  originalClasses.forEach((cls) => {
    if (cls !== 'header') { // Avoid duplicating 'header' if it's already there
      block.classList.add(cls);
    }
  });

  // Create hamburger input
  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  hamburgerInput.setAttribute('aria-expanded', 'false');
  block.append(hamburgerInput);

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  // Create a DocumentFragment to build the new DOM structure off-screen
  const headerContent = document.createDocumentFragment();

  // Section 1: Brand (Logo)
  const brandSection = fragment.children[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
    const picture = brandSection.querySelector('picture');
    if (picture) {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-image__link');
      anchor.href = brandSection.querySelector('a')?.href || '/'; // Use original link if present, default to home
      anchor.append(picture);
      logoDiv.append(anchor);
    }
    headerContent.append(logoDiv);
    moveInstrumentation(brandSection, logoDiv);
  }

  // Section 2: Nav Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  navLinksDiv.append(navigationDiv);

  const navSection = fragment.children[1];
  if (navSection) {
    const navElement = document.createElement('nav');
    // Attempt to get ID from original nav element in fragment, or generate a default
    navElement.id = navSection.querySelector('nav')?.id || 'navigation-generated';
    navElement.classList.add('cmp-navigation');
    navElement.setAttribute('itemscope', '');
    navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
    navElement.setAttribute('role', 'navigation');

    const mainUl = document.createElement('ul');
    mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

    // Find the main UL containing the navigation structure
    const mainNavUl = navSection.querySelector('ul');
    if (mainNavUl) {
      const topLevelItems = buildNavItems(mainNavUl, 0); // Start recursion at level 0
      mainUl.append(topLevelItems);
    }

    // Handle mobile-specific policy and social links
    const mobileListDiv = document.createElement('div');
    mobileListDiv.classList.add('cmp-header__mobile-list');

    const policyUl = document.createElement('ul');
    policyUl.classList.add('cmp-header__policy');

    // Filter for policy links from the original navSection children (P tags with A)
    // or direct LI elements if structured differently
    Array.from(navSection.children).forEach((child) => {
      if (child.tagName === 'P' && child.querySelector('a')) {
        const a = child.querySelector('a');
        const linkTextLower = a.textContent.toLowerCase();
        if (['contact us', 'faqs', 'terms of use', 'privacy policy'].includes(linkTextLower)) {
          const li = document.createElement('li');
          li.classList.add('cmp-header__policy-list');
          const newA = document.createElement('a');
          newA.href = a.href;
          newA.textContent = a.textContent;
          newA.target = a.target || '_self';
          li.append(newA);
          policyUl.append(li);
          moveInstrumentation(child, li);
        }
      }
    });
    mobileListDiv.append(policyUl);

    // Section 3: Tools (Social Media Icons and Utility Links)
    const toolsSection = fragment.children[2];
    if (toolsSection) {
      const socialMediaDiv = document.createElement('div');
      socialMediaDiv.classList.add('cmp-header__social-media');

      const socialUl = toolsSection.querySelector('ul');
      if (socialUl) {
        Array.from(socialUl.children).forEach((li) => {
          const a = li.querySelector('a');
          if (a) {
            const socialLink = document.createElement('a');
            socialLink.href = a.href;
            socialLink.target = a.target || '_blank'; // Default social links to new tab
            socialLink.setAttribute('data-social', a.textContent.toLowerCase());
            // Add icon classes based on text content
            const iconText = a.textContent.toLowerCase();
            if (iconText === 'instagram') socialLink.classList.add('icon-instagram');
            else if (iconText === 'facebook') socialLink.classList.add('icon-facebok');
            else if (iconText === 'twitter') socialLink.classList.add('icon-twitter');
            else if (iconText === 'youtube') socialLink.classList.add('icon-youtube');
            socialMediaDiv.append(socialLink);
            moveInstrumentation(li, socialLink);
          }
        });
      }
      mobileListDiv.append(socialMediaDiv);
      // Move instrumentation from the toolsSection itself to the mobileListDiv if it's the target
      // This is a bit tricky as toolsSection contains both social and utility icons.
      // We'll move the children of toolsSection to mobileListDiv if they are social related,
      // and handle utility icons separately.
    }
    navElement.append(mainUl, mobileListDiv);
    navigationDiv.append(navElement);
    headerContent.append(navLinksDiv);
  }

  // Utility icons (Accessibility, Search, Login)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  const utilityItemsContainer = fragment.children[2]; // Assuming utility icons are in the third section
  if (utilityItemsContainer) {
    setupUtilityIcons(utilityItemsContainer, navIconsDiv);
  }
  headerContent.append(navIconsDiv);

  block.append(headerContent);

  // Add event listeners for desktop hover behavior
  if (isDesktop.matches) {
    block.querySelectorAll('.cmp-navigation__item--level-0').forEach((item) => {
      const productItems = item.querySelector('.cmp-header__product-items');
      if (productItems) {
        item.addEventListener('mouseenter', () => {
          item.classList.add('is-open');
          item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'true');
        });
        item.addEventListener('mouseleave', () => {
          item.classList.remove('is-open');
          item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
        });

        // Handle L2 hover for nested submenus
        item.querySelectorAll('.cmp-navigation__item--level-1').forEach((l2Item) => {
          const l2Submenu = l2Item.querySelector('.cmp-header__submenu');
          if (l2Submenu) {
            l2Item.addEventListener('mouseenter', () => {
              l2Item.classList.add('is-open');
              l2Item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'true');
            });
            l2Item.addEventListener('mouseleave', () => {
              l2Item.classList.remove('is-open');
              l2Item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
            });
          }
        });
      }
    });
  }

  // Setup mobile navigation interactions
  setupMobileNavigation(block);

  // Initial state for mobile/desktop
  isDesktop.addEventListener('change', () => {
    // Reset menu state on resize
    hamburgerInput.checked = false;
    hamburgerInput.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    block.querySelectorAll('.cmp-navigation__item.is-open').forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.cmp-navigation__item-link')?.setAttribute('aria-expanded', 'false');
    });
  });
}
