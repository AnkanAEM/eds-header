import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

function createSVG(id, className = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add(className);
  const use = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', `/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#${id}`);
  svg.appendChild(use);
  return svg;
}

function setupAccordionToggle(button, targetId) {
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.classList.toggle('collapsed', isExpanded);
      target.classList.toggle('collapse', !isExpanded);
      target.classList.toggle('show', isExpanded);
    }
  });
}

function setupMenuToggle(trigger, target, overlay, backdrop) {
  trigger.addEventListener('click', () => {
    const isMenuOpen = target.classList.contains('show');
    target.classList.toggle('show', !isMenuOpen);
    overlay.classList.toggle('d-none', isMenuOpen);
    backdrop.classList.toggle('d-none', isMenuOpen);
    document.body.style.overflowY = isMenuOpen ? '' : 'hidden';
  });
}

export default async function decorate(block) {
  const navData = await fetch('/nav.json').then((resp) => resp.json());
  const navSections = navData.sections;

  block.textContent = '';

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header__wrapper');

  const header = document.createElement('header');
  header.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');

  const headerOverlay = document.createElement('div');
  headerOverlay.classList.add('header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100');
  header.append(headerOverlay);

  const positionAbsoluteDiv = document.createElement('div');
  positionAbsoluteDiv.classList.add('position-absolute', 'w-100');

  // Hamburger Menu (Mobile)
  const hamburgerMenuNav = document.createElement('nav');
  hamburgerMenuNav.classList.add('position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu');

  const hamburgerHead = document.createElement('div');
  hamburgerHead.classList.add('align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head');
  const hamburgerHeadTitle = document.createElement('div');
  hamburgerHeadTitle.classList.add('header__hamburger--head-title');
  hamburgerHeadTitle.textContent = 'Notifications';
  const hamburgerCloseIcon = createSVG('close', 'arrow header__hamburger--close-icon');
  hamburgerHead.append(hamburgerHeadTitle, hamburgerCloseIcon);
  hamburgerMenuNav.append(hamburgerHead);

  // Notification Mobile Menu
  const notificationMobileMenu = document.createElement('div');
  notificationMobileMenu.classList.add('d-md-none', 'flex-column', 'z-2', 'header__notification--mobile');
  // Populate with notification items from block children if they exist
  const mobileNotificationRows = [...block.children].filter(
    (row) => row.querySelector('.header__notification--item'),
  );
  mobileNotificationRows.forEach((row) => {
    const section = document.createElement('section');
    moveInstrumentation(row, section);
    section.classList.add('d-flex', 'flex-column', 'header__notification--item', 'header__notification--item-background');
    const bgColor = row.querySelector('[data-notification-bgcolor]');
    if (bgColor) {
      section.setAttribute('data-notification-bgcolor', bgColor.dataset.notificationBgcolor);
      section.style.backgroundColor = bgColor.dataset.notificationBgcolor;
    }

    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('d-flex', 'flex-column', 'header__notification--item');

      const content = document.createElement('div');
      content.classList.add('d-flex', 'p-2', 'gap-5', 'header__notification--item-content');

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('header__notification--icon');
      const img = link.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconDiv.append(optimizedPic);
      }
      content.append(iconDiv);

      const textContentDiv = document.createElement('div');
      textContentDiv.classList.add('d-flex', 'flex-column', 'justify-content-center', 'gap-3', 'header__notification--content');
      const title = link.querySelector('h4');
      if (title) {
        const newTitle = document.createElement('h4');
        newTitle.classList.add('text-black-500', 'header__notification--content-title');
        newTitle.textContent = title.textContent;
        textContentDiv.append(newTitle);
      }
      const description = link.querySelector('.rte-text');
      if (description) {
        const newDescription = document.createElement('div');
        newDescription.classList.add('text-black-400', 'header__notification--content-description', 'rte-text');
        newDescription.innerHTML = description.innerHTML;
        textContentDiv.append(newDescription);
      }
      content.append(textContentDiv);
      newLink.append(content);
      section.append(newLink);
    }
    notificationMobileMenu.append(section);
  });
  hamburgerMenuNav.append(notificationMobileMenu);

  // Accordion Menu Items
  const mobileMenuWrapper = document.createElement('div');
  mobileMenuWrapper.classList.add('d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper');
  const accordion = document.createElement('div');
  accordion.classList.add('accordion', 'header__accordion');

  navSections.forEach((sectionData, index) => {
    const accordionItem = document.createElement('section');
    accordionItem.classList.add('accordion-item', 'header__accordion--item');
    if (index < 5) {
      accordionItem.classList.add('d-md-none');
    }

    const heading = document.createElement('h2');
    heading.classList.add('accordion-header', 'header__accordion--heading');
    heading.id = `panel-heading-${index + 1}`;

    const mainLink = document.createElement('a');
    mainLink.classList.add('accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link');
    mainLink.href = sectionData.l1Href;
    mainLink.textContent = sectionData.l1Label;

    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('header__accordion--button', 'collapsed', 'header_arrow_icon');
    arrowSpan.setAttribute('aria-expanded', 'false');
    arrowSpan.setAttribute('aria-controls', `panel-collapse-${index + 1}-norm-nav`);
    const arrowSVG = createSVG('drop-up-caret', 'arrow header__accordion--arrow');
    arrowSVG.setAttribute('aria-expanded', 'false');
    arrowSVG.setAttribute('aria-controls', `panel-collapse-${index + 1}-norm-nav`);
    arrowSpan.append(arrowSVG);

    if (sectionData.l1Href === '#') {
      const button = document.createElement('button');
      button.classList.add(...mainLink.classList);
      button.type = 'button';
      button.innerHTML = `<div class="d-flex w-100">${sectionData.l1Label}<div class="navigation__badge--text"></div></div>`;
      heading.append(button, arrowSpan);
      setupAccordionToggle(button, `panel-collapse-${index + 1}`);
    } else {
      heading.append(mainLink, arrowSpan);
      setupAccordionToggle(arrowSpan, `panel-collapse-${index + 1}-norm-nav`);
    }

    accordionItem.append(heading);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = `panel-collapse-${index + 1}${sectionData.l1Href === '#' ? '' : '-norm-nav'}`;
    collapseDiv.classList.add('accordion-collapse', 'collapse', 'header__accordion--collapse');
    collapseDiv.setAttribute('aria-labelledby', `panel-heading-${index + 1}${sectionData.l1Href === '#' ? '' : '-norm-nav'}`);
    collapseDiv.setAttribute('data-label', sectionData.l1Label);

    const accordionBody = document.createElement('div');
    accordionBody.classList.add('accordion-body', 'header__accordion--body');

    if (sectionData.children && sectionData.children.length > 0) {
      sectionData.children.forEach((childData) => {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item', 'header__accordion--dropdown-item');

        const sublinksNavigator = document.createElement('div');
        sublinksNavigator.classList.add('sublinksNavigator');
        const sublinksNav = document.createElement('div');
        sublinksNav.classList.add('sublinks__naviagator');

        const sublink = document.createElement('div');
        sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');

        if (childData.icon) {
          const iconDiv = document.createElement('div');
          iconDiv.classList.add('sublinks__navigator--icon');
          iconDiv.append(createSVG(childData.icon, ''));
          sublink.append(iconDiv);
        }

        const sublinkContent = document.createElement('div');
        sublinkContent.classList.add('sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3');
        const sublinkTitle = document.createElement('a');
        sublinkTitle.href = childData.href;
        sublinkTitle.classList.add('sublinks__navigator--content--title', 'text-black-500');
        sublinkTitle.textContent = childData.label;
        if (childData.target === '_blank') {
          sublinkTitle.target = '_blank';
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add('cmp-link__screen-reader-only');
          srOnlySpan.textContent = 'opens in a new tab';
          sublinkTitle.append(srOnlySpan);
        }
        sublinkContent.append(sublinkTitle);

        if (childData.description || (childData.children && childData.children.length > 0)) {
          const descriptionWrapper = document.createElement('div');
          descriptionWrapper.classList.add('d-flex');
          const descriptionText = document.createElement('div');
          descriptionText.classList.add('sublinks__navigator--content--description', 'text-black-400', 'rte-text');
          if (childData.description) {
            descriptionText.innerHTML = `<div><p>${childData.description}</p></div>`;
          } else if (childData.children && childData.children.length > 0) {
            const nestedLinksDiv = document.createElement('div');
            nestedLinksDiv.classList.add('d-flex', 'flex-column', 'gap-3');
            childData.children.forEach((nestedChild) => {
              const nestedLink = document.createElement('a');
              nestedLink.classList.add('d-flex');
              nestedLink.href = nestedChild.href;
              if (nestedChild.target === '_blank') {
                nestedLink.target = '_blank';
                const srOnlySpan = document.createElement('span');
                srOnlySpan.classList.add('cmp-link__screen-reader-only');
                srOnlySpan.textContent = 'opens in a new tab';
                nestedLink.append(srOnlySpan);
              }
              const nestedP = document.createElement('p');
              nestedP.classList.add('sublinks__navigator--content--description', 'text-black-400');
              nestedP.textContent = nestedChild.label;
              nestedLink.prepend(nestedP);
              if (nestedChild.badge) {
                const badgeDiv = document.createElement('div');
                badgeDiv.classList.add('navigation__badge', 'text-black-500');
                badgeDiv.textContent = nestedChild.badge;
                nestedLink.append(badgeDiv);
              }
              nestedLinksDiv.append(nestedLink);
            });
            descriptionText.append(nestedLinksDiv);
          }
          descriptionWrapper.append(descriptionText);
          sublinkContent.append(descriptionWrapper);
        }
        sublink.append(sublinkContent);
        sublinksNav.append(sublink);
        sublinksNavigator.append(sublinksNav);
        dropdownItem.append(sublinksNavigator);
        accordionBody.append(dropdownItem);
      });
    }

    collapseDiv.append(accordionBody);
    accordionItem.append(collapseDiv);
    accordion.append(accordionItem);
  });

  mobileMenuWrapper.append(accordion);

  // Social Media Links
  const socialAppDiv = document.createElement('div');
  socialAppDiv.classList.add('header__accordion--app', 'bg-white');

  const socialsDiv = document.createElement('div');
  socialsDiv.classList.add('flex-column', 'gap-3', 'header__socials');
  const socialsTitle = document.createElement('h4');
  socialsTitle.classList.add('hamburger__socials--text', 'header__socials--text');
  socialsTitle.textContent = 'Follow Us';
  const socialsList = document.createElement('ul');
  socialsList.classList.add('d-flex', 'justify-content-between', 'header__socials--list');

  const socialLinks = [
    { href: 'https://m.facebook.com/CanaraHSBCLifeInsurance', icon: 'facebook' },
    { href: 'https://www.youtube.com/c/CanaraHSBCLifeInsurance', icon: 'youtube' },
    { href: 'https://www.instagram.com/canarahsbcobc/', icon: 'instagram' },
    { href: 'https://x.com/CanaraHSBCLI', icon: 'xLogo' },
    { href: 'https://in.linkedin.com/company/canara-hsbc-life-insurance-insurance-company', icon: 'linkedin' },
  ];

  socialLinks.forEach((social) => {
    const li = document.createElement('li');
    li.classList.add('header__socials--item');
    const a = document.createElement('a');
    a.href = social.href;
    a.target = '_blank';
    a.classList.add('header__socials--link');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('icon', social.icon);
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('header__socials--icon');
    iconDiv.append(createSVG(social.icon, 'text-blue-400'));
    a.append(iconDiv);
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('cmp-link__screen-reader-only');
    srOnlySpan.textContent = 'opens in a new tab';
    a.append(srOnlySpan);
    li.append(a);
    socialsList.append(li);
  });

  socialsDiv.append(socialsTitle, socialsList);
  socialAppDiv.append(socialsDiv);

  const divider = document.createElement('div');
  divider.classList.add('w-100', 'header__accordion--divider', 'my-4', 'bg-black-200');
  socialAppDiv.append(divider);

  // Mobile App Links
  const appDiv = document.createElement('div');
  appDiv.classList.add('flex-column', 'gap-3', 'header__app');
  const appTitle = document.createElement('h4');
  appTitle.classList.add('header__app--text');
  appTitle.textContent = 'Download the Canara HSBC Mobile App';
  const appList = document.createElement('ul');
  appList.classList.add('d-flex', 'justify-content-between', 'header__app--list');

  const appLinks = [
    { href: 'https://play.google.com/store/apps/details?id=com.choiceapp.genius&hl=en_IN&pli=1', icon: 'get-it-on-google-play', alt: 'google play store' },
    { href: 'https://apps.apple.com/in/app/canara-hsbc-life/id1637840399', icon: 'app-store-download', alt: 'apple play store' },
  ];

  appLinks.forEach((appLink) => {
    const li = document.createElement('li');
    li.classList.add('header__app--item');
    const a = document.createElement('a');
    a.href = appLink.href;
    a.target = '_blank';
    a.classList.add('header__app--link');
    const svg = createSVG(appLink.icon, 'header__app--icon');
    svg.setAttribute('alt', appLink.alt);
    a.append(svg);
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('cmp-link__screen-reader-only');
    srOnlySpan.textContent = 'opens in a new tab';
    a.append(srOnlySpan);
    li.append(a);
    appList.append(li);
  });

  appDiv.append(appTitle, appList);
  socialAppDiv.append(appDiv);
  mobileMenuWrapper.append(socialAppDiv);
  hamburgerMenuNav.append(mobileMenuWrapper);
  positionAbsoluteDiv.append(hamburgerMenuNav);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('position-relative', 'top-0', 'header__navbar', 'w-100');

  const navbarDiv = document.createElement('div');
  navbarDiv.classList.add('navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white');

  const navbarBrand = document.createElement('a');
  navbarBrand.classList.add('navbar-brand', 'p-0', 'header__logo', 'position-relative');
  navbarBrand.href = '/';
  const logoImg = document.createElement('img');
  logoImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
  logoImg.src = '/content/dam/chli/homepage/image/canara-hsbc-life-insurance-logo.svg';
  logoImg.alt = 'Canara HSBC Life Insurance';
  logoImg.loading = 'lazy';
  navbarBrand.append(logoImg);
  navbarDiv.append(navbarBrand);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse');
  navbarCollapse.id = 'navbarNavDropdown';

  const navbarList = document.createElement('ul');
  navbarList.classList.add('navbar-nav', 'gap-10', 'header__navbar--list');

  navSections.forEach((sectionData, index) => {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'header__navbar--item', 'text-center');

    const linkDiv = document.createElement('div');
    linkDiv.classList.add('d-flex');
    const navLink = document.createElement('a');
    navLink.classList.add('nav-link', 'header__navbar--link');
    navLink.href = sectionData.l1Href;
    navLink.id = `navbarDropdownMenuLink${index}`;
    navLink.setAttribute('role', 'button');
    navLink.setAttribute('aria-expanded', 'false');
    navLink.textContent = sectionData.l1Label;
    const underlineSpan = document.createElement('span');
    underlineSpan.classList.add('header__navbar--item-underline');
    navLink.append(underlineSpan);
    linkDiv.append(navLink);
    navItem.append(linkDiv);

    if (sectionData.children && sectionData.children.length > 0) {
      const dropdownUl = document.createElement('ul');
      dropdownUl.classList.add('bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height');
      dropdownUl.setAttribute('aria-labelledby', `navbarDropdownMenuLink${index}`);
      dropdownUl.setAttribute('data-column-count', '3'); // Assuming 3 columns as per original HTML
      dropdownUl.style.gridTemplateColumns = 'repeat(3, minmax(0px, 1fr))';
      dropdownUl.style.gap = '20px';

      sectionData.children.forEach((childData) => {
        const dropdownItem = document.createElement('li');
        dropdownItem.classList.add('dropdown-item', 'header__navbar--dropdown-column');

        const sublinksNavigator = document.createElement('div');
        sublinksNavigator.classList.add('sublinksNavigator');
        const sublinksNav = document.createElement('div');
        sublinksNav.classList.add('sublinks__naviagator');

        const sublink = document.createElement('div');
        sublink.classList.add('sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5');

        if (childData.icon) {
          const iconDiv = document.createElement('div');
          iconDiv.classList.add('sublinks__navigator--icon');
          iconDiv.append(createSVG(childData.icon, ''));
          sublink.append(iconDiv);
        }

        const sublinkContent = document.createElement('div');
        sublinkContent.classList.add('d-flex', 'flex-column', 'gap-3', 'sublinks__navigator--content');
        const sublinkTitle = document.createElement('a');
        sublinkTitle.href = childData.href;
        sublinkTitle.classList.add('sublinks__navigator--content--title', 'text-black-500');
        sublinkTitle.textContent = childData.label;
        if (childData.target === '_blank') {
          sublinkTitle.target = '_blank';
          const srOnlySpan = document.createElement('span');
          srOnlySpan.classList.add('cmp-link__screen-reader-only');
          srOnlySpan.textContent = 'opens in a new tab';
          sublinkTitle.append(srOnlySpan);
        }
        sublinkContent.append(sublinkTitle);

        if (childData.description || (childData.children && childData.children.length > 0)) {
          const descriptionWrapper = document.createElement('div');
          descriptionWrapper.classList.add('d-flex');
          const descriptionText = document.createElement('div');
          descriptionText.classList.add('sublinks__navigator--content--description', 'text-black-400', 'rte-text');
          if (childData.description) {
            descriptionText.innerHTML = `<div><p>${childData.description}</p></div>`;
          } else if (childData.children && childData.children.length > 0) {
            const nestedLinksDiv = document.createElement('div');
            nestedLinksDiv.classList.add('d-flex', 'flex-column', 'gap-3');
            childData.children.forEach((nestedChild) => {
              const nestedLink = document.createElement('a');
              nestedLink.classList.add('d-flex');
              nestedLink.href = nestedChild.href;
              if (nestedChild.target === '_blank') {
                nestedLink.target = '_blank';
                const srOnlySpan = document.createElement('span');
                srOnlySpan.classList.add('cmp-link__screen-reader-only');
                srOnlySpan.textContent = 'opens in a new tab';
                nestedLink.append(srOnlySpan);
              }
              const nestedP = document.createElement('p');
              nestedP.classList.add('sublinks__navigator--content--description', 'text-black-400');
              nestedP.textContent = nestedChild.label;
              nestedLink.prepend(nestedP);
              if (nestedChild.badge) {
                const badgeDiv = document.createElement('div');
                badgeDiv.classList.add('navigation__badge', 'text-black-500');
                badgeDiv.textContent = nestedChild.badge;
                nestedLink.append(badgeDiv);
              }
              nestedLinksDiv.append(nestedLink);
            });
            descriptionText.append(nestedLinksDiv);
          }
          descriptionWrapper.append(descriptionText);
          sublinkContent.append(descriptionWrapper);
        }
        sublink.append(sublinkContent);
        sublinksNav.append(sublink);
        sublinksNavigator.append(sublinksNav);
        dropdownItem.append(sublinksNavigator);
        dropdownUl.append(dropdownItem);
      });
      navItem.append(dropdownUl);

      navLink.addEventListener('mouseenter', () => {
        dropdownUl.classList.add('show');
        dropdownUl.style.transform = 'scaleY(1)';
        dropdownUl.style.opacity = '1';
        dropdownUl.querySelectorAll('.header__navbar--dropdown-column').forEach((col, i) => {
          col.style.transition = `opacity 0.2s ease-in-out ${i * 0.05}s`;
          col.style.opacity = '1';
        });
      });

      navItem.addEventListener('mouseleave', () => {
        dropdownUl.classList.remove('show');
        dropdownUl.style.transform = 'scaleY(0)';
        dropdownUl.style.opacity = '0';
        dropdownUl.querySelectorAll('.header__navbar--dropdown-column').forEach((col) => {
          col.style.opacity = '0';
        });
      });
    }
    navbarList.append(navItem);
  });

  navbarCollapse.append(navbarList);
  navbarDiv.append(navbarCollapse);

  const navButtons = document.createElement('div');
  navButtons.classList.add('navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons');

  // Search
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('bg-transparent', 'header__search', 'cursor-pointer');
  searchDiv.append(createSVG('search', 'header__search--svg-find'));

  const globalSearchWrapper = document.createElement('section');
  globalSearchWrapper.classList.add('position-absolute', 'global__search--wrapper', 'vw-100', 'bg-white', 'start-0', 'end-0', 'section_container--primary');
  globalSearchWrapper.innerHTML = `
    <div class="d-flex flex-column global__search--container">
      <svg class="close-search text-black-500" role="icon"><title>close search</title><use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use></svg>
      <form class="global__search--form mt-2" autocomplete="off" data-search-path="/content/chli/" data-redirection-path="/content/chli/in/en/search-result-page" data-result-count="5" data-view-result="View Results" data-no-result="No Result Found">
        <div class="global__search__input--wrapper position-relative">
          <input class="global__search--input text-capitalize" name="searchText" type="search" placeholder="Search">
          <svg class="search-icon text-blue-400" role="img"><title>Search</title><use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use></svg>
          <svg class="arrow-icon search__submit text-blue-400 cursor-pointer" role="img"><title>Search CTA</title><use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow-right"></use></svg>
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
  `;
  searchDiv.append(globalSearchWrapper);
  navButtons.append(searchDiv);

  searchDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    globalSearchWrapper.classList.toggle('global__search--wrapper--active');
    headerWrapper.classList.toggle('search--active');
    headerOverlay.classList.toggle('d-none');
    document.body.style.overflowY = globalSearchWrapper.classList.contains('global__search--wrapper--active') ? 'hidden' : '';
  });
  globalSearchWrapper.querySelector('.close-search').addEventListener('click', () => {
    globalSearchWrapper.classList.remove('global__search--wrapper--active');
    headerWrapper.classList.remove('search--active');
    headerOverlay.classList.add('d-none');
    document.body.style.overflowY = '';
  });

  // Notification Trigger
  const notificationTriggerDiv = document.createElement('div');
  notificationTriggerDiv.classList.add('d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger');
  const notificationTriggerText = document.createElement('span');
  notificationTriggerText.classList.add('header__notification--trigger-text', 'text-center', 'position-absolute');
  notificationTriggerText.setAttribute('data-notification-text', 'true');
  notificationTriggerText.setAttribute('data-text-color', 'rgb(255,255,255)');
  notificationTriggerText.setAttribute('data-background-color', '#Db0011');
  notificationTriggerText.style.color = 'rgb(255, 255, 255)';
  notificationTriggerText.style.backgroundColor = 'rgb(219, 0, 17)';
  notificationTriggerText.textContent = '1';
  notificationTriggerDiv.append(notificationTriggerText, createSVG('bell-icon', 'text-blue-400 header__notification--trigger-svg'));

  const notificationPanel = document.createElement('div');
  notificationPanel.classList.add('p-3', 'flex-column', 'position-absolute', 'z-2', 'header__notification--panel');
  // Populate with notification items from block children if they exist
  const desktopNotificationRows = [...block.children].filter(
    (row) => row.querySelector('.header__notification--item'),
  );
  desktopNotificationRows.forEach((row) => {
    const section = document.createElement('section');
    moveInstrumentation(row, section);
    section.classList.add('header__notification--item', 'header__notification--item-background');
    const bgColor = row.querySelector('[data-notification-bgcolor]');
    if (bgColor) {
      section.setAttribute('data-notification-bgcolor', bgColor.dataset.notificationBgcolor);
      section.style.backgroundColor = bgColor.dataset.notificationBgcolor;
    }

    const link = row.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('d-flex', 'flex-column', 'header__notification--item');

      const content = document.createElement('div');
      content.classList.add('d-flex', 'gap-5', 'header__notification--item-content');

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('header__notification--icon');
      const img = link.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconDiv.append(optimizedPic);
      }
      content.append(iconDiv);

      const textContentDiv = document.createElement('div');
      textContentDiv.classList.add('d-flex', 'flex-column', 'gap-3', 'header__notification--content');
      const title = link.querySelector('h4');
      if (title) {
        const newTitle = document.createElement('h4');
        newTitle.classList.add('text-black-500', 'header__notification--title');
        newTitle.textContent = title.textContent;
        textContentDiv.append(newTitle);
      }
      const description = link.querySelector('.rte-text');
      if (description) {
        const newDescription = document.createElement('div');
        newDescription.classList.add('text-black-400', 'header__notification--description', 'rte-text');
        newDescription.innerHTML = description.innerHTML;
        textContentDiv.append(newDescription);
      }
      content.append(textContentDiv);
      newLink.append(content);
      section.append(newLink);
    }
    notificationPanel.append(section);
  });

  notificationTriggerDiv.append(notificationPanel);
  navButtons.append(notificationTriggerDiv);

  notificationTriggerDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isDesktop.matches) {
      notificationMobileMenu.classList.toggle('active');
    } else {
      notificationPanel.classList.toggle('show');
      notificationPanel.style.transform = notificationPanel.classList.contains('show') ? 'scaleY(1)' : 'scaleY(0)';
      notificationPanel.style.opacity = notificationPanel.classList.contains('show') ? '1' : '0';
    }
  });

  // Login
  const loginLink = document.createElement('a');
  loginLink.classList.add('d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.target = '_blank';
  loginLink.append(createSVG('user-icon', ''));
  const loginTextSpan = document.createElement('span');
  loginTextSpan.classList.add('logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap');
  loginTextSpan.textContent = 'Login';
  loginLink.append(loginTextSpan);
  const srOnlySpan = document.createElement('span');
  srOnlySpan.classList.add('cmp-link__screen-reader-only');
  srOnlySpan.textContent = 'opens in a new tab';
  loginLink.append(srOnlySpan);
  navButtons.append(loginLink);

  // Hamburger Button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('position-relative', 'text-blue-400', 'header__hamburger--button');
  hamburgerButton.append(createSVG('hamburger-icon', 'header__hamburger--open'));
  hamburgerButton.append(createSVG('close', 'position-absolute start-0 bottom-0 header__hamburger--close'));
  navButtons.append(hamburgerButton);

  navbarDiv.append(navButtons);
  mainNav.append(navbarDiv);
  positionAbsoluteDiv.append(mainNav);
  header.append(positionAbsoluteDiv);
  headerWrapper.append(header);

  const headerBackdrop = document.createElement('div');
  headerBackdrop.classList.add('header__backdrop', 'd-none', 'position-relative', 'position-fixed');
  headerWrapper.append(headerBackdrop);

  block.append(headerWrapper);

  // Event Listeners for mobile hamburger menu
  setupMenuToggle(hamburgerButton, hamburgerMenuNav, headerOverlay, headerBackdrop);
  hamburgerCloseIcon.addEventListener('click', () => {
    hamburgerMenuNav.classList.remove('show');
    headerOverlay.classList.add('d-none');
    headerBackdrop.classList.add('d-none');
    document.body.style.overflowY = '';
  });

  // Close hamburger menu when clicking outside on mobile
  headerOverlay.addEventListener('click', () => {
    hamburgerMenuNav.classList.remove('show');
    headerOverlay.classList.add('d-none');
    headerBackdrop.classList.add('d-none');
    document.body.style.overflowY = '';
  });

  // Close notification panel when clicking outside on desktop
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !notificationTriggerDiv.contains(e.target) && notificationPanel.classList.contains('show')) {
      notificationPanel.classList.remove('show');
      notificationPanel.style.transform = 'scaleY(0)';
      notificationPanel.style.opacity = '0';
    }
  });
}
