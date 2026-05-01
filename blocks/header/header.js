import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 768px)');

let navInstance = null; // Refers to the <nav> element
let navSectionsContainer = null; // Refers to the .nav-list element

/**
 * Moves data-cq-path attribute from source to target element.
 * @param {Element} sourceEl The source element.
 * @param {Element} targetEl The target element.
 */
function moveInstrumentation(sourceEl, targetEl) {
  if (sourceEl && targetEl) {
    const cqPath = sourceEl.getAttribute('data-cq-path');
    if (cqPath) {
      targetEl.setAttribute('data-cq-path', cqPath);
    }
  }
}

/**
 * Closes all expanded navigation sections within the given container.
 * @param {Element} container The container element (e.g., .nav-list) holding the nav items.
 * @param {boolean} expandedState The desired aria-expanded state ('true' or 'false').
 */
function closeAllNavSections(container, expandedState = 'false') {
  if (!container) return;
  container.querySelectorAll('.navitems.has-submenu').forEach((navItem) => {
    navItem.setAttribute('aria-expanded', expandedState);
    navItem.classList.remove('active');
  });
}

/**
 * Toggles the main navigation menu's expanded state.
 * @param {Element} nav The <nav> element.
 * @param {Element} navList The .nav-list element.
 * @param {boolean} forceExpanded If provided, forces the menu to this expanded state.
 */
function toggleMenu(nav, navList, forceExpanded = null) {
  if (!nav || !navList) return;

  const isCurrentlyExpanded = nav.getAttribute('aria-expanded') === 'true';
  const shouldExpand = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded;

  const hamburgerButton = nav.querySelector('.navbar-toggler');
  if (!hamburgerButton) return;

  document.body.style.overflowY = (shouldExpand || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');

  if (shouldExpand) {
    navList.classList.add('nav-show');
  } else {
    navList.classList.remove('nav-show');
  }

  hamburgerButton.setAttribute('aria-label', shouldExpand ? 'Close navigation' : 'Open navigation');
  closeAllNavSections(navList, 'false'); // Ensure all submenus are closed when main menu toggles
}

/**
 * Parses a UL element and its children recursively, creating a structured menu array.
 * @param {Element} ulElement The UL element to parse.
 * @returns {Array} An array of parsed menu items.
 */
function parseList(ulElement) {
  const items = [];
  if (!ulElement) return items;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const item = {};
      const anchor = li.querySelector(':scope > a');
      const strong = li.querySelector(':scope > strong');
      const nestedUl = li.querySelector(':scope > ul');

      if (anchor) {
        item.title = anchor.textContent.trim();
        item.href = anchor.href;
      } else if (strong) {
        item.title = strong.textContent.trim();
        item.href = '#'; // Treat strong as a category trigger
      } else {
        // Extract direct text nodes for items without <a> or <strong>
        const textNodes = Array.from(li.childNodes).filter(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
        );
        if (textNodes.length > 0) {
          item.title = textNodes[0].textContent.trim();
          item.href = '#';
        } else {
          item.title = ''; // Fallback
          item.href = '#';
        }
      }

      item.children = nestedUl ? parseList(nestedUl) : [];
      items.push(item);
    }
  });
  return items;
}

/**
 * Creates a navigation item (li) with its link and potential submenu.
 * @param {object} itemData The data for the menu item (title, href, children).
 * @param {Element} navListContainer The container for the nav items to attach event listeners.
 * @returns {Element} The created LI element.
 */
