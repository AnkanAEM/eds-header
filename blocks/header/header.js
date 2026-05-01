import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

let nav;
let navSections;
let navTools;
let menu;
let carFilterMenu;
let desktopPanels = [];
let contactToggleBox;
let userDropdown;

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function moveInstrumentation(originalElement, newElement) {
  if (originalElement && newElement && originalElement.dataset.cqPath) {
    newElement.dataset.cqPath = originalElement.dataset.cqPath;
  }
}

function closeAllMenus(except = null) {
  if (!navSections) return;
  navSections.querySelectorAll('.link-title.active').forEach((section) => {
    if (section !== except) {
      section.classList.remove('active');
      section.setAttribute('aria-expanded', 'false');
      const panel = section.nextElementSibling;
      if (panel && panel.classList.contains('desktop-panel')) {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      }
    }
  });

  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  }
  if (carFilterMenu && !carFilterMenu.classList.contains('hidden')) {
    carFilterMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  }
  if (contactToggleBox && !contactToggleBox.classList.contains('hidden')) {
    contactToggleBox.classList.add('hidden');
  }
  if (userDropdown && !userDropdown.classList.contains('hidden')) {
    userDropdown.classList.add('hidden');
  }
}

function toggleMenu(forceExpanded = null) {
  if (!nav || !navSections) return;
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburgerButton = nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  document.body.classList.toggle('menu-open', !expanded && !isDesktop.matches);
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburgerButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (menu) {
    menu.classList.toggle('hidden', expanded);
  }

  if (expanded) {
    closeAllMenus();
  }
}

function buildMobileMenu(sourceUl, targetUl) {
  Array.from(sourceUl.children).forEach((sourceLi) => {
    const targetLi = document.createElement('li');
    moveInstrumentation(sourceLi, targetLi);

    const anchor = sourceLi.querySelector(':scope > a');
    const paragraph = sourceLi.querySelector(':scope > p');
    const strong = sourceLi.querySelector(':scope > strong');

    if (anchor) {
      const clonedAnchor = anchor.cloneNode(true);
      if (clonedAnchor.title) targetLi.classList.add(sanitizeClassName(clonedAnchor.title));
      targetLi.append(clonedAnchor);
    } else if (strong) {
      const clonedStrong = strong.cloneNode(true);
      targetLi.classList.add(sanitizeClassName(clonedStrong.textContent));
      targetLi.append(clonedStrong);
    } else if (paragraph) {
      const clonedParagraph = paragraph.cloneNode(true);
      targetLi.classList.add(sanitizeClassName(clonedParagraph.textContent));
      targetLi.append(clonedParagraph);
    } else {
      targetLi.textContent = sourceLi.textContent.trim();
      targetLi.classList.add(sanitizeClassName(sourceLi.textContent));
    }

    const nestedUl = sourceLi.querySelector(':scope > ul');
    if (nestedUl) {
      targetLi.classList.add('accordion');
      const nestedPanel = document.createElement('div');
      nestedPanel.classList.add('panel');
      const innerUl = document.createElement('ul');
      innerUl.classList.add('content', 'links-container', 'accordian-content');
      nestedPanel.append(innerUl);
      buildMobileMenu(nestedUl, innerUl); // Recursive call for nested ULs

      targetLi.addEventListener('click', () => {
        if (!isDesktop.matches) {
          targetLi.classList.toggle('active');
          nestedPanel.style.maxHeight = targetLi.classList.contains('active') ? `${nestedPanel.scrollHeight}px` : '0';
        }
      });
      targetUl.append(targetLi);
      targetUl.append(nestedPanel); // Panel is sibling to li in mobile menu
    } else {
      targetUl.append(targetLi);
    }
  });
}

