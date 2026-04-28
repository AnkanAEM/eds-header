import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

// Utility function to move instrumentation attributes
function moveInstrumentation(sourceElement, targetElement) {
  if (!sourceElement || !targetElement) return;
  Array.from(sourceElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-once') || attr.name.startsWith('data-drupal') || attr.name.startsWith('data-aos') || attr.name.startsWith('data-bs')) {
      targetElement.setAttribute(attr.name, attr.value);
    }
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSectionExpanded = nav.querySelector('.main-nav > ul > li.has-child.is-active');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.classList.remove('is-active');
      navSectionExpanded.querySelector('.mega-menu')?.removeAttribute('style');
      navSectionExpanded.querySelector('a')?.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
      nav.closest('.wrap')?.querySelector('.hamburger')?.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav || nav.contains(e.relatedTarget)) return;

  const navSectionExpanded = nav.querySelector('.main-nav > ul > li.has-child.is-active');
  if (navSectionExpanded && isDesktop.matches) {
    navSectionExpanded.classList.remove('is-active');
    navSectionExpanded.querySelector('.mega-menu')?.removeAttribute('style');
  } else if (!isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
  }
}

function setupDropdownToggle(navItem, isMobile = false) {
  if (!navItem) return;

  const trigger = navItem.querySelector('a');
  const dropdown = navItem.querySelector('.mega-menu');
  const chevron = navItem.querySelector('span svg'); // Assuming the SVG is the chevron

  if (!trigger || !dropdown || !chevron) return;

  const toggleDropdown = (e) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing due to parent click listener
      const isActive = navItem.classList.contains('is-active');
      navItem.classList.toggle('is-active', !isActive);
      dropdown.style.display = isActive ? 'block' : 'none'; // Toggle display for mobile
      chevron.style.transform = isActive ? 'rotate(-90deg)' : 'rotate(90deg)'; // Rotate chevron for mobile
    } else if (isDesktop.matches) {
      e.preventDefault();
      const wasActive = navItem.classList.contains('is-active');
      // Close all other open dropdowns
      navItem.closest('ul').querySelectorAll('li.has-child.is-active').forEach((openItem) => {
        if (openItem !== navItem) {
          openItem.classList.remove('is-active');
          openItem.querySelector('.mega-menu')?.removeAttribute('style');
        }
      });
      navItem.classList.toggle('is-active', !wasActive);
      // For desktop, CSS handles visibility, but we can manage pointer-events if needed
      if (!wasActive) {
        dropdown.style.pointerEvents = 'all';
      } else {
        dropdown.removeAttribute('style');
      }
    }
  };

  if (isMobile) {
    // For mobile, the entire navItem acts as a toggle
    navItem.addEventListener('click', toggleDropdown);
  } else {
    // For desktop, hover handles the primary toggle, click for accessibility
    trigger.addEventListener('click', toggleDropdown);
    navItem.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        navItem.classList.add('is-active');
        dropdown.style.pointerEvents = 'all';
      }
    });
    navItem.addEventListener('mouseleave', () => {
      if (isDesktop.matches && !navItem.classList.contains('stay-open')) { // Add a class for sticky open if needed
        navItem.classList.remove('is-active');
        dropdown.removeAttribute('style');
      }
    });
  }
}


