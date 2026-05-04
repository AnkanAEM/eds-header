import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

let navContent = null;
let navSections = null;
let navTools = null;
let navBrand = null;
let navWrapper = null;
let nav = null;
let hamburger = null;
let mobileMenu = null;
let desktopPanelCorporate = null;
let desktopPanelSales = null;
let desktopPanelMore = null;
let contactWrapper = null;
let signInWrapper = null;
let navRight = null;
let languageDiv = null;

function sanitizeClassName(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function moveInstrumentation(sourceElement, targetElement) {
  if (sourceElement && targetElement) {
    const cqPath = sourceElement.getAttribute('data-cq-path');
    if (cqPath) {
      targetElement.setAttribute('data-cq-path', cqPath);
    }
  }
}

function closeAllSubmenus(parentMenu) {
  if (!parentMenu) return;
  parentMenu.querySelectorAll('.accordion.expanded').forEach((item) => {
    item.classList.remove('expanded');
    item.setAttribute('aria-expanded', 'false');
    const panel = item.nextElementSibling;
    if (panel && panel.classList.contains('panel')) {
      panel.style.maxHeight = null;
      panel.setAttribute('aria-hidden', 'true');
    }
  });
}

function closeAllDesktopPanels() {
  const openPanels = navContent.querySelectorAll('.desktop-panel.open');
  openPanels.forEach((panel) => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    const linkTitle = panel.previousElementSibling;
    if (linkTitle && linkTitle.classList.contains('link-title')) {
      linkTitle.setAttribute('aria-expanded', 'false');
    }
  });
}

function toggleMenu(forceExpanded = null) {
  if (!nav || !navSections || !mobileMenu || !hamburger) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = hamburger.querySelector('button');
  if (!button) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (expanded) {
    mobileMenu.classList.add('hidden');
    nav.classList.remove('menu-open');
    closeAllSubmenus(mobileMenu);
  } else {
    mobileMenu.classList.remove('hidden');
    nav.classList.add('menu-open');
  }
}

function createSubmenu(ulElement, targetPanel) {
  const linkGridBlock = document.createElement('div');
  linkGridBlock.classList.add(sanitizeClassName('link-grid'), sanitizeClassName('block'));

  const linkContainerSection = document.createElement('div');
  linkContainerSection.classList.add(sanitizeClassName('link-container-section'));

  const linkGridColumn = document.createElement('div');
  linkGridColumn.classList.add(sanitizeClassName('link-grid-column'), sanitizeClassName('link-column-vertical'));

  const clonedUl = ulElement.cloneNode(true);
  clonedUl.classList.add(sanitizeClassName('content'), sanitizeClassName('links-container'), sanitizeClassName('accordian-content'));

  linkGridColumn.append(clonedUl);
  linkContainerSection.append(linkGridColumn);
  linkGridBlock.append(linkContainerSection);
  targetPanel.append(linkGridBlock);
}

