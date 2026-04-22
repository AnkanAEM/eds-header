import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)'); // Adjusted to 1200px based on original HTML's media queries

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const headerWrapper = document.querySelector('.corp-header-wrapper');
    const mobileMenu = headerWrapper.querySelector('.menu');
    const desktopPanels = headerWrapper.querySelectorAll('.desktop-panel');
    const navHamburger = headerWrapper.querySelector('.nav-hamburger button');
    const contactToggleBox = headerWrapper.querySelector('.contact-toggle-box');
    const contactIcons = headerWrapper.querySelector('.user__contact__icons');

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      navHamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }

    desktopPanels.forEach((panel) => {
      if (!panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        panel.classList.remove('opacity-1');
        panel.classList.remove('visibility-visible');
      }
    });

    if (contactToggleBox && !contactToggleBox.classList.contains('hidden')) {
      contactToggleBox.classList.add('hidden');
    }
    if (contactIcons && !contactIcons.classList.contains('hidden')) {
      contactIcons.classList.add('hidden');
    }

    if (navHamburger) navHamburger.focus();
  }
}

function closeAllDesktopPanels(headerWrapper) {
  headerWrapper.querySelectorAll('.desktop-panel').forEach((panel) => {
    panel.classList.add('hidden');
    panel.classList.remove('opacity-1');
    panel.classList.remove('visibility-visible');
  });
  headerWrapper.querySelectorAll('.navbar .links .link-title').forEach((linkTitle) => {
    linkTitle.classList.remove('active');
  });
}

