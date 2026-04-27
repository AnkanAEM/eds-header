import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The loaded fragment DOM.
 * @returns {Object} An object containing the identified brand, nav, and tools rows.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify Brand Row: Contains a picture or img element
  brandRow = sections.find((s) => s.querySelector('p > picture, p > img'));
  if (brandRow) brandRow.classList.add('nav-brand');

  // Identify Tools Row: Contains specific social/utility links
  toolsRow = sections.find((s) => s.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="contact-us"], li.mail, li.search'));
  if (toolsRow) toolsRow.classList.add('nav-tools');

  // Identify Nav Row: Contains a link (button or regular) AND a UL
  navRow = sections.find((s) => s !== brandRow && s !== toolsRow && (s.querySelector('p > a') || s.querySelector('a.button') || s.querySelector('ul')));
  if (navRow) navRow.classList.add('nav-sections');

  return { brandRow, navRow, toolsRow };
}

/**
 * Recursively decorates nested ULs with appropriate classes.
 * @param {HTMLUListElement} ul The UL element to decorate.
 * @param {number} level The current nesting level (1 for top-level, 2 for sub-level, etc.)
 */
function decorateNestedUl(ul, level) {
  if (!ul) return;

  Array.from(ul.children).forEach((li) => {
    const link = li.querySelector('a');
    const nestedUl = li.querySelector('ul');

    if (link) {
      if (level === 1) {
        li.classList.add('top-level-li');
      } else if (level === 2) {
        li.classList.add('first-level-li');
      }

      if (nestedUl) {
        li.classList.add('has-child');
        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        link.after(span);

        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add(level === 1 ? 'has-sub-child' : 'has-inner-sub-child');
        li.append(wrapperDiv);
        wrapperDiv.append(nestedUl);
        decorateNestedUl(nestedUl, level + 1);
      }
    }
  });
}

/**
 * Sets up the desktop navigation, including mega-menu logic.
 * @param {Element} navElement The navigation sections container.
 */
