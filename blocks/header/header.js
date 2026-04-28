import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

// Utility function to move instrumentation attributes
function moveInstrumentation(sourceEl, targetEl) {
  if (!sourceEl || !targetEl) return;
  Array.from(sourceEl.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-cq-')) {
      targetEl.setAttribute(attr.name, attr.value);
    }
  });
}

function createSVGElement(svgContent, attributes = {}) {
  const span = document.createElement('span');
  span.innerHTML = `<svg>${svgContent}</svg>`;
  const svg = span.querySelector('svg');
  if (svg) {
    Object.entries(attributes).forEach(([key, value]) => {
      svg.setAttribute(key, value);
    });
    // Add default SVGRepo groups if not already present and content is simple path
    if (!svg.querySelector('#SVGRepo_bgCarrier') && !svg.querySelector('#SVGRepo_tracerCarrier') && svgContent.includes('<path')) {
      const g1 = document.createElement('g');
      g1.setAttribute('id', 'SVGRepo_bgCarrier');
      g1.setAttribute('stroke-width', '0');
      svg.prepend(g1);
      const g2 = document.createElement('g');
      g2.setAttribute('id', 'SVGRepo_tracerCarrier');
      g2.setAttribute('stroke-linecap', 'round');
      g2.setAttribute('stroke-linejoin', 'round');
      g2.setAttribute('stroke', '#CCCCCC');
      g2.setAttribute('stroke-width', '0.30321600000000004');
      svg.prepend(g2);
    }
  }
  return svg;
}

const CHEVRON_SVG_CONTENT = `
  <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
    <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
  </g>
`;

const SEARCH_LENS_SVG_CONTENT = `
  <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
`;

const SEARCH_CLOSE_SVG_CONTENT = `
  <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
`;

const MAIL_SVG_CONTENT = `
  <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
            C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
            L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
`;

const SUBMIT_ARROW_SVG_CONTENT = `
  <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
`;

function getImmediateText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
    .map((node) => node.textContent.trim())
    .join('');
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Rule 2.1: Content Density Discovery
  // Brand Row: The FIRST section containing a <picture> or branding <img>.
  brandRow = sections.find((section) => section.querySelector('picture, img'));
  if (brandRow) moveInstrumentation(sections.splice(sections.indexOf(brandRow), 1)[0], brandRow);

  // Nav Row: The section with the HIGHEST density of <ul> elements.
  let maxUlCount = -1;
  sections.forEach((section) => {
    const ulCount = section.querySelectorAll('ul').length;
    if (ulCount > maxUlCount) {
      maxUlCount = ulCount;
      navRow = section;
    }
  });
  if (navRow) moveInstrumentation(sections.splice(sections.indexOf(navRow), 1)[0], navRow);

  // Tools Row: The remaining section(s) containing social links or utility links.
  toolsRow = sections.find((section) => {
    const links = Array.from(section.querySelectorAll('a'));
    return links.some((link) => /(facebook|twitter|linkedin|instagram|youtube|contact-us|search)/i.test(link.href || link.textContent));
  });
  if (toolsRow) moveInstrumentation(sections.splice(sections.indexOf(toolsRow), 1)[0], toolsRow);

  return { brandRow, navRow, toolsRow };
}

