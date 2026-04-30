import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to match original CSS breakpoint

/**
 * Moves instrumentation attributes from an old element to a new element.
 * @param {Element} originalElement The original element from the fragment.
 * @param {Element} newElement The newly created element.
 */
function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  [...originalElement.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      newElement.setAttribute(attr.name, attr.value);
    }
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const navSections = nav.querySelector('.header__nav__list');
    if (!navSections) return;

    const navSectionExpanded = navSections.querySelector('.header__nav__list__item.is-open'); // Use .is-open
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleNavSection(navSectionExpanded, false); // Explicitly close
      navSectionExpanded.querySelector('.header__nav__list__item__link').focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false); // Explicitly close
      const hamburger = nav.querySelector('.hamburger');
      if (hamburger) hamburger.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav) return;

  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.header__nav__list');
    if (!navSections) return;

    const navSectionExpanded = navSections.querySelector('.header__nav__list__item.is-open'); // Use .is-open
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleNavSection(navSectionExpanded, false); // Explicitly close
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false); // Explicitly close
    }
  }
}

/**
 * Toggles the expanded state of a navigation section.
 * @param {Element} section The nav section to toggle.
 * @param {boolean} expanded True to expand, false to collapse.
 */
function toggleNavSection(section, expanded) {
  if (!section) return;
  section.setAttribute('aria-expanded', expanded);
  section.classList.toggle('is-open', expanded); // Use .is-open class
  const submenu = section.querySelector('.header__nav__list__submenu');
  if (submenu) {
    submenu.setAttribute('aria-hidden', !expanded);
  }
  const icon = section.querySelector('.icon-chevron-down');
  if (icon) {
    icon.classList.toggle('active', expanded); // Toggle active class on chevron
  }

  // Close all child submenus when parent is closed
  if (!expanded) {
    section.querySelectorAll('.header__nav__list__item.is-open').forEach((childSection) => {
      toggleNavSection(childSection, false);
    });
  }
}

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element.
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null.
 */
function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  const navSections = nav.querySelector('.header__nav');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded);
  if (hamburger) {
    hamburger.classList.toggle('is-active', expanded);
    hamburger.setAttribute('aria-expanded', expanded);
  }
  if (navSections) {
    navSections.classList.toggle('is-active', expanded);
  }

  // Close all nav sections when menu is closed
  if (!expanded) {
    nav.querySelectorAll('.header__nav__list__item.is-open').forEach((section) => {
      toggleNavSection(section, false);
    });
  }

  // enable menu collapse on escape keypress
  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Builds a navigation list recursively.
 * @param {Element} ulElement The <ul> element from the fragment.
 * @param {number} level The current nesting level (0 for top-level).
 * @returns {DocumentFragment} A document fragment containing the decorated list.
 */
