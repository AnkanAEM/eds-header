import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Moves instrumentation attributes from an old element to a new element.
 * @param {Element} oldElement The element to move attributes from.
 * @param {Element} newElement The element to move attributes to.
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  [...oldElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const navSections = nav.querySelector('.navbar-nav');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('.nav-item.active');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav.closest('header').querySelector('.navbar'), nav.closest('header').querySelector('.mobile-navbar-outer-div .tab-mob-view'));
      const hamburger = nav.closest('header').querySelector('.hamburger-menu');
      if (hamburger) hamburger.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.navbar-nav');
    if (navSections) {
      const navSectionExpanded = navSections.querySelector('.nav-item.active');
      if (navSectionExpanded && isDesktop.matches) {
        // eslint-disable-next-line no-use-before-define
        toggleAllNavSections(navSections, false);
      }
    } else { // Handle mobile nav sections
      const mobileNav = nav.closest('header').querySelector('.navbar');
      const mobileNavSections = nav.closest('header').querySelector('.mobile-navbar-outer-div .tab-mob-view');
      if (mobileNav && mobileNavSections) {
        // eslint-disable-next-line no-use-before-define
        toggleMenu(mobileNav, mobileNavSections, false);
      }
    }
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-item').forEach((section) => {
    section.classList.toggle('active', expanded);
    const link = section.querySelector('.nav-link');
    if (link) {
      link.setAttribute('aria-expanded', expanded);
      link.setAttribute('tabindex', expanded ? '0' : '-1'); // Manage tabindex for accessibility
    }
    const megaMenu = section.querySelector('.mega_menu');
    if (megaMenu) {
      megaMenu.setAttribute('aria-hidden', !expanded);
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger-menu');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  nav.classList.toggle('active', !expanded); // Toggle 'active' class on nav for mobile menu visibility
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', !expanded);
  }

  // Close all submenus when main menu is toggled
  toggleAllNavSections(navSections, false);

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Parses the fragment into brand, nav, and tools rows.
 * @param {Element} fragment The fragment element.
 * @returns {Object} An object containing the brandRow, navRow, and toolsRow.
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children).filter((child) => child.tagName === 'DIV');
  let brandRow = null;
  let navRow = null;
  let toolsRow = null;

  sections.forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper') || section;
    if (wrapper.querySelector('picture') || wrapper.querySelector('img')) {
      brandRow = wrapper;
    } else if (wrapper.querySelectorAll('ul').length > 0) {
      navRow = wrapper;
    } else if (wrapper.textContent.match(/facebook|twitter|linkedin|search|global|contact us|tata\.com/i)) {
      toolsRow = wrapper;
    }
  });

  return { brandRow, navRow, toolsRow };
}

/**
 * Sets up the desktop navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {DocumentFragment} docFragment The document fragment to append elements to.
 * @returns {Element} The decorated nav sections element.
 */
function setupDesktopNav(navRow, docFragment) {
  if (!navRow) return null;

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbar_links');
  docFragment.append(navbarCollapse);

  const navRoleContainer = document.createElement('div');
  navRoleContainer.setAttribute('role', 'navigation');
  navRoleContainer.setAttribute('aria-label', 'Primary Navigation');
  navbarCollapse.append(navRoleContainer);

  const navbarNav = document.createElement('ul');
  navbarNav.classList.add('navbar-nav');
  navbarNav.setAttribute('role', 'menu');
  navRoleContainer.append(navbarNav);

  const children = Array.from(navRow.children).filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'P');

  let currentLink = null;
  let megaMenuContentBuffer = [];
  let megaMenuIndex = 0;

  children.forEach((child, index) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a top-level nav item link
      if (currentLink) {
        // Flush previous mega menu content if any
        if (megaMenuContentBuffer.length > 0) {
          const megaMenuDiv = createMegaMenu(megaMenuContentBuffer, currentLink.textContent.trim(), megaMenuIndex - 1);
          navbarNav.lastElementChild.append(megaMenuDiv);
          megaMenuContentBuffer = [];
        }
      }

      const navItemLi = document.createElement('li');
      navItemLi.classList.add('nav-item', 'nav_item_li', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
      navItemLi.setAttribute('role', 'presentation');
      navItemLi.setAttribute('data-nav', `subHeader${megaMenuIndex}`);
      navbarNav.append(navItemLi);

      const link = child.querySelector('a');
      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'd-block', 'position-relative', 'analytics-cta-label-class');
      navLink.setAttribute('role', 'menuitem');
      navLink.setAttribute('aria-haspopup', 'true');
      navLink.setAttribute('aria-expanded', 'false');
      navLink.setAttribute('tabindex', index === 0 ? '0' : '-1'); // First item tabindex 0, others -1
      navLink.href = link.href;
      navLink.textContent = link.textContent;
      navItemLi.setAttribute('data-nav-link', link.href); // Add data-nav-link
      moveInstrumentation(link, navLink); // Move instrumentation from original link
      navItemLi.append(navLink);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('desktop-header-dropdown-icon');
      navLink.append(dropdownIcon);

      const navUnderline = document.createElement('span');
      navUnderline.classList.add('nav-underline');
      navItemLi.append(navUnderline);

      currentLink = link;
      megaMenuIndex += 1;

      navItemLi.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleAllNavSections(navbarNav, false); // Close others
          navItemLi.classList.add('active');
          navLink.setAttribute('aria-expanded', 'true');
          navLink.setAttribute('tabindex', '0');
          const megaMenu = navItemLi.querySelector('.mega_menu');
          if (megaMenu) megaMenu.setAttribute('aria-hidden', 'false');
        }
      });
      navItemLi.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          navItemLi.classList.remove('active');
          navLink.setAttribute('aria-expanded', 'false');
          navLink.setAttribute('tabindex', '-1');
          const megaMenu = navItemLi.querySelector('.mega_menu');
          if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
        }
      });

    } else if (child.tagName === 'UL' && currentLink) {
      // This is a mega menu associated with the currentLink
      megaMenuContentBuffer.push(child);
    } else if (child.tagName === 'DIV' && currentLink) {
      // This is a mega menu associated with the currentLink
      // Assume div with p and a is an overview section
      megaMenuContentBuffer.push(child);
    }
  });

  // Flush the last mega menu content if any
  if (currentLink && megaMenuContentBuffer.length > 0) {
    const megaMenuDiv = createMegaMenu(megaMenuContentBuffer, currentLink.textContent.trim(), megaMenuIndex - 1);
    navbarNav.lastElementChild.append(megaMenuDiv);
  }

  return navbarCollapse;
}