function setupBrand(brandRow, block) {
  if (!brandRow) return;

  const brandDiv = document.createElement('div');
  brandDiv.classList.add('logo');
  moveInstrumentation(brandRow, brandDiv);

  const brandLink = brandRow.querySelector('a');
  if (brandLink) {
    const img = brandLink.querySelector('img');
    const picture = brandLink.querySelector('picture');

    if (img && img.src) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || 'Brand Logo';
      newImg.title = img.title || 'Brand Logo';
      newImg.classList.add('hiddenlogo1');
      newImg.width = img.width || '200';
      newImg.height = img.height || '30';
      newImg.loading = 'lazy';
      newImg.style.width = 'auto';
      brandLink.textContent = '';
      brandLink.append(newImg);
    } else if (picture) {
      const source = picture.querySelector('source[srcset]');
      if (source) {
        const newImg = document.createElement('img');
        newImg.src = source.srcset.split(',')[0].split(' ')[0];
        newImg.alt = img?.alt || 'Brand Logo';
        newImg.title = img?.title || 'Brand Logo';
        newImg.classList.add('hiddenlogo1');
        newImg.width = img?.width || '200';
        newImg.height = img?.height || '30';
        newImg.loading = 'lazy';
        newImg.style.width = 'auto';
        brandLink.textContent = '';
        brandLink.append(newImg);
      }
    }
    brandDiv.append(brandLink);
    moveInstrumentation(brandRow.firstElementChild, brandDiv.firstElementChild);
  }
  block.append(brandDiv);
}

function createHamburger(nav) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  moveInstrumentation(nav, hamburger);

  const ul = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ul.append(document.createElement('li'));
  }
  hamburger.append(ul);

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    const mainNav = nav.querySelector('.main-nav');
    if (mainNav) {
      if (expanded) {
        mainNav.style.transform = 'translate(-100%,0)';
        mainNav.style.opacity = '0';
      } else {
        mainNav.style.transform = 'translate(0,0)';
        mainNav.style.opacity = '1';
      }
    }
    document.body.style.overflowY = expanded ? '' : 'hidden';
  });

  return hamburger;
}

