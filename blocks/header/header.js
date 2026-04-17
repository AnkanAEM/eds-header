import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function unwrapParagraphsInLists(element) {
  element.querySelectorAll('li > p > a').forEach((a) => {
    const p = a.parentNode;
    p.parentNode.insertBefore(a, p);
    p.remove();
  });
}

function closeAllDropdowns(excludeElement = null) {
  document.querySelectorAll('.header .dropdown-open').forEach((dropdown) => {
    if (dropdown !== excludeElement) {
      dropdown.classList.remove('dropdown-open');
      const anchor = dropdown.querySelector(':scope > a');
      if (anchor) {
        anchor.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function setupDropdowns(nav) {
  nav.querySelectorAll('li.has-dropdown > a').forEach((anchor) => {
    const li = anchor.closest('li');
    const ul = li.querySelector(':scope > ul');
    if (ul) {
      anchor.setAttribute('aria-haspopup', 'true');
      anchor.setAttribute('aria-expanded', 'false');

      // Desktop dropdown interaction
      li.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 900) { // Apply breakpoint for desktop behavior
          closeAllDropdowns(li);
          li.classList.add('dropdown-open');
          anchor.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 900) { // Apply breakpoint for desktop behavior
          li.classList.remove('dropdown-open');
          anchor.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile dropdown interaction (toggle on click)
      anchor.addEventListener('click', (e) => {
        if (window.innerWidth < 900) { // Apply breakpoint for mobile behavior
          e.preventDefault();
          if (li.classList.contains('dropdown-open')) {
            li.classList.remove('dropdown-open');
            anchor.setAttribute('aria-expanded', 'false');
          } else {
            closeAllDropdowns(li); // Close other mobile dropdowns
            li.classList.add('dropdown-open');
            anchor.setAttribute('aria-expanded', 'true');
          }
        }
      });
    }
  });

  // Close dropdowns on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    const openDropdown = document.querySelector('.header .dropdown-open');
    if (openDropdown && !openDropdown.contains(e.target) && !e.target.closest('.header-nav')) {
      closeAllDropdowns();
    }
  });

  // Handle nested dropdowns separately if they are also defined using ul > li > ul pattern
  nav.querySelectorAll('li > ul').forEach((ul) => {
    const parentLi = ul.closest('li');
    if (parentLi && parentLi.classList.contains('has-dropdown')) {
      parentLi.querySelectorAll(':scope > ul li > a').forEach((subAnchor) => {
        const subLi = subAnchor.closest('li');
        const subUl = subLi.querySelector(':scope > ul');
        if (subUl) {
          subLi.classList.add('has-sub-dropdown');
          subAnchor.setAttribute('aria-haspopup', 'true');
          subAnchor.setAttribute('aria-expanded', 'false');

          subAnchor.addEventListener('click', (e) => {
            if (window.innerWidth < 900) {
              e.preventDefault();
              if (subLi.classList.contains('dropdown-open')) {
                subLi.classList.remove('dropdown-open');
                subAnchor.setAttribute('aria-expanded', 'false');
              } else {
                // Close other sub-dropdowns at the same level
                subLi.parentNode.querySelectorAll('li.dropdown-open').forEach((openSubLi) => {
                  if (openSubLi !== subLi) {
                    openSubLi.classList.remove('dropdown-open');
                    openSubLi.querySelector(':scope > a').setAttribute('aria-expanded', 'false');
                  }
                });
                subLi.classList.add('dropdown-open');
                subAnchor.setAttribute('aria-expanded', 'true');
              }
            }
          });
        }
      });
    }
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch nav content
  const navContent = await loadFragment('/nav');

  // Create main header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  // Create sections for logo, main nav, and utility
  const logoArea = document.createElement('div');
  logoArea.classList.add('header-logo');

  const mainNavArea = document.createElement('nav');
  mainNavArea.classList.add('header-nav');
  mainNavArea.setAttribute('aria-label', 'Main Navigation');

  const toolsArea = document.createElement('div');
  toolsArea.classList.add('header-tools');

  const mobileUtilityWrapper = document.createElement('div');
  mobileUtilityWrapper.classList.add('header-mobile-utility-wrapper');

  let processedLogo = false;
  let primaryNavUlFound = false; // Flag to ensure only one main nav is processed

  // Iterate over children of navContent (AEM sections)
  Array.from(navContent.children).forEach((section) => {
    section.classList.remove('section');
    const defaultContentWrapper = section.querySelector('.default-content-wrapper');
    const contentContainer = defaultContentWrapper || section;
    // Use contentWrapper if available, else section itself

    // 1. Try to extract Logo
    if (!processedLogo) {
      const logoAnchor = contentContainer.querySelector('a:has(img)');
      if (logoAnchor) {
        const logoImg = logoAnchor.querySelector('img');
        const newPicture = createOptimizedPicture(logoImg.src, logoImg.alt || 'Brand Logo', true, [{ width: '150' }]);
        const link = document.createElement('a');
        link.href = logoAnchor.href;
        link.appendChild(newPicture);
        logoArea.appendChild(link);
        processedLogo = true;
        // If the section primarily contained the logo, we might skip further
        // processing for this section. However, a section might contain other
        // hidden elements, so we'll let it pass to subsequent checks.
        // If we found a logo, we consider this section 'handled' for logo purpose.
        return; // Move to next section
      }
    }

    // 2. Try to extract Main Navigation <ul>
    const sectionUl = contentContainer.querySelector('ul');
    if (!primaryNavUlFound && sectionUl && sectionUl.children.length > 0) {
      // Heuristic for main nav: multiple top-level items, or nested items
      // This aims to capture the most significant navigation structure.
      const topLevelLinks = sectionUl.querySelectorAll(':scope > li > a');
      if (topLevelLinks.length > 2 || sectionUl.querySelector('li > ul')) {
        unwrapParagraphsInLists(sectionUl);
        mainNavArea.appendChild(sectionUl); // Append the entire UL structure
        primaryNavUlFound = true; // Mark as found to avoid processing other large Uls as main nav

        // Append any other direct DIV children of the main navigation section
        // (e.g., cmp-header__image-text inside product items, if it was a
        // direct sibling to UL in the fragment)
        Array.from(contentContainer.children).forEach((child) => {
          if (child !== sectionUl && child.tagName === 'DIV' && child.textContent.trim().length > 0) {
            // Clone and append, it will be styled by CSS for mega menu
            mainNavArea.appendChild(child.cloneNode(true));
          }
        });
        return; // Move to next section
      }
    }

    // 3. Collect all other non-empty content for mobile utility or toolsArea
    if (contentContainer.textContent.trim().length > 0) {
      // Check for policy/social links to specifically target mobile utility wrapper
      const links = contentContainer.querySelectorAll('a');
      let isMobileUtilityContent = false;
      if (links.length > 0) {
        const hrefs = Array.from(links).map((a) => a.href);
        if (hrefs.some((href) => href.includes('/conditions-policy/') || href.includes('/more/contact-us.html') || href.includes('instagram.com') || href.includes('facebook.com') || href.includes('twitter.com') || hrefs.includes('youtube.com'))) {
          isMobileUtilityContent = true;
        }
      }

      if (isMobileUtilityContent) {
        contentContainer.querySelectorAll('p > a').forEach((a) => {
          contentContainer.insertBefore(a, a.parentNode);
          a.parentNode.remove();
        });
        mobileUtilityWrapper.appendChild(contentContainer.cloneNode(true));
      } else {
        // If not specific mobile utility and has content, add to toolsArea (e.g. general links)
        toolsArea.appendChild(contentContainer.cloneNode(true));
      }
    }
  });

  // Dynamically create and prepend search, accessibility, login icons to toolsArea
  const navIconsContainer = document.createElement('div');
  navIconsContainer.classList.add('header-nav-icons');

  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.classList.add('header-icon', 'icon-accessibility');
  accessibilityLink.setAttribute('aria-label', 'Accessibility options');
  accessibilityLink.innerHTML = '<span class="icon-accessibility-svg"></span>';
  accessibilityLink.addEventListener('click', (e) => { e.preventDefault(); });

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('header-icon', 'icon-search');
  searchLink.setAttribute('aria-label', 'Search website');
  searchLink.innerHTML = '<span class="icon-search-svg"></span><span class="header-icon-text">Search</span>';
  searchLink.addEventListener('click', (e) => { e.preventDefault(); });

  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.classList.add('header-icon', 'icon-profile');
  loginLink.setAttribute('aria-label', 'Login to account');
  loginLink.innerHTML = '<span class="icon-profile-svg"></span>';
  loginLink.addEventListener('click', (e) => { e.preventDefault(); });

  navIconsContainer.append(accessibilityLink, searchLink, loginLink);
  toolsArea.prepend(navIconsContainer); // Prepend to tools area to appear before other links

  // Append mobile utility wrapper inside mainNavArea to be part of the mobile menu panel
  mainNavArea.appendChild(mobileUtilityWrapper);

  // Create hamburger menu button
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '&#9776;'; // Hamburger icon or SVG

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('header-close');
  closeBtn.setAttribute('aria-label', 'Close navigation');
  closeBtn.innerHTML = '&times;'; // Close icon or SVG

  // Prepend hamburger to headerWrapper so it's always accessible
  headerWrapper.append(hamburger, closeBtn);

  // Assemble the header
  headerWrapper.append(logoArea, mainNavArea, toolsArea);
  block.append(headerWrapper);

  // Hamburger toggle functionality
  const toggleMenu = (forceExpanded = undefined) => {
    const isExpanded = forceExpanded !== undefined ? forceExpanded : hamburger.getAttribute('aria-expanded') === 'false';
    hamburger.setAttribute('aria-expanded', isExpanded);
    headerWrapper.classList.toggle('header-expanded', isExpanded);
    document.body.classList.toggle('header-expanded', isExpanded); // For scroll lock
    closeBtn.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
      closeBtn.focus();
    } else {
      hamburger.focus();
    }
  };

  hamburger.addEventListener('click', () => toggleMenu());
  closeBtn.addEventListener('click', () => toggleMenu(false));

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerWrapper.classList.contains('header-expanded')) {
      toggleMenu(false);
    }
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (headerWrapper.classList.contains('header-expanded') && !headerWrapper.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Add 'has-dropdown' class to all parent list items with a nested UL for styling
  mainNavArea.querySelectorAll('li:has(ul)').forEach((li) => {
    li.classList.add('has-dropdown');
  });

  // Setup dropdowns for the main navigation
  setupDropdowns(mainNavArea);

  moveInstrumentation(navContent, block);
}
