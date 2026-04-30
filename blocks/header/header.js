import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 991px)'); // Adjusted breakpoint based on CSS

const L0_CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';

const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SEARCH_SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

function moveInstrumentation(originalElement, newElement) {
  if (originalElement && newElement) {
    const dataOnce = originalElement.getAttribute('data-once');
    if (dataOnce) {
      newElement.setAttribute('data-once', dataOnce);
    }
  }
}

function closeAllMenus(nav, navSections, activeClass = 'active') {
  if (!nav || !navSections) return;
  navSections.querySelectorAll(`.${activeClass}`).forEach((section) => {
    section.classList.remove(activeClass);
    section.setAttribute('aria-expanded', 'false');
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
    const subMenu = section.querySelector('.has-sub-child');
    if (subMenu) subMenu.setAttribute('aria-hidden', 'true');
    const innerSubMenu = section.querySelector('.has-inner-sub-child');
    if (innerSubMenu) innerSubMenu.setAttribute('aria-hidden', 'true');
  });
  nav.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  nav.setAttribute('aria-expanded', 'false');
  navSections.setAttribute('aria-hidden', 'true');
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;
  const expanded = forceExpanded !== null ? !forceExpanded : nav.classList.contains('menu-open');
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  if (expanded) {
    nav.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-label', 'Open navigation');
    nav.setAttribute('aria-expanded', 'false');
    navSections.setAttribute('aria-hidden', 'true');
    closeAllMenus(nav, navSections);
  } else {
    nav.classList.add('menu-open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-label', 'Close navigation');
    nav.setAttribute('aria-expanded', 'true');
    navSections.setAttribute('aria-hidden', 'false');
  }
}

function toggleMegaMenu(item, forceExpanded = null) {
  if (!item) return;
  const megaMenu = item.querySelector('.mega-menu');
  if (!megaMenu) return;

  const expanded = forceExpanded !== null ? !forceExpanded : item.classList.contains('active');

  if (expanded) {
    item.classList.remove('active');
    item.setAttribute('aria-expanded', 'false');
    megaMenu.setAttribute('aria-hidden', 'true');
    // Close any active sub-menus within this mega-menu
    megaMenu.querySelectorAll('.top-level-li.active').forEach((subItem) => {
      toggleSubMenu(subItem, false);
    });
  } else {
    // Close other open mega menus at the same level
    item.closest('ul').querySelectorAll('.has-child.active').forEach((openItem) => {
      if (openItem !== item) {
        toggleMegaMenu(openItem, false);
      }
    });

    item.classList.add('active');
    item.setAttribute('aria-expanded', 'true');
    megaMenu.setAttribute('aria-hidden', 'false');
  }
}

function toggleSubMenu(item, forceExpanded = null) {
  if (!item) return;
  const subMenu = item.querySelector('.has-sub-child');
  if (!subMenu) return;

  const expanded = forceExpanded !== null ? !forceExpanded : item.classList.contains('active');

  if (expanded) {
    item.classList.remove('active');
    item.setAttribute('aria-expanded', 'false');
    subMenu.setAttribute('aria-hidden', 'true');
    // Close any active inner sub-menus within this sub-menu
    subMenu.querySelectorAll('.first-level-li.active-child').forEach((innerItem) => {
      toggleInnerSubMenu(innerItem, false);
    });
  } else {
    // Close other open sub-menus at the same level
    item.closest('ul').querySelectorAll('.top-level-li.active').forEach((openItem) => {
      if (openItem !== item) {
        toggleSubMenu(openItem, false);
      }
    });

    item.classList.add('active');
    item.setAttribute('aria-expanded', 'true');
    subMenu.setAttribute('aria-hidden', 'false');
  }
}

function toggleInnerSubMenu(item, forceExpanded = null) {
  if (!item) return;
  const innerSubMenu = item.querySelector('.has-inner-sub-child');
  if (!innerSubMenu) return;

  const expanded = forceExpanded !== null ? !forceExpanded : item.classList.contains('active-child');

  if (expanded) {
    item.classList.remove('active-child');
    item.setAttribute('aria-expanded', 'false');
    innerSubMenu.setAttribute('aria-hidden', 'true');
  } else {
    // Close other open inner sub-menus at the same level
    item.closest('ul').querySelectorAll('.first-level-li.active-child').forEach((openItem) => {
      if (openItem !== item) {
        toggleInnerSubMenu(openItem, false);
      }
    });

    item.classList.add('active-child');
    item.setAttribute('aria-expanded', 'true');
    innerSubMenu.setAttribute('aria-hidden', 'false');
  }
}

