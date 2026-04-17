import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// AEM site's sprite paths, extracted from the raw HTML
const SPRITE_PATH = '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg';

/**
 * Determines the appropriate text for a link, falling back to a map if generic.
 * @param {HTMLAnchorElement} linkElement The anchor element to get text from.
 * @param {Object} urlToLabelMap A map of URLs to desired labels.
 * @returns {string} The resolved text content.
 */
function getLinkText(linkElement, urlToLabelMap) {
    const defaultText = linkElement.textContent.trim();
    const url = linkElement.getAttribute('href');
    // If the default text is generic ('Button', 'Link') or empty, try to get a better label from the map.
    if (url && urlToLabelMap[url] && (defaultText === 'Button' || defaultText === 'Link' || defaultText === '')) {
        return urlToLabelMap[url];
    }
    return defaultText;
}

/**
 * Sets up dropdown interactions (hover for desktop, click for mobile) recursively.
 * @param {HTMLElement} parentMenu The <ul> element containing menu items.
 * @param {Object} urlToLabelMap Map for smart labeling.
 * @param {boolean} isMobile Whether to apply mobile (click) interactions.
 */
function setupDropdowns(parentMenu, urlToLabelMap, isMobile) {
    parentMenu.querySelectorAll(':scope > li.has-dropdown').forEach((li) => {
        const primaryLink = li.querySelector(':scope > a');
        const dropdownContent = li.querySelector(':scope > ul');

        if (!primaryLink || !dropdownContent) return;

        primaryLink.setAttribute('aria-haspopup', 'true');
        primaryLink.setAttribute('aria-expanded', 'false');
        dropdownContent.setAttribute('aria-hidden', 'true'); // Hidden by default

        const toggleDropdown = (open) => {
            if (open) {
                // Close other dropdowns at the same level (L0 or L1)
                Array.from(li.parentNode.children).forEach((sibling) => {
                    if (sibling !== li && sibling.classList.contains('has-dropdown')) {
                        const siblingLink = sibling.querySelector(':scope > a');
                        if (siblingLink) siblingLink.setAttribute('aria-expanded', 'false');
                        sibling.classList.remove('is-open');
                        sibling.querySelector(':scope > ul')?.setAttribute('aria-hidden', 'true');
                    }
                });
                li.classList.add('is-open');
                primaryLink.setAttribute('aria-expanded', 'true');
                dropdownContent.setAttribute('aria-hidden', 'false');
            } else {
                li.classList.remove('is-open');
                primaryLink.setAttribute('aria-expanded', 'false');
                dropdownContent.setAttribute('aria-hidden', 'true');
            }
        };

        if (isMobile) {
            primaryLink.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = li.classList.contains('is-open');
                toggleDropdown(!isOpen);
            });
        } else {
            // Desktop hover interactions
            let timeout;
            li.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                toggleDropdown(true);
            });
            li.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    toggleDropdown(false);
                }, 200);
            });
        }

        // Recursively set up dropdowns for nested Uls (L2, L3 etc.)
        setupDropdowns(dropdownContent, urlToLabelMap, isMobile); // Pass isMobile recursively
    });
}

