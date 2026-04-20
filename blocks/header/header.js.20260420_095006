import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const DESKTOP_BREAKPOINT = 900; // Define desktop breakpoint

// TARGET FRAGMENT DATA MODEL (hardcoded for demonstration as per strict instruction)
const NAV_DATA = [
  {
    "l1Label": "Term Insurance",
    "l1Href": "/term-insurance",
    "menuHtml": "<ul><li><a href=\"/term-insurance/what-is-1-crore-term-insurance\">1 Crore Term Insurance</a></li><li><a href=\"/term-insurance/term-insurance-tax-benefits\">Term Insurance Tax Benefits</a></li><li><a href=\"/tools-and-calculators/term-insurance-calculator\">Term Insurance Calculator</a></li><li><a href=\"/term-insurance/iselect-smart360-term-plan\">iSelect Smart360 Term Plan</a></li><li><a href=\"/term-insurance/young-term-plan\">Young Term Plan</a></li><li><a href=\"/term-insurance/term-plan-with-return-of-premium\">Term Plan with Return Of Premium</a></li></ul>"
  },
  {
    "l1Label": "Investment Plans",
    "l1Href": "/savings-and-investment-plans",
    "menuHtml": "<ul><li><a href=\"/ulips\">ULIP Plan</a></li><li><a href=\"/savings-and-investment-plans\">Savings Plan</a></li><li><a href=\"/retirement-plans\">Retirement Plan</a></li><li><a href=\"/child-insurance\">Child Insurance Plan</a></li><li><a href=\"/savings-and-investment-plans/promise-4-wealth\">Promise4Wealth</a></li><li><a href=\"/ulips/promise4growth-plus\">Promise4Growth Plus</a></li><li><a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">iSelect Guaranteed Future Plus</a></li><li><a href=\"/tools-and-calculators/investment-calculator\">Investment Calculator</a></li></ul>"
  },
  {
    "l1Label": "All Plans",
    "l1Href": "/product-list",
    "menuHtml": "<ul><li><a href=\"/term-insurance\">Term Insurance</a><ul><li><a href=\"/term-insurance/young-term-plan\">Young Term Plan</a></li><li><a href=\"/term-insurance/iselect-smart360-term-plan\">iSelect Smart360 Term Plan</a></li><li><a href=\"/term-insurance/promise2protect\">Promise2Protect</a></li><li><a href=\"/product-list#term-plans\">View All</a></li></ul></li><li><a href=\"/ulips\">Unit Linked Insurance Plans</a><ul><li><a href=\"/savings-and-investment-plans/promise-4-wealth\">Promise4Wealth</a></li><li><a href=\"/ulips/promise4growth-plus\">Promise4Growth Plus</a></li><li><a href=\"/ulips/secure-invest\">SecureInvest</a></li><li><a href=\"/product-list#ulips\">View All</a></li></ul></li><li><a href=\"/tax-saving-plans\">Tax Saving Plan</a><ul><li><a href=\"/term-insurance/young-term-plan\">Young Term Plan</a></li><li><a href=\"/term-insurance/iselect-smart360-term-plan\">iSelect Smart360 Term Plan</a></li><li><a href=\"/savings-and-investment-plans/iselect-guaranteed-future\">iSelect Guaranteed Future</a></li><li><a href=\"/product-list#tax-saving-plans\">View All</a></li></ul></li><li><a href=\"/retirement-plans\">Retirement Plans</a><ul><li><a href=\"/retirement-plans/legacy-builder\">Legacy Builder</a></li><li><a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">iSelect Guaranteed Future Plus</a></li><li><a href=\"/retirement-plans/ez-pension\">EZ Pension</a></li><li><a href=\"/product-list#retirement-plans\">View All</a></li></ul></li><li><a href=\"/savings-and-investment-plans\">Saving Plans</a><ul><li><a href=\"/savings-and-investment-plans/incomenow\">IncomeNow</a></li><li><a href=\"/savings-and-investment-plans/promise4life\">Promise4Life</a></li><li><a href=\"/product-list#savings-plans\">View All</a></li></ul></li><li><a href=\"/child-insurance\">Child Insurance Plans</a><ul><li><a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">iSelect Guaranteed Future Plus</a></li><li><a href=\"/product-list#child-insurance-plans\">View All</a></li></ul></li><li><a href=\"#\">Insurance Riders</a><ul><li><a href=\"https://www.canarahsbclife.com/insurance-riders/accidental-benefit-rider\">Accidental Benefit Rider (Linked)</a></li><li><a href=\"/insurance-riders/linked-critical-illness-benefit-rider\">Linked Critical Illness Benefit Rider</a></li><li><a href=\"/insurance-riders/group-critical-illness-rider\">Group Critical Illness Rider</a></li></ul></li><li><a href=\"#\">GIFT City</a><ul><li><a href=\"/international/future-dollar-investment-plan\">Future Dollar Investment</a></li></ul></li><li><a href=\"/life-insurance-plans\">Online Life Insurance</a><ul><li><a href=\"/savings-and-investment-plans/promise-4-wealth\">Promise4Wealth</a></li><li><a href=\"/ulips/promise4growth-plus\">Promise4Growth Plus</a></li><li><a href=\"/term-insurance/young-term-plan\">Young Term Plan</a></li><li><a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">iSelect Guaranteed Future Plus</a></li><li><a href=\"/term-insurance/iselect-smart360-term-plan\">iSelect Smart360 Term Plan</a></li></ul></li><li><a href=\"/group-insurance\">Group Insurance Plans</a><ul><li><a href=\"/group-insurance/group-secure-plus\">Group Secure Plus</a></li><li><a href=\"/group-insurance/group-secure\">Group Secure Plan</a></li><li><a href=\"/group-insurance/group-term-edge-plan\">Group Term Edge Plan</a></li><li><a href=\"/product-list#group-insurance-plans\">View All</a></li></ul></li></ul>"
  },
  {
    "l1Label": "Customer Service",
    "l1Href": "/customer-service",
    "menuHtml": "<ul><li><a href=\"/customer-service\">Manage Policy</a><ul><li><a href=\"https://customer.canarahsbclife.com/PremiumPayment\">Pay Premium</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Premium Receipt</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Update KYC</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Duplicate Policy Pack</a></li><li><a href=\"/funds-navs/latest-nav-history\">Latest NAV</a></li><li><a href=\"/content/dam/chli/pdfs/service-booklet.pdf\">Service Booklet & E-statements</a></li><li><a href=\"https://customer.canarahsbclife.com/EnachRegistration\">ENACH Registration</a></li><li><a href=\"/customer-service\">View All</a></li></ul></li><li><a href=\"/customer-service/claims\">Claims</a><ul><li><a href=\"https://customer.canarahsbclife.com/ClaimsRegister\">Register Claim</a></li><li><a href=\"/customer-service/claims#documentRequired\">Claim Form</a></li><li><a href=\"https://customer.canarahsbclife.com/search_claim\">Claim Status</a></li><li><a href=\"https://customer.canarahsbclife.com/claims#claimsCompanion\">Get Claim Assistance</a></li><li><a href=\"/customer-service/claims\">View All</a></li></ul></li><li><a href=\"#\">Others</a><ul><li><a href=\"/customer-service/track-application#trackApplication\">Track Application</a></li><li><a href=\"/customer-service/contact-details\">Contact Us</a></li></ul></li><li><a href=\"https://www.canarahsbclife.com/customer-service/claims/unclaimed-amount#unclaimedAmount\">Unclaimed Policies</a><ul><li><a href=\"/customer-service/claims/unclaimed-amount#unclaimedAmount\">Unclaimed Amount</a></li><li><a href=\"/customer-service/claims/unclaimed-amount-movement-to-senior-citizens-welfare-fund\">Check unclaimed amount moved to Senior Citizen Account</a></li></ul></li><li><a href=\"/customer-service/#grievanceRedressal\">Grievance Redressal</a></li></ul>"
  },
  {
    "l1Label": "Investor Relations",
    "l1Href": "#",
    "menuHtml": "<ul><li><a href=\"/about-us\">About the Company</a><ul><li><a href=\"/about-us/board-of-directors\">Board of Directors</a></li><li><a href=\"/about-us/composition-of-board-of-directors-committee\">Composition of the Board Committees</a></li></ul></li><li><a href=\"/investor-relations/offer-documents\">Offer Documents</a></li><li><a href=\"/investor-relations/financials\">Financials</a><ul><li><a href=\"/investor-relations/financials\">Financial Results</a></li><li><a href=\"/public-disclosures\">Public Disclosure</a></li></ul></li><li><a href=\"#\">Information to Shareholders</a><ul><li><a href=\"/investor-relations/information-to-shareholders/shareholder-meetings-and-voting\">Shareholder Meetings & Voting</a></li><li><a href=\"/investor-relations/information-to-shareholders/shareholding-and-governance-information\">Shareholding & Governance Information</a></li><li><a href=\"/investor-relations/information-to-shareholders/other-disclosures\">Other Disclosures</a></li></ul></li><li><a href=\"/investor-relations/policies-and-code-of-conduct\">Policies and Code of Conduct</a></li><li><a href=\"/investor-relations/bulletin-board\">Bulletin Board</a></li></ul>"
  }
];

