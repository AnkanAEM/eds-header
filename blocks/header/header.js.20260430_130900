import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');
const EXPANDED_CLASS = 'active';
const VISIBLE_CLASS = 'is-visible';
const HIDDEN_CLASS = 'hidden';

function sanitizeClassName(name) {
  if (!name) return '';
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

function moveInstrumentation(sourceEl, targetEl) {
  if (sourceEl && targetEl) {
    const blockStatus = sourceEl.dataset.blockStatus;
    if (blockStatus) {
      targetEl.dataset.blockStatus = blockStatus;
    }
    const blockName = sourceEl.dataset.blockName;
    if (blockName) {
      targetEl.dataset.blockName = blockName;
    }
  }
}

function extractTextContent(element) {
  if (!element) return '';
  const a = element.querySelector('a');
  if (a) return a.textContent.trim();
  const strong = element.querySelector('strong');
  if (strong) return strong.textContent.trim();

  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join('');
}

function parseNavTree(ulElement) {
  if (!ulElement || ulElement.tagName !== 'UL') return [];

  const children = [];
  Array.from(ulElement.children).forEach((li) => {
    if (li.tagName !== 'LI') return;

    const link = li.querySelector('a');
    const strong = li.querySelector('strong');
    let title = '';
    let href = null;
    let description = null;

    if (link) {
      title = link.textContent.trim();
      href = link.href;
      const p = li.querySelector('p');
      if (p) {
        description = p.textContent.trim();
      }
    } else if (strong) {
      title = strong.textContent.trim();
    } else {
      title = extractTextContent(li);
    }

    const item = { title, href, description, children: [] };
    const nestedUl = li.querySelector(':scope > ul');
    if (nestedUl) {
      item.children = parseNavTree(nestedUl);
    }
    children.push(item);
  });
  return children;
}

function toggleMenu(nav, forceExpanded = null) {
  if (!nav) return;

  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const navHamburger = nav.querySelector('.nav-hamburger');
  const button = navHamburger ? navHamburger.querySelector('button') : null;

  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  const mobileMenu = nav.querySelector('.menu');
  if (mobileMenu) {
    if (expanded) {
      mobileMenu.classList.remove(VISIBLE_CLASS);
      mobileMenu.classList.add(HIDDEN_CLASS);
    } else {
      mobileMenu.classList.add(VISIBLE_CLASS);
      mobileMenu.classList.remove(HIDDEN_CLASS);
    }
  }

  // Reset desktop panels when mobile menu is closed
  if (expanded && !isDesktop.matches) {
    nav.querySelectorAll('.desktop-panel').forEach((panel) => {
      panel.classList.remove(VISIBLE_CLASS);
    });
    nav.querySelectorAll('.link-title').forEach((title) => {
      title.classList.remove(EXPANDED_CLASS);
    });
  }
}

function setupMobileNav(navFragment, mobileMenuList) {
  mobileMenuList.querySelectorAll('.accordion').forEach((itemEl) => {
    const panelEl = itemEl.nextElementSibling;
    if (panelEl && panelEl.classList.contains('panel')) {
      const toggleAccordion = () => {
        const isOpen = itemEl.classList.contains(EXPANDED_CLASS);
        if (isOpen) {
          itemEl.classList.remove(EXPANDED_CLASS);
          panelEl.style.maxHeight = null;
          itemEl.setAttribute('aria-expanded', 'false');
          panelEl.setAttribute('aria-hidden', 'true');
        } else {
          itemEl.classList.add(EXPANDED_CLASS);
          panelEl.style.maxHeight = `${panelEl.scrollHeight}px`;
          itemEl.setAttribute('aria-expanded', 'true');
          panelEl.setAttribute('aria-hidden', 'false');
        }
      };
      itemEl.addEventListener('click', toggleAccordion);
      itemEl.setAttribute('aria-expanded', 'false');
      panelEl.setAttribute('aria-hidden', 'true');
    }
  });

  // Escape key listener for mobile menu
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navFragment.getAttribute('aria-expanded') === 'true') {
      toggleMenu(navFragment, false);
    }
  });
}

