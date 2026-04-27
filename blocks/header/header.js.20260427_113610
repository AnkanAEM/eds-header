import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

// Helper to create an SVG element from its path data
function createSVG(pathData, viewBox = '-23.5 -23.5 122.80 122.80', classes = [], fill = '#000000', stroke = '#000000', strokeWidth = '4.851456000000001') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', fill);
  svg.setAttribute('stroke', stroke);
  svg.setAttribute('stroke-width', strokeWidth);
  classes.forEach(cls => svg.classList.add(cls));

  const gBgCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gBgCarrier.setAttribute('id', 'SVGRepo_bgCarrier');
  gBgCarrier.setAttribute('stroke-width', '0');
  svg.append(gBgCarrier);

  const gTracerCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gTracerCarrier.setAttribute('id', 'SVGRepo_tracerCarrier');
  gTracerCarrier.setAttribute('stroke-linecap', 'round');
  gTracerCarrier.setAttribute('stroke-linejoin', 'round');
  gTracerCarrier.setAttribute('stroke', '#CCCCCC');
  gTracerCarrier.setAttribute('stroke-width', '0.30321600000000004');
  svg.append(gTracerCarrier);

  const gIconCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gIconCarrier.setAttribute('id', 'SVGRepo_iconCarrier');
  const group65 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group65.setAttribute('id', 'Group_65');
  group65.setAttribute('data-name', 'Group 65');
  group65.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', '#030408');
  group65.append(path);
  gIconCarrier.append(group65);
  svg.append(gIconCarrier);
  return svg;
}

// Path data for the chevron icon
const CHEVRON_PATH_DATA = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';

function createSearchSVG() {
  const pathData = 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');
  svg.classList.add('lens');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke-width', '0.25');
  svg.append(path);
  return svg;
}

function createCloseSVG() {
  const pathData = 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 50 50');
  svg.classList.add('close');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  svg.append(path);
  return svg;
}

function createMailSVG() {
  const pathData = 'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z';
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
  path.setAttribute('d', pathData);
  svg.append(path);
  return svg;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSectionExpanded = nav.querySelector('.nav-sections [aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(nav.querySelector('.nav-sections'), false);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, false);
      const hamburgerButton = nav.closest('.wrap').querySelector('.hamburger');
      if (hamburgerButton) hamburgerButton.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    toggleMenu(nav, false);
  }
}

function toggleMegaMenu(navItem, expand = null) {
  const megaMenu = navItem.querySelector('.mega-menu');
  if (!megaMenu) return;

  const isExpanded = expand !== null ? expand : navItem.getAttribute('aria-expanded') === 'true';
  navItem.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  megaMenu.style.display = isExpanded ? 'none' : 'block';
  navItem.classList.toggle('active', !isExpanded);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections > ul > li.has-child').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) {
      megaMenu.style.display = expanded ? 'block' : 'none';
    }
    section.classList.toggle('active', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.closest('.wrap').querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    toggleAllNavSections(navSections, expanded);
  }

  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandSections = [];
  const navSections = [];
  const toolsSections = [];

  let foundNavStart = false;
  sections.forEach((section) => {
    if (section.querySelector('picture img')) {
      brandSections.push(section);
    } else if (section.querySelector('p > a[href*="mahindra.com/about-us"], p > a[href*="mahindra.com/our-business"]')) {
      foundNavStart = true;
      navSections.push(section);
    } else if (foundNavStart && (section.querySelector('ul') || section.querySelector('.latest-two-press-release') || section.querySelector('.left-div-heading'))) {
      navSections.push(section);
    } else if (section.querySelector('ul a[href*="facebook.com"], ul a[href*="contact-us"], ul a[href*="search"]')) {
      toolsSections.push(section);
    }
  });

  return { brandSections, navSections, toolsSections };
}

