import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted breakpoint based on original HTML media queries

/**
 * Creates an SVG element from a given path data.
 * @param {string} pathData The SVG path data.
 * @param {string} viewBox The SVG viewBox attribute.
 * @param {string[]} classes An array of CSS classes to add to the SVG.
 * @param {string} fill The SVG fill attribute.
 * @param {string} stroke The SVG stroke attribute.
 * @param {string} strokeWidth The SVG stroke-width attribute.
 * @returns {SVGElement} The created SVG element.
 */
function createSVG(pathData, viewBox = '0 0 21 21', classes = [], fill = 'none', stroke = 'none', strokeWidth = '0.25') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', fill);
  classes.forEach((c) => svg.classList.add(c));
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('stroke', stroke); // Set stroke attribute for the path
  svg.appendChild(path);
  return svg;
}

/**
 * Parses the fragment into brand, navigation, and tools sections.
 * @param {Element} fragment The loaded fragment DOM.
 * @returns {{brandSections: Element[], navSections: Element[], toolsSections: Element[], primaryNavLabels: string[], searchOverlayContent: Element | null}}
 */
function parseStructure(fragment) {
  const sections = Array.from(fragment.children);
  const brandSections = [];
  const navSections = [];
  const toolsSections = [];
  const primaryNavLabels = [];
  let searchOverlayContent = null;

  let currentPartition = 'brand'; // 'brand', 'nav', 'tools', 'search-overlay'

  sections.forEach((section) => {
    if (currentPartition === 'brand') {
      const img = section.querySelector('picture img');
      if (img) {
        brandSections.push(section);
      } else {
        currentPartition = 'nav'; // Transition to nav sections
        navSections.push(section);
      }
    } else if (currentPartition === 'nav') {
      // Check for top-level navigation links to populate primaryNavLabels
      const topLevelLink = section.querySelector('p > a');
      if (topLevelLink) {
        primaryNavLabels.push(topLevelLink.textContent.trim());
      }

      // Check for social links or utility links to identify tools section start
      // This is a heuristic, adjust if fragment structure changes
      const utilityLinks = section.querySelector('ul');
      if (utilityLinks && (utilityLinks.querySelector('a[href*="contact-us"]') || utilityLinks.querySelector('a[href="#"]'))) {
        currentPartition = 'tools';
        toolsSections.push(section);
      } else {
        navSections.push(section);
      }
    } else if (currentPartition === 'tools') {
      const searchScreenWrap = section.querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        searchOverlayContent = searchScreenWrap;
        // Do not add search overlay to toolsSections, handle separately
        currentPartition = 'search-overlay'; // Transition to search overlay
      } else {
        toolsSections.push(section);
      }
    } else if (currentPartition === 'search-overlay') {
      // If there are more sections after search-screen-wrap, they would be handled here.
      // For now, we assume search-screen-wrap is the last distinct section.
    }
  });

  return { brandSections, navSections, toolsSections, primaryNavLabels, searchOverlayContent };
}

/**
 * Sets up the brand logo section.
 * @param {Element} nav The main nav element.
 * @param {Element[]} brandSections The brand sections from the fragment.
 * @returns {Element} The logo container.
 */
function setupBrand(nav, brandSections) {
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  if (brandSections.length > 0) {
    const brandSection = brandSections[0];
    const logoLink = brandSection.querySelector('p > picture + a') || brandSection.querySelector('p > a');
    const logoImage = brandSection.querySelector('picture img');

    if (logoLink && logoImage) {
      const a = document.createElement('a');
      a.href = logoLink.href;
      a.appendChild(logoImage.cloneNode(true));
      logoDiv.appendChild(a);
    } else if (logoImage) {
      const a = document.createElement('a');
      a.href = '/'; // Default home link if not specified
      a.appendChild(logoImage.cloneNode(true));
      logoDiv.appendChild(a);
    }
  }
  nav.querySelector('.wrap').prepend(logoDiv);
  return logoDiv;
}

/**
 * Creates a navigation dropdown toggle span with SVG.
 * @returns {HTMLSpanElement} The toggle span.
 */
function createNavToggleSpan() {
  const span = document.createElement('span');
  const svgPath = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';
  const svg = createSVG(svgPath, '-23.5 -23.5 122.80 122.80', [], '#000000', '#000000', '4.851456000000001');
  span.appendChild(svg);
  return span;
}

/**
 * Sets up the desktop navigation structure.
 * @param {Element} mainNavUl The main <ul> element for navigation.
 * @param {Element[]} navSections The navigation sections from the fragment.
 * @param {string[]} primaryNavLabels Labels for primary menu items from Original HTML.
 */