/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.closest('.wrap')?.querySelector('.hamburger');
  const navSections = nav.querySelector('.main-nav');

  if (!hamburger || !navSections) return;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  // Toggle 'is-active' class on navSections for mobile menu visibility
  navSections.classList.toggle('is-active', expanded);

  // Close all sub-menus when the main menu is toggled
  navSections.querySelectorAll('.has-child.is-active').forEach((item) => {
    item.classList.remove('is-active');
    item.querySelector('.mega-menu')?.removeAttribute('style');
  });

  // enable menu collapse on escape keypress
  if (expanded || isDesktop.matches) { // Only add listener if menu is open or desktop
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createChevronSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g1.setAttribute('id', 'SVGRepo_bgCarrier');
  g1.setAttribute('stroke-width', '0');
  svg.append(g1);

  const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g2.setAttribute('id', 'SVGRepo_tracerCarrier');
  g2.setAttribute('stroke-linecap', 'round');
  g2.setAttribute('stroke-linejoin', 'round');
  g2.setAttribute('stroke', '#CCCCCC');
  g2.setAttribute('stroke-width', '0.30321600000000004');
  svg.append(g2);

  const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g3.setAttribute('id', 'SVGRepo_iconCarrier');
  g3.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('d', 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z');
  path.setAttribute('fill', '#030408');
  g3.append(path);
  svg.append(g3);

  return svg;
}

function sanitizeClassName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter(
    (child) => child.tagName === 'DIV' && !child.textContent.trim().startsWith('<!--cq'),
  );

  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify Brand Row: first section with a picture or image
  brandRow = sections.find((section) => section.querySelector('picture, img'));
  if (brandRow && brandRow.querySelector('.default-content-wrapper')) {
    brandRow = brandRow.querySelector('.default-content-wrapper');
  }

  // Identify Nav Row: section with highest UL density
  let maxUlCount = -1;
  sections.forEach((section) => {
    const ulCount = section.querySelectorAll('ul').length;
    if (ulCount > maxUlCount) {
      maxUlCount = ulCount;
      navRow = section;
    }
  });
  if (navRow && navRow.querySelector('.default-content-wrapper')) {
    navRow = navRow.querySelector('.default-content-wrapper');
  }

  // Identify Tools Row: remaining section(s) with social links or utility links
  const socialRegex = /facebook|twitter|linkedin|youtube|instagram/i;
  toolsRow = sections.find((section) => {
    const sectionHtml = section.innerHTML.toLowerCase();
    return socialRegex.test(sectionHtml) || sectionHtml.includes('contact us') || sectionHtml.includes('search');
  });
  if (toolsRow && toolsRow.querySelector('.default-content-wrapper')) {
    toolsRow = toolsRow.querySelector('.default-content-wrapper');
  }

  return { brandRow, navRow, toolsRow };
}

function setupBrand(brandRow, block) {
  if (!brandRow) return;

  const container = document.createElement('div');
  container.classList.add('container');
  moveInstrumentation(brandRow.closest('div'), container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const brandLink = brandRow.querySelector('a');
  if (brandLink) {
    const logoLink = document.createElement('a');
    logoLink.href = brandLink.href;
    moveInstrumentation(brandLink, logoLink);
    logoDiv.append(logoLink);

    const img = brandRow.querySelector('picture img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.title = img.title || '';
      newImg.loading = 'lazy';
      // Copy classes from original image
      if (img.classList.length > 0) {
        newImg.classList.add(...img.classList);
      } else {
        newImg.classList.add('hiddenlogo1'); // Default class if none found
      }
      moveInstrumentation(img, newImg);
      logoLink.append(newImg);
    }
  }

  block.append(container);
  return { container, wrap };
}

function setupHamburger(wrap, nav) {
  if (!wrap || !nav) return;

  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  moveInstrumentation(wrap, hamburgerDiv); // Inherit data-once from wrap if applicable

  const ul = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ul.append(document.createElement('li'));
  }
  hamburgerDiv.append(ul);

  hamburgerDiv.addEventListener('click', () => toggleMenu(nav, !nav.classList.contains('is-active')));
  wrap.append(hamburgerDiv);
}

