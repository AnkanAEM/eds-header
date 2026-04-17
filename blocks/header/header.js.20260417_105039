import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const L1_MENU_DATA = [
  {
    "l1Label": "Term Insurance",
    "l1Href": "/term-insurance",
    "menuHtml": "<ul>\n <li>\n  <ul>\n   <li>\n    <a href=\"/term-insurance/what-is-1-crore-term-insurance\">\n     1 Crore Term Insurance\n    </a>\n   </li>\n   <li>\n    <a href=\"/term-insurance/term-insurance-tax-benefits\">\n     Term Insurance Tax Benefits\n    </a>\n   </li>\n   <li>\n    <a href=\"/tools-and-calculators/term-insurance-calculator\">\n     Term Insurance Calculator\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"/term-insurance/iselect-smart360-term-plan\">\n     iSelect Smart360 Term Plan\n    </a>\n   </li>\n   <li>\n    <a href=\"/term-insurance/young-term-plan\">\n     Young Term Plan\n    </a>\n   </li>\n   <li>\n    <a href=\"/term-insurance/term-plan-with-return-of-premium\">\n     Term Plan with Return Of Premium\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"https://buyonlineinsurance.canarahsbclife.com/youngTermPlan/?source=website\">\n     Young Term Plan\n    </a>\n   </li>\n  </ul>\n </li>\n</ul>"
  },
  {
    "l1Label": "Investment Plans",
    "l1Href": "/savings-and-investment-plans",
    "menuHtml": "<ul>\n <li>\n  <ul>\n   <li>\n    <a href=\"/ulips\">\n     ULIP Plan\n    </a>\n   </li>\n   <li>\n    <a href=\"/savings-and-investment-plans\">\n     Savings Plan\n    </a>\n   </li>\n   <li>\n    <a href=\"/retirement-plans\">\n     Retirement Plan\n    </a>\n   </li>\n   <li>\n    <a href=\"/child-insurance\">\n     Child Insurance Plan\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"/savings-and-investment-plans/promise-4-wealth\">\n     Promise4Wealth\n    </a>\n   </li>\n   <li>\n    <a href=\"/ulips/promise4growth-plus\">\n     Promise4Growth Plus\n    </a>\n   </li>\n   <li>\n    <a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">\n     iSelect Guaranteed Future Plus\n    </a>\n   </li>\n   <li>\n    <a href=\"/tools-and-calculators/investment-calculator\">\n     Investment Calculator\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"https://buyonlineinsurance.canarahsbclife.com/promise4WealthPlan/?source=website\">\n     Promise4Wealth\n    </a>\n   </li>\n  </ul>\n </li>\n</ul>"
  },
  {
    "l1Label": "All Plans",
    "l1Href": "/product-list",
    "menuHtml": "<ul>\n <li>\n  <ul>\n   <li>\n    Term Insurance\n    <ul>\n     <li>\n      <a href=\"/term-insurance/young-term-plan\">\n       Young Term Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/term-insurance/iselect-smart360-term-plan\">\n       iSelect Smart360 Term Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/term-insurance/promise2protect\">\n       Promise2Protect\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#term-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Unit Linked Insurance Plans\n    <ul>\n     <li>\n      <a href=\"/savings-and-investment-plans/promise-4-wealth\">\n       Promise4Wealth\n      </a>\n     </li>\n     <li>\n      <a href=\"/ulips/promise4growth-plus\">\n       Promise4Growth Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/ulips/secure-invest\">\n       SecureInvest\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#ulips\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Tax Saving Plan\n    <ul>\n     <li>\n      <a href=\"/term-insurance/young-term-plan\">\n       Young Term Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/term-insurance/iselect-smart360-term-plan\">\n       iSelect Smart360 Term Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/savings-and-investment-plans/iselect-guaranteed-future\">\n       iSelect Guaranteed Future\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#tax-saving-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    Retirement Plans\n    <ul>\n     <li>\n      <a href=\"/retirement-plans/legacy-builder\">\n       Legacy Builder\n      </a>\n     </li>\n     <li>\n      <a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">\n       iSelect Guaranteed Future Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/retirement-plans/ez-pension\">\n       EZ Pension\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#retirement-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Saving Plans\n    <ul>\n     <li>\n      <a href=\"/savings-and-investment-plans/incomenow\">\n       IncomeNow\n      </a>\n     </li>\n     <li>\n      <a href=\"/savings-and-investment-plans/promise4life\">\n       Promise4Life\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#savings-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Child Insurance Plans\n    <ul>\n     <li>\n      <a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">\n       iSelect Guaranteed Future Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#child-insurance-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    Insurance Riders\n    <ul>\n     <li>\n      <a href=\"https://www.canarahsbclife.com/insurance-riders/accidental-benefit-rider\">\n       Accidental Benefit Rider (Linked)\n      </a>\n     </li>\n     <li>\n      <a href=\"/insurance-riders/linked-critical-illness-benefit-rider\">\n       Linked Critical Illness Benefit Rider\n      </a>\n     </li>\n     <li>\n      <a href=\"/insurance-riders/group-critical-illness-rider\">\n       Group Critical Illness Rider\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    GIFT City\n    <ul>\n     <li>\n      <a href=\"/international/future-dollar-investment-plan\">\n       Future Dollar Investment\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Online Life Insurance\n    <ul>\n     <li>\n      <a href=\"/savings-and-investment-plans/promise-4-wealth\">\n       Promise4Wealth\n      </a>\n     </li>\n     <li>\n      <a href=\"/ulips/promise4growth-plus\">\n       Promise4Growth Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/term-insurance/young-term-plan\">\n       Young Term Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/savings-and-investment-plans/iselect-guaranteed-future-plus\">\n       iSelect Guaranteed Future Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/term-insurance/iselect-smart360-term-plan\">\n       iSelect Smart360 Term Plan\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Group Insurance Plans\n    <ul>\n     <li>\n      <a href=\"/group-insurance/group-secure-plus\">\n       Group Secure Plus\n      </a>\n     </li>\n     <li>\n      <a href=\"/group-insurance/group-secure\">\n       Group Secure Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/group-insurance/group-term-edge-plan\">\n       Group Term Edge Plan\n      </a>\n     </li>\n     <li>\n      <a href=\"/product-list#group-insurance-plans\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n  </ul>\n </li>\n</ul>"
  },
  {
    "l1Label": "Customer Service",
    "l1Href": "/customer-service",
    "menuHtml": "<ul>\n <li>\n  <ul>\n   <li>\n    Manage Policy\n    <ul>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/PremiumPayment\">\n       Pay Premium\n      </a>\n     </li>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/login\">\n       Premium Receipt\n      </a>\n     </li>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/login\">\n       Update KYC\n      </a>\n     </li>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/login\">\n       Duplicate Policy Pack\n      </a>\n     </li>\n     <li>\n      <a href=\"/funds-navs/latest-nav-history\">\n       Latest NAV\n      </a>\n     </li>\n     <li>\n      <a href=\"/content/dam/chli/pdfs/service-booklet.pdf\">\n       Service Booklet &amp; E-statements\n      </a>\n     </li>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/EnachRegistration\">\n       ENACH Registration\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Claims\n    <ul>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/ClaimsRegister\">\n       Register Claim\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service/claims#documentRequired\">\n       Claim Form\n      </a>\n     </li>\n     <li>\n      <a href=\"https://customer.canarahsbclife.com/search_claim\">\n       Claim Status\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service/claims#claimsCompanion\">\n       Get Claim Assistance\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service/claims\">\n       View All\n      </a>\n     </li>\n    </ul>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    Others\n    <ul>\n     <li>\n      <a href=\"/customer-service/track-application#trackApplication\">\n       Track Application\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service/contact-details\">\n       Contact Us\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Unclaimed Policies\n    <ul>\n     <li>\n      <a href=\"https://www.canarahsbclife.com/customer-service/claims/unclaimed-amount#unclaimedAmount\">\n       Unclaimed Amount\n      </a>\n     </li>\n     <li>\n      <a href=\"/customer-service/claims/unclaimed-amount-movement-to-senior-citizens-welfare-fund\">\n       Check unclaimed amount moved to Senior Citizen Account\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    <a href=\"/customer-service/#grievanceRedressal\">\n     Grievance Redressal\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"https://customer.canarahsbclife.com/PremiumPayment?_gl=1*a71cnb*_gcl_au*MTA2NzEyMDUxOC4xNzcwNzI4NzA4*_ga*OTQ1NzQ3MDcyLjE3NzA3MjUxNzU.*_ga_51XFB89N2W*czE3NzA3MjUxNzQkbzEkZzEkdDE3NzA3Mjg4NTAkajIkbDAkaDA.\">\n     Policy Revival Banner\n    </a>\n   </li>\n  </ul>\n </li>\n</ul>"
  },
  {
    "l1Label": "Investor Relations",
    "l1Href": "#",
    "menuHtml": "<ul>\n <li>\n  <ul>\n   <li>\n    About the Company\n    <ul>\n     <li>\n      <a href=\"/about-us/board-of-directors\">\n       Board of Directors\n      </a>\n     </li>\n     <li>\n      <a href=\"/about-us/composition-of-board-of-directors-committee\">\n       Composition of the Board Committees\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    <a href=\"/investor-relations/offer-documents\">\n     Offer Documents\n    </a>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    Financials\n    <ul>\n     <li>\n      <a href=\"/investor-relations/financials\">\n       Financial Results\n      </a>\n     </li>\n     <li>\n      <a href=\"/public-disclosures\">\n       Public Disclosure\n      </a>\n     </li>\n    </ul>\n   </li>\n   <li>\n    Information to Shareholders\n    <ul>\n     <li>\n      <a href=\"/investor-relations/information-to-shareholders/shareholder-meetings-and-voting\">\n       Shareholder Meetings &amp; Voting\n      </a>\n     </li>\n     <li>\n      <a href=\"/investor-relations/information-to-shareholders/shareholding-and-governance-information\">\n       Shareholding &amp; Governance Information\n      </a>\n     </li>\n     <li>\n      <a href=\"/investor-relations/information-to-shareholders/other-disclosures\">\n       Other Disclosures\n      </a>\n     </li>\n    </ul>\n   </li>\n  </ul>\n </li>\n <li>\n  <ul>\n   <li>\n    <a href=\"/investor-relations/policies-and-code-of-conduct\">\n     Policies and Code of Conduct\n    </a>\n   </li>\n   <li>\n    <a href=\"/investor-relations/bulletin-board\">\n     Bulletin Board\n    </a>\n   </li>\n  </ul>\n </li>\n</ul>"
  }
];

