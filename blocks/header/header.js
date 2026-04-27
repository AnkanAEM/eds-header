import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

// Utility function to safely append children
function appendChildren(parent, children) {
  if (!parent || !children) return;
  children.forEach((child) => {
    if (child) parent.append(child);
  });
}

// Utility function to get direct text content of an element, avoiding children's text
function getDirectTextContent(element) {
  if (!element) return '';
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

/**
 * Parses the fragment into logical sections: brand, nav, and tools.
 * @param {Element} fragment The loaded HTML fragment.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed sections.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);

  const getSectionContent = (section) => {
    const wrapper = section.querySelector('.default-content-wrapper');
    return wrapper || section;
  };

  const brandRow = sections[0] ? getSectionContent(sections[0]) : null;
  const navRow = sections[1] ? getSectionContent(sections[1]) : null;
  const toolsRow = sections[2] ? getSectionContent(sections[2]) : null;

  return { brandRow, navRow, toolsRow };
}

/**
 * Creates the SVG for the chevron icon.
 * @returns {SVGElement} The SVG element.
 */
function createChevronSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'Group_65');
  g.setAttribute('data-name', 'Group 65');
  g.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z');
  path.setAttribute('fill', '#030408');
  g.append(path);
  svg.append(g);
  return svg;
}

/**
 * Creates the SVG for the mail icon.
 * @returns {SVGElement} The SVG element.
 */
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
  svg.append(path);
  return svg;
}

/**
 * Creates the SVG for the search lens icon.
 * @returns {SVGElement} The SVG element.
 */
function createSearchLensSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');
  svg.classList.add('lens');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
  path.setAttribute('stroke-width', '0.25');
  svg.append(path);
  return svg;
}

/**
 * Creates the SVG for the search close icon.
 * @returns {SVGElement} The SVG element.
 */
function createSearchCloseSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 50 50');
  svg.classList.add('close');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
  svg.append(path);
  return svg;
}

/**
 * Creates the SVG for the submit arrow icon.
 * @returns {SVGElement} The SVG element.
 */
function createSubmitArrowSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '12');
  svg.setAttribute('height', '8');
  svg.setAttribute('viewBox', '0 0 12 8');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
  path.setAttribute('fill', 'black');
  svg.append(path);
  return svg;
}

/**
 * Sets up the brand logo and link.
 * @param {Element} brandRow The brand section element from the fragment.
 * @returns {Element} The decorated logo div.
 */
function setupBrand(brandRow) {
  if (!brandRow) return null;

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const picture = brandRow.querySelector('picture');
  const link = brandRow.querySelector('a');

  if (link && picture) {
    link.textContent = ''; // Clear existing text if any
    link.append(picture);
    logoDiv.append(link);
  } else if (picture) {
    // If no link, just append the picture
    logoDiv.append(picture);
  }

  return logoDiv;
}

