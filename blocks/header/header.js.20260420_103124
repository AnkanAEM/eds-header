import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const BREAKPOINT_DESKTOP = 900; // Define the desktop breakpoint

/**
 * Closes all open dropdowns within a given container.
 * @param {HTMLElement} container The container to search for open dropdowns (e.g., the header element).
 */
function closeAllDropdowns(container) {
  container.querySelectorAll('.header-nav-item.is-open').forEach((openItem) => {
    openItem.classList.remove('is-open');
    openItem.querySelector('a[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
    openItem.querySelector('.header-dropdown-wrapper[aria-hidden="false"]')?.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('nav-open'); // Release body scroll lock
}

/**
 * Sets up interactive dropdown behavior for navigation items.
 * This function recursively finds all list items with nested <ul> elements and applies hover/click listeners.
 * It transforms plain text labels (e.g., 'Atta') into clickable <a> tags for dropdown toggles.
 * @param {HTMLElement} container The root element containing the navigation (e.g., .header-nav).
 */
function setupDropdowns(container) {
  // Find all list items that contain a nested <ul>, starting from any level within the container
  const itemsWithSubmenus = container.querySelectorAll('li:has(ul)');

  itemsWithSubmenus.forEach((item) => {
    item.classList.add('has-children');

    // The primary toggle element for this dropdown. It could be an existing <a> or a text node.
    let dropdownToggle = item.querySelector(':scope > a');
    let dropdownMenu = item.querySelector(':scope > ul');

    // If no direct <a> exists for the current list item (e.g., 'Atta' is a text node),
    // create one to act as the toggle.
    if (!dropdownToggle) {
      const textNode = Array.from(item.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
      );
      if (textNode) {
        const newLink = document.createElement('a');
        newLink.href = '#'; // Placeholder href for category parent
        newLink.textContent = textNode.textContent.trim();
        textNode.replaceWith(newLink);
        dropdownToggle = newLink;
        dropdownToggle.classList.add('header-nav-item-link'); // Add class for styling consistency
      } else {
        return; // Cannot create a toggle for this item, skip
      }
    }

    // Wrap the submenu <ul> in a .header-dropdown-wrapper if not already wrapped
    if (dropdownMenu) {
      const existingWrapper = dropdownMenu.closest('.header-dropdown-wrapper');
      if (!existingWrapper || existingWrapper.parentNode !== item) {
        // Ensure wrapper is directly under the parent <li> and not a higher-level wrapper
        const newDropdownWrapper = document.createElement('div');
        newDropdownWrapper.classList.add('header-dropdown-wrapper');
        dropdownMenu.parentNode.insertBefore(newDropdownWrapper, dropdownMenu);
        newDropdownWrapper.append(dropdownMenu);
        dropdownMenu = newDropdownWrapper; // Update reference to the new wrapper
      } else {
        dropdownMenu = existingWrapper; // Use existing wrapper
      }
    }

    // If we still don't have a valid toggle or menu, exit.
    if (!dropdownToggle || !dropdownMenu) return;

    // Set initial ARIA attributes for accessibility
    dropdownToggle.setAttribute('aria-haspopup', 'true');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownMenu.setAttribute('aria-hidden', 'true');

    // Desktop (hover) interaction logic
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= BREAKPOINT_DESKTOP) {
        // Close sibling dropdowns at the same level (only direct children of parent <ul>)
        const parentUl = item.closest('ul');
        parentUl?.querySelectorAll(':scope > li.is-open').forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('is-open');
            sibling.querySelector('a[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
            sibling.querySelector('.header-dropdown-wrapper[aria-hidden="false"]')?.setAttribute('aria-hidden', 'true');
          }
        });

        dropdownToggle.setAttribute('aria-expanded', 'true');
        dropdownMenu.setAttribute('aria-hidden', 'false');
        item.classList.add('is-open');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= BREAKPOINT_DESKTOP) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
        item.classList.remove('is-open');
      }
    });

    // Mobile (click) interaction logic (also applies to desktop if link is '#')
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth < BREAKPOINT_DESKTOP || dropdownToggle.href.endsWith('#')) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to allow nested clicks and prevent parent closing
        const isOpen = dropdownToggle.getAttribute('aria-expanded') === 'true';

        // Close sibling dropdowns at the same level
        const parentUl = item.closest('ul');
        parentUl?.querySelectorAll(':scope > li.is-open').forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('is-open');
            sibling.querySelector('a[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
            sibling.querySelector('.header-dropdown-wrapper[aria-hidden="false"]')?.setAttribute('aria-hidden', 'true');
          }
        });

        dropdownToggle.setAttribute('aria-expanded', !isOpen);
        dropdownMenu.setAttribute('aria-hidden', isOpen);
        item.classList.toggle('is-open', !isOpen);
      }
    });
  });

  // Global click to close all top-level dropdowns on desktop when clicking outside
  document.addEventListener('click', (event) => {
    if (window.innerWidth >= BREAKPOINT_DESKTOP) {
      const headerElement = container.closest('.header'); // Find the main header
      if (headerElement && !headerElement.contains(event.target)) {
        closeAllDropdowns(headerElement);
      }
    }
  });

  // Escape key to close all top-level dropdowns
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns(container.closest('.header'));
    }
  });
}

