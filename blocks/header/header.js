import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Closes all open dropdowns and removes body scroll lock.
 * @param {Event} event The event object.
 */
function closeOnEscape(event) {
  if (event.key === 'Escape') {
    const openDropdowns = document.querySelectorAll('.header-nav-item.open');
    openDropdowns.forEach((dropdown) => dropdown.classList.remove('open'));
    document.body.classList.remove('no-scroll'); // Remove body scroll lock
    const hamburger = document.querySelector('.header-hamburger');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    const openSearch = document.querySelector('.header-search.open');
    if (openSearch) {
      openSearch.classList.remove('open');
    }
  }
}

/**
 * Closes all open dropdowns and removes body scroll lock if click is outside header.
 * @param {Event} event The event object.
 */
function closeOnOutsideClick(event) {
  const header = document.querySelector('.header-wrapper');
  if (!header.contains(event.target)) {
    const openDropdowns = document.querySelectorAll('.header-nav-item.open');
    openDropdowns.forEach((dropdown) => dropdown.classList.remove('open'));
    document.body.classList.remove('no-scroll'); // Remove body scroll lock
    const hamburger = document.querySelector('.header-hamburger');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    const openSearch = document.querySelector('.header-search.open');
    if (openSearch) {
      openSearch.classList.remove('open');
    }
  }
}

/**
 * Sets up dropdown interactions for desktop (hover) and mobile (click).
 * @param {HTMLElement} block The header block element.
 */
function setupDropdowns(block) {
  const L0Items = block.querySelectorAll('.header-nav-L0.has-submenu');
  L0Items.forEach((L0Item) => {
    const L0Link = L0Item.querySelector(':scope > a, :scope > span');
    if (!L0Link) return;

    // Add a dropdown indicator
    const indicator = document.createElement('span');
    indicator.classList.add('header-dropdown-indicator');
    L0Link.append(indicator);

    let leaveTimeout;

    // Desktop (hover)
    L0Item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) { // Assuming 992px as breakpoint for desktop
        clearTimeout(leaveTimeout);
        L0Item.classList.add('open');
        document.body.classList.add('no-scroll'); // Lock body scroll when mega menu is open
      }
    });

    L0Item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        leaveTimeout = setTimeout(() => {
          L0Item.classList.remove('open');
          if (!block.querySelector('.header-nav-item.open')) { // Only remove if no other dropdowns are open
            document.body.classList.remove('no-scroll');
          }
        }, 300); // Small delay before closing
      }
    });

    // Mobile (click) - Prevent default link behavior on L0 if it has submenu on mobile
    L0Link.addEventListener('click', (e) => {
      if (window.innerWidth < 992) { // Assuming 992px as breakpoint for mobile
        e.preventDefault();
        e.stopPropagation(); // Prevent propagation to document click listener
        L0Item.classList.toggle('open');
        if (L0Item.classList.contains('open')) {
          document.body.classList.add('no-scroll');
        } else if (!block.querySelector('.header-nav-item.open')) {
          document.body.classList.remove('no-scroll');
        }
      }
    });

    const L1Items = L0Item.querySelectorAll('.header-nav-L1.has-submenu');
    L1Items.forEach((L1Item) => {
      const L1Link = L1Item.querySelector(':scope > a');
      if (!L1Link) return;

      const L1Indicator = document.createElement('span');
      L1Indicator.classList.add('header-dropdown-indicator');
      L1Link.append(L1Indicator);

      // Desktop (hover)
      L1Item.addEventListener('mouseenter', (e) => {
        if (window.innerWidth >= 992) {
          e.stopPropagation(); // Stop propagation to parent L0
          clearTimeout(leaveTimeout); // Clear L0 leave timeout if hovering over L1
          L1Item.classList.add('open');
        }
      });

      L1Item.addEventListener('mouseleave', (e) => {
        if (window.innerWidth >= 992) {
          e.stopPropagation();
          L1Item.classList.remove('open');
        }
      });

      // Mobile (click) - Prevent default link behavior on L1 if it has submenu on mobile
      L1Link.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
          e.preventDefault();
          e.stopPropagation();
          L1Item.classList.toggle('open');
        }
      });
    });
  });

  // Event listeners for closing on escape and outside click
  document.addEventListener('keydown', closeOnEscape);
  document.addEventListener('click', closeOnOutsideClick);
}