/**
 * Recursively processes UL/LI structure for navigation.
 * @param {HTMLUListElement} ulElement The UL element to process.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function processNavList(ulElement) {
  if (!ulElement) return null;

  const newUl = document.createElement('ul');
  // Copy itemprop and itemtype if they exist on the original UL
  if (ulElement.hasAttribute('itemscope')) newUl.setAttribute('itemscope', '');
  if (ulElement.hasAttribute('itemtype')) newUl.setAttribute('itemtype', ulElement.getAttribute('itemtype'));

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE || li.tagName !== 'LI') return;

    const newLi = document.createElement('li');
    // Copy itemprop if it exists on the original LI
    if (li.hasAttribute('itemprop')) newLi.setAttribute('itemprop', li.getAttribute('itemprop'));

    const directLink = li.querySelector(':scope > a');
    const nestedUl = li.querySelector(':scope > ul');
    const directTextNodes = Array.from(li.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);

    if (directLink) {
      newLi.append(directLink.cloneNode(true)); // Clone to avoid moving it from original fragment
    } else if (directTextNodes.length > 0) {
      // If no direct link but has text, create a span for it
      const span = document.createElement('span');
      span.textContent = directTextNodes.map(node => node.textContent.trim()).join(' ');
      newLi.append(span);
    }

    if (nestedUl) {
      newLi.classList.add('has-child'); // Add class if it has a submenu
      const chevronSpan = document.createElement('span');
      chevronSpan.append(createChevronSVG());
      newLi.append(chevronSpan);

      const subMenuWrapper = document.createElement('div');
      subMenuWrapper.classList.add('has-sub-child');
      subMenuWrapper.append(processNavList(nestedUl)); // Recursively process nested UL
      newLi.append(subMenuWrapper);

      // Add click listener for mobile expansion
      chevronSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent parent LI from also toggling
        newLi.classList.toggle('active');
        subMenuWrapper.classList.toggle('active');
        // For nested sub-children, also toggle 'active-child'
        const innerSubChild = subMenuWrapper.querySelector('.has-inner-sub-child');
        if (innerSubChild) {
          innerSubChild.classList.toggle('active-child');
        }
      });
    }

    newUl.append(newLi);
  });
  return newUl;
}


/**
 * Sets up the main desktop navigation.
 * @param {Element} navRow The navigation section element from the fragment.
 * @returns {Element} The decorated main nav element.
 */
