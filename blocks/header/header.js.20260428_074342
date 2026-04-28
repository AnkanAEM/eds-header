import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Moves instrumentation attributes from an old element to a new one.
 * @param {Element} oldElement The element to read attributes from
 * @param {Element} newElement The element to write attributes to
 */
function moveInstrumentation(oldElement, newElement) {
  if (!oldElement || !newElement) return;
  [...oldElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

/**
 * Closes the mobile menu on escape key press.
 * @param {KeyboardEvent} e The keyboard event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;

    if (isDesktop.matches) {
      const navSections = nav.querySelector('.navbar-nav');
      if (navSections) {
        toggleAllNavSections(navSections, false);
      }
      // Focus on the first nav item or brand logo after closing
      const firstNavItem = nav.querySelector('.nav-item a');
      if (firstNavItem) firstNavItem.focus();
    } else {
      // eslint-disable-next-line no-use-before-define
      toggleMobileMenu(nav, false); // Force close mobile menu
      const hamburgerButton = nav.querySelector('.hamburger-menu');
      if (hamburgerButton) hamburgerButton.focus();
    }
  }
}

/**
 * Closes the mobile menu when focus is lost from the navigation.
 * @param {FocusEvent} e The focus event
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    if (isDesktop.matches) {
      const navSections = nav.querySelector('.navbar-nav');
      if (navSections) {
        toggleAllNavSections(navSections, false);
      }
    } else {
      // eslint-disable-next-line no-use-before-define
      toggleMobileMenu(nav, false); // Force close mobile menu
    }
  }
}

/**
 * Toggles all nav sections (for desktop multi-level dropdowns).
 * @param {Element} sections The container element for nav sections
 * @param {boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-item').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const megaMenu = section.querySelector('.mega_menu');
    if (megaMenu) {
      megaMenu.setAttribute('aria-hidden', !expanded);
      megaMenu.classList.toggle('show', expanded);
    }
  });
}

/**
 * Toggles the mobile navigation menu.
 * @param {Element} nav The main navigation element
 * @param {boolean} forceExpanded Optional param to force nav expand behavior (true to open, false to close)
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger-menu');
  const navbarCollapse = nav.querySelector('.navbar-collapse');
  const headerAccordion = nav.querySelector('#header-accordion'); // Mobile accordion container

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  if (hamburger) hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  if (navbarCollapse) navbarCollapse.classList.toggle('show', expanded);

  // Collapse all mobile accordion sections when closing the main mobile menu
  if (!expanded && headerAccordion) {
    headerAccordion.querySelectorAll('.card-header-new').forEach((section) => {
      section.setAttribute('aria-expanded', 'false');
      const targetId = section.getAttribute('data-bs-target');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.classList.remove('show');
        targetElement.setAttribute('aria-hidden', 'true');
      }
      // Also collapse L3 menus
      section.querySelectorAll('.l3-expand-icon').forEach(l3Icon => {
        l3Icon.setAttribute('aria-expanded', 'false');
        const l3TargetId = l3Icon.getAttribute('aria-controls');
        const l3TargetElement = document.getElementById(l3TargetId);
        if (l3TargetElement) {
          l3TargetElement.classList.remove('show');
          l3TargetElement.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Parses the fragment into its main structural components.
 * @param {Element} fragment The loaded fragment DOM
 * @returns {{brandRow: Element, navRow: Element, toolsRow: Element}}
 */
function parseStructure(fragment) {
  // Assuming a strict structure: first child is brand, second is nav, third is tools
  const children = Array.from(fragment.children).filter((node) => node.nodeType === 1); // Only element nodes
  const brandRow = children[0];
  const navRow = children[1];
  const toolsRow = children[2];

  // Account for .default-content-wrapper nesting
  const getInnerContent = (row) => row?.querySelector('.default-content-wrapper') || row;

  return {
    brandRow: getInnerContent(brandRow),
    navRow: getInnerContent(navRow),
    toolsRow: getInnerContent(toolsRow),
  };
}

/**
 * Sets up the desktop navigation by decorating the existing fragment DOM.
 * @param {Element} navRow The navigation row from the fragment
 * @param {Element} navbarNav The ul.navbar-nav element to append to
 * @param {Element} megaMenuContainer The container for mega menus
 */
function setupDesktopNav(navRow, navbarNav, megaMenuContainer) {
  if (!navRow || !navbarNav || !megaMenuContainer) return;

  let navItemIndex = 0;
  let currentNavItemLi = null;
  let currentMegaMenuDiv = null;
  let currentOverviewSection = null;
  let currentLinkSectionUl = null;
  let currentLinkDataSection = null;
  let contentBuffer = []; // Buffer for content before the first UL

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== 1) return; // Skip non-element nodes

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., "What we do")
      const navLink = child.querySelector('a');
      const navTitle = navLink ? navLink.textContent.trim() : '';
      const navHref = navLink ? navLink.href : '#';

      currentNavItemLi = document.createElement('li');
      currentNavItemLi.classList.add('nav-item', 'nav_item_li', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
      currentNavItemLi.setAttribute('data-nav', `subHeader${navItemIndex}`);
      currentNavItemLi.setAttribute('data-nav-link', navHref);
      currentNavItemLi.setAttribute('role', 'presentation');
      moveInstrumentation(child, currentNavItemLi);

      const navAnchor = document.createElement('a');
      navAnchor.classList.add('nav-link', 'd-block', 'position-relative', 'analytics-cta-label-class');
      navAnchor.setAttribute('role', 'menuitem');
      navAnchor.setAttribute('aria-haspopup', 'true');
      navAnchor.setAttribute('aria-expanded', 'false');
      navAnchor.setAttribute('tabindex', '0');
      navAnchor.href = navHref;
      navAnchor.textContent = navTitle;
      moveInstrumentation(navLink, navAnchor);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('desktop-header-dropdown-icon');
      navAnchor.append(dropdownIcon);
      currentNavItemLi.append(navAnchor);

      const navUnderline = document.createElement('span');
      navUnderline.classList.add('nav-underline');
      currentNavItemLi.append(navUnderline);

      navbarNav.append(currentNavItemLi);

      // Create mega menu for this trigger
      currentMegaMenuDiv = document.createElement('div');
      currentMegaMenuDiv.classList.add('mega_menu', 'pt-32', 'position-absolute', 'set-menu-onscroll');
      currentMegaMenuDiv.setAttribute('data-nav', `subHeader${navItemIndex}`);
      currentMegaMenuDiv.setAttribute('aria-hidden', 'true');
      megaMenuContainer.append(currentMegaMenuDiv);

      const tcsCustomContainer = document.createElement('div');
      tcsCustomContainer.classList.add('tcs-custom-container', 'px-0', 'menu_container');
      currentMegaMenuDiv.append(tcsCustomContainer);

      const rowPositionRelative = document.createElement('div');
      rowPositionRelative.classList.add('row', 'position-relative', 'mx-0');
      tcsCustomContainer.append(rowPositionRelative);

      const col11MegaMenuInternalDiv = document.createElement('div');
      col11MegaMenuInternalDiv.classList.add('col-11', 'mega_menu_internal_div');
      rowPositionRelative.append(col11MegaMenuInternalDiv);

      const headerInnerLeft = document.createElement('div');
      headerInnerLeft.classList.add('header-inner-left');
      col11MegaMenuInternalDiv.append(headerInnerLeft);

      const subHeaderMainRow = document.createElement('div');
      subHeaderMainRow.classList.add('row', 'sub-header-main-row');
      headerInnerLeft.append(subHeaderMainRow);

      currentOverviewSection = document.createElement('div');
      currentOverviewSection.classList.add('col-3', 'sub-header-overview-section');
      subHeaderMainRow.append(currentOverviewSection);

      const subHeaderContent = document.createElement('div');
      subHeaderContent.classList.add('sub-header-content', 'sub_header_description', 'd-block');
      currentOverviewSection.append(subHeaderContent);

      // Flush content buffer into the overview section
      if (contentBuffer.length > 0) {
        contentBuffer.forEach(bufferedNode => {
          subHeaderContent.append(bufferedNode);
        });
        contentBuffer = []; // Clear buffer
      }

      const linkSection = document.createElement('div');
      linkSection.classList.add('col-3', 'sub-header-link-section');
      subHeaderMainRow.append(linkSection);

      currentLinkSectionUl = document.createElement('ul');
      currentLinkSectionUl.classList.add('inner-ul', 'position-relative', 'ps-0');
      currentLinkSectionUl.setAttribute('role', 'menu');
      linkSection.append(currentLinkSectionUl);

      currentLinkDataSection = document.createElement('div');
      currentLinkDataSection.classList.add('col-6', 'sub-header-link-data-section');
      subHeaderMainRow.append(currentLinkDataSection);

      const subHeaderRightRollover = document.createElement('div');
      subHeaderRightRollover.classList.add('sub-header-right-rollover', 'position-absolute', 'd-none');
      rowPositionRelative.append(subHeaderRightRollover);

      // Event listeners for desktop hover
      currentNavItemLi.addEventListener('mouseenter', () => {
        toggleAllNavSections(navbarNav, false); // Close others
        currentNavItemLi.setAttribute('aria-expanded', 'true');
        currentMegaMenuDiv.setAttribute('aria-hidden', 'false');
        currentMegaMenuDiv.classList.add('show');
      });

      currentMegaMenuDiv.addEventListener('mouseleave', () => {
        currentNavItemLi.setAttribute('aria-expanded', 'false');
        currentMegaMenuDiv.setAttribute('aria-hidden', 'true');
        currentMegaMenuDiv.classList.remove('show');
      });

      navItemIndex += 1;
    } else if (child.tagName === 'UL' && currentNavItemLi && currentLinkSectionUl && currentLinkDataSection) {
      // This is a submenu for the currentTitleTrigger
      Array.from(child.children).forEach((li) => {
        if (li.nodeType !== 1) return; // Skip non-element nodes

        const l2Link = li.querySelector('a');
        if (l2Link) {
          const l2Text = Array.from(l2Link.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join('');
          const sanitizedL2Text = sanitizeClassName(l2Text);

          const innerLinkRow = document.createElement('li');
          innerLinkRow.classList.add('inner-link', 'row');
          innerLinkRow.setAttribute('data-id', l2Text);
          innerLinkRow.setAttribute('role', 'presentation');
          moveInstrumentation(li, innerLinkRow);

          const l2Anchor = document.createElement('a');
          l2Anchor.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'l2_link', 'non-overview_link', 'py-2', 'px-0', 'position-relative', 'analytics-cta-label-class');
          l2Anchor.setAttribute('role', 'menuitem');
          l2Anchor.setAttribute('tabindex', '0');
          l2Anchor.href = l2Link.href;
          l2Anchor.textContent = l2Text;
          moveInstrumentation(l2Link, l2Anchor);

          const divFlexAlign = document.createElement('div');
          divFlexAlign.classList.add('d-flex', 'align-items-center');
          l2Anchor.append(divFlexAlign);

          const nestedUl = li.querySelector('ul');
          if (nestedUl) {
            const rightArrowIcon = document.createElement('span');
            rightArrowIcon.classList.add('header-right-arrow-icon');
            divFlexAlign.append(rightArrowIcon);
            const visuallyHiddenSpan = document.createElement('span');
            visuallyHiddenSpan.classList.add('visually-hidden');
            visuallyHiddenSpan.textContent = 'Press tab for submenu items';
            l2Anchor.append(visuallyHiddenSpan);

            // Create the L3 submenu
            const rightSubmenuL3 = document.createElement('ul');
            rightSubmenuL3.classList.add('right-submenu-l3', 'sub-header-content-link-ul', 'position-relative', 'd-none');
            rightSubmenuL3.setAttribute('data-id', l2Text);
            moveInstrumentation(nestedUl, rightSubmenuL3);

            Array.from(nestedUl.children).forEach((l3Li) => {
              if (l3Li.nodeType !== 1) return; // Skip non-element nodes
              const l3Anchor = l3Li.querySelector('a');
              if (l3Anchor) {
                const l3ListItem = document.createElement('li');
                l3ListItem.classList.add('l3-li-list');
                moveInstrumentation(l3Li, l3ListItem);

                const l3Link = document.createElement('a');
                l3Link.classList.add('l3-li-link', 'analytics-cta-label-class');
                l3Link.href = l3Anchor.href;
                l3Link.textContent = l3Anchor.textContent.trim();
                moveInstrumentation(l3Anchor, l3Link);
                l3ListItem.append(l3Link);
                rightSubmenuL3.append(l3ListItem);
              }
            });
            currentLinkDataSection.append(rightSubmenuL3);
          }

          innerLinkRow.append(l2Anchor);
          const l3Divider = document.createElement('div');
          l3Divider.classList.add('l3_divinder');
          innerLinkRow.append(l3Divider);
          currentLinkSectionUl.append(innerLinkRow);

          // Add hover effect for L2 links to show L3 content
          innerLinkRow.addEventListener('mouseenter', () => {
            currentLinkDataSection.querySelectorAll('.right-submenu-l3').forEach(submenu => {
              submenu.classList.add('d-none');
            });
            const targetSubmenu = currentLinkDataSection.querySelector(`[data-id="${l2Text}"]`);
            if (targetSubmenu) {
              targetSubmenu.classList.remove('d-none');
            }
          });
        }
      });
    } else if (currentOverviewSection) {
      // Collect non-navigation siblings (like H3, P, DIV with CTA) into the buffer
      contentBuffer.push(child.cloneNode(true));
    }
  });
}

