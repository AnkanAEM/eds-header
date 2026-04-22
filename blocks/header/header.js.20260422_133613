import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
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
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
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
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
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
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
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

export default async function decorate(block) {
  const navJson = await fetch('/nav.json').then((resp) => resp.json());
  const navData = navJson.sections;

  const headerWrapper = document.createElement('header');
  headerWrapper.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');

  const headerOverlay = document.createElement('div');
  headerOverlay.classList.add('header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100');
  headerWrapper.append(headerOverlay);

  const navContainer = document.createElement('div');
  navContainer.classList.add('position-absolute', 'w-100');
  headerWrapper.append(navContainer);

  const mobileHamburgerMenu = document.createElement('nav');
  mobileHamburgerMenu.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');
  navContainer.append(mobileHamburgerMenu);

  const mobileHamburgerHead = document.createElement('div');
  mobileHamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  mobileHamburgerMenu.append(mobileHamburgerHead);

  const mobileHamburgerTitle = document.createElement('div');
  mobileHamburgerTitle.classList.add('header__hamburger--head-title');
  mobileHamburgerTitle.textContent = 'Notifications';
  mobileHamburgerHead.append(mobileHamburgerTitle);

  const mobileHamburgerCloseIcon = document.createElement('svg');
  mobileHamburgerCloseIcon.classList.add('arrow', 'header__hamburger--close-icon');
  mobileHamburgerCloseIcon.setAttribute('aria-hidden', 'true');
  mobileHamburgerCloseIcon.setAttribute('role', 'icon');
  mobileHamburgerCloseIcon.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>';
  mobileHamburgerHead.append(mobileHamburgerCloseIcon);

  // Mobile Notification Menu (Placeholder, as content is from original HTML)
  const mobileNotificationMenu = document.createElement('div');
  mobileNotificationMenu.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');
  mobileHamburgerMenu.append(mobileNotificationMenu);

  // Accordion Menu Items
  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  mobileHamburgerMenu.append(mobileMenuWrapper);

  const accordion = document.createElement('div');
  accordion.classList.add('accordion', 'header__accordion');
  mobileMenuWrapper.append(accordion);

  navData.forEach((l1Item) => {
    const section = document.createElement('section');
    section.classList.add('accordion-item', 'd-md-none', 'header__accordion--item');
    accordion.append(section);

    const h2 = document.createElement('h2');
    h2.classList.add('accordion-header', 'header__accordion--heading');
    h2.id = `panel-heading-${l1Item.l1Label.replace(/\s+/g, '-')}`;
    section.append(h2);

    const l1Link = document.createElement('a');
    l1Link.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
    l1Link.setAttribute('type', 'button');
    l1Link.href = l1Item.l1Href;
    l1Link.textContent = l1Item.l1Label;
    h2.append(l1Link);

    const toggleSpan = document.createElement('span');
    toggleSpan.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
    toggleSpan.setAttribute('data-bs-toggle', 'collapse');
    toggleSpan.setAttribute('data-bs-target', `#panel-collapse-${l1Item.l1Label.replace(/\s+/g, '-')}-norm-nav`);
    h2.append(toggleSpan);

    const toggleSvg = document.createElement('svg');
    toggleSvg.classList.add('arrow', 'header__accordion--arrow');
    toggleSvg.setAttribute('aria-hidden', 'true');
    toggleSvg.setAttribute('role', 'icon');
    toggleSvg.setAttribute('aria-expanded', 'true');
    toggleSvg.setAttribute('aria-controls', `panel-collapse-${l1Item.l1Label.replace(/\s+/g, '-')}-norm-nav`);
    toggleSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret"></use>';
    toggleSpan.append(toggleSvg);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = `panel-collapse-${l1Item.l1Label.replace(/\s+/g, '-')}-norm-nav`;
    collapseDiv.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
    collapseDiv.setAttribute('aria-labelledby', `panel-heading-${l1Item.l1Label.replace(/\s+/g, '-')}-norm-nav`);
    collapseDiv.setAttribute('data-label', l1Item.l1Label);
    section.append(collapseDiv);

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body', 'header__accordion--body');
    collapseDiv.append(accordionBody);

    if (l1Item.children && l1Item.children.length > 0) {
      const dropdownItem = document.createElement('div');
      dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
      dropdownItem.setAttribute('data-coloumn-count', '1,2,3'); // Assuming 3 columns for mobile
      accordionBody.append(dropdownItem);

      const sublinksNavigator = document.createElement('div');
      sublinksNavigator.classList.add('sublinksNavigator');
      dropdownItem.append(sublinksNavigator);

      const subNav = document.createElement('div');
      subNav.classList.add('sublinks__naviagator');
      sublinksNavigator.append(subNav);

      l1Item.children.forEach((l2Item) => {
        const sublink = document.createElement('div');
        sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');
        subNav.append(sublink);

        // SVG Icon (Placeholder, as specific icons are in original HTML)
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('sublinks__navigator--icon');
        sublink.append(iconDiv);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'icon');
        svg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#money"></use>'; // Default icon
        iconDiv.append(svg);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3', 'at-element-click-tracking');
        sublink.append(contentDiv);

        const l2Link = document.createElement('a');
        l2Link.href = l2Item.href;
        l2Link.classList.add('sublinks__navigator--content--title', 'text-black-500');
        l2Link.textContent = l2Item.label;
        if (l2Item.href.startsWith('http') && !l2Item.href.includes(window.location.hostname)) {
          l2Link.setAttribute('target', '_blank');
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add('cmp-link__screen-reader-only');
          srOnlySpan.textContent = 'opens in a new tab';
          l2Link.append(srOnlySpan);
        }
        contentDiv.append(l2Link);

        if (l2Item.children && l2Item.children.length > 0) {
          const nestedDiv = document.createElement('div');
          nestedDiv.classList.add('d-flex', 'flex-column', 'gap-3');
          contentDiv.append(nestedDiv);

          l2Item.children.forEach((l3Item) => {
            const l3Link = document.createElement('a');
            l3Link.classList.add('d-flex');
            l3Link.href = l3Item.href;
            const p = document.createElement('p');
            p.classList.add('sublinks__navigator--content--description', 'text-black-400');
            p.textContent = l3Item.label;
            l3Link.append(p);
            if (l3Item.href.startsWith('http') && !l3Item.href.includes(window.location.hostname)) {
              l3Link.setAttribute('target', '_blank');
              const srOnlySpan = document.createElement('span');
              srOnlySpan.classList.add('cmp-link__screen-reader-only');
              srOnlySpan.textContent = 'opens in a new tab';
              l3Link.append(srOnlySpan);
            }
            nestedDiv.append(l3Link);
          });
        }
      });
    }
  });

  // Social Media Links (Placeholder, as content is from original HTML)
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('header__accordion--app', 'bg-white');
  mobileMenuWrapper.append(socialMediaDiv);

  // Mobile App Links (Placeholder, as content is from original HTML)
  const mobileAppDiv = document.createElement('div');
  mobileAppDiv.classList.add('flex-column', 'gap-3', 'header__app');
  socialMediaDiv.append(mobileAppDiv);

  // Main Navigation (Desktop)
  const mainNavbar = document.createElement('nav');
  mainNavbar.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');
  navContainer.append(mainNavbar);

  const navbarDiv = document.createElement('div');
  navbarDiv.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');
  mainNavbar.append(navbarDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
  logoLink.href = '/';
  navbarDiv.append(logoLink);

  const logoImg = document.createElement('img');
  logoImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
  logoImg.src = '/content/dam/chli/homepage/image/canara-hsbc-life-insurance-logo.svg';
  logoImg.alt = 'Canara HSBC Life Insurance';
  logoImg.setAttribute('loading', 'lazy');
  logoLink.append(logoImg);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';
  navbarDiv.append(navbarCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');
  navbarCollapse.append(navList);

  navData.forEach((l1Item, index) => {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'header__navbar--item', 'text-center');
    navList.append(navItem);

    const dFlexDiv = document.createElement('div');
    dFlexDiv.classList.add('d-flex');
    navItem.append(dFlexDiv);

    const l1Link = document.createElement('a');
    l1Link.classList.add('nav-link', 'header__navbar--link');
    l1Link.href = l1Item.l1Href;
    l1Link.id = `navbarDropdownMenuLink${index}`;
    l1Link.setAttribute('role', 'button');
    l1Link.setAttribute('aria-expanded', 'false');
    l1Link.textContent = l1Item.l1Label;
    dFlexDiv.append(l1Link);

    const underlineSpan = document.createElement('span');
    underlineSpan.classList.add('header__navbar--item-underline');
    dFlexDiv.append(underlineSpan);

    if (l1Item.children && l1Item.children.length > 0) {
      const dropdownUl = document.createElement('ul');
      dropdownUl.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
      dropdownUl.setAttribute('aria-labelledby', `navbarDropdownMenuLink${index}`);
      dropdownUl.setAttribute('data-column-count', '3'); // Assuming 3 columns for desktop
      dropdownUl.style.gridTemplateColumns = 'repeat(3, minmax(0px, 1fr))';
      dropdownUl.style.gap = '20px';
      navItem.append(dropdownUl);

      // Group children into columns (example: 3 columns)
      const columnCount = 3;
      const columns = Array.from({ length: columnCount }, () => document.createElement('li'));
      columns.forEach((col) => col.classList.add('dropdown-item', 'header__navbar--dropdown-column'));

      l1Item.children.forEach((l2Item, l2Index) => {
        const targetColumn = columns[l2Index % columnCount];

        const sublinksNavigator = document.createElement('div');
        sublinksNavigator.classList.add('sublinksNavigator');
        targetColumn.append(sublinksNavigator);

        const subNav = document.createElement('div');
        subNav.classList.add('sublinks__naviagator');
        sublinksNavigator.append(subNav);

        const sublink = document.createElement('div');
        sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');
        subNav.append(sublink);

        // SVG Icon (Placeholder)
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('sublinks__navigator--icon');
        sublink.append(iconDiv);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'icon');
        svg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#money"></use>'; // Default icon
        iconDiv.append(svg);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3');
        sublink.append(contentDiv);

        const l2Link = document.createElement('a');
        l2Link.href = l2Item.href;
        l2Link.classList.add('sublinks__navigator--content--title', 'text-black-500');
        l2Link.textContent = l2Item.label;
        if (l2Item.href.startsWith('http') && !l2Item.href.includes(window.location.hostname)) {
          l2Link.setAttribute('target', '_blank');
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add('cmp-link__screen-reader-only');
          srOnlySpan.textContent = 'opens in a new tab';
          l2Link.append(srOnlySpan);
        }
        contentDiv.append(l2Link);

        if (l2Item.children && l2Item.children.length > 0) {
          const nestedDiv = document.createElement('div');
          nestedDiv.classList.add('d-flex', 'flex-column', 'gap-3');
          contentDiv.append(nestedDiv);

          l2Item.children.forEach((l3Item) => {
            const l3Link = document.createElement('a');
            l3Link.classList.add('d-flex');
            l3Link.href = l3Item.href;
            const p = document.createElement('p');
            p.classList.add('sublinks__navigator--content--description', 'text-black-400');
            p.textContent = l3Item.label;
            l3Link.append(p);
            if (l3Item.href.startsWith('http') && !l3Item.href.includes(window.location.hostname)) {
              l3Link.setAttribute('target', '_blank');
              const srOnlySpan = document.createElement('span');
              srOnlySpan.classList.add('cmp-link__screen-reader-only');
              srOnlySpan.textContent = 'opens in a new tab';
              l3Link.append(srOnlySpan);
            }
            nestedDiv.append(l3Link);
          });
        }
      });
      columns.forEach((col) => dropdownUl.append(col));
    }
  });

  const navButtons = document.createElement('div');
  navButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');
  navbarDiv.append(navButtons);

  // Search (Placeholder)
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  searchDiv.innerHTML = `
    <svg class="header__search--svg-find" aria-hidden="true" role="icon">
      <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>
    </svg>
    <div>
      <section class="position-absolute global__search--wrapper vw-100 bg-white start-0 end-0 section_container--primary">
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
        </div>
      </section>
    </div>
  `;
  navButtons.append(searchDiv);

  // Notification Trigger (Placeholder)
  const notificationDiv = document.createElement('div');
  notificationDiv.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
  notificationDiv.innerHTML = `
    <span class="header__notification--trigger-text text-center position-absolute" data-notification-text="true" data-text-color="rgb(255,255,255)" data-background-color="#Db0011" style="color: rgb(255, 255, 255); background-color: rgb(219, 0, 17);">1</span>
    <svg aria-hidden="true" role="icon" class="text-blue-400 header__notification--trigger-svg">
      <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon"></use>
    </svg>
    <div class="p-3 flex-column position-absolute z-2 header__notification--panel">
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
                <div><p>BSE 500 Enhanced Value 50 Fund. Past 5-yr benchmark returns* of index - 31.69%</p></div>
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
                <div><p>Pay premium now &amp; continue enjoying the benefits.</p></div>
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
                <div><p>Update your KYC records within 30 days of any changes</p></div>
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
                <div><p>We're here to support with a quicker, simpler claim process.</p></div>
              </div>
            </div>
          </div>
        </a>
      </section>
    </div>
  `;
  navButtons.append(notificationDiv);

  const loginLink = document.createElement('a');
  loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.setAttribute('target', '_blank');
  loginLink.innerHTML = `
    <svg aria-hidden="true" role="icon">
      <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon"></use>
    </svg>
    <span class="logntext d-none d-md-block header__login--text text-nowrap">Login</span>
    <span class="cmp-link__screen-reader-only">opens in a new tab</span>
  `;
  navButtons.append(loginLink);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  hamburgerButton.innerHTML = `
    <svg class="header__hamburger--open" aria-hidden="true" role="icon">
      <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon"></use>
    </svg>
    <svg class="position-absolute start-0 bottom-0 header__hamburger--close" aria-hidden="true" role="icon">
      <use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>
    </svg>
  `;
  navButtons.append(hamburgerButton);

  const headerBackdrop = document.createElement('div');
  headerBackdrop.classList.add('header__backdrop', 'd-none', 'position-relative', 'position-fixed');
  headerWrapper.append(headerBackdrop);

  block.textContent = '';
  block.append(headerWrapper);

  // Add event listeners for hamburger menu toggle
  hamburgerButton.addEventListener('click', () => {
    mobileHamburgerMenu.classList.toggle('is-open');
    headerOverlay.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden');
  });

  mobileHamburgerCloseIcon.addEventListener('click', () => {
    mobileHamburgerMenu.classList.remove('is-open');
    headerOverlay.classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
  });

  // Accordion toggle for mobile
  accordion.querySelectorAll('.header__accordion--button.collapsed').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = button.getAttribute('data-bs-target');
      const targetCollapse = document.querySelector(targetId);
      if (targetCollapse) {
        targetCollapse.classList.toggle('collapse');
        targetCollapse.classList.toggle('show');
        button.classList.toggle('collapsed');
        button.querySelector('svg').setAttribute('aria-expanded', targetCollapse.classList.contains('show'));
      }
    });
  });

  // Desktop dropdown hover functionality
  if (isDesktop.matches) {
    navList.querySelectorAll('.nav-item.header__navbar--item').forEach((navItem) => {
      const dropdown = navItem.querySelector('.nav__dropdown');
      if (dropdown) {
        navItem.addEventListener('mouseenter', () => {
          dropdown.classList.add('show');
          headerOverlay.classList.remove('d-none');
        });
        navItem.addEventListener('mouseleave', () => {
          dropdown.classList.remove('show');
          headerOverlay.classList.add('d-none');
        });
      }
    });
  }

  // Search functionality
  const searchTrigger = searchDiv.querySelector('.header__search--svg-find');
  const searchPanel = searchDiv.querySelector('.global__search--wrapper');
  const closeSearchButton = searchDiv.querySelector('.close-search');

  searchTrigger.addEventListener('click', () => {
    searchPanel.classList.toggle('show');
    headerOverlay.classList.toggle('d-none');
    document.body.classList.toggle('overflow-hidden');
  });

  closeSearchButton.addEventListener('click', () => {
    searchPanel.classList.remove('show');
    headerOverlay.classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
  });

  // Notification panel functionality
  const notificationTrigger = notificationDiv.querySelector('.header__notification--trigger-svg');
  const notificationPanel = notificationDiv.querySelector('.header__notification--panel');

  notificationTrigger.addEventListener('click', () => {
    notificationPanel.classList.toggle('show');
  });

  // Close notification panel if clicked outside
  document.addEventListener('click', (event) => {
    if (!notificationDiv.contains(event.target) && notificationPanel.classList.contains('show')) {
      notificationPanel.classList.remove('show');
    }
  });
}
