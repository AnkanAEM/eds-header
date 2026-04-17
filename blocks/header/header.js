import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function toggleDropdown(element, forceClose = false) {
  const isOpen = element.getAttribute('aria-expanded') === 'true';
  if (forceClose || isOpen) {
    element.setAttribute('aria-expanded', 'false');
    element.classList.remove('is-open');
  } else {
    element.setAttribute('aria-expanded', 'true');
    element.classList.add('is-open');
  }
}

function closeAllDropdowns(container, exclude = []) {
  container.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
    if (!exclude.includes(el)) {
      toggleDropdown(el, true);
    }
  });
}

function setupDropdowns(dropdowns, isMobile = false, level = 0) {
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('a, button');
    if (!trigger) return;

    const content = dropdown.querySelector('ul, .header-dropdown-wrapper');
    if (!content) return;

    const eventType = isMobile ? 'click' : 'mouseenter';
    const leaveEventType = isMobile ? 'click' : 'mouseleave';

    if (isMobile) {
      trigger.addEventListener(eventType, (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentlyOpen = dropdown.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(dropdown.closest('.header-nav, .header-dropdown-wrapper'), [trigger]);
        if (!currentlyOpen) {
            toggleDropdown(trigger);
        } else if (e.target === trigger) {
             toggleDropdown(trigger, true);
        }

        // If the clicked item has a link, navigate immediately.
        // Otherwise, open the submenu.
        if (trigger.tagName === 'A' && trigger.href && currentlyOpen) {
            window.location.href = trigger.href;
        }
      });

      // For mobile, if it's a link, click should navigate after toggling (or not, if no submenu)
      if (trigger.tagName === 'A' && trigger.href && !dropdown.querySelector('ul, .header-dropdown-wrapper')) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

    } else { // Desktop
      dropdown.addEventListener(eventType, () => {
        if (!dropdown.closest('.header-nav').classList.contains('is-open')) {
          closeAllDropdowns(dropdown.closest('.header-nav'));
        }
        toggleDropdown(trigger);
      });
      dropdown.addEventListener(leaveEventType, () => {
        toggleDropdown(trigger, true);
      });

      // Close other L0s when a new one is hovered
      if (level === 0) {
        dropdown.addEventListener('mouseenter', () => {
          const parentNav = dropdown.closest('.header-nav');
          if (parentNav) {
            parentNav.querySelectorAll(':scope > ul > li > a[aria-expanded="true"]').forEach(otherL0 => {
              if (otherL0 !== trigger) {
                toggleDropdown(otherL0, true);
              }
            });
          }
        });
      }
    }

    // Propagate aria-expanded to the actual content element for CSS targeting
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
          const isContentOpen = trigger.getAttribute('aria-expanded') === 'true';
          if (isContentOpen) {
            content.classList.add('is-open');
          } else {
            content.classList.remove('is-open');
          }
        }
      });
    });
    observer.observe(trigger, { attributes: true });

    // Recurse for nested dropdowns
    const nestedDropdowns = content.querySelectorAll('li.has-dropdown');
    if (nestedDropdowns.length) {
      setupDropdowns(Array.from(nestedDropdowns), isMobile, level + 1);
    }
  });
}

