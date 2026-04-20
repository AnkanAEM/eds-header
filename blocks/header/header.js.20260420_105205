import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Blueprint to guide the navigation structure extraction
// This represents the logical structure the nav fragment should provide.
const NAV_BLUEPRINT = [
  {
    "l1Label": "Our Products",
    "l1Href": "/our-products.html",
    "menuHtml": "<ul><li>Atta<ul><li><a href=\"/our-products/atta/shudh-chakki-atta.html\">Shudh Chakki Atta</a></li><li><a href=\"/our-products/atta/superior-mp-atta.html\">Superior MP Atta</a></li><li><a href=\"/our-products/atta/multigrain-atta.html\">Multigrain Atta</a></li><li><a href=\"/our-products/atta/organic-atta.html\">Organic Atta</a></li><li><a href=\"/our-products/millets/atta-with-millets.html\">Atta with Millets</a></li><li><a href=\"/our-products/atta/mp-chakki-atta.html\">M.P. Chakki Atta</a></li><li><a href=\"/our-products/atta/sugar-release-control-atta.html\">Sugar Release Control Atta</a></li><li><a href=\"/our-products/atta/fortified-chakki-atta.html\">Fortified Chakki Atta</a></li><li><a href=\"/our-products/atta/gluten-free-flour.html\">Gluten Free Flour</a></li><li><a href=\"/our-products/atta/select-atta.html\">Select Atta</a></li><li><a href=\"/our-products/atta/high-protein-atta.html\">Atta with High Protein</a></li></ul></li><li>Salt<ul><li><a href=\"/our-products/salt/iodized-salt.html\">Iodized Salt</a></li><li><a href=\"/our-products/salt/salt-active.html\">Salt Active</a></li><li><a href=\"/our-products/salt/himalayan-pink-salt.html\">Himalayan Pink Salt</a></li><li><a href=\"/our-products/salt/iodized-crystal-salt.html\">Iodized Crystal Salt</a></li><li><a href=\"/our-products/salt/iodized-saltoffer.html\">Iodized Salt Offer</a></li></ul></li><li>Organic<ul><li><a href=\"/our-products/organic/organic-atta.html\">Organic Atta</a></li><li><a href=\"/our-products/organic/organic-chana-dal.html\">Organic Chana Dal</a></li><li><a href=\"/our-products/organic/organic-tur-dal.html\">Organic Tur Dal</a></li><li><a href=\"/our-products/organic/organic-moong-dal.html\">Organic Moong Dal</a></li><li><a href=\"/our-products/organic/organic-urad-dal.html\">Organic Urad Dal</a></li><li><a href=\"/our-products/organic/organic-masoor-dal.html\">Organic Masoor Dal</a></li><li><a href=\"/our-products/organic/organic-urad-dal-whole.html\">Organic Urad Dal Whole</a></li><li><a href=\"/our-products/organic/organic-rajma.html\">Organic Rajma</a></li><li><a href=\"/our-products/organic/organic-kabuli-chana.html\">Organic Kabuli Chana</a></li></ul></li><li>Besan<ul><li><a href=\"/our-products/besan/besan.html\">Besan</a></li></ul></li><li>Millets<ul><li><a href=\"/our-products/millets/atta-with-millets.html\">Atta with Millets</a></li><li><a href=\"/our-products/millets/batter-mix.html\">Millets Batter mix</a></li><li><a href=\"/our-products/millets/multi-millet-flour.html\">Multi Millet Mix</a></li><li><a href=\"/our-products/millets/ragi-flour.html\">Ragi Flour</a></li></ul></li><li>Vermicelli<ul><li><a href=\"/our-products/vermicelli/vermicelli.html\">Vermicelli</a></li><li><a href=\"/our-products/vermicelli/roasted-vermicelli.html\">Roasted Vermicelli</a></li></ul></li><li>Rava<ul><li><a href=\"/our-products/rava/bansi-rava.html\">Bansi Rava</a></li><li><a href=\"/our-products/rava/double-roasted-suji-rava.html\">Double Roasted Suji Rava</a></li><li><a href=\"/our-products/rava/samba-broken-wheat.html\">Samba Broken Wheat</a></li></ul></li><li>Naans and Parathas<ul><li><a href=\"/our-products/frozen-naans-parathas/garlic-and-coriander-naan.html\">Garlic and Coriander Naan</a></li><li><a href=\"/our-products/frozen-naans-parathas/malabar-paratha.html\">Malabar Paratha</a></li><li><a href=\"/our-products/frozen-naans-parathas/aloo-paratha.html\">Aloo Paratha</a></li><li><a href=\"/our-products/frozen-naans-parathas/paneer-paratha.html\">Paneer Paratha</a></li><li><a href=\"/our-products/frozen-naans-parathas/tandoori-naan.html\">Tandoori Naan</a></li></ul></li><li>Chapati<ul><li><a href=\"/our-products/ready-to-cook-chapati/rtc-chapati.html\">Ready To Cook Chapatis</a></li></ul></li><li>Ghee<ul><li><a href=\"/our-products/ghee/svasti-ghee.html\">Svasti Ghee</a></li></ul></li><li>Instant Mixes<ul><li><a href=\"/our-products/instant-mixes/instant-gulab-jamun-mix.html\">Gulab Jamun Instant Mix</a></li><li><a href=\"/our-products/instant-mixes/instant-rice-idli.html\">Instant Rice Idli</a></li><li><a href=\"/our-products/instant-mixes/instant-rava-idli.html\">Instant Rava Idli</a></li><li><a href=\"/our-products/instant-mixes/instant-rice-dosa.html\">Instant Rice Dosa</a></li></ul></li><li>Instant Meals<ul><li><a href=\"/our-products/instant-meals/instant-upma.html\">Instant Upma</a></li><li><a href=\"/our-products/instant-meals/instant-poha.html\">Instant Poha</a></li><li><a href=\"/our-products/instant-meals/instant-mini-idli-sambar.html\">Instant Mini Idli Sambar</a></li><li><a href=\"/our-products/instant-meals/instant-halwa.html\">Instant Halwa</a></li><li><a href=\"/our-products/instant-meals/dal-makhani.html\">Dal Makhani</a></li><li><a href=\"/our-products/instant-meals/paneer-butter-masala.html\"> Paneer Butter Masala</a></li></ul></li><li>Basic Spices<ul><li><a href=\"/our-products/basic-spices/red-chilli-powder.html\">Chilli Powder</a></li><li><a href=\"/our-products/basic-spices/guntur-byadagi-chilli-powder.html\">Guntur &amp; Byadagi Chilli Powder</a></li><li><a href=\"/our-products/basic-spices/byadagi-chilli-powder.html\">Byadagi chilli powder</a></li><li><a href=\"/our-products/basic-spices/premium-chilli-powder.html\">Premium Chilli Powder</a></li><li><a href=\"/our-products/basic-spices/kashmiri-chilli-powder.html\">Kashmiri Mirch Powder</a></li><li><a href=\"/our-products/basic-spices/turmeric-powder.html\">Turmeric Powder</a></li><li><a href=\"/our-products/basic-spices/coriander-powder.html\">Coriander Powder</a></li><li><a href=\"/our-products/basic-spices/pepper-powder.html\">Pepper Powder</a></li></ul></li><li>Blended Spices<ul><li><a href=\"/our-products/blended-spices/masala-karam.html\">Masala Karam</a></li><li><a href=\"/our-products/blended-spices/sambar-powder.html\">Sambar Powder</a></li><li><a href=\"/our-products/blended-spices/kitchen-king-masala.html\">Kitchen King Masala</a></li><li><a href=\"/our-products/blended-spices/chaat-masala.html\">Chaat Masala</a></li><li><a href=\"/our-products/blended-spices/sabji-masala.html\">Sabji Masala</a></li><li><a href=\"/our-products/blended-spices/paneer-masala.html\">Paneer Masala</a></li><li><a href=\"/our-products/blended-spices/punjabi-chole-masala.html\">Punjabi Chole Masala</a></li><li><a href=\"/our-products/blended-spices/shahi-garam-masala.html\">Shahi Garam Masala</a></li><li><a href=\"/our-products/blended-spices/rasam-powder.html\">Rasam Powder</a></li><li><a href=\"/our-products/blended-spices/dal-masala.html\">Dal Masala</a></li><li><a href=\"/our-products/blended-spices/aloo-dum-masala.html\">Aloo Dum Masala </a></li><li><a href=\"/our-products/blended-spices/pav-bhaji-masala.html\">Pav Bhaji Masala</a></li></ul></li><li>Whole Spices<ul><li><a href=\"/our-products/whole-spices/jeera.html\">Jeera</a></li><li><a href=\"/our-products/whole-spices/cardamom.html\">Cardamom</a></li><li><a href=\"/our-products/whole-spices/mustard.html\">Mustard</a></li><li><a href=\"/our-products/whole-spices/poppy-seeds.html\">Poppy seeds</a></li><li><a href=\"/our-products/whole-spices/black-pepper.html\">Black Pepper</a></li><li><a href=\"/our-products/whole-spices/clove.html\">Clove</a></li><li><a href=\"/our-products/whole-spices/methi.html\">Methi</a></li><li><a href=\"/our-products/whole-spices/saunf.html\">Saunf</a></li><li><a href=\"/our-products/whole-spices/ajwain.html\">Ajwain</a></li><li><a href=\"/our-products/whole-spices/kasuri-methi.html\">Kasuri Methi</a></li></ul></li><li>Plant Protein<ul><li><a href=\"/our-products/plant-protein/soya-chunks.html\">Soya Chunks</a></li></ul></li></ul>"
  },
  {
    "l1Label": "Our Story",
    "l1Href": "/our-story.html",
    "menuHtml": ""
  },
  {
    "l1Label": "Recipe",
    "l1Href": "/recipe-listing.html",
    "menuHtml": ""
  },
  {
    "l1Label": "Blogs",
    "l1Href": "/blogs.html",
    "menuHtml": ""
  },
  {
    "l1Label": "CSR Initiatives",
    "l1Href": "/csr-initiatives.html",
    "menuHtml": "<ul><li><a href=\"/csr-initiatives/about-initiative.html\">About Initiative</a></li><li><a href=\"/csr-initiatives/iodine-deficiency.html\">Iodine Deficiency</a></li><li><a href=\"/csr-initiatives/school-contact-program.html\">School Contact Program</a></li><li><a href=\"/csr-initiatives/community-contact-program.html\">Community Contact Program</a></li></ul>"
  },
  {
    "l1Label": "FAQs",
    "l1Href": "/faqs.html",
    "menuHtml": ""
  }
];

