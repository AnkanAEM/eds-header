import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Hardcoded nav data payload as per requirements
const NAV_DATA_PAYLOAD = [
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
    "menuHtml": "<ul><li><a href=\"/customer-service\">Manage Policy</a><ul><li><a href=\"https://customer.canarahsbclife.com/PremiumPayment\">Pay Premium</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Premium Receipt</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Update KYC</a></li><li><a href=\"https://customer.canarahsbclife.com/login\">Duplicate Policy Pack</a></li><li><a href=\"/funds-navs/latest-nav-history\">Latest NAV</a></li><li><a href=\"/content/dam/chli/pdfs/service-booklet.pdf\">Service Booklet &amp; E-statements</a></li><li><a href=\"https://customer.canarahsbclife.com/EnachRegistration\">ENACH Registration</a></li><li><a href=\"/customer-service\">View All</a></li></ul></li><li><a href=\"/customer-service/claims\">Claims</a><ul><li><a href=\"https://customer.canarahsbclife.com/ClaimsRegister\">Register Claim</a></li><li><a href=\"/customer-service/claims#documentRequired\">Claim Form</a></li><li><a href=\"https://customer.canarahsbclife.com/search_claim\">Claim Status</a></li><li><a href=\"/customer-service/claims#claimsCompanion\">Get Claim Assistance</a></li><li><a href=\"/customer-service/claims\">View All</a></li></ul></li><li><a href=\"#\">Others</a><ul><li><a href=\"/customer-service/track-application#trackApplication\">Track Application</a></li><li><a href=\"/customer-service/contact-details\">Contact Us</a></li></ul></li><li><a href=\"https://www.canarahsbclife.com/customer-service/claims/unclaimed-amount#unclaimedAmount\">Unclaimed Policies</a><ul><li><a href=\"/customer-service/claims/unclaimed-amount#unclaimedAmount\">Unclaimed Amount</a></li><li><a href=\"/customer-service/claims/unclaimed-amount-movement-to-senior-citizens-welfare-fund\">Check unclaimed amount moved to Senior Citizen Account</a></li></ul></li><li><a href=\"/customer-service/#grievanceRedressal\">Grievance Redressal</a></li></ul>"
  },
  {
    "l1Label": "Investor Relations",
    "l1Href": "#",
    "menuHtml": "<ul><li><a href=\"/about-us\">About the Company</a><ul><li><a href=\"/about-us/board-of-directors\">Board of Directors</a></li><li><a href=\"/about-us/composition-of-board-of-directors-committee\">Composition of the Board Committees</a></li></ul></li><li><a href=\"/investor-relations/offer-documents\">Offer Documents</a></li><li><a href=\"/investor-relations/financials\">Financials</a><ul><li><a href=\"/investor-relations/financials\">Financial Results</a></li><li><a href=\"/public-disclosures\">Public Disclosure</a></li></ul></li><li><a href=\"#\">Information to Shareholders</a><ul><li><a href=\"/investor-relations/information-to-shareholders/shareholder-meetings-and-voting\">Shareholder Meetings &amp; Voting</a></li><li><a href=\"/investor-relations/information-to-shareholders/shareholding-and-governance-information\">Shareholding &amp; Governance Information</a></li><li><a href=\"/investor-relations/information-to-shareholders/other-disclosures\">Other Disclosures</a></li></ul></li><li><a href=\"/investor-relations/policies-and-code-of-conduct\">Policies and Code of Conduct</a></li><li><a href=\"/investor-relations/bulletin-board\">Bulletin Board</a></li></ul>"
  }
];

const DESKTOP_BREAKPOINT = '(min-width: 900px)';

