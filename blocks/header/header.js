import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on original HTML media queries

/**
 * Moves AEM instrumentation attributes from an old element to a new one.
 * @param {Element} oldElement The original element from the fragment.
 * @param {Element} newElement The new element to transfer attributes to.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  Array.from(oldElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-cq-') || attr.name.startsWith('data-block-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Extracts immediate text content from an element, ignoring children's text.
 * @param {Element} element The element to extract text from.
 * @returns {string} The immediate text content.
 */
function getImmediateTextContent(element) {
  if (!element) return '';
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

/**
 * Toggles the mobile menu's expanded state.
 * @param {Element} nav The main navigation element.
 * @param {Element} navSections The container for navigation sections.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburgerButton = nav.querySelector('.header-comp__wrapper--hamburger');
  const menusWrapper = nav.querySelector('.header-comp__wrapper--menus');

  if (!hamburgerButton || !menusWrapper) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  hamburgerButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  hamburgerButton.classList.toggle('collapsed', !expanded);
  menusWrapper.classList.toggle('show', expanded);

  // Collapse all child menus when main menu is closed
  if (!expanded && !isDesktop.matches) {
    navSections.querySelectorAll('.header-comp__wrapper--menu-item.dropdown').forEach((item) => {
      item.classList.remove('expand-children');
      const subMenu = item.querySelector('.header-comp__sub-menus');
      if (subMenu) {
        subMenu.style.display = 'none';
      }
    });
  }
}

/**
 * Parses the fragment into its structural components.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The partitioned rows.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter((child) => child.nodeType === Node.ELEMENT_NODE);
  const brandRow = sections[0]?.querySelector('.default-content-wrapper') || sections[0];
  const navRow = sections[1]?.querySelector('.default-content-wrapper') || sections[1];
  const toolsRow = sections[2]?.querySelector('.default-content-wrapper') || sections[2];
  return { brandRow, navRow, toolsRow };
}

/**
 * Sets up the brand section of the header.
 * @param {Element} brandRow The brand row element from the fragment.
 * @param {Element} headerCompWrapper The main header wrapper.
 */
function setupBrand(brandRow, headerCompWrapper) {
  if (!brandRow || !headerCompWrapper) return;

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');
  moveInstrumentation(brandRow, logoWrapper);

  const brandLink = brandRow.querySelector('p:first-child a');
  if (brandLink) {
    brandLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
    brandLink.setAttribute('data-link-region', 'Header');
    moveInstrumentation(brandLink, brandLink); // Transfer instrumentation from the link itself

    const brandImg = brandLink.querySelector('picture img');
    if (brandImg) {
      brandImg.classList.add('header-comp__wrapper--image', 'h-100');
      brandImg.setAttribute('loading', 'eager');
      moveInstrumentation(brandLink.querySelector('picture'), brandImg);
    }
    logoWrapper.append(brandLink);
  } else {
    // If no link, just append the picture or first element in brandRow
    const firstChild = brandRow.firstElementChild;
    if (firstChild) {
      logoWrapper.append(firstChild);
    }
  }
  headerCompWrapper.append(logoWrapper);
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {Element} menusWrapper The wrapper for navigation menus.
 */
function setupDesktopNav(navRow, menusWrapper) {
  if (!navRow || !menusWrapper) return;

  const navGroups = document.createElement('ul');
  navGroups.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  moveInstrumentation(navRow, navGroups);

  let tempBuffer = [];
  let navItemCounter = 0;

  Array.from(navRow.children).forEach((child) => {
    // Skip AEM metadata comments
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a menu trigger
      const navItem = document.createElement('li');
      navItem.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0');
      navItem.setAttribute('data-header-item-id', `leftHeaderItem${navItemCounter}`);
      moveInstrumentation(child, navItem);

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      menuLinkDiv.setAttribute('aria-current', 'page');

      const link = child.querySelector('a');
      const linkSpan = document.createElement('span');
      linkSpan.classList.add('link-span');
      linkSpan.textContent = getImmediateTextContent(link);
      link.textContent = '';
      link.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      link.setAttribute('data-link-region', 'Header');
      link.append(linkSpan);
      menuLinkDiv.append(link);

      // Append buffered content to the left-div if it's the first nav item
      if (tempBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        const title = getImmediateTextContent(link).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add('left-div', `${title}-left-div`);
        tempBuffer.forEach((bufferedEl) => leftDiv.append(bufferedEl));
        navItem.prepend(leftDiv);
        tempBuffer = []; // Clear buffer
      }

      navItem.append(menuLinkDiv);
      navGroups.append(navItem);

      // Check for next sibling as submenu
      let nextSibling = child.nextElementSibling;
      while (nextSibling && nextSibling.nodeType !== Node.ELEMENT_NODE) {
        nextSibling = nextSibling.nextElementSibling;
      }

      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        navItem.classList.add('dropdown', 'flex-column', 'border-lg-0', 'show-nav');
        menuLinkDiv.classList.add('dropdown-toggle');
        // aria-expanded is managed by JS for mobile, not set statically here
        // menuLinkDiv.setAttribute('aria-expanded', 'false');

        const subMenusDiv = document.createElement('div');
        subMenusDiv.id = `leftHeaderItem${navItemCounter}`;
        subMenusDiv.setAttribute('data-id', `leftHeaderItem${navItemCounter}`);
        subMenusDiv.classList.add('header-comp__sub-menus');
        moveInstrumentation(nextSibling, subMenusDiv);

        // Recursively build submenu
        const subMenuUl = document.createElement('ul');
        subMenuUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const triParentDiv = document.createElement('div');
        triParentDiv.classList.add('header-comp__sub-menu', 'tri-parent');
        subMenuUl.append(triParentDiv);
        processSubMenu(nextSibling, triParentDiv, navItemCounter);
        subMenusDiv.append(subMenuUl);
        navItem.append(subMenusDiv);

        // Add arrow icon for dropdown
        const arrowIconSpan = document.createElement('span');
        arrowIconSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        arrowIconSpan.innerHTML = `<svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
                                     <use xlink:href="/etc.clientlibs/sunrise/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#accordion-arrow-down"></use>
                                   </svg>`;
        menuLinkDiv.append(arrowIconSpan);

        // Mobile toggle for sub-menus
        menuLinkDiv.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            const isExpanded = navItem.classList.toggle('expand-children');
            menuLinkDiv.setAttribute('aria-expanded', isExpanded);
            const targetSubMenu = navItem.querySelector('.header-comp__sub-menus');
            if (targetSubMenu) {
              targetSubMenu.style.display = isExpanded ? 'block' : 'none';
            }
          }
        });

      } else {
        navItem.classList.add('right-division'); // Non-dropdown items default to right-division
      }
      navItemCounter += 1;
    } else {
      // Collect non-nav items into a buffer
      tempBuffer.push(child.cloneNode(true));
    }
  });
  menusWrapper.append(navGroups);
}