// Helper to find and apply badges (New, Price)
function applyBadges(linkElement, currentItemLabel) {
  const badgeMap = {
    "Young Term Plan": { text: "Rs. 1 Cr Life cover at @ Rs. 21/day<sup>17</sup>", isPrice: true },
    "1 Crore Term Insurance": { text: "Rs. 21/day<sup>17</sup>", isPrice: true },
    "Promise4Growth Plus": { text: "Starts @ Rs.2k /month", isPrice: true },
    "Promise4Wealth": { text: "New", isNew: true },
    "Legacy Builder": { text: "New", isNew: true },
    "Group Critical Illness Rider": { text: "New", isNew: true },
  };

  for (const label in badgeMap) {
    if (currentItemLabel.includes(label)) {
      const badgeInfo = badgeMap[label];
      const badgeSpan = document.createElement('span');
      if (badgeInfo.isPrice) {
        badgeSpan.className = 'price-badge';
        badgeSpan.innerHTML = badgeInfo.text;
      } else if (badgeInfo.isNew) {
        badgeSpan.className = 'navigation-badge';
        badgeSpan.textContent = badgeInfo.text;
      }
      linkElement.append(badgeSpan);
      break;
    }
  }
}

// Helper to parse menuHtml and build nested structure for desktop dropdown
function buildNestedMenu(container, htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // The primary structure is expected to be a top-level <ul>, where each LI corresponds to a column
  const topUl = tempDiv.querySelector('ul');
  if (topUl) {
    Array.from(topUl.children).forEach((li) => {
      const columnDiv = document.createElement('div');
      columnDiv.className = 'header-dropdown-column';

      // Iterate through direct children of the column's LI
      Array.from(li.children).forEach((child) => {
        if (child.tagName === 'UL') {
          // This UL is a group of links or sub-categories
          const subGroupUl = document.createElement('ul');
          subGroupUl.className = 'header-submenu-list';

          Array.from(child.children).forEach((subLi) => {
            const nestedUl = subLi.querySelector('ul');
            const directLink = subLi.querySelector('a');

            if (nestedUl) {
              // This is a category title with its own list of links
              const categoryTitle = document.createElement('span');
              categoryTitle.className = 'header-submenu-category-title';
              // The category title is typically the text content before the nested UL
              categoryTitle.textContent = subLi.firstChild?.textContent.trim() || '';
              subGroupUl.append(categoryTitle);

              const innerSubUl = document.createElement('ul');
              Array.from(nestedUl.children).forEach(innerLi => {
                const innerLink = innerLi.querySelector('a');
                if (innerLink) {
                  const clonedLink = innerLink.cloneNode(true);
                  // Remove any existing AEM-specific spans or badges from the cloned element
                  clonedLink.querySelector('.cmp-link__screen-reader-only')?.remove();
                  clonedLink.querySelector('.price-badge')?.remove();
                  clonedLink.querySelector('.navigation__badge')?.remove();
                  applyBadges(clonedLink, clonedLink.textContent.trim()); // Re-apply our standardized badges
                  const listItem = document.createElement('li');
                  listItem.append(clonedLink);
                  innerSubUl.append(listItem);
                }
              });
              subGroupUl.append(innerSubUl);
            } else if (directLink) {
              // A simple link within the sub-group
              const clonedLink = directLink.cloneNode(true);
              // Clean existing AEM-specific elements
              clonedLink.querySelector('.cmp-link__screen-reader-only')?.remove();
              clonedLink.querySelector('.price-badge')?.remove();
              clonedLink.querySelector('.navigation__badge')?.remove();
              applyBadges(clonedLink, clonedLink.textContent.trim()); // Re-apply our standardized badges
              const listItem = document.createElement('li');
              listItem.append(clonedLink);
              subGroupUl.append(listItem);
            } else if (subLi.textContent.trim()) {
                // Handle plain text as a sub-menu label if not a link/category title
                const textSpan = document.createElement('span');
                textSpan.className = 'header-submenu-label';
                textSpan.textContent = subLi.textContent.trim();
                subGroupUl.append(textSpan);
            }
          });
          columnDiv.append(subGroupUl);
        } else {
          // Direct elements like <a> with <picture> (seasonal banner), or simple <p> elements
          const clonedChild = child.cloneNode(true);
          // Apply badges if it's a direct anchor in a column (e.g. seasonal banner link)
          if (clonedChild.tagName === 'A') {
              clonedChild.querySelector('.cmp-link__screen-reader-only')?.remove();
              clonedChild.querySelector('.price-badge')?.remove();
              clonedChild.querySelector('.navigation__badge')?.remove();
              applyBadges(clonedChild, clonedChild.textContent.trim());
          }
          columnDiv.append(clonedChild);
        }
      });
      container.append(columnDiv);
    });
  } else {
    // Fallback if menuHtml does not start with UL, e.g., if it's just a single div element like a seasonal banner
    container.append(...tempDiv.children);
  }

  // Find and replace original AEM SVG icon containers with clean SVG elements
  container.querySelectorAll('div.sublinks__navigator--icon').forEach(iconDiv => {
    const useElement = iconDiv.querySelector('use');
    if (useElement) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('role', 'icon');
      svg.append(useElement.cloneNode(true));
      iconDiv.replaceWith(svg);
    } else {
        iconDiv.remove(); // Remove empty icon containers
    }
  });

  // Remove AEM-specific screen reader text if present (redundant, already handled for links)
  container.querySelectorAll('.cmp-link__screen-reader-only').forEach(span => span.remove());

  // If any column contains a section.seasonal__banner, give its parent column a special class
  container.querySelectorAll('section.seasonal__banner').forEach(banner => {
    banner.closest('.header-dropdown-column')?.classList.add('dropdown-column-banner');
  });

  // Clean up empty <p> tags or those with only whitespace
  container.querySelectorAll('p').forEach(p => {
    if (p.textContent.trim() === '' && !p.querySelector('img, svg, a')) {
      p.remove();
    }
  });
}

