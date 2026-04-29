import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)'); // Adjusted breakpoint based on CSS

/**
 * Moves instrumentation attributes from an old element to a new one.
 * @param {Element} oldElement The element to move attributes from.
 * @param {Element} newElement The element to move attributes to.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;

  [...oldElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-cmp-') || attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Parses the fragment into brand, nav, and tools rows.
 * @param {Element} fragment The loaded fragment element.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Rule 2.1: Content Density Discovery (Agnostic)
  children.forEach((row) => {
    const wrapper = row.querySelector('.default-content-wrapper') || row;
    if (wrapper.querySelector('picture, img')) {
      if (!brandRow) brandRow = wrapper; // First picture/img is brand
    } else if (wrapper.querySelectorAll('ul').length > (navRow ? navRow.querySelectorAll('ul').length : 0)) {
      navRow = wrapper; // Highest UL density is nav
    }
  });

  // The remaining section(s) are tools
  const remainingRows = children.filter((row) => {
    const wrapper = row.querySelector('.default-content-wrapper') || row;
    return wrapper !== brandRow && wrapper !== navRow;
  });

  if (remainingRows.length > 0) {
    toolsRow = document.createElement('div');
    remainingRows.forEach((row) => {
      const wrapper = row.querySelector('.default-content-wrapper') || row;
      while (wrapper.firstElementChild) {
        toolsRow.append(wrapper.firstElementChild);
      }
    });
  }

  return { brandRow, navRow, toolsRow };
}

/**
 * Recursively processes a UL element to build the navigation structure.
 * @param {HTMLUListElement} ulElement The UL element to process.
 * @param {number} level The current nesting level (0 for top-level).
 * @param {Element} parentElement The parent element to append new items to.
 * @param {Array<Element>} buffer A buffer to collect non-navigation content.
 */
function processNavList(ulElement, level, parentElement, buffer) {
  if (!ulElement || !parentElement) return null;

  const newUl = document.createElement('ul');
  newUl.classList.add('cmp-navigation__group');

  if (level === 0) {
    newUl.classList.add('cmp-header__nav-group');
  } else if (level === 1) {
    newUl.classList.add('cmp-header__product-items');
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('cmp-header__category-menu');
    newUl.append(categoryMenu);
    // Flush buffer into the category menu if it exists
    if (buffer.length > 0) {
      buffer.forEach((item) => categoryMenu.prepend(item));
      buffer.length = 0; // Clear the buffer
    }
  } else {
    newUl.classList.add('cmp-header__submenu');
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('cmp-header__category-menu');
    newUl.append(categoryMenu);
  }

  Array.from(ulElement.children).forEach((liElement) => {
    if (liElement.nodeType !== Node.ELEMENT_NODE) return;

    const newLi = document.createElement('li');
    newLi.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);
    if (level === 0) {
      newLi.classList.add('cmp-header__nav-products');
    }

    let hasSubmenu = false;
    let linkElement = null;
    let contentBuffer = []; // Buffer for content before a nested UL

    Array.from(liElement.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'A') {
          linkElement = node.cloneNode(true);
          linkElement.classList.add('cmp-navigation__item-link');
          moveInstrumentation(node, linkElement);
        } else if (node.tagName === 'UL') {
          hasSubmenu = true;
          // Process nested UL
          const submenuContainer = (level === 0 || level === 1) ? newLi : newLi.querySelector('.cmp-header__category-menu') || newLi;
          processNavList(node, level + 1, submenuContainer, []); // Pass an empty buffer for nested menus
        } else {
          contentBuffer.push(node.cloneNode(true));
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const textNode = document.createElement('span'); // Wrap text in span for consistent styling
        textNode.textContent = node.textContent.trim();
        contentBuffer.push(textNode);
      }
    });

    if (linkElement) {
      newLi.append(linkElement);
      if (hasSubmenu) {
        linkElement.classList.add('cmp-header__nav-products-click'); // Indicate it's a clickable parent
        linkElement.setAttribute('aria-expanded', 'false');
        linkElement.setAttribute('role', 'button'); // For accessibility
      } else {
        newLi.classList.add('cmp-header__no-items');
      }
    } else if (contentBuffer.length > 0) {
      // If there's no direct link but text content, create a span as a trigger
      const triggerSpan = document.createElement('span');
      triggerSpan.classList.add('cmp-navigation__item-link');
      triggerSpan.setAttribute('role', 'button');
      triggerSpan.setAttribute('aria-expanded', 'false');
      contentBuffer.forEach(node => triggerSpan.append(node));
      newLi.append(triggerSpan);
      if (hasSubmenu) {
        triggerSpan.classList.add('cmp-header__nav-products-click');
      } else {
        newLi.classList.add('cmp-header__no-items');
      }
    }

    // Append any buffered content to the newLi if it's not a submenu
    if (!hasSubmenu && contentBuffer.length > 0) {
      contentBuffer.forEach(node => {
        if (!linkElement || !linkElement.contains(node)) { // Avoid duplicating content already in link
          newLi.append(node);
        }
      });
    }

    // Add mobile icons based on text content (Rule 5.9: Direct Text Extraction)
    const itemText = (linkElement || newLi).textContent.toLowerCase();
    if (itemText.includes('recipes')) {
      newLi.classList.add('mobile-icon-recipes');
    } else if (itemText.includes('media')) {
      newLi.classList.add('mobile-icon-media');
    } else if (itemText.includes('about us')) {
      newLi.classList.add('mobile-icon-about-us');
    }

    const targetContainer = newUl.querySelector('.cmp-header__category-menu');
    if (targetContainer) {
      targetContainer.append(newLi);
    } else {
      newUl.append(newLi);
    }
  });

  parentElement.append(newUl);
  return newUl;
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {Element} navElement The main nav element to append to.
 */
