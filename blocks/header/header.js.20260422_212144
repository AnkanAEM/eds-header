import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

function closeAllDropdowns(container, exceptDropdown = null) {
  container.querySelectorAll('.header__navbar--item.has-dropdown').forEach((item) => {
    if (item !== exceptDropdown) {
      item.classList.remove('active');
      const dropdown = item.querySelector('.header__navbar--dropdown');
      if (dropdown) {
        dropdown.classList.remove('active');
      }
    }
  });
}

function closeAllAccordions(container, exceptAccordion = null) {
  container.querySelectorAll('.header__accordion--item').forEach((item) => {
    if (item !== exceptAccordion) {
      item.querySelector('.header__accordion--button').classList.add('collapsed');
      item.querySelector('.header__accordion--arrow').classList.add('collapsed');
      item.querySelector('.header__accordion--collapse').classList.remove('show');
    }
  });
}

function toggleMobileMenu(headerWrapper, forceExpanded = null) {
  const hamburgerMenu = headerWrapper.querySelector('.header__hamburger--menu');
  const overlay = headerWrapper.querySelector('.header__overlay');
  const hamburgerButton = headerWrapper.querySelector('.header__hamburger--button');

  const expanded = forceExpanded !== null ? forceExpanded : !hamburgerMenu.classList.contains('active');

  if (expanded) {
    hamburgerMenu.classList.add('active');
    overlay.classList.add('active');
    hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '0';
    hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '1';
    document.body.style.overflowY = 'hidden';
  } else {
    hamburgerMenu.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '1';
    hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '0';
    document.body.style.overflowY = '';
    closeAllAccordions(hamburgerMenu);
  }
}

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
  header.append(overlay);

  const mobileMenuContainer = document.createElement('div');
  mobileMenuContainer.classList.add('position-absolute', 'w-100');

  const hamburgerMenu = document.createElement('nav');
  hamburgerMenu.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');

  const hamburgerHead = document.createElement('div');
  hamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  const hamburgerHeadTitle = document.createElement('div');
  hamburgerHeadTitle.classList.add('header__hamburger--head-title');
  // Dynamically derive text from fragment if available, otherwise default or leave empty
  // Assuming 'Notifications' is a static element not part of the nav fragment's dynamic sections
  hamburgerHeadTitle.textContent = 'Notifications'; 
  const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIcon.classList.add('arrow', 'header__hamburger--close-icon');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.setAttribute('role', 'icon');
  const useClose = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useClose.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeIcon.append(useClose);
  hamburgerHead.append(hamburgerHeadTitle, closeIcon);
  hamburgerMenu.append(hamburgerHead);

  // Mobile Notification Menu (from original HTML structure, not fragment)
  const mobileNotificationDiv = document.createElement('div');
  mobileNotificationDiv.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');
  // Populate mobileNotificationDiv with content similar to the original HTML if needed,
  // but for this exercise, we'll assume it's static or handled separately from nav fragment.
  // For now, it remains empty as per the strict rule of replicating structure, not data for non-nav items.
  hamburgerMenu.append(mobileNotificationDiv);

  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  const accordionDiv = document.createElement('div');
  accordionDiv.classList.add('accordion', 'header__accordion');

  const navContent = document.createElement('div');
  while (fragment.firstElementChild) navContent.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = navContent.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = navContent.querySelector('.nav-sections');
  if (navSections) {
    Array.from(navSections.children).forEach((section) => {
      // Desktop Navigation
      const navItem = document.createElement('li');
      navItem.classList.add('nav-item', 'header__navbar--item', 'text-center');
      const divFlex = document.createElement('div');
      divFlex.classList.add('d-flex');
      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'header__navbar--link');
      navLink.href = section.querySelector('a')?.href || '#';
      navLink.textContent = section.querySelector('a')?.textContent || '';
      const underlineSpan = document.createElement('span');
      underlineSpan.classList.add('header__navbar--item-underline');
      navLink.append(underlineSpan);
      divFlex.append(navLink);
      navItem.append(divFlex);

      const subMenu = section.querySelector('ul');
      if (subMenu) {
        navItem.classList.add('has-dropdown');
        const dropdownUl = document.createElement('ul');
        dropdownUl.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
        dropdownUl.setAttribute('aria-labelledby', `navbarDropdownMenuLink${Array.from(navSections.children).indexOf(section)}`);
        dropdownUl.style.gridTemplateColumns = 'repeat(3, minmax(0px, 1fr))';
        dropdownUl.style.gap = '20px';

        Array.from(subMenu.children).forEach((subMenuItem) => {
          const dropdownItem = document.createElement('li');
          dropdownItem.classList.add('dropdown-item', 'header__navbar--dropdown-column');
          dropdownItem.innerHTML = subMenuItem.innerHTML; // Replicate inner HTML for complex submenus
          dropdownUl.append(dropdownItem);
        });
        navItem.append(dropdownUl);

        navLink.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            closeAllDropdowns(header.querySelector('.header__navbar--list'), navItem);
            navItem.classList.add('active');
            dropdownUl.classList.add('active');
          }
        });
        navItem.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            navItem.classList.remove('active');
            dropdownUl.classList.remove('active');
          }
        });
      }
      header.querySelector('.header__navbar--list')?.append(navItem);

      // Mobile Accordion (Always create for mobile, hide with CSS on desktop)
      const mobileSection = document.createElement('section');
      mobileSection.classList.add('accordion-item', 'd-md-none', 'header__accordion--item');
      const h2 = document.createElement('h2');
      h2.classList.add('accordion-header', 'header__accordion--heading');
      h2.id = `panel-heading-${Array.from(navSections.children).indexOf(section) + 1}`;

      const mobileNavLink = document.createElement('a');
      mobileNavLink.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
      mobileNavLink.href = navLink.href;
      mobileNavLink.textContent = navLink.textContent;

      const arrowSpan = document.createElement('span');
      arrowSpan.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
      arrowSpan.setAttribute('data-bs-toggle', 'collapse');
      arrowSpan.setAttribute('data-bs-target', `#panel-collapse-${Array.from(navSections.children).indexOf(section) + 1}-norm-nav`);
      const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrowSvg.classList.add('arrow', 'header__accordion--arrow');
      arrowSvg.setAttribute('aria-hidden', 'true');
      arrowSvg.setAttribute('role', 'icon');
      arrowSvg.setAttribute('aria-expanded', 'false');
      arrowSvg.setAttribute('aria-controls', `panel-collapse-${Array.from(navSections.children).indexOf(section) + 1}-norm-nav`);
      const useArrow = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      useArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret');
      arrowSvg.append(useArrow);
      arrowSpan.append(arrowSvg);

      h2.append(mobileNavLink);
      if (subMenu) {
        h2.append(arrowSpan);
      }
      mobileSection.append(h2);

      if (subMenu) {
        const mobileCollapseDiv = document.createElement('div');
        mobileCollapseDiv.id = `panel-collapse-${Array.from(navSections.children).indexOf(section) + 1}-norm-nav`;
        mobileCollapseDiv.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
        mobileCollapseDiv.setAttribute('aria-labelledby', `panel-heading-${Array.from(navSections.children).indexOf(section) + 1}-norm-nav`);
        mobileCollapseDiv.setAttribute('data-label', navLink.textContent);
        const mobileAccordionBody = document.createElement('div');
        mobileAccordionBody.classList.add('accordion-body', 'header__accordion--body');

        Array.from(subMenu.children).forEach((subMenuItem) => {
          const dropdownItem = document.createElement('div');
          dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
          dropdownItem.setAttribute('data-coloumn-count', '1,2,3');
          dropdownItem.innerHTML = subMenuItem.innerHTML; // Replicate inner HTML for complex submenus
          mobileAccordionBody.append(dropdownItem);
        });
        mobileCollapseDiv.append(mobileAccordionBody);
        mobileSection.append(mobileCollapseDiv);

        arrowSpan.addEventListener('click', () => {
          const isCollapsed = arrowSpan.classList.contains('collapsed');
          closeAllAccordions(accordionDiv, mobileSection);
          if (isCollapsed) {
            arrowSpan.classList.remove('collapsed');
            arrowSvg.classList.remove('collapsed');
            mobileCollapseDiv.classList.add('show');
            arrowSvg.setAttribute('aria-expanded', 'true');
          } else {
            arrowSpan.classList.add('collapsed');
            arrowSvg.classList.add('collapsed');
            mobileCollapseDiv.classList.remove('show');
            arrowSvg.setAttribute('aria-expanded', 'false');
          }
        });
      }
      accordionDiv.append(mobileSection);
    });
  }

  mobileMenuWrapper.append(accordionDiv);

  // Social Media Links (from original HTML, static for now)
  const socialDiv = document.createElement('div');
  socialDiv.classList.add('header__accordion--app', 'bg-white');
  socialDiv.style.marginTop = '10051.1px'; // Keep original inline style if critical
  socialDiv.innerHTML = `
    <div class="flex-column gap-3 header__socials">
        <h4 class="hamburger__socials--text header__socials--text">Follow Us</h4>
        <ul class="d-flex justify-content-between header__socials--list">
            <li class="header__socials--item">
                <a href="https://m.facebook.com/CanaraHSBCLifeInsurance" target="_blank" class="header__socials--link" rel="noopener noreferrer" icon="facebook">
                    <div class="header__socials--icon">
                         <svg aria-hidden="true" role="icon" class="text-blue-400">
                                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#facebook"></use>
                            </svg>
                    </div>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
            <li class="header__socials--item">
                <a href="https://www.youtube.com/c/CanaraHSBCLifeInsurance" target="_blank" class="header__socials--link" rel="noopener noreferrer" icon="youtube">
                    <div class="header__socials--icon">
                         <svg aria-hidden="true" role="icon" class="text-blue-400">
                                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#youtube"></use>
                            </svg>
                    </div>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
            <li class="header__socials--item">
                <a href="https://www.instagram.com/canarahsbcobc/" target="_blank" class="header__socials--link" rel="noopener noreferrer" icon="instagram">
                    <div class="header__socials--icon">
                         <svg aria-hidden="true" role="icon" class="text-blue-400">
                                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#instagram"></use>
                            </svg>
                    </div>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
            <li class="header__socials--item">
                <a href="https://x.com/CanaraHSBCLI" target="_blank" class="header__socials--link" rel="noopener noreferrer" icon="xLogo">
                    <div class="header__socials--icon">
                         <svg aria-hidden="true" role="icon" class="text-blue-400">
                                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#xLogo"></use>
                            </svg>
                    </div>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
            <li class="header__socials--item">
                <a href="https://in.linkedin.com/company/canara-hsbc-life-insurance-company" target="_blank" class="header__socials--link" rel="noopener noreferrer" icon="linkedin">
                    <div class="header__socials--icon">
                         <svg aria-hidden="true" role="icon" class="text-blue-400">
                                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#linkedin"></use>
                            </svg>
                    </div>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
        </ul>
    </div>
    <div class="w-100 header__accordion--divider my-4 bg-black-200"></div>
    <div class="flex-column gap-3 header__app">
        <h4 class="header__app--text">Download the Canara HSBC Mobile App</h4>
        <ul class="d-flex justify-content-between header__app--list">
            <li class="header__app--item">
                <a href="https://play.google.com/store/apps/details?id=com.choiceapp.genius&amp;hl=en_IN&amp;pli=1" target="_blank" class="header__app--link">
                    <svg aria-hidden="true" role="icon" class="header__app--icon" alt="google play store">
                        <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#get-it-on-google-play"></use>
                    </svg>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
            <li class="header__app--item">
                <a href="https://apps.apple.com/in/app/canara-hsbc-life/id1637840399" target="_blank" class="header__app--link">
                    <svg aria-hidden="true" role="icon" class="header__app--icon" alt="apple play store">
                        <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#app-store-download"></use>
                    </svg>
                <span class="cmp-link__screen-reader-only">opens in a new tab</span></a>
            </li>
        </ul>
    </div>
  `;
  mobileMenuWrapper.append(socialDiv);

  hamburgerMenu.append(mobileMenuWrapper);
  mobileMenuContainer.append(hamburgerMenu);
  header.append(mobileMenuContainer);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');

  const navbarDiv = document.createElement('div');
  navbarDiv.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');

  const brandLink = document.createElement('a');
  brandLink.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
  brandLink.href = '/';
  const brandImg = document.createElement('img');
  brandImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
  brandImg.src = '/content/dam/chli/homepage/image/canara-hsbc-life-insurance-logo.svg';
  brandImg.alt = 'Canara HSBC Life Insurance';
  brandImg.loading = 'lazy';
  brandLink.append(brandImg);
  navbarDiv.append(brandLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';
  const navbarList = document.createElement('ul');
  navbarList.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');
  navbarCollapse.append(navbarList);
  navbarDiv.append(navbarCollapse);

  const navigationButtons = document.createElement('div');
  navigationButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.classList.add('header__search--svg-find');
  searchSvg.setAttribute('aria-hidden', 'true');
  searchSvg.setAttribute('role', 'icon');
  const useSearch = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSearch.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchSvg.append(useSearch);
  searchDiv.append(searchSvg);

  // Search overlay (from original HTML, static for now)
  const globalSearchWrapper = document.createElement('section');
  globalSearchWrapper.classList.add('position-absolute', 'global__search--wrapper', 'vw-100', 'bg-white', 'start-0', 'end-0', 'section_container--primary');
  globalSearchWrapper.innerHTML = `
    <div class="d-flex flex-column global__search--container">
        <svg class="close-search text-black-500" role="icon">
            <title>close search</title>
            <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>
        </svg>
        <form class="global__search--form mt-2" autocomplete="off" data-search-path="/content/chli/" data-redirection-path="/content/chli/in/en/search-result-page" data-result-count="5" data-view-result="View Results" data-no-result="No Result Found">
            <div class="global__search__input--wrapper position-relative">
            <input class="global__search--input text-capitalize" name="searchText" type="search" placeholder="Search">
            <svg class="search-icon text-blue-400" role="img">
                <title>Search</title>
                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>
            </svg>
            <svg class="arrow-icon search__submit text-blue-400 cursor-pointer" role="img">
                <title>Search CTA</title>
                <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow-right"></use>
            </svg>
            <small class="global__search--info font-10 float-end text-black-500">Hit to enter </small>
            <div class="global__search--result--wrapper position-relative">
            <ul class="w-100 global__search__result--list bg-white d-none position-static"></ul>
            <div class="text-blue-400 font-16 text-center global__search__viewall mb-8 w-100 start-0 end-0 d-none">
                <a title="View Results" class="global__search__viewall--link">View Results</a>
           </div>
        </div>
            </div>
        </form>
        <div class="global__search--popular">
            <div class="chli_title d-flex flex-column global__search__popular--title mb-2">
                <h2 class="heading-2 text-start text-black-500">Popular Searches</h2>
                <span class="primary-bar"></span>
            </div>
            <div class="global__search__popular--cards">
                <ul class="global__search__popular--items d-flex pl-0 flex-wrap gap-4">
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Term Insurance</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Life Insurance Plans</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Savings &amp; Investment Plan</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Child Insurance Plan</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">BMI Calculator</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Income Tax Calculator</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">What is Investment</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Retirement Calculator</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Sukanya Samriddhi Yojana</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">What is Insurance</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Features of Life Insurance</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">What is Pension</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Section 194</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Retirement Plans</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Critical illness Insurance</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">Benefits of Term Insurance</li>
                    <li class="global__search__popular--item border-1 border border-black-200 font-16 text-black-500">ULIP Plan</li>
                </ul>
            </div>
        </div>
  `;
  searchDiv.append(globalSearchWrapper);
  navigationButtons.append(searchDiv);

  searchDiv.addEventListener('click', () => {
    globalSearchWrapper.classList.toggle('global__search--wrapper--active');
    overlay.classList.toggle('active');
    headerWrapper.classList.toggle('search--active');
    if (globalSearchWrapper.classList.contains('global__search--wrapper--active')) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  });

  globalSearchWrapper.querySelector('.close-search').addEventListener('click', (e) => {
    e.stopPropagation();
    globalSearchWrapper.classList.remove('global__search--wrapper--active');
    overlay.classList.remove('active');
    headerWrapper.classList.remove('search--active');
    document.body.style.overflowY = '';
  });

  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
  const notificationSpan = document.createElement('span');
  notificationSpan.classList.add('header__notification--trigger-text', 'text-center', 'position-absolute');
  notificationSpan.setAttribute('data-notification-text', 'true');
  notificationSpan.setAttribute('data-text-color', 'rgb(255,255,255)');
  notificationSpan.setAttribute('data-background-color', '#Db0011');
  notificationSpan.style.color = 'rgb(255, 255, 255)';
  notificationSpan.style.backgroundColor = 'rgb(219, 0, 17)';
  notificationSpan.textContent = '1';
  const bellSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  bellSvg.classList.add('text-blue-400', 'header__notification--trigger-svg');
  bellSvg.setAttribute('aria-hidden', 'true');
  bellSvg.setAttribute('role', 'icon');
  const useBell = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useBell.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon');
  bellSvg.append(useBell);
  notificationDiv.append(notificationSpan, bellSvg);

  // Notification panel (from original HTML, static for now)
  const notificationPanel = document.createElement('div');
  notificationPanel.classList.add('p-3', 'flex-column', 'position-absolute', 'z-2', 'header__notification--panel');
  notificationPanel.innerHTML = `
    <section class="header__notification--item header__notification--item-background" data-notification-bgcolor="#7FDBFF" style="background-color: rgb(127, 219, 255);">
        <a href="https://buyonlineinsurance.canarahsbclife.com/promise4WealthPlan/?source=website" class="d-flex flex-column header__notification--item">
            <div class="d-flex gap-5 header__notification--item-content">
                <div class="header__notification--icon">
                    <img src="/content/dam/chli/homepage/image/p4w-desktop-notification.webp" alt="Promise4wealth" loading="lazy">
                </div>
                <div class="d-flex flex-column gap-3 header__notification--content">
                    <h4 class="text-black-500 header__notification--title">
                        New Fund Launched with Promise4Wealth
                    </h4>
                    <div class="text-black-400 header__notification--description rte-text">
                        <div><p>BSE 500 Enhanced Value 50 Fund. Past 5-yr benchmark returns* of index - 31.69%</p>
</div>
                    </div>
                </div>
            </div>
        </a>
    </section>
    <section class="header__notification--item header__notification--item-background">
        <a href="https://customer.canarahsbclife.com/PremiumPayment" class="d-flex flex-column header__notification--item">
            <div class="d-flex gap-5 header__notification--item-content">
                <div class="header__notification--icon">
                    <img src="/content/dam/chli/homepage/image/pay-premium-desktop-notification.webp" alt="Reinstate Your Lapsed Policy - Canara HSBC Life Insurance" loading="lazy">
                </div>
                <div class="d-flex flex-column gap-3 header__notification--content">
                    <h4 class="text-black-500 header__notification--title">
                        Reinstate Your Lapsed Policy
                    </h4>
                    <div class="text-black-400 header__notification--description rte-text">
                        <div><p>Pay premium now &amp; continue enjoying the benefits.</p>
</div>
                    </div>
                </div>
            </div>
        </a>
    </section>
    <section class="header__notification--item header__notification--item-background">
        <a href="https://customer.canarahsbclife.com/login" class="d-flex flex-column header__notification--item">
            <div class="d-flex gap-5 header__notification--item-content">
                <div class="header__notification--icon">
                    <img src="/content/dam/chli/images/home-page/notification-images/kyc-desktop-notification.webp" alt="Notification 2" loading="lazy">
                </div>
                <div class="d-flex flex-column gap-3 header__notification--content">
                    <h4 class="text-black-500 header__notification--title">
                        Mandatory KYC Update as per PML Rules 2005
                    </h4>
                    <div class="text-black-400 header__notification--description rte-text">
                        <div><p>Update your KYC records within 30 days of any changes</p>
</div>
                    </div>
                </div>
            </div>
        </a>
    </section>
    <section class="header__notification--item header__notification--item-background">
        <a href="/content/dam/chli/pdfs/claim-support-ahmedabad-plane-crash.pdf" class="d-flex flex-column header__notification--item">
            <div class="d-flex gap-5 header__notification--item-content">
                <div class="header__notification--icon">
                    <img src="/content/dam/chli/images/notification/expedited-claim-desktop-icon.webp" alt="Fast Claim Process for Ahemdabad Plane Crash - Canara HSBC Life Insurance" loading="lazy">
                </div>
                <div class="d-flex flex-column gap-3 header__notification--content">
                    <h4 class="text-black-500 header__notification--title">
                        We Stand with Families Affected by the Ahemdabad Plane Crash
                    </h4>
                    <div class="text-black-400 header__notification--description rte-text">
                        <div><p>We're here to support with a quicker, simpler claim process.</p>
</div>
                    </div>
                </div>
            </div>
        </a>
    </section>
  `;
  notificationDiv.append(notificationPanel);
  navigationButtons.append(notificationDiv);

  notificationDiv.addEventListener('click', () => {
    notificationPanel.classList.toggle('active');
    overlay.classList.toggle('active');
    if (notificationPanel.classList.contains('active')) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }
  });

  overlay.addEventListener('click', () => {
    if (notificationPanel.classList.contains('active')) {
      notificationPanel.classList.remove('active');
    }
    if (globalSearchWrapper.classList.contains('global__search--wrapper--active')) {
      globalSearchWrapper.classList.remove('global__search--wrapper--active');
      headerWrapper.classList.remove('search--active');
    }
    if (hamburgerMenu.classList.contains('active')) {
      toggleMobileMenu(headerWrapper, false);
    }
    overlay.classList.remove('active');
    document.body.style.overflowY = '';
  });

  const loginLink = document.createElement('a');
  loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.target = '_blank';
  const userSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  userSvg.setAttribute('aria-hidden', 'true');
  userSvg.setAttribute('role', 'icon');
  const useUser = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useUser.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon');
  userSvg.append(useUser);
  const loginText = document.createElement('span');
  loginText.classList.add('logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap');
  loginText.textContent = 'Login';
  const srOnlyLogin = document.createElement('span');
  srOnlyLogin.classList.add('cmp-link__screen-reader-only');
  srOnlyLogin.textContent = 'opens in a new tab';
  loginLink.append(userSvg, loginText, srOnlyLogin);
  navigationButtons.append(loginLink);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  const openHamburgerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  openHamburgerSvg.classList.add('header__hamburger--open');
  openHamburgerSvg.setAttribute('aria-hidden', 'true');
  openHamburgerSvg.setAttribute('role', 'icon');
  const useOpenHamburger = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useOpenHamburger.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon');
  openHamburgerSvg.append(useOpenHamburger);
  const closeHamburgerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeHamburgerSvg.classList.add('position-absolute', 'start-0', 'bottom-0', 'header__hamburger--close');
  closeHamburgerSvg.setAttribute('aria-hidden', 'true');
  closeHamburgerSvg.setAttribute('role', 'icon');
  const useCloseHamburger = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useCloseHamburger.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeHamburgerSvg.append(useCloseHamburger);
  hamburgerButton.append(openHamburgerSvg, closeHamburgerSvg);
  navigationButtons.append(hamburgerButton);

  hamburgerButton.addEventListener('click', () => toggleMobileMenu(headerWrapper));
  closeIcon.addEventListener('click', () => toggleMobileMenu(headerWrapper, false));

  navbarDiv.append(navigationButtons);
  mainNav.append(navbarDiv);
  header.append(mainNav);
  headerWrapper.append(header);
  block.append(headerWrapper);

  // Initial state for desktop
  if (isDesktop.matches) {
    hamburgerMenu.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '1';
    hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '0';
    document.body.style.overflowY = '';
  } else {
    // Hide desktop navigation items on mobile
    navbarCollapse.classList.remove('show');
  }

  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      hamburgerMenu.classList.remove('active');
      overlay.classList.remove('active');
      hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '1';
      hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '0';
      document.body.style.overflowY = '';
      navbarCollapse.classList.add('show');
    } else {
      navbarCollapse.classList.remove('show');
      closeAllDropdowns(navbarList);
    }
  });
}