/**
 * Sets up the mobile navigation by decorating the existing fragment DOM.
 * @param {Element} navRow The navigation row from the fragment
 * @param {Element} mobileAccordion The container for mobile accordion items
 */
function setupMobileNav(navRow, mobileAccordion) {
  if (!navRow || !mobileAccordion) return;

  let navItemIndex = 0;
  let currentCardHeader = null;
  let currentMobileCollapseDiv = null;
  let currentPs3Div = null;
  let contentBuffer = [];

  Array.from(navRow.children).forEach((child) => {
    if (child.nodeType !== 1) return; // Skip non-element nodes

    if (child.tagName === 'P' && child.querySelector('a')) {
      // This is a navigation trigger (e.g., "What we do")
      const navLink = child.querySelector('a');
      const navTitle = navLink ? navLink.textContent.trim() : '';
      const navHref = navLink ? navLink.href : '#';

      currentCardHeader = document.createElement('div');
      currentCardHeader.classList.add('card-header', 'card-header-new', 'level2-accordion-card', 'mx-0');
      currentCardHeader.setAttribute('data-link', `subHeader${navItemIndex}`);
      currentCardHeader.setAttribute('data-href', navHref);
      currentCardHeader.id = `subHeader${navItemIndex}L2`;
      currentCardHeader.setAttribute('aria-expanded', 'false'); // Initial state
      moveInstrumentation(child, currentCardHeader);
      mobileAccordion.append(currentCardHeader);

      const mb0Div = document.createElement('div');
      mb0Div.classList.add('mb-0', 'd-flex', 'align-items-center', 'mobile-l1-link');
      currentCardHeader.append(mb0Div);

      const btnLink = document.createElement('button'); // Changed to button for accessibility
      btnLink.classList.add('btn', 'btn-link', 'main-accordion-btn', 'sub-header-btn-link');
      btnLink.setAttribute('aria-expanded', 'false');
      btnLink.setAttribute('aria-controls', `subHeader${navItemIndex}`);
      btnLink.textContent = navTitle;
      mb0Div.append(btnLink);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('header-dropdown-icon');
      btnLink.append(dropdownIcon);

      // Mobile collapse content
      currentMobileCollapseDiv = document.createElement('div');
      currentMobileCollapseDiv.id = `subHeader${navItemIndex}`;
      currentMobileCollapseDiv.classList.add('collapse', 'uniques', 'mobile-level2');
      currentMobileCollapseDiv.setAttribute('aria-hidden', 'true');
      mobileAccordion.append(currentMobileCollapseDiv);

      currentPs3Div = document.createElement('div');
      currentPs3Div.classList.add('ps-3', 'd-flex', 'flex-column');
      currentPs3Div.id = `sub-menu-accordion-subHeader${navItemIndex}`;
      currentMobileCollapseDiv.append(currentPs3Div);

      const overviewLink = document.createElement('a');
      overviewLink.classList.add('mobile-tab-link', 'py-2', 'overview-link', 'analytics-cta-label-class');
      overviewLink.setAttribute('data-nav-id', `subHeader${navItemIndex}`);
      overviewLink.href = navHref;
      moveInstrumentation(navLink, overviewLink);

      const overviewTextSpan = document.createElement('span');
      overviewTextSpan.classList.add('overview-text');
      overviewTextSpan.textContent = navTitle;
      overviewLink.append(overviewTextSpan);
      currentPs3Div.append(overviewLink);

      // Add content from buffer (e.g., H3, P, CTA) to the overview section if present
      if (contentBuffer.length > 0) {
        const overviewContentDiv = document.createElement('div');
        overviewContentDiv.classList.add('sub-header-content', 'sub_header_description', 'd-block', 'px-3', 'py-2');
        contentBuffer.forEach(bufferedNode => {
          overviewContentDiv.append(bufferedNode);
        });
        currentPs3Div.prepend(overviewContentDiv); // Prepend to appear before links
        contentBuffer = []; // Clear buffer
      }

      // Add click listener for mobile accordion
      btnLink.addEventListener('click', () => {
        const isExpanded = btnLink.getAttribute('aria-expanded') === 'true';
        // Close all other open accordions in the same level
        mobileAccordion.querySelectorAll('.main-accordion-btn').forEach(otherBtn => {
          if (otherBtn !== btnLink && otherBtn.getAttribute('aria-expanded') === 'true') {
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherTargetId = otherBtn.getAttribute('aria-controls');
            const otherTargetElement = document.getElementById(otherTargetId);
            if (otherTargetElement) {
              otherTargetElement.classList.remove('show');
              otherTargetElement.setAttribute('aria-hidden', 'true');
            }
            // Also collapse L3 menus within the other L2
            otherTargetElement?.querySelectorAll('.l3-expand-icon').forEach(l3Icon => {
              l3Icon.setAttribute('aria-expanded', 'false');
              const l3TargetId = l3Icon.getAttribute('aria-controls');
              const l3TargetElement = document.getElementById(l3TargetId);
              if (l3TargetElement) {
                l3TargetElement.classList.remove('show');
                l3TargetElement.setAttribute('aria-hidden', 'true');
              }
            });
          }
        });

        btnLink.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        currentMobileCollapseDiv.classList.toggle('show', !isExpanded);
        currentMobileCollapseDiv.setAttribute('aria-hidden', isExpanded);
      });

      navItemIndex += 1;
    } else if (child.tagName === 'UL' && currentPs3Div) {
      // This is a submenu for the currentTitleTrigger
      Array.from(child.children).forEach((li, l2Index) => {
        if (li.nodeType !== 1) return; // Skip non-element nodes

        const l2Link = li.querySelector('a');
        if (l2Link) {
          const l2Text = Array.from(l2Link.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join('');
          const l2Href = l2Link.href;

          const innerLinkMobile = document.createElement('li');
          innerLinkMobile.setAttribute('type', 'button'); // This is unusual, li should not have type="button"
          innerLinkMobile.classList.add('d-flex', 'flex-column', 'inner-link', 'inner-link-mobile');
          innerLinkMobile.id = `parent-subHeader${navItemIndex - 1}${l2Index}`;
          moveInstrumentation(li, innerLinkMobile);
          currentPs3Div.append(innerLinkMobile);

          const level2AccordionDiv = document.createElement('div');
          level2AccordionDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'level-2-accordion', 'py-2');
          innerLinkMobile.append(level2AccordionDiv);

          const mobileTabLink = document.createElement('a');
          mobileTabLink.classList.add('mobile-tab-link', 'analytics-cta-label-class');
          mobileTabLink.href = l2Href;
          mobileTabLink.textContent = l2Text;
          moveInstrumentation(l2Link, mobileTabLink);
          level2AccordionDiv.append(mobileTabLink);

          const nestedUl = li.querySelector('ul');
          if (nestedUl) {
            const expandIcon = document.createElement('button'); // Changed to button for accessibility
            expandIcon.classList.add('header-plus-icon', 'l3-expand-icon');
            expandIcon.setAttribute('aria-expanded', 'false');
            expandIcon.setAttribute('aria-label', `Expand submenu for ${l2Text}`);
            expandIcon.setAttribute('aria-controls', `child-subHeader${navItemIndex - 1}${l2Index}`);
            level2AccordionDiv.append(expandIcon);

            // Mobile L3 collapse
            const childSubHeaderDiv = document.createElement('div');
            childSubHeaderDiv.id = `child-subHeader${navItemIndex - 1}${l2Index}`;
            childSubHeaderDiv.classList.add('collapse', 'inner-link-mobilel3');
            childSubHeaderDiv.setAttribute('aria-hidden', 'true');
            innerLinkMobile.append(childSubHeaderDiv);

            const l3UlListMobile = document.createElement('ul');
            l3UlListMobile.classList.add('l3-ul-list-mobile', 'list-group', 'pt-3', 'ps-3');
            childSubHeaderDiv.append(l3UlListMobile);

            Array.from(nestedUl.children).forEach((l3Li) => {
              if (l3Li.nodeType !== 1) return; // Skip non-element nodes
              const l3Anchor = l3Li.querySelector('a');
              if (l3Anchor) {
                const l3ListItem = document.createElement('li');
                l3ListItem.classList.add('l3-li-list-mobile', 'pb-3');
                moveInstrumentation(l3Li, l3ListItem);

                const l3Link = document.createElement('a');
                l3Link.classList.add('l3-li-list-mobile-link', 'analytics-cta-label-class');
                l3Link.href = l3Anchor.href;
                l3Link.textContent = l3Anchor.textContent.trim();
                moveInstrumentation(l3Anchor, l3Link);
                l3ListItem.append(l3Link);
                l3UlListMobile.append(l3ListItem);
              }
            });

            // Add click listener for L3 expand/collapse
            expandIcon.addEventListener('click', () => {
              const isL3Expanded = expandIcon.getAttribute('aria-expanded') === 'true';
              // Close other L3s within the same L2
              currentPs3Div.querySelectorAll('.l3-expand-icon').forEach(otherL3Icon => {
                if (otherL3Icon !== expandIcon && otherL3Icon.getAttribute('aria-expanded') === 'true') {
                  otherL3Icon.setAttribute('aria-expanded', 'false');
                  const otherL3TargetId = otherL3Icon.getAttribute('aria-controls');
                  const otherL3TargetElement = document.getElementById(otherL3TargetId);
                  if (otherL3TargetElement) {
                    otherL3TargetElement.classList.remove('show');
                    otherL3TargetElement.setAttribute('aria-hidden', 'true');
                  }
                }
              });

              expandIcon.setAttribute('aria-expanded', isL3Expanded ? 'false' : 'true');
              childSubHeaderDiv.classList.toggle('show', !isL3Expanded);
              childSubHeaderDiv.setAttribute('aria-hidden', isL3Expanded);
            });
          }
        }
      });
    } else {
      // Collect non-navigation siblings (like H3, P, DIV with CTA) into the buffer
      contentBuffer.push(child.cloneNode(true));
    }
  });
}


