import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');
const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1199px)');
const isMobile = window.matchMedia('(max-width: 767px)');

let nav = null;
let navSections = null;
let menu = null;
let carFilterMenu = null;
let contactToggleBox = null;
let userAccountDropdown = null;
let navHamburgerButton = null;
let contactBlock = null;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const navSectionExpanded = navSections?.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      navHamburgerButton.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const currentNav = e.currentTarget;
  if (!currentNav.contains(e.relatedTarget)) {
    const navSectionExpanded = navSections?.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('link-title'); // Assuming nav-drop is equivalent to link-title for desktop
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'), !dropExpanded);
    focused.setAttribute('aria-expanded', !dropExpanded);
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections > .links > .link-title').forEach((section) => {
    const panel = section.nextElementSibling;
    const isCurrent = section.getAttribute('aria-expanded') === 'true';

    if (expanded && !isCurrent) {
      section.setAttribute('aria-expanded', 'true');
      if (panel && panel.classList.contains('desktop-panel')) {
        panel.style.display = 'flex';
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
      }
    } else if (!expanded && isCurrent) {
      section.setAttribute('aria-expanded', 'false');
      if (panel && panel.classList.contains('desktop-panel')) {
        panel.style.display = 'none';
        panel.style.opacity = '0';
        panel.style.visibility = 'hidden';
      }
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} navElement The container element
 * @param {Element} navSectionsElement The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(navElement, navSectionsElement, forceExpanded = null) {
  if (!navElement || !navSectionsElement) return;

  const expanded = forceExpanded !== null ? forceExpanded : navElement.getAttribute('aria-expanded') === 'true';
  const button = navElement.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  navElement.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  // enable nav dropdown keyboard accessibility
  const navDrops = navSectionsElement.querySelectorAll('.link-title');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    navElement.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    navElement.removeEventListener('focusout', closeOnFocusLost);
  }
}

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  const { blockName, blockStatus, blockVariant } = originalElement.dataset;
  if (blockName) newElement.dataset.blockName = blockName;
  if (blockStatus) newElement.dataset.blockStatus = blockStatus;
  if (blockVariant) newElement.dataset.blockVariant = blockVariant;
  newElement.classList.add(...originalElement.classList);
}

/**
 * Recursively parses a UL element and its children to build a nested menu structure.
 * This version is for desktop panels and mobile accordions, where the UL itself
 * does not get the 'accordion' class, but its parent LI might.
 * @param {HTMLUListElement} ulElement The UL element to parse.
 * @returns {HTMLUListElement} The constructed UL element with the correct structure and classes.
 */