function setupMobileNav() {
  if (!nav || !navSections || !navTools || !menu) return;

  const menuList = menu.querySelector('.menu-list');
  if (!menuList) return;
  menuList.replaceChildren(); // Clear existing mobile menu items

  // Add nav sections to mobile menu
  navSections.querySelectorAll('.link-title').forEach((navSection) => {
    const li = document.createElement('li');
    li.classList.add('nav-link');
    moveInstrumentation(navSection, li);

    const navSectionContent = navSection.querySelector(':scope > span > a') || navSection.querySelector(':scope > span > strong') || navSection.querySelector(':scope > span');
    const navSectionText = navSectionContent ? navSectionContent.textContent : '';
    const sanitizedClass = sanitizeClassName(navSectionText);
    if (sanitizedClass) li.classList.add(sanitizedClass);

    const span = document.createElement('span');
    span.classList.add('menu-title');
    if (navSectionContent) {
      span.append(navSectionContent.cloneNode(true));
    }
    li.append(span);

    const desktopPanel = navSection.nextElementSibling;
    if (desktopPanel && desktopPanel.classList.contains('desktop-panel')) {
      li.classList.add('accordion');
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');

      const linkGridBlock = desktopPanel.querySelector('.link-grid.block');
      if (linkGridBlock) {
        const linkContainerSection = linkGridBlock.querySelector('.link-container-section');
        if (linkContainerSection) {
          const linkGridColumns = Array.from(linkContainerSection.children);
          linkGridColumns.forEach(column => {
            const ul = column.querySelector(':scope > ul.content.links-container.accordian-content');
            if (ul) {
              const mobileColumnUl = document.createElement('ul');
              mobileColumnUl.classList.add('content', 'links-container', 'accordian-content');
              buildMobileMenu(ul, mobileColumnUl);
              panelDiv.append(mobileColumnUl);
            }
          });
        }
      }

      menuList.append(li);
      menuList.append(panelDiv);

      li.addEventListener('click', () => {
        if (!isDesktop.matches) {
          li.classList.toggle('active');
          panelDiv.style.maxHeight = li.classList.contains('active') ? `${panelDiv.scrollHeight}px` : '0';
        }
      });
    } else {
      menuList.append(li);
    }
  });

  // Add tools section to mobile menu
  const toolsList = document.createElement('ul');
  toolsList.classList.add('menu-list', 'tools-list'); // Separate class for styling if needed
  navTools.querySelectorAll('.user__account--link, .language, .contact-wrapper').forEach((toolItem) => {
    const li = document.createElement('li');
    moveInstrumentation(toolItem, li);

    if (toolItem.classList.contains('language')) {
      li.textContent = toolItem.textContent;
      li.classList.add('language');
    } else if (toolItem.classList.contains('contact-wrapper')) {
      const contactClone = toolItem.cloneNode(true);
      // Remove desktop-specific elements or adjust for mobile if necessary
      const contactTitle = contactClone.querySelector('.user__contact-title:not(.icon-phone)');
      if (contactTitle) contactTitle.remove();
      const contactIcons = contactClone.querySelector('.user__contact__icons');
      if (contactIcons) contactIcons.classList.remove('hidden'); // Ensure icons are visible
      const contactToggleBoxDiv = contactClone.querySelector('.contact-toggle-box');
      if (contactToggleBoxDiv) contactToggleBoxDiv.classList.remove('hidden'); // Ensure toggle box is visible
      li.append(contactClone);
    } else {
      li.append(toolItem.cloneNode(true));
    }
    toolsList.append(li);
  });
  menuList.append(toolsList);

  // Mobile menu header
  const menuHeader = menu.querySelector('.menu-header');
  if (menuHeader) {
    const backArrow = menuHeader.querySelector('.back-arrow');
    const closeIcon = menuHeader.querySelector('.close-icon');
    if (backArrow) {
      backArrow.addEventListener('click', () => {
        // Simple close for now, could be enhanced for multi-level mobile menus
        closeAllMenus();
        toggleMenu(true); // Close mobile menu
      });
    }
    if (closeIcon) {
      closeIcon.addEventListener('click', () => {
        closeAllMenus();
        toggleMenu(true); // Close mobile menu
      });
    }
  }
}

