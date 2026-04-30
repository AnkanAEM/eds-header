import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Moves instrumentation attributes (like data-once, data-cq-decorated) from a source element to a target element.
 * @param {HTMLElement} sourceElement The element to read attributes from.
 * @param {HTMLElement} targetElement The element to write attributes to.
 */
function moveInstrumentation(sourceElement, targetElement) {
  if (sourceElement && targetElement) {
    const attributesToMove = ['data-once', 'data-cq-decorated'];
    attributesToMove.forEach((attr) => {
      const value = sourceElement.getAttribute(attr);
      if (value) {
        targetElement.setAttribute(attr, value);
      }
    });
  }
}

/**
 * Parses a UL element and its children into a nested data structure.
 * @param {HTMLUListElement} ulElement The UL element to parse.
 * @returns {Array<Object>} An array of menu item objects.
 */
function parseNestedMenu(ulElement) {
  const items = [];
  if (!ulElement) return items;

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeName === 'LI') {
      const item = { title: '', href: null, children: [], content: [] };
      const anchor = li.querySelector('a');
      const strong = li.querySelector('strong');

      if (anchor) {
        item.title = anchor.textContent.trim();
        item.href = anchor.href;
        // Move instrumentation from anchor to item representation
        moveInstrumentation(anchor, item);
      } else if (strong) {
        item.title = strong.textContent.trim();
      } else {
        // Fallback to direct text content of LI, ignoring nested ULs
        const directText = Array.from(li.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
          .map((node) => node.textContent.trim())
          .join(' ');
        item.title = directText;
      }

      // Capture all direct children of LI that are not ULs
      Array.from(li.children).forEach((child) => {
        if (child.nodeName !== 'UL') {
          item.content.push(child.cloneNode(true));
        }
      });

      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        item.children = parseNestedMenu(nestedUl);
      }
      items.push(item);
    }
  });
  return items;
}

/**
 * Sets up the mobile navigation toggle (hamburger icon).
 * @param {HTMLElement} navElement The main navigation element.
 * @param {HTMLElement} navSections The element containing navigation sections.
 * @param {HTMLElement} wrapDiv The .wrap container.
 */
