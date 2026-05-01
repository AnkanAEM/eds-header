import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

// SVG strings for icons
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

function moveInstrumentation(originalElement, newElement) {
  if (originalElement && newElement) {
    const instrumentation = originalElement.dataset.aueProp;
    if (instrumentation) {
      newElement.dataset.aueProp = instrumentation;
    }
  }
}

function parseList(ulElement, level) {
  const children = [];
  let liEl = ulElement.firstElementChild;
  while (liEl) {
    if (liEl.nodeType === Node.ELEMENT_NODE && liEl.tagName === 'LI') {
      let title = '';
      let href = null;
      let linkElement = liEl.querySelector(':scope > a');
      let strongElement = liEl.querySelector(':scope > strong');

      if (linkElement) {
        title = linkElement.textContent.trim();
        href = linkElement.href;
      } else if (strongElement) {
        title = strongElement.textContent.trim();
      } else {
        const textNodes = Array.from(liEl.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        if (textNodes.length > 0) {
          title = textNodes[0].textContent.trim();
        }
      }

      const item = { title, href, children: [] };
      const nestedUl = liEl.querySelector(':scope > ul');
      if (nestedUl) {
        item.children = parseList(nestedUl, level + 1);
      }
      children.push(item);
    }
    liEl = liEl.nextElementSibling;
  }
  return children;
}

function setupHeaderInteractions(navElement, hamburgerButton, searchToggleElement) {
  const navSections = navElement.querySelector('.main-nav > ul');
  const searchScreenWrap = searchToggleElement ? searchToggleElement.querySelector('.search-screen-wrap') : null;
  const searchLensIcon = searchToggleElement ? searchToggleElement.querySelector('.lens') : null;
  const searchCloseIcon = searchToggleElement ? searchToggleElement.querySelector('.close') : null;
  const searchInput = searchScreenWrap ? searchScreenWrap.querySelector('.input-text.searchtext') : null;
  const searchSubmitButton = searchScreenWrap ? searchScreenWrap.querySelector('.submit-button') : null;

  const toggleMenu = (forceExpanded = null) => {
    const expanded = forceExpanded !== null ? forceExpanded : navElement.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    navElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburgerButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

    if (searchScreenWrap && searchScreenWrap.classList.contains('active')) {
      searchScreenWrap.classList.remove('active');
      if (searchLensIcon) searchLensIcon.style.display = 'block';
      if (searchCloseIcon) searchCloseIcon.style.display = 'none';
      searchToggleElement.setAttribute('aria-expanded', 'false');
    }

    navSections.querySelectorAll('.has-child').forEach((section) => {
      if (!expanded && section.classList.contains('active')) {
        section.classList.remove('active');
        const chevron = section.querySelector(':scope > span svg');
        if (chevron) chevron.style.transform = 'rotate(90deg)';
      }
    });

    if (isDesktop.matches) {
      navSections.querySelectorAll('.has-child').forEach((section) => {
        section.setAttribute('aria-expanded', 'false');
      });
    }
  };

  const toggleSubMenu = (event) => {
    const listItem = event.currentTarget.closest('li');
    if (!listItem) return;

    const hasSubChild = listItem.querySelector(':scope > .has-sub-child');
    const hasInnerSubChild = listItem.querySelector(':scope > .has-inner-sub-child');
    const chevron = listItem.querySelector(':scope > span svg');

    if (!isDesktop.matches) {
      event.preventDefault();
      event.stopPropagation();

      if (hasSubChild) {
        const isActive = hasSubChild.classList.contains('active');
        listItem.closest('ul').querySelectorAll(':scope > li .has-sub-child.active').forEach((otherSubChild) => {
          if (otherSubChild !== hasSubChild) {
            otherSubChild.classList.remove('active');
            const otherChevron = otherSubChild.closest('li').querySelector(':scope > span svg');
            if (otherChevron) otherChevron.style.transform = 'rotate(90deg)';
            otherSubChild.querySelectorAll('.has-inner-sub-child.active-child').forEach((innerChild) => {
              innerChild.classList.remove('active-child');
              const innerChevron = innerChild.closest('li').querySelector(':scope > span svg');
              if (innerChevron) innerChevron.style.transform = 'rotate(90deg)';
            });
          }
        });

        hasSubChild.classList.toggle('active');
        if (chevron) chevron.style.transform = isActive ? 'rotate(90deg)' : 'rotate(-180deg)';
        listItem.setAttribute('aria-expanded', isActive ? 'false' : 'true');
      } else if (hasInnerSubChild) {
        const isActive = hasInnerSubChild.classList.contains('active-child');
        listItem.closest('ul').querySelectorAll(':scope > li .has-inner-sub-child.active-child').forEach((otherInnerSubChild) => {
          if (otherInnerSubChild !== hasInnerSubChild) {
            otherInnerSubChild.classList.remove('active-child');
            const otherChevron = otherInnerSubChild.closest('li').querySelector(':scope > span svg');
            if (otherChevron) otherChevron.style.transform = 'rotate(90deg)';
          }
        });

        hasInnerSubChild.classList.toggle('active-child');
        if (chevron) chevron.style.transform = isActive ? 'rotate(90deg)' : 'rotate(-180deg)';
        listItem.setAttribute('aria-expanded', isActive ? 'false' : 'true');
      }
    }
  };

  const setupSearchToggle = () => {
    if (!searchToggleElement) return;

    const searchAnchor = searchToggleElement.querySelector('a');
    if (!searchAnchor) return;

    searchToggleElement.setAttribute('aria-haspopup', 'true');
    searchToggleElement.setAttribute('aria-expanded', 'false');

    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isActive = searchScreenWrap.classList.contains('active');
      searchScreenWrap.classList.toggle('active', !isActive);
      if (searchLensIcon) searchLensIcon.style.display = isActive ? 'block' : 'none';
      if (searchCloseIcon) searchCloseIcon.style.display = isActive ? 'none' : 'block';
      searchToggleElement.setAttribute('aria-expanded', !isActive);

      if (!isDesktop.matches && navElement.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (searchScreenWrap && searchScreenWrap.classList.contains('active') && !searchScreenWrap.contains(e.target) && !searchToggleElement.contains(e.target)) {
        searchScreenWrap.classList.remove('active');
        if (searchLensIcon) searchLensIcon.style.display = 'block';
        if (searchCloseIcon) searchCloseIcon.style.display = 'none';
        searchToggleElement.setAttribute('aria-expanded', 'false');
      }
    });

    const searchTokensWrap = searchScreenWrap ? searchScreenWrap.querySelector('.tokens-wrap ul') : null;
    if (searchTokensWrap) {
      searchTokensWrap.querySelectorAll('li').forEach((token) => {
        token.addEventListener('click', (e) => {
          e.stopPropagation();
          if (searchInput) {
            searchInput.value = e.target.textContent;
            if (searchSubmitButton) {
              searchSubmitButton.click();
            }
          }
        });
      });
    }

    if (searchScreenWrap) {
      searchScreenWrap.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  };

  hamburgerButton.addEventListener('click', () => toggleMenu(null));
  isDesktop.addEventListener('change', () => toggleMenu(isDesktop.matches));

  navSections.querySelectorAll('.has-child > span').forEach((chevron) => {
    chevron.addEventListener('click', toggleSubMenu);
  });

  // Escape key listener for closing nav or search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navElement.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
      if (searchScreenWrap && searchScreenWrap.classList.contains('active')) {
        searchScreenWrap.classList.remove('active');
        if (searchLensIcon) searchLensIcon.style.display = 'block';
        if (searchCloseIcon) searchCloseIcon.style.display = 'none';
        searchToggleElement.setAttribute('aria-expanded', 'false');
      }
    }
  });

  setupSearchToggle();
  toggleMenu(isDesktop.matches); // Initial state
}