/**
 * Clears the open state for all desktop L0 dropdowns except the one specified.
 * @param {HTMLElement} currentDropdown The dropdown element to keep open, or null to close all.
 */
function closeOtherDropdowns(currentDropdown = null) {
  document.querySelectorAll('.header-nav > ul > li.is-open').forEach((li) => {
    const dropdown = li.querySelector('.header-dropdown-wrapper');
    if (dropdown && dropdown !== currentDropdown) {
      li.classList.remove('is-open');
      li.querySelector('a')?.setAttribute('aria-expanded', 'false');
      dropdown.removeEventListener('focusout', handleFocusOut);
    }
  });
}

function handleFocusOut(event) {
  const relatedTarget = event.relatedTarget;
  if (!this.contains(relatedTarget)) {
    const parentLi = this.closest('.header-nav-item');
    if (parentLi) {
      parentLi.classList.remove('is-open');
      parentLi.querySelector('a')?.setAttribute('aria-expanded', 'false');
    }
    this.removeEventListener('focusout', handleFocusOut);
  }
}

/**
 * Sets up hover/focus interaction for desktop dropdown menus.
 * @param {HTMLElement} dropdown The dropdown wrapper element.
 * @param {HTMLElement} trigger The triggering anchor element.
 * @param {HTMLElement} parentLi The parent LI element.
 * @param {string} level 'L0' or 'L1' for different interaction logic.
 */
