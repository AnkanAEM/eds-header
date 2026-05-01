import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

let nav;
let navSections;
let searchScreenWrap;
let searchInput;
let searchResultBox;
let searchSuggestionsWrap;
let searchLensIcon;
let searchCloseIcon;
let hamburger;

function sanitizeClassName(str) {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || null;
}

function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  const cqDecorated = originalElement.getAttribute('data-cq-decorated');
  const cqPath = originalElement.getAttribute('data-cq-path');
  const cqType = originalElement.getAttribute('data-cq-type');
  const cqSelectors = originalElement.getAttribute('data-cq-selectors');
  const cqServlet = originalElement.getAttribute('data-cq-servlet');
  const cqTotalTime = originalElement.getAttribute('data-cq-total-time');
  const cqSelfTime = originalElement.getAttribute('data-cq-self-time');

  if (cqDecorated) newElement.setAttribute('data-cq-decorated', cqDecorated);
  if (cqPath) newElement.setAttribute('data-cq-path', cqPath);
  if (cqType) newElement.setAttribute('data-cq-type', cqType);
  if (cqSelectors) newElement.setAttribute('data-cq-selectors', cqSelectors);
  if (cqServlet) newElement.setAttribute('data-cq-servlet', cqServlet);
  if (cqTotalTime) newElement.setAttribute('data-cq-total-time', cqTotalTime);
  if (cqSelfTime) newElement.setAttribute('data-cq-self-time', cqSelfTime);
}

function createChevronSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g1.setAttribute('id', 'SVGRepo_bgCarrier');
  g1.setAttribute('stroke-width', '0');
  svg.appendChild(g1);

  const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g2.setAttribute('id', 'SVGRepo_tracerCarrier');
  g2.setAttribute('stroke-linecap', 'round');
  g2.setAttribute('stroke-linejoin', 'round');
  g2.setAttribute('stroke', '#CCCCCC');
  g2.setAttribute('stroke-width', '0.30321600000000004');
  svg.appendChild(g2);

  const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g3.setAttribute('id', 'SVGRepo_iconCarrier');
  const g4 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g4.setAttribute('id', 'Group_65');
  g4.setAttribute('data-name', 'Group 65');
  g4.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z');
  path.setAttribute('fill', '#030408');
  g4.appendChild(path);
  g3.appendChild(g4);
  svg.appendChild(g3);

  return svg;
}

function closeAllSubmenus(parentEl) {
  parentEl.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach((el) => {
    el.classList.remove('active');
    el.classList.remove('active-child');
    el.setAttribute('aria-expanded', 'false');
    const triggerSpan = el.previousElementSibling;
    if (triggerSpan && triggerSpan.tagName === 'SPAN') {
      triggerSpan.querySelector('svg').style.transform = 'rotate(90deg)';
    }
  });
}

function toggleSubmenu(trigger, submenu, level) {
  if (!trigger || !submenu) return;

  const isExpanded = submenu.classList.contains(level === 'L1' ? 'active' : 'active-child');
  const parentLi = trigger.closest('li');

  if (isExpanded) {
    submenu.classList.remove(level === 'L1' ? 'active' : 'active-child');
    submenu.setAttribute('aria-expanded', 'false');
    if (trigger.tagName === 'SPAN') {
      trigger.querySelector('svg').style.transform = 'rotate(90deg)';
    }
    closeAllSubmenus(submenu);
  } else {
    // Close other submenus at the same level
    const siblingsContainer = parentLi ? parentLi.parentElement : submenu.parentElement;
    if (siblingsContainer) {
      siblingsContainer.querySelectorAll(`.${level === 'L1' ? 'has-sub-child' : 'has-inner-sub-child'}.active, .${level === 'L1' ? 'has-sub-child' : 'has-inner-sub-child'}.active-child`).forEach((el) => {
        if (el !== submenu) {
          el.classList.remove('active');
          el.classList.remove('active-child');
          el.setAttribute('aria-expanded', 'false');
          const siblingTriggerSpan = el.previousElementSibling;
          if (siblingTriggerSpan && siblingTriggerSpan.tagName === 'SPAN') {
            siblingTriggerSpan.querySelector('svg').style.transform = 'rotate(90deg)';
          }
          closeAllSubmenus(el);
        }
      });
    }

    submenu.classList.add(level === 'L1' ? 'active' : 'active-child');
    submenu.setAttribute('aria-expanded', 'true');
    if (trigger.tagName === 'SPAN') {
      trigger.querySelector('svg').style.transform = 'rotate(-180deg)';
    }
  }
}

