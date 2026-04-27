import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

function getWrapper(element) {
  if (!element) return null;
  const wrapper = element.querySelector(':scope > .default-content-wrapper');
  return wrapper || element;
}

function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === 1);
  if (children.length < 3) {
    console.warn('Header fragment does not contain the expected 3 sections (Brand, Nav, Tools).');
    return {};
  }
  return {
    brandRow: getWrapper(children[0]),
    navRow: getWrapper(children[1]),
    toolsRow: getWrapper(children[2]),
  };
}

function createHamburger(nav) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = `
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  `;
  hamburger.addEventListener('click', () => {
    const isNavActive = nav.classList.toggle('active');
    document.body.classList.toggle('nav-open', isNavActive);
    hamburger.setAttribute('aria-expanded', isNavActive);

    // Close all submenus when opening/closing main nav
    nav.querySelectorAll('.has-child.active, .has-sub-child.active, .has-inner-sub-child.active-child').forEach(el => {
      el.classList.remove('active');
      const link = el.querySelector('a');
      if (link) {
        link.setAttribute('aria-expanded', 'false');
      }
    });
  });
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'main-navigation'); // Assuming main-nav has id 'main-navigation'
  return hamburger;
}

function createSearchScreen(searchLink, searchScreenContent) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('hidden', ''); // Initially hidden

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const form = document.createElement('form');
  form.action = searchLink.href;
  form.method = 'get';
  form.id = 'search-block-form';
  form.acceptCharset = 'UTF-8';
  form.setAttribute('data-drupal-form-fields', 'edit-keys'); // Keep if needed for backend integration
  wrapDiv.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  form.append(searchWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.innerHTML = SVG_SEARCH_LENS;
  searchWrap.append(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.innerHTML = `<div class="label">${searchLink.textContent.trim()}</div>${SVG_SUBMIT_ARROW}`;
  searchWrap.append(submitButton);

  // Extract searchResultBox and suggestions from the fragment content
  const searchResultBox = searchScreenContent.querySelector('.searchResultBox');
  if (searchResultBox) {
    form.append(searchResultBox.cloneNode(true));
  }

  const searchSuggestions = searchScreenContent.querySelectorAll('.search-suggestions-wrap');
  searchSuggestions.forEach(suggestionWrap => {
    wrapDiv.append(suggestionWrap.cloneNode(true));
  });

  return searchScreenWrap;
}

function setupTools(toolsRow, navContainer) {
  if (!toolsRow) return;

  const mobileTools = document.createElement('div');
  mobileTools.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopTools = document.createElement('div');
  desktopTools.classList.add('icon-nav', 'desktop-menus-icon');

  const mobileUl = document.createElement('ul');
  const desktopUl = document.createElement('ul');

  const allLists = toolsRow.querySelectorAll('ul');
  const utilityLinksList = allLists[allLists.length - 1]; // Assuming last UL is utility links
  const socialLinksList = allLists[0]; // Assuming first UL is social links (if any, not used in this example)

  if (utilityLinksList) {
    utilityLinksList.querySelectorAll('li').forEach(li => {
      const link = li.querySelector('a');
      if (!link) return;

      const mobileLi = document.createElement('li');
      const desktopLi = document.createElement('li');

      if (link.textContent.toLowerCase().includes('contact us')) {
        mobileLi.classList.add('mail');
        desktopLi.classList.add('mail');
        const mailLinkMobile = link.cloneNode(true);
        mailLinkMobile.innerHTML = `${SVG_MAIL} ${link.textContent.trim()}`;
        mobileLi.append(mailLinkMobile);
        const mailLinkDesktop = link.cloneNode(true);
        mailLinkDesktop.innerHTML = SVG_MAIL;
        desktopLi.append(mailLinkDesktop);
      } else if (link.textContent.toLowerCase().includes('search')) {
        mobileLi.classList.add('search');
        desktopLi.classList.add('search');

        const searchAnchorMobile = link.cloneNode(true);
        searchAnchorMobile.innerHTML = `${SVG_SEARCH_LENS} ${SVG_SEARCH_CLOSE} <span>${link.textContent.trim()}</span>`;
        searchAnchorMobile.setAttribute('aria-expanded', 'false');
        mobileLi.append(searchAnchorMobile);

        const searchAnchorDesktop = link.cloneNode(true);
        searchAnchorDesktop.innerHTML = `${SVG_SEARCH_LENS} ${SVG_SEARCH_CLOSE}`;
        searchAnchorDesktop.setAttribute('aria-expanded', 'false');
        desktopLi.append(searchAnchorDesktop);

        // Extract the search screen content from the fragment
        const searchScreenContent = li.querySelector('.search-screen-wrap');
        if (searchScreenContent) {
          mobileLi.append(createSearchScreen(link, searchScreenContent));
          desktopLi.append(createSearchScreen(link, searchScreenContent));
        }

        const toggleSearch = (parentLi) => {
          const searchScreen = parentLi.querySelector('.search-screen-wrap');
          const searchAnchor = parentLi.querySelector('a');
          if (!searchScreen || !searchAnchor) return;

          const isActive = parentLi.classList.toggle('active');
          searchScreen.toggleAttribute('hidden', !isActive);
          searchAnchor.setAttribute('aria-expanded', isActive);

          if (isActive) {
            searchAnchor.querySelector('.lens').style.display = 'none';
            searchAnchor.querySelector('.close').style.display = 'block';
            document.body.classList.add('search-open');
            navContainer.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
          } else {
            searchAnchor.querySelector('.lens').style.display = 'block';
            searchAnchor.querySelector('.close').style.display = 'none';
            document.body.classList.remove('search-open');
          }
        };

        mobileLi.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSearch(mobileLi);
        });
        desktopLi.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSearch(desktopLi);
        });
      } else {
        desktopLi.append(link.cloneNode(true));
      }
      mobileUl.append(mobileLi);
      desktopUl.append(desktopLi);
    });
  }

  mobileTools.append(mobileUl);
  desktopTools.append(desktopUl);

  navContainer.append(mobileTools);
  navContainer.append(desktopTools);
}