export default async function decorate(block) {
    // Clear existing block content for idempotency
    block.textContent = '';
    block.classList.add('header-block'); // Add a base class for the block itself

    // Load the navigation fragment
    const navContent = await loadFragment('/nav');
    if (!navContent) {
        block.remove();
        return;
    }

    // Create the main header structure
    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add('header-wrapper');

    const headerBrand = document.createElement('div');
    headerBrand.classList.add('header-brand');
    const headerNav = document.createElement('nav');
    headerNav.classList.add('header-nav');
    const headerTools = document.createElement('div');
    headerTools.classList.add('header-tools');

    const desktopNavList = document.createElement('ul');
    desktopNavList.classList.add('header-nav-list');
    headerNav.append(desktopNavList);

    const mobileNavList = document.createElement('ul'); // Separate list for mobile menu
    mobileNavList.classList.add('header-mobile-nav-list');

    // --- Build URL to Label Map for smart labeling from expected /nav fragment URLs ---
    // This map provides the "smart labels" for generic "Button" text from the fragment
    const urlToLabelMap = {
        '/': 'Home',
        '/our-products.html': 'Our Products',
        '/our-story.html': 'Our Story',
        '/recipe-listing.html': 'Recipes', // Assuming a shorter name for display
        '/blogs.html': 'Blogs',
        '/csr-initiatives.html': 'CSR Initiatives',
        '/faqs.html': 'FAQs',
        // Common L0 from actual dev site for robust mapping if fragment uses generic links
        '/term-insurance': 'Term Insurance',
        '/savings-and-investment-plans': 'Investment Plans',
        '/product-list': 'All Plans',
        '#customer-service-main': 'Customer Service', // Placeholder for a main nav item without direct href
        '#investor-relations-main': 'Investor Relations', // Placeholder
        // Tools specific links
        'https://customer.canarahsbclife.com/login': 'Login',
        // Other specific links from the raw HTML structure for full fidelity, e.g., for L1/L2 items
        'https://buyonlineinsurance.canarahsbclife.com/youngTermPlan/?source=website': '1 Crore Term Insurance',
        '/tools-and-calculators/term-insurance-calculator': 'Term Insurance Calculator',
        '/term-insurance/iselect-smart360-term-plan': 'iSelect Smart360 Term Plan',
        '/term-insurance/young-term-plan': 'Young Term Plan',
        // ... (add more from a comprehensive scan of the original site's navigation if necessary)
    };

    let brandContentProcessed = false;

    // Process navContent sections to extract navigation and logo
    Array.from(navContent.children).forEach((section) => {
        // Skip truly empty sections or sections with only whitespace in P tags
        const sectionText = section.textContent.trim();
        if (!sectionText && section.children.length === 0) return;
        if (section.children.length === 1 && section.firstElementChild?.tagName === 'P' && section.firstElementChild?.textContent.trim() === '') return;

        // 1. Identify and process the Logo
        if (!brandContentProcessed) {
            const logoLink = section.querySelector('a img');
            if (logoLink) {
                const a = logoLink.closest('a');
                if (a) {
                    const brandLink = document.createElement('a');
                    brandLink.href = a.href;
                    brandLink.innerHTML = a.innerHTML; // Copy img and any other content inside <a>
                    brandLink.title = urlToLabelMap[a.href] || 'Home';
                    brandLink.ariaLabel = brandLink.title;
                    headerBrand.append(brandLink);
                    brandContentProcessed = true;
                    // Note: Not removing section here, as the fragment might be complex
                    return; // Done with brand, move to next section
                }
            }
        }

        // 2. Identify and process Main Navigation items
        // Look for sections containing a top-level link (potentially in a <p>) or a direct <a>
        const primaryLinkWrapper = section.querySelector('p > a:only-child'); // L0 wrapped in <p>
        const directPrimaryLink = section.querySelector(':scope > a:only-child'); // L0 direct child of section
        const L0LinkElement = primaryLinkWrapper || directPrimaryLink;

        if (L0LinkElement) {
            const li = document.createElement('li');
            const linkA = document.createElement('a');
            linkA.href = L0LinkElement.getAttribute('href') || '#';
            linkA.textContent = getLinkText(L0LinkElement, urlToLabelMap);
            linkA.title = linkA.textContent;
            linkA.ariaLabel = linkA.textContent;
            li.append(linkA);

            const candidateNestedUl = section.querySelector(':scope > ul'); // Check for UL directly under section
            if (candidateNestedUl) {
                li.classList.add('has-dropdown');
                const dropdownUl = document.createElement('ul');
                dropdownUl.classList.add('header-nav-dropdown'); // L1

                Array.from(candidateNestedUl.children).forEach(childLi => {
                    const subLi = document.createElement('li');
                    const childLink = childLi.querySelector(':scope > a'); // L1 link

                    if (childLink) {
                        const subLinkA = document.createElement('a');
                        subLinkA.href = childLink.getAttribute('href');
                        subLinkA.textContent = getLinkText(childLink, urlToLabelMap);
                        subLinkA.title = subLinkA.textContent;
                        subLinkA.ariaLabel = subLinkA.textContent;
                        subLi.append(subLinkA);
                    } else if (childLi.textContent.trim()) {
                        // Handle L1 item that is just text, not a link (e.g., "Atta" text node in sample fragment)
                        const nonLinkSpan = document.createElement('span'); // Use span for non-clickable text
                        nonLinkSpan.textContent = childLi.textContent.trim();
                        subLi.append(nonLinkSpan);
                    } else {
                        return; // Skip empty L1 list items
                    }

                    const childNestedUl = childLi.querySelector(':scope > ul'); // L2 UL
                    if (childNestedUl) {
                        subLi.classList.add('has-dropdown');
                        const subDropdownUl = document.createElement('ul');
                        subDropdownUl.classList.add('header-nav-sub-dropdown'); // L2

                        Array.from(childNestedUl.children).forEach(subSubLi => {
                            const subSubLiElement = document.createElement('li');
                            const subSubLink = subSubLi.querySelector(':scope > a'); // L2 link
                            if (subSubLink) {
                                const subSubLinkA = document.createElement('a');
                                subSubLinkA.href = subSubLink.getAttribute('href');
                                subSubLinkA.textContent = getLinkText(subSubLink, urlToLabelMap);
                                subSubLinkA.title = subSubLinkA.textContent;
                                subSubLinkA.ariaLabel = subSubLinkA.textContent;
                                subSubLiElement.append(subSubLinkA);
                            } else if (subSubLi.textContent.trim()) {
                                const nonLinkSpan = document.createElement('span');
                                nonLinkSpan.textContent = subSubLi.textContent.trim();
                                subSubLiElement.append(nonLinkSpan);
                            } else {
                                return; // Skip empty L2 list items
                            }
                            subDropdownUl.append(subSubLiElement);
                        });
                        subLi.append(subDropdownUl);
                    }
                    dropdownUl.append(subLi);
                });
                li.append(dropdownUl);
            }
            // Add to both desktop and mobile lists
            desktopNavList.append(li);
            // Deep clone for mobile to ensure distinct state management and DOM manipulation
            mobileNavList.append(li.cloneNode(true));
            return;
        }

        // Remaining sections from navContent are considered noise or non-nav content and are ignored.
        // Tools are hardcoded as per the original site's design for high fidelity.
    });

    // --- Dynamically create Tool Elements (Search, Notifications, Login) as per Raw HTML Design ---
    // These are recreated because the fragment is unlikely to have these complex, styled elements directly.

    // Search Tool
    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('header-tool-item', 'header-search');
    searchWrapper.innerHTML = `
        <button class="header-search-toggle" aria-label="Search" aria-expanded="false">
            <svg aria-hidden="true" role="icon"><use xlink:href="${SPRITE_PATH}#search"></use></svg>
        </button>
        <div class="header-search-overlay" aria-hidden="true">
            <form class="global__search--form">
                <input type="search" placeholder="Search" class="global__search--input">
                <button type="submit" aria-label="Submit Search">
                     <svg role="img"><use xlink:href="${SPRITE_PATH}#arrow-right"></use></svg>
                </button>
                <button type="button" class="close-search" aria-label="Close search">x</button>
            </form>
            <div class="global__search--popular">
                 <h3>Popular Searches</h3>
                 <ul>
                    <li>Term Insurance</li>
                    <li>Life Insurance Plans</li>
                    <li>Savings &amp; Investment Plan</li>
                 </ul>
            </div>
        </div>
    `;
    headerTools.append(searchWrapper);

    // Notifications Tool
    const notificationWrapper = document.createElement('div');
    notificationWrapper.classList.add('header-tool-item', 'header-notification');
    notificationWrapper.innerHTML = `
        <button class="header-notification-toggle" aria-label="Notifications" aria-expanded="false">
            <span class="header-notification-count">1</span>
            <svg aria-hidden="true" role="icon"><use xlink:href="${SPRITE_PATH}#bell-icon"></use></svg>
        </button>
        <div class="header-notification-panel" aria-hidden="true">
            <h4>Notifications</h4>
            <section><a href="https://customer.canarahsbclife.com/login">Promise4Growth Plus Just Got Stronger</a></section>
            <section><a href="/savings-and-investment-plans/iselect-guaranteed-future-plus">iSelect Guaranteed Future Plus</a></section>
            <section><a href="https://customer.canarahsbclife.com/PremiumPayment">Pay Your Premiums Instantly</a></section>
        </div>
    `;
    headerTools.append(notificationWrapper);

    // Login Tool
    const loginLink = document.createElement('a');
    loginLink.href = 'https://customer.canarahsbclife.com/login';
    loginLink.target = '_blank';
    loginLink.classList.add('header-tool-item', 'header-login');
    loginLink.innerHTML = `
        <svg aria-hidden="true" role="icon"><use xlink:href="${SPRITE_PATH}#user-icon"></use></svg>
        <span class="header-login-text">${urlToLabelMap['https://customer.canarahsbclife.com/login'] || 'Login'}</span>
    `;
    headerTools.append(loginLink);

    // Hamburger Toggle (mobile-only button)
    const hamburgerToggle = document.createElement('button');
    hamburgerToggle.classList.add('header-hamburger-toggle');
    hamburgerToggle.setAttribute('aria-label', 'Open navigation');
    hamburgerToggle.setAttribute('aria-expanded', 'false');
    hamburgerToggle.innerHTML = `
        <svg class="header-hamburger-open" aria-hidden="true" role="icon"><use xlink:href="${SPRITE_PATH}#hamburger-icon"></use></svg>
        <svg class="header-hamburger-close" aria-hidden="true" role="icon"><use xlink:href="${SPRITE_PATH}#close"></use></svg>
    `;
    headerTools.append(hamburgerToggle); // Add to tools, but positioned differently by CSS

    // Mobile Menu Overlay and Content
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.classList.add('header-mobile-menu-overlay');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true'); // Hidden by default
    const mobileMenu = document.createElement('nav');
    mobileMenu.classList.add('header-mobile-menu');
    mobileMenu.append(mobileNavList); // Append the dedicated mobile menu items
    mobileMenuOverlay.append(mobileMenu);
    headerWrapper.append(mobileMenuOverlay); // Mobile menu is a sibling to header-main-wrapper for full screen overlay

    // Final assembly of the main header-wrapper
    headerWrapper.append(headerBrand, headerNav, headerTools);
    block.append(headerWrapper);


    // --- Interaction Logic ---

    // Define mobile breakpoint
    const MOBILE_BREAKPOINT = 900; // Corresponds to --breakpoint-lg in CSS

    /**
     * Closes all interactive header elements (dropdowns, search, notifications, mobile menu).
     * @param {HTMLElement} [excludeElement=null] An element to exclude from closing (e.g., the one just clicked).
     */
    const closeAllInteractiveElements = (excludeElement = null) => {
        // Close desktop nav dropdowns
        desktopNavList.querySelectorAll('li.has-dropdown.is-open').forEach((li) => {
            if (!excludeElement || !li.contains(excludeElement)) {
                li.classList.remove('is-open');
                li.querySelector('a')?.setAttribute('aria-expanded', 'false');
                li.querySelector('ul')?.setAttribute('aria-hidden', 'true');
            }
        });

        // Close search overlay
        if (searchWrapper.classList.contains('is-open') && (!excludeElement || !searchWrapper.contains(excludeElement))) {
            searchWrapper.classList.remove('is-open');
            searchWrapper.querySelector('.header-search-toggle')?.setAttribute('aria-expanded', 'false');
            searchWrapper.querySelector('.header-search-overlay')?.setAttribute('aria-hidden', 'true');
        }

        // Close notification panel
        if (notificationWrapper.classList.contains('is-open') && (!excludeElement || !notificationWrapper.contains(excludeElement))) {
            notificationWrapper.classList.remove('is-open');
            notificationWrapper.querySelector('.header-notification-toggle')?.setAttribute('aria-expanded', 'false');
            notificationWrapper.querySelector('.header-notification-panel')?.setAttribute('aria-hidden', 'true');
        }

        // Close mobile menu
        if (mobileMenuOverlay.classList.contains('is-open') && (!excludeElement || !mobileMenuOverlay.contains(excludeElement))) {
            mobileMenuOverlay.classList.remove('is-open');
            mobileMenuOverlay.setAttribute('aria-hidden', 'true');
            hamburgerToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            // Also close any open mobile nav dropdowns
            mobileNavList.querySelectorAll('li.has-dropdown.is-open').forEach((li) => {
                li.classList.remove('is-open');
                li.querySelector('a')?.setAttribute('aria-expanded', 'false');
                li.querySelector('ul')?.setAttribute('aria-hidden', 'true');
            });
        }
    };


    // Close on Escape for entire header block
    block.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllInteractiveElements();
        }
    });

    // Close on Outside Click
    document.addEventListener('click', (e) => {
        if (!block.contains(e.target)) {
            closeAllInteractiveElements();
        }
    });

    // Hamburger Toggle
    hamburgerToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing it
        const isOpen = mobileMenuOverlay.classList.contains('is-open');
        if (isOpen) {
            closeAllInteractiveElements(hamburgerToggle); // Close everything but the toggle itself
        } else {
            closeAllInteractiveElements(); // Close anything else that might be open first
            mobileMenuOverlay.classList.add('is-open');
            mobileMenuOverlay.setAttribute('aria-hidden', 'false');
            hamburgerToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
        }
    });

    // Mobile menu overlay click closes it
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) { // Only close if clicking the overlay itself, not children
            closeAllInteractiveElements();
        }
    });

    // Search Toggle
    const searchToggleButton = searchWrapper.querySelector('.header-search-toggle');
    const searchOverlayDiv = searchWrapper.querySelector('.header-search-overlay');
    const closeSearchButton = searchWrapper.querySelector('.close-search');

    searchToggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = searchWrapper.classList.contains('is-open');
        if (isOpen) {
            closeAllInteractiveElements(searchWrapper); // Close everything but the search itself
        } else {
            closeAllInteractiveElements(); // Close anything else that might be open
            searchWrapper.classList.add('is-open');
            searchToggleButton.setAttribute('aria-expanded', 'true');
            searchOverlayDiv.setAttribute('aria-hidden', 'false');
            searchOverlayDiv.querySelector('.global__search--input').focus();
        }
    });

    closeSearchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllInteractiveElements();
    });

    searchOverlayDiv.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent clicks inside search overlay from propagating to document
    });


    // Notification Toggle
    const notificationToggleButton = notificationWrapper.querySelector('.header-notification-toggle');
    const notificationPanel = notificationWrapper.querySelector('.header-notification-panel');

    notificationToggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notificationWrapper.classList.contains('is-open');
        if (isOpen) {
            closeAllInteractiveElements(notificationWrapper); // Close everything but the notification itself
        } else {
            closeAllInteractiveElements(); // Close anything else that might be open
            notificationWrapper.classList.add('is-open');
            notificationToggleButton.setAttribute('aria-expanded', 'true');
            notificationPanel.setAttribute('aria-hidden', 'false');
        }
    });

    notificationPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });


    // Setup dropdowns based on viewport
    const applyDropdownInteractions = () => {
        const isMobileViewport = () => window.innerWidth < MOBILE_BREAKPOINT;
        const isMobile = isMobileViewport();

        // Clean up previous listeners to prevent duplicates and mixed behavior
        // Cloning and replacing node effectively removes all existing event listeners.
        // This ensures idempotency for setupDropdowns calls on resize.
        desktopNavList.querySelectorAll('li.has-dropdown > a, li.has-dropdown > ul').forEach(el => {
            if (el.parentNode) {
                const clone = el.cloneNode(true);
                el.replaceWith(clone);
            }
        });
        mobileNavList.querySelectorAll('li.has-dropdown > a, li.has-dropdown > ul').forEach(el => {
            if (el.parentNode) {
                const clone = el.cloneNode(true);
                el.replaceWith(clone);
            }
        });

        // Reapply listeners to the new cloned nodes
        setupDropdowns(desktopNavList, urlToLabelMap, isMobile); // Desktop list gets hover/click based on viewport
        setupDropdowns(mobileNavList, urlToLabelMap, true);      // Mobile list always uses click
    };

    applyDropdownInteractions(); // Initial setup

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            applyDropdownInteractions();
            closeAllInteractiveElements(); // Close all interactive elements on resize for state reset
        }, 200);
    });

    // Move instrumentation from navContent to the new block
    moveInstrumentation(navContent, block);
}