function setupSearchToggle(block, searchScreen, searchToggle) {
  if (!searchToggle || !searchScreen) return;
  const body = document.body;

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent immediate closing due to body click listener

    const isSearchOpen = searchScreen.classList.contains('active');
    if (isSearchOpen) {
      searchScreen.classList.remove('active');
      searchScreen.setAttribute('aria-hidden', 'true');
      searchToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('search-open');
    } else {
      searchScreen.classList.add('active');
      searchScreen.setAttribute('aria-hidden', 'false');
      searchToggle.setAttribute('aria-expanded', 'true');
      body.classList.add('search-open');
    }
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchScreen.contains(e.target) && !searchToggle.contains(e.target) && searchScreen.classList.contains('active')) {
      searchScreen.classList.remove('active');
      searchScreen.setAttribute('aria-hidden', 'true');
      searchToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('search-open');
    }
  });

  // Close search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchScreen.classList.contains('active')) {
      searchScreen.classList.remove('active');
      searchScreen.setAttribute('aria-hidden', 'true');
      searchToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('search-open');
    }
  });
}

function getDirectTextContent(element) {
  if (!element) return '';
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

function parseMenu(ulElement) {
  const children = [];
  if (!ulElement) return children;

  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName !== 'LI') return;

    let title = '';
    let href = null;
    let nestedUl = null;

    const link = li.querySelector('a');
    const strong = li.querySelector('strong');

    if (link) {
      title = link.textContent.trim();
      href = link.href;
    } else if (strong) {
      title = strong.textContent.trim();
    } else {
      title = getDirectTextContent(li);
    }

    nestedUl = li.querySelector(':scope > ul'); // Only direct child UL

    const node = {
      title,
      href,
      children: nestedUl ? parseMenu(nestedUl) : [],
      element: li, // Store reference to the original li for later decoration
    };
    children.push(node);
  });
  return children;
}

