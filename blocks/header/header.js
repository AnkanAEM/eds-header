import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Statically parse the raw HTML navigation structure once to derive correct labels
const rawHtmlNavContent = `
    <nav id="navigation-3f62f7748f" class="cmp-navigation" itemscope="" itemtype="http://schema.org/SiteNavigationElement" role="navigation">
        <ul class="cmp-navigation__group cmp-header__nav-group">
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__nav-products-click mobile-icon-our-products">
                <a href="/our-products.html" class="cmp-navigation__item-link">Our Products</a>
                <ul class="cmp-navigation__group cmp-header__product-items"></ul>
            </li>
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__no-items mobile-icon-our-story">
                <a href="/our-story.html" class="cmp-navigation__item-link">Our Story</a>
            </li>
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__no-items mobile-icon-recipes">
                <a href="/recipe-listing.html" class="cmp-navigation__item-link">Recipe</a>
            </li>
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__no-items mobile-icon-community">
                <a href="/blogs.html" class="cmp-navigation__item-link">Blogs</a>
            </li>
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__nav-products-click mobile-icon-community">
                <a href="/csr-initiatives.html" class="cmp-navigation__item-link">CSR Initiatives</a>
                <ul class="cmp-navigation__group cmp-header__product-items"></ul>
            </li>
            <li class="cmp-navigation__item cmp-navigation__item--level-0 cmp-header__nav-products cmp-header__no-items">
                <a href="/faqs.html" class="cmp-navigation__item-link">FAQs</a>
            </li>
        </ul>
        <div class="cmp-header__mobile-list">
            <ul class="cmp-header__policy">
                <li class="cmp-header__policy-list">
                    <a href="/more/contact-us.html" target="_blank">Contact us</a>
                </li>
                <li class="cmp-header__policy-list">
                    <a href="/conditions-policy/terms-of-use.html" target="_blank">Terms of use</a>
                </li>
                <li class="cmp-header__policy-list">
                    <a href="/conditions-policy/privacy-policy.html" target="_blank">Privacy Policy</a>
                </li>
            </ul>
            <div class="cmp-header__social-media">
                <a href="https://www.instagram.com/aashirvaad/" target="_blank" class="icon-instagram" data-social="instagram"></a>
                <a href="https://www.facebook.com/Aashirvaad/" target="_blank" class="icon-facebok" data-social="facebook"></a>
                <a href="https://twitter.com/AashirvaadAtta" target="_blank" class="icon-twitter" data-social="twitter"></a>
                <a href="https://www.youtube.com/user/AashirvaadAtta" target="_blank" class="icon-youtube" data-social="youtube"></a>
            </div>
        </div>
    </nav>
    <div class="cmp-header__nav-icons">
        <div class="cmp-header__search ">
            <a href="#" class="cmp-header__icon-img">
                <div class="icon-search"></div>
                <div class="cmp-header__icon-text">Search</div>
            </a>
        </div>
        <div class="cmp-header__login cmp-header__hide-icon">
            <a href="#" class="cmp-header__icon-img">
                <div class="icon-profile"></div>
            </a>
        </div>
    </div>
`;
const rawHtmlDoc = new DOMParser().parseFromString(rawHtmlNavContent, 'text/html');

function getOriginalLabel(href) {
  // Clean href to ensure a match, e.g., remove query params or hash
  const cleanedHref = href ? href.split('#')[0].split('?')[0] : '';
  // Find the exact link in the parsed raw HTML to get its text content
  const link = rawHtmlDoc.querySelector(`a[href="${cleanedHref}"]`);
  if (link && link.textContent) {
    return link.textContent.trim();
  }
  return null;
}

// Helper for creating DOM elements with optional classes and attributes
function createElement(tag, classes = [], attributes = {}) {
  const el = document.createElement(tag);
  if (classes.length > 0) {
    el.classList.add(...classes);
  }
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}

function toggleNav(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'false';
  nav.setAttribute('aria-expanded', expanded);
  document.body.classList.toggle('nav-open', expanded);
  nav.querySelector('.nav-hamburger')?.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
}

function closeAllDropdowns(container = document) {
  container.querySelectorAll('.has-dropdown[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
    li.classList.remove('active-hover'); // Remove active-hover for desktop too
  });
}