function setupDesktopNav(navRow) {
  if (!navRow) return null;

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  let currentLeftDivContent = [];
  let currentMegaMenu = null;
  let currentMegaMenuLi = null;

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;

    // Check if this child is a main navigation trigger (a <p> tag containing an <a>)
    const isNavTrigger = child.tagName === 'P' && child.querySelector('a');

    if (isNavTrigger) {
      // If there was buffered content, and no mega-menu was active, it means it's
      // content before the first nav item or standalone content.
      // For this header, we assume left-div content is always associated with a mega-menu.
      // So, if currentLeftDivContent has items, it should be for the *previous* mega-menu.
      // However, given the structure, it seems left-div content directly follows the trigger.
      // We need to ensure it's captured for the *current* mega-menu.

      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const link = child.querySelector('a').cloneNode(true);
      li.append(link);

      const chevronSpan = document.createElement('span');
      chevronSpan.append(createChevronSVG());
      li.append(chevronSpan);

      currentMegaMenu = document.createElement('div');
      currentMegaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      megaMenuWrap.append(centerDiv);
      currentMegaMenu.append(megaMenuWrap);
      li.append(currentMegaMenu);

      navUl.append(li);
      currentMegaMenuLi = li; // Keep track of the current LI for later appending

      // Reset buffer for the new mega-menu
      currentLeftDivContent = [];
    } else if (currentMegaMenu && currentMegaMenuLi) {
      // This content belongs to the current mega-menu
      const centerDiv = currentMegaMenu.querySelector('.center-div');

      // Check if it's a left-div content (h4, p, ul with list-text-red)
      const isLeftDivContent = child.tagName === 'H4' || child.tagName === 'P' || (child.tagName === 'UL' && child.querySelector('li.list-text-red'));

      if (isLeftDivContent) {
        currentLeftDivContent.push(child.cloneNode(true));
      } else if (child.tagName === 'UL') {
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');

        const parentLinkText = currentMegaMenuLi.querySelector('a')?.textContent?.toLowerCase();

        // Special handling for 'what we do' and 'careers' based on original HTML
        if (parentLinkText === 'what we do') {
          subNavWrap.classList.add('what-we-do');
          // The 'what we do' section has a nested UL structure that processNavList handles,
          // but the top-level LIs might have specific classes like 'top-level-li'
          // and direct children that are not ULs (like 'Our Brands', 'Global Presence').
          // We need to ensure these are processed correctly.
          const processedUl = processNavList(child);
          if (processedUl) {
            // Check for specific classes on the top-level LIs
            Array.from(processedUl.children).forEach(li => {
              const originalLi = Array.from(child.children).find(orig => orig.textContent.trim() === li.textContent.trim());
              if (originalLi && originalLi.classList.contains('top-level-li')) {
                li.classList.add('top-level-li');
              }
            });
            subNavWrap.append(processedUl);
          }
        } else if (parentLinkText === 'careers') {
          subNavWrap.classList.add('careers-div');
          const processedUl = processNavList(child);
          if (processedUl) {
            Array.from(processedUl.children).forEach(li => {
              const originalLi = Array.from(child.children).find(orig => orig.textContent.trim() === li.textContent.trim());
              if (originalLi && originalLi.classList.contains('top-level-li')) {
                li.classList.add('top-level-li');
              }
            });
            subNavWrap.append(processedUl);
          }
        } else if (parentLinkText === 'investor relations') {
          subNavWrap.classList.add('element-block'); // For IR, it's block display
          const firstLi = child.querySelector('li');
          if (firstLi && firstLi.querySelector('a[href*="Disclosures"]')) {
            const oneLinkUl = document.createElement('ul');
            oneLinkUl.classList.add('sub-nav-wrap-one-link');
            oneLinkUl.append(firstLi.cloneNode(true));
            subNavWrap.append(oneLinkUl);

            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
            const remainingLis = Array.from(child.children).slice(1);
            // Group remaining LIs into two Uls as per original HTML
            const ul1 = document.createElement('ul');
            const ul2 = document.createElement('ul');
            remainingLis.forEach((li, index) => {
              if (index < 2) ul1.append(li.cloneNode(true));
              else ul2.append(li.cloneNode(true));
            });
            innerSubNavWrapList.append(ul1);
            innerSubNavWrapList.append(ul2); // Unchained append
            subNavWrap.append(innerSubNavWrapList); // Unchained append
          } else {
            // Default handling if the specific structure isn't found
            subNavWrap.append(processNavList(child));
          }
        } else if (parentLinkText === 'newsroom') {
          // Newsroom has two ULs side-by-side
          const newsUl = document.createElement('ul');
          const newsUl2 = document.createElement('ul');
          Array.from(child.children).forEach((li, index) => {
            if (index < 2) newsUl.append(li.cloneNode(true));
            else newsUl2.append(li.cloneNode(true));
          });
          subNavWrap.append(newsUl);
          subNavWrap.append(newsUl2); // Unchained append
        } else {
          subNavWrap.append(processNavList(child));
        }
        centerDiv.append(subNavWrap);
      } else if (child.tagName === 'DIV' && child.classList.contains('slides')) {
        // This is the newsroom slides content, which goes into the left-div
        currentLeftDivContent.push(child.cloneNode(true));
      }
    }

    // After processing a child, if we have buffered left-div content and a current mega-menu,
    // append it to the left-div. This ensures the left-div content is correctly associated
    // with its preceding nav trigger.
    if (isNavTrigger || (child === navRow.lastElementChild && currentMegaMenu)) {
      if (currentLeftDivContent.length > 0 && currentMegaMenu) {
        let leftDiv = currentMegaMenu.querySelector('.center-div > .left-div');
        if (!leftDiv) {
          leftDiv = document.createElement('div');
          leftDiv.classList.add('left-div');
          const title = currentMegaMenuLi.querySelector('a')?.textContent?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          if (title) {
            leftDiv.classList.add(`${title}-left-div`);
          }
          currentMegaMenu.querySelector('.center-div').prepend(leftDiv);
        }
        appendChildren(leftDiv, currentLeftDivContent);
        currentLeftDivContent = []; // Clear buffer
      }
    }
  });

  mainNav.append(navUl);
  return mainNav;
}


/**
 * Sets up the utility tools (contact, search, social).
 * @param {Element} toolsRow The tools section element from the fragment.
 * @returns {Element} The decorated tools div.
 */