function setupDesktopNav(navElement) {
  if (!navElement) return;

  const mainUl = navElement.querySelector('ul');
  if (!mainUl) return;

  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentMegaMenuLi = null;
  let leftDivContentBuffer = [];
  const processedChildren = []; // To keep track of children already processed and moved

  Array.from(navElement.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          // New top-level navigation item
          currentMegaMenuLi = document.createElement('li');
          currentMegaMenuLi.classList.add('has-child', 'hover-red');
          currentMegaMenuLi.setAttribute('itemprop', 'name');
          currentMegaMenuLi.setAttribute('data-once', 'nav-close-search');
          currentMegaMenuLi.setAttribute('aria-haspopup', 'true');
          currentMegaMenuLi.setAttribute('aria-expanded', 'false');

          const linkClone = link.cloneNode(true);
          linkClone.setAttribute('itemprop', 'url');
          currentMegaMenuLi.append(linkClone);

          const span = document.createElement('span');
          span.innerHTML = CHEVRON_SVG;
          currentMegaMenuLi.append(span);

          const megaMenuDiv = document.createElement('div');
          megaMenuDiv.classList.add('mega-menu');
          const wrapDiv = document.createElement('div');
          wrapDiv.classList.add('wrap', 'container');
          const centerDiv = document.createElement('div');
centerDiv.classList.add('center-div');

          // If there's buffered content, create a left-div
          if (leftDivContentBuffer.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const sanitizedTitle = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            leftDiv.classList.add(`${sanitizedTitle}-left-div`);
            leftDivContentBuffer.forEach((bufferedNode) => leftDiv.append(bufferedNode));
            centerDiv.append(leftDiv);
            leftDivContentBuffer = []; // Clear buffer
          }

          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');

          // Dynamically add specific classes based on the main link text
          const linkText = link.textContent.toLowerCase();
          if (linkText.includes('who we are')) {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (linkText.includes('what we do')) {
            subNavWrap.classList.add('what-we-do');
          } else if (linkText.includes('careers')) {
            subNavWrap.classList.add('careers-div');
          } else if (linkText.includes('investor relations')) {
            subNavWrap.classList.add('element-block');
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            subNavWrap.append(innerSubNavWrapList);
          }

          centerDiv.append(subNavWrap);
          wrapDiv.append(centerDiv);
          megaMenuDiv.append(wrapDiv);
          currentMegaMenuLi.append(megaMenuDiv);
          mainUl.append(currentMegaMenuLi);
        } else if (currentMegaMenuLi) {
          // If it's a UL or other content following a link, append it to the current mega-menu
          const subNavWrap = currentMegaMenuLi.querySelector('.sub-nav-wrap');
          if (li.tagName === 'LI') { // It's a LI, meaning it's part of a nested UL
            const nestedUl = document.createElement('ul');
            nestedUl.append(li.cloneNode(true)); // Clone the LI and append to a new UL
            decorateNestedUl(nestedUl, 1); // Start decoration from level 1
            if (subNavWrap.classList.contains('element-block') && subNavWrap.querySelector('.inner-sub-nav-wrap-list')) {
              subNavWrap.querySelector('.inner-sub-nav-wrap-list').append(nestedUl);
            } else {
              subNavWrap.append(nestedUl);
            }
          } else {
            // Collect other content (h4, p, div.slides) into the left-div buffer
            leftDivContentBuffer.push(li.cloneNode(true));
          }
        }
      });
      processedChildren.push(child); // Mark the original UL as processed
    } else {
      // Collect any non-UL content that appears before the first nav item or between nav items
      leftDivContentBuffer.push(child.cloneNode(true));
      processedChildren.push(child); // Mark as processed
    }
  });

  // Remove processed children from the original navElement
  processedChildren.forEach(child => child.remove());

  // Append any remaining leftDivContentBuffer to the last mega menu or discard if no mega menu
  if (leftDivContentBuffer.length > 0 && currentMegaMenuLi) {
    let leftDiv = currentMegaMenuLi.querySelector('.left-div');
    if (!leftDiv) {
      leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      const link = currentMegaMenuLi.querySelector('a');
      if (link) {
        const sanitizedTitle = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);
      }
      currentMegaMenuLi.querySelector('.center-div').prepend(leftDiv);
    }
    leftDivContentBuffer.forEach((bufferedNode) => leftDiv.append(bufferedNode));
  }
  navElement.prepend(mainUl);

  // Add event listeners for desktop hover
  Array.from(mainUl.children).forEach(li => {
    if (li.classList.contains('has-child')) {
      li.addEventListener('mouseenter', () => {
        li.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        li.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  if (expanded) {
    navSections.style.transform = 'translate(-100%,0)';
    navSections.style.opacity = '0';
  } else {
    navSections.style.transform = 'translate(0,0)';
    navSections.style.opacity = '1';
  }
}

/**
 * Sets up the mobile navigation, including hamburger and menu toggles.
 * @param {Element} navElement The navigation sections container.
 * @param {Element} navTools The navigation tools container.
 * @param {Element} block The main header block element.
 */
function setupMobileNav(navElement, navTools, block) {
  if (!navElement || !block) return;

  const hamburger = block.querySelector('.hamburger');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => toggleMenu(block, navElement));

  // Append mobile tools to nav sections for combined mobile menu
  if (navTools) {
    const mobileMenusIcon = document.createElement('div');
    mobileMenusIcon.classList.add('icon-nav', 'mobile-menus-icon');
    const ul = document.createElement('ul');
    Array.from(navTools.children).forEach(child => {
      if (child.tagName === 'UL') {
        Array.from(child.children).forEach(li => {
          if (li.classList.contains('mail') || li.classList.contains('search')) {
            ul.append(li.cloneNode(true));
          }
        });
      } else if (child.classList.contains('mail') || child.classList.contains('search')) {
        // Handle direct li children if toolsRow was not a UL
        ul.append(child.cloneNode(true));
      }
    });
    if (ul.children.length > 0) {
      mobileMenusIcon.append(ul);
      navElement.append(mobileMenusIcon);
    }
  }

  // Mobile menu accordion logic for top-level items
  Array.from(navElement.querySelectorAll('li.has-child > span')).forEach(span => {
    span.addEventListener('click', (e) => {
      const li = e.currentTarget.closest('li.has-child');
      if (!li) return;
      const megaMenu = li.querySelector('.mega-menu');
      if (!megaMenu) return;

      const isExpanded = li.classList.toggle('expanded');
      li.setAttribute('aria-expanded', isExpanded);

      if (isExpanded) {
        megaMenu.style.display = 'block';
        setTimeout(() => {
          megaMenu.style.maxHeight = `${megaMenu.scrollHeight}px`;
          megaMenu.style.opacity = '1';
        }, 0);
      } else {
        megaMenu.style.maxHeight = '0';
        megaMenu.style.opacity = '0';
        megaMenu.addEventListener('transitionend', () => {
          if (!li.classList.contains('expanded')) {
            megaMenu.style.display = 'none';
          }
        }, { once: true });
      }
      e.currentTarget.querySelector('svg').style.transform = isExpanded ? 'rotate(-180deg)' : 'rotate(90deg)';
    });
  });

  // Mobile menu accordion logic for sub-level items
  Array.from(navElement.querySelectorAll('.has-sub-child > ul > li.has-child > span')).forEach(span => {
    span.addEventListener('click', (e) => {
      const li = e.currentTarget.closest('li.has-child');
      if (!li) return;
      const subMenu = li.querySelector('.has-inner-sub-child');
      if (!subMenu) return;

      const isExpanded = li.classList.toggle('active');
      li.setAttribute('aria-expanded', isExpanded);

      if (isExpanded) {
        subMenu.style.maxHeight = `${subMenu.scrollHeight}px`;
        subMenu.style.opacity = '1';
      } else {
        subMenu.style.maxHeight = '0';
        subMenu.style.opacity = '0';
      }
      e.currentTarget.querySelector('svg').style.transform = isExpanded ? 'rotate(-180deg)' : 'rotate(90deg)';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.getAttribute('aria-expanded') === 'true') {
      toggleMenu(block, navElement, true); // Force close
    }
  });
}

/**
 * Sets up accessibility attributes for navigation elements.
 * @param {Element} navElement The navigation sections container.
 */
function setupAccessibility(navElement) {
  if (!navElement) return;

  navElement.querySelectorAll('li.has-child').forEach((li) => {
    li.setAttribute('aria-haspopup', 'true');
    li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Handles search toggle functionality.
 * @param {Element} block The main header block element.
 */
function setupSearch(block) {
  const searchToggle = block.querySelector('.icon-nav .search > a');
  const searchScreenWrap = block.querySelector('.search-screen-wrap');
  const searchClose = block.querySelector('.icon-nav .search .close');
  const searchLens = block.querySelector('.icon-nav .search .lens');
  const searchInput = block.querySelector('#searchInput');

  if (searchToggle && searchScreenWrap && searchClose && searchLens && searchInput) {
    const toggleSearch = (forceClose = false) => {
      const isSearchOpen = block.classList.contains('search-open');
      if (forceClose && !isSearchOpen) return;

      block.classList.toggle('search-open', !isSearchOpen || forceClose);
      searchScreenWrap.style.opacity = (!isSearchOpen || forceClose) ? '1' : '0';
      searchScreenWrap.style.pointerEvents = (!isSearchOpen || forceClose) ? 'all' : 'none';
      searchLens.style.display = (!isSearchOpen || forceClose) ? 'none' : 'block';
      searchClose.style.display = (!isSearchOpen || forceClose) ? 'block' : 'none';

      if (!isSearchOpen || forceClose) {
        searchInput.focus();
      } else {
        searchInput.blur();
      }
    };

    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSearch();
    });

    // Close search when clicking outside search screen
    document.addEventListener('click', (e) => {
      if (!block.contains(e.target) && block.classList.contains('search-open')) {
        toggleSearch(true);
      }
    });

    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && block.classList.contains('search-open')) {
        toggleSearch(true);
      }
    });

    // Stop propagation for elements inside search screen to prevent immediate close
    Array.from(searchScreenWrap.querySelectorAll('[data-once*="search-stop-propagation"]')).forEach(el => {
      el.addEventListener('click', (e) => e.stopPropagation());
    });
  }
}

/**
 * Loads and decorates the header, mainly the nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = 'Header fragment not found.';
    return;
  }

  // decorate nav DOM
  block.textContent = ''; // Clear existing content
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up'); // Add classes from original HTML
  block.setAttribute('aria-expanded', 'false'); // Initial state for the whole header

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Process Brand Row
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('p > a');
    if (brandLink) {
      const img = brandLink.querySelector('picture, img');
      if (img) {
        const link = document.createElement('a');
        link.href = brandLink.href;
        link.append(img.cloneNode(true));
        logoDiv.append(link);
      }
    }
    wrapDiv.append(logoDiv);
    brandRow.remove(); // Remove from fragment as it's processed
  }

  // Add hamburger menu (always present in original HTML, even if hidden on desktop)
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburgerDiv.setAttribute('aria-label', 'Open navigation');
  hamburgerDiv.setAttribute('aria-controls', 'main-nav');
  hamburgerDiv.setAttribute('aria-expanded', 'false');
  const ul = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ul.append(document.createElement('li'));
  }
  hamburgerDiv.append(ul);
  wrapDiv.append(hamburgerDiv);

  // 2. Process Nav Row
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.id = 'main-nav'; // Add ID for aria-controls
  navElement.setAttribute('data-once', 'initSubChildToggle');
  if (navRow) {
    // Move all children from navRow to navElement for processing
    while (navRow.firstElementChild) {
      navElement.append(navRow.firstElementChild);
    }
    navRow.remove();
  }
  wrapDiv.append(navElement);

  // 3. Process Tools Row
  const desktopMenusIcon = document.createElement('div');
  desktopMenusIcon.classList.add('icon-nav', 'desktop-menus-icon');
  if (toolsRow) {
    // Move all children from toolsRow to desktopMenusIcon
    while (toolsRow.firstElementChild) {
      desktopMenusIcon.append(toolsRow.firstElementChild);
    }
    toolsRow.remove();
  }
  navElement.append(desktopMenusIcon); // Append desktop tools inside nav for proper styling

  // Add 80th year logo if present in the fragment (after nav and tools for proper order)
  const year80Logo = fragment.querySelector('.year-80-logo');
  if (year80Logo) {
    wrapDiv.append(year80Logo.cloneNode(true));
    year80Logo.remove();
  }

  containerDiv.append(wrapDiv);
  block.append(containerDiv);

  // Now that elements are in the DOM, set up desktop nav and search
  setupDesktopNav(navElement);
  setupSearch(block); // Pass the main block to search for relevant elements

  // Setup mobile navigation and accessibility
  setupMobileNav(navElement, desktopMenusIcon, block); // Pass desktopMenusIcon as the source for mobile tools
  setupAccessibility(navElement);

  // Initial toggle state for mobile/desktop
  toggleMenu(block, navElement, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(block, navElement, isDesktop.matches));
}