function createNavItem(itemData, navListContainer) {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.href = itemData.href;
  link.textContent = itemData.title;
  link.classList.add('navitems');
  li.append(link);

  if (itemData.children && itemData.children.length > 0) {
    li.classList.add('has-submenu');
    li.setAttribute('aria-expanded', 'false');

    const subMenuDiv = document.createElement('div');
    subMenuDiv.classList.add('submenu');
    const subUl = document.createElement('ul');
    itemData.children.forEach((childData) => {
      const subLi = document.createElement('li');
      const subLink = document.createElement('a');
      subLink.href = childData.href;
      subLink.textContent = childData.title;
      subLi.append(subLink);
      subUl.append(subLi);
    });
    subMenuDiv.append(subUl);
    li.append(subMenuDiv);

    // Add click listener for submenus on mobile/tablet
    li.addEventListener('click', (e) => {
      if (!isDesktop.matches) {
        e.preventDefault(); // Prevent default link behavior for parent item
        const expanded = li.getAttribute('aria-expanded') === 'true';
        closeAllNavSections(navListContainer); // Close all other submenus
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) {
          li.classList.remove('active');
        } else {
          li.classList.add('active');
        }
      }
    });

    // Add desktop hover behavior
    if (isDesktop.matches) {
      li.addEventListener('mouseenter', () => {
        closeAllNavSections(navListContainer); // Close others
        li.classList.add('active');
        li.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        li.classList.remove('active');
        li.setAttribute('aria-expanded', 'false');
      });
    }
  }
  return li;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const header = document.createElement('header');
  // Preserve original block classes on the new header element
  header.classList.add(...block.classList);
  block.replaceChildren(header); // Replace the original block div with the new header

  const nav = document.createElement('nav');
  nav.id = 'nav';
  navInstance = nav; // Assign to global variable

  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  const sections = fragment.querySelectorAll(':scope > .section');

  // Section 1: Brand
  const brandSection = sections[0];
  if (brandSection) {
    const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
    const brandDiv = document.createElement('div');
    moveInstrumentation(brandSection, brandDiv);

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');
    moveInstrumentation(brandRoot.firstElementChild, logoLink); // Assuming first child of root is logo p

    const picture = brandRoot.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const logoImg = document.createElement('img');
        logoImg.src = img.src;
        logoImg.alt = img.alt;
        logoLink.append(logoImg);
      }
    }

    const h4 = document.createElement('h4');
    const pWithLogo = brandRoot.querySelector('p');
    if (pWithLogo) {
      const textNodes = Array.from(pWithLogo.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
      );
      if (textNodes.length > 0) {
        h4.textContent = textNodes[0].textContent.trim();
      } else {
        h4.textContent = 'TechAtom'; // Fallback if no direct text
      }
    } else {
      h4.textContent = 'TechAtom'; // Fallback if no p element
    }

    if (logoLink.children.length > 0 || h4.textContent) { // Only append if logo has content
      logoLink.append(h4);
      brandDiv.append(logoLink);
      container.append(brandDiv);
    }
  }

  // Section 2: Navigation
  const navSection = sections[1];
  if (navSection) {
    const navRoot = navSection.querySelector(':scope > .default-content-wrapper') || navSection;
    const navListDiv = document.createElement('div');
    navListDiv.classList.add('nav-list');
    navSectionsContainer = navListDiv; // Assign to global variable for submenu management
    moveInstrumentation(navSection, navListDiv);

    const mainUl = document.createElement('ul');

    // Iterate through the children of navRoot to find P elements and UL elements
    Array.from(navRoot.children).forEach((child) => {
      if (child.tagName === 'P') {
        const link = child.querySelector(':scope > a');
        const strong = child.querySelector(':scope > strong');
        const nextSibling = child.nextElementSibling;

        let itemData = {};
        if (link) {
          itemData = { title: link.textContent.trim(), href: link.href };
        } else if (strong) {
          itemData = { title: strong.textContent.trim(), href: '#' };
        } else {
          itemData = { title: child.textContent.trim(), href: '#' };
        }

        if (nextSibling && nextSibling.tagName === 'UL') {
          itemData.children = parseList(nextSibling);
          // Skip the UL as it's processed here
          // This assumes a P followed immediately by a UL is a parent-submenu pair
          // The outer loop will naturally advance past the UL
        }
        mainUl.append(createNavItem(itemData, navListDiv));
      } else if (child.tagName === 'UL') {
        // If a UL appears without a preceding P, treat its LIs as top-level items
        // This handles cases where the fragment might directly start with a UL for nav
        parseList(child).forEach((itemData) => {
          mainUl.append(createNavItem(itemData, navListDiv));
        });
      }
    });

    navListDiv.append(mainUl);
    container.append(navListDiv);
  }

  // Hamburger button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('navbar-toggler');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5 .5 0 0 1 .5 -.5h10a.5 .5 0 0 1 0 1H3a.5 .5 0 0 1 -.5 -.5zm0 -4a.5 .5 0 0 1 .5 -.5h10a.5 .5 0 0 1 0 1H3a.5 .5 0 0 1 -.5 -.5zm0 -4a.5 .5 0 0 1 .5 -.5h10a.5 .5 0 0 1 0 1H3a.5 .5 0 0 1 -.5 -.5z"></path>
    </svg>
  `;
  hamburgerButton.addEventListener('click', () => toggleMenu(navInstance, navSectionsContainer));
  container.append(hamburgerButton);

  nav.append(container);
  header.append(nav);

  // Set initial aria-expanded state for nav
  nav.setAttribute('aria-expanded', 'false');

  // Close menu on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(navInstance, navSectionsContainer, false);
    }
  });

  // prevent mobile nav behavior on window resize
  // Initial call to set correct state based on desktop/mobile
  toggleMenu(navInstance, navSectionsContainer, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(navInstance, navSectionsContainer, isDesktop.matches));
}