/**
 * Creates a mega menu structure.
 * @param {Array<Element>} contentNodes The content nodes for the mega menu.
 * @param {string} title The title of the main navigation item.
 * @param {number} index The index of the mega menu.
 * @returns {Element} The mega menu div.
 */
function createMegaMenu(contentNodes, title, index) {
  const megaMenu = document.createElement('div');
  megaMenu.classList.add('mega_menu', 'pt-32', 'position-absolute', 'set-menu-onscroll');
  megaMenu.setAttribute('data-nav', `subHeader${index}`);
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

  let leftDivContent = [];
  const linkDataMap = new Map(); // Maps L2 link text to its L3 content

  contentNodes.forEach((node) => {
    if (node.tagName === 'UL') {
      // This is a list of L2 links, possibly with L3 nested
      Array.from(node.children).forEach((li) => {
        const l2Link = li.querySelector('a');
        if (l2Link) {
          const l2Text = l2Link.textContent.trim();
          const nestedUl = li.querySelector('ul');
          linkDataMap.set(l2Text, { link: l2Link, nestedUl });
        }
      });
    } else if (node.tagName === 'DIV') {
      // This is an overview section
      leftDivContent.push(node);
    }
  });

  // Create overview section (col-3)
  const overviewCol = document.createElement('div');
  overviewCol.classList.add('col-3', 'sub-header-overview-section');
  subHeaderMainRow.append(overviewCol);

  const subHeaderContent = document.createElement('div');
  subHeaderContent.classList.add('sub-header-content', 'sub_header_description', 'd-block');
  overviewCol.append(subHeaderContent);

  if (leftDivContent.length > 0) {
    const mainHeading = document.createElement('h3');
    mainHeading.classList.add('font-white', 'main-heading');
    const overviewLink = leftDivContent[0].querySelector('p:first-of-type a');
    if (overviewLink) {
      mainHeading.textContent = overviewLink.textContent;
      moveInstrumentation(overviewLink, mainHeading);
    } else {
      mainHeading.textContent = title; // Fallback to main nav title
    }
    subHeaderContent.append(mainHeading);

    const paragraphs = Array.from(leftDivContent[0].querySelectorAll('p'));
    if (paragraphs.length > 1) {
      const normalContent = document.createElement('p');
      normalContent.classList.add('normal-content', 'font-grayWhite');
      normalContent.textContent = paragraphs[1].textContent;
      subHeaderContent.append(normalContent);
    }

    const flexColumnDiv = document.createElement('div');
    flexColumnDiv.classList.add('d-flex', 'flex-column');
    subHeaderContent.append(flexColumnDiv);

    const ctaLink = leftDivContent[0].querySelector('p:last-of-type a');
    if (ctaLink) {
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn-l3-description', 'btn-responsive', 'analytics-cta-label-class');
      ctaButton.href = ctaLink.href;
      ctaButton.textContent = ctaLink.textContent;
      moveInstrumentation(ctaLink, ctaButton);
      flexColumnDiv.append(ctaButton);
    }
  }

  // Create link section (col-3)
  const linkSectionCol = document.createElement('div');
  linkSectionCol.classList.add('col-3', 'sub-header-link-section');
  subHeaderMainRow.append(linkSectionCol);

  const innerUl = document.createElement('ul');
  innerUl.classList.add('inner-ul', 'position-relative', 'ps-0');
  innerUl.setAttribute('role', 'menu');
  linkSectionCol.append(innerUl);

  // Create data section (col-6)
  const dataSectionCol = document.createElement('div');
  dataSectionCol.classList.add('col-6', 'sub-header-link-data-section');
  subHeaderMainRow.append(dataSectionCol);

  linkDataMap.forEach((data, l2Text) => {
    const { link: originalL2Link, nestedUl } = data;
    const li = document.createElement('li');
    li.classList.add('inner-link', 'row');
    li.setAttribute('data-id', l2Text);
    li.setAttribute('role', 'presentation');
    innerUl.append(li);

    const a = document.createElement('a');
    a.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'l2_link', 'non-overview_link', 'py-2', 'px-0', 'position-relative', 'analytics-cta-label-class');
    a.setAttribute('role', 'menuitem');
    a.setAttribute('tabindex', '0');
    a.href = originalL2Link.href;
    a.textContent = l2Text;
    moveInstrumentation(originalL2Link, a);
    li.append(a);

    const div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-center');
    a.append(div);

    if (nestedUl && nestedUl.children.length > 0) {
      const span = document.createElement('span');
      span.classList.add('header-right-arrow-icon');
      div.append(span);
      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden');
      visuallyHiddenSpan.textContent = 'Press tab for submenu items';
      a.append(visuallyHiddenSpan);
    }

    const divider = document.createElement('div');
    divider.classList.add('l3_divinder');
    li.append(divider);

    // Create the L3 submenu
    if (nestedUl && nestedUl.children.length > 0) {
      const rightSubmenuUl = document.createElement('ul');
      rightSubmenuUl.classList.add('right-submenu-l3', 'sub-header-content-link-ul', 'position-relative', 'd-none');
      rightSubmenuUl.setAttribute('data-id', l2Text);
      dataSectionCol.append(rightSubmenuUl);

      Array.from(nestedUl.children).forEach((l3Li) => {
        const l3Link = l3Li.querySelector('a');
        if (l3Link && l3Link.href) { // Ensure link has an href
          const l3LiElement = document.createElement('li');
          l3LiElement.classList.add('l3-li-list');
          rightSubmenuUl.append(l3LiElement);

          const l3A = document.createElement('a');
          l3A.classList.add('l3-li-link', 'analytics-cta-label-class');
          l3A.href = l3Link.href;
          l3A.textContent = l3Link.textContent;
          moveInstrumentation(l3Link, l3A);
          l3LiElement.append(l3A);
        }
      });
    }


    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        // Hide all other L3 submenus
        dataSectionCol.querySelectorAll('.right-submenu-l3').forEach(submenu => {
          submenu.classList.add('d-none');
        });
        // Show current L3 submenu
        const targetSubmenu = dataSectionCol.querySelector(`.right-submenu-l3[data-id="${l2Text}"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.remove('d-none');
        }
      }
    });
  });

  const rightRollover = document.createElement('div');
  rightRollover.classList.add('sub-header-right-rollover', 'position-absolute', 'd-none');
  row.append(rightRollover);

  return megaMenu;
}

/**
 * Sets up the mobile navigation.
 * @param {Element} navRow The navigation row element from the fragment.
 * @param {Element} mobileNavbarOuterDiv The mobile navigation container.
 * @returns {Element} The decorated mobile nav sections element.
 */
function setupMobileNav(navRow, mobileNavbarOuterDiv) {
  if (!navRow || !mobileNavbarOuterDiv) return null;

  const tabMobView = document.createElement('div');
  tabMobView.classList.add('tab-mob-view');
  mobileNavbarOuterDiv.append(tabMobView);

  const headerAccordion = document.createElement('div');
  headerAccordion.id = 'header-accordion';
  headerAccordion.classList.add('nav-options');
  headerAccordion.setAttribute('aria-hidden', 'true');
  tabMobView.append(headerAccordion);

  const children = Array.from(navRow.children).filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'P');

  let currentLink = null;
  let megaMenuContentBuffer = [];
  let megaMenuIndex = 0;

  children.forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a top-level nav item link
      if (currentLink) {
        // Flush previous mega menu content if any
        if (megaMenuContentBuffer.length > 0) {
          createMobileMegaMenu(megaMenuContentBuffer, currentLink.textContent.trim(), megaMenuIndex - 1, headerAccordion);
          megaMenuContentBuffer = [];
        }
      }

      const link = child.querySelector('a');
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header', 'card-header-new', 'level2-accordion-card', 'mx-0');
      cardHeader.setAttribute('data-link', `subHeader${megaMenuIndex}`);
      cardHeader.setAttribute('data-href', link.href);
      cardHeader.id = `subHeader${megaMenuIndex}L2`;
      headerAccordion.append(cardHeader);

      const mb0Div = document.createElement('div');
      mb0Div.classList.add('mb-0', 'd-flex', 'align-items-center', 'mobile-l1-link');
      cardHeader.append(mb0Div);

      const btnLink = document.createElement('button'); // Changed from div to button
      btnLink.classList.add('btn', 'btn-link', 'main-accordion-btn', 'sub-header-btn-link');
      btnLink.setAttribute('tabindex', '0'); // Make button focusable
      btnLink.setAttribute('aria-hidden', 'false'); // Make button visible to accessibility tree
      btnLink.setAttribute('aria-expanded', 'false');
      btnLink.setAttribute('aria-controls', `subHeader${megaMenuIndex}`);
      btnLink.textContent = link.textContent;
      moveInstrumentation(link, btnLink);
      mb0Div.append(btnLink);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('header-dropdown-icon');
      btnLink.append(dropdownIcon);

      btnLink.addEventListener('click', () => {
        const targetId = btnLink.getAttribute('aria-controls');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const isExpanded = btnLink.getAttribute('aria-expanded') === 'true';
          btnLink.setAttribute('aria-expanded', !isExpanded);
          targetElement.classList.toggle('collapse', isExpanded);
          targetElement.classList.toggle('show', !isExpanded);
          targetElement.setAttribute('aria-hidden', isExpanded);
        }
      });

      currentLink = link;
      megaMenuIndex += 1;

    } else if (child.tagName === 'UL' && currentLink) {
      megaMenuContentBuffer.push(child);
    } else if (child.tagName === 'DIV' && currentLink) {
      megaMenuContentBuffer.push(child);
    }
  });

  // Flush the last mega menu content if any
  if (currentLink && megaMenuContentBuffer.length > 0) {
    createMobileMegaMenu(megaMenuContentBuffer, currentLink.textContent.trim(), megaMenuIndex - 1, headerAccordion);
  }

  return tabMobView;
}

/**
 * Creates a mobile mega menu structure.
 * @param {Array<Element>} contentNodes The content nodes for the mobile mega menu.
 * @param {string} title The title of the main navigation item.
 * @param {number} index The index of the mega menu.
 * @param {Element} headerAccordion The parent accordion container.
 */
function createMobileMegaMenu(contentNodes, title, index, headerAccordion) {
  const mobileLevel2Div = document.createElement('div');
  mobileLevel2Div.id = `subHeader${index}`;
  mobileLevel2Div.classList.add('collapse', 'uniques', 'mobile-level2');
  mobileLevel2Div.setAttribute('data-bs-parent', '#header-accordion');
  mobileLevel2Div.setAttribute('aria-hidden', 'true');
  headerAccordion.append(mobileLevel2Div);

  const ps3Div = document.createElement('div');
  ps3Div.classList.add('ps-3', 'd-flex', 'flex-column');
  ps3Div.id = `sub-menu-accordion-subHeader${index}`;
  mobileLevel2Div.append(ps3Div);

  const overviewLink = document.createElement('a');
  overviewLink.classList.add('mobile-tab-link', 'py-2', 'overview-link', 'analytics-cta-label-class');
  overviewLink.setAttribute('data-nav-id', `subHeader${index}`);
  const overviewTextSpan = document.createElement('span');
  overviewTextSpan.classList.add('overview-text');

  const overviewContent = contentNodes.find(node => node.tagName === 'DIV');
  if (overviewContent) {
    const mainHeading = overviewContent.querySelector('h3.main-heading');
    if (mainHeading) {
      overviewTextSpan.textContent = mainHeading.textContent;
    } else {
      overviewTextSpan.textContent = title;
    }
    const ctaLink = overviewContent.querySelector('p:last-of-type a');
    if (ctaLink) {
      overviewLink.href = ctaLink.href;
      moveInstrumentation(ctaLink, overviewLink);
    } else {
      overviewLink.href = '#'; // Fallback if no CTA link
    }
  } else {
    overviewTextSpan.textContent = title;
    overviewLink.href = '#'; // Fallback if no overview content
  }
  overviewLink.append(overviewTextSpan);
  ps3Div.append(overviewLink);

  const linkDataMap = new Map();
  const ulNode = contentNodes.find(node => node.tagName === 'UL');
  if (ulNode) {
    Array.from(ulNode.children).forEach((li) => {
      const l2Link = li.querySelector('a');
      if (l2Link) {
        const l2Text = l2Link.textContent.trim();
        const nestedUl = li.querySelector('ul');
        linkDataMap.set(l2Text, { link: l2Link, nestedUl });
      }
    });
  }

  let l2Index = 0;
  linkDataMap.forEach((data, l2Text) => {
    const { link: originalL2Link, nestedUl } = data;
    const li = document.createElement('li');
    li.setAttribute('type', 'button');
    li.classList.add('d-flex', 'flex-column', 'inner-link', 'inner-link-mobile');
    li.id = `parent-subHeader${index}${l2Index}`;
    ps3Div.append(li);

    const divLevel2Accordion = document.createElement('div');
    divLevel2Accordion.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'level-2-accordion', 'py-2');
    li.append(divLevel2Accordion);

    const a = document.createElement('a');
    a.classList.add('mobile-tab-link', 'analytics-cta-label-class');
    a.href = originalL2Link.href;
    const spanOverviewText = document.createElement('span');
    spanOverviewText.classList.add('overview-text');
    spanOverviewText.textContent = l2Text;
    a.append(spanOverviewText);
    divLevel2Accordion.append(a);
    moveInstrumentation(originalL2Link, a);

    if (nestedUl && nestedUl.children.length > 0) {
      const spanExpandIcon = document.createElement('span');
      spanExpandIcon.classList.add('header-plus-icon', 'l3-expand-icon');
      spanExpandIcon.setAttribute('aria-expanded', 'false');
      spanExpandIcon.setAttribute('aria-label', l2Text);
      spanExpandIcon.setAttribute('role', 'button');
      spanExpandIcon.setAttribute('aria-controls', `child-subHeader${index}${l2Index}`);
      spanExpandIcon.setAttribute('tabindex', '0'); // Make focusable
      divLevel2Accordion.append(spanExpandIcon);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden');
      visuallyHiddenSpan.textContent = 'expand here';
      spanExpandIcon.append(visuallyHiddenSpan);

      const childDiv = document.createElement('div');
      childDiv.id = `child-subHeader${index}${l2Index}`;
      childDiv.classList.add('collapse', 'inner-link-mobilel3');
      childDiv.setAttribute('data-bs-parent', `#sub-menu-accordion-subHeader${index}`);
      li.append(childDiv);

      const ulL3 = document.createElement('ul');
      ulL3.classList.add('l3-ul-list-mobile', 'list-group', 'pt-3', 'ps-3');
      childDiv.append(ulL3);

      Array.from(nestedUl.children).forEach((l3Li) => {
        const l3Link = l3Li.querySelector('a');
        if (l3Link && l3Link.href) {
          const l3LiElement = document.createElement('li');
          l3LiElement.classList.add('l3-li-list-mobile', 'pb-3');
          ulL3.append(l3LiElement);

          const l3A = document.createElement('a');
          l3A.classList.add('l3-li-list-mobile-link', 'analytics-cta-label-class');
          l3A.href = l3Link.href;
          l3A.textContent = l3Link.textContent;
          moveInstrumentation(l3Link, l3A);
          l3LiElement.append(l3A);
        }
      });

      spanExpandIcon.addEventListener('click', () => {
        const targetId = spanExpandIcon.getAttribute('aria-controls');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const isExpanded = spanExpandIcon.getAttribute('aria-expanded') === 'true';
          spanExpandIcon.setAttribute('aria-expanded', !isExpanded);
          targetElement.classList.toggle('collapse', isExpanded);
          targetElement.classList.toggle('show', !isExpanded);
        }
      });
    }
    l2Index += 1;
  });
}

