import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 992px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;

    const expandedMegaMenu = navSections.querySelector('.mega-menu.open');
    if (expandedMegaMenu) {
      expandedMegaMenu.classList.remove('open');
      expandedMegaMenu.closest('li').querySelector('a').focus();
      expandedMegaMenu.closest('li').setAttribute('aria-expanded', 'false');
      return;
    }

    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.setAttribute('aria-expanded', 'false');
      navSectionExpanded.querySelector('a').focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      navSectionExpanded.setAttribute('aria-expanded', 'false');
      navSectionExpanded.querySelector('.mega-menu')?.classList.remove('open');
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function setupAccessibility(nav) {
  nav.querySelectorAll('li.has-child > a').forEach((link) => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const li = link.closest('li');
        const isExpanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        li.querySelector('.mega-menu')?.classList.toggle('open', !isExpanded);
      }
    });
  });

  nav.querySelectorAll('.mega-menu a').forEach((link) => {
    link.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        const megaMenu = link.closest('.mega-menu');
        if (megaMenu) {
          megaMenu.classList.remove('open');
          const parentLi = megaMenu.closest('li');
          if (parentLi) {
            parentLi.setAttribute('aria-expanded', 'false');
            parentLi.querySelector('a').focus();
          }
        }
      }
    });
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');

  // Close all mega menus when mobile nav is toggled
  navSections.querySelectorAll('.mega-menu').forEach((menu) => menu.classList.remove('open'));
  navSections.querySelectorAll('li.has-child').forEach((li) => li.setAttribute('aria-expanded', 'false'));
  navSections.querySelectorAll('li.has-child > span').forEach((span) => span.classList.remove('active'));

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function setupDesktopNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  navSections.querySelectorAll('li.has-child').forEach((li) => {
    const link = li.querySelector('a');
    const megaMenu = li.querySelector('.mega-menu');
    if (link && megaMenu) {
      link.addEventListener('mouseenter', () => {
        if (isDesktop.matches) {
          navSections.querySelectorAll('li.has-child').forEach((otherLi) => {
            if (otherLi !== li) {
              otherLi.setAttribute('aria-expanded', 'false');
              otherLi.querySelector('.mega-menu')?.classList.remove('open');
            }
          });
          li.setAttribute('aria-expanded', 'true');
          megaMenu.classList.add('open');
        }
      });

      li.addEventListener('mouseleave', () => {
        if (isDesktop.matches && !li.contains(document.activeElement)) {
          li.setAttribute('aria-expanded', 'false');
          megaMenu.classList.remove('open');
        }
      });

      // Handle nested dropdowns for desktop
      megaMenu.querySelectorAll('.top-level-li').forEach((subChild) => {
        const subChildLink = subChild.querySelector('a');
        const innerSubChild = subChild.querySelector('.has-sub-child'); // First level nested ul wrapper
        if (subChildLink && innerSubChild) {
          subChildLink.addEventListener('mouseenter', () => {
            if (isDesktop.matches) {
              subChild.closest('ul').querySelectorAll('.top-level-li').forEach((otherSubChild) => {
                if (otherSubChild !== subChild) {
                  otherSubChild.classList.remove('active');
                  otherSubChild.querySelector('.has-sub-child')?.classList.remove('active');
                }
              });
              subChild.classList.add('active');
              innerSubChild.classList.add('active');
            }
          });
        }
      });

      megaMenu.querySelectorAll('.first-level-li').forEach((subChild) => {
        const subChildLink = subChild.querySelector('a');
        const innerSubChild = subChild.querySelector('.has-inner-sub-child'); // Second level nested ul wrapper
        if (subChildLink && innerSubChild) {
          subChildLink.addEventListener('mouseenter', () => {
            if (isDesktop.matches) {
              subChild.closest('ul').querySelectorAll('.first-level-li').forEach((otherSubChild) => {
                if (otherSubChild !== subChild) {
                  otherSubChild.classList.remove('active');
                  otherSubChild.querySelector('.has-inner-sub-child')?.classList.remove('active-child');
                }
              });
              subChild.classList.add('active');
              innerSubChild.classList.add('active-child');
            }
          });
        }
      });
    }
  });

  // Close mega menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) {
      navSections.querySelectorAll('li.has-child').forEach((li) => {
        li.setAttribute('aria-expanded', 'false');
        li.querySelector('.mega-menu')?.classList.remove('open');
        li.querySelectorAll('.top-level-li').forEach((topLi) => {
          topLi.classList.remove('active');
          topLi.querySelector('.has-sub-child')?.classList.remove('active');
        });
        li.querySelectorAll('.first-level-li').forEach((firstLi) => {
          firstLi.classList.remove('active');
          firstLi.querySelector('.has-inner-sub-child')?.classList.remove('active-child');
        });
      });
    }
  });
}

