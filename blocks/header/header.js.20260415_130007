import { getMetadata } from '../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default function decorate(block) {
  // Find the existing .wrap element that contains all header functional parts
  // The block itself is the <header> element.
  const headerContainer = block.querySelector('.container');
  const headerWrap = headerContainer ? headerContainer.querySelector('.wrap') : null;

  if (!headerWrap) {
    console.warn('Header content wrap not found, skipping core structural setup for header block.');
    return;
  }

  // Create a new main nav wrapper for standardization, and move existing content into it
  const navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');

  // Create nav-brand and move logos
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand');
  const mainLogo = headerWrap.querySelector('.logo:not(.year-80-logo)');
  if (mainLogo) {
    navBrand.append(mainLogo);
  }
  const year80Logo = headerWrap.querySelector('.logo.year-80-logo');
  if (year80Logo) {
    navBrand.append(year80Logo);
  }
  navWrapper.append(navBrand);

  // Create nav-sections and move the main navigation (`nav.main-nav`)
  const navSections = document.createElement('nav');
  navSections.classList.add('nav-sections');
  const mainNav = headerWrap.querySelector('nav.main-nav');
  if (mainNav) {
    // Move the entire nav.main-nav element into navSections
    navSections.append(mainNav);
  }
  navWrapper.append(navSections);

  // Create nav-tools and move utility icons, hamburger, and search functionality
  const navTools = document.createElement('div');
  navTools.classList.add('nav-tools');

  const hamburger = headerWrap.querySelector('.hamburger');
  if (hamburger) {
    navTools.append(hamburger);
  }

  // The mobile and desktop icon-navs contain contact and search, which are tools
  const mobileMenusIcon = headerWrap.querySelector('.icon-nav.mobile-menus-icon');
  if (mobileMenusIcon) {
    navTools.append(mobileMenusIcon);
  }
  const desktopMenusIcon = headerWrap.querySelector('.icon-nav.desktop-menus-icon');
  if (desktopMenusIcon) {
    navTools.append(desktopMenusIcon);
  }
  navWrapper.append(navTools);

  // Clear the original headerWrap and append the new navWrapper
  headerWrap.innerHTML = ''; // This will remove any elements not moved above
  headerWrap.append(navWrapper);

  // Plugin calls (definitions for these functions are elsewhere as per requirement)
  setupSubmenuBehaviors(block);
  setupMobileAndSearch(block);
}

function setupSubmenuBehaviors(block) {
    // Function to check if the current view is mobile based on the CSS breakpoint (991px)
    const isMobile = () => window.innerWidth <= 991;

    // Get the main navigation element within the provided block
    const mainNav = block.querySelector('.main-nav');
    if (!mainNav) return; // Exit if main navigation is not found

    // Select all top-level menu items that have a mega-menu dropdown
    const mainMenuItems = mainNav.querySelectorAll('ul > li.has-child');

    // Iterate over each main menu item to attach behaviors
    mainMenuItems.forEach(mainItem => {
        const megaMenu = mainItem.querySelector('.mega-menu'); // The mega-menu associated with this item
        const mainLink = mainItem.querySelector('a'); // The main menu link
        const mainToggleSpan = mainItem.querySelector('span:has(svg)'); // The SVG icon used for toggling

        // If no mega-menu is found for this item, skip to the next
        if (!megaMenu) return;

        // --- Desktop Hover Behavior for the main mega-menu ---
        mainItem.addEventListener('mouseenter', () => {
            if (!isMobile()) {
                // Close any other open top-level mega-menus to ensure only one is active at a time
                mainMenuItems.forEach(item => {
                    if (item !== mainItem) {

function setupMobileAndSearch(block) {
    const body = document.body;
    const header = document.querySelector('header.main-header');
    if (!header) {
        console.warn('Header element not found. Mobile and search setup aborted.');
        return;
    }

    const hamburger = header.querySelector('.hamburger');
    const mainNav = header.querySelector('nav.main-nav');
    const desktopSearchToggle = header.querySelector('.desktop-menus-icon li.search > a');
    const mobileSearchToggle = header.querySelector('.mobile-menus-icon li.search > a');
    const searchScreenWrap = header.querySelector('.search-screen-wrap');
    const searchInput = searchScreenWrap ? searchScreenWrap.querySelector('#searchInput') : null;
    const searchCloseButton = header.querySelector('li.search .close');

    // Helper to manage body scrolling (prevent/allow scroll)
    const updateBodyScroll = () => {
        const isMainNavActive = mainNav && mainNav.classList.contains('active');
        // Check if searchScreenWrap is block-displayed to determine if search is active
        const isSearchActive = searchScreenWrap && searchScreenWrap.style.display === 'block';

        if (isMainNavActive || isSearchActive) {
            body.classList.add('no-scroll');
        } else {
            body.classList.remove('no-scroll');
        }
    };