function setupDesktopNav(navRow, navElement) {
  if (!navRow || !navElement) return;

  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  moveInstrumentation(navRow, mainNavUl);

  let currentLeftDivBuffer = [];

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) return;

    if (child.tagName === 'P' && child.querySelector('a')) {
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      moveInstrumentation(child, li);

      const link = child.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = link.textContent;
        newLink.setAttribute('itemprop', 'url');
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }

      const chevronSpan = document.createElement('span');
      const chevronSvg = createSVGElement(CHEVRON_SVG_CONTENT, {
        viewBox: '-23.5 -23.5 122.80 122.80',
        fill: '#000000',
        stroke: '#000000',
        'stroke-width': '4.851456000000001',
      });
      if (chevronSvg) chevronSpan.append(chevronSvg);
      li.append(chevronSpan);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);

      if (currentLeftDivBuffer.length > 0) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');

        const titleText = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        if (titleText) {
          leftDiv.classList.add(`${titleText}-left-div`);
        }

        currentLeftDivBuffer.forEach((bufferedItem) => {
          if (bufferedItem.tagName === 'H4' && bufferedItem.querySelector('a')) {
            const h4 = document.createElement('h4');
            h4.classList.add('left-div-heading');
            const h4Link = document.createElement('a');
            h4Link.href = bufferedItem.querySelector('a').href;
            h4Link.textContent = bufferedItem.querySelector('a').textContent;
            h4.append(h4Link);
            leftDiv.append(h4);
          } else if (bufferedItem.tagName === 'P') {
            const p = document.createElement('p');
            p.classList.add(bufferedItem.classList.contains('left-div-subdesc') ? 'left-div-subdesc' : 'left-div-desc');
            p.textContent = bufferedItem.textContent;
            leftDiv.append(p);
          } else if (bufferedItem.tagName === 'UL') {
            const ul = document.createElement('ul');
            Array.from(bufferedItem.children).forEach((liItem) => {
              const liEl = document.createElement('li');
              liEl.classList.add('list-text-red');
              liEl.innerHTML = liItem.innerHTML; // Preserve span and text
              ul.append(liEl);
            });
            leftDiv.append(ul);
          } else if (bufferedItem.classList.contains('latest-two-press-release')) {
            const pressReleaseDiv = document.createElement('div');
            pressReleaseDiv.classList.add('latest-two-press-release');
            pressReleaseDiv.innerHTML = bufferedItem.innerHTML; // Copy content as is
            leftDiv.append(pressReleaseDiv);
          }
        });
        centerDiv.append(leftDiv);
        currentLeftDivBuffer = [];
      }

      mainNavUl.append(li);
    } else if (child.tagName === 'UL') {
      const lastLi = mainNavUl.lastElementChild;
      if (lastLi) {
        const megaMenu = lastLi.querySelector('.mega-menu');
        const centerDiv = megaMenu?.querySelector('.center-div');

        if (megaMenu && centerDiv) {
          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          moveInstrumentation(child, subNavWrap);

          if (child.classList.contains('sub-nav-wrap-one-link')) {
            subNavWrap.classList.add('sub-nav-wrap-one-link');
          } else if (child.classList.contains('element-block')) {
            subNavWrap.classList.add('element-block');
          } else if (child.classList.contains('what-we-do')) {
            subNavWrap.classList.add('what-we-do');
          } else if (child.classList.contains('careers-div')) {
            subNavWrap.classList.add('careers-div');
          } else if (child.classList.contains('about-us-sub-nav')) {
            subNavWrap.classList.add('about-us-sub-nav');
          }

          const processNestedUl = (ulElement, parentContainer) => {
            const currentUl = document.createElement('ul');
            if (ulElement.classList.contains('inner-sub-nav-wrap-list')) {
              currentUl.classList.add('inner-sub-nav-wrap-list');
            }
            Array.from(ulElement.children).forEach((liElement) => {
              if (liElement.nodeType === Node.COMMENT_NODE) return;

              const newLi = document.createElement('li');
              moveInstrumentation(liElement, newLi);

              const anchor = liElement.querySelector('a');
              if (anchor) {
                const newAnchor = document.createElement('a');
                newAnchor.href = anchor.href;
                newAnchor.textContent = anchor.textContent;
                if (anchor.target) newAnchor.target = anchor.target;
                newLi.append(newAnchor);
                moveInstrumentation(anchor, newAnchor);
              } else {
                const text = getImmediateText(liElement);
                if (text) {
                  newLi.textContent = text;
                }
              }

              const nestedUl = liElement.querySelector(':scope > ul');
              if (nestedUl) {
                newLi.classList.add('top-level-li');

                const nestedSpan = document.createElement('span');
                const nestedChevronSvg = createSVGElement(CHEVRON_SVG_CONTENT, {
                  viewBox: '-23.5 -23.5 122.80 122.80',
                  fill: '#000000',
                  stroke: '#000000',
                  'stroke-width': '4.851456000000001',
                });
                if (nestedChevronSvg) nestedSpan.append(nestedChevronSvg);
                newLi.append(nestedSpan);

                const hasSubChildDiv = document.createElement('div');
                hasSubChildDiv.classList.add('has-sub-child');
                if (liElement.querySelector(':scope > .has-sub-child.active')) {
                  hasSubChildDiv.classList.add('active');
                }
                newLi.append(hasSubChildDiv);

                const innerUl = document.createElement('ul');
                Array.from(nestedUl.children).forEach((nestedLiElement) => {
                  if (nestedLiElement.nodeType === Node.COMMENT_NODE) return;

                  const newNestedLi = document.createElement('li');
                  moveInstrumentation(nestedLiElement, newNestedLi);

                  const innerAnchor = nestedLiElement.querySelector('a');
                  if (innerAnchor) {
                    const newInnerAnchor = document.createElement('a');
                    newInnerAnchor.href = innerAnchor.href;
                    newInnerAnchor.textContent = innerAnchor.textContent;
                    if (innerAnchor.target) newInnerAnchor.target = innerAnchor.target;
                    newNestedLi.append(newInnerAnchor);
                    moveInstrumentation(innerAnchor, newInnerAnchor);
                  } else {
                    const innerText = getImmediateText(nestedLiElement);
                    if (innerText) {
                      newNestedLi.textContent = innerText;
                    }
                  }

                  const innerNestedUl = nestedLiElement.querySelector(':scope > ul');
                  if (innerNestedUl) {
                    newNestedLi.classList.add('first-level-li');
                    const innerNestedSpan = document.createElement('span');
                    const innerNestedChevronSvg = createSVGElement(CHEVRON_SVG_CONTENT, {
                      viewBox: '-23.5 -23.5 122.80 122.80',
                      fill: '#000000',
                      stroke: '#000000',
                      'stroke-width': '4.851456000000001',
                    });
                    if (innerNestedChevronSvg) innerNestedSpan.append(innerNestedChevronSvg);
                    newNestedLi.append(innerNestedSpan);

                    const hasInnerSubChildDiv = document.createElement('div');
                    hasInnerSubChildDiv.classList.add('has-inner-sub-child');
                    if (nestedLiElement.querySelector(':scope > .has-inner-sub-child.active-child')) {
                      hasInnerSubChildDiv.classList.add('active-child');
                    }
                    newNestedLi.append(hasInnerSubChildDiv);

                    const innermostUl = document.createElement('ul');
                    Array.from(innerNestedUl.children).forEach((innermostLiElement) => {
                      if (innermostLiElement.nodeType === Node.COMMENT_NODE) return;

                      const newInnermostLi = document.createElement('li');
                      moveInstrumentation(innermostLiElement, newInnermostLi);

                      const innermostAnchor = innermostLiElement.querySelector('a');
                      if (innermostAnchor) {
                        const newInnermostAnchor = document.createElement('a');
                        newInnermostAnchor.href = innermostAnchor.href;
                        newInnermostAnchor.textContent = innermostAnchor.textContent;
                        if (innermostAnchor.target) newInnermostAnchor.target = innermostAnchor.target;
                        newInnermostLi.append(newInnermostAnchor);
                        moveInstrumentation(innermostAnchor, newInnermostAnchor);
                      } else {
                        const innermostText = getImmediateText(innermostLiElement);
                        if (innermostText) {
                          newInnermostLi.textContent = innermostText;
                        }
                      }
                      innermostUl.append(newInnermostLi);
                    });
                    hasInnerSubChildDiv.append(innermostUl);
                  }
                  innerUl.append(newNestedLi);
                });
                hasSubChildDiv.append(innerUl);
              }
              currentUl.append(newLi);
            });
            parentContainer.append(currentUl);
          };

          processNestedUl(child, subNavWrap);
          centerDiv.append(subNavWrap);
        }
      }
    } else {
      currentLeftDivBuffer.push(child);
    }
  });

  navElement.append(mainNavUl);
}

