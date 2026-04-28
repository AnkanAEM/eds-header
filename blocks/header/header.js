import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Moves instrumentation attributes from an old element to a new one.
 * @param {Element} oldElement The element to move attributes from.
 * @param {Element} newElement The element to move attributes to.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  Array.from(oldElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Parses the fragment into its structural components.
 * @param {Element} fragment The loaded fragment HTML.
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}} The parsed structural rows.
 */
function parseStructure(fragment) {
  const children = Array.from(fragment.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  const brandRow = children[0]?.querySelector('.default-content-wrapper') || children[0];
  const navRow = children[1]?.querySelector('.default-content-wrapper') || children[1];
  const toolsRow = children[2]?.querySelector('.default-content-wrapper') || children[2];
  return { brandRow, navRow, toolsRow };
}

/**
 * Recursively processes a list of navigation items.
 * @param {HTMLUListElement} ul The UL element to process.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function processNavList(ul) {
  if (!ul) return null;
  const newUl = document.createElement('ul');
  newUl.classList.add('inner-ul', 'position-relative', 'ps-0');
  newUl.setAttribute('role', 'menu');

  Array.from(ul.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;

    const newLi = document.createElement('li');
    newLi.classList.add('inner-link', 'row');
    newLi.setAttribute('role', 'presentation');

    const link = li.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'l2_link', 'non-overview_link', 'py-2', 'px-0', 'position-relative', 'analytics-cta-label-class');
      newLink.setAttribute('role', 'menuitem');
      newLink.setAttribute('tabindex', '0');
      newLink.textContent = Array.from(link.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      moveInstrumentation(link, newLink);

      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        newLink.setAttribute('aria-haspopup', 'true');
        newLink.setAttribute('aria-expanded', 'false'); // Initially collapsed
        newLink.setAttribute('data-id', newLink.textContent.trim().replace(/[^a-zA-Z0-9]/g, ''));
        newLi.setAttribute('data-id', newLink.textContent.trim().replace(/[^a-zA-Z0-9]/g, '')); // Set data-id on li for easier lookup

        const divFlex = document.createElement('div');
        divFlex.classList.add('d-flex', 'align-items-center');
        const spanIcon = document.createElement('span');
        spanIcon.classList.add('header-right-arrow-icon');
        divFlex.append(spanIcon);
        newLink.append(divFlex);

        const visuallyHiddenSpan = document.createElement('span');
        visuallyHiddenSpan.classList.add('visually-hidden');
        visuallyHiddenSpan.textContent = 'Press tab for submenu items';
        newLink.append(visuallyHiddenSpan);
      }
      newLi.append(newLink);
    }

    const divider = document.createElement('div');
    divider.classList.add('l3_divinder');
    newLi.append(divider);

    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Processes the nested UL structure for the mega menu's right section.
 * @param {HTMLUListElement} ul The UL element from the fragment.
 * @returns {HTMLUListElement} The decorated UL element.
 */
function processMegaMenuRightList(ul) {
  if (!ul) return null;
  const newUl = document.createElement('ul');
  newUl.classList.add('right-submenu-l3', 'sub-header-content-link-ul', 'position-relative', 'd-none');
  // The data-id should be derived from the parent L2 link, which is set on the LI in processNavList
  // This needs to be handled when appending to linkDataSection, not here.
  // For now, ensure it doesn't break if data-id is not found.
  // The data-id is set in setupDesktopNav when appending to linkDataSection.
  
  Array.from(ul.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;
    const newLi = document.createElement('li');
    newLi.classList.add('l3-li-list');
    const link = li.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.classList.add('l3-li-link', 'analytics-cta-label-class');
      newLink.href = link.href;
      newLink.textContent = link.textContent.trim();
      moveInstrumentation(link, newLink);
      newLi.append(newLink);
    }
    newUl.append(newLi);
  });
  return newUl;
}

/**
 * Sets up the desktop navigation structure.
 * @param {Element} navRow The navigation row from the fragment.
 * @returns {DocumentFragment} The decorated navigation structure.
 */