export default async function decorate(block) {
  // 1. Fetch the raw /nav fragment HTML
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    block.remove();
    return;
  }

  // Create main header structure
  const headerElem = document.createElement('header');
  headerElem.className = 'header';
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';
  const headerBrand = document.createElement('div');
  headerBrand.className = 'header-brand';
  const headerNav = document.createElement('nav');
  headerNav.className = 'header-nav';
  const headerTools = document.createElement('div');
  headerTools.className = 'header-tools';

  headerWrapper.append(headerBrand, headerNav, headerTools);
  headerElem.append(headerWrapper);

  // 2. Extract Brand and Tools from raw navContent
  // Defensive search within navContent (original fragment)
  const logoLink = navContent.querySelector('.header__logo a, .navbar-brand'); // Match original AEM and raw HTML
  if (logoLink) {
    headerBrand.append(logoLink);
    const logoImg = logoLink.querySelector('img');
    if (logoImg) {
      // Optimize logo image
      const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '150' }]);
      logoImg.replaceWith(optimizedLogo);
    }
  }

  // Extract tools using specific selectors from the original HTML
  const searchBtn = navContent.querySelector('.header__search');
  const notificationContainer = navContent.querySelector('.header__notification--trigger');
  const loginLink = navContent.querySelector('.header__login');
  const hamburgerBtn = navContent.querySelector('.header__hamburger--button');

  // Append tools if found, ensuring they are valid elements
  if (searchBtn) headerTools.append(searchBtn);
  if (notificationContainer) headerTools.append(notificationContainer);
  if (loginLink) headerTools.append(loginLink);
  if (hamburgerBtn) headerTools.append(hamburgerBtn);

  // 3. Build Main Navigation from NAV_DATA_PAYLOAD
  const mainNavUl = document.createElement('ul');
  mainNavUl.className = 'header-nav-l0';
  headerNav.append(mainNavUl);

  NAV_DATA_PAYLOAD.forEach((l0Item) => {
    const l0Li = document.createElement('li');
    l0Li.className = 'header-nav-l0-item';

    const l0Link = document.createElement('a');
    l0Link.className = 'header-nav-l0-link';
    l0Link.href = l0Item.l1Href;
    l0Link.textContent = l0Item.l1Label;
    l0Li.append(l0Link);

    if (l0Item.menuHtml) {
      l0Li.classList.add('has-dropdown');
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.className = 'header-dropdown-wrapper';
      dropdownWrapper.setAttribute('aria-hidden', 'true');

      // Parse and append menuHtml content, preserving rich structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = l0Item.menuHtml;

      // Move children from tempDiv to dropdownWrapper directly
      // This preserves any complex structure (e.g., nested divs for columns, images, etc.)
      while (tempDiv.firstChild) {
        const child = tempDiv.firstChild;
        // Apply generic classes for easier styling if they are plain ULs
        if (child.tagName === 'UL') {
            child.classList.add('header-dropdown-l1');
            // Iterate L1 items to process potential L2
            Array.from(child.children).forEach(l1ChildLi => {
                const l2Ul = l1ChildLi.querySelector('ul');
                if(l2Ul) {
                    l1ChildLi.classList.add('has-nested-dropdown');
                    l2Ul.classList.add('header-dropdown-l2');
                    l2Ul.setAttribute('aria-hidden', 'true');
                }
            });
        }
        dropdownWrapper.append(child);
      }
      l0Li.append(dropdownWrapper);
    }
    mainNavUl.append(l0Li);
  });

  // 4. Implement Interactions (Desktop hover, Mobile click, Hamburger)
  setupInteractions(headerElem);

  // 5. Clear original block content and append new header
  block.innerHTML = '';
  block.append(headerElem);

  // 6. Move instrumentation
  moveInstrumentation(navContent, block);
}

