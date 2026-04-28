import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

const LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /></svg>';

function moveInstrumentation(sourceElement, targetElement) {
  if (sourceElement && targetElement) {
    const instrumentationAttr = sourceElement.getAttribute('data-aue-resource');
    if (instrumentationAttr) {
      targetElement.setAttribute('data-aue-resource', instrumentationAttr);
    }
  }
}

function closeAllMenus(nav, navSections) {
  if (!nav || !navSections) return;
  nav.querySelectorAll('.has-child').forEach((section) => {
    section.classList.remove('active');
    section.setAttribute('aria-expanded', 'false');
  });
  nav.classList.remove('menu-open');
  nav.querySelector('.nav-hamburger')?.classList.remove('is-active');
  document.body.style.overflowY = '';
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.classList.contains('menu-open');
  const hamburger = nav.querySelector('.nav-hamburger');

  if (expanded) {
    nav.classList.remove('menu-open');
    hamburger?.classList.remove('is-active');
    document.body.style.overflowY = '';
  } else {
    nav.classList.add('menu-open');
    hamburger?.classList.add('is-active');
    document.body.style.overflowY = 'hidden';
  }
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

function setupMobileNavigation(nav, navSections) {
  if (!nav || !navSections) return;

  const mobileMenuButton = nav.querySelector('.nav-hamburger');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => toggleMenu(nav, navSections));
  }

  navSections.querySelectorAll('.has-child').forEach((section) => {
    const trigger = section.querySelector('a');
    const chevron = section.querySelector('span'); // The span containing the SVG chevron
    if (trigger && chevron) {
      const toggleHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = section.classList.contains('active');
        // Close all other open sub-menus at the same level
        section.parentElement.querySelectorAll('.has-child.active').forEach((openSection) => {
          if (openSection !== section) {
            openSection.classList.remove('active');
            openSection.setAttribute('aria-expanded', 'false');
            openSection.querySelector('span')?.classList.remove('rotated');
            const megaMenu = openSection.querySelector('.mega-menu');
            if (megaMenu) megaMenu.style.display = 'none';
          }
        });

        section.classList.toggle('active', !isExpanded);
        section.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
        chevron.classList.toggle('rotated', !isExpanded);
        const megaMenu = section.querySelector('.mega-menu');
        if (megaMenu) megaMenu.style.display = isExpanded ? 'none' : 'block';
      };
      trigger.addEventListener('click', toggleHandler);
      chevron.addEventListener('click', toggleHandler);
    }
  });

  // Handle nested mobile menus
  navSections.querySelectorAll('.mega-menu .has-sub-child, .mega-menu .has-inner-sub-child').forEach((subParent) => {
    const trigger = subParent.querySelector('a');
    const chevron = subParent.querySelector('span');
    if (trigger && chevron) {
      const toggleHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = subParent.classList.contains('active') || subParent.classList.contains('active-child');
        subParent.classList.toggle('active', !isExpanded);
        subParent.classList.toggle('active-child', !isExpanded);
        chevron.classList.toggle('rotated', !isExpanded);
      };
      trigger.addEventListener('click', toggleHandler);
      chevron.addEventListener('click', toggleHandler);
    }
  });
}

function setupDesktopNavigation(nav, navSections) {
  if (!nav || !navSections) return;

  nav.querySelectorAll('.has-child').forEach((section) => {
    section.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        closeAllMenus(nav, navSections); // Pass navSections
        section.classList.add('active');
        section.setAttribute('aria-expanded', 'true');
      }
    });

    section.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        section.classList.remove('active');
        section.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle nested desktop menus
    section.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((subParent) => {
      subParent.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          subParent.classList.add('active');
          subParent.classList.add('active-child');
        }
      });
      subParent.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          subParent.classList.remove('active');
          subParent.classList.remove('active-child');
        }
      });
    });
  });
}

