import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on original HTML media queries

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const header = document.querySelector('.header');
    const mobileMenu = header.querySelector('.header__hamburger--menu');
    const searchWrapper = header.querySelector('.global__search--wrapper');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      header.classList.remove('hamburger--active');
      document.body.style.overflowY = '';
    }
    if (searchWrapper && searchWrapper.classList.contains('global__search--wrapper--active')) {
      searchWrapper.classList.remove('global__search--wrapper--active');
      header.classList.remove('search--active');
      document.body.style.overflowY = '';
    }
    // Close desktop dropdowns
    const expandedDropdown = header.querySelector('.header__navbar--item[aria-expanded="true"]');
    if (expandedDropdown) {
      expandedDropdown.setAttribute('aria-expanded', 'false');
      expandedDropdown.querySelector('.header__navbar--dropdown').style.opacity = '0';
      expandedDropdown.querySelector('.header__navbar--dropdown').style.transform = 'scaleY(0)';
      expandedDropdown.querySelector('.header__navbar--item-underline').style.width = '0';
    }
  }
}

function handleMobileMenuToggle(header, mobileMenu, hamburgerButton, overlay, backdrop) {
  const isExpanded = mobileMenu.classList.contains('active');
  if (isExpanded) {
    mobileMenu.classList.remove('active');
    header.classList.remove('hamburger--active');
    hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '1';
    hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '0';
    overlay.classList.add('d-none');
    backdrop.classList.add('d-none');
    document.body.style.overflowY = '';
  } else {
    mobileMenu.classList.add('active');
    header.classList.add('hamburger--active');
    hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '0';
    hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '1';
    overlay.classList.remove('d-none');
    backdrop.classList.remove('d-none');
    document.body.style.overflowY = 'hidden';
  }
}

function createSVG(href) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('arrow', 'header__accordion--arrow');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('role', 'icon');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
  svg.appendChild(use);
  return svg;
}

function createSocialSVG(iconName) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('role', 'icon');
  svg.classList.add('text-blue-400'); // Assuming default color
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#${iconName}`);
  svg.appendChild(use);
  return svg;
}

function createMobileAppSVG(iconName, altText) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('role', 'icon');
  svg.classList.add('header__app--icon');
  svg.setAttribute('alt', altText);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#${iconName}`);
  svg.appendChild(use);
  return svg;
}