// Function to setup all interactions
function setupInteractions(header) {
  const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
  const headerNav = header.querySelector('.header-nav');
  const hamburgerBtn = header.querySelector('.header__hamburger--button');
  const mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'header-mobile-overlay';
  header.append(mobileOverlay);

  // Helper to close all open dropdowns (desktop & mobile)
  function closeAllDropdowns(container = headerNav, excludeElement = null) {
    container.querySelectorAll('[aria-expanded="true"]').forEach((item) => {
      if (item !== excludeElement && !item.contains(excludeElement)) {
        item.setAttribute('aria-expanded', 'false');
        // Find the element directly controlled by aria-expanded
        let controlledElement = null;
        if (item.classList.contains('header-nav-l0-item')) { // L0 dropdown
          controlledElement = item.querySelector('.header-dropdown-wrapper');
        } else if (item.classList.contains('header-mobile-dropdown-toggle') || item.classList.contains('header-mobile-dropdown-toggle-l1')) { // L0 or L1 toggle button
          controlledElement = item.nextElementSibling; // Element directly after the toggle button
          if (!controlledElement || (!controlledElement.classList.contains('header-dropdown-wrapper') && !controlledElement.classList.contains('header-dropdown-l2'))) {
            controlledElement = item.closest('li.has-nested-dropdown')?.querySelector('ul.header-dropdown-l2');
          }
        }

        if (controlledElement) {
          controlledElement.setAttribute('aria-hidden', 'true');
        }
        item.classList.remove('is-open');
        item.closest('li')?.classList.remove('is-open'); // Remove is-open from parent li if present
      }
    });
  }

  // Desktop (hover) logic
  function setupDesktopInteractions() {
    closeAllDropdowns(); // Ensure all are closed initially
    const l0Items = headerNav.querySelectorAll('.header-nav-l0-item.has-dropdown');

    l0Items.forEach((l0Item) => {
      const dropdown = l0Item.querySelector('.header-dropdown-wrapper');
      if (!dropdown) return;

      let enterTimeout;
      let leaveTimeout;

      // Mouse Enter for L0
      l0Item.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimeout);
        enterTimeout = setTimeout(() => {
          closeAllDropdowns(headerNav, l0Item); // Close other L0s
          l0Item.setAttribute('aria-expanded', 'true');
          dropdown.setAttribute('aria-hidden', 'false');
          l0Item.classList.add('is-open');
        }, 100); // Small delay for smoother hover
      });

      // Mouse Leave for L0
      l0Item.addEventListener('mouseleave', () => {
        clearTimeout(enterTimeout);
        leaveTimeout = setTimeout(() => {
          if (!l0Item.matches(':hover') && !dropdown.matches(':hover')) {
            l0Item.removeAttribute('aria-expanded');
            dropdown.setAttribute('aria-hidden', 'true');
            l0Item.classList.remove('is-open');
            closeAllDropdowns(dropdown); // Close any nested dropdowns within this L0
          }
        }, 150); // Slightly longer delay to allow cursor to move to dropdown
      });

      // Nested dropdowns (L1/L2) within the mega menu
      dropdown.querySelectorAll('.header-dropdown-l1 > li.has-nested-dropdown').forEach((l1Item) => {
        const l2Ul = l1Item.querySelector('ul.header-dropdown-l2');
        if (!l2Ul) return;

        let l1EnterTimeout;
        let l1LeaveTimeout;

        l1Item.addEventListener('mouseenter', () => {
          clearTimeout(l1LeaveTimeout);
          l1EnterTimeout = setTimeout(() => {
            // Close other L1 dropdowns within the same L0 mega menu
            l0Item.querySelectorAll('.header-dropdown-l1 > li.has-nested-dropdown[aria-expanded="true"]').forEach(otherL1 => {
              if (otherL1 !== l1Item) {
                otherL1.setAttribute('aria-expanded', 'false');
                otherL1.querySelector('ul.header-dropdown-l2')?.setAttribute('aria-hidden', 'true');
                otherL1.classList.remove('is-open');
              }
            });
            l1Item.setAttribute('aria-expanded', 'true');
            l2Ul.setAttribute('aria-hidden', 'false');
            l1Item.classList.add('is-open');
          }, 100);
        });

        l1Item.addEventListener('mouseleave', () => {
          clearTimeout(l1EnterTimeout);
          l1LeaveTimeout = setTimeout(() => {
            if (!l1Item.matches(':hover') && !l2Ul.matches(':hover')) {
              l1Item.removeAttribute('aria-expanded');
              l2Ul.setAttribute('aria-hidden', 'true');
              l1Item.classList.remove('is-open');
            }
          }, 150);
        });
      });
    });
  }

  // Mobile (click) logic
  function setupMobileInteractions() {
    closeAllDropdowns(); // Close any desktop-opened menus

    headerNav.querySelectorAll('.header-nav-l0-item.has-dropdown').forEach((l0Item) => {
      // Remove desktop hover listeners first to prevent conflicts
      l0Item.removeEventListener('mouseenter', null);
      l0Item.removeEventListener('mouseleave', null);

      const l0Link = l0Item.querySelector('.header-nav-l0-link');
      const dropdown = l0Item.querySelector('.header-dropdown-wrapper');

      if (l0Link && dropdown) {
        // Create a toggle button for L0 dropdowns
        let toggleBtn = l0Item.querySelector('.header-mobile-dropdown-toggle');
        if (!toggleBtn) {
          toggleBtn = document.createElement('button');
          toggleBtn.className = 'header-mobile-dropdown-toggle';
          // Check if the original hamburgerBtn from navContent contained svg for arrow icon
          const originalArrowSvg = hamburgerBtn?.querySelector('svg use[*|href*="#drop-up-caret"]')?.closest('svg');
          toggleBtn.innerHTML = originalArrowSvg ? originalArrowSvg.outerHTML : '<svg><use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-down-caret"></use></svg>'; // Example icon
          l0Link.after(toggleBtn); // Place toggle button after the link
        }
        toggleBtn.setAttribute('aria-expanded', 'false');

        // Remove previous click handler if any (idempotency by overwriting onclick)
        toggleBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent parent clicks
          const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

          closeAllDropdowns(headerNav, l0Item); // Close other L0s

          toggleBtn.setAttribute('aria-expanded', !isExpanded);
          dropdown.setAttribute('aria-hidden', isExpanded);
          l0Item.classList.toggle('is-open', !isExpanded);
        };
      }

      // Handle nested dropdowns (L1/L2) for mobile clicks
      l0Item.querySelectorAll('.header-dropdown-l1 > li.has-nested-dropdown').forEach((l1Item) => {
        const l1Link = l1Item.querySelector('a');
        const l2Ul = l1Item.querySelector('ul.header-dropdown-l2');
        if (!l1Link || !l2Ul) return;

        let l1ToggleBtn = l1Item.querySelector('.header-mobile-dropdown-toggle-l1');
        if (!l1ToggleBtn) {
          l1ToggleBtn = document.createElement('button');
          l1ToggleBtn.className = 'header-mobile-dropdown-toggle header-mobile-dropdown-toggle-l1';
          // Use the same arrow icon pattern for L1 toggles
          const originalArrowSvg = hamburgerBtn?.querySelector('svg use[*|href*="#drop-up-caret"]')?.closest('svg');
          l1ToggleBtn.innerHTML = originalArrowSvg ? originalArrowSvg.outerHTML : '<svg><use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-down-caret"></use></svg>';
          l1Link.after(l1ToggleBtn);
        }
        l1ToggleBtn.setAttribute('aria-expanded', 'false');

        l1ToggleBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isExpanded = l1ToggleBtn.getAttribute('aria-expanded') === 'true';

          // Close other L1s within the same L0 mega menu
          l0Item.querySelectorAll('.header-dropdown-l1 > li.has-nested-dropdown > button[aria-expanded="true"]').forEach(otherL1Btn => {
            if (otherL1Btn !== l1ToggleBtn) {
              otherL1Btn.setAttribute('aria-expanded', 'false');
              otherL1Btn.closest('li.has-nested-dropdown')?.querySelector('ul.header-dropdown-l2')?.setAttribute('aria-hidden', 'true');
              otherL1Btn.closest('li.has-nested-dropdown')?.classList.remove('is-open');
            }
          });

          l1ToggleBtn.setAttribute('aria-expanded', !isExpanded);
          l2Ul.setAttribute('aria-hidden', isExpanded);
          l1Item.classList.toggle('is-open', !isExpanded);
        };
      });
    });
  }

  // Hamburger menu toggle for mobile
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open', !isExpanded);
      document.body.classList.toggle('overflow-hidden', !isExpanded); // Lock body scroll
      mobileOverlay.classList.toggle('is-open', !isExpanded);
      header.classList.toggle('mobile-menu-active', !isExpanded); // Add class to header for styling

      if (isExpanded) {
        // Closing the menu, reset all dropdowns
        closeAllDropdowns(headerNav);
      }
    });

    mobileOverlay.addEventListener('click', () => {
      if (document.body.classList.contains('nav-open')) {
        hamburgerBtn.click(); // Simulate click to close
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        hamburgerBtn.click();
      }
    });

  }

  // Initial setup based on screen size and media query change listener
  function onMediaChange(e) {
    // Clean up all existing dynamic event listeners first (for idempotency)
    headerNav.querySelectorAll('.header-nav-l0-item.has-dropdown').forEach(l0Item => {
        l0Item.onmouseenter = null;
        l0Item.onmouseleave = null;
        l0Item.querySelectorAll('.header-dropdown-l1 > li.has-nested-dropdown').forEach(l1Item => {
            l1Item.onmouseenter = null;
            l1Item.onmouseleave = null;
        });
    });
    headerNav.querySelectorAll('.header-mobile-dropdown-toggle').forEach(btn => {
        btn.onclick = null; // Clear click handlers
    });

    // Remove old mobile toggle buttons before re-setup
    header.querySelectorAll('.header-mobile-dropdown-toggle').forEach(btn => btn.remove());

    if (e.matches) { // Desktop
      setupDesktopInteractions();
      document.body.classList.remove('nav-open', 'overflow-hidden');
      mobileOverlay.classList.remove('is-open');
      header.classList.remove('mobile-menu-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      closeAllDropdowns(headerNav); // Ensure all mobile menus are closed
    } else { // Mobile
      setupMobileInteractions();
      closeAllDropdowns(); // Close desktop menus
    }
  }

  mediaQuery.addEventListener('change', onMediaChange);
  onMediaChange(mediaQuery); // Initial call on page load
}
