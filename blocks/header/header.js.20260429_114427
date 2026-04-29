import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)'); // Adjusted to 1024px based on CSS media queries

/**
 * moveInstrumentation - Moves AEM instrumentation attributes from one element to another.
 * @param {Element} sourceElement - The element from which to move attributes.
 * @param {Element} destinationElement - The element to which to move attributes.
 */
function moveInstrumentation(sourceElement, destinationElement) {
  if (!sourceElement || !destinationElement) return;

  // List of AEM instrumentation attributes
  const instrumentationAttributes = [
    'data-cmp-data-layer',
    'data-cmp-is',
    'data-cmp-lazy',
    'data-cmp-mounted',
    'data-cmp-src',
    'data-cmp-hook-image',
    'data-asset-id',
    'id',
    'itemscope',
    'itemtype',
  ];

  instrumentationAttributes.forEach((attr) => {
    if (sourceElement.hasAttribute(attr)) {
      destinationElement.setAttribute(attr, sourceElement.getAttribute(attr));
      sourceElement.removeAttribute(attr);
    }
  });
}

/**
 * Toggles the entire nav for mobile.
 * @param {Element} nav The container element
 * @param {boolean} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMobileMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const hamburger = nav.querySelector('.cmp-header__hamburger');

  if (!hamburger) return;

  // Toggle the checked state of the hidden checkbox
  hamburger.checked = !expanded;
  nav.setAttribute('aria-expanded', !expanded);
  document.body.style.overflowY = (!expanded || isDesktop.matches) ? '' : 'hidden';
}

/**
 * Recursively decorates a UL element and its children.
 * @param {HTMLUListElement} ul The UL element to decorate.
 * @param {number} level The current nesting level (0 for top-level).
 * @param {Array} contentBuffer A buffer to collect non-list content.
 */
