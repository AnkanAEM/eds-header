import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

// Helper to safely get the content wrapper or the element itself
function getWrapper(element) {
  if (!element) return null;
  const wrapper = element.querySelector('.default-content-wrapper');
  return wrapper || element;
}

// Helper to remove all child nodes that are comments or text nodes
function removeCommentAndTextNodes(element) {
  if (!element) return;
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.COMMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')) {
      node.remove();
    }
  });
}

// Recursively builds nested UL/LI structure
function buildNestedMenu(ulElement) {
  const newUl = document.createElement('ul');
  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName === 'LI') {
      const newLi = li.cloneNode(true); // Clone the entire LI
      removeCommentAndTextNodes(newLi); // Clean up cloned LI

      const nestedUl = newLi.querySelector('ul');
      if (nestedUl) {
        newLi.classList.add('top-level-li');
        const span = document.createElement('span');
        span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        newLi.append(span);

        const subMenuWrapper = document.createElement('div');
        subMenuWrapper.classList.add('has-sub-child');
        // Replace the original nested UL with the new, processed one
        nestedUl.replaceWith(buildNestedMenu(nestedUl));
        subMenuWrapper.append(newLi.querySelector('ul')); // Append the processed UL
        newLi.append(subMenuWrapper);

        span.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          subMenuWrapper.classList.toggle('active');
          span.querySelector('svg').style.transform = subMenuWrapper.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
        });
      }
      newUl.append(newLi);
    }
  });
  return newUl;
}

function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === Node.ELEMENT_NODE);

  const brandRow = getWrapper(children[0]);
  const navRow = getWrapper(children[1]);
  const toolsRow = getWrapper(children[2]);

  return { brandRow, navRow, toolsRow };
}

function setupBrand(brandRow, header) {
  if (!brandRow) return;

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const brandLink = brandRow.querySelector('a');
  if (brandLink) {
    const newBrandLink = document.createElement('a');
    newBrandLink.href = brandLink.href;
    const brandImg = brandLink.querySelector('img');
    if (brandImg) {
      const newBrandImg = brandImg.cloneNode(true);
      newBrandImg.classList.add('hiddenlogo1');
      newBrandLink.append(newBrandImg);
    }
    logoDiv.append(newBrandLink);
  }
  header.querySelector('.wrap').prepend(logoDiv);

  // Add the 80th year logo if it exists in the fragment
  const year80Logo = brandRow.querySelector('img[alt*="80th Year Logo"]');
  if (year80Logo) {
    const year80LogoDiv = document.createElement('div');
    year80LogoDiv.classList.add('logo', 'year-80-logo');
    const year80Link = document.createElement('a');
    year80Link.href = '/'; // Assuming it links to home, or derive from fragment if available
    const newYear80Img = year80Logo.cloneNode(true);
    newYear80Img.classList.add('hiddenlogo1', 'years-80');
    year80Link.append(newYear80Img);
    year80LogoDiv.append(year80Link);
    header.querySelector('.wrap').append(year80LogoDiv);
  }
}