function parseNestedList(ulElement) {
  if (!ulElement) return null;

  const newUl = document.createElement('ul');
  newUl.classList.add('content', 'links-container', 'accordian-content');

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;

    const newLi = document.createElement('li');
    moveInstrumentation(li, newLi);

    let link = li.querySelector(':scope > a');
    const strong = li.querySelector(':scope > strong');
    const p = li.querySelector(':scope > p'); // Check for paragraph inside li

    if (link) {
      newLi.append(link.cloneNode(true));
    } else if (strong) {
      newLi.append(strong.cloneNode(true));
    } else if (p) {
      newLi.append(p.cloneNode(true));
    } else {
      // If no link, strong, or p, just take the text content
      newLi.textContent = li.textContent.trim();
    }

    const nestedUl = li.querySelector(':scope > ul');
    if (nestedUl) {
      // This is a nested accordion item for mobile, or just a nested list for desktop
      const nestedPanel = document.createElement('div');
      nestedPanel.classList.add('panel');

      const nestedLinkGrid = document.createElement('div');
      nestedLinkGrid.classList.add('link-grid', 'block');
      const nestedLinkContainerSection = document.createElement('div');
      nestedLinkContainerSection.classList.add('link-container-section');
      const nestedLinkGridColumn = document.createElement('div');
      nestedLinkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const parsedNestedUl = parseNestedList(nestedUl);
      if (parsedNestedUl) {
        nestedLinkGridColumn.append(parsedNestedUl);
      }
      nestedLinkContainerSection.append(nestedLinkGridColumn);
      nestedLinkGrid.append(nestedLinkContainerSection);
      nestedPanel.append(nestedLinkGrid);

      newLi.classList.add('accordion');
      const span = document.createElement('span');
      span.classList.add('menu-title');
      const existingContent = newLi.firstChild; // Get the cloned link/strong/p
      if (existingContent) {
        span.append(existingContent);
      } else {
        span.textContent = newLi.textContent;
        newLi.textContent = ''; // Clear text content if it was directly set
      }
      newLi.prepend(span);
      newLi.append(nestedPanel);

      // Mobile accordion functionality
      span.addEventListener('click', () => {
        newLi.classList.toggle('active');
        if (newLi.classList.contains('active')) {
          nestedPanel.style.maxHeight = `${nestedPanel.scrollHeight}px`;
        } else {
          nestedPanel.style.maxHeight = null;
        }
      });
    }

    newUl.append(newLi);
  });
  return newUl;
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
  block.textContent = '';
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('corp-header', 'block');
  moveInstrumentation(block, navWrapper); // Transfer original block classes to navWrapper

  nav = document.createElement('nav');
  nav.id = 'nav';

  const fragmentContainer = document.createElement('div');
  while (fragment.firstElementChild) {
    fragmentContainer.append(fragment.firstElementChild);
  }

  const classes = ['brand', 'sections', 'tools'];
  const navElements = {};
  classes.forEach((c, i) => {
    const section = fragmentContainer.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);
      navElements[c] = section;
    }
  });

  // --- Section 1: Brand (Logo) ---
  const navBrand = navElements.brand;
  if (navBrand) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    moveInstrumentation(navBrand, logoBlock); // Instrumentation for the nav-brand div

    const picture = navBrand.querySelector('picture');
    const logoLink = navBrand.querySelector('a'); // Get the actual link for the logo
    if (picture && logoLink) {
      const anchor = document.createElement('a');
      anchor.classList.add('logo__picture');
      anchor.href = logoLink.href;
      anchor.setAttribute('data-logo-name', logoLink.dataset.logoName || 'Arena');
      anchor.append(picture);
      logoBlock.append(anchor);
    } else if (picture) { // Fallback if no link, but there should always be one
      const anchor = document.createElement('a');
      anchor.classList.add('logo__picture');
      anchor.href = '/';
      anchor.setAttribute('data-logo-name', 'Arena');
      anchor.append(picture);
      logoBlock.append(anchor);
    }
    if (logoBlock.children.length > 0) { // Only append if content exists
      logoWrapper.append(logoBlock);
      navBrand.replaceChildren(logoWrapper);
    } else {
      navBrand.remove(); // Remove empty brand section
      navElements.brand = null;
    }
  }

  // --- Section 2: Main Navigation ---
  navSections = navElements.sections;
  if (navSections) {
    const navLinks = document.createElement('div');
    navLinks.classList.add('links');

    let el = navSections.firstElementChild;
    while (el) {
      if (el.nodeType !== Node.ELEMENT_NODE) {
        el = el.nextElementSibling;
        continue;
      }

      if (el.tagName === 'P') {
        const linkTitle = document.createElement('div');
        linkTitle.classList.add('link-title');
        moveInstrumentation(el, linkTitle);

        const span = document.createElement('span');
        const anchor = el.querySelector(':scope > a');
        if (anchor) {
          span.append(anchor.cloneNode(true));
          linkTitle.setAttribute('aria-expanded', 'false'); // Default collapsed
          linkTitle.setAttribute('role', 'button');
          linkTitle.setAttribute('tabindex', '0');
        } else {
          span.textContent = el.textContent.trim();
        }
        linkTitle.append(span);
        navLinks.append(linkTitle);

        const desktopPanelDiv = document.createElement('div');
        desktopPanelDiv.classList.add('desktop-panel', 'panel');
        desktopPanelDiv.classList.add(sanitizeClassName(span.textContent));

        let nextEl = el.nextElementSibling;
        if (nextEl && nextEl.tagName === 'UL') {
          const linkGrid = document.createElement('div');
          linkGrid.classList.add('link-grid', 'block');
          moveInstrumentation(nextEl, linkGrid);

          const linkContainerSection = document.createElement('div');
          linkContainerSection.classList.add('link-container-section');

          const parsedUl = parseNestedList(nextEl);
          if (parsedUl) {
            const linkGridColumn = document.createElement('div');
            linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
            linkGridColumn.append(parsedUl);
            linkContainerSection.append(linkGridColumn);
          }
          linkGrid.append(linkContainerSection);
          desktopPanelDiv.append(linkGrid);
          navLinks.append(desktopPanelDiv);

          el = nextEl.nextElementSibling; // Skip the UL as it's processed
        } else {
          el = nextEl;
        }

        // Desktop hover functionality (CSS driven, but JS for aria-expanded)
        linkTitle.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleAllNavSections(navSections, false); // Close others
            linkTitle.setAttribute('aria-expanded', 'true');
            desktopPanelDiv.style.display = 'flex';
            desktopPanelDiv.style.opacity = '1';
            desktopPanelDiv.style.visibility = 'visible';
          }
        });
        linkTitle.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            linkTitle.setAttribute('aria-expanded', 'false');
            desktopPanelDiv.style.display = 'none';
            desktopPanelDiv.style.opacity = '0';
            desktopPanelDiv.style.visibility = 'hidden';
          }
        });
        desktopPanelDiv.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            linkTitle.setAttribute('aria-expanded', 'true');
            desktopPanelDiv.style.display = 'flex';
            desktopPanelDiv.style.opacity = '1';
            desktopPanelDiv.style.visibility = 'visible';
          }
        });
        desktopPanelDiv.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            linkTitle.setAttribute('aria-expanded', 'false');
            desktopPanelDiv.style.display = 'none';
            desktopPanelDiv.style.opacity = '0';
            desktopPanelDiv.style.visibility = 'hidden';
          }
        });

      } else {
        el = el.nextElementSibling;
      }
    }
    if (navLinks.children.length > 0) {
      navSections.replaceChildren(navLinks);
    } else {
      navSections.remove();
      navElements.sections = null;
    }
  }

  // --- Section 3: Tools (Contact, Language, Sign-in) ---
  const navTools = navElements.tools;
  if (navTools) {
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('right');
    rightDiv.id = 'nav-right';

    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    moveInstrumentation(navTools, contactBlock); // Instrumentation for the nav-tools div

    const contactTitle = document.createElement('h4');
    contactTitle.classList.add('user__contact-title');
    contactTitle.textContent = 'Contact Us'; // Default, will be overwritten if found in fragment
    const contactIconPhone = document.createElement('span');
    contactIconPhone.classList.add('user__contact-title', 'icon-phone');
    contactIconPhone.setAttribute('aria-label', 'Contact Us');

    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons', 'hidden');

    contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('hidden', 'contact-toggle-box');
    const userContactCallContainer = document.createElement('div');
    userContactCallContainer.classList.add('user__contact__icon-call_container');

    const toolsUlElements = navTools.querySelectorAll(':scope > ul');
    let primaryTelephoneLink = null;
    let whatsappLink = null;
    let emailLink = null;
    let reachUsLink = null;
    let profileLink = null;
    let signInText = null;
    let languageText = 'EN'; // Default language

    if (toolsUlElements.length > 0) {
      // First UL typically contains social/contact icons
      const socialLinksUl = toolsUlElements[0];
      Array.from(socialLinksUl.children).forEach((li) => {
        const anchor = li.querySelector(':scope > a');
        if (anchor) {
          const iconName = anchor.title ? sanitizeClassName(anchor.title) : '';
          if (iconName) {
            const socialAnchor = document.createElement('a');
            socialAnchor.href = anchor.href;
            socialAnchor.target = '_blank';
            socialAnchor.rel = 'noopener noreferrer';
            socialAnchor.classList.add('user__contact--icon', iconName);
            // Extract image src from original anchor if available, otherwise use default
            const img = anchor.querySelector('img');
            const imgSrc = img ? img.src : `/icons/${iconName}.svg`;
            socialAnchor.innerHTML = `<span class="sr-only">${iconName}</span><img src="${imgSrc}" alt="${iconName}" loading="lazy">`;
            userContactIcons.append(socialAnchor);
          }
        }
      });
      moveInstrumentation(socialLinksUl, userContactIcons);
    }

    if (toolsUlElements.length > 1) {
      // Second UL typically contains utility links (tel, whatsapp, email, reach us, profile, sign in)
      const utilityLinksUl = toolsUlElements[1];
      Array.from(utilityLinksUl.children).forEach((li) => {
        const anchor = li.querySelector(':scope > a');
        if (anchor) {
          if (anchor.href.startsWith('tel:')) {
            primaryTelephoneLink = anchor;
          } else if (anchor.href.includes('wa.me')) {
            whatsappLink = anchor;
          } else if (anchor.href.startsWith('mailto:')) {
            emailLink = anchor;
          } else if (anchor.href.includes('reach-us')) {
            reachUsLink = anchor;
          } else if (anchor.href.includes('/user')) {
            profileLink = anchor;
          }
        } else if (li.textContent.trim().toLowerCase() === 'sign in') {
          signInText = li.textContent.trim();
        } else if (li.textContent.trim().length === 2 && li.textContent.trim().match(/^[A-Z]{2}$/)) {
          languageText = li.textContent.trim();
        }
      });

      if (primaryTelephoneLink) {
        const telAnchor = document.createElement('a');
        telAnchor.href = primaryTelephoneLink.href;
        telAnchor.classList.add('primary-telephone');
        telAnchor.textContent = primaryTelephoneLink.textContent;
        userContactCallContainer.append(telAnchor);
      }

      if (whatsappLink) {
        const whatsappAnchor = document.createElement('a');
        whatsappAnchor.href = whatsappLink.href;
        whatsappAnchor.target = '_blank';
        whatsappAnchor.classList.add('user__contact--icon', 'whatsapp');
        whatsappAnchor.rel = 'noopener noreferrer';
        const img = whatsappLink.querySelector('img');
        const imgSrc = img ? img.src : '/icons/whatsapp-blue.svg';
        whatsappAnchor.innerHTML = `<span class="sr-only">whatsapp</span><img src="${imgSrc}" alt="whatsapp" loading="lazy">`;
        userContactIcons.append(whatsappAnchor);
      }

      if (emailLink) {
        const emailAnchor = document.createElement('a');
        emailAnchor.href = emailLink.href;
        emailAnchor.classList.add('user__contact--icon', 'email');
        const img = emailLink.querySelector('img');
        const imgSrc = img ? img.src : '/icons/mail-blue.svg';
        emailAnchor.innerHTML = `<span class="sr-only">email</span><img src="${imgSrc}" alt="email" loading="lazy">`;
        userContactIcons.append(emailAnchor);
      }

      if (userContactIcons.children.length > 0) {
        userContactIcons.prepend(contactIconPhone);
        contactBlock.append(contactTitle, userContactIcons);
      }
      if (userContactCallContainer.children.length > 0) {
        contactToggleBox.append(userContactCallContainer);
        contactBlock.append(contactToggleBox);
      }

      if (contactBlock.children.length > 0) {
        contactWrapper.append(contactBlock);
        rightDiv.append(contactWrapper);
      }

      // Language
      const languageDiv = document.createElement('div');
      languageDiv.classList.add('language');
      languageDiv.textContent = languageText;
      rightDiv.append(languageDiv);

      // Sign-in
      const signInWrapper = document.createElement('div');
      signInWrapper.classList.add('sign-in-wrapper', 'hidden');
      const signInBlock = document.createElement('div');
      signInBlock.classList.add('sign-in', 'block');
      moveInstrumentation(utilityLinksUl, signInBlock); // Instrumentation for the utility UL

      userAccountDropdown = document.createElement('div');
      userAccountDropdown.classList.add('user__dropdown');
      const userAccount = document.createElement('div');
      userAccount.classList.add('user__account');

      if (reachUsLink) {
        const reachUsAnchor = document.createElement('a');
        reachUsAnchor.href = reachUsLink.href;
        reachUsAnchor.classList.add('user__account--link', 'reach', 'us');
        reachUsAnchor.target = '_self';
        const img = reachUsLink.querySelector('img');
        const imgSrc = img ? img.src : '/icons/ReachUs.svg';
        reachUsAnchor.innerHTML = `<span class="user__account__list-icon"><img src="${imgSrc}" loading="lazy" alt="Reach Us"></span>${reachUsLink.textContent}`;
        userAccount.append(reachUsAnchor);
      }

      if (profileLink) {
        const profileAnchor = document.createElement('a');
        profileAnchor.href = profileLink.href;
        profileAnchor.classList.add('user__account--link', 'profile');
        profileAnchor.target = '_self';
        const img = profileLink.querySelector('img');
        const imgSrc = img ? img.src : '/icons/Profile.svg';
        profileAnchor.innerHTML = `<span class="user__account__list-icon"><img src="${imgSrc}" loading="lazy" alt="Profile"></span>${profileLink.textContent}`;
        userAccount.append(profileAnchor);
      }

      if (signInText) {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        const signInButton = document.createElement('button');
        signInButton.type = 'button';
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = signInText;
        // Assuming world-blue.svg is the default icon for sign-in
        signInBtnDiv.innerHTML = `<span class="user__account__list-icon"><img src="/icons/world-blue.svg" loading="lazy" alt="Sign-in"></span>`;
        signInBtnDiv.append(signInButton);
        userAccount.append(signInBtnDiv);
      }

      if (userAccount.children.length > 0) {
        userAccountDropdown.append(userAccount);
        signInBlock.append(userAccountDropdown);
        signInWrapper.append(signInBlock);
        rightDiv.append(signInWrapper);
      }
    }
    if (rightDiv.children.length > 0) {
      navTools.replaceChildren(rightDiv);
    } else {
      navTools.remove();
      navElements.tools = null;
    }
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  navHamburgerButton = document.createElement('button');
  navHamburgerButton.type = 'button';
  navHamburgerButton.setAttribute('aria-controls', 'nav');
  navHamburgerButton.setAttribute('aria-label', 'Open navigation');
  navHamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  navHamburgerButton.append(hamburgerIcon);
  hamburger.append(navHamburgerButton);

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');
  if (navElements.brand) navbar.append(navElements.brand);
  if (navElements.sections) navbar.append(navElements.sections);
  if (navElements.tools) navbar.append(navElements.tools);
  navbar.prepend(hamburger); // Hamburger always first

  nav.prepend(navbar);

  // Mobile Menu
  menu = document.createElement('div');
  menu.id = 'menu';
  menu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIcon);
  menu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  if (navSections && navSections.querySelector('.links')) {
    Array.from(navSections.querySelector('.links').children).forEach((item) => {
      if (item.classList.contains('link-title')) {
        const li = document.createElement('li');
        li.classList.add('nav-link');
        const linkText = item.querySelector('span')?.textContent.trim();
        if (linkText) {
          li.classList.add(sanitizeClassName(linkText));
        }
        const anchor = item.querySelector('span > a'); // Get the actual anchor inside the span
        if (anchor) {
          const span = document.createElement('span');
          span.classList.add('menu-title');
          span.append(anchor.cloneNode(true));
          li.append(span);
        } else {
          const span = document.createElement('span');
          span.classList.add('menu-title');
          span.textContent = linkText;
          li.append(span);
        }

        const desktopPanelForMenuItem = item.nextElementSibling;
        if (desktopPanelForMenuItem && desktopPanelForMenuItem.classList.contains('desktop-panel')) {
          li.classList.add('accordion');
          const clonedPanel = desktopPanelForMenuItem.cloneNode(true);
          clonedPanel.classList.remove('desktop-panel');
          clonedPanel.style.maxHeight = null;
          clonedPanel.style.opacity = null;
          clonedPanel.style.visibility = null;
          clonedPanel.style.display = null;
          li.append(clonedPanel);

          li.addEventListener('click', () => {
            li.classList.toggle('active');
            if (li.classList.contains('active')) {
              clonedPanel.style.maxHeight = `${clonedPanel.scrollHeight}px`;
            } else {
              clonedPanel.style.maxHeight = null;
            }
          });
        }
        menuList.append(li);
      }
    });
  }

  // Append utility links to mobile menu
  if (navTools) {
    const utilityLinksUl = navTools.querySelector(':scope > .right > .sign-in-wrapper > .sign-in > .user__dropdown > .user__account');
    if (utilityLinksUl) {
      Array.from(utilityLinksUl.children).forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('nav-link');
        const clonedItem = item.cloneNode(true);
        li.append(clonedItem);
        menuList.append(li);
      });
    }
  }

  menu.append(menuList);
  nav.append(menu);

  // Car Filter Menu (placeholder, as content is dynamic)
  carFilterMenu = document.createElement('div');
  carFilterMenu.id = 'carFilterMenu';
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  const carTextSpan = document.createElement('span');
  carTextSpan.classList.add('car-text');
  carTextSpan.textContent = 'Cars'; // Dynamically get this if possible, otherwise default
  const carFilterCloseSpan = document.createElement('span');
  carFilterCloseSpan.classList.add('car-filter-close');
  carFilterCloseSpan.innerHTML = '<img src="/icons/close.svg" alt="close">';
  carPanelHeader.append(document.createElement('div'), carTextSpan, carFilterCloseSpan); // Empty div for alignment
  carFilterMenu.append(carPanelHeader);
  nav.append(carFilterMenu);

  navWrapper.append(nav);
  block.append(navWrapper);

  // Event Listeners
  navHamburgerButton.addEventListener('click', () => {
    const isExpanded = nav.getAttribute('aria-expanded') === 'true';
    toggleMenu(nav, navSections, !isExpanded);
    menu.classList.toggle('hidden', isExpanded);
    document.body.classList.toggle('no-scroll', !isExpanded);
  });

  closeIcon.addEventListener('click', () => {
    toggleMenu(nav, navSections, false);
    menu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  backArrow.addEventListener('click', () => {
    const activeAccordion = menuList.querySelector('.accordion.active');
    if (activeAccordion) {
      activeAccordion.classList.remove('active');
      activeAccordion.querySelector('.panel').style.maxHeight = null;
    } else {
      toggleMenu(nav, navSections, false);
      menu.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
  });

  // Contact toggle
  const contactTitleElement = contactBlock.querySelector('.user__contact-title');
  const contactIconsElement = contactBlock.querySelector('.user__contact__icons');
  if (contactTitleElement && contactIconsElement) {
    contactTitleElement.addEventListener('click', () => {
      contactIconsElement.classList.toggle('hidden');
    });
  }

  // Sign-in toggle
  const signInBtn = rightDiv.querySelector('.sign-in-btn');
  if (signInBtn && userAccountDropdown) {
    signInBtn.addEventListener('click', () => {
      userAccountDropdown.classList.toggle('hidden');
    });
  }

  // Initial state for desktop
  if (isDesktop.matches) {
    menu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      menu.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      toggleMenu(nav, navSections, false); // Ensure nav is closed on desktop resize
    }
  });

  isTablet.addEventListener('change', () => {
    if (isTablet.matches) {
      menu.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      toggleMenu(nav, navSections, false);
    }
  });

  isMobile.addEventListener('change', () => {
    if (isMobile.matches) {
      menu.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      toggleMenu(nav, navSections, false);
    }
  });
}