function setupBrand(brandSections) {
  if (!brandSections.length) return [];

  const brandElements = [];
  const mainLogoDiv = document.createElement('div');
  mainLogoDiv.classList.add('logo');

  const mainLogoP = brandSections[0].querySelector('p:not(:has(img[alt*="80th Year Logo"]))');
  if (mainLogoP) {
    const logoLink = mainLogoP.querySelector('a');
    const logoImg = mainLogoP.querySelector('picture img');

    if (logoLink && logoImg) {
      const a = document.createElement('a');
      a.href = logoLink.href;
      a.append(logoImg);
      mainLogoDiv.append(a);
    } else if (logoImg) {
      const a = document.createElement('a');
      a.href = '/';
      a.append(logoImg);
      mainLogoDiv.append(a);
    } else if (logoLink) {
      mainLogoDiv.append(logoLink);
    }
  }
  if (mainLogoDiv.children.length > 0) {
    brandElements.push(mainLogoDiv);
  }

  const year80LogoP = brandSections[0].querySelector('p:has(img[alt*="80th Year Logo"])');
  if (year80LogoP) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const year80Link = year80LogoP.querySelector('a');
    const year80Img = year80LogoP.querySelector('img');
    if (year80Link && year80Img) {
      year80Link.classList.add('hiddenlogo1', 'years-80');
      year80Link.innerHTML = '';
      year80Link.append(year80Img);
      year80LogoDiv.append(year80Link);
    }
    brandElements.push(year80LogoDiv);
  }

  return brandElements;
}

function decorateNestedUl(ul) {
  Array.from(ul.children).forEach((li) => {
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      li.classList.add('top-level-li');
      const link = li.querySelector('a');
      if (link) {
        link.after(createSVG(CHEVRON_PATH_DATA));
      } else {
        const textNode = Array.from(li.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          textNode.remove();
          li.prepend(span);
          span.after(createSVG(CHEVRON_PATH_DATA));
        }
      }

      const hasSubChildDiv = document.createElement('div');
      hasSubChildDiv.classList.add('has-sub-child');
      hasSubChildDiv.append(nestedUl);
      li.append(hasSubChildDiv);
      decorateNestedUl(nestedUl);

      li.addEventListener('click', (event) => {
        if (!isDesktop.matches) {
          event.stopPropagation();
          hasSubChildDiv.classList.toggle('active');
          const chevronIcon = li.querySelector('span svg');
          if (chevronIcon) {
            chevronIcon.classList.toggle('rotated', hasSubChildDiv.classList.contains('active'));
          }
        }
      });
    } else {
      li.classList.add('first-level-li');
    }

    const innerNestedUl = li.querySelector('.has-sub-child > ul > li > ul');
    if (innerNestedUl) {
      const parentLi = innerNestedUl.closest('li');
      const innerHasSubChildDiv = document.createElement('div');
      innerHasSubChildDiv.classList.add('has-inner-sub-child');
      innerHasSubChildDiv.append(innerNestedUl);
      parentLi.append(innerHasSubChildDiv);

      const link = parentLi.querySelector('a');
      if (link) {
        link.after(createSVG(CHEVRON_PATH_DATA));
      } else {
        const textNode = Array.from(parentLi.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          textNode.remove();
          parentLi.prepend(span);
          span.after(createSVG(CHEVRON_PATH_DATA));
        }
      }

      parentLi.addEventListener('click', (event) => {
        if (!isDesktop.matches) {
          event.stopPropagation();
          innerHasSubChildDiv.classList.toggle('active-child');
          const chevronIcon = parentLi.querySelector('span svg');
          if (chevronIcon) {
            chevronIcon.classList.toggle('rotated', innerHasSubChildDiv.classList.contains('active-child'));
          }
        }
      });
    }
  });
}