function setupDesktopNav(navRow, navContainer) {
  if (!navRow) return;

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainUl.id = 'main-navigation';

  let currentTriggerLi = null;
  let currentMegaMenu = null;

  Array.from(navRow.children).filter(node => node.nodeType === 1).forEach(child => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a main navigation trigger
      if (currentTriggerLi) {
        mainUl.append(currentTriggerLi);
      }

      currentTriggerLi = document.createElement('li');
      currentTriggerLi.classList.add('has-child', 'hover-red');
      currentTriggerLi.setAttribute('itemprop', 'name');

      const anchor = child.querySelector('a').cloneNode(true);
      anchor.setAttribute('itemprop', 'url');
      anchor.setAttribute('aria-expanded', 'false');
      anchor.setAttribute('aria-haspopup', 'true');
      currentTriggerLi.append(anchor);

      const span = document.createElement('span');
      span.innerHTML = SVG_CHEVRON;
      currentTriggerLi.append(span);

      currentMegaMenu = document.createElement('div');
      currentMegaMenu.classList.add('mega-menu');
      currentMegaMenu.innerHTML = `<div class="wrap container"><div class="center-div"></div></div>`;
      currentTriggerLi.append(currentMegaMenu);

      // Desktop hover logic
      if (isDesktop.matches) {
        currentTriggerLi.addEventListener('mouseenter', () => {
          navContainer.querySelectorAll('.has-child.active').forEach(item => {
            item.classList.remove('active');
            item.querySelector('a')?.setAttribute('aria-expanded', 'false');
          });
          currentTriggerLi.classList.add('active');
          anchor.setAttribute('aria-expanded', 'true');
        });
        currentTriggerLi.addEventListener('mouseleave', () => {
          currentTriggerLi.classList.remove('active');
          anchor.setAttribute('aria-expanded', 'false');
        });
      } else {
        // Mobile click logic for main nav items
        const toggleMenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isActive = currentTriggerLi.classList.toggle('active');
          anchor.setAttribute('aria-expanded', isActive);
          const megaMenu = currentTriggerLi.querySelector('.mega-menu');
          if (megaMenu) {
            megaMenu.style.display = isActive ? 'block' : 'none';
          }
          // Close other open main menus
          mainUl.querySelectorAll('.has-child.active').forEach(item => {
            if (item !== currentTriggerLi) {
              item.classList.remove('active');
              item.querySelector('a')?.setAttribute('aria-expanded', 'false');
              item.querySelector('.mega-menu')?.style.display = 'none';
            }
          });
        };
        span.addEventListener('click', toggleMenu);
        anchor.addEventListener('click', (e) => {
          if (!currentTriggerLi.classList.contains('active')) {
            toggleMenu(e);
          }
          // If already active, allow default link behavior
        });
      }
    } else if (currentTriggerLi && currentMegaMenu) {
      // This content belongs to the current mega-menu
      const centerDiv = currentMegaMenu.querySelector('.center-div');

      if (child.classList.contains('left-div')) {
        // This is a pre-structured left-div, move it directly
        centerDiv.prepend(child.cloneNode(true));
      } else if (child.tagName === 'UL' || child.tagName === 'DIV') {
        // This is a sub-navigation or other content
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        const processNestedList = (listElement, parentContainer) => {
          Array.from(listElement.children).filter(node => node.nodeType === 1).forEach(li => {
            const newLi = document.createElement('li');
            const link = li.querySelector('a');
            const nestedUl = li.querySelector('ul');

            if (link) {
              const clonedLink = link.cloneNode(true);
              newLi.append(clonedLink);
              if (nestedUl) {
                clonedLink.setAttribute('aria-expanded', 'false');
                clonedLink.setAttribute('aria-haspopup', 'true');
              }
            } else {
              // If no direct link, but has text content and nested UL (e.g., "Technology Services <ul>")
              const textContent = Array.from(li.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
                .map(node => node.textContent.trim())
                .join('');
              if (textContent) {
                const textSpan = document.createElement('span'); // Use span for non-link text
                textSpan.textContent = textContent;
                newLi.append(textSpan);
              }
            }

            if (nestedUl) {
              newLi.classList.add('top-level-li');
              const chevronSpan = document.createElement('span');
              chevronSpan.innerHTML = SVG_CHEVRON;
              newLi.append(chevronSpan);

              const subChildDiv = document.createElement('div');
              subChildDiv.classList.add('has-sub-child');
              const innerUl = document.createElement('ul');
              subChildDiv.append(innerUl);
              newLi.append(subChildDiv);

              processNestedList(nestedUl, innerUl);

              // Mobile toggle for sub-menus
              if (!isDesktop.matches) {
                const toggleSubMenu = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const isActive = newLi.classList.toggle('active');
                  subChildDiv.classList.toggle('active');
                  const currentLink = newLi.querySelector('a') || newLi.querySelector('span');
                  if (currentLink) {
                    currentLink.setAttribute('aria-expanded', isActive);
                  }
                };
                chevronSpan.addEventListener('click', toggleSubMenu);
                if (link) {
                  link.addEventListener('click', (e) => {
                    if (!newLi.classList.contains('active')) {
                      toggleSubMenu(e);
                    }
                  });
                }
              }
            } else if (link && li.children.length === 1) {
              newLi.classList.add('top-level-li');
            }
            parentContainer.append(newLi);
          });
        };

        if (child.tagName === 'UL') {
          const ulInSubNavWrap = document.createElement('ul');
          processNestedList(child, ulInSubNavWrap);
          if (ulInSubNavWrap.children.length > 0) {
            subNavWrap.append(ulInSubNavWrap);
          }
        } else if (child.tagName === 'DIV') {
          // Directly append complex divs like 'latest-two-press-release'
          subNavWrap.append(child.cloneNode(true));
        }
      }
    }
  });

  // Append the last processed trigger
  if (currentTriggerLi) {
    mainUl.append(currentTriggerLi);
  }

  navContainer.append(mainUl);
}