function setupDesktopNav(navRow, navElement) {
  if (!navRow || !navElement) return;

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  navElement.append(navLinksDiv);

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  navLinksDiv.append(navigation);

  const navTag = document.createElement('nav');
  navTag.id = 'navigation-fff59bc8e9'; // Replicate ID from original
  navTag.classList.add('cmp-navigation');
  navTag.setAttribute('itemscope', '');
  navTag.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navTag.setAttribute('role', 'navigation');
  navigation.append(navTag);

  const mainUl = document.createElement('ul');
  mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  navTag.append(mainUl);

  let currentTrigger = null;
  let buffer = [];

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a top-level navigation item trigger
      const originalLink = child.querySelector('a');
      const newLi = document.createElement('li');
      newLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

      const newLink = document.createElement('a');
      newLink.href = originalLink.href;
      newLink.textContent = originalLink.textContent;
      newLink.classList.add('cmp-navigation__item-link');
      moveInstrumentation(originalLink, newLink);
      newLi.append(newLink);

      mainUl.append(newLi);
      currentTrigger = newLi; // Set the current trigger to this new li
      buffer = []; // Clear buffer for next section
    } else if (child.tagName === 'UL' && currentTrigger) {
      // This UL is a submenu for the currentTrigger
      currentTrigger.classList.add('cmp-header__nav-products-click');
      const subMenu = processNavList(child, 1, currentTrigger, buffer);
      currentTrigger.append(subMenu);
      currentTrigger.querySelector('.cmp-navigation__item-link').setAttribute('aria-expanded', 'false');
    } else {
      // Collect other content into the buffer
      buffer.push(child.cloneNode(true));
    }
  });
}

/**
 * Sets up the tools section.
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {Element} navElement The main nav element to append to.
 */