function decorateNavigation(ul, level, contentBuffer = []) {
  if (!ul) return;

  ul.classList.add('cmp-navigation__group');

  Array.from(ul.children).forEach((li) => {
    if (li.nodeName === 'LI') {
      li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${level}`);

      const strongElement = li.querySelector('strong');
      const anchorElement = li.querySelector('a');
      let triggerElement = anchorElement;

      if (strongElement) {
        // This is a mega-menu trigger
        triggerElement = document.createElement('a');
        triggerElement.href = anchorElement ? anchorElement.href : '#'; // Use existing anchor href if present
        triggerElement.textContent = strongElement.textContent;
        triggerElement.classList.add('cmp-navigation__item-link');
        strongElement.replaceWith(triggerElement);
        li.classList.add('cmp-header__nav-products', 'cmp-header__nav-products-click');

        // Add chevron for expandable items
        const chevron = document.createElement('span');
        chevron.classList.add('icon-chevron-down'); // Assuming a chevron class from CSS
        triggerElement.append(chevron);

        // Handle nested UL for sub-menus
        const nestedUl = li.querySelector('ul');
        if (nestedUl) {
          nestedUl.classList.add('cmp-header__product-items');
          const categoryMenu = document.createElement('div');
          categoryMenu.classList.add('cmp-header__category-menu');

          // Move any buffered content into a .left-div for mega-menu items
          if (contentBuffer.length > 0) {
            const titleText = triggerElement.textContent.trim();
            const sanitizedTitle = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div', `${sanitizedTitle}-left-div`);
            contentBuffer.forEach((node) => leftDiv.append(node));
            categoryMenu.prepend(leftDiv);
            contentBuffer.length = 0; // Clear the buffer
          }

          nestedUl.prepend(categoryMenu);
          moveInstrumentation(nestedUl, categoryMenu); // Move instrumentation from ul to categoryMenu
          decorateNavigation(nestedUl, level + 1); // Recurse for sub-menus
        }

        // Mobile click behavior for mega-menus
        if (!isDesktop.matches) {
          triggerElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent immediate closing of parent menu
            const parentLi = e.currentTarget.closest('li');
            if (parentLi) {
              const isExpanded = parentLi.classList.contains('active');
              // Close all other open siblings at this level
              Array.from(parentLi.parentNode.children).forEach((sibling) => {
                if (sibling !== parentLi && sibling.classList.contains('active')) {
                  sibling.classList.remove('active');
                  sibling.setAttribute('aria-expanded', 'false');
                  const siblingSubmenu = sibling.querySelector('.cmp-header__product-items, .cmp-header__submenu');
                  if (siblingSubmenu) siblingSubmenu.style.display = 'none';
                }
              });

              // Toggle current item
              parentLi.classList.toggle('active', !isExpanded);
              parentLi.setAttribute('aria-expanded', !isExpanded);
              const submenu = parentLi.querySelector('.cmp-header__product-items, .cmp-header__submenu');
              if (submenu) {
                submenu.style.display = isExpanded ? 'none' : 'flex';
              }
            }
          });
        }
      } else if (anchorElement) {
        anchorElement.classList.add('cmp-navigation__item-link');
        li.classList.add('cmp-header__no-items'); // For items without sub-menus
        if (level === 0) {
          li.classList.add('cmp-header__nav-products');
        }

        const nestedUl = li.querySelector('ul');
        if (nestedUl) {
          nestedUl.classList.add('cmp-header__submenu');
          const categoryMenu = document.createElement('div');
          categoryMenu.classList.add('cmp-header__category-menu');
          nestedUl.prepend(categoryMenu);
          moveInstrumentation(nestedUl, categoryMenu);
          decorateNavigation(nestedUl, level + 1);
          // Add chevron for expandable items
          const chevron = document.createElement('span');
          chevron.classList.add('icon-chevron-down');
          anchorElement.append(chevron);

          // Mobile click behavior for sub-menus (L2+)
          if (!isDesktop.matches) {
            anchorElement.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const parentLi = e.currentTarget.closest('li');
              if (parentLi) {
                const isExpanded = parentLi.classList.contains('active');
                Array.from(parentLi.parentNode.children).forEach((sibling) => {
                  if (sibling !== parentLi && sibling.classList.contains('active')) {
                    sibling.classList.remove('active');
                    sibling.setAttribute('aria-expanded', 'false');
                    const siblingSubmenu = sibling.querySelector('.cmp-header__product-items, .cmp-header__submenu');
                    if (siblingSubmenu) siblingSubmenu.style.display = 'none';
                  }
                });

                parentLi.classList.toggle('active', !isExpanded);
                parentLi.setAttribute('aria-expanded', !isExpanded);
                const submenu = parentLi.querySelector('.cmp-header__product-items, .cmp-header__submenu');
                if (submenu) {
                  submenu.style.display = isExpanded ? 'none' : 'flex';
                }
              }
            });
          }
        }
      }

      // Add specific mobile icons based on text content
      if (!isDesktop.matches && triggerElement) {
        const text = triggerElement.textContent.toLowerCase();
        if (text.includes('recipes')) {
          li.classList.add('mobile-icon-recipes');
        } else if (text.includes('media')) {
          li.classList.add('mobile-icon-media');
        } else if (text.includes('about us')) {
          li.classList.add('mobile-icon-about-us');
        }
      }
    } else {
      // Collect non-LI siblings into the buffer
      contentBuffer.push(child);
    }
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Add root classes from the original HTML
  block.classList.add('cmp-header');
  moveInstrumentation(block.firstElementChild, block);

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const headerContent = document.createDocumentFragment();

  // Create hamburger input
  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  headerContent.append(hamburgerInput);

  // Section 1: Brand (Logo)
  const brandSection = fragment.children[0];
  if (brandSection) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
    moveInstrumentation(brandSection.firstElementChild, logoDiv); // Move instrumentation from p to logoDiv

    const picture = brandSection.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('cmp-image__image');
        img.setAttribute('loading', 'lazy'); // Add lazy loading
      }
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-image__link');
      anchor.href = '/'; // Hardcoded home link as per original HTML
      anchor.append(picture);
      logoDiv.append(anchor);
    }
    headerContent.append(logoDiv);
    moveInstrumentation(brandSection, logoDiv); // Move instrumentation from section to logoDiv
  }

  // Section 2: Nav Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation');

  const navElement = document.createElement('nav');
  navElement.id = 'navigation-fff59bc8e9'; // Hardcoded ID from original HTML
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');

  const mainUl = document.createElement('ul');
  mainUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  const navSection = fragment.children[1];
  if (navSection) {
    const contentBuffer = [];

    Array.from(navSection.children).forEach((child) => {
      // Ignore AEM comments
      if (child.nodeType === Node.COMMENT_NODE) {
        return;
      }

      if (child.nodeName === 'UL') {
        const tempUl = document.createElement('ul');
        // Move children from fragment UL to tempUl to process them
        while (child.firstChild) {
          tempUl.append(child.firstChild);
        }
        decorateNavigation(tempUl, 0, contentBuffer);
        // Append decorated UL children to mainUl
        Array.from(tempUl.children).forEach((li) => {
          mainUl.append(li);
        });
        child.remove(); // Remove the original UL as its children are moved
      } else if (child.nodeName === 'P') {
        const link = child.querySelector('a');
        if (link) {
          const li = document.createElement('li');
          li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__no-items');
          link.classList.add('cmp-navigation__item-link');
          li.append(link);
          mainUl.append(li);
          moveInstrumentation(child, li); // Move instrumentation from p to li

          // Add specific mobile icons based on text content
          if (!isDesktop.matches) {
            const text = link.textContent.toLowerCase();
            if (text.includes('recipes')) {
              li.classList.add('mobile-icon-recipes');
            } else if (text.includes('media')) {
              li.classList.add('mobile-icon-media');
            } else if (text.includes('about us')) {
              li.classList.add('mobile-icon-about-us');
            }
          }
        }
      } else {
        // Collect non-UL/P siblings into the buffer for mega-menu left-div
        contentBuffer.push(child);
      }
    });

    navElement.append(mainUl);
  }

  // Mobile policy and social media links (from original HTML, not fragment)
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');

  const navSectionFragment = fragment.children[1];
  if (navSectionFragment) {
    const policyLinks = Array.from(navSectionFragment.querySelectorAll('p > a')).filter(
      (link) => link.textContent.includes('Contact us') || link.textContent.includes('FAQs') || link.textContent.includes('Terms of use') || link.textContent.includes('Privacy Policy')
    );

    policyLinks.forEach((link) => {
      const li = document.createElement('li');
      li.classList.add('cmp-header__policy-list');
      const clonedLink = link.cloneNode(true);
      clonedLink.setAttribute('target', '_self');
      li.append(clonedLink);
      policyUl.append(li);
    });
  }
  mobileList.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  const toolsSection = fragment.children[2];
  if (toolsSection) {
    const socialLinksUl = toolsSection.querySelector('ul');
    if (socialLinksUl) {
      Array.from(socialLinksUl.children).forEach((li) => {
        const link = li.querySelector('a');
        if (link) {
          const socialName = link.textContent.toLowerCase();
          link.classList.add(`icon-${socialName}`); // Assuming icon classes match social names
          link.setAttribute('data-social', socialName);
          link.setAttribute('target', '_blank'); // As per original HTML
          socialMediaDiv.append(link);
        }
      });
    }
  }
  mobileList.append(socialMediaDiv);
  navElement.append(mobileList);

  navigationWrapper.append(navElement);
  navLinksDiv.append(navigationWrapper);
  headerContent.append(navLinksDiv);

  // Section 3: Nav Icons (Accessibility, Search, Login)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  const toolsSectionFragment = fragment.children[2];
  if (toolsSectionFragment) {
    const toolItemsUl = toolsSectionFragment.querySelector('ul:last-of-type'); // Assuming the last UL is for tools
    if (toolItemsUl) {
      Array.from(toolItemsUl.children).forEach((li) => {
        const toolText = li.querySelector('strong')?.textContent.trim();
        if (toolText) {
          const toolDiv = document.createElement('div');
          toolDiv.classList.add(`cmp-header__${toolText.toLowerCase().replace(/\s/g, '')}`);

          // Hide Accessibility and Login as per original HTML
          if (toolText === 'Accessibility' || toolText === 'Login') {
            toolDiv.classList.add('cmp-header__hide-icon');
          }

          const toolLink = document.createElement('a');
          toolLink.href = '#'; // Hardcoded as per original HTML
          toolLink.classList.add('cmp-header__icon-img');

          const iconDiv = document.createElement('div');
          iconDiv.classList.add(`icon-${toolText.toLowerCase().replace(/\s/g, '')}`);
          toolLink.append(iconDiv);

          const textDiv = document.createElement('div');
          textDiv.classList.add('cmp-header__icon-text');
          textDiv.textContent = toolText;
          toolLink.append(textDiv);

          toolDiv.append(toolLink);
          navIconsDiv.append(toolDiv);
        }
      });
    }
  }
  headerContent.append(navIconsDiv);

  block.append(headerContent);

  // Add event listener for mobile hamburger toggle
  hamburgerInput.addEventListener('change', () => {
    toggleMobileMenu(navElement, hamburgerInput.checked);
  });

  // Close mobile menu on desktop resize
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      toggleMobileMenu(navElement, false); // Close menu on desktop
    }
  });

  // Ensure initial state is correct based on desktop/mobile
  toggleMobileMenu(navElement, false); // Initially closed for mobile, or open for desktop (handled by CSS)

  // Add escape key listener for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerInput.checked) {
      toggleMobileMenu(navElement, false);
    }
  });

  // Manage aria-expanded for desktop navigation items
  if (isDesktop.matches) {
    const topLevelItems = navElement.querySelectorAll('.cmp-navigation__item--level-0');
    topLevelItems.forEach(item => {
      const submenu = item.querySelector('.cmp-header__product-items, .cmp-header__submenu');
      if (submenu) {
        item.setAttribute('aria-haspopup', 'true');
        item.setAttribute('aria-expanded', 'false');

        item.addEventListener('mouseenter', () => {
          item.setAttribute('aria-expanded', 'true');
          submenu.style.display = 'flex';
        });

        item.addEventListener('mouseleave', () => {
          item.setAttribute('aria-expanded', 'false');
          submenu.style.display = 'none';
        });
      }
    });
  }
}
