import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.links');
    if (!navSections) return;

    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.links');
    if (!navSections) return;

    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('link-title');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.links'));
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
  sections.querySelectorAll('.link-title').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const panel = section.nextElementSibling;
    if (panel && panel.classList.contains('desktop-panel')) {
      panel.classList.toggle('hidden', !expanded);
      panel.style.opacity = expanded ? '1' : '0';
      panel.style.visibility = expanded ? 'visible' : 'hidden';
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
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  const mobileMenu = document.getElementById('menu');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (!isDesktop.matches) {
    mobileMenu.classList.toggle('hidden', expanded);
    if (!expanded) {
      // If expanding mobile menu, ensure desktop panels are hidden
      toggleAllNavSections(navSections, false);
    }
  } else {
    mobileMenu.classList.add('hidden'); // Always hide mobile menu on desktop
  }

  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.link-title');
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

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createLinkGrid(ulElement) {
  const linkGrid = document.createElement('div');
  linkGrid.classList.add('link-grid', 'block');
  const linkContainerSection = document.createElement('div');
  linkContainerSection.classList.add('link-container-section');
  const linkGridColumn = document.createElement('div');
  linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

  const linksContainer = document.createElement('ul');
  linksContainer.classList.add('content', 'links-container', 'accordian-content');

  Array.from(ulElement.children).forEach((li) => {
    const newLi = document.createElement('li');
    const anchor = li.querySelector('a');
    if (anchor) {
      const newAnchor = document.createElement('a');
      newAnchor.href = anchor.href;
      newAnchor.textContent = anchor.textContent;
      if (anchor.target) newAnchor.target = anchor.target;
      if (anchor.rel) newAnchor.rel = anchor.rel;
      newLi.append(newAnchor);

      const paragraph = li.querySelector('p');
      if (paragraph) {
        const newP = document.createElement('p');
        newP.textContent = paragraph.textContent;
        newLi.append(newP);
      }
    }
    linksContainer.append(newLi);
  });

  linkGridColumn.append(linksContainer);
  linkContainerSection.append(linkGridColumn);
  linkGrid.append(linkContainerSection);
  return linkGrid;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath + '.plain.html');

  // decorate nav DOM
  block.textContent = '';
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('corp-header', 'block');
  headerWrapper.setAttribute('data-block-name', 'corp-header');

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false"><span class="nav-hamburger-icon"></span></button>';
  navbar.append(hamburger);

  // Logo Wrapper (Brand)
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  logoBlock.setAttribute('data-block-name', 'logo');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const brandSection = fragment.children[0];
  let brandLinkElement = null;
  if (brandSection) {
    brandLinkElement = brandSection.querySelector('a');
  }

  if (brandLinkElement) {
    const logoPicture = document.createElement('a');
    logoPicture.classList.add('logo__picture');
    logoPicture.href = brandLinkElement.href;
    logoPicture.setAttribute('data-logo-name', brandLinkElement.textContent.trim());

    const picture = brandLinkElement.querySelector('picture');
    if (picture) {
      logoPicture.append(picture.cloneNode(true));
    } else {
      // Fallback if no picture element, create an img
      const img = document.createElement('img');
      img.alt = brandLinkElement.textContent.trim() || 'Logo';
      img.src = '/icons/logo.svg'; // Generic fallback
      logoPicture.append(img);
    }
    logoSpan.append(logoPicture);
  } else {
    // Fallback if no brand link in fragment
    const logoPicture = document.createElement('a');
    logoPicture.classList.add('logo__picture');
    logoPicture.href = '/';
    logoPicture.setAttribute('data-logo-name', 'Brand');
    const img = document.createElement('img');
    img.alt = 'Brand Logo';
    img.src = '/icons/logo.svg'; // Generic fallback
    logoPicture.append(img);
    logoSpan.append(logoPicture);
  }

  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

  // Links (Sections)
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  // Mobile Menu container
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');

  const mobileMenuHeader = document.createElement('div');
  mobileMenuHeader.classList.add('menu-header');
  mobileMenuHeader.innerHTML = '<div class="back-arrow"></div><span class="menu-title">Menu</span><span class="close-icon"></span>';
  mobileMenu.append(mobileMenuHeader);

  const mobileMenuList = document.createElement('ul');
  mobileMenuList.classList.add('menu-list');
  mobileMenu.append(mobileMenuList);

  // Iterate over fragment sections (skipping the first which is brand)
  Array.from(fragment.children).slice(1).forEach((section, i) => {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    let l1Link = section.querySelector('p.button-container > a');
    let l1LabelText = '';
    let hasSubMenu = false;
    let desktopPanelContent = null;

    if (l1Link) {
      const span = document.createElement('span');
      span.append(l1Link.cloneNode(true));
      linkTitle.append(span);
      l1LabelText = l1Link.textContent.trim();
    } else {
      // If no button, try to find a direct text
      const firstDiv = section.querySelector('div:first-child');
      if (firstDiv && firstDiv.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = firstDiv.textContent.trim();
        linkTitle.append(span);
        l1LabelText = firstDiv.textContent.trim();
      }
    }

    const ulElement = section.querySelector('ul');
    if (ulElement) {
      hasSubMenu = true;
      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel');
      desktopPanel.classList.add(l1LabelText.toLowerCase().replace(/\s/g, '-')); // Add class based on label
      desktopPanel.classList.add('hidden'); // Initially hidden
      desktopPanelContent = createLinkGrid(ulElement);
      desktopPanel.append(desktopPanelContent);
      linksDiv.append(desktopPanel); // Append desktop panel to linksDiv, but keep it hidden

      // Add event listener for desktop dropdown
      linkTitle.addEventListener('mouseover', () => {
        if (isDesktop.matches) {
          // Hide all other open desktop panels
          linksDiv.querySelectorAll('.desktop-panel:not(.hidden)').forEach(panel => {
            panel.classList.add('hidden');
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
            const prevLinkTitle = panel.previousElementSibling;
            if (prevLinkTitle && prevLinkTitle.classList.contains('link-title')) {
              prevLinkTitle.setAttribute('aria-expanded', 'false');
            }
          });
          desktopPanel.classList.remove('hidden');
          desktopPanel.style.opacity = '1';
          desktopPanel.style.visibility = 'visible';
          linkTitle.setAttribute('aria-expanded', 'true');
        }
      });

      desktopPanel.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          desktopPanel.classList.add('hidden');
          desktopPanel.style.opacity = '0';
          desktopPanel.style.visibility = 'hidden';
          linkTitle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    linksDiv.append(linkTitle);

    // Mobile menu item
    const mobileMenuItem = document.createElement('li');
    mobileMenuItem.id = `menu-item-${i}`;
    mobileMenuItem.classList.add('nav-link');
    if (hasSubMenu) {
      mobileMenuItem.classList.add('accordion');
    }
    mobileMenuItem.classList.add(l1LabelText.toLowerCase().replace(/\s/g, '-'));

    const mobileMenuTitle = document.createElement('span');
    mobileMenuTitle.classList.add('menu-title');
    if (l1Link) {
      mobileMenuTitle.append(l1Link.cloneNode(true));
    } else {
      mobileMenuTitle.textContent = l1LabelText;
    }
    mobileMenuItem.append(mobileMenuTitle);
    mobileMenuList.append(mobileMenuItem);

    if (hasSubMenu) {
      const mobileSubPanel = document.createElement('div');
      mobileSubPanel.classList.add('panel');
      mobileSubPanel.append(desktopPanelContent.cloneNode(true)); // Re-use content
      mobileMenuList.append(mobileSubPanel);

      mobileMenuItem.addEventListener('click', () => {
        if (!isDesktop.matches) {
          mobileMenuItem.classList.toggle('active');
          const panel = mobileMenuItem.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = `${panel.scrollHeight}px`;
          }
        }
      });
    }
  });

  navbar.append(linksDiv);

  // Right section (Tools)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  contactBlock.setAttribute('data-block-name', 'contact');
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');

  // Extract contact details from fragment if available, otherwise use defaults
  const contactSection = fragment.children[fragment.children.length - 3]; // Assuming contact is third from last
  let contactTitle = 'Contact Us';
  let phoneLink = '#';
  let phoneText = '';
  let whatsappLink = '#';
  let emailLink = '#';
  let phoneIconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg';
  let whatsappIconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg';
  let emailIconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg';

  if (contactSection) {
    const h4 = contactSection.querySelector('h4');
    if (h4) contactTitle = h4.textContent.trim();

    const phoneAnchor = contactSection.querySelector('a[href^="tel:"]');
    if (phoneAnchor) {
      phoneLink = phoneAnchor.href;
      phoneText = phoneAnchor.textContent.trim();
    }

    const whatsappAnchor = contactSection.querySelector('a[href*="wa.me"]');
    if (whatsappAnchor) whatsappLink = whatsappAnchor.href;

    const emailAnchor = contactSection.querySelector('a[href^="mailto:"]');
    if (emailAnchor) emailLink = emailAnchor.href;

    const phoneImg = contactSection.querySelector('a.phone img');
    if (phoneImg) phoneIconSrc = phoneImg.src;

    const whatsappImg = contactSection.querySelector('a.whatsapp img');
    if (whatsappImg) whatsappIconSrc = whatsappImg.src;

    const emailImg = contactSection.querySelector('a.email img');
    if (emailImg) emailIconSrc = emailImg.src;
  }

  contactWrpArena.innerHTML = `
    <h4 class="user__contact-title">${contactTitle}</h4>
    <span class="user__contact-title icon-phone" aria-label="${contactTitle}"></span>
    <div class="user__contact__icons hidden">
      <a href="${phoneLink}" class="user__contact--icon phone" onclick="event.preventDefault(); this.closest('.contact').querySelector('.contact-toggle-box').classList.toggle('hidden')">
        <span class="sr-only">phone</span>
        <img src="${phoneIconSrc}" alt="phone" loading="lazy">
      </a>
      <div class="hidden">${phoneText}</div>
      <div class="hidden"></div>
      <a href="${whatsappLink}" target="_blank" class="user__contact--icon whatsapp" rel="noopener noreferrer">
        <span class="sr-only">whatsapp</span>
        <img src="${whatsappIconSrc}" alt="whatsapp" loading="lazy">
      </a>
      <a href="${emailLink}" class="user__contact--icon email">
        <span class="sr-only">email</span>
        <img src="${emailIconSrc}" alt="email" loading="lazy">
      </a>
    </div>
    <div class="hidden contact-toggle-box">
      <div class="user__contact__icon-call_container">
        <a href="${phoneLink}" class="primary-telephone">${phoneText}</a>
        <a href="" class="secondary-telephone"></a>
      </div>
    </div>
  `;
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  // Language text should ideally come from metadata or fragment
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInBlock.setAttribute('data-block-name', 'sign-in');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Extract sign-in links from fragment if available
  const signInSection = fragment.children[fragment.children.length - 2]; // Assuming sign-in is second from last
  let reachUsLink = '#';
  let reachUsText = 'Reach Us';
  let profileLink = '#';
  let profileText = 'Profile';
  let signInButtonText = 'Sign In';
  let signOutButtonText = 'Sign Out';
  let reachUsIconSrc = 'https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&format=svg&optimize=medium';
  let profileIconSrc = 'https://www.marutisuzuki.com/common/media_13b57ab8376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&format=svg&optimize=medium';
  let signInIconSrc = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg';

  if (signInSection) {
    const links = signInSection.querySelectorAll('a');
    if (links[0]) {
      reachUsLink = links[0].href;
      reachUsText = links[0].textContent.trim();
      const img = links[0].querySelector('img');
      if (img) reachUsIconSrc = img.src;
    }
    if (links[1]) {
      profileLink = links[1].href;
      profileText = links[1].textContent.trim();
      const img = links[1].querySelector('img');
      if (img) profileIconSrc = img.src;
    }
    const signInButton = signInSection.querySelector('button');
    if (signInButton) {
      signInButtonText = signInButton.textContent.trim();
      signOutButtonText = signInButton.dataset.signOutText || 'Sign Out';
      const img = signInButton.closest('.user__account--link').querySelector('img');
      if (img) signInIconSrc = img.src;
    }
  }

  userAccount.innerHTML = `
    <a href="${reachUsLink}" class="user__account--link reach us" target="_self">
        <span class="user__account__list-icon">
            <img src="${reachUsIconSrc}" loading="lazy" alt="${reachUsText}">
        </span>
        ${reachUsText}
    </a>
    <a href="${profileLink}" class="user__account--link profile" target="_self">
        <span class="user__account__list-icon">
            <img src="${profileIconSrc}" loading="lazy" alt="${profileText}">
        </span>
        ${profileText}
    </a>
    <div class="user__account--link sign-in-btn">
        <span class="user__account__list-icon">
            <img src="${signInIconSrc}" loading="lazy" alt="${signInButtonText}">
        </span>
        <button type="button" data-sign-out-text="${signOutButtonText}">${signInButtonText}</button>
    </div>
  `;
  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbar.append(rightDiv);
  headerWrapper.append(navbar);

  // Car Filter Menu (if needed, currently hidden in original)
  const carFilterMenu = document.createElement('div');
  carFilterMenu.id = 'carFilterMenu';
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');

  // Extract car filter menu content from fragment if available
  const carFilterSection = fragment.children[fragment.children.length - 1]; // Assuming car filter is the last section
  if (carFilterSection) {
    const searchHeader = document.createElement('div');
    searchHeader.classList.add('search-header', 'block');
    const linkContainerSection = document.createElement('div');
    linkContainerSection.classList.add('link-container-section');

    Array.from(carFilterSection.children).forEach(child => {
      if (child.tagName === 'DIV' && child.querySelector('ul')) {
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        linkGridColumn.append(child.querySelector('ul').cloneNode(true));
        linkContainerSection.append(linkGridColumn);
      }
    });
    searchHeader.append(linkContainerSection);
    carFilterMenu.append(searchHeader);
  } else {
    // Fallback if no car filter section in fragment
    carFilterMenu.innerHTML = `
      <div class="search-header block">
        <div class="link-container-section">
          <!-- Default content if fragment doesn't provide it -->
          <div class="link-grid-column link-column-vertical">
            <ul class="content links-container accordian-content">
              <li><a href="#" target="_self">Default Link 1</a></li>
              <li><a href="#" target="_self">Default Link 2</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  carFilterMenu.innerHTML += `
    <div class="car-panel-header">
      <div></div>
      <span class="car-text">Cars</span>
      <span class="car-filter-close"><img src="/icons/close.svg" alt="close"></span>
    </div>
  `;
  headerWrapper.append(carFilterMenu);
  headerWrapper.append(mobileMenu);

  block.append(headerWrapper);

  // Event listeners for mobile menu toggle
  hamburger.addEventListener('click', () => toggleMenu(block, linksDiv));
  mobileMenuHeader.querySelector('.close-icon').addEventListener('click', () => toggleMenu(block, linksDiv));
  mobileMenuHeader.querySelector('.back-arrow').addEventListener('click', () => {
    // Logic for back arrow in mobile menu
    // For now, it closes the whole menu, but could be adapted for sub-menu navigation
    toggleMenu(block, linksDiv);
  });


  // Initial state and resize listener
  toggleMenu(block, linksDiv, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(block, linksDiv, isDesktop.matches));
}
