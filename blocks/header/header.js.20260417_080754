import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const L0_LABELS = {
  '/our-products.html': 'Our Products',
  '/our-story.html': 'Our Story',
  '/recipe-listing.html': 'Recipe',
  '/blogs.html': 'Blogs',
  '/csr-initiatives.html': 'CSR Initiatives',
  '/faqs.html': 'FAQs'
};

/**
 * Recursively sets up event listeners for dropdown menus (hover for desktop, click for mobile).
 * @param {HTMLElement[]} navItems - List of navigation list items (li elements).
 * @param {boolean} isMobile - True if setting up for mobile interactions.
 */
function setupDropdowns(navItems, isMobile = false) {
  navItems.forEach((item) => {
    const dropdownToggle = item.querySelector(':scope > a');
    const dropdownContent = item.querySelector(':scope > ul');

    if (dropdownContent) {
      item.classList.add('has-dropdown');
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownContent.setAttribute('aria-hidden', 'true');

      if (isMobile) {
        // Mobile: click to toggle dropdown
        dropdownToggle.addEventListener('click', (e) => {
          // Prevent default if it's a parent toggle without an immediate link destination
          // For 'Our Products' on mobile, it should toggle the submenu, not navigate immediately
          const isTopLevelParent = item.closest('.header-nav__primary-nav > li') === item;
          const shouldToggle = dropdownContent.classList.contains('open') || !dropdownToggle.href || isTopLevelParent;

          if (shouldToggle) {
            e.preventDefault();
            e.stopPropagation();
            // Close siblings at the same level
            Array.from(item.parentElement.children)
              .filter(sibling => sibling !== item && sibling.classList.contains('has-dropdown'))
              .forEach(sibling => closeDropdown(sibling));

            toggleDropdown(item);
          } else if (dropdownToggle.href) {
            // If it's a link and not a toggling parent, allow navigation
            window.location.href = dropdownToggle.href;
          }
        });
      } else {
        // Desktop: hover to toggle dropdown
        item.addEventListener('mouseenter', () => openDropdown(item));
        item.addEventListener('mouseleave', () => closeDropdown(item));
      }

      // Recursively set up dropdowns for nested levels
      const nestedItems = dropdownContent.querySelectorAll(':scope > li');
      if (nestedItems.length > 0) {
        setupDropdowns(nestedItems, isMobile);
      }
    }
  });
}

function toggleDropdown(item) {
  const isOpen = item.classList.toggle('open');
  const dropdownToggle = item.querySelector(':scope > a');
  const dropdownContent = item.querySelector(':scope > ul');
  if (dropdownToggle && dropdownContent) {
    dropdownToggle.setAttribute('aria-expanded', isOpen);
    dropdownContent.setAttribute('aria-hidden', !isOpen);
  }
}

function openDropdown(item) {
  const dropdownToggle = item.querySelector(':scope > a');
  const dropdownContent = item.querySelector(':scope > ul');
  if (dropdownToggle && dropdownContent) {
    item.classList.add('open');
    dropdownToggle.setAttribute('aria-expanded', 'true');
    dropdownContent.setAttribute('aria-hidden', 'false');
  }
}

function closeDropdown(item) {
  const dropdownToggle = item.querySelector(':scope > a');
  const dropdownContent = item.querySelector(':scope > ul');
  if (dropdownToggle && dropdownContent) {
    item.classList.remove('open');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownContent.setAttribute('aria-hidden', 'true');
    // Recursively close nested dropdowns
    Array.from(dropdownContent.querySelectorAll('.has-dropdown.open'))
      .forEach(nestedItem => closeDropdown(nestedItem));
  }
}

function closeAllDropdowns(container) {
  container.querySelectorAll('.has-dropdown.open').forEach((dropdown) => closeDropdown(dropdown));
}

