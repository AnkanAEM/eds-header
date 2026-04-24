import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const mainNav = nav.querySelector('.main-nav');
    if (!mainNav) return;

    const navSectionExpanded = mainNav.querySelector('li[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.setAttribute('aria-expanded', 'false');
      const megaMenu = navSectionExpanded.querySelector('.mega-menu');
      if (megaMenu) megaMenu.style.display = 'none';
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, mainNav.querySelector('ul'), false);
      const hamburger = nav.querySelector('.hamburger');
      if (hamburger) hamburger.focus();
    }

    const searchScreen = nav.querySelector('.search-screen-wrap');
    if (searchScreen && searchScreen.classList.contains('active')) {
      searchScreen.classList.remove('active');
      document.body.classList.remove('no-scroll');
      const searchToggle = nav.querySelector('.search');
      if (searchToggle) {
        searchToggle.classList.remove('active');
        const lens = searchToggle.querySelector('.lens');
        const close = searchToggle.querySelector('.close');
        if (lens) lens.style.display = 'block';
        if (close) close.style.display = 'none';
      }
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const mainNav = nav.querySelector('.main-nav');
    if (!mainNav) return;

    const navSectionExpanded = mainNav.querySelector('li[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.setAttribute('aria-expanded', 'false');
      const megaMenu = navSectionExpanded.querySelector('.mega-menu');
      if (megaMenu) megaMenu.style.display = 'none';
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, mainNav.querySelector('ul'), false);
    }
  }
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.hamburger');
  if (!hamburger) return;

  document.body.classList.toggle('no-scroll', expanded && !isDesktop.matches);
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');

  // Toggle hamburger state
  hamburger.classList.toggle('active', expanded);

  // Close all expanded sections on menu close
  if (!expanded) {
    navSections.querySelectorAll('li[aria-expanded="true"]').forEach((section) => {
      section.setAttribute('aria-expanded', 'false');
      const megaMenu = section.querySelector('.mega-menu');
      if (megaMenu) megaMenu.style.display = 'none';
    });
  }

  // enable menu collapse on escape keypress
  if (expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function setupAccessibility(nav) {
  if (!nav) return;
  nav.querySelectorAll('.main-nav > ul > li.has-child').forEach((li) => {
    const link = li.querySelector(':scope > a');
    if (link) {
      li.setAttribute('role', 'button'); // Role on the list item
      li.setAttribute('aria-expanded', 'false');
      li.setAttribute('aria-controls', `nav-menu-${link.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      li.querySelector('.mega-menu')?.setAttribute('id', `nav-menu-${link.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    }
  });
}

function setupMobileNav(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((li) => {
    const chevron = li.querySelector(':scope > span svg');
    const megaMenu = li.querySelector('.mega-menu');

    if (chevron) {
      chevron.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', !expanded);
        if (megaMenu) megaMenu.style.display = expanded ? 'none' : 'block';
      });
    }

    li.querySelectorAll('.has-sub-child').forEach((subLi) => {
      const subChevron = subLi.querySelector(':scope > span svg');
      const innerSubChild = subLi.querySelector('.has-inner-sub-child');

      if (subChevron) {
        subChevron.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const expanded = subLi.classList.contains('active');
          subLi.classList.toggle('active', !expanded);
          if (innerSubChild) innerSubChild.classList.toggle('active-child', !expanded);
        });
      }
    });
  });
}

function setupDesktopNav(nav) {
  if (!nav) return;
  const navSections = nav.querySelector('.main-nav > ul');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');

    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        li.setAttribute('aria-expanded', 'true');
        if (megaMenu) megaMenu.style.display = 'block';
      }
    });

    li.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        li.setAttribute('aria-expanded', 'false');
        if (megaMenu) megaMenu.style.display = 'none';
      }
    });

    // Handle nested dropdowns
    li.querySelectorAll('.has-sub-child').forEach((subLi) => {
      const innerSubChild = subLi.querySelector('.has-inner-sub-child');

      subLi.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          subLi.classList.add('active');
          if (innerSubChild) innerSubChild.classList.add('active-child');
        }
      });

      subLi.addEventListener('mouseleave', () => {
        if (isDesktop.matches) {
          subLi.classList.remove('active');
          if (innerSubChild) innerSubChild.classList.remove('active-child');
        }
      });
    });
  });
}