function setupDropdowns(ul, level = 0) {
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const anchor = li.querySelector(':scope > a');
    const submenu = li.querySelector(':scope > ul');

    if (submenu) {
      li.classList.add('has-dropdown');
      anchor?.setAttribute('aria-haspopup', 'true');
      li.setAttribute('aria-expanded', 'false');

      // Add chevron icon to dropdown parents
      const chevron = createElement('span', ['icon-chevron-down']);
      anchor?.appendChild(chevron);

      // Toggle dropdown on click for mobile/tablet and for desktop if not already open by hover
      anchor?.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 || !li.classList.contains('active-hover')) {
          e.preventDefault();
          e.stopPropagation();
          const isExpanded = li.getAttribute('aria-expanded') === 'true';

          // Close siblings at the same level
          Array.from(li.parentNode.children).forEach((sibling) => {
            if (sibling !== li && sibling.classList.contains('has-dropdown')) {
              sibling.setAttribute('aria-expanded', 'false');
              sibling.classList.remove('active-hover');
            }
          });

          li.setAttribute('aria-expanded', !isExpanded);
          li.classList.toggle('active-hover', !isExpanded); // Keep active-hover for visual consistency on click
        }
      });

      // Hover for desktop
      const handleMouseEnter = () => {
        if (window.innerWidth > 1024) {
          Array.from(li.parentNode.children).forEach((sibling) => {
            if (sibling !== li && sibling.classList.contains('has-dropdown')) {
              sibling.setAttribute('aria-expanded', 'false');
              sibling.classList.remove('active-hover');
            }
          });
          li.setAttribute('aria-expanded', 'true');
          li.classList.add('active-hover');
        }
      };

      const handleMouseLeave = () => {
        if (window.innerWidth > 1024) {
          // Only close if no child dropdowns are open and mouse is truly leaving
          if (!li.contains(document.activeElement) && !li.querySelector('.has-dropdown[aria-expanded="true"]')) {
            li.setAttribute('aria-expanded', 'false');
            li.classList.remove('active-hover');
          }
        }
      };

      li.addEventListener('mouseenter', handleMouseEnter);
      li.addEventListener('mouseleave', handleMouseLeave);

      setupDropdowns(submenu, level + 1); // Recurse for nested menus
    }
  });
}