function createSearchScreenContent(fragment, isMobile = false) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search'; // Hardcoded URL, but from original HTML
  searchForm.method = 'get';
  searchForm.id = isMobile ? 'search-block-form-mobile' : 'search-block-form-desktop';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  wrapDiv.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.append(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.innerHTML = SEARCH_LENS_SVG;
  searchInputWrap.append(searchIconDiv);

  const searchInputEl = document.createElement('input');
  searchInputEl.type = 'text';
  searchInputEl.classList.add('input-text', 'searchtext');
  searchInputEl.required = true;
  searchInputEl.name = 'key';
  searchInputEl.id = isMobile ? 'searchInputMobile' : 'searchInputDesktop';
  searchInputEl.autocomplete = 'off';
  searchInputWrap.append(searchInputEl);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('submit-button');
  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = 'Submit';
  submitButton.append(submitLabel);
  submitButton.innerHTML += SUBMIT_ARROW_SVG; // Append SVG string
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchForm.append(searchResultBox);

  // Extract search suggestions from fragment (assuming a structure like a section with H4 and ULs)
  const searchSection = fragment.children[3]; // Assuming search content is in the 4th section
  if (searchSection) {
    const searchContentWrapper = searchSection.querySelector(':scope > .default-content-wrapper') || searchSection;

    let currentHeading = null;
    let currentUl = null;

    Array.from(searchContentWrapper.children).forEach(child => {
      if (child.tagName === 'H4') {
        currentHeading = child.textContent.trim();
        currentUl = null; // Reset UL for new heading
      } else if (child.tagName === 'UL' && currentHeading) {
        const searchSuggestionsWrap = document.createElement('div');
        searchSuggestionsWrap.classList.add('search-suggestions-wrap');

        const label = document.createElement('div');
        label.classList.add('label');
        label.textContent = currentHeading;
        searchSuggestionsWrap.append(label);

        const tokensWrap = document.createElement('div');
        tokensWrap.classList.add('tokens-wrap');
        const tokensUl = document.createElement('ul');

        Array.from(child.children).forEach(li => {
          const tokenLi = document.createElement('li');
          tokenLi.textContent = li.textContent.trim();
          tokensUl.append(tokenLi);
        });
        tokensWrap.append(tokensUl);
        searchSuggestionsWrap.append(tokensWrap);
        wrapDiv.append(searchSuggestionsWrap); // Append to wrapDiv, not searchScreenWrap directly
      }
    });
  }

  return searchScreenWrap;
}