function setupDesktopNav(navRow) {
  const fragment = document.createDocumentFragment();
  if (!navRow) return fragment;

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbar_links');
  moveInstrumentation(navRow, navbarCollapse);

  const navRoleDiv = document.createElement('div');
  navRoleDiv.setAttribute('role', 'navigation');
  navRoleDiv.setAttribute('aria-label', 'Primary Navigation');

  const navbarNav = document.createElement('ul');
  navbarNav.classList.add('navbar-nav');
  navbarNav.setAttribute('role', 'menu');
  navRoleDiv.append(navbarNav);

  const navItems = Array.from(navRow.children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  let megaMenuIndex = 0;

  for (let i = 0; i < navItems.length; i += 1) {
    const item = navItems[i];
    if (item.tagName === 'P' && item.querySelector('a')) {
      const link = item.querySelector('a');
      const navItemLi = document.createElement('li');
      navItemLi.classList.add('nav-item', 'nav_item_li', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
      navItemLi.setAttribute('role', 'presentation');
      navItemLi.setAttribute('data-nav', `subHeader${megaMenuIndex}`);
      navItemLi.setAttribute('data-nav-link', link.href);

      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'd-block', 'position-relative', 'analytics-cta-label-class');
      navLink.setAttribute('role', 'menuitem');
      navLink.setAttribute('aria-haspopup', 'true');
      navLink.setAttribute('aria-expanded', 'false'); // Initially collapsed
      navLink.setAttribute('tabindex', '0');
      navLink.textContent = link.textContent.trim();
      moveInstrumentation(link, navLink);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('desktop-header-dropdown-icon');
      navLink.append(dropdownIcon);
      navItemLi.append(navLink);

      const navUnderline = document.createElement('span');
      navUnderline.classList.add('nav-underline');
      navItemLi.append(navUnderline);

      navbarNav.append(navItemLi);

      const nextSibling = navItems[i + 1];
      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega_menu', 'pt-32', 'position-absolute', 'set-menu-onscroll');
        megaMenu.setAttribute('data-nav', `subHeader${megaMenuIndex}`);
        megaMenu.setAttribute('aria-hidden', 'true'); // Initially hidden

        const container = document.createElement('div');
        container.classList.add('tcs-custom-container', 'px-0', 'menu_container');
        megaMenu.append(container);

        const row = document.createElement('div');
        row.classList.add('row', 'position-relative', 'mx-0');
        container.append(row);

        const col11 = document.createElement('div');
        col11.classList.add('col-11', 'mega_menu_internal_div');
        row.append(col11);

        const headerInnerLeft = document.createElement('div');
        headerInnerLeft.classList.add('header-inner-left');
        col11.append(headerInnerLeft);

        const subHeaderMainRow = document.createElement('div');
        subHeaderMainRow.classList.add('row', 'sub-header-main-row');
        headerInnerLeft.append(subHeaderMainRow);

        // Left overview section (from the buffer)
        const overviewSection = document.createElement('div');
        overviewSection.classList.add('col-3', 'sub-header-overview-section');
        const overviewContent = document.createElement('div');
        overviewContent.classList.add('sub-header-content', 'sub_header_description', 'd-block');
        overviewSection.append(overviewContent);

        const heading = document.createElement('h3');
        heading.classList.add('font-white', 'main-heading');
        heading.textContent = navLink.textContent.trim(); // Use the main nav link text as heading
        overviewContent.append(heading);

        // Find the p tag and button link from the original fragment for the overview section
        let overviewP = null;
        let overviewCta = null;
        let currentElement = item.nextElementSibling;
        while (currentElement && currentElement !== nextSibling) {
          if (currentElement.tagName === 'P' && !currentElement.querySelector('a')) {
            overviewP = currentElement;
          }
          if (currentElement.tagName === 'P' && currentElement.querySelector('a.button')) {
            overviewCta = currentElement.querySelector('a.button');
          }
          currentElement = currentElement.nextElementSibling;
        }

        if (overviewP) {
          const p = document.createElement('p');
          p.classList.add('normal-content', 'font-grayWhite');
          p.textContent = overviewP.textContent.trim();
          overviewContent.append(p);
        }

        if (overviewCta) {
          const divFlexColumn = document.createElement('div');
          divFlexColumn.classList.add('d-flex', 'flex-column');
          const ctaLink = document.createElement('a');
          ctaLink.href = overviewCta.href;
          ctaLink.classList.add('btn-l3-description', 'btn-responsive', 'analytics-cta-label-class');
          ctaLink.textContent = overviewCta.textContent.trim();
          moveInstrumentation(overviewCta, ctaLink);
          divFlexColumn.append(ctaLink);
          overviewContent.append(divFlexColumn);
        }
        subHeaderMainRow.append(overviewSection);

        const linkSection = document.createElement('div');
        linkSection.classList.add('col-3', 'sub-header-link-section');
        const processedUl = processNavList(nextSibling);
        if (processedUl) {
          linkSection.append(processedUl);
        }
        subHeaderMainRow.append(linkSection);

        const linkDataSection = document.createElement('div');
        linkDataSection.classList.add('col-6', 'sub-header-link-data-section');
        Array.from(nextSibling.children).forEach((li) => {
          if (li.nodeType !== Node.ELEMENT_NODE) return;
          const nestedUl = li.querySelector('ul');
          if (nestedUl) {
            const processedRightUl = processMegaMenuRightList(nestedUl);
            if (processedRightUl) {
              // Ensure data-id is correctly derived from the L2 link's text content
              const l2LinkText = li.querySelector('a')?.textContent.trim().replace(/[^a-zA-Z0-9]/g, '') || '';
              processedRightUl.setAttribute('data-id', l2LinkText);
              linkDataSection.append(processedRightUl);
            }
          }
        });
        subHeaderMainRow.append(linkDataSection);

        const rollover = document.createElement('div');
        rollover.classList.add('sub-header-right-rollover', 'position-absolute', 'd-none');
        row.append(rollover);

        fragment.append(megaMenu);
        i += 1; // Skip the UL/DIV as it's processed
      }
      megaMenuIndex += 1;
    }
  }
  navbarCollapse.append(navRoleDiv);
  fragment.prepend(navbarCollapse);
  return fragment;
}

/**
 * Sets up the tools section (search, language, contact).
 * @param {Element} toolsRow The tools row from the fragment.
 * @returns {DocumentFragment} The decorated tools section.
 */