function setupDesktopNav(mainNavUl, navSections, primaryNavLabels) {
  let currentMegaMenuLi = null;
  let leftDivContentBuffer = [];

  navSections.forEach((section) => {
    Array.from(section.children).forEach((child) => {
      if (child.tagName === 'P' && child.firstElementChild && child.firstElementChild.tagName === 'A') {
        const anchor = child.firstElementChild;
        const anchorText = anchor.textContent.trim();

        if (primaryNavLabels.includes(anchorText)) {
          // This is a new primary navigation item (mega-menu trigger)
          currentMegaMenuLi = document.createElement('li');
          currentMegaMenuLi.classList.add('has-child', 'hover-red');
          currentMegaMenuLi.setAttribute('itemprop', 'name');
          currentMegaMenuLi.setAttribute('data-once', 'nav-close-search');
          currentMegaMenuLi.setAttribute('aria-haspopup', 'true');
          currentMegaMenuLi.setAttribute('aria-expanded', 'false');

          const primaryLink = anchor.cloneNode(true);
          primaryLink.setAttribute('itemprop', 'url');
          currentMegaMenuLi.appendChild(primaryLink);
          currentMegaMenuLi.appendChild(createNavToggleSpan());

          const megaMenu = document.createElement('div');
          megaMenu.classList.add('mega-menu');
          const wrapContainer = document.createElement('div');
          wrapContainer.classList.add('wrap', 'container');
          const centerDiv = document.createElement('div');
          centerDiv.classList.add('center-div');

          // Flush leftDivContentBuffer into the new mega-menu's left-div
          if (leftDivContentBuffer.length > 0) {
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            // Add specific class based on primary nav item if needed, but avoid hardcoding
            if (anchorText === 'Investor Relations') {
              leftDiv.classList.add('ir-left-div');
            } else if (anchorText === 'newsroom') {
              leftDiv.classList.add('newsroom-left-div');
            } else if (anchorText === 'careers') {
              leftDiv.classList.add('career-left-div');
            }

            leftDivContentBuffer.forEach((bufferedEl) => {
              if (bufferedEl.tagName === 'P' && bufferedEl.textContent.trim() === anchorText) {
                // This is the heading for the left-div, make it an h4
                const h4 = document.createElement('h4');
                h4.classList.add('left-div-heading');
                const h4Link = anchor.cloneNode(true);
                h4.appendChild(h4Link);
                leftDiv.appendChild(h4);
              } else {
                leftDiv.appendChild(bufferedEl.cloneNode(true));
              }
            });
            centerDiv.appendChild(leftDiv);
            leftDivContentBuffer = []; // Clear buffer
          }

          const subNavWrap = document.createElement('div');
          subNavWrap.classList.add('sub-nav-wrap');
          // Add specific classes based on primary nav item if needed, but avoid hardcoding
          if (anchorText === 'Who We Are') {
            subNavWrap.classList.add('about-us-sub-nav');
          } else if (anchorText === 'What we do') {
            subNavWrap.classList.add('what-we-do');
          } else if (anchorText === 'Investor Relations') {
            subNavWrap.classList.add('element-block');
          } else if (anchorText === 'careers') {
            subNavWrap.classList.add('careers-div');
          }

          centerDiv.appendChild(subNavWrap);
          wrapContainer.appendChild(centerDiv);
          megaMenu.appendChild(wrapContainer);
          currentMegaMenuLi.appendChild(megaMenu);
          mainNavUl.appendChild(currentMegaMenuLi);
        } else if (currentMegaMenuLi) {
          // If a mega menu is active, this content belongs to its left-div or sub-nav
          leftDivContentBuffer.push(child);
        }
      } else if (child.tagName === 'UL' && currentMegaMenuLi) {
        const subNavWrap = currentMegaMenuLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          const newUl = document.createElement('ul');
          let currentSubChildDiv = null;
          let currentInnerSubChildDiv = null;

          Array.from(child.children).forEach((li) => {
            const newLi = li.cloneNode(true);
            const liAnchor = newLi.querySelector('a');
            const nestedUl = newLi.querySelector('ul');

            if (nestedUl) {
              newLi.classList.add('top-level-li');
              newLi.setAttribute('aria-expanded', 'false');
              newLi.appendChild(createNavToggleSpan());

              currentSubChildDiv = document.createElement('div');
              currentSubChildDiv.classList.add('has-sub-child');
              currentSubChildDiv.appendChild(nestedUl); // Move nested UL
              newLi.querySelector('ul').remove(); // Remove original nested UL
              newLi.appendChild(currentSubChildDiv);

              // Check for inner nested ULs
              Array.from(currentSubChildDiv.querySelectorAll('ul > li')).forEach((innerLi) => {
                const innerNestedUl = innerLi.querySelector('ul');
                if (innerNestedUl) {
                  innerLi.classList.add('first-level-li');
                  innerLi.setAttribute('aria-expanded', 'false');
                  innerLi.appendChild(createNavToggleSpan());

                  currentInnerSubChildDiv = document.createElement('div');
                  currentInnerSubChildDiv.classList.add('has-inner-sub-child');
                  currentInnerSubChildDiv.appendChild(innerNestedUl);
                  innerLi.querySelector('ul').remove();
                  innerLi.appendChild(currentInnerSubChildDiv);
                }
              });
            }
            newUl.appendChild(newLi);
          });

          // Handle special case for Investor Relations inner-sub-nav-wrap-list
          if (currentMegaMenuLi.querySelector('a[href*="investor-relations"]')) {
            const innerSubNavWrapList = document.createElement('div');
            innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

            // Find the "Disclosures" li and add it directly
            const disclosureLi = newUl.querySelector('li:first-child');
            if (disclosureLi) {
              subNavWrap.appendChild(disclosureLi);
              disclosureLi.remove(); // Remove from newUl so it's not processed again
            }

            // Split the remaining UL into two for styling
            const remainingLis = Array.from(newUl.children);
            const midPoint = Math.ceil(remainingLis.length / 2);
            const firstHalf = remainingLis.slice(0, midPoint);
            const secondHalf = remainingLis.slice(midPoint);

            const ul1 = document.createElement('ul');
            firstHalf.forEach(item => ul1.appendChild(item));
            const ul2 = document.createElement('ul');
            secondHalf.forEach(item => ul2.appendChild(item));

            innerSubNavWrapList.appendChild(ul1);
            innerSubNavWrapList.appendChild(ul2);
            subNavWrap.appendChild(innerSubNavWrapList);
          } else {
            subNavWrap.appendChild(newUl);
          }
        }
      } else if (currentMegaMenuLi) {
        // Collect other elements for the left-div buffer if a mega menu is active
        leftDivContentBuffer.push(child);
      }
    });
  });
}