function buildNavList(ulElement, level, buffer = []) {
  const fragment = document.createDocumentFragment();
  if (!ulElement) return fragment;

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return;

    const newLi = document.createElement('li');
    moveInstrumentation(li, newLi);
    newLi.classList.add('we-mega-menu-li', 'header__nav__list__item');
    newLi.setAttribute('data-level', level);
    newLi.setAttribute('data-element-type', 'we-mega-menu-li');
    newLi.setAttribute('aria-expanded', 'false');

    let triggerElement = li.querySelector('strong');
    let linkElement = li.querySelector('a');
    let hasSubmenu = false;

    if (triggerElement) {
      // This is a mega-menu trigger
      hasSubmenu = true;
      const newA = document.createElement('a');
      moveInstrumentation(triggerElement, newA);
      newA.classList.add('we-mega-menu-li', 'header__nav__list__item__link');
      newA.href = 'javascript:void(0)'; // Use void(0) for non-navigating triggers
      newA.textContent = triggerElement.textContent;
      newLi.append(newA);

      const chevron = document.createElement('div');
      chevron.classList.add('icon', 'icon-chevron-down', 'header__nav__list__item__icon');
      newA.append(chevron);

      // Collect sibling content before the next <ul> or end of <li>
      const leftDivContent = document.createDocumentFragment();
      let nextSibling = triggerElement.nextElementSibling;
      while (nextSibling && nextSibling.tagName !== 'UL') {
        const clonedNode = nextSibling.cloneNode(true);
        moveInstrumentation(nextSibling, clonedNode);
        leftDivContent.append(clonedNode);
        nextSibling = nextSibling.nextElementSibling;
      }

      const nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) {
        const submenuDiv = document.createElement('div');
        submenuDiv.classList.add('we-mega-menu-submenu', 'header__nav__list__submenu', 'tcpl-mega-menu-dropdown');
        submenuDiv.setAttribute('aria-hidden', 'true');
        moveInstrumentation(nestedUl, submenuDiv);

        const submenuInner = document.createElement('div');
        submenuInner.classList.add('we-mega-menu-submenu-inner');
        submenuDiv.append(submenuInner);

        const submenuRow = document.createElement('div');
        submenuRow.classList.add('we-mega-menu-row');
        submenuRow.setAttribute('data-element-type', 'we-mega-menu-row');
        submenuInner.append(submenuRow);

        const submenuCol = document.createElement('div');
        submenuCol.classList.add('we-mega-menu-col', 'span12');
        submenuCol.setAttribute('data-element-type', 'we-mega-menu-col');
        submenuCol.setAttribute('data-width', '12');
        submenuRow.append(submenuCol);

        const childUl = document.createElement('ul');
        childUl.classList.add('nav', 'nav-tabs', 'subul');
        submenuCol.append(childUl);

        Array.from(nestedUl.children).forEach((childLi) => {
          if (childLi.nodeType !== Node.ELEMENT_NODE) return;
          const childLink = childLi.querySelector('a');
          const childStrong = childLi.querySelector('strong');

          if (childStrong && childLi.querySelector('ul')) {
            // Nested menu item with a strong tag and a submenu
            const nestedFragment = buildNavList(childLi, level + 1);
            Array.from(nestedFragment.children).forEach((nestedItem) => {
              nestedItem.classList.add('menu-right-arrow', 'dropdown-menu');
              childUl.append(nestedItem);
            });
          } else if (childLink) {
            // Regular link in a submenu
            const newChildLi = document.createElement('li');
            moveInstrumentation(childLi, newChildLi);
            newChildLi.classList.add('we-mega-menu-li', 'header__nav__list__item');
            newChildLi.setAttribute('data-level', level + 1);
            newChildLi.setAttribute('data-element-type', 'we-mega-menu-li');

            const newChildA = document.createElement('a');
            moveInstrumentation(childLink, newChildA);
            newChildA.classList.add('we-mega-menu-li', 'header__nav__list__item__link');
            newChildA.href = childLink.href;
            newChildA.textContent = childLink.textContent;
            newChildLi.append(newChildA);
            childUl.append(newChildLi);
          }
        });

        newLi.append(submenuDiv);
      }

      // Append buffered content to a .left-div if it exists
      if (leftDivContent.hasChildNodes()) {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const sanitizedTitle = newA.textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        leftDiv.append(leftDivContent);

        // Find the submenuDiv for this newLi and prepend the leftDiv
        const currentSubmenuDiv = newLi.querySelector('.we-mega-menu-submenu-inner');
        if (currentSubmenuDiv) {
          const firstSubmenuRow = currentSubmenuDiv.querySelector('.we-mega-menu-row');
          if (firstSubmenuRow) {
            const leftDivCol = document.createElement('div');
            leftDivCol.classList.add('we-mega-menu-col', 'span12', 'tetley-news');
            leftDivCol.setAttribute('data-element-type', 'we-mega-menu-col');
            leftDivCol.setAttribute('data-width', '12');
            leftDivCol.append(leftDiv);

            const newSubmenuRow = document.createElement('div');
            newSubmenuRow.classList.add('we-mega-menu-row');
            newSubmenuRow.setAttribute('data-element-type', 'we-mega-menu-row');
            newSubmenuRow.setAttribute('data-custom-row', '1');
            newSubmenuRow.append(leftDivCol);

            currentSubmenuDiv.prepend(newSubmenuRow);
          }
        }
      }

      newLi.addEventListener('click', (event) => {
        if (!isDesktop.matches) {
          event.preventDefault();
          const isExpanded = newLi.getAttribute('aria-expanded') === 'true';
          toggleNavSection(newLi, !isExpanded);
        }
      });
      newLi.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          toggleNavSection(newLi, true);
        }
      });
      newLi.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          toggleNavSection(newLi, false);
        }
      });

    } else if (linkElement) {
      // This is a regular link
      const newA = document.createElement('a');
      moveInstrumentation(linkElement, newA);
      newA.classList.add('we-mega-menu-li', 'header__nav__list__item__link');
      newA.href = linkElement.href;
      newA.textContent = linkElement.textContent;
      newLi.append(newA);
      hasSubmenu = !!li.querySelector('ul'); // Check if it has a submenu
      if (hasSubmenu) {
        newLi.classList.add('dropdown-menu');
        newA.href = 'javascript:void(0)'; // If it has a submenu, make the main link non-navigating
        const chevron = document.createElement('div');
        chevron.classList.add('icon', 'icon-chevron-down', 'header__nav__list__item__icon');
        newA.append(chevron);

        const nestedUl = li.querySelector(':scope > ul');
        if (nestedUl) {
          const submenuDiv = document.createElement('div');
          submenuDiv.classList.add('we-mega-menu-submenu', 'header__nav__list__submenu', 'tcpl-mega-menu-dropdown');
          submenuDiv.setAttribute('aria-hidden', 'true');
          moveInstrumentation(nestedUl, submenuDiv);

          const submenuInner = document.createElement('div');
          submenuInner.classList.add('we-mega-menu-submenu-inner');
          submenuDiv.append(submenuInner);

          const submenuRow = document.createElement('div');
          submenuRow.classList.add('we-mega-menu-row');
          submenuRow.setAttribute('data-element-type', 'we-mega-menu-row');
          submenuInner.append(submenuRow);

          const submenuCol = document.createElement('div');
          submenuCol.classList.add('we-mega-menu-col', 'span12');
          submenuCol.setAttribute('data-element-type', 'we-mega-menu-col');
          submenuCol.setAttribute('data-width', '12');
          submenuRow.append(submenuCol);

          const childUl = document.createElement('ul');
          childUl.classList.add('nav', 'nav-tabs', 'subul');
          submenuCol.append(childUl);

          Array.from(nestedUl.children).forEach((childLi) => {
            if (childLi.nodeType !== Node.ELEMENT_NODE) return;
            const nestedFragment = buildNavList(childLi, level + 1);
            Array.from(nestedFragment.children).forEach((nestedItem) => {
              nestedItem.classList.add('menu-right-arrow', 'dropdown-menu'); // Add classes for nested items
              childUl.append(nestedItem);
            });
          });
          newLi.append(submenuDiv);
        }

        newLi.addEventListener('click', (event) => {
          if (!isDesktop.matches) {
            event.preventDefault();
            const isExpanded = newLi.getAttribute('aria-expanded') === 'true';
            toggleNavSection(newLi, !isExpanded);
          }
        });
        newLi.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleNavSection(newLi, true);
          }
        });
        newLi.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            toggleNavSection(newLi, false);
          }
        });
      }
    }

    if (!hasSubmenu && level === 0) {
      newLi.classList.add('desktop-hide'); // Add desktop-hide for top-level non-mega-menu items
    }

    fragment.append(newLi);
  });
  return fragment;
}

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('tcpl-mega-menu', 'navbar', 'navbar-default', 'navbar-we-mega-menu', 'mobile-collapse', 'hover-action');
  nav.setAttribute('data-menu-name', 'tcpl-mega-menu');
  nav.setAttribute('data-block-theme', 'tcpl');
  nav.setAttribute('data-style', 'Default');
  nav.setAttribute('data-animation', 'None');
  nav.setAttribute('data-delay', '');
  nav.setAttribute('data-duration', '');
  nav.setAttribute('data-autoarrow', '1');
  nav.setAttribute('data-alwayshowsubmenu', '1');
  nav.setAttribute('data-action', 'hover');
  nav.setAttribute('data-mobile-collapse', '0');
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-expanded', 'false'); // Initial state for mobile nav

  const header = document.createElement('header');
  header.id = 'header';
  header.classList.add('header');
  header.setAttribute('aria-label', 'Site header');
  block.append(header);

  const regionHeaderContent = document.createElement('div');
  regionHeaderContent.classList.add('region', 'header-content');
  header.append(regionHeaderContent);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const headerInner = document.createElement('div');
  headerInner.classList.add('header__inner');
  container.append(headerInner);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger', 'hamburger--spin', 'js-hamburger', 'header__hamburger', 'd-lg-none');
  hamburger.innerHTML = `
    <div class="hamburger-box">
      <div class="hamburger-inner"></div>
    </div>
  `;
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('tabindex', '0');
  hamburger.addEventListener('click', () => toggleMenu(nav, null));
  headerInner.append(hamburger);

  const headerLevel1 = document.createElement('div');
  headerLevel1.classList.add('header__level-1', 'd-flex', 'middle-xs', 'between-xs');
  headerInner.append(headerLevel1);

  const headerLevel2 = document.createElement('div');
  headerLevel2.classList.add('header__level-2', 'd-lg-flex', 'middle-lg');
  headerInner.append(headerLevel2);

  const headerNav = document.createElement('div');
  headerNav.classList.add('header__nav');
  headerLevel2.append(headerNav);

  const headerBottomLeft = document.createElement('div');
  headerBottomLeft.classList.add('region', 'header-bottom-left');
  headerNav.append(headerBottomLeft);

  const blockTcplMegamenu = document.createElement('div');
  blockTcplMegamenu.id = 'block-tcplmegamenu';
  blockTcplMegamenu.classList.add('block', 'block-we-megamenu', 'block-we-megamenu-blocktcpl-mega-menu');
  headerBottomLeft.append(blockTcplMegamenu);

  const megamenuContent = document.createElement('div');
  megamenuContent.classList.add('content');
  blockTcplMegamenu.append(megamenuContent);
  megamenuContent.append(nav);

  const navUl = document.createElement('ul');
  navUl.classList.add('we-mega-menu-ul', 'nav', 'nav-tabs', 'header__nav__list');
  nav.append(navUl);

  // Process fragment sections
  const fragmentSections = Array.from(fragment.children).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE,
  );

  // Section 1: Brand
  const brandSection = fragmentSections[0];
  if (brandSection) {
    const regionHeaderTopLeft = document.createElement('div');
    regionHeaderTopLeft.classList.add('region', 'header-top-left');
    headerLevel1.append(regionHeaderTopLeft);

    const blockSiteBranding = document.createElement('div');
    blockSiteBranding.id = 'block-tcpl-sitebranding';
    blockSiteBranding.classList.add('clearfix', 'site-branding', 'block', 'block-system', 'block-system-branding-block');
    regionHeaderTopLeft.append(blockSiteBranding);

    const siteBrandingContent = document.createElement('div');
    siteBrandingContent.classList.add('content');
    blockSiteBranding.append(siteBrandingContent);

    const brandLinkWrapper = brandSection.querySelector('p > picture');
    if (brandLinkWrapper) {
      const brandLink = document.createElement('a');
      moveInstrumentation(brandLinkWrapper, brandLink);
      brandLink.href = '/';
      brandLink.title = 'Home';
      brandLink.rel = 'home';
      brandLink.classList.add('site-branding__logo');
      brandLink.setAttribute('tabindex', '3');

      const img = brandLinkWrapper.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        moveInstrumentation(img, newImg);
        newImg.src = img.src;
        newImg.alt = img.alt;
        brandLink.append(newImg);
      }
      siteBrandingContent.append(brandLink);
    }
  }

  // Section 2: Navigation
  const navFragmentSection = fragmentSections[1];
  if (navFragmentSection) {
    let currentBuffer = [];
    Array.from(navFragmentSection.children).forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;

      if (child.tagName === 'P' && child.querySelector('a')) {
        // This is a top-level menu item (button)
        const newLi = document.createElement('li');
        moveInstrumentation(child, newLi);
        newLi.classList.add('we-mega-menu-li', 'dropdown-menu', 'header__nav__list__item');
        newLi.setAttribute('data-level', '0');
        newLi.setAttribute('data-element-type', 'we-mega-menu-li');
        newLi.setAttribute('data-submenu', '1'); // Assume dropdown for buttons
        newLi.setAttribute('aria-expanded', 'false');

        const link = child.querySelector('a');
        const newA = document.createElement('a');
        moveInstrumentation(link, newA);
        newA.classList.add('we-mega-menu-li', 'header__nav__list__item__link');
        newA.href = link.href === 'javascript:void(0)' ? 'javascript:void(0)' : link.href;
        newA.textContent = link.textContent;
        newLi.append(newA);

        const chevron = document.createElement('div');
        chevron.classList.add('icon', 'icon-chevron-down', 'header__nav__list__item__icon');
        newA.append(chevron);

        const submenuDiv = document.createElement('div');
        submenuDiv.classList.add('we-mega-menu-submenu', 'header__nav__list__submenu', 'tcpl-mega-menu-dropdown');
        submenuDiv.setAttribute('aria-hidden', 'true');
        newLi.append(submenuDiv);

        const submenuInner = document.createElement('div');
        submenuInner.classList.add('we-mega-menu-submenu-inner');
        submenuDiv.append(submenuInner);

        // Flush buffer into a left-div if content exists
        if (currentBuffer.length > 0) {
          const leftDivRow = document.createElement('div');
          leftDivRow.classList.add('we-mega-menu-row');
          leftDivRow.setAttribute('data-element-type', 'we-mega-menu-row');
          leftDivRow.setAttribute('data-custom-row', '1');
          submenuInner.append(leftDivRow);

          const leftDivCol = document.createElement('div');
          leftDivCol.classList.add('we-mega-menu-col', 'span12', 'tetley-news');
          leftDivCol.setAttribute('data-element-type', 'we-mega-menu-col');
          leftDivCol.setAttribute('data-width', '12');
          leftDivRow.append(leftDivCol);

          const typeOfBlock = document.createElement('div');
          typeOfBlock.classList.add('type-of-block');
          leftDivCol.append(typeOfBlock);

          const blockInner = document.createElement('div');
          blockInner.classList.add('block-inner');
          typeOfBlock.append(blockInner);

          const blockContent = document.createElement('div');
          blockContent.classList.add('block', 'block-block-content'); // Add generic block classes
          blockInner.append(blockContent);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          blockContent.append(contentDiv);

          currentBuffer.forEach((bufferedNode) => {
            contentDiv.append(bufferedNode);
          });
          currentBuffer = []; // Clear buffer
        }

        const submenuRow = document.createElement('div');
        submenuRow.classList.add('we-mega-menu-row');
        submenuRow.setAttribute('data-element-type', 'we-mega-menu-row');
        submenuRow.setAttribute('data-custom-row', '0');
        submenuInner.append(submenuRow);

        const submenuCol = document.createElement('div');
        submenuCol.classList.add('we-mega-menu-col', 'span12');
        submenuCol.setAttribute('data-element-type', 'we-mega-menu-col');
        submenuCol.setAttribute('data-width', '12');
        submenuRow.append(submenuCol);

        const childUl = document.createElement('ul');
        childUl.classList.add('nav', 'nav-tabs', 'subul');
        submenuCol.append(childUl);

        newLi.addEventListener('click', (event) => {
          if (!isDesktop.matches) {
            event.preventDefault();
            const isExpanded = newLi.getAttribute('aria-expanded') === 'true';
            toggleNavSection(newLi, !isExpanded);
          }
        });
        newLi.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            toggleNavSection(newLi, true);
          }
        });
        newLi.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            toggleNavSection(newLi, false);
          }
        });

        navUl.append(newLi);
      } else if (child.tagName === 'UL') {
        // This is a nested UL for the previous P tag
        const lastLi = navUl.lastElementChild;
        if (lastLi) {
          const targetUl = lastLi.querySelector('.we-mega-menu-submenu .subul');
          if (targetUl) {
            const nestedFragment = buildNavList(child, 1);
            targetUl.append(nestedFragment);
          }
        }
      } else {
        // Collect other content (e.g., images, text for left-div)
        currentBuffer.push(child.cloneNode(true));
        moveInstrumentation(child, currentBuffer[currentBuffer.length - 1]);
      }
    });
  }

  // Section 3: Tools
  const toolsSection = fragmentSections[2];
  if (toolsSection) {
    const headerTopRight = document.createElement('div');
    headerTopRight.classList.add('region', 'header-top-right');
    headerLevel1.append(headerTopRight);

    const headerNavIconList = document.createElement('div');
    headerNavIconList.classList.add('header__nav__icon__list');
    headerLevel2.append(headerNavIconList);

    const toolsUls = toolsSection.querySelectorAll('ul');

    // First UL for social media icons
    const socialUl = toolsUls[0];
    if (socialUl) {
      const blockTopHeaderSocialMediaLinks = document.createElement('div');
      blockTopHeaderSocialMediaLinks.id = 'block-topheadersocialmedialinks';
      blockTopHeaderSocialMediaLinks.classList.add('block', 'block-block-content');
      moveInstrumentation(socialUl, blockTopHeaderSocialMediaLinks); // Instrumentation for the block

      const socialContent = document.createElement('div');
      socialContent.classList.add('content');
      blockTopHeaderSocialMediaLinks.append(socialContent);

      const socialContainer = document.createElement('div');
      socialContainer.classList.add('social-container', 'footer__social__list');
      socialContent.append(socialContainer);

      const socialRow = document.createElement('div');
      socialRow.classList.add('social-row');
      socialContainer.append(socialRow);

      Array.from(socialUl.children).forEach((li) => {
        if (li.nodeType !== Node.ELEMENT_NODE) return;
        const socialLink = li.querySelector('a');
        if (socialLink) {
          const socialColumn = document.createElement('div');
          socialColumn.classList.add('social-column');
          socialRow.append(socialColumn);

          const newSocialLink = document.createElement('a');
          moveInstrumentation(socialLink, newSocialLink);
          newSocialLink.href = socialLink.href;
          newSocialLink.target = '_blank';
          newSocialLink.title = socialLink.title;
          newSocialLink.rel = 'noopener';

          const socialImg = socialLink.querySelector('img');
          if (socialImg) {
            const newSocialImg = document.createElement('img');
            moveInstrumentation(socialImg, newSocialImg);
            newSocialImg.alt = socialImg.alt;
            newSocialImg.src = socialImg.src;
            newSocialLink.append(newSocialImg);
          }
          socialColumn.append(newSocialLink);
        }
      });
      headerTopRight.append(blockTopHeaderSocialMediaLinks);

      // Mobile social links
      const blockTopHeaderSocialMediaLinksMobile = document.createElement('div');
      blockTopHeaderSocialMediaLinksMobile.id = 'block-topheadersocialmedialinks-mobile';
      blockTopHeaderSocialMediaLinksMobile.classList.add('block', 'block-block-content');
      // No instrumentation for mobile block, it's a copy
      blockTopHeaderSocialMediaLinksMobile.append(blockTopHeaderSocialMediaLinks.querySelector('.content').cloneNode(true));
      headerNav.append(blockTopHeaderSocialMediaLinksMobile);
    }

    // Second UL for utility links and search
    const utilityUl = toolsUls[1];
    if (utilityUl) {
      const searchLi = Array.from(utilityUl.children).find((li) => li.textContent.trim().toLowerCase() === 'search');
      if (searchLi) {
        // Search icon
        const headerSearchMenu = document.createElement('div');
        headerSearchMenu.classList.add('header__nav__icon__list__item');
        headerSearchMenu.id = 'header__search__menu';
        headerNavIconList.append(headerSearchMenu);

        const searchIcon = document.createElement('div');
        searchIcon.classList.add('icon', 'icon-search');
        searchIcon.setAttribute('tabindex', '0');
        searchIcon.setAttribute('role', 'button');
        searchIcon.setAttribute('aria-label', 'Search');
        headerSearchMenu.append(searchIcon);

        const closeIcon = document.createElement('div');
        closeIcon.classList.add('icon', 'icon-close');
        closeIcon.setAttribute('tabindex', '0');
        closeIcon.setAttribute('role', 'button');
        closeIcon.setAttribute('aria-hidden', 'true');
        headerSearchMenu.append(closeIcon);

        // Search form
        const headerSearchRegion = document.createElement('div');
        headerSearchRegion.classList.add('region', 'header__search');
        headerLevel2.append(headerSearchRegion);

        const blockSiteSearch = document.createElement('div');
        blockSiteSearch.id = 'block-tcpl-tetleysitesearch';
        blockSiteSearch.classList.add('block', 'block-tetley-search', 'block-sitesearch-block');
        headerSearchRegion.append(blockSiteSearch);

        const searchContent = document.createElement('div');
        searchContent.classList.add('content');
        blockSiteSearch.append(searchContent);

        const searchForm = document.createElement('form');
        searchForm.classList.add('tetley-site-search-form');
        searchForm.setAttribute('data-drupal-selector', 'tetley-site-search-form');
        searchForm.action = '/';
        searchForm.method = 'post';
        searchForm.id = 'tetley-site-search-form';
        searchForm.setAttribute('accept-charset', 'UTF-8');
        searchContent.append(searchForm);

        const formItem = document.createElement('div');
        formItem.classList.add('js-form-item', 'form-item', 'js-form-type-textfield', 'form-type-textfield', 'js-form-item-search-key', 'form-item-search-key');
        searchForm.append(formItem);

        const label = document.createElement('label');
        label.htmlFor = 'edit-search-key';
        label.classList.add('form-item__label', 'js-form-required', 'form-required');
        label.textContent = 'Search';
        formItem.append(label);

        const input = document.createElement('input');
        input.placeholder = 'Search Here';
        input.autocomplete = 'off';
        input.setAttribute('data-drupal-selector', 'edit-search-key');
        input.type = 'text';
        input.id = 'edit-search-key';
        input.name = 'search_key';
        input.value = '';
        input.size = '60';
        input.maxLength = '20';
        input.classList.add('form-text', 'required', 'form-item__input');
        input.required = true;
        input.setAttribute('aria-required', 'true');
        formItem.append(input);

        const formBuildId = document.createElement('input');
        formBuildId.autocomplete = 'off';
        formBuildId.setAttribute('data-drupal-selector', 'form-uubdheg-qhhnfzymt2yce4n-yzrn2gejfmwlb8d3i-i');
        formBuildId.type = 'hidden';
        formBuildId.name = 'form_build_id';
        formBuildId.value = 'form-UubdHEg-QhHNFzYmT2yCE4N_yzrN2gejFMwLb8d3I-I'; // Placeholder value
        formBuildId.classList.add('form-item__input');
        searchForm.append(formBuildId);

        const formId = document.createElement('input');
        formId.setAttribute('data-drupal-selector', 'edit-tetley-site-search-form');
        formId.type = 'hidden';
        formId.name = 'form_id';
        formId.value = 'tetley_site_search_form';
        formId.classList.add('form-item__input');
        searchForm.append(formId);

        const formActions = document.createElement('div');
        formActions.setAttribute('data-drupal-selector', 'edit-actions');
        formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
        formActions.id = 'edit-actions';
        searchForm.append(formActions);

        const submitButton = document.createElement('input');
        submitButton.setAttribute('data-drupal-selector', 'edit-submit');
        submitButton.type = 'submit';
        submitButton.id = 'edit-submit';
        submitButton.name = 'op';
        submitButton.value = 'Search';
        submitButton.classList.add('button', 'button--primary', 'js-form-submit', 'form-submit', 'form-item__input');
        formActions.append(submitButton);

        // Search toggle behavior
        searchIcon.addEventListener('click', () => {
          headerSearchRegion.classList.add('is-active');
          headerSearchMenu.classList.add('is-active');
          input.focus();
        });
        closeIcon.addEventListener('click', () => {
          headerSearchRegion.classList.remove('is-active');
          headerSearchMenu.classList.remove('is-active');
          input.value = '';
        });
      }

      // Utility links
      const utilityLinksUl = document.createElement('ul');
      utilityLinksUl.classList.add('clearfix', 'menu');
      Array.from(utilityUl.children).filter((li) => li.textContent.trim().toLowerCase() !== 'search').forEach((li) => {
        if (li.nodeType !== Node.ELEMENT_NODE) return;
        const link = li.querySelector('a');
        if (link) {
          const newLi = document.createElement('li');
          moveInstrumentation(li, newLi);
          newLi.classList.add('menu-item');
          const newA = document.createElement('a');
          moveInstrumentation(link, newA);
          newA.href = link.href;
          newA.textContent = link.textContent;
          newLi.append(newA);
          utilityLinksUl.append(newLi);
        }
      });

      if (utilityLinksUl.children.length > 0) {
        const blockUserAccountMenu = document.createElement('nav');
        blockUserAccountMenu.setAttribute('role', 'navigation');
        blockUserAccountMenu.setAttribute('aria-labelledby', 'block-tcpl-useraccountmenu-menu');
        blockUserAccountMenu.id = 'block-tcpl-useraccountmenu';
        blockUserAccountMenu.classList.add('block-tcpl-useraccountmenu');
        headerNav.append(blockUserAccountMenu);

        const visuallyHidden = document.createElement('div');
        visuallyHidden.classList.add('visually-hidden');
        visuallyHidden.id = 'block-tcpl-useraccountmenu-menu';
        visuallyHidden.setAttribute('aria-hidden', 'true');
        blockUserAccountMenu.append(visuallyHidden);

        const accountMenuContent = document.createElement('div');
        accountMenuContent.classList.add('content');
        blockUserAccountMenu.append(accountMenuContent);
        accountMenuContent.append(utilityLinksUl);
      }
    }
  }

  // Final append of the constructed nav to the block
  // The header element is already appended to the block at the beginning
  // All other elements are appended to the header or its children
  toggleMenu(nav, false); // Initialize mobile menu as closed
  isDesktop.addEventListener('change', () => toggleMenu(nav, false)); // Close on desktop resize
}