// Helper to build mobile accordion menu from L1_MENU_DATA
function buildMobileMenuContent(menuContainer) {
  menuContainer.innerHTML = ''; // Clear existing content
  const accordion = document.createElement('div');
  accordion.className = 'accordion mobile-accordion';

  L1_MENU_DATA.forEach(item => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item header__accordion--item';

    const heading = document.createElement('h2');
    heading.className = 'accordion-header header__accordion--heading';

    const button = document.createElement('button');
    button.className = 'accordion-button d-flex justify-content-between align-items-center w-100 header__accordion--button';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');

    const linkWrapper = document.createElement('div');
    linkWrapper.className = 'd-flex w-100';
    const link = document.createElement('a');
    link.className = 'd-flex w-100';
    link.href = item.l1Href;
    link.textContent = item.l1Label;
    applyBadges(link, item.l1Label);
    linkWrapper.append(link);
    button.append(linkWrapper);

    if (item.menuHtml) {
        // Add arrow icon for dropdown functionality
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'header__accordion--button header_arrow_icon';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.className = 'arrow header__accordion--arrow';
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'icon');
        const use = document.createElementNS('http://www.w3.org/1999/xlink', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#drop-up-caret');
        svg.append(use);
        arrowSpan.append(svg);
        button.append(arrowSpan);

        const collapseDiv = document.createElement('div');
        collapseDiv.className = 'accordion-collapse collapse header__accordion--collapse';
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'accordion-body header__accordion--body';

        // Reuse buildNestedMenu logic, but adapt to mobile accordion structure
        // For mobile, each top-level UL in menuHtml becomes a direct child list of the accordion body
        const tempMenuHtmlContainer = document.createElement('div');
        tempMenuHtmlContainer.innerHTML = item.menuHtml;

        Array.from(tempMenuHtmlContainer.querySelectorAll('ul')).forEach(ul => {
            const clonedUl = ul.cloneNode(true);
            clonedUl.querySelectorAll('a').forEach(anchor => {
                anchor.querySelector('.cmp-link__screen-reader-only')?.remove();
                anchor.querySelector('.price-badge')?.remove();
                anchor.querySelector('.navigation__badge')?.remove();
                applyBadges(anchor, anchor.textContent.trim());
            });
            // Flatten nested ULs for simpler mobile display
            clonedUl.querySelectorAll('ul').forEach(nestedUl => {
                Array.from(nestedUl.children).forEach(nestedLi => { clonedUl.append(nestedLi); });
                nestedUl.remove();
            });
            bodyDiv.append(clonedUl);
        });

        // Handle icons in the mobile menu (similar to desktop, replacing div with svg)
        bodyDiv.querySelectorAll('div.sublinks__navigator--icon').forEach(iconDiv => {
            const useElement = iconDiv.querySelector('use');
            if (useElement) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('role', 'icon');
            svg.append(useElement.cloneNode(true));
            iconDiv.replaceWith(svg);
            } else {
                iconDiv.remove();
            }
        });

        collapseDiv.append(bodyDiv);
        accordionItem.append(collapseDiv);
    }
    heading.append(button);
    accordionItem.append(heading);
    accordion.append(accordionItem);
  });
  menuContainer.append(accordion);
}