export default async function decorate(block) {
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return;
  }

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  // Brand Logo
  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');
  let logoFound = false;
  Array.from(navContent.children).some(section => {
    const logoLink = section.querySelector('a:has(img)');
    if (logoLink) {
      const logoImg = logoLink.querySelector('img');
      const optimizedLogoImg = createOptimizedPicture(logoImg.src, logoImg.alt, true, [{ width: '150' }]);
      logoLink.innerHTML = '';
      logoLink.appendChild(optimizedLogoImg);
      headerBrand.appendChild(logoLink);
      section.remove();
      logoFound = true;
      return true;
    }
    return false;
  });

  if (!logoFound) {
    // Fallback if no logo section found, create a placeholder
    const fallbackLogo = document.createElement('a');
    fallbackLogo.href = '/';
    const img = document.createElement('img');
    img.src = '/icons/aashirvaad-logo.svg'; // Placeholder SVG or default
    img.alt = 'Aashirvaad Logo';
    fallbackLogo.appendChild(img);
    headerBrand.appendChild(fallbackLogo);
  }

  // Navigation Menu
  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  headerNav.setAttribute('aria-label', 'Main Navigation');

  const primaryNavUl = document.createElement('ul');
  primaryNavUl.classList.add('header-nav__primary-nav');

  const mobileContentWrapper = document.createElement('div');
  mobileContentWrapper.classList.add('header-nav__mobile-content');

  const sectionsToProcess = Array.from(navContent.children);

  let mainNavHandled = false;

  sectionsToProcess.forEach((section) => {
    // Clean up empty <p> tags or unwrap single link/button <p> tags
    section.querySelectorAll('p:empty').forEach((p) => p.remove());
    section.querySelectorAll('p').forEach((p) => {
      if (p.children.length === 1 && (p.firstElementChild.tagName === 'A' || p.firstElementChild.tagName === 'BUTTON')) {
        p.replaceWith(p.firstElementChild);
      }
    });

    const ulElement = section.querySelector('ul');
    const anchorElement = section.querySelector('a');

    if (ulElement && !mainNavHandled) {
      // This is assumed to be the primary navigation block
      const topLevelItems = Array.from(ulElement.children);
      topLevelItems.forEach(li => {
        const link = li.querySelector(':scope > a');
        if (link) {
          const originalText = link.textContent.trim();
          if (originalText === 'Button' || originalText === 'Link') {
            const newLabel = L0_LABELS[link.pathname];
            if (newLabel) {
              link.textContent = newLabel;
            }
          }
          // Check for mega menu specific content and append to correct list item
          if (link.pathname === '/our-products.html' || link.textContent === 'Our Products') {
            li.classList.add('header-nav__product-menu');
            const imageTextDiv = section.querySelector('.productofmonth'); // Check specific original class
            if (imageTextDiv) {
              const clonedImageText = imageTextDiv.cloneNode(true);
              clonedImageText.classList.remove('productofmonth'); // Clean original class
              clonedImageText.classList.add('header-nav__image-text'); // Add a cleaner class
              const picture = clonedImageText.querySelector('picture');
              if (picture) {
                const img = picture.querySelector('img');
                if (img) {
                  const optimizedImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
                  img.replaceWith(optimizedImg);
                }
              }
              li.querySelector('ul')?.appendChild(clonedImageText);
              imageTextDiv.remove(); // Remove original from fragment section
            }
          }
          if (link.pathname === '/csr-initiatives.html' || link.textContent === 'CSR Initiatives') {
            li.classList.add('header-nav__csr-menu');
            const imageTextDiv = section.querySelector('.productofmonth_community-contact-program'); // Check specific original class
            if (imageTextDiv) {
              const clonedImageText = imageTextDiv.cloneNode(true);
              clonedImageText.classList.remove('productofmonth_community-contact-program');
              clonedImageText.classList.add('header-nav__image-text');
              const picture = clonedImageText.querySelector('picture');
              if (picture) {
                const img = picture.querySelector('img');
                if (img) {
                  const optimizedImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
                  img.replaceWith(optimizedImg);
                }
              }
              li.querySelector('ul')?.appendChild(clonedImageText);
              imageTextDiv.remove();
            }
          }
        }
        primaryNavUl.appendChild(li);
      });
      mainNavHandled = true;
      section.remove(); // Remove processed section
    } else if (ulElement) {
      // Any other UL after the main nav is treated as mobile utility links
      ulElement.classList.add('header-nav__policy-links');
      mobileContentWrapper.appendChild(ulElement);
      section.remove();
    } else if (anchorElement && anchorElement.hasAttribute('data-social')) {
      // Social media links
      const socialMediaContainer = document.createElement('div');
      socialMediaContainer.classList.add('header-nav__social-media');
      Array.from(section.children).forEach(child => socialMediaContainer.appendChild(child));
      mobileContentWrapper.appendChild(socialMediaContainer);
      section.remove();
    } else if (anchorElement && mainNavHandled) {
        // Handle standalone L0 links after the first main nav UL
        const li = document.createElement('li');
        li.classList.add('header-nav__item', 'header-nav__item--level-0');
        const link = anchorElement.cloneNode(true);
        const originalText = link.textContent.trim();
        if (originalText === 'Button' || originalText === 'Link') {
            const newLabel = L0_LABELS[link.pathname];
            if (newLabel) {
              link.textContent = newLabel;
            }
          }
        li.appendChild(link);
        primaryNavUl.appendChild(li);
        section.remove();
    }
  });

  headerNav.appendChild(primaryNavUl);
  headerNav.appendChild(mobileContentWrapper);

  // Tools (Search, Profile)
  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  // Search Icon (dynamically created as per original site structure, not typically in /nav fragment)
  const searchTool = document.createElement('div');
  searchTool.classList.add('header-tools__search');
  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.setAttribute('aria-label', 'Search');
  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-search');
  searchLink.appendChild(searchIcon);
  searchTool.appendChild(searchLink);
  headerTools.appendChild(searchTool);

  // Login/Profile Icon (dynamically created)
  const profileTool = document.createElement('div');
  profileTool.classList.add('header-tools__profile');
  const profileLink = document.createElement('a');
  profileLink.href = '#';
  profileLink.setAttribute('aria-label', 'Profile');
  const profileIcon = document.createElement('div');
  profileIcon.classList.add('icon-profile');
  profileLink.appendChild(profileIcon);
  profileTool.appendChild(profileLink);
  headerTools.appendChild(profileTool);

  // Hamburger Menu for Mobile
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Toggle Navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="icon-hamburger"></span>';

  // Append all to header wrapper
  headerWrapper.appendChild(headerBrand);
  headerWrapper.appendChild(headerNav);
  headerWrapper.appendChild(headerTools);
  headerWrapper.appendChild(hamburger);
  block.appendChild(headerWrapper);

  // Store header height as a CSS variable for mobile nav positioning
  const headerHeight = headerWrapper.offsetHeight;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

  // Add event listeners
  hamburger.addEventListener('click', () => {
    const isOpen = headerNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    // On mobile, force closing all dropdowns when the main nav is closed
    if (!isOpen) {
      closeAllDropdowns(headerNav);
    } else {
      // When opening, ensure dropdowns use mobile interaction (click)
      setupDropdowns(primaryNavUl.querySelectorAll(':scope > li'), true);
    }
  });

  // Close dropdowns on outside click for desktop
  document.addEventListener('click', (event) => {
    if (window.innerWidth > 900 && !block.contains(event.target)) {
      closeAllDropdowns(headerNav);
    }
  });

  // Close dropdowns on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(headerNav);
      if (headerNav.classList.contains('open')) {
        headerNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    }
  });

  // Initial setup for desktop dropdowns
  setupDropdowns(primaryNavUl.querySelectorAll(':scope > li'), false);

  // Re-evaluate dropdown interaction on resize to switch between desktop/mobile
  let isMobileView = window.innerWidth <= 900;
  window.addEventListener('resize', () => {
    const newIsMobileView = window.innerWidth <= 900;
    if (newIsMobileView !== isMobileView) {
      isMobileView = newIsMobileView;
      // Reset and reapply listeners based on new view
      closeAllDropdowns(headerNav);
      // Ensure hamburger menu is closed and body scroll enabled if transitioning from mobile to desktop
      if (!isMobileView && headerNav.classList.contains('open')) {
        headerNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
      setupDropdowns(primaryNavUl.querySelectorAll(':scope > li'), isMobileView);
    }
  });

  moveInstrumentation(navContent, block);
}