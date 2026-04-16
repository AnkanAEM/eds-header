import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Constants for breakpoint, matching CSS media query
const TABLET_BREAKPOINT = 900;

/**
 * Closes the mobile navigation when the escape key is pressed.
 * @param {KeyboardEvent} e The keyboard event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navHamburger = nav.querySelector('.nav-hamburger');
    if (navHamburger && navHamburger.getAttribute('aria-expanded') === 'true') {
      navHamburger.click();
    }
  }
}

/**
 * Closes the mobile navigation when a click occurs outside of it.
 * @param {MouseEvent} e The mouse event
 */
function closeOnOutsideClick(e) {
  const nav = document.getElementById('nav');
  const navHamburger = nav.querySelector('.nav-hamburger');
  if (navHamburger && navHamburger.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target)) {
    navHamburger.click();
  }
}

/**
 * Toggles body scroll locking based on navigation expansion.
 * @param {boolean} expanded Whether the navigation is expanded
 */
function lockBodyScroll(expanded) {
  document.body.classList.toggle('scroll-locked', expanded);
}

/**
 * Sets up dropdown functionality for navigation items.
 * Handles desktop hover and mobile click interactions.
 * @param {Element} navSections The navigation sections container
 */
function setupDropdowns(navSections) {
  // Handle top-level dropdowns
  navSections.querySelectorAll('.nav-sections > ul > li').forEach((li) => {
    const dropdown = li.querySelector('ul');
    if (dropdown) {
      li.classList.add('nav-drop');
      // Find the link or span that acts as the dropdown button
      const dropBtn = li.querySelector(':scope > a, :scope > span');
      if (dropBtn) {
        dropBtn.setAttribute('role', 'button');
        dropBtn.setAttribute('aria-expanded', 'false');

        // Mobile click handler for dropdowns
        dropBtn.addEventListener('click', (e) => {
          // Only prevent default navigation on mobile if it's a dropdown toggle
          if (window.innerWidth <= TABLET_BREAKPOINT) {
            e.preventDefault();
            const expanded = dropBtn.getAttribute('aria-expanded') === 'true';
            // Close all other open dropdowns at the same level
            li.closest('ul').querySelectorAll('.nav-drop > [aria-expanded="true"]').forEach((otherBtn) => {
              if (otherBtn !== dropBtn) {
                otherBtn.setAttribute('aria-expanded', 'false');
              }
            });
            // Toggle current dropdown
            dropBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    }
  });

  // Handle nested dropdowns (level 2 and beyond) for mobile
  navSections.querySelectorAll('.nav-drop ul li').forEach((li) => {
    const nestedDropdown = li.querySelector('ul');
    if (nestedDropdown) {
      li.classList.add('nav-drop-nested');
      const nestedDropBtn = li.querySelector(':scope > a, :scope > span');
      if (nestedDropBtn) {
        nestedDropBtn.setAttribute('role', 'button');
        nestedDropBtn.setAttribute('aria-expanded', 'false');
        nestedDropBtn.addEventListener('click', (e) => {
          if (window.innerWidth <= TABLET_BREAKPOINT) { // Only for mobile
            e.preventDefault(); // Prevent navigating immediately
            const expanded = nestedDropBtn.getAttribute('aria-expanded') === 'true';
            // Close other nested dropdowns at this level
            li.closest('ul').querySelectorAll('.nav-drop-nested > [aria-expanded="true"]').forEach((otherBtn) => {
              if (otherBtn !== nestedDropBtn) {
                otherBtn.setAttribute('aria-expanded', 'false');
              }
            });
            // Toggle current nested dropdown
            nestedDropBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    }
  });

  // Desktop hover for top-level dropdowns
  if (window.innerWidth > TABLET_BREAKPOINT) {
    navSections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((li) => {
      let timeout;
      li.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        li.querySelector(':scope > [role="button"]').setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          li.querySelector(':scope > [role="button"]').setAttribute('aria-expanded', 'false');
        }, 200); // Small delay to prevent accidental close
      });
    });
  }
}

/**
 * Decorates the header, mainly the nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.setAttribute('id', 'nav');

  // Load nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  // Dynamically classify content from fragment sections
  let logoDiv;
  let navLinksDiv;
  let navIconsDiv;
  let mobileListDiv;

  Array.from(fragment.children).forEach((section) => {
    if (section.querySelector('.cmp-header__logo')) {
      logoDiv = section.querySelector('.cmp-header__logo');
    } else if (section.querySelector('.cmp-header__nav-links')) {
      navLinksDiv = section.querySelector('.cmp-header__nav-links');
    } else if (section.querySelector('.cmp-header__nav-icons')) {
      navIconsDiv = section.querySelector('.cmp-header__nav-icons');
    }
    // Also check for mobile list directly in sections or within navLinksDiv
    if (section.querySelector('.cmp-header__mobile-list')) {
      mobileListDiv = section.querySelector('.cmp-header__mobile-list');
    }
  });
  // Fallback to find mobileListDiv within navLinksDiv if not found directly
  if (!mobileListDiv && navLinksDiv) {
    mobileListDiv = navLinksDiv.querySelector('.cmp-header__mobile-list');
  }

  // Construct the new header structure
  block.innerHTML = '';
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');
  block.append(headerWrapper);

  // --- Brand/Logo ---
  const headerBrand = document.createElement('div');
  headerBrand.classList.add('nav-brand');
  if (logoDiv) {
    const logoLink = logoDiv.querySelector('a');
    if (logoLink) {
      const logoImg = logoLink.querySelector('img');
      if (logoImg) {
        const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt || 'Aashirvaad Logo', true, [{ width: '150' }]);
        logoLink.replaceChildren(optimizedLogo);
      }
      headerBrand.append(logoLink);
    } else {
      headerBrand.append(...logoDiv.children); // Fallback to append all children
    }
  }
  headerWrapper.append(headerBrand);

  // --- Hamburger Toggle ---
  const navSections = document.createElement('div');
  const navHamburger = document.createElement('button'); // Use button for accessibility
  navHamburger.classList.add('nav-hamburger');
  navHamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
  navHamburger.setAttribute('aria-expanded', 'false');
  navHamburger.setAttribute('aria-label', 'Open navigation');
  navHamburger.addEventListener('click', () => {
    const expanded = navHamburger.getAttribute('aria-expanded') === 'true';
    navHamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    navHamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    navSections.classList.toggle('open', !expanded);
    lockBodyScroll(!expanded);
    // Close all open dropdowns when the hamburger menu is toggled off
    if (expanded) {
      navSections.querySelectorAll('[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
    }
  });
  headerWrapper.append(navHamburger);

  // --- Main Navigation Sections ---
  navSections.classList.add('nav-sections');
  headerWrapper.append(navSections);

  if (navLinksDiv) {
    const mainNavUl = navLinksDiv.querySelector('.cmp-navigation > ul');
    if (mainNavUl) {
      // Robust link extraction and invalid HTML cleanup
      mainNavUl.querySelectorAll('li').forEach((li) => {
        // Handle links possibly wrapped in <p> tags or deeply nested
        let link = li.querySelector(':scope > a');
        if (!link) {
          link = li.querySelector(':scope > p > a');
          if (link) {
            li.replaceChild(link, link.closest('p')); // Promote link to direct child
          }
        }

        // Remove promotional/invalid wrappers like .cmp-header__category-menu
        // These divs are invalid direct children of <ul> or nested <ul>
        // We pull their list items out to flatten the structure
        li.querySelectorAll('.cmp-header__category-menu').forEach((invalidDiv) => {
          Array.from(invalidDiv.children).forEach((child) => {
            if (child.tagName === 'LI') {
              invalidDiv.parentNode.insertBefore(child, invalidDiv);
            }
          });
          invalidDiv.remove(); // Remove the invalid div
        });
      });

      // Remove any remaining promotional/image sections that are not navigation items
      mainNavUl.querySelectorAll('.cmp-header__image-text, .productofmonth').forEach((el) => el.remove());

      navSections.append(mainNavUl);

      // Append mobile-specific policy and social links if available
      if (mobileListDiv) {
        navSections.append(mobileListDiv);
      }
    }
  }

  // --- Utility Tools (Search, Accessibility, Login) ---
  const navTools = document.createElement('div');
  navTools.classList.add('nav-tools');

  // Search Toggle Functionality
  const searchToggle = document.createElement('div');
  searchToggle.classList.add('nav-search');
  searchToggle.innerHTML = `
    <button aria-label="Open search" aria-expanded="false">
      <div class="icon-search"></div>
      <span>Search</span>
    </button>
  `;
  const searchButton = searchToggle.querySelector('button');
  searchButton.addEventListener('click', () => {
    const expanded = searchButton.getAttribute('aria-expanded') === 'true';
    searchButton.setAttribute('aria-expanded', !expanded);
    searchButton.setAttribute('aria-label', expanded ? 'Open search' : 'Close search');
    // Toggles a class on body to indicate search overlay should be open
    document.body.classList.toggle('search-overlay-open', !expanded);
  });
  navTools.append(searchToggle);

  // Add other utility icons from the fragment
  if (navIconsDiv) {
    Array.from(navIconsDiv.children).forEach((iconDiv) => {
      // Exclude the search component as we've handled it separately
      if (!iconDiv.classList.contains('cmp-header__search')) {
        const clonedIcon = iconDiv.cloneNode(true);
        // Clean up AEM specific classes that are not part of our new styling
        clonedIcon.classList.remove('cmp-header__accessbility', 'cmp-header__login', 'cmp-header__hide-icon');
        navTools.append(clonedIcon);
      }
    });
  }
  headerWrapper.append(navTools);

  // Setup dropdown interactions
  setupDropdowns(navSections);

  // Add global event listeners for navigation control
  document.addEventListener('keydown', closeOnEscape);
  document.addEventListener('click', closeOnOutsideClick);

  // Cleanup AEM-specific component classes and data attributes from all elements
  block.querySelectorAll('[class*="cmp-"]').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-cmp-') || attr.name === 'sly') {
        el.removeAttribute(attr.name);
      }
    });
    // Filter out classes that start with 'cmp-'
    el.className = Array.from(el.classList).filter((cls) => !cls.startsWith('cmp-')).join(' ');
    if (el.className === '') {
      el.removeAttribute('class');
    }
  });

  // Move AEM instrumentation (e.g., data-rum-sk) from the fragment's root to the block
  moveInstrumentation(fragment, block);
}