function setupDesktopDropdown(dropdown, trigger, parentLi, level) {
  const openDropdown = () => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return; // Only desktop
    if (level === 'L0') {
      closeOtherDropdowns(dropdown);
    }
    parentLi.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.addEventListener('focusout', handleFocusOut);
  };

  const closeDropdown = () => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return;
    // Delay closing to allow moving between sub-items
    setTimeout(() => {
      if (!parentLi.matches(':hover') && !dropdown.contains(document.activeElement)) {
        parentLi.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.removeEventListener('focusout', handleFocusOut);
      }
    }, 100);
  };

  parentLi.addEventListener('mouseenter', openDropdown);
  parentLi.addEventListener('mouseleave', closeDropdown);
  trigger.addEventListener('focus', openDropdown);
  dropdown.querySelectorAll('a').forEach((link) => {
    link.addEventListener('focus', openDropdown);
    link.addEventListener('blur', closeDropdown);
  });
}

/**
 * Closes the mobile menu and restores body scroll.
 * @param {HTMLElement} mobileMenu The mobile menu element.
 */
function closeMobileMenu(mobileMenu) {
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('scroll-locked');
  document.querySelector('.header-hamburger-button')?.setAttribute('aria-expanded', 'false');
  document.querySelector('.header-hamburger-button')?.classList.remove('is-open');
  document.querySelector('.header-overlay')?.classList.remove('is-open');
}

/**
 * Toggles the mobile menu open/closed.
 * @param {HTMLElement} mobileMenu The mobile menu element.
 */
function toggleMobileMenu(mobileMenu) {
  const isOpen = mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('scroll-locked', isOpen);
  document.querySelector('.header-hamburger-button')?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.querySelector('.header-hamburger-button')?.classList.toggle('is-open', isOpen);
  document.querySelector('.header-overlay')?.classList.toggle('is-open', isOpen);

  if (!isOpen) {
    // Close any open accordions when menu is closed
    mobileMenu.querySelectorAll('.header-accordion-item.is-open').forEach(item => {
      item.classList.remove('is-open');
      item.querySelector('button')?.setAttribute('aria-expanded', 'false');
      item.querySelector('.header-accordion-collapse')?.style.maxHeight = null;
    });
  }
}

/**
 * Creates an SVG element from a sprite reference.
 * @param {string} id The id of the SVG symbol in the sprite.
 * @param {string} className Optional class name for the SVG.
 * @param {string} title Optional title for accessibility.
 * @returns {SVGSVGElement} The created SVG element.
 */
