import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

const SVG_CHEVRON = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SVG_SEARCH_LENS = '<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>';
const SVG_SEARCH_CLOSE = '<svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>';
const SVG_MAIL = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SVG_SUBMIT_ARROW = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>';

/**
 * Moves instrumentation attributes from an original element to a new element.
 * @param {Element} originalElement The original element.
 * @param {Element} newElement The new element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  [...originalElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-cq-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function setupHamburger(nav, block) {
  if (!nav || !block) return;

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('aria-controls', 'main-navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  moveInstrumentation(block.querySelector('.hamburger'), hamburger); // Assuming a placeholder hamburger might exist in original block
  const ul = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ul.append(document.createElement('li'));
  }
  hamburger.append(ul);

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded ? '' : 'hidden'; // Control body scroll
  });

  // Append hamburger to the wrap, before nav
  const wrap = nav.closest('.wrap');
  if (wrap) {
    wrap.insertBefore(hamburger, nav);
  }

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      nav.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }
  });
}

function createSearchScreen(searchLink, searchFragmentContent) {
  if (!searchLink || !searchFragmentContent) return null;

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(wrapDiv);

  const form = document.createElement('form');
  // Extract action from the fragment's form if available, otherwise use a default
  const fragmentForm = searchFragmentContent.querySelector('form');
  form.action = fragmentForm?.action || 'https://www.mahindra.com/search';
  form.method = fragmentForm?.method || 'get';
  form.id = fragmentForm?.id || 'search-block-form';
  form.setAttribute('accept-charset', fragmentForm?.getAttribute('accept-charset') || 'UTF-8');
  form.setAttribute('data-drupal-form-fields', fragmentForm?.getAttribute('data-drupal-form-fields') || 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');
  wrapDiv.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');
  form.append(searchWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.setAttribute('data-once', 'search-stop-propagation');
  searchIcon.innerHTML = SVG_SEARCH_LENS;
  searchWrap.append(searchIcon);

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('input-text', 'searchtext');
  input.required = true;
  input.name = 'key';
  input.id = 'searchInput';
  input.autocomplete = 'off';
  input.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(input);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  // Get submit button label from fragment if available, otherwise default
  const fragmentSubmitButton = fragmentForm?.querySelector('.submit-button .label');
  const submitLabel = fragmentSubmitButton?.textContent.trim() || 'Submit';
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation">${submitLabel}</div>` + SVG_SUBMIT_ARROW;
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  form.append(searchResultBox);

  // Extract search suggestions from the fragment
  const fragmentSuggestions = searchFragmentContent.querySelectorAll('.search-suggestions-wrap');
  fragmentSuggestions.forEach(suggestionWrap => {
    const clonedSuggestionWrap = suggestionWrap.cloneNode(true);
    clonedSuggestionWrap.setAttribute('data-once', 'search-stop-propagation');
    clonedSuggestionWrap.querySelectorAll('[data-once]').forEach(el => el.setAttribute('data-once', 'search-stop-propagation'));
    wrapDiv.append(clonedSuggestionWrap);
  });

  return searchScreenWrap;
}


function setupTools(toolsRow, nav) {
  if (!toolsRow || !nav) return;

  const toolsWrapper = document.createElement('div');
  toolsWrapper.classList.add('icon-nav', 'desktop-menus-icon');
  moveInstrumentation(toolsRow, toolsWrapper); // Move instrumentation from original toolsRow

  const ul = document.createElement('ul');
  toolsWrapper.append(ul);

  let mailLink = null;
  let searchLink = null;
  let searchFragmentContent = null;

  // Find mail and search links based on their text content or href
  const allLinks = toolsRow.querySelectorAll('a');
  Array.from(allLinks).forEach(link => {
    const text = link.textContent.trim();
    if (text === 'Contact Us') {
      mailLink = link;
    } else if (text === 'Search') {
      searchLink = link;
      // Find the search screen content associated with this search link in the fragment
      searchFragmentContent = link.closest('li')?.querySelector('.search-screen-wrap');
    }
  });

  if (mailLink) {
    const li = document.createElement('li');
    li.classList.add('mail');
    const a = mailLink.cloneNode(true);
    a.innerHTML = SVG_MAIL; // Replace text with SVG
    li.append(a);
    ul.append(li);
    moveInstrumentation(mailLink.closest('li'), li);
  }

  if (searchLink) {
    const li = document.createElement('li');
    li.classList.add('search');
    li.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const a = searchLink.cloneNode(true);
    a.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE; // Add both icons
    a.removeAttribute('href'); // Remove href="#" to prevent default navigation
    a.setAttribute('data-once', 'search-stop-propagation');
    li.append(a);

    const searchScreen = createSearchScreen(searchLink, searchFragmentContent);
    if (searchScreen) {
      li.append(searchScreen);
    }

    ul.append(li);
    moveInstrumentation(searchLink.closest('li'), li);

    // Toggle search screen visibility
    a.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
      if (searchScreen) {
        searchScreen.style.display = li.classList.contains('active') ? 'block' : 'none';
      }
      // Toggle body scroll
      document.body.style.overflowY = li.classList.contains('active') ? 'hidden' : '';
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!li.contains(e.target) && li.classList.contains('active')) {
        li.classList.remove('active');
        if (searchScreen) {
          searchScreen.style.display = 'none';
        }
        document.body.style.overflowY = '';
      }
    });

    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && li.classList.contains('active')) {
        li.classList.remove('active');
        if (searchScreen) {
          searchScreen.style.display = 'none';
        }
        document.body.style.overflowY = '';
      }
    });
  }

  // Create mobile tools icon-nav
  const mobileToolsWrapper = toolsWrapper.cloneNode(true);
  mobileToolsWrapper.classList.remove('desktop-menus-icon');
  mobileToolsWrapper.classList.add('mobile-menus-icon');
  // For mobile, the mail link text is visible, search is icon + text
  const mobileMailLink = mobileToolsWrapper.querySelector('.mail a');
  if (mobileMailLink) {
    mobileMailLink.innerHTML = 'Contact Us'; // Business label, should be from fragment
  }
  const mobileSearchLink = mobileToolsWrapper.querySelector('.search a');
  if (mobileSearchLink) {
    // Get search label from fragment if available, otherwise default
    const searchLabel = searchLink?.textContent.trim() || 'Search';
    mobileSearchLink.innerHTML = SVG_SEARCH_LENS + SVG_SEARCH_CLOSE + `<span> ${searchLabel}</span>`;
  }

  // Append desktop tools to nav
  nav.append(toolsWrapper);
  // Append mobile tools to the main nav UL, as per original HTML structure
  const mainNavUl = nav.querySelector('ul[itemscope]');
  if (mainNavUl) {
    mainNavUl.append(mobileToolsWrapper);
  }
}


function setupDesktopNav(navRow) {
  if (!navRow) return;

  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLeftDivBuffer = [];
  let currentMegaMenuLi = null;

  // Iterate through all direct children of navRow's default-content-wrapper
  const navContentWrapper = navRow.querySelector('.default-content-wrapper') || navRow;
  Array.from(navContentWrapper.children).forEach((child) => {
    // Skip comment nodes
    if (child.nodeType === Node.COMMENT_NODE) {
      return;
    }

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., <p><a href="...">Who We Are</a></p>)
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const anchor = child.querySelector('a');
      if (anchor) {
        const clonedAnchor = anchor.cloneNode(true);
        clonedAnchor.setAttribute('itemprop', 'url');
        li.append(clonedAnchor);
      }

      const span = document.createElement('span');
      span.innerHTML = SVG_CHEVRON;
      li.append(span);

      currentMegaMenuLi = li; // Set the current li for mega-menu content

      // Append any buffered content to the previous mega-menu's left-div if it exists
      if (currentLeftDivBuffer.length > 0 && mainNavUl.lastElementChild) {
        const prevMegaMenu = mainNavUl.lastElementChild.querySelector('.mega-menu');
        if (prevMegaMenu) {
          const prevCenterDiv = prevMegaMenu.querySelector('.center-div');
          if (prevCenterDiv) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const prevMenuTitle = mainNavUl.lastElementChild.querySelector('a')?.textContent.trim() || 'untitled';
            leftDiv.classList.add(sanitizeClassName(prevMenuTitle) + '-left-div');

            currentLeftDivBuffer.forEach(bufferedNode => {
              leftDiv.append(bufferedNode.cloneNode(true));
            });
            prevCenterDiv.prepend(leftDiv); // Prepend to maintain order
          }
        }
      }
      currentLeftDivBuffer = []; // Clear buffer for the new mega-menu

      mainNavUl.append(li);
    } else if (currentMegaMenuLi) {
      // If we are currently processing a mega-menu, buffer its content
      currentLeftDivBuffer.push(child);
    }
  });

  // After iterating through all children, process the last buffered content
  if (currentLeftDivBuffer.length > 0 && currentMegaMenuLi) {
    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const wrapContainer = document.createElement('div');
    wrapContainer.classList.add('wrap', 'container');
    megaMenu.append(wrapContainer);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    wrapContainer.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const menuTitle = currentMegaMenuLi.querySelector('a')?.textContent.trim() || 'untitled';
    leftDiv.classList.add(sanitizeClassName(menuTitle) + '-left-div');

    currentLeftDivBuffer.forEach(bufferedNode => {
      // Special handling for lists in the left-div
      if (bufferedNode.tagName === 'UL') {
        Array.from(bufferedNode.children).forEach(liItem => {
          if (liItem.textContent.includes('span')) { // Check for the pattern "TEXT span NUMBER TEXT"
            const textParts = liItem.innerHTML.split('<span>');
            if (textParts.length > 1) {
              const value = textParts[0].trim();
              const label = `<span>${textParts[1]}`;
              const newLi = document.createElement('li');
              newLi.classList.add('list-text-red');
              newLi.innerHTML = `${value} ${label}`;
              leftDiv.append(newLi);
            } else {
              leftDiv.append(liItem.cloneNode(true));
            }
          } else {
            leftDiv.append(liItem.cloneNode(true));
          }
        });
      } else {
        leftDiv.append(bufferedNode.cloneNode(true));
      }
    });
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    // Now, we need to find the actual submenu content for the currentMegaMenuLi
    // This part is tricky because the fragment structure is not strictly `p` then `ul`
    // It could be `p`, then `div` containing multiple `ul`s or other elements.
    // We need to look at the *original* navRow content to find the corresponding submenu.
    const originalAnchor = navContentWrapper.querySelector(`a[href="${currentMegaMenuLi.querySelector('a').href}"]`);
    let subMenuContent = null;
    if (originalAnchor) {
      let sibling = originalAnchor.closest('p').nextElementSibling;
      while (sibling && sibling.nodeType === Node.COMMENT_NODE) {
        sibling = sibling.nextElementSibling;
      }
      if (sibling && (sibling.tagName === 'UL' || sibling.tagName === 'DIV')) {
        subMenuContent = sibling;
      }
    }

    const processSubmenu = (menuElement, parentUl) => {
      Array.from(menuElement.children).forEach(menuItem => {
        if (menuItem.tagName === 'LI') {
          const liItem = document.createElement('li');
          const itemLink = menuItem.querySelector('a');
          let itemText = '';
          if (itemLink) {
            liItem.append(itemLink.cloneNode(true));
            itemText = itemLink.textContent.trim();
          } else {
            itemText = Array.from(menuItem.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
              .map(node => node.textContent.trim())
              .join('');
            if (itemText) {
              const tempSpan = document.createElement('span');
              tempSpan.textContent = itemText;
              liItem.append(tempSpan);
            }
          }

          const nestedUl = menuItem.querySelector('ul');
          if (nestedUl) {
            liItem.classList.add('top-level-li');
            const innerSpan = document.createElement('span');
            innerSpan.innerHTML = SVG_CHEVRON;
            liItem.append(innerSpan);

            const hasSubChildDiv = document.createElement('div');
            hasSubChildDiv.classList.add('has-sub-child');
            const innerUl = document.createElement('ul');
            hasSubChildDiv.append(innerUl);
            processSubmenu(nestedUl, innerUl);
            liItem.append(hasSubChildDiv);

            innerSpan.addEventListener('click', (e) => {
              e.stopPropagation();
              hasSubChildDiv.classList.toggle('active');
            });
          } else if (itemLink && itemLink.closest('ul') === menuElement) {
            liItem.classList.add('first-level-li');
          }
          parentUl.append(liItem);
        } else {
          // Append non-LI elements directly to subNavWrap if they are direct children of the submenu content
          // This handles cases like the newsroom's latest-two-press-release div
          if (menuElement === subMenuContent) {
            subNavWrap.append(menuItem.cloneNode(true));
          }
        }
      });
    };

    if (subMenuContent) {
      if (subMenuContent.tagName === 'UL') {
        const firstUl = document.createElement('ul');
        processSubmenu(subMenuContent, firstUl);
        subNavWrap.append(firstUl);
      } else if (subMenuContent.tagName === 'DIV') {
        // Handle complex structures like the Investor Relations section or Newsroom
        Array.from(subMenuContent.children).forEach(sectionChild => {
          if (sectionChild.tagName === 'UL') {
            const newUl = document.createElement('ul');
            processSubmenu(sectionChild, newUl);
            subNavWrap.append(newUl);
          } else {
            // Append other elements directly, e.g., for newsroom press releases
            subNavWrap.append(sectionChild.cloneNode(true));
          }
        });
      }
    }
    currentMegaMenuLi.append(megaMenu);
  }

  navRow.innerHTML = ''; // Clear original navRow content
  navRow.append(mainNavUl);
}


function setupBrand(brandRow, nav) {
  if (!brandRow || !nav) return;

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  moveInstrumentation(brandRow.firstElementChild, logoDiv); // Assuming first child of brandRow has instrumentation

  const link = brandRow.querySelector('a');
  if (link) {
    const clonedLink = link.cloneNode(true);
    logoDiv.append(clonedLink);
  } else {
    // If no link, just append the picture/image directly
    const picture = brandRow.querySelector('picture');
    if (picture) {
      logoDiv.append(picture.cloneNode(true));
    }
  }
  nav.prepend(logoDiv);
}


/**
 * Parses the fragment HTML into structured rows.
 * @param {Element} fragment The loaded fragment DOM.
 * @returns {object} An object containing brandRow, navRow, and toolsRow elements.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter(node => node.nodeType === Node.ELEMENT_NODE);
  const structure = {
    brandRow: null,
    navRow: null,
    toolsRow: null,
  };

  if (children.length >= 1) {
    structure.brandRow = children[0].querySelector('.default-content-wrapper') || children[0];
  }
  if (children.length >= 2) {
    structure.navRow = children[1].querySelector('.default-content-wrapper') || children[1];
  }
  if (children.length >= 3) {
    structure.toolsRow = children[2].querySelector('.default-content-wrapper') || children[2];
  }
  return structure;
}

export default async function decorate(block) {
  block.classList.add('main-header'); // Add main header class to the block itself

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return;
  }

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  block.append(headerContainer);
  moveInstrumentation(block, headerContainer); // Move instrumentation from block to container

  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');
  headerContainer.append(headerWrap);

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav
  nav.setAttribute('id', 'main-navigation'); // ID for aria-controls
  headerWrap.append(nav);

  // Setup Brand, Nav, and Tools sections
  if (brandRow) {
    setupBrand(brandRow, nav);
  }

  // Hamburger setup, needs to be after brand and before nav in the wrap
  setupHamburger(nav, block);

  if (navRow) {
    // Clone navRow content to process without modifying original fragment directly
    const tempNavSections = navRow.cloneNode(true);
    setupDesktopNav(tempNavSections);
    nav.append(tempNavSections.querySelector('ul')); // Append the processed UL to the nav
  }

  if (toolsRow) {
    setupTools(toolsRow, nav);
  }

  // Add the 80th year logo if it exists in the original HTML (hardcoded for now as it's not in fragment)
  // This should ideally come from the fragment or be a separate block.
  // For now, keeping it as is, but flagging it as a potential hardcoding issue if it's dynamic content.
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/'; // Hardcoded URL
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp'; // Hardcoded image URL
  year80Img.alt = '80th Year Logo Gold'; // Hardcoded alt text
  year80Img.title = '80thYearLogo_Gold'; // Hardcoded title
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.width = '74';
  year80Img.height = '60';
  year80Img.loading = 'lazy';
  year80Link.append(year80Img);
  year80LogoDiv.append(year80Link);
  headerWrap.append(year80LogoDiv); // Append after nav
}