/**
 * Sets up the tools section (search, global, contact).
 * @param {Element} toolsRow The tools row from the fragment
 * @param {Element} desktopToolsContainer The container for desktop tools
 * @param {Element} mobileToolsContainer The container for mobile tools
 */
function setupTools(toolsRow, desktopToolsContainer, mobileToolsContainer) {
  if (!toolsRow) return;

  // Find the relevant elements from the fragment's toolsRow
  const searchLink = toolsRow.querySelector('a[href="#search-overlay"]');
  const globalLink = toolsRow.querySelector('a[href*="worldwide"]'); // Assuming global link contains 'worldwide'
  const contactLink = toolsRow.querySelector('a[href*="contact-us"]');
  const tataLink = toolsRow.querySelector('img[alt="tata.com logo"]')?.closest('a');

  // --- Desktop Tools ---
  if (desktopToolsContainer) {
    // Search Button
    if (searchLink) {
      const searchDivDesktop = document.createElement('div');
      searchDivDesktop.classList.add('ms-auto');
      searchDivDesktop.setAttribute('role', 'search');
      desktopToolsContainer.append(searchDivDesktop);

      const searchButtonDesktop = document.createElement('button');
      searchButtonDesktop.classList.add('navbar-text', 'd-flex', 'search-btn', 'header-link', 'me-4');
      searchButtonDesktop.setAttribute('title', searchLink.textContent.trim() || 'Search Button');
      searchButtonDesktop.setAttribute('tabindex', '0');
      searchButtonDesktop.setAttribute('type', 'button');
      searchButtonDesktop.addEventListener('click', () => {
        // Implement search modal open logic here
        console.log('Desktop Search button clicked');
      });
      moveInstrumentation(searchLink, searchButtonDesktop);

      const visuallyHiddenSearch = document.createElement('span');
      visuallyHiddenSearch.classList.add('visually-hidden');
      visuallyHiddenSearch.textContent = searchLink.textContent.trim() || 'Search Button';
      searchButtonDesktop.append(visuallyHiddenSearch);
      searchDivDesktop.append(searchButtonDesktop);
    }

    // Global Language Dropdown
    if (globalLink) {
      const globalDivDesktop = document.createElement('div');
      globalDivDesktop.classList.add('navbar-text', 'me-0', 'ms-0');
      desktopToolsContainer.append(globalDivDesktop);

      const dropdownDesktop = document.createElement('div');
      dropdownDesktop.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
      globalDivDesktop.append(dropdownDesktop);

      const globalAnchorDesktop = document.createElement('a');
      globalAnchorDesktop.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
      globalAnchorDesktop.href = globalLink.href; // Use fragment link
      globalAnchorDesktop.setAttribute('role', 'button');
      globalAnchorDesktop.setAttribute('aria-haspopup', 'true');
      globalAnchorDesktop.setAttribute('aria-expanded', 'false');
      globalAnchorDesktop.setAttribute('aria-controls', 'global-menu');
      moveInstrumentation(globalLink, globalAnchorDesktop);

      const globeIcon = document.createElement('span');
      globeIcon.classList.add('globe-icon-map');
      globalAnchorDesktop.append(globeIcon);

      const dropdownText = document.createElement('span');
      dropdownText.classList.add('dropdown-text', 'analytics-cta-label-child-class');
      dropdownText.textContent = globalLink.textContent.trim();
      globalAnchorDesktop.append(dropdownText);

      const headerDropdownIcon = document.createElement('span');
      headerDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
      globalAnchorDesktop.append(headerDropdownIcon);
      dropdownDesktop.append(globalAnchorDesktop);

      // Extract the actual UL for global menu from the fragment
      const globalMenuUl = globalLink.closest('li')?.querySelector('ul');
      if (globalMenuUl) {
        const globalMenuDesktop = globalMenuUl.cloneNode(true);
        globalMenuDesktop.classList.add('dropdown-menu', 'accordion-list');
        globalMenuDesktop.id = 'global-menu';
        globalMenuDesktop.setAttribute('role', 'menu');
        globalMenuDesktop.setAttribute('aria-label', 'global language selection');
        dropdownDesktop.append(globalMenuDesktop);
      }
    }

    // Contact Us
    if (contactLink) {
      const contactDivDesktop = document.createElement('div');
      contactDivDesktop.classList.add('navbar-text');
      desktopToolsContainer.append(contactDivDesktop);

      const contactAnchorDesktop = document.createElement('a');
      contactAnchorDesktop.classList.add('header-link', 'analytics-cta-label-class');
      contactAnchorDesktop.setAttribute('tabindex', '0');
      contactAnchorDesktop.href = contactLink.href;
      contactAnchorDesktop.textContent = contactLink.textContent.trim();
      moveInstrumentation(contactLink, contactAnchorDesktop);
      contactDivDesktop.append(contactAnchorDesktop);
    }

    // Tata Logo
    if (tataLink) {
      const tataLogoSpanDesktop = document.createElement('span');
      tataLogoSpanDesktop.classList.add('navbar-text', 'py-0', 'tcs-white-logo', 'me-0');
      desktopToolsContainer.append(tataLogoSpanDesktop);

      const tataAnchorDesktop = tataLink.cloneNode(true); // Clone the entire link with img
      tataAnchorDesktop.classList.add('header-link', 'analytics-cta-label-class');
      tataAnchorDesktop.setAttribute('target', '_blank');
      tataAnchorDesktop.setAttribute('rel', 'noopener noreferrer');
      // Ensure the img has the correct alt text and visually hidden spans
      const tataImgDesktop = tataAnchorDesktop.querySelector('img');
      if (tataImgDesktop) {
        tataImgDesktop.alt = tataImgDesktop.alt || 'tata.com logo';
        // Remove existing visually hidden spans to re-add them consistently
        tataAnchorDesktop.querySelectorAll('.visually-hidden').forEach(span => span.remove());

        const tataVisuallyHiddenSpan = document.createElement('span');
        tataVisuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
        tataVisuallyHiddenSpan.textContent = tataImgDesktop.alt;
        tataAnchorDesktop.append(tataVisuallyHiddenSpan);

        const tataVisuallyHiddenSpan2 = document.createElement('span');
        tataVisuallyHiddenSpan2.classList.add('visually-hidden');
        tataVisuallyHiddenSpan2.textContent = 'Open in New Tab';
        tataAnchorDesktop.append(tataVisuallyHiddenSpan2);
      }
      tataLogoSpanDesktop.append(tataAnchorDesktop);
    }
  }

  // --- Mobile Tools ---
  if (mobileToolsContainer) {
    // Mobile Search
    if (searchLink) {
      const mobileSearchDiv = document.createElement('div');
      mobileSearchDiv.classList.add('mobile-search-div');
      mobileSearchDiv.setAttribute('role', 'search');
      mobileToolsContainer.append(mobileSearchDiv);

      const mobileSearchButton = document.createElement('button');
      mobileSearchButton.classList.add('navbar-text', 'search-icon-link', 'searchIcon', 'search-btn');
      mobileSearchButton.setAttribute('tabindex', '0');
      mobileSearchButton.setAttribute('aria-label', searchLink.textContent.trim() || 'Search');
      mobileSearchButton.setAttribute('type', 'button');
      mobileSearchButton.addEventListener('click', () => {
        // Implement search modal open logic here
        console.log('Mobile Search button clicked');
      });
      moveInstrumentation(searchLink, mobileSearchButton);

      const mobileSearchVisuallyHidden = document.createElement('span');
      mobileSearchVisuallyHidden.classList.add('visually-hidden', 'd-none');
      mobileSearchVisuallyHidden.textContent = searchLink.textContent.trim() || 'Search';
      mobileSearchButton.append(mobileSearchVisuallyHidden);
      mobileSearchDiv.append(mobileSearchButton);
    }

    // Mobile Global Dropdown
    if (globalLink) {
      const mobileGlobalDiv = document.createElement('div');
      mobileGlobalDiv.classList.add('navbar-text', 'mobile-contact-text', 'pt-2');
      mobileToolsContainer.append(mobileGlobalDiv);

      const mobileDropdown = document.createElement('div');
      mobileDropdown.classList.add('dropdown', 'd-flex', 'flex-column', 'justify-content-center');
      mobileGlobalDiv.append(mobileDropdown);

      const mobileGlobalAnchor = document.createElement('a');
      mobileGlobalAnchor.classList.add('nav-link', 'dropdown-toggle', 'analytics-cta-label-class');
      mobileGlobalAnchor.href = globalLink.href;
      moveInstrumentation(globalLink, mobileGlobalAnchor);

      const mobileGlobeIcon = document.createElement('span');
      mobileGlobeIcon.classList.add('globe-icon-map');
      mobileGlobalAnchor.append(mobileGlobeIcon);

      const mobileDropdownText = document.createElement('span');
      mobileDropdownText.classList.add('dropdown-text', 'analytics-cta-label-child-class');
      mobileDropdownText.textContent = globalLink.textContent.trim();
      mobileGlobalAnchor.append(mobileDropdownText);

      const mobileHeaderDropdownIcon = document.createElement('span');
      mobileHeaderDropdownIcon.classList.add('header-dropdown-icon', 'dropdown-icon');
      mobileGlobalAnchor.append(mobileHeaderDropdownIcon);
      mobileDropdown.append(mobileGlobalAnchor);

      // Re-use desktop global menu for mobile (clone it)
      const globalMenuUl = globalLink.closest('li')?.querySelector('ul');
      if (globalMenuUl) {
        const globalMenuMobileClone = globalMenuUl.cloneNode(true);
        globalMenuMobileClone.classList.add('dropdown-menu', 'accordion-list');
        globalMenuMobileClone.id = 'global-menu-mobile'; // Give it a unique ID
        globalMenuMobileClone.setAttribute('role', 'menu');
        globalMenuMobileClone.setAttribute('aria-label', 'global language selection');
        mobileDropdown.append(globalMenuMobileClone);
      }
    }

    // Mobile Contact Us
    if (contactLink) {
      const mobileContactDiv = document.createElement('div');
      mobileContactDiv.classList.add('navbar-text', 'd-block', 'mobile-contact-text', 'pt-2');
      mobileToolsContainer.append(mobileContactDiv);

      const mobileContactAnchor = document.createElement('a');
      mobileContactAnchor.classList.add('contact-text', 'analytics-cta-label-class');
      mobileContactAnchor.setAttribute('tabindex', '-1'); // Hidden from tab order when mobile menu is closed
      mobileContactAnchor.setAttribute('aria-hidden', 'true'); // Hidden from accessibility tree when mobile menu is closed
      mobileContactAnchor.href = contactLink.href;
      mobileContactAnchor.textContent = contactLink.textContent.trim();
      moveInstrumentation(contactLink, mobileContactAnchor);
      mobileContactDiv.append(mobileContactAnchor);
    }

    // Mobile Tata Logo
    if (tataLink) {
      const mobileTataLogoSpan = document.createElement('span');
      mobileTataLogoSpan.classList.add('navbar-text', 'py-0', 'tcs-white-logo');
      mobileToolsContainer.append(mobileTataLogoSpan);

      const mobileTataAnchor = tataLink.cloneNode(true); // Clone the entire link with img
      mobileTataAnchor.classList.add('analytics-cta-label-class');
      mobileTataAnchor.setAttribute('target', '_blank');
      mobileTataAnchor.setAttribute('rel', 'noopener noreferrer');
      // Ensure the img has the correct alt text and visually hidden spans
      const mobileTataImg = mobileTataAnchor.querySelector('img');
      if (mobileTataImg) {
        mobileTataImg.alt = mobileTataImg.alt || 'tata.com logo';
        // Remove existing visually hidden spans to re-add them consistently
        mobileTataAnchor.querySelectorAll('.visually-hidden').forEach(span => span.remove());

        const mobileTataVisuallyHiddenSpan = document.createElement('span');
        mobileTataVisuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
        mobileTataVisuallyHiddenSpan.textContent = mobileTataImg.alt;
        mobileTataAnchor.append(mobileTataVisuallyHiddenSpan);

        const mobileTataVisuallyHiddenSpan2 = document.createElement('span');
        mobileTataVisuallyHiddenSpan2.classList.add('visually-hidden');
        mobileTataVisuallyHiddenSpan2.textContent = 'Open in New Tab';
        mobileTataAnchor.append(mobileTataVisuallyHiddenSpan2);
      }
      mobileTataLogoSpan.append(mobileTataAnchor);
    }
  }
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
    block.remove();
    return;
  }

  // decorate nav DOM
  block.textContent = '';

  const { brandRow, navRow, toolsRow } = parseStructure(fragment);

  // Desktop Header
  const desktopHeader = document.createElement('header');
  desktopHeader.classList.add('d-xl-block', 'd-none', 'position-fixed', 'w-100', 'tab-header');
  block.append(desktopHeader);

  const desktopNav = document.createElement('nav');
  desktopNav.classList.add('navbar', 'navbar-expand-lg', 'position-relative', 'py-0', 'set-header-onscroll');
  desktopHeader.append(desktopNav);

  const headerRollover = document.createElement('div');
  headerRollover.classList.add('header_rollover', 'position-fixed', '__display', 'set-header-onscroll');
  desktopNav.append(headerRollover);

  const mainHeaderDesktop = document.createElement('div');
  mainHeaderDesktop.classList.add('main-header', 'py-0');
  desktopNav.append(mainHeaderDesktop);

  // Brand Logo (Desktop)
  if (brandRow) {
    const brandLink = brandRow.querySelector('p:first-child a') || brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture img');

    if (brandLink && brandImg) {
      const navbarBrand = document.createElement('a');
      navbarBrand.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      navbarBrand.href = brandLink.href;
      moveInstrumentation(brandLink, navbarBrand);

      const imgClone = brandImg.cloneNode(true);
      imgClone.classList.add('brand-logo-img');
      navbarBrand.append(imgClone);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      visuallyHiddenSpan.textContent = brandImg.alt;
      navbarBrand.append(visuallyHiddenSpan);

      mainHeaderDesktop.append(navbarBrand);
    }
  }

  const seperatorDesktop = document.createElement('span');
  seperatorDesktop.classList.add('seperator');
  mainHeaderDesktop.append(seperatorDesktop);

  const hamburgerMenuDesktop = document.createElement('div');
  hamburgerMenuDesktop.classList.add('hamburger-menu');
  for (let i = 0; i < 3; i += 1) {
    hamburgerMenuDesktop.append(document.createElement('span'));
  }
  mainHeaderDesktop.append(hamburgerMenuDesktop);

  const navbarCollapseDesktop = document.createElement('div');
  navbarCollapseDesktop.classList.add('navbar-collapse', 'navbar_links');
  desktopNav.append(navbarCollapseDesktop);

  const navRoleNavigation = document.createElement('div');
  navRoleNavigation.setAttribute('role', 'navigation');
  navRoleNavigation.setAttribute('aria-label', 'Primary Navigation');
  navbarCollapseDesktop.append(navRoleNavigation);

  const navbarNavDesktop = document.createElement('ul');
  navbarNavDesktop.classList.add('navbar-nav');
  navbarNavDesktop.setAttribute('role', 'menu');
  navRoleNavigation.append(navbarNavDesktop);

  const megaMenuContainerDesktop = document.createElement('div'); // Container for all mega menus
  desktopHeader.append(megaMenuContainerDesktop);

  setupDesktopNav(navRow, navbarNavDesktop, megaMenuContainerDesktop);

  // Desktop Tools
  const desktopToolsContainer = document.createElement('div');
  desktopToolsContainer.classList.add('d-flex', 'align-items-center'); // Wrapper for search, global, contact, tata logo
  navbarCollapseDesktop.append(desktopToolsContainer);


  // Mobile Header
  const mobileHeader = document.createElement('header');
  mobileHeader.classList.add('d-xl-none', 'd-block', 'position-fixed', 'w-100', 'overflow-hidden');
  block.append(mobileHeader);

  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('navbar', 'navbar-expand-lg');
  mobileNav.setAttribute('aria-label', 'Primary Navigation');
  mobileNav.id = 'nav'; // Assign ID for toggleMenu function
  mobileHeader.append(mobileNav);

  const mainHeaderMobile = document.createElement('div');
  mainHeaderMobile.classList.add('main-header');
  mobileNav.append(mainHeaderMobile);

  // Brand Logo (Mobile)
  if (brandRow) {
    const brandLink = brandRow.querySelector('p:first-child a') || brandRow.querySelector('a');
    const brandImg = brandRow.querySelector('picture img');

    if (brandLink && brandImg) {
      const navbarBrandMobile = document.createElement('a');
      navbarBrandMobile.classList.add('navbar-brand', 'position-relative', 'py-0', 'tcs-right-logo', 'analytics-cta-label-class');
      navbarBrandMobile.href = brandLink.href;
      moveInstrumentation(brandLink, navbarBrandMobile);

      const imgClone = brandImg.cloneNode(true);
      imgClone.classList.add('brand-logo-img');
      navbarBrandMobile.append(imgClone);

      const visuallyHiddenSpan = document.createElement('span');
      visuallyHiddenSpan.classList.add('visually-hidden', 'd-none', 'analytics-cta-label-child-class');
      visuallyHiddenSpan.textContent = brandImg.alt;
      navbarBrandMobile.append(visuallyHiddenSpan);

      const visuallyHiddenSpan2 = document.createElement('span');
      visuallyHiddenSpan2.classList.add('visually-hidden');
      visuallyHiddenSpan2.textContent = 'Opens in new tab';
      navbarBrandMobile.append(visuallyHiddenSpan2);

      mainHeaderMobile.append(navbarBrandMobile);
    }
  }

  const seperatorMobile = document.createElement('span');
  seperatorMobile.classList.add('seperator');
  mainHeaderMobile.append(seperatorMobile);

  const hamburgerMenuMobile = document.createElement('div');
  hamburgerMenuMobile.classList.add('hamburger-menu');
  hamburgerMenuMobile.id = 'hamburger';
  hamburgerMenuMobile.setAttribute('aria-label', 'Navigation Menu');
  hamburgerMenuMobile.setAttribute('role', 'button');
  hamburgerMenuMobile.setAttribute('aria-expanded', 'false');
  hamburgerMenuMobile.setAttribute('tabindex', '0');
  for (let i = 0; i < 3; i += 1) {
    hamburgerMenuMobile.append(document.createElement('span'));
  }
  mainHeaderMobile.append(hamburgerMenuMobile);

  const navbarCollapseMobile = document.createElement('div');
  navbarCollapseMobile.classList.add('navbar-collapse', 'overflow-hidden');
  navbarCollapseMobile.id = 'navbarMenu';
  mobileNav.append(navbarCollapseMobile);

  const mobileNavbarOuterDiv = document.createElement('div');
  mobileNavbarOuterDiv.classList.add('mobile-navbar-outer-div', 'd-flex', 'flex-column', 'justify-content-start', 'h-100');
  navbarCollapseMobile.append(mobileNavbarOuterDiv);

  const tabMobView = document.createElement('div');
  tabMobView.classList.add('tab-mob-view');
  mobileNavbarOuterDiv.append(tabMobView);

  const headerAccordion = document.createElement('div');
  headerAccordion.id = 'header-accordion';
  headerAccordion.classList.add('nav-options');
  headerAccordion.setAttribute('aria-hidden', 'true'); // Hidden when mobile menu is closed
  tabMobView.append(headerAccordion);

  setupMobileNav(navRow, headerAccordion);

  const mobileBottomNav = document.createElement('div');
  mobileBottomNav.classList.add('d-flex', 'flex-column-reverse', 'mobile-bottom-nav', 'mt-auto');
  mobileNavbarOuterDiv.append(mobileBottomNav);

  const mobileToolsContainer = document.createElement('div'); // Container for mobile search, global, contact, tata logo
  mobileBottomNav.append(mobileToolsContainer);

  setupTools(toolsRow, desktopToolsContainer, mobileToolsContainer);

  // Hamburger for mobile
  hamburgerMenuMobile.addEventListener('click', () => toggleMobileMenu(mobileNav));
  mobileNav.setAttribute('aria-expanded', 'false');

  // prevent mobile nav behavior on window resize
  const onMediaChange = (e) => {
    toggleMobileMenu(mobileNav, e.matches); // Pass e.matches to force open/close
    toggleAllNavSections(navbarNavDesktop, e.matches); // Pass e.matches to force open/close
  };
  onMediaChange(isDesktop); // Initial call
  isDesktop.addEventListener('change', onMediaChange);
}