function setupMobileNavToggle(navElement, wrapDiv) {
  if (!navElement || !wrapDiv) return;

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');

  wrapDiv.prepend(hamburger);

  const toggleNav = () => {
    const isExpanded = navElement.classList.contains('active');
    if (isExpanded) {
      navElement.classList.remove('active');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      navElement.classList.add('active');
      document.body.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  };

  hamburger.addEventListener('click', toggleNav);

  // Close nav when clicking outside on mobile
  document.addEventListener('click', (event) => {
    if (!isDesktop.matches && navElement.classList.contains('active') && !navElement.contains(event.target) && !hamburger.contains(event.target)) {
      toggleNav();
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navElement.classList.contains('active')) {
      toggleNav();
    }
  });
}

/**
 * Sets up the mobile submenu toggles for a given navigation item.
 * @param {HTMLElement} navItem The LI element representing a navigation item.
 */
function setupMobileSubmenuToggle(navItem) {
  if (!navItem) return;

  const chevronSpan = navItem.querySelector(':scope > span');
  if (chevronSpan) {
    chevronSpan.setAttribute('role', 'button');
    chevronSpan.setAttribute('aria-label', 'Toggle submenu');
    chevronSpan.setAttribute('aria-expanded', 'false');

    chevronSpan.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const megaMenu = navItem.querySelector('.mega-menu');
      if (megaMenu) {
        const isExpanded = megaMenu.classList.contains('active');
        if (isExpanded) {
          megaMenu.classList.remove('active');
          navItem.classList.remove('active');
          chevronSpan.setAttribute('aria-expanded', 'false');
        } else {
          // Close other open sub-menus at the same level
          Array.from(navItem.parentNode.children).forEach((sibling) => {
            if (sibling !== navItem && sibling.classList.contains('has-child')) {
              sibling.classList.remove('active');
              const siblingMegaMenu = sibling.querySelector('.mega-menu');
              if (siblingMegaMenu) siblingMegaMenu.classList.remove('active');
              const siblingChevron = sibling.querySelector(':scope > span');
              if (siblingChevron) siblingChevron.setAttribute('aria-expanded', 'false');
            }
          });
          megaMenu.classList.add('active');
          navItem.classList.add('active');
          chevronSpan.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  // Handle nested sub-menus (L2, L3, etc.)
  navItem.querySelectorAll('.has-sub-child > ul > li, .has-inner-sub-child > ul > li').forEach((subMenuItem) => {
    const subMenuChevronSpan = subMenuItem.querySelector(':scope > span');
    if (subMenuChevronSpan) {
      subMenuChevronSpan.setAttribute('role', 'button');
      subMenuChevronSpan.setAttribute('aria-label', 'Toggle nested submenu');
      subMenuChevronSpan.setAttribute('aria-expanded', 'false');

      subMenuChevronSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nestedMenuContainer = subMenuItem.querySelector('.has-sub-child, .has-inner-sub-child');
        if (nestedMenuContainer) {
          const isExpanded = nestedMenuContainer.classList.contains('active') || nestedMenuContainer.classList.contains('active-child');
          if (isExpanded) {
            nestedMenuContainer.classList.remove('active', 'active-child');
            subMenuItem.classList.remove('active');
            subMenuChevronSpan.setAttribute('aria-expanded', 'false');
          } else {
            // Close other open sub-menus at the same level
            Array.from(subMenuItem.parentNode.children).forEach((sibling) => {
              if (sibling !== subMenuItem) {
                const siblingNestedMenu = sibling.querySelector('.has-sub-child, .has-inner-sub-child');
                if (siblingNestedMenu) {
                  siblingNestedMenu.classList.remove('active', 'active-child');
                  sibling.classList.remove('active');
                  const siblingSubMenuChevron = sibling.querySelector(':scope > span');
                  if (siblingSubMenuChevron) siblingSubMenuChevron.setAttribute('aria-expanded', 'false');
                }
              }
            });
            nestedMenuContainer.classList.add(nestedMenuContainer.classList.contains('has-sub-child') ? 'active' : 'active-child');
            subMenuItem.classList.add('active');
            subMenuChevronSpan.setAttribute('aria-expanded', 'true');
          }
        }
      });
    }
  });
}

/**
 * Creates a navigation item (LI) for the main navigation.
 * @param {Object} itemData The data for the navigation item.
 * @param {HTMLElement} originalElement The original P element from the fragment.
 * @returns {HTMLElement} The created LI element.
 */
function createMainNavItem(itemData, originalElement) {
  const navItemLi = document.createElement('li');
  navItemLi.classList.add('has-child', 'hover-red');
  navItemLi.setAttribute('itemprop', 'name');
  navItemLi.setAttribute('data-once', 'nav-close-search');

  const linkOrSpan = itemData.href ? document.createElement('a') : document.createElement('span');
  linkOrSpan.textContent = itemData.title;
  if (itemData.href) {
    linkOrSpan.href = itemData.href;
    linkOrSpan.setAttribute('itemprop', 'url');
  }
  navItemLi.append(linkOrSpan);
  moveInstrumentation(originalElement.querySelector('a') || originalElement.querySelector('strong') || originalElement, linkOrSpan);

  const chevronSpan = document.createElement('span');
  chevronSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
  navItemLi.append(chevronSpan);

  return navItemLi;
}

/**
 * Builds the HTML for a nested submenu.
 * @param {Array<Object>} items The menu item data.
 * @param {HTMLElement} [parentUl=null] The parent UL element to append to.
 * @param {number} [level=0] The current nesting level.
 * @returns {HTMLElement} The constructed UL element.
 */
function buildSubmenuHtml(items, parentUl = null, level = 0) {
  const ul = parentUl || document.createElement('ul');
  items.forEach((subItem) => {
    const li = document.createElement('li');

    const linkOrSpan = subItem.href ? document.createElement('a') : document.createElement('span');
    linkOrSpan.textContent = subItem.title;
    if (subItem.href) {
      linkOrSpan.href = subItem.href;
    }
    li.append(linkOrSpan);

    if (subItem.children.length > 0) {
      const subChevronSpan = document.createElement('span');
      subChevronSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
      li.append(subChevronSpan);

      const nestedDiv = document.createElement('div');
      nestedDiv.classList.add(level === 0 ? 'has-sub-child' : 'has-inner-sub-child');
      const nestedUl = document.createElement('ul');
      nestedDiv.append(buildSubmenuHtml(subItem.children, nestedUl, level + 1));
      li.append(nestedDiv);
    }
    ul.append(li);
  });
  return ul;
}

/**
 * Renders the main navigation structure.
 * @param {HTMLElement} navSection The fragment section containing navigation content.
 * @returns {HTMLElement} The constructed nav element.
 */
function renderMainNav(navSection) {
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(mainUl);

  if (!navSection) return navElement;

  let currentElement = navSection.firstElementChild;
  let contentBuffer = [];

  while (currentElement) {
    if (currentElement.nodeType === Node.COMMENT_NODE) {
      currentElement = currentElement.nextElementSibling;
      continue;
    }

    if (currentElement.nodeName === 'P') {
      const itemData = { title: '', href: null };
      const anchor = currentElement.querySelector('a');
      if (anchor) {
        itemData.title = anchor.textContent.trim();
        itemData.href = anchor.href;
      } else {
        const strong = currentElement.querySelector('strong');
        itemData.title = strong ? strong.textContent.trim() : currentElement.textContent.trim();
      }

      const navItemLi = createMainNavItem(itemData, currentElement);

      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      if (contentBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        if (anchor) {
          const sanitizedTitle = anchor.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (sanitizedTitle) {
            leftDiv.classList.add(`${sanitizedTitle}-left-div`);
          }
        }
        contentBuffer.forEach((node) => leftDiv.append(node));
        centerDiv.append(leftDiv);
        contentBuffer = [];
      }

      let nextSibling = currentElement.nextElementSibling;
      while (nextSibling && nextSibling.nodeType === Node.COMMENT_NODE) {
        nextSibling = nextSibling.nextElementSibling;
      }

      if (nextSibling && nextSibling.nodeName === 'UL') {
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        const parsedSubmenu = parseNestedMenu(nextSibling);
        subNavWrap.append(buildSubmenuHtml(parsedSubmenu));
        centerDiv.append(subNavWrap);
        moveInstrumentation(nextSibling, subNavWrap);
        currentElement = nextSibling.nextElementSibling;
      } else {
        currentElement = currentElement.nextElementSibling;
      }

      megaMenuWrap.append(centerDiv);
      megaMenuDiv.append(megaMenuWrap);
      navItemLi.append(megaMenuDiv);
      mainUl.append(navItemLi);
      moveInstrumentation(currentElement ? currentElement.previousElementSibling : navSection.lastElementChild, navItemLi);
    } else {
      contentBuffer.push(currentElement.cloneNode(true));
      currentElement = currentElement.nextElementSibling;
    }
  }
  return navElement;
}

/**
 * Renders the tools section (contact us, search icons).
 * @param {HTMLElement} toolsSection The fragment section containing tools content.
 * @param {HTMLElement} navElement The main nav element to append mobile icon nav to.
 * @param {HTMLElement} wrapDiv The .wrap container to append desktop icon nav to.
 */
function renderToolsSection(toolsSection, navElement, wrapDiv) {
  if (!toolsSection) return;

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

  Array.from(toolsSection.children).forEach((ulElement) => {
    if (ulElement.nodeName === 'UL') {
      const mobileUl = document.createElement('ul');
      const desktopUl = document.createElement('ul');

      Array.from(ulElement.children).forEach((li) => {
        if (li.nodeName === 'LI') {
          const anchor = li.querySelector('a');
          if (anchor) {
            const mobileLi = document.createElement('li');
            const desktopLi = document.createElement('li');

            const mobileLink = document.createElement('a');
            mobileLink.href = anchor.href;
            mobileLink.textContent = anchor.textContent.trim();
            mobileLi.append(mobileLink);
            moveInstrumentation(anchor, mobileLink);

            const desktopLink = document.createElement('a');
            desktopLink.href = anchor.href;
            moveInstrumentation(anchor, desktopLink);

            const iconText = anchor.textContent.trim().toLowerCase();
            const originalLinkContent = anchor.innerHTML; // Get original content including SVGs

            if (iconText === 'contact us') {
              mobileLink.innerHTML = originalLinkContent;
              desktopLink.innerHTML = originalLinkContent;
              mobileLi.classList.add('mail');
              desktopLi.classList.add('mail');
            } else if (iconText === 'search') {
              mobileLink.innerHTML = originalLinkContent;
              desktopLink.innerHTML = originalLinkContent;
              mobileLi.classList.add('search');
              desktopLi.classList.add('search');

              // Find the search screen wrap within the original LI
              const searchScreenWrap = li.querySelector('.search-screen-wrap');
              if (searchScreenWrap) {
                desktopLi.append(searchScreenWrap.cloneNode(true));
                mobileLi.append(searchScreenWrap.cloneNode(true)); // Add to mobile as well
              }
            } else {
              desktopLink.textContent = anchor.textContent.trim();
            }
            desktopLi.append(desktopLink);
            moveInstrumentation(li, mobileLi);
            moveInstrumentation(li, desktopLi);

            mobileUl.append(mobileLi);
            desktopUl.append(desktopLi);
          }
        }
      });
      if (mobileUl.children.length > 0) mobileIconNav.append(mobileUl);
      if (desktopUl.children.length > 0) desktopIconNav.append(desktopUl);
      moveInstrumentation(ulElement, mobileUl);
      moveInstrumentation(ulElement, desktopUl);
    }
  });
  if (mobileIconNav.children.length > 0) navElement.append(mobileIconNav);
  if (desktopIconNav.children.length > 0) wrapDiv.append(desktopIconNav);
  moveInstrumentation(toolsSection, mobileIconNav);
  moveInstrumentation(toolsSection, desktopIconNav);
}

/**
 * Sets up search functionality and event listeners.
 * @param {HTMLElement} block The main header block.
 */
function setupSearchFunctionality(block) {
  const searchIconDesktop = block.querySelector('.desktop-menus-icon .search > a');
  const searchScreenDesktop = block.querySelector('.desktop-menus-icon .search-screen-wrap');
  const searchIconMobile = block.querySelector('.mobile-menus-icon .search > a');
  const searchScreenMobile = block.querySelector('.mobile-menus-icon .search-screen-wrap');

  const toggleSearch = (icon, screen) => {
    if (!icon || !screen) return;
    const isSearchOpen = screen.classList.contains('active');
    if (isSearchOpen) {
      screen.classList.remove('active');
      icon.querySelector('.lens').style.display = 'block';
      icon.querySelector('.close').style.display = 'none';
      document.body.classList.remove('search-open');
      icon.setAttribute('aria-expanded', 'false');
    } else {
      screen.classList.add('active');
      icon.querySelector('.lens').style.display = 'none';
      icon.querySelector('.close').style.display = 'block';
      document.body.classList.add('search-open');
      icon.setAttribute('aria-expanded', 'true');
      const searchInput = screen.querySelector('.input-text.searchtext');
      if (searchInput) searchInput.focus();
    }
  };

  if (searchIconDesktop && searchScreenDesktop) {
    searchIconDesktop.setAttribute('role', 'button');
    searchIconDesktop.setAttribute('aria-label', 'Toggle search');
    searchIconDesktop.setAttribute('aria-expanded', 'false');
    searchIconDesktop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearch(searchIconDesktop, searchScreenDesktop);
    });
    searchScreenDesktop.addEventListener('click', (e) => e.stopPropagation());
  }

  if (searchIconMobile && searchScreenMobile) {
    searchIconMobile.setAttribute('role', 'button');
    searchIconMobile.setAttribute('aria-label', 'Toggle search');
    searchIconMobile.setAttribute('aria-expanded', 'false');
    searchIconMobile.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearch(searchIconMobile, searchScreenMobile);
    });
    searchScreenMobile.addEventListener('click', (e) => e.stopPropagation());
  }

  // Close search when clicking outside
  document.addEventListener('click', (event) => {
    if (searchScreenDesktop && searchScreenDesktop.classList.contains('active') && !searchScreenDesktop.contains(event.target) && !searchIconDesktop.contains(event.target)) {
      toggleSearch(searchIconDesktop, searchScreenDesktop);
    }
    if (searchScreenMobile && searchScreenMobile.classList.contains('active') && !searchScreenMobile.contains(event.target) && !searchIconMobile.contains(event.target)) {
      toggleSearch(searchIconMobile, searchScreenMobile);
    }
  });

  // Close search on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (searchScreenDesktop && searchScreenDesktop.classList.contains('active')) {
        toggleSearch(searchIconDesktop, searchScreenDesktop);
      }
      if (searchScreenMobile && searchScreenMobile.classList.contains('active')) {
        toggleSearch(searchIconMobile, searchScreenMobile);
      }
    }
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Apply root classes from original HTML
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  // Section 1: Brand (Logo)
  const brandSection = fragment.children[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandSection.querySelector('p > a');
    if (brandLink) {
      const logoAnchor = document.createElement('a');
      logoAnchor.href = brandLink.href;
      moveInstrumentation(brandLink, logoAnchor);

      const picture = brandLink.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const logoImg = document.createElement('img');
          logoImg.src = img.src;
          logoImg.alt = img.alt || 'Mahindra Brand Logo White';
          logoImg.title = img.title || 'Mahindra Brand Logo White Image';
          logoImg.loading = 'lazy';
          logoImg.classList.add('hiddenlogo1');
          logoAnchor.append(logoImg);
          moveInstrumentation(img, logoImg);
        }
      }
      if (logoAnchor.children.length > 0) { // Only append if logoAnchor has content
        logoDiv.append(logoAnchor);
      }
      moveInstrumentation(brandSection.querySelector('p'), logoDiv);
    }
    if (logoDiv.children.length > 0) { // Only append if logoDiv has content
      wrapDiv.append(logoDiv);
    }
    moveInstrumentation(brandSection, logoDiv);
  }

  // Section 2: Nav
  const navSection = fragment.children[1];
  const navElement = renderMainNav(navSection);
  wrapDiv.append(navElement);

  // Section 3: Tools
  const toolsSection = fragment.children[2];
  renderToolsSection(toolsSection, navElement, wrapDiv);

  // Append the 80th year logo from the original HTML
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  year80LogoDiv.innerHTML = `
    <a href="https://www.mahindra.com/">
      <img src="https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp" alt="80th Year Logo Gold" title="80thYearLogo_Gold" class="hiddenlogo1 years-80" loading="lazy">
    </a>
  `;
  wrapDiv.append(year80LogoDiv);

  containerDiv.append(wrapDiv);
  block.append(containerDiv);

  // Add event listeners for mobile navigation toggles
  setupMobileNavToggle(navElement, wrapDiv);

  // Setup mobile submenu toggles for all levels
  navElement.querySelectorAll('.main-nav > ul > li.has-child').forEach((navItem) => {
    setupMobileSubmenuToggle(navItem);
  });

  // Search functionality
  setupSearchFunctionality(block);

  // Desktop hover behavior for main nav items
  const mainUl = navElement.querySelector('ul');
  if (mainUl) {
    mainUl.querySelectorAll('li.has-child').forEach((navItem) => {
      if (isDesktop.matches) {
        navItem.addEventListener('mouseenter', () => {
          navItem.classList.add('active');
          const megaMenu = navItem.querySelector('.mega-menu');
          if (megaMenu) megaMenu.classList.add('active');
          const chevron = navItem.querySelector(':scope > span');
          if (chevron) chevron.setAttribute('aria-expanded', 'true');
        });
        navItem.addEventListener('mouseleave', () => {
          navItem.classList.remove('active');
          const megaMenu = navItem.querySelector('.mega-menu');
          if (megaMenu) megaMenu.classList.remove('active');
          const chevron = navItem.querySelector(':scope > span');
          if (chevron) chevron.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
}
