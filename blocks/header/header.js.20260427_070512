import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on original HTML media queries

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"> <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" /> </svg>';
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"> <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path> </svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"> <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path> </svg>';
const SEARCH_SUBMIT_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"> <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path> </svg>';

/**
 * Parses the fragment into distinct structural rows.
 * @param {Element} fragment The fragment DOM.
 * @returns {object} An object containing the brand, nav, and tools rows.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  // Identify Brand Row: contains a picture or img
  brandRow = sections.find((s) => s.querySelector('p > picture, img'));

  // Identify Nav Row: contains a button-like link and a ul
  // This assumes the main navigation UL is a direct child of a section,
  // and that section also contains the primary nav links (P > A).
  navRow = sections.find((s) => s.querySelector('p > a') && s.querySelector('ul'));

  // Identify Tools Row: contains social links or contact us link
  toolsRow = sections.find((s) =>
    s.querySelector('a[href*="contact-us"]') || s.querySelector('a[href="#"]')
  );

  return { brandRow, navRow, toolsRow };
}

/**
 * Toggles the mobile menu's expanded state.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 * @param {boolean} forceExpanded Forces the expanded state, or null to toggle.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // Toggle all mega-menus and sub-menus
  navSections.querySelectorAll('.has-child, .has-sub-child, .has-inner-sub-child').forEach((el) => {
    el.classList.remove('active', 'active-child');
    el.setAttribute('aria-expanded', 'false');
    const submenu = el.querySelector('.mega-menu, ul');
    if (submenu && submenu.classList.contains('mega-menu')) {
      submenu.style.display = 'none';
    }
  });

  if (!expanded && !isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Closes the menu on escape key press.
 * @param {KeyboardEvent} e The keyboard event.
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('nav > ul'); // Corrected selector
    if (!nav || !navSections) return;

    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
      const hamburger = nav.querySelector('.hamburger');
      if (hamburger) hamburger.focus();
    }
  }
}

/**
 * Closes the menu if focus leaves the navigation.
 * @param {FocusEvent} e The focus event.
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('nav > ul'); // Corrected selector
    if (!nav || !navSections) return;
    if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Sets up the desktop navigation interactions.
 * @param {Element} navSections The nav sections container.
 */
function setupDesktopNav(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      li.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          li.classList.add('active');
          li.setAttribute('aria-expanded', 'true');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          li.classList.remove('active');
          li.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // For nested sub-menus, desktop behavior is usually hover-based as well.
  // The original HTML implies these are only active on mobile, but for completeness,
  // if they were to activate on desktop, similar hover logic would apply.
  // For now, we'll assume desktop only uses the top-level mega-menu hover.
}

/**
 * Sets up the mobile navigation interactions.
 * @param {Element} nav The main nav element.
 * @param {Element} navSections The nav sections container.
 * @param {Element} toolsRow The tools row fragment content for dynamic data.
 */
