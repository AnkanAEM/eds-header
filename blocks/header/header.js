import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function unwrapParagraphLinks(element) {
  element.querySelectorAll('p > a').forEach((a) => {
    const p = a.closest('p');
    if (p && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
      p.replaceWith(a);
    } else if (p && p.children.length === 1 && a.parentElement === p) {
      // Fallback for cases where p might contain other whitespace or subtle differences
      p.replaceWith(a);
    }
  });
}

function closeAllDropdowns(container, ignoreElement = null) {
  container.querySelectorAll('.header-nav-item.open').forEach((item) => {
    if (item !== ignoreElement) {
      item.classList.remove('open');
      item.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupDropdowns(navElement) {
  navElement.querySelectorAll('.header-nav-main .header-nav-item').forEach((parentItem) => {
    const dropdown = parentItem.querySelector('ul');
    if (dropdown) {
      parentItem.classList.add('has-dropdown');
      parentItem.setAttribute('aria-expanded', 'false');
      parentItem.setAttribute('aria-haspopup', 'true');

      const anchor = parentItem.querySelector('a');
      if (anchor && !anchor.querySelector('.dropdown-toggle')) {
        const chevron = document.createElement('span');
        chevron.classList.add('dropdown-toggle');
        anchor.appendChild(chevron);
      }

      // Desktop: mouseenter/mouseleave
      if (window.matchMedia('(min-width: 900px)').matches) {
        let timeout;
        parentItem.addEventListener('mouseenter', () => {
          clearTimeout(timeout);
          closeAllDropdowns(navElement, parentItem);
          parentItem.classList.add('open');
          parentItem.setAttribute('aria-expanded', 'true');
        });
        parentItem.addEventListener('mouseleave', () => {
          timeout = setTimeout(() => {
            parentItem.classList.remove('open');
            parentItem.setAttribute('aria-expanded', 'false');
          }, 200);
        });
      }

      // Mobile: click toggle on parent link
      if (anchor) {
        anchor.addEventListener('click', (e) => {
          if (window.matchMedia('(max-width: 899px)').matches) {
            e.preventDefault();
            const isOpen = parentItem.classList.contains('open');
            closeAllDropdowns(navElement, parentItem);
            if (!isOpen) {
              parentItem.classList.add('open');
              parentItem.setAttribute('aria-expanded', 'true');
            }
          }
        });
      }
    }
  });
}

function setupMobileHamburger(block, headerNavContainer) {
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-controls', 'nav-main-wrapper');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="icon-hamburger"></span>';

  block.querySelector('.header-wrapper').prepend(hamburger);

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    block.classList.toggle('nav-open', !expanded);
    document.body.classList.toggle('nav-open', !expanded);

    if (!expanded) {
      closeAllDropdowns(headerNavContainer);
    }
  });

  block.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('nav-open')) {
      hamburger.click();
    }
  });

  document.addEventListener('click', (e) => {
    const isClickOutsideNav = !block.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    if (block.classList.contains('nav-open') && isClickOutsideNav && !isClickOnHamburger) {
      hamburger.click();
    }
  });
}

export default async function decorate(block) {
  const navContent = await loadFragment('/nav');
  block.textContent = '';

  const header = document.createElement('nav');
  header.id = 'nav';
  header.classList.add('header-block');

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerLogo = document.createElement('div');
  headerLogo.classList.add('header-logo');

  const headerNavMain = document.createElement('div');
  headerNavMain.classList.add('header-nav-main');

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  const fragmentSections = Array.from(navContent.children);

  let logoSectionProcessed = false;
  let mainNavSectionProcessed = false;

  fragmentSections.forEach((section) => {
    const contentWrapper = section.querySelector('.default-content-wrapper');
    const targetSection = contentWrapper || section;

    unwrapParagraphLinks(targetSection);

    // --- LOGO ---
    const logoLink = targetSection.querySelector('a:has(img)');
    if (logoLink && !logoSectionProcessed) {
      const img = logoLink.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt, true, [{ width: '150' }]);
        logoLink.replaceChild(picture, img);
        headerLogo.appendChild(logoLink);
        logoSectionProcessed = true;
        // Capture any other elements within the logo section if present, move to tools
        Array.from(targetSection.children).forEach((child) => {
          if (child !== logoLink) {
            headerTools.appendChild(child.cloneNode(true));
          }
        });
        return;
      }
    }

    // --- MAIN NAVIGATION ---
    const mainUl = targetSection.querySelector('ul');
    if (mainUl && !mainNavSectionProcessed) {
      const clonedUl = mainUl.cloneNode(true);

      clonedUl.querySelectorAll('li').forEach((li) => {
        li.classList.add('header-nav-item');
      });
      headerNavMain.appendChild(clonedUl);
      mainNavSectionProcessed = true;
      return;
    }

    // --- TOOLS (fallback for any remaining significant content) ---
    if (targetSection.children.length > 0) {
      Array.from(targetSection.children).forEach((child) => {
        // Ensure no empty <p> tags or similar are accidentally copied
        if (child.textContent.trim() || child.querySelector('img')) {
          headerTools.appendChild(child.cloneNode(true));
        }
      });
    }
  });

  // Add hardcoded utility icons (Search, Accessibility, Login) as they are
  // present in the original site's structure
  // and typically not driven by /nav content directly for simple fragments.
  const createToolItem = (iconClass, text, href) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('header-tool-item');
    const link = document.createElement('a');
    link.href = href;
    link.classList.add(iconClass.replace('icon-', '')); // Add semantic class for styling
    link.innerHTML = `<span class="${iconClass}"></span><span class="text">${text}</span>`;
    wrapper.appendChild(link);
    return wrapper;
  };

  // Check if these are already present from the fragment, otherwise add.
  // This check is rudimentary and assumes specific class names for found items.
  if (!headerTools.querySelector('.search')) {
    headerTools.appendChild(createToolItem('icon-search', 'Search', '#'));
  }
  if (!headerTools.querySelector('.accessibility')) {
    headerTools.appendChild(createToolItem('icon-accessibility', 'Accessibility', '#'));
  }
  if (!headerTools.querySelector('.profile')) {
    headerTools.appendChild(createToolItem('icon-profile', 'Login', '#'));
  }

  headerWrapper.appendChild(headerLogo);

  const navMainAndToolsWrapper = document.createElement('div');
  navMainAndToolsWrapper.classList.add('header-nav-and-tools-wrapper');
  navMainAndToolsWrapper.id = 'nav-main-wrapper';
  navMainAndToolsWrapper.appendChild(headerNavMain);
  navMainAndToolsWrapper.appendChild(headerTools);
  headerWrapper.appendChild(navMainAndToolsWrapper);

  block.appendChild(headerWrapper);

  setupDropdowns(headerNavMain);
  setupMobileHamburger(block, navMainAndToolsWrapper);

  moveInstrumentation(navContent, block);
}