function buildMobileAccordionMenu(fragment, mobileMenuWrapper) {
  const accordion = document.createElement('div');
  accordion.classList.add('accordion', 'header__accordion');

  const navSections = fragment.querySelector('.nav-sections');
  if (navSections) {
    Array.from(navSections.children).forEach((section, i) => {
      const l1Link = section.querySelector('a');
      const l1Label = l1Link ? l1Link.textContent.trim() : `Section ${i + 1}`;
      const l1Href = l1Link ? l1Link.href : '#';

      const accordionItem = document.createElement('section');
      accordionItem.classList.add('accordion-item', 'd-md-none', 'header__accordion--item');

      const h2 = document.createElement('h2');
      h2.classList.add('accordion-header', 'header__accordion--heading');
      h2.id = `panel-heading-${i + 1}`;

      const buttonLink = document.createElement('a');
      buttonLink.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
      buttonLink.setAttribute('type', 'button');
      buttonLink.href = l1Href;
      buttonLink.textContent = l1Label;
      h2.appendChild(buttonLink);

      const spanArrow = document.createElement('span');
      spanArrow.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
      spanArrow.setAttribute('data-bs-toggle', 'collapse');
      spanArrow.setAttribute('data-bs-target', `#panel-collapse-${i + 1}-norm-nav`);

      const arrowSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret');
      arrowSvg.setAttribute('aria-expanded', 'true');
      arrowSvg.setAttribute('aria-controls', `panel-collapse-${i + 1}-norm-nav`);
      spanArrow.appendChild(arrowSvg);
      h2.appendChild(spanArrow);
      accordionItem.appendChild(h2);

      const collapseDiv = document.createElement('div');
      collapseDiv.id = `panel-collapse-${i + 1}-norm-nav`;
      collapseDiv.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
      collapseDiv.setAttribute('aria-labelledby', `panel-heading-${i + 1}-norm-nav`);
      collapseDiv.setAttribute('data-label', l1Label);

      const accordionBody = document.createElement('div');
      accordionBody.classList.add('accordion-body', 'header__accordion--body');

      const sublinksNavigator = section.querySelector('.sublinksNavigator') || section.querySelector('.subLevelLinks');
      if (sublinksNavigator) {
        const sublinksDiv = sublinksNavigator.querySelector('.sublinks__naviagator');
        if (sublinksDiv) {
          Array.from(sublinksDiv.children).forEach((sublinkItem) => {
            const dropdownItem = document.createElement('div');
            dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
            dropdownItem.innerHTML = sublinkItem.outerHTML; // Copy inner structure
            accordionBody.appendChild(dropdownItem);
          });
        }
      } else {
        // Handle direct links in section if no sublinksNavigator
        const ul = section.querySelector('ul');
        if (ul) {
          Array.from(ul.children).forEach((li) => {
            const link = li.querySelector('a');
            if (link) {
              const dropdownItem = document.createElement('div');
              dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');
              const itemLink = document.createElement('a');
              itemLink.classList.add('text-black-500', 'header__accordion--link');
              itemLink.href = link.href;
              itemLink.textContent = link.textContent;
              dropdownItem.appendChild(itemLink);
              accordionBody.appendChild(dropdownItem);
            }
          });
        }
      }

      collapseDiv.appendChild(accordionBody);
      accordionItem.appendChild(collapseDiv);
      accordion.appendChild(accordionItem);

      // Add event listener for mobile accordion toggle
      spanArrow.addEventListener('click', () => {
        const isCollapsed = spanArrow.classList.contains('collapsed');
        if (isCollapsed) {
          spanArrow.classList.remove('collapsed');
          collapseDiv.classList.add('show');
          arrowSvg.style.transform = 'rotate(0deg)';
        } else {
          spanArrow.classList.add('collapsed');
          collapseDiv.classList.remove('show');
          arrowSvg.style.transform = 'rotate(180deg)';
        }
      });
    });
  }
  mobileMenuWrapper.appendChild(accordion);
}

