import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)'); // Adjusted to 992px based on CSS media queries

const CHEVRON_SVG = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
const SEARCH_LENS_SVG = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
const SEARCH_CLOSE_SVG = '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
const MAIL_SVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
const SUBMIT_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';

function moveInstrumentation(originalElement, newElement) {
  if (originalElement && newElement) {
    const dataOnce = originalElement.getAttribute('data-once');
    if (dataOnce) {
      newElement.setAttribute('data-once', dataOnce);
    }
  }
}

function closeAllMenus(nav, navSections) {
  if (!nav || !navSections) return;
  navSections.querySelectorAll('.has-child.active').forEach((section) => {
    section.classList.remove('active');
    section.setAttribute('aria-expanded', 'false');
    const megaMenu = section.querySelector('.mega-menu');
    if (megaMenu) megaMenu.classList.remove('active');
  });
  navSections.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach((sub) => {
    sub.classList.remove('active', 'active-child');
    sub.setAttribute('aria-expanded', 'false');
  });
  const searchScreen = nav.querySelector('.search-screen-wrap');
  if (searchScreen && searchScreen.classList.contains('active')) {
    searchScreen.classList.remove('active');
    searchScreen.setAttribute('aria-expanded', 'false');
    const searchIcon = nav.querySelector('.search .lens');
    const closeIcon = nav.querySelector('.search .close');
    if (searchIcon) searchIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  }
}

function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;
  const expanded = forceExpanded !== null ? !forceExpanded : nav.classList.contains('active');
  const hamburger = nav.querySelector('.hamburger');
  const navElement = nav.querySelector('.main-nav');

  if (!hamburger || !navElement) return;

  if (expanded) {
    nav.classList.remove('active');
    navElement.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('disable-scroll');
    nav.setAttribute('aria-expanded', 'false');
  } else {
    nav.classList.add('active');
    navElement.classList.add('active');
hamburger.classList.add('active');
    document.body.classList.add('disable-scroll');
    nav.setAttribute('aria-expanded', 'true');
  }
  closeAllMenus(nav, navElement); // Close all sub-menus when main menu is toggled
}

function setupMobileNavInteraction(nav, navSections) {
  if (!nav || !navSections) return;

  navSections.querySelectorAll('.has-child').forEach((navSection) => {
    const trigger = navSection.querySelector('a') || navSection.querySelector('strong');
    const chevron = navSection.querySelector('span svg');
    const megaMenu = navSection.querySelector('.mega-menu');

    if (trigger && chevron && megaMenu) {
      const toggleMenuSection = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate parent closing

        const isActive = navSection.classList.contains('active');
        // Close other top-level menus
        navSections.querySelectorAll('.has-child.active').forEach((otherSection) => {
          if (otherSection !== navSection) {
            otherSection.classList.remove('active');
            otherSection.setAttribute('aria-expanded', 'false');
            const otherMegaMenu = otherSection.querySelector('.mega-menu');
            if (otherMegaMenu) otherMegaMenu.classList.remove('active');
            otherSection.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach((sub) => {
              sub.classList.remove('active', 'active-child');
              sub.setAttribute('aria-expanded', 'false');
            });
          }
        });

        navSection.classList.toggle('active', !isActive);
        megaMenu.classList.toggle('active', !isActive);
        navSection.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      };

      // Attach listener to the chevron/span for mobile
      if (chevron.parentElement) {
        chevron.parentElement.addEventListener('click', toggleMenuSection);
      } else {
        trigger.addEventListener('click', toggleMenuSection);
      }
    }

    // Handle nested sub-menus (L2, L3, etc.)
    navSection.querySelectorAll('li.top-level-li, li.first-level-li').forEach((subMenuItem) => {
      const subMenuTrigger = subMenuItem.querySelector('a') || subMenuItem.querySelector('strong');
      const subMenuChevron = subMenuItem.querySelector('span svg');
      const nestedMenu = subMenuItem.querySelector('.has-sub-child') || subMenuItem.querySelector('.has-inner-sub-child');

      if (subMenuTrigger && subMenuChevron && nestedMenu) {
        const toggleNestedMenu = (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent parent menu from closing

          const isActive = nestedMenu.classList.contains('active') || nestedMenu.classList.contains('active-child');

          // Close other sibling nested menus
          const parentUl = subMenuItem.closest('ul');
          if (parentUl) {
            parentUl.querySelectorAll('.has-sub-child.active, .has-inner-sub-child.active-child').forEach((otherNested) => {
              if (otherNested !== nestedMenu) {
                otherNested.classList.remove('active', 'active-child');
                otherNested.setAttribute('aria-expanded', 'false');
                const otherChevron = otherNested.closest('li').querySelector('span svg');
                if (otherChevron) otherChevron.style.transform = 'rotate(90deg)';
              }
            });
          }

          if (nestedMenu.classList.contains('has-sub-child')) {
            nestedMenu.classList.toggle('active', !isActive);
          } else if (nestedMenu.classList.contains('has-inner-sub-child')) {
            nestedMenu.classList.toggle('active-child', !isActive);
          }
          subMenuItem.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
          subMenuChevron.style.transform = !isActive ? 'rotate(-180deg)' : 'rotate(90deg)';
        };
        if (subMenuChevron.parentElement) {
          subMenuChevron.parentElement.addEventListener('click', toggleNestedMenu);
        } else {
          subMenuTrigger.addEventListener('click', toggleNestedMenu);
        }
      }
    });
  });
}