function setupTools(toolsRow, navElement) {
  if (!toolsRow || !navElement) return;

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  moveInstrumentation(toolsRow, iconNavDesktop);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  moveInstrumentation(toolsRow, iconNavMobile);

  const ulDesktop = document.createElement('ul');
  const ulMobile = document.createElement('ul');

  Array.from(toolsRow.children).forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) return;

    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        if (li.nodeType === Node.COMMENT_NODE) return;

        const link = li.querySelector('a');
        if (link) {
          const newLiDesktop = document.createElement('li');
          const newLiMobile = document.createElement('li');
          moveInstrumentation(li, newLiDesktop);
          moveInstrumentation(li, newLiMobile);

          const newLinkDesktop = document.createElement('a');
          newLinkDesktop.href = link.href;
          moveInstrumentation(link, newLinkDesktop);

          const newLinkMobile = document.createElement('a');
          newLinkMobile.href = link.href;
          moveInstrumentation(link, newLinkMobile);

          if (link.href.includes('contact-us')) {
            newLiDesktop.classList.add('mail');
            const mailSvg = createSVGElement(MAIL_SVG_CONTENT, {
              version: '1.1',
              id: 'Layer_1',
              x: '0px',
              y: '0px',
              viewBox: '0 0 48 38.4',
              style: 'enable-background:new 0 0 48 38.4;',
              'xml:space': 'preserve',
              width: '21',
              height: '21',
            });
            if (mailSvg) newLinkDesktop.append(mailSvg);
            newLiDesktop.append(newLinkDesktop);

            newLiMobile.classList.add('mail');
            newLinkMobile.textContent = 'Contact Us';
            newLiMobile.append(newLinkMobile);
          } else if (link.textContent.toLowerCase() === 'search') {
            newLiDesktop.classList.add('search');
            newLinkDesktop.href = '#';

            const lensSvgDesktop = createSVGElement(SEARCH_LENS_SVG_CONTENT, {
              viewBox: '0 0 21 21',
              fill: 'none',
            });
            if (lensSvgDesktop) lensSvgDesktop.classList.add('lens');
            newLinkDesktop.append(lensSvgDesktop);

            const closeSvgDesktop = createSVGElement(SEARCH_CLOSE_SVG_CONTENT, {
              viewBox: '0 0 50 50',
            });
            if (closeSvgDesktop) closeSvgDesktop.classList.add('close');
            newLinkDesktop.append(closeSvgDesktop);
            newLiDesktop.append(newLinkDesktop);

            const searchScreenWrapDesktop = createSearchScreenWrap();
            newLiDesktop.append(searchScreenWrapDesktop);

            newLiMobile.classList.add('search');
            newLinkMobile.href = '#';

            const lensSvgMobile = createSVGElement(SEARCH_LENS_SVG_CONTENT, {
              viewBox: '0 0 21 21',
              fill: 'none',
            });
            if (lensSvgMobile) lensSvgMobile.classList.add('lens');
            newLinkMobile.append(lensSvgMobile);

            const closeSvgMobile = createSVGElement(SEARCH_CLOSE_SVG_CONTENT, {
              viewBox: '0 0 50 50',
            });
            if (closeSvgMobile) closeSvgMobile.classList.add('close');
            newLinkMobile.append(closeSvgMobile);

            const searchSpanMobile = document.createElement('span');
            searchSpanMobile.textContent = ' Search';
            newLinkMobile.append(searchSpanMobile);
            newLiMobile.append(newLinkMobile);

            const searchScreenWrapMobile = createSearchScreenWrap();
            newLiMobile.append(searchScreenWrapMobile);

            const toggleSearch = (liElement) => {
              const screenWrap = liElement.querySelector('.search-screen-wrap');
              if (!screenWrap) return;
              const isExpanded = screenWrap.classList.contains('active');
              if (isExpanded) {
                screenWrap.classList.remove('active');
                screenWrap.style.opacity = '0';
                screenWrap.style.pointerEvents = 'none';
                liElement.querySelector('.lens')?.style.setProperty('display', 'block');
                liElement.querySelector('.close')?.style.setProperty('display', 'none');
              } else {
                screenWrap.classList.add('active');
                screenWrap.style.opacity = '1';
                screenWrap.style.pointerEvents = 'all';
                liElement.querySelector('.lens')?.style.setProperty('display', 'none');
                liElement.querySelector('.close')?.style.setProperty('display', 'block');
              }
            };

            newLinkDesktop.addEventListener('click', (e) => {
              e.preventDefault();
              toggleSearch(newLiDesktop);
            });
            newLinkMobile.addEventListener('click', (e) => {
              e.preventDefault();
              toggleSearch(newLiMobile);
            });
          } else {
            // Social links are not explicitly rendered in the header based on the original HTML
            // If they were to be included, they would likely go into the mobile-menus-icon
            // For now, we skip them as per the original header structure.
            return;
          }
          ulDesktop.append(newLiDesktop);
          ulMobile.append(newLiMobile);
        }
      });
    }
  });

  iconNavDesktop.append(ulDesktop);
  iconNavMobile.append(ulMobile);
  navElement.append(iconNavDesktop);
  navElement.append(iconNavMobile);
}

