import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.innerHTML = ''; // Ensure idempotency

  const navContent = await loadFragment('/nav');
  if (!navContent || !navContent.children.length) {
    return;
  }

  const header = document.createElement('header');
  header.classList.add('header');

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');
  header.append(headerWrapper);

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');
  headerWrapper.append(headerBrand);

  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  headerWrapper.append(headerNav);

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');
  headerWrapper.append(headerTools);

  // Store elements extracted from the fragment temporarily
  let mainNavContent = null;
  let hamburgerContent = null;
  let desktopToolsContent = null;
  let mobileToolsContent = null;
  let mainLogoContent = null;
  let yearLogoContent = null;

  // Iterate over each AEM section in the fragment
  Array.from(navContent.children).forEach((section) => {
    const contentWrapper = section.querySelector('.default-content-wrapper');
    if (!contentWrapper || contentWrapper.textContent?.trim() === '') {
      return; // Skip empty sections
    }

    // Try to find main logo
    if (!mainLogoContent) {
      mainLogoContent = contentWrapper.querySelector('.logo:not(.year-80-logo)');
      if (mainLogoContent) {
        headerBrand.append(mainLogoContent);
        return;
      }
    }

    // Try to find 80th year logo
    if (!yearLogoContent) {
      yearLogoContent = contentWrapper.querySelector('.logo.year-80-logo');
      if (yearLogoContent) {
        headerBrand.append(yearLogoContent);
        return;
      }
    }

    // Try to find hamburger
    if (!hamburgerContent) {
      hamburgerContent = contentWrapper.querySelector('.hamburger');
      if (hamburgerContent) {
        headerNav.append(hamburgerContent);
        return;
      }
    }

    // Try to find main navigation
    if (!mainNavContent) {
      mainNavContent = contentWrapper.querySelector('nav.main-nav > ul');
      if (mainNavContent) {
        // We will process this ul and append to headerNav later
        return;
      }
    }

    // Try to find desktop tools
    if (!desktopToolsContent) {
      desktopToolsContent = contentWrapper.querySelector('.icon-nav.desktop-menus-icon');
      if (desktopToolsContent) {
        // We will process this and append to headerTools later
        return;
      }
    }
    
    // Try to find mobile tools (fallback if desktop not preferred/found)
    if (!mobileToolsContent) {
      mobileToolsContent = contentWrapper.querySelector('.icon-nav.mobile-menus-icon');
      if (mobileToolsContent) {
        // We will process this and append to headerTools later if desktop not used
        return;
      }
    }
  });

  // Now, assemble the main navigation and tools, prioritizing desktop tools
  if (mainNavContent) {
    const navUl = document.createElement('ul');
    navUl.classList.add('main-menu');
    Array.from(mainNavContent.children).forEach(li => {
      // Ensure it's a list item and not an icon-nav accidentally captured
      if (li.tagName === 'LI') {
        // Clean up classes/attributes from L0 li
        li.classList.remove('has-child', 'hover-red');
        li.classList.add('header-nav-item');
        li.removeAttribute('itemprop');
        li.removeAttribute('itemscope');
        li.removeAttribute('itemtype');
        
        const l0Link = li.querySelector(':scope > a');
        l0Link?.removeAttribute('itemprop');

        const megaMenu = li.querySelector(':scope > .mega-menu');
        if (megaMenu) {
          li.classList.add('has-dropdown');
          megaMenu.classList.add('header-dropdown-wrapper');

          // Unwrap original container structure within mega-menu
          const megaMenuWrap = megaMenu.querySelector('.wrap.container');
          if (megaMenuWrap) {
            Array.from(megaMenuWrap.children).forEach(child => megaMenu.append(child));
            megaMenuWrap.remove();
          }
          const centerDiv = megaMenu.querySelector('.center-div');
          if (centerDiv) {
            const leftDiv = centerDiv.querySelector('.left-div');
            if (leftDiv) {
              leftDiv.classList.add('header-dropdown-info');
              megaMenu.append(leftDiv);
            }
            const subNavWrap = centerDiv.querySelector('.sub-nav-wrap');
            if (subNavWrap) {
              subNavWrap.classList.add('header-dropdown-menu');
              megaMenu.append(subNavWrap);

              // Process L1 and L2 within the subNavWrap
              subNavWrap.querySelectorAll('li.top-level-li').forEach(l1Li => {
                l1Li.classList.add('has-dropdown-level1');
                const l1Link = l1Li.querySelector(':scope > a');
                const l1SvgSpan = l1Li.querySelector(':scope > span');
                const l1Svg = l1SvgSpan?.querySelector('svg');
                if (l1Link && l1Svg) {
                    l1Link.append(l1Svg);
                    l1SvgSpan.remove();
                }
                const hasSubChild = l1Li.querySelector(':scope > .has-sub-child');
                if (hasSubChild) {
                    hasSubChild.classList.add('header-sub-dropdown');
                    hasSubChild.querySelectorAll('li.first-level-li').forEach(l2Li => {
                        l2Li.classList.add('has-dropdown-level2');
                        const l2Link = l2Li.querySelector(':scope > a');
                        const l2SvgSpan = l2Li.querySelector(':scope > span');
                        const l2Svg = l2SvgSpan?.querySelector('svg');
                        if (l2Link && l2Svg) {
                            l2Link.append(l2Svg);
                            l2SvgSpan.remove();
                        }
                        const hasInnerSubChild = l2Li.querySelector(':scope > .has-inner-sub-child');
                        if (hasInnerSubChild) {
                            hasInnerSubChild.classList.add('header-sub-dropdown-level2');
                        }
                    });
                }
              });
            }
            centerDiv.remove();
          }
        }
        navUl.append(li);
      }
    });
    headerNav.append(navUl);
  }

  // Add tools, preferring desktop over mobile if both exist
  const toolsToProcess = desktopToolsContent || mobileToolsContent;
  if (toolsToProcess) {
      Array.from(toolsToProcess.querySelectorAll('li')).forEach(toolLi => {
          const toolLink = toolLi.querySelector('a');
          if (toolLink) {
              const toolWrapper = document.createElement('div');
              toolWrapper.classList.add('header-tool-item', toolLi.className);
              toolWrapper.append(toolLink);
              const searchScreenWrap = toolLi.querySelector('.search-screen-wrap');
              if (searchScreenWrap) {
                  toolWrapper.append(searchScreenWrap);
              }
              headerTools.append(toolWrapper);
          }
      });
  }

  // --- Final append to block ---
  block.append(header);

  // --- Interaction Logic ---
  setupInteractions(header);

  // Remove any remaining data-once attributes and other non-standard attributes
  header.querySelectorAll('[data-once]').forEach(el => el.removeAttribute('data-once'));
  header.querySelectorAll('[itemprop]').forEach(el => el.removeAttribute('itemprop'));
  header.querySelectorAll('[itemscope]').forEach(el => el.removeAttribute('itemscope'));
  header.querySelectorAll('[itemtype]').forEach(el => el.removeAttribute('itemtype'));

  moveInstrumentation(navContent, block);
}