function setupMobileNav() {
  if (!mobileMenu || !navSections || !navTools) return;

  const menuHeader = document.createElement('div');
  menuHeader.classList.add(sanitizeClassName('menu-header'));

  const backArrow = document.createElement('div');
  backArrow.classList.add(sanitizeClassName('back-arrow'));
  menuHeader.append(backArrow);

  const menuTitle = document.createElement('span');
  menuTitle.classList.add(sanitizeClassName('menu-title'));
  menuTitle.textContent = 'Menu'; // Hardcoded, but matches original HTML
  menuHeader.append(menuTitle);

  const closeIcon = document.createElement('span');
  closeIcon.classList.add(sanitizeClassName('close-icon'));
  menuHeader.append(closeIcon);

  closeIcon.addEventListener('click', () => toggleMenu(false));
  backArrow.addEventListener('click', () => {
    const activePanel = mobileMenu.querySelector('.panel:not([style*="max-height: 0px"])');
    if (activePanel) {
      activePanel.style.maxHeight = null;
      activePanel.setAttribute('aria-hidden', 'true');
      const parentLi = activePanel.previousElementSibling;
      if (parentLi && parentLi.classList.contains('accordion')) {
        parentLi.classList.remove('expanded');
        parentLi.setAttribute('aria-expanded', 'false');
      }
      menuTitle.textContent = 'Menu'; // Hardcoded, but matches original HTML
      backArrow.style.display = 'none';
    } else {
      toggleMenu(false);
    }
  });

  mobileMenu.prepend(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add(sanitizeClassName('menu-list'));

  Array.from(navSections.children).forEach((section, i) => {
    const li = document.createElement('li');
    li.classList.add(sanitizeClassName('nav-link'));
    li.id = `menu-item-${i}`;

    const titleSpan = document.createElement('span');
    titleSpan.classList.add(sanitizeClassName('menu-title'));

    const sectionContentWrapper = section.querySelector(':scope > .default-content-wrapper');
    const anchor = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p > a') : null;
    const strong = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p > strong') : null;
    const textNodeContainer = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p') : null;

    let itemText = '';
    let itemHref = '';
    let isClickable = false;

    if (anchor) {
      itemText = anchor.textContent.trim();
      itemHref = anchor.href;
      isClickable = true;
      const newAnchor = document.createElement('a');
      newAnchor.href = itemHref;
      newAnchor.textContent = itemText;
      newAnchor.classList.add(sanitizeClassName('button'));
      titleSpan.append(newAnchor);
      moveInstrumentation(anchor.parentElement, newAnchor);
    } else if (strong) {
      itemText = strong.textContent.trim();
      titleSpan.textContent = itemText;
      moveInstrumentation(strong.parentElement, titleSpan);
    } else if (textNodeContainer) {
      itemText = textNodeContainer.textContent.trim();
      titleSpan.textContent = itemText;
      moveInstrumentation(textNodeContainer, titleSpan);
    }

    const itemClass = sanitizeClassName(itemText);
    if (itemClass) li.classList.add(itemClass);
    li.append(titleSpan);

    const ul = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > ul') : null;
    if (ul) {
      li.classList.add('accordion');
      li.setAttribute('aria-expanded', 'false');
      const panel = document.createElement('div');
      panel.classList.add(sanitizeClassName('panel'));
      panel.setAttribute('aria-hidden', 'true');

      createSubmenu(ul, panel);

      li.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = li.classList.contains('expanded');
        closeAllSubmenus(mobileMenu);
        if (!isExpanded) {
          li.classList.add('expanded');
          li.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
          panel.setAttribute('aria-hidden', 'false');
          menuTitle.textContent = itemText;
          backArrow.style.display = 'block';
        } else {
          panel.style.maxHeight = null;
          panel.setAttribute('aria-hidden', 'true');
          li.classList.remove('expanded');
          li.setAttribute('aria-expanded', 'false');
        }
      });
      menuList.append(li);
      menuList.append(panel);
    } else {
      if (isClickable) {
        li.addEventListener('click', () => {
          window.location.href = itemHref;
        });
      }
      menuList.append(li);
    }
  });

  // Append tools section items to mobile menu
  if (navTools) {
    const toolsUl = navTools.querySelector(':scope > .default-content-wrapper > ul');
    if (toolsUl) {
      Array.from(toolsUl.children).forEach((toolLi) => {
        const li = document.createElement('li');
        const anchor = toolLi.querySelector(':scope > a');
        const strong = toolLi.querySelector(':scope > strong');
        const textNode = Array.from(toolLi.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

        if (anchor) {
          const newAnchor = document.createElement('a');
          newAnchor.href = anchor.href;
          newAnchor.textContent = anchor.textContent.trim();
          newAnchor.target = anchor.target;
          newAnchor.rel = anchor.rel;
          li.append(newAnchor);
          moveInstrumentation(toolLi, newAnchor);
        } else if (strong) {
          const newStrong = document.createElement('strong');
          newStrong.textContent = strong.textContent.trim();
          li.append(newStrong);
          moveInstrumentation(toolLi, newStrong);
        } else if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          li.append(span);
          moveInstrumentation(toolLi, span);
        }
        menuList.append(li);
      });
    }
  }

  mobileMenu.append(menuList);
}