function setupDesktopNav(navRow, navElement) {
  if (!navRow || !navElement) return;

  const navUL = document.createElement('ul');
  navUL.setAttribute('itemscope', '');
  navUL.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  moveInstrumentation(navRow, navUL); // Inherit data-once from navRow if applicable

  let currentBuffer = [];

  // Helper to process a menu item and its mega-menu
  const processMenuItem = (triggerElement, menuUl) => {
    if (!triggerElement || !menuUl) return;

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    moveInstrumentation(triggerElement, li);

    const link = triggerElement.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent.trim();
      newLink.setAttribute('itemprop', 'url');
      moveInstrumentation(link, newLink);
      li.append(newLink);
    } else {
      // If no <a>, just use the text content as a non-link trigger
      const spanText = document.createElement('span');
      spanText.textContent = triggerElement.textContent.trim();
      li.append(spanText);
    }

    const chevronSpan = document.createElement('span');
    chevronSpan.append(createChevronSVG());
    li.append(chevronSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.append(megaMenu);

    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    // Flush buffer into left-div
    if (currentBuffer.length > 0) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      const titleText = link ? link.textContent.trim() : triggerElement.textContent.trim();
      const sanitizedClass = sanitizeClassName(titleText);
      if (sanitizedClass) leftDiv.classList.add(`${sanitizedClass}-left-div`);

      const leftDivHeading = document.createElement('h4');
      leftDivHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = titleText;
      if (link) headingLink.href = link.href;
      leftDivHeading.append(headingLink);
      leftDiv.append(leftDivHeading);

      currentBuffer.forEach((bufferedEl) => {
        // Ensure only content elements are moved, not empty p tags or comments
        if (bufferedEl.tagName !== 'P' || bufferedEl.textContent.trim() !== '') {
          leftDiv.append(bufferedEl);
        }
      });
      centerDiv.append(leftDiv);
      currentBuffer = []; // Clear buffer after flushing
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    // Recursively process nested ULs
    const processNestedUL = (currentUl, parentEl) => {
      if (!currentUl || !parentEl) return;

      Array.from(currentUl.children).forEach((childLi) => {
        if (childLi.tagName !== 'LI') return;

        const nestedLi = document.createElement('li');
        moveInstrumentation(childLi, nestedLi);

        const childLink = childLi.querySelector('a');
        if (childLink) {
          const newChildLink = document.createElement('a');
          newChildLink.href = childLink.href;
          newChildLink.textContent = childLink.textContent.trim();
          moveInstrumentation(childLink, newChildLink);
          nestedLi.append(newChildLink);
        } else {
          // If no <a>, just use the text content
          const spanText = document.createElement('span');
          spanText.textContent = childLi.textContent.split('\n')[0].trim(); // Get immediate text
          nestedLi.append(spanText);
        }

        const nestedUl = childLi.querySelector('ul');
        if (nestedUl) {
          nestedLi.classList.add('top-level-li'); // For first level nested
          const nestedChevronSpan = document.createElement('span');
          nestedChevronSpan.append(createChevronSVG());
          nestedLi.append(nestedChevronSpan);

          const innerSubChildDiv = document.createElement('div');
          innerSubChildDiv.classList.add('has-sub-child');
          nestedLi.append(innerSubChildDiv);

          const innerUl = document.createElement('ul');
          innerSubChildDiv.append(innerUl);
          processNestedUL(nestedUl, innerUl);

          // Add click listener for mobile expansion
          nestedLi.addEventListener('click', (e) => {
            if (!isDesktop.matches) {
              e.preventDefault();
              e.stopPropagation();
              innerSubChildDiv.classList.toggle('active');
              nestedChevronSpan.querySelector('svg').style.transform = innerSubChildDiv.classList.contains('active') ? 'rotate(-180deg)' : 'rotate(90deg)';
            }
          });
        }
        parentEl.append(nestedLi);
      });
    };

    const topLevelUL = document.createElement('ul');
    subNavWrap.append(topLevelUL);
    processNestedUL(menuUl, topLevelUL);

    // Add mobile toggle behavior
    li.addEventListener('click', (e) => {
      if (!isDesktop.matches) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent parent menu from closing
        li.classList.toggle('is-active');
        megaMenu.style.display = li.classList.contains('is-active') ? 'block' : 'none';
        chevronSpan.querySelector('svg').style.transform = li.classList.contains('is-active') ? 'rotate(-90deg)' : 'rotate(90deg)';
      }
    });

    navUL.append(li);
    setupDropdownToggle(li); // Setup desktop hover/click behavior
  };

  // Iterate through navRow children to find triggers and menus
  Array.from(navRow.children).forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a menu trigger (e.g., <p><a href="...">Menu Title</a></p>)
      const menuTrigger = child;
      let nextSibling = menuTrigger.nextElementSibling;
      while (nextSibling && nextSibling.tagName === 'P' && !nextSibling.querySelector('a')) {
        currentBuffer.push(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
      }
      if (nextSibling && nextSibling.tagName === 'UL') {
        processMenuItem(menuTrigger, nextSibling);
        moveInstrumentation(menuTrigger, navUL);
        moveInstrumentation(nextSibling, navUL);
      }
    } else if (child.tagName !== 'UL') {
      // Collect other non-UL elements into the buffer
      currentBuffer.push(child);
    }
  });

  navElement.append(navUL);
}