/**
 * Creates an icon span with the specified class name.
 * @param {string} iconName The name of the icon class.
 * @returns {HTMLSpanElement} The icon span element.
 */
function createIcon(iconName) {
  const iconSpan = document.createElement('span');
  iconSpan.classList.add('icon', `icon-${iconName}`);
  return iconSpan;
}

/**
 * Decorates the header block with navigation, logo, and utility elements.
 * @param {HTMLElement} block The header block element.
 */
export default async function decorate(block) {
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return;
  }

  // Main header container
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  // Brand/Logo area
  const brand = document.createElement('div');
  brand.classList.add('header-brand');

  // Main navigation area
  const nav = document.createElement('nav');
  nav.classList.add('header-nav');
  nav.setAttribute('aria-label', 'Main Navigation');
  const mainNavUl = document.createElement('ul');
  mainNavUl.classList.add('header-nav-group');
  nav.append(mainNavUl);

  // Tools/Utility area
  const tools = document.createElement('div');
  tools.classList.add('header-tools');

  // Hamburger menu button (for mobile)
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', expanded);
    document.body.classList.toggle('no-scroll', expanded);
  });

  // Iterate through top-level divs in the fragment (AEM sections)
  // NOTE: navContent.children is used, assuming each direct child div is a logical section.
  const fragmentSections = Array.from(navContent.children);

  // Temporary storage for elements before final assembly
  let logoElement = null;
  const navItems = [];
  const mobileUtilityItems = [];
  const desktopUtilityItems = [];

  fragmentSections.forEach((section) => {
    // Skip empty sections or those containing only empty p tags
    if (section.textContent.trim() === '' && section.querySelectorAll('img, a, button, ul').length === 0) {
      return;
    }

    // 1. LOGO Detection (usually the first substantial item with an image link)
    // Looks for an <a> tag directly containing an <img> or a <picture> tag.
    const potentialLogoLink = section.querySelector('a img, a picture');
    if (potentialLogoLink && !logoElement) {
      const logoA = potentialLogoLink.closest('a');
      let optimizedPicture;
      if (potentialLogoLink.tagName === 'IMG') {
        optimizedPicture = createOptimizedPicture(potentialLogoLink.src, potentialLogoLink.alt || 'Brand Logo', true, [{ width: '150' }]);
      } else { // It's a picture element
        optimizedPicture = potentialLogoLink.cloneNode(true);
        // Ensure proper source sets for the optimized picture
        const img = optimizedPicture.querySelector('img');
        if (img) {
          img.setAttribute('src', img.getAttribute('src') || '');
          img.setAttribute('alt', img.getAttribute('alt') || 'Brand Logo');
          img.setAttribute('loading', 'eager');
        }
      }

      if (logoA) {
        logoA.innerHTML = ''; // Clear existing content
        logoA.append(optimizedPicture);
        logoElement = logoA;
      } else {
        // If img/picture is not in an A, wrap it in one linking to home
        const homeLink = document.createElement('a');
        homeLink.href = '/';
        homeLink.append(optimizedPicture);
        logoElement = homeLink;
      }
      return; // Logo found, move to next section
    }

    // 2. MAIN NAVIGATION Items (L0 with optional L1/L2 submenus)
    // Find an L0 link (p > a) and its potential sibling UL (L1 group)
    const L0LinkContainer = section.querySelector('p:first-of-type > a');
    const L1Group = section.querySelector('ul:not(.header-nav-group)'); // Avoid re-selecting already processed ULs

    if (L0LinkContainer) {
      const L0ItemLi = document.createElement('li');
      L0ItemLi.classList.add('header-nav-item', 'header-nav-L0');

      // Move the L0 link (remove p wrapper)
      L0ItemLi.append(L0LinkContainer);
      if (L0LinkContainer.parentElement) {
        L0LinkContainer.parentElement.remove(); // Remove the original p tag
      }

      if (L1Group) {
        L0ItemLi.classList.add('has-submenu');
        L1Group.classList.add('header-nav-group', 'header-nav-L1-group');

        // Process L1 and L2 items
        Array.from(L1Group.children).forEach((L1Li) => {
          if (L1Li.tagName === 'LI') {
            L1Li.classList.add('header-nav-item', 'header-nav-L1');
            const L2Group = L1Li.querySelector(':scope > ul'); // Check for L2
            if (L2Group) {
              L1Li.classList.add('has-submenu');
              L2Group.classList.add('header-nav-group', 'header-nav-L2-group');
              // Add L2 classes
              Array.from(L2Group.children).forEach((L2Li) => {
                if (L2Li.tagName === 'LI') {
                  L2Li.classList.add('header-nav-item', 'header-nav-L2');
                }
              });
            }
          }
        });
        L0ItemLi.append(L1Group); // Append processed L1Group to L0ItemLi
      }

      // Capture other direct children of the 'section' div to be promo content
      // These elements would be siblings to the p-link and UL within the same section.
      const promoElements = Array.from(section.children).filter((child) => {
        const isL0P = L0LinkContainer.parentElement === child;
        const isL1Ulist = L1Group === child;
        return child.textContent.trim() !== '' && !isL0P && !isL1Ulist;
      });

      if (promoElements.length > 0) {
        const promoContainer = document.createElement('div');
        promoContainer.classList.add('header-mega-menu-promo');
        promoElements.forEach((promoEl) => promoContainer.append(promoEl));
        L0ItemLi.append(promoContainer);
      }

      navItems.push(L0ItemLi);
      return; // Nav item processed, move to next section
    }

    // 3. UTILITY / TOOL Sections
    // Social media icons:
    const socialLinks = section.querySelector('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="youtube"]');
    const policyUl = section.querySelector('ul'); // Check for policy links ul

    if (socialLinks || (policyUl && policyUl.querySelectorAll('a[href*="policy"], a[href*="contact"], a[href*="terms"]').length > 0)) {
      // This is likely the mobile utility and social media block from the AEM nav structure
      const mobileUtilities = document.createElement('div');
      mobileUtilities.classList.add('header-mobile-utility');

      if (policyUl) {
        policyUl.classList.add('header-policy-list');
        mobileUtilities.append(policyUl);
      }

      if (socialLinks) {
        const socialWrapper = document.createElement('div');
        socialWrapper.classList.add('header-social-media');
        // Find all social links within the section (they might be in a p or div)
        const allSocialLinks = section.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="youtube"]');
        allSocialLinks.forEach((socialA) => {
          const iconClass = socialA.href.includes('instagram') ? 'instagram'
            : socialA.href.includes('facebook') ? 'facebook'
              : socialA.href.includes('twitter') ? 'twitter'
                : socialA.href.includes('youtube') ? 'youtube'
                  : null;
          if (iconClass) {
            socialA.prepend(createIcon(iconClass));
            socialA.classList.add(`icon-${iconClass}`);
          }
          socialWrapper.append(socialA.cloneNode(true)); // Clone to avoid moving out of original section before cleanup
          socialA.remove(); // Remove original social link elements from the section
        });
        mobileUtilities.append(socialWrapper);
      }

      // Append any other direct non-empty children of this section to mobileUtilities
      Array.from(section.children).filter(child => child.textContent.trim() !== '').forEach(child => {
        mobileUtilities.append(child.cloneNode(true)); // Clone to not interfere with main processing
        child.remove();
      });

      mobileUtilityItems.push(mobileUtilities);
      return; // Mobile utilities processed
    }

    // Search, Login, Accessibility (desktop tools typically)
    const textContentLower = section.textContent.toLowerCase();
    if (textContentLower.includes('search') || textContentLower.includes('login') || textContentLower.includes('accessibility') || textContentLower.includes('profile')) {
      const toolItem = document.createElement('div');
      toolItem.classList.add('header-tool-item');

      const link = section.querySelector('a'); // Try to find a link first
      if (link) {
        if (textContentLower.includes('search')) {
          toolItem.classList.add('header-search');
          link.innerHTML = '';
          link.append(createIcon('search'), document.createTextNode('Search'));
          link.addEventListener('click', (e) => {
            e.preventDefault();
            toolItem.classList.toggle('open');
            const searchInput = toolItem.querySelector('.header-search-input');
            if (searchInput) {
              setTimeout(() => searchInput.focus(), 100); // Focus after transition
            }
          });
          // Add dummy search input field
          const searchInput = document.createElement('input');
          searchInput.type = 'search';
          searchInput.placeholder = 'Start Typing...';
          searchInput.classList.add('header-search-input');
          toolItem.append(searchInput);
        } else if (textContentLower.includes('login') || textContentLower.includes('profile')) {
          toolItem.classList.add('header-login');
          link.innerHTML = '';
          link.append(createIcon('profile'));
        } else if (textContentLower.includes('accessibility')) {
          toolItem.classList.add('header-accessibility');
          link.innerHTML = '';
          link.append(createIcon('accessibility'));
        }
        toolItem.append(link);
      } else {
        // Fallback for simple text, create dummy link/button
        if (textContentLower.includes('search')) {
          const searchBtn = document.createElement('button');
          searchBtn.classList.add('header-search-btn');
          searchBtn.append(createIcon('search'), document.createTextNode('Search'));
          toolItem.append(searchBtn);
          searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toolItem.classList.toggle('open');
            const searchInput = toolItem.querySelector('.header-search-input');
            if (searchInput) {
              setTimeout(() => searchInput.focus(), 100);
            }
          });
          const searchInput = document.createElement('input');
          searchInput.type = 'search';
          searchInput.placeholder = 'Start Typing...';
          searchInput.classList.add('header-search-input');
          toolItem.append(searchInput);
        } else if (textContentLower.includes('login') || textContentLower.includes('profile')) {
          const loginA = document.createElement('a');
          loginA.href = '#'; // Placeholder
          loginA.append(createIcon('profile'));
          toolItem.append(loginA);
        } else if (textContentLower.includes('accessibility')) {
          const accessA = document.createElement('a');
          accessA.href = '#'; // Placeholder
          accessA.append(createIcon('accessibility'));
          toolItem.append(accessA);
        }
      }
      desktopUtilityItems.push(toolItem);
      return; // Desktop utility processed
    }

    // Fallback: If any section is not classified and has content, append its content to a generic tools area
    // This ensures no content is lost.
    if (section.children.length > 0) {
      Array.from(section.children).forEach(child => tools.append(child.cloneNode(true)));
      section.remove(); // Remove original section content after cloning
    }
  });

  // Assemble the header
  if (logoElement) {
    brand.append(logoElement);
  }
  navItems.forEach((item) => mainNavUl.append(item));
  desktopUtilityItems.forEach((item) => tools.append(item));
  mobileUtilityItems.forEach((item) => nav.append(item)); // Mobile utilities go inside the main nav for mobile menu

  headerWrapper.append(brand, hamburger, nav, tools);
  block.innerHTML = '';
  block.append(headerWrapper);

  // Final clean up for any stray p tags if not handled during initial processing
  block.querySelectorAll('p:empty').forEach((p) => p.remove());

  // Setup interactive elements
  setupDropdowns(block);

  // Move instrumentation metadata from navContent to the block
  moveInstrumentation(navContent, block);
}