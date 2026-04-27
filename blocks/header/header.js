import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on original CSS

function createSVG(paths) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'Group_65');
  g.setAttribute('data-name', 'Group 65');
  g.setAttribute('transform', 'translate(-831.568 -384.448)');

  paths.forEach((d) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'Path_57');
    path.setAttribute('data-name', 'Path 57');
    path.setAttribute('d', d);
    path.setAttribute('fill', '#030408');
    g.appendChild(path);
  });

  svg.appendChild(g);
  return svg;
}

function createArrowSVG() {
  return createSVG([
    'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z',
  ]);
}

function createMailSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('version', '1.1');
  svg.setAttribute('id', 'Layer_1');
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('viewBox', '0 0 48 38.4');
  svg.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
  svg.setAttribute('xml:space', 'preserve');
  svg.setAttribute('width', '21');
  svg.setAttribute('height', '21');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z');
  svg.appendChild(path);
  return svg;
}

function createSearchLensSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');
  svg.classList.add('lens');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
  path.setAttribute('stroke-width', '0.25');
  svg.appendChild(path);
  return svg;
}

function createSearchCloseSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 50 50');
  svg.classList.add('close');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
  svg.appendChild(path);
  return svg;
}

function createSearchSubmitSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '12');
  svg.setAttribute('height', '8');
  svg.setAttribute('viewBox', '0 0 12 8');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
  path.setAttribute('fill', 'black');
  svg.appendChild(path);
  return svg;
}

function createSearchIconSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
  path.setAttribute('stroke-width', '0.25');
  svg.appendChild(path);
  return svg;
}

function closeAllMenus(nav) {
  nav.querySelectorAll('.has-child[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = 'none';
    }
  });
  nav.querySelectorAll('.has-sub-child.active').forEach((div) => {
    div.classList.remove('active');
  });
  nav.querySelectorAll('.has-inner-sub-child.active-child').forEach((div) => {
    div.classList.remove('active-child');
  });
}

function toggleMenuSection(li, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : li.getAttribute('aria-expanded') === 'true';
  li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  const megaMenu = li.querySelector('.mega-menu');
  if (megaMenu) {
    megaMenu.style.display = expanded ? 'none' : 'block';
  }
}

function toggleSubMenu(e) {
  const parentLi = e.currentTarget.closest('li');
  const subMenu = parentLi.querySelector('.has-sub-child') || parentLi.querySelector('.has-inner-sub-child');
  if (subMenu) {
    e.preventDefault();
    const isActive = subMenu.classList.contains('active') || subMenu.classList.contains('active-child');

    // Close other open sub-menus at the same level
    const siblingSubMenus = parentLi.parentElement.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child');
    siblingSubMenus.forEach((sibling) => {
      if (sibling !== subMenu) {
        sibling.classList.remove('active', 'active-child');
      }
    });

    if (isActive) {
      subMenu.classList.remove('active', 'active-child');
    } else {
      subMenu.classList.add(subMenu.classList.contains('has-sub-child') ? 'active' : 'active-child');
    }
  }
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandSections = [];
  const navSections = [];
  const toolsSections = [];

  let currentSectionType = null;

  sections.forEach((section) => {
    const hasLogo = section.querySelector('img[src*="logo"], img[alt*="logo"], img[class*="logo"]');
    if (hasLogo) {
      currentSectionType = 'brand';
    } else if (section.querySelector('p > a[href*="/about-us"], p > a[href*="/our-business"]')) {
      // Heuristic: Nav sections typically start with primary nav links
      currentSectionType = 'nav';
    } else if (section.querySelector('ul') && section.textContent.toLowerCase().includes('contact us')) {
      // Heuristic: Tools section often contains contact/social links
      currentSectionType = 'tools';
    }

    if (currentSectionType === 'brand') {
      brandSections.push(section);
    } else if (currentSectionType === 'nav') {
      navSections.push(section);
    } else if (currentSectionType === 'tools') {
      toolsSections.push(section);
    }
  });

  return { brandSections, navSections, toolsSections };
}

