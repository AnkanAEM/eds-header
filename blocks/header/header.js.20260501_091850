import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');

let navWrapper = null;
let nav = null;
let navSections = null; // Will be assigned to desktopNav
let hamburger = null;
let menu = null;

function sanitizeClassName(str) {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || null;
}

function moveInstrumentation(sourceElement, targetElement) {
  if (!sourceElement || !targetElement) return;
  const cqDecorated = sourceElement.getAttribute('data-cq-decorated');
  if (cqDecorated) {
    targetElement.setAttribute('data-cq-decorated', cqDecorated);
  }
  const cqPath = sourceElement.getAttribute('data-cq-path');
  if (cqPath) {
    targetElement.setAttribute('data-cq-path', cqPath);
  }
  const cqType = sourceElement.getAttribute('data-cq-type');
  if (cqType) {
    targetElement.setAttribute('data-cq-type', cqType);
  }
}

function closeAllDropdowns(force = false) {
  if (!navSections) return; // navSections is desktopNav
  navSections.querySelectorAll('.link-title[aria-expanded="true"]').forEach((section) => {
    if (force || !section.contains(document.activeElement)) {
      section.setAttribute('aria-expanded', 'false');
      const panel = section.nextElementSibling;
      if (panel && panel.classList.contains('desktop-panel')) {
        panel.classList.remove('desktop-panel-active');
      }
    }
  });
}

function closeMenu(force = true) {
  if (!nav || !hamburger || !menu) return;
  nav.setAttribute('aria-expanded', 'false');
  hamburger.querySelector('button').setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
  menu.classList.add('hidden');
  if (force) {
    menu.querySelectorAll('.panel').forEach((panel) => {
      panel.style.maxHeight = null;
      panel.classList.remove('accordion-active');
    });
    menu.querySelectorAll('.accordion').forEach((accordion) => {
      accordion.classList.remove('accordion-active');
    });
  }
}

function openMenu() {
  if (!nav || !hamburger || !menu) return;
  nav.setAttribute('aria-expanded', 'true');
  hamburger.querySelector('button').setAttribute('aria-expanded', 'true');
  document.body.style.overflowY = 'hidden';
  menu.classList.remove('hidden');
}

function setupDesktopNav(desktopNavElement) {
  if (!desktopNavElement) return;
  desktopNavElement.classList.add('links');

  desktopNavElement.querySelectorAll(':scope > .link-title').forEach((linkTitle) => {
    const nextSibling = linkTitle.nextElementSibling;
    if (nextSibling && nextSibling.tagName === 'DIV' && nextSibling.classList.contains('desktop-panel')) {
      linkTitle.addEventListener('mouseenter', () => {
        closeAllDropdowns();
        linkTitle.setAttribute('aria-expanded', 'true');
        nextSibling.classList.add('desktop-panel-active');
      });
      nextSibling.addEventListener('mouseleave', () => {
        linkTitle.setAttribute('aria-expanded', 'false');
        nextSibling.classList.remove('desktop-panel-active');
      });
    } else {
      linkTitle.addEventListener('mouseenter', () => {
        closeAllDropdowns();
      });
    }
  });

  desktopNavElement.addEventListener('mouseleave', () => {
    closeAllDropdowns();
  });
}

function setupMobileNav(mobileNavListElement) {
  if (!mobileNavListElement) return;
  mobileNavListElement.classList.add('menu-list');

  mobileNavListElement.querySelectorAll(':scope > li').forEach((menuItem) => {
    const panel = menuItem.querySelector(':scope > .panel'); // Panel is now a child of LI
    if (panel) {
      menuItem.classList.add('accordion');
      const titleSpan = menuItem.querySelector(':scope > .menu-title');
      if (titleSpan) {
        titleSpan.addEventListener('click', () => {
          menuItem.classList.toggle('accordion-active');
          panel.classList.toggle('accordion-active');
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = `${panel.scrollHeight}px`;
          }
        });
      }
    }
  });
}

