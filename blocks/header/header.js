import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const header = document.querySelector('.corp-header-wrapper');
    const mobileMenu = header.querySelector('.menu');
    const navHamburger = header.querySelector('.nav-hamburger button');

    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('menu-open');
      navHamburger.setAttribute('aria-expanded', 'false');
      navHamburger.focus();
    }

    const desktopPanels = header.querySelectorAll('.desktop-panel:not(.hidden)');
    desktopPanels.forEach((panel) => {
      panel.classList.add('hidden');
      panel.previousElementSibling.focus(); // Focus back to the link that opened it
    });

    const contactToggleBox = header.querySelector('.contact-toggle-box:not(.hidden)');
    if (contactToggleBox) {
      contactToggleBox.classList.add('hidden');
      header.querySelector('.user__contact-title.icon-phone').focus();
    }
  }
}

function closeAllDesktopPanels(header) {
  header.querySelectorAll('.desktop-panel').forEach((panel) => {
    panel.classList.add('hidden');
    panel.previousElementSibling?.classList.remove('active'); // Remove active state from parent link
  });
}

function toggleMobileMenu(header, forceExpanded = null) {
  const mobileMenu = header.querySelector('.menu');
  const navHamburger = header.querySelector('.nav-hamburger button');
  const expanded = forceExpanded !== null ? forceExpanded : mobileMenu.classList.contains('hidden');

  if (expanded) {
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('menu-open');
    navHamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.querySelector('.close-icon').focus();
  } else {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
    navHamburger.setAttribute('aria-expanded', 'false');
    navHamburger.focus();
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // create the main header structure
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('corp-header', 'block');
  headerWrapper.setAttribute('data-block-name', 'corp-header');

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');
  headerWrapper.append(navbar);

  // Hamburger for mobile
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbar.append(navHamburger);

  // Logo Wrapper (Brand)
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  logoBlock.setAttribute('data-block-name', 'logo');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');
  const logoLink = fragment.querySelector('.nav-brand a');
  if (logoLink) {
    logoLink.classList.add('logo__picture');
    logoSpan.append(logoLink);
  } else {
    // Fallback if no link in nav-brand
    const defaultLogoLink = document.createElement('a');
    defaultLogoLink.classList.add('logo__picture');
    defaultLogoLink.href = '/';
    defaultLogoLink.innerHTML = '<picture><img alt="Arena Logo" src="/icons/logo.svg"></picture>';
    logoSpan.append(defaultLogoLink);
  }
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

  // Navigation Links (Sections)
  const navLinks = document.createElement('div');
  navLinks.classList.add('links');
  navbar.append(navLinks);

  const navSections = fragment.querySelector('.nav-sections > ul');
  if (navSections) {
    Array.from(navSections.children).forEach((section) => {
      const linkTitle = document.createElement('div');
      linkTitle.classList.add('link-title');
      const span = document.createElement('span');
      const sectionLink = section.querySelector('a');
      if (sectionLink) {
        span.append(sectionLink);
        sectionLink.classList.add('button'); // Add button class if it's a direct link
      } else {
        span.textContent = section.firstChild.textContent.trim(); // Get text if no direct link
      }
      linkTitle.append(span);
      navLinks.append(linkTitle);

      const subMenu = section.querySelector('ul');
      if (subMenu) {
        const panel = document.createElement('div');
        panel.classList.add('desktop-panel', 'panel');
        // Derive class from linkTitle text for specific styling
        const panelClass = span.textContent.trim().toLowerCase().replace(/\s/g, '-');
        panel.classList.add(panelClass);
        panel.classList.add('hidden'); // Initially hidden

        const linkGrid = document.createElement('div');
        linkGrid.classList.add('link-grid', 'block');
        panel.append(linkGrid);

        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        linkGrid.append(linkContainerSection);

        // Group sub-menu items into columns based on the original structure
        // Assuming each direct li under the main ul in the fragment represents a column or a group
        Array.from(subMenu.children).forEach((subMenuItem) => {
          const linkGridColumn = document.createElement('div');
          linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Default to vertical

          const linksContainer = document.createElement('ul');
          linksContainer.classList.add('content', 'links-container', 'accordian-content');

          const processSubLinks = (item, container) => {
            const li = document.createElement('li');
            const link = item.querySelector('a');
            if (link) {
              li.append(link);
              const description = item.querySelector('p');
              if (description) {
                li.append(description);
              }
            } else {
              li.textContent = item.textContent.trim();
            }
            container.append(li);

            const nestedUl = item.querySelector('ul');
            if (nestedUl) {
              Array.from(nestedUl.children).forEach((nestedLi) => {
                processSubLinks(nestedLi, container);
              });
            }
          };

          // If the subMenuItem directly contains a UL, it's a column of links
          const directUl = subMenuItem.querySelector('ul');
          if (directUl) {
            Array.from(directUl.children).forEach((li) => processSubLinks(li, linksContainer));
          } else {
            // If it's a single link, treat it as a column with one item or adjust class
            processSubLinks(subMenuItem, linksContainer);
            if (linksContainer.children.length === 1 && subMenuItem.classList.contains('link-column-horizontal')) {
              linkGridColumn.classList.remove('link-column-vertical');
              linkGridColumn.classList.add('link-column-horizontal');
            }
          }

          if (linksContainer.children.length > 0) {
            linkGridColumn.append(linksContainer);
            linkContainerSection.append(linkGridColumn);
          }
        });

        navLinks.append(panel);

        linkTitle.addEventListener('mouseenter', () => {
          closeAllDesktopPanels(block); // Close other panels
          panel.classList.remove('hidden');
          linkTitle.classList.add('active'); // Add active class to show hover state
        });

        panel.addEventListener('mouseleave', () => {
          panel.classList.add('hidden');
          linkTitle.classList.remove('active');
        });

        linkTitle.addEventListener('mouseleave', (e) => {
          if (!panel.contains(e.relatedTarget)) {
            panel.classList.add('hidden');
            linkTitle.classList.remove('active');
          }
        });
      }
    });
  }

  // Right section (Contact, Language, Sign-in)
  const navRight = document.createElement('div');
  navRight.classList.add('right');
  navRight.id = 'nav-right';
  navbar.append(navRight);

  // Contact Wrapper
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  contactBlock.setAttribute('data-block-name', 'contact');
  const contactWrapArena = document.createElement('div');
  contactWrapArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
  contactBlock.append(contactWrapArena);

  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  // Dynamically get "Contact Us" from fragment if available, otherwise fallback
  const contactUsLink = fragment.querySelector('.nav-right .contact-wrapper .user__contact-title');
  contactTitle.textContent = contactUsLink ? contactUsLink.textContent.trim() : 'Contact Us';
  const contactIconPhone = document.createElement('span');
  contactIconPhone.classList.add('user__contact-title', 'icon-phone');
  contactIconPhone.setAttribute('aria-label', contactTitle.textContent);
  contactWrapArena.append(contactTitle, contactIconPhone);

  const contactIcons = document.createElement('div');
  contactIcons.classList.add('user__contact__icons', 'hidden');
  // Add contact links dynamically from the fragment
  const fragmentContactIcons = fragment.querySelector('.nav-right .contact-wrapper .user__contact__icons');
  if (fragmentContactIcons) {
    contactIcons.innerHTML = fragmentContactIcons.innerHTML;
  } else {
    // Fallback if not in fragment
    contactIcons.innerHTML = `
      <a href="#" class="user__contact--icon phone">
        <span class="sr-only">phone</span>
        <img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:5b948ce6-b05d-4b51-ad62-c8763b2489ef/as/phone-blue.svg" alt="phone" loading="lazy">
      </a>
      <a href="https://wa.me/919289311487?text=Hi" target="_blank" class="user__contact--icon whatsapp" rel="noopener noreferrer">
        <span class="sr-only">whatsapp</span>
        <img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:8b7e1a58-e51b-4076-8d71-74415f808bb5/as/whatsapp-blue.svg" alt="whatsapp" loading="lazy">
      </a>
      <a href="mailto:contact@maruti.co.in" class="user__contact--icon email">
        <span class="sr-only">email</span>
        <img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:486b1069-8798-47ae-ac0b-d557f2185041/as/mail-blue.svg" alt="email" loading="lazy">
      </a>
    `;
  }
  contactWrapArena.append(contactIcons);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const fragmentContactToggleBox = fragment.querySelector('.nav-right .contact-wrapper .contact-toggle-box');
  if (fragmentContactToggleBox) {
    contactToggleBox.innerHTML = fragmentContactToggleBox.innerHTML;
  } else {
    // Fallback if not in fragment
    contactToggleBox.innerHTML = `
      <div class="user__contact__icon-call_container">
        <a href="tel:1800 102 1800" class="primary-telephone">1800 102 1800</a>
        <a href="tel:" class="secondary-telephone"></a>
      </div>
    `;
  }
  contactWrapArena.append(contactToggleBox);
  contactWrapper.append(contactBlock);
  navRight.append(contactWrapper);

  // Event listener for contact icon/title to toggle contact options
  contactIconPhone.addEventListener('click', (e) => {
    e.preventDefault();
    contactToggleBox.classList.toggle('hidden');
  });
  contactTitle.addEventListener('click', (e) => {
    e.preventDefault();
    contactToggleBox.classList.toggle('hidden');
  });

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  const languageText = fragment.querySelector('.nav-right .language');
  languageDiv.textContent = languageText ? languageText.textContent.trim() : 'EN';
  navRight.append(languageDiv);

  // Sign-in Wrapper (Tools)
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Initially hidden based on original HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInBlock.setAttribute('data-block-name', 'sign-in');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Add sign-in links dynamically from the fragment
  const fragmentUserAccount = fragment.querySelector('.nav-right .sign-in-wrapper .user__account');
  if (fragmentUserAccount) {
    userAccount.innerHTML = fragmentUserAccount.innerHTML;
  } else {
    // Fallback if not in fragment
    userAccount.innerHTML = `
      <a href="https://www.marutisuzuki.com/corporate/reach-us" class="user__account--link reach us" target="_self">
        <span class="user__account__list-icon">
          <img src="https://www.marutisuzuki.com/common/media_15a6c05afc5507562eb897b4d95a77989df181064.svg?width=750&amp;format=svg&amp;optimize=medium" loading="lazy" alt="Reach Us">
        </span>
        Reach Us
      </a>
      <a href="https://www.marutisuzuki.com/user" class="user__account--link profile" target="_self">
        <span class="user__account__list-icon">
          <img src="https://www.marutisuzuki.com/common/media_13b5778376192c7cb827e1fed7ceef1bb8dcaf60.svg?width=750&amp;format=svg&amp;optimize=medium" loading="lazy" alt="Profile">
        </span>
        Profile
      </a>
      <div class="user__account--link sign-in-btn">
        <span class="user__account__list-icon">
          <img src="https://www.marutisuzuki.com/adobe/assets/urn:aaid:aem:3c13f70a-cefc-4aeb-83f2-53cd72a175d1/as/world-blue.svg" loading="lazy" alt="Sign-in">
        </span>
        <button type="button" data-sign-out-text="Sign Out">Sign In</button>
      </div>
    `;
  }
  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  navRight.append(signInWrapper);

  // Mobile Menu
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena'); // Initially hidden

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu'; // This is a static label, can be kept
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIcon);
  mobileMenu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  mobileMenu.append(menuList);

  // Populate mobile menu from navSections
  Array.from(navSections.children).forEach((section, i) => {
    const li = document.createElement('li');
    li.id = `menu-item-${i}`;
    li.classList.add('nav-link');

    const sectionLink = section.querySelector('a');
    const spanTitle = document.createElement('span');
    spanTitle.classList.add('menu-title');

    if (sectionLink) {
      spanTitle.append(sectionLink.cloneNode(true)); // Clone the link
      spanTitle.querySelector('a').classList.add('button'); // Ensure button class
      li.classList.add(sectionLink.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    } else {
      spanTitle.textContent = section.firstChild.textContent.trim();
      li.classList.add(spanTitle.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    }
    li.append(spanTitle);

    const subMenu = section.querySelector('ul');
    if (subMenu) {
      li.classList.add('accordion');
      const panel = document.createElement('div');
      panel.classList.add('panel');

      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      panel.append(linkContainerSection);

      Array.from(subMenu.children).forEach((subMenuItem) => {
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

        const linksContainer = document.createElement('ul');
        linksContainer.classList.add('content', 'links-container', 'accordian-content');

        const processSubLinks = (item, container) => {
          const subLi = document.createElement('li');
          const link = item.querySelector('a');
          if (link) {
            subLi.append(link.cloneNode(true));
            const description = item.querySelector('p');
            if (description) {
              subLi.append(description.cloneNode(true));
            }
          } else {
            subLi.textContent = item.textContent.trim();
          }
          container.append(subLi);

          const nestedUl = item.querySelector('ul');
          if (nestedUl) {
            Array.from(nestedUl.children).forEach((nestedLi) => {
              processSubLinks(nestedLi, container);
            });
          }
        };

        const directUl = subMenuItem.querySelector('ul');
        if (directUl) {
          Array.from(directUl.children).forEach((subLi) => processSubLinks(subLi, linksContainer));
        } else {
          processSubLinks(subMenuItem, linksContainer);
        }

        if (linksContainer.children.length > 0) {
          linkGridColumn.append(linksContainer);
          linkContainerSection.append(linkGridColumn);
        }
      });
      li.append(panel);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        const currentPanel = li.querySelector('.panel');
        if (currentPanel.style.maxHeight) {
          currentPanel.style.maxHeight = null;
        } else {
          currentPanel.style.maxHeight = `${currentPanel.scrollHeight}px`;
        }
      });
    }
    menuList.append(li);
  });

  // Add user account links to mobile menu
  Array.from(userAccount.children).forEach((item) => {
    menuList.append(item.cloneNode(true));
  });

  headerWrapper.append(mobileMenu);

  block.textContent = '';
  block.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'sticky', 'show'); // Add classes from original block
  block.append(headerWrapper);

  // Event Listeners
  hamburgerButton.addEventListener('click', () => toggleMobileMenu(block, null));
  closeIcon.addEventListener('click', () => toggleMobileMenu(block, false));
  backArrow.addEventListener('click', () => {
    // Implement back functionality for multi-level mobile menus if needed.
    // For now, it just closes the menu.
    toggleMobileMenu(block, false);
  });

  // Close menu on escape keypress
  window.addEventListener('keydown', closeOnEscape);

  // Prevent mobile nav behavior on window resize
  const handleResize = () => {
    if (isDesktop.matches) {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('menu-open');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      closeAllDesktopPanels(block);
    } else {
      closeAllDesktopPanels(block); // Ensure desktop panels are closed on mobile
    }
  };

  isDesktop.addEventListener('change', handleResize);
  handleResize(); // Initial check on load
}
