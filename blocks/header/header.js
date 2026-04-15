import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Part 1 (Structure): Decorates the main content area by converting existing divs
 * into standard EDS sections, including nav-wrapper and section identification logic.
 * This function assumes 'block' is the <main> element of the page.
 *
 * @param {Element} block The <main> element of the page.
 */
export default async function decorate(block) {
    const main = block;

    // Iterate over direct child divs of <main>.
    // On mahindra.com, these divs (e.g., div#block-header, div#block-homeslider)
    // represent the main logical sections of the page.
    main.querySelectorAll(':scope > div').forEach((originalDiv) => {
        // Extract a meaningful name from the div's ID or class for class assignment.
        // e.g., 'block-header' -> 'header'
        const sectionId = originalDiv.id;
        let sectionName = '';
        if (sectionId && sectionId.startsWith('block-')) {
            sectionName = sectionId.substring('block-'.length);
        } else if (originalDiv.classList.length > 0) {
            // Fallback to the first class if no block- ID is present.
            sectionName = originalDiv.classList[0];
        }

        // If a valid section name is identified, apply the EDS section structure.
        if (sectionName) {
            // Create the outer <section> element.
            const newSection = document.createElement('section');
            newSection.classList.add(`${sectionName}-container`); // Standard EDS container class

            // Create the inner wrapper <div> for content.
            const sectionWrapper = document.createElement('div');
            sectionWrapper.classList.add(`${sectionName}-wrapper`); // Standard EDS wrapper class

            // Move all children from the original div into the new section wrapper.
            // This preserves the existing content while wrapping it in the new structure.
            while (originalDiv.firstChild) {
                sectionWrapper.appendChild(originalDiv.firstChild);
            }
            newSection.appendChild(sectionWrapper);

            // Replace the original div with the newly constructed <section> element.
            originalDiv.parentNode.replaceChild(newSection, originalDiv);

            // Add specific classes for global structural elements (header and footer).
            if (sectionName === 'header') {
                newSection.classList.add('global-header');
            } else if (sectionName === 'footer') {
                newSection.classList.add('global-footer');
            }
        }
    });

    // Note: Specific decoration of content *within* these newly formed sections
    // (e.g., decorating individual navigation items inside the header or cards inside a content section)
    // would typically be handled by dedicated block decorators or subsequent steps in the decoration process.
    // This part focuses purely on the top-level structural transformation.
}

/**
 * Part 2: Mega-Menu Behaviors
 * Decorates the mega-menu functionality within the given block element.
 *
 * This script implements:
 * - Hamburger menu toggle for mobile navigation.
 * - Desktop hover functionality for main navigation items.
 * - Mobile click functionality for main and nested navigation items, with mutual exclusivity.
 * - Closing mechanism for mobile menu on outside clicks.
 * - Resetting menu states on window resize between mobile and desktop.
 *
 * @param {HTMLElement} block The HTML element to which the mega-menu behaviors should be applied.
 *                            In this context, it is expected to be a container for the main header (or document.body).
 */
function decorateMegaMenuBehaviors(block) {
    if (!block) {
        console.warn('decorateMegaMenuBehaviors: No block element provided.');
        return;
    }

    // Find the header element, either directly the block or a descendant
    const header = block.closest('.main-header') || block.querySelector('.main-header');
    if (!header) {
        console.warn('decorateMegaMenuBehaviors: Could not find .main-header within or relative to the block.');
        return;
    }

    const mainNav = header.querySelector('.main-nav');
    const hamburger = header.querySelector('.hamburger');
    // Media query to differentiate between mobile and desktop layouts
    const mediaQuery = window.matchMedia('(max-

/**
 * Part 3: Mobile & Utilities (including responsive menu, search, and footer interactions)
 *
 * This script handles:
 * 1. Mobile navigation menu toggling (hamburger icon).
 * 2. Opening and closing of multi-level sub-menus within the main navigation on mobile.
 * 3. Search overlay functionality, including opening/closing and keyword interaction.
 * 4. Collapsible menus in the footer, specifically for mobile display.
 * 5. General utility link handling (e.g., preventing default for hash links).
 * 6. Ensures proper state (e.g., closing menus/search) on window resize events.
 */
export default function decorate(block) {
  // Initialize all utility handlers
  handleMobileMenu();
  handleSearchFunctionality();
  handleFooterMenus();
  handleQuickLinks();
}

/**
 * Manages the mobile main navigation menu and its nested sub-menus.
 */
function handleMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const mobileMenusIcon = document.querySelector('.mobile-menus-icon'); // Container for mobile contact/search
  const body = document.body;
  const desktopBreakpoint = 992; // CSS breakpoint for desktop navigation

  if (hamburger && mainNav && mobileMenusIcon) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
