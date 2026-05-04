import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Global variables for elements that might be accessed across different functions
let navWrapper = null;
let nav = null;
let navSections = null;
let menu = null;
let carFilterMenu = null;
let hamburgerButton = null;
let menuCloseButton = null;
let menuBackButton = null;
let carFilterCloseButton = null;
let contactWrapper = null;
let contactTitle = null;
let contactIcons = null;
let contactToggleBox = null;
let signInWrapper = null;

const isDesktop = window.matchMedia('(min-width: 1200px)'); // Adjusted breakpoint based on CSS

function sanitizeClassName(str) {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || null;
}

function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  const cqDecorated = originalElement.getAttribute('data-cq-decorated');
  if (cqDecorated) {
    newElement.setAttribute('data-cq-decorated', cqDecorated);
  }
  const cqPath = originalElement.getAttribute('data-cq-path');
  if (cqPath) {
    newElement.setAttribute('data-cq-path', cqPath);
  }
}

function closeAllMenus() {
  if (navWrapper) {
    navWrapper.classList.remove('menu-open');
  }
  if (menu) {
    menu.classList.add('hidden');
    menu.querySelectorAll('.panel').forEach((panel) => {
      panel.style.maxHeight = null;
      panel.classList.remove('active');
    });
    menu.querySelectorAll('.accordion').forEach((accordion) => {
      accordion.classList.remove('active');
    });
    if (menuBackButton) menuBackButton.classList.add('hidden');
    if (menuCloseButton) menuCloseButton.classList.remove('hidden');
    if (menu.querySelector('.menu-list')) {
      menu.querySelector('.menu-list').classList.remove('hidden');
    }
    if (menu.querySelector('.menu-title')) {
      menu.querySelector('.menu-title').textContent = 'Menu';
    }
  }
  if (carFilterMenu) {
    carFilterMenu.classList.add('hidden');
  }
  if (document.body) {
    document.body.style.overflowY = '';
  }
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.setAttribute('aria-label', 'Open navigation');
  }
}

function toggleMenu(forceExpanded = null) {
  if (!navWrapper || !menu) return;

  const expanded = forceExpanded !== null ? !forceExpanded : navWrapper.classList.contains('menu-open');

  if (expanded) {
    closeAllMenus();
  } else {
    closeAllMenus(); // Ensure other menus are closed
    navWrapper.classList.add('menu-open');
    menu.classList.remove('hidden');
    document.body.style.overflowY = 'hidden';
    if (hamburgerButton) {
      hamburgerButton.setAttribute('aria-expanded', 'true');
      hamburgerButton.setAttribute('aria-label', 'Close navigation');
    }
  }
}

function toggleCarFilterMenu() {
  if (!carFilterMenu) return;
  const isHidden = carFilterMenu.classList.contains('hidden');
  if (isHidden) {
    closeAllMenus(); // Close other menus before opening car filter
    carFilterMenu.classList.remove('hidden');
    document.body.style.overflowY = 'hidden';
  } else {
    carFilterMenu.classList.add('hidden');
    document.body.style.overflowY = '';
  }
}

function setupAccordion(accordion, panel) {
  if (!accordion || !panel) return;
  accordion.addEventListener('click', () => {
    accordion.classList.toggle('active');
    panel.classList.toggle('active');
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
}

function setupMobileNavAccordion(accordion, panel, titleText) {
  if (!accordion || !panel || !menuBackButton || !menuCloseButton || !menu.querySelector('.menu-list')) return;

  accordion.addEventListener('click', () => {
    menu.querySelector('.menu-list').classList.add('hidden');
    panel.classList.add('active');
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    menuBackButton.classList.remove('hidden');
    menuCloseButton.classList.add('hidden');
    if (menu.querySelector('.menu-title')) {
      menu.querySelector('.menu-title').textContent = titleText;
    }
  });
}

function setupContactToggle(contactTrigger, contactTarget) {
  if (!contactTrigger || !contactTarget) return;
  contactTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    contactTarget.classList.toggle('hidden');
  });
}