export default async function decorate(block) {
  block.textContent = ''; // Clear existing content to ensure idempotency

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return; // No nav fragment, nothing to do
  }

  const header = document.createElement('header');
  header.classList.add('header');
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');
  header.append(headerWrapper);

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');
  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  let mainNavFound = false;

  // Iterate through navContent sections to classify
  Array.from(navContent.children).forEach((section) => {
    // Clean AEM section classes
    section.className = '';

    // Logo / Brand
    const logoLink = section.querySelector('a img');
    if (logoLink && logoLink.src.includes('logo')) {
      const link = logoLink.closest('a');
      if (link) {
        headerBrand.append(link);
        return;
      }
    }

    // Main Navigation
    const ulElement = section.querySelector('ul');
    if (ulElement) {
      // This section contains a primary navigation UL
      headerNav.append(ulElement);
      mainNavFound = true;
      // Remove any unwanted wrappers like <p>
      ulElement.querySelectorAll('p').forEach(p => {
        if (p.children.length === 1 && (p.firstElementChild.tagName === 'A' || p.firstElementChild.tagName === 'BUTTON')) {
          p.replaceWith(p.firstElementChild);
        }
      });
      // Check for nested complex content (mega menu) and wrap it
      Array.from(ulElement.children).forEach(li => {
        const directLink = li.querySelector(':scope > a');
        const nestedUl = li.querySelector(':scope > ul');
        const nestedDiv = li.querySelector(':scope > div'); // Could be a complex div for mega menu

        if (directLink && (nestedUl || nestedDiv)) {
          li.classList.add('has-dropdown');
          directLink.setAttribute('aria-expanded', 'false');
          directLink.setAttribute('role', 'button');
          directLink.setAttribute('tabindex', '0');

          const dropdownContent = nestedUl || nestedDiv;
          if (dropdownContent) {
            dropdownContent.classList.add('header-dropdown-wrapper');
            // Move children of directLink if any exist within li after link
            let currentElement = directLink.nextElementSibling;
            const tempDiv = document.createElement('div');
            tempDiv.classList.add('header-sub-menu-content');
            while (currentElement) {
                const nextElement = currentElement.nextElementSibling;
                if (!dropdownContent.contains(currentElement)) {
                    tempDiv.append(currentElement);
                }
                currentElement = nextElement;
            }
            if (tempDiv.children.length > 0) {
                dropdownContent.prepend(tempDiv);
            }
          }
        }
      });
      return; // Handled as nav, skip further classification for this section
    }

    // Tools (if not already classified as nav or brand)
    // Look for specific tool classes or elements if they were preserved in the fragment
    const searchIcon = section.querySelector('svg[xlink:href*="#search"], img[src*="search"]');
    const bellIcon = section.querySelector('svg[xlink:href*="#bell"], img[src*="bell"]');
    const userIcon = section.querySelector('svg[xlink:href*="#user"], img[src*="user"]');
    const loginText = section.textContent.toLowerCase().includes('login');

    if ((searchIcon || bellIcon || userIcon || loginText) && !mainNavFound) {
      // Try to move all relevant content from this section to headerTools
      // Prefer content within a.header__login, button.header__hamburger--button, etc.
      const toolElements = section.querySelectorAll('a[class*="header__login"], button[class*="header__hamburger"], div[class*="header__search"], div[class*="header__notification"]');
      if (toolElements.length > 0) {
        toolElements.forEach(tool => headerTools.append(tool));
        return; // Handled as tools
      } else if (!section.textContent.trim().length === 0) {
        // Fallback: if section contains text/icons that look like tools, add its children
        Array.from(section.children).forEach(child => headerTools.append(child));
      }
    }
  });

  // Append parts to the headerWrapper
  if (headerBrand.children.length > 0) {
    headerWrapper.append(headerBrand);
  }
  if (headerNav.children.length > 0) {
    headerWrapper.append(headerNav);
  }
  if (headerTools.children.length > 0) {
    headerWrapper.append(headerTools);
  }

  block.append(header);

  // Mobile Hamburger Toggle
  const hamburgerButton = header.querySelector('.header__hamburger--button');
  const mobileMenu = header.querySelector('.header__hamburger--menu');
  const mobileOverlay = header.querySelector('.header__overlay');

  if (hamburgerButton && mobileMenu && mobileOverlay) {
    const closeButton = mobileMenu.querySelector('.header__hamburger--close-icon');
    const toggleMobileMenu = (forceClose = false) => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (forceClose || isOpen) {
        mobileMenu.classList.remove('is-open');
        mobileOverlay.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        hamburgerButton.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('is-open');
        mobileOverlay.classList.add('is-open');
        document.body.classList.add('no-scroll');
        hamburgerButton.setAttribute('aria-expanded', 'true');
      }
    };

    hamburgerButton.addEventListener('click', toggleMobileMenu);
    closeButton?.addEventListener('click', () => toggleMobileMenu(true));
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(true));

    // Close on escape key
    block.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        toggleMobileMenu(true);
      }
    });
  }

  // Setup dropdowns for desktop (non-mobile)
  const isDesktop = window.matchMedia('(min-width: 900px)').matches;
  const topLevelDropdowns = headerNav.querySelectorAll(':scope > ul > li.has-dropdown');
  if (topLevelDropdowns.length) {
    setupDropdowns(Array.from(topLevelDropdowns), !isDesktop, 0);
  }

  // Adjust dropdown behavior on resize
  let currentIsMobile = !isDesktop;
  window.addEventListener('resize', () => {
    const newIsMobile = !window.matchMedia('(min-width: 900px)').matches;
    if (newIsMobile !== currentIsMobile) {
      currentIsMobile = newIsMobile;
      // Re-setup dropdowns based on new mobile state
      const allDropdownTriggers = header.querySelectorAll('[aria-expanded]');
      closeAllDropdowns(header);
      allDropdownTriggers.forEach(trigger => {
        trigger.removeAttribute('aria-expanded');
        trigger.classList.remove('is-open');
      });

      const updatedTopLevelDropdowns = headerNav.querySelectorAll(':scope > ul > li.has-dropdown');
      if (updatedTopLevelDropdowns.length) {
        setupDropdowns(Array.from(updatedTopLevelDropdowns), currentIsMobile, 0);
      }
    }
  });

  // Move instrumentation data
  moveInstrumentation(navContent, block);
}