import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function createSvgElement(viewBox, pathD, fill = '#030408') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', fill);
  svg.setAttribute('stroke', fill);
  svg.setAttribute('stroke-width', '4.851456000000001');

  const gCarrier1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gCarrier1.setAttribute('id', 'SVGRepo_bgCarrier');
  gCarrier1.setAttribute('stroke-width', '0');
  svg.appendChild(gCarrier1);

  const gCarrier2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gCarrier2.setAttribute('id', 'SVGRepo_tracerCarrier');
  gCarrier2.setAttribute('stroke-linecap', 'round');
  gCarrier2.setAttribute('stroke-linejoin', 'round');
  gCarrier2.setAttribute('stroke', '#CCCCCC');
  gCarrier2.setAttribute('stroke-width', '0.30321600000000004');
  svg.appendChild(gCarrier2);

  const gIconCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gIconCarrier.setAttribute('id', 'Group_65');
  gIconCarrier.setAttribute('data-name', 'Group 65');
  gIconCarrier.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', fill);
  gIconCarrier.appendChild(path);
  svg.appendChild(gIconCarrier);
  return svg;
}

export default async function decorate(block) {
  const navPath = getMetadata('nav') || '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) {
    return;
  }

  // Clear existing content if any
  block.innerHTML = '';
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  block.appendChild(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.appendChild(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.mahindra.com/';
  const logoImg = document.createElement('img');
  logoImg.src = 'https://www.mahindra.com//sites/default/files/2025-07/mahindra-red-logo.webp';
  logoImg.alt = 'Mahindra Brand Logo White';
  logoImg.title = 'Mahindra Brand Logo White Image';
  logoImg.classList.add('hiddenlogo1');
  logoImg.width = '200';
  logoImg.height = '30';
  logoImg.style.width = 'auto';
  logoImg.loading = 'lazy';
  logoLink.appendChild(logoImg);
  logoDiv.appendChild(logoLink);
  wrapDiv.appendChild(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i++) {
    hamburgerUl.appendChild(document.createElement('li'));
  }
  hamburgerDiv.appendChild(hamburgerUl);
  wrapDiv.appendChild(hamburgerDiv);

  // Main Navigation
  const navElement = document.createElement('nav');
  navElement.classList.add('main-nav');
  navElement.setAttribute('data-once', 'initSubChildToggle');
  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navElement.appendChild(mainUl);
  
  // The fragment is expected to contain the structured navigation items.
  // A common structure for nav fragments from markdown tables is `div.section > div > div` for each L1.
  // Each L1 div would contain a <p> with the label, a <p> with the <a> link, and optionally a <div> with nested ULs for sub-menus.
  const fragmentL1Items = fragment.querySelectorAll('div.section > div > div'); // Adjust selector based on actual fragment structure

  if (fragmentL1Items.length > 0) {
    fragmentL1Items.forEach((l1ItemFromFragment) => {
        const l1LabelParagraph = l1ItemFromFragment.querySelector('p:first-child');
        const l1LinkParagraph = l1ItemFromFragment.querySelector('p:nth-child(2)');
        const megaMenuContentWrapper = l1ItemFromFragment.querySelector('div:last-child'); // This div contains the nested ULs

        if (l1LabelParagraph && l1LinkParagraph && l1LinkParagraph.querySelector('a')) {
            const l1Label = l1LabelParagraph.textContent.trim();
            const l1LinkElement = l1LinkParagraph.querySelector('a');

            const l1Li = document.createElement('li');
            l1Li.classList.add('has-child', 'hover-red');
            l1Li.setAttribute('itemprop', 'name');
            l1Li.setAttribute('data-once', 'nav-close-search');

            const l1Anchor = document.createElement('a');
            l1Anchor.setAttribute('itemprop', 'url');
            l1Anchor.href = l1LinkElement.href;
            l1Anchor.textContent = l1Label;
            l1Li.appendChild(l1Anchor);

            // Add SVG arrow
            const svgSpan = document.createElement('span');
            const svgPath = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';
            svgSpan.appendChild(createSvgElement('-23.5 -23.5 122.80 122.80', svgPath));
            l1Li.appendChild(svgSpan);

            const megaMenuDiv = document.createElement('div');
            megaMenuDiv.classList.add('mega-menu');
            const megaMenuWrapContainer = document.createElement('div');
            megaMenuWrapContainer.classList.add('wrap', 'container');
            const megaMenuCenterDiv = document.createElement('div');
            megaMenuCenterDiv.classList.add('center-div');
            megaMenuWrapContainer.appendChild(megaMenuCenterDiv);
            megaMenuDiv.appendChild(megaMenuWrapContainer);

            // Hardcode Left-Div content based on L1 label for mirroring original HTML
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('left-div');
            const leftDivHeading = document.createElement('h4');
            const leftDivHeadingLink = document.createElement('a');
            leftDivHeading.appendChild(leftDivHeadingLink);
            leftDiv.appendChild(leftDivHeading);

            switch (l1Label) {
                case 'Who We Are':
                    leftDiv.classList.add('about-us-left-div'); // Custom class from original
                    leftDivHeadingLink.textContent = 'Our Purpose';
                    const purposeDesc = document.createElement('p');
                    purposeDesc.classList.add('left-div-desc');
                    purposeDesc.textContent = 'Drive positive change in the lives of our communities. Only when we enable others to rise will we rise.';
                    leftDiv.appendChild(purposeDesc);
                    const purposeSubDesc = document.createElement('p');
                    purposeSubDesc.classList.add('left-div-subdesc');
                    purposeSubDesc.textContent = '#TogetherWeRise';
                    leftDiv.appendChild(purposeSubDesc);
                    break;
                case 'What we do':
                    leftDivHeadingLink.textContent = 'Key Facts';
                    const keyFactsUl = document.createElement('ul');
                    keyFactsUl.innerHTML = `
                        <li class="list-text-red">20+ <span>Industries</span></li>
                        <li class="list-text-red">100+ <span>Countries</span></li>
                        <li class="list-text-red">324K+ <span>Employees</span></li>
                    `;
                    leftDiv.appendChild(keyFactsUl);
                    break;
                case 'Investor Relations':
                    leftDiv.classList.add('ir-left-div'); // Custom class from original
                    leftDivHeadingLink.textContent = 'Investor Relations';
                    const irDesc = document.createElement('p');
                    irDesc.textContent = 'Group Highlights - Q3 F26';
                    leftDiv.appendChild(irDesc);
                    const irFactsUl = document.createElement('ul');
                    irFactsUl.innerHTML = `
                        <li class="list-text-red">20.1% <span>Consolidated ROE (Annualized)</span></li>
                        <li class="list-text-red">Rs 52,100 cr <span>Revenue</span></li>
                        <li class="list-text-red">Rs 4,675 cr <span>PAT</span></li>
                    `;
                    leftDiv.appendChild(irFactsUl);
                    break;
                case 'newsroom': // Case-sensitive based on `l1Label`
                    leftDiv.classList.add('newsroom-left-div'); // Custom class from original
                    leftDivHeadingLink.textContent = 'Newsroom';
                    const newsroomContent = document.createElement('div');
                    newsroomContent.classList.add('latest-two-press-release');
                    newsroomContent.innerHTML = `
                        <div class="slides">
                          <div class="wrap">
                            <div class="content">
                              <div class="desc">
                                <p><a href="/news-room/press-release/en/swaraj-announces-price-hike-across-its-tractor-range-effective-april-21-2026" hreflang="en">Swaraj announces price hike across its Tractor range effective April 21, 2026</a></p>
                                <div class="date"><em><time datetime="2026-04-07T12:00:00Z">7 April 2026</time></em><em>Farm</em></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="slides">
                          <div class="wrap">
                            <div class="content">
                              <div class="desc">
                                <p><a href="/news-room/press-release/en/mahindra-announces-price-hike-across-its-tractor-range-effective-april-08-2026" hreflang="en">Mahindra announces price hike across its Tractor range effective April 08, 2026</a></p>
                                <div class="date"><em><time datetime="2026-04-07T12:00:00Z">7 April 2026</time></em><em>Farm</em></div>
                              </div>
                            </div>
                          </div>
                        </div>
                    `;
                    leftDiv.appendChild(newsroomContent);
                    break;
                case 'careers': // Case-sensitive based on `l1Label`
                    leftDiv.classList.add('career-left-div'); // Custom class from original
                    leftDivHeadingLink.textContent = 'careers';
                    const careerDesc = document.createElement('p');
                    careerDesc.classList.add('left-div-desc');
                    careerDesc.textContent = 'Committed to elevate the lives of communities, guided by our core behaviours and values.';
                    leftDiv.appendChild(careerDesc);
                    const careerSubDesc = document.createElement('p');
                    careerSubDesc.classList.add('left-div-subdesc');
                    careerSubDesc.textContent = 'Bold. Agile. Collaborative.';
                    leftDiv.appendChild(careerSubDesc);
                    break;
                default:
                    break;
            }
            megaMenuCenterDiv.appendChild(leftDiv);

            const subNavWrap = document.createElement('div');
            subNavWrap.classList.add('sub-nav-wrap');
            // Add specific sub-nav classes based on L1
            if (l1Label === 'Who We Are') {
                subNavWrap.classList.add('about-us-sub-nav');
            } else if (l1Label === 'What we do') {
                subNavWrap.classList.add('what-we-do');
            } else if (l1Label === 'Investor Relations') {
                subNavWrap.classList.add('element-block'); // Specific class
            } else if (l1Label === 'careers') {
                subNavWrap.classList.add('careers-div'); // Specific class
            }

            // Transfer the clean UL/LI structure from the fragment's div
            // The megaMenuContentWrapper from the fragment should contain the clean ULs
            if (megaMenuContentWrapper) {
                Array.from(megaMenuContentWrapper.children).forEach(childNode => {
                    // Ensure only ULs are appended or wrap non-UL content in a UL/LI if necessary for strict menu structure
                    if (childNode.tagName === 'UL') {
                        const importedNode = document.importNode(childNode, true);
                        subNavWrap.appendChild(importedNode);
                    } else if (childNode.tagName === 'DIV' && childNode.querySelector('ul')) {
                        // Handle cases where menuHtml might be wrapped in another div (e.g., from IR)
                        Array.from(childNode.querySelectorAll('ul')).forEach(ul => {
                            const importedUl = document.importNode(ul, true);
                            subNavWrap.appendChild(importedUl);
                        });
                    }
                });
            }

            megaMenuCenterDiv.appendChild(subNavWrap);
            l1Li.appendChild(megaMenuDiv);
            mainUl.appendChild(l1Li);
        }
    });
  } else {
    // Fallback if fragment is a simple UL directly, or no L1 items found as expected.
    // This part assumes a flat UL structure. Real-world fragment will need adjustment.
    const simpleNavUl = fragment.querySelector('ul');
    if (simpleNavUl) {
        Array.from(simpleNavUl.children).forEach(l1LiFromFragment => {
            if (l1LiFromFragment.tagName === 'LI') {
                const l1Anchor = l1LiFromFragment.querySelector('a');
                if (l1Anchor) {
                    const l1Li = document.createElement('li');
                    l1Li.classList.add('has-child', 'hover-red');
                    l1Li.setAttribute('itemprop', 'name');
                    l1Li.setAttribute('data-once', 'nav-close-search');

                    const newL1Anchor = document.createElement('a');
                    newL1Anchor.setAttribute('itemprop', 'url');
                    newL1Anchor.href = l1Anchor.href;
                    newL1Anchor.textContent = l1Anchor.textContent;
                    l1Li.appendChild(newL1Anchor);

                    const svgSpan = document.createElement('span');
                    const svgPath = 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z';
                    svgSpan.appendChild(createSvgElement('-23.5 -23.5 122.80 122.80', svgPath));
                    l1Li.appendChild(svgSpan);

                    const megaMenuDiv = document.createElement('div');
                    megaMenuDiv.classList.add('mega-menu');
                    const megaMenuWrapContainer = document.createElement('div');
                    megaMenuWrapContainer.classList.add('wrap', 'container');
                    const megaMenuCenterDiv = document.createElement('div');
                    megaMenuCenterDiv.classList.add('center-div');
                    megaMenuWrapContainer.appendChild(megaMenuCenterDiv);
                    megaMenuDiv.appendChild(megaMenuWrapContainer);

                    // Placeholder for left-div content - customize as needed based on L1 label
                    const leftDiv = document.createElement('div');
                    leftDiv.classList.add('left-div');
                    leftDiv.innerHTML = `<h4><a>${l1Anchor.textContent.trim()} Info</a></h4><p>Some descriptive content related to ${l1Anchor.textContent.trim()}.</p>`;
                    megaMenuCenterDiv.appendChild(leftDiv);

                    const subNavWrap = document.createElement('div');
                    subNavWrap.classList.add('sub-nav-wrap');

                    // Directly append children ULs/LIs from the fragment's L1 element
                    Array.from(l1LiFromFragment.children).forEach(child => {
                        if (child.tagName === 'UL') {
                            subNavWrap.appendChild(document.importNode(child, true));
                        }
                    });
                    megaMenuCenterDiv.appendChild(subNavWrap);

                    l1Li.appendChild(megaMenuDiv);
                    mainUl.appendChild(l1Li);
                }
            }
        });
    }
  }

  // Icon Nav (Mobile & Desktop) - These are complex and contain form elements, hardcoding for mirroring.
  // Mobile icons are nested inside mainUl in original HTML (after L1 items).
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  mobileIconNav.innerHTML = `
      <ul>
        <li class="mail">
          <a href="https://www.mahindra.com/contact-us">Contact Us</a>
        </li>
        <li class="search" data-once="search-toggle search-stop-propagation">
          <a href="#" data-once="search-stop-propagation">
            <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
            <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
            </svg>
            <span data-once="search-stop-propagation"> Search</span>
          </a>
          <div class="search-screen-wrap" data-once="search-stop-propagation">
            <div class="wrap" data-once="search-stop-propagation">
              <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
                <div class="search-wrap" data-once="search-stop-propagation">
                  <div class="search-icon" data-once="search-stop-propagation">
                    <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
                      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                    </svg>
                  </div>
                  <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation">
                  <button class="submit-button" data-once="search-stop-propagation">
                    <div class="label" data-once="search-stop-propagation"> Submit </div>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
                      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                    </svg>
                  </button>
                </div>
                <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
                  <div class="swiper scrollSwiper" data-once="search-stop-propagation">
                    <div class="swiper-wrapper" data-once="search-stop-propagation">
                      <div class="swiper-slide" data-once="search-stop-propagation"></div>
                    </div>
                  </div>
                  <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
                </div>
              </form>
              <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul><li>Business</li><li>FY 21</li><li>Brands</li><li>XUV700</li><li>Global</li><li>Nanhi Kali</li></ul>
                </div>
              </div>
              <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul><li>Annual Report 2021 - 2022</li><li>Leadership Announcement</li><li>Latest Press Release</li><li>Brand Guidelines</li></ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
  `;
  mainUl.appendChild(mobileIconNav);

  // Desktop Icon Nav (Contact Us, Search)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  desktopIconNav.innerHTML = `
      <ul>
        <li class="mail">
          <a href="https://www.mahindra.com/contact-us">
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                        C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                        L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
            </svg>
          </a>
        </li>
        <li class="search" data-once="search-toggle search-stop-propagation">
          <a href="#" data-once="search-stop-propagation">
            <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
            <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
              <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
            </svg>
          </a>
          <div class="search-screen-wrap" data-once="search-stop-propagation">
            <div class="wrap" data-once="search-stop-propagation">
              <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
                <div class="search-wrap" data-once="search-stop-propagation">
                  <div class="search-icon" data-once="search-stop-propagation">
                    <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
                      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                    </svg>
                  </div>
                  <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation">
                  <button class="submit-button" data-once="search-stop-propagation">
                    <div class="label" data-once="search-stop-propagation"> Submit </div>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
                      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
                    </svg>
                  </button>
                </div>
                <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
                  <div class="swiper scrollSwiper" data-once="search-stop-propagation">
                    <div class="swiper-wrapper" data-once="search-stop-propagation">
                      <div class="swiper-slide" data-once="search-stop-propagation"></div>
                    </div>
                  </div>
                  <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
                </div>
              </form>
              <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul><li>Business</li><li>FY 21</li><li>Brands</li><li>XUV700</li><li>Global</li><li>Nanhi Kali</li></ul>
                </div>
              </div>
              <div class="search-suggestions-wrap" data-once="search-stop-propagation">
                <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
                <div class="tokens-wrap" data-once="search-stop-propagation">
                  <ul><li>Annual Report 2021 - 2022</li><li>Leadership Announcement</li><li>Latest Press Release</li><li>Brand Guidelines</li></ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
  `;
  navElement.appendChild(desktopIconNav);

  wrapDiv.appendChild(navElement);

  // Year 80 Logo (This is outside the <nav> element in the original HTML, at the same level as main <nav>)
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = 'https://www.mahindra.com/';
  const year80LogoImg = document.createElement('img');
  year80LogoImg.src = 'https://www.mahindra.com/sites/default/files/2026-03/80thYearLogo_Gold_com.webp';
  year80LogoImg.alt = '80th Year Logo Gold';
  year80LogoImg.title = '80thYearLogo_Gold';
  year80LogoImg.classList.add('hiddenlogo1', 'years-80');
  year80LogoImg.width = '74';
  year80LogoImg.height = '60';
  year80LogoImg.loading = 'lazy';
  year80LogoLink.appendChild(year80LogoImg);
  year80LogoDiv.appendChild(year80LogoLink);
  wrapDiv.appendChild(year80LogoDiv);
}