function setupTools(toolsRow) {
  if (!toolsRow) return { desktopIconNav: null, mobileIconNav: null };

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIconNav.append(desktopUl);

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);

  const lists = Array.from(toolsRow.querySelectorAll('ul'));

  // First UL is assumed to be social links (not rendered in header for this design)
  // Second UL is assumed to be contact and search
  const utilityList = lists[1];
  if (utilityList) {
    Array.from(utilityList.children).forEach((li) => {
      const link = li.querySelector('a');
      if (!link) return;

      const newLiDesktop = document.createElement('li');
      const newLiMobile = document.createElement('li');

      if (link.textContent.toLowerCase() === 'contact us') {
        newLiDesktop.classList.add('mail');
        newLiMobile.classList.add('mail');

        const desktopLink = link.cloneNode(true);
        desktopLink.textContent = ''; // Clear text for desktop icon
        desktopLink.append(createMailSVG());
        newLiDesktop.append(desktopLink);

        const mobileLink = link.cloneNode(true);
        newLiMobile.append(mobileLink); // Keep text for mobile
      } else if (link.textContent.toLowerCase() === 'search') {
        newLiDesktop.classList.add('search');
        newLiMobile.classList.add('search');
        newLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
        newLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');

        const desktopSearchLink = link.cloneNode(true);
        desktopSearchLink.textContent = ''; // Clear text for desktop icon
        desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
        desktopSearchLink.append(createSearchLensSVG());
        desktopSearchLink.append(createSearchCloseSVG()); // Unchained append
        newLiDesktop.append(desktopSearchLink);

        const mobileSearchLink = link.cloneNode(true);
        mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
        const mobileSearchSpan = document.createElement('span');
        mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
        mobileSearchSpan.textContent = ` ${link.textContent}`; // Use dynamic text for mobile
        mobileSearchLink.textContent = ''; // Clear original text
        mobileSearchLink.append(createSearchLensSVG());
        mobileSearchLink.append(createSearchCloseSVG()); // Unchained append
        mobileSearchLink.append(mobileSearchSpan); // Unchained append
        newLiMobile.append(mobileSearchLink);

        // Create and append the search screen wrap for both desktop and mobile
        const searchScreenWrap = createSearchScreenWrap(toolsRow); // Pass toolsRow to extract keywords
        newLiDesktop.append(searchScreenWrap.cloneNode(true));
        newLiMobile.append(searchScreenWrap.cloneNode(true));
      }
      desktopUl.append(newLiDesktop);
      mobileUl.append(newLiMobile);
    });
  }
  return { desktopIconNav, mobileIconNav };
}

/**
 * Creates the search screen wrap element, populating keywords dynamically.
 * @param {Element} toolsRow The tools section element from the fragment to extract keywords.
 * @returns {Element} The search screen wrap div.
 */