export default async function decorate(block) {
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Error: Navigation fragment not found.</p>';
    return;
  }

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand
  if (brandRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const brandLink = brandRow.querySelector('a');
    if (brandLink) {
      const clonedLink = brandLink.cloneNode(true);
      const img = clonedLink.querySelector('img');
      if (img) {
        img.classList.add('hiddenlogo1');
        img.setAttribute('width', '200');
        img.setAttribute('height', '30');
        img.style.width = 'auto';
        img.setAttribute('loading', 'lazy');
      }
      logoDiv.append(clonedLink);
    }
    wrap.append(logoDiv);

    // Check for 80th-year logo within brandRow
    const year80Logo = brandRow.querySelector('.year-80-logo');
    if (year80Logo) {
      wrap.append(year80Logo.cloneNode(true));
    }
  }

  // 2. Setup Hamburger (mobile only)
  const hamburger = createHamburger(block);
  wrap.append(hamburger);

  // 3. Setup Main Navigation
  const navContainer = document.createElement('nav');
  navContainer.classList.add('main-nav');
  wrap.append(navContainer);
  setupDesktopNav(navRow, navContainer);
  setupTools(toolsRow, navContainer);

  // Mobile navigation toggle logic
  const toggleMobileNav = () => {
    if (isDesktop.matches) {
      block.classList.remove('active');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      navContainer.querySelectorAll('.has-child.active, .has-sub-child.active, .has-inner-sub-child.active-child').forEach(el => {
        el.classList.remove('active');
        const link = el.querySelector('a');
        if (link) {
          link.setAttribute('aria-expanded', 'false');
        }
        const megaMenu = el.querySelector('.mega-menu');
        if (megaMenu) megaMenu.style.display = 'none';
      });
    } else {
      // Ensure mobile nav is hidden by default
      block.classList.remove('active');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      navContainer.querySelectorAll('.mega-menu').forEach(menu => menu.style.display = 'none');
    }
  };

  // Initial state and resize listener
  toggleMobileNav();
  isDesktop.addEventListener('change', toggleMobileNav);

  // Close nav on escape key
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (block.classList.contains('active')) {
        hamburger.click();
      }
      const activeSearch = document.querySelector('.search.active');
      if (activeSearch) {
        activeSearch.querySelector('a').click();
      }
    }
  });

  // Close nav on outside click for mobile
  document.addEventListener('click', (e) => {
    if (!isDesktop.matches && block.classList.contains('active') && !navContainer.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.click();
    }
  });
}