function setupBrandSection(brandSections) {
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const brandLink = brandSections[0].querySelector('a');
  if (brandLink) {
    // Ensure href is relative or dynamic if possible, not hardcoded
    const img = brandLink.querySelector('img');
    if (img) {
      // Clone the image to avoid moving it from the fragment directly
      const clonedImg = img.cloneNode(true);
      clonedImg.setAttribute('width', '200'); // Default width
      clonedImg.setAttribute('height', '30'); // Default height
      clonedImg.classList.add('hiddenlogo1');
      brandLink.innerHTML = ''; // Clear original content
      brandLink.appendChild(clonedImg);
    }
    logoDiv.appendChild(brandLink);
  }
  return logoDiv;
}

function setupNavMenu(ulElement) {
  const newUl = document.createElement('ul');
  const leftDivContentBuffer = [];
  let currentMegaMenu = null;

  Array.from(ulElement.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a primary menu title
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('aria-haspopup', 'true'); // Accessibility
      li.setAttribute('aria-expanded', 'false'); // Accessibility

      const anchor = child.querySelector('a');
      anchor.setAttribute('itemprop', 'url');
      li.appendChild(anchor);

      const span = document.createElement('span');
      span.appendChild(createArrowSVG());
      li.appendChild(span);

      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('mega-menu');
      megaMenuDiv.style.display = 'none'; // Hidden by default
      const wrapContainer = document.createElement('div');
      wrapContainer.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Flush buffered content into a .left-div if it exists
      if (leftDivContentBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        // Sanitize title for class name, ensure it's from dynamic content
        const sanitizedTitle = anchor.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        leftDivContentBuffer.forEach((contentNode) => leftDiv.appendChild(contentNode));
        centerDiv.appendChild(leftDiv);
        leftDivContentBuffer.length = 0; // Clear buffer
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.appendChild(subNavWrap);

      wrapContainer.appendChild(centerDiv);
      megaMenuDiv.appendChild(wrapContainer);
      li.appendChild(megaMenuDiv);
      newUl.appendChild(li);

      currentMegaMenu = subNavWrap; // Set current mega menu for subsequent ULs
    } else if (child.tagName === 'UL' && currentMegaMenu) {
      // This UL belongs to the current mega-menu
      const innerUl = document.createElement('ul');
      Array.from(child.children).forEach((li) => {
        const newLi = document.createElement('li');
        newLi.innerHTML = li.innerHTML; // Copy content, including nested ULs

        const nestedUl = newLi.querySelector('ul');
        if (nestedUl) {
          newLi.classList.add('top-level-li');
          const anchor = newLi.querySelector('a');
          if (anchor) {
            const span = document.createElement('span');
            span.appendChild(createArrowSVG());
            newLi.insertBefore(span, nestedUl);
            // Re-insert anchor to maintain order if needed, or adjust as per original HTML structure
            // The original HTML has <a> then <span> then <div>.
            // If the anchor is already the first child, this might not be needed.
            // For now, assuming innerHTML copies correctly.
          }

          const hasSubChildDiv = document.createElement('div');
          hasSubChildDiv.classList.add('has-sub-child');
          hasSubChildDiv.appendChild(nestedUl);
          newLi.appendChild(hasSubChildDiv);

          // Recursively handle deeper nesting
          const deeperNestedUls = hasSubChildDiv.querySelectorAll('li > ul');
          deeperNestedUls.forEach((deeperUl) => {
            const parentOfDeeperUl = deeperUl.parentElement;
            parentOfDeeperUl.classList.add('first-level-li');
            const deeperAnchor = parentOfDeeperUl.querySelector('a');
            if (deeperAnchor) {
              const deeperSpan = document.createElement('span');
              deeperSpan.appendChild(createArrowSVG());
              parentOfDeeperUl.insertBefore(deeperSpan, deeperUl);
            }

            const hasInnerSubChildDiv = document.createElement('div');
            hasInnerSubChildDiv.classList.add('has-inner-sub-child');
            hasInnerSubChildDiv.appendChild(deeperUl);
            parentOfDeeperUl.appendChild(hasInnerSubChildDiv);
          });
        }
        innerUl.appendChild(newLi);
      });
      currentMegaMenu.appendChild(innerUl);
    } else {
      // Buffer non-navigation content (headings, paragraphs, images) for the next mega-menu's left-div
      leftDivContentBuffer.push(child.cloneNode(true));
    }
  });

  return newUl;
}