function normalizeHref(href) {
  if (!href) return '';
  let url = new URL(href, window.location.origin);
  let path = url.pathname.replace(/\.html$/, '');
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

// Helper function for dropdown interactions
function setupDropdowns(navUl, isMobile = false) {
  navUl.querySelectorAll('li.has-dropdown').forEach((li) => {
    const subMenuWrapper = li.querySelector('.header-dropdown-wrapper');
    const anchor = li.querySelector('a');

    if (subMenuWrapper && anchor) {
      // Clone to remove existing event listeners
      const newAnchor = anchor.cloneNode(true);
      anchor.replaceWith(newAnchor);

      newAnchor.setAttribute('aria-expanded', 'false');

      if (isMobile) {
        newAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent parent from closing
          const isOpen = newAnchor.getAttribute('aria-expanded') === 'true';

          // Close other L0 dropdowns if this is a top-level nav item
          if (li.parentElement === navUl) {
            navUl.querySelectorAll('li.has-dropdown > a[aria-expanded="true"]').forEach((otherAnchor) => {
              if (otherAnchor !== newAnchor) {
                otherAnchor.setAttribute('aria-expanded', 'false');
                otherAnchor.closest('li')?.classList.remove('is-open');
              }
            });
          }
          newAnchor.setAttribute('aria-expanded', !isOpen);
          li.classList.toggle('is-open', !isOpen);
        });
      } else { // Desktop (hover)
        let hoverTimeout;
        li.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          newAnchor.setAttribute('aria-expanded', 'true');
          li.classList.add('is-open');
        });
        li.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            newAnchor.setAttribute('aria-expanded', 'false');
            li.classList.remove('is-open');
          }, 200);
        });
      }
      // Recursively setup dropdowns for nested Uls within the subMenu
      const nestedUl = subMenuWrapper.querySelector('ul');
      if (nestedUl) {
        setupDropdowns(nestedUl, isMobile);
      }
    }
  });
}