function setupSearchToggle(block) {
  if (!block) return;
  const searchLiDesktop = block.querySelector('.desktop-menus-icon .search');
  const searchLiMobile = block.querySelector('.mobile-menus-icon .search');
  const searchScreenWrap = block.querySelector('.search-screen-wrap');

  if (!searchScreenWrap) return;

  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up and closing other elements

    const isActive = searchScreenWrap.classList.contains('active');
    searchScreenWrap.classList.toggle('active', !isActive);
    searchScreenWrap.setAttribute('aria-expanded', !isActive ? 'true' : 'false');

    const searchLens = block.querySelectorAll('.search .lens');
    const searchClose = block.querySelectorAll('.search .close');

    searchLens.forEach(icon => icon.style.display = isActive ? 'block' : 'none');
    searchClose.forEach(icon => icon.style.display = isActive ? 'none' : 'block');

    // Close all other menus when search is opened
    if (!isActive) {
      const nav = block.querySelector('nav');
      const navSections = nav.querySelector('.main-nav ul'); // Target the ul inside nav
      closeAllMenus(nav, navSections);
      toggleMobileMenu(nav, false); // Ensure mobile nav is closed
    }
  };

  if (searchLiDesktop) {
    const searchLink = searchLiDesktop.querySelector('a');
    if (searchLink) searchLink.addEventListener('click', toggleSearch);
  }
  if (searchLiMobile) {
    const searchLink = searchLiMobile.querySelector('a');
    if (searchLink) searchLink.addEventListener('click', toggleSearch);
  }

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target) && searchScreenWrap.classList.contains('active')) {
      searchScreenWrap.classList.remove('active');
      searchScreenWrap.setAttribute('aria-expanded', 'false');
      const searchLens = block.querySelectorAll('.search .lens');
      const searchClose = block.querySelectorAll('.search .close');
      searchLens.forEach(icon => icon.style.display = 'block');
      searchClose.forEach(icon => icon.style.display = 'none');
    }
  });

  // Stop propagation for elements inside search screen to prevent immediate closing
  searchScreenWrap.querySelectorAll('[data-once="search-stop-propagation"]').forEach((el) => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });
}