function setupTools(toolsRow) {
  const fragment = document.createDocumentFragment();
  if (!toolsRow) return fragment;

  // Search
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('ms-auto');
  searchDiv.setAttribute('role', 'search');
  const searchButton = document.createElement('a');
  searchButton.classList.add('navbar-text', 'd-flex', 'search-btn', 'header-link', 'me-4');
  searchButton.setAttribute('title', 'Search Button');
  searchButton.setAttribute('tabindex', '0');
  searchButton.setAttribute('href', '#');
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('search-modal-open');
  });
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('visually-hidden');
  searchSpan.textContent = 'Search Button';
  searchButton.append(searchSpan);
  searchDiv.append(searchButton);
  fragment.append(searchDiv);

  // Language Dropdown
  const langNavText = document.createElement('div');
  langNavText.classList.add('navbar-text', 'me-0', 'ms-0');
  const dropdownDiv = document.createElement('div');
  dropdownDiv.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  langNavText.append(dropdownDiv);

  const langLink = document.createElement('a');
  langLink.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
  langLink.href = '#';
  langLink.setAttribute('role', 'button');
  langLink.setAttribute('aria-haspopup', 'true');
  langLink.setAttribute('aria-expanded', 'false');
  langLink.setAttribute('aria-controls', 'global-menu');
  langLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = langLink.getAttribute('aria-expanded') === 'true';
    langLink.setAttribute('aria-expanded', !isExpanded);
    const menu = document.getElementById('global-menu');
    if (menu) menu.classList.toggle('show', !isExpanded);
  });
  const globeIcon = document.createElement('span');
  globeIcon.classList.add('globe-icon-map');
  langLink.append(globeIcon);
  const dropdownText = document.createElement('span');
  dropdownText.classList.add('dropdown-text', 'analytics-cta-label-child-class');
  dropdownText.textContent = 'Global (En)'; // Default value
  langLink.append(dropdownText);
  const headerDropdownIcon = document.createElement('span');
  headerDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
  langLink.append(headerDropdownIcon);
  dropdownDiv.append(langLink);

  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-menu', 'accordion-list');
  langMenu.id = 'global-menu';
  langMenu.setAttribute('role', 'menu');
  langMenu.setAttribute('aria-label', 'global language selection');

  const languagePathInput = document.createElement('input');
  languagePathInput.type = 'hidden';
  languagePathInput.id = 'languagePath';
  languagePathInput.value = '/content/dam/global-tcs/en/worldwide-json/language-ww-21-11.json';
  langMenu.append(languagePathInput);

  // Populate language menu from fragment's lists
  const fragmentLanguageLists = toolsRow.querySelectorAll('ul:nth-of-type(2) > li');
  fragmentLanguageLists.forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;
    const newLi = document.createElement('li');
    newLi.classList.add('dropdown-item', 'accordion-item', 'accordion-section');
    newLi.setAttribute('role', 'none');

    const anchor = li.querySelector('a');
    if (anchor) {
      const newAnchor = document.createElement('a');
      newAnchor.href = anchor.href || '#';
      newAnchor.classList.add('accordion-toggle', 'language-title', 'analytics-cta-label-class');
      newAnchor.setAttribute('role', 'button');
      newAnchor.setAttribute('aria-haspopup', 'true');
      newAnchor.setAttribute('aria-expanded', 'false');
      newAnchor.setAttribute('aria-controls', 'region-submenu');
      newAnchor.textContent = Array.from(anchor.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      moveInstrumentation(anchor, newAnchor);

      const nestedSpan = document.createElement('span');
      nestedSpan.classList.add('header-dropdown-icon', 'dropdown-icon');
      newAnchor.append(nestedSpan);
      newLi.append(newAnchor);

      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        const newNestedUl = document.createElement('ul');
        newNestedUl.classList.add('submenu');
        newNestedUl.id = 'region-submenu';
        newNestedUl.setAttribute('role', 'menu');
        newNestedUl.setAttribute('aria-label', 'submenu options');
        Array.from(nestedUl.children).forEach((nestedLi) => {
          if (nestedLi.nodeType !== Node.ELEMENT_NODE) return;
          const newNestedLi = document.createElement('li');
          newNestedLi.classList.add('region-list');
          newNestedLi.setAttribute('role', 'none');
          const nestedAnchor = nestedLi.querySelector('a');
          if (nestedAnchor) {
            const newNestedAnchor = document.createElement('a');
            newNestedAnchor.classList.add('region-link', 'analytics-cta-label-class');
            newNestedAnchor.href = nestedAnchor.href;
            newNestedAnchor.target = '_blank';
            newNestedAnchor.setAttribute('role', 'menuitem');
            moveInstrumentation(nestedAnchor, newNestedAnchor);

            const regionText = document.createElement('span');
            regionText.classList.add('region-text', 'analytics-cta-label-child-class');
            regionText.textContent = nestedAnchor.querySelector('.region-text')?.textContent || '';
            newNestedAnchor.append(regionText);

            const languageText = document.createElement('span');
            languageText.classList.add('language-text');
            languageText.textContent = nestedAnchor.querySelector('.language-text')?.textContent || '';
            newNestedAnchor.append(languageText);

            newNestedLi.append(newNestedAnchor);
          }
          newNestedUl.append(newNestedLi);
        });
        newLi.append(newNestedUl);

        newAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          const isNestedExpanded = newAnchor.getAttribute('aria-expanded') === 'true';
          newAnchor.setAttribute('aria-expanded', !isNestedExpanded);
          newNestedUl.classList.toggle('show', !isNestedExpanded);
        });
      }
    }
    langMenu.append(newLi);
  });
  dropdownDiv.append(langMenu);
  fragment.append(langNavText);

  // Contact Us
  const contactUsDiv = document.createElement('div');
  contactUsDiv.classList.add('navbar-text');
  const contactLink = toolsRow.querySelector('ul:nth-of-type(2) > li:last-child a');
  if (contactLink) {
    const newContactLink = document.createElement('a');
    newContactLink.classList.add('header-link', 'analytics-cta-label-class');
    newContactLink.href = contactLink.href;
    newContactLink.setAttribute('tabindex', '0');
    newContactLink.textContent = contactLink.textContent.trim();
    moveInstrumentation(contactLink, newContactLink);
    contactUsDiv.append(newContactLink);
  }
  fragment.append(contactUsDiv);

  // Tata Logo
  const tataLogoSpan = document.createElement('span');
  tataLogoSpan.classList.add('navbar-text', 'py-0', 'tcs-white-logo', 'me-0');
  const tataLink = toolsRow.querySelector('ul:first-of-type + ul + div p a'); // Adjust selector if needed
  if (tataLink) {
    const newTataLink = document.createElement('a');
    newTataLink.classList.add('header-link', 'analytics-cta-label-class');
    newTataLink.href = tataLink.href;
    newTataLink.target = '_blank';
    newTataLink.rel = 'noopener noreferrer';
    moveInstrumentation(tataLink, newTataLink);

    const img = tataLink.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newTataLink.append(newImg);
    }
    const visuallyHiddenSpan = document.createElement('span');
    visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
    visuallyHiddenSpan.textContent = tataLink.querySelector('.visually-hidden')?.textContent || '';
    newTataLink.append(visuallyHiddenSpan);
    const visuallyHiddenSpan2 = document.createElement('span');
    visuallyHiddenSpan2.classList.add('visually-hidden');
    visuallyHiddenSpan2.textContent = 'Open in New Tab';
    newTataLink.append(visuallyHiddenSpan2);
    tataLogoSpan.append(newTataLink);
  }
  fragment.append(tataLogoSpan);

  return fragment;
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