function setupSearch(block) {
  if (!block) return;

  const searchLi = block.querySelector('li.search');
  if (!searchLi) return;

  const searchLink = searchLi.querySelector('a');
  if (!searchLink) return;

  // Search screen wrap (consider making this a fragment if complex)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(wrapDiv);

  const searchForm = document.createElement('form');
  // TODO: Make action URL dynamic from metadata or block content
  searchForm.setAttribute('action', 'https://www.mahindra.com/search');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('id', 'search-block-form');
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchForm.setAttribute('data-once', 'search-stop-propagation');
  wrapDiv.append(searchForm);

  const searchWrapDiv = document.createElement('div');
  searchWrapDiv.classList.add('search-wrap');
  searchWrapDiv.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchWrapDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.innerHTML = LENS_SVG;
  searchWrapDiv.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.setAttribute('required', '');
  searchInput.setAttribute('name', 'key');
  searchInput.setAttribute('id', 'searchInput');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('data-once', 'search-stop-propagation');
  searchWrapDiv.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  // TODO: Make "Submit" label dynamic from metadata or block content
  submitButton.innerHTML = '<div class="label" data-once="search-stop-propagation"> Submit </div><svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';
  searchWrapDiv.append(submitButton);

  // TODO: Search suggestions (Popular Keywords, Recommended for you) should be dynamic
  const searchSuggestionsWrap1 = document.createElement('div');
  searchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
  searchSuggestionsWrap1.innerHTML = '<div class="label" data-once="search-stop-propagation">Popular Keywords:</div><div class="tokens-wrap" data-once="search-stop-propagation"><ul><li data-once="search-stop-propagation">Business</li><li data-once="search-stop-propagation">FY 21</li><li data-once="search-stop-propagation">Brands</li><li data-once="search-stop-propagation">XUV700</li><li data-once="search-stop-propagation">Global</li><li data-once="search-stop-propagation">Nanhi Kali</li></ul></div>';
  wrapDiv.append(searchSuggestionsWrap1);

  const searchSuggestionsWrap2 = document.createElement('div');
  searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  searchSuggestionsWrap2.innerHTML = '<div class="label" data-once="search-stop-propagation">Recommended for you:</div><div class="tokens-wrap" data-once="search-stop-propagation"><ul><li data-once="search-stop-propagation">Annual Report 2021 - 2022</li><li data-once="search-stop-propagation">Leadership Announcement</li><li data-once="search-stop-propagation">Latest Press Release</li><li data-once="search-stop-propagation">Brand Guidelines</li></ul></div>';
  wrapDiv.append(searchSuggestionsWrap2);

  searchLi.append(searchScreenWrap);

  // Update original search link content
  searchLink.innerHTML = LENS_SVG + CLOSE_SVG + '<span> Search</span>';
  searchLink.setAttribute('role', 'button');
  searchLink.setAttribute('aria-label', 'Toggle Search');
  searchLink.setAttribute('aria-expanded', 'false');

  const closeSearch = () => {
    searchLi.classList.remove('active');
    block.closest('.main-header').classList.remove('search-open');
    searchLink.setAttribute('aria-expanded', 'false');
  };

  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isActive = searchLi.classList.toggle('active');
    block.closest('.main-header').classList.toggle('search-open');
    searchLink.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    if (isActive) {
      searchInput.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchLi.contains(e.target) && searchLi.classList.contains('active')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchLi.classList.contains('active')) {
      closeSearch();
    }
  });
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE && !child.nodeName.startsWith('<!--'),
  );

  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify Brand Row: First section with an image
  brandRow = sections.find((section) => section.querySelector('picture, img'));

  // Identify Nav Row: Section with the highest density of <ul> elements
  let maxUlCount = -1;
  sections.forEach((section) => {
    const ulCount = section.querySelectorAll('ul').length;
    if (ulCount > maxUlCount) {
      maxUlCount = ulCount;
      navRow = section;
    }
  });

  // Identify Tools Row: Remaining section(s) with social links or utility links
  const socialLinkRegex = /facebook|twitter|linkedin|instagram|youtube/i;
  toolsRow = sections.find(
    (section) => section !== brandRow && section !== navRow && section.querySelector(`a[href*="${socialLinkRegex.source}"]`),
  );

  // If toolsRow not found by social links, find the remaining one
  if (!toolsRow) {
    toolsRow = sections.find((section) => section !== brandRow && section !== navRow);
  }

  return { brandRow, navRow, toolsRow };
}