function setupMobileNav(nav) {
  const navSections = nav.querySelector('.nav-sections');
  if (!navSections) return;

  // Hamburger menu setup
  const hamburger = nav.querySelector('.nav-hamburger');
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Accordion for mobile navigation
  navSections.querySelectorAll('li.has-child').forEach((li) => {
    const link = li.querySelector('a');
    const megaMenu = li.querySelector('.mega-menu');
    const expandToggle = li.querySelector('span'); // The SVG span

    if (link && megaMenu && expandToggle) {
      expandToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = li.getAttribute('aria-expanded') === 'true';

        // Close other open mega menus at the same level
        li.closest('ul').querySelectorAll('li.has-child').forEach((otherLi) => {
          if (otherLi !== li) {
            otherLi.setAttribute('aria-expanded', 'false');
            otherLi.querySelector('.mega-menu')?.classList.remove('open');
            otherLi.querySelector('span')?.classList.remove('active');
            // Close nested items within other top-level items
            otherLi.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((nestedMenu) => {
              nestedMenu.classList.remove('active', 'active-child');
            });
            otherLi.querySelectorAll('.top-level-li, .first-level-li').forEach((nestedLi) => {
              nestedLi.classList.remove('active');
              nestedLi.querySelector('span')?.classList.remove('active');
            });
          }
        });

        li.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        megaMenu.classList.toggle('open', !isExpanded);
        expandToggle.classList.toggle('active', !isExpanded);
      });

      // Handle nested accordions for mobile
      megaMenu.querySelectorAll('.top-level-li').forEach((topLevelLi) => {
        const subChildToggle = topLevelLi.querySelector('span');
        const hasSubChild = topLevelLi.querySelector('.has-sub-child');
        if (subChildToggle && hasSubChild) {
          subChildToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = hasSubChild.classList.contains('active');

            topLevelLi.closest('ul').querySelectorAll('.top-level-li').forEach((otherTopLevelLi) => {
              if (otherTopLevelLi !== topLevelLi) {
                otherTopLevelLi.querySelector('.has-sub-child')?.classList.remove('active');
                otherTopLevelLi.querySelector('span')?.classList.remove('active');
                otherTopLevelLi.querySelectorAll('.has-inner-sub-child').forEach((innerMenu) => {
                  innerMenu.classList.remove('active-child');
                  innerMenu.closest('.first-level-li')?.querySelector('span')?.classList.remove('active');
                });
              }
            });

            hasSubChild.classList.toggle('active', !isActive);
            subChildToggle.classList.toggle('active', !isActive);
          });
        }
      });

      megaMenu.querySelectorAll('.first-level-li').forEach((firstLevelLi) => {
        const innerSubChildToggle = firstLevelLi.querySelector('span');
        const hasInnerSubChild = firstLevelLi.querySelector('.has-inner-sub-child');
        if (innerSubChildToggle && hasInnerSubChild) {
          innerSubChildToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isInnerActive = hasInnerSubChild.classList.contains('active-child');

            firstLevelLi.closest('ul').querySelectorAll('.first-level-li').forEach((otherFirstLevelLi) => {
              if (otherFirstLevelLi !== firstLevelLi) {
                otherFirstLevelLi.querySelector('.has-inner-sub-child')?.classList.remove('active-child');
                otherFirstLevelLi.querySelector('span')?.classList.remove('active');
              }
            });

            hasInnerSubChild.classList.toggle('active-child', !isInnerActive);
            innerSubChildToggle.classList.toggle('active', !isInnerActive);
          });
        }
      });
    }
  });

  // Mobile search toggle
  const mobileSearchLi = nav.querySelector('.mobile-menus-icon .search');
  const searchScreenWrap = mobileSearchLi?.querySelector('.search-screen-wrap');
  if (mobileSearchLi && searchScreenWrap) {
    const searchLink = mobileSearchLi.querySelector('a');
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isSearchOpen = searchScreenWrap.classList.contains('open');
      searchScreenWrap.classList.toggle('open', !isSearchOpen);
      mobileSearchLi.classList.toggle('active', !isSearchOpen);
      if (!isSearchOpen) {
        document.body.style.overflowY = 'hidden';
      } else {
        document.body.style.overflowY = '';
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileSearchLi.contains(e.target) && searchScreenWrap.classList.contains('open')) {
        searchScreenWrap.classList.remove('open');
        mobileSearchLi.classList.remove('active');
        document.body.style.overflowY = '';
      }
    });
  }
}