function setupDesktopNav(navSections) {
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  const tempDiv = document.createElement('div');
  navSections.forEach((section) => tempDiv.appendChild(section.cloneNode(true)));
  const processedNavUl = setupNavMenu(tempDiv);
  Array.from(processedNavUl.children).forEach((li) => navUl.appendChild(li));

  mainNav.appendChild(navUl);
  return mainNav;
}

function setupToolsSection(toolsSections) {
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');

  const mailLi = document.createElement('li');
  mailLi.classList.add('mail');
  const mailLink = toolsSections[0]?.querySelector('a[href*="contact-us"]');
  if (mailLink) {
    const originalMailText = mailLink.textContent; // Get original text for mobile
    mailLink.innerHTML = ''; // Clear text for desktop icon
    mailLink.appendChild(createMailSVG());
    mailLi.appendChild(mailLink);

    // Mobile version
    const mailLiMobile = document.createElement('li');
    mailLiMobile.classList.add('mail');
    const mailLinkMobile = mailLink.cloneNode(true); // Clone the link
    mailLinkMobile.innerHTML = ''; // Clear SVG
    mailLinkMobile.textContent = originalMailText || 'Contact Us'; // Mobile version has text label
    mailLiMobile.appendChild(mailLinkMobile);

    const iconNavMobile = document.createElement('div');
    iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
    const mobileUl = document.createElement('ul');
    mobileUl.appendChild(mailLiMobile);

    // Append mobile tools to the main tools container later
    const toolsContainer = document.createElement('div');
    toolsContainer.appendChild(iconNavMobile); // Add mobile first for order
    toolsContainer.appendChild(iconNavDesktop);
    return toolsContainer;
  }

  // If no mail link, still create the desktop/mobile containers
  const toolsContainer = document.createElement('div');
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  iconNavMobile.appendChild(mobileUl);
  toolsContainer.appendChild(iconNavMobile);
  toolsContainer.appendChild(iconNavDesktop);

  // Search functionality (common for both desktop and mobile, but with different display)
  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.setAttribute('href', '#');
  searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
  searchLinkDesktop.appendChild(createSearchLensSVG());
  searchLinkDesktop.appendChild(createSearchCloseSVG());
  searchLiDesktop.appendChild(searchLinkDesktop);
  searchLiDesktop.appendChild(createSearchScreenWrap());
  desktopUl.appendChild(searchLiDesktop);
  iconNavDesktop.appendChild(desktopUl);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.setAttribute('href', '#');
  searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
  searchLinkMobile.appendChild(createSearchLensSVG());
  searchLinkMobile.appendChild(createSearchCloseSVG());
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.setAttribute('data-once', 'search-stop-propagation');
  searchSpanMobile.textContent = ' Search'; // Hardcoded label, but common UI element
  searchLinkMobile.appendChild(searchSpanMobile);
  searchLiMobile.appendChild(searchLinkMobile);
  searchLiMobile.appendChild(createSearchScreenWrap()); // Re-use search screen wrap
  mobileUl.appendChild(searchLiMobile);

  return toolsContainer;
}