function setupMobileNav(nav, navSections, toolsRow) {
  if (!nav || !navSections || !toolsRow) return;

  const hamburger = nav.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  }

  // Append tools to nav sections for mobile
  const mobileMenusIcon = nav.querySelector('.mobile-menus-icon');
  if (mobileMenusIcon) {
    mobileMenusIcon.innerHTML = ''; // Clear existing content
    const ul = document.createElement('ul');

    const mailLi = document.createElement('li');
    mailLi.classList.add('mail');
    const contactLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactLink) {
      const mailLink = document.createElement('a');
      mailLink.href = contactLink.href;
      mailLink.innerHTML = MAIL_SVG + `<span> ${contactLink.textContent}</span>`; // Use fragment text
      mailLi.append(mailLink);
    }
    ul.append(mailLi);

    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    const searchLink = toolsRow.querySelector('a[href="#"]');
    if (searchLink) {
      const searchAnchor = document.createElement('a');
      searchAnchor.href = '#';
      searchAnchor.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG + `<span> ${searchLink.textContent}</span>`;
      searchLi.append(searchAnchor);

      const searchScreenWrap = createSearchScreen(toolsRow);
      searchLi.append(searchScreenWrap);

      searchLi.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchLi.classList.toggle('active');
        searchScreenWrap.style.display = searchLi.classList.contains('active') ? 'block' : 'none';
        searchScreenWrap.style.opacity = searchLi.classList.contains('active') ? '1' : '0';
        searchScreenWrap.style.pointerEvents = searchLi.classList.contains('active') ? 'all' : 'none';
        searchScreenWrap.style.transform = searchLi.classList.contains('active') ? 'translate(0,0rem)' : 'translate(0,0)';
      });
    }
    ul.append(searchLi);
    mobileMenusIcon.append(ul);
  }

  // Mobile toggle for main nav items with children
  navSections.querySelectorAll('li.has-child > span').forEach((span) => {
    const li = span.closest('li.has-child');
    if (!li) return;

    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = li.classList.toggle('active');
        li.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        megaMenu.style.display = isActive ? 'block' : 'none';
      });
    }
  });

  // Mobile toggle for sub-menus (has-sub-child)
  navSections.querySelectorAll('.has-sub-child > ul > li > span').forEach((span) => {
    const li = span.closest('li'); // This is the LI containing the sub-menu link and span
    const parentUl = li.closest('.has-sub-child'); // The div that wraps the UL
    if (!li || !parentUl) return;

    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = parentUl.classList.toggle('active');
      parentUl.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  });

  // Mobile toggle for inner-sub-menus (has-inner-sub-child)
  navSections.querySelectorAll('.has-inner-sub-child > ul > li > span').forEach((span) => {
    const li = span.closest('li'); // This is the LI containing the inner-sub-menu link and span
    const parentDiv = li.closest('.has-inner-sub-child'); // The div that wraps the UL
    if (!li || !parentDiv) return;

    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = parentDiv.classList.toggle('active-child');
      parentDiv.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  });
}

/**
 * Sets up accessibility attributes for navigation elements.
 * @param {Element} navSections The nav sections container.
 */