function setupMobileNavBehavior() {
  if (!nav || !navSections) return;

  // Reset all previous listeners to avoid duplicates
  navSections.querySelectorAll('.main-nav > ul > li.has-child > span, .sub-nav-wrap ul li > span, .has-sub-child ul li > span').forEach(span => {
    const newSpan = span.cloneNode(true);
    span.parentNode.replaceChild(newSpan, span);
  });

  const navItems = navSections.querySelectorAll('.main-nav > ul > li.has-child');
  navItems.forEach((item) => {
    const triggerSpan = item.querySelector(':scope > span');
    const megaMenu = item.querySelector(':scope > .mega-menu');

    if (triggerSpan && megaMenu) {
      triggerSpan.addEventListener('click', () => {
        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        item.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        megaMenu.style.display = isExpanded ? 'none' : 'block';
        triggerSpan.querySelector('svg').style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(-180deg)';
      });
      item.setAttribute('aria-expanded', 'false'); // Initial state
    }

    // Recursive function to set up listeners for nested submenus
    function setupNestedSubmenuListeners(parentUl, level) {
      parentUl.querySelectorAll(':scope > li').forEach((li) => {
        const subMenuTriggerSpan = li.querySelector(':scope > span');
        const subMenu = li.querySelector(':scope > .has-sub-child, :scope > .has-inner-sub-child');

        if (subMenuTriggerSpan && subMenu) {
          subMenuTriggerSpan.addEventListener('click', () => {
            toggleSubmenu(subMenuTriggerSpan, subMenu, level);
          });
          subMenu.setAttribute('aria-expanded', 'false'); // Initial state
        }

        const nestedUl = li.querySelector(':scope > .has-sub-child > ul, :scope > .has-inner-sub-child > ul');
        if (nestedUl) {
          setupNestedSubmenuListeners(nestedUl, level === 'L1' ? 'L2' : 'L3'); // Adjust level as needed
        }
      });
    }

    const firstLevelSubNavWrap = item.querySelector(':scope > .mega-menu .sub-nav-wrap > ul');
    if (firstLevelSubNavWrap) {
      setupNestedSubmenuListeners(firstLevelSubNavWrap, 'L1');
    }
  });
}

function setupDesktopNavBehavior() {
  if (!nav || !navSections) return;

  // Clear mobile listeners
  navSections.querySelectorAll('.main-nav > ul > li.has-child > span, .sub-nav-wrap ul li > span, .has-sub-child ul li > span').forEach(span => {
    const newSpan = span.cloneNode(true);
    span.parentNode.replaceChild(newSpan, span);
  });

  const navItems = navSections.querySelectorAll('.main-nav > ul > li.has-child');
  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hover-red');
      const megaMenu = item.querySelector(':scope > .mega-menu');
      if (megaMenu) {
        megaMenu.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('hover-red');
      const megaMenu = item.querySelector(':scope > .mega-menu');
      if (megaMenu) {
        megaMenu.setAttribute('aria-expanded', 'false');
      }
    });
    item.setAttribute('aria-expanded', 'false'); // Initial state
  });
}

function toggleSearchScreen(forceExpanded = null) {
  if (!searchScreenWrap || !searchLensIcon || !searchCloseIcon) return;

  const isExpanded = forceExpanded !== null ? forceExpanded : searchScreenWrap.classList.contains('active');

  if (isExpanded) {
    searchScreenWrap.classList.remove('active');
    searchScreenWrap.style.opacity = '0';
    searchScreenWrap.style.pointerEvents = 'none';
    searchLensIcon.style.display = 'block';
    searchCloseIcon.style.display = 'none';
    document.body.style.overflowY = '';
    searchScreenWrap.setAttribute('aria-hidden', 'true');
    searchInput.value = ''; // Clear search input
    searchResultBox.style.display = 'none'; // Hide results
  } else {
    searchScreenWrap.classList.add('active');
    searchScreenWrap.style.opacity = '1';
    searchScreenWrap.style.pointerEvents = 'all';
    searchLensIcon.style.display = 'none';
    searchCloseIcon.style.display = 'block';
    document.body.style.overflowY = 'hidden';
    searchScreenWrap.setAttribute('aria-hidden', 'false');
    if (searchInput) searchInput.focus();
  }
}