async function parseStructure(nav) {
  if (!nav) return null;

  const mainHeader = document.createElement('header');
  mainHeader.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');

  const container = document.createElement('div');
  container.classList.add('container');
  mainHeader.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Brand section
  const navBrand = nav.querySelector('div:has(p > picture)');
  if (navBrand) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const img = navBrand.querySelector('img');
    const link = navBrand.querySelector('a'); // Get the actual link from the fragment
    if (link && img) {
      link.innerHTML = ''; // Clear existing content to append only img
      link.append(img);
      img.setAttribute('alt', img.getAttribute('alt') || 'Brand Logo');
      img.setAttribute('title', img.getAttribute('title') || 'Brand Logo');
      img.classList.add('hiddenlogo1');
      logoDiv.append(link);
    } else if (img) { // Fallback if no link in fragment, but still prefer fragment's link
      const fallbackLink = document.createElement('a');
      fallbackLink.href = '/';
      fallbackLink.append(img);
      img.setAttribute('alt', img.getAttribute('alt') || 'Brand Logo');
      img.setAttribute('title', img.getAttribute('title') || 'Brand Logo');
      img.classList.add('hiddenlogo1');
      logoDiv.append(fallbackLink);
    }
    wrap.append(logoDiv);
  }

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrap.append(hamburger);

  // Main navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  mainNav.setAttribute('aria-expanded', 'false'); // Initial state for accessibility
  wrap.append(mainNav);

  const navSectionsFragment = nav.querySelector('div:has(p > a[href="#"])'); // Find the section containing placeholder buttons
  if (navSectionsFragment) {
    const navUl = document.createElement('ul');
    navUl.setAttribute('itemscope', '');
    navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
    mainNav.append(navUl);

    let currentLi = null;
    let leftDivContentBuffer = [];

    Array.from(navSectionsFragment.children).forEach((child) => {
      // If it's a paragraph with a '#' link, it's a main nav item
      const link = child.querySelector('a');
      if (child.tagName === 'P' && link && link.getAttribute('href') === '#') {
        if (currentLi && leftDivContentBuffer.length > 0) {
          const megaMenuWrap = currentLi.querySelector('.mega-menu .wrap.container');
          if (megaMenuWrap) {
            const centerDiv = megaMenuWrap.querySelector('.center-div');
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const sanitizedTitle = currentLi.querySelector('a').textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            leftDiv.classList.add(`${sanitizedTitle}-left-div`);
            leftDivContentBuffer.forEach((content) => leftDiv.append(content));
            centerDiv.prepend(leftDiv); // Prepend to maintain order
          }
          leftDivContentBuffer = [];
        }

        currentLi = document.createElement('li');
        currentLi.classList.add('has-child', 'hover-red');
        currentLi.setAttribute('itemprop', 'name');

        const mainLink = document.createElement('a');
        mainLink.setAttribute('itemprop', 'url');
        mainLink.href = link.href;
        mainLink.textContent = link.textContent;
        currentLi.append(mainLink);

        const chevronSpan = document.createElement('span');
        chevronSpan.innerHTML = CHEVRON_SVG;
        currentLi.append(chevronSpan);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        currentLi.append(megaMenu);

        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        megaMenu.append(megaMenuWrap);

        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        centerDiv.append(subNavWrap);

        navUl.append(currentLi);
      } else if (child.tagName === 'UL' && currentLi) {
        // This is a sub-navigation list for the current main nav item
        const subNavWrap = currentLi.querySelector('.sub-nav-wrap');
        if (subNavWrap) {
          // Recursively process nested ULs
          const processNestedUl = (ulElement) => {
            const newUl = document.createElement('ul');
            Array.from(ulElement.children).forEach((liElement) => {
              const newLi = document.createElement('li');
              const liLink = liElement.querySelector('a');
              const nestedUl = liElement.querySelector('ul');

              if (liLink) {
                newLi.append(liLink.cloneNode(true));
              } else {
                // If no <a>, create one with text content
                const tempLink = document.createElement('a');
                tempLink.href = '#'; // Default to # if no link
                tempLink.textContent = liElement.textContent.trim();
                newLi.append(tempLink);
              }

              if (nestedUl) {
                newLi.classList.add('has-sub-child'); // Use existing class
                const subChevron = document.createElement('span');
                subChevron.innerHTML = CHEVRON_SVG;
                newLi.append(subChevron);

                const hasSubChildDiv = document.createElement('div');
                hasSubChildDiv.classList.add('has-inner-sub-child'); // Use existing class
                hasSubChildDiv.append(processNestedUl(nestedUl)); // Recurse
                newLi.append(hasSubChildDiv);
              }
              newUl.append(newLi);
            });
            return newUl;
          };
          subNavWrap.append(processNestedUl(child));
        }
      } else {
        // Collect other content (like headings, paragraphs for left-div)
        leftDivContentBuffer.push(child.cloneNode(true));
      }
    });

    // Append any remaining leftDivContentBuffer to the last main nav item
    if (currentLi && leftDivContentBuffer.length > 0) {
      const megaMenuWrap = currentLi.querySelector('.mega-menu .wrap.container');
      if (megaMenuWrap) {
        const centerDiv = megaMenuWrap.querySelector('.center-div');
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        const sanitizedTitle = currentLi.querySelector('a').textContent.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        leftDiv.classList.add(`${sanitizedTitle}-left-div`);
        leftDivContentBuffer.forEach((content) => leftDiv.append(content));
        centerDiv.prepend(leftDiv);
      }
    }
  }

  // Tools section
  const navTools = nav.querySelector('div:has(ul:has(a[title="Facebook"]))'); // Find social links
  const navUtility = nav.querySelector('div:has(ul:has(a[href*="contact-us"]))'); // Find utility links

  if (navTools || navUtility) {
    const iconNavDesktop = document.createElement('div');
    iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
    const ulDesktop = document.createElement('ul');
    iconNavDesktop.append(ulDesktop);

    const iconNavMobile = document.createElement('div');
    iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
    const ulMobile = document.createElement('ul');
    iconNavMobile.append(ulMobile);

    if (navUtility) {
      const contactUsLink = navUtility.querySelector('a[href*="contact-us"]');
      if (contactUsLink) {
        // Desktop contact link
        const contactUsLiDesktop = document.createElement('li');
        contactUsLiDesktop.classList.add('mail');
        const desktopLink = contactUsLink.cloneNode(true);
        desktopLink.innerHTML = MAIL_SVG;
        contactUsLiDesktop.append(desktopLink);
        ulDesktop.append(contactUsLiDesktop);

        // Mobile contact link
        const contactUsLiMobile = document.createElement('li');
        contactUsLiMobile.classList.add('mail');
        const mobileLink = contactUsLink.cloneNode(true);
        mobileLink.innerHTML = MAIL_SVG + '<span> Contact Us</span>'; // Mobile version has text label
        contactUsLiMobile.append(mobileLink);
        ulMobile.append(contactUsLiMobile);
      }

      const searchLink = navUtility.querySelector('a[href*="search"]');
      if (searchLink) {
        // Desktop search link
        const searchLiDesktop = document.createElement('li');
        searchLiDesktop.classList.add('search');
        const desktopSearchLink = searchLink.cloneNode(true);
        desktopSearchLink.href = '#'; // Prevent actual navigation
        desktopSearchLink.innerHTML = SEARCH_SVG + CLOSE_SVG;
        searchLiDesktop.append(desktopSearchLink);
        ulDesktop.append(searchLiDesktop);

        // Mobile search link
        const searchLiMobile = document.createElement('li');
        searchLiMobile.classList.add('search');
        const mobileSearchLink = searchLink.cloneNode(true);
        mobileSearchLink.href = '#';
        mobileSearchLink.innerHTML = SEARCH_SVG + CLOSE_SVG + '<span> Search</span>';
        searchLiMobile.append(mobileSearchLink);
        ulMobile.append(searchLiMobile);

        // Search screen (dynamic content from fragment)
        const searchScreenFragment = nav.querySelector('div:has(form#search-block-form)');
        if (searchScreenFragment) {
          const searchScreenWrap = document.createElement('div');
          searchScreenWrap.classList.add('search-screen-wrap');
          searchScreenWrap.append(searchScreenFragment.cloneNode(true));

          // Append search screen to both desktop and mobile search list items
          searchLiDesktop.append(searchScreenWrap.cloneNode(true));
          searchLiMobile.append(searchScreenWrap);
        }

        // Add event listener for search toggle
        const toggleSearch = (event) => {
          event.preventDefault();
          const targetLi = event.currentTarget.closest('li.search');
          const screen = targetLi.querySelector('.search-screen-wrap');
          if (!screen) return;

          const isActive = screen.classList.contains('active');
          screen.classList.toggle('active', !isActive);
          document.body.classList.toggle('no-scroll', !isActive);
          targetLi.classList.toggle('active', !isActive);

          const lens = targetLi.querySelector('.lens');
          const close = targetLi.querySelector('.close');
          if (lens) lens.style.display = isActive ? 'block' : 'none';
          if (close) close.style.display = isActive ? 'none' : 'block';
        };

        searchLiDesktop.querySelector('a').addEventListener('click', toggleSearch);
        searchLiMobile.querySelector('a').addEventListener('click', toggleSearch);
      }
    }
    mainNav.append(iconNavMobile);
    mainNav.append(iconNavDesktop);
  }

  // Year 80 logo
  const year80LogoFragment = nav.querySelector('div.year-80-logo');
  if (year80LogoFragment) {
    const year80LogoDiv = year80LogoFragment.cloneNode(true);
    wrap.append(year80LogoDiv);
  }

  return mainHeader;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '<p>Navigation fragment not found.</p>';
    return;
  }

  // decorate nav DOM
  block.textContent = '';

  const navElement = document.createElement('nav');
  navElement.id = 'nav';
  while (fragment.firstElementChild) navElement.append(fragment.firstElementChild);

  const header = await parseStructure(navElement); // Await parseStructure as it now loads fragment content
  if (header) {
    block.append(header);
  } else {
    block.innerHTML = '<p>Failed to parse navigation structure.</p>';
    return;
  }

  const mainNavElement = block.querySelector('.main-nav');
  if (!mainNavElement) return;

  const navSections = mainNavElement.querySelector('ul');
  if (!navSections) return;

  // Initial setup for desktop and mobile
  setupAccessibility(navElement); // Pass the main nav element for accessibility
  setupDesktopNav(navElement);
  setupMobileNav(navElement);

  // Hamburger click listener
  const hamburger = block.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(navElement, navSections));
  }

  // prevent mobile nav behavior on window resize
  toggleMenu(navElement, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(navElement, navSections, isDesktop.matches));
}
