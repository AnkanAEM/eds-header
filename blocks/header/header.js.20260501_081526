import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

let nav = null;
let navSections = null;
let navHamburger = null;
let navRight = null;
let carFilterMenu = null;
let menu = null;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    if (!nav || !navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false); // Collapse all
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false); // Collapse mobile menu
      if (navHamburger) {
        navHamburger.querySelector('button').focus();
      }
    }
  }
}

function closeOnFocusLost(e) {
  const currentNav = e.currentTarget;
  if (!currentNav.contains(e.relatedTarget)) {
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false); // Collapse all
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false); // Collapse mobile menu
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.links'), dropExpanded);
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
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
  sections.querySelectorAll('.link-title.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const panel = section.nextElementSibling;
    if (panel && panel.classList.contains('desktop-panel')) {
      panel.setAttribute('aria-hidden', !expanded);
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} navElement The container element
 * @param {Element} navSectionsElement The nav sections within the container element
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(navElement, navSectionsElement, forceExpanded = null) {
  if (!navElement || !navSectionsElement) return;

  const expanded = forceExpanded !== null ? forceExpanded : navElement.getAttribute('aria-expanded') === 'true';
  const button = navElement.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  navElement.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  toggleAllNavSections(navSectionsElement, expanded && isDesktop.matches); // Only expand desktop sections if desktop and nav is expanded
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  }

  if (navSectionsElement) {
    const navDrops = navSectionsElement.querySelectorAll('.nav-drop');
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
  }

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

/**
 * Parses a UL element and its nested ULs into a data structure.
 * @param {Element} ulElement The root UL element to parse.
 * @returns {Array} An array of item objects, each potentially having a 'children' array.
 */
function parseListToData(ulElement) {
  const items = [];
  let currentLi = ulElement.firstElementChild;
  while (currentLi) {
    if (currentLi.tagName === 'LI') {
      const item = {};
      const link = currentLi.querySelector(':scope > a');
      const strong = currentLi.querySelector(':scope > strong');
      let textContent = '';

      if (link) {
        item.title = link.textContent.trim();
        item.href = link.href;
        item.target = link.target;
        item.rel = link.rel;
      } else if (strong) {
        item.title = strong.textContent.trim();
        item.href = null; // Strong tags don't have href
      } else {
        // Get immediate text content of LI, excluding nested UL's text
        Array.from(currentLi.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            textContent += node.textContent.trim();
          }
        });
        item.title = textContent;
        item.href = null;
      }

      item.children = [];
      const nestedUl = currentLi.querySelector(':scope > ul');
      if (nestedUl) {
        item.children = parseListToData(nestedUl);
      }
      items.push(item);
    }
    currentLi = currentLi.nextElementSibling;
  }
  return items;
}

/**
 * Creates a link grid column from a data structure.
 * @param {Array} itemsData An array of item objects.
 * @param {Array} buffer Optional array of elements to prepend to the column.
 * @param {string} titleText Optional title text for the left-div.
 * @returns {Element} The created column element.
 */
function createLinkGridColumn(itemsData, buffer = [], titleText = 'untitled') {
  const column = document.createElement('div');
  column.classList.add('link-grid-column', 'link-column-vertical');

  if (buffer.length > 0) {
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div', `${sanitizeClassName(titleText)}-left-div`);
    buffer.forEach((item) => leftDiv.append(item));
    column.append(leftDiv);
  }

  const buildList = (data, parentUl) => {
    data.forEach(item => {
      const li = document.createElement('li');
      if (item.href) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.title;
        if (item.target) a.target = item.target;
        if (item.rel) a.rel = item.rel;
        li.append(a);
      } else {
        const strong = document.createElement('strong');
        strong.textContent = item.title;
        li.append(strong);
      }

      if (item.children && item.children.length > 0) {
        const nestedUl = document.createElement('ul');
        nestedUl.classList.add('content', 'links-container', 'accordian-content');
        buildList(item.children, nestedUl);
        li.append(nestedUl);
      }
      parentUl.append(li);
    });
  };

  const linksContainer = document.createElement('ul');
  linksContainer.classList.add('content', 'links-container', 'accordian-content');
  buildList(itemsData, linksContainer);
  column.append(linksContainer);
  return column;
}