function setupAccessibility(navSections) {
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child, .has-sub-child, .has-inner-sub-child').forEach((li) => {
    li.setAttribute('aria-haspopup', 'true');
    li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Creates the search screen element.
 * @param {Element} toolsRow The nav tools container fragment content.
 * @returns {Element} The search screen wrap element.
 */
function createSearchScreen(toolsRow) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  searchScreenWrap.append(wrapDiv);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search'; // From original HTML
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  wrapDiv.append(searchForm);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchForm.append(searchWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.innerHTML = SEARCH_LENS_SVG;
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
  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = 'Submit'; // Hardcoded in original HTML
  submitButton.append(submitLabel);
  submitButton.innerHTML += SEARCH_SUBMIT_SVG;
  searchWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initially hidden
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
      </div>
    </div>
    <div class="swiper-scrollbar"></div>
  `;
  searchForm.append(searchResultBox);

  // Popular Keywords (from original HTML, assuming it's the first UL in toolsRow)
  const popularKeywordsSection = toolsRow.children[0]; // Assuming first child is the popular keywords section
  if (popularKeywordsSection && popularKeywordsSection.tagName === 'DIV' && popularKeywordsSection.querySelector('ul')) {
    const keywordsWrap = document.createElement('div');
    keywordsWrap.classList.add('search-suggestions-wrap');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.textContent = popularKeywordsSection.querySelector('p')?.textContent || 'Popular Keywords:'; // Dynamic label
    keywordsWrap.append(labelDiv);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    const ul = document.createElement('ul');
    Array.from(popularKeywordsSection.querySelectorAll('li')).forEach((li) => {
      const newLi = document.createElement('li');
      newLi.textContent = li.textContent;
      ul.append(newLi);
    });
    tokensWrap.append(ul);
    keywordsWrap.append(tokensWrap);
    wrapDiv.append(keywordsWrap);
  }

  // Recommended for you (from original HTML, assuming it's the second UL in toolsRow)
  const recommendedForYouSection = toolsRow.children[1]; // Assuming second child is the recommended section
  if (recommendedForYouSection && recommendedForYouSection.tagName === 'DIV' && recommendedForYouSection.querySelector('ul')) {
    const recommendedWrap = document.createElement('div');
    recommendedWrap.classList.add('search-suggestions-wrap');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.textContent = recommendedForYouSection.querySelector('p')?.textContent || 'Recommended for you:'; // Dynamic label
    recommendedWrap.append(labelDiv);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    const ul = document.createElement('ul');
    Array.from(recommendedForYouSection.querySelectorAll('li')).forEach((li) => {
      const newLi = document.createElement('li');
      newLi.textContent = li.textContent;
      ul.append(newLi);
    });
    tokensWrap.append(ul);
    recommendedWrap.append(tokensWrap);
    wrapDiv.append(recommendedWrap);
  }

  return searchScreenWrap;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav'); // Add main-nav class from original HTML

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Create main header container
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');
  headerContainer.append(headerWrap);
  block.append(headerContainer);

  // --- Brand Row (nav-brand) ---
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand', 'logo'); // Add logo class from original HTML
  if (brandRow) {
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture img');
    if (brandLink && brandImg) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      const img = document.createElement('img');
      img.src = brandImg.src;
      img.alt = brandImg.alt;
      img.title = brandImg.title;
      img.classList.add('hiddenlogo1'); // Add hiddenlogo1 class
      img.width = '200'; // Default width from original
      img.height = '30'; // Default height from original
      img.style.width = 'auto';
      img.loading = 'lazy';
      a.append(img);
      navBrand.append(a);
    }
  }
  headerWrap.append(navBrand);

  // --- Hamburger for Mobile ---
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  headerWrap.append(hamburger);

  // --- Nav Sections (main navigation) ---
  const navSections = document.createElement('ul');
  navSections.setAttribute('itemscope', '');
  navSections.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  if (navRow) {
    let currentLi = null;
    let leftDivContentBuffer = [];

    Array.from(navRow.children).forEach((child) => {
      const link = child.querySelector('a') || (child.tagName === 'A' ? child : null);
      const isPrimaryNavLink = link && child.tagName === 'P'; // Primary nav links are wrapped in P tags in fragment

      if (isPrimaryNavLink) {
        // Flush buffer to previous mega-menu if exists
        if (currentLi && leftDivContentBuffer.length > 0) {
          const megaMenu = currentLi.querySelector('.mega-menu');
          if (megaMenu) {
            let centerDiv = megaMenu.querySelector('.center-div');
            if (!centerDiv) {
              centerDiv = document.createElement('div');
              centerDiv.classList.add('center-div');
              megaMenu.querySelector('.wrap.container').append(centerDiv);
            }
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            // Generate semantic class for left-div
            const title = currentLi.querySelector('a').textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            leftDiv.classList.add(`${title}-left-div`);

            const heading = document.createElement('h4');
            heading.classList.add('left-div-heading');
            const headingLink = document.createElement('a');
            headingLink.textContent = currentLi.querySelector('a').textContent; // Use the primary nav link's text
            heading.append(headingLink);
            leftDiv.append(heading);

            leftDivContentBuffer.forEach((content) => leftDiv.append(content));
            centerDiv.prepend(leftDiv);
          }
          leftDivContentBuffer = []; // Clear buffer
        }

        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');

        const primaryLink = document.createElement('a');
        primaryLink.setAttribute('itemprop', 'url');
        primaryLink.href = link.href;
        primaryLink.textContent = link.textContent;
        currentLi.append(primaryLink);

        const span = document.createElement('span');
        span.innerHTML = CHEVRON_SVG;
        currentLi.append(span);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);
        megaMenu.append(megaMenuWrap);
        currentLi.append(megaMenu);

        navSections.append(currentLi);
      } else if (currentLi) {
        // Collect non-primary-nav-link siblings (like ULs, paragraphs, images)
        if (child.tagName === 'UL') {
          let subNavWrap = currentLi.querySelector('.sub-nav-wrap');
          if (!subNavWrap) {
            subNavWrap = document.createElement('div');
            subNavWrap.classList.add('sub-nav-wrap');
            currentLi.querySelector('.center-div').append(subNavWrap);
          }

          const clonedUl = child.cloneNode(true);
          const processNestedUl = (ulElement, level = 0) => {
            Array.from(ulElement.children).forEach((li) => {
              const liLink = li.querySelector('a') || (li.tagName === 'A' ? li : null);
              const nestedUl = li.querySelector('ul');
              if (nestedUl) {
                li.classList.add(level === 0 ? 'top-level-li' : 'first-level-li');
                const span = document.createElement('span');
                span.innerHTML = CHEVRON_SVG;
                li.append(span);

                const subChildDiv = document.createElement('div');
                subChildDiv.classList.add(level === 0 ? 'has-sub-child' : 'has-inner-sub-child');
                subChildDiv.append(nestedUl);
                li.append(subChildDiv);
                processNestedUl(nestedUl, level + 1);
              } else if (liLink) {
                li.classList.add(level === 0 ? 'top-level-li' : 'first-level-li');
              }
            });
          };
          processNestedUl(clonedUl);
          subNavWrap.append(clonedUl);
        } else {
          leftDivContentBuffer.push(child.cloneNode(true));
        }
      }
    });

    // Flush any remaining buffer for the last item
    if (currentLi && leftDivContentBuffer.length > 0) {
      const megaMenu = currentLi.querySelector('.mega-menu');
      if (megaMenu) {
        let centerDiv = megaMenu.querySelector('.center-div');
        if (!centerDiv) {
          centerDiv = document.createElement('div');
          centerDiv.classList.add('center-div');
          megaMenu.querySelector('.wrap.container').append(centerDiv);
        }
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const title = currentLi.querySelector('a').textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${title}-left-div`);

        const heading = document.createElement('h4');
        heading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = currentLi.querySelector('a').textContent;
        heading.append(headingLink);
        leftDiv.append(heading);

        leftDivContentBuffer.forEach((content) => leftDiv.append(content));
        centerDiv.prepend(leftDiv);
      }
    }
  }
  nav.append(navSections);

  // --- Tools Row (desktop) ---
  const desktopMenusIcon = document.createElement('div');
  desktopMenusIcon.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');

  if (toolsRow) {
    const contactUsLink = toolsRow.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      const mailLi = document.createElement('li');
      mailLi.classList.add('mail');
      const mailLink = document.createElement('a');
      mailLink.href = contactUsLink.href;
      mailLink.innerHTML = MAIL_SVG;
      mailLi.append(mailLink);
      desktopUl.append(mailLi);
    }

    const searchLink = toolsRow.querySelector('a[href="#"]');
    if (searchLink) {
      const searchLi = document.createElement('li');
      searchLi.classList.add('search');
      const searchAnchor = document.createElement('a');
      searchAnchor.href = '#';
      searchAnchor.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
      searchLi.append(searchAnchor);

      const searchScreenWrap = createSearchScreen(toolsRow); // Create search screen
      searchLi.append(searchScreenWrap);

      searchLi.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchLi.classList.toggle('active');
        searchScreenWrap.style.opacity = searchLi.classList.contains('active') ? '1' : '0';
        searchScreenWrap.style.pointerEvents = searchLi.classList.contains('active') ? 'all' : 'none';
        searchScreenWrap.style.transform = searchLi.classList.contains('active') ? 'translate(0,0rem)' : 'translate(0,0)';
      });
      desktopUl.append(searchLi);
    }
  }
  desktopMenusIcon.append(desktopUl);
  nav.append(desktopMenusIcon);

  // --- Tools Row (mobile) ---
  const mobileMenusIcon = document.createElement('div');
  mobileMenusIcon.classList.add('icon-nav', 'mobile-menus-icon');
  nav.append(mobileMenusIcon); // Append empty, content will be added by setupMobileNav

  // Append 80th year logo from original HTML
  const year80Logo = document.createElement('div');
  year80Logo.classList.add('logo', 'year-80-logo');
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
  year80Logo.append(year80Link);
  headerWrap.append(year80Logo);

  headerWrap.append(nav); // Append the fully constructed nav to the header wrap

  // Final setup calls
  setupDesktopNav(navSections);
  setupMobileNav(nav, navSections, toolsRow);
  setupAccessibility(navSections);

  // Initial menu state
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
}