function setupDesktopNav(navFragment) {
  const navLinksContainer = navFragment.querySelector('.links');
  if (!navLinksContainer) return;

  navLinksContainer.querySelectorAll('.link-title').forEach((linkTitle) => {
    const desktopPanel = linkTitle.nextElementSibling;
    if (desktopPanel && desktopPanel.classList.contains('desktop-panel')) {
      let timeout;

      const openPanel = () => {
        if (isDesktop.matches) {
          clearTimeout(timeout);
          navLinksContainer.querySelectorAll('.link-title').forEach((otherLink) => {
            otherLink.classList.remove(EXPANDED_CLASS);
            const otherPanel = otherLink.nextElementSibling;
            if (otherPanel && otherPanel.classList.contains('desktop-panel')) {
              otherPanel.classList.remove(VISIBLE_CLASS);
            }
          });
          linkTitle.classList.add(EXPANDED_CLASS);
          desktopPanel.classList.add(VISIBLE_CLASS);
          linkTitle.setAttribute('aria-expanded', 'true');
          desktopPanel.setAttribute('aria-hidden', 'false');
        }
      };

      const closePanel = () => {
        if (isDesktop.matches) {
          timeout = setTimeout(() => {
            linkTitle.classList.remove(EXPANDED_CLASS);
            desktopPanel.classList.remove(VISIBLE_CLASS);
            linkTitle.setAttribute('aria-expanded', 'false');
            desktopPanel.setAttribute('aria-hidden', 'true');
          }, 50); // Small delay to allow moving between linkTitle and desktopPanel
        }
      };

      linkTitle.addEventListener('mouseenter', openPanel);
      desktopPanel.addEventListener('mouseenter', () => clearTimeout(timeout));
      linkTitle.addEventListener('mouseleave', closePanel);
      desktopPanel.addEventListener('mouseleave', closePanel);

      linkTitle.setAttribute('aria-haspopup', 'true');
      linkTitle.setAttribute('aria-expanded', 'false');
      desktopPanel.setAttribute('aria-hidden', 'true');
    }
  });

  // Close desktop panels when clicking outside
  document.addEventListener('click', (event) => {
    if (isDesktop.matches && !navLinksContainer.contains(event.target) && !event.target.closest('.desktop-panel')) {
      navLinksContainer.querySelectorAll('.link-title').forEach((linkTitle) => {
        linkTitle.classList.remove(EXPANDED_CLASS);
        linkTitle.setAttribute('aria-expanded', 'false');
        const desktopPanel = linkTitle.nextElementSibling;
        if (desktopPanel && desktopPanel.classList.contains('desktop-panel')) {
          desktopPanel.classList.remove(VISIBLE_CLASS);
          desktopPanel.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });

  // Escape key listener for desktop panels
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navLinksContainer.querySelectorAll('.link-title').forEach((linkTitle) => {
        if (linkTitle.classList.contains(EXPANDED_CLASS)) {
          linkTitle.classList.remove(EXPANDED_CLASS);
          linkTitle.setAttribute('aria-expanded', 'false');
          const desktopPanel = linkTitle.nextElementSibling;
          if (desktopPanel && desktopPanel.classList.contains('desktop-panel')) {
            desktopPanel.classList.remove(VISIBLE_CLASS);
            desktopPanel.setAttribute('aria-hidden', 'true');
          }
        }
      });
    }
  });
}

export default async function decorate(block) {
  // Add original root classes to the block
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    block.innerHTML = '';
    return;
  }

  const navFragment = document.createElement('nav');
  navFragment.id = 'nav';
  navFragment.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('navbar', 'navbar-arena', 'g-container');

  const sections = Array.from(fragment.children);
  const brandSection = sections[0];
  const navSection = sections[1];
  const toolsSection = sections[2];

  // Section 1: Brand Logo
  if (brandSection) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('logo-wrapper');
    const logoBlock = document.createElement('div');
    logoBlock.classList.add('logo', 'block');
    moveInstrumentation(brandSection, logoBlock); // Move instrumentation from the section itself

    const logoLinkEl = brandSection.querySelector('a');
    if (logoLinkEl) {
      const a = document.createElement('a');
      a.classList.add('logo__picture');
      a.href = logoLinkEl.href;
      a.setAttribute('data-logo-name', logoLinkEl.textContent.trim() || 'Arena');

      const picture = logoLinkEl.querySelector('picture');
      if (picture) {
        a.append(picture);
      } else {
        // Fallback if no picture, just append the link content
        a.innerHTML = logoLinkEl.innerHTML;
      }
      logoBlock.append(a);
    } else {
      // If no link, still try to get a picture or content
      const picture = brandSection.querySelector('picture');
      if (picture) {
        const a = document.createElement('a');
        a.classList.add('logo__picture');
        a.href = '/'; // Default home link
        a.setAttribute('data-logo-name', 'Arena');
        a.append(picture);
        logoBlock.append(a);
      } else {
        // If no picture or link, append whatever is in the brand section
        logoBlock.innerHTML = brandSection.innerHTML;
      }
    }
    logoWrapper.append(logoBlock);
    navWrapper.append(logoWrapper);
  }

  // Hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  hamburger.append(hamburgerButton);
  navWrapper.prepend(hamburger);

  // Section 2: Main Navigation
  const navLinksContainer = document.createElement('div');
  navLinksContainer.classList.add('links');

  const desktopPanelsFragment = new DocumentFragment();
  const mobileMenuList = document.createElement('ul');
  mobileMenuList.classList.add('menu-list');

  if (navSection) {
    let navItemIndex = 0;
    const navItems = [];
    let currentElement = navSection.firstElementChild;

    while (currentElement) {
      if (currentElement.nodeType === Node.COMMENT_NODE) {
        currentElement = currentElement.nextElementSibling;
        continue;
      }

      if (currentElement.tagName === 'P') {
        const pElement = currentElement;
        const link = pElement.querySelector('a');
        const strong = pElement.querySelector('strong');
        let title = '';
        let href = null;
        let description = null;

        if (link) {
          title = link.textContent.trim();
          href = link.href;
          const nextP = pElement.nextElementSibling;
          if (nextP && nextP.tagName === 'P' && !nextP.querySelector('a')) {
            description = nextP.textContent.trim();
          }
        } else if (strong) {
          title = strong.textContent.trim();
        } else {
          title = extractTextContent(pElement);
        }

        const navItem = { title, href, description, children: [] };

        let nextSibling = pElement.nextElementSibling;
        while (nextSibling && nextSibling.nodeType === Node.COMMENT_NODE) {
          nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling && nextSibling.tagName === 'UL') {
          navItem.children = parseNavTree(nextSibling);
          currentElement = nextSibling.nextElementSibling;
        } else if (description) { // If there was a description P, skip it
          currentElement = pElement.nextElementSibling.nextElementSibling;
        } else {
          currentElement = pElement.nextElementSibling;
        }
        navItems.push(navItem);
      } else if (currentElement.tagName === 'UL') {
        // Handle orphaned ULs or ULs that are meant to be top-level items
        const topLevelItems = parseNavTree(currentElement);
        topLevelItems.forEach(item => navItems.push(item));
        currentElement = currentElement.nextElementSibling;
      } else {
        currentElement = currentElement.nextElementSibling;
      }
    }

    navItems.forEach((item) => {
      const desktopLinkTitle = document.createElement('div');
      desktopLinkTitle.classList.add('link-title');
      const span = document.createElement('span');
      if (item.href) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.title;
        if (item.title.toLowerCase() === 'home' || item.title.toLowerCase() === 'service' || item.title.toLowerCase() === 'important customer info') {
          a.classList.add('button'); // Add button class for specific links
        }
        span.append(a);
      } else {
        span.textContent = item.title;
      }
      desktopLinkTitle.append(span);
      navLinksContainer.append(desktopLinkTitle);

      const mobileListItem = document.createElement('li');
      mobileListItem.id = `menu-item-${navItemIndex}`;
      mobileListItem.classList.add('nav-link');
      const sanitizedTitle = sanitizeClassName(item.title);
      if (sanitizedTitle) mobileListItem.classList.add(sanitizedTitle);
      const mobileSpan = document.createElement('span');
      mobileSpan.classList.add('menu-title');
      if (item.href) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.title;
        if (item.title.toLowerCase() === 'home' || item.title.toLowerCase() === 'service' || item.title.toLowerCase() === 'important customer info') {
          a.classList.add('button');
        }
        mobileSpan.append(a);
      } else {
        mobileSpan.textContent = item.title;
      }
      mobileListItem.append(mobileSpan);

      if (item.children && item.children.length > 0) {
        mobileListItem.classList.add('accordion');
        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', sanitizedTitle);
        const linkGridBlock = document.createElement('div');
        linkGridBlock.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');

        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');

        item.children.forEach((child) => {
          const li = document.createElement('li');
          if (child.href) {
            const a = document.createElement('a');
            a.href = child.href;
            a.textContent = child.title;
            if (child.target) a.target = child.target;
            if (child.rel) a.rel = child.rel;
            li.append(a);
          } else {
            li.textContent = child.title;
          }
          if (child.description) {
            const p = document.createElement('p');
            p.textContent = child.description;
            li.append(p);
          }
          if (child.children && child.children.length > 0) {
            const nestedUl = document.createElement('ul');
            child.children.forEach((grandchild) => {
              const nestedLi = document.createElement('li');
              if (grandchild.href) {
                const nestedA = document.createElement('a');
                nestedA.href = grandchild.href;
                nestedA.textContent = grandchild.title;
                if (grandchild.target) nestedA.target = grandchild.target;
                if (grandchild.rel) nestedA.rel = grandchild.rel;
                nestedLi.append(nestedA);
              } else {
                nestedLi.textContent = grandchild.title;
              }
              nestedUl.append(nestedLi);
            });
            li.append(nestedUl);
          }
          ul.append(li);
        });
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        linkGridBlock.append(linkContainerSection);
        desktopPanel.append(linkGridBlock);
        desktopPanelsFragment.append(desktopPanel);

        const mobilePanel = desktopPanel.cloneNode(true);
        mobilePanel.classList.remove('desktop-panel');
        mobilePanel.style.maxHeight = '0';
        mobilePanel.setAttribute('aria-hidden', 'true');
        mobileMenuList.append(mobileListItem);
        mobileMenuList.append(mobilePanel);
      } else {
        mobileMenuList.append(mobileListItem);
      }
      navItemIndex += 1;
    });
  }
  navLinksContainer.append(desktopPanelsFragment);
  navWrapper.append(navLinksContainer);

  // Section 3: Tools
  const rightSection = document.createElement('div');
  rightSection.classList.add('right');
  rightSection.id = 'nav-right';

  if (toolsSection) {
    const toolUls = toolsSection.querySelectorAll('ul');

    if (toolUls.length > 0) {
      const contactWrapper = document.createElement('div');
      contactWrapper.classList.add('contact-wrapper');
      const contactBlock = document.createElement('div');
      contactBlock.classList.add('contact', 'block');
      moveInstrumentation(toolsSection, contactBlock);

      const contactDiv = document.createElement('div');
      contactDiv.classList.add('contact_wrp_arena', 'user__contact', 'header');

      const contactTitle = document.createElement('h4');
      contactTitle.classList.add('user__contact-title');
      contactTitle.textContent = 'Contact Us';
      contactDiv.append(contactTitle);

      const phoneIcon = document.createElement('span');
      phoneIcon.classList.add('user__contact-title', 'icon-phone');
      phoneIcon.setAttribute('aria-label', 'Contact Us');
      contactDiv.append(phoneIcon);

      const userContactIcons = document.createElement('div');
      userContactIcons.classList.add('user__contact__icons', HIDDEN_CLASS);

      const contactToggleBox = document.createElement('div');
      contactToggleBox.classList.add(HIDDEN_CLASS, 'contact-toggle-box');
      const callContainer = document.createElement('div');
      callContainer.classList.add('user__contact__icon-call_container');

      toolUls.forEach((ul) => {
        Array.from(ul.children).forEach((li) => {
          const link = li.querySelector('a');
          const textContent = li.textContent.trim();

          if (link) {
            const iconLink = document.createElement('a');
            iconLink.href = link.href;
            if (link.target) iconLink.target = link.target;
            if (link.rel) iconLink.rel = link.rel;

            const srOnlySpan = document.createElement('span');
            srOnlySpan.classList.add('sr-only');
            srOnlySpan.textContent = link.title || textContent || 'icon';
            iconLink.append(srOnlySpan);

            const img = link.querySelector('img');
            if (img) {
              iconLink.append(img.cloneNode(true));
            } else {
              const iconSpan = document.createElement('span');
              iconLink.append(iconSpan);
            }

            if (link.href.includes('whatsapp')) {
              iconLink.classList.add('user__contact--icon', 'whatsapp');
              userContactIcons.append(iconLink);
            } else if (link.href.startsWith('mailto:')) {
              iconLink.classList.add('user__contact--icon', 'email');
              userContactIcons.append(iconLink);
            } else if (link.href.startsWith('tel:')) {
              const telLink = document.createElement('a');
              telLink.href = link.href;
              telLink.classList.add('primary-telephone');
              telLink.textContent = textContent;
              callContainer.append(telLink);
            }
          }
        });
      });

      contactToggleBox.append(callContainer);
      contactDiv.append(userContactIcons);
      contactDiv.append(contactToggleBox);
      contactBlock.append(contactDiv);
      contactWrapper.append(contactBlock);
      rightSection.append(contactWrapper);

      const contactTitleToggle = contactDiv.querySelector('.user__contact-title.icon-phone');
      if (contactTitleToggle) {
        contactTitleToggle.addEventListener('click', (event) => {
          event.preventDefault();
          userContactIcons.classList.toggle(HIDDEN_CLASS);
          contactToggleBox.classList.toggle(HIDDEN_CLASS);
        });
      }
    }

    const languageDiv = document.createElement('div');
    languageDiv.classList.add('language');
    languageDiv.textContent = 'EN';
    rightSection.append(languageDiv);

    const signInWrapper = document.createElement('div');
    signInWrapper.classList.add('sign-in-wrapper', HIDDEN_CLASS);
    const signInBlock = document.createElement('div');
    signInBlock.classList.add('sign-in', 'block');
    moveInstrumentation(toolsSection, signInBlock);

    const userDropdown = document.createElement('div');
    userDropdown.classList.add('user__dropdown');
    const userAccount = document.createElement('div');
    userAccount.classList.add('user__account');

    const signInUl = toolsSection.querySelector('ul:last-of-type');
    if (signInUl) {
      Array.from(signInUl.children).forEach((li) => {
        const link = li.querySelector('a');
        const textContent = li.textContent.trim();

        if (link && link.classList.contains('user__account--link')) {
          const clonedLink = link.cloneNode(true);
          userAccount.append(clonedLink);
        } else if (textContent === 'Sign In' || (link && link.textContent.trim() === 'Sign In')) {
          const signInBtnDiv = document.createElement('div');
          signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
          const iconSpan = document.createElement('span');
          iconSpan.classList.add('user__account__list-icon');
          const iconImg = document.createElement('img');
          iconImg.src = 'https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg';
          iconImg.loading = 'lazy';
          iconImg.alt = 'Sign-in';
          iconSpan.append(iconImg);
          const button = document.createElement('button');
          button.type = 'button';
          button.setAttribute('data-sign-out-text', 'Sign Out');
          button.textContent = 'Sign In';
          signInBtnDiv.append(iconSpan);
          signInBtnDiv.append(button);
          userAccount.append(signInBtnDiv);
        }
      });
    }

    userDropdown.append(userAccount);
    signInBlock.append(userDropdown);
    signInWrapper.append(signInBlock);
    rightSection.append(signInWrapper);
  }
  navWrapper.append(rightSection);
  navFragment.append(navWrapper);

  // Mobile menu container
  const mobileMenuContainer = document.createElement('div');
  mobileMenuContainer.id = 'menu';
  mobileMenuContainer.classList.add('menu', HIDDEN_CLASS, 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow);
  menuHeader.append(menuTitle);
  menuHeader.append(closeIcon);
  mobileMenuContainer.append(menuHeader);
  mobileMenuContainer.append(mobileMenuList);

  // Append sign-in links to mobile menu
  const mobileSignInLinks = userAccount.cloneNode(true);
  Array.from(mobileSignInLinks.children).forEach((child) => {
    if (child.tagName === 'A' || (child.tagName === 'DIV' && child.classList.contains('sign-in-btn'))) {
      const li = document.createElement('li');
      li.append(child);
      mobileMenuList.append(li);
    }
  });

  navFragment.append(mobileMenuContainer);

  block.append(navFragment);

  // Event Listeners
  hamburgerButton.addEventListener('click', () => toggleMenu(navFragment));
  closeIcon.addEventListener('click', () => toggleMenu(navFragment));
  backArrow.addEventListener('click', () => {
    // This logic needs to be more sophisticated for nested mobile menus
    // For now, it just closes the main mobile menu
    toggleMenu(navFragment, false);
  });

  setupMobileNav(navFragment, mobileMenuList);
  setupDesktopNav(navFragment);

  // Initial state and resize handling
  isDesktop.addEventListener('change', () => toggleMenu(navFragment, isDesktop.matches));
  toggleMenu(navFragment, isDesktop.matches); // Set initial state
}