/**
 * Sets up the utility tools section (contact, search, social).
 * @param {Element} nav The main nav element.
 * @param {Element[]} toolsSections The tools sections from the fragment.
 */
function setupTools(nav, toolsSections) {
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');

  const mobileUl = document.createElement('ul');
  const desktopUl = document.createElement('ul');

  if (toolsSections.length > 0) {
    const toolsSection = toolsSections[0]; // Assuming tools are in the first tools section

    // Process utility links (Contact Us, Search)
    const utilityUl = toolsSection.querySelector('ul');
    if (utilityUl) {
      Array.from(utilityUl.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const linkText = link.textContent.trim();
          if (linkText === 'Contact Us') {
            const mailLiMobile = document.createElement('li');
            mailLiMobile.classList.add('mail');
            const mailLinkMobile = link.cloneNode(true);
            // Hardcoding SVG for now, ideally this would also come from fragment or a shared SVG sprite
            mailLinkMobile.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>${linkText}`;
            mailLiMobile.appendChild(mailLinkMobile);
            mobileUl.appendChild(mailLiMobile);

            const mailLiDesktop = document.createElement('li');
            mailLiDesktop.classList.add('mail');
            const mailLinkDesktop = link.cloneNode(true);
            mailLinkDesktop.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>`;
            mailLiDesktop.appendChild(mailLinkDesktop);
            desktopUl.appendChild(mailLiDesktop);
          } else if (linkText === 'Search') {
            const searchLiMobile = document.createElement('li');
            searchLiMobile.classList.add('search');
            searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const searchLinkMobile = link.cloneNode(true);
            searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
            // Hardcoding SVG for now, ideally this would also come from fragment or a shared SVG sprite
            searchLinkMobile.innerHTML = `
              <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
                <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z"></path>
              </svg>
              <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
              </svg>
              <span data-once="search-stop-propagation">${linkText}</span>
            `;
            searchLiMobile.appendChild(searchLinkMobile);
            mobileUl.appendChild(searchLiMobile);

            const searchLiDesktop = document.createElement('li');
            searchLiDesktop.classList.add('search');
            searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
            const searchLinkDesktop = link.cloneNode(true);
            searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
            searchLinkDesktop.innerHTML = `
              <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
                <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z"></path>
              </svg>
              <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
              </svg>
            `;
            searchLiDesktop.appendChild(searchLinkDesktop);
            desktopUl.appendChild(searchLiDesktop);
          }
        }
      });
    }
  }

  iconNavMobile.appendChild(mobileUl);
  iconNavDesktop.appendChild(desktopUl);

  // Append mobile icon nav to the main nav ul for mobile display
  const mainNavUl = nav.querySelector('.main-nav > ul');
  if (mainNavUl) {
    mainNavUl.appendChild(iconNavMobile);
  }
  // Append desktop icon nav to the main wrap for desktop display
  nav.querySelector('.wrap').appendChild(iconNavDesktop);
}