export default async function decorate(block) {
  // Clear the block content to ensure idempotency (decorate can run multiple times safely)
  block.innerHTML = '';

  // Load the navigation fragment, assuming it returns the JSON data model directly
  // If /nav returns HTML, further parsing would be needed here to extract the JSON structure.
  const navFragmentData = await loadFragment('/nav');

  // Handle cases where the fragment data is empty or malformed
  if (!navFragmentData || !Array.isArray(navFragmentData)) {
    console.warn('Navigation fragment data is empty or malformed. Rendering fallback header.');
    const header = document.createElement('header');
    header.classList.add('header');
    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add('header-wrapper');
    const headerBrand = document.createElement('div');
    headerBrand.classList.add('header-brand');
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.append(createOptimizedPicture('https://s7ap1.scene7.com/is/content/itcportalprod/Logo_2', 'Aashirvaad Logo', true, [{ width: '150' }]));
    headerBrand.append(logoLink);
    headerWrapper.append(headerBrand);
    header.append(headerWrapper);
    block.append(header);
    // Even if navFragmentData is not a DOM element, moveInstrumentation expects a source element for tracking.
    // Providing null or an empty div might be safer if navFragmentData is literally JSON.
    // For strict compliance, using a dummy element as source if JSON.
    moveInstrumentation(document.createElement('div'), block); 
    return;
  }

  // Create the main header structure
  const header = document.createElement('header');
  header.classList.add('header');

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  // --- Header Brand / Logo Section ---
  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  // Using createOptimizedPicture for performance, extracting URL and alt text from original HTML
  const logoImg = createOptimizedPicture('https://s7ap1.scene7.com/is/content/itcportalprod/Logo_2', 'Aashirvaad Logo', true, [{ width: '150' }]);
  logoLink.append(logoImg);
  headerBrand.append(logoLink);
  headerWrapper.append(headerBrand);

  // --- Main Navigation Section ---
  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  headerNav.setAttribute('aria-label', 'Main navigation');

  const navItemsWrapper = document.createElement('ul');
  navItemsWrapper.classList.add('header-nav-items-wrapper');

  // Populate navigation items from the fragment data model
  navFragmentData.forEach((item) => {
    const navItemLi = document.createElement('li');
    navItemLi.classList.add('header-nav-item');

    const navItemLink = document.createElement('a');
    navItemLink.classList.add('header-nav-item-link');
    navItemLink.href = item.l1Href || '#'; // Use '#' as fallback if href is missing
    navItemLink.textContent = item.l1Label;
    navItemLi.append(navItemLink);

    // If the item has submenu HTML, create a dropdown
    if (item.menuHtml) {
      navItemLi.classList.add('has-children');
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.classList.add('header-dropdown-wrapper');

      // Temporarily parse the menuHtml string into a DOM element
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.menuHtml;
      
      // Move the children (expected to be <ul>) from tempDiv to dropdownWrapper
      while (tempDiv.firstChild) {
        dropdownWrapper.append(tempDiv.firstChild);
      }
      navItemLi.append(dropdownWrapper);
    }
    navItemsWrapper.append(navItemLi);
  });

  headerNav.append(navItemsWrapper);

  // --- Mobile-specific Policy and Social Media Links ---
  // These elements are present in the original AEM header's mobile menu and are hardcoded here.
  const mobileList = document.createElement('div');
  mobileList.classList.add('header-mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('header-policy-links');
  policyUl.innerHTML = `
    <li class="header-policy-item"><a href="/more/contact-us.html" target="_blank">Contact us</a></li>
    <li class="header-policy-item"><a href="/conditions-policy/terms-of-use.html" target="_blank">Terms of use</a></li>
    <li class="header-policy-item"><a href="/conditions-policy/privacy-policy.html" target="_blank">Privacy Policy</a></li>
  `;
  mobileList.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('header-social-media');
  socialMediaDiv.innerHTML = `
    <a href="https://www.instagram.com/aashirvaad/" target="_blank" class="icon-instagram" data-social="instagram" aria-label="Instagram"></a>
    <a href="https://www.facebook.com/Aashirvaad/" target="_blank" class="icon-facebook" data-social="facebook" aria-label="Facebook"></a>
    <a href="https://twitter.com/AashirvaadAtta" target="_blank" class="icon-twitter" data-social="twitter" aria-label="Twitter"></a>
    <a href="https://www.youtube.com/user/AashirvaadAtta" target="_blank" class="icon-youtube" data-social="youtube" aria-label="YouTube"></a>
  `;
  mobileList.append(socialMediaDiv);
  headerNav.append(mobileList);
  headerWrapper.append(headerNav);

  // --- Header Tools Section (Hamburger, Search, Profile) ---
  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  // Hamburger menu button for mobile
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '&#9776;'; // Unicode hamburger icon
  headerTools.append(hamburger);

  // Search icon link
  const searchLink = document.createElement('a');
  searchLink.href = '#'; // Placeholder, ideally triggers a search modal or navigates to search page
  searchLink.classList.add('header-tool-item', 'icon-search');
  searchLink.setAttribute('aria-label', 'Search');
  headerTools.append(searchLink);

  // Profile/Login icon link
  const profileLink = document.createElement('a');
  profileLink.href = '#'; // Placeholder, ideally navigates to login/profile page
  profileLink.classList.add('header-tool-item', 'icon-profile');
  profileLink.setAttribute('aria-label', 'Profile');
  headerTools.append(profileLink);

  headerWrapper.append(headerTools);

  // Append the header wrapper to the main header, then to the block
  header.append(headerWrapper);
  block.append(header);

  // --- Event Listeners / Interactions ---
  // Hamburger menu toggle for mobile viewports
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    headerNav.classList.toggle('is-open', !isExpanded);
    document.body.classList.toggle('nav-open', !isExpanded); // Lock body scroll on mobile menu open

    // Close all dropdowns when hamburger is toggled
    closeAllDropdowns(headerNav);
  });

  // Setup dropdown logic for all navigation items
  setupDropdowns(headerNav);

  // Move instrumentation data from the fragment (if it was a DOM element) to the decorated block.
  // Since navFragmentData is assumed to be JSON, we pass a dummy element as the source.
  moveInstrumentation(document.createElement('div'), block);
}