function setupDesktopNav(navRow, mainNav) {
  if (!navRow || !mainNav) return;

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let buffer = [];
  Array.from(navRow.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger
      const navItem = document.createElement('li');
      navItem.classList.add('has-child', 'hover-red');
      navItem.setAttribute('itemprop', 'name');

      const link = child.querySelector('a');
      const navLink = document.createElement('a');
      navLink.href = link.href;
      navLink.textContent = link.textContent;
      navLink.setAttribute('itemprop', 'url');
      navItem.append(navLink);

      const span = document.createElement('span');
      span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
      navItem.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);

      // Flush buffer into left-div
      if (buffer.length > 0) {
        const leftDiv = document.createElement('div');
        const title = link.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add('left-div', `${title}-left-div`);
        buffer.forEach((bufferedNode) => {
          // If it's a heading, wrap it in h4 and an anchor
          if (bufferedNode.tagName === 'H4') {
            const h4 = document.createElement('h4');
            h4.classList.add('left-div-heading');
            const h4Link = document.createElement('a');
            h4Link.href = link.href; // Link heading to main nav item
            h4Link.textContent = bufferedNode.textContent;
            h4.append(h4Link);
            leftDiv.append(h4);
          } else if (bufferedNode.tagName === 'UL') {
            // Special handling for lists in left-div
            Array.from(bufferedNode.children).forEach(li => {
              if (li.tagName === 'LI') {
                const newLi = li.cloneNode(true);
                newLi.classList.add('list-text-red');
                const spanEl = document.createElement('span');
                // Extract text after the number, e.g., "Industries" from "20+ Industries"
                const textContent = newLi.textContent.replace(/^[0-9+]+/, '').trim();
                spanEl.textContent = textContent;
                newLi.textContent = newLi.textContent.replace(textContent, '').trim(); // Keep only the number part
                newLi.append(spanEl);
                leftDiv.append(newLi);
              }
            });
          } else {
            leftDiv.append(bufferedNode.cloneNode(true));
          }
        });
        centerDiv.append(leftDiv);
        buffer = []; // Clear buffer after flushing
      }

      const nextSibling = child.nextElementSibling;
      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        // Dynamically add classes based on link text, if needed for styling
        if (link.textContent.toLowerCase().includes('about us')) {
          subNavWrap.classList.add('about-us-sub-nav');
        } else if (link.textContent.toLowerCase().includes('what we do')) {
          subNavWrap.classList.add('what-we-do');
        } else if (link.textContent.toLowerCase().includes('careers')) {
          subNavWrap.classList.add('careers-div');
        } else if (link.textContent.toLowerCase().includes('investor relations')) {
          subNavWrap.classList.add('element-block');
          const oneLinkUl = document.createElement('ul');
          oneLinkUl.classList.add('sub-nav-wrap-one-link');
          const firstLi = nextSibling.querySelector('li:first-child');
          if (firstLi) {
            const newLi = document.createElement('li');
            newLi.append(firstLi.querySelector('a').cloneNode(true));
            oneLinkUl.append(newLi);
            firstLi.remove(); // Remove to avoid re-processing
          }
          subNavWrap.append(oneLinkUl);

          const innerSubNavWrapList = document.createElement('div');
          innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
          const remainingLis = Array.from(nextSibling.children).filter(li => li.tagName === 'LI');
          const half = Math.ceil(remainingLis.length / 2);
          const ul1 = document.createElement('ul');
          const ul2 = document.createElement('ul');
          remainingLis.slice(0, half).forEach(li => ul1.append(li.cloneNode(true)));
          remainingLis.slice(half).forEach(li => ul2.append(li.cloneNode(true)));
          innerSubNavWrapList.append(ul1, ul2);
          subNavWrap.append(innerSubNavWrapList);
        } else if (link.textContent.toLowerCase().includes('newsroom')) {
          // Newsroom specific structure - if fragment provides content, it will be buffered
          // Otherwise, this section remains empty as per Rule 1.
          const latestPressReleaseDiv = document.createElement('div');
          latestPressReleaseDiv.classList.add('latest-two-press-release');
          // Any content for latestPressReleaseDiv should come from the buffer if present
          // For now, if it's not in the buffer, it means the fragment didn't provide it.
          // We should iterate through the buffer to find relevant content for newsroom-left-div
          const newsroomLeftDiv = centerDiv.querySelector('.newsroom-left-div');
          if (newsroomLeftDiv) {
            const pressReleaseContent = buffer.find(node => node.classList.contains('latest-two-press-release'));
            if (pressReleaseContent) {
              latestPressReleaseDiv.append(pressReleaseContent.cloneNode(true));
            }
            newsroomLeftDiv.append(latestPressReleaseDiv);
          }
        }


        // Recursively build the menu structure
        const builtMenu = buildNestedMenu(nextSibling);
        if (!link.textContent.toLowerCase().includes('investor relations')) {
          subNavWrap.append(builtMenu);
        }
        centerDiv.append(subNavWrap);
      }
      navUl.append(navItem);
    } else {
      // Collect non-navigation elements into buffer
      removeCommentAndTextNodes(child);
      if (child.children.length > 0 || child.textContent.trim() !== '') {
        buffer.push(child);
      }
    }
  });

  mainNav.append(navUl);
}