function moveInstrumentation(originalElement, newElement) {
  if (originalElement && newElement) {
    const blockStatus = originalElement.dataset.blockStatus;
    const blockName = originalElement.dataset.blockName;
    const blockPath = originalElement.dataset.blockPath;

    if (blockStatus) newElement.dataset.blockStatus = blockStatus;
    if (blockName) newElement.dataset.blockName = blockName;
    if (blockPath) newElement.dataset.blockPath = blockPath;

    // Move any cq:instrumentation comments as well
    Array.from(originalElement.childNodes).forEach(node => {
      if (node.nodeType === Node.COMMENT_NODE && node.textContent.startsWith('cq{')) {
        newElement.append(node.cloneNode(true));
      }
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Copy original block classes to the new header wrapper
  const originalClasses = Array.from(block.classList);
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const newHeader = document.createElement('div');
  newHeader.classList.add('corp-header', 'block');
  originalClasses.forEach(cls => newHeader.classList.add(cls)); // Copy original classes
  moveInstrumentation(block, newHeader);

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbar.append(navHamburger);
  // Instrumentation for hamburger might be on the first section if it's the first element.
  // Assuming the hamburger button is part of the overall header structure, not a specific section.
  // If instrumentation is on the fragment's first child, it should be moved to the newHeader or navbar.

  nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const sections = Array.from(fragment.children);

  // Section 1: Brand
  const brandSection = sections[0];
  if (brandSection) {
    const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
    const pElement = brandRoot.querySelector(':scope > p');
    if (pElement) {
      const picture = pElement.querySelector(':scope > picture');
      if (picture) { // Only create logo if picture exists
        const logoWrapper = document.createElement('div');
        logoWrapper.classList.add('logo-wrapper');
        const logoBlock = document.createElement('div');
        logoBlock.classList.add('logo', 'block');
        moveInstrumentation(brandRoot.firstElementChild, logoBlock); // Instrumentation for logo
        
        const spanArena = document.createElement('span');
        spanArena.classList.add('arena');
        const logoPictureLink = document.createElement('a');
        logoPictureLink.classList.add('logo__picture');
        logoPictureLink.href = '/';
        logoPictureLink.setAttribute('data-logo-name', 'Arena');
        logoPictureLink.append(picture.cloneNode(true));
        spanArena.append(logoPictureLink);
        logoBlock.append(spanArena);
        logoWrapper.append(logoBlock);
        navbar.append(logoWrapper);
      }
    }
  }

  // Section 2: Nav
  navSections = document.createElement('div');
  navSections.classList.add('links');
  const navSectionContent = sections[1];

  if (navSectionContent) {
    const navRoot = navSectionContent.querySelector(':scope > .default-content-wrapper') || navSectionContent;
    let currentElement = navRoot.firstElementChild;
    let contentBuffer = [];

    while (currentElement) {
      if (currentElement.nodeType === Node.COMMENT_NODE) {
        currentElement = currentElement.nextElementSibling;
        continue;
      }

      if (currentElement.tagName === 'P') {
        const linkTitle = document.createElement('div');
        linkTitle.classList.add('link-title');
        moveInstrumentation(currentElement, linkTitle);

        const span = document.createElement('span');
        const anchor = currentElement.querySelector(':scope > a');
        const strong = currentElement.querySelector(':scope > strong');
        const img = currentElement.querySelector(':scope > picture');

        let titleText = '';
        if (anchor) {
          span.append(anchor.cloneNode(true));
          titleText = anchor.textContent.trim();
        } else if (strong) {
          span.append(strong.cloneNode(true));
          titleText = strong.textContent.trim();
        } else if (img) {
          span.append(img.cloneNode(true));
          titleText = img.alt || 'Image Link';
        } else {
          span.textContent = currentElement.textContent.trim();
          titleText = currentElement.textContent.trim();
        }
        linkTitle.append(span);

        let nextSibling = currentElement.nextElementSibling;
        while (nextSibling && nextSibling.nodeType === Node.COMMENT_NODE) {
          nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling && nextSibling.tagName === 'UL') {
          const cls = sanitizeClassName(titleText);
          if (cls) {
            linkTitle.classList.add('nav-drop', cls);
          } else {
            linkTitle.classList.add('nav-drop');
          }
          linkTitle.setAttribute('aria-expanded', 'false');

          const clsPanel = sanitizeClassName(titleText);
          const desktopPanel = document.createElement('div');
          if (clsPanel) {
            desktopPanel.classList.add('desktop-panel', 'panel', clsPanel);
          } else {
            desktopPanel.classList.add('desktop-panel', 'panel');
          }
          desktopPanel.setAttribute('aria-hidden', 'true');

          const linkGridBlock = document.createElement('div');
          linkGridBlock.classList.add('link-grid', 'block');
          moveInstrumentation(nextSibling, linkGridBlock); // Instrumentation for UL

          const linkContainerSection = document.createElement('div');
          linkContainerSection.classList.add('link-container-section');

          // Flush content buffer into a left-div if available
          if (contentBuffer.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div', `${sanitizeClassName(titleText)}-left-div`);
            contentBuffer.forEach(item => leftDiv.append(item));
            linkContainerSection.append(leftDiv);
            contentBuffer = []; // Clear buffer after flushing
          }

          const listData = parseListToData(nextSibling);
          const linkGridColumn = createLinkGridColumn(listData, [], titleText);
          linkContainerSection.append(linkGridColumn);
          linkGridBlock.append(linkContainerSection);
          desktopPanel.append(linkGridBlock);

          navSections.append(linkTitle);
          navSections.append(desktopPanel);

          linkTitle.addEventListener('click', () => {
            if (isDesktop.matches) {
              const expanded = linkTitle.getAttribute('aria-expanded') === 'true';
              toggleAllNavSections(navSections, false); // Close all others
              linkTitle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
              desktopPanel.setAttribute('aria-hidden', expanded ? 'true' : 'false');
            }
          });
          currentElement = nextSibling.nextElementSibling; // Skip the UL
        } else {
          navSections.append(linkTitle);
          currentElement = currentElement.nextElementSibling;
        }
      } else {
        // Collect non-P, non-UL elements into the buffer
        contentBuffer.push(currentElement.cloneNode(true));
        currentElement = currentElement.nextElementSibling;
      }
    }
  }
  navbar.append(navSections);

  // Section 3: Tools
  const toolsSection = sections[2];
  if (toolsSection) { // Only create navRight if toolsSection exists
    navRight = document.createElement('div');
    navRight.classList.add('right');
    navRight.id = 'nav-right';
    const toolsRoot = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
    let currentToolElement = toolsRoot.firstElementChild;

    while (currentToolElement) {
      if (currentToolElement.nodeType === Node.COMMENT_NODE) {
        currentToolElement = currentToolElement.nextElementSibling;
        continue;
      }

      if (currentToolElement.tagName === 'UL') {
        const toolItems = parseListToData(currentToolElement);

        if (toolItems.some(item => ['WhatsApp', 'Facebook', 'Twitter'].includes(item.title))) {
          // Social icons
          const socialWrapper = document.createElement('div');
          socialWrapper.classList.add('social-wrapper');
          const socialList = document.createElement('ul');
          socialList.classList.add('social-icons');
          toolItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.title = item.title;
            a.setAttribute('aria-label', item.title); // Accessibility
            // Add specific classes for icons based on title
            if (item.title === 'WhatsApp') a.classList.add('icon-whatsapp');
            if (item.title === 'Facebook') a.classList.add('icon-facebook');
            if (item.title === 'Twitter') a.classList.add('icon-twitter');
            li.append(a);
            socialList.append(li);
          });
          socialWrapper.append(socialList);
          navRight.append(socialWrapper);
          moveInstrumentation(currentToolElement, socialWrapper);
        } else if (toolItems.some(item => ['whatsapp', 'email', '1800 102 1800'].includes(item.title))) {
          // Contact wrapper
          const contactWrapper = document.createElement('div');
          contactWrapper.classList.add('contact-wrapper');
          const contactBlock = document.createElement('div');
          contactBlock.classList.add('contact', 'block');
          moveInstrumentation(currentToolElement, contactBlock);

          const contactDiv = document.createElement('div');
          contactDiv.classList.add('contact_wrp_arena', 'user__contact', 'header');

          const contactTitle = document.createElement('h4');
          contactTitle.classList.add('user__contact-title');
          contactTitle.textContent = 'Contact Us'; // Hardcoded label, but from original HTML
          const phoneIcon = document.createElement('span');
          phoneIcon.classList.add('user__contact-title', 'icon-phone');
          phoneIcon.setAttribute('aria-label', 'Contact Us');
          contactDiv.append(contactTitle, phoneIcon);

          const userContactIcons = document.createElement('div');
          userContactIcons.classList.add('user__contact__icons', 'hidden');

          toolItems.forEach(item => {
            if (item.title === 'whatsapp') {
              const whatsappLink = document.createElement('a');
              whatsappLink.href = item.href;
              whatsappLink.target = '_blank';
              whatsappLink.rel = 'noopener noreferrer';
              whatsappLink.classList.add('user__contact--icon', 'whatsapp');
              const srOnly = document.createElement('span');
              srOnly.classList.add('sr-only');
              srOnly.textContent = item.title;
              const img = document.createElement('img');
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg';
              img.alt = item.title;
              img.loading = 'lazy';
              whatsappLink.append(srOnly, img);
              userContactIcons.append(whatsappLink);
            } else if (item.title === 'email') {
              const emailLink = document.createElement('a');
              emailLink.href = item.href;
              emailLink.classList.add('user__contact--icon', 'email');
              const srOnly = document.createElement('span');
              srOnly.classList.add('sr-only');
              srOnly.textContent = item.title;
              const img = document.createElement('img');
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg';
              img.alt = item.title;
              img.loading = 'lazy';
              emailLink.append(srOnly, img);
              userContactIcons.append(emailLink);
            } else if (item.title === '1800 102 1800') {
              const phoneLink = document.createElement('a');
              phoneLink.href = '#'; // Placeholder, actual call handled by toggle box
              phoneLink.classList.add('user__contact--icon', 'phone');
              phoneLink.onclick = (event) => {
                event.preventDefault();
                event.currentTarget.closest('.contact').querySelector('.contact-toggle-box').classList.toggle('hidden');
              };
              const srOnly = document.createElement('span');
              srOnly.classList.add('sr-only');
              srOnly.textContent = 'phone';
              const img = document.createElement('img');
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg';
              img.alt = 'phone';
              img.loading = 'lazy';
              phoneLink.append(srOnly, img);
              userContactIcons.prepend(phoneLink); // Prepend to match original HTML order
            }
          });
          contactDiv.append(userContactIcons);

          const contactToggleBox = document.createElement('div');
          contactToggleBox.classList.add('hidden', 'contact-toggle-box');
          const callContainer = document.createElement('div');
          callContainer.classList.add('user__contact__icon-call_container');
          const primaryTelephone = document.createElement('a');
          const phoneNumber = toolItems.find(item => item.title === '1800 102 1800')?.title || '';
          primaryTelephone.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
          primaryTelephone.classList.add('primary-telephone');
          primaryTelephone.textContent = phoneNumber;
          const secondaryTelephone = document.createElement('a');
          secondaryTelephone.href = 'tel:'; // Placeholder for secondary number if any
          secondaryTelephone.classList.add('secondary-telephone');
          callContainer.append(primaryTelephone, secondaryTelephone);
          contactToggleBox.append(callContainer);
          contactDiv.append(contactToggleBox);
          contactBlock.append(contactDiv);
          contactWrapper.append(contactBlock);
          navRight.append(contactWrapper);
        } else if (toolItems.some(item => ['Reach Us', 'Profile', 'Sign In'].includes(item.title))) {
          // Sign-in wrapper
          const signInWrapper = document.createElement('div');
          signInWrapper.classList.add('sign-in-wrapper', 'hidden');
          const signInBlock = document.createElement('div');
          signInBlock.classList.add('sign-in', 'block');
          moveInstrumentation(currentToolElement, signInBlock);

          const userDropdown = document.createElement('div');
          userDropdown.classList.add('user__dropdown');
          const userAccount = document.createElement('div');
          userAccount.classList.add('user__account');

          toolItems.forEach(item => {
            if (item.title === 'Sign In') {
              const signInButtonDiv = document.createElement('div');
              signInButtonDiv.classList.add('user__account--link', 'sign-in-btn');
              const spanIcon = document.createElement('span');
              spanIcon.classList.add('user__account__list-icon');
              const img = document.createElement('img');
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg';
              img.loading = 'lazy';
              img.alt = item.title;
              spanIcon.append(img);
              const button = document.createElement('button');
              button.type = 'button';
              button.setAttribute('data-sign-out-text', 'Sign Out');
              button.textContent = item.title;
              signInButtonDiv.append(spanIcon, button);
              userAccount.append(signInButtonDiv);
            } else {
              const link = document.createElement('a');
              link.href = item.href;
              const cls = sanitizeClassName(item.title);
              if (cls) {
                link.classList.add('user__account--link', cls);
              } else {
                link.classList.add('user__account--link');
              }
              if (item.target) link.target = item.target;
              if (item.rel) link.rel = item.rel;

              const spanIcon = document.createElement('span');
              spanIcon.classList.add('user__account__list-icon');
              // Placeholder for icon image based on title
              const img = document.createElement('img');
              if (item.title === 'Reach Us') {
                img.src = 'https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&format=svg&optimize=medium';
              } else if (item.title === 'Profile') {
                img.src = 'https://www.marutisuzuki.com/common/media_13b57ab8376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&format=svg&optimize=medium';
              }
              img.loading = 'lazy';
              img.alt = item.title;
              spanIcon.append(img);
              link.append(spanIcon, document.createTextNode(item.title));
              userAccount.append(link);
            }
          });
          userDropdown.append(userAccount);
          signInBlock.append(userDropdown);
          signInWrapper.append(signInBlock);
          navRight.append(signInWrapper);
        } else if (toolItems.some(item => ['Play store', 'AppStore'].includes(item.title))) {
          // App store links
          const appStoreWrapper = document.createElement('div');
          appStoreWrapper.classList.add('app-store-wrapper');
          const appStoreList = document.createElement('ul');
          appStoreList.classList.add('app-store-links');
          toolItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.title;
            li.append(a);
            appStoreList.append(li);
          });
          appStoreWrapper.append(appStoreList);
          navRight.append(appStoreWrapper);
          moveInstrumentation(currentToolElement, appStoreWrapper);
        } else {
          // Generic UL, append as is for now
          navRight.append(currentToolElement.cloneNode(true));
        }
      } else if (currentToolElement.tagName === 'P' && currentToolElement.textContent.trim() === 'EN') {
        const languageDiv = document.createElement('div');
        languageDiv.classList.add('language');
        languageDiv.textContent = 'EN';
        navRight.append(languageDiv);
        moveInstrumentation(currentToolElement, languageDiv);
      } else {
        // Append other elements directly if they don't fit specific patterns
        navRight.append(currentToolElement.cloneNode(true));
      }
      currentToolElement = currentToolElement.nextElementSibling;
    }
    navbar.append(navRight);
  }
  newHeader.append(navbar);

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
  menuTitle.textContent = 'Menu'; // Hardcoded label, but from original HTML
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIcon);
  menu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  let mobileMenuItemIndex = 0;

  // Re-parse nav sections for mobile menu
  if (navSectionContent) {
    const navRoot = navSectionContent.querySelector(':scope > .default-content-wrapper') || navSectionContent;
    let currentElement = navRoot.firstElementChild;
    let mobileContentBuffer = [];

    while (currentElement) {
      if (currentElement.nodeType === Node.COMMENT_NODE) {
        currentElement = currentElement.nextElementSibling;
        continue;
      }

      if (currentElement.tagName === 'P') {
        const li = document.createElement('li');
        li.id = `menu-item-${mobileMenuItemIndex++}`;

        const anchor = currentElement.querySelector(':scope > a');
        const strong = currentElement.querySelector(':scope > strong');
        const img = currentElement.querySelector(':scope > picture');

        let titleText = '';
        if (anchor) {
          const spanTitle = document.createElement('span');
          spanTitle.classList.add('menu-title');
          spanTitle.append(anchor.cloneNode(true));
          li.append(spanTitle);
          const clsAnchor = sanitizeClassName(anchor.textContent.trim());
          if (clsAnchor) {
            li.classList.add('nav-link', clsAnchor);
          } else {
            li.classList.add('nav-link');
          }
          titleText = anchor.textContent.trim();
        } else if (strong) {
          const spanTitle = document.createElement('span');
          spanTitle.classList.add('menu-title');
          spanTitle.append(strong.cloneNode(true));
          li.append(spanTitle);
          const clsStrong = sanitizeClassName(strong.textContent.trim());
          if (clsStrong) {
            li.classList.add('nav-link', clsStrong);
          } else {
            li.classList.add('nav-link');
          }
          titleText = strong.textContent.trim();
        } else if (img) {
          const spanTitle = document.createElement('span');
          spanTitle.classList.add('menu-title');
          spanTitle.append(img.cloneNode(true));
          li.append(spanTitle);
          const clsImg = sanitizeClassName(img.alt || 'Image Link');
          if (clsImg) {
            li.classList.add('nav-link', clsImg);
          } else {
            li.classList.add('nav-link');
          }
          titleText = img.alt || 'Image Link';
        } else {
          const spanTitle = document.createElement('span');
          spanTitle.classList.add('menu-title');
          spanTitle.textContent = currentElement.textContent.trim();
          li.append(spanTitle);
          const clsText = sanitizeClassName(currentElement.textContent.trim());
          if (clsText) {
            li.classList.add('nav-link', clsText);
          } else {
            li.classList.add('nav-link');
          }
          titleText = currentElement.textContent.trim();
        }

        let nextSibling = currentElement.nextElementSibling;
        while (nextSibling && nextSibling.nodeType === Node.COMMENT_NODE) {
          nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling && nextSibling.tagName === 'UL') {
          li.classList.add('accordion');
          const panel = document.createElement('div');
          panel.classList.add('panel');

          const linkGridBlock = document.createElement('div');
          linkGridBlock.classList.add('link-grid', 'block');
          moveInstrumentation(nextSibling, linkGridBlock);

          const linkContainerSection = document.createElement('div');
          linkContainerSection.classList.add('link-container-section');

          // Flush content buffer into a left-div if available
          if (mobileContentBuffer.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div', `${sanitizeClassName(titleText)}-left-div`);
            mobileContentBuffer.forEach(item => leftDiv.append(item));
            linkContainerSection.append(leftDiv);
            mobileContentBuffer = []; // Clear buffer after flushing
          }

          const listData = parseListToData(nextSibling);
          const linkGridColumn = createLinkGridColumn(listData, [], titleText);
          linkContainerSection.append(linkGridColumn);
          linkGridBlock.append(linkContainerSection);
          panel.append(linkGridBlock);
          menuList.append(li, panel);

          li.addEventListener('click', () => {
            li.classList.toggle('active');
            panel.style.maxHeight = li.classList.contains('active') ? `${panel.scrollHeight}px` : null;
          });
          currentElement = nextSibling.nextElementSibling; // Skip the UL
        } else {
          menuList.append(li);
          currentElement = currentElement.nextElementSibling;
        }
      } else {
        // Collect non-P, non-UL elements into the buffer
        mobileContentBuffer.push(currentElement.cloneNode(true));
        currentElement = currentElement.nextElementSibling;
      }
    }
  }

  // Add tools section items to mobile menu
  if (toolsSection) {
    const toolsRoot = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
    let currentToolElement = toolsRoot.firstElementChild;

    while (currentToolElement) {
      if (currentToolElement.nodeType === Node.COMMENT_NODE) {
        currentToolElement = currentToolElement.nextElementSibling;
        continue;
      }

      if (currentToolElement.tagName === 'UL') {
        const toolItems = parseListToData(currentToolElement);
        toolItems.forEach(item => {
          if (item.title === 'Sign In') {
            const li = document.createElement('li');
            const signInButtonDiv = document.createElement('div');
            signInButtonDiv.classList.add('user__account--link', 'sign-in-btn');
            const spanIcon = document.createElement('span');
            spanIcon.classList.add('user__account__list-icon');
            const img = document.createElement('img');
            img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg';
            img.loading = 'lazy';
            img.alt = item.title;
            spanIcon.append(img);
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-sign-out-text', 'Sign Out');
            button.textContent = item.title;
            signInButtonDiv.append(spanIcon, button);
            li.append(signInButtonDiv);
            menuList.append(li);
          } else if (item.href) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.href;
            const cls = sanitizeClassName(item.title);
            if (cls) {
              link.classList.add('user__account--link', cls);
            } else {
              link.classList.add('user__account--link');
            }
            if (item.target) link.target = item.target;
            if (item.rel) link.rel = item.rel;

            const spanIcon = document.createElement('span');
            spanIcon.classList.add('user__account__list-icon');
            const img = document.createElement('img');
            if (item.title === 'Reach Us') {
              img.src = 'https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&format=svg&optimize=medium';
            } else if (item.title === 'Profile') {
              img.src = 'https://www.marutisuzuki.com/common/media_13b57ab8376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&format=svg&optimize=medium';
            } else if (item.title === 'whatsapp') {
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg';
            } else if (item.title === 'email') {
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg';
            } else if (item.title === '1800 102 1800') {
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg';
            } else if (item.title === 'LOCATE A DEALER') {
              // Assuming an icon for dealer
            } else if (item.title === 'BOOK SHOWROOM VISIT') {
              // Assuming an icon for showroom visit
            } else if (item.title === 'Play store') {
              // Assuming an icon for play store
            } else if (item.title === 'AppStore') {
              // Assuming an icon for app store
            }
            img.loading = 'lazy';
            img.alt = item.title;
            spanIcon.append(img);
            link.append(spanIcon, document.createTextNode(item.title));
            li.append(link);
            menuList.append(li);
          }
        });
      }
      currentToolElement = currentToolElement.nextElementSibling;
    }
  }
  menu.append(menuList);
  newHeader.append(menu);

  // Car Filter Menu (if needed, based on original HTML)
  carFilterMenu = document.createElement('div');
  carFilterMenu.id = 'carFilterMenu';
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  carPanelHeader.innerHTML = '<div></div><span class="car-text">Cars</span><span class="car-filter-close"><img src="/icons/close.svg" alt="close"></span>';
  carFilterMenu.append(carPanelHeader);

  // Add content from the "Corporate" desktop-panel to carFilterMenu if it exists
  // This assumes the car filter menu content is a duplicate of one of the desktop panels.
  // If it's unique, it should be a separate section in the nav.plain.html fragment.
  const corporateDesktopPanel = navSections.querySelector('.desktop-panel.corporate');
  if (corporateDesktopPanel) {
    const clonedContent = corporateDesktopPanel.cloneNode(true);
    clonedContent.classList.remove('desktop-panel', 'panel', 'corporate');
    carFilterMenu.append(clonedContent);
  }

  newHeader.append(carFilterMenu);

  hamburgerButton.addEventListener('click', () => {
    toggleMenu(nav, navSections, !nav.getAttribute('aria-expanded') === 'true'); // Toggle based on current state
    menu.classList.toggle('hidden');
  });

  closeIcon.addEventListener('click', () => {
    toggleMenu(nav, navSections, false); // Force close
    menu.classList.add('hidden');
  });

  backArrow.addEventListener('click', () => {
    // Implement back navigation logic for mobile menu
    // For now, it just closes the menu
    toggleMenu(nav, navSections, false); // Force close
    menu.classList.add('hidden');
  });

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  block.append(newHeader);
}
