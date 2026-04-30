import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

let nav;
let navSections;
let desktopPanelContainer; // Renamed for clarity
let menuList;
let carFilterMenu;
let mobileMenu; // Renamed from 'menu' to avoid conflict with global menu variable
let navRight;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    if (!nav || !navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false); // Collapse all desktop dropdowns
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false); // Close mobile menu
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const currentNav = e.currentTarget;
  if (!currentNav || !navSections) return;
  if (!currentNav.contains(e.relatedTarget)) {
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false); // Collapse all desktop dropdowns
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(currentNav, navSections, false); // Close mobile menu
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused && focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleNavSection(focused, !dropExpanded); // Toggle the specific nav section
  }
}

/**
 * Toggles a single nav section's expanded state.
 * @param {Element} section The nav section element (e.g., .link-title with .nav-drop)
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleNavSection(section, expanded) {
  if (!section) return;
  section.setAttribute('aria-expanded', expanded);
  const panel = section.nextElementSibling;
  if (panel && panel.classList.contains('desktop-panel')) {
    panel.style.display = expanded ? 'flex' : 'none';
    panel.style.opacity = expanded ? '1' : '0';
    panel.style.visibility = expanded ? 'visible' : 'hidden';
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element (navSections)
 * @param {Boolean} expanded Whether the elements should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((section) => {
    toggleNavSection(section, expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} navElement The container element (the <nav> tag)
 * @param {Element} navSectionsElement The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(navElement, navSectionsElement, forceExpanded = null) {
  if (!navElement || !navSectionsElement) return;

  const expanded = forceExpanded !== null ? forceExpanded : navElement.getAttribute('aria-expanded') === 'true';
  const button = navElement.querySelector('.nav-hamburger button');
  if (!button) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  navElement.setAttribute('aria-expanded', expanded);
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');

  // Manage desktop dropdowns
  const navDrops = navSectionsElement.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      drop.setAttribute('tabindex', 0);
      drop.removeEventListener('focus', openOnKeydown); // Remove old listener if any
      drop.addEventListener('keydown', openOnKeydown); // Add keydown for Enter/Space
      drop.addEventListener('mouseenter', () => toggleNavSection(drop, true));
      drop.addEventListener('mouseleave', () => toggleNavSection(drop, false));
      // Ensure panels are hidden by default on desktop load
      toggleNavSection(drop, false);
    });
    // Collapse all nav sections when switching to desktop
    toggleAllNavSections(navSectionsElement, false);
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('keydown', openOnKeydown);
      drop.removeEventListener('mouseenter', () => toggleNavSection(drop, true));
      drop.removeEventListener('mouseleave', () => toggleNavSection(drop, false));
      // Ensure panels are hidden on mobile
      toggleNavSection(drop, false);
    });
  }

  // enable menu collapse on escape keypress
  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    navElement.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    navElement.removeEventListener('focusout', closeOnFocusLost);
  }
}

function moveInstrumentation(sourceElement, targetElement) {
  if (sourceElement && targetElement) {
    const blockStatus = sourceElement.dataset.blockStatus;
    if (blockStatus) {
      targetElement.dataset.blockStatus = blockStatus;
    }
    const blockName = sourceElement.dataset.blockName;
    if (blockName) {
      targetElement.dataset.blockName = blockName;
    }
  }
}

function getDirectTextContent(element) {
  if (!element) return '';
  return Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
    .map(node => node.textContent.trim())
    .join(' ');
}

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function createAndAppend(parent, tagName, classes = [], attributes = {}) {
  const element = document.createElement(tagName);
  if (classes.length > 0) {
    element.classList.add(...classes);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  parent.append(element);
  return element;
}

function parseList(ulElement, parentContainer, isMobile = false) {
  if (!ulElement || !parentContainer) return;

  const items = Array.from(ulElement.children).filter(child => child.nodeType === Node.ELEMENT_NODE);
  const linkGridColumn = createAndAppend(parentContainer, 'div', ['link-grid-column', 'link-column-vertical']);

  const linksContainer = createAndAppend(linkGridColumn, 'ul', ['content', 'links-container', 'accordian-content']);

  items.forEach(li => {
    const liElement = createAndAppend(linksContainer, 'li');
    const anchor = li.querySelector(':scope > a');
    const strong = li.querySelector(':scope > strong');
    const nestedUl = li.querySelector(':scope > ul');

    if (anchor) {
      liElement.append(anchor.cloneNode(true));
    } else if (strong) {
      liElement.append(strong.cloneNode(true));
    } else {
      const textNode = getDirectTextContent(li);
      if (textNode) {
        liElement.textContent = textNode;
      }
    }

    if (nestedUl && !isMobile) { // Only parse nested ULs for desktop if needed, but fragment is flat
      // For this specific header, nested ULs are rendered as flat lists within columns.
      // If true recursion was needed, this would call parseList again.
      Array.from(nestedUl.children).forEach(nestedLi => {
        const nestedLiElement = createAndAppend(linksContainer, 'li');
        const nestedAnchor = nestedLi.querySelector(':scope > a');
        if (nestedAnchor) {
          nestedLiElement.append(nestedAnchor.cloneNode(true));
          const paragraph = nestedLi.querySelector(':scope > p');
          if (paragraph) {
            nestedLiElement.append(paragraph.cloneNode(true));
          }
        } else {
          nestedLiElement.textContent = getDirectTextContent(nestedLi);
        }
      });
    } else {
      const paragraph = li.querySelector(':scope > p');
      if (paragraph) {
        liElement.append(paragraph.cloneNode(true));
      }
    }
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from original HTML
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  nav = createAndAppend(block, 'nav', ['navbar', 'navbar-arena', 'g-container'], { id: 'nav' });

  const fragmentChildren = Array.from(fragment.children).filter(child => child.nodeType === Node.ELEMENT_NODE);

  const brandSection = fragmentChildren[0];
  const navFragmentSection = fragmentChildren[1]; // Renamed to avoid conflict
  const toolsSection = fragmentChildren[2];

  // Hamburger for mobile
  const hamburger = createAndAppend(nav, 'div', ['nav-hamburger']);
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false"><span class="nav-hamburger-icon"></span></button>';

  // Section 1: Brand
  if (brandSection) {
    const logoWrapper = createAndAppend(nav, 'div', ['logo-wrapper']);
    const logoBlock = createAndAppend(logoWrapper, 'div', ['logo', 'block']);
    moveInstrumentation(brandSection, logoBlock);

    const p = brandSection.querySelector(':scope > div > p'); // Adjusted selector for the fragment structure
    if (p) {
      const picture = p.querySelector(':scope > picture');
      const img = picture ? picture.querySelector(':scope > img') : null;
      if (img) {
        const span = createAndAppend(logoBlock, 'span', ['arena']);
        const a = createAndAppend(span, 'a', ['logo__picture'], { href: '/', 'data-logo-name': img.alt || 'Logo' });
        a.append(picture.cloneNode(true));
      }
    }
  }

  // Section 2: Nav Links
  navSections = createAndAppend(nav, 'div', ['links']);
  desktopPanelContainer = createAndAppend(nav, 'div', ['desktop-panel-container']); // Container for all desktop panels

  if (navFragmentSection) {
    const navUl = createAndAppend(navSections, 'ul'); // Wrapper for link-title elements
    let el = navFragmentSection.firstElementChild;
    let navItemIndex = 0;

    while (el) {
      if (el.nodeType === Node.ELEMENT_NODE) {
        if (el.tagName === 'P') {
          const li = createAndAppend(navUl, 'li'); // Each link-title is an LI for desktop
          const linkTitle = createAndAppend(li, 'div', ['link-title']);
          const span = createAndAppend(linkTitle, 'span');
          const anchor = el.querySelector(':scope > a');
          const strong = el.querySelector(':scope > strong');
          let titleText = '';

          if (anchor) {
            span.append(anchor.cloneNode(true));
            titleText = anchor.textContent.trim();
          } else if (strong) {
            span.append(strong.cloneNode(true));
            titleText = strong.textContent.trim();
          } else {
            titleText = getDirectTextContent(el);
            span.textContent = titleText;
          }

          const nextSibling = el.nextElementSibling;
          if (nextSibling && nextSibling.tagName === 'UL') {
            li.classList.add('nav-drop'); // Mark as dropdown trigger
            li.setAttribute('aria-haspopup', 'true');
            li.setAttribute('aria-expanded', 'false'); // Default collapsed

            const panel = createAndAppend(li, 'div', ['desktop-panel', 'panel', sanitizeClassName(titleText)]);
            panel.style.display = 'none'; // Hidden by default
            const linkGridBlock = createAndAppend(panel, 'div', ['link-grid', 'block']);
            moveInstrumentation(navFragmentSection, linkGridBlock); // Instrumentation from parent section

            const linkContainerSection = createAndAppend(linkGridBlock, 'div', ['link-container-section']);

            // Check for horizontal layout for 'Sales'
            if (sanitizeClassName(titleText) === 'sales') {
              const linkGridColumn = createAndAppend(linkContainerSection, 'div', ['link-grid-column', 'link-column-horizontal']);
              parseList(nextSibling, linkGridColumn);
            } else {
              parseList(nextSibling, linkContainerSection);
            }

            // Skip the UL as it's already processed
            el = nextSibling.nextElementSibling;
            continue;
          }
        }
      }
      el = el.nextElementSibling;
    }
  }

  // Section 3: Tools
  navRight = createAndAppend(nav, 'div', ['right'], { id: 'nav-right' });

  if (toolsSection) {
    let currentToolEl = toolsSection.firstElementChild;
    while (currentToolEl) {
      if (currentToolEl.nodeType === Node.ELEMENT_NODE) {
        if (currentToolEl.tagName === 'UL') {
          const toolGroup = createAndAppend(navRight, 'div', ['tool-group']);

          const firstLink = currentToolEl.querySelector(':scope > li > a');
          const firstText = getDirectTextContent(currentToolEl.querySelector(':scope > li'));

          // Social Links
          if (firstLink && (firstLink.href.includes('whatsapp') || firstLink.href.includes('facebook') || firstLink.href.includes('twitter'))) {
            toolGroup.classList.add('social-links');
            const ul = createAndAppend(toolGroup, 'ul', ['user__contact__icons']);
            Array.from(currentToolEl.children).forEach(li => {
              const anchor = li.querySelector(':scope > a');
              if (anchor) {
                const liEl = createAndAppend(ul, 'li');
                const clonedAnchor = anchor.cloneNode(true);
                const iconSpan = createAndAppend(clonedAnchor, 'span', ['sr-only']);
                iconSpan.textContent = anchor.title || anchor.textContent.trim();
                // Add specific icon class if needed, based on href or title
                if (clonedAnchor.title.toLowerCase().includes('whatsapp')) clonedAnchor.classList.add('user__contact--icon', 'whatsapp');
                if (clonedAnchor.title.toLowerCase().includes('facebook')) clonedAnchor.classList.add('user__contact--icon', 'facebook');
                if (clonedAnchor.title.toLowerCase().includes('twitter')) clonedAnchor.classList.add('user__contact--icon', 'twitter');
                liEl.append(clonedAnchor);
              }
            });
          }
          // Contact/Sign-in Group
          else if (firstLink && (firstLink.href.startsWith('tel:') || firstLink.href.startsWith('mailto:')) || firstText.toLowerCase().includes('sign in')) {
            const contactWrapper = createAndAppend(navRight, 'div', ['contact-wrapper']);
            const contactBlock = createAndAppend(contactWrapper, 'div', ['contact', 'block']);
            moveInstrumentation(toolsSection, contactBlock); // Instrumentation from parent section

            const contactWrpArena = createAndAppend(contactBlock, 'div', ['contact_wrp_arena', 'user__contact', 'header']);

            const contactTitle = createAndAppend(contactWrpArena, 'h4', ['user__contact-title']);
            contactTitle.textContent = 'Contact Us'; // Default label

            const phoneIconSpan = createAndAppend(contactWrpArena, 'span', ['user__contact-title', 'icon-phone'], { 'aria-label': 'Contact Us' });

            const userContactIcons = createAndAppend(contactWrpArena, 'div', ['user__contact__icons', 'hidden']);

            const contactToggleBox = createAndAppend(contactWrpArena, 'div', ['hidden', 'contact-toggle-box']);
            const callContainer = createAndAppend(contactToggleBox, 'div', ['user__contact__icon-call_container']);

            let primaryPhoneLink = null;
            let secondaryPhoneLink = null;

            Array.from(currentToolEl.children).forEach(li => {
              const anchor = li.querySelector(':scope > a');
              const text = getDirectTextContent(li);

              if (anchor && anchor.href.startsWith('tel:')) {
                if (!primaryPhoneLink) {
                  primaryPhoneLink = anchor.cloneNode(true);
                  primaryPhoneLink.classList.add('primary-telephone');
                } else if (!secondaryPhoneLink) {
                  secondaryPhoneLink = anchor.cloneNode(true);
                  secondaryPhoneLink.classList.add('secondary-telephone');
                }
                const phoneIcon = createAndAppend(userContactIcons, 'a', ['user__contact--icon', 'phone'], { href: '#' });
                phoneIcon.onclick = (event) => {
                  event.preventDefault();
                  contactToggleBox.classList.toggle('hidden');
                };
                phoneIcon.innerHTML = '<span class="sr-only">phone</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg" alt="phone" loading="lazy">';
              } else if (anchor && anchor.href.includes('wa.me')) {
                const whatsappIcon = createAndAppend(userContactIcons, 'a', ['user__contact--icon', 'whatsapp'], { href: anchor.href, target: '_blank', rel: 'noopener noreferrer' });
                whatsappIcon.innerHTML = '<span class="sr-only">whatsapp</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg" alt="whatsapp" loading="lazy">';
              } else if (anchor && anchor.href.startsWith('mailto:')) {
                const emailIcon = createAndAppend(userContactIcons, 'a', ['user__contact--icon', 'email'], { href: anchor.href });
                emailIcon.innerHTML = '<span class="sr-only">email</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg" alt="email" loading="lazy">';
              } else if (text.toLowerCase().includes('sign in')) {
                // This is the sign-in trigger, the actual sign-in dropdown is handled below
              }
            });

            if (primaryPhoneLink) callContainer.append(primaryPhoneLink);
            if (secondaryPhoneLink) callContainer.append(secondaryPhoneLink);

            // Handle sign-in dropdown separately
            const signInUl = Array.from(currentToolEl.children).find(li => getDirectTextContent(li).toLowerCase().includes('sign in'))?.parentElement;
            if (signInUl) {
              const signInWrapper = createAndAppend(navRight, 'div', ['sign-in-wrapper', 'hidden']);
              const signInBlock = createAndAppend(signInWrapper, 'div', ['sign-in', 'block']);
              moveInstrumentation(toolsSection, signInBlock);

              const userDropdown = createAndAppend(signInBlock, 'div', ['user__dropdown']);
              const userAccount = createAndAppend(userDropdown, 'div', ['user__account']);

              Array.from(signInUl.children).forEach(li => {
                const anchor = li.querySelector(':scope > a');
                if (anchor && !getDirectTextContent(li).toLowerCase().includes('sign in')) { // Exclude the sign-in trigger itself
                  const accountLink = createAndAppend(userAccount, 'a', ['user__account--link', sanitizeClassName(anchor.textContent)], { href: anchor.href, target: anchor.target });
                  accountLink.innerHTML = `<span class="user__account__list-icon"><img src="${anchor.querySelector('img')?.src || ''}" loading="lazy" alt="${anchor.textContent}"></span>${anchor.textContent}`;
                } else if (getDirectTextContent(li).toLowerCase().includes('sign in')) {
                  const signInBtnDiv = createAndAppend(userAccount, 'div', ['user__account--link', 'sign-in-btn']);
                  signInBtnDiv.innerHTML = `<span class="user__account__list-icon"><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg" loading="lazy" alt="Sign-in"></span><button type="button" data-sign-out-text="Sign Out">${getDirectTextContent(li)}</button>`;
                }
              });
            }
          } else {
            // Generic UL for other tools (e.g., app store links)
            toolGroup.append(currentToolEl.cloneNode(true));
          }
        } else if (currentToolEl.tagName === 'P' && currentToolEl.textContent.trim().toLowerCase() === 'en') {
          const languageDiv = createAndAppend(navRight, 'div', ['language']);
          languageDiv.textContent = 'EN';
        }
      }
      currentToolEl = currentToolEl.nextElementSibling;
    }
  }

  // Mobile menu structure
  mobileMenu = createAndAppend(block, 'div', ['menu', 'hidden', 'menu-arena'], { id: 'menu' });

  const menuHeader = createAndAppend(mobileMenu, 'div', ['menu-header']);
  menuHeader.innerHTML = '<div class="back-arrow"></div><span class="menu-title">Menu</span><span class="close-icon"></span>';

  menuList = createAndAppend(mobileMenu, 'ul', ['menu-list']);

  // Populate mobile menu from navSections structure
  navSections.querySelectorAll('.link-title').forEach((linkTitle, index) => {
    const li = createAndAppend(menuList, 'li', ['nav-link'], { id: `menu-item-${index}` });

    const span = createAndAppend(li, 'span', ['menu-title']);
    const anchor = linkTitle.querySelector(':scope > span > a');
    if (anchor) {
      span.append(anchor.cloneNode(true));
      li.classList.add(sanitizeClassName(anchor.textContent));
    } else {
      span.textContent = linkTitle.textContent.trim();
      li.classList.add(sanitizeClassName(linkTitle.textContent));
    }

    // Find the corresponding desktop panel content
    const desktopPanelForThisItem = linkTitle.closest('li.nav-drop')?.querySelector('.desktop-panel');
    if (desktopPanelForThisItem) {
      li.classList.add('accordion');
      const panelDiv = createAndAppend(menuList, 'div', ['panel']);
      // Clone the link-container-section for mobile accordion
      const linkContainerSection = desktopPanelForThisItem.querySelector('.link-container-section');
      if (linkContainerSection) {
        panelDiv.append(linkContainerSection.cloneNode(true));
      }
    }
  });

  // Add sign-in/profile links to mobile menu
  const signInWrapper = navRight.querySelector('.sign-in-wrapper');
  if (signInWrapper) {
    const userAccount = signInWrapper.querySelector('.user__account');
    if (userAccount) {
      Array.from(userAccount.children).forEach(accountLinkOrBtn => {
        const li = createAndAppend(menuList, 'li');
        li.append(accountLinkOrBtn.cloneNode(true));
      });
    }
  }

  // Add event listeners for mobile menu
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('menu-open');
    nav.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
  });

  menuHeader.querySelector('.close-icon').addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
    nav.setAttribute('aria-expanded', 'false');
  });

  menuHeader.querySelector('.back-arrow').addEventListener('click', () => {
    // For now, simply close the menu
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
    nav.setAttribute('aria-expanded', 'false');
  });

  menuList.querySelectorAll('.accordion').forEach(accordion => {
    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');
      const panel = accordion.nextElementSibling;
      if (panel && panel.classList.contains('panel')) {
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      }
    });
  });

  // Car filter menu (if present in original HTML)
  carFilterMenu = createAndAppend(block, 'div', ['car-filter-menu', 'hidden', 'car-filter-arena'], { id: 'carFilterMenu' });
  const carPanelHeader = createAndAppend(carFilterMenu, 'div', ['car-panel-header']);
  createAndAppend(carPanelHeader, 'div'); // Empty div
  createAndAppend(carPanelHeader, 'span', ['car-text']).textContent = 'Cars';
  createAndAppend(carPanelHeader, 'span', ['car-filter-close']).innerHTML = '<img src="/icons/close.svg" alt="close">';

  // Add content to carFilterMenu if it existed in the fragment
  const carFilterFragmentContent = fragmentChildren[3]; // Assuming it's the 4th section if present
  if (carFilterFragmentContent) {
    const searchHeaderBlock = createAndAppend(carFilterMenu, 'div', ['search-header', 'block']);
    moveInstrumentation(carFilterFragmentContent, searchHeaderBlock);

    const linkContainerSection = createAndAppend(searchHeaderBlock, 'div', ['link-container-section']);
    const ulElement = carFilterFragmentContent.querySelector(':scope > div > ul'); // Assuming UL is directly under a div
    if (ulElement) {
      // The car filter menu has multiple columns, so iterate through them
      Array.from(carFilterFragmentContent.children).forEach(child => {
        if (child.tagName === 'DIV' && child.querySelector(':scope > ul')) {
          parseList(child.querySelector(':scope > ul'), linkContainerSection);
        }
      });
    }
  }

  // Initial toggle for desktop/mobile state
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
}