/**
 * Sets up the tools section (search, global, contact, tata logo).
 * @param {Element} toolsRow The tools row element from the fragment.
 * @param {Element} desktopToolsContainer The desktop tools container.
 * @param {Element} mobileNavbarOuterDiv The mobile navigation container for mobile tools.
 */
function setupTools(toolsRow, desktopToolsContainer, mobileNavbarOuterDiv) {
  if (!toolsRow) return;

  let desktopMsAutoDiv = null;
  let desktopNavbarTextMe0Ms0 = null;
  if (desktopToolsContainer) {
    desktopMsAutoDiv = document.createElement('div');
    desktopMsAutoDiv.classList.add('ms-auto');
    desktopMsAutoDiv.setAttribute('role', 'search');
    desktopToolsContainer.append(desktopMsAutoDiv);

    desktopNavbarTextMe0Ms0 = document.createElement('div');
    desktopNavbarTextMe0Ms0.classList.add('navbar-text', 'me-0', 'ms-0');
    desktopToolsContainer.append(desktopNavbarTextMe0Ms0);
  }

  const mobileBottomNav1 = document.createElement('div');
  mobileBottomNav1.classList.add('d-flex', 'flex-column-reverse', 'mobile-bottom-nav', 'mt-auto');
  if (mobileNavbarOuterDiv) mobileNavbarOuterDiv.append(mobileBottomNav1);

  const mobileContactTextDiv = document.createElement('div');
  mobileContactTextDiv.classList.add('navbar-text', 'mobile-contact-text', 'pt-2');
  mobileBottomNav1.append(mobileContactTextDiv);

  const mobileDropdownDiv = document.createElement('div');
  mobileDropdownDiv.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center');
  mobileContactTextDiv.append(mobileDropdownDiv);

  const mobileDropdownAnchor = document.createElement('a');
  mobileDropdownAnchor.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
  mobileDropdownAnchor.href = '#';
  mobileDropdownAnchor.setAttribute('role', 'button');
  mobileDropdownAnchor.setAttribute('aria-haspopup', 'true');
  mobileDropdownAnchor.setAttribute('aria-expanded', 'false');
  mobileDropdownAnchor.setAttribute('aria-controls', 'global-menu-mobile');
  mobileDropdownDiv.append(mobileDropdownAnchor);

  const mobileGlobeIcon = document.createElement('span');
  mobileGlobeIcon.classList.add('globe-icon-map');
  mobileDropdownAnchor.append(mobileGlobeIcon);

  const mobileDropdownTextSpan = document.createElement('span');
  mobileDropdownTextSpan.classList.add('dropdown-text', 'analytics-cta-label-child-class');
  mobileDropdownAnchor.append(mobileDropdownTextSpan);

  const mobileHeaderDropdownIcon = document.createElement('span');
  mobileHeaderDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
  mobileDropdownAnchor.append(mobileHeaderDropdownIcon);

  const mobileDropdownMenu = document.createElement('ul');
  mobileDropdownMenu.classList.add('dropdown-menu', 'accordion-list');
  mobileDropdownMenu.id = 'global-menu-mobile';
  mobileDropdownMenu.setAttribute('role', 'menu');
  mobileDropdownMenu.setAttribute('aria-label', 'global language selection');
  mobileDropdownDiv.append(mobileDropdownMenu);

  const mobileBottomNav2 = document.createElement('div');
  mobileBottomNav2.classList.add('d-flex', 'flex-column-reverse', 'mobile-bottom-nav');
  if (mobileNavbarOuterDiv) mobileNavbarOuterDiv.append(mobileBottomNav2);

  let searchButtonFound = false;
  let contactUsLinkFound = false;
  let tataLogoFound = false;
  let globalLangFound = false;

  Array.from(toolsRow.children).forEach((child) => {
    if (child.tagName === 'UL') {
      Array.from(child.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          if (link.textContent.toLowerCase().includes('search')) {
            if (!searchButtonFound) {
              // Desktop search button
              if (desktopMsAutoDiv) {
                const searchButton = document.createElement('button');
                searchButton.classList.add('navbar-text', 'd-flex', 'search-btn', 'header-link', 'me-4');
                searchButton.setAttribute('title', 'Search Button');
                searchButton.setAttribute('tabindex', '0');
                searchButton.setAttribute('type', 'button');
                searchButton.setAttribute('aria-label', 'Search Button');
                const visuallyHiddenSpan = document.createElement('span');
                visuallyHiddenSpan.classList.add('visually-hidden');
                visuallyHiddenSpan.textContent = 'Search Button';
                searchButton.append(visuallyHiddenSpan);
                desktopMsAutoDiv.append(searchButton);
                moveInstrumentation(link, searchButton);
              }

              // Mobile search button
              if (mobileNavbarOuterDiv) {
                const mobileSearchDiv = document.createElement('div');
                mobileSearchDiv.classList.add('mobile-search-div');
                mobileSearchDiv.setAttribute('role', 'search');
                const mobileMainHeader = mobileNavbarOuterDiv.closest('nav').querySelector('.main-header');
                if (mobileMainHeader) {
                  const mobileSearchButton = document.createElement('button');
                  mobileSearchButton.classList.add('navbar-text', 'search-icon-link', 'searchIcon', 'search-btn');
                  mobileSearchButton.setAttribute('tabindex', '0');
                  mobileSearchButton.setAttribute('aria-label', 'Search');
                  mobileSearchButton.setAttribute('type', 'button');
                  const mobileVisuallyHiddenSpan = document.createElement('span');
                  mobileVisuallyHiddenSpan.classList.add('visually-hidden', 'd-none');
                  mobileVisuallyHiddenSpan.textContent = 'Search';
                  mobileSearchButton.append(mobileVisuallyHiddenSpan);
                  mobileSearchDiv.append(mobileSearchButton);
                  mobileMainHeader.append(mobileSearchDiv);
                  moveInstrumentation(link, mobileSearchButton);
                }
              }
              searchButtonFound = true;
            }
          } else if (link.textContent.toLowerCase().includes('global (en)')) {
            if (!globalLangFound) {
              // Desktop global language dropdown
              if (desktopNavbarTextMe0Ms0) {
                const dropdownDiv = document.createElement('div');
                dropdownDiv.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
                desktopNavbarTextMe0Ms0.append(dropdownDiv);

                const dropdownAnchor = document.createElement('a');
                dropdownAnchor.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
                dropdownAnchor.href = '#';
                dropdownAnchor.setAttribute('role', 'button');
                dropdownAnchor.setAttribute('aria-haspopup', 'true');
                dropdownAnchor.setAttribute('aria-expanded', 'false');
                dropdownAnchor.setAttribute('aria-controls', 'global-menu');
                dropdownDiv.append(dropdownAnchor);

                const globeIcon = document.createElement('span');
                globeIcon.classList.add('globe-icon-map');
                dropdownAnchor.append(globeIcon);

                const dropdownTextSpan = document.createElement('span');
                dropdownTextSpan.classList.add('dropdown-text', 'analytics-cta-label-child-class');
                dropdownTextSpan.textContent = link.textContent;
                dropdownAnchor.append(dropdownTextSpan);

                const headerDropdownIcon = document.createElement('span');
                headerDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
                dropdownAnchor.append(headerDropdownIcon);

                const dropdownMenu = document.createElement('ul');
                dropdownMenu.classList.add('dropdown-menu', 'accordion-list');
                dropdownMenu.id = 'global-menu';
                dropdownMenu.setAttribute('role', 'menu');
                dropdownMenu.setAttribute('aria-label', 'global language selection');
                dropdownDiv.append(dropdownMenu);
                moveInstrumentation(link, dropdownAnchor);

                // Populate dropdown menu
                const nestedUl = li.querySelector('ul');
                if (nestedUl) {
                  Array.from(nestedUl.children).forEach((nestedLi) => {
                    const nestedLink = nestedLi.querySelector('a');
                    if (nestedLink) {
                      const dropdownItem = document.createElement('li');
                      dropdownItem.classList.add('dropdown-item', 'accordion-item', 'accordion-section');
                      dropdownItem.setAttribute('role', 'none');
                      dropdownMenu.append(dropdownItem);

                      const accordionToggle = document.createElement('a');
                      accordionToggle.classList.add('accordion-toggle', 'language-title', 'analytics-cta-label-class');
                      accordionToggle.href = '#';
                      accordionToggle.setAttribute('role', 'button');
                      accordionToggle.setAttribute('aria-haspopup', 'true');
                      accordionToggle.setAttribute('aria-expanded', 'false');
                      accordionToggle.setAttribute('aria-controls', `region-submenu-${nestedLink.textContent.toLowerCase().replace(/\s/g, '-')}`); // Unique ID
                      accordionToggle.textContent = nestedLink.textContent;
                      moveInstrumentation(nestedLink, accordionToggle);
                      dropdownItem.append(accordionToggle);

                      const iconSpan = document.createElement('span');
                      iconSpan.classList.add('header-dropdown-icon', 'dropdown-icon');
                      accordionToggle.append(iconSpan);

                      const submenuUl = document.createElement('ul');
                      submenuUl.classList.add('submenu');
                      submenuUl.id = `region-submenu-${nestedLink.textContent.toLowerCase().replace(/\s/g, '-')}`; // Unique ID
                      submenuUl.setAttribute('role', 'menu');
                      submenuUl.setAttribute('aria-label', `${nestedLink.textContent} options`);
                      dropdownItem.append(submenuUl);

                      accordionToggle.addEventListener('click', (event) => {
                        event.preventDefault();
                        const isExpanded = accordionToggle.getAttribute('aria-expanded') === 'true';
                        accordionToggle.setAttribute('aria-expanded', !isExpanded);
                        submenuUl.classList.toggle('show', !isExpanded);
                      });
                    }
                  });
                }
              }

              // Mobile global language dropdown
              mobileDropdownTextSpan.textContent = link.textContent;
              moveInstrumentation(link, mobileDropdownAnchor);
              const nestedUlMobile = li.querySelector('ul');
              if (nestedUlMobile) {
                Array.from(nestedUlMobile.children).forEach((nestedLi) => {
                  const nestedLink = nestedLi.querySelector('a');
                  if (nestedLink) {
                    const dropdownItem = document.createElement('li');
                    dropdownItem.classList.add('dropdown-item', 'accordion-item', 'accordion-section');
                    dropdownItem.setAttribute('role', 'none');
                    mobileDropdownMenu.append(dropdownItem);

                    const accordionToggle = document.createElement('a');
                    accordionToggle.classList.add('accordion-toggle', 'language-title', 'analytics-cta-label-class');
                    accordionToggle.href = '#';
                    accordionToggle.setAttribute('role', 'button');
                    accordionToggle.setAttribute('aria-haspopup', 'true');
                    accordionToggle.setAttribute('aria-expanded', 'false');
                    accordionToggle.setAttribute('aria-controls', `region-submenu-mobile-${nestedLink.textContent.toLowerCase().replace(/\s/g, '-')}`); // Unique ID
                    accordionToggle.textContent = nestedLink.textContent;
                    moveInstrumentation(nestedLink, accordionToggle);
                    dropdownItem.append(accordionToggle);

                    const iconSpan = document.createElement('span');
                    iconSpan.classList.add('header-dropdown-icon', 'dropdown-icon');
                    accordionToggle.append(iconSpan);

                    const submenuUl = document.createElement('ul');
                    submenuUl.classList.add('submenu');
                    submenuUl.id = `region-submenu-mobile-${nestedLink.textContent.toLowerCase().replace(/\s/g, '-')}`; // Unique ID
                    submenuUl.setAttribute('role', 'menu');
                    submenuUl.setAttribute('aria-label', `${nestedLink.textContent} options`);
                    dropdownItem.append(submenuUl);

                    accordionToggle.addEventListener('click', (event) => {
                      event.preventDefault();
                      const isExpanded = accordionToggle.getAttribute('aria-expanded') === 'true';
                      accordionToggle.setAttribute('aria-expanded', !isExpanded);
                      submenuUl.classList.toggle('show', !isExpanded);
                    });
                  }
                });
              }
              globalLangFound = true;
            }
          } else if (link.textContent.toLowerCase().includes('contact us')) {
            if (!contactUsLinkFound) {
              // Desktop contact us
              if (desktopToolsContainer) {
                const contactDiv = document.createElement('div');
                contactDiv.classList.add('navbar-text');
                const contactLink = document.createElement('a');
                contactLink.classList.add('header-link', 'analytics-cta-label-class');
                contactLink.href = link.href;
                contactLink.textContent = link.textContent;
                contactLink.setAttribute('tabindex', '0');
                contactDiv.append(contactLink);
                desktopToolsContainer.append(contactDiv);
                moveInstrumentation(link, contactLink);
              }

              // Mobile contact us
              const mobileContactUsDiv = document.createElement('div');
              mobileContactUsDiv.classList.add('navbar-text', 'd-block', 'mobile-contact-text', 'pt-2');
              const mobileContactUsLink = document.createElement('a');
              mobileContactUsLink.classList.add('contact-text', 'analytics-cta-label-class');
              mobileContactUsLink.href = link.href;
              mobileContactUsLink.textContent = link.textContent;
              mobileContactUsLink.setAttribute('tabindex', '-1');
              mobileContactUsLink.setAttribute('aria-hidden', 'true');
              mobileContactUsDiv.append(mobileContactUsLink);
              mobileBottomNav2.append(mobileContactUsDiv);
              moveInstrumentation(link, mobileContactUsLink);
              contactUsLinkFound = true;
            }
          } else if (link.textContent.toLowerCase().includes('tata.com')) {
            if (!tataLogoFound) {
              // Desktop Tata logo
              if (desktopToolsContainer) {
                const tataLogoSpan = document.createElement('span');
                tataLogoSpan.classList.add('navbar-text', 'py-0', 'tcs-white-logo', 'me-0');
                const tataLogoLink = document.createElement('a');
                tataLogoLink.classList.add('header-link', 'analytics-cta-label-class');
                tataLogoLink.href = link.href;
                tataLogoLink.target = '_blank';
                tataLogoLink.rel = 'noopener noreferrer';
                const tataLogoImg = document.createElement('img');
                const imgElement = link.querySelector('img');
                if (imgElement && imgElement.src) {
                  tataLogoImg.src = imgElement.src;
                  tataLogoImg.alt = imgElement.alt || 'tata.com logo';
                } else {
                  tataLogoImg.alt = 'tata.com logo';
                }
                tataLogoLink.append(tataLogoImg);
                const visuallyHiddenSpan = document.createElement('span');
                visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
                visuallyHiddenSpan.textContent = 'tata.com logo';
                tataLogoLink.append(visuallyHiddenSpan);
                const visuallyHiddenSpan2 = document.createElement('span');
                visuallyHiddenSpan2.classList.add('visually-hidden');
                visuallyHiddenSpan2.textContent = 'Open in New Tab';
                tataLogoLink.append(visuallyHiddenSpan2);
                tataLogoSpan.append(tataLogoLink);
                desktopToolsContainer.closest('nav').append(tataLogoSpan); // Append to the main nav element
                moveInstrumentation(link, tataLogoLink);
              }

              // Mobile Tata logo
              if (mobileNavbarOuterDiv) {
                const mobileTataLogoSpan = document.createElement('span');
                mobileTataLogoSpan.classList.add('navbar-text', 'py-0', 'tcs-white-logo');
                const mobileTataLogoLink = document.createElement('a');
                mobileTataLogoLink.classList.add('analytics-cta-label-class');
                mobileTataLogoLink.href = link.href;
                mobileTataLogoLink.target = '_blank';
                mobileTataLogoLink.rel = 'noopener noreferrer';
                const mobileTataLogoImg = document.createElement('img');
                const imgElement = link.querySelector('img');
                if (imgElement && imgElement.src) {
                  mobileTataLogoImg.src = imgElement.src;
                  mobileTataLogoImg.alt = imgElement.alt || 'tata.com logo';
                } else {
                  mobileTataLogoImg.alt = 'tata.com logo';
                }
                mobileTataLogoLink.append(mobileTataLogoImg);
                const mobileVisuallyHiddenSpan = document.createElement('span');
                mobileVisuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
                mobileVisuallyHiddenSpan.textContent = 'tata.com logo';
                mobileTataLogoLink.append(mobileVisuallyHiddenSpan);
                const mobileVisuallyHiddenSpan2 = document.createElement('span');
                mobileVisuallyHiddenSpan2.classList.add('visually-hidden');
                mobileVisuallyHiddenSpan2.textContent = 'Open in New Tab';
                mobileTataLogoLink.append(mobileVisuallyHiddenSpan2);
                mobileTataLogoSpan.append(mobileTataLogoLink);
                mobileNavbarOuterDiv.closest('nav').querySelector('.main-header').append(mobileTataLogoSpan); // Append to mobile main-header
                moveInstrumentation(link, mobileTataLogoLink);
              }
              tataLogoFound = true;
            }
          }
        }
      });
    }
  });
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
    block.innerHTML = '<p>Header fragment not found.</p>';
    return;
  }

  // Create a document fragment to build the header off-screen
  const headerFragment = document.createDocumentFragment();

  // Add root classes to the block element
  block.classList.add('d-xl-block', 'd-none', 'position-fixed', 'w-100', 'tab-header');

  const navElement = document.createElement('nav');
  navElement.classList.add('navbar', 'navbar-expand-lg', 'position-relative', 'py-0', 'set-header-onscroll');
  navElement.id = 'nav'; // Assign ID for menu toggling
  headerFragment.append(navElement);

  const headerRollover = document.createElement('div');
  headerRollover.classList.add('header_rollover', 'position-fixed', '__display', 'set-header-onscroll');
  navElement.append(headerRollover);

  const mainHeaderDiv = document.createElement('div');
  mainHeaderDiv.classList.add('main-header', 'py-0');
  navElement.append(mainHeaderDiv);

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // 1. Setup Brand Row
  if (brandRow) {
    const brandLink = brandRow.querySelector('p:first-of-type a');
    const brandImg = brandRow.querySelector('picture img');

    if (brandLink && brandImg && brandImg.src) {
      const navbarBrand = document.createElement('a');
      navbarBrand.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      navbarBrand.href = brandLink.href;
      mainHeaderDiv.append(navbarBrand);

      const imgElement = document.createElement('img');
      imgElement.classList.add('brand-logo-img');
      imgElement.src = brandImg.src;
      imgElement.alt = brandImg.alt || 'Click here or press enter to go to homepage';
      navbarBrand.append(imgElement);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      visuallyHiddenSpan.textContent = brandImg.alt || 'Click here or press enter to go to homepage';
      navbarBrand.append(visuallyHiddenSpan);
      moveInstrumentation(brandLink, navbarBrand);
    }
  } else {
    // REJECT if logo container is rendered empty
    // If brandRow is null or doesn't contain a link/image, do not render navbar-brand
  }

  const seperatorSpan = document.createElement('span');
  seperatorSpan.classList.add('seperator');
  mainHeaderDiv.append(seperatorSpan);

  // Hamburger menu for desktop (will be hidden by CSS on desktop)
  const desktopHamburger = document.createElement('div');
  desktopHamburger.classList.add('hamburger-menu');
  for (let i = 0; i < 3; i += 1) {
    desktopHamburger.append(document.createElement('span'));
  }
  mainHeaderDiv.append(desktopHamburger);

  // 2. Setup Desktop Navigation
  const desktopNavSections = setupDesktopNav(navRow, navElement);

  // 3. Setup Desktop Tools
  setupTools(toolsRow, desktopNavSections, null); // Pass null for mobileNavbarOuterDiv as it's desktop setup

  // Mobile Header Setup
  const mobileHeader = document.createElement('header');
  mobileHeader.classList.add('d-xl-none', 'd-block', 'position-fixed', 'w-100', 'overflow-hidden');
  headerFragment.append(mobileHeader);

  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('navbar', 'navbar-expand-lg');
  mobileNav.setAttribute('aria-label', 'Primary Navigation');
  mobileHeader.append(mobileNav);

  const mobileMainHeader = document.createElement('div');
  mobileMainHeader.classList.add('main-header');
  mobileNav.append(mobileMainHeader);

  if (brandRow) {
    const brandLink = brandRow.querySelector('p:first-of-type a');
    const brandImg = brandRow.querySelector('picture img');

    if (brandLink && brandImg && brandImg.src) {
      const mobileNavbarBrand = document.createElement('a');
      mobileNavbarBrand.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      mobileNavbarBrand.href = brandLink.href;
      mobileMainHeader.append(mobileNavbarBrand);

      const mobileImgElement = document.createElement('img');
      mobileImgElement.classList.add('brand-logo-img');
      mobileImgElement.src = brandImg.src;
      mobileImgElement.alt = brandImg.alt || 'Click here or press enter to go to homepage';
      mobileNavbarBrand.append(mobileImgElement);

      const mobileVisuallyHiddenSpan = document.createElement('span');
      mobileVisuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      mobileVisuallyHiddenSpan.textContent = brandImg.alt || 'Click here or press enter to go to homepage';
      mobileNavbarBrand.append(mobileVisuallyHiddenSpan);
      const mobileVisuallyHiddenSpan2 = document.createElement('span');
      mobileVisuallyHiddenSpan2.classList.add('visually-hidden');
      mobileVisuallyHiddenSpan2.textContent = 'Opens in new tab';
      mobileNavbarBrand.append(mobileVisuallyHiddenSpan2);
      moveInstrumentation(brandLink, mobileNavbarBrand);
    }
  }

  const mobileSeperator = document.createElement('span');
  mobileSeperator.classList.add('seperator');
  mobileMainHeader.append(mobileSeperator);

  // Mobile hamburger menu
  const mobileHamburger = document.createElement('div');
  mobileHamburger.classList.add('hamburger-menu');
  mobileHamburger.id = 'hamburger';
  mobileHamburger.setAttribute('aria-label', 'Navigation Menu');
  mobileHamburger.setAttribute('role', 'button');
  mobileHamburger.setAttribute('aria-expanded', 'false');
  mobileHamburger.setAttribute('tabindex', '0');
  for (let i = 0; i < 3; i += 1) {
    mobileHamburger.append(document.createElement('span'));
  }
  mobileMainHeader.append(mobileHamburger);

  const mobileNavbarCollapse = document.createElement('div');
  mobileNavbarCollapse.classList.add('navbar-collapse', 'overflow-hidden');
  mobileNavbarCollapse.id = 'navbarMenu';
  mobileNav.append(mobileNavbarCollapse);

  const mobileNavbarOuterDiv = document.createElement('div');
  mobileNavbarOuterDiv.classList.add('mobile-navbar-outer-div', 'd-flex', 'flex-column', 'justify-content-start', 'h-100');
  mobileNavbarCollapse.append(mobileNavbarOuterDiv);

  // 4. Setup Mobile Navigation
  setupMobileNav(navRow, mobileNavbarOuterDiv);

  // 5. Setup Mobile Tools (reusing logic, but targeting mobile elements)
  setupTools(toolsRow, null, mobileNavbarOuterDiv); // Pass null for docFragment as it's mobile setup

  // Append the constructed fragment to the block
  block.append(headerFragment);

  // Add event listeners for desktop nav
  const desktopNavSectionsUl = navElement.querySelector('.navbar-nav');
  if (desktopNavSectionsUl) {
    desktopNavSectionsUl.querySelectorAll('.nav-item').forEach((navSection) => {
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.classList.contains('active');
          toggleAllNavSections(desktopNavSectionsUl, false); // Close all others
          navSection.classList.toggle('active', !expanded);
          const navLink = navSection.querySelector('.nav-link');
          if (navLink) {
            navLink.setAttribute('aria-expanded', !expanded);
            navLink.setAttribute('tabindex', '0');
          }
          const megaMenu = navSection.querySelector('.mega_menu');
          if (megaMenu) megaMenu.setAttribute('aria-hidden', expanded);
        }
      });
    });
  }

  // Hamburger for mobile
  mobileHamburger.addEventListener('click', () => {
    toggleMenu(mobileNav, mobileNavbarOuterDiv.querySelector('.tab-mob-view'), null);
  });

  // Initial state for mobile nav
  toggleMenu(mobileNav, mobileNavbarOuterDiv.querySelector('.tab-mob-view'), isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(mobileNav, mobileNavbarOuterDiv.querySelector('.tab-mob-view'), isDesktop.matches));
}
