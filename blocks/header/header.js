import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)'); // Adjusted breakpoint based on CSS

function moveInstrumentation(originalElement, newElement) {
  if (!originalElement || !newElement) return;
  const cqPath = originalElement.dataset.cqPath;
  if (cqPath) {
    newElement.dataset.cqPath = cqPath;
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.cmp-navigation__group.cmp-header__nav-group');
    if (!navSections) return;

    const openDropdowns = navSections.querySelectorAll('.cmp-navigation__item.is-open');
    if (openDropdowns.length > 0 && isDesktop.matches) {
      openDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        const link = dropdown.querySelector('.cmp-navigation__item-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
      // Find the last opened dropdown's trigger and focus it
      const lastOpenDropdown = openDropdowns[openDropdowns.length - 1];
      const trigger = lastOpenDropdown.querySelector('.cmp-navigation__item-link');
      if (trigger) trigger.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      const hamburger = nav.querySelector('.cmp-header__hamburger');
      if (hamburger) hamburger.focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.cmp-navigation__group.cmp-header__nav-group');
    if (!navSections) return;
    const openDropdowns = navSections.querySelectorAll('.cmp-navigation__item.is-open');
    if (openDropdowns.length > 0 && isDesktop.matches) {
      openDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        const link = dropdown.querySelector('.cmp-navigation__item-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  if (!nav || !navSections) return;

  const hamburgerInput = nav.querySelector('.cmp-header__hamburger');
  if (!hamburgerInput) return;

  const expanded = forceExpanded !== null ? forceExpanded : hamburgerInput.checked;

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  hamburgerInput.checked = expanded;
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');

  // Collapse all submenus when the main menu is closed
  if (!expanded) {
    navSections.querySelectorAll('.cmp-navigation__item.is-open').forEach((item) => {
      item.classList.remove('is-open');
      const link = item.querySelector('.cmp-navigation__item-link');
      if (link) link.setAttribute('aria-expanded', 'false');
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

function handleDropdownClick(e) {
  const listItem = e.currentTarget;
  const isMegaMenu = listItem.classList.contains('cmp-header__nav-products');
  const link = listItem.querySelector('.cmp-navigation__item-link');
  const hasSubmenu = listItem.querySelector('ul');

  if (isDesktop.matches) {
    if (isMegaMenu) {
      const currentlyOpen = listItem.classList.contains('is-open');
      // Close all other open mega menus at the same level
      listItem.closest('.cmp-navigation__group').querySelectorAll('.cmp-navigation__item.is-open').forEach((item) => {
        if (item !== listItem) {
          item.classList.remove('is-open');
          const itemLink = item.querySelector('.cmp-navigation__item-link');
          if (itemLink) itemLink.setAttribute('aria-expanded', 'false');
        }
      });
      listItem.classList.toggle('is-open', !currentlyOpen);
      if (link) link.setAttribute('aria-expanded', !currentlyOpen ? 'true' : 'false');
    }
  } else { // Mobile behavior
    if (hasSubmenu) {
      e.preventDefault(); // Prevent default link navigation for dropdowns
      const wasOpen = listItem.classList.toggle('is-open');
      if (link) link.setAttribute('aria-expanded', wasOpen ? 'true' : 'false');

      // Close other open siblings at the same level
      Array.from(listItem.parentNode.children).forEach((sibling) => {
        if (sibling !== listItem && sibling.classList.contains('is-open')) {
          sibling.classList.remove('is-open');
          const siblingLink = sibling.querySelector('.cmp-navigation__item-link');
          if (siblingLink) siblingLink.setAttribute('aria-expanded', 'false');
          // Recursively close children
          sibling.querySelectorAll('.cmp-navigation__item.is-open').forEach((childItem) => {
            childItem.classList.remove('is-open');
            const childLink = childItem.querySelector('.cmp-navigation__item-link');
            if (childLink) childLink.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }
  }
}

function createNavList(ulElement, level = 0) {
  if (!ulElement) return null;

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group');
  if (level === 0) {
    navGroup.classList.add('cmp-header__nav-group');
  } else if (level === 1) {
    navGroup.classList.add('cmp-header__product-items');
  } else if (level >= 2) {
    navGroup.classList.add('cmp-header__submenu');
  }

  Array.from(ulElement.children).forEach((li) => {
    if (li.nodeType !== Node.ELEMENT_NODE) return; // Skip non-element nodes

    const navItem = document.createElement('li');
    moveInstrumentation(li, navItem);
    navItem.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);

    let triggerElement = li.querySelector('strong');
    let linkElement = li.querySelector(':scope > a'); // Ensure direct child link
    let nestedUl = li.querySelector(':scope > div > ul'); // Nested UL is inside a div

    if (triggerElement) {
      // It's a mega-menu trigger (e.g., "Our Products" in the fragment)
      const strongText = triggerElement.textContent.trim();
      const strongWrapper = document.createElement('a');
      strongWrapper.classList.add('cmp-navigation__item-link');
      strongWrapper.textContent = strongText;
      strongWrapper.setAttribute('href', '#'); // Mega menu triggers usually don't navigate directly
      strongWrapper.setAttribute('aria-expanded', 'false');
      navItem.append(strongWrapper);

      navItem.classList.add('cmp-header__nav-products', 'cmp-header__nav-products-click');
      if (!nestedUl) {
        navItem.classList.add('cmp-header__no-items');
      }

      navItem.addEventListener('click', handleDropdownClick);

      if (nestedUl) {
        const subMenuContainer = document.createElement('div');
        subMenuContainer.classList.add('cmp-header__category-menu');
        // The original HTML has instrumentation on the div wrapping the ul
        const originalDivWrapper = li.querySelector(':scope > div');
        if (originalDivWrapper) {
          moveInstrumentation(originalDivWrapper, subMenuContainer);
        }
        subMenuContainer.append(createNavList(nestedUl, level + 1));
        navItem.append(subMenuContainer);
      }
    } else if (linkElement) {
      // It's a regular link or a link with a submenu
      const clonedLink = linkElement.cloneNode(true);
      moveInstrumentation(linkElement, clonedLink);
      clonedLink.classList.add('cmp-navigation__item-link');
      navItem.append(clonedLink);

      if (nestedUl) {
        clonedLink.setAttribute('href', '#'); // Prevent navigation for parent with submenu
        clonedLink.setAttribute('aria-expanded', 'false');
        navItem.classList.add('cmp-header__nav-products', 'cmp-header__nav-products-click'); // Treat as product menu if it has submenu
        navItem.addEventListener('click', handleDropdownClick);

        const subMenuContainer = document.createElement('div');
        subMenuContainer.classList.add('cmp-header__category-menu');
        const originalDivWrapper = li.querySelector(':scope > div');
        if (originalDivWrapper) {
          moveInstrumentation(originalDivWrapper, subMenuContainer);
        }
        subMenuContainer.append(createNavList(nestedUl, level + 1));
        navItem.append(subMenuContainer);
      } else {
        navItem.classList.add('cmp-header__no-item'); // No submenu
      }
    }

    navGroup.append(navItem);
  });

  return navGroup;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from original HTML
  block.classList.add('cmp-header');

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const navContent = document.createElement('div');
  navContent.id = 'nav';
  moveInstrumentation(fragment, navContent); // Attach instrumentation from fragment root
  while (fragment.firstElementChild) {
    navContent.append(fragment.firstElementChild);
  }

  const newBlockContent = document.createDocumentFragment();

  // Hamburger for mobile
  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  hamburgerInput.id = 'nav-hamburger-toggle'; // Add an ID for label association
  newBlockContent.append(hamburgerInput);

  // Add a label for the hamburger input for better UX
  const hamburgerLabel = document.createElement('label');
  hamburgerLabel.setAttribute('for', 'nav-hamburger-toggle');
  hamburgerLabel.classList.add('cmp-header__hamburger-label'); // Add a class for styling the icon
  hamburgerLabel.setAttribute('aria-label', 'Open navigation');
  newBlockContent.append(hamburgerLabel);


  // Section 1: Brand
  const brandSection = navContent.children[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
    const originalP = brandSection.querySelector('p');
    if (originalP) {
      moveInstrumentation(originalP, logoDiv); // Attach instrumentation from original p tag
    }

    const picture = brandSection.querySelector('picture');
    if (picture) {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-image__link');
      anchor.href = '/'; // Assuming home link
      anchor.append(picture);
      logoDiv.append(anchor);
      const originalAnchor = brandSection.querySelector('p > a');
      if (originalAnchor) {
        moveInstrumentation(originalAnchor, anchor); // Attach instrumentation from original a tag
      }

      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('cmp-image__image');
        moveInstrumentation(picture.querySelector('img'), img); // Attach instrumentation from original img tag
      }
    }
    newBlockContent.append(logoDiv);
  }

  // Section 2: Nav Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  newBlockContent.append(navLinksDiv);

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation');
  navLinksDiv.append(navigationWrapper);

  const navElement = document.createElement('nav');
  navElement.id = 'navigation-fff59bc8e9'; // Replicate ID from original
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');
  navigationWrapper.append(navElement);

  const navSection = navContent.children[1];
  if (navSection) {
    const mainNavUl = document.createElement('ul');
    mainNavUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
    navElement.append(mainNavUl);

    Array.from(navSection.children).forEach((item) => {
      if (item.tagName === 'P' && item.querySelector('a')) {
        const link = item.querySelector('a');
        const listItem = document.createElement('li');
        moveInstrumentation(item, listItem); // Attach instrumentation from original p tag
        listItem.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__no-items');

        const clonedLink = link.cloneNode(true);
        moveInstrumentation(link, clonedLink);
        clonedLink.classList.add('cmp-navigation__item-link');
        listItem.append(clonedLink);

        // Add specific mobile icons based on text content
        const linkText = clonedLink.textContent.toLowerCase().trim();
        if (linkText === 'recipes') {
          listItem.classList.add('mobile-icon-recipes');
        } else if (linkText === 'media') {
          listItem.classList.add('mobile-icon-media');
        } else if (linkText === 'about us') {
          listItem.classList.add('mobile-icon-about-us');
        }

        mainNavUl.append(listItem);
      } else if (item.tagName === 'UL') {
        const topLevelNavList = createNavList(item, 0);
        if (topLevelNavList) {
          Array.from(topLevelNavList.children).forEach((li) => {
            mainNavUl.append(li);
          });
        }
      }
    });

    // Mobile list and social media
    const mobileListDiv = document.createElement('div');
    mobileListDiv.classList.add('cmp-header__mobile-list');
    navElement.append(mobileListDiv);

    const policyUl = document.createElement('ul');
    policyUl.classList.add('cmp-header__policy');
    mobileListDiv.append(policyUl);

    // Extract policy links from navSection (assuming they are <p><a> elements)
    const policyLinks = Array.from(navSection.querySelectorAll('p > a')).filter(link => {
      const text = link.textContent.toLowerCase();
      return text.includes('contact us') || text.includes('faqs') || text.includes('terms of use') || text.includes('privacy policy');
    });

    policyLinks.forEach(link => {
      const policyLi = document.createElement('li');
      policyLi.classList.add('cmp-header__policy-list');
      const clonedLink = link.cloneNode(true);
      clonedLink.setAttribute('target', '_self'); // As per original HTML
      policyLi.append(clonedLink);
      policyUl.append(policyLi);
      moveInstrumentation(link.closest('p'), policyLi); // Attach instrumentation from original p tag
    });
  }

  // Section 3: Tools
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  newBlockContent.append(navIconsDiv);

  const toolsSection = navContent.children[2];
  if (toolsSection) {
    const socialMediaDiv = document.createElement('div');
    socialMediaDiv.classList.add('cmp-header__social-media');

    const socialLinksUl = toolsSection.querySelector('ul');
    if (socialLinksUl) {
      Array.from(socialLinksUl.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const clonedLink = link.cloneNode(true);
          moveInstrumentation(link, clonedLink);
          clonedLink.setAttribute('target', '_blank'); // As per original HTML
          const title = clonedLink.getAttribute('title') || '';
          if (title.toLowerCase() === 'instagram') {
            clonedLink.classList.add('icon-instagram');
            clonedLink.setAttribute('data-social', 'instagram');
          } else if (title.toLowerCase() === 'facebook') {
            clonedLink.classList.add('icon-facebok');
            clonedLink.setAttribute('data-social', 'facebook');
          } else if (title.toLowerCase() === 'twitter') {
            clonedLink.classList.add('icon-twitter');
            clonedLink.setAttribute('data-social', 'twitter');
          } else if (title.toLowerCase() === 'youtube') {
            clonedLink.classList.add('icon-youtube');
            clonedLink.setAttribute('data-social', 'youtube');
          }
          socialMediaDiv.append(clonedLink);
        }
      });
    }
    // Append social media to mobile list
    const mobileListDiv = navElement.querySelector('.cmp-header__mobile-list');
    if (mobileListDiv) {
      mobileListDiv.append(socialMediaDiv);
      const originalSocialUl = toolsSection.querySelector('ul');
      if (originalSocialUl) {
        moveInstrumentation(originalSocialUl, socialMediaDiv); // Attach instrumentation from original ul tag
      }
    }

    const utilityLinksUl = toolsSection.querySelectorAll('ul')[1]; // Second UL in tools section
    if (utilityLinksUl) {
      Array.from(utilityLinksUl.children).forEach((li) => {
        const strong = li.querySelector('strong');
        if (strong) {
          const text = strong.textContent.trim();
          const utilityDiv = document.createElement('div');
          utilityDiv.classList.add(`cmp-header__${text.toLowerCase().replace(/\s/g, '-')}`); // Ensure class names match
          moveInstrumentation(li, utilityDiv); // Attach instrumentation from original li tag

          const anchor = document.createElement('a');
          anchor.href = '#';
          anchor.classList.add('cmp-header__icon-img');

          const iconDiv = document.createElement('div');
          if (text.toLowerCase() === 'accessibility') {
            iconDiv.classList.add('icon-accessibility');
            utilityDiv.classList.add('cmp-header__hide-icon'); // As per original HTML
          } else if (text.toLowerCase() === 'search') {
            iconDiv.classList.add('icon-search');
          } else if (text.toLowerCase() === 'login') {
            iconDiv.classList.add('icon-profile');
            utilityDiv.classList.add('cmp-header__hide-icon'); // As per original HTML
          }
          anchor.append(iconDiv);

          const textDiv = document.createElement('div');
          textDiv.classList.add('cmp-header__icon-text');
          textDiv.textContent = text;
          anchor.append(textDiv);

          utilityDiv.append(anchor);
          navIconsDiv.append(utilityDiv);
        }
      });
    }
  }

  // Final append to block
  block.append(newBlockContent);

  // Add event listener for hamburger toggle
  hamburgerInput.addEventListener('change', () => toggleMenu(navContent, navElement.querySelector('.cmp-header__nav-group')));

  // Initial toggle state
  toggleMenu(navContent, navElement.querySelector('.cmp-header__nav-group'), isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(navContent, navElement.querySelector('.cmp-header__nav-group'), isDesktop.matches));
}