/**
 * Toggles the visibility of a mega-menu.
 * @param {HTMLElement} megaMenu The mega-menu element.
 * @param {boolean} show Whether to show or hide the mega-menu.
 */
function toggleMegaMenu(megaMenu, show) {
  const parentLi = megaMenu.closest('.has-child');
  if (!parentLi) return;

  if (show) {
    megaMenu.style.display = 'block'; // Or 'flex', depending on CSS
    parentLi.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      megaMenu.style.opacity = '1';
      megaMenu.style.pointerEvents = 'all';
      megaMenu.style.transform = 'translate(0,0)';
    }, 10); // Small delay for transition
  } else {
    megaMenu.style.opacity = '0';
    megaMenu.style.pointerEvents = 'none';
    megaMenu.style.transform = 'translate(0,0)'; // Reset transform
    parentLi.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      megaMenu.style.display = 'none';
    }, 300); // Match CSS transition duration
  }
}

/**
 * Toggles the visibility of sub-child menus (mobile).
 * @param {HTMLElement} parentLi The parent LI element with the sub-child.
 * @param {boolean} show Whether to show or hide the sub-child.
 */
function toggleSubChild(parentLi, show) {
  const subChild = parentLi.querySelector('.has-sub-child, .has-inner-sub-child');
  if (subChild) {
    if (show) {
      subChild.classList.add('active');
      parentLi.querySelector('span svg').style.transform = 'rotate(-180deg)';
      parentLi.setAttribute('aria-expanded', 'true');
    } else {
      subChild.classList.remove('active');
      parentLi.querySelector('span svg').style.transform = 'rotate(90deg)';
      parentLi.setAttribute('aria-expanded', 'false');
    }
  }
}

/**
 * Sets up event listeners for navigation items.
 * @param {Element} nav The main nav element.
 */