function setupTools(toolsRow, navElement, wrap) {
  if (!toolsRow || !navElement || !wrap) return;

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  moveInstrumentation(toolsRow, mobileIconNav); // Inherit instrumentation from toolsRow

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  moveInstrumentation(toolsRow, desktopIconNav); // Inherit instrumentation from toolsRow

  const mobileUl = document.createElement('ul');
  const desktopUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);
  desktopIconNav.append(desktopUl);

  const socialLinksUl = toolsRow.querySelector('ul');
  const utilityLinksUl = socialLinksUl?.nextElementSibling?.tagName === 'UL' ? socialLinksUl.nextElementSibling : null;

  // Process utility links (Contact Us, Search)
  if (utilityLinksUl) {
    Array.from(utilityLinksUl.children).forEach((li) => {
      const link = li.querySelector('a');
      if (!link) return;

      const mobileLi = document.createElement('li');
      const desktopLi = document.createElement('li');
      moveInstrumentation(li, mobileLi);
      moveInstrumentation(li, desktopLi);

      const linkText = link.textContent.trim();
      if (linkText.toLowerCase() === 'contact us') {
        mobileLi.classList.add('mail');
        desktopLi.classList.add('mail');
        const mobileLink = document.createElement('a');
        mobileLink.href = link.href;
        mobileLink.textContent = 'Contact Us'; // Hardcoded from original HTML for mobile
        mobileLi.append(mobileLink);

        const desktopLink = document.createElement('a');
        desktopLink.href = link.href;
        desktopLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
          C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
          L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
        </svg>`;
        desktopLi.append(desktopLink);
      } else if (linkText.toLowerCase() === 'search') {
        mobileLi.classList.add('search');
        desktopLi.classList.add('search');
        mobileLi.setAttribute('data-once', 'search-toggle search-stop-propagation'); // From original HTML
        desktopLi.setAttribute('data-once', 'search-toggle search-stop-propagation'); // From original HTML

        const createSearchScreenWrap = () => {
          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
          // moveInstrumentation(li, searchScreenWrap); // Instrumentation moved to individual elements

          const searchWrapInner = document.createElement('div');
          searchWrapInner.classList.add('wrap');
          searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
          searchScreenWrap.append(searchWrapInner);

          // Search form
          const searchForm = document.createElement('form');
          searchForm.action = 'https://www.mahindra.com/search';
          searchForm.method = 'get';
          searchForm.id = 'search-block-form';
          searchForm.setAttribute('accept-charset', 'UTF-8');
          searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
          searchForm.setAttribute('data-once', 'search-stop-propagation');
          searchWrapInner.append(searchForm);

          const searchInputWrap = document.createElement('div');
          searchInputWrap.classList.add('search-wrap');
          searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
          searchForm.append(searchInputWrap);

          const searchIconDiv = document.createElement('div');
          searchIconDiv.classList.add('search-icon');
          searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
          searchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
            <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
          </svg>`;
          searchInputWrap.append(searchIconDiv);

          const searchInput = document.createElement('input');
          searchInput.type = 'text';
          searchInput.classList.add('input-text', 'searchtext');
          searchInput.required = true;
          searchInput.name = 'key';
          searchInput.id = 'searchInput';
          searchInput.autocomplete = 'off';
          searchInput.setAttribute('data-once', 'search-stop-propagation');
          searchInputWrap.append(searchInput);

          const submitButton = document.createElement('button');
          submitButton.classList.add('submit-button');
          submitButton.setAttribute('data-once', 'search-stop-propagation');
          submitButton.type = 'submit'; // Ensure it's a submit button
          submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
              <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
            </svg>`;
          searchInputWrap.append(submitButton);

          // Search Result Box (empty for now)
          const searchResultBox = document.createElement('div');
          searchResultBox.classList.add('searchResultBox');
          searchResultBox.style.display = 'none';
          searchResultBox.setAttribute('data-once', 'search-stop-propagation');
          searchForm.append(searchResultBox);

          // Search suggestions (Popular Keywords)
          const popularKeywordsWrap = document.createElement('div');
          popularKeywordsWrap.classList.add('search-suggestions-wrap');
          popularKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
          popularKeywordsWrap.innerHTML = `<div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
            <div class="tokens-wrap" data-once="search-stop-propagation">
              <ul data-once="search-stop-propagation">
                <li data-once="search-stop-propagation">Business</li>
                <li data-once="search-stop-propagation">FY 21</li>
                <li data-once="search-stop-propagation">Brands</li>
                <li data-once="search-stop-propagation">XUV700</li>
                <li data-once="search-stop-propagation">Global</li>
                <li data-once="search-stop-propagation">Nanhi Kali</li>
              </ul>
            </div>`;
          searchWrapInner.append(popularKeywordsWrap);

          // Search suggestions (Recommended for you)
          const recommendedWrap = document.createElement('div');
          recommendedWrap.classList.add('search-suggestions-wrap');
          recommendedWrap.setAttribute('data-once', 'search-stop-propagation');
          recommendedWrap.innerHTML = `<div class="label" data-once="search-stop-propagation">Recommended for you:</div>
            <div class="tokens-wrap" data-once="search-stop-propagation">
              <ul data-once="search-stop-propagation">
                <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
                <li data-once="search-stop-propagation">Leadership Announcement</li>
                <li data-once="search-stop-propagation">Latest Press Release</li>
                <li data-once="search-stop-propagation">Brand Guidelines</li>
              </ul>
            </div>`;
          searchWrapInner.append(recommendedWrap);
          return searchScreenWrap;
        };

        const createSearchLinkContent = (isMobileVersion, searchScreenWrap) => {
          const searchLink = document.createElement('a');
          searchLink.href = '#';
          searchLink.setAttribute('data-once', 'search-stop-propagation');

          searchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
            <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
            </svg>
            <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
            </svg>`;
          if (isMobileVersion) {
            const span = document.createElement('span');
            span.textContent = ' Search';
            span.setAttribute('data-once', 'search-stop-propagation');
            searchLink.append(span);
          }

          // Event listener for search toggle
          searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent document click from closing immediately
            const parentLi = searchLink.closest('li.search');
            const isActive = parentLi.classList.toggle('is-active'); // Toggle state on the li
            searchScreenWrap.style.opacity = isActive ? '1' : '0';
            searchScreenWrap.style.pointerEvents = isActive ? 'all' : 'none';
            searchScreenWrap.style.zIndex = isActive ? '1' : '-1';
            const lensIcon = searchLink.querySelector('.lens');
            const closeIcon = searchLink.querySelector('.close');
            if (lensIcon && closeIcon) {
              lensIcon.style.display = isActive ? 'none' : 'block';
              closeIcon.style.display = isActive ? 'block' : 'none';
            }
            if (isActive) {
              searchScreenWrap.querySelector('input.searchtext').focus();
              const closeSearch = (docClickEvt) => {
                if (!searchScreenWrap.contains(docClickEvt.target) && docClickEvt.target !== searchLink && !searchLink.contains(docClickEvt.target)) {
                  parentLi.classList.remove('is-active');
                  searchScreenWrap.style.opacity = '0';
                  searchScreenWrap.style.pointerEvents = 'none';
                  searchScreenWrap.style.zIndex = '-1';
                  if (lensIcon && closeIcon) {
                    lensIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                  }
                  document.removeEventListener('click', closeSearch);
                }
              };
              document.addEventListener('click', closeSearch);
            }
          });
          return searchLink;
        };

        const mobileSearchScreenWrap = createSearchScreenWrap();
        const desktopSearchScreenWrap = createSearchScreenWrap();

        mobileLi.append(createSearchLinkContent(true, mobileSearchScreenWrap));
        mobileLi.append(mobileSearchScreenWrap);

        desktopLi.append(createSearchLinkContent(false, desktopSearchScreenWrap));
        desktopLi.append(desktopSearchScreenWrap);
      }
      mobileUl.append(mobileLi);
      desktopUl.append(desktopLi);
    });
  }

  navElement.append(mobileIconNav);
  navElement.append(desktopIconNav);
}

function setupYear80Logo(wrap) {
  if (!wrap) return;

  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  moveInstrumentation(wrap, year80LogoDiv);

  const link = document.createElement('a');
  link.href = 'https://www.mahindra.com/';
  year80LogoDiv.append(link);

  const img = document.createElement('img');
  img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  img.alt = '80th Year Logo Gold';
  img.title = '80thYearLogo_Gold';
  img.classList.add('hiddenlogo1', 'years-80');
  img.loading = 'lazy';
  link.append(img);
  wrap.append(year80LogoDiv);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from original HTML
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.textContent = '';
    return;
  }

  // Create a DocumentFragment for batch DOM operations
  const fragmentContainer = document.createDocumentFragment();

  // Create main nav element
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  const { container, wrap } = setupBrand(brandRow, fragmentContainer);
  setupHamburger(wrap, nav);

  if (navRow) {
    setupDesktopNav(navRow, nav);
  }

  if (toolsRow) {
    setupTools(toolsRow, nav, wrap);
  }

  wrap.append(nav); // Append nav to the wrap
  setupYear80Logo(wrap); // Append 80-year logo after nav

  // Append the constructed header to the block
  block.append(fragmentContainer);

  // Final state-heavy initialization
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
}