export default async function decorate(block) {
  // Fetch nav content
  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return;
  }

  // Move instrumentation from fragment to block for proper tracking
  moveInstrumentation(navContent, block);

  block.textContent = ''; // Clear block content

  const headerElement = createElement('header');
  const nav = createElement('nav', ['header-nav'], { 'aria-expanded': 'false' });
  const headerWrapper = createElement('div', ['header-wrapper']);

  const navBrand = createElement('div', ['header-brand']);
  const navSections = createElement('div', ['header-sections'], { id: 'header-navigation-menu' });
  const navTools = createElement('div', ['header-tools']);

  // Hamburger Menu Button
  const menuToggle = createElement('button', ['nav-hamburger'], { 'aria-label': 'Open navigation', 'aria-controls': 'header-navigation-menu' });
  menuToggle.innerHTML = `
    <span class="nav-hamburger-icon"></span>
    <span class="nav-hamburger-icon"></span>
    <span class="nav-hamburger-icon"></span>
  `;
  menuToggle.addEventListener('click', () => toggleNav(nav));

  // --- Process navContent children to classify and restructure ---
  const mainNavUl = createElement('ul', ['header-main-nav']);
  const mobileFooterNavUl = createElement('ul', ['header-mobile-footer-nav']);
  const socialMediaLinksDiv = createElement('div', ['header-social-media']);

  Array.from(navContent.children).forEach((section) => {
    // Clean up generic AEM wrapper divs and empty paragraphs
    if (section.classList.contains('section')) {
      section.classList.remove('section');
    }
    if (section.firstElementChild?.tagName === 'DIV' && section.firstElementChild.classList.contains('default-content-wrapper')) {
      section = section.firstElementChild; // Dive into the wrapper
    }

    const img = section.querySelector('img');
    const link = section.querySelector('a');
    const p = section.querySelector('p');
    const ul = section.querySelector('ul');

    // 1. Logo Section
    if ((img || link?.querySelector('img')) && navBrand.children.length === 0) {
      const logoLink = link || createElement('a', [], { href: '/' });
      if (!logoLink.querySelector('img') && img) {
        logoLink.prepend(img);
      }
      logoLink.classList.add('header-logo');

      // Create optimized picture for logo if not already one
      const existingImg = logoLink.querySelector('img');
      if (existingImg && !existingImg.closest('picture')) {
        const optimizedPicture = createOptimizedPicture(existingImg.src, existingImg.alt, true, [{ width: '750' }]);
        logoLink.replaceChild(optimizedPicture, existingImg);
      }

      navBrand.append(logoLink);
    } else if (ul) {
      // 2. Navigation List Sections (Main Nav, Mobile Footer Nav, Social)

      const parentLi = createElement('li');
      let isMainNavParent = false;

      if (p && link) { // This structure indicates a potential L0 item with a link
        const clonedLink = link.cloneNode(true);
        // Smart Labeling: Replace generic 'Button'/'Link' text with actual labels from raw HTML
        if (['Button', 'Link'].includes(clonedLink.textContent.trim())) {
          const originalLabel = getOriginalLabel(clonedLink.href);
          if (originalLabel) {
            clonedLink.textContent = originalLabel;
          }
        }
        parentLi.append(clonedLink);
        isMainNavParent = true;
      } else if (section.textContent.trim() !== '') {
        // If there's content but not a <p><a>, might be a header for a list, e.g., 'Atta' with no link
        const headerText = createElement('span'); // Use a span if it's just text to avoid unlinked LI
        headerText.textContent = section.textContent.trim();
        parentLi.append(headerText);
        isMainNavParent = true;
      }

      if (ul) {
        const clonedUl = ul.cloneNode(true);
        // Check if this UL contains social media links
        if (clonedUl.querySelector('a[data-social]')) {
          socialMediaLinksDiv.append(clonedUl);
          isMainNavParent = false; // Not part of the main navigation
        } else if (clonedUl.querySelector('a[href*="contact"], a[href*="policy"], a[href*="terms"], a[href*="sitemap"]')) {
          mobileFooterNavUl.append(clonedUl);
          isMainNavParent = false; // Not part of the main navigation
        } else if (isMainNavParent) {
          // This is a submenu for a main nav item
          parentLi.append(clonedUl);
          mainNavUl.append(parentLi);
        } else {
          // Fallback: If it's a UL but not clear where it belongs, add to main nav as a new top-level.
          // This might happen for fragments that start directly with a UL.
          // To avoid duplicate, iterate its LIs and add them directly if no parentLi was created.
          Array.from(clonedUl.children).forEach((childLi) => {
            if (childLi.tagName === 'LI') {
              mainNavUl.append(childLi.cloneNode(true));
            }
          });
        }
      } else if (isMainNavParent) {
        // It was a P > A, but no UL followed, just a standalone top-level link
        mainNavUl.append(parentLi);
      }
    } else if (link) {
      // Catch-all for standalone links that might be tools
      const clonedLink = link.cloneNode(true);
      if (clonedLink.href === '#' && (clonedLink.textContent.toLowerCase().includes('search') || clonedLink.textContent.toLowerCase().includes('profile'))) {
        // These are tools, we will reconstruct them specifically later
      } else if (clonedLink.href.includes('instagram.com') || clonedLink.href.includes('facebook.com') || clonedLink.href.includes('twitter.com') || clonedLink.href.includes('youtube.com')) {
        socialMediaLinksDiv.append(clonedLink);
      } else if (clonedLink.href.includes('contact-us.html') || clonedLink.href.includes('terms-of-use.html') || clonedLink.href.includes('privacy-policy.html') || clonedLink.href.includes('sitemap.html')) {
        const li = createElement('li');
        li.append(clonedLink);
        mobileFooterNavUl.append(li);
      }
    }
  });

  // Append all collected main nav items to navSections
  if (mainNavUl.children.length > 0) {
    navSections.append(mainNavUl);
  }

  // Create a mobile specific container for policy and social links
  const mobileNavExtra = createElement('div', ['header-mobile-extra']);
  if (mobileFooterNavUl.children.length > 0) {
    mobileNavExtra.append(mobileFooterNavUl);
  }
  if (socialMediaLinksDiv.children.length > 0) {
    mobileNavExtra.append(socialMediaLinksDiv);
  }
  if (mobileNavExtra.children.length > 0) {
    navSections.append(mobileNavExtra); // Append to navSections to be part of the mobile slide-out
  }

  // Add hardcoded search and profile icons to navTools (replicates original site's structure)
  const searchLink = createElement('a', ['header-tool-item', 'header-search-icon'], { href: '#' });
  searchLink.innerHTML = '<span class="icon-search"></span><span class="header-tool-text">Search</span>';
  navTools.append(searchLink);

  const profileLink = createElement('a', ['header-tool-item', 'header-profile-icon'], { href: '#' });
  profileLink.innerHTML = '<span class="icon-profile"></span><span class="header-tool-text">Login</span>';
  navTools.append(profileLink);

  // Construct the final header DOM
  headerWrapper.append(navBrand);
  headerWrapper.append(menuToggle); // Hamburger button
  headerWrapper.append(navSections); // Main nav and mobile extras
  headerWrapper.append(navTools); // Search, Login icons

  nav.append(headerWrapper);
  headerElement.append(nav);
  block.append(headerElement);

  // Setup dropdown interactions
  setupDropdowns(mainNavUl);

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    const { target } = e;
    // Check if the click is outside the nav and not on a dropdown content itself
    if (!nav.contains(target) && !target.closest('.has-dropdown[aria-expanded="true"]')) {
      closeAllDropdowns();
    }

    // If clicking on a top-level nav item that is not a dropdown, close all dropdowns
    // This ensures only one dropdown or no dropdown is open at the top level
    const clickedLi = target.closest('.header-main-nav > li');
    if (clickedLi && !clickedLi.classList.contains('has-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Close dropdowns and mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      if (document.body.classList.contains('nav-open')) {
        toggleNav(nav, false);
      }
    }
  });

  // Adjust dropdowns on resize for desktop/mobile interaction changes
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      document.body.classList.remove('nav-open');
      nav.setAttribute('aria-expanded', 'false');
      closeAllDropdowns(); // Ensure all dropdowns are closed and reset on desktop resize
    }
  });
}