/**
 * Recursively processes sub-menus.
 * @param {Element} parentElement The parent UL or DIV containing sub-menu items.
 * @param {Element} targetElement The element to append processed sub-menu items to.
 * @param {number} parentItemCounter The counter of the parent nav item.
 */
function processSubMenu(parentElement, targetElement, parentItemCounter) {
  if (!parentElement || !targetElement) return;

  Array.from(parentElement.children).forEach((child, index) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    if (child.tagName === 'LI') {
      const subMenuItem = document.createElement('li');
      subMenuItem.classList.add('header-comp__wrapper--sub-menu-item');
      subMenuItem.setAttribute('data-child-id', `subNavItem${index}`);
      moveInstrumentation(child, subMenuItem);

      const subMenuLinkDiv = document.createElement('div');
      subMenuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0');
      subMenuLinkDiv.setAttribute('aria-current', 'page');

      const linkWrapperDiv = document.createElement('div');
      linkWrapperDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

      const link = child.querySelector('a');
      if (link) {
        const linkSpan = document.createElement('span');
        linkSpan.classList.add('sub-link-span');
        linkSpan.textContent = getImmediateTextContent(link);
        link.textContent = ''; // Clear original text
        link.classList.add('text-decoration-none', 'text-dark-gray-100');
        link.append(linkSpan);
        linkWrapperDiv.append(link);
        moveInstrumentation(child.querySelector('a'), link);
      } else {
        // If LI has no direct link, but has text, create a span for it.
        const textSpan = document.createElement('span');
        textSpan.classList.add('sub-link-span', 'text-dark-gray-100');
        textSpan.textContent = getImmediateTextContent(child);
        linkWrapperDiv.append(textSpan);
      }

      subMenuLinkDiv.append(linkWrapperDiv);
      subMenuItem.append(subMenuLinkDiv);

      const nestedUl = child.querySelector('ul');
      if (nestedUl) {
        subMenuItem.classList.add('child-below');
        subMenuLinkDiv.classList.add('dropdown-toggle');
        // aria-expanded is managed by JS for mobile, not set statically here
        // subMenuLinkDiv.setAttribute('aria-expanded', 'false');

        // Add right arrow icon for desktop
        const arrowIconRightSpan = document.createElement('span');
        arrowIconRightSpan.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
        arrowIconRightSpan.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                          <use xlink:href="/etc.clientlibs/svasti/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow_right"></use>
                                        </svg>`;
        linkWrapperDiv.append(arrowIconRightSpan);

        // Add down arrow icon for mobile
        const arrowIconDownSpan = document.createElement('span');
        arrowIconDownSpan.classList.add('arrow-icon', 'd-lg-none', 'end-0', 'd-lg-none');
        arrowIconDownSpan.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                         <use xlink:href="/etc.clientlibs/sunrise/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#accordion-arrow-down"></use>
                                       </svg>`;
        subMenuLinkDiv.append(arrowIconDownSpan);

        const innerChildsDiv = document.createElement('div');
        innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
        innerChildsDiv.id = `subNavItem${index}`;
        innerChildsDiv.setAttribute('data-id', `subNavItem${index}`);
        moveInstrumentation(nestedUl, innerChildsDiv);

        const innerSubMenuUl = document.createElement('ul');
        innerSubMenuUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const innerTriParentDiv = document.createElement('div');
        innerTriParentDiv.classList.add('header-comp__sub-menu', 'tri-parent');
        innerSubMenuUl.append(innerTriParentDiv);
        processSubMenu(nestedUl, innerTriParentDiv, parentItemCounter);
        innerChildsDiv.append(innerSubMenuUl);
        subMenuItem.append(innerChildsDiv);

        // Mobile toggle for nested sub-menus
        subMenuLinkDiv.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            const isExpanded = subMenuItem.classList.toggle('expand-children');
            subMenuLinkDiv.setAttribute('aria-expanded', isExpanded);
            const targetInnerSubMenu = subMenuItem.querySelector('.inner-childs');
            if (targetInnerSubMenu) {
              targetInnerSubMenu.style.display = isExpanded ? 'block' : 'none';
            }
          }
        });

      } else {
        subMenuItem.classList.add('no-child');
      }
      targetElement.append(subMenuItem);
    }
  });

  // Add the border section if it's the top-level submenu
  if (parentElement.closest('.header-comp__sub-menus')) {
    const borderSection = document.createElement('div');
    borderSection.classList.add('borderr-section', 'd-none', 'd-lg-flex', 'd-xl-flex', 'align-items-end', 'position-absolute', 'no-prod');
    borderSection.id = 'borderSec';
    borderSection.innerHTML = '<div class="border-bg"></div>';
    targetElement.closest('.header-comp__wrapper--sub-menu-group').append(borderSection);
  }
}