function createSearchScreenWrap() {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const form = document.createElement('form');
  form.setAttribute('action', 'https://www.mahindra.com/search');
  form.setAttribute('method', 'get');
  form.setAttribute('id', 'search-block-form');
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  wrapDiv.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  form.append(searchWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  const searchLensSvg = createSVGElement(SEARCH_LENS_SVG_CONTENT, {
    viewBox: '0 0 21 21',
    fill: 'none',
  });
  if (searchLensSvg) searchIcon.append(searchLensSvg);
  searchWrap.append(searchIcon);

  const inputText = document.createElement('input');
  inputText.setAttribute('type', 'text');
  inputText.classList.add('input-text', 'searchtext');
  inputText.setAttribute('required', '');
  inputText.setAttribute('name', 'key');
  inputText.setAttribute('id', 'searchInput');
  inputText.setAttribute('autocomplete', 'off');
  searchWrap.append(inputText);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('type', 'submit');
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.textContent = 'Submit';
  submitButton.append(labelDiv);
  const arrowSvg = createSVGElement(SUBMIT_ARROW_SVG_CONTENT, {
    width: '12',
    height: '8',
    viewBox: '0 0 12 8',
    fill: 'none',
  });
  if (arrowSvg) submitButton.append(arrowSvg);
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';

  const swiperDiv = document.createElement('div');
  swiperDiv.classList.add('swiper', 'scrollSwiper');
  const swiperWrapperDiv = document.createElement('div');
  swiperWrapperDiv.classList.add('swiper-wrapper');
  const swiperSlideDiv = document.createElement('div');
  swiperSlideDiv.classList.add('swiper-slide');
  swiperWrapperDiv.append(swiperSlideDiv);
  swiperDiv.append(swiperWrapperDiv);
  searchResultBox.append(swiperDiv);

  const swiperScrollbarDiv = document.createElement('div');
  swiperScrollbarDiv.classList.add('swiper-scrollbar');
  searchResultBox.append(swiperScrollbarDiv);

  form.append(searchResultBox);

  const popularKeywordsWrap = document.createElement('div');
  popularKeywordsWrap.classList.add('search-suggestions-wrap');
  const popularLabel = document.createElement('div');
  popularLabel.classList.add('label');
  popularLabel.textContent = 'Popular Keywords:';
  popularKeywordsWrap.append(popularLabel);
  const popularTokensWrap = document.createElement('div');
  popularTokensWrap.classList.add('tokens-wrap');
  const popularUl = document.createElement('ul');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
    const li = document.createElement('li');
    li.textContent = keyword;
    popularUl.append(li);
  });
  popularTokensWrap.append(popularUl);
  popularKeywordsWrap.append(popularTokensWrap);
  wrapDiv.append(popularKeywordsWrap);

  const recommendedWrap = document.createElement('div');
  recommendedWrap.classList.add('search-suggestions-wrap');
  const recommendedLabel = document.createElement('div');
  recommendedLabel.classList.add('label');
  recommendedLabel.textContent = 'Recommended for you:';
  recommendedWrap.append(recommendedLabel);
  const recommendedTokensWrap = document.createElement('div');
  recommendedTokensWrap.classList.add('tokens-wrap');
  const recommendedUl = document.createElement('ul');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((keyword) => {
    const li = document.createElement('li');
    li.textContent = keyword;
    recommendedUl.append(li);
  });
  recommendedTokensWrap.append(recommendedUl);
  recommendedWrap.append(recommendedTokensWrap);
  wrapDiv.append(recommendedWrap);

  return searchScreenWrap;
}