function setupDesktopNav(navSections) {
  if (!navSections.length) return null;

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLi = null;
  let leftDivContentBuffer = [];

  navSections.forEach((section) => {
    Array.from(section.children).forEach((child) => {
      const isL0Link = child.tagName === 'P' && child.querySelector('a');
      const isUl = child.tagName === 'UL';
      const isLeftDivContent = child.classList.contains('left-div-heading') || child.classList.contains('left-div-desc') || child.classList.contains('left-div-subdesc') || child.classList.contains('latest-two-press-release');

      if (isL0Link) {
        if (currentLi) {
          if (leftDivContentBuffer.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const titleText = currentLi.querySelector('a')?.textContent || 'Menu';
            leftDiv.classList.add(`${titleText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-left-div`);
            leftDivContentBuffer.forEach(item => leftDiv.append(item));
            currentLi.querySelector('.center-div').prepend(leftDiv);
            leftDivContentBuffer = [];
          }
          navUl.append(currentLi);
        }

        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');
        currentLi.setAttribute('data-once', 'nav-close-search');
        currentLi.setAttribute('aria-expanded', 'false'); // Initialize aria-expanded

        const link = child.querySelector('a');
        const linkClone = link.cloneNode(true);
        linkClone.setAttribute('itemprop', 'url');
        currentLi.append(linkClone);

        const chevronSpan = document.createElement('span');
        chevronSpan.append(createSVG(CHEVRON_PATH_DATA));
        currentLi.append(chevronSpan);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const wrapContainer = document.createElement('div');
        wrapContainer.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);
        wrapContainer.append(centerDiv);
        megaMenu.append(wrapContainer);
        currentLi.append(megaMenu);

        currentLi.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleAllNavSections(navUl.closest('.main-nav'), false);
            toggleMegaMenu(currentLi, true);
          }
        });
        currentLi.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            toggleMegaMenu(currentLi, false);
          }
        });

        chevronSpan.addEventListener('click', (event) => {
          if (!isDesktop.matches) {
            event.stopPropagation();
            toggleMegaMenu(currentLi);
            chevronSpan.querySelector('svg').classList.toggle('rotated', currentLi.classList.contains('active'));
          }
        });

      } else if (isUl && currentLi) {
        const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          const clonedUl = child.cloneNode(true);
          decorateNestedUl(clonedUl);
          subNavWrap.append(clonedUl);
        }
      } else if (isLeftDivContent && currentLi) {
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    });
  });

  if (currentLi) {
    if (leftDivContentBuffer.length > 0) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      const titleText = currentLi.querySelector('a')?.textContent || 'Menu';
      leftDiv.classList.add(`${titleText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-left-div`);
      leftDivContentBuffer.forEach(item => leftDiv.append(item));
      currentLi.querySelector('.center-div').prepend(leftDiv);
    }
    navUl.append(currentLi);
  }

  return navUl;
}