function createSearchScreenWrap() {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');

  const form = document.createElement('form');
  form.setAttribute('action', '/search'); // Dynamic URL from metadata or config
  form.setAttribute('method', 'get');
  form.setAttribute('id', 'search-block-form');
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');
  form.setAttribute('role', 'search'); // Accessibility

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.setAttribute('data-once', 'search-stop-propagation');
  searchIcon.appendChild(createSearchIconSVG());
  searchWrap.appendChild(searchIcon);

  const inputText = document.createElement('input');
  inputText.setAttribute('type', 'text');
  inputText.classList.add('input-text', 'searchtext');
  inputText.setAttribute('required', '');
  inputText.setAttribute('name', 'key');
  inputText.setAttribute('id', 'searchInput');
  inputText.setAttribute('autocomplete', 'off');
  inputText.setAttribute('data-once', 'search-stop-propagation');
  inputText.setAttribute('aria-label', 'Search'); // Accessibility
  searchWrap.appendChild(inputText);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.setAttribute('data-once', 'search-stop-propagation');
  labelDiv.textContent = ' Submit '; // UI label, not business data
  submitButton.appendChild(labelDiv);
  submitButton.appendChild(createSearchSubmitSVG());
  searchWrap.appendChild(submitButton);

  form.appendChild(searchWrap);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');

  const swiper = document.createElement('div');
  swiper.classList.add('swiper', 'scrollSwiper');
  swiper.setAttribute('data-once', 'search-stop-propagation');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.setAttribute('data-once', 'search-stop-propagation');
  swiperWrapper.appendChild(swiperSlide);
  swiper.appendChild(swiperWrapper);
  searchResultBox.appendChild(swiper);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.appendChild(swiperScrollbar);

  form.appendChild(searchResultBox);
  wrapDiv.appendChild(form);

  // Popular Keywords - Removed hardcoded values. Should come from fragment/metadata.
  // const popularKeywordsWrap = document.createElement('div');
  // popularKeywordsWrap.classList.add('search-suggestions-wrap');
  // popularKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
  // const pkLabel = document.createElement('div');
  // pkLabel.classList.add('label');
  // pkLabel.setAttribute('data-once', 'search-stop-propagation');
  // pkLabel.textContent = 'Popular Keywords:';
  // popularKeywordsWrap.appendChild(pkLabel);
  // const pkTokensWrap = document.createElement('div');
  // pkTokensWrap.classList.add('tokens-wrap');
  // pkTokensWrap.setAttribute('data-once', 'search-stop-propagation');
  // const pkUl = document.createElement('ul');
  // pkUl.setAttribute('data-once', 'search-stop-propagation');
  // ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
  //   const li = document.createElement('li');
  //   li.setAttribute('data-once', 'search-stop-propagation');
  //   li.textContent = keyword;
  //   pkUl.appendChild(li);
  // });
  // pkTokensWrap.appendChild(pkUl);
  // popularKeywordsWrap.appendChild(pkTokensWrap);
  // wrapDiv.appendChild(popularKeywordsWrap);

  // Recommended for you - Removed hardcoded values. Should come from fragment/metadata.
  // const recommendedWrap = document.createElement('div');
  // recommendedWrap.classList.add('search-suggestions-wrap');
  // recommendedWrap.setAttribute('data-once', 'search-stop-propagation');
  // const recLabel = document.createElement('div');
  // recLabel.classList.add('label');
  // recLabel.setAttribute('data-once', 'search-stop-propagation');
  // recLabel.textContent = 'Recommended for you:';
  // recommendedWrap.appendChild(recLabel);
  // const recTokensWrap = document.createElement('div');
  // recTokensWrap.classList.add('tokens-wrap');
  // recTokensWrap.setAttribute('data-once', 'search-stop-propagation');
  // const recUl = document.createElement('ul');
  // recUl.setAttribute('data-once', 'search-stop-propagation');
  // ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((item) => {
  //   const li = document.createElement('li');
  //   li.setAttribute('data-once', 'search-stop-propagation');
  //   li.textContent = item;
  //   recUl.appendChild(li);
  // });
  // recTokensWrap.appendChild(recUl);
  // recommendedWrap.appendChild(recTokensWrap);
  // wrapDiv.appendChild(recommendedWrap);

  searchScreenWrap.appendChild(wrapDiv);
  return searchScreenWrap;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return;
  }

  // Clear existing block content
  block.textContent = '';
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  const { brandSections, navSections, toolsSections } = parseStructure(fragment);

  // 1. Brand Section (Logo)
  if (brandSections.length > 0) {
    const logoElement = setupBrandSection(brandSections);
    wrapDiv.appendChild(logoElement);
  }

  // Hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-label', 'Toggle navigation menu'); // Accessibility
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.appendChild(document.createElement('li'));
  }
  hamburger.appendChild(hamburgerUl);
  wrapDiv.appendChild(hamburger);

  // 2. Navigation Section
  if (navSections.length > 0) {
    const mainNav = setupDesktopNav(navSections);
    wrapDiv.appendChild(mainNav);
  }

  // 3. Tools Section (Contact Us, Search)
  let toolsContainer;
  if (toolsSections.length > 0) {
    toolsContainer = setupToolsSection(toolsSections);
  } else {
    // Create empty tools container if no tools section in fragment
    toolsContainer = document.createElement('div');
    toolsContainer.classList.add('icon-nav-container'); // A generic container class
    const iconNavDesktop = document.createElement('div');
    iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
    iconNavDesktop.appendChild(document.createElement('ul'));
    toolsContainer.appendChild(iconNavDesktop);

    const iconNavMobile = document.createElement('div');
    iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
    iconNavMobile.appendChild(document.createElement('ul'));
    toolsContainer.appendChild(iconNavMobile);
  }
  wrapDiv.appendChild(toolsContainer);

  // 80th-year logo - This should ideally come from the fragment or metadata, not hardcoded.
  // For now, removing hardcoded values. If it must be present, its content should be dynamic.
  // const year80LogoDiv = document.createElement('div');
  // year80LogoDiv.classList.add('logo', 'year-80-logo');
  // const year80Link = document.createElement('a');
  // year80Link.setAttribute('href', 'https://www.mahindra.com/');
  // const year80Img = document.createElement('img');
  // year80Img.setAttribute('src', 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp');
  // year80Img.setAttribute('alt', '80th Year Logo Gold');
  // year80Img.setAttribute('title', '80thYearLogo_Gold');
  // year80Img.classList.add('hiddenlogo1', 'years-80');
  // year80Img.setAttribute('width', '74');
  // year80Img.setAttribute('height', '60');
  // year80Img.setAttribute('loading', 'lazy');
  // year80Link.appendChild(year80Img);
  // year80LogoDiv.appendChild(year80Link);
  // wrapDiv.appendChild(year80LogoDiv);

  containerDiv.appendChild(wrapDiv);
  block.appendChild(containerDiv);

  // Event Listeners for menu interactions
  const mainNav = block.querySelector('.main-nav');
  if (mainNav) {
    const navLis = mainNav.querySelectorAll('ul > li.has-child');
    navLis.forEach((li) => {
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          closeAllMenus(mainNav);
          toggleMenuSection(li, true);
        }
      });
      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          toggleMenuSection(li, false);
        }
      });

      // Mobile click handler for main menu items
      li.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const wasExpanded = li.getAttribute('aria-expanded') === 'true';
          // Close all other main menus first
          navLis.forEach((otherLi) => {
            if (otherLi !== li && otherLi.getAttribute('aria-expanded') === 'true') {
              toggleMenuSection(otherLi, false);
            }
          });
          toggleMenuSection(li, !wasExpanded);
        }
      });

      // Mobile click handler for sub-menu arrows
      li.querySelectorAll('.top-level-li > span').forEach((span) => {
        span.addEventListener('click', toggleSubMenu);
      });
      li.querySelectorAll('.first-level-li > span').forEach((span) => {
        span.addEventListener('click', toggleSubMenu);
      });
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
      const isNavOpen = mainNav.classList.toggle('active');
      hamburger.classList.toggle('active', isNavOpen);
      document.body.style.overflowY = isNavOpen ? 'hidden' : '';
      if (isNavOpen) {
        hamburger.setAttribute('aria-expanded', 'true');
      } else {
        hamburger.setAttribute('aria-expanded', 'false');
        closeAllMenus(mainNav);
      }
    });

    // Search functionality toggle
    const searchIcons = block.querySelectorAll('.icon-nav .search');
    searchIcons.forEach((searchIcon) => {
      searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing
        const searchScreenWrap = searchIcon.querySelector('.search-screen-wrap');
        const isSearchOpen = searchScreenWrap.classList.toggle('active');

        // Toggle search icon visibility
        const lensIcon = searchIcon.querySelector('.lens');
        const closeIcon = searchIcon.querySelector('.close');
        if (lensIcon && closeIcon) {
          lensIcon.style.display = isSearchOpen ? 'none' : 'block';
          closeIcon.style.display = isSearchOpen ? 'block' : 'none';
        }

        // Hide search text on desktop when open
        const searchTextSpan = searchIcon.querySelector('span');
        if (searchTextSpan && isDesktop.matches) {
          searchTextSpan.style.display = isSearchOpen ? 'none' : 'block';
        }

        if (isSearchOpen) {
          searchScreenWrap.style.opacity = '1';
          searchScreenWrap.style.pointerEvents = 'all';
          searchScreenWrap.style.transform = 'translate(0,0)';
          document.body.style.overflowY = 'hidden';
          searchIcon.setAttribute('aria-expanded', 'true'); // Accessibility
          searchScreenWrap.querySelector('#searchInput')?.focus(); // Focus search input
        } else {
          searchScreenWrap.style.opacity = '0';
          searchScreenWrap.style.pointerEvents = 'none';
          searchScreenWrap.style.transform = 'translate(0,0)';
          document.body.style.overflowY = '';
          searchIcon.setAttribute('aria-expanded', 'false'); // Accessibility
        }
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchIcon.contains(e.target)) {
          const searchScreenWrap = searchIcon.querySelector('.search-screen-wrap');
          if (searchScreenWrap && searchScreenWrap.classList.contains('active')) {
            searchScreenWrap.classList.remove('active');
            searchScreenWrap.style.opacity = '0';
            searchScreenWrap.style.pointerEvents = 'none';
            searchScreenWrap.style.transform = 'translate(0,0)';
            document.body.style.overflowY = '';

            const lensIcon = searchIcon.querySelector('.lens');
            const closeIcon = searchIcon.querySelector('.close');
            if (lensIcon && closeIcon) {
              lensIcon.style.display = 'block';
              closeIcon.style.display = 'none';
            }
            const searchTextSpan = searchIcon.querySelector('span');
            if (searchTextSpan) {
              searchTextSpan.style.display = 'block';
            }
            searchIcon.setAttribute('aria-expanded', 'false'); // Accessibility
          }
        }
      });
    });

    // Escape key listener for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close main navigation
        if (mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflowY = '';
          closeAllMenus(mainNav);
        }

        // Close search overlay
        block.querySelectorAll('.search-screen-wrap.active').forEach((searchScreenWrap) => {
          searchScreenWrap.classList.remove('active');
          searchScreenWrap.style.opacity = '0';
          searchScreenWrap.style.pointerEvents = 'none';
          searchScreenWrap.style.transform = 'translate(0,0)';
          document.body.style.overflowY = '';

          const parentSearchIcon = searchScreenWrap.closest('.search');
          if (parentSearchIcon) {
            parentSearchIcon.setAttribute('aria-expanded', 'false');
            const lensIcon = parentSearchIcon.querySelector('.lens');
            const closeIcon = parentSearchIcon.querySelector('.close');
            if (lensIcon && closeIcon) {
              lensIcon.style.display = 'block';
              closeIcon.style.display = 'none';
            }
            const searchTextSpan = parentSearchIcon.querySelector('span');
            if (searchTextSpan) {
              searchTextSpan.style.display = 'block';
            }
          }
        });

        // Close any open mega menus
        closeAllMenus(mainNav);
      }
    });
  }
}