export default async function decorate(block) {
  // Add root classes from original header
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  moveInstrumentation(block, block); // Move instrumentation from original block

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  const headerFragment = document.createDocumentFragment();

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  headerFragment.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Section 1: Brand (Logo)
  const brandSection = fragment.children[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    moveInstrumentation(brandSection, logoDiv);

    const pElement = brandSection.querySelector('p');
    const aElement = pElement ? pElement.querySelector('a') : null;
    const pictureElement = pElement ? pElement.querySelector('picture') : null;

    if (aElement && pictureElement) {
      const newA = document.createElement('a');
      newA.href = aElement.href;
      moveInstrumentation(aElement, newA);

      const img = pictureElement.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        newImg.title = img.title || '';
        newImg.width = img.width || '200';
        newImg.height = img.height || '30';
        newImg.loading = img.loading || 'lazy';
        newImg.classList.add('hiddenlogo1');
        newA.append(newImg);
        moveInstrumentation(img, newImg);
      }
      logoDiv.append(newA);
    }
    wrapDiv.append(logoDiv);
  }

  // Hamburger for mobile
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  hamburgerDiv.innerHTML = '<ul><li></li><li></li><li></li></ul>';
  wrapDiv.append(hamburgerDiv);

  // Main Navigation
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  wrapDiv.append(navElement);

  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.append(mainUl);

  const navSection = fragment.children[1]; // Section 2: Nav
  if (navSection) {
    let contentBuffer = [];
    Array.from(navSection.children).forEach((child) => {
      if (child.nodeType === 1 && child.tagName === 'P') {
        contentBuffer.push(child);
      } else if (child.nodeType === 1 && child.tagName === 'UL') {
        const li = document.createElement('li');
        li.classList.add('has-child', 'hover-red');
        li.setAttribute('itemprop', 'name');
        li.setAttribute('data-once', 'nav-close-search');

        const pLink = contentBuffer.find((el) => el.querySelector('a'));
        const strongTrigger = child.querySelector('strong'); // Check for strong tag as a trigger

        let primaryLink = null;
        if (pLink) {
          primaryLink = pLink.querySelector('a');
        } else if (strongTrigger) {
          primaryLink = document.createElement('a');
          primaryLink.href = '#'; // Strong tags typically don't have hrefs
          primaryLink.textContent = strongTrigger.textContent;
        }

        if (primaryLink) {
          const navLink = document.createElement('a');
          navLink.href = primaryLink.href;
          navLink.textContent = primaryLink.textContent;
          navLink.setAttribute('itemprop', 'url');
          li.append(navLink);
          moveInstrumentation(primaryLink, navLink);
        }

        const chevronSpan = document.createElement('span');
        chevronSpan.innerHTML = CHEVRON_SVG;
        li.append(chevronSpan);

        const megaMenuDiv = document.createElement('div');
        megaMenuDiv.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        megaMenuWrap.append(centerDiv);
        megaMenuDiv.append(megaMenuWrap);

        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        // Add specific classes based on parent menu title
        const titleText = primaryLink ? primaryLink.textContent.toLowerCase() : '';
        if (titleText.includes('investor relations')) leftDiv.classList.add('ir-left-div');
        if (titleText.includes('newsroom')) leftDiv.classList.add('newsroom-left-div');
        if (titleText.includes('careers')) leftDiv.classList.add('career-left-div');

        // Flush buffer into left-div
        if (contentBuffer.length > 0) {
          const heading = contentBuffer.find((el) => el.querySelector('a'));
          if (heading) {
            const h4 = document.createElement('h4');
            h4.classList.add('left-div-heading');
            const h4Link = document.createElement('a');
            h4Link.href = heading.querySelector('a').href;
            h4Link.textContent = heading.querySelector('a').textContent;
            h4.append(h4Link);
            leftDiv.append(h4);
            moveInstrumentation(heading, h4);
          }
          contentBuffer.filter((el) => !el.querySelector('a')).forEach((el) => {
            const clonedEl = el.cloneNode(true);
            if (clonedEl.textContent.includes('#')) { // Heuristic for subdesc
              clonedEl.classList.add('left-div-subdesc');
            } else if (clonedEl.textContent.includes('Drive positive change') || clonedEl.textContent.includes('Group Highlights')) { // Heuristic for desc
              clonedEl.classList.add('left-div-desc');
            }
            leftDiv.append(clonedEl);
            moveInstrumentation(el, clonedEl);
          });
          // Check for ULs in buffer (e.g., Key Facts in "What we do")
          const bufferUl = contentBuffer.find((el) => el.tagName === 'UL');
          if (bufferUl) {
            const newUl = bufferUl.cloneNode(true);
            newUl.querySelectorAll('li').forEach(liItem => liItem.classList.add('list-text-red'));
            leftDiv.append(newUl);
            moveInstrumentation(bufferUl, newUl);
          }
        }
        centerDiv.append(leftDiv);

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        // Add specific classes based on parent menu title
        if (titleText.includes('who we are')) subNavWrap.classList.add('about-us-sub-nav');
        if (titleText.includes('what we do')) subNavWrap.classList.add('what-we-do');
        if (titleText.includes('investor relations')) subNavWrap.classList.add('element-block');
        if (titleText.includes('careers')) subNavWrap.classList.add('careers-div');

        // Recursive function to build nested ULs
        const buildNestedMenu = (sourceUl, targetParent) => {
          const newUl = document.createElement('ul');
          if (sourceUl.previousElementSibling && sourceUl.previousElementSibling.tagName === 'A' && sourceUl.previousElementSibling.textContent.includes('Disclosures')) {
            newUl.classList.add('sub-nav-wrap-one-link');
          } else if (sourceUl.previousElementSibling && sourceUl.previousElementSibling.tagName === 'DIV' && sourceUl.previousElementSibling.classList.contains('inner-sub-nav-wrap-list')) {
            newUl.classList.add('inner-sub-nav-wrap-list');
          }
          Array.from(sourceUl.children).forEach((sourceLi) => {
            const newLi = document.createElement('li');
            moveInstrumentation(sourceLi, newLi);

            const liLink = sourceLi.querySelector('a');
            const liStrong = sourceLi.querySelector('strong');
            let currentLink = null;

            if (liLink) {
              currentLink = document.createElement('a');
              currentLink.href = liLink.href;
              currentLink.textContent = liLink.textContent;
              if (liLink.target) currentLink.target = liLink.target;
              newLi.append(currentLink);
              moveInstrumentation(liLink, currentLink);
            } else if (liStrong) {
              currentLink = document.createElement('a');
              currentLink.href = '#'; // Strong tags typically don't have hrefs
              currentLink.textContent = liStrong.textContent;
              newLi.append(currentLink);
              moveInstrumentation(liStrong, currentLink);
            }

            const nestedUl = sourceLi.querySelector('ul');
            if (nestedUl) {
              newLi.classList.add('top-level-li'); // Add class for L2 items
              if (currentLink) {
                const nestedChevronSpan = document.createElement('span');
                nestedChevronSpan.innerHTML = CHEVRON_SVG;
                newLi.append(nestedChevronSpan);
              }

              const nestedDiv = document.createElement('div');
              if (newLi.closest('.has-sub-child')) {
                nestedDiv.classList.add('has-inner-sub-child');
              } else {
                nestedDiv.classList.add('has-sub-child');
              }
              buildNestedMenu(nestedUl, nestedDiv);
              newLi.append(nestedDiv);
            } else if (currentLink) {
              newLi.classList.add('first-level-li'); // Add class for L3 items without further nesting
            }
            newUl.append(newLi);
          });
          targetParent.append(newUl);
        };

        buildNestedMenu(child, subNavWrap);
        centerDiv.append(subNavWrap);
        li.append(megaMenuDiv);
        mainUl.append(li);
        contentBuffer = []; // Clear buffer after processing a main nav item
      } else if (child.nodeType === 1 && child.tagName !== 'UL') {
        contentBuffer.push(child);
      }
    });
  }

  // Section 3: Tools (Icons & Search)
  const toolsSection = fragment.children[2];
  if (toolsSection) {
    // Mobile Tools
    const mobileIconNav = document.createElement('div');
    mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
    const mobileUl = document.createElement('ul');
    mobileIconNav.append(mobileUl);

    const mobileMailLi = document.createElement('li');
    mobileMailLi.classList.add('mail');
    const mobileMailLink = document.createElement('a');
    const contactUsLink = toolsSection.querySelector('a[href*="contact-us"]');
    if (contactUsLink) {
      mobileMailLink.href = contactUsLink.href;
      mobileMailLink.textContent = contactUsLink.textContent; // Get text content dynamically
      mobileMailLi.append(mobileMailLink);
      mobileUl.append(mobileMailLi);
      moveInstrumentation(contactUsLink, mobileMailLink);
    }

    const mobileSearchLi = document.createElement('li');
    mobileSearchLi.classList.add('search');
    mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const mobileSearchLink = document.createElement('a');
    mobileSearchLink.href = '#';
    mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
    mobileSearchLink.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG + '<span data-once="search-stop-propagation"> Search</span>';
    mobileSearchLi.append(mobileSearchLink);
    mobileUl.append(mobileSearchLi);
    mainUl.append(mobileIconNav); // Append mobile tools inside mainUl for mobile view structure

    // Desktop Tools
    const desktopIconNav = document.createElement('div');
    desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
    const desktopUl = document.createElement('ul');
    desktopIconNav.append(desktopUl);

    const desktopMailLi = document.createElement('li');
    desktopMailLi.classList.add('mail');
    const desktopMailLink = document.createElement('a');
    if (contactUsLink) {
      desktopMailLink.href = contactUsLink.href;
      desktopMailLink.innerHTML = MAIL_SVG;
      desktopMailLi.append(desktopMailLink);
      desktopUl.append(desktopMailLi);
      moveInstrumentation(contactUsLink, desktopMailLink);
    }

    const desktopSearchLi = document.createElement('li');
    desktopSearchLi.classList.add('search');
    desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const desktopSearchLink = document.createElement('a');
    desktopSearchLink.href = '#';
    desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
    desktopSearchLink.innerHTML = SEARCH_LENS_SVG + SEARCH_CLOSE_SVG;
    desktopSearchLi.append(desktopSearchLink);
    desktopUl.append(desktopSearchLi);
    navElement.append(desktopIconNav); // Append desktop tools to navElement

    // Search Screen Wrap (common for both mobile/desktop)
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.setAttribute('aria-expanded', 'false'); // Add aria-expanded
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    searchIconDiv.innerHTML = SEARCH_LENS_SVG;
    searchInputWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    submitButton.innerHTML = '<div class="label" data-once="search-stop-propagation"> Submit </div>' + SUBMIT_ARROW_SVG;
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.innerHTML = `
      <div class="swiper scrollSwiper" data-once="search-stop-propagation">
        <div class="swiper-wrapper" data-once="search-stop-propagation">
          <div class="swiper-slide" data-once="search-stop-propagation"></div>
        </div>
      </div>
      <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
    `;
    searchForm.append(searchResultBox);

    const popularKeywordsDiv = document.createElement('div');
    popularKeywordsDiv.classList.add('search-suggestions-wrap');
    popularKeywordsDiv.setAttribute('data-once', 'search-stop-propagation');
    popularKeywordsDiv.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Business</li>
          <li data-once="search-stop-propagation">FY 21</li>
          <li data-once="search-stop-propagation">Brands</li>
          <li data-once="search-stop-propagation">XUV700</li>
          <li data-once="search-stop-propagation">Global</li>
          <li data-once="search-stop-propagation">Nanhi Kali</li>
        </ul>
      </div>
    `;
    searchWrapInner.append(popularKeywordsDiv);

    const recommendedKeywordsDiv = document.createElement('div');
    recommendedKeywordsDiv.classList.add('search-suggestions-wrap');
    recommendedKeywordsDiv.setAttribute('data-once', 'search-stop-propagation');
    recommendedKeywordsDiv.innerHTML = `
      <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
      <div class="tokens-wrap" data-once="search-stop-propagation">
        <ul data-once="search-stop-propagation">
          <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
          <li data-once="search-stop-propagation">Leadership Announcement</li>
          <li data-once="search-stop-propagation">Latest Press Release</li>
          <li data-once="search-stop-propagation">Brand Guidelines</li>
        </ul>
      </div>
    `;
    searchWrapInner.append(recommendedKeywordsDiv);

    // Append search screen wrap to the block, at the same level as the container div
    block.append(searchScreenWrap);
  }

  // Add the 80-year logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  const year80Img = document.createElement('img');
  year80Img.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.width = '74';
  year80Img.height = '60';
  year80Img.loading = 'lazy';
  year80Link.append(year80Img);
  year80LogoDiv.append(year80Link);
  wrapDiv.append(year80LogoDiv);

  block.append(headerFragment);

  // Event Listeners
  hamburgerDiv.addEventListener('click', () => toggleMobileMenu(block, null));

  // Close nav when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (!isDesktop.matches && block.classList.contains('active') && !block.contains(e.target)) {
      toggleMobileMenu(block, false);
    }
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nav = block.querySelector('nav');
      const navSections = nav.querySelector('.main-nav ul');
      closeAllMenus(nav, navSections);
      toggleMobileMenu(nav, false); // Ensure mobile nav is closed
    }
  });

  // Setup mobile nav interaction for sub-menus
  setupMobileNavInteraction(block, mainUl);

  // Setup search toggle functionality
  setupSearchToggle(block);

  // Initial state for mobile/desktop
  const handleResize = () => {
    if (isDesktop.matches) {
      block.classList.remove('active');
      navElement.classList.remove('active');
      hamburgerDiv.classList.remove('active');
      document.body.classList.remove('disable-scroll');
      block.setAttribute('aria-expanded', 'false');
      closeAllMenus(block, mainUl); // Ensure all sub-menus are closed on desktop transition
    } else {
      // On mobile, ensure desktop hover states are cleared
      mainUl.querySelectorAll('.has-child.hover-red').forEach(li => li.classList.remove('hover-red'));
    }
  };

  isDesktop.addEventListener('change', handleResize);
  handleResize(); // Set initial state
}