function toggleMobileMenu(headerWrapper, forceExpanded = null) {
  const mobileMenu = headerWrapper.querySelector('.menu');
  const navHamburgerButton = headerWrapper.querySelector('.nav-hamburger button');
  const expanded = forceExpanded !== null ? forceExpanded : mobileMenu.classList.contains('hidden');

  if (expanded) {
    mobileMenu.classList.remove('hidden');
    navHamburgerButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
  } else {
    mobileMenu.classList.add('hidden');
    navHamburgerButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath); // Removed .plain.html as loadFragment handles it

  // decorate nav DOM
  block.textContent = '';

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');
  block.append(headerWrapper);

  const corpHeaderBlock = document.createElement('div');
  corpHeaderBlock.classList.add('corp-header', 'block');
  corpHeaderBlock.setAttribute('data-block-name', 'corp-header');
  corpHeaderBlock.setAttribute('data-block-status', 'loaded');
  headerWrapper.append(corpHeaderBlock);

  const mainDiv = document.createElement('div');
  corpHeaderBlock.append(mainDiv);

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');
  mainDiv.append(navbar);

  // Hamburger for mobile
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbar.append(navHamburger);

  // Logo Wrapper (Brand)
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  logoBlock.setAttribute('data-block-name', 'logo');
  logoBlock.setAttribute('data-block-status', 'loaded');
  logoWrapper.append(logoBlock);

  const navBrand = fragment.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      const spanArena = document.createElement('span');
      spanArena.classList.add('arena');
      const logoPicture = document.createElement('a');
      logoPicture.classList.add('logo__picture');
      logoPicture.href = brandLink.href;
      logoPicture.setAttribute('data-logo-name', brandLink.textContent.trim());

      const picture = brandLink.querySelector('picture');
      if (picture) {
        logoPicture.append(picture.cloneNode(true));
      } else {
        const img = brandLink.querySelector('img');
        if (img) logoPicture.append(img.cloneNode(true));
      }
      spanArena.append(logoPicture);
      logoBlock.append(spanArena);
    }
  }
  navbar.append(logoWrapper);

  // Navigation Links (Sections)
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  navbar.append(linksDiv);

  const navSections = fragment.querySelector('.nav-sections');
  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');
  mobileMenu.id = 'menu';
  mainDiv.append(mobileMenu);

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  mobileMenu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  mobileMenu.append(menuList);

  if (navSections) {
    navSections.querySelectorAll(':scope > div').forEach((section, i) => {
      const linkTitleDiv = document.createElement('div');
      linkTitleDiv.classList.add('link-title');
      const span = document.createElement('span');
      linkTitleDiv.append(span);

      const sectionL1Link = section.querySelector('a');
      if (sectionL1Link) {
        const link = document.createElement('a');
        link.href = sectionL1Link.href;
        link.textContent = sectionL1Link.textContent;
        link.title = sectionL1Link.textContent.toLowerCase().replace(/\s/g, '-');
        link.classList.add('button');
        span.append(link);
      } else {
        span.textContent = section.firstElementChild.textContent;
      }
      linksDiv.append(linkTitleDiv);

      const sectionName = section.firstElementChild.textContent.toLowerCase().replace(/\s/g, '-');
      const hasChildren = section.querySelector('ul');

      // Desktop Panel
      if (hasChildren) {
        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', sectionName, 'hidden');
        mainDiv.append(desktopPanel);
        const desktopLinkGrid = document.createElement('div');
        desktopLinkGrid.classList.add('link-grid', 'block');
        desktopPanel.append(desktopLinkGrid);
        const desktopLinkContainerSection = document.createElement('div');
        desktopLinkContainerSection.classList.add('link-container-section');
        desktopLinkGrid.append(desktopLinkContainerSection);

        const desktopLinkGridColumn = document.createElement('div');
        desktopLinkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Default to vertical
        desktopLinkContainerSection.append(desktopLinkGridColumn);

        const desktopLinksContainer = document.createElement('ul');
        desktopLinksContainer.classList.add('content', 'links-container', 'accordian-content');
        desktopLinkGridColumn.append(desktopLinksContainer);

        // Mobile Menu Item
        const mobileMenuItem = document.createElement('li');
        mobileMenuItem.id = `menu-item-${i}`;
        mobileMenuItem.classList.add('nav-link', sectionName);
        if (hasChildren) mobileMenuItem.classList.add('accordion');
        const mobileMenuTitleSpan = document.createElement('span');
        mobileMenuTitleSpan.classList.add('menu-title');
        if (sectionL1Link) {
          const mobileLink = document.createElement('a');
          mobileLink.href = sectionL1Link.href;
          mobileLink.textContent = sectionL1Link.textContent;
          mobileLink.title = sectionL1Link.textContent.toLowerCase().replace(/\s/g, '-');
          mobileLink.classList.add('button');
          mobileMenuTitleSpan.append(mobileLink);
        } else {
          mobileMenuTitleSpan.textContent = section.firstElementChild.textContent;
        }
        mobileMenuItem.append(mobileMenuTitleSpan);
        menuList.append(mobileMenuItem);

        const mobilePanel = document.createElement('div');
        mobilePanel.classList.add('panel');
        const mobileLinkGrid = desktopLinkGrid.cloneNode(true); // Clone desktop structure for mobile
        mobilePanel.append(mobileLinkGrid);
        menuList.append(mobilePanel);

        // Populate desktop and mobile sub-menus
        section.querySelectorAll('ul > li').forEach((li) => {
          const l2Link = li.querySelector('a');
          if (l2Link) {
            const desktopLi = document.createElement('li');
            const desktopA = document.createElement('a');
            desktopA.href = l2Link.href;
            desktopA.textContent = l2Link.textContent;
            if (l2Link.target) desktopA.target = l2Link.target;
            if (l2Link.rel) desktopA.rel = l2Link.rel;
            desktopLi.append(desktopA);
            desktopLinksContainer.append(desktopLi);

            const mobileLi = desktopLi.cloneNode(true);
            mobileLinkGrid.querySelector('.links-container').append(mobileLi);
          }
        });

        // Event listeners for desktop dropdowns
        linkTitleDiv.addEventListener('mouseenter', () => {
          closeAllDesktopPanels(mainDiv);
          linkTitleDiv.classList.add('active');
          desktopPanel.classList.remove('hidden');
          desktopPanel.classList.add('opacity-1', 'visibility-visible');
        });
        desktopPanel.addEventListener('mouseleave', () => {
          linkTitleDiv.classList.remove('active');
          desktopPanel.classList.add('hidden');
          desktopPanel.classList.remove('opacity-1', 'visibility-visible');
        });

        // Event listeners for mobile accordions
        mobileMenuItem.addEventListener('click', () => {
          if (!isDesktop.matches) {
            mobileMenuItem.classList.toggle('active');
            if (mobilePanel.style.maxHeight) {
              mobilePanel.style.maxHeight = null;
            } else {
              mobilePanel.style.maxHeight = `${mobilePanel.scrollHeight}px`;
            }
          }
        });
      } else {
        // No children, just a direct link
        const mobileMenuItem = document.createElement('li');
        mobileMenuItem.id = `menu-item-${i}`;
        mobileMenuItem.classList.add('nav-link', sectionName);
        const mobileMenuTitleSpan = document.createElement('span');
        mobileMenuTitleSpan.classList.add('menu-title');
        mobileMenuTitleSpan.append(sectionL1Link.cloneNode(true));
        mobileMenuItem.append(mobileMenuTitleSpan);
        menuList.append(mobileMenuItem);
      }
    });
  }

  // Right section (Tools)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';
  navbar.append(rightDiv);

  const navTools = fragment.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll(':scope > div').forEach((toolSection) => {
      if (toolSection.classList.contains('contact-wrapper')) {
        const contactWrapper = document.createElement('div');
        contactWrapper.classList.add('contact-wrapper');
        const contactBlock = document.createElement('div');
        contactBlock.classList.add('contact', 'block');
        contactBlock.setAttribute('data-block-name', 'contact');
        contactBlock.setAttribute('data-block-status', 'loaded');
        contactWrapper.append(contactBlock);

        const contactWrpArena = document.createElement('div');
        contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
        contactBlock.append(contactWrpArena);

        const contactTitle = document.createElement('h4');
        contactTitle.classList.add('user__contact-title');
        contactTitle.textContent = toolSection.querySelector('h4')?.textContent || 'Contact Us'; // Dynamically get "Contact Us"
        contactWrpArena.append(contactTitle);

        const contactIconPhone = document.createElement('span');
        contactIconPhone.classList.add('user__contact-title', 'icon-phone');
        contactIconPhone.setAttribute('aria-label', contactTitle.textContent); // Use dynamic label
        contactWrpArena.append(contactIconPhone);

        const contactIconsDiv = document.createElement('div');
        contactIconsDiv.classList.add('user__contact__icons', 'hidden');
        contactWrpArena.append(contactIconsDiv);

        const contactToggleBox = document.createElement('div');
        contactToggleBox.classList.add('hidden', 'contact-toggle-box');
        contactWrpArena.append(contactToggleBox);

        const callContainer = document.createElement('div');
        callContainer.classList.add('user__contact__icon-call_container');
        contactToggleBox.append(callContainer);

        // Populate contact details
        toolSection.querySelectorAll('a').forEach((link) => {
          const iconLink = document.createElement('a');
          iconLink.href = link.href;
          if (link.target) iconLink.target = link.target;
          if (link.rel) iconLink.rel = link.rel;

          const spanSrOnly = document.createElement('span');
          spanSrOnly.classList.add('sr-only');
          spanSrOnly.textContent = link.textContent.trim();
          iconLink.append(spanSrOnly);

          const img = link.querySelector('img');
          if (img) iconLink.append(img.cloneNode(true));

          if (link.href.startsWith('tel:')) {
            iconLink.classList.add('user__contact--icon', 'phone');
            iconLink.addEventListener('click', (e) => {
              e.preventDefault();
              contactToggleBox.classList.toggle('hidden');
              contactIconsDiv.classList.add('hidden'); // Close other icons if open
            });
            const telLink = document.createElement('a');
            telLink.href = link.href;
            telLink.classList.add('primary-telephone');
            telLink.textContent = link.textContent;
            callContainer.append(telLink);
          } else if (link.href.startsWith('https://wa.me/')) {
            iconLink.classList.add('user__contact--icon', 'whatsapp');
          } else if (link.href.startsWith('mailto:')) {
            iconLink.classList.add('user__contact--icon', 'email');
          }
          contactIconsDiv.append(iconLink);
        });

        // Add the 'hidden' div content from the original HTML
        const hiddenDivs = toolSection.querySelectorAll('.contact_wrp_arena > div.hidden');
        hiddenDivs.forEach((div) => {
          if (div.textContent.trim() !== '') {
            const newDiv = document.createElement('div');
            newDiv.classList.add('hidden');
            newDiv.textContent = div.textContent;
            contactIconsDiv.append(newDiv);
          }
        });

        // Event listener for contact title to toggle icons
        contactTitle.addEventListener('click', () => {
          contactIconsDiv.classList.toggle('hidden');
          contactToggleBox.classList.add('hidden'); // Close call box if open
        });
        contactIconPhone.addEventListener('click', () => {
          contactIconsDiv.classList.toggle('hidden');
          contactToggleBox.classList.add('hidden'); // Close call box if open
        });

        rightDiv.append(contactWrapper);
      } else if (toolSection.textContent.trim().toLowerCase() === 'en') {
        const languageDiv = document.createElement('div');
        languageDiv.classList.add('language');
        languageDiv.textContent = toolSection.textContent.trim(); // Dynamically get "EN"
        rightDiv.append(languageDiv);
      } else if (toolSection.classList.contains('sign-in-wrapper')) {
        const signInWrapper = document.createElement('div');
        signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Initially hidden
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

        toolSection.querySelectorAll('a, button').forEach((item) => {
          if (item.tagName === 'A') {
            const accountLink = document.createElement('a');
            accountLink.href = item.href;
            accountLink.classList.add('user__account--link', item.textContent.trim().toLowerCase().replace(/\s/g, '-'));
            if (item.target) accountLink.target = item.target;

            const spanIcon = document.createElement('span');
            spanIcon.classList.add('user__account__list-icon');
            const img = item.querySelector('img');
            if (img) spanIcon.append(img.cloneNode(true));
            accountLink.append(spanIcon);
            accountLink.append(item.textContent.trim());
            userAccount.append(accountLink);
          } else if (item.tagName === 'BUTTON') {
            const signInBtnDiv = document.createElement('div');
            signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
            const spanIcon = document.createElement('span');
            spanIcon.classList.add('user__account__list-icon');
            const img = item.querySelector('img');
            if (img) spanIcon.append(img.cloneNode(true));
            signInBtnDiv.append(spanIcon);

            const signInButton = document.createElement('button');
            signInButton.setAttribute('type', 'button');
            if (item.dataset.signOutText) signInButton.setAttribute('data-sign-out-text', item.dataset.signOutText);
            signInButton.textContent = item.textContent;
            signInBtnDiv.append(signInButton);
            userAccount.append(signInBtnDiv);
          }
        });
        rightDiv.append(signInWrapper);

        // Placeholder for user image (if needed from original HTML)
        const userImgDiv = document.createElement('div');
        userImgDiv.id = 'user-img';
        // rightDiv.append(userImgDiv); // Uncomment if user-img is needed and styled via CSS
      }
    });
  }

  // Car Filter Menu (if present in original HTML, though not in fragment)
  const carFilterMenu = document.createElement('div');
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');
  carFilterMenu.id = 'carFilterMenu';
  mainDiv.append(carFilterMenu);

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  carPanelHeader.innerHTML = `
    <div></div>
    <span class="car-text">Cars</span>
    <span class="car-filter-close"><img src="/icons/close.svg" alt="close"></span>
  `;
  carFilterMenu.append(carPanelHeader);

  // Event listeners
  hamburgerButton.addEventListener('click', () => toggleMobileMenu(mainDiv));
  menuHeader.querySelector('.close-icon').addEventListener('click', () => toggleMobileMenu(mainDiv, false));
  menuHeader.querySelector('.back-arrow').addEventListener('click', () => {
    // Implement back button logic for nested mobile menus if needed
    // For now, it just closes the menu
    toggleMobileMenu(mainDiv, false);
  });
  carPanelHeader.querySelector('.car-filter-close').addEventListener('click', () => carFilterMenu.classList.add('hidden'));

  window.addEventListener('keydown', closeOnEscape);

  // Close desktop panels when clicking outside
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !navbar.contains(e.target) && !e.target.closest('.desktop-panel')) {
      closeAllDesktopPanels(mainDiv);
    }
  });

  // Handle desktop vs mobile menu display on resize
  const onMediaQueryChange = (e) => {
    if (e.matches) { // Desktop
      toggleMobileMenu(mainDiv, false); // Ensure mobile menu is closed
      document.body.style.overflowY = '';
    } else { // Mobile
      closeAllDesktopPanels(mainDiv); // Ensure desktop panels are closed
      // Do not force mobile menu open here, let hamburger button handle it
    }
  };
  isDesktop.addEventListener('change', onMediaQueryChange);
  // Initial check
  onMediaQueryChange(isDesktop);
}