/**
 * Sets up the tools section of the header.
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {Element} headerCompWrapper The main header wrapper.
 */
function setupTools(toolsRow, headerCompWrapper) {
  if (!toolsRow || !headerCompWrapper) return;

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  moveInstrumentation(toolsRow, searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = "Search"; // Dynamic label from fragment if available, otherwise default
  
  searchIconDiv.innerHTML = `<svg class="icon search-red text-white">
                               <use xlink:href="/etc.clientlibs/svasti/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>
                             </svg>`;
  searchIconDiv.append(searchSpan);
  searchDiv.append(searchIconDiv);

  // Add search screen functionality
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('global-search', 'position-fixed', 'w-100', 'd-none');
  
  const searchInput = toolsRow.querySelector('.global-search__wrapper--form-input');
  const placeholderText = searchInput ? searchInput.getAttribute('placeholder') : 'Start typing...';
  const dataPath = searchInput ? searchInput.getAttribute('data-path') : '/content/svasti/in/en';
  const dataLimit = searchInput ? searchInput.getAttribute('data-limit') : '5';
  const dataError = searchInput ? searchInput.getAttribute('data-error') : '<p><b>Sorry, we cannot find what you are looking for :(</b></p><p>&nbsp;</p><p>Please try a new search term or browse through one of our product categories.</p>';

  globalSearchSection.innerHTML = `
    <div class="w-100 z-4 global-search__wrapper pb-md-5 pb-lg-6 pt-lg-0 pt-md-0 pt-2 pb-2">
      <div class="d-flex justify-content-center h-100">
        <div class="d-lg-block align-items-center d-flex">
          <div class="cross-wrap d-flex justify-content-center align-items-center">
            <svg class="global-search__wrapper--cross display-inline-block text-black text-white m-0">
              <use xlink:href="/etc.clientlibs/svasti/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#cross"></use>
            </svg>
          </div>
        </div>
        <div class="global-search__wrapper--form d-flex align-items-center justify-content-center">
          <input type="text" class="global-search__wrapper--form-input pb-1 pb-md-1 pb-lg-3 px-lg-4" placeholder="${placeholderText}" data-path="${dataPath}" data-limit="${dataLimit}" data-error="${dataError}">
        </div>
        <div class="d-lg-block align-items-center d-flex">
          <div class="search-wrap d-flex justify-content-center align-items-center">
            <svg class="global-search__wrapper--search display-inline-block text-white m-0">
              <use xlink:href="/etc.clientlibs/svasti/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center w-100 close-on-click">
      <div class="global-search__response d-flex justify-content-start z-4 bg-transparent">
        <ul class="global-search__response--results m-0 w-100 d-none pt-5 pb-5 px-9"></ul>
      </div>
    </div>
  `;
  headerCompWrapper.after(globalSearchSection); // Append search screen outside the header-comp

  searchIconDiv.addEventListener('click', () => {
    globalSearchSection.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden');
  });

  const closeSearchButton = globalSearchSection.querySelector('.global-search__wrapper--cross');
  if (closeSearchButton) {
    closeSearchButton.addEventListener('click', () => {
      globalSearchSection.classList.add('d-none');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Social media links
  const socialMediaUl = toolsRow.querySelector('ul:first-of-type');
  if (socialMediaUl) {
    socialMediaUl.classList.add('social-media-links'); // Add a class for styling if needed
    Array.from(socialMediaUl.children).forEach(li => {
      const socialLink = li.querySelector('a');
      if (socialLink) {
        const socialName = socialLink.textContent.trim() || 'Social Media Link';
        socialLink.setAttribute('aria-label', socialName);
      }
    });
    searchAccessDiv.append(socialMediaUl); // Append social media links to search access div
    moveInstrumentation(toolsRow.querySelector('ul:first-of-type'), socialMediaUl);
  }

  headerCompWrapper.append(searchAccessDiv);
}

/**
 * Loads and decorates the header, mainly the nav.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // Load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Decorate nav DOM
  block.textContent = '';

  const headerSection = document.createElement('section');
  headerSection.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(fragment.firstElementChild, headerSection); // Transfer instrumentation from fragment root

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerSection.append(containerDiv);

  const navElement = document.createElement('nav');
  navElement.id = 'nav';
  navElement.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  containerDiv.append(navElement);

  const headerCompWrapper = document.createElement('div');
  headerCompWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  navElement.append(headerCompWrapper);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Hamburger for mobile
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');
  hamburgerButton.innerHTML = `
    <span class="navbar-toggler-icon d-flex flex-column justify-content-center align-items-center">
      <span class="d-block bg-white"></span>
      <span class="d-block bg-white"></span>
      <span class="d-block bg-white"></span>
    </span>
  `;
  headerCompWrapper.append(hamburgerButton);
  // Transfer instrumentation from an arbitrary fragment element if needed, or from the button itself if it existed in fragment
  // For now, assuming no direct instrumentation on hamburger in fragment, so no moveInstrumentation here.

  // Setup brand
  setupBrand(brandRow, headerCompWrapper);

  // Menus wrapper
  const menusWrapper = document.createElement('div');
  menusWrapper.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  menusWrapper.id = 'navbarSupportedContent';
  headerCompWrapper.append(menusWrapper);

  // Setup desktop navigation
  setupDesktopNav(navRow, menusWrapper);

  // Setup tools
  setupTools(toolsRow, containerDiv);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerSection.append(outerBox);

  block.append(headerSection);

  // Event listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => toggleMenu(navElement, menusWrapper));

  // Close menu on escape keypress
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && navElement.getAttribute('aria-expanded') === 'true') {
      toggleMenu(navElement, menusWrapper, false);
    }
  });

  // Close menu on focus lost
  navElement.addEventListener('focusout', (e) => {
    if (!navElement.contains(e.relatedTarget) && !isDesktop.matches) {
      toggleMenu(navElement, menusWrapper, false);
    }
  });

  // Prevent mobile nav behavior on window resize
  isDesktop.addEventListener('change', () => toggleMenu(navElement, menusWrapper, isDesktop.matches));
  // Initialize menu state based on desktop status
  toggleMenu(navElement, menusWrapper, isDesktop.matches);
}