function parseStructure(nav) {
  const sections = Array.from(nav.children);
  let brandSection = null;
  let navSections = null;
  let toolsSection = null;

  sections.forEach((section) => {
    if (section.querySelector('picture')) { // Check for picture element for logo
      brandSection = section;
      brandSection.classList.add('nav-brand');
    } else if (section.querySelector('ul')) {
      navSections = section;
      navSections.classList.add('nav-sections');
    } else if (section.querySelector('.button-wrapper') || section.querySelector('a[href*="social"]')) {
      toolsSection = section;
      toolsSection.classList.add('nav-tools');
    }
  });

  if (!navSections && sections.length > 1) {
    const potentialNav = sections.find(s => s !== brandSection && s !== toolsSection && s.querySelector('ul'));
    if (potentialNav) {
      navSections = potentialNav;
      navSections.classList.add('nav-sections');
    }
  }

  sections.forEach(section => {
    if (!section.classList.contains('default-content-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('default-content-wrapper');
      Array.from(section.children).forEach(child => wrapper.append(child));
      section.append(wrapper);
    }
  });

  if (brandSection) {
    const logoDiv = brandSection.querySelector('p:has(picture)');
    if (logoDiv) {
      const logoLink = document.createElement('a');
      logoLink.href = '/';
      logoLink.append(logoDiv.querySelector('picture'));
      logoDiv.replaceWith(logoLink);
      logoLink.closest('.default-content-wrapper').classList.add('logo');
    }
  }

  if (navSections) {
    const mainUl = document.createElement('ul');
    mainUl.setAttribute('itemscope', '');
    mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

    Array.from(navSections.children).forEach((child) => {
      if (child.matches('p:has(a.button)') || child.matches('ul')) {
        const tempDiv = document.createElement('div');
        tempDiv.append(child);

        const buttonWrapper = tempDiv.querySelector('p:has(a.button)');
        if (buttonWrapper) {
          const li = document.createElement('li');
          li.classList.add('has-child', 'hover-red');
          const link = buttonWrapper.querySelector('a');
          if (link) {
            link.setAttribute('itemprop', 'url');
            li.append(link);
            const span = document.createElement('span');
            span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
            li.append(span);
            mainUl.append(li);
          }
        }

        const ul = tempDiv.querySelector('ul');
        if (ul) {
          const lastLi = mainUl.lastElementChild;
          if (lastLi) {
            const megaMenu = document.createElement('div');
            megaMenu.classList.add('mega-menu');
            const wrapContainer = document.createElement('div');
            wrapContainer.classList.add('wrap', 'container');
            const centerDiv = document.createElement('div');
            centerDiv.classList.add('center-div');

            // Find the first div in the ul to be the left-div content
            const leftDivContent = Array.from(ul.children).find(item => item.tagName === 'DIV');
            if (leftDivContent) {
              const leftDiv = document.createElement('div');
              leftDiv.classList.add('left-div');
              leftDiv.innerHTML = leftDivContent.innerHTML; // Copy content directly
              centerDiv.append(leftDiv);
              leftDivContent.remove(); // Remove from original ul
            }

            const subNavWrap = document.createElement('div');
            subNavWrap.classList.add('sub-nav-wrap');

            // Add specific classes to subNavWrap based on the main link text
            const mainLinkText = lastLi.querySelector('a')?.textContent.toLowerCase();
            if (mainLinkText?.includes('who we are')) {
              subNavWrap.classList.add('about-us-sub-nav');
            } else if (mainLinkText?.includes('what we do')) {
              subNavWrap.classList.add('what-we-do');
            } else if (mainLinkText?.includes('investor relations')) {
              subNavWrap.classList.add('element-block');
            } else if (mainLinkText?.includes('careers')) {
              subNavWrap.classList.add('careers-div');
            }

            const processNestedUl = (currentUl, parentElement, level = 0) => {
              Array.from(currentUl.children).forEach((li) => {
                const newLi = document.createElement('li');
                const link = li.querySelector('a');
                if (link) {
                  newLi.append(link);
                } else {
                  newLi.textContent = li.firstChild.textContent;
                }

                const nestedUl = li.querySelector('ul');
                if (nestedUl) {
                  const span = document.createElement('span');
                  span.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
                  newLi.append(span);

                  const subMenuDiv = document.createElement('div');
                  if (level === 0) {
                    subMenuDiv.classList.add('has-sub-child');
                    newLi.classList.add('top-level-li');
                  } else if (level === 1) {
                    subMenuDiv.classList.add('has-inner-sub-child');
                    newLi.classList.add('first-level-li');
                  }
                  const innerUl = document.createElement('ul');
                  processNestedUl(nestedUl, innerUl, level + 1);
                  subMenuDiv.append(innerUl);
                  newLi.append(subMenuDiv);
                }
                parentElement.append(newLi);
              });
            };

            const rootUl = document.createElement('ul');
            processNestedUl(ul, rootUl);
            subNavWrap.append(rootUl);

            // Special handling for Investor Relations to split into two ULs
            if (mainLinkText?.includes('investor relations')) {
              const innerSubNavWrapList = document.createElement('div');
              innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');

              const allLis = Array.from(rootUl.children);
              const firstUl = document.createElement('ul');
              const secondUl = document.createElement('ul');

              // Assuming the first item is a special link, and the rest split
              if (allLis.length > 0) {
                firstUl.append(allLis[0]); // First item goes to the first UL
              }
              for (let i = 1; i < allLis.length; i++) {
                secondUl.append(allLis[i]); // Remaining items go to the second UL
              }

              subNavWrap.innerHTML = '';
              subNavWrap.append(firstUl);
              innerSubNavWrapList.append(secondUl);
              subNavWrap.append(innerSubNavWrapList);
            }

            centerDiv.append(subNavWrap);
            wrapContainer.append(centerDiv);
            megaMenu.append(wrapContainer);
            lastLi.append(megaMenu);
          }
        }
      }
    });
    navSections.innerHTML = '';
    navSections.append(mainUl);
  }

  if (toolsSection) {
    const iconNavMobile = document.createElement('div');
    iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
    const mobileUl = document.createElement('ul');
    iconNavMobile.append(mobileUl);

    const iconNavDesktop = document.createElement('div');
    iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
    const desktopUl = document.createElement('ul');
    iconNavDesktop.append(desktopUl);

    Array.from(toolsSection.children).forEach((child) => {
      if (child.matches('ul')) {
        Array.from(child.children).forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const mobileLi = document.createElement('li');
            const desktopLi = document.createElement('li');

            if (link.textContent.toLowerCase() === 'contact us') {
              mobileLi.classList.add('mail');
              mobileLi.innerHTML = `<a href="${link.href}">${link.textContent}</a>`;
              desktopLi.classList.add('mail');
              desktopLi.innerHTML = `<a href="${link.href}"><svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg></a>`;
            } else if (link.textContent.toLowerCase() === 'search') {
              mobileLi.classList.add('search');
              desktopLi.classList.add('search');

              // Assuming the search structure is provided within the fragment's li for search
              // This should be dynamically loaded or constructed based on the fragment content
              const searchContent = li.innerHTML;
              mobileLi.innerHTML = searchContent;
              desktopLi.innerHTML = searchContent;
            } else {
              mobileLi.append(link.cloneNode(true));
              desktopLi.append(link.cloneNode(true));
            }
            mobileUl.append(mobileLi);
            desktopUl.append(desktopLi);
          }
        });
      }
    });

    toolsSection.innerHTML = '';
    toolsSection.append(iconNavMobile, iconNavDesktop);
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger', 'nav-hamburger');
  hamburger.innerHTML = '<ul><li></li><li></li><li></li></ul><button type="button" aria-controls="nav" aria-label="Open navigation" class="sr-only"></button>';
  nav.prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('main-nav');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  Array.from(nav.children).forEach(child => wrapDiv.append(child));
  containerDiv.append(wrapDiv);
  nav.append(containerDiv);

  parseStructure(nav);
  setupDesktopNav(nav);
  setupMobileNav(nav);
  setupAccessibility(nav);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Add the 80th year logo if it exists in the original HTML and is part of the fragment
  const year80LogoElement = fragment.querySelector('.logo.year-80-logo');
  if (year80LogoElement) {
    wrapDiv.append(year80LogoElement.cloneNode(true));
  }
}