export default async function decorate(block) {
  // Preserve original classes on the block
  const blockClasses = Array.from(block.classList);
  block.className = ''; // Clear existing classes
  blockClasses.forEach((cls) => block.classList.add(cls));
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'show');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  navWrapper = document.createElement('div');
  navWrapper.classList.add('corp-header', 'block');
  moveInstrumentation(block, navWrapper); // Move instrumentation from original block to new wrapper

  nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('navbar', 'navbar-arena', 'g-container');

  const fragmentSections = Array.from(fragment.children);

  // Section 1: Brand (Logo)
  const brandSection = fragmentSections[0];
  if (brandSection) {
    const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    // Move instrumentation from the default-content-wrapper or the section itself
    moveInstrumentation(brandRoot, logoBlock);

    const picture = brandRoot.querySelector(':scope > p:first-of-type picture');
    const anchorFromFragment = brandRoot.querySelector(':scope > p:first-of-type a');

    if (picture && anchorFromFragment) {
      const anchor = document.createElement('a');
      anchor.classList.add('logo__picture');
      anchor.href = anchorFromFragment.href || '/';
      // Extract data-logo-name from fragment if available, otherwise default
      anchor.setAttribute('data-logo-name', anchorFromFragment.getAttribute('data-logo-name') || 'Arena');
      anchor.append(picture.cloneNode(true));
      logoBlock.append(anchor);
    } else if (picture) { // Fallback if no anchor but picture exists
      const anchor = document.createElement('a');
      anchor.classList.add('logo__picture');
      anchor.href = '/';
      anchor.setAttribute('data-logo-name', 'Arena');
      anchor.append(picture.cloneNode(true));
      logoBlock.append(anchor);
    }
    logoWrapper.append(logoBlock);
    nav.append(logoWrapper);
  }

  // Section 2: Nav Links
  const navContentSection = fragmentSections[1];
  let desktopNav = null;
  let mobileNavList = null;

  if (navContentSection) {
    const navRoot = navContentSection.querySelector(':scope > .default-content-wrapper') || navContentSection;
    desktopNav = document.createElement('div');
    desktopNav.classList.add('links'); // Class added here, then setupDesktopNav adds more logic

    mobileNavList = document.createElement('ul');
    mobileNavList.classList.add('menu-list');

    let el = navRoot.firstElementChild;
    let navItemIndex = 0;
    while (el) {
      if (el.tagName === 'P') {
        const linkTitle = document.createElement('div');
        linkTitle.classList.add('link-title');
        const span = document.createElement('span');
        const anchor = el.querySelector(':scope > a');
        const strong = el.querySelector(':scope > strong');
        const textContent = (anchor || strong || el).textContent.trim(); // Get text from anchor, strong, or P
        const itemClasses = [];

        if (anchor) {
          const clonedAnchor = anchor.cloneNode(true);
          const cls = sanitizeClassName(clonedAnchor.textContent);
          if (cls) itemClasses.push(cls);
          span.append(clonedAnchor);
        } else if (strong) {
          const clonedStrong = strong.cloneNode(true);
          const cls = sanitizeClassName(clonedStrong.textContent);
          if (cls) itemClasses.push(cls);
          span.append(clonedStrong);
        } else if (textContent) {
          const cls = sanitizeClassName(textContent);
          if (cls) itemClasses.push(cls);
          span.textContent = textContent;
        }
        linkTitle.append(span);
        moveInstrumentation(el, linkTitle);

        desktopNav.append(linkTitle);

        const mobileListItem = document.createElement('li');
        mobileListItem.id = `menu-item-${navItemIndex}`;
        mobileListItem.classList.add('nav-link', ...itemClasses);
        const mobileMenuTitleSpan = document.createElement('span');
        mobileMenuTitleSpan.classList.add('menu-title');
        if (anchor) {
          mobileMenuTitleSpan.append(anchor.cloneNode(true));
        } else {
          mobileMenuTitleSpan.textContent = textContent;
        }
        mobileListItem.append(mobileMenuTitleSpan);
        // mobileNavList.append(mobileListItem); // Append after potential panel

        const nextSibling = el.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'UL') {
          // Desktop panel
          const desktopPanel = document.createElement('div');
          desktopPanel.classList.add('desktop-panel', 'panel', ...itemClasses);
          const linkGridBlock = document.createElement('div');
          linkGridBlock.classList.add('link-grid', 'block');
          const linkContainerSection = document.createElement('div');
          linkContainerSection.classList.add('link-container-section');
          const linkGridColumn = document.createElement('div');
          linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

          const ul = nextSibling.cloneNode(true); // Clone the UL for desktop
          ul.classList.add('content', 'links-container', 'accordian-content');
          linkGridColumn.append(ul);
          linkContainerSection.append(linkGridColumn);
          linkGridBlock.append(linkContainerSection);
          desktopPanel.append(linkGridBlock);
          desktopNav.append(desktopPanel);
          moveInstrumentation(nextSibling, desktopPanel);

          // Mobile panel (as a child of the mobile list item)
          const mobilePanel = document.createElement('div');
          mobilePanel.classList.add('panel');
          const mobileLinkGridBlock = linkGridBlock.cloneNode(true); // Clone for mobile
          mobilePanel.append(mobileLinkGridBlock);
          mobileListItem.append(mobilePanel); // Append panel inside the li

          el = nextSibling.nextElementSibling; // Skip the UL
        } else {
          el = el.nextElementSibling;
        }
        mobileNavList.append(mobileListItem); // Append mobile list item here
        navItemIndex += 1;
      } else {
        el = el.nextElementSibling;
      }
    }
  }
  nav.append(desktopNav);
  navSections = desktopNav; // Assign desktopNav to navSections for dropdown management

  // Section 3: Tools
  const toolsSection = fragmentSections[2];
  const navRight = document.createElement('div');
  navRight.id = 'nav-right';
  navRight.classList.add('right');

  // Language selector (always present in original HTML)
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = 'EN';
  navRight.append(languageDiv); // Append first as per original HTML structure

  if (toolsSection) {
    const toolsRoot = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
    let toolEl = toolsRoot.firstElementChild;
    while (toolEl) {
      if (toolEl.tagName === 'UL') {
        const ul = toolEl.cloneNode(true);
        // Check if this UL contains social/contact icons (e.g., whatsapp, tel, mail)
        if (ul.querySelector(':scope > li a[href*="whatsapp"], :scope > li a[href^="tel:"], :scope > li a[href^="mailto:"]')) {
          const contactWrapper = document.createElement('div');
          contactWrapper.classList.add('contact-wrapper');
          const contactBlock = document.createElement('div');
          contactBlock.classList.add('contact', 'block');
          contactBlock.classList.add('contact_wrp_arena', 'user__contact', 'header');
          moveInstrumentation(toolEl, contactBlock);

          const contactTitle = document.createElement('h4');
          contactTitle.classList.add('user__contact-title');
          contactTitle.textContent = 'Contact Us'; // Hardcoded in original HTML
          contactBlock.append(contactTitle);

          const phoneIconSpan = document.createElement('span');
          phoneIconSpan.classList.add('user__contact-title', 'icon-phone');
          phoneIconSpan.setAttribute('aria-label', 'Contact Us');
          contactBlock.append(phoneIconSpan);

          const contactIconsDiv = document.createElement('div');
          contactIconsDiv.classList.add('user__contact__icons', 'hidden');

          ul.querySelectorAll(':scope > li').forEach((li) => {
            const anchor = li.querySelector(':scope > a');
            if (anchor) {
              const iconLink = document.createElement('a');
              iconLink.href = anchor.href;
              iconLink.target = anchor.target;
              if (anchor.href.includes('whatsapp')) {
                iconLink.classList.add('user__contact--icon', 'whatsapp');
                iconLink.rel = 'noopener noreferrer';
                const srOnlySpan = document.createElement('span');
                srOnlySpan.classList.add('sr-only');
                srOnlySpan.textContent = 'whatsapp';
                iconLink.append(srOnlySpan);
                const img = document.createElement('img');
                img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg'; // Hardcoded in original HTML
                img.alt = 'whatsapp';
                img.loading = 'lazy';
                iconLink.append(img);
              } else if (anchor.href.startsWith('tel:')) {
                iconLink.classList.add('user__contact--icon', 'phone');
                iconLink.addEventListener('click', (event) => {
                  event.preventDefault();
                  contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
                });
                const srOnlySpan = document.createElement('span');
                srOnlySpan.classList.add('sr-only');
                srOnlySpan.textContent = 'phone';
                iconLink.append(srOnlySpan);
                const img = document.createElement('img');
                img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg'; // Hardcoded in original HTML
                img.alt = 'phone';
                img.loading = 'lazy';
                iconLink.append(img);
              } else if (anchor.href.startsWith('mailto:')) {
                iconLink.classList.add('user__contact--icon', 'email');
                const srOnlySpan = document.createElement('span');
                srOnlySpan.classList.add('sr-only');
                srOnlySpan.textContent = 'email';
                iconLink.append(srOnlySpan);
                const img = document.createElement('img');
                img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg'; // Hardcoded in original HTML
                img.alt = 'email';
                img.loading = 'lazy';
                iconLink.append(img);
              }
              contactIconsDiv.append(iconLink);
            }
          });
          contactBlock.append(contactIconsDiv);

          const contactToggleBox = document.createElement('div');
          contactToggleBox.classList.add('hidden', 'contact-toggle-box');
          const callContainer = document.createElement('div');
          callContainer.classList.add('user__contact__icon-call_container');
          const telLink = ul.querySelector(':scope > li a[href^="tel:"]');
          if (telLink) {
            const primaryTel = document.createElement('a');
            primaryTel.href = telLink.href;
            primaryTel.classList.add('primary-telephone');
            primaryTel.textContent = telLink.textContent;
            callContainer.append(primaryTel);
          }
          contactToggleBox.append(callContainer);
          contactBlock.append(contactToggleBox);
          contactWrapper.append(contactBlock);
          navRight.append(contactWrapper);
        } else {
          // Other utility links (Sign In/Profile/Reach Us)
          const signInWrapper = document.createElement('div');
          signInWrapper.classList.add('sign-in-wrapper', 'hidden');
          const signInBlock = document.createElement('div');
          signInBlock.classList.add('sign-in', 'block');
          moveInstrumentation(toolEl, signInBlock);
          const userDropdown = document.createElement('div');
          userDropdown.classList.add('user__dropdown');
          const userAccount = document.createElement('div');
          userAccount.classList.add('user__account');

          ul.querySelectorAll(':scope > li').forEach((li) => {
            const anchor = li.querySelector(':scope > a');
            if (anchor) {
              const accountLink = document.createElement('a');
              accountLink.href = anchor.href;
              accountLink.classList.add('user__account--link', sanitizeClassName(anchor.textContent));
              accountLink.target = anchor.target;
              const iconSpan = document.createElement('span');
              iconSpan.classList.add('user__account__list-icon');
              const img = document.createElement('img');
              img.loading = 'lazy';
              img.alt = anchor.textContent;
              // Hardcoded image sources based on text content from original HTML
              if (anchor.textContent.toLowerCase().includes('reach us')) {
                img.src = 'https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&amp;format=svg&amp;optimize=medium';
              } else if (anchor.textContent.toLowerCase().includes('profile')) {
                img.src = 'https://www.marutisuzuki.com/common/media_13b57ab8376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&amp;format=svg&amp;optimize=medium';
              }
              iconSpan.append(img);
              accountLink.append(iconSpan);
              accountLink.append(document.createTextNode(anchor.textContent));
              userAccount.append(accountLink);
            } else {
              // Assuming this is the Sign In button if no anchor
              const signInBtnDiv = document.createElement('div');
              signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
              const iconSpan = document.createElement('span');
              iconSpan.classList.add('user__account__list-icon');
              const img = document.createElement('img');
              img.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg'; // Hardcoded in original HTML
              img.loading = 'lazy';
              img.alt = 'Sign-in';
              iconSpan.append(img);
              signInBtnDiv.append(iconSpan);
              const button = document.createElement('button');
              button.type = 'button';
              button.setAttribute('data-sign-out-text', 'Sign Out');
              button.textContent = 'Sign In'; // Hardcoded in original HTML
              signInBtnDiv.append(button);
              userAccount.append(signInBtnDiv);
            }
          });
          userDropdown.append(userAccount);
          signInBlock.append(userDropdown);
          signInWrapper.append(signInBlock);
          navRight.append(signInWrapper);
        }
      }
      toolEl = toolEl.nextElementSibling;
    }
  }

  nav.append(navRight);
  navWrapper.append(nav);

  // Hamburger for mobile
  hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false"><span class="nav-hamburger-icon"></span></button>';
  hamburger.addEventListener('click', () => {
    if (nav.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  });
  nav.prepend(hamburger);

  // Mobile Menu Container
  menu = document.createElement('div');
  menu.id = 'menu';
  menu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  menuHeader.append(backArrow);
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu'; // Hardcoded in original HTML
  menuHeader.append(menuTitle);
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  closeIcon.addEventListener('click', () => closeMenu());
  menuHeader.append(closeIcon);
  menu.append(menuHeader);

  if (mobileNavList) {
    menu.append(mobileNavList);
  }

  // Append sign-in items to mobile menu
  if (navRight) {
    const signInWrapper = navRight.querySelector('.sign-in-wrapper');
    if (signInWrapper) {
      const userAccount = signInWrapper.querySelector('.user__account');
      if (userAccount) {
        Array.from(userAccount.children).forEach((child) => {
          const mobileListItem = document.createElement('li');
          mobileListItem.append(child.cloneNode(true));
          mobileNavList.append(mobileListItem);
        });
      }
    }
  }

  navWrapper.append(menu);
  block.append(navWrapper);

  setupDesktopNav(desktopNav);
  setupMobileNav(mobileNavList);

  // Add Escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  // Initial state for mobile/desktop
  const onMediaChange = (e) => {
    if (e.matches) { // Desktop view
      closeMenu(); // Ensure mobile menu is closed
      nav.setAttribute('aria-expanded', 'false'); // Ensure nav is not expanded
      hamburger.querySelector('button').setAttribute('aria-expanded', 'false'); // Ensure hamburger is not expanded
    } else { // Mobile view
      closeAllDropdowns(); // Ensure desktop dropdowns are closed
    }
  };

  isDesktop.addEventListener('change', onMediaChange);
  onMediaChange(isDesktop); // Set initial state
}
