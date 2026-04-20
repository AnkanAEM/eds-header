import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const breakpoint = window.matchMedia('(min-width: 900px)');

/**
 * Toggles all nav dropdowns off for a given UL (or the whole nav)
 * @param {Element} scopeElement The element to scope the dropdown closing (e.g., a specific UL or the main nav element)
 */
function closeAllDropdowns(scopeElement) {
  scopeElement.querySelectorAll('.is-open').forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Adds class and aria attributes to dropdown parent LI
 * @param {Element} li The li element to decorate
 * @param {string} level The level of the dropdown (e.g., 'level-0', 'level-1')
 */
function decorateDropdown(li, level) {
  const anchor = li.querySelector(':scope > a');
  if (anchor) {
    anchor.setAttribute('role', 'button');
    anchor.setAttribute('aria-haspopup', 'true');
  }
  // Add a class to indicate it has a dropdown, for styling purposes
  li.classList.add(`cmp-navigation__item--${level}-has-dropdown`);
}

/**
 * Sets up event listeners for dropdowns (hover for desktop, click for mobile)
 * @param {Element} ul The ul element (dropdown menu container)
 * @param {string} level The level of the dropdown (e.g., 'level-0', 'level-1')
 */
function setupDropdowns(ul, level) {
  // First, remove any existing listeners to prevent duplicates on breakpoint change
  Array.from(ul.children).forEach((li) => {
    const dropdownToggle = li.querySelector(':scope > a');
    if (dropdownToggle) {
      dropdownToggle.removeEventListener('click', null, true); // Remove capture phase listeners
      li.removeEventListener('mouseenter', null, true); // Remove capture phase listeners
      li.removeEventListener('mouseleave', null, true); // Remove capture phase listeners
    }
  });

  const itemsWithDropdowns = Array.from(ul.children).filter((li) => li.querySelector(':scope > ul'));

  itemsWithDropdowns.forEach((li) => {
    decorateDropdown(li, level);
    const dropdownToggle = li.querySelector(':scope > a');
    const dropdownMenu = li.querySelector(':scope > ul');

    if (dropdownToggle && dropdownMenu) {
      if (breakpoint.matches) { // Desktop: hover
        li.addEventListener('mouseenter', () => {
          // Close other dropdowns at the same level if it's L0, or only siblings if it's L1/L2
          if (level === 'level-0') {
            closeAllDropdowns(ul);
          } else {
            Array.from(li.parentNode.children).forEach((siblingLi) => {
              if (siblingLi !== li && siblingLi.classList.contains('is-open')) {
                siblingLi.classList.remove('is-open');
                siblingLi.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
              }
            });
          }
          li.classList.add('is-open');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        }, true); // Use capture phase to ensure it runs before child handlers

        li.addEventListener('mouseleave', () => {
          li.classList.remove('is-open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }, true);
      } else { // Mobile: click
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent propagation to parent dropdowns

          const isOpen = li.classList.contains('is-open');
          closeAllDropdowns(ul); // Close siblings
          if (!isOpen) {
            li.classList.add('is-open');
            dropdownToggle.setAttribute('aria-expanded', 'true');
          } else {
            li.classList.remove('is-open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
          }
        }, true);
      }
    }

    // Recurse for nested dropdowns
    if (dropdownMenu) {
      setupDropdowns(dropdownMenu, level === 'level-0' ? 'level-1' : 'level-2');
    }
  });
}

/**
 * decorates the header block and adds dropdown functionality
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Clear existing content to ensure idempotency
  block.innerHTML = '';

  // Create main header structure
  const header = document.createElement('header');
  header.className = 'header';

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';

  const headerBrand = document.createElement('div');
  headerBrand.className = 'header-brand';

  const headerNav = document.createElement('nav');
  headerNav.className = 'header-nav';
  headerNav.setAttribute('aria-label', 'Main Navigation');

  const headerTools = document.createElement('div');
  headerTools.className = 'header-tools';

  const hamburger = document.createElement('button');
  hamburger.className = 'header-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="hamburger-icon"></span>'; // Add a span for the icon

  headerWrapper.append(headerBrand, hamburger, headerNav, headerTools);
  header.append(headerWrapper);
  block.append(header);

  // Load fragment content
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return; // Fragment failed to load or is empty
  }

  // --- Extract and transform content from navContent ---

  // 1. Extract Logo
  const logoLink = navContent.querySelector('a[href="/"]');
  if (logoLink) {
    const clonedLogo = logoLink.cloneNode(true);
    // Find the img or picture element within the logo link
    const img = clonedLogo.querySelector('img');
    const picture = clonedLogo.querySelector('picture');
    if (img || picture) {
      const elementToOptimize = picture || img; // Prefer picture if it exists
      const src = img?.getAttribute('src') || img?.dataset.src;
      if (src) {
        // Assuming alt text from the existing img
        const alt = img?.getAttribute('alt') || '';
        const optimizedPicture = createOptimizedPicture(src, alt, false, [{ width: '150' }]);
        if (elementToOptimize.parentNode) {
          elementToOptimize.parentNode.replaceChild(optimizedPicture, elementToOptimize);
        }
      }
    }
    headerBrand.append(clonedLogo);
  }

  // 2. Extract Main Navigation and apply fidelity classes
  const mainNavUl = navContent.querySelector('ul');
  if (mainNavUl) {
    // Replicate original AEM navigation component container classes for styling fidelity
    const navContainer = document.createElement('nav');
    navContainer.id = 'navigation-3f62f7748f'; // Preserve original ID for specific styling hooks
    navContainer.className = 'cmp-navigation';
    navContainer.setAttribute('itemscope', '');
    navContainer.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
    navContainer.setAttribute('role', 'navigation');

    const clonedMainNavUl = mainNavUl.cloneNode(true);
    clonedMainNavUl.className = 'cmp-navigation__group cmp-header__nav-group';

    Array.from(clonedMainNavUl.children).forEach((li) => {
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
      const anchor = li.querySelector(':scope > a');
      if (anchor) anchor.classList.add('cmp-navigation__item-link');

      const l1Ul = li.querySelector(':scope > ul');
      if (l1Ul) {
        li.classList.add('cmp-header__nav-products-click'); // For L0 items with dropdowns, as seen in original HTML
        l1Ul.classList.add('cmp-navigation__group', 'cmp-header__product-items');

        // The original HTML had a 'cmp-header__category-menu' div wrapping L1 items.
        const categoryMenuDiv = document.createElement('div');
        categoryMenuDiv.className = 'cmp-header__category-menu';
        const l1Items = Array.from(l1Ul.children);
        l1Items.forEach((l1Li) => categoryMenuDiv.append(l1Li));
        if (l1Items.length > 0) {
          l1Ul.prepend(categoryMenuDiv);
        }

        Array.from(categoryMenuDiv.children).forEach((l1Li) => {
          l1Li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
          const l1Anchor = l1Li.querySelector(':scope > a');
          if (l1Anchor) l1Anchor.classList.add('cmp-navigation__item-link');

          const l2Ul = l1Li.querySelector(':scope > ul');
          if (l2Ul) {
            l2Ul.classList.add('cmp-navigation__group', 'cmp-header__submenu');

            // The original HTML also had a 'cmp-header__category-menu' div wrapping L2 items.
            const l2CategoryMenuDiv = document.createElement('div');
            l2CategoryMenuDiv.className = 'cmp-header__category-menu';
            const l2Items = Array.from(l2Ul.children);
            l2Items.forEach((l2Li) => {
              l2CategoryMenuDiv.append(l2Li);
              l2Li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-2', 'cmp-header__no-item'); // Original had 'cmp-header__no-item' for L2
              const l2Anchor = l2Li.querySelector(':scope > a');
              if (l2Anchor) l2Anchor.classList.add('cmp-navigation__item-link');
            });
            if (l2Items.length > 0) {
              l2Ul.prepend(l2CategoryMenuDiv);
            }
          }
        });
        // Check for .cmp-header__image-text sibling to the categoryMenuDiv
        // In the blueprint, this is often found after the 'menuHtml' for 'Our Products' or 'CSR Initiatives'.
        // Look for any <div> that is not a <ul> (which would be a submenu) and has no children <li> directly.
        // Assuming it's a direct sibling of the main UL.
        const imageTextDiv = li.querySelector(':scope > div:not(.cmp-header__category-menu)');
        if (imageTextDiv) {
          // Move it to be a sibling of the categoryMenuDiv within the L1 UL.
          // This preserves the rich content in the dropdown.
          categoryMenuDiv.parentNode?.append(imageTextDiv.cloneNode(true));
          imageTextDiv.remove(); // Remove original if it was found
        }
      }
    });
    navContainer.append(clonedMainNavUl);
    headerNav.append(navContainer);

    // Setup dropdown interactions
    setupDropdowns(clonedMainNavUl, 'level-0');
  }

  // 3. Extract Tools (Search, Profile) and Mobile Policy/Social Links

  // Replicate original AEM cmp-header__nav-icons container for search/profile
  const originalNavIcons = document.createElement('div');
  originalNavIcons.className = 'cmp-header__nav-icons';

  // Fuzzy find Search icon from navContent
  const searchAnchor = navContent.querySelector('a[href*="#search"], a[aria-label*="Search" i], a:has(div.icon-search)');
  if (searchAnchor) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'cmp-header__search';
    const clonedSearchAnchor = searchAnchor.cloneNode(true);
    // Ensure it matches the original structure <a class="cmp-header__icon-img"><div class="icon-search"></div><div class="cmp-header__icon-text">Search</div></a>
    if (!clonedSearchAnchor.classList.contains('cmp-header__icon-img')) {
        clonedSearchAnchor.className = 'cmp-header__icon-img';
        clonedSearchAnchor.innerHTML = `<div class="icon-search"></div><div class="cmp-header__icon-text">Search</div>`;
    }
    searchWrapper.append(clonedSearchAnchor);
    originalNavIcons.append(searchWrapper);
  } else { // Fallback to hardcoded structure if not found to ensure tools are present
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'cmp-header__search';
    searchWrapper.innerHTML = `<a href="#" class="cmp-header__icon-img"><div class="icon-search"></div><div class="cmp-header__icon-text">Search</div></a>`;
    originalNavIcons.append(searchWrapper);
  }

  // Fuzzy find Login/Profile icon
  const profileAnchor = navContent.querySelector('a[href*="profile"], a[aria-label*="profile" i], a:has(div.icon-profile)');
  if (profileAnchor) {
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'cmp-header__login cmp-header__hide-icon'; // Preserve original classes
    const clonedProfileAnchor = profileAnchor.cloneNode(true);
    // Ensure it matches the original structure <a class="cmp-header__icon-img"><div class="icon-profile"></div></a>
    if (!clonedProfileAnchor.classList.contains('cmp-header__icon-img')) {
      clonedProfileAnchor.className = 'cmp-header__icon-img';
      clonedProfileAnchor.innerHTML = `<div class="icon-profile"></div>`;
    }
    profileWrapper.append(clonedProfileAnchor);
    originalNavIcons.append(profileWrapper);
  } else { // Fallback to hardcoded structure
    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'cmp-header__login cmp-header__hide-icon';
    profileWrapper.innerHTML = `<a href="#" class="cmp-header__icon-img"><div class="icon-profile"></div></a>`;
    originalNavIcons.append(profileWrapper);
  }

  // Append to headerTools if any tools were found
  if (originalNavIcons.children.length > 0) {
    headerTools.append(originalNavIcons);
  }

  // Mobile Policy Links and Social Media Links (from the Blueprint, these are likely separate sections in the fragment)
  const mobileList = document.createElement('div');
  mobileList.className = 'cmp-header__mobile-list';

  // Find policy links (e.g., terms of use, privacy policy, sitemap)
  const policyUl = navContent.querySelector('ul a[href*="terms-of-use" i], ul a[href*="privacy-policy" i], ul a[href*="sitemap" i]')?.closest('ul');
  if (policyUl) {
    const clonedPolicyUl = policyUl.cloneNode(true);
    clonedPolicyUl.className = 'cmp-header__policy';
    Array.from(clonedPolicyUl.children).forEach(li => li.classList.add('cmp-header__policy-list'));
    mobileList.append(clonedPolicyUl);
  }

  // Find social media links (e.g., instagram, facebook, twitter, youtube)
  const socialDiv = navContent.querySelector('a[href*="instagram" i], a[href*="facebook" i], a[href*="twitter" i], a[href*="youtube" i]')?.closest('div') || document.createElement('div');
  if (socialDiv.children.length > 0) {
    const clonedSocialDiv = socialDiv.cloneNode(true);
    clonedSocialDiv.className = 'cmp-header__social-media';
    mobileList.append(clonedSocialDiv);
  } else { // Fallback to hardcoded icons if not found
      const fallbackSocialDiv = document.createElement('div');
      fallbackSocialDiv.className = 'cmp-header__social-media';
      fallbackSocialDiv.innerHTML = `
          <a href="https://www.instagram.com/aashirvaad/" target="_blank" class="icon-instagram" data-social="instagram"></a>
          <a href="https://www.facebook.com/Aashirvaad/" target="_blank" class="icon-facebok" data-social="facebook"></a>
          <a href="https://twitter.com/AashirvaadAtta" target="_blank" class="icon-twitter" data-social="twitter"></a>
          <a href="https://www.youtube.com/user/AashirvaadAtta" target="_blank" class="icon-youtube" data-social="youtube"></a>
      `;
      mobileList.append(fallbackSocialDiv);
  }

  if (mobileList.children.length > 0) {
    // Append mobileList into the cmp-navigation wrapper
    headerNav.querySelector('.cmp-navigation')?.append(mobileList);
  }

  // Hamburger button interaction
  hamburger.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    if (!isOpen) {
      closeAllDropdowns(headerNav); // Close all dropdowns when closing mobile nav
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      header.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      closeAllDropdowns(headerNav);
    }
  });

  // Close on outside click (for mobile nav and desktop L0/L1 dropdowns)
  document.addEventListener('click', (e) => {
    // Handle mobile nav closing
    if (!breakpoint.matches && header.classList.contains('is-open') && !header.contains(e.target)) {
      header.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      closeAllDropdowns(headerNav);
    } else if (breakpoint.matches) { // Handle desktop dropdowns
      const openDropdowns = headerNav.querySelectorAll('.is-open');
      openDropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          dropdown.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  moveInstrumentation(navContent, block);

  // Handle resize for desktop/mobile interaction model change
  breakpoint.addEventListener('change', () => {
    // Ensure nav is closed and state reset when breakpoint changes
    header.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    closeAllDropdowns(headerNav);

    // Re-apply dropdown listeners to ensure correct behavior (hover vs click)
    const navUl = headerNav.querySelector('ul.cmp-header__nav-group');
    if (navUl) {
      setupDropdowns(navUl, 'level-0');
    }
  });
}