export default async function decorate(block) {
  block.innerHTML = ''; // Clear block content for idempotency

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerBrand = document.createElement('div');
  headerBrand.classList.add('header-brand');

  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav');
  const mainNavUl = document.createElement('ul');
  mainNavUl.classList.add('header-nav-main-ul');

  const headerTools = document.createElement('div');
  headerTools.classList.add('header-tools');

  const navContent = await loadFragment('/nav');
  if (!navContent) {
    return; // Nothing to decorate if fragment failed to load
  }

  // Clone navContent to safely remove elements without affecting moveInstrumentation
  const clonedNavContent = navContent.cloneNode(true);

  // --- 1. Extract Brand/Logo ---
  // Try to find logo.svg within an <a> element, or just an <img>. Prioritize a home link.
  const logoLinkInFragment = clonedNavContent.querySelector('a[href="/"] img')?.closest('a') || clonedNavContent.querySelector('a img')?.closest('a');
  const plainImgInFragment = !logoLinkInFragment && clonedNavContent.querySelector('img');

  if (logoLinkInFragment || plainImgInFragment) {
    const brandElToClone = logoLinkInFragment || plainImgInFragment;
    const clonedBrandEl = brandElToClone.cloneNode(true);

    // Optimize picture if it's an img or contains one
    if (clonedBrandEl.tagName === 'IMG' && !clonedBrandEl.dataset.optimized) {
      const newPic = createOptimizedPicture(clonedBrandEl.src, clonedBrandEl.alt, true, [{ width: '200' }]);
      headerBrand.appendChild(newPic);
    } else if (clonedBrandEl.tagName === 'A' && clonedBrandEl.querySelector('img') && !clonedBrandEl.querySelector('img')?.dataset.optimized) {
      const img = clonedBrandEl.querySelector('img');
      if (img) {
        const newPic = createOptimizedPicture(img.src, img.alt, true, [{ width: '200' }]);
        img.replaceWith(newPic);
      }
      headerBrand.appendChild(clonedBrandEl);
    } else {
      headerBrand.appendChild(clonedBrandEl);
    }
    // Remove the original logo from clonedNavContent to avoid reprocessing
    brandElToClone.closest('div')?.remove(); // Remove its parent section if it exists
  }

  // --- 2. Extract Tools ---
  // These are typically identifiable by specific icon classes and are at the end of the header.
  const toolsDivInFragment = clonedNavContent.querySelector('div:has([class*="icon-search"]), div:has([class*="icon-profile"]), div:has([class*="icon-accessibility"])');
  if (toolsDivInFragment) {
    const toolItem = document.createElement('div');
    toolItem.classList.add('header-tool-item');

    const accessibilityIcon = toolsDivInFragment.querySelector('[class*="icon-accessibility"]');
    if (accessibilityIcon) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('header-accessibility');
      wrapper.appendChild(accessibilityIcon.closest('a')?.cloneNode(true) || accessibilityIcon.cloneNode(true));
      toolItem.appendChild(wrapper);
      accessibilityIcon.closest('a')?.remove() || accessibilityIcon.remove(); // Remove from fragment
    }

    const searchIcon = toolsDivInFragment.querySelector('[class*="icon-search"]');
    if (searchIcon) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('header-search');
      wrapper.appendChild(searchIcon.closest('a')?.cloneNode(true) || searchIcon.cloneNode(true));
      toolItem.appendChild(wrapper);
      searchIcon.closest('a')?.remove() || searchIcon.remove(); // Remove from fragment
    }

    const profileIcon = toolsDivInFragment.querySelector('[class*="icon-profile"]');
    if (profileIcon) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('header-profile');
      wrapper.appendChild(profileIcon.closest('a')?.cloneNode(true) || profileIcon.cloneNode(true));
      toolItem.appendChild(wrapper);
      profileIcon.closest('a')?.remove() || profileIcon.remove(); // Remove from fragment
    }

    if (toolItem.children.length > 0) {
      headerTools.appendChild(toolItem);
    }
    toolsDivInFragment.remove(); // Remove the entire tool section from clonedNavContent
  }

  // --- 3. Extract Main Navigation (Mega Menu) ---
  // Match blueprint items to remaining content in clonedNavContent.
  NAV_BLUEPRINT.forEach((item) => {
    // Find the L0 link for the current blueprint item within clonedNavContent
    // Normalize hrefs for robust matching.
    const targetHref = normalizeHref(item.l1Href);
    let l0Link = Array.from(clonedNavContent.querySelectorAll('a'))
      .find(a => normalizeHref(a.href) === targetHref);

    if (l0Link) {
      const li = document.createElement('li');
      li.classList.add('header-nav-item', 'header-nav-item--level-0');
      li.appendChild(l0Link.cloneNode(true)); // Append a clone of the L0 link
      l0Link.remove(); // Remove the original link from clonedNavContent

      if (item.menuHtml) {
        li.classList.add('has-dropdown');
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.classList.add('header-dropdown-wrapper');

        // Parse the menuHtml string into a DOM structure
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.menuHtml;
        Array.from(tempDiv.children).forEach(child => dropdownWrapper.appendChild(child));

        // Look for any additional rich content like image+text divs that were siblings to the UL in the original fragment
        // Note: this part is speculative as the blueprint focuses on menuHtml and original raw HTML uses 'cmp-' classes not allowed in fragment.
        // We'll look for generic DIVs that are not just containing links directly within the section that contained this L0 item
        const parentSection = l0Link.closest('div'); // The section that originally contained the L0 link
        if (parentSection) {
          Array.from(parentSection.children).forEach(child => {
            if (child.tagName === 'DIV' && !child.querySelector('ul') && !child.querySelector('a')) {
                // Append other potential rich content divs from the section
                dropdownWrapper.appendChild(child.cloneNode(true));
                child.remove();
            }
          });
        }

        li.appendChild(dropdownWrapper);
      }
      mainNavUl.appendChild(li);
    } else if (item.l1Label) { // If blueprint item exists but no link found in fragment, create a placeholder
        const li = document.createElement('li');
        li.classList.add('header-nav-item', 'header-nav-item--level-0', 'missing-link');
        const a = document.createElement('a');
        a.href = item.l1Href;
        a.textContent = item.l1Label;
        li.appendChild(a);
        if (item.menuHtml) {
            // Still add dropdown even if main link was missing
            li.classList.add('has-dropdown');
            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.classList.add('header-dropdown-wrapper');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.menuHtml;
            Array.from(tempDiv.children).forEach(child => dropdownWrapper.appendChild(child));
            li.appendChild(dropdownWrapper);
        }
        mainNavUl.appendChild(li);
    }
  });

  // --- 4. Extract Mobile-Specific Policy and Social Links ---
  const mobileBottomNav = document.createElement('div');
  mobileBottomNav.classList.add('header-mobile-bottom-nav');

  // Search for remaining ULs (likely policy links) and social media links
  const policyUl = clonedNavContent.querySelector('ul');
  if (policyUl) {
    mobileBottomNav.appendChild(policyUl.cloneNode(true));
    policyUl.remove();
  }

  const socialLinksContainer = document.createElement('div');
  socialLinksContainer.classList.add('header-social-media');
  Array.from(clonedNavContent.querySelectorAll('a[class*="icon-"]')).forEach(link => {
    socialLinksContainer.appendChild(link.cloneNode(true));
    link.remove();
  });
  if (socialLinksContainer.children.length > 0) {
    mobileBottomNav.appendChild(socialLinksContainer);
  }

  // Assemble headerNav
  if (mainNavUl.children.length > 0) {
    headerNav.appendChild(mainNavUl);
  }
  if (mobileBottomNav.children.length > 0) {
    headerNav.appendChild(mobileBottomNav);
  }

  // --- 5. Add Hamburger Button ---
  const hamburger = document.createElement('button');
  hamburger.classList.add('header-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    headerNav.classList.toggle('is-open', !isExpanded);
    document.body.classList.toggle('nav-open', !isExpanded); // Lock body scroll

    // Close all dropdowns when hamburger is toggled
    headerNav.querySelectorAll('.has-dropdown.is-open').forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('a[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
    });
  });

  // --- 6. Accessibility and Interaction Management ---
  // Close dropdowns on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openDropdowns = headerNav.querySelectorAll('.has-dropdown.is-open');
      openDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        dropdown.querySelector('a[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
      });
      // Close mobile nav if open
      if (hamburger.getAttribute('aria-expanded') === 'true') {
        hamburger.setAttribute('aria-expanded', 'false');
        headerNav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    // Desktop logic: close L0 dropdowns if click is outside
    if (window.matchMedia('(min-width: 900px)').matches) {
      const openL0Dropdowns = mainNavUl.querySelectorAll('li.has-dropdown.is-open');
      openL0Dropdowns.forEach((li) => {
        if (!li.contains(e.target) && e.target !== hamburger) {
          li.classList.remove('is-open');
          li.querySelector('a')?.setAttribute('aria-expanded', 'false');
        }
      });
    } else { // Mobile logic: close mobile nav if click is outside nav area or hamburger
      if (hamburger.getAttribute('aria-expanded') === 'true' && !headerNav.contains(e.target) && e.target !== hamburger && !e.target.closest('.header-hamburger')) {
        hamburger.setAttribute('aria-expanded', 'false');
        headerNav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    }
  });

  // --- 7. Assemble and Append Elements ---
  headerWrapper.appendChild(headerBrand);
  headerWrapper.appendChild(hamburger);
  headerWrapper.appendChild(headerNav);
  headerWrapper.appendChild(headerTools);

  block.appendChild(headerWrapper);

  // --- 8. Setup Dynamic Dropdown Interactions (mobile/desktop) ---
  const mediaQuery = window.matchMedia('(min-width: 900px)');
  const handleMediaChange = (e) => {
    // Clear any open states or inline styles when switching modes
    headerNav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    headerNav.querySelectorAll('.has-dropdown').forEach((li) => {
      li.classList.remove('is-open');
      li.querySelector('a')?.setAttribute('aria-expanded', 'false');
    });

    setupDropdowns(mainNavUl, !e.matches); // true for mobile, false for desktop
  };

  // Initial setup
  handleMediaChange(mediaQuery);
  // Listen for changes
  mediaQuery.addEventListener('change', handleMediaChange);

  // --- 9. Move Instrumentation ---
  moveInstrumentation(navContent, block);
}
