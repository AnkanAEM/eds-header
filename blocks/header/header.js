import { loadFragment } from '../../scripts/lib-franklin.js';

const dropdownArrowSVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const mailSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';
const searchLensSVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const searchCloseSVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const searchSubmitArrowSVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

function addEventListeners(headerBlock, mainNav, hamburger) {
  headerBlock.querySelectorAll('.main-nav > ul > li.has-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentLi = e.target.closest('li.has-child');
      if (parentLi) {
        headerBlock.querySelectorAll('.main-nav > ul > li.has-child.active').forEach((openLi) => {
          if (openLi !== parentLi) { openLi.classList.remove('active'); }
        });
        parentLi.classList.toggle('active');
        // Toggle mobile menu for the current L1 item
        if (window.innerWidth <= 991) {
          if (parentLi.classList.contains('active')) {
            mainNav.classList.add('mobile-child-open');
          } else {
            mainNav.classList.remove('mobile-child-open');
          }
        }
      }
    });
  });

  headerBlock.querySelectorAll('.main-nav .sub-nav-wrap li.top-level-li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentLi = e.target.closest('li.top-level-li');
      if (parentLi) {
        parentLi.closest('.sub-nav-wrap').querySelectorAll('li.top-level-li.active').forEach((openSubLi) => {
          if (openSubLi !== parentLi) {
            openSubLi.classList.remove('active');
            openSubLi.querySelector(':scope > div')?.classList.remove('active');
          }
        });
        parentLi.classList.toggle('active');
        parentLi.querySelector(':scope > div')?.classList.toggle('active');

        // Toggle mobile menu for the current L2 item
        if (window.innerWidth <= 991) {
          if (parentLi.classList.contains('active')) {
            mainNav.classList.add('mobile-grandchild-open');
          } else {
            mainNav.classList.remove('mobile-grandchild-open');
          }
        }
      }
    });
  });

  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    // Close any open sub-menus when main menu is closed
    if (!mainNav.classList.contains('active')) {
      mainNav.querySelectorAll('li.active').forEach(li => li.classList.remove('active'));
      mainNav.querySelectorAll('div.active').forEach(div => div.classList.remove('active'));
      mainNav.classList.remove('mobile-child-open', 'mobile-grandchild-open');
    }
  });

  const searchToggleEls = headerBlock.querySelectorAll('.icon-nav .search');
  searchToggleEls.forEach((searchToggleEl) => {
    searchToggleEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = searchToggleEl.classList.toggle('active');
      const searchScreenWrap = searchToggleEl.querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        searchScreenWrap.style.display = isActive ? 'block' : 'none';
      }

      if (window.innerWidth <= 991) {
        if (isActive) {
          mainNav.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.classList.add('search-active');
        } else {
          document.body.classList.remove('search-active');
        }
      }
    });

    searchToggleEl.querySelector('.search-screen-wrap')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', (e) => {
    if (!headerBlock.contains(e.target)) {
      headerBlock.querySelectorAll('li.has-child.active').forEach((openLi) => {
        openLi.classList.remove('active');
      });
      headerBlock.querySelectorAll('li.top-level-li.active').forEach((openSubLi) => {
        openSubLi.classList.remove('active');
        openSubLi.querySelector(':scope > div')?.classList.remove('active');
      });
      mainNav.classList.remove('active', 'mobile-child-open', 'mobile-grandchild-open');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');

      headerBlock.querySelectorAll('.icon-nav .search.active').forEach((searchEl) => {
        searchEl.classList.remove('active');
        searchEl.querySelector('.search-screen-wrap').style.display = 'none';
      });
      document.body.classList.remove('search-active');
    }
  });

  // Handle back navigation on mobile for nested menus
  if (window.innerWidth <= 991) {
    mainNav.addEventListener('transitionend', () => {
        if (mainNav.classList.contains('active')) {
            if (mainNav.classList.contains('mobile-child-open')) {
                // Logic for showing back button/arrow for L2
            } else if (mainNav.classList.contains('mobile-grandchild-open')) {
                // Logic for showing back button/arrow for L3+
            }
        }
    });
  }
}