function buildDesktopNav(fragment, navBarList) {
  const navSections = fragment.querySelector('.nav-sections');
  if (navSections) {
    Array.from(navSections.children).forEach((section, i) => {
      const l1Link = section.querySelector('a');
      const l1Label = l1Link ? l1Link.textContent.trim() : `Section ${i + 1}`;
      const l1Href = l1Link ? l1Link.href : '#';

      const navItem = document.createElement('li');
      navItem.classList.add('nav-item', 'header__navbar--item', 'text-center');

      const linkWrapper = document.createElement('div');
      linkWrapper.classList.add('d-flex');

      const link = document.createElement('a');
      link.classList.add('nav-link', 'header__navbar--link');
      link.href = l1Href;
      link.id = `navbarDropdownMenuLink${i}`;
      link.setAttribute('role', 'button');
      link.setAttribute('aria-expanded', 'false');
      link.textContent = l1Label;
      linkWrapper.appendChild(link);

      const underline = document.createElement('span');
      underline.classList.add('header__navbar--item-underline');
      linkWrapper.appendChild(underline);
      navItem.appendChild(linkWrapper);

      const sublinksContainer = section.querySelector('.sublinksNavigator') || section.querySelector('.subLevelLinks');
      if (sublinksContainer) {
        const dropdown = document.createElement('ul');
        dropdown.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
        dropdown.setAttribute('aria-labelledby', `navbarDropdownMenuLink${i}`);
        dropdown.setAttribute('data-column-count', '3'); // Assuming 3 columns as per original
        dropdown.style.cssText = 'grid-template-columns: repeat(3, minmax(0px, 1fr)); gap: 20px;';

        const sublinksDiv = sublinksContainer.querySelector('.sublinks__naviagator');
        if (sublinksDiv) {
          Array.from(sublinksDiv.children).forEach((sublinkItem) => {
            const dropdownColumn = document.createElement('li');
            dropdownColumn.classList.add('dropdown-item', 'header__navbar--dropdown-column');
            dropdownColumn.innerHTML = sublinkItem.outerHTML;
            dropdown.appendChild(dropdownColumn);
          });
        }
        navItem.appendChild(dropdown);

        // Desktop dropdown hover behavior
        navItem.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            link.setAttribute('aria-expanded', 'true');
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'scaleY(1)';
            underline.style.width = '100%';
          }
        });
        navItem.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            link.setAttribute('aria-expanded', 'false');
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'scaleY(0)';
            underline.style.width = '0';
          }
        });
      }
      navBarList.appendChild(navItem);
    });
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath + '.plain.html'); // Ensure .plain.html suffix

  block.textContent = ''; // Clear the block content

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header__wrapper');

  const header = document.createElement('header');
  header.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');

  const headerOverlay = document.createElement('div');
  headerOverlay.classList.add('header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100');
  header.appendChild(headerOverlay);

  const positionAbsoluteDiv = document.createElement('div');
  positionAbsoluteDiv.classList.add('position-absolute', 'w-100');

  // Mobile Hamburger Menu (Accordion Menu Items)
  const mobileHamburgerMenu = document.createElement('nav');
  mobileHamburgerMenu.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');

  const mobileHamburgerHead = document.createElement('div');
  mobileHamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  const mobileHamburgerHeadTitle = document.createElement('div');
  mobileHamburgerHeadTitle.classList.add('header__hamburger--head-title');
  
  // Dynamically get "Notifications" text from fragment if available
  const notificationTitleElement = fragment.querySelector('.header__hamburger--head-title');
  if (notificationTitleElement) {
    mobileHamburgerHeadTitle.textContent = notificationTitleElement.textContent.trim();
  } else {
    mobileHamburgerHeadTitle.textContent = 'Notifications'; // Fallback
  }
  mobileHamburgerHead.appendChild(mobileHamburgerHeadTitle);
  const mobileCloseIcon = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  mobileCloseIcon.classList.add('header__hamburger--close-icon');
  mobileHamburgerHead.appendChild(mobileCloseIcon);
  mobileHamburgerMenu.appendChild(mobileHamburgerHead);

  // Mobile Notification Menu (Placeholder - assuming it's static or loaded separately)
  const mobileNotificationDiv = document.createElement('div');
  mobileNotificationDiv.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');
  // Populate mobileNotificationDiv from fragment if available, or leave empty
  const navTools = fragment.querySelector('.nav-tools');
  if (navTools) {
    const notificationItems = navTools.querySelectorAll('.header__notification--item');
    notificationItems.forEach(item => {
      mobileNotificationDiv.appendChild(item.cloneNode(true));
    });
  }
  mobileHamburgerMenu.appendChild(mobileNotificationDiv);

  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  buildMobileAccordionMenu(fragment, mobileMenuWrapper);

  // Social Media Links
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('header__accordion--app', 'bg-white');
  const socialsFlex = document.createElement('div');
  socialsFlex.classList.add('flex-column', 'gap-3', 'header__socials');
  const socialsTitle = document.createElement('h4');
  socialsTitle.classList.add('hamburger__socials--text', 'header__socials--text');
  
  // Dynamically get "Follow Us" text from fragment if available
  const followUsTitleElement = fragment.querySelector('.header__socials--text');
  if (followUsTitleElement) {
    socialsTitle.textContent = followUsTitleElement.textContent.trim();
  } else {
    socialsTitle.textContent = 'Follow Us'; // Fallback
  }
  socialsFlex.appendChild(socialsTitle);
  const socialsList = document.createElement('ul');
  socialsList.classList.add('d-flex', 'justify-content-between', 'header__socials--list');

  // Extract social links from fragment
  const socialLinksData = [];
  const socialLinksContainer = fragment.querySelector('.header__socials--list');
  if (socialLinksContainer) {
    Array.from(socialLinksContainer.children).forEach(li => {
      const a = li.querySelector('a');
      if (a) {
        const iconName = a.getAttribute('icon');
        socialLinksData.push({
          href: a.href,
          icon: iconName,
          rel: a.rel,
        });
      }
    });
  }

  socialLinksData.forEach(data => {
    const li = document.createElement('li');
    li.classList.add('header__socials--item');
    const a = document.createElement('a');
    a.href = data.href;
    a.target = '_blank';
    a.classList.add('header__socials--link');
    if (data.rel) a.rel = data.rel;
    a.setAttribute('icon', data.icon);
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('header__socials--icon');
    iconDiv.appendChild(createSocialSVG(data.icon));
    a.appendChild(iconDiv);
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('cmp-link__screen-reader-only');
    srOnlySpan.textContent = 'opens in a new tab';
    a.appendChild(srOnlySpan);
    li.appendChild(a);
    socialsList.appendChild(li);
  });
  socialsFlex.appendChild(socialsList);
  socialMediaDiv.appendChild(socialsFlex);

  const divider = document.createElement('div');
  divider.classList.add('w-100', 'header__accordion--divider', 'my-4', 'bg-black-200');
  socialMediaDiv.appendChild(divider);

  // Mobile App Links
  const appDiv = document.createElement('div');
  appDiv.classList.add('flex-column', 'gap-3', 'header__app');
  const appTitle = document.createElement('h4');
  appTitle.classList.add('header__app--text');
  
  // Dynamically get "Download the Canara HSBC Mobile App" text from fragment if available
  const appTitleElement = fragment.querySelector('.header__app--text');
  if (appTitleElement) {
    appTitle.textContent = appTitleElement.textContent.trim();
  } else {
    appTitle.textContent = 'Download the Canara HSBC Mobile App'; // Fallback
  }
  appDiv.appendChild(appTitle);
  const appList = document.createElement('ul');
  appList.classList.add('d-flex', 'justify-content-between', 'header__app--list');

  // Extract app links from fragment
  const appLinksData = [];
  const appLinksContainer = fragment.querySelector('.header__app--list');
  if (appLinksContainer) {
    Array.from(appLinksContainer.children).forEach(li => {
      const a = li.querySelector('a');
      const svgUse = a ? a.querySelector('use') : null;
      if (a && svgUse) {
        const iconName = svgUse.getAttribute('xlink:href').split('#').pop();
        const altText = a.querySelector('svg') ? a.querySelector('svg').getAttribute('alt') : '';
        appLinksData.push({
          href: a.href,
          icon: iconName,
          alt: altText,
        });
      }
    });
  }

  appLinksData.forEach(data => {
    const li = document.createElement('li');
    li.classList.add('header__app--item');
    const a = document.createElement('a');
    a.href = data.href;
    a.target = '_blank';
    a.classList.add('header__app--link');
    a.appendChild(createMobileAppSVG(data.icon, data.alt));
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('cmp-link__screen-reader-only');
    srOnlySpan.textContent = 'opens in a new tab';
    a.appendChild(srOnlySpan);
    li.appendChild(a);
    appList.appendChild(li);
  });
  appDiv.appendChild(appList);
  socialMediaDiv.appendChild(appDiv);
  mobileMenuWrapper.appendChild(socialMediaDiv);
  positionAbsoluteDiv.appendChild(mobileHamburgerMenu);

  // Main Navigation (Desktop)
  const mainNavbar = document.createElement('nav');
  mainNavbar.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');

  const navbarContent = document.createElement('div');
  navbarContent.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');

  // Brand Logo
  const navBrand = fragment.querySelector('.nav-brand');
  const brandAnchor = navBrand ? navBrand.querySelector('a') : null;
  const brandImg = navBrand ? navBrand.querySelector('img') : null;

  const navbarBrand = document.createElement('a');
  navbarBrand.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
  navbarBrand.href = brandAnchor ? brandAnchor.href : '/';
  if (brandImg) {
    const img = document.createElement('img');
    img.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
    img.src = brandImg.src;
    img.alt = brandImg.alt;
    img.loading = 'lazy';
    navbarBrand.appendChild(img);
  } else {
    // Fallback for missing brand image
    const placeholderImg = document.createElement('img');
    placeholderImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
    placeholderImg.src = '/icons/logo.svg'; // Generic placeholder
    placeholderImg.alt = 'Logo';
    placeholderImg.loading = 'lazy';
    navbarBrand.appendChild(placeholderImg);
  }
  navbarContent.appendChild(navbarBrand);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';

  const navbarNavList = document.createElement('ul');
  navbarNavList.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');
  buildDesktopNav(fragment, navbarNavList);
  navbarCollapse.appendChild(navbarNavList);
  navbarContent.appendChild(navbarCollapse);

  // Navigation Buttons (Search, Notification, Login, Hamburger)
  const navButtons = document.createElement('div');
  navButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');

  // Search
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  const searchSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchSvg.classList.add('header__search--svg-find');
  searchDiv.appendChild(searchSvg);

  const globalSearchWrapper = document.createElement('div');
  globalSearchWrapper.classList.add('position-absolute', 'global__search--wrapper', 'vw-100', 'bg-white', 'start-0', 'end-0', 'section_container--primary');
  const globalSearchContainer = document.createElement('div');
  globalSearchContainer.classList.add('d-flex', 'flex-column', 'global__search--container');

  const closeSearchSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  closeSearchSvg.classList.add('close-search', 'text-black-500');
  const closeSearchTitle = document.createElement('title');
  closeSearchTitle.textContent = 'close search';
  closeSearchSvg.appendChild(closeSearchTitle);
  globalSearchContainer.appendChild(closeSearchSvg);

  const searchForm = document.createElement('form');
  searchForm.classList.add('global__search--form', 'mt-2');
  searchForm.setAttribute('autocomplete', 'off');
  
  // Extract search form attributes from fragment if available
  const fragmentSearchForm = fragment.querySelector('.global__search--form');
  if (fragmentSearchForm) {
    searchForm.setAttribute('data-search-path', fragmentSearchForm.getAttribute('data-search-path') || '/content/chli/');
    searchForm.setAttribute('data-redirection-path', fragmentSearchForm.getAttribute('data-redirection-path') || '/content/chli/in/en/search-result-page');
    searchForm.setAttribute('data-result-count', fragmentSearchForm.getAttribute('data-result-count') || '5');
    searchForm.setAttribute('data-view-result', fragmentSearchForm.getAttribute('data-view-result') || 'View Results');
    searchForm.setAttribute('data-no-result', fragmentSearchForm.getAttribute('data-no-result') || 'No Result Found');
  } else {
    searchForm.setAttribute('data-search-path', '/content/chli/');
    searchForm.setAttribute('data-redirection-path', '/content/chli/in/en/search-result-page');
    searchForm.setAttribute('data-result-count', '5');
    searchForm.setAttribute('data-view-result', 'View Results');
    searchForm.setAttribute('data-no-result', 'No Result Found');
  }

  const searchInputWrapper = document.createElement('div');
  searchInputWrapper.classList.add('global__search__input--wrapper', 'position-relative');
  const searchInput = document.createElement('input');
  searchInput.classList.add('global__search--input', 'text-capitalize');
  searchInput.setAttribute('name', 'searchText');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('placeholder', 'Search');
  searchInputWrapper.appendChild(searchInput);

  const searchIconSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search');
  searchIconSvg.classList.add('search-icon', 'text-blue-400');
  const searchIconTitle = document.createElement('title');
  searchIconTitle.textContent = 'Search';
  searchIconSvg.appendChild(searchIconTitle);
  searchInputWrapper.appendChild(searchIconSvg);

  const arrowIconSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow-right');
  arrowIconSvg.classList.add('arrow-icon', 'search__submit', 'text-blue-400', 'cursor-pointer');
  const arrowIconTitle = document.createElement('title');
  arrowIconTitle.textContent = 'Search CTA';
  arrowIconSvg.appendChild(arrowIconTitle);
  searchInputWrapper.appendChild(arrowIconSvg);

  const searchInfo = document.createElement('small');
  searchInfo.classList.add('global__search--info', 'font-10', 'float-end', 'text-black-500');
  searchInfo.textContent = 'Hit to enter ';
  searchInputWrapper.appendChild(searchInfo);

  const searchResultWrapper = document.createElement('div');
  searchResultWrapper.classList.add('global__search--result--wrapper', 'position-relative');
  const searchResultList = document.createElement('ul');
  searchResultList.classList.add('w-100', 'global__search__result--list', 'bg-white', 'd-none', 'position-static');
  searchResultWrapper.appendChild(searchResultList);
  const viewAllDiv = document.createElement('div');
  viewAllDiv.classList.add('text-blue-400', 'font-16', 'text-center', 'global__search__viewall', 'mb-8', 'w-100', 'start-0', 'end-0', 'd-none');
  const viewAllLink = document.createElement('a');
  viewAllLink.setAttribute('title', 'View Results');
  viewAllLink.classList.add('global__search__viewall--link');
  viewAllLink.textContent = searchForm.getAttribute('data-view-result'); // Use dynamic text
  viewAllDiv.appendChild(viewAllLink);
  searchResultWrapper.appendChild(viewAllDiv);
  searchInputWrapper.appendChild(searchResultWrapper);
  searchForm.appendChild(searchInputWrapper);
  globalSearchContainer.appendChild(searchForm);

  const popularSearchDiv = document.createElement('div');
  popularSearchDiv.classList.add('global__search--popular');
  const popularSearchTitleDiv = document.createElement('div');
  popularSearchTitleDiv.classList.add('chli_title', 'd-flex', 'flex-column', 'global__search__popular--title', 'mb-2');
  const popularSearchH2 = document.createElement('h2');
  popularSearchH2.classList.add('heading-2', 'text-start', 'text-black-500');
  
  // Dynamically get "Popular Searches" text from fragment if available
  const popularSearchTitleElement = fragment.querySelector('.global__search__popular--title h2');
  if (popularSearchTitleElement) {
    popularSearchH2.textContent = popularSearchTitleElement.textContent.trim();
  } else {
    popularSearchH2.textContent = 'Popular Searches'; // Fallback
  }
  popularSearchTitleDiv.appendChild(popularSearchH2);
  const primaryBar = document.createElement('span');
  primaryBar.classList.add('primary-bar');
  popularSearchTitleDiv.appendChild(primaryBar);
  popularSearchDiv.appendChild(popularSearchTitleDiv);

  const popularSearchCards = document.createElement('div');
  popularSearchCards.classList.add('global__search__popular--cards');
  const popularSearchItems = document.createElement('ul');
  popularSearchItems.classList.add('global__search__popular--items', 'd-flex', 'pl-0', 'flex-wrap', 'gap-4');

  // Extract popular searches from fragment
  const popularSearchesData = [];
  const popularSearchListItems = fragment.querySelectorAll('.global__search__popular--item');
  if (popularSearchListItems.length > 0) {
    popularSearchListItems.forEach(item => {
      popularSearchesData.push(item.textContent.trim());
    });
  } else {
    // Fallback to hardcoded data if not found in fragment
    popularSearchesData.push(
      'Term Insurance', 'Life Insurance Plans', 'Savings & Investment Plan', 'Child Insurance Plan',
      'BMI Calculator', 'Income Tax Calculator', 'What is Investment', 'Retirement Calculator',
      'Sukanya Samriddhi Yojana', 'What is Insurance', 'Features of Life Insurance', 'What is Pension',
      'Section 194', 'Retirement Plans', 'Critical illness Insurance', 'Benefits of Term Insurance',
      'ULIP Plan'
    );
  }

  popularSearchesData.forEach(text => {
    const li = document.createElement('li');
    li.classList.add('global__search__popular--item', 'border-1', 'border', 'border-black-200', 'font-16', 'text-black-500');
    li.textContent = text;
    popularSearchItems.appendChild(li);
  });
  popularSearchCards.appendChild(popularSearchItems);
  popularSearchDiv.appendChild(popularSearchCards);
  globalSearchContainer.appendChild(popularSearchDiv);
  globalSearchWrapper.appendChild(globalSearchContainer);
  searchDiv.appendChild(globalSearchWrapper);
  navButtons.appendChild(searchDiv);

  // Notification
  const notificationTrigger = document.createElement('div');
  notificationTrigger.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
  const notificationSpan = document.createElement('span');
  notificationSpan.classList.add('header__notification--trigger-text', 'text-center', 'position-absolute');
  
  // Extract notification span attributes from fragment if available
  const fragmentNotificationSpan = fragment.querySelector('.header__notification--trigger-text');
  if (fragmentNotificationSpan) {
    notificationSpan.setAttribute('data-notification-text', fragmentNotificationSpan.getAttribute('data-notification-text') || 'true');
    notificationSpan.setAttribute('data-text-color', fragmentNotificationSpan.getAttribute('data-text-color') || 'rgb(255,255,255)');
    notificationSpan.setAttribute('data-background-color', fragmentNotificationSpan.getAttribute('data-background-color') || '#Db0011');
    notificationSpan.style.cssText = fragmentNotificationSpan.style.cssText;
    notificationSpan.textContent = fragmentNotificationSpan.textContent.trim();
  } else {
    notificationSpan.setAttribute('data-notification-text', 'true');
    notificationSpan.setAttribute('data-text-color', 'rgb(255,255,255)');
    notificationSpan.setAttribute('data-background-color', '#Db0011');
    notificationSpan.style.cssText = 'color: rgb(255, 255, 255); background-color: rgb(219, 0, 17);';
    notificationSpan.textContent = '1'; // Default count
  }
  notificationTrigger.appendChild(notificationSpan);
  const bellSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon');
  bellSvg.classList.add('text-blue-400', 'header__notification--trigger-svg');
  notificationTrigger.appendChild(bellSvg);

  const notificationPanel = document.createElement('div');
  notificationPanel.classList.add('p-3', 'flex-column', 'position-absolute', 'z-2', 'header__notification--panel');
  // Populate notificationPanel from fragment if available, or leave empty
  if (navTools) {
    const desktopNotificationItems = navTools.querySelectorAll('.header__notification--item');
    desktopNotificationItems.forEach(item => {
      notificationPanel.appendChild(item.cloneNode(true));
    });
  }
  notificationTrigger.appendChild(notificationPanel);
  navButtons.appendChild(notificationTrigger);

  // Login
  const loginLink = document.createElement('a');
  loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
  
  // Extract login link href and text from fragment if available
  const fragmentLoginLink = fragment.querySelector('.header__login');
  if (fragmentLoginLink) {
    loginLink.href = fragmentLoginLink.href;
    loginLink.target = fragmentLoginLink.target;
    const loginTextElement = fragmentLoginLink.querySelector('.logntext');
    if (loginTextElement) {
      const loginText = document.createElement('span');
      loginText.classList.add('logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap');
      loginText.textContent = loginTextElement.textContent.trim();
      loginLink.appendChild(loginText);
    }
  } else {
    loginLink.href = 'https://customer.canarahsbclife.com/login';
    loginLink.target = '_blank';
    const loginText = document.createElement('span');
    loginText.classList.add('logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap');
    loginText.textContent = 'Login';
    loginLink.appendChild(loginText);
  }
  const userSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon');
  loginLink.appendChild(userSvg);
  const loginSrOnlySpan = document.createElement('span');
  loginSrOnlySpan.classList.add('cmp-link__screen-reader-only');
  loginSrOnlySpan.textContent = 'opens in a new tab';
  loginLink.appendChild(loginSrOnlySpan);
  navButtons.appendChild(loginLink);

  // Hamburger Button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  const hamburgerOpenSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon');
  hamburgerOpenSvg.classList.add('header__hamburger--open');
  hamburgerButton.appendChild(hamburgerOpenSvg);
  const hamburgerCloseSvg = createSVG('/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close');
  hamburgerCloseSvg.classList.add('position-absolute', 'start-0', 'bottom-0', 'header__hamburger--close');
  hamburgerButton.appendChild(hamburgerCloseSvg);
  navButtons.appendChild(hamburgerButton);

  navbarContent.appendChild(navButtons);
  mainNavbar.appendChild(navbarContent);
  header.appendChild(positionAbsoluteDiv);
  header.appendChild(mainNavbar);
  headerWrapper.appendChild(header);

  const headerBackdrop = document.createElement('div');
  headerBackdrop.classList.add('header__backdrop', 'd-none', 'position-relative', 'position-fixed');
  headerWrapper.appendChild(headerBackdrop);

  block.appendChild(headerWrapper);

  // Event Listeners
  window.addEventListener('keydown', closeOnEscape);

  // Hamburger / Mobile Menu Toggle
  hamburgerButton.addEventListener('click', () => {
    handleMobileMenuToggle(header, mobileHamburgerMenu, hamburgerButton, headerOverlay, headerBackdrop);
  });
  mobileCloseIcon.addEventListener('click', () => {
    handleMobileMenuToggle(header, mobileHamburgerMenu, hamburgerButton, headerOverlay, headerBackdrop);
  });

  // Search Toggle
  searchSvg.addEventListener('click', () => {
    const isSearchActive = globalSearchWrapper.classList.contains('global__search--wrapper--active');
    if (isSearchActive) {
      globalSearchWrapper.classList.remove('global__search--wrapper--active');
      header.classList.remove('search--active');
      headerOverlay.classList.add('d-none');
      headerBackdrop.classList.add('d-none');
      document.body.style.overflowY = '';
    } else {
      globalSearchWrapper.classList.add('global__search--wrapper--active');
      header.classList.add('search--active');
      headerOverlay.classList.remove('d-none');
      headerBackdrop.classList.remove('d-none');
      document.body.style.overflowY = 'hidden';
    }
  });
  closeSearchSvg.addEventListener('click', () => {
    globalSearchWrapper.classList.remove('global__search--wrapper--active');
    header.classList.remove('search--active');
    headerOverlay.classList.add('d-none');
    headerBackdrop.classList.add('d-none');
    document.body.style.overflowY = '';
  });

  // Notification Panel Toggle
  notificationTrigger.addEventListener('click', () => {
    notificationPanel.classList.toggle('active');
  });

  // Close notification panel when clicking outside
  document.addEventListener('click', (event) => {
    if (!notificationTrigger.contains(event.target) && notificationPanel.classList.contains('active')) {
      notificationPanel.classList.remove('active');
    }
  });

  // Prevent mobile menu and search from opening simultaneously
  const toggleSearchAndMenu = () => {
    if (mobileHamburgerMenu.classList.contains('active') && globalSearchWrapper.classList.contains('global__search--wrapper--active')) {
      mobileHamburgerMenu.classList.remove('active');
      header.classList.remove('hamburger--active');
      hamburgerButton.querySelector('.header__hamburger--open').style.opacity = '1';
      hamburgerButton.querySelector('.header__hamburger--close').style.opacity = '0';
    }
  };

  hamburgerButton.addEventListener('click', toggleSearchAndMenu);
  searchSvg.addEventListener('click', toggleSearchAndMenu);

  // Close desktop dropdowns on resize if not desktop
  isDesktop.addEventListener('change', () => {
    if (!isDesktop.matches) {
      const expandedDropdown = header.querySelector('.header__navbar--item[aria-expanded="true"]');
      if (expandedDropdown) {
        expandedDropdown.setAttribute('aria-expanded', 'false');
        expandedDropdown.querySelector('.header__navbar--dropdown').style.opacity = '0';
        expandedDropdown.querySelector('.header__navbar--dropdown').style.transform = 'scaleY(0)';
        expandedDropdown.querySelector('.header__navbar--item-underline').style.width = '0';
      }
    }
  });
}