function sanitizeClassName(text) {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

export default async function decorate(block) {
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up'); // Add root classes from original HTML

  const fragment = await loadFragment('/fragments/header');
  if (!fragment) {
    block.innerHTML = 'Header fragment not found.';
    return;
  }

  const fragmentContainer = document.createElement('div');
  fragmentContainer.innerHTML = fragment.innerHTML;

  const docFrag = document.createDocumentFragment();
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  docFrag.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  const sections = Array.from(fragmentContainer.children);

  // Section 1: Brand Logo
  const brandSection = sections[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandSection.querySelector('a');
    const brandPicture = brandSection.querySelector('picture');
    if (brandLink && brandPicture) {
      const newBrandLink = document.createElement('a');
      newBrandLink.href = brandLink.href;
      moveInstrumentation(brandLink, newBrandLink);

      const newPicture = brandPicture.cloneNode(true);
      const img = newPicture.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.removeAttribute('width'); // Remove inline width
        img.removeAttribute('height'); // Remove inline height
        img.style.width = 'auto'; // Apply original inline style via class or CSS
      }
      newBrandLink.append(newPicture);
      logoDiv.append(newBrandLink);
      wrapDiv.append(logoDiv);
      moveInstrumentation(brandSection, logoDiv);
    }
  }

  // Hamburger for mobile
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Section 2: Main Navigation
  const navSection = sections[1];
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  navElement.setAttribute('aria-expanded', 'false'); // Initial state for mobile
  navElement.setAttribute('aria-hidden', 'true'); // Initial state for mobile
  wrapDiv.append(navElement);

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(mainUl);

  let currentSibling = navSection ? navSection.firstElementChild : null;
  let contentBuffer = [];
  let searchScreenWrapInstance = null; // To hold the single instance of search screen

  while (currentSibling) {
    if (currentSibling.nodeType === Node.ELEMENT_NODE && currentSibling.tagName === 'P') {
      const l0Link = currentSibling.querySelector('a');
      const l0Strong = currentSibling.querySelector('strong');
      let l0Label = '';
      let l0Href = null;

      if (l0Link) {
        l0Label = l0Link.textContent.trim();
        l0Href = l0Link.href;
      } else if (l0Strong) {
        l0Label = l0Strong.textContent.trim();
      } else {
        l0Label = getDirectTextContent(currentSibling);
      }

      const l0Li = document.createElement('li');
      l0Li.classList.add('has-child', 'hover-red');
      l0Li.setAttribute('itemprop', 'name');
      l0Li.setAttribute('data-once', 'nav-close-search');
      l0Li.setAttribute('aria-expanded', 'false');
      // aria-hidden is for the mega-menu content, not the li itself
      // l0Li.setAttribute('aria-hidden', 'true');

      const l0Anchor = document.createElement('a');
      l0Anchor.setAttribute('itemprop', 'url');
      if (l0Href) {
        l0Anchor.href = l0Href;
      } else {
        l0Anchor.href = '#'; // Fallback for non-clickable categories
      }
      l0Anchor.textContent = l0Label;
      moveInstrumentation(l0Link || currentSibling, l0Anchor); // Move data-once from original link/p
      l0Li.append(l0Anchor);

      // Check for next sibling UL (mega-menu content)
      let nextSiblingElement = currentSibling.nextElementSibling;
      while (nextSiblingElement && nextSiblingElement.nodeType !== Node.ELEMENT_NODE) {
        nextSiblingElement = nextSiblingElement.nextElementSibling; // Skip text nodes, comments
      }

      if (nextSiblingElement && nextSiblingElement.tagName === 'UL') {
        l0Li.classList.add('has-child'); // Ensure has-child if it has a mega-menu
        const chevronSpan = document.createElement('span');
        chevronSpan.innerHTML = L0_CHEVRON_SVG;
        l0Li.append(chevronSpan);

        const megaMenuDiv = document.createElement('div');
        megaMenuDiv.classList.add('mega-menu');
        megaMenuDiv.setAttribute('aria-hidden', 'true');

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenuDiv.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        // Add specific class based on L0 label
        const leftDivClass = sanitizeClassName(l0Label) + '-left-div';
        if (leftDivClass) leftDiv.classList.add(leftDivClass);

        // Flush buffered content into left-div
        contentBuffer.forEach(bufferedNode => {
          leftDiv.append(bufferedNode);
        });
        contentBuffer = []; // Clear buffer

        centerDiv.append(leftDiv);

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        // Add specific class based on L0 label
        const subNavClass = sanitizeClassName(l0Label) + '-sub-nav';
        if (subNavClass) subNavWrap.classList.add(subNavClass);

        centerDiv.append(subNavWrap);

        // Parse the UL content for sub-navigation
        const parsedMenu = parseMenu(nextSiblingElement);

        parsedMenu.forEach((level1Node) => {
          const l1Ul = document.createElement('ul');
          const l1Li = document.createElement('li');
          if (level1Node.href) {
            const l1Anchor = document.createElement('a');
            l1Anchor.href = level1Node.href;
            l1Anchor.textContent = level1Node.title;
            moveInstrumentation(level1Node.element.querySelector('a') || level1Node.element, l1Anchor);
            l1Li.append(l1Anchor);
          } else if (level1Node.title) {
            const l1Strong = document.createElement('strong');
            l1Strong.textContent = level1Node.title;
            moveInstrumentation(level1Node.element.querySelector('strong') || level1Node.element, l1Strong);
            l1Li.append(l1Strong);
          }

          if (level1Node.children && level1Node.children.length > 0) {
            l1Li.classList.add('top-level-li');
            l1Li.setAttribute('aria-expanded', 'false');
            const chevronSpan = document.createElement('span');
            chevronSpan.innerHTML = L0_CHEVRON_SVG;
            l1Li.append(chevronSpan);

            const hasSubChildDiv = document.createElement('div');
            hasSubChildDiv.classList.add('has-sub-child');
            hasSubChildDiv.setAttribute('aria-hidden', 'true');

            level1Node.children.forEach((level2Node) => {
              const l2Ul = document.createElement('ul');
              const l2Li = document.createElement('li');
              if (level2Node.href) {
                const l2Anchor = document.createElement('a');
                l2Anchor.href = level2Node.href;
                l2Anchor.textContent = level2Node.title;
                moveInstrumentation(level2Node.element.querySelector('a') || level2Node.element, l2Anchor);
                l2Li.append(l2Anchor);
              } else if (level2Node.title) {
                const l2Strong = document.createElement('strong');
                l2Strong.textContent = level2Node.title;
                moveInstrumentation(level2Node.element.querySelector('strong') || level2Node.element, l2Strong);
                l2Li.append(l2Strong);
              }

              if (level2Node.children && level2Node.children.length > 0) {
                l2Li.classList.add('first-level-li');
                l2Li.setAttribute('aria-expanded', 'false');
                const chevronSpan2 = document.createElement('span');
                chevronSpan2.innerHTML = L0_CHEVRON_SVG;
                l2Li.append(chevronSpan2);

                const hasInnerSubChildDiv = document.createElement('div');
                hasInnerSubChildDiv.classList.add('has-inner-sub-child');
                hasInnerSubChildDiv.setAttribute('aria-hidden', 'true');

                const l3Ul = document.createElement('ul');
                level2Node.children.forEach((level3Node) => {
                  const l3Li = document.createElement('li');
                  if (level3Node.href) {
                    const l3Anchor = document.createElement('a');
                    l3Anchor.href = level3Node.href;
                    l3Anchor.textContent = level3Node.title;
                    moveInstrumentation(level3Node.element.querySelector('a') || level3Node.element, l3Anchor);
                    l3Li.append(l3Anchor);
                  } else if (level3Node.title) {
                    const l3Strong = document.createElement('strong');
                    l3Strong.textContent = level3Node.title;
                    moveInstrumentation(level3Node.element.querySelector('strong') || level3Node.element, l3Strong);
                    l3Li.append(l3Strong);
                  }
                  l3Ul.append(l3Li);
                });
                hasInnerSubChildDiv.append(l3Ul);
                l2Li.append(hasInnerSubChildDiv);

                chevronSpan2.addEventListener('click', () => toggleInnerSubMenu(l2Li));
                l2Li.addEventListener('click', (e) => {
                  if (!e.target.closest('a') && !isDesktop.matches) {
                    toggleInnerSubMenu(l2Li);
                  }
                });
              }
              l2Ul.append(l2Li);
              hasSubChildDiv.append(l2Ul);
            });
            l1Li.append(hasSubChildDiv);

            chevronSpan.addEventListener('click', () => toggleSubMenu(l1Li));
            l1Li.addEventListener('click', (e) => {
              if (!e.target.closest('a') && !isDesktop.matches) {
                toggleSubMenu(l1Li);
              }
            });
          }
          l1Ul.append(l1Li);
          subNavWrap.append(l1Ul);
        });

        l0Li.append(megaMenuDiv);
        mainUl.append(l0Li);

        // Advance currentSibling past the consumed UL
        currentSibling = nextSiblingElement.nextElementSibling;
      } else {
        // No mega-menu, just a top-level link
        mainUl.append(l0Li);
        currentSibling = currentSibling.nextElementSibling;
      }

      // Add event listener for mega menu toggle
      if (l0Li.classList.contains('has-child')) {
        l0Li.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleMegaMenu(l0Li, true);
          }
        });
        l0Li.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            toggleMegaMenu(l0Li, false);
          }
        });
        l0Li.addEventListener('click', (e) => {
          if (!isDesktop.matches && !e.target.closest('a')) {
            toggleMegaMenu(l0Li);
          }
        });
      }
    } else {
      // Buffer non-navigation content (e.g., headings, paragraphs for left-div)
      contentBuffer.push(currentSibling.cloneNode(true));
      currentSibling = currentSibling.nextElementSibling;
    }
  }

  // Section 3: Tools and 80th Year Logo
  const toolsSection = sections[2];
  if (toolsSection) {
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
    const desktopUl = document.createElement('ul');
    desktopIconNav.append(desktopUl);

    const mobileIconNav = document.createElement('div');
    mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
    const mobileUl = document.createElement('ul');
    mobileIconNav.append(mobileUl);

    // Create search screen structure once
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.setAttribute('aria-hidden', 'true');
    searchScreenWrapInstance = searchScreenWrap; // Store reference

    const searchScreenInnerWrap = document.createElement('div');
    searchScreenInnerWrap.classList.add('wrap');
    searchScreenInnerWrap.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchScreenInnerWrap);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search'; // Hardcoded, but from original HTML
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchScreenInnerWrap.append(searchForm);

    const searchWrap = document.createElement('div');
    searchWrap.classList.add('search-wrap');
    searchWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    searchIconDiv.innerHTML = SEARCH_LENS_SVG;
    searchWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = 'Submit'; // Hardcoded, but from original HTML
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitButton.append(submitLabel);
    submitButton.append(SEARCH_SUBMIT_ARROW_SVG);
    searchWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Controlled by JS
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.innerHTML = `
      <div class="swiper scrollSwiper" data-once="search-stop-propagation">
        <div class="swiper-wrapper" data-once="search-stop-propagation">
          <div class="swiper-slide" data-once="search-stop-propagation"></div>
        </div>
      </div>
      <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
    `;
    searchForm.append(searchResultBox);

    // Extract popular and recommended keywords from fragment
    const popularKeywordsSection = toolsSection.querySelector('.search-suggestions-wrap:nth-of-type(1)');
    if (popularKeywordsSection) {
      const popularKeywords = popularKeywordsSection.cloneNode(true);
      searchScreenInnerWrap.append(popularKeywords);
    }

    const recommendedKeywordsSection = toolsSection.querySelector('.search-suggestions-wrap:nth-of-type(2)');
    if (recommendedKeywordsSection) {
      const recommendedKeywords = recommendedKeywordsSection.cloneNode(true);
      searchScreenInnerWrap.append(recommendedKeywords);
    }

    Array.from(toolsSection.children).forEach((ulElement) => {
      if (ulElement.tagName === 'UL') {
        Array.from(ulElement.children).forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const desktopLi = document.createElement('li');
            const mobileLi = document.createElement('li');
            const desktopLink = document.createElement('a');
            desktopLink.href = link.href;
            moveInstrumentation(link, desktopLink);
            const mobileLink = document.createElement('a');
            mobileLink.href = link.href;
            moveInstrumentation(link, mobileLink);

            if (link.textContent.trim().toLowerCase() === 'contact us') {
              desktopLi.classList.add('mail');
              desktopLink.innerHTML = MAIL_SVG;
              mobileLi.classList.add('mail');
              mobileLink.textContent = link.textContent.trim(); // Mobile shows text
            } else if (link.textContent.trim().toLowerCase() === 'search') {
              desktopLi.classList.add('search');
              desktopLink.setAttribute('data-once', 'search-toggle search-stop-propagation');
              desktopLink.setAttribute('aria-expanded', 'false');
              desktopLink.innerHTML = SEARCH_LENS_SVG;
              desktopLink.innerHTML += SEARCH_CLOSE_SVG;

              mobileLi.classList.add('search');
              mobileLink.setAttribute('data-once', 'search-toggle search-stop-propagation');
              mobileLink.setAttribute('aria-expanded', 'false');
              mobileLink.innerHTML = SEARCH_LENS_SVG;
              mobileLink.innerHTML += SEARCH_CLOSE_SVG;
              const mobileSearchSpan = document.createElement('span');
              mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
              mobileSearchSpan.textContent = link.textContent.trim();
              mobileLink.append(mobileSearchSpan);

              // Setup search toggle for both desktop and mobile links
              setupSearchToggle(block, searchScreenWrapInstance, desktopLink);
              setupSearchToggle(block, searchScreenWrapInstance, mobileLink);
            }
            desktopUl.append(desktopLi);
            mobileUl.append(mobileLi);
          }
        });
      }
    });

    navElement.append(mobileIconNav);
    wrapDiv.append(desktopIconNav);
    wrapDiv.append(searchScreenWrapInstance); // Append search screen to wrapDiv

    // 80th Year Logo
    const year80LogoContainer = toolsSection.querySelector('.logo.year-80-logo');
    if (year80LogoContainer) {
      const year80LogoDiv = document.createElement('div');
      year80LogoDiv.classList.add('logo', 'year-80-logo');
      const year80Link = year80LogoContainer.querySelector('a');
      const year80Picture = year80LogoContainer.querySelector('picture');

      if (year80Link && year80Picture) {
        const newYear80Link = document.createElement('a');
        newYear80Link.href = year80Link.href;
        moveInstrumentation(year80Link, newYear80Link);

        const newPicture = year80Picture.cloneNode(true);
        const img = newPicture.querySelector('img');
        if (img) {
          img.classList.add('hiddenlogo1', 'years-80');
          img.removeAttribute('width'); // Remove inline width
          img.removeAttribute('height'); // Remove inline height
        }
        newYear80Link.append(newPicture);
        year80LogoDiv.append(newYear80Link);
        wrapDiv.append(year80LogoDiv);
        moveInstrumentation(year80LogoContainer, year80LogoDiv);
      }
    }
  }

  block.textContent = ''; // Clear original block content
  block.append(docFrag);

  // Add event listeners for mobile menu toggle
  hamburgerDiv.addEventListener('click', () => toggleMenu(navElement, mainUl));

  // Close menu on resize for desktop
  isDesktop.addEventListener('change', () => {
    toggleMenu(navElement, mainUl, isDesktop.matches);
    if (isDesktop.matches) {
      closeAllMenus(navElement, mainUl); // Ensure all sub-menus are closed on desktop
    }
  });

  // Initial state for desktop/mobile
  toggleMenu(navElement, mainUl, isDesktop.matches);

  // Close all menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navElement.classList.contains('menu-open')) {
      toggleMenu(navElement, mainUl, true); // Force close
    }
  });
}