// Helper to setup all interactions (desktop hover, mobile click)
function setupInteractions(block) {
  const header = block.querySelector('.header');
  const desktopDropdownItems = block.querySelectorAll('.header-menu-item.has-dropdown');
  
  // Mobile menu elements (these are cloned into the block in decorate)
  const mobileNavMenu = block.querySelector('.mobile-nav-menu');
  const mobileNavOverlay = block.querySelector('.mobile-nav-overlay');
  const mobileHamburgerBtn = block.querySelector('.header__hamburger--button'); // The hamburger in header-tools
  const mobileCloseBtn = mobileNavMenu?.querySelector('.header__hamburger--close-icon'); // Close icon inside the mobile menu

  // Toggle mobile menu visibility and body scroll lock
  const toggleMobileMenu = (open) => {
    if (mobileNavMenu && mobileNavOverlay) {
      mobileNavMenu.classList.toggle('is-open', open);
      mobileNavOverlay.classList.toggle('is-open', open);
      document.body.classList.toggle('scroll-locked', open);
      if (mobileHamburgerBtn) {
        // Toggle between open and close SVG icons on the hamburger button
        mobileHamburgerBtn.querySelector('.header__hamburger--open')?.classList.toggle('hidden', open);
        mobileHamburgerBtn.querySelector('.header__hamburger--close')?.classList.toggle('hidden', !open);
        mobileHamburgerBtn.setAttribute('aria-expanded', open);
      }
    }
  };

  // Event listeners for mobile menu
  mobileHamburgerBtn?.addEventListener('click', () => toggleMobileMenu(!mobileNavMenu?.classList.contains('is-open')));
  mobileCloseBtn?.addEventListener('click', () => toggleMobileMenu(false));
  mobileNavOverlay?.addEventListener('click', () => toggleMobileMenu(false));

  // Desktop Dropdown Logic (min-width: 900px)
  const setupDesktopDropdowns = () => {
    desktopDropdownItems.forEach((item) => {
      const dropdownLink = item.querySelector('a');
      const dropdownContent = item.querySelector('.header-dropdown-content');

      if (dropdownLink && dropdownContent) {
        let timeout;

        const openDropdown = () => {
          clearTimeout(timeout);
          dropdownLink.setAttribute('aria-expanded', 'true');
          dropdownContent.setAttribute('aria-hidden', 'false');
          dropdownContent.classList.add('is-open');
          item.classList.add('is-open'); // Mark parent as open
          // Close other open L0 dropdowns
          desktopDropdownItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('is-open')) {
              const otherLink = otherItem.querySelector('a');
              const otherContent = otherItem.querySelector('.header-dropdown-content');
              otherLink?.setAttribute('aria-expanded', 'false');
              otherContent?.setAttribute('aria-hidden', 'true');
              otherContent?.classList.remove('is-open');
              otherItem.classList.remove('is-open');
            }
          });
        };

        const closeDropdown = () => {
          timeout = setTimeout(() => {
            dropdownLink.setAttribute('aria-expanded', 'false');
            dropdownContent.setAttribute('aria-hidden', 'true');
            dropdownContent.classList.remove('is-open');
            item.classList.remove('is-open');
          }, 150); // Small delay for smoother hover
        };

        item.addEventListener('mouseover', openDropdown);
        item.addEventListener('mouseleave', closeDropdown);
        dropdownContent.addEventListener('mouseover', () => clearTimeout(timeout)); // Keep open if hovering over content
        dropdownContent.addEventListener('mouseleave', closeDropdown);
      }
    });

    // Close dropdowns on outside click (desktop only)
    document.addEventListener('click', (event) => {
      if (window.innerWidth >= 900) {
        let isClickInsideHeader = header.contains(event.target);
        if (!isClickInsideHeader) {
          desktopDropdownItems.forEach(item => {
            const dropdownLink = item.querySelector('a');
            const dropdownContent = item.querySelector('.header-dropdown-content');
            if (dropdownLink?.getAttribute('aria-expanded') === 'true') {
              dropdownLink.setAttribute('aria-expanded', 'false');
              dropdownContent?.setAttribute('aria-hidden', 'true');
              dropdownContent?.classList.remove('is-open');
              item.classList.remove('is-open');
            }
          });
        }
      }
    });
  };

  // Mobile accordion logic (using raw DOM manipulation)
  const setupMobileAccordions = () => {
    mobileNavMenu?.querySelectorAll('.accordion-item')?.forEach(accordionItem => {
      const accordionButton = accordionItem.querySelector('.header__accordion--button');
      const accordionCollapse = accordionItem.querySelector('.accordion-collapse');
      const accordionArrow = accordionItem.querySelector('.header__accordion--arrow');

      accordionButton?.addEventListener('click', (e) => {
          // Check if the click was directly on the button or the link within it
          const isLinkClick = e.target.tagName === 'A' || e.target.closest('a');
          if (isLinkClick) {
              // If it's a link, let default navigation handle it, don't toggle accordion
              return;
          }

          const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';
          accordionButton.setAttribute('aria-expanded', !isExpanded);
          accordionCollapse?.classList.toggle('show', !isExpanded);
          accordionItem.classList.toggle('is-open', !isExpanded); // For visual styling
          accordionArrow?.classList.toggle('rotate-up', !isExpanded);

          // Close other open accordions at the same level
          accordionItem.closest('.accordion')?.querySelectorAll('.accordion-item.is-open').forEach(otherItem => {
              if (otherItem !== accordionItem) {
                  const otherButton = otherItem.querySelector('.header__accordion--button');
                  const otherCollapse = otherItem.querySelector('.accordion-collapse');
                  const otherArrow = otherItem.querySelector('.header__accordion--arrow');
                  otherButton?.setAttribute('aria-expanded', 'false');
                  otherCollapse?.classList.remove('show');
                  otherItem.classList.remove('is-open');
                  otherArrow?.classList.remove('rotate-up');
              }
          });
      });
    });
  };

  // Initial setup based on viewport width
  const handleResize = () => {
    if (window.innerWidth >= 900) {
      setupDesktopDropdowns();
    } else {
      // For mobile, ensure desktop dropdowns are closed
      desktopDropdownItems.forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('a')?.setAttribute('aria-expanded', 'false');
        item.querySelector('.header-dropdown-content')?.classList.remove('is-open');
        item.querySelector('.header-dropdown-content')?.setAttribute('aria-hidden', 'true');
      });
      setupMobileAccordions();
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call

  // Ensure initial state of hamburger icon based on menu state
  if (mobileHamburgerBtn && mobileNavMenu) {
    const isOpen = mobileNavMenu.classList.contains('is-open');
    mobileHamburgerBtn.querySelector('.header__hamburger--open')?.classList.toggle('hidden', isOpen);
    mobileHamburgerBtn.querySelector('.header__hamburger--close')?.classList.toggle('hidden', !isOpen);
  }
}

