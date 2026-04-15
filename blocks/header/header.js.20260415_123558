import { loadFragment } from '../../scripts/aem.js';
import { createFragment } from '../../fragment/fragment.js';

/**
 * decorates the header block (Part 1: Structure).
 * Creates the nav-wrapper, identifies Brand, Nav, and Tools sections,
 * and moves relevant DOM elements into their new structured containers.
 * @param {Element} block The header block element (e.g., <div id="block-header">)
 */
export default async function decorate(block) {
    // Find the actual header HTML content within the AEM block
    const headerElement = block.querySelector('.main-header');
    if (!headerElement) {
        console.warn('Header element with class "main-header" not found within the block.');
        return;
    }

    // Create the main semantic <nav> element as the primary navigation container
    const navWrapper = document.createElement('nav');
    navWrapper.classList.add('nav-wrapper');

    // Create sub-containers for different parts of the navigation
    const navBrand = document.createElement('div');
    navBrand.classList.add('nav-brand');

    const navSections = document.createElement('div');
    navSections.classList.add('nav-sections');

    const navTools = document.createElement('div');
    navTools.classList.add('nav-tools');

    // The original header has a structure like .main-header > .container > .wrap
    // We will extract content from within the .wrap for restructuring.
    const headerWrap = headerElement.querySelector('.wrap');
    if (!headerWrap) {
        console.warn('Header wrap element not found within the main header.');
        return;
    }

    // --- Brand Identification and DOM Element Creation ---
    // Identify and move the main company logo
    const mainLogo = headerWrap.querySelector('.logo:not(.year-80-logo)');
    if (mainLogo) {
        navBrand.append(mainLogo);
    }

    // Identify and move the 80th-year anniversary logo (if present)
    const year80Logo = headerWrap.querySelector('.logo.year-80-logo');
    if (year80Logo) {
        navBrand.append(year80Logo);
    }

    // Identify and move the hamburger menu icon (for mobile navigation toggle)
    const hamburger = headerWrap.querySelector('.hamburger');
    if (hamburger) {
        navBrand.append(hamburger);
    }

    // --- Navigation Sections Identification and DOM Element Creation ---
    // Identify and move the main navigation links container
    const mainNavElement = headerWrap.querySelector('.main-nav');
    if (mainNavElement) {
        navSections.append(mainNavElement);
    }

    // --- Tools Identification and DOM Element Creation ---
    // Identify and move the mobile-specific utility icons (Contact Us, Search)
    const mobileIconNav = headerWrap.querySelector('.icon-nav.mobile-menus-icon');
    if (mobileIconNav) {
        navTools.append(mobileIconNav);
    }

    // Identify and move the desktop-specific utility icons (Contact Us, Search)
    const desktopIconNav = headerWrap.querySelector('.icon-nav.desktop-menus-icon');
    if (desktopIconNav) {
        navTools.append(desktopIconNav);
    }

    // Assemble the new navigation structure
    navWrapper.append(navBrand, navSections, navTools);

    // Clear the original AEM block content and append the newly structured navWrapper
    block.innerHTML = '';
    block.append(navWrapper);

    // Further enhancements like event listeners, dynamic content loading,
    // and specific styling classes will be handled in Part 2 (Enhancement)
}

export default function decorate(block) {
  const mainHeader = block.querySelector('.main-header');
  const hamburger = block.querySelector('.hamburger');
  const mainNav = block.querySelector('.main-nav');
  const hasChildLIs = block.querySelectorAll('.main-nav > ul > li.has-child');
  const searchToggle = block.querySelector('.icon-nav .search');
  const searchScreenWrap = block.querySelector('.search-screen-wrap');
  const searchCloseButton = block.querySelector('.icon-nav .search .close');

  const mobileBreakpoint = 991; // Based on media queries in the provided CSS
  const isMobile = () => window.innerWidth <= mobileBreakpoint;

  // Global state management for scroll and to avoid duplicate event listeners
  let lastScrollY = window.scrollY;
  let scrollThrottleTimeout = null;
  let isMobileListenersActive = false;
  let isDesktopListenersActive = false;

  // --- Helper to close all open menus/overlays ---
  const closeAllNavigation = () => {
    // Close mobile navigation
    if (mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
      document.body.classList.remove('nav-open');
      // Recursively close all open sub-menus
      block.querySelectorAll('.has-child.active, .top-level-li.