function parseList(ulElement) {
  const items = [];
  Array.from(ulElement.children).forEach((liElement) => {
    if (liElement.tagName === 'LI') {
      const item = {};
      const anchor = liElement.querySelector(':scope > a');
      const strong = liElement.querySelector(':scope > strong');

      if (anchor) {
        item.title = anchor.textContent.trim();
        item.href = anchor.href;
        item.originalElement = anchor;
      } else if (strong) {
        item.title = strong.textContent.trim();
        item.href = null;
        item.originalElement = strong;
      } else {
        // Extract direct text nodes for list items without <a> or <strong>
        const textNodes = Array.from(liElement.childNodes).filter(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
        );
        item.title = textNodes.map((node) => node.textContent.trim()).join(' ');
        item.href = null;
        item.originalElement = liElement;
      }

      const nestedUl = liElement.querySelector(':scope > ul');
      if (nestedUl) {
        item.children = parseList(nestedUl);
      } else {
        item.children = [];
      }
      items.push(item);
    }
  });
  return items;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from original HTML
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');

  // Load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Create a document fragment to build the new DOM
  const newDomFragment = document.createDocumentFragment();

  // Create the main header container
  const headerDiv = document.createElement('div');
  const cls = sanitizeClassName('corp-header');
  if (cls) headerDiv.classList.add(cls, 'block');
  headerDiv.setAttribute('data-block-name', 'corp-header');
  headerDiv.setAttribute('data-block-status', 'loaded');
  newDomFragment.append(headerDiv);

  // Create the navbar container
  const navbarDiv = document.createElement('div');
  navbarDiv.classList.add('navbar', 'navbar-arena', 'g-container');
  headerDiv.append(navbarDiv);

  // --- Section 1: Brand (Logo) ---
  const sections = fragment.querySelectorAll(':scope > .section');
  const brandSection = sections[0];
  const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
  moveInstrumentation(brandSection, headerDiv); // Apply instrumentation to the main header div

  if (brandRoot) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    navbarDiv.append(logoWrapper);

    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    logoBlock.setAttribute('data-block-name', 'logo');
    logoBlock.setAttribute('data-block-status', 'loaded');
    logoWrapper.append(logoBlock);
    moveInstrumentation(brandRoot.firstElementChild, logoBlock); // Instrumentation for logo block

    const spanArena = document.createElement('span');
    spanArena.classList.add('arena');
    logoBlock.append(spanArena);

    // Find the logo link and picture within the brandRoot
    const logoLink = brandRoot.querySelector(':scope a.button');
    const picture = brandRoot.querySelector(':scope picture');

    if (logoLink && picture) {
      const a = document.createElement('a');
      a.classList.add('logo__picture');
      a.href = logoLink.href;
      a.setAttribute('data-logo-name', 'Arena');
      a.append(picture.cloneNode(true)); // Clone picture to avoid moving it from fragment
      spanArena.append(a);
      moveInstrumentation(logoLink, a); // Instrumentation for logo link
    } else if (picture) { // If no link, but picture exists, still render it
      const a = document.createElement('a');
      a.classList.add('logo__picture');
      a.href = '/'; // Default to home if no link
      a.setAttribute('data-logo-name', 'Arena');
      a.append(picture.cloneNode(true));
      spanArena.append(a);
    }
  }

  // --- Hamburger for mobile ---
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  hamburger.append(hamburgerButton);
  navbarDiv.prepend(hamburger);

  // --- Section 2: Navigation ---
  navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');
  nav = document.createElement('nav');
  nav.id = 'nav';
  navWrapper.append(nav);

  navSections = document.createElement('div');
  navSections.classList.add('links'); // Matches original HTML structure
  navbarDiv.append(navSections);
  moveInstrumentation(sections[1], navSections); // Instrumentation for nav sections

  const navSectionRoot = sections[1].querySelector(':scope > .default-content-wrapper') || sections[1];
  const navItemsData = [];

  // Iterate through children of navSectionRoot to find navigation items and their panels
  Array.from(navSectionRoot.children).forEach((child) => {
    if (child.tagName === 'P') {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('link-title');
      moveInstrumentation(child, titleDiv); // Instrumentation for link-title div

      const anchor = child.querySelector(':scope > a');
      if (anchor) {
        const span = document.createElement('span');
        span.append(anchor.cloneNode(true));
        titleDiv.append(span);
        navSections.append(titleDiv);
        moveInstrumentation(anchor, span.firstElementChild); // Instrumentation for anchor
        navItemsData.push({ type: 'link', titleElement: titleDiv, panel: null, originalElement: child.cloneNode(true) });
      } else {
        const span = document.createElement('span');
        // Use cloneNode(true) to preserve potential child elements like <strong> or <img>
        span.append(child.cloneNode(true));
        titleDiv.append(span);
        navSections.append(titleDiv);
        navItemsData.push({ type: 'category', titleElement: titleDiv, panel: null, originalElement: child.cloneNode(true) });
      }

      const nextSibling = child.nextElementSibling;
      if (nextSibling && nextSibling.tagName === 'UL') {
        const panel = document.createElement('div');
        panel.classList.add('desktop-panel', 'panel');
        const panelClass = sanitizeClassName(child.textContent.trim());
        if (panelClass) panel.classList.add(panelClass);
        navSections.append(panel);
        navItemsData[navItemsData.length - 1].panel = panel;
        moveInstrumentation(nextSibling, panel); // Instrumentation for the panel

        const linkGridBlock = document.createElement('div');
        linkGridBlock.classList.add('link-grid', 'block');
        panel.append(linkGridBlock);

        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        linkGridBlock.append(linkContainerSection);

        // Handle multiple columns within a panel
        Array.from(nextSibling.children).forEach((li) => {
          const nestedUl = li.querySelector(':scope > ul');
          if (nestedUl) {
            const linkGridColumn = document.createElement('div');
            linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
            linkContainerSection.append(linkGridColumn);

            const ul = document.createElement('ul');
            ul.classList.add('content', 'links-container', 'accordian-content');
            linkGridColumn.append(ul);

            const parsedItems = parseList(nestedUl);
            parsedItems.forEach((item) => {
              const liEl = document.createElement('li');
              const a = document.createElement('a');
              a.href = item.href || '#';
              a.textContent = item.title;
              liEl.append(a);
              ul.append(liEl);
              moveInstrumentation(item.originalElement, liEl); // Instrumentation for list item
              // Append any <p> tags that are direct siblings of the <a> tag in the fragment
              const originalP = item.originalElement.nextElementSibling;
              if (originalP && originalP.tagName === 'P') {
                liEl.append(originalP.cloneNode(true));
              }
            });
          } else {
            // Handle direct <li> children of the main UL if they exist without nested ULs
            const linkGridColumn = document.createElement('div');
            linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
            linkContainerSection.append(linkGridColumn);

            const ul = document.createElement('ul');
            ul.classList.add('content', 'links-container', 'accordian-content');
            linkGridColumn.append(ul);

            const liEl = document.createElement('li');
            const a = document.createElement('a');
            const originalAnchor = li.querySelector(':scope > a');
            if (originalAnchor) {
              a.href = originalAnchor.href;
              a.textContent = originalAnchor.textContent.trim();
              liEl.append(a);
              ul.append(liEl);
              moveInstrumentation(originalAnchor, liEl);
              const originalP = originalAnchor.nextElementSibling;
              if (originalP && originalP.tagName === 'P') {
                liEl.append(originalP.cloneNode(true));
              }
            }
          }
        });
      }
    }
  });

  // --- Section 3: Tools ---
  const toolsSection = sections[2];
  const toolsRoot = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
  moveInstrumentation(toolsSection, navbarDiv); // Instrumentation for tools section

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';
  navbarDiv.append(rightDiv);

  if (toolsRoot) {
    // Contact Wrapper
    contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    rightDiv.append(contactWrapper);

    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    contactBlock.setAttribute('data-block-name', 'contact');
    contactBlock.setAttribute('data-block-status', 'loaded');
    contactWrapper.append(contactBlock);
    moveInstrumentation(toolsRoot.firstElementChild, contactBlock); // Instrumentation for contact block

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
    contactBlock.append(contactWrpArena);

    contactTitle = document.createElement('h4');
    contactTitle.classList.add('user__contact-title');
    const contactTitleText = toolsRoot.querySelector(':scope > p:first-child')?.textContent.trim() || 'Contact Us';
    contactTitle.textContent = contactTitleText;
    contactWrpArena.append(contactTitle);

    const iconPhone = document.createElement('span');
    iconPhone.classList.add('user__contact-title', 'icon-phone');
    iconPhone.setAttribute('aria-label', contactTitleText);
    contactWrpArena.append(iconPhone);

    contactIcons = document.createElement('div');
    contactIcons.classList.add('user__contact__icons', 'hidden');
    contactWrpArena.append(contactIcons);

    contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('hidden', 'contact-toggle-box');
    contactWrpArena.append(contactToggleBox);

    const toolLists = toolsRoot.querySelectorAll(':scope > ul');
    const telephoneLinks = [];

    toolLists.forEach((ul) => {
      Array.from(ul.children).forEach((li) => {
        const a = li.querySelector(':scope > a');
        if (a) {
          const href = a.href;
          const title = a.title || a.textContent.trim();

          const iconAnchor = document.createElement('a');
          iconAnchor.href = href;
          iconAnchor.classList.add('user__contact--icon');
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add('sr-only');
          srOnlySpan.textContent = title;
          iconAnchor.append(srOnlySpan);
          moveInstrumentation(a, iconAnchor); // Instrumentation for icon anchor

          let iconSrc = '';
          let iconAlt = '';
          if (href.includes('whatsapp')) {
            iconAnchor.classList.add('whatsapp');
            iconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg';
            iconAlt = 'whatsapp';
          } else if (href.includes('mailto')) {
            iconAnchor.classList.add('email');
            iconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg';
            iconAlt = 'email';
          } else if (href.startsWith('tel:')) {
            iconAnchor.classList.add('phone');
            iconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg';
            iconAlt = 'phone';
            iconAnchor.onclick = (event) => {
              event.preventDefault();
              contactToggleBox.classList.toggle('hidden');
            };
            telephoneLinks.push(a.cloneNode(true)); // Store for toggle box
          }

          if (iconSrc) {
            const img = document.createElement('img');
            img.src = iconSrc;
            img.alt = iconAlt;
            img.loading = 'lazy';
            iconAnchor.append(img);
          }
          contactIcons.append(iconAnchor);
        }
      });
    });

    // Populate contact toggle box
    const userContactIconCallContainer = document.createElement('div');
    userContactIconCallContainer.classList.add('user__contact__icon-call_container');
    contactToggleBox.append(userContactIconCallContainer);

    telephoneLinks.forEach((telLink, index) => {
      const telAnchor = document.createElement('a');
      telAnchor.href = telLink.href;
      telAnchor.textContent = telLink.textContent.trim();
      if (index === 0) {
        telAnchor.classList.add('primary-telephone');
      } else {
        telAnchor.classList.add('secondary-telephone');
      }
      userContactIconCallContainer.append(telAnchor);
      moveInstrumentation(telLink, telAnchor);
    });

    // Language selector
    const languageDiv = document.createElement('div');
    languageDiv.classList.add('language');
    const languageP = toolsRoot.querySelector(':scope > p:nth-child(2)'); // Assuming language is the second P after contact title
    languageDiv.textContent = languageP ? languageP.textContent.trim() : 'EN';
    rightDiv.append(languageDiv);

    // Sign-in Wrapper
    signInWrapper = document.createElement('div');
    signInWrapper.classList.add('sign-in-wrapper', 'hidden');
    rightDiv.append(signInWrapper);

    const signInBlock = document.createElement('div');
    signInBlock.classList.add('sign-in', 'block');
    signInBlock.setAttribute('data-block-name', 'sign-in');
    signInBlock.setAttribute('data-block-status', 'loaded');
    signInWrapper.append(signInBlock);

    const userDropdown = document.createElement('div');
    userDropdown.classList.add('user__dropdown');
    signInBlock.append(userDropdown);

    const userAccount = document.createElement('div');
    userAccount.classList.add('user__account');
    userDropdown.append(userAccount);

    const signInList = toolsRoot.querySelector(':scope > ul:last-of-type'); // Assuming sign-in links are in the last UL
    if (signInList) {
      Array.from(signInList.children).forEach((li) => {
        const a = li.querySelector(':scope > a');
        if (a) {
          const signInLink = document.createElement('a');
          signInLink.href = a.href;
          signInLink.classList.add('user__account--link');
          if (a.textContent.trim().toLowerCase().includes('reach us')) {
            signInLink.classList.add('reach', 'us');
          } else if (a.textContent.trim().toLowerCase().includes('profile')) {
            signInLink.classList.add('profile');
          }
          signInLink.target = a.target;
          signInLink.rel = a.rel;

          const spanIcon = document.createElement('span');
          spanIcon.classList.add('user__account__list-icon');
          const img = a.querySelector(':scope img');
          if (img) {
            spanIcon.append(img.cloneNode(true));
          }
          signInLink.append(spanIcon);
          signInLink.append(document.createTextNode(a.textContent.trim())); // Append text content
          userAccount.append(signInLink);
          moveInstrumentation(a, signInLink);
        } else {
          const button = li.querySelector(':scope > button');
          if (button) {
            const signInBtnDiv = document.createElement('div');
            signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
            const spanIcon = document.createElement('span');
            spanIcon.classList.add('user__account__list-icon');
            const img = li.querySelector(':scope img');
            if (img) {
              spanIcon.append(img.cloneNode(true));
            }
            signInBtnDiv.append(spanIcon);
            const signInButton = document.createElement('button');
            signInButton.type = 'button';
            signInButton.setAttribute('data-sign-out-text', button.getAttribute('data-sign-out-text') || 'Sign Out');
            signInButton.textContent = button.textContent.trim();
            signInBtnDiv.append(signInButton);
            userAccount.append(signInBtnDiv);
            moveInstrumentation(button, signInButton);
          }
        }
      });
    }
  }

  // Car Filter Menu
  carFilterMenu = document.createElement('div');
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');
  carFilterMenu.id = 'carFilterMenu';
  headerDiv.append(carFilterMenu);

  const searchHeaderBlock = document.createElement('div');
  searchHeaderBlock.classList.add('search-header', 'block');
  searchHeaderBlock.setAttribute('data-block-name', 'search-header');
  searchHeaderBlock.setAttribute('data-block-status', 'loaded');
  carFilterMenu.append(searchHeaderBlock);

  const carFilterLinkContainerSection = document.createElement('div');
  carFilterLinkContainerSection.classList.add('link-container-section');
  searchHeaderBlock.append(carFilterLinkContainerSection);

  // Populate car filter menu from the fragment if available, or use a placeholder
  const carFilterSection = sections[3]; // Assuming the 4th section is for car filter
  const carFilterRoot = carFilterSection?.querySelector(':scope > .default-content-wrapper') || carFilterSection;

  if (carFilterRoot) {
    Array.from(carFilterRoot.children).forEach((child) => {
      if (child.tagName === 'UL') {
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        carFilterLinkContainerSection.append(linkGridColumn);

        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');
        linkGridColumn.append(ul);

        const parsedItems = parseList(child);
        parsedItems.forEach((item) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = item.href || '#';
          a.textContent = item.title;
          li.append(a);
          ul.append(li);
          moveInstrumentation(item.originalElement, li);
        });
      }
    });
  } else {
    // Fallback if no car filter section in fragment
    const carFilterLinkGridColumn = document.createElement('div');
    carFilterLinkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
    carFilterLinkContainerSection.append(carFilterLinkGridColumn);

    const carFilterUl = document.createElement('ul');
    carFilterUl.classList.add('content', 'links-container', 'accordian-content');
    carFilterLinkGridColumn.append(carFilterUl);

    const carFilterLi = document.createElement('li');
    const carFilterA = document.createElement('a');
    carFilterA.href = '#';
    carFilterA.textContent = 'Car Filter Item (Placeholder)';
    carFilterLi.append(carFilterA);
    carFilterUl.append(carFilterLi);
  }

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  carFilterMenu.append(carPanelHeader);

  carPanelHeader.append(document.createElement('div')); // Empty div for spacing

  const carText = document.createElement('span');
  carText.classList.add('car-text');
  carText.textContent = 'Cars'; // Hardcoded as per original HTML
  carPanelHeader.append(carText);

  carFilterCloseButton = document.createElement('span');
  carFilterCloseButton.classList.add('car-filter-close');
  carFilterCloseButton.innerHTML = '<img src="/icons/close.svg" alt="close">';
  carPanelHeader.append(carFilterCloseButton);

  // Mobile Menu
  menu = document.createElement('div');
  menu.id = 'menu';
  menu.classList.add('menu', 'hidden', 'menu-arena');
  headerDiv.append(menu);

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menu.append(menuHeader);

  menuBackButton = document.createElement('div');
  menuBackButton.classList.add('back-arrow', 'hidden');
  menuHeader.append(menuBackButton);

  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu';
  menuHeader.append(menuTitle);

  menuCloseButton = document.createElement('span');
  menuCloseButton.classList.add('close-icon');
  menuHeader.append(menuCloseButton);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  menu.append(menuList);

  // Populate mobile menu from navItemsData
  navItemsData.forEach((item, index) => {
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    const itemClass = sanitizeClassName(item.title);
    if (itemClass) li.classList.add(itemClass);
    moveInstrumentation(item.originalElement, li); // Instrumentation for mobile menu list item

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');
    if (item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.title;
      a.classList.add('button'); // Add button class if it's a direct link
      menuTitleSpan.append(a);
    } else {
      menuTitleSpan.textContent = item.title;
    }
    li.append(menuTitleSpan);
    menuList.append(li);

    if (item.panel) {
      li.classList.add('accordion');
      const panel = item.panel.cloneNode(true); // Clone the desktop panel for mobile
      panel.classList.remove('desktop-panel'); // Remove desktop specific class
      panel.style.maxHeight = null; // Reset maxHeight
      menu.append(panel);
      setupMobileNavAccordion(li, panel, item.title);
      setupAccordion(li, panel); // Also setup accordion for desktop behavior
    }
  });

  // Add sign-in links to mobile menu
  if (signInWrapper) {
    const userAccountLinks = signInWrapper.querySelectorAll('.user__account--link');
    userAccountLinks.forEach((link) => {
      const li = document.createElement('li');
      li.append(link.cloneNode(true));
      menuList.append(li);
    });
  }

  block.textContent = ''; // Clear the block
  block.append(newDomFragment); // Append the constructed DOM

  // Event Listeners
  if (hamburgerButton) {
    hamburgerButton.addEventListener('click', () => toggleMenu());
  }
  if (menuCloseButton) {
    menuCloseButton.addEventListener('click', () => toggleMenu(true));
  }
  if (menuBackButton) {
    menuBackButton.addEventListener('click', () => {
      if (menu.querySelector('.panel.active')) {
        const activePanel = menu.querySelector('.panel.active');
        activePanel.style.maxHeight = null;
        activePanel.classList.remove('active');
        const activeAccordion = menu.querySelector('.accordion.active');
        if (activeAccordion) activeAccordion.classList.remove('active');
        menu.querySelector('.menu-list').classList.remove('hidden');
        menuBackButton.classList.add('hidden');
        menuCloseButton.classList.remove('hidden');
        if (menu.querySelector('.menu-title')) {
          menu.querySelector('.menu-title').textContent = 'Menu';
        }
      }
    });
  }
  if (carFilterCloseButton) {
    carFilterCloseButton.addEventListener('click', () => toggleCarFilterMenu());
  }
  if (contactTitle && contactToggleBox) {
    setupContactToggle(contactTitle, contactToggleBox);
  }
  if (iconPhone && contactToggleBox) {
    setupContactToggle(iconPhone, contactToggleBox);
  }

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
    }
  });

  // Desktop hover behavior for nav items
  if (isDesktop.matches) {
    navItemsData.forEach((item) => {
      if (item.panel) {
        item.titleElement.addEventListener('mouseenter', () => {
          navItemsData.forEach((otherItem) => {
            if (otherItem.panel && otherItem.panel !== item.panel) {
              otherItem.panel.style.display = 'none';
              otherItem.panel.classList.remove('active');
              otherItem.titleElement.classList.remove('active');
            }
          });
          item.panel.style.display = 'flex';
          item.panel.classList.add('active');
          item.titleElement.classList.add('active');
        });
        item.panel.addEventListener('mouseleave', () => {
          item.panel.style.display = 'none';
          item.panel.classList.remove('active');
          item.titleElement.classList.remove('active');
        });
        item.titleElement.addEventListener('mouseleave', (event) => {
          if (!item.panel.contains(event.relatedTarget)) {
            item.panel.style.display = 'none';
            item.panel.classList.remove('active');
            item.titleElement.classList.remove('active');
          }
        });
      }
    });
  }

  // Prevent mobile nav behavior on window resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      closeAllMenus();
    } else {
      // Re-enable mobile menu visibility if it was open before resize
      if (navWrapper.classList.contains('menu-open')) {
        menu.classList.remove('hidden');
        document.body.style.overflowY = 'hidden';
      }
    }
  });
}