// Function to handle all interactions
function setupInteractions(header) {
  // Hamburger Toggle (Mobile)
  const mobileMenuToggle = header.querySelector('.hamburger');
  if (mobileMenuToggle) {
    const nav = header.querySelector('.header-nav');
    mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');

    mobileMenuToggle.addEventListener('click', () => {
      const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('scroll-locked', !expanded);

      if (!expanded) {
        // Close search if mobile nav opens
        const searchScreenWrap = header.querySelector('.header-tools .search .search-screen-wrap');
        const searchLink = header.querySelector('.header-tools .search > a');
        if (searchScreenWrap?.classList.contains('is-open')) {
            toggleSearch(searchScreenWrap, searchLink, false);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
        mobileMenuToggle.click();
      }
    });

    document.addEventListener('click', (e) => {
        const isMobileNavOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        const isClickInsideHeader = header.contains(e.target);
        const isClickOnSearchOverlay = e.target.closest('.search-screen-wrap');

        if (isMobileNavOpen && !isClickInsideHeader && !isClickOnSearchOverlay) {
            mobileMenuToggle.click();
        }
    });
  }

  // --- Dropdown Interactions (L0, L1, L2) --- 

  // Close all open dropdowns across all levels, optionally excluding a specific branch
  function closeAllDropdowns(headerEl, exceptElement = null) {
    headerEl.querySelectorAll('.header-dropdown-wrapper.is-open, .header-sub-dropdown.is-open, .header-sub-dropdown-level2.is-open').forEach(openDropdown => {
      if (!exceptElement || !openDropdown.contains(exceptElement)) {
        openDropdown.classList.remove('is-open');
        const link = openDropdown.previousElementSibling;
        if (link?.tagName === 'A' && link.hasAttribute('aria-expanded')) {
          link.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Helper to toggle dropdowns
  function toggleDropdown(link, dropdown, open) {
    dropdown.classList.toggle('is-open', open);
    link.setAttribute('aria-expanded', open);

    if (open) {
        // If opening a dropdown, ensure only one L0 is open on desktop
        if (window.innerWidth >= 900 && link.closest('.header-nav > .main-menu > .header-nav-item')) {
            header.querySelectorAll('.header-nav > .main-menu > .header-nav-item.has-dropdown').forEach(item => {
                const otherL0Link = item.querySelector(':scope > a');
                const otherMegaMenu = item.querySelector(':scope > .header-dropdown-wrapper');
                if (item !== link.closest('li') && otherMegaMenu?.classList.contains('is-open')) {
                    toggleDropdown(otherL0Link, otherMegaMenu, false);
                }
            });
        }
        // For mobile, if opening a dropdown, close its siblings
        if (window.innerWidth < 900) {
            const parentUl = dropdown.closest('ul');
            if (parentUl) {
                Array.from(parentUl.children).forEach(siblingLi => {
                    if (siblingLi !== link.closest('li')) {
                        const siblingLink = siblingLi.querySelector('a[aria-expanded="true"]');
                        const siblingDropdown = siblingLi.querySelector('.header-dropdown-wrapper.is-open, .header-sub-dropdown.is-open, .header-sub-dropdown-level2.is-open');
                        if (siblingLink && siblingDropdown) {
                            toggleDropdown(siblingLink, siblingDropdown, false);
                        }
                    }
                });
            }
        }
    } else {
      // When closing a parent, ensure all its children are also closed.
      dropdown.querySelectorAll('.header-dropdown-wrapper.is-open, .header-sub-dropdown.is-open, .header-sub-dropdown-level2.is-open').forEach(nestedDropdown => {
        const nestedLink = nestedDropdown.previousElementSibling;
        if (nestedLink?.tagName === 'A' && nestedLink.hasAttribute('aria-expanded')) {
            toggleDropdown(nestedLink, nestedDropdown, false);
        }
      });
    }
  }

  // Setup L0 items
  header.querySelectorAll('.header-nav > .main-menu > .header-nav-item.has-dropdown').forEach((li) => {
    const l0Link = li.querySelector(':scope > a');
    const megaMenu = li.querySelector(':scope > .header-dropdown-wrapper');

    if (l0Link && megaMenu) {
      l0Link.setAttribute('aria-haspopup', 'true');
      l0Link.setAttribute('aria-expanded', 'false');

      if (window.innerWidth >= 900) { // Desktop: hover for L0
        li.addEventListener('mouseenter', () => {
          toggleDropdown(l0Link, megaMenu, true);
        });
        li.addEventListener('mouseleave', () => {
          const isAnySubOpen = li.querySelector('.header-dropdown-wrapper.is-open .is-open'); // Check if any nested dropdown is open
          if (!isAnySubOpen) { // Only close L0 if no children are open
            toggleDropdown(l0Link, megaMenu, false);
          }
        });
      } else { // Mobile: click for L0
        l0Link.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = megaMenu.classList.contains('is-open');
          toggleDropdown(l0Link, megaMenu, !isOpen);
        });
      }
    }
  });

  // Setup L1 items
  header.querySelectorAll('.header-dropdown-menu li.has-dropdown-level1').forEach((li) => {
    const l1Link = li.querySelector(':scope > a');
    const l1Dropdown = li.querySelector(':scope > .header-sub-dropdown');

    if (l1Link && l1Dropdown) {
      l1Link.setAttribute('aria-haspopup', 'true');
      l1Link.setAttribute('aria-expanded', 'false');

      if (window.innerWidth >= 900) { // Desktop: hover for L1
        li.addEventListener('mouseenter', () => {
          toggleDropdown(l1Link, l1Dropdown, true);
        });
        li.addEventListener('mouseleave', () => {
          const isAnyL2Open = li.querySelector('.header-sub-dropdown-level2.is-open');
          if (!isAnyL2Open) { // Only close L1 if no L2 is open
            toggleDropdown(l1Link, l1Dropdown, false);
          }
        });
      } else { // Mobile: click for L1
        l1Link.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = l1Dropdown.classList.contains('is-open');
          toggleDropdown(l1Link, l1Dropdown, !isOpen);
        });
      }
    }
  });

  // Setup L2 items
  header.querySelectorAll('.header-sub-dropdown li.has-dropdown-level2').forEach((li) => {
    const l2Link = li.querySelector(':scope > a');
    const l2Dropdown = li.querySelector(':scope > .header-sub-dropdown-level2');

    if (l2Link && l2Dropdown) {
      l2Link.setAttribute('aria-haspopup', 'true');
      l2Link.setAttribute('aria-expanded', 'false');

      if (window.innerWidth >= 900) { // Desktop: hover for L2
        li.addEventListener('mouseenter', () => {
          toggleDropdown(l2Link, l2Dropdown, true);
        });
        li.addEventListener('mouseleave', () => {
          toggleDropdown(l2Link, l2Dropdown, false);
        });
      } else { // Mobile: click for L2
        l2Link.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = l2Dropdown.classList.contains('is-open');
          toggleDropdown(l2Link, l2Dropdown, !isOpen);
        });
      }
    }
  });

  // Global click to close L0 menus on desktop
  if (window.innerWidth >= 900) {
    document.addEventListener('click', (e) => {
      const isClickInsideHeader = header.contains(e.target);
      const isSearchOpen = header.querySelector('.header-tools .search .search-screen-wrap.is-open');
      if (!isClickInsideHeader && !isSearchOpen) {
        closeAllDropdowns(header);
      }
    });
  }

  // Search Toggle
  const searchTool = header.querySelector('.header-tools .header-tool-item.search');
  if (searchTool) {
    const searchLink = searchTool.querySelector('a');
    const searchScreenWrap = searchTool.querySelector('.search-screen-wrap');
    if (searchLink && searchScreenWrap) {
        const searchIcon = searchLink.querySelector('svg.lens');
        const closeIcon = searchLink.querySelector('svg.close');

        searchLink.setAttribute('aria-expanded', 'false');
        searchLink.setAttribute('aria-label', 'Open Search');

        const toggleSearch = (dropdownElement, linkElement, open) => {
            dropdownElement.classList.toggle('is-open', open);
            linkElement.setAttribute('aria-expanded', open);
            linkElement.setAttribute('aria-label', open ? 'Close Search' : 'Open Search');
            if (searchIcon) searchIcon.style.display = open ? 'none' : 'block';
            if (closeIcon) closeIcon.style.display = open ? 'block' : 'none';
            document.body.classList.toggle('scroll-locked', open);

            if (open) {
                // Close mobile nav if open
                const mobileMenuToggle = header.querySelector('.hamburger');
                if (mobileMenuToggle && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                    mobileMenuToggle.click();
                }
                // Close any open L0 dropdowns
                closeAllDropdowns(header);
            }
        };

        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = searchScreenWrap.classList.contains('is-open');
            toggleSearch(searchScreenWrap, searchLink, !isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchScreenWrap.classList.contains('is-open')) {
                toggleSearch(searchScreenWrap, searchLink, false);
            }
        });

        document.addEventListener('click', (e) => {
            if (searchScreenWrap.classList.contains('is-open') && !searchTool.contains(e.target)) {
                toggleSearch(searchScreenWrap, searchLink, false);
            }
        });
    }
  }
}