export default async function decorate(block) {
  const navContent = await loadFragment('/nav');
  block.innerHTML = ''; // Clear existing content for idempotency

  const header = document.createElement('header');
  header.className = 'header';
  header.setAttribute('aria-label', 'Main Navigation');

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';

  const headerBrand = document.createElement('div');
  headerBrand.className = 'header-brand';

  const headerNav = document.createElement('nav');
  headerNav.className = 'header-nav';
  headerNav.setAttribute('aria-label', 'Primary Navigation');

  const headerTools = document.createElement('div');
  headerTools.className = 'header-tools';

  headerWrapper.append(headerBrand, headerNav, headerTools);
  header.append(headerWrapper);
  block.append(header);

  // 1. Extract Logo (Brand Area) - Assuming a simple structure in plain HTML fragment
  const logoLink = navContent.querySelector('a[href="/"]');
  if (logoLink) {
    headerBrand.append(logoLink.cloneNode(true));
  } else {
    // Fallback if no specific logo link found, search for any image in first meaningful div
    const firstMeaningfulDiv = Array.from(navContent.children).find(child => child.textContent.trim() !== '');
    const fallbackLogo = firstMeaningfulDiv?.querySelector('img');
    if (fallbackLogo) {
      const link = document.createElement('a');
      link.href = '/';
      link.append(fallbackLogo.cloneNode(true));
      headerBrand.append(link);
    }
  }

  // 2. Create Main Navigation (Mega Menu) from L1_MENU_DATA
  const desktopNavList = document.createElement('ul');
  desktopNavList.className = 'header-menu-list';
  desktopNavList.setAttribute('role', 'menubar');

  L1_MENU_DATA.forEach((item) => {
    const l0Li = document.createElement('li');
    l0Li.className = 'header-menu-item';
    l0Li.setAttribute('role', 'none');

    const l0Link = document.createElement('a');
    l0Link.href = item.l1Href;
    l0Link.textContent = item.l1Label;
    l0Link.setAttribute('role', 'menuitem');
    applyBadges(l0Link, item.l1Label);

    l0Li.append(l0Link);

    if (item.menuHtml) {
      l0Li.classList.add('has-dropdown');
      l0Link.setAttribute('aria-expanded', 'false');
      l0Link.setAttribute('aria-haspopup', 'true');

      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'header-dropdown-content';
      dropdownContent.setAttribute('role', 'menu');
      dropdownContent.setAttribute('aria-hidden', 'true');
      
      buildNestedMenu(dropdownContent, item.menuHtml);
      l0Li.append(dropdownContent);
    }
    desktopNavList.append(l0Li);
  });

  headerNav.append(desktopNavList);

  // 3. Populate Tools (Dynamically create based on common icons, or extract if simple plain HTML exists)
  const toolsWrapper = document.createElement('div');
  toolsWrapper.className = 'header-tools-wrapper';

  // Search Icon (Assuming it's a utility icon, not part of main nav data)
  const searchLink = document.createElement('a');
  searchLink.href = '#'; // Or actual search page/modal trigger
  searchLink.className = 'header-tool-item header__search';
  searchLink.setAttribute('aria-label', 'Search');
  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search"></use>';
  searchLink.append(searchSvg);
  toolsWrapper.append(searchLink);

  // Notification Icon
  const notificationLink = document.createElement('a');
  notificationLink.href = '#'; // Or actual notification page/modal trigger
  notificationLink.className = 'header-tool-item header__notification--trigger';
  notificationLink.setAttribute('aria-label', 'Notifications');
  const notificationText = document.createElement('span');
  notificationText.className = 'header__notification--trigger-text';
  notificationText.textContent = '1'; // Example count
  const notificationSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  notificationSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#bell-icon"></use>';
  notificationLink.append(notificationText, notificationSvg);
  toolsWrapper.append(notificationLink);

  // Login Icon
  const loginLink = document.createElement('a');
  loginLink.href = 'https://customer.canarahsbclife.com/login';
  loginLink.target = '_blank';
  loginLink.className = 'header-tool-item header__login';
  loginLink.setAttribute('aria-label', 'Login');
  const loginSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  loginSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#user-icon"></use>';
  const loginText = document.createElement('span');
  loginText.className = 'login-text';
  loginText.textContent = 'Login';
  loginLink.append(loginSvg, loginText);
  toolsWrapper.append(loginLink);

  // Hamburger Button (for mobile)
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'header__hamburger--button';
  hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  const openSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  openSvg.className = 'header__hamburger--open';
  openSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#hamburger-icon"></use>';
  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.className = 'header__hamburger--close hidden'; // Hidden by default
  closeSvg.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>';
  hamburgerBtn.append(openSvg, closeSvg);
  toolsWrapper.append(hamburgerBtn);

  headerTools.append(toolsWrapper);

  // Create mobile menu structure (it's separate from desktop nav DOM tree)
  const mobileNavMenu = document.createElement('div');
  mobileNavMenu.className = 'mobile-nav-menu';
  mobileNavMenu.setAttribute('role', 'navigation');
  mobileNavMenu.setAttribute('aria-label', 'Mobile Navigation');
  
  // Add mobile menu header (Notifications, Close icon)
  const mobileMenuHead = document.createElement('div');
  mobileMenuHead.className = 'header__hamburger--head';
  const headTitle = document.createElement('div');
  headTitle.className = 'header__hamburger--head-title';
  headTitle.textContent = 'Notifications'; // Reusing 'Notifications' as a placeholder title as per raw HTML
  const mobileCloseIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mobileCloseIcon.className = 'arrow header__hamburger--close-icon';
  mobileCloseIcon.innerHTML = '<use xlink:href="/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close"></use>';
  mobileMenuHead.append(headTitle, mobileCloseIcon);
  mobileNavMenu.append(mobileMenuHead);

  // Build accordion menu items for mobile using L1_MENU_DATA
  buildMobileMenuContent(mobileNavMenu);
  
  block.append(mobileNavMenu);

  // Mobile overlay
  const mobileNavOverlay = document.createElement('div');
  mobileNavOverlay.className = 'mobile-nav-overlay';
  block.append(mobileNavOverlay);

  // 4. Setup Interactions
  setupInteractions(block);

  moveInstrumentation(navContent, block);
}