function setupTools(toolsRow, navElement) {
  if (!toolsRow || !navElement) return;

  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  navElement.append(navIconsDiv);

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  mobileList.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  mobileList.append(socialMediaDiv);

  Array.from(toolsRow.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (!link) return;

        const linkText = link.textContent.toLowerCase();
        if (linkText.includes('instagram') || linkText.includes('facebook') || linkText.includes('twitter') || linkText.includes('youtube')) {
          const socialLink = document.createElement('a');
          socialLink.href = link.href;
          socialLink.target = '_blank';
          socialLink.setAttribute('data-social', linkText.split(' ')[0]);
          socialLink.classList.add(`icon-${linkText.split(' ')[0].replace('facebok', 'facebook')}`); // Correct typo
          moveInstrumentation(link, socialLink);
          socialMediaDiv.append(socialLink);
        } else if (linkText.includes('accessibility')) {
          const accessibilityDiv = document.createElement('div');
          accessibilityDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-accessibility"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          accessibilityDiv.append(iconImg);
          navIconsDiv.append(accessibilityDiv);
        } else if (linkText.includes('search')) {
          const searchDiv = document.createElement('div');
          searchDiv.classList.add('cmp-header__search');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-search"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          searchDiv.append(iconImg);
          navIconsDiv.append(searchDiv);
        } else if (linkText.includes('login')) {
          const loginDiv = document.createElement('div');
          loginDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-profile"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          loginDiv.append(iconImg);
          navIconsDiv.append(loginDiv);
        } else {
          const policyLi = document.createElement('li');
          policyLi.classList.add('cmp-header__policy-list');
          const policyLink = document.createElement('a');
          policyLink.href = link.href;
          policyLink.textContent = link.textContent;
          moveInstrumentation(link, policyLink);
          policyLi.append(policyLink);
          policyUl.append(policyLi);
        }
      });
    } else {
      // Handle direct links or other content in toolsRow
      const link = child.querySelector('a');
      if (link) {
        const linkText = link.textContent.toLowerCase();
        if (linkText.includes('accessibility')) {
          const accessibilityDiv = document.createElement('div');
          accessibilityDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-accessibility"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          accessibilityDiv.append(iconImg);
          navIconsDiv.append(accessibilityDiv);
        } else if (linkText.includes('search')) {
          const searchDiv = document.createElement('div');
          searchDiv.classList.add('cmp-header__search');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-search"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          searchDiv.append(iconImg);
          navIconsDiv.append(searchDiv);
        } else if (linkText.includes('login')) {
          const loginDiv = document.createElement('div');
          loginDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
          const iconImg = document.createElement('a');
          iconImg.href = link.href;
          iconImg.classList.add('cmp-header__icon-img');
          iconImg.innerHTML = `<div class="icon-profile"></div><div class="cmp-header__icon-text">${link.textContent}</div>`;
          moveInstrumentation(link, iconImg);
          loginDiv.append(iconImg);
          navIconsDiv.append(loginDiv);
        }
      }
    }
  });

  // Append mobile list to the navigation section, not directly to navElement
  const navLinks = navElement.querySelector('.cmp-header__nav-links .cmp-navigation');
  if (navLinks) {
    navLinks.append(mobileList);
  }
}

/**
 * Toggles a navigation section for mobile.
 * @param {Element} sectionLi The LI element representing the section to toggle.
 */
function toggleNavSection(sectionLi) {
  if (!sectionLi) return;

  const link = sectionLi.querySelector('.cmp-navigation__item-link');
  if (!link || link.classList.contains('cmp-header__no-items')) return;

  const isExpanded = link.getAttribute('aria-expanded') === 'true';
  link.setAttribute('aria-expanded', !isExpanded);

  const subMenu = sectionLi.querySelector('.cmp-header__product-items, .cmp-header__submenu');
  if (subMenu) {
    // Toggle display for mobile, using 'flex' as per original CSS for submenus
    subMenu.style.display = isExpanded ? 'none' : 'flex';
  }
}