function setupDesktopNav() {
  if (!navSections || !navTools || !desktopPanelCorporate || !desktopPanelSales || !desktopPanelMore || !navRight || !languageDiv || !contactWrapper || !signInWrapper) return;

  const linksDiv = document.createElement('div');
  linksDiv.classList.add(sanitizeClassName('links'));

  Array.from(navSections.children).forEach((section) => {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add(sanitizeClassName('link-title'));
    linkTitle.setAttribute('aria-expanded', 'false');

    const titleSpan = document.createElement('span');

    const sectionContentWrapper = section.querySelector(':scope > .default-content-wrapper');
    const anchor = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p > a') : null;
    const strong = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p > strong') : null;
    const textNodeContainer = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > p') : null;

    let itemText = '';
    let itemHref = '';
    let hasSubmenu = false;
    let targetPanel = null;

    if (anchor) {
      itemText = anchor.textContent.trim();
      itemHref = anchor.href;
      const newAnchor = document.createElement('a');
      newAnchor.href = itemHref;
      newAnchor.textContent = itemText;
      newAnchor.classList.add(sanitizeClassName('button'));
      titleSpan.append(newAnchor);
      moveInstrumentation(anchor.parentElement, newAnchor);
    } else if (strong) {
      itemText = strong.textContent.trim();
      titleSpan.textContent = itemText;
      moveInstrumentation(strong.parentElement, titleSpan);
    } else if (textNodeContainer) {
      itemText = textNodeContainer.textContent.trim();
      titleSpan.textContent = itemText;
      moveInstrumentation(textNodeContainer, titleSpan);
    }

    const itemClass = sanitizeClassName(itemText);
    if (itemClass) linkTitle.classList.add(itemClass);
    linkTitle.append(titleSpan);

    const ul = sectionContentWrapper ? sectionContentWrapper.querySelector(':scope > ul') : null;
    if (ul) {
      hasSubmenu = true;
      if (itemClass === 'corporate') {
        targetPanel = desktopPanelCorporate;
      } else if (itemClass === 'sales') {
        targetPanel = desktopPanelSales;
      } else if (itemClass === 'more-from-us') {
        targetPanel = desktopPanelMore;
      }

      if (targetPanel) {
        createSubmenu(ul, targetPanel);
        linkTitle.addEventListener('mouseenter', () => {
          closeAllDesktopPanels();
          targetPanel.classList.add('open');
          targetPanel.setAttribute('aria-hidden', 'false');
          linkTitle.setAttribute('aria-expanded', 'true');
        });
        targetPanel.addEventListener('mouseleave', () => {
          targetPanel.classList.remove('open');
          targetPanel.setAttribute('aria-hidden', 'true');
          linkTitle.setAttribute('aria-expanded', 'false');
        });
      }
    }
    linksDiv.append(linkTitle);
    if (hasSubmenu && targetPanel) {
      linksDiv.append(targetPanel);
    }
  });

  navContent.append(linksDiv);

  // Tools section for desktop
  const toolsRoot = navTools.querySelector(':scope > .default-content-wrapper');
  if (toolsRoot) {
    const toolsUl = toolsRoot.querySelector(':scope > ul');
    if (toolsUl) {
      const contactBlockDiv = document.createElement('div');
      contactBlockDiv.classList.add(sanitizeClassName('contact'), sanitizeClassName('block'));
      contactBlockDiv.setAttribute('data-block-name', 'contact');
      contactBlockDiv.setAttribute('data-block-status', 'loaded');

      const contactWrpArena = document.createElement('div');
      contactWrpArena.classList.add(sanitizeClassName('contact_wrp_arena'), sanitizeClassName('user__contact'), sanitizeClassName('header'));

      const contactTitleH4 = document.createElement('h4');
      contactTitleH4.classList.add(sanitizeClassName('user__contact-title'));
      const contactUsLabel = toolsRoot.querySelector('h4')?.textContent || 'Contact Us'; // Get label from fragment
      contactTitleH4.textContent = contactUsLabel;
      contactWrpArena.append(contactTitleH4);

      const contactTitleIconSpan = document.createElement('span');
      contactTitleIconSpan.classList.add(sanitizeClassName('user__contact-title'), sanitizeClassName('icon-phone'));
      contactTitleIconSpan.setAttribute('aria-label', contactUsLabel);
      contactWrpArena.append(contactTitleIconSpan);

      const userContactIconsDiv = document.createElement('div');
      userContactIconsDiv.classList.add(sanitizeClassName('user__contact__icons'), sanitizeClassName('hidden'));

      const contactToggleBoxDiv = document.createElement('div');
      contactToggleBoxDiv.classList.add(sanitizeClassName('hidden'), sanitizeClassName('contact-toggle-box'));

      const userContactIconCallContainer = document.createElement('div');
      userContactIconCallContainer.classList.add(sanitizeClassName('user__contact__icon-call_container'));

      let hasContactItems = false;
      let hasSignInItems = false;

      Array.from(toolsUl.children).forEach((toolLi) => {
        const anchor = toolLi.querySelector(':scope > a');
        const textNode = Array.from(toolLi.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

        if (anchor && anchor.href.includes('whatsapp.com')) {
          const whatsappAnchor = document.createElement('a');
          whatsappAnchor.href = anchor.href;
          whatsappAnchor.target = '_blank';
          whatsappAnchor.rel = 'noopener noreferrer';
          whatsappAnchor.classList.add(sanitizeClassName('user__contact--icon'), sanitizeClassName('whatsapp'));
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add(sanitizeClassName('sr-only'));
          srOnlySpan.textContent = 'whatsapp'; // Hardcoded, but matches original HTML
          whatsappAnchor.append(srOnlySpan);
          const img = document.createElement('img');
          img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg'; // Hardcoded image
          img.alt = 'whatsapp'; // Hardcoded, but matches original HTML
          img.loading = 'lazy';
          whatsappAnchor.append(img);
          userContactIconsDiv.append(whatsappAnchor);
          moveInstrumentation(toolLi, whatsappAnchor);
          hasContactItems = true;
        } else if (anchor && anchor.href.startsWith('mailto:')) {
          const emailAnchor = document.createElement('a');
          emailAnchor.href = anchor.href;
          emailAnchor.classList.add(sanitizeClassName('user__contact--icon'), sanitizeClassName('email'));
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add(sanitizeClassName('sr-only'));
          srOnlySpan.textContent = 'email'; // Hardcoded, but matches original HTML
          emailAnchor.append(srOnlySpan);
          const img = document.createElement('img');
          img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg'; // Hardcoded image
          img.alt = 'email'; // Hardcoded, but matches original HTML
          img.loading = 'lazy';
          emailAnchor.append(img);
          userContactIconsDiv.append(emailAnchor);
          moveInstrumentation(toolLi, emailAnchor);
          hasContactItems = true;
        } else if (anchor && anchor.href.startsWith('tel:')) {
          const phoneAnchor = document.createElement('a');
          phoneAnchor.href = anchor.href;
          phoneAnchor.classList.add(sanitizeClassName('primary-telephone'));
          phoneAnchor.textContent = anchor.textContent.trim();
          userContactIconCallContainer.append(phoneAnchor);
          moveInstrumentation(toolLi, phoneAnchor);
          hasContactItems = true;
        } else if (textNode && textNode.textContent.trim() === 'Sign In') { // Hardcoded label
          const signInDiv = document.createElement('div');
          signInDiv.classList.add(sanitizeClassName('user__account--link'), sanitizeClassName('sign-in-btn'));
          const iconSpan = document.createElement('span');
          iconSpan.classList.add(sanitizeClassName('user__account__list-icon'));
          const img = document.createElement('img');
          img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg'; // Hardcoded image
          img.loading = 'lazy';
          img.alt = 'Sign-in'; // Hardcoded, but matches original HTML
          iconSpan.append(img);
          signInDiv.append(iconSpan);
          const signInButton = document.createElement('button');
          signInButton.type = 'button';
          signInButton.setAttribute('data-sign-out-text', 'Sign Out'); // Hardcoded, but matches original HTML
          signInButton.textContent = 'Sign In'; // Hardcoded, but matches original HTML
          signInDiv.append(signInButton);
          signInWrapper.querySelector('.user__account').append(signInDiv);
          moveInstrumentation(toolLi, signInDiv);
          hasSignInItems = true;
        } else if (anchor && (anchor.href.includes('reach-us') || anchor.href.includes('user'))) {
          const userAccountLink = document.createElement('a');
          userAccountLink.href = anchor.href;
          userAccountLink.target = anchor.target;
          userAccountLink.classList.add(sanitizeClassName('user__account--link'), sanitizeClassName(anchor.textContent.trim()));
          const iconSpan = document.createElement('span');
          iconSpan.classList.add(sanitizeClassName('user__account__list-icon'));
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.alt = anchor.textContent.trim();
          if (anchor.href.includes('reach-us')) {
            img.src = 'https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&format=svg&optimize=medium'; // Hardcoded image
          } else if (anchor.href.includes('user')) {
            img.src = 'https://www.marutisuzuki.com/common/media_13b57ab8376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&format=svg&optimize=medium'; // Hardcoded image
          }
          iconSpan.append(img);
          userAccountLink.append(iconSpan);
          userAccountLink.append(document.createTextNode(anchor.textContent.trim()));
          signInWrapper.querySelector('.user__account').append(userAccountLink);
          moveInstrumentation(toolLi, userAccountLink);
          hasSignInItems = true;
        }
      });

      if (hasContactItems) {
        contactToggleBoxDiv.append(userContactIconCallContainer);
        contactWrpArena.append(userContactIconsDiv);
        contactWrpArena.append(contactToggleBoxDiv);
        contactBlockDiv.append(contactWrpArena);
        contactWrapper.append(contactBlockDiv);
      }
    }
  }

  navRight.append(contactWrapper);
  navRight.append(languageDiv);
  navRight.append(signInWrapper);
  navContent.append(navRight);
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
  block.classList.forEach((cls) => navWrapper.classList.add(cls)); // Copy original root classes

  navWrapper = document.createElement('div');
  navWrapper.classList.add(
    sanitizeClassName('corp-header-wrapper'),
    sanitizeClassName('header-scroll'),
    sanitizeClassName('header-scroll-threshold'),
    sanitizeClassName('corp-header-block'),
    sanitizeClassName('header-wrapper'),
    sanitizeClassName('sticky'),
    sanitizeClassName('show')
  );

  const corpHeaderDiv = document.createElement('div');
  corpHeaderDiv.classList.add(sanitizeClassName('corp-header'), sanitizeClassName('block'));
  corpHeaderDiv.setAttribute('data-block-name', 'corp-header');
  corpHeaderDiv.setAttribute('data-block-status', 'loaded');

  const containerDiv = document.createElement('div');
  corpHeaderDiv.append(containerDiv);

  navContent = document.createElement('div');
  navContent.classList.add(sanitizeClassName('navbar'), sanitizeClassName('navbar-arena'), sanitizeClassName('g-container'));
  containerDiv.append(navContent);

  hamburger = document.createElement('div');
  hamburger.classList.add(sanitizeClassName('nav-hamburger'));
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'nav');
  button.setAttribute('aria-label', 'Open navigation');
  button.setAttribute('aria-expanded', 'false');
  const iconSpan = document.createElement('span');
  iconSpan.classList.add(sanitizeClassName('nav-hamburger-icon'));
  button.append(iconSpan);
  hamburger.append(button);
  navContent.append(hamburger);

  nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  navContent.append(nav);

  mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add(sanitizeClassName('menu'), sanitizeClassName('hidden'), sanitizeClassName('menu-arena'));
  containerDiv.append(mobileMenu);

  desktopPanelCorporate = document.createElement('div');
  desktopPanelCorporate.classList.add(sanitizeClassName('desktop-panel'), sanitizeClassName('panel'), sanitizeClassName('corporate'));
  desktopPanelCorporate.setAttribute('aria-hidden', 'true');

  desktopPanelSales = document.createElement('div');
  desktopPanelSales.classList.add(sanitizeClassName('desktop-panel'), sanitizeClassName('panel'), sanitizeClassName('sales'));
  desktopPanelSales.setAttribute('aria-hidden', 'true');

  desktopPanelMore = document.createElement('div');
  desktopPanelMore.classList.add(sanitizeClassName('desktop-panel'), sanitizeClassName('panel'), sanitizeClassName('more'));
  desktopPanelMore.setAttribute('aria-hidden', 'true');

  navRight = document.createElement('div');
  navRight.classList.add(sanitizeClassName('right'));
  navRight.id = 'nav-right';

  languageDiv = document.createElement('div');
  languageDiv.classList.add(sanitizeClassName('language'));
  languageDiv.textContent = 'EN'; // Hardcoded, but matches original HTML

  contactWrapper = document.createElement('div');
  contactWrapper.classList.add(sanitizeClassName('contact-wrapper'));

  signInWrapper = document.createElement('div');
  signInWrapper.classList.add(sanitizeClassName('sign-in-wrapper'), sanitizeClassName('hidden'));
  const signInBlock = document.createElement('div');
  signInBlock.classList.add(sanitizeClassName('sign-in'), sanitizeClassName('block'));
  signInBlock.setAttribute('data-block-name', 'sign-in');
  signInBlock.setAttribute('data-block-status', 'loaded');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add(sanitizeClassName('user__dropdown'));
  const userAccount = document.createElement('div');
  userAccount.classList.add(sanitizeClassName('user__account'));
  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);

  const sections = fragment.querySelectorAll(':scope > .section');

  // Parse Brand Section
  if (sections.length > 0) {
    const brandSection = sections[0];
    const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper');
    if (brandRoot) {
      navBrand = document.createElement('div');
      navBrand.classList.add(sanitizeClassName('logo-wrapper'));
      const logoBlock = document.createElement('div');
      logoBlock.classList.add(sanitizeClassName('logo'), sanitizeClassName('block'));
      logoBlock.setAttribute('data-block-name', 'logo');
      logoBlock.setAttribute('data-block-status', 'loaded');
      const spanArena = document.createElement('span');
      spanArena.classList.add(sanitizeClassName('arena'));
      const linkPicture = brandRoot.querySelector(':scope > p > picture');
      if (linkPicture) {
        const logoAnchor = document.createElement('a');
        logoAnchor.classList.add(sanitizeClassName('logo__picture'));
        logoAnchor.href = '/';
        logoAnchor.setAttribute('data-logo-name', 'Arena');
        logoAnchor.append(linkPicture.cloneNode(true));
        spanArena.append(logoAnchor);
      }
      logoBlock.append(spanArena);
      navBrand.append(logoBlock);
      navContent.prepend(navBrand);
      moveInstrumentation(brandSection, navBrand);
    }
  }

  // Parse Nav Sections
  if (sections.length > 1) {
    const navFragmentSection = sections[1];
    navSections = document.createElement('div');
    moveInstrumentation(navFragmentSection, navSections);
    const navRoot = navFragmentSection.querySelector(':scope > .default-content-wrapper');
    if (navRoot) {
      // Iterate over children of navRoot to find P and UL elements
      let currentItemDiv = null;
      Array.from(navRoot.children).forEach((child) => {
        if (child.tagName === 'P') {
          currentItemDiv = document.createElement('div');
          currentItemDiv.classList.add('nav-item'); // Add base class
          const anchor = child.querySelector(':scope > a');
          const strong = child.querySelector(':scope > strong');
          let itemText = '';
          let itemHref = '';

          if (anchor) {
            itemText = anchor.textContent.trim();
            itemHref = anchor.href;
            const newAnchor = document.createElement('a');
            newAnchor.href = itemHref;
            newAnchor.textContent = itemText;
            newAnchor.classList.add(sanitizeClassName('button'));
            currentItemDiv.append(newAnchor);
            moveInstrumentation(child, newAnchor);
          } else if (strong) {
            itemText = strong.textContent.trim();
            const newStrong = document.createElement('strong');
            newStrong.textContent = itemText;
            currentItemDiv.append(newStrong);
            moveInstrumentation(child, newStrong);
          } else {
            itemText = child.textContent.trim();
            const span = document.createElement('span');
            span.textContent = itemText;
            currentItemDiv.append(span);
            moveInstrumentation(child, span);
          }
          currentItemDiv.classList.add(`nav-item-${sanitizeClassName(itemText)}`);
          navSections.append(currentItemDiv);
        } else if (child.tagName === 'UL' && currentItemDiv) {
          // If a UL follows a P, append it as a child to the current nav-item
          currentItemDiv.append(child.cloneNode(true));
          currentItemDiv = null; // Reset currentItemDiv after consuming its UL
        }
      });
    }
  }

  // Parse Nav Tools
  if (sections.length > 2) {
    navTools = sections[2];
  }

  setupMobileNav();
  setupDesktopNav();

  hamburger.addEventListener('click', () => toggleMenu(null));
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && !e.target.closest('.accordion')) {
      toggleMenu(false);
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });

  navWrapper.append(corpHeaderDiv);
  block.append(navWrapper);

  // prevent mobile nav behavior on window resize
  toggleMenu(isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(isDesktop.matches));
}
