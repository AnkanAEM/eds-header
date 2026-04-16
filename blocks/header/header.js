import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Closes all open dropdowns within a given menu element.
 * @param {HTMLElement} menu The menu element to process.
 */
function closeAllDropdowns(menu) {
  menu.querySelectorAll('li.open').forEach((li) => {
    li.classList.remove('open');
    const link = li.querySelector(':scope > a');
    if (link) link.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Sets up dropdown functionality for navigation lists.
 * Handles mouseenter/mouseleave for desktop and click for mobile.
 * @param {HTMLElement} mainNavList The main navigation list element.
 */
function setupDropdowns(mainNavList) {
  const navItems = mainNavList.querySelectorAll('li');
  navItems.forEach((li) => {
    const subMenu = li.querySelector('ul');
    const mainLink = li.querySelector(':scope > a');

    if (subMenu) {
      li.classList.add('has-dropdown');
      if (mainLink) {
        mainLink.setAttribute('aria-haspopup', 'true');
        mainLink.setAttribute('aria-expanded', 'false');

        // Add a dropdown toggle icon for mobile
        const dropdownToggle = document.createElement('span');
        dropdownToggle.classList.add('dropdown-toggle');
        dropdownToggle.innerHTML = '<span class="icon-chevron-down"></span>'; // Placeholder icon
        mainLink.append(dropdownToggle);

        // Mobile: click toggle on the dropdown icon
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Stop propagation to prevent parent li click from conflicting
          if (window.innerWidth <= 992) { // Mobile breakpoint
            const isOpen = li.classList.contains('open');
            // Close other dropdowns at the same level
            Array.from(li.parentNode.children).forEach((sibling) => {
              if (sibling !== li && sibling.classList.contains('open')) {
                sibling.classList.remove('open');
                sibling.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
                closeAllDropdowns(sibling); // Close nested dropdowns
              }
            });
            li.classList.toggle('open');
            mainLink.setAttribute('aria-expanded', !isOpen);
          }
        });
      }

      // Desktop: mouseenter/mouseleave
      li.addEventListener('mouseenter', () => {
        if (window.innerWidth > 992) {
          li.classList.add('open');
          if (mainLink) mainLink.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (window.innerWidth > 992) {
          li.classList.remove('open');
          if (mainLink) mainLink.setAttribute('aria-expanded', 'false');
        }
      });

      // Recurse for nested dropdowns
      setupDropdowns(subMenu);
    }
  });
}

/**
 * Decorates the header block with navigation, logo, and utility tools.
 * @param {HTMLElement} block The header block element.
 */
export default async function decorate(block) {
  // Clear the block and prepare the new structure
  block.textContent = '';
  block.classList.add('header-block');

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');
  block.append(headerWrapper);

  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="icon-hamburger"></span>'; // Placeholder for hamburger icon
  headerWrapper.append(hamburger);

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');
  headerWrapper.append(headerBrand);

  const headerNav = document.createElement('div');
  headerNav.classList.add('header-nav'); // Contains main menu and mobile utilities
  headerWrapper.append(headerNav);

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');
  headerWrapper.append(headerTools);

  // Fetch nav content from the /nav fragment
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return; // Exit if fragment not loaded
  }

  // --- Content Classification and Restructuring ---
  const sections = Array.from(navContent.children); // Top-level divs from fragment

  // 1. Logo (Assume the first non-empty section with an <a><img> or <a><picture><img>)
  let logoFound = false;
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const logoLink = section.querySelector('a > picture > img') ? section.querySelector('a') : section.querySelector('a > img')?.parentElement;
    if (logoLink) {
      const img = logoLink.querySelector('img');
      if (img) {
        // Optimize picture for better performance
        const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]);
        logoLink.replaceChildren(optimizedPicture);
      }
      headerBrand.append(logoLink);
      sections.splice(i, 1); // Remove processed section
      logoFound = true;
      break;
    }
  }
  // Fallback for logo if not found specifically but a first link exists
  if (!logoFound && sections.length > 0) {
    const potentialLogo = sections[0].querySelector('a');
    if (potentialLogo) {
      headerBrand.append(potentialLogo);
      sections.shift();
    }
  }

  // Create containers for main navigation and mobile-specific utility
  const mainNavList = document.createElement('ul');
  mainNavList.classList.add('main-nav-list');
  headerNav.append(mainNavList);

  const mobileUtilityWrapper = document.createElement('div');
  mobileUtilityWrapper.classList.add('mobile-utility-wrapper');
  const mobilePolicyList = document.createElement('ul');
  mobilePolicyList.classList.add('mobile-policy-list');
  const mobileSocialList = document.createElement('div'); // Using div for social icons as they are not <ul> in original
  mobileSocialList.classList.add('mobile-social-list');
  mobileUtilityWrapper.append(mobilePolicyList, mobileSocialList);
  headerNav.append(mobileUtilityWrapper);

  // Tools for desktop (Search, Accessibility, Profile) - based on original HTML
  const searchLink = document.createElement('a');
  searchLink.classList.add('header-icon', 'icon-search-btn');
  searchLink.setAttribute('aria-label', 'Search');
  searchLink.href = '#';
  searchLink.innerHTML = '<span class="icon-search"></span><span class="header-icon-text">Search</span>';
  headerTools.append(searchLink);

  const accessibilityLink = document.createElement('a');
  accessibilityLink.classList.add('header-icon', 'icon-accessibility-btn');
  accessibilityLink.setAttribute('aria-label', 'Accessibility');
  accessibilityLink.href = '#';
  accessibilityLink.innerHTML = '<span class="icon-accessibility"></span>';
  headerTools.append(accessibilityLink);

  const profileLink = document.createElement('a');
  profileLink.classList.add('header-icon', 'icon-profile-btn');
  profileLink.setAttribute('aria-label', 'Profile');
  profileLink.href = '#';
  profileLink.innerHTML = '<span class="icon-profile"></span>';
  headerTools.append(profileLink);

  // Iterate through remaining sections for navigation items and utility links
  sections.forEach((section) => {
    // Check for social media links within the section
    const socialLinks = section.querySelectorAll('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="twitter.com"], a[href*="youtube.com"]');
    if (socialLinks.length > 0) {
      socialLinks.forEach((link) => {
        const clonedLink = link.cloneNode(true);
        // Add specific icon classes based on href for styling
        if (clonedLink.href.includes('instagram')) clonedLink.classList.add('icon-instagram');
        else if (clonedLink.href.includes('facebook')) clonedLink.classList.add('icon-facebook');
        else if (clonedLink.href.includes('twitter')) clonedLink.classList.add('icon-twitter');
        else if (clonedLink.href.includes('youtube')) clonedLink.classList.add('icon-youtube');
        mobileSocialList.append(clonedLink);
      });
      return; // Section processed
    }

    // Check for policy/contact links (these were often grouped in original AEM output for mobile)
    const policyLinks = section.querySelectorAll('a[href*="contact-us.html"], a[href*="terms-of-use.html"], a[href*="privacy-policy.html"], a[href*="faqs.html"]');
    if (policyLinks.length > 0) {
      policyLinks.forEach((link) => {
        const li = document.createElement('li');
        li.append(link.cloneNode(true));
        mobilePolicyList.append(li);
      });
      return; // Section processed
    }

    // Main navigation items (e.g., div with p>a and potentially a ul)
    const mainAnchorWrapper = section.querySelector('p'); // Find <p> wrapping the main link
    const submenuUl = section.querySelector('ul'); // Find direct <ul> for submenu

    if (mainAnchorWrapper && mainAnchorWrapper.querySelector('a')) {
      const li = document.createElement('li');
      li.append(mainAnchorWrapper.querySelector('a').cloneNode(true)); // Copy the main link
      if (submenuUl) {
        li.append(submenuUl.cloneNode(true)); // Copy the submenu
      }
      mainNavList.append(li);
      return; // Section processed
    }

    // Fallback: If any other content remains in a section, append it to mobile utility.
    // This ensures no content from the fragment is lost.
    if (section.children.length > 0) {
      Array.from(section.children).forEach((child) => {
        // Avoid duplicating already processed items if they were part of a larger section
        if (!child.closest('.mobile-utility-wrapper') && !child.closest('.main-nav-list')) {
          mobileUtilityWrapper.append(child.cloneNode(true));
        }
      });
    }
  });

  // Remove empty mobile utility wrapper if no content was added to it
  if (!mobilePolicyList.children.length && !mobileSocialList.children.length
    && !mobileUtilityWrapper.children.length) {
    mobileUtilityWrapper.remove();
  }

  // Setup dropdown interactions for the main navigation
  setupDropdowns(mainNavList);

  // --- Hamburger Toggle Logic ---
  hamburger.addEventListener('click', () => {
    const isOpen = headerWrapper.classList.contains('open');
    headerWrapper.classList.toggle('open');
    document.body.classList.toggle('scroll-lock', !isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    hamburger.setAttribute('aria-expanded', !isOpen);

    if (!isOpen) { // If opening, ensure all dropdowns are closed
      closeAllDropdowns(mainNavList);
    }
  });

  // --- Close on Escape and Outside Click ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerWrapper.classList.contains('open')) {
      headerWrapper.classList.remove('open');
      document.body.classList.remove('scroll-lock');
      hamburger.setAttribute('aria-label', 'Open navigation');
      hamburger.setAttribute('aria-expanded', 'false');
      closeAllDropdowns(mainNavList);
    }
  });

  document.addEventListener('click', (e) => {
    if (!block.contains(e.target) && headerWrapper.classList.contains('open')) {
      headerWrapper.classList.remove('open');
      document.body.classList.remove('scroll-lock');
      hamburger.setAttribute('aria-label', 'Open navigation');
      hamburger.setAttribute('aria-expanded', 'false');
      closeAllDropdowns(mainNavList);
    }
  });

  // Final instrumentation for AEM tracking
  moveInstrumentation(navContent, block);
}