function setupDesktopNav() {
  if (!navSections) return;
  navSections.querySelectorAll('.link-title').forEach((navSection) => {
    const desktopPanel = navSection.nextElementSibling;
    if (desktopPanel && desktopPanel.classList.contains('desktop-panel')) {
      desktopPanels.push(desktopPanel);
      navSection.addEventListener('mouseenter', () => {
        closeAllMenus(navSection);
        navSection.classList.add('active');
        navSection.setAttribute('aria-expanded', 'true');
        desktopPanel.classList.add('active');
        desktopPanel.setAttribute('aria-hidden', 'false');
      });

      navSection.addEventListener('mouseleave', (e) => {
        if (!desktopPanel.contains(e.relatedTarget)) {
          navSection.classList.remove('active');
          navSection.setAttribute('aria-expanded', 'false');
          desktopPanel.classList.remove('active');
          desktopPanel.setAttribute('aria-hidden', 'true');
        }
      });

      desktopPanel.addEventListener('mouseleave', (e) => {
        if (!navSection.contains(e.relatedTarget)) {
          navSection.classList.remove('active');
          navSection.setAttribute('aria-expanded', 'false');
          desktopPanel.classList.remove('active');
          desktopPanel.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });
}

/**
 * Parses the fragment content and constructs the header DOM.
 * @param {Element} fragment The loaded fragment element.
 * @returns {object} An object containing the parsed sections.
 */
function parseFragment(fragment) {
  const sections = {
    brand: null,
    navLinks: null,
    tools: null,
  };

  const children = Array.from(fragment.children);

  // Section 1: Brand
  if (children[0]) {
    sections.brand = children[0].cloneNode(true);
  }

  // Section 2: Nav Links
  if (children[1]) {
    sections.navLinks = children[1].cloneNode(true);
  }

  // Section 3: Tools
  if (children[2]) {
    sections.tools = children[2].cloneNode(true);
  }

  return sections;
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

  // Parse the fragment without mutating it
  const { brand, navLinks, tools } = parseFragment(fragment);

  // Clear the block content after parsing the fragment
  block.replaceChildren();

  nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('navbar', 'navbar-arena', 'g-container');

  // Section 1: Brand
  if (brand) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    moveInstrumentation(brand, logoWrapper);

    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    logoBlock.dataset.blockName = 'logo';
    moveInstrumentation(brand.firstElementChild, logoBlock);

    const spanArena = document.createElement('span');
    spanArena.classList.add('arena');

    const brandLink = brand.querySelector(':scope > p > picture')?.closest('a');
    if (brandLink) {
      const clonedBrandLink = brandLink.cloneNode(true);
      if (!clonedBrandLink.href) clonedBrandLink.href = '/'; // Default home link
      clonedBrandLink.classList.add('logo__picture');
      clonedBrandLink.dataset.logoName = 'Arena';
      spanArena.append(clonedBrandLink);
    } else {
      // Fallback if no link found, create a default one
      const defaultLink = document.createElement('a');
      defaultLink.href = '/';
      defaultLink.classList.add('logo__picture');
      defaultLink.dataset.logoName = 'Arena';
      const picture = brand.querySelector(':scope > p > picture');
      if (picture) {
        defaultLink.append(picture.cloneNode(true));
      }
      spanArena.append(defaultLink);
    }
    logoBlock.append(spanArena);
    logoWrapper.append(logoBlock);
    nav.append(logoWrapper);
  } else {
    // Ensure logo-wrapper is still created even if brand section is empty
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    logoBlock.dataset.blockName = 'logo';
    logoWrapper.append(logoBlock);
    nav.append(logoWrapper);
  }

  // Section 2: Nav Links
  if (navLinks) {
    navSections = document.createElement('div');
    navSections.classList.add('links');
    moveInstrumentation(navLinks, navSections);

    let currentElement = navLinks.firstElementChild;
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
        let link = currentElement.querySelector(':scope > a');
        let strong = currentElement.querySelector(':scope > strong');

        if (link) {
          span.append(link.cloneNode(true));
          if (link.title) linkTitle.classList.add(sanitizeClassName(link.title));
        } else if (strong) {
          span.append(strong.cloneNode(true));
          linkTitle.classList.add(sanitizeClassName(strong.textContent));
        } else {
          span.textContent = currentElement.textContent.trim();
          linkTitle.classList.add(sanitizeClassName(currentElement.textContent));
        }
        linkTitle.append(span);
        navSections.append(linkTitle);

        const nextSibling = currentElement.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'UL') {
          const desktopPanel = document.createElement('div');
          desktopPanel.classList.add('desktop-panel', 'panel', sanitizeClassName(span.textContent));
          desktopPanel.setAttribute('aria-hidden', 'true');
          moveInstrumentation(nextSibling, desktopPanel);

          const linkGridBlock = document.createElement('div');
          linkGridBlock.classList.add('link-grid', 'block');
          linkGridBlock.dataset.blockName = 'link-grid';
          desktopPanel.append(linkGridBlock);

          const linkContainerSection = document.createElement('div');
          linkContainerSection.classList.add('link-container-section');
          linkGridBlock.append(linkContainerSection);

          const linkGridColumn = document.createElement('div');
          linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Default to vertical
          linkContainerSection.append(linkGridColumn);

          const ul = nextSibling.cloneNode(true);
          ul.classList.add('content', 'links-container', 'accordian-content');
          linkGridColumn.append(ul);

          // Check if the UL contains P elements, indicating horizontal layout
          if (ul.querySelector(':scope > li > p')) {
            linkGridColumn.classList.remove('link-column-vertical');
            linkGridColumn.classList.add('link-column-horizontal');
          }

          navSections.append(desktopPanel);
          currentElement = nextSibling.nextElementSibling; // Skip the UL as it's processed
          continue;
        }
      }
      currentElement = currentElement.nextElementSibling;
    }
    nav.append(navSections);
  }

  // Section 3: Tools
  if (tools) {
    navTools = document.createElement('div');
    navTools.classList.add('right');
    navTools.id = 'nav-right';
    moveInstrumentation(tools, navTools);

    let currentToolEl = tools.firstElementChild;
    while (currentToolEl) {
      if (currentToolEl.nodeType === Node.COMMENT_NODE) {
        currentToolEl = currentToolEl.nextElementSibling;
        continue;
      }

      if (currentToolEl.tagName === 'UL') {
        Array.from(currentToolEl.children).forEach(li => {
          const anchor = li.querySelector(':scope > a');
          const text = li.textContent.trim();

          // Language selector
          if (li.classList.contains('language')) {
            const langDiv = document.createElement('div');
            langDiv.classList.add('language');
            langDiv.textContent = text;
            navTools.append(langDiv);
            moveInstrumentation(li, langDiv);
          }
          // Sign In / User Dropdown
          else if (li.classList.contains('sign-in')) {
            const signInWrapper = document.createElement('div');
            signInWrapper.classList.add('sign-in-wrapper', 'hidden');
            moveInstrumentation(li, signInWrapper);

            const signInBlock = document.createElement('div');
            signInBlock.classList.add('sign-in', 'block');
            signInBlock.dataset.blockName = 'sign-in';
            signInWrapper.append(signInBlock);

            userDropdown = document.createElement('div');
            userDropdown.classList.add('user__dropdown');
            signInBlock.append(userDropdown);

            const userAccount = document.createElement('div');
            userAccount.classList.add('user__account');
            userDropdown.append(userAccount);

            const signInButton = document.createElement('div');
            signInButton.classList.add('user__account--link', 'sign-in-btn');
            const signInButtonText = li.querySelector(':scope > button')?.textContent || 'Sign In';
            const signInButtonImgSrc = li.querySelector(':scope > img')?.src || 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg';
            signInButton.innerHTML = `
              <span class="user__account__list-icon">
                <img src="${signInButtonImgSrc}" loading="lazy" alt="${signInButtonText}">
              </span>
              <button type="button" data-sign-out-text="Sign Out">${signInButtonText}</button>
            `;
            userAccount.append(signInButton);

            // Add other user account links from the fragment
            li.querySelectorAll(':scope > ul > li > a').forEach(accountLink => {
              const clonedAccountLink = accountLink.cloneNode(true);
              clonedAccountLink.classList.add('user__account--link', sanitizeClassName(accountLink.textContent));
              userAccount.append(clonedAccountLink);
            });
            navTools.append(signInWrapper);
          }
          // Contact Us
          else if (li.classList.contains('contact')) {
            const contactWrapper = document.createElement('div');
            contactWrapper.classList.add('contact-wrapper');
            moveInstrumentation(li, contactWrapper);

            const contactBlock = document.createElement('div');
            contactBlock.classList.add('contact', 'block');
            contactBlock.dataset.blockName = 'contact';
            contactWrapper.append(contactBlock);

            const contactDiv = document.createElement('div');
            contactDiv.classList.add('contact_wrp_arena', 'user__contact', 'header');
            contactBlock.append(contactDiv);

            const h4 = document.createElement('h4');
            h4.classList.add('user__contact-title');
            h4.textContent = anchor ? anchor.textContent : 'Contact Us';
            contactDiv.append(h4);

            const iconPhone = document.createElement('span');
            iconPhone.classList.add('user__contact-title', 'icon-phone');
            iconPhone.setAttribute('aria-label', anchor ? anchor.textContent : 'Contact Us');
            contactDiv.append(iconPhone);

            const userContactIcons = document.createElement('div');
            userContactIcons.classList.add('user__contact__icons', 'hidden');
            contactDiv.append(userContactIcons);

            const contactToggleBoxDiv = document.createElement('div');
            contactToggleBoxDiv.classList.add('hidden', 'contact-toggle-box');
            contactDiv.append(contactToggleBoxDiv);

            const userContactCallContainer = document.createElement('div');
            userContactCallContainer.classList.add('user__contact__icon-call_container');
            contactToggleBoxDiv.append(userContactCallContainer);

            li.querySelectorAll(':scope > ul > li').forEach(subLi => {
              const subAnchor = subLi.querySelector(':scope > a');
              if (subAnchor) {
                const subText = subAnchor.textContent.toLowerCase();
                if (subText.includes('whatsapp')) {
                  const whatsappLink = document.createElement('a');
                  whatsappLink.href = subAnchor.href;
                  whatsappLink.target = '_blank';
                  whatsappLink.classList.add('user__contact--icon', 'whatsapp');
                  whatsappLink.setAttribute('rel', 'noopener noreferrer');
                  whatsappLink.innerHTML = `<span class="sr-only">whatsapp</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg" alt="whatsapp" loading="lazy">`;
                  userContactIcons.append(whatsappLink);
                } else if (subText.includes('email')) {
                  const emailLink = document.createElement('a');
                  emailLink.href = subAnchor.href;
                  emailLink.classList.add('user__contact--icon', 'email');
                  emailLink.innerHTML = `<span class="sr-only">email</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg" alt="email" loading="lazy">`;
                  userContactIcons.append(emailLink);
                } else if (subAnchor.href.startsWith('tel:')) { // Phone number
                  const phoneLink = document.createElement('a');
                  phoneLink.href = subAnchor.href;
                  phoneLink.classList.add('primary-telephone');
                  phoneLink.textContent = subAnchor.textContent;
                  userContactCallContainer.append(phoneLink);
                }
              }
            });

            // Add phone icon for mobile
            const phoneIcon = document.createElement('a');
            phoneIcon.href = '#';
            phoneIcon.classList.add('user__contact--icon', 'phone');
            phoneIcon.onclick = (e) => {
              e.preventDefault();
              contactToggleBoxDiv.classList.toggle('hidden');
            };
            phoneIcon.innerHTML = `<span class="sr-only">phone</span><img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg" alt="phone" loading="lazy">`;
            userContactIcons.prepend(phoneIcon); // Prepend to match original HTML order

            contactToggleBox = contactToggleBoxDiv; // Store reference
            navTools.append(contactWrapper);
          }
        });
      }
      currentToolEl = currentToolEl.nextElementSibling;
    }
    nav.append(navTools);
  } else {
    // Ensure nav-right is still created even if tools section is empty
    navTools = document.createElement('div');
    navTools.classList.add('right');
    navTools.id = 'nav-right';
    nav.append(navTools);
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.addEventListener('click', () => toggleMenu());
  nav.prepend(hamburger);
  moveInstrumentation(block.firstElementChild, hamburger); // Assuming first child is the original hamburger

  // Car Filter Menu (if present in original HTML, it's a sibling of nav)
  carFilterMenu = document.createElement('div');
  carFilterMenu.id = 'carFilterMenu';
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  carPanelHeader.innerHTML = `
    <div></div>
    <span class="car-text">Cars</span>
    <span class="car-filter-close"><img src="/icons/close.svg" alt="close"></span>
  `;
  carFilterMenu.append(carPanelHeader);

  const carFilterClose = carPanelHeader.querySelector('.car-filter-close');
  if (carFilterClose) {
    carFilterClose.addEventListener('click', () => {
      carFilterMenu.classList.add('hidden');
      document.body.classList.remove('menu-open');
    });
  }

  // Mobile Menu container
  menu = document.createElement('div');
  menu.id = 'menu';
  menu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  menu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  menu.append(menuList);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('corp-header', 'block');
  navWrapper.dataset.blockName = 'corp-header';
  navWrapper.append(nav);
  block.append(navWrapper);
  block.append(carFilterMenu);
  block.append(menu);

  // Set up event listeners
  setupMobileNav();
  setupDesktopNav();

  // Initial state and resize handling
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(isDesktop.matches));

  // Escape key listener for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      toggleMenu(true); // Close mobile menu
    }
  });

  // Behavioral Justification:
  // Desktop navigation uses a CSS-driven hover model for submenus.
  // The CSS rules `.navbar .links .link-title:hover + .desktop-panel, .desktop-panel:hover`
  // and `.desktop-panel { display: none; opacity: 0; visibility: hidden; }`
  // indicate that submenus appear on hover. JavaScript is used to add/remove `.active`
  // classes and `aria-expanded`/`aria-hidden` attributes for accessibility and
  // to manage menu state (e.g., closing other menus when one opens).
  //
  // Mobile navigation uses a JS-driven click/toggle model.
  // The CSS rules `.menu.hidden { display: none !important; }` and `.panel { max-height: 0; overflow: hidden; }`
  // coupled with JS toggling of `.hidden` and `max-height` for `.panel` elements confirm this.
  // The `.accordion` class on `li` items in the mobile menu suggests a click-to-expand behavior.
}