export default async function decorate(block) {
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  block.append(headerContainer);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  headerContainer.append(wrapDiv);

  // Section 1: Brand
  const brandSection = fragment.children[0];
  const brandRoot = brandSection.querySelector(':scope > .default-content-wrapper') || brandSection;
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrapDiv.append(logoDiv);

  const logoLink = brandRoot.querySelector(':scope > p > picture > img')?.closest('a');
  if (logoLink) {
    const newLogoLink = logoLink.cloneNode(true);
    const newLogoImg = newLogoLink.querySelector('img');
    if (newLogoImg) {
      newLogoImg.classList.add('hiddenlogo1');
    }
    logoDiv.append(newLogoLink);
  } else {
    // Handle case where logo link is missing, but logoDiv should still exist
    const defaultLogoLink = document.createElement('a');
    defaultLogoLink.href = '/';
    logoDiv.append(defaultLogoLink);
  }
  moveInstrumentation(brandRoot.firstElementChild, logoDiv);

  // Hamburger for mobile
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    const li = document.createElement('li');
    hamburgerUl.append(li);
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Section 2: Nav
  const navSection = fragment.children[1];
  const navRoot = navSection.querySelector(':scope > .default-content-wrapper') || navSection;
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.id = 'nav';
  wrapDiv.append(navElement);

  const navSectionsUl = document.createElement('ul');
  navSectionsUl.setAttribute('itemscope', '');
  navSectionsUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(navSectionsUl);

  let el = navRoot.firstElementChild;
  let navItemIndex = 0;
  let buffer = [];

  while (el) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      if (el.tagName === 'P') {
        const navItemLi = document.createElement('li');
        navItemLi.classList.add('has-child', 'hover-red');
        navItemLi.setAttribute('itemprop', 'name');
        navItemLi.setAttribute('aria-haspopup', 'true');
        navItemLi.setAttribute('aria-expanded', 'false');

        const link = el.querySelector(':scope > a');
        if (link) {
          const newLink = link.cloneNode(true);
          newLink.setAttribute('itemprop', 'url');
          navItemLi.append(newLink);
        } else {
          const textSpan = document.createElement('span');
          textSpan.textContent = el.textContent.trim();
          navItemLi.append(textSpan);
        }

        const chevronSpan = document.createElement('span');
        chevronSpan.innerHTML = CHEVRON_SVG;
        navItemLi.append(chevronSpan);

        const megaMenuDiv = document.createElement('div');
        megaMenuDiv.classList.add('mega-menu');
        navItemLi.append(megaMenuDiv);

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenuDiv.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div', `nav-item-${navItemIndex}-left-div`);
        centerDiv.append(leftDiv);

        buffer.forEach(bufferedNode => leftDiv.append(bufferedNode));
        buffer = [];

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        const nextEl = el.nextElementSibling;
        if (nextEl && nextEl.tagName === 'UL') {
          const navItems = parseList(nextEl, 1);
          const ulContainer = document.createElement('ul');
          navItems.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('top-level-li');
            li.setAttribute('aria-haspopup', item.children.length > 0 ? 'true' : 'false');
            li.setAttribute('aria-expanded', 'false');

            if (item.href) {
              const itemLink = document.createElement('a');
              itemLink.href = item.href;
              itemLink.textContent = item.title;
              li.append(itemLink);
            } else {
              const itemText = document.createElement('span');
              itemText.textContent = item.title;
              li.append(itemText);
            }

            if (item.children.length > 0) {
              const itemChevronSpan = document.createElement('span');
              itemChevronSpan.innerHTML = CHEVRON_SVG;
              li.append(itemChevronSpan);

              const subMenuDiv = document.createElement('div');
              subMenuDiv.classList.add('has-sub-child');
              const subMenuUl = document.createElement('ul');
              item.children.forEach((subItem) => {
                const subLi = document.createElement('li');
                subLi.setAttribute('aria-haspopup', subItem.children.length > 0 ? 'true' : 'false');
                subLi.setAttribute('aria-expanded', 'false');

                if (subItem.href) {
                  const subItemLink = document.createElement('a');
                  subItemLink.href = subItem.href;
                  subItemLink.textContent = subItem.title;
                  subLi.append(subItemLink);
                } else {
                  const subItemText = document.createElement('span');
                  subItemText.textContent = subItem.title;
                  subLi.append(subItemText);
                }

                if (subItem.children.length > 0) {
                  const subItemChevronSpan = document.createElement('span');
                  subItemChevronSpan.innerHTML = CHEVRON_SVG;
                  subLi.append(subItemChevronSpan);

                  const innerSubMenuDiv = document.createElement('div');
                  innerSubMenuDiv.classList.add('has-inner-sub-child');
                  const innerSubMenuUl = document.createElement('ul');
                  subItem.children.forEach((innerSubItem) => {
                    const innerSubLi = document.createElement('li');
                    const innerSubItemLink = document.createElement('a');
                    innerSubItemLink.href = innerSubItem.href;
                    innerSubItemLink.textContent = innerSubItem.title;
                    innerSubLi.append(innerSubItemLink);
                    innerSubMenuUl.append(innerSubLi);
                  });
                  innerSubMenuDiv.append(innerSubMenuUl);
                  subLi.append(innerSubMenuDiv);
                }
                subMenuUl.append(subLi);
              });
              subMenuDiv.append(subMenuUl);
              li.append(subMenuDiv);
            }
            ulContainer.append(li);
          });
          subNavWrap.append(ulContainer);
          el = nextEl.nextElementSibling;
        } else {
          el = el.nextElementSibling;
        }
        navSectionsUl.append(navItemLi);
        navItemIndex += 1;
        continue;
      } else {
        buffer.push(el.cloneNode(true));
      }
    }
    el = el.nextElementSibling;
  }

  // Mobile and Desktop icon nav
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navSectionsUl.append(mobileIconNav);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  navElement.append(desktopIconUl);

  // Section 3: Tools
  const toolsSection = fragment.children[2];
  const toolsRoot = toolsSection.querySelector(':scope > .default-content-wrapper') || toolsSection;
  const navTools = document.createElement('div'); // Container for icons

  let toolsEl = toolsRoot.firstElementChild;
  let searchToggleElement = null; // To store the search li for event listeners
  while (toolsEl) {
    if (toolsEl.nodeType === Node.ELEMENT_NODE && toolsEl.tagName === 'UL') {
      Array.from(toolsEl.children).forEach((li) => {
        const link = li.querySelector(':scope > a');
        if (link) {
          const newLiMobile = document.createElement('li');
          const newLiDesktop = document.createElement('li');

          const linkText = link.textContent.trim().toLowerCase();
          if (linkText.includes('contact')) { // Use includes for robustness
            newLiMobile.classList.add('mail');
            newLiDesktop.classList.add('mail');

            const mobileLink = link.cloneNode(true);
            mobileLink.textContent = '';
            mobileLink.innerHTML += MAIL_SVG;
            mobileLink.append(document.createTextNode(' Contact Us'));
            newLiMobile.append(mobileLink);

            const desktopLink = link.cloneNode(true);
            desktopLink.textContent = '';
            desktopLink.innerHTML += MAIL_SVG;
            newLiDesktop.append(desktopLink);
          } else if (linkText.includes('search')) { // Use includes for robustness
            newLiMobile.classList.add('search');
            newLiDesktop.classList.add('search');

            // Mobile Search
            const mobileSearchLink = link.cloneNode(true);
            mobileSearchLink.textContent = '';
            mobileSearchLink.innerHTML += SEARCH_LENS_SVG;
            mobileSearchLink.innerHTML += SEARCH_CLOSE_SVG;
            mobileSearchLink.append(document.createTextNode(' Search'));
            newLiMobile.append(mobileSearchLink);
            newLiMobile.append(createSearchScreenContent(fragment, true));

            // Desktop Search
            const desktopSearchLink = link.cloneNode(true);
            desktopSearchLink.textContent = '';
            desktopSearchLink.innerHTML += SEARCH_LENS_SVG;
            desktopSearchLink.innerHTML += SEARCH_CLOSE_SVG;
            newLiDesktop.append(desktopSearchLink);
            newLiDesktop.append(createSearchScreenContent(fragment, false));

            searchToggleElement = newLiDesktop; // Assign desktop search li for event listeners
          } else {
            newLiMobile.append(link.cloneNode(true));
            newLiDesktop.append(link.cloneNode(true));
          }
          mobileIconUl.append(newLiMobile);
          desktopIconUl.append(newLiDesktop);
          moveInstrumentation(li, newLiMobile);
          moveInstrumentation(li, newLiDesktop);
        }
      });
    }
    toolsEl = toolsEl.nextElementSibling;
  }

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrapDiv.append(year80LogoDiv);

  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/'; // Hardcoded URL from original HTML
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp'; // Hardcoded URL from original HTML
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.setAttribute('width', '74');
  year80Img.setAttribute('height', '60');
  year80Img.setAttribute('loading', 'lazy');
  year80Link.append(year80Img);
  year80LogoDiv.append(year80Link);
  moveInstrumentation(fragment.children[2], year80LogoDiv);

  setupHeaderInteractions(navElement, hamburgerDiv, searchToggleElement);
}

/*
Rule 8 — Mandatory Final Step
1. SHORT AUDIT: Briefly list 3-5 problems found in the original approach.
2. BEHAVIORAL JUSTIFICATION: List the specific CSS rules you found that define the interaction model (e.g., "Found .nav-item:hover, using Hover model for Desktop").
3. REFACTORED JS: The complete, production-ready decorate() function inside a