function initNavToggle(navElement) {
  if (!navElement) return;

  if (isDesktop.matches) {
    navElement.querySelectorAll('.main-nav > ul > li.has-child').forEach((li) => {
      li.addEventListener('mouseenter', () => {
        li.classList.add('active');
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.opacity = '1';
          megaMenu.style.pointerEvents = 'all';
          megaMenu.style.transform = 'translate(0,0)';
        }
      });
      li.addEventListener('mouseleave', () => {
        li.classList.remove('active');
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          megaMenu.style.opacity = '0';
          megaMenu.style.pointerEvents = 'none';
          megaMenu.style.transform = 'translate(0,0)';
        }
      });
    });
  }

  navElement.querySelectorAll('.main-nav ul li.has-child > span, .main-nav ul li.top-level-li > span, .main-nav ul li.first-level-li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = span.closest('li');
      if (!parentLi) return;

      const targetMenu = parentLi.querySelector(':scope > .mega-menu, :scope > .has-sub-child, :scope > .has-inner-sub-child');
      if (targetMenu) {
        const isActive = targetMenu.classList.contains('active') || targetMenu.classList.contains('active-child');
        if (isActive) {
          targetMenu.classList.remove('active', 'active-child');
          span.querySelector('svg')?.style.setProperty('transform', 'rotate(90deg)');
        } else {
          Array.from(parentLi.parentNode.children).forEach((sibling) => {
            if (sibling !== parentLi) {
              const siblingMenu = sibling.querySelector(':scope > .mega-menu, :scope > .has-sub-child, :scope > .has-inner-sub-child');
              if (siblingMenu) {
                siblingMenu.classList.remove('active', 'active-child');
                sibling.querySelector('span svg')?.style.setProperty('transform', 'rotate(90deg)');
              }
            }
          });
          targetMenu.classList.add(targetMenu.classList.contains('has-inner-sub-child') ? 'active-child' : 'active');
          span.querySelector('svg')?.style.setProperty('transform', 'rotate(-180deg)');
        }
      }
    });
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.textContent = 'Navigation fragment not found.';
    return;
  }

  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('container');
  block.append(navWrapper);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  navWrapper.append(wrapDiv);

  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.id = 'nav';
  navElement.setAttribute('aria-expanded', 'false');
  wrapDiv.append(navElement);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  setupBrand(brandRow, wrapDiv);

  const hamburger = createHamburger(navElement);
  wrapDiv.insertBefore(hamburger, navElement);

  setupDesktopNav(navRow, navElement);

  setupTools(toolsRow, navElement);

  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.width = '74';
  year80Img.height = '60';
  year80Img.loading = 'lazy';
  year80Link.append(year80Img);
  year80LogoDiv.append(year80Link);
  wrapDiv.append(year80LogoDiv);

  initNavToggle(navElement);

  isDesktop.addEventListener('change', () => {
    const mainNav = navElement.querySelector('.main-nav');
    if (!mainNav) return;
    if (isDesktop.matches) {
      navElement.setAttribute('aria-expanded', 'false');
      mainNav.style.transform = '';
      mainNav.style.opacity = '';
      document.body.style.overflowY = '';
    } else {
      navElement.setAttribute('aria-expanded', 'false');
      mainNav.style.transform = 'translate(-100%,0)';
      mainNav.style.opacity = '0';
      document.body.style.overflowY = '';
    }
    navElement.querySelectorAll('.mega-menu, .has-sub-child, .has-inner-sub-child').forEach((menu) => {
      menu.classList.remove('active', 'active-child');
      menu.style.opacity = '';
      menu.style.pointerEvents = '';
      menu.style.transform = '';
    });
    navElement.querySelectorAll('li span svg').forEach((svg) => {
      svg.style.setProperty('transform', 'rotate(90deg)');
    });
  });

  // Escape key listener for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile nav if open
      if (navElement.getAttribute('aria-expanded') === 'true') {
        navElement.setAttribute('aria-expanded', 'false');
        const mainNav = navElement.querySelector('.main-nav');
        if (mainNav) {
          mainNav.style.transform = 'translate(-100%,0)';
          mainNav.style.opacity = '0';
        }
        document.body.style.overflowY = '';
      }

      // Close search overlay if open
      document.querySelectorAll('.search-screen-wrap.active').forEach((screenWrap) => {
        screenWrap.classList.remove('active');
        screenWrap.style.opacity = '0';
        screenWrap.style.pointerEvents = 'none';
        const parentLi = screenWrap.closest('li.search');
        if (parentLi) {
          parentLi.querySelector('.lens')?.style.setProperty('display', 'block');
          parentLi.querySelector('.close')?.style.setProperty('display', 'none');
        }
      });
    }
  });
}