let escapeKeyListener = null;
let focusOutListener = null;

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.hamburger-menu');

  if (button) {
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    button.classList.toggle('open', !expanded);
  }

  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop > a');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
      });
    }
  }

  // Remove existing listeners to prevent duplicates
  if (escapeKeyListener) {
    window.removeEventListener('keydown', escapeKeyListener);
    escapeKeyListener = null;
  }
  if (focusOutListener) {
    nav.removeEventListener('focusout', focusOutListener);
    focusOutListener = null;
  }

  // Add listeners only if menu is expanded (or forced expanded) and not desktop
  if (!expanded || isDesktop.matches) {
    escapeKeyListener = (e) => {
      if (e.code === 'Escape') {
        const navEl = document.getElementById('nav');
        const navSectionsEl = navEl?.querySelector('.nav-sections');
        if (!navSectionsEl) return;
        const navSectionExpanded = navSectionsEl.querySelector('[aria-expanded="true"]');
        if (navSectionExpanded && isDesktop.matches) {
          toggleAllNavSections(navSectionsEl, false);
          navSectionExpanded.focus();
        } else if (!isDesktop.matches) {
          toggleMenu(navEl, navSectionsEl, false);
          navEl.querySelector('.hamburger-menu')?.focus();
        }
      }
    };
    window.addEventListener('keydown', escapeKeyListener);

    focusOutListener = (e) => {
      if (!nav.contains(e.relatedTarget)) {
        const navSectionsEl = nav.querySelector('.nav-sections');
        if (!navSectionsEl) return;
        const navSectionExpanded = navSectionsEl.querySelector('[aria-expanded="true"]');
        if (navSectionExpanded && isDesktop.matches) {
          toggleAllNavSections(navSectionsEl, false);
        } else if (!isDesktop.matches) {
          toggleMenu(nav, navSectionsEl, false);
        }
      }
    };
    nav.addEventListener('focusout', focusOutListener);
  }
}