function setupTools(toolsSections) {
  if (!toolsSections.length) return null;

  const toolsContainer = document.createElement('div');
  toolsContainer.classList.add('icon-nav');

  const desktopToolsUl = document.createElement('ul');
  desktopToolsUl.classList.add('desktop-menus-icon');
  const mobileToolsUl = document.createElement('ul');
  mobileToolsUl.classList.add('mobile-menus-icon');

  toolsSections.forEach((section) => {
    Array.from(section.children).forEach((child) => {
      if (child.tagName === 'UL') {
        Array.from(child.children).forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const desktopLi = document.createElement('li');
            const mobileLi = document.createElement('li');
            const desktopLink = link.cloneNode(true);
            const mobileLink = link.cloneNode(true);

            if (link.href.includes('contact-us')) {
              desktopLi.classList.add('mail');
              mobileLi.classList.add('mail');
              desktopLink.innerHTML = '';
              desktopLink.append(createMailSVG());
              mobileLink.innerHTML = 'Contact Us';
            } else if (link.textContent.toLowerCase() === 'search') {
              desktopLi.classList.add('search');
              mobileLi.classList.add('search');
              desktopLink.innerHTML = '';
              desktopLink.append(createSearchSVG());
              desktopLink.append(createCloseSVG());
              mobileLink.innerHTML = '';
              mobileLink.append(createSearchSVG());
              mobileLink.append(createCloseSVG());
              const searchSpan = document.createElement('span');
              searchSpan.textContent = ' Search';
              mobileLink.append(searchSpan);

              const searchScreenWrap = document.createElement('div');
              searchScreenWrap.classList.add('search-screen-wrap');
              const searchWrapInner = document.createElement('div');
              searchWrapInner.classList.add('wrap');
              searchScreenWrap.append(searchWrapInner);

              const searchForm = document.createElement('form');
              searchForm.setAttribute('action', 'https://www.mahindra.com/search');
              searchForm.setAttribute('method', 'get');
              searchForm.setAttribute('id', 'search-block-form');
              searchForm.setAttribute('accept-charset', 'UTF-8');
              const searchInputWrap = document.createElement('div');
              searchInputWrap.classList.add('search-wrap');
              const searchIconDiv = document.createElement('div');
              searchIconDiv.classList.add('search-icon');
              searchIconDiv.append(createSearchSVG());
              searchInputWrap.append(searchIconDiv);
              const searchInput = document.createElement('input');
              searchInput.setAttribute('type', 'text');
              searchInput.classList.add('input-text', 'searchtext');
              searchInput.setAttribute('required', '');
              searchInput.setAttribute('name', 'key');
              searchInput.setAttribute('id', 'searchInput');
              searchInput.setAttribute('autocomplete', 'off');
              searchInputWrap.append(searchInput);
              const submitButton = document.createElement('button');
              submitButton.classList.add('submit-button');
              const submitLabel = document.createElement('div');
              submitLabel.classList.add('label');
              submitLabel.textContent = 'Submit';
              submitButton.append(submitLabel);
              const submitSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              submitSVG.setAttribute('width', '12');
              submitSVG.setAttribute('height', '8');
              submitSVG.setAttribute('viewBox', '0 0 12 8');
              submitSVG.setAttribute('fill', 'none');
              const submitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              submitPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
              submitPath.setAttribute('fill', 'black');
              submitSVG.append(submitPath);
              submitButton.append(submitSVG);
              searchInputWrap.append(submitButton);
              searchForm.append(searchInputWrap);

              const searchResultBox = document.createElement('div');
              searchResultBox.classList.add('searchResultBox');
              searchResultBox.style.display = 'none';
              searchResultBox.innerHTML = '<div class="swiper scrollSwiper"><div class="swiper-wrapper"><div class="swiper-slide"></div></div></div><div class="swiper-scrollbar"></div>';
              searchForm.append(searchResultBox);

              // Extract popular and recommended keywords dynamically from the fragment
              const popularKeywordsSection = section.querySelector('.search-suggestions-wrap:has(.label:first-child)');
              if (popularKeywordsSection) {
                const popularKeywords = popularKeywordsSection.cloneNode(true);
                searchForm.append(popularKeywords);
              }

              const recommendedKeywordsSection = section.querySelector('.search-suggestions-wrap:has(.label:nth-child(2))');
              if (recommendedKeywordsSection) {
                const recommendedKeywords = recommendedKeywordsSection.cloneNode(true);
                searchForm.append(recommendedKeywords);
              }

              searchWrapInner.append(searchForm);
              desktopLi.append(searchScreenWrap);
              mobileLi.append(searchScreenWrap.cloneNode(true));

              const toggleSearch = (event) => {
                event.preventDefault();
                event.stopPropagation();
                const targetLi = event.currentTarget.closest('li.search');
                const screenWrap = targetLi.querySelector('.search-screen-wrap');
                const isSearchOpen = screenWrap.style.display === 'block';

                if (isSearchOpen) {
                  screenWrap.style.display = 'none';
                  targetLi.querySelector('.lens').style.display = 'block';
                  targetLi.querySelector('.close').style.display = 'none';
                } else {
                  screenWrap.style.display = 'block';
                  targetLi.querySelector('.lens').style.display = 'none';
                  targetLi.querySelector('.close').style.display = 'block';
                  const input = screenWrap.querySelector('.input-text');
                  if (input) input.focus();
                }
              };

              desktopLink.addEventListener('click', toggleSearch);
              mobileLink.addEventListener('click', toggleSearch);

            } else {
              desktopLink.textContent = link.textContent;
              mobileLink.textContent = link.textContent;
            }
            desktopLi.append(desktopLink);
            mobileLi.append(mobileLink);
            desktopToolsUl.append(desktopLi);
            mobileToolsUl.append(mobileLi);
          }
        });
      }
    });
  });

  toolsContainer.append(desktopToolsUl, mobileToolsUl);
  return toolsContainer;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.textContent = 'Navigation fragment not found.';
    return;
  }

  block.textContent = '';
  block.classList.add('main-header');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');
  headerContainer.append(headerWrap);
  block.append(headerContainer);

  const { brandSections, navSections, toolsSections } = parseStructure(fragment);

  const brandElements = setupBrand(brandSections);
  if (brandElements) {
    brandElements.forEach(el => headerWrap.append(el));
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  headerWrap.append(hamburger);

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  mainNav.id = 'nav'; // Assign ID here

  const desktopNavUl = setupDesktopNav(navSections);
  if (desktopNavUl) {
    mainNav.append(desktopNavUl);
  }

  const toolsElements = setupTools(toolsSections);
  if (toolsElements) {
    mainNav.append(toolsElements);
  }

  headerWrap.append(mainNav);

  const navElement = document.getElementById('nav');
  if (navElement) {
    hamburger.addEventListener('click', () => toggleMenu(navElement));
    navElement.setAttribute('aria-expanded', 'false');
    toggleMenu(navElement, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(navElement, isDesktop.matches));
  }
}