function createSVG(id, className = '', title = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (className) svg.classList.add(...className.split(' '));
  if (title) {
    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleEl.textContent = title;
    svg.appendChild(titleEl);
  }
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('xlink:href', `/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#${id}`);
  svg.appendChild(use);
  return svg;
}

/**
 * Decorates the header block.
 * @param {HTMLElement} block The header block element.
 */
export default async function decorate(block) {
  block.innerHTML = ''; // Idempotency: Clear existing content
  block.classList.add('header'); // Add base class to block for styling

  // Create main header structure
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');

  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  const desktopNavList = document.createElement('ul');
  headerNav.appendChild(desktopNavList);

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  const headerMobileMenu = document.createElement('div');
  headerMobileMenu.classList.add('header-mobile-menu');
  headerMobileMenu.setAttribute('role', 'dialog');
  headerMobileMenu.setAttribute('aria-modal', 'true');
  headerMobileMenu.setAttribute('aria-label', 'Mobile Menu');

  // Overlay for mobile menu and search/notifications
  const headerOverlay = document.createElement('div');
  headerOverlay.classList.add('header-overlay');

  headerWrapper.append(headerBrand, headerNav, headerTools);
  block.append(headerWrapper, headerMobileMenu, headerOverlay);

  // Load nav fragment for logo and additional tool content/context
  const navContent = await loadFragment('/nav');
  if (!navContent) return; // Handle empty fragment

  // Move instrumentation data from fragment to block
  moveInstrumentation(navContent, block);

  // 1. Extract Logo (Brand Area)
  const logoLink = navContent.querySelector('.header__logo, .navbar-brand'); // Look for logo link in fragment
  if (logoLink) {
    const logoClone = logoLink.cloneNode(true);
    logoClone.classList.remove('navbar-brand', 'p-0', 'header__logo', 'position-relative'); // Clean classes
    logoClone.querySelector('img')?.classList.remove('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
    headerBrand.appendChild(logoClone);
  } else {
    // Fallback if no logo in fragment, create a generic one
    const fallbackLogo = document.createElement('a');
    fallbackLogo.href = '/';
    fallbackLogo.innerHTML = `<img src="/images/logo.svg" alt="Site Logo" loading="eager">`; // Placeholder
    headerBrand.appendChild(fallbackLogo);
  }

  // 2. Build Main Navigation (Mega Menu) from NAV_DATA
  NAV_DATA.forEach((l0Item, index) => {
    // Desktop L0 Item
    const l0Li = document.createElement('li');
    l0Li.classList.add('nav-item', 'header-nav-item');

    const l0Anchor = document.createElement('a');
    l0Anchor.classList.add('nav-link', 'header-nav-link');
    l0Anchor.href = l0Item.l1Href;
    l0Anchor.textContent = l0Item.l1Label;
    l0Anchor.setAttribute('id', `navbarDropdownMenuLink${index}`);
    l0Anchor.setAttribute('role', 'button');

    l0Li.appendChild(l0Anchor);

    if (l0Item.menuHtml) {
      l0Anchor.setAttribute('aria-haspopup', 'true');
      l0Anchor.setAttribute('aria-expanded', 'false');
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.classList.add('header-dropdown-wrapper');

      const parser = new DOMParser();
      const doc = parser.parseFromString(l0Item.menuHtml, 'text/html');
      // Move children from parsed body to dropdownWrapper
      Array.from(doc.body.children).forEach((child) => dropdownWrapper.appendChild(child));

      l0Li.appendChild(dropdownWrapper);
      setupDesktopDropdown(dropdownWrapper, l0Anchor, l0Li, 'L0');

      // Nested dropdowns (L1)
      dropdownWrapper.querySelectorAll('ul > li').forEach(l1Li => {
        const l1Anchor = l1Li.querySelector('a');
        if (l1Anchor && l1Li.querySelector('ul')) {
          l1Anchor.setAttribute('aria-haspopup', 'true');
          l1Anchor.setAttribute('aria-expanded', 'false');
          l1Li.classList.add('has-dropdown');
          setupDesktopDropdown(l1Li.querySelector('ul'), l1Anchor, l1Li, 'L1');
        }
      });
    }
    desktopNavList.appendChild(l0Li);

    // Mobile Accordion Item
    const mobileAccordionItem = document.createElement('section');
    mobileAccordionItem.classList.add('header-accordion-item');
    mobileAccordionItem.setAttribute('data-label', l0Item.l1Label); // For consistent identification

    const accordionHeading = document.createElement('h2');
    accordionHeading.classList.add('header-accordion-heading');

    const accordionButton = document.createElement('button');
    accordionButton.classList.add('header-accordion-button');
    accordionButton.setAttribute('aria-expanded', 'false');
    accordionButton.innerHTML = `
      <a href="${l0Item.l1Href}" class="header-accordion-link">${l0Item.l1Label}</a>
      ${l0Item.menuHtml ? `<span class="header-accordion-arrow-wrapper">${createSVG('drop-up-caret', 'header-accordion-arrow', 'Toggle menu').outerHTML}</span>` : ''}
    `;

    const accordionCollapse = document.createElement('div');
    accordionCollapse.classList.add('header-accordion-collapse');
    accordionCollapse.setAttribute('aria-labelledby', `panel-heading-${index}-mobile`);

    if (l0Item.menuHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(l0Item.menuHtml, 'text/html');
      Array.from(doc.body.children).forEach((child) => accordionCollapse.appendChild(child));

      accordionButton.querySelector('.header-accordion-arrow-wrapper')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent L0 link click
        const isOpen = mobileAccordionItem.classList.toggle('is-open');
        accordionButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
          accordionCollapse.style.maxHeight = `${accordionCollapse.scrollHeight}px`;
        } else {
          accordionCollapse.style.maxHeight = null;
        }
      });
    } else {
      // If no submenu, remove the arrow toggle button for mobile
      accordionButton.querySelector('.header-accordion-arrow-wrapper')?.remove();
      accordionButton.querySelector('a')?.style.pointerEvents = 'auto'; // Ensure L0 link is clickable
    }

    accordionHeading.appendChild(accordionButton);
    mobileAccordionItem.append(accordionHeading, accordionCollapse);
    headerMobileMenu.appendChild(mobileAccordionItem);
  });

  // 3. Build Tools (Utility / Action Area)
  const searchButton = document.createElement('button');
  searchButton.classList.add('header-tool-button', 'header-search-button');
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.appendChild(createSVG('search', 'header-search-icon'));
  headerTools.appendChild(searchButton);

  const notificationButton = document.createElement('button');
  notificationButton.classList.add('header-tool-button', 'header-notification-button');
  notificationButton.setAttribute('aria-label', 'Notifications');
  notificationButton.appendChild(createSVG('bell-icon', 'header-notification-icon'));
  headerTools.appendChild(notificationButton);

  const notificationPanel = document.createElement('div');
  notificationPanel.classList.add('header-notification-panel');
  notificationPanel.setAttribute('aria-hidden', 'true');
  notificationPanel.setAttribute('role', 'region');
  notificationPanel.setAttribute('aria-label', 'Notifications');

  // Populate notification panel from navContent (if available)
  const rawNotifications = navContent.querySelector('.header__notification--panel, .header__notification--mobile');
  if (rawNotifications) {
    notificationPanel.appendChild(rawNotifications.cloneNode(true));
  } else {
    notificationPanel.innerHTML = '<p>No new notifications.</p>'; // Fallback
  }
  headerTools.appendChild(notificationPanel);

  const loginLink = document.createElement('a');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.target = '_blank';
  loginLink.classList.add('header-tool-link', 'header-login-link');
  loginLink.setAttribute('aria-label', 'Login');
  loginLink.innerHTML = `${createSVG('user-icon', 'header-login-icon').outerHTML}<span class="header-login-text">Login</span>`;
  headerTools.appendChild(loginLink);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('header-tool-button', 'header-hamburger-button');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.innerHTML = `
    ${createSVG('hamburger-icon', 'header-hamburger-open').outerHTML}
    ${createSVG('close', 'header-hamburger-close').outerHTML}
  `;
  headerTools.appendChild(hamburgerButton);

  // Search Overlay (based on raw HTML structure)
  const searchOverlay = document.createElement('section');
  searchOverlay.classList.add('header-search-overlay');
  searchOverlay.setAttribute('aria-hidden', 'true');
  searchOverlay.innerHTML = `
    <div class="header-search-container">
      <button class="header-search-close-button" aria-label="Close search">
        ${createSVG('close', 'header-search-close-icon').outerHTML}
      </button>
      <form class="header-search-form" autocomplete="off">
        <input type="search" placeholder="Search..." class="header-search-input">
        <button type="submit" class="header-search-submit-button" aria-label="Submit search">
          ${createSVG('arrow-right', 'header-search-submit-icon').outerHTML}
        </button>
      </form>
      <div class="header-search-popular">
        <h3>Popular Searches</h3>
        <ul class="header-search-popular-list">
          <li>Term Insurance</li>
          <li>Life Insurance Plans</li>
          <li>Savings & Investment Plan</li>
        </ul>
      </div>
    </div>
  `;
  block.appendChild(searchOverlay);

  // Populate mobile menu with social/app links if available in navContent
  const mobileFooterContent = navContent.querySelector('.header__accordion--app');
  if (mobileFooterContent) {
    headerMobileMenu.appendChild(mobileFooterContent.cloneNode(true));
  } else {
    // Fallback social/app links if not found in fragment
    const fallbackMobileFooter = document.createElement('div');
    fallbackMobileFooter.classList.add('header-mobile-footer');
    fallbackMobileFooter.innerHTML = `
      <h4>Follow Us</h4>
      <ul class="header-socials-list">
        <li><a href="#" aria-label="Facebook">${createSVG('facebook').outerHTML}</a></li>
        <li><a href="#" aria-label="Twitter">${createSVG('xLogo').outerHTML}</a></li>
        <li><a href="#" aria-label="LinkedIn">${createSVG('linkedin').outerHTML}</a></li>
      </ul>
      <h4>Download the App</h4>
      <ul class="header-app-list">
        <li><a href="#" aria-label="Google Play">${createSVG('get-it-on-google-play').outerHTML}</a></li>
        <li><a href="#" aria-label="App Store">${createSVG('app-store-download').outerHTML}</a></li>
      </ul>
    `;
    headerMobileMenu.appendChild(fallbackMobileFooter);
  }

  // --- Event Listeners for Tools ---

  // Hamburger Toggle
  hamburgerButton.addEventListener('click', () => toggleMobileMenu(headerMobileMenu));
  headerOverlay.addEventListener('click', () => closeMobileMenu(headerMobileMenu));
  headerMobileMenu.querySelector('.header__hamburger--close')?.addEventListener('click', () => closeMobileMenu(headerMobileMenu));
  headerMobileMenu.querySelector('.header__hamburger--head')?.addEventListener('click', () => closeMobileMenu(headerMobileMenu));

  // Search Toggle
  const searchCloseButton = searchOverlay.querySelector('.header-search-close-button');
  searchButton.addEventListener('click', () => {
    searchOverlay.classList.add('is-open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');
    headerOverlay.classList.add('is-open');
    searchOverlay.querySelector('input')?.focus();
  });
  searchCloseButton?.addEventListener('click', () => {
    searchOverlay.classList.remove('is-open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');
    headerOverlay.classList.remove('is-open');
  });
  headerOverlay.addEventListener('click', () => {
    if (searchOverlay.classList.contains('is-open')) {
      searchOverlay.classList.remove('is-open');
      searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-locked');
      headerOverlay.classList.remove('is-open');
    }
  });

  // Notification Toggle
  notificationButton.addEventListener('click', () => {
    notificationPanel.classList.toggle('is-open');
    const isOpen = notificationPanel.classList.contains('is-open');
    notificationPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    headerOverlay.classList.toggle('is-open', isOpen);
    if (isOpen) closeOtherDropdowns(); // Close other L0 desktop nav when notifications open
  });
  headerOverlay.addEventListener('click', () => {
    if (notificationPanel.classList.contains('is-open')) {
      notificationPanel.classList.remove('is-open');
      notificationPanel.setAttribute('aria-hidden', 'true');
      headerOverlay.classList.remove('is-open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (headerMobileMenu.classList.contains('is-open')) {
        closeMobileMenu(headerMobileMenu);
      }
      if (searchOverlay.classList.contains('is-open')) {
        searchOverlay.classList.remove('is-open');
        searchOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-locked');
        headerOverlay.classList.remove('is-open');
      }
      if (notificationPanel.classList.contains('is-open')) {
        notificationPanel.classList.remove('is-open');
        notificationPanel.setAttribute('aria-hidden', 'true');
        headerOverlay.classList.remove('is-open');
      }
      closeOtherDropdowns();
    }
  });

  // Close on outside click (for desktop dropdowns)
  document.addEventListener('click', (e) => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      const openL0Dropdown = document.querySelector('.header-nav > ul > li.is-open');
      if (openL0Dropdown && !openL0Dropdown.contains(e.target)) {
        closeOtherDropdowns();
      }
    }
  });
}