function getImmediateText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
    .map((node) => node.textContent.trim())
    .join('');
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  const docFragment = document.createDocumentFragment();

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  docFragment.append(headerContainer);

  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');
  headerContainer.append(headerWrap);

  // --- Brand Section ---
  if (brandRow) {
    const brandWrapper = brandRow.querySelector('.default-content-wrapper') || brandRow;
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentation(brandRow, logoDiv);

    const logoLink = brandWrapper.querySelector('a');
    const logoImg = brandWrapper.querySelector('picture img');

    if (logoLink && logoImg) {
      const newLogoLink = logoLink.cloneNode(false);
      newLogoLink.textContent = '';
      newLogoLink.setAttribute('href', logoLink.href);

      const newLogoImg = logoImg.cloneNode(true);
      if (!newLogoImg.src && newLogoImg.closest('picture')) {
        const source = newLogoImg.closest('picture').querySelector('source[srcset]');
        if (source) {
          newLogoImg.src = source.srcset;
        }
      }
      if (newLogoImg.src) {
        newLogoLink.append(newLogoImg);
      }
      logoDiv.append(newLogoLink);
    } else if (logoLink) {
      // Fallback if no image, but a link exists
      const newLogoLink = logoLink.cloneNode(true);
      newLogoLink.classList.add('text-logo');
      logoDiv.append(newLogoLink);
    }
    headerWrap.append(logoDiv);
  }

  // --- Hamburger for Mobile ---
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger', 'nav-hamburger'); // Add nav-hamburger for easier selection
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  headerWrap.append(hamburger);

  // --- Navigation Section ---
  if (navRow) {
    const navWrapper = navRow.querySelector('.default-content-wrapper') || navRow;
    nav.setAttribute('data-once', 'initSubChildToggle');
    const ul = document.createElement('ul');
    ul.setAttribute('itemscope', '');
    ul.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
    nav.append(ul);

    let currentLeftDivContent = [];

    Array.from(navWrapper.children).forEach((child) => {
      if (child.nodeName === 'P' && child.querySelector('a')) {
        // This is a main nav trigger
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red');
        li.setAttribute('itemprop', 'name');
        li.setAttribute('data-once', 'nav-close-search');
        li.setAttribute('aria-haspopup', 'true');
        li.setAttribute('aria-expanded', 'false');

        const link = child.querySelector('a');
        const newLink = link.cloneNode(true);
        newLink.setAttribute('itemprop', 'url');
        li.append(newLink);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        li.append(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        li.append(megaMenu);

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        if (currentLeftDivContent.length > 0) {
          const leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const title = getImmediateText(newLink).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          if (title) {
            leftDiv.classList.add(`${title}-left-div`);
          }
          currentLeftDivContent.forEach((contentNode) => leftDiv.append(contentNode));
          centerDiv.append(leftDiv);
          currentLeftDivContent = []; // Clear buffer
        }

        ul.append(li);
      } else if (child.nodeName === 'UL') {
        // This is a sub-menu for the most recent main nav trigger
        const lastLi = ul.lastElementChild;
        if (lastLi) {
          const megaMenu = lastLi.querySelector('.mega-menu');
          const centerDiv = megaMenu.querySelector('.center-div');
          if (megaMenu && centerDiv) {
            const subNavWrap = document.createElement('div');
            subNavWrap.classList.add('sub-nav-wrap');
            const linkText = lastLi.querySelector('a')?.textContent.toLowerCase();

            if (linkText.includes('about us')) {
              subNavWrap.classList.add('about-us-sub-nav');
            } else if (linkText.includes('what we do')) {
              subNavWrap.classList.add('what-we-do');
            } else if (linkText.includes('investor relations')) {
              subNavWrap.classList.add('element-block');
              const singleLinkUl = document.createElement('ul');
              singleLinkUl.classList.add('sub-nav-wrap-one-link');
              const firstLi = child.firstElementChild;
              if (firstLi) {
                singleLinkUl.append(firstLi.cloneNode(true));
                child.removeChild(firstLi);
              }
              subNavWrap.append(singleLinkUl);

              const innerSubNavWrapList = document.createElement('div');
              innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
              const clonedUl1 = document.createElement('ul');
              const clonedUl2 = document.createElement('ul');
              const items = Array.from(child.children);
              items.forEach((item, index) => {
                if (index < Math.ceil(items.length / 2)) {
                  clonedUl1.append(item.cloneNode(true));
                } else {
                  clonedUl2.append(item.cloneNode(true));
                }
              });
              innerSubNavWrapList.append(clonedUl1);
              innerSubNavWrapList.append(clonedUl2);
              subNavWrap.append(innerSubNavWrapList);
              centerDiv.append(subNavWrap);
              return;
            } else if (linkText.includes('careers')) {
              subNavWrap.classList.add('careers-div');
            }
            centerDiv.append(subNavWrap);

            const processNestedUl = (parentUl, targetElement) => {
              Array.from(parentUl.children).forEach((liElement) => {
                const newLi = document.createElement('li');
                newLi.classList.add('top-level-li');

                const liLink = liElement.querySelector('a');
                if (liLink) {
                  newLi.append(liLink.cloneNode(true));
                } else {
                  const textNode = getImmediateText(liElement);
                  if (textNode) {
                    const tempA = document.createElement('a');
                    tempA.textContent = textNode;
                    newLi.append(tempA);
                  }
                }

                const nestedUl = liElement.querySelector('ul');
                if (nestedUl) {
                  const span = document.createElement('span');
                  span.innerHTML = CHEVRON_SVG;
                  newLi.append(span);

                  const hasSubChild = document.createElement('div');
                  hasSubChild.classList.add('has-sub-child');
                  hasSubChild.setAttribute('aria-haspopup', 'true');
                  hasSubChild.setAttribute('aria-expanded', 'false');
                  const innerUl = document.createElement('ul');
                  hasSubChild.append(innerUl);
                  newLi.append(hasSubChild);

                  const processInnerNestedUl = (innerParentUl, innerTargetElement) => {
                    Array.from(innerParentUl.children).forEach((innerLiElement) => {
                      const newInnerLi = document.createElement('li');
                      newInnerLi.classList.add('first-level-li');

                      const innerLiLink = innerLiElement.querySelector('a');
                      if (innerLiLink) {
                        newInnerLi.append(innerLiLink.cloneNode(true));
                      } else {
                        const textNode = getImmediateText(innerLiElement);
                        if (textNode) {
                          const tempA = document.createElement('a');
                          tempA.textContent = textNode;
                          newInnerLi.append(tempA);
                        }
                      }

                      const innerNestedUl = innerLiElement.querySelector('ul');
                      if (innerNestedUl) {
                        const innerSpan = document.createElement('span');
                        innerSpan.innerHTML = CHEVRON_SVG;
                        newInnerLi.append(innerSpan);

                        const hasInnerSubChild = document.createElement('div');
                        hasInnerSubChild.classList.add('has-inner-sub-child');
                        hasInnerSubChild.setAttribute('aria-haspopup', 'true');
                        hasInnerSubChild.setAttribute('aria-expanded', 'false');
                        const deepestUl = document.createElement('ul');
                        hasInnerSubChild.append(deepestUl);
                        newInnerLi.append(hasInnerSubChild);
                        Array.from(innerNestedUl.children).forEach((deepLi) => {
                          deepestUl.append(deepLi.cloneNode(true));
                        });
                      }
                      innerTargetElement.append(newInnerLi);
                    });
                  };
                  processInnerNestedUl(nestedUl, innerUl);
                }
                targetElement.append(newLi);
              });
            };

            const newUl = document.createElement('ul');
            processNestedUl(child, newUl);
            subNavWrap.append(newUl);
          }
        }
      } else {
        // Collect other content for left-div
        currentLeftDivContent.push(child.cloneNode(true));
      }
    });
  }
  headerWrap.append(nav);

  // --- Tools Section ---
  if (toolsRow) {
    const toolsWrapper = toolsRow.querySelector('.default-content-wrapper') || toolsRow;
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
    moveInstrumentation(toolsRow, desktopIconNav);

    const mobileIconNav = document.createElement('div');
    mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
    moveInstrumentation(toolsRow, mobileIconNav);

    const desktopUl = document.createElement('ul');
    const mobileUl = document.createElement('ul');

    let mailLink = null;
    let searchLink = null;

    Array.from(toolsWrapper.children).forEach((child) => {
      if (child.nodeName === 'UL') {
        Array.from(child.children).forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            if (link.href.includes('contact-us')) {
              mailLink = link;
            } else if (link.textContent.toLowerCase() === 'search') {
              searchLink = link;
            }
          }
        });
      }
    });

    // Add mail link
    if (mailLink) {
      const desktopMailLi = document.createElement('li');
      desktopMailLi.classList.add('mail');
      const desktopMailA = mailLink.cloneNode(true);
      desktopMailA.innerHTML = MAIL_SVG;
      desktopMailLi.append(desktopMailA);
      desktopUl.append(desktopMailLi);

      const mobileMailLi = document.createElement('li');
      mobileMailLi.classList.add('mail');
      const mobileMailA = mailLink.cloneNode(true);
      // TODO: Make "Contact Us" label dynamic from metadata or block content
      mobileMailA.textContent = 'Contact Us'; // Mobile version has text
      mobileMailLi.append(mobileMailA);
      mobileUl.append(mobileMailLi);
    }

    // Add search link
    if (searchLink) {
      const desktopSearchLi = document.createElement('li');
      desktopSearchLi.classList.add('search');
      desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const desktopSearchA = searchLink.cloneNode(true);
      desktopSearchA.setAttribute('data-once', 'search-stop-propagation');
      desktopSearchA.innerHTML = LENS_SVG + CLOSE_SVG; // Initial state
      desktopSearchA.setAttribute('role', 'button');
      desktopSearchA.setAttribute('aria-label', 'Toggle Search');
      desktopSearchA.setAttribute('aria-expanded', 'false');
      desktopSearchLi.append(desktopSearchA);
      desktopUl.append(desktopSearchLi);

      const mobileSearchLi = document.createElement('li');
      mobileSearchLi.classList.add('search');
      mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
      const mobileSearchA = searchLink.cloneNode(true);
      mobileSearchA.setAttribute('data-once', 'search-stop-propagation');
      mobileSearchA.innerHTML = LENS_SVG + CLOSE_SVG + '<span> Search</span>'; // Mobile version has text
      mobileSearchA.setAttribute('role', 'button');
      mobileSearchA.setAttribute('aria-label', 'Toggle Search');
      mobileSearchA.setAttribute('aria-expanded', 'false');
      mobileSearchLi.append(mobileSearchA);
      mobileUl.append(mobileSearchLi);
    }

    desktopIconNav.append(desktopUl);
    mobileIconNav.append(mobileUl);
    nav.append(mobileIconNav); // Mobile icons inside nav
    headerWrap.append(desktopIconNav); // Desktop icons in header wrap
  }

  // Append the 80th year logo if it exists in the brand row
  if (brandRow) {
    const year80Logo = Array.from(brandRow.querySelectorAll('img')).find(img => img.alt?.includes('80th Year Logo'));
    if (year80Logo) {
      const year80LogoDiv = document.createElement('div');
      year80LogoDiv.classList.add('logo', 'year-80-logo');
      const year80Link = year80Logo.closest('a') ? year80Logo.closest('a').cloneNode(false) : document.createElement('a');
      year80Link.href = year80Logo.closest('a')?.href || 'https://www.mahindra.com/';
      const clonedYear80Logo = year80Logo.cloneNode(true);
      clonedYear80Logo.classList.add('hiddenlogo1', 'years-80');
      year80Link.append(clonedYear80Logo);
      year80LogoDiv.append(year80Link);
      headerWrap.append(year80LogoDiv);
    }
  }

  block.append(docFragment);

  // --- Event Listeners and Final Setup ---
  const navSectionsUl = nav.querySelector('ul');
  setupMobileNavigation(nav, navSectionsUl);
  setupDesktopNavigation(nav, navSectionsUl); // Pass navSectionsUl

  setupSearch(block);

  // Initial state for mobile/desktop
  toggleMenu(nav, navSectionsUl, !isDesktop.matches); // Invert logic: if desktop, forceExpanded=false (closed); if mobile, forceExpanded=true (open)
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSectionsUl, !isDesktop.matches));
}
