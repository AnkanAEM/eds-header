import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const header = document.querySelector('.header');
    const hamburgerMenu = header.querySelector('.header__hamburger--menu');
    const searchWrapper = header.querySelector('.global__search--wrapper');
    const notificationPanel = header.querySelector('.header__notification--panel');

    if (hamburgerMenu.classList.contains('header__hamburger--menu-active')) {
      hamburgerMenu.classList.remove('header__hamburger--menu-active');
      document.body.classList.remove('no-scroll');
      header.querySelector('.header__overlay').classList.add('d-none');
      header.querySelector('.header__hamburger--open').style.opacity = '1';
      header.querySelector('.header__hamburger--close').style.opacity = '0';
    }

    if (searchWrapper && searchWrapper.classList.contains('global__search--wrapper--active')) {
      searchWrapper.classList.remove('global__search--wrapper--active');
      document.body.classList.remove('no-scroll');
      header.querySelector('.header__overlay').classList.add('d-none');
    }

    if (notificationPanel && notificationPanel.classList.contains('active')) {
      notificationPanel.classList.remove('active');
      document.body.classList.remove('no-scroll');
      header.querySelector('.header__overlay').classList.add('d-none');
    }
  }
}

function toggleMobileMenu() {
  const header = document.querySelector('.header');
  const hamburgerMenu = header.querySelector('.header__hamburger--menu');
  const overlay = header.querySelector('.header__overlay');
  const hamburgerOpenIcon = header.querySelector('.header__hamburger--open');
  const hamburgerCloseIcon = header.querySelector('.header__hamburger--close');

  hamburgerMenu.classList.toggle('header__hamburger--menu-active');
  overlay.classList.toggle('d-none');
  document.body.classList.toggle('no-scroll');

  if (hamburgerMenu.classList.contains('header__hamburger--menu-active')) {
    if (hamburgerOpenIcon) hamburgerOpenIcon.style.opacity = '0';
    if (hamburgerCloseIcon) hamburgerCloseIcon.style.opacity = '1';
    window.addEventListener('keydown', closeOnEscape);
  } else {
    if (hamburgerOpenIcon) hamburgerOpenIcon.style.opacity = '1';
    if (hamburgerCloseIcon) hamburgerCloseIcon.style.opacity = '0';
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function toggleSearch() {
  const header = document.querySelector('.header');
  const searchWrapper = header.querySelector('.global__search--wrapper');
  const overlay = header.querySelector('.header__overlay');

  if (searchWrapper) {
    searchWrapper.classList.toggle('global__search--wrapper--active');
    overlay.classList.toggle('d-none');
    document.body.classList.toggle('no-scroll');

    if (searchWrapper.classList.contains('global__search--wrapper--active')) {
      window.addEventListener('keydown', closeOnEscape);
    } else {
      window.removeEventListener('keydown', closeOnEscape);
    }
  }
}

function toggleNotificationPanel() {
  const header = document.querySelector('.header');
  const notificationPanel = header.querySelector('.header__notification--panel');
  const overlay = header.querySelector('.header__overlay');

  if (notificationPanel) {
    notificationPanel.classList.toggle('active');
    overlay.classList.toggle('d-none');
    document.body.classList.toggle('no-scroll');

    if (notificationPanel.classList.contains('active')) {
      window.addEventListener('keydown', closeOnEscape);
    } else {
      window.removeEventListener('keydown', closeOnEscape);
    }
  }
}

/**
 * Recursively builds menu items and their children.
 * This function is not used in the provided `decorate` function,
 * but is kept for potential future use if a different menu structure is desired.
 * @param {HTMLElement} parentElement The parent DOM element to append to.
 * @param {Array} childrenData Array of child menu items.
 * @param {string} levelClassBase Base class for the current menu level.
 */
// function buildMenuItems(parentElement, childrenData, levelClassBase) {
//   if (!childrenData || childrenData.length === 0) return;

//   const ul = document.createElement('ul');
//   ul.classList.add(`${levelClassBase}--list`);

//   childrenData.forEach((itemData) => {
//     const li = document.createElement('li');
//     li.classList.add(`${levelClassBase}--item`);

//     const link = document.createElement('a');
//     link.href = itemData.href;
//     link.textContent = itemData.label;
//     link.classList.add(`${levelClassBase}--link`);

//     if (itemData.children && itemData.children.length > 0) {
//       li.classList.add('has-children');
//       const dropdownToggle = document.createElement('span');
//       dropdownToggle.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
//       dropdownToggle.innerHTML = `<svg class="arrow header__accordion--arrow" aria-hidden="true" role="icon" aria-expanded="false">
//                                     <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret"></use>
//                                   </svg>`;
//       link.classList.add('navigation_link');
//       link.setAttribute('type', 'button');
//       link.setAttribute('aria-expanded', 'false');
//       dropdownToggle.addEventListener('click', (e) => {
//         e.preventDefault();
//         const expanded = link.getAttribute('aria-expanded') === 'true';
//         link.setAttribute('aria-expanded', !expanded);
//         dropdownToggle.querySelector('.header__accordion--arrow').setAttribute('aria-expanded', !expanded);
//         li.querySelector('.accordion-collapse').classList.toggle('collapse');
//         dropdownToggle.classList.toggle('collapsed');
//       });

//       const accordionCollapse = document.createElement('div');
//       accordionCollapse.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
//       const accordionBody = document.createElement('div');
//       accordionBody.classList.add('accordion-body', 'header__accordion--body');

//       buildMenuItems(accordionBody, itemData.children, `${levelClassBase}-dropdown`);
//       accordionCollapse.append(accordionBody);
//       li.append(link, dropdownToggle, accordionCollapse);
//     } else {
//       li.append(link);
//     }
//     ul.append(li);
//   });
//   parentElement.append(ul);
// }


export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header__wrapper');

  const header = document.createElement('header');
  header.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');

  const overlay = document.createElement('div');
  overlay.classList.add('header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100');

  const positionAbsolute = document.createElement('div');
  positionAbsolute.classList.add('position-absolute', 'w-100');

  // Mobile Hamburger Menu
  const hamburgerMenu = document.createElement('nav');
  hamburgerMenu.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');

  const hamburgerHead = document.createElement('div');
  hamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  const hamburgerHeadTitle = document.createElement('div');
  hamburgerHeadTitle.classList.add('header__hamburger--head-title');
  // Dynamically set title from fragment if available, otherwise default
  const mobileNotificationTitle = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(1) h4');
  hamburgerHeadTitle.textContent = mobileNotificationTitle ? mobileNotificationTitle.textContent.trim() : 'Notifications';

  const closeIcon = document.createElement('svg');
  closeIcon.classList.add('arrow', 'header__hamburger--close-icon');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.setAttribute('role', 'icon');
  closeIcon.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>';
  hamburgerHead.append(hamburgerHeadTitle, closeIcon);
  hamburgerHead.addEventListener('click', toggleMobileMenu);

  const notificationMobile = document.createElement('div');
  notificationMobile.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');
  // Populate mobile notifications from fragment if available in a dedicated section
  const fragmentMobileNotifications = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(1)');
  if (fragmentMobileNotifications) {
    const notificationItems = fragmentMobileNotifications.querySelectorAll('section.header__notification--item');
    notificationItems.forEach((item) => {
      notificationMobile.append(item.cloneNode(true));
    });
  }

  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  const accordion = document.createElement('div');
  accordion.classList.add('accordion', 'header__accordion');

  // Parse navigation sections from fragment
  const navSections = fragment.querySelector('.nav-sections');
  if (navSections) {
    Array.from(navSections.children).forEach((section, i) => {
      const defaultContentWrapper = section.querySelector('.default-content-wrapper');
      if (!defaultContentWrapper) return;

      const l1LinkElement = defaultContentWrapper.querySelector('p.button-container > a');
      const l1Text = l1LinkElement ? l1LinkElement.textContent.trim() : `Section ${i + 1}`;
      const l1Href = l1LinkElement ? l1LinkElement.href : '#';

      const accordionItem = document.createElement('section');
      accordionItem.classList.add('accordion-item', 'd-md-none', 'header__accordion--item');

      const accordionHeader = document.createElement('h2');
      accordionHeader.classList.add('accordion-header', 'header__accordion--heading');
      accordionHeader.id = `panel-heading-${i + 1}`;

      const accordionButtonLink = document.createElement('a');
      accordionButtonLink.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
      accordionButtonLink.setAttribute('type', 'button');
      accordionButtonLink.href = l1Href;
      accordionButtonLink.textContent = l1Text;

      const accordionButtonToggle = document.createElement('span');
      accordionButtonToggle.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
      accordionButtonToggle.setAttribute('data-bs-toggle', 'collapse');
      accordionButtonToggle.setAttribute('data-bs-target', `#panel-collapse-${i + 1}-norm-nav`);
      accordionButtonToggle.innerHTML = `<svg class="arrow header__accordion--arrow" aria-hidden="true" role="icon" aria-expanded="false" aria-controls="panel-collapse-${i + 1}-norm-nav">
                                          <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret"></use>
                                        </svg>`;

      accordionHeader.append(accordionButtonLink, accordionButtonToggle);

      const accordionCollapse = document.createElement('div');
      accordionCollapse.id = `panel-collapse-${i + 1}-norm-nav`;
      accordionCollapse.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
      accordionCollapse.setAttribute('aria-labelledby', `panel-heading-${i + 1}-norm-nav`);
      accordionCollapse.setAttribute('data-label', l1Text);

      const accordionBody = document.createElement('div');
      accordionBody.classList.add('accordion-body', 'header__accordion--body');

      // Extract nested links (L2, L3, etc.)
      const nestedLists = defaultContentWrapper.querySelectorAll('ul, .sublinksNavigator, .subLevelLinks, .seasonalbanner');
      nestedLists.forEach((element) => {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
        dropdownItem.innerHTML = element.outerHTML;

        // Further decorate nested links with appropriate classes
        dropdownItem.querySelectorAll('a').forEach(link => {
          link.classList.add('sublinks__navigator--content--title', 'text-black-500');
        });

        accordionBody.append(dropdownItem);
      });

      accordionCollapse.append(accordionBody);
      accordionItem.append(accordionHeader, accordionCollapse);
      accordion.append(accordionItem);

      // Event listener for mobile accordion toggle
      accordionButtonToggle.addEventListener('click', () => {
        const isExpanded = accordionButtonToggle.querySelector('svg').getAttribute('aria-expanded') === 'true';
        accordionButtonToggle.querySelector('svg').setAttribute('aria-expanded', !isExpanded);
        accordionButtonToggle.classList.toggle('collapsed');
        accordionCollapse.classList.toggle('collapse');
      });
    });
  }

  mobileMenuWrapper.append(accordion);

  // Social Media Links (from fragment's tools section)
  const socialSection = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(2)');
  if (socialSection) {
    const socialDiv = document.createElement('div');
    socialDiv.classList.add('header__accordion--app', 'bg-white');
    socialDiv.innerHTML = socialSection.innerHTML;
    mobileMenuWrapper.append(socialDiv);
  }

  hamburgerMenu.append(hamburgerHead, notificationMobile, mobileMenuWrapper);
  positionAbsolute.append(hamburgerMenu);

  // Main Navigation
  const mainNavbar = document.createElement('nav');
  mainNavbar.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');

  const navbarDiv = document.createElement('div');
  navbarDiv.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');

  // Brand Logo
  const navBrand = fragment.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
      const brandImg = brandLink.querySelector('img');
      if (brandImg) {
        brandImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
      }
      navbarDiv.append(brandLink);
    }
  }

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';

  const navbarList = document.createElement('ul');
  navbarList.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');

  // Desktop Navigation Sections
  if (navSections) {
    Array.from(navSections.children).forEach((section, i) => {
      const defaultContentWrapper = section.querySelector('.default-content-wrapper');
      if (!defaultContentWrapper) return;

      const l1LinkElement = defaultContentWrapper.querySelector('p.button-container > a');
      const l1Text = l1LinkElement ? l1LinkElement.textContent.trim() : `Section ${i + 1}`;
      const l1Href = l1LinkElement ? l1LinkElement.href : '#';

      const navItem = document.createElement('li');
      navItem.classList.add('nav-item', 'header__navbar--item', 'text-center');

      const dFlex = document.createElement('div');
      dFlex.classList.add('d-flex');

      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'header__navbar--link');
      navLink.href = l1Href;
      navLink.id = `navbarDropdownMenuLink${i}`;
      navLink.setAttribute('role', 'button');
      navLink.setAttribute('aria-expanded', 'false');
      navLink.textContent = l1Text;

      const underline = document.createElement('span');
      underline.classList.add('header__navbar--item-underline');
      dFlex.append(navLink, underline); // Append underline to dFlex
      navItem.append(dFlex);

      const nestedContent = defaultContentWrapper.querySelector('div.cmp-container'); // Look for the container holding nested lists
      if (nestedContent) {
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
        dropdownMenu.setAttribute('aria-labelledby', `navbarDropdownMenuLink${i}`);
        dropdownMenu.setAttribute('data-column-count', '3');
        dropdownMenu.style.cssText = 'grid-template-columns: repeat(3, minmax(0px, 1fr)); gap: 20px;';

        // Iterate over direct children of the nested content div
        Array.from(nestedContent.children).forEach((childElement) => {
          const dropdownColumn = document.createElement('li');
          dropdownColumn.classList.add('dropdown-item', 'header__navbar--dropdown-column');
          dropdownColumn.innerHTML = childElement.outerHTML;

          dropdownColumn.querySelectorAll('a').forEach(link => {
            link.classList.add('sublinks__navigator--content--title', 'text-black-500');
          });
          dropdownMenu.append(dropdownColumn);
        });
        navItem.append(dropdownMenu);

        // Add hover functionality for desktop dropdowns
        navItem.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.transform = 'scaleY(1)';
            navLink.setAttribute('aria-expanded', 'true');
          }
        });
        navItem.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.transform = 'scaleY(0)';
            navLink.setAttribute('aria-expanded', 'false');
          }
        });
      }
      navbarList.append(navItem);
    });
  }

  navbarCollapse.append(navbarList);

  // Navigation Buttons (Search, Notification, Login, Hamburger)
  const navButtons = document.createElement('div');
  navButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');

  // Search Button
  const searchBtn = document.createElement('div');
  searchBtn.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  searchBtn.innerHTML = `<svg class="header__search--svg-find" aria-hidden="true" role="icon">
                            <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>
                          </svg>`;
  searchBtn.addEventListener('click', toggleSearch);

  // Search Overlay (from fragment's tools section)
  const searchOverlaySection = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(3)');
  if (searchOverlaySection) {
    const searchOverlay = searchOverlaySection.cloneNode(true);
    searchOverlay.classList.add('global__search--wrapper');
    searchOverlay.classList.remove('d-none');
    searchBtn.append(searchOverlay);

    const closeSearchBtn = searchOverlay.querySelector('.close-search');
    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', toggleSearch);
    }
  }

  // Notification Button
  const notificationTrigger = document.createElement('div');
  notificationTrigger.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
  // Dynamically set notification count and styles
  const notificationCountElement = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(4) span.header__notification--trigger-text');
  const notificationCount = notificationCountElement ? notificationCountElement.textContent.trim() : '0';
  const notificationTextColor = notificationCountElement ? notificationCountElement.dataset.textColor : 'rgb(255,255,255)';
  const notificationBgColor = notificationCountElement ? notificationCountElement.dataset.backgroundColor : '#Db0011';

  notificationTrigger.innerHTML = `<span class="header__notification--trigger-text text-center position-absolute" data-notification-text="true" data-text-color="${notificationTextColor}" data-background-color="${notificationBgColor}" style="color: ${notificationTextColor}; background-color: ${notificationBgColor};">${notificationCount}</span>
                                   <svg aria-hidden="true" role="icon" class="text-blue-400 header__notification--trigger-svg">
                                     <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon"></use>
                                   </svg>`;
  notificationTrigger.addEventListener('click', toggleNotificationPanel);

  // Notification Panel (from fragment's tools section)
  const notificationPanelSection = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(4)');
  if (notificationPanelSection) {
    const notificationPanel = notificationPanelSection.cloneNode(true);
    notificationPanel.classList.add('p-3', 'flex-column', 'position-absolute', 'z-2', 'header__notification--panel');
    notificationTrigger.append(notificationPanel);
  }

  // Login Link
  const loginLinkElement = fragment.querySelector('.nav-tools .default-content-wrapper > div:nth-child(5) a'); // Assuming login is the 5th item
  const loginLink = document.createElement('a');
  if (loginLinkElement) {
    loginLink.href = loginLinkElement.href;
    loginLink.target = loginLinkElement.target || '_self';
    loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
    loginLink.innerHTML = `<svg aria-hidden="true" role="icon">
                             <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon"></use>
                           </svg>
                           <span class="logntext d-none d-md-block header__login--text text-nowrap">${loginLinkElement.textContent.trim()}</span>
                           ${loginLink.target === '_blank' ? '<span class="cmp-link__screen-reader-only">opens in a new tab</span>' : ''}`;
  } else {
    // Fallback if login link is not found in fragment
    loginLink.href = 'https://customer.canarahsbclife.com/login';
    loginLink.target = '_blank';
    loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
    loginLink.innerHTML = `<svg aria-hidden="true" role="icon">
                             <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon"></use>
                           </svg>
                           <span class="logntext d-none d-md-block header__login--text text-nowrap">Login</span>
                           <span class="cmp-link__screen-reader-only">opens in a new tab</span>`;
  }


  // Hamburger Button (for mobile)
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  hamburgerButton.innerHTML = `<svg class="header__hamburger--open" aria-hidden="true" role="icon">
                                 <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon"></use>
                               </svg>
                               <svg class="position-absolute start-0 bottom-0 header__hamburger--close" aria-hidden="true" role="icon">
                                 <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>
                               </svg>`;
  hamburgerButton.addEventListener('click', toggleMobileMenu);

  navButtons.append(searchBtn, notificationTrigger, loginLink, hamburgerButton);
  navbarDiv.append(navbarCollapse, navButtons);
  mainNavbar.append(navbarDiv);

  header.append(overlay, positionAbsolute, mainNavbar);
  headerWrapper.append(header);

  // Append the constructed header to the block
  block.append(headerWrapper);

  // Add backdrop element
  const backdrop = document.createElement('div');
  backdrop.classList.add('header__backdrop', 'd-none', 'position-relative', 'position-fixed');
  block.append(backdrop);

  // Event listener for backdrop to close open menus
  backdrop.addEventListener('click', () => {
    const openHamburger = document.querySelector('.header__hamburger--menu-active');
    const openSearch = document.querySelector('.global__search--wrapper--active');
    const openNotification = document.querySelector('.header__notification--panel.active');

    if (openHamburger) {
      toggleMobileMenu();
    }
    if (openSearch) {
      toggleSearch();
    }
    if (openNotification) {
      toggleNotificationPanel();
    }
  });

  // Sync overlay and backdrop visibility
  const observer = new MutationObserver(() => {
    if (!overlay.classList.contains('d-none')) {
      backdrop.classList.remove('d-none');
    } else {
      backdrop.classList.add('d-none');
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

  // Handle mobile/desktop view changes
  const handleMediaQueryChange = (e) => {
    const hamburgerMenuElement = document.querySelector('.header__hamburger--menu');
    const searchOverlayElement = document.querySelector('.global__search--wrapper');
    const notificationPanelElement = document.querySelector('.header__notification--panel');
    const hamburgerOpenIcon = document.querySelector('.header__hamburger--open');
    const hamburgerCloseIcon = document.querySelector('.header__hamburger--close');

    if (e.matches) { // Desktop view
      document.body.classList.remove('no-scroll');
      if (hamburgerMenuElement) hamburgerMenuElement.classList.remove('header__hamburger--menu-active');
      if (searchOverlayElement) searchOverlayElement.classList.remove('global__search--wrapper--active');
      if (notificationPanelElement) notificationPanelElement.classList.remove('active');
      overlay.classList.add('d-none');
      if (hamburgerOpenIcon) hamburgerOpenIcon.style.opacity = '1';
      if (hamburgerCloseIcon) hamburgerCloseIcon.style.opacity = '0';
      window.removeEventListener('keydown', closeOnEscape);
    } else { // Mobile view
      // If any menu is open, apply no-scroll
      if ((hamburgerMenuElement && hamburgerMenuElement.classList.contains('header__hamburger--menu-active')) ||
          (searchOverlayElement && searchOverlayElement.classList.contains('global__search--wrapper--active')) ||
          (notificationPanelElement && notificationPanelElement.classList.contains('active'))) {
        document.body.classList.add('no-scroll');
      }
    }
  };

  isDesktop.addEventListener('change', handleMediaQueryChange);
  handleMediaQueryChange(isDesktop); // Initial check
}