function createSearchScreenWrap(toolsRow) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  wrapDiv.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(wrapDiv);

  const searchForm = document.createElement('form');
  searchForm.setAttribute('action', toolsRow.querySelector('form')?.getAttribute('action') || '/search'); // Dynamic action
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('id', 'search-block-form');
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchForm.setAttribute('data-once', 'search-stop-propagation');
  wrapDiv.append(searchForm);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.append(createSearchLensSVG()); // Reusing search lens SVG
  searchWrap.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.setAttribute('required', '');
  searchInput.setAttribute('name', 'key');
  searchInput.setAttribute('id', 'searchInput');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  const labelDiv = document.createElement('div');
  labelDiv.classList.add('label');
  labelDiv.setAttribute('data-once', 'search-stop-propagation');
  labelDiv.textContent = toolsRow.querySelector('.submit-button .label')?.textContent || 'Submit'; // Dynamic label
  submitButton.append(labelDiv);
  submitButton.append(createSubmitArrowSVG()); // Unchained append
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.setAttribute('style', 'display: none;');
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper" data-once="search-stop-propagation">
      <div class="swiper-wrapper" data-once="search-stop-propagation">
        <div class="swiper-slide" data-once="search-stop-propagation">
        </div>
      </div>
    </div>
    <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
  `;
  searchForm.append(searchResultBox);

  // Populate Popular Keywords and Recommended for you sections dynamically from fragment
  const searchSuggestions = toolsRow.querySelectorAll('.search-suggestions-wrap');
  searchSuggestions.forEach((suggestionWrap) => {
    const newSuggestionWrap = document.createElement('div');
    newSuggestionWrap.classList.add('search-suggestions-wrap');
    newSuggestionWrap.setAttribute('data-once', 'search-stop-propagation');

    const label = suggestionWrap.querySelector('.label');
    if (label) {
      const newLabel = document.createElement('div');
      newLabel.classList.add('label');
      newLabel.setAttribute('data-once', 'search-stop-propagation');
      newLabel.textContent = label.textContent;
      newSuggestionWrap.append(newLabel);
    }

    const tokensWrap = suggestionWrap.querySelector('.tokens-wrap');
    if (tokensWrap) {
      const newTokensWrap = document.createElement('div');
      newTokensWrap.classList.add('tokens-wrap');
      newTokensWrap.setAttribute('data-once', 'search-stop-propagation');
      const ul = document.createElement('ul');
      ul.setAttribute('data-once', 'search-stop-propagation');
      Array.from(tokensWrap.querySelectorAll('li')).forEach((li) => {
        const newLi = document.createElement('li');
        newLi.setAttribute('data-once', 'search-stop-propagation');
        newLi.textContent = li.textContent;
        ul.append(newLi);
      });
      newTokensWrap.append(ul);
      newSuggestionWrap.append(newTokensWrap);
    }
    wrapDiv.append(newSuggestionWrap);
  });

  return searchScreenWrap;
}


/**
 * Toggles the mobile menu.
 * @param {Element} nav The navigation element.
 * @param {boolean} forceExpanded Optional boolean to force expand/collapse state.
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';

  const hamburger = nav.closest('.wrap').querySelector('.hamburger');
  if (hamburger) {
    if (expanded) {
      hamburger.classList.remove('active');
    } else {
      hamburger.classList.add('active');
    }
  }
}

/**
 * Toggles search screen visibility.
 * @param {Element} searchLi The search LI element.
 * @param {boolean} forceExpanded Optional boolean to force expand/collapse state.
 */
function toggleSearchScreen(searchLi, forceExpanded = null) {
  if (!searchLi) return;

  const searchScreen = searchLi.querySelector('.search-screen-wrap');
  const searchLink = searchLi.querySelector('a');
  if (!searchScreen || !searchLink) return;

  const isCurrentlyExpanded = searchScreen.style.display === 'block';
  const shouldExpand = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded;

  if (shouldExpand) {
    searchScreen.style.display = 'block';
    searchLink.querySelector('.lens').style.display = 'none';
    searchLink.querySelector('.close').style.display = 'block';
    searchLink.setAttribute('aria-expanded', 'true');
  } else {
    searchScreen.style.display = 'none';
    searchLink.querySelector('.lens').style.display = 'block';
    searchLink.querySelector('.close').style.display = 'none';
    searchLink.setAttribute('aria-expanded', 'false');
  }
}


export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = ''; // Clear the block content initially

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand
  const logoDiv = setupBrand(brandRow);
  if (logoDiv) {
    wrap.append(logoDiv);
  }

  // Add hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.innerHTML = `
    <ul>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  `;
  wrap.append(hamburger);

  // 2. Setup Desktop Navigation
  const mainNav = setupDesktopNav(navRow);
  if (mainNav) {
    wrap.append(mainNav);
  }

  // 3. Setup Tools (Contact, Search)
  const { desktopIconNav, mobileIconNav } = setupTools(toolsRow);
  if (desktopIconNav) {
    mainNav.append(desktopIconNav); // Desktop icons are part of mainNav
  }
  if (mobileIconNav) {
    mainNav.prepend(mobileIconNav); // Mobile icons are prepended to mainNav
  }

  // Add 80th year logo if present in the original HTML structure but not in fragment
  // Assuming it's a static element for now, if not in fragment.
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  year80LogoDiv.innerHTML = `
    <a href="https://www.mahindra.com/">
      <img src="https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp" alt="80th Year Logo Gold" title="80thYearLogo_Gold" class="hiddenlogo1 years-80" width="74" height="60" loading="lazy">
    </a>
  `;
  wrap.append(year80LogoDiv);

  block.append(header);

  // Event Listeners for interactivity
  if (mainNav) {
    mainNav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav

    // Mobile Hamburger Toggle
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu(mainNav);
    });

    // Close mobile menu on nav item click
    mainNav.querySelectorAll('.main-nav > ul > li > a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!isDesktop.matches) {
          toggleMobileMenu(mainNav, false); // Collapse menu
        }
      });
    });

    // Desktop hover for mega-menu
    if (isDesktop.matches) {
      mainNav.querySelectorAll('.main-nav > ul > li.has-child').forEach((li) => {
        const megaMenu = li.querySelector('.mega-menu');
        if (megaMenu) {
          li.addEventListener('mouseenter', () => {
            megaMenu.style.opacity = '1';
            megaMenu.style.pointerEvents = 'all';
            megaMenu.style.transform = 'translate(0,0)';
            li.setAttribute('aria-expanded', 'true');
          });
          li.addEventListener('mouseleave', () => {
            megaMenu.style.opacity = '0';
            megaMenu.style.pointerEvents = 'none';
            megaMenu.style.transform = 'translate(0,0)'; // Reset transform
            li.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    // Toggle sub-child menus on mobile
    mainNav.querySelectorAll('.has-sub-child').forEach((subChild) => {
      const parentLi = subChild.closest('li');
      const chevron = parentLi?.querySelector(':scope > span');
      if (chevron && !isDesktop.matches) {
        chevron.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          parentLi.classList.toggle('active');
          subChild.classList.toggle('active');
          parentLi.setAttribute('aria-expanded', parentLi.classList.contains('active') ? 'true' : 'false');
          // For nested sub-children, also toggle 'active-child'
          const innerSubChild = subChild.querySelector('.has-inner-sub-child');
          if (innerSubChild) {
            innerSubChild.classList.toggle('active-child');
          }
        });
      }
    });

    // Toggle inner-sub-child menus on mobile
    mainNav.querySelectorAll('.has-inner-sub-child').forEach((innerSubChild) => {
      const parentLi = innerSubChild.closest('li');
      const chevron = parentLi?.querySelector(':scope > span');
      if (chevron && !isDesktop.matches) {
        chevron.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          parentLi.classList.toggle('active');
          innerSubChild.classList.toggle('active-child');
          parentLi.setAttribute('aria-expanded', parentLi.classList.contains('active') ? 'true' : 'false');
        });
      }
    });
  }

  // Search Toggle
  const searchLis = wrap.querySelectorAll('.icon-nav .search');
  searchLis.forEach((searchLi) => {
    const searchLink = searchLi.querySelector('a');
    if (searchLink) {
      searchLink.setAttribute('aria-expanded', 'false'); // Initial state
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent document click from closing immediately
        toggleSearchScreen(searchLi);
      });
    }

    // Close search screen when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchLi.contains(e.target) && searchLi.querySelector('.search-screen-wrap')?.style.display === 'block') {
        toggleSearchScreen(searchLi, false);
      }
    });

    // Close search screen on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchLi.querySelector('.search-screen-wrap')?.style.display === 'block') {
        toggleSearchScreen(searchLi, false);
      }
    });
  });

  // Prevent mobile nav behavior on window resize
  isDesktop.addEventListener('change', () => {
    toggleMobileMenu(mainNav, isDesktop.matches);
    // Ensure search screen is closed on desktop if open from mobile
    searchLis.forEach((searchLi) => {
      if (searchLi.querySelector('.search-screen-wrap')?.style.display === 'block' && isDesktop.matches) {
        toggleSearchScreen(searchLi, false);
      }
    });
  });
}