function setupTools(toolsRow, mainNav) {
  if (!toolsRow || !mainNav) return;

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

  const mobileUl = document.createElement('ul');
  const desktopUl = document.createElement('ul');

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const anchor = li.querySelector('a');
        if (anchor) {
          if (anchor.href.includes('contact-us')) {
            const mailLi = document.createElement('li');
            mailLi.classList.add('mail');

            const mailAnchor = document.createElement('a');
            mailAnchor.href = anchor.href;

            const desktopSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            desktopSvg.setAttribute('version', '1.1');
            desktopSvg.setAttribute('id', 'Layer_1');
            desktopSvg.setAttribute('x', '0px');
            desktopSvg.setAttribute('y', '0px');
            desktopSvg.setAttribute('viewBox', '0 0 48 38.4');
            desktopSvg.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
            desktopSvg.setAttribute('xml:space', 'preserve');
            desktopSvg.setAttribute('width', '21');
            desktopSvg.setAttribute('height', '21');
            desktopSvg.innerHTML = '<path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />';
            
            const desktopMailAnchor = mailAnchor.cloneNode(false);
            desktopMailAnchor.append(desktopSvg);
            const desktopMailLi = mailLi.cloneNode(false);
            desktopMailLi.append(desktopMailAnchor);
            desktopUl.append(desktopMailLi);

            const mobileMailAnchor = mailAnchor.cloneNode(false);
            mobileMailAnchor.textContent = anchor.textContent; // Use original text for mobile
            const mobileMailLi = mailLi.cloneNode(false);
            mobileMailLi.append(mobileMailAnchor);
            mobileUl.append(mobileMailLi);

          } else if (anchor.href.includes('#') || anchor.textContent.toLowerCase() === 'search') {
            const searchLi = document.createElement('li');
            searchLi.classList.add('search');

            const searchAnchor = document.createElement('a');
            searchAnchor.href = '#'; // Search toggle, no specific page
            searchAnchor.setAttribute('aria-expanded', 'false'); // A11y

            const lensSvg = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
            const closeSvg = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
            
            searchAnchor.innerHTML = lensSvg + closeSvg;
            const searchSpan = document.createElement('span');
            searchSpan.textContent = ' Search'; // Text for mobile
            searchAnchor.append(searchSpan);

            const searchScreenWrap = document.createElement('div');
            searchScreenWrap.classList.add('search-screen-wrap');
            searchScreenWrap.innerHTML = `
              <div class="wrap">
                <form action="${anchor.href}" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys">
                  <div class="search-wrap">
                    <div class="search-icon">${lensSvg}</div>
                    <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
                    <button class="submit-button">
                      <div class="label"> Submit </div>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="searchResultBox" style="display: none;">
                    <div class="swiper scrollSwiper">
                      <div class="swiper-wrapper">
                        <div class="swiper-slide"></div>
                      </div>
                    </div>
                    <div class="swiper-scrollbar"></div>
                  </div>
                </form>
                <div class="search-suggestions-wrap">
                  <div class="label">Popular Keywords:</div>
                  <div class="tokens-wrap">
                    <ul>
                      ${Array.from(li.querySelectorAll('.search-suggestions-wrap:nth-of-type(1) li')).map(item => `<li>${item.textContent}</li>`).join('')}
                    </ul>
                  </div>
                </div>
                <div class="search-suggestions-wrap">
                  <div class="label">Recommended for you:</div>
                  <div class="tokens-wrap">
                    <ul>
                      ${Array.from(li.querySelectorAll('.search-suggestions-wrap:nth-of-type(2) li')).map(item => `<li>${item.textContent}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `;
            searchLi.append(searchAnchor, searchScreenWrap);

            const desktopSearchLi = searchLi.cloneNode(true);
            desktopSearchLi.querySelector('a span').remove(); // Remove 'Search' text for desktop
            desktopUl.append(desktopSearchLi);

            const mobileSearchLi = searchLi.cloneNode(true);
            mobileUl.append(mobileSearchLi);

            // Add event listeners for search toggle
            const toggleSearch = (targetLi) => {
              const screenWrap = targetLi.querySelector('.search-screen-wrap');
              const anchorEl = targetLi.querySelector('a');
              const isExpanded = anchorEl.getAttribute('aria-expanded') === 'true';

              if (isExpanded) {
                screenWrap.style.opacity = '0';
                screenWrap.style.pointerEvents = 'none';
                anchorEl.setAttribute('aria-expanded', 'false');
              } else {
                screenWrap.style.opacity = '1';
                screenWrap.style.pointerEvents = 'all';
                anchorEl.setAttribute('aria-expanded', 'true');
              }
              targetLi.querySelector('.lens').style.display = isExpanded ? 'block' : 'none';
              targetLi.querySelector('.close').style.display = isExpanded ? 'none' : 'block';
            };

            // Attach event listeners to both desktop and mobile search elements
            desktopSearchLi.querySelector('a').addEventListener('click', (e) => {
              e.preventDefault();
              toggleSearch(desktopSearchLi);
            });
            mobileSearchLi.querySelector('a').addEventListener('click', (e) => {
              e.preventDefault();
              toggleSearch(mobileSearchLi);
            });

            // Escape key listener for accessibility
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && desktopSearchLi.querySelector('a').getAttribute('aria-expanded') === 'true') {
                toggleSearch(desktopSearchLi);
              }
              if (e.key === 'Escape' && mobileSearchLi.querySelector('a').getAttribute('aria-expanded') === 'true') {
                toggleSearch(mobileSearchLi);
              }
            });

          } else {
            // Social links - if they exist in the fragment, clone them directly
            const socialLi = li.cloneNode(true);
            desktopUl.append(socialLi.cloneNode(true));
            mobileUl.append(socialLi.cloneNode(true));
          }
        }
      });
    }
  });

  mobileIconNav.append(mobileUl);
  desktopIconNav.append(desktopUl);
  mainNav.append(mobileIconNav, desktopIconNav);
}

function toggleMobileMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.classList.contains('active');
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');

  if (!hamburger || !mainNav) return;

  if (expanded) {
    nav.classList.remove('active');
    mainNav.style.transform = 'translate(-100%,0)';
    document.body.style.overflowY = '';
    hamburger.setAttribute('aria-expanded', 'false');
  } else {
    nav.classList.add('active');
    mainNav.style.transform = 'translate(0,0)';
    document.body.style.overflowY = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.remove();
    return;
  }

  // Clear existing block content
  block.textContent = '';
  block.classList.add('main-header', 'solid', 'nav-up');

  const container = document.createElement('div');
  container.classList.add('container');
  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);
  block.append(container);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Setup Brand
  setupBrand(brandRow, block);

  // Setup Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  // Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  setupDesktopNav(navRow, mainNav);
  wrap.append(mainNav);

  // Setup Tools/Icons
  setupTools(toolsRow, mainNav);

  // Mobile menu toggle logic
  hamburger.addEventListener('click', () => toggleMobileMenu(block));

  // Close mobile menu on desktop resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      toggleMobileMenu(block, true); // Force close mobile menu
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('active')) {
      toggleMobileMenu(block);
    }
  });
}