export default async function decorate(block) {
  const navFragment = await loadFragment('/nav');
  if (!navFragment) {
    return;
  }

  const header = document.createElement('header');
  header.className = 'main-header with-marquee solid nav-up';
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.className = 'container';
  header.append(container);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  container.append(wrap);

  let mainNavElement;
  let mobileToolsElement;
  let desktopToolsElement;
  let year80LogoElement;

  Array.from(navFragment.children).forEach((child) => {
    if (child.classList.contains('header-brand')) {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'logo';
      const logoLink = child.querySelector('a').cloneNode(true);
      const img = logoLink.querySelector('img');
      if (img) {
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.style.width = 'auto';
      }
      logoDiv.append(logoLink);
      wrap.append(logoDiv);
    } else if (child.classList.contains('main-navigation')) {
      mainNavElement = child.querySelector('ul');
    } else if (child.classList.contains('header-tools')) {
      // The source HTML places mobile tools INSIDE the main nav container
      // and desktop tools as a sibling. We'll reconstruct based on source.
      const mobileToolsClone = child.cloneNode(true);
      mobileToolsClone.classList.add('mobile-menus-icon', 'icon-nav');
      mobileToolsElement = mobileToolsClone;

      const desktopToolsClone = child.cloneNode(true);
      desktopToolsClone.classList.add('desktop-menus-icon', 'icon-nav');
      desktopToolsElement = desktopToolsClone;
    } else if (child.classList.contains('header-80year-logo')) {
      year80LogoElement = child.cloneNode(true);
      year80LogoElement.removeAttribute('class');
      year80LogoElement.className = 'logo year-80-logo';
      const img80 = year80LogoElement.querySelector('img');
      if (img80) {
          img80.removeAttribute('width');
          img80.removeAttribute('height');
      }
    }
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  const mainNav = document.createElement('nav');
  mainNav.className = 'main-nav';
  mainNav.setAttribute('data-once', 'initSubChildToggle');

  if (mainNavElement) {
    const navULClone = mainNavElement.cloneNode(true);
    Array.from(navULClone.children).forEach((l1Li) => {
      l1Li.classList.add('has-child', 'hover-red'); // Add base classes for styling
      const l1Anchor = l1Li.querySelector(':scope > a');
      if (l1Anchor) {
        // Check for child div for mega-menu
        const megaMenuContent = l1Li.querySelector(':scope > div');
        if (megaMenuContent) {
          const arrowSpan = document.createElement('span');
          arrowSpan.innerHTML = dropdownArrowSVG;
          l1Anchor.insertAdjacentElement('afterend', arrowSpan);

          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = megaMenuContent.innerHTML; // Get inner content to restructure

          megaMenuContent.innerHTML = ''; // Clear original content
          megaMenuContent.className = 'mega-menu'; // Apply correct class

          const megaMenuWrapContainer = document.createElement('div');
          megaMenuWrapContainer.className = 'wrap container';
          megaMenuContent.append(megaMenuWrapContainer);
          const megaMenuCenterDiv = document.createElement('div');
          megaMenuCenterDiv.className = 'center-div';
          megaMenuWrapContainer.append(megaMenuCenterDiv);

          const leftDivClone = tempDiv.querySelector(':scope > .left-div');
          if (leftDivClone) {
            leftDivClone.removeAttribute('class');
            const newLeftDiv = document.createElement('div');
            newLeftDiv.className = 'left-div';
            newLeftDiv.innerHTML = leftDivClone.innerHTML; // Take clean inner content
            megaMenuCenterDiv.append(newLeftDiv);
          }

          const subNavWrapClone = tempDiv.querySelector(':scope > .sub-nav-wrap');
          if (subNavWrapClone) {
            subNavWrapClone.removeAttribute('class');
            const newSubNavWrap = document.createElement('div');
            newSubNavWrap.className = 'sub-nav-wrap';
            newSubNavWrap.innerHTML = subNavWrapClone.innerHTML;

            // Recursively decorate sub-menu items (L2, L3, L4+)
            Array.from(newSubNavWrap.querySelectorAll('li')).forEach((subLi) => {
              const subLiAnchor = subLi.querySelector(':scope > a');
              if (subLiAnchor) {
                const subMenuContainer = subLi.querySelector(':scope > div');
                if (subMenuContainer) {
                  const arrowSpanSub = document.createElement('span');
                  arrowSpanSub.innerHTML = dropdownArrowSVG;
                  subLiAnchor.insertAdjacentElement('afterend', arrowSpanSub);
                  subLi.classList.add('top-level-li');
                  subMenuContainer.className = subMenuContainer.querySelector('ul > li > div') ? 'has-sub-child' : 'has-inner-sub-child'; // Differentiate L2 from L3+
                }
              }
            });
            megaMenuCenterDiv.append(newSubNavWrap);
          }
        }
      }
    });
    mainNav.append(navULClone);
  }

  // Mobile Tools (part of mainNav structure visually in source HTML)
  if (mobileToolsElement) {
    const mobileUl = mobileToolsElement.querySelector('ul').cloneNode(true);
    mobileUl.classList.add('icon-nav', 'mobile-menus-icon');
    const mailLi = mobileUl.querySelector('li:first-child');
    if (mailLi) {
      mailLi.classList.add('mail');
      const mailLink = mailLi.querySelector('a');
      if (mailLink) mailLink.innerHTML = mailSVG + ' Contact Us';
    }
    const searchLi = mobileUl.querySelector('li:last-child');
    if (searchLi) {
      searchLi.classList.add('search');
      searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const searchLink = searchLi.querySelector('a');
      if (searchLink) searchLink.innerHTML = searchLensSVG + searchCloseSVG + '<span> Search</span>';
      searchLi.append(createSearchOverlay());
    }
    mainNav.append(mobileUl);
  }

  wrap.append(mainNav);

  // Desktop Tools (sibling of mainNav but logically separate)
  if (desktopToolsElement) {
    const desktopUl = desktopToolsElement.querySelector('ul').cloneNode(true);
    desktopUl.classList.add('icon-nav', 'desktop-menus-icon');
    const mailLi = desktopUl.querySelector('li:first-child');
    if (mailLi) {
      mailLi.classList.add('mail');
      const mailLink = mailLi.querySelector('a');
      if (mailLink) mailLink.innerHTML = mailSVG;
    }
    const searchLi = desktopUl.querySelector('li:last-child');
    if (searchLi) {
      searchLi.classList.add('search');
      searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const searchLink = searchLi.querySelector('a');
      if (searchLink) searchLink.innerHTML = searchLensSVG + searchCloseSVG;
      searchLi.append(createSearchOverlay());
    }
    mainNav.append(desktopUl); // Append to mainNav for styling reasons in source
  }

  if (year80LogoElement) {
    wrap.append(year80LogoElement);
  }

  block.append(header);
  addEventListeners(header, mainNav, hamburger);
}

function createSearchOverlay() {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.className = 'search-screen-wrap';
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            ${searchLensSVG}
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation">
          <button class="submit-button" data-once="search-stop-propagation">
            <div class="label" data-once="search-stop-propagation"> Submit </div>
            ${searchSubmitArrowSVG}
          </button>
        </div>
        <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
          <div class="swiper scrollSwiper" data-once="search-stop-propagation">
            <div class="swiper-wrapper" data-once="search-stop-propagation">
              <div class="swiper-slide" data-once="search-stop-propagation">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Business</li>
            <li data-once="search-stop-propagation">FY 21</li>
            <li data-once="search-stop-propagation">Brands</li>
            <li data-once="search-stop-propagation">XUV700</li>
            <li data-once="search-stop-propagation">Global</li>
            <li data-once="search-stop-propagation">Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
            <li data-once="search-stop-propagation">Leadership Announcement</li>
            <li data-once="search-stop-propagation">Latest Press Release</li>
            <li data-once="search-stop-propagation">Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  return searchScreenWrap;
}