function setupNavEventListeners(nav) {
  const mainNavUl = nav.querySelector('.main-nav > ul');

  // Desktop hover for mega-menus
  if (isDesktop.matches) {
    mainNavUl.querySelectorAll('.has-child').forEach((li) => {
      const megaMenu = li.querySelector('.mega-menu');
      if (megaMenu) {
        li.addEventListener('mouseenter', () => toggleMegaMenu(megaMenu, true));
        li.addEventListener('mouseleave', () => toggleMegaMenu(megaMenu, false));
      }
    });
  }

  // Mobile click for dropdowns
  mainNavUl.querySelectorAll('.has-child > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      const parentLi = e.currentTarget.closest('.has-child');
      const megaMenu = parentLi.querySelector('.mega-menu');
      if (megaMenu) {
        const isExpanded = parentLi.getAttribute('aria-expanded') === 'true';
        if (!isExpanded) {
          // Close other open mega-menus in mobile
          mainNavUl.querySelectorAll('.has-child[aria-expanded="true"]').forEach((openLi) => {
            const openMenu = openLi.querySelector('.mega-menu');
            if (openMenu && openLi !== parentLi) {
              openMenu.style.display = 'none';
              openLi.setAttribute('aria-expanded', 'false');
              openLi.querySelector('span svg').style.transform = 'rotate(90deg)';
            }
          });
        }
        megaMenu.style.display = isExpanded ? 'none' : 'block';
        parentLi.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        e.currentTarget.querySelector('svg').style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(-180deg)';
      }
    });
  });

  // Mobile click for sub-child toggles
  mainNavUl.querySelectorAll('.has-sub-child > ul > li > span, .has-inner-sub-child > ul > li > span').forEach((span) => {
    span.addEventListener('click', (e) => {
      const parentLi = e.currentTarget.closest('li');
      toggleSubChild(parentLi, parentLi.getAttribute('aria-expanded') !== 'true');
    });
  });

  // Hamburger menu toggle
  const hamburger = nav.querySelector('.hamburger');
  const mainNav = nav.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isNavOpen = mainNav.classList.contains('open');
      if (isNavOpen) {
        mainNav.classList.remove('open');
        mainNav.style.opacity = '0';
        mainNav.style.transform = 'translate(-100%,0)';
        document.body.style.overflowY = '';
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        mainNav.classList.add('open');
        mainNav.style.opacity = '1';
        mainNav.style.transform = 'translate(0,0)';
        document.body.style.overflowY = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Search toggle
  const searchIcons = nav.querySelectorAll('.icon-nav .search');
  searchIcons.forEach((searchIcon) => {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing
      const searchScreenWrap = nav.querySelector('.search-screen-wrap');
      if (searchScreenWrap) {
        const isOpen = searchScreenWrap.style.opacity === '1';
        if (isOpen) {
          searchScreenWrap.style.opacity = '0';
          searchScreenWrap.style.pointerEvents = 'none';
          searchScreenWrap.style.transform = 'translate(0,0rem)';
          searchIcon.querySelector('.lens').style.display = 'block';
          searchIcon.querySelector('.close').style.display = 'none';
          document.body.style.overflowY = '';
          searchIcon.setAttribute('aria-expanded', 'false');
        } else {
          searchScreenWrap.style.opacity = '1';
          searchScreenWrap.style.pointerEvents = 'all';
          searchScreenWrap.style.transform = 'translate(0,0rem)';
          searchIcon.querySelector('.lens').style.display = 'none';
          searchIcon.querySelector('.close').style.display = 'block';
          document.body.style.overflowY = 'hidden';
          searchIcon.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    const searchScreenWrap = nav.querySelector('.search-screen-wrap');
    const searchIcon = nav.querySelector('.icon-nav .search');
    if (searchScreenWrap && searchIcon && searchScreenWrap.style.opacity === '1' && !searchIcon.contains(e.target) && !searchScreenWrap.contains(e.target)) {
      searchScreenWrap.style.opacity = '0';
      searchScreenWrap.style.pointerEvents = 'none';
      searchScreenWrap.style.transform = 'translate(0,0rem)';
      searchIcon.querySelector('.lens').style.display = 'block';
      searchIcon.querySelector('.close').style.display = 'none';
      document.body.style.overflowY = '';
      searchIcon.setAttribute('aria-expanded', 'false');
    }
  });

  // Close search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const searchScreenWrap = nav.querySelector('.search-screen-wrap');
      const searchIcon = nav.querySelector('.icon-nav .search');
      if (searchScreenWrap && searchIcon && searchScreenWrap.style.opacity === '1') {
        searchScreenWrap.style.opacity = '0';
        searchScreenWrap.style.pointerEvents = 'none';
        searchScreenWrap.style.transform = 'translate(0,0rem)';
        searchIcon.querySelector('.lens').style.display = 'block';
        searchIcon.querySelector('.close').style.display = 'none';
        document.body.style.overflowY = '';
        searchIcon.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return; // Exit if fragment not loaded
  }

  // Create the main header structure
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  block.appendChild(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.appendChild(wrapDiv);

  // Parse sections from the fragment
  const { brandSections, navSections, toolsSections, primaryNavLabels, searchOverlayContent } = parseStructure(fragment);

  // 1. Setup Brand Logo
  setupBrand(block, brandSections);

  // 2. Setup Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.appendChild(hamburger);

  // 3. Setup Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  const mainNavUl = document.createElement('ul');
  mainNavUl.setAttribute('itemscope', '');
  mainNavUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.appendChild(mainNavUl);
  wrapDiv.appendChild(mainNav);

  setupDesktopNav(mainNavUl, navSections, primaryNavLabels);

  // 4. Setup Tools (Contact Us, Search, Socials)
  setupTools(block, toolsSections);

  // 5. Add 80th-year logo if present in fragment (assuming it's the last element in tools)
  if (toolsSections.length > 0) {
    const lastSection = toolsSections[toolsSections.length - 1];
    const year80Logo = lastSection.querySelector('picture img[alt*="80th Year Logo"]');
    if (year80Logo) {
      const logo80Div = document.createElement('div');
      logo80Div.classList.add('logo', 'year-80-logo');
      const a = document.createElement('a');
      a.href = '/'; // Default home link
      a.appendChild(year80Logo.cloneNode(true));
      logo80Div.appendChild(a);
      wrapDiv.appendChild(logo80Div);
    }
  }

  // 6. Add the search screen wrap to the main header, outside the nav element
  if (searchOverlayContent) {
    const searchScreenWrap = searchOverlayContent.cloneNode(true);
    block.appendChild(searchScreenWrap);
  }

  setupNavEventListeners(block);
}