/**
 * Decorates the header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Desktop Header
  const desktopHeader = document.createElement('header');
  desktopHeader.classList.add('d-xl-block', 'd-none', 'position-fixed', 'w-100', 'tab-header');
  const desktopNav = document.createElement('nav');
  desktopNav.classList.add('navbar', 'navbar-expand-lg', 'position-relative', 'py-0', 'set-header-onscroll');
  desktopHeader.append(desktopNav);

  const headerRollover = document.createElement('div');
  headerRollover.classList.add('header_rollover', 'position-fixed', '__display', 'set-header-onscroll');
  desktopNav.append(headerRollover);

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header', 'py-0');
  desktopNav.append(mainHeader);

  // Brand Logo
  if (brandRow) {
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture img');
    if (brandLink && brandImg) {
      const newBrandLink = document.createElement('a');
      newBrandLink.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      newBrandLink.href = brandLink.href;
      moveInstrumentation(brandLink, newBrandLink);

      const newBrandImg = document.createElement('img');
      newBrandImg.classList.add('brand-logo-img');
      newBrandImg.src = brandImg.src;
      newBrandImg.alt = brandImg.alt;
      newBrandLink.append(newBrandImg);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      visuallyHiddenSpan.textContent = brandImg.alt;
      newBrandLink.append(visuallyHiddenSpan);
      mainHeader.append(newBrandLink);
    }
  }

  const seperator = document.createElement('span');
  seperator.classList.add('seperator');
  mainHeader.append(seperator);

  const hamburgerMenu = document.createElement('div');
  hamburgerMenu.classList.add('hamburger-menu');
  for (let i = 0; i < 3; i += 1) {
    hamburgerMenu.append(document.createElement('span'));
  }
  mainHeader.append(hamburgerMenu);

  // Desktop Navigation
  const desktopNavContent = setupDesktopNav(navRow);
  desktopNav.append(desktopNavContent);

  // Desktop Tools
  const desktopToolsContent = setupTools(toolsRow);
  desktopNav.append(desktopToolsContent);

  block.append(desktopHeader);

  // Mobile Header
  const mobileHeader = document.createElement('header');
  mobileHeader.classList.add('d-xl-none', 'd-block', 'position-fixed', 'w-100', 'overflow-hidden');
  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('navbar', 'navbar-expand-lg');
  mobileNav.setAttribute('aria-label', 'Primary Navigation');
  mobileHeader.append(mobileNav);

  const mobileMainHeader = document.createElement('div');
  mobileMainHeader.classList.add('main-header');
  mobileNav.append(mobileMainHeader);

  // Mobile Brand Logo
  if (brandRow) {
    const brandLink = brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture img');
    if (brandLink && brandImg) {
      const newBrandLink = document.createElement('a');
      newBrandLink.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      newBrandLink.href = brandLink.href;
      moveInstrumentation(brandLink, newBrandLink);

      const newBrandImg = document.createElement('img');
      newBrandImg.classList.add('brand-logo-img');
      newBrandImg.src = brandImg.src;
      newBrandImg.alt = brandImg.alt;
      newBrandLink.append(newBrandImg);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      visuallyHiddenSpan.textContent = brandImg.alt;
      newBrandLink.append(visuallyHiddenSpan);
      const visuallyHiddenSpan2 = document.createElement('span');
      visuallyHiddenSpan2.classList.add('visually-hidden');
      visuallyHiddenSpan2.textContent = 'Opens in new tab';
      newBrandLink.append(visuallyHiddenSpan2);
      mobileMainHeader.append(newBrandLink);
    }
  }

  const mobileSeperator = document.createElement('span');
  mobileSeperator.classList.add('seperator');
  mobileMainHeader.append(mobileSeperator);

  // Mobile Tata Logo
  const mobileTataLink = toolsRow.querySelector('ul:first-of-type + ul + div p a');
  if (mobileTataLink) {
    const newTataLink = document.createElement('a');
    newTataLink.classList.add('navbar-brand', 'tcs-logo-mobile', 'analytics-cta-label-class');
    newTataLink.href = mobileTataLink.href;
    newTataLink.target = '_blank';
    newTataLink.rel = 'noopener noreferrer';
    moveInstrumentation(mobileTataLink, newTataLink);

    const img = mobileTataLink.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.classList.add('brand-logo-img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newTataLink.append(newImg);
    }
    const visuallyHiddenSpan = document.createElement('span');
    visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
    visuallyHiddenSpan.textContent = mobileTataLink.querySelector('.visually-hidden')?.textContent || '';
    newTataLink.append(visuallyHiddenSpan);
    const visuallyHiddenSpan2 = document.createElement('span');
    visuallyHiddenSpan2.classList.add('visually-hidden');
    visuallyHiddenSpan2.textContent = 'Open in New Tab';
    newTataLink.append(visuallyHiddenSpan2);
    mobileMainHeader.append(newTataLink);
  }

  // Mobile Search
  const mobileSearchDiv = document.createElement('div');
  mobileSearchDiv.classList.add('mobile-search-div');
  mobileSearchDiv.setAttribute('role', 'search');
  const mobileSearchButton = document.createElement('a');
  mobileSearchButton.classList.add('navbar-text', 'search-icon-link', 'searchIcon', 'search-btn');
  mobileSearchButton.setAttribute('tabindex', '0');
  mobileSearchButton.setAttribute('aria-label', 'Search');
  mobileSearchButton.setAttribute('href', '#');
  mobileSearchButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('search-modal-open');
  });
  const mobileSearchSpan = document.createElement('span');
  mobileSearchSpan.classList.add('visually-hidden', 'd-none');
  mobileSearchSpan.textContent = 'Search';
  mobileSearchButton.append(mobileSearchSpan);
  mobileSearchDiv.append(mobileSearchButton);
  mobileMainHeader.append(mobileSearchDiv);

  const mobileHamburgerMenu = document.createElement('div');
  mobileHamburgerMenu.classList.add('hamburger-menu');
  mobileHamburgerMenu.id = 'hamburger';
  mobileHamburgerMenu.setAttribute('aria-label', 'Navigation Menu');
  mobileHamburgerMenu.setAttribute('role', 'button');
  mobileHamburgerMenu.setAttribute('aria-expanded', 'false');
  mobileHamburgerMenu.setAttribute('tabindex', '0');
  for (let i = 0; i < 3; i += 1) {
    mobileHamburgerMenu.append(document.createElement('span'));
  }
  mobileMainHeader.append(mobileHamburgerMenu);

  const mobileNavbarCollapse = document.createElement('div');
  mobileNavbarCollapse.classList.add('navbar-collapse', 'overflow-hidden');
  mobileNavbarCollapse.id = 'navbarMenu';
  mobileNav.append(mobileNavbarCollapse);

  const mobileNavbarOuterDiv = document.createElement('div');
  mobileNavbarOuterDiv.classList.add('mobile-navbar-outer-div', 'd-flex', 'flex-column', 'justify-content-start', 'h-100');
  mobileNavbarCollapse.append(mobileNavbarOuterDiv);

  const tabMobView = document.createElement('div');
  tabMobView.classList.add('tab-mob-view');
  mobileNavbarOuterDiv.append(tabMobView);

  const headerAccordion = document.createElement('div');
  headerAccordion.id = 'header-accordion';
  headerAccordion.classList.add('nav-options');
  headerAccordion.setAttribute('aria-hidden', 'true');
  tabMobView.append(headerAccordion);

  let mobileMegaMenuIndex = 0;
  Array.from(navRow.children).forEach((item, i) => {
    if (item.tagName === 'P' && item.querySelector('a')) {
      const link = item.querySelector('a');
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header', 'card-header-new', 'level2-accordion-card', 'mx-0');
      cardHeader.setAttribute('data-link', `subHeader${mobileMegaMenuIndex}`);
      cardHeader.setAttribute('data-href', link.href);
      cardHeader.id = `subHeader${mobileMegaMenuIndex}L2`;
      headerAccordion.append(cardHeader);

      const mb0Div = document.createElement('div');
      mb0Div.classList.add('mb-0', 'd-flex', 'align-items-center', 'mobile-l1-link');
      cardHeader.append(mb0Div);

      const buttonLink = document.createElement('a');
      buttonLink.classList.add('btn', 'btn-link', 'main-accordion-btn', 'sub-header-btn-link');
      buttonLink.setAttribute('tabindex', '-1');
      buttonLink.setAttribute('aria-hidden', 'true');
      buttonLink.setAttribute('href', '#');
      buttonLink.setAttribute('data-bs-toggle', 'collapse');
      buttonLink.setAttribute('data-bs-target', `#subHeader${mobileMegaMenuIndex}`);
      buttonLink.setAttribute('aria-expanded', 'false');
      buttonLink.setAttribute('aria-controls', `subHeader${mobileMegaMenuIndex}`);
      buttonLink.textContent = link.textContent.trim();
      moveInstrumentation(link, buttonLink);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('header-dropdown-icon');
      buttonLink.append(dropdownIcon);
      mb0Div.append(buttonLink);

      const mobileLevel2Div = document.createElement('div');
      mobileLevel2Div.id = `subHeader${mobileMegaMenuIndex}`;
      mobileLevel2Div.classList.add('collapse', 'uniques', 'mobile-level2');
      mobileLevel2Div.setAttribute('data-bs-parent', '#header-accordion');
      mobileLevel2Div.setAttribute('aria-hidden', 'true');
      headerAccordion.append(mobileLevel2Div);

      const ps3Div = document.createElement('div');
      ps3Div.classList.add('ps-3', 'd-flex', 'flex-column');
      ps3Div.id = `sub-menu-accordion-subHeader${mobileMegaMenuIndex}`;
      mobileLevel2Div.append(ps3Div);

      const overviewLink = document.createElement('a');
      overviewLink.setAttribute('data-nav-id', `subHeader${mobileMegaMenuIndex}`);
      overviewLink.href = 'javascript:void(0);';
      overviewLink.classList.add('mobile-tab-link', 'py-2', 'overview-link', 'analytics-cta-label-class');
      const overviewTextSpan = document.createElement('span');
      overviewTextSpan.classList.add('overview-text');
      overviewTextSpan.textContent = link.textContent.trim();
      overviewLink.append(overviewTextSpan);
      ps3Div.append(overviewLink);

      const nextSibling = navRow.children[i + 1];
      if (nextSibling && (nextSibling.tagName === 'UL' || nextSibling.tagName === 'DIV')) {
        Array.from(nextSibling.children).forEach((li, j) => {
          if (li.nodeType !== Node.ELEMENT_NODE) return;
          const innerLinkMobileLi = document.createElement('li');
          innerLinkMobileLi.setAttribute('type', 'button');
          innerLinkMobileLi.classList.add('d-flex', 'flex-column', 'inner-link', 'inner-link-mobile');
          innerLinkMobileLi.id = `parent-subHeader${mobileMegaMenuIndex}${j}`;
          ps3Div.append(innerLinkMobileLi);

          const level2AccordionDiv = document.createElement('div');
          level2AccordionDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'level-2-accordion', 'py-2');
          innerLinkMobileLi.append(level2AccordionDiv);

          const innerLinkAnchor = li.querySelector('a');
          if (innerLinkAnchor) {
            const newInnerLinkAnchor = document.createElement('a');
            newInnerLinkAnchor.href = innerLinkAnchor.href;
            newInnerLinkAnchor.classList.add('mobile-tab-link', 'analytics-cta-label-class');
            const innerLinkSpan = document.createElement('span');
            innerLinkSpan.classList.add('overview-text');
            innerLinkSpan.textContent = Array.from(innerLinkAnchor.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
            newInnerLinkAnchor.append(innerLinkSpan);
            level2AccordionDiv.append(newInnerLinkAnchor);
            moveInstrumentation(innerLinkAnchor, newInnerLinkAnchor);
          }

          const nestedUl = li.querySelector('ul');
          if (nestedUl) {
            const expandIcon = document.createElement('span');
            expandIcon.classList.add('header-plus-icon', 'l3-expand-icon');
            expandIcon.setAttribute('data-bs-toggle', 'collapse');
            expandIcon.setAttribute('data-bs-target', `#child-subHeader${mobileMegaMenuIndex}${j}`);
            expandIcon.setAttribute('aria-expanded', 'false');
            expandIcon.setAttribute('aria-label', innerLinkAnchor?.textContent.trim() || '');
            expandIcon.setAttribute('role', 'button');
            expandIcon.setAttribute('aria-controls', `child-subHeader${mobileMegaMenuIndex}${j}`);
            expandIcon.setAttribute('tabindex', '0');
            const visuallyHiddenSpan = document.createElement('span');
            visuallyHiddenSpan.classList.add('visually-hidden');
            visuallyHiddenSpan.textContent = 'expand here';
            expandIcon.append(visuallyHiddenSpan);
            level2AccordionDiv.append(expandIcon);

            const childCollapseDiv = document.createElement('div');
            childCollapseDiv.id = `child-subHeader${mobileMegaMenuIndex}${j}`;
            childCollapseDiv.classList.add('collapse', 'inner-link-mobilel3');
            childCollapseDiv.setAttribute('data-bs-parent', `#sub-menu-accordion-subHeader${mobileMegaMenuIndex}`);
            innerLinkMobileLi.append(childCollapseDiv);

            const l3UlListMobile = document.createElement('ul');
            l3UlListMobile.classList.add('l3-ul-list-mobile', 'list-group', 'pt-3', 'ps-3');
            childCollapseDiv.append(l3UlListMobile);

            Array.from(nestedUl.children).forEach((nestedLi) => {
              if (nestedLi.nodeType !== Node.ELEMENT_NODE) return;
              const l3LiListMobile = document.createElement('li');
              l3LiListMobile.classList.add('l3-li-list-mobile', 'pb-3');
              const nestedLink = nestedLi.querySelector('a');
              if (nestedLink) {
                const newNestedLink = document.createElement('a');
                newNestedLink.classList.add('l3-li-list-mobile-link', 'analytics-cta-label-class');
                newNestedLink.href = nestedLink.href;
                newNestedLink.textContent = nestedLink.textContent.trim();
                moveInstrumentation(nestedLink, newNestedLink);
                l3LiListMobile.append(newNestedLink);
              }
              l3UlListMobile.append(l3LiListMobile);
            });
          }
        });
        i += 1; // Skip the UL/DIV as it's processed
      }
      mobileMegaMenuIndex += 1;
    }
  });

  const mobileBottomNav = document.createElement('div');
  mobileBottomNav.classList.add('d-flex', 'flex-column-reverse', 'mobile-bottom-nav', 'mt-auto');
  mobileNavbarOuterDiv.append(mobileBottomNav);

  // Mobile Language Dropdown
  const mobileLangNavText = document.createElement('div');
  mobileLangNavText.classList.add('navbar-text', 'mobile-contact-text', 'pt-2');
  const mobileDropdownDiv = document.createElement('div');
  mobileDropdownDiv.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center');
  mobileLangNavText.append(mobileDropdownDiv);

  const mobileLangLink = document.createElement('a');
  mobileLangLink.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
  mobileLangLink.href = '#';
  mobileLangLink.setAttribute('role', 'button');
  mobileLangLink.setAttribute('aria-haspopup', 'true');
  mobileLangLink.setAttribute('aria-expanded', 'false');
  mobileLangLink.setAttribute('aria-controls', 'global-menu');
  mobileLangLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = mobileLangLink.getAttribute('aria-expanded') === 'true';
    mobileLangLink.setAttribute('aria-expanded', !isExpanded);
    const menu = mobileLangNavText.querySelector('#global-menu');
    if (menu) menu.classList.toggle('show', !isExpanded);
  });
  const mobileGlobeIcon = document.createElement('span');
  mobileGlobeIcon.classList.add('globe-icon-map');
  mobileLangLink.append(mobileGlobeIcon);
  const mobileDropdownText = document.createElement('span');
  mobileDropdownText.classList.add('dropdown-text', 'analytics-cta-label-child-class');
  mobileDropdownText.textContent = 'Global (En)'; // Default value
  mobileLangLink.append(mobileDropdownText);
  const mobileHeaderDropdownIcon = document.createElement('span');
  mobileHeaderDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
  mobileLangLink.append(mobileHeaderDropdownIcon);
  mobileDropdownDiv.append(mobileLangLink);

  const mobileLangMenu = document.createElement('ul');
  mobileLangMenu.classList.add('dropdown-menu', 'accordion-list');
  mobileLangMenu.id = 'global-menu';
  mobileLangMenu.setAttribute('role', 'menu');
  mobileLangMenu.setAttribute('aria-label', 'global language selection');

  // Populate mobile language menu from fragment's lists
  const mobileFragmentLanguageLists = toolsRow.querySelectorAll('ul:nth-of-type(2) > li');
  mobileFragmentLanguageLists.forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;
    const newLi = document.createElement('li');
    newLi.classList.add('dropdown-item', 'accordion-item', 'accordion-section');
    newLi.setAttribute('role', 'none');

    const anchor = li.querySelector('a');
    if (anchor) {
      const newAnchor = document.createElement('a');
      newAnchor.href = anchor.href || '#';
      newAnchor.classList.add('accordion-toggle', 'language-title', 'analytics-cta-label-class');
      newAnchor.setAttribute('role', 'button');
      newAnchor.setAttribute('aria-haspopup', 'true');
      newAnchor.setAttribute('aria-expanded', 'false');
      newAnchor.setAttribute('aria-controls', 'region-submenu');
      newAnchor.textContent = Array.from(anchor.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim();
      moveInstrumentation(anchor, newAnchor);

      const nestedSpan = document.createElement('span');
      nestedSpan.classList.add('header-dropdown-icon', 'dropdown-icon');
      newAnchor.append(nestedSpan);
      newLi.append(newAnchor);

      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        const newNestedUl = document.createElement('ul');
        newNestedUl.classList.add('submenu');
        newNestedUl.id = 'region-submenu';
        newNestedUl.setAttribute('role', 'menu');
        newNestedUl.setAttribute('aria-label', 'submenu options');
        Array.from(nestedUl.children).forEach((nestedLi) => {
          if (nestedLi.nodeType !== Node.ELEMENT_NODE) return;
          const newNestedLi = document.createElement('li');
          newNestedLi.classList.add('region-list');
          newNestedLi.setAttribute('role', 'none');
          const nestedAnchor = nestedLi.querySelector('a');
          if (nestedAnchor) {
            const newNestedAnchor = document.createElement('a');
            newNestedAnchor.classList.add('region-link', 'analytics-cta-label-class');
            newNestedAnchor.href = nestedAnchor.href;
            newNestedAnchor.target = '_blank';
            newNestedAnchor.setAttribute('role', 'menuitem');
            moveInstrumentation(nestedAnchor, newNestedAnchor);

            const regionText = document.createElement('span');
            regionText.classList.add('region-text', 'analytics-cta-label-child-class');
            regionText.textContent = nestedAnchor.querySelector('.region-text')?.textContent || '';
            newNestedAnchor.append(regionText);

            const languageText = document.createElement('span');
            languageText.classList.add('language-text');
            languageText.textContent = nestedAnchor.querySelector('.language-text')?.textContent || '';
            newNestedAnchor.append(languageText);

            newNestedLi.append(newNestedAnchor);
          }
          newNestedUl.append(newNestedLi);
        });
        newLi.append(newNestedUl);

        newAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          const isNestedExpanded = newAnchor.getAttribute('aria-expanded') === 'true';
          newAnchor.setAttribute('aria-expanded', !isNestedExpanded);
          newNestedUl.classList.toggle('show', !isNestedExpanded);
        });
      }
    }
    mobileLangMenu.append(newLi);
  });
  mobileDropdownDiv.append(mobileLangMenu);
  mobileBottomNav.append(mobileLangNavText);

  const mobileBottomNav2 = document.createElement('div');
  mobileBottomNav2.classList.add('d-flex', 'flex-column-reverse', 'mobile-bottom-nav');
  mobileNavbarOuterDiv.append(mobileBottomNav2);

  // Mobile Contact Us
  const mobileContactUsDiv = document.createElement('div');
  mobileContactUsDiv.classList.add('navbar-text', 'd-block', 'mobile-contact-text', 'pt-2');
  const mobileContactLink = toolsRow.querySelector('ul:nth-of-type(2) > li:last-child a');
  if (mobileContactLink) {
    const newMobileContactLink = document.createElement('a');
    newMobileContactLink.classList.add('contact-text', 'analytics-cta-label-class');
    newMobileContactLink.href = mobileContactLink.href;
    newMobileContactLink.setAttribute('tabindex', '-1');
    newMobileContactLink.setAttribute('aria-hidden', 'true');
    newMobileContactLink.textContent = mobileContactLink.textContent.trim();
    moveInstrumentation(mobileContactLink, newMobileContactLink);
    mobileContactUsDiv.append(newMobileContactLink);
  }
  mobileBottomNav2.append(mobileContactUsDiv);

  const mobileTataLogoSpan = document.createElement('span');
  mobileTataLogoSpan.classList.add('navbar-text', 'py-0', 'tcs-white-logo');
  const mobileTataLinkBottom = toolsRow.querySelector('ul:first-of-type + ul + div p a');
  if (mobileTataLinkBottom) {
    const newTataLink = document.createElement('a');
    newTataLink.classList.add('analytics-cta-label-class');
    newTataLink.href = mobileTataLinkBottom.href;
    newTataLink.target = '_blank';
    newTataLink.rel = 'noopener noreferrer';
    moveInstrumentation(mobileTataLinkBottom, newTataLink);

    const img = mobileTataLinkBottom.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newTataLink.append(newImg);
    }
    const visuallyHiddenSpan = document.createElement('span');
    visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
    visuallyHiddenSpan.textContent = mobileTataLinkBottom.querySelector('.visually-hidden')?.textContent || '';
    newTataLink.append(visuallyHiddenSpan);
    const visuallyHiddenSpan2 = document.createElement('span');
    visuallyHiddenSpan2.classList.add('visually-hidden');
    visuallyHiddenSpan2.textContent = 'Opens in new tab';
    newTataLink.append(visuallyHiddenSpan2);
    mobileNav.append(newTataLink);
  }

  block.append(mobileHeader);

  const triggerClickBtn = document.createElement('button');
  triggerClickBtn.classList.add('tigger-click-btn', 'd-none');
  triggerClickBtn.type = 'button';
  const triggerClickSpan = document.createElement('span');
  triggerClickSpan.classList.add('visually-hidden');
  triggerClickSpan.textContent = 'Mute';
  triggerClickBtn.append(triggerClickSpan);
  block.append(triggerClickBtn);

  const navRollover = document.createElement('div');
  navRollover.classList.add('nav_rollover', 'position-fixed');
  block.append(navRollover);

  // Event Listeners for desktop navigation
  const desktopNavItems = desktopNav.querySelectorAll('.nav-item.nav_item_li');
  desktopNavItems.forEach((navItem) => {
    const navLink = navItem.querySelector('.nav-link');
    const megaMenu = block.querySelector(`.mega_menu[data-nav="${navItem.dataset.nav}"]`);
    if (navLink && megaMenu) {
      navLink.addEventListener('mouseenter', () => {
        desktopNavItems.forEach(item => {
          item.classList.remove('active');
          item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
        });
        desktopNav.querySelectorAll('.mega_menu').forEach(menu => menu.classList.remove('active'));
        navItem.classList.add('active');
        megaMenu.classList.add('active');
        navLink.setAttribute('aria-expanded', 'true');
        megaMenu.setAttribute('aria-hidden', 'false');
      });
      megaMenu.addEventListener('mouseleave', () => {
        navItem.classList.remove('active');
        megaMenu.classList.remove('active');
        navLink.setAttribute('aria-expanded', 'false');
        megaMenu.setAttribute('aria-hidden', 'true');
      });
    }
  });

  const desktopMegaMenuLinks = desktopNav.querySelectorAll('.mega_menu .l2_link');
  desktopMegaMenuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const parentLi = link.closest('.inner-link');
      const dataId = parentLi?.dataset.id;
      if (dataId) {
        // Hide all other right submenus in this mega menu
        const allRightSubmenus = parentLi.closest('.sub-header-main-row').querySelectorAll('.right-submenu-l3');
        allRightSubmenus.forEach(submenu => {
          submenu.classList.add('d-none');
          submenu.setAttribute('aria-hidden', 'true');
        });

        // Show the corresponding right submenu
        const targetSubmenu = parentLi.closest('.sub-header-main-row').querySelector(`.right-submenu-l3[data-id="${dataId}"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.remove('d-none');
          targetSubmenu.setAttribute('aria-hidden', 'false');
        }
      }
    });
  });

  // Event Listeners for mobile navigation
  mobileHamburgerMenu.addEventListener('click', () => {
    const isExpanded = mobileHamburgerMenu.getAttribute('aria-expanded') === 'true';
    mobileHamburgerMenu.setAttribute('aria-expanded', !isExpanded);
    mobileHamburgerMenu.classList.toggle('open');
    mobileNavbarCollapse.classList.toggle('show');
    document.body.classList.toggle('overflow-hidden');
    headerAccordion.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  });

  const mobileAccordionButtons = mobileHeader.querySelectorAll('.main-accordion-btn');
  mobileAccordionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-bs-target');
      const targetElement = mobileHeader.querySelector(targetId);
      if (targetElement) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        targetElement.classList.toggle('collapse', isExpanded);
        targetElement.classList.toggle('show', !isExpanded);
        targetElement.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
      }
    });
  });

  const mobileL3ExpandIcons = mobileHeader.querySelectorAll('.l3-expand-icon');
  mobileL3ExpandIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = icon.getAttribute('data-bs-target');
      const targetElement = mobileHeader.querySelector(targetId);
      if (targetElement) {
        const isExpanded = icon.getAttribute('aria-expanded') === 'true';
        icon.setAttribute('aria-expanded', !isExpanded);
        targetElement.classList.toggle('collapse', isExpanded);
        targetElement.classList.toggle('show', !isExpanded);
        targetElement.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
      }
    });
  });
}