/**
 * Toggles the entire mobile menu.
 * @param {Element} nav The main nav element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const hamburger = nav.querySelector('.cmp-header__hamburger');
  if (!hamburger) return;

  const navLinks = nav.querySelector('.cmp-header__nav-links .cmp-navigation');
  if (!navLinks) return;

  const expanded = forceExpanded !== null ? forceExpanded : hamburger.checked;

  hamburger.checked = expanded;
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  document.body.style.overflowY = expanded ? 'hidden' : '';

  // Close all submenus when main menu is closed
  if (!expanded) {
    navLinks.querySelectorAll('[aria-expanded="true"]').forEach((item) => {
      item.setAttribute('aria-expanded', 'false');
      const subMenu = item.closest('li').querySelector('.cmp-header__product-items, .cmp-header__submenu');
      if (subMenu) subMenu.style.display = 'none';
    });
  }
}

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('cmp-header');
  moveInstrumentation(fragment, headerContainer); // Move instrumentation from fragment root

  // Add all original header classes to the block element
  block.classList.add('cmp-experiencefragment', 'cmp-experiencefragment--header');

  const fragmentContent = document.createElement('div');
  while (fragment.firstElementChild) {
    fragmentContent.append(fragment.firstElementChild);
  }

  const { brandRow, navRow, toolsRow } = parseStructure(fragmentContent);

  // Hamburger checkbox for mobile
  const hamburgerInput = document.createElement('input');
  hamburgerInput.type = 'checkbox';
  hamburgerInput.classList.add('cmp-header__hamburger');
  headerContainer.append(hamburgerInput);

  // Setup Brand Row
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
    moveInstrumentation(brandRow, logoDiv); // Move instrumentation from brandRow

    const picture = brandRow.querySelector('picture');
    const img = brandRow.querySelector('img');
    const link = brandRow.querySelector('a');

    if (link && (picture || img)) {
      const newLink = document.createElement('a');
      newLink.classList.add('cmp-image__link');
      newLink.href = link.href;
      moveInstrumentation(link, newLink);

      if (picture) {
        newLink.append(picture.cloneNode(true));
      } else if (img) {
        newLink.append(img.cloneNode(true));
      }
      logoDiv.append(newLink);
    } else if (picture) {
      logoDiv.append(picture.cloneNode(true));
    } else if (img) {
      logoDiv.append(img.cloneNode(true));
    }
    headerContainer.append(logoDiv);
  }

  // Setup Navigation
  if (navRow) {
    setupDesktopNav(navRow, headerContainer);
  }

  // Setup Tools/Icons
  if (toolsRow) {
    setupTools(toolsRow, headerContainer);
  }

  block.append(headerContainer);

  // Add event listeners for mobile navigation
  const navLinksContainer = headerContainer.querySelector('.cmp-header__nav-links .cmp-navigation');
  if (navLinksContainer) {
    navLinksContainer.querySelectorAll('.cmp-navigation__item--level-0.cmp-header__nav-products-click > .cmp-navigation__item-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          toggleNavSection(link.closest('li'));
        }
      });
    });

    navLinksContainer.querySelectorAll('.cmp-navigation__item--level-1 > .cmp-navigation__item-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          toggleNavSection(link.closest('li'));
        }
      });
    });
  }

  // Hamburger click listener
  hamburgerInput.addEventListener('change', () => toggleMobileMenu(headerContainer, hamburgerInput.checked));

  // Close mobile menu on desktop resize
  isDesktop.addEventListener('change', () => {
    toggleMobileMenu(headerContainer, false); // Close mobile menu when switching to desktop
    document.body.style.overflowY = ''; // Ensure scroll is re-enabled
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !isDesktop.matches && hamburgerInput.checked) {
      toggleMobileMenu(headerContainer, false);
    }
  });

  // Behavioral Justification:
  // The CSS provided uses classes like `.cmp-header__nav-products:hover .cmp-header__product-items { display: flex }`
  // and `.cmp-header__nav-links .cmp-navigation__group .cmp-header__product-items .cmp-navigation__item--level-1:hover .cmp-header__submenu { display: flex }`
  // for desktop navigation, indicating a CSS-driven hover model.
  // For mobile, the CSS uses `cmp-header__hamburger:checked~.cmp-header__nav-links .cmp-navigation { display:flex }`
  // and also explicitly sets `display: none` for submenus on mobile, which implies a JS-driven click/toggle model for submenus on mobile.
  // Therefore, desktop navigation uses CSS hover, and mobile navigation uses JS click to toggle `aria-expanded` and `display` property.
}
