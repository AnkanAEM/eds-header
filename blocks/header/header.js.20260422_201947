import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const HEADER_NAVIGATION_DATA_URL = '/navigation.json';
  const headerNavigationData = await fetch(HEADER_NAVIGATION_DATA_URL).then((resp) => resp.json());

  const headerWrapper = document.createElement('header');
  headerWrapper.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');

  const overlay = document.createElement('div');
  overlay.classList.add('header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100');
  headerWrapper.append(overlay);

  const hamburgerMenu = document.createElement('nav');
  hamburgerMenu.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');

  const hamburgerHead = document.createElement('div');
  hamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  const hamburgerHeadTitle = document.createElement('div');
  hamburgerHeadTitle.classList.add('header__hamburger--head-title');
  hamburgerHeadTitle.textContent = 'Notifications';
  const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIcon.classList.add('arrow', 'header__hamburger--close-icon');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.setAttribute('role', 'icon');
  const useClose = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useClose.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeIcon.append(useClose);
  hamburgerHead.append(hamburgerHeadTitle, closeIcon);
  hamburgerMenu.append(hamburgerHead);

  // Notification Mobile Menu
  const notificationMobile = document.createElement('div');
  notificationMobile.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');

  // Parse notification items from the block.children
  const notificationRows = [...block.children].filter(row => row.children.length === 1 && row.querySelector('.header__notification--item'));
  notificationRows.forEach((row) => {
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const notificationItem = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[0];
    notificationItem.classList.add('d-flex', 'flex-column', 'header__notification--item', 'header__notification--item-background');
    notificationMobile.append(notificationItem);
  });
  hamburgerMenu.append(notificationMobile);

  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  const accordion = document.createElement('div');
  accordion.classList.add('accordion', 'header__accordion');

  headerNavigationData.sections.forEach((section, index) => {
    const accordionItem = document.createElement('section');
    accordionItem.classList.add('accordion-item', 'd-md-none', 'header__accordion--item');
    const h2 = document.createElement('h2');
    h2.classList.add('accordion-header', 'header__accordion--heading');
    h2.id = `panel-heading-${index + 1}`;

    const link = document.createElement('a');
    link.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
    link.href = section.l1Href;
    link.textContent = section.l1Label;

    const toggleSpan = document.createElement('span');
    toggleSpan.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
    toggleSpan.setAttribute('data-bs-toggle', 'collapse');
    toggleSpan.setAttribute('data-bs-target', `#panel-collapse-${index + 1}-norm-nav`);
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.classList.add('arrow', 'header__accordion--arrow');
    arrowSvg.setAttribute('aria-hidden', 'true');
    arrowSvg.setAttribute('role', 'icon');
    arrowSvg.setAttribute('aria-expanded', 'true');
    arrowSvg.setAttribute('aria-controls', `panel-collapse-${index + 1}-norm-nav`);
    const useArrow = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret');
    arrowSvg.append(useArrow);
    toggleSpan.append(arrowSvg);

    h2.append(link, toggleSpan);
    accordionItem.append(h2);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = `panel-collapse-${index + 1}-norm-nav`;
    collapseDiv.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
    collapseDiv.setAttribute('aria-labelledby', `panel-heading-${index + 1}-norm-nav`);
    collapseDiv.setAttribute('data-label', section.l1Label);

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body', 'header__accordion--body');

    section.children.forEach((child) => {
      const dropdownItem = document.createElement('div');
      dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
      dropdownItem.setAttribute('data-coloumn-count', '1,2,3'); // This might need dynamic calculation

      const sublinksNavigator = document.createElement('div');
      sublinksNavigator.classList.add('sublinksNavigator');
      const sublinksNav = document.createElement('div');
      sublinksNav.classList.add('sublinks__naviagator');

      const sublink = document.createElement('div');
      sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');

      // Icon (placeholder, as actual icons are dynamic SVGs)
      const iconDiv = document.createElement('div');
      iconDiv.classList.add('sublinks__navigator--icon');
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('aria-hidden', 'true');
      iconSvg.setAttribute('role', 'icon');
      const useIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      // This part is tricky as the icon href is not in the JSON.
      // You'd need a mapping or a way to derive the icon based on the label.
      // For now, using a generic one for demonstration.
      useIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#money');
      iconSvg.append(useIcon);
      iconDiv.append(iconSvg);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3');
      const contentLink = document.createElement('a');
      contentLink.href = child.href;
      contentLink.target = child.href.startsWith('http') ? '_blank' : '_self';
      contentLink.classList.add('sublinks__navigator--content--title', 'text-black-500');
      contentLink.textContent = child.label;
      if (contentLink.target === '_blank') {
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('cmp-link__screen-reader-only');
        srOnlySpan.textContent = 'opens in a new tab';
        contentLink.append(srOnlySpan);
      }
      contentDiv.append(contentLink);

      // Description (placeholder, as actual descriptions are complex RTE)
      // If there are nested children, they would be handled here.
      if (child.children && child.children.length > 0) {
        const nestedDiv = document.createElement('div');
        nestedDiv.classList.add('d-flex', 'flex-column', 'gap-3');
        child.children.forEach(nestedChild => {
          const nestedLink = document.createElement('a');
          nestedLink.classList.add('d-flex');
          nestedLink.href = nestedChild.href;
          nestedLink.target = nestedChild.href.startsWith('http') ? '_blank' : '_self';
          const p = document.createElement('p');
          p.classList.add('sublinks__navigator--content--description', 'text-black-400');
          p.textContent = nestedChild.label;
          nestedLink.append(p);
          if (nestedLink.target === '_blank') {
            const srOnlySpan = document.createElement('span');
            srOnlySpan.classList.add('cmp-link__screen-reader-only');
            srOnlySpan.textContent = 'opens in a new tab';
            nestedLink.append(srOnlySpan);
          }
          nestedDiv.append(nestedLink);
        });
        contentDiv.append(nestedDiv);
      } else {
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('d-flex');
        const p = document.createElement('p');
        p.classList.add('sublinks__navigator--content--description', 'text-black-400', 'rte-text');
        // This is a placeholder as description is not in the JSON.
        // You'd need to extract it from the original block or have it in the JSON.
        p.innerHTML = `<div><p>${child.label} description placeholder</p></div>`;
        descriptionDiv.append(p);
        contentDiv.append(descriptionDiv);
      }

      sublink.append(iconDiv, contentDiv);
      sublinksNav.append(sublink);
      sublinksNavigator.append(sublinksNav);
      dropdownItem.append(sublinksNavigator);
      accordionBody.append(dropdownItem);
    });

    collapseDiv.append(accordionBody);
    accordionItem.append(collapseDiv);
    accordion.append(accordionItem);
  });

  mobileMenuWrapper.append(accordion);
  hamburgerMenu.append(mobileMenuWrapper);

  // Social Media Links (placeholder)
  const socialDiv = document.createElement('div');
  socialDiv.classList.add('header__accordion--app', 'bg-white');
  // ... populate social links ...
  hamburgerMenu.append(socialDiv);

  // Mobile App Links (placeholder)
  const appDiv = document.createElement('div');
  appDiv.classList.add('flex-column', 'gap-3', 'header__app');
  // ... populate app links ...
  hamburgerMenu.append(appDiv);

  headerWrapper.append(hamburgerMenu);

  // Main Navigation
  const navbar = document.createElement('nav');
  navbar.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');
  const navbarInner = document.createElement('div');
  navbarInner.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');

  const brandLink = document.createElement('a');
  brandLink.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
  brandLink.href = '/';
  const brandImg = document.createElement('img');
  brandImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
  brandImg.src = '/content/dam/chli/homepage/image/canara-hsbc-life-insurance-logo.svg';
  brandImg.alt = 'Canara HSBC Life Insurance';
  brandImg.loading = 'lazy';
  brandLink.append(brandImg);
  navbarInner.append(brandLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';
  const ul = document.createElement('ul');
  ul.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');

  headerNavigationData.sections.forEach((section, index) => {
    const li = document.createElement('li');
    li.classList.add('nav-item', 'header__navbar--item', 'text-center');
    const div = document.createElement('div');
    div.classList.add('d-flex');
    const navLink = document.createElement('a');
    navLink.classList.add('nav-link', 'header__navbar--link');
    navLink.href = section.l1Href;
    navLink.id = `navbarDropdownMenuLink${index}`;
    navLink.setAttribute('role', 'button');
    navLink.setAttribute('aria-expanded', 'false');
    navLink.textContent = section.l1Label;
    const underlineSpan = document.createElement('span');
    underlineSpan.classList.add('header__navbar--item-underline');
    navLink.append(underlineSpan);
    div.append(navLink);
    li.append(div);

    const dropdownUl = document.createElement('ul');
    dropdownUl.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
    dropdownUl.setAttribute('aria-labelledby', `navbarDropdownMenuLink${index}`);
    dropdownUl.setAttribute('data-column-count', '3'); // This might need dynamic calculation
    dropdownUl.style.gridTemplateColumns = 'repeat(3, minmax(0px, 1fr))';
    dropdownUl.style.gap = '20px';

    section.children.forEach((child) => {
      const dropdownItem = document.createElement('li');
      dropdownItem.classList.add('dropdown-item', 'header__navbar--dropdown-column');

      const sublinksNavigator = document.createElement('div');
      sublinksNavigator.classList.add('sublinksNavigator');
      const sublinksNav = document.createElement('div');
      sublinksNav.classList.add('sublinks__naviagator');

      const sublink = document.createElement('div');
      sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('sublinks__navigator--icon');
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('aria-hidden', 'true');
      iconSvg.setAttribute('role', 'icon');
      const useIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      // Placeholder for icon href
      useIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#money');
      iconSvg.append(useIcon);
      iconDiv.append(iconSvg);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('d-flex', 'flex-column', 'gap-3');
      const contentLink = document.createElement('a');
      contentLink.href = child.href;
      contentLink.target = child.href.startsWith('http') ? '_blank' : '_self';
      contentLink.classList.add('sublinks__navigator--content--title', 'text-black-500');
      contentLink.textContent = child.label;
      if (contentLink.target === '_blank') {
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('cmp-link__screen-reader-only');
        srOnlySpan.textContent = 'opens in a new tab';
        contentLink.append(srOnlySpan);
      }
      contentDiv.append(contentLink);

      if (child.children && child.children.length > 0) {
        const nestedDiv = document.createElement('div');
        nestedDiv.classList.add('d-flex', 'flex-column', 'gap-3');
        child.children.forEach(nestedChild => {
          const nestedLink = document.createElement('a');
          nestedLink.classList.add('d-flex');
          nestedLink.href = nestedChild.href;
          nestedLink.target = nestedChild.href.startsWith('http') ? '_blank' : '_self';
          const p = document.createElement('p');
          p.classList.add('sublinks__navigator--content--description', 'text-black-400');
          p.textContent = nestedChild.label;
          nestedLink.append(p);
          if (nestedLink.target === '_blank') {
            const srOnlySpan = document.createElement('span');
            srOnlySpan.classList.add('cmp-link__screen-reader-only');
            srOnlySpan.textContent = 'opens in a new tab';
            nestedLink.append(srOnlySpan);
          }
          nestedDiv.append(nestedLink);
        });
        contentDiv.append(nestedDiv);
      } else {
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('d-flex');
        const p = document.createElement('p');
        p.classList.add('sublinks__navigator--content--description', 'text-black-400', 'rte-text');
        p.innerHTML = `<div><p>${child.label} description placeholder</p></div>`;
        descriptionDiv.append(p);
        contentDiv.append(descriptionDiv);
      }

      sublink.append(iconDiv, contentDiv);
      sublinksNav.append(sublink);
      sublinksNavigator.append(sublinksNav);
      dropdownItem.append(sublinksNavigator);
      dropdownUl.append(dropdownItem);
    });

    li.append(dropdownUl);
    ul.append(li);
  });

  navbarCollapse.append(ul);
  navbarInner.append(navbarCollapse);

  const navButtons = document.createElement('div');
  navButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.classList.add('header__search--svg-find');
  searchSvg.setAttribute('aria-hidden', 'true');
  searchSvg.setAttribute('role', 'icon');
  const useSearch = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSearch.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchSvg.append(useSearch);
  searchDiv.append(searchSvg);
  navButtons.append(searchDiv);

  const notificationTrigger = document.createElement('div');
  notificationTrigger.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
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
  useBell.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon');
  bellSvg.append(useBell);
  notificationTrigger.append(notificationSpan, bellSvg);

  const notificationPanel = document.createElement('div');
  notificationPanel.classList.add('p-3', 'flex-column', 'position-absolute', 'z-2', 'header__notification--panel');
  // Add notification items here, similar to mobile menu
  notificationTrigger.append(notificationPanel);
  navButtons.append(notificationTrigger);

  const loginLink = document.createElement('a');
  loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.target = '_blank';
  const userSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  userSvg.setAttribute('aria-hidden', 'true');
  userSvg.setAttribute('role', 'icon');
  const useUser = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useUser.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon');
  userSvg.append(useUser);
  const loginText = document.createElement('span');
  loginText.classList.add('logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap');
  loginText.textContent = 'Login';
  const srOnlyLogin = document.createElement('span');
  srOnlyLogin.classList.add('cmp-link__screen-reader-only');
  srOnlyLogin.textContent = 'opens in a new tab';
  loginLink.append(userSvg, loginText, srOnlyLogin);
  navButtons.append(loginLink);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  const hamburgerOpenSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hamburgerOpenSvg.classList.add('header__hamburger--open');
  hamburgerOpenSvg.setAttribute('aria-hidden', 'true');
  hamburgerOpenSvg.setAttribute('role', 'icon');
  const useHamburgerOpen = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useHamburgerOpen.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon');
  hamburgerOpenSvg.append(useHamburgerOpen);
  const hamburgerCloseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hamburgerCloseSvg.classList.add('position-absolute', 'start-0', 'bottom-0', 'header__hamburger--close');
  hamburgerCloseSvg.setAttribute('aria-hidden', 'true');
  hamburgerCloseSvg.setAttribute('role', 'icon');
  const useHamburgerClose = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useHamburgerClose.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  hamburgerCloseSvg.append(useHamburgerClose);
  hamburgerButton.append(hamburgerOpenSvg, hamburgerCloseSvg);
  navButtons.append(hamburgerButton);

  navbarInner.append(navButtons);
  navbar.append(navbarInner);
  headerWrapper.append(navbar);

  // Global search section
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('position-absolute', 'global__search--wrapper', 'vw-100', 'bg-white', 'start-0', 'end-0', 'section_container--primary', 'd-none'); // Initially hidden
  const globalSearchContainer = document.createElement('div');
  globalSearchContainer.classList.add('d-flex', 'flex-column', 'global__search--container');
  globalSearchSection.append(globalSearchContainer);

  const closeSearchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSearchSvg.classList.add('close-search', 'text-black-500');
  closeSearchSvg.setAttribute('role', 'icon');
  const closeSearchTitle = document.createElement('title');
  closeSearchTitle.textContent = 'close search';
  const useCloseSearch = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useCloseSearch.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeSearchSvg.append(closeSearchTitle, useCloseSearch);
  globalSearchContainer.append(closeSearchSvg);

  const searchForm = document.createElement('form');
  searchForm.classList.add('global__search--form', 'mt-2');
  searchForm.setAttribute('autocomplete', 'off');
  searchForm.setAttribute('data-search-path', '/content/chli/');
  searchForm.setAttribute('data-redirection-path', '/content/chli/in/en/search-result-page');
  searchForm.setAttribute('data-result-count', '5');
  searchForm.setAttribute('data-view-result', 'View Results');
  searchForm.setAttribute('data-no-result', 'No Result Found');
  globalSearchContainer.append(searchForm);

  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.classList.add('global__search__input--wrapper', 'position-relative');
  searchForm.append(searchInputWrapper);

  const searchInput = document.createElement('input');
  searchInput.classList.add('global__search--input', 'text-capitalize');
  searchInput.setAttribute('name', 'searchText');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('placeholder', 'Search');
  searchInputWrapper.append(searchInput);

  const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIconSvg.classList.add('search-icon', 'text-blue-400');
  searchIconSvg.setAttribute('role', 'img');
  const searchIconTitle = document.createElement('title');
  searchIconTitle.textContent = 'Search';
  const useSearchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSearchIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchIconSvg.append(searchIconTitle, useSearchIcon);
  searchInputWrapper.append(searchIconSvg);

  const arrowIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrowIconSvg.classList.add('arrow-icon', 'search__submit', 'text-blue-400', 'cursor-pointer');
  arrowIconSvg.setAttribute('role', 'img');
  const arrowIconTitle = document.createElement('title');
  arrowIconTitle.textContent = 'Search CTA';
  const useArrowIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useArrowIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow-right');
  arrowIconSvg.append(arrowIconTitle, useArrowIcon);
  searchInputWrapper.append(arrowIconSvg);

  const searchInfoSmall = document.createElement('small');
  searchInfoSmall.classList.add('global__search--info', 'font-10', 'float-end', 'text-black-500');
  searchInfoSmall.textContent = 'Hit to enter ';
  searchInputWrapper.append(searchInfoSmall);

  const searchResultWrapper = document.createElement('div');
  searchResultWrapper.classList.add('global__search--result--wrapper', 'position-relative');
  searchInputWrapper.append(searchResultWrapper);

  const searchResultList = document.createElement('ul');
  searchResultList.classList.add('w-100', 'global__search__result--list', 'bg-white', 'd-none', 'position-static');
  searchResultWrapper.append(searchResultList);

  const viewAllDiv = document.createElement('div');
  viewAllDiv.classList.add('text-blue-400', 'font-16', 'text-center', 'global__search__viewall', 'mb-8', 'w-100', 'start-0', 'end-0', 'd-none');
  const viewAllLink = document.createElement('a');
  viewAllLink.classList.add('global__search__viewall--link');
  viewAllLink.setAttribute('title', 'View Results');
  viewAllLink.textContent = 'View Results';
  viewAllDiv.append(viewAllLink);
  searchResultWrapper.append(viewAllDiv);

  const popularSearchDiv = document.createElement('div');
  popularSearchDiv.classList.add('global__search--popular');
  const popularSearchTitleDiv = document.createElement('div');
  popularSearchTitleDiv.classList.add('chli_title', 'd-flex', 'flex-column', 'global__search__popular--title', 'mb-2');
  const popularSearchTitle = document.createElement('h2');
  popularSearchTitle.classList.add('heading-2', 'text-start', 'text-black-500');
  popularSearchTitle.textContent = 'Popular Searches';
  const primaryBarSpan = document.createElement('span');
  primaryBarSpan.classList.add('primary-bar');
  popularSearchTitleDiv.append(popularSearchTitle, primaryBarSpan);
  popularSearchDiv.append(popularSearchTitleDiv);

  const popularSearchCards = document.createElement('div');
  popularSearchCards.classList.add('global__search__popular--cards');
  const popularSearchItems = document.createElement('ul');
  popularSearchItems.classList.add('global__search__popular--items', 'd-flex', 'pl-0', 'flex-wrap', 'gap-4');
  // Populate popular search items from original HTML
  const popularSearchHtmlItems = [
    'Term Insurance', 'Life Insurance Plans', 'Savings &amp; Investment Plan', 'Child Insurance Plan',
    'BMI Calculator', 'Income Tax Calculator', 'What is Investment', 'Retirement Calculator',
    'Sukanya Samriddhi Yojana', 'What is Insurance', 'Features of Life Insurance', 'What is Pension',
    'Section 194', 'Retirement Plans', 'Critical illness Insurance', 'Benefits of Term Insurance', 'ULIP Plan'
  ];
  popularSearchHtmlItems.forEach(itemText => {
    const li = document.createElement('li');
    li.classList.add('global__search__popular--item', 'border-1', 'border', 'border-black-200', 'font-16', 'text-black-500');
    li.innerHTML = itemText;
    popularSearchItems.append(li);
  });
  popularSearchCards.append(popularSearchItems);
  popularSearchDiv.append(popularSearchCards);
  globalSearchContainer.append(popularSearchDiv);
  headerWrapper.append(globalSearchSection);


  block.textContent = '';
  block.append(headerWrapper);

  // Add event listeners for hamburger menu and dropdowns
  const isDesktopQuery = window.matchMedia('(min-width: 900px)');

  function toggleMobileMenu() {
    hamburgerMenu.classList.toggle('show');
    overlay.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden');
  }

  hamburgerButton.addEventListener('click', toggleMobileMenu);
  closeIcon.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', toggleMobileMenu);

  // Toggle for desktop dropdowns
  ul.querySelectorAll('.nav-item.header__navbar--item').forEach(navItem => {
    const navLink = navItem.querySelector('.nav-link.header__navbar--link');
    const dropdown = navItem.querySelector('.nav__dropdown.header__navbar--dropdown');

    if (navLink && dropdown) {
      navLink.addEventListener('mouseenter', () => {
        if (isDesktopQuery.matches) {
          dropdown.classList.add('show');
          navLink.classList.add('active');
          overlay.classList.remove('d-none');
        }
      });

      navItem.addEventListener('mouseleave', () => {
        if (isDesktopQuery.matches) {
          dropdown.classList.remove('show');
          navLink.classList.remove('active');
          overlay.classList.add('d-none');
        }
      });
    }
  });

  // Toggle for mobile accordion dropdowns
  accordion.querySelectorAll('.header__accordion--item').forEach(accordionItem => {
    const toggleSpan = accordionItem.querySelector('.header_arrow_icon');
    const collapseDiv = accordionItem.querySelector('.accordion-collapse');

    if (toggleSpan && collapseDiv) {
      toggleSpan.addEventListener('click', () => {
        const isExpanded = collapseDiv.classList.contains('show');
        if (isExpanded) {
          collapseDiv.classList.remove('show');
          toggleSpan.classList.add('collapsed');
          toggleSpan.querySelector('svg').setAttribute('aria-expanded', 'false');
        } else {
          collapseDiv.classList.add('show');
          toggleSpan.classList.remove('collapsed');
          toggleSpan.querySelector('svg').setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Event listeners for search functionality
  searchDiv.addEventListener('click', () => {
    globalSearchSection.classList.toggle('d-none');
    overlay.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden');
    if (!globalSearchSection.classList.contains('d-none')) {
      searchInput.focus();
    }
  });

  closeSearchSvg.addEventListener('click', () => {
    globalSearchSection.classList.add('d-none');
    overlay.classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
  });

  overlay.addEventListener('click', () => {
    if (!globalSearchSection.classList.contains('d-none')) {
      globalSearchSection.classList.add('d-none');
      overlay.classList.add('d-none');
      document.body.classList.remove('overflow-hidden');
    }
  });

  // Event listeners for notification panel
  notificationTrigger.addEventListener('click', () => {
    notificationPanel.classList.toggle('show');
    overlay.classList.toggle('d-none');
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