function toggleMobileMenu(forceExpanded = null) {
  if (!nav || !hamburger) return;

  const isExpanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('active');

  if (isExpanded) {
    nav.classList.remove('active');
    nav.style.opacity = '0';
    nav.style.transform = 'translate(-100%,0)';
    document.body.style.overflowY = '';
    hamburger.classList.remove('active');
    nav.setAttribute('aria-hidden', 'true');
    closeAllSubmenus(nav); // Close all submenus when mobile nav closes
  } else {
    nav.classList.add('active');
    nav.style.opacity = '1';
    nav.style.transform = 'translate(0,0)';
    document.body.style.overflowY = 'hidden';
    hamburger.classList.add('active');
    nav.setAttribute('aria-hidden', 'false');
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Apply original block classes to the header container
  const headerContainer = document.createElement('header');
  block.classList.forEach(cls => headerContainer.classList.add(cls));
  headerContainer.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  headerContainer.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const mainElement = fragment;
  if (!mainElement) return;

  const sections = Array.from(mainElement.children);
  const brandSection = sections[0];
  const navSection = sections[1];
  const toolsSection = sections[2];

  // Section 1: Brand (Logo)
  if (brandSection) {
    const root = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentation(root, logoDiv);

    const pElement = root.querySelector(':scope > p');
    if (pElement) {
      const aElement = pElement.querySelector(':scope > a');
      if (aElement) {
        const newA = document.createElement('a');
        newA.href = aElement.href;
        logoDiv.appendChild(newA);
        moveInstrumentation(aElement, newA);

        const pictureElement = aElement.querySelector(':scope > picture');
        if (pictureElement) {
          const imgElement = pictureElement.querySelector(':scope > img');
          if (imgElement) {
            const newImg = document.createElement('img');
            newImg.src = imgElement.src;
            newImg.alt = imgElement.alt || 'Mahindra Brand Logo White';
            newImg.title = imgElement.title || 'Mahindra Brand Logo White Image';
            newImg.classList.add('hiddenlogo1');
            newImg.loading = 'lazy';
            newImg.width = imgElement.width || 200;
            newImg.height = imgElement.height || 30;
            newA.appendChild(newImg);
            moveInstrumentation(imgElement, newImg);
          }
        }
      }
    }
    if (logoDiv.children.length > 0) { // Only append if content exists
      wrapDiv.appendChild(logoDiv);
    }
  }

  // Hamburger menu
  hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.appendChild(document.createElement('li'));
  }
  hamburger.appendChild(ulHamburger);
  wrapDiv.appendChild(hamburger);

  // Section 2: Navigation
  nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.id = 'nav'; // Assign ID for mobile toggle
  nav.setAttribute('aria-hidden', 'true'); // Initial state for mobile nav

  navSections = document.createElement('ul');
  navSections.setAttribute('itemscope', '');
  navSections.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  if (navSection) {
    const root = navSection.querySelector(':scope > .default-content-wrapper') || navSection;
    const children = Array.from(root.children);
    let navItemIndex = 0;
    const contentBuffer = [];

    const parseList = (ulElement) => {
      const parsedChildren = [];
      Array.from(ulElement.children).forEach((liEl) => {
        if (liEl.nodeType === Node.ELEMENT_NODE && liEl.tagName === 'LI') {
          const liItem = { title: '', href: null, children: [], content: [] };
          const aTag = liEl.querySelector(':scope > a');
          const strongTag = liEl.querySelector(':scope > strong');
          const nestedUl = liEl.querySelector(':scope > ul');

          if (aTag) {
            liItem.title = aTag.textContent.trim();
            liItem.href = aTag.href;
            moveInstrumentation(aTag, liItem);
          } else if (strongTag) {
            liItem.title = strongTag.textContent.trim();
          } else {
            // Extract direct text nodes and non-UL/A/STRONG elements for title
            liItem.title = Array.from(liEl.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
              .map((node) => node.textContent.trim())
              .join(' ');
          }

          if (nestedUl) {
            liItem.children = parseList(nestedUl);
          }
          parsedChildren.push(liItem);
        }
      });
      return parsedChildren;
    };

    const buildNavItem = (itemData, level = 0) => {
      const li = document.createElement('li');
      li.classList.add(`nav-item-level-${level}`);
      li.setAttribute('itemprop', 'name');

      let triggerElement;
      if (itemData.href) {
        const a = document.createElement('a');
        a.href = itemData.href;
        a.textContent = itemData.title;
        a.classList.add('nav-link');
        li.appendChild(a);
        triggerElement = a;
      } else if (itemData.title) {
        const span = document.createElement('span'); // Use span for non-clickable categories
        span.textContent = itemData.title;
        span.classList.add('nav-category');
        li.appendChild(span);
        triggerElement = span;
      }

      if (itemData.children && itemData.children.length > 0) {
        li.classList.add('has-child');
        li.classList.add('hover-red');
        li.setAttribute('data-once', 'nav-close-search');
        li.setAttribute('aria-haspopup', 'true');
        li.setAttribute('aria-expanded', 'false');

        const spanChevron = document.createElement('span');
        spanChevron.appendChild(createChevronSVG());
        li.appendChild(spanChevron);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        megaMenu.setAttribute('role', 'menu');
        li.appendChild(megaMenu);

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.appendChild(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.appendChild(centerDiv);

        // Handle buffered content for the left-div
        if (level === 0 && contentBuffer.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div', `nav-item-${navItemIndex}-left-div`);
          centerDiv.appendChild(leftDiv);

          contentBuffer.forEach((bufferedNode) => {
            leftDiv.appendChild(bufferedNode.cloneNode(true)); // Append cloned node
          });
          contentBuffer.length = 0; // Clear the buffer after use
        }

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.appendChild(subNavWrap);

        const ul = document.createElement('ul');
        itemData.children.forEach((childItem) => {
          ul.appendChild(buildNavItem(childItem, level + 1));
        });
        subNavWrap.appendChild(ul);
      }
      return li;
    };

    for (let i = 0; i < children.length; i += 1) {
      const el = children[i];
      if (el.nodeType === Node.ELEMENT_NODE) {
        if (el.tagName === 'P') {
          const aTag = el.querySelector(':scope > a');
          const strongTag = el.querySelector(':scope > strong');
          const itemData = { title: '', href: null, children: [] };

          if (aTag) {
            itemData.title = aTag.textContent.trim();
            itemData.href = aTag.href;
            moveInstrumentation(aTag, itemData);
          } else if (strongTag) {
            itemData.title = strongTag.textContent.trim();
          } else {
            // Extract text content from P, ignoring child ULs if present
            itemData.title = Array.from(el.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL'))
              .map(node => node.textContent.trim())
              .join(' ');
          }

          const nextSibling = children[i + 1];
          if (nextSibling && nextSibling.tagName === 'UL') {
            itemData.children = parseList(nextSibling);
            i += 1; // Skip the UL in the main loop
          }

          const li = buildNavItem(itemData, 0);
          navSections.appendChild(li);
          moveInstrumentation(el, li);
          navItemIndex += 1;
        } else if (el.tagName !== 'UL') {
          // Buffer non-navigation elements (like H4, P, DIVs)
          contentBuffer.push(el.cloneNode(true));
        }
      }
    }
  }
  nav.appendChild(navSections);

  // Section 3: Tools (Icons, Search)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulDesktop = document.createElement('ul');
  iconNavDesktop.appendChild(ulDesktop);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulMobile = document.createElement('ul');
  iconNavMobile.appendChild(ulMobile);

  if (toolsSection) {
    const root = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
    const ulElement = root.querySelector(':scope > ul');

    if (ulElement) {
      Array.from(ulElement.children).forEach((liElement) => {
        if (liElement.nodeType === Node.ELEMENT_NODE && liElement.tagName === 'LI') {
          const aTag = liElement.querySelector(':scope > a');
          if (aTag) {
            const liDesktop = document.createElement('li');
            const liMobile = document.createElement('li');
            const aDesktop = document.createElement('a');
            const aMobile = document.createElement('a');

            aDesktop.href = aTag.href;
            aMobile.href = aTag.href;
            aDesktop.title = aTag.title || aTag.textContent.trim();
            aMobile.title = aTag.title || aTag.textContent.trim();

            const linkText = aTag.textContent.toLowerCase().trim();

            if (linkText === 'contact us') {
              liDesktop.classList.add('mail');
              liMobile.classList.add('mail');
              const contactSvg = `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4"
                  style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
                  <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                            C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                            L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
                </svg>
              `;
              aDesktop.innerHTML = contactSvg;
              aDesktop.setAttribute('aria-label', 'Contact Us');
              liDesktop.appendChild(aDesktop);
              ulDesktop.appendChild(liDesktop);

              aMobile.textContent = 'Contact Us'; // Mobile uses text for contact
              aMobile.setAttribute('aria-label', 'Contact Us');
              liMobile.appendChild(aMobile);
              ulMobile.appendChild(liMobile);
            } else if (linkText === 'search') {
              liDesktop.classList.add('search');
              liMobile.classList.add('search');
              liDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
              liMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');

              const searchSvg = `
                <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
                  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
                </svg>
                <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
                  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
                </svg>
                <span data-once="search-stop-propagation"> Search</span>
              `;
              aDesktop.innerHTML = searchSvg;
              aDesktop.setAttribute('aria-label', 'Search');
              liDesktop.appendChild(aDesktop);
              ulDesktop.appendChild(liDesktop);

              aMobile.innerHTML = searchSvg;
              aMobile.setAttribute('aria-label', 'Search');
              liMobile.appendChild(aMobile);
              ulMobile.appendChild(liMobile);

              searchScreenWrap = document.createElement('div');
              searchScreenWrap.classList.add('search-screen-wrap');
              searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
              searchScreenWrap.setAttribute('role', 'dialog');
              searchScreenWrap.setAttribute('aria-modal', 'true');
              searchScreenWrap.setAttribute('aria-hidden', 'true');
              searchScreenWrap.setAttribute('aria-label', 'Search overlay');

              const searchWrapInner = document.createElement('div');
              searchWrapInner.classList.add('wrap');
              searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
              searchScreenWrap.appendChild(searchWrapInner);

              const searchForm = document.createElement('form');
              searchForm.action = 'https://www.mahindra.com/search';
              searchForm.method = 'get';
              searchForm.id = 'search-block-form';
              searchForm.setAttribute('accept-charset', 'UTF-8');
              searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
              searchForm.setAttribute('data-once', 'search-stop-propagation');
              searchWrapInner.appendChild(searchForm);

              const searchInputWrap = document.createElement('div');
              searchInputWrap.classList.add('search-wrap');
              searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
              searchForm.appendChild(searchInputWrap);

              const searchIconDiv = document.createElement('div');
              searchIconDiv.classList.add('search-icon');
              searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
              searchIconDiv.innerHTML = `
                <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
                  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
                </svg>
              `;
              searchInputWrap.appendChild(searchIconDiv);

              searchInput = document.createElement('input');
              searchInput.type = 'text';
              searchInput.classList.add('input-text', 'searchtext');
              searchInput.required = true;
              searchInput.name = 'key';
              searchInput.id = 'searchInput';
              searchInput.autocomplete = 'off';
              searchInput.setAttribute('data-once', 'search-stop-propagation');
              searchInput.setAttribute('aria-label', 'Search input');
              searchInputWrap.appendChild(searchInput);

              const submitButton = document.createElement('button');
              submitButton.classList.add('submit-button');
              submitButton.setAttribute('data-once', 'search-stop-propagation');
              submitButton.setAttribute('aria-label', 'Submit search');
              submitButton.innerHTML = `
                <div class="label" data-once="search-stop-propagation"> Submit </div>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
                  <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
                </svg>
              `;
              searchInputWrap.appendChild(submitButton);

              searchResultBox = document.createElement('div');
              searchResultBox.classList.add('searchResultBox');
              searchResultBox.style.display = 'none';
              searchResultBox.setAttribute('data-once', 'search-stop-propagation');
              searchForm.appendChild(searchResultBox);

              const swiperDiv = document.createElement('div');
              swiperDiv.classList.add('swiper', 'scrollSwiper');
              swiperDiv.setAttribute('data-once', 'search-stop-propagation');
              searchResultBox.appendChild(swiperDiv);

              const swiperWrapper = document.createElement('div');
              swiperWrapper.classList.add('swiper-wrapper');
              swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
              swiperDiv.appendChild(swiperWrapper);

              const swiperSlide = document.createElement('div');
              swiperSlide.classList.add('swiper-slide');
              swiperSlide.setAttribute('data-once', 'search-stop-propagation');
              swiperWrapper.appendChild(swiperSlide);

              const swiperScrollbar = document.createElement('div');
              swiperScrollbar.classList.add('swiper-scrollbar');
              swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
              searchResultBox.appendChild(swiperScrollbar);

              searchSuggestionsWrap = document.createElement('div');
              searchSuggestionsWrap.classList.add('search-suggestions-wrap');
              searchSuggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
              searchSuggestionsWrap.innerHTML = `
                <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul data-once="search-stop-propagation">
                    <li>Business</li>
                    <li>FY 21</li>
                    <li>Brands</li>
                    <li>XUV700</li>
                    <li>Global</li>
                    <li>Nanhi Kali</li>
                  </ul>
                </div>
              `;
              searchWrapInner.appendChild(searchSuggestionsWrap);

              const recommendedSuggestionsWrap = document.createElement('div');
              recommendedSuggestionsWrap.classList.add('search-suggestions-wrap');
              recommendedSuggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
              recommendedSuggestionsWrap.innerHTML = `
                <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul data-once="search-stop-propagation">
                    <li>Annual Report 2021 - 2022</li>
                    <li>Leadership Announcement</li>
                    <li>Latest Press Release</li>
                    <li>Brand Guidelines</li>
                  </ul>
                </div>
              `;
              searchWrapInner.appendChild(recommendedSuggestionsWrap);

              const searchLink = liDesktop.querySelector('a');
              if (searchLink) {
                searchLensIcon = searchLink.querySelector('.lens');
                searchCloseIcon = searchLink.querySelector('.close');
                searchLink.addEventListener('click', (e) => {
                  e.preventDefault();
                  toggleSearchScreen();
                });
              }
              nav.appendChild(searchScreenWrap);
            } else {
              // For other social links, create the <li> and <a> elements
              const liDesktopSocial = document.createElement('li');
              const liMobileSocial = document.createElement('li');
              const aDesktopSocial = document.createElement('a');
              const aMobileSocial = document.createElement('a');

              aDesktopSocial.href = aTag.href;
              aMobileSocial.href = aTag.href;
              aDesktopSocial.title = aTag.title || aTag.textContent.trim();
              aMobileSocial.title = aTag.title || aTag.textContent.trim();

              // Clone all children of the original <a> tag (including SVGs if present)
              Array.from(aTag.children).forEach(child => {
                aDesktopSocial.appendChild(child.cloneNode(true));
                aMobileSocial.appendChild(child.cloneNode(true));
              });
              // If no children (e.g., just text), add text content
              if (aTag.children.length === 0) {
                aDesktopSocial.textContent = aTag.textContent;
                aMobileSocial.textContent = aTag.textContent;
              }

              liDesktopSocial.appendChild(aDesktopSocial);
              ulDesktop.appendChild(liDesktopSocial);

              liMobileSocial.appendChild(aMobileSocial);
              ulMobile.appendChild(liMobileSocial);
            }
          }
        }
      });
    }
  }

  if (ulMobile.children.length > 0) {
    nav.appendChild(iconNavMobile);
  }
  if (ulDesktop.children.length > 0) {
    nav.appendChild(iconNavDesktop);
  }
  wrapDiv.appendChild(nav);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');

  const year80LogoContent = toolsSection.querySelector('.year-80-logo');
  if (year80LogoContent) {
    const year80Link = year80LogoContent.querySelector(':scope > a');
    if (year80Link) {
      const newYear80Link = document.createElement('a');
      newYear80Link.href = year80Link.href;
      year80LogoDiv.appendChild(newYear80Link);

      const year80Img = year80Link.querySelector(':scope > img');
      if (year80Img) {
        const newYear80Img = document.createElement('img');
        newYear80Img.src = year80Img.src;
        newYear80Img.alt = year80Img.alt || '80th Year Logo Gold';
        newYear80Img.title = year80Img.title || '80thYearLogo_Gold';
        newYear80Img.classList.add('hiddenlogo1', 'years-80');
        newYear80Img.width = year80Img.width || 74;
        newYear80Img.height = year80Img.height || 60;
        newYear80Img.loading = 'lazy';
        newYear80Link.appendChild(newYear80Img);
      }
    }
  }
  if (year80LogoDiv.children.length > 0) { // Only append if content exists
    wrapDiv.appendChild(year80LogoDiv);
  }

  containerDiv.appendChild(wrapDiv);
  headerContainer.appendChild(containerDiv);

  block.textContent = ''; // Clear the block content
  block.appendChild(headerContainer);

  // Event Listeners for behavior
  hamburger.addEventListener('click', () => toggleMobileMenu());
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      toggleMobileMenu(true);
    }
  });

  if (searchScreenWrap) {
    searchScreenWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchScreenWrap.classList.contains('active')) {
        toggleSearchScreen(true);
      }
    });
  }

  // Prevent mobile nav behavior on window resize
  const handleResize = () => {
    if (isDesktop.matches) {
      if (nav.classList.contains('active')) {
        toggleMobileMenu(true); // Force close mobile menu
      }
      if (searchScreenWrap && searchScreenWrap.classList.contains('active')) {
        toggleSearchScreen(true); // Force close search screen
      }
      setupDesktopNavBehavior();
    } else {
      setupMobileNavBehavior();
    }
  };

  isDesktop.addEventListener('change', handleResize);
  handleResize(); // Initial setup
}
