import { getMetadata, createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const BLUEPRINT_DATA = {
  "sections": [
    {
      "l1Label": "Term Insurance",
      "l1Href": "/term-insurance",
      "items": [
        {
          "label": "1 Crore Term Insurance",
          "href": "/term-insurance/what-is-1-crore-term-insurance",
          "icon": "money",
          "description": "Secure your family with a 1 Crore term insurance",
          "badge": "Rs. 21/day<sup>17</sup>",
          "badgeStyle": "price-badge"
        },
        {
          "label": "Term Insurance Tax Benefits",
          "href": "/term-insurance/term-insurance-tax-benefits",
          "icon": "tax-savings-1",
          "description": "Double the benefit. Protect your loved ones and save on tax"
        },
        {
          "label": "Term Insurance Calculator",
          "href": "/tools-and-calculators/term-insurance-calculator",
          "icon": "calculator-bold",
          "description": "Know how much life cover you need with our Term calculator"
        },
        {
          "label": "iSelect Smart360 Term Plan",
          "href": "/term-insurance/iselect-smart360-term-plan",
          "icon": "child-education",
          "description": "An all-in-one plan offering comprehensive coverage for you"
        },
        {
          "label": "Young Term Plan",
          "href": "/term-insurance/young-term-plan",
          "icon": "life-cover",
          "description": "Start Young, Pay Less, Stay Secure with Young Term Plan",
          "badge": "Rs. 1 Cr Life cover at @ Rs. 21/day<sup>17</sup>",
          "badgeStyle": "price-badge"
        },
        {
          "label": "Term Plan with Return Of Premium",
          "href": "/term-insurance/term-plan-with-return-of-premium",
          "icon": "return",
          "description": "Get your premiums back on surviving the entire policy."
        }
      ],
      "bannerTemplate": "termInsuranceBanner"
    },
    {
      "l1Label": "Investment Plans",
      "l1Href": "/savings-and-investment-plans",
      "items": [
        {
          "label": "ULIP Plan",
          "href": "/ulips",
          "icon": "graph",
          "description": "Get life cover and market-linked benefits with ULIP"
        },
        {
          "label": "Savings Plan",
          "href": "/savings-and-investment-plans",
          "icon": "expenses",
          "description": "Get life cover + guaranteed benefits with our savings plan"
        },
        {
          "label": "Retirement Plan",
          "href": "/retirement-plans",
          "icon": "retirement",
          "description": "Plan for your golden age. Get the financial comfort you need"
        },
        {
          "label": "Child Insurance Plan",
          "href": "/child-insurance",
          "icon": "education-1",
          "description": "Leave the stress of your children’s future with a child insurance plan"
        },
        {
          "label": "Promise4Wealth",
          "href": "/savings-and-investment-plans/promise-4-wealth",
          "icon": "rupee",
          "description": "Life cover + Market-linked growth with flexible benefits."
        },
        {
          "label": "Promise4Growth Plus",
          "href": "/ulips/promise4growth-plus",
          "icon": "graph",
          "description": "Get complete control over your savings & insurance needs.",
          "badge": "Starts @ Rs.2k /month",
          "badgeStyle": "price-badge"
        },
        {
          "label": "iSelect Guaranteed Future Plus",
          "href": "/savings-and-investment-plans/iselect-guaranteed-future-plus",
          "icon": "expenses",
          "description": "Get guaranteed income from 2nd policy year with this plan"
        },
        {
          "label": "Investment Calculator",
          "href": "/tools-and-calculators/investment-calculator",
          "icon": "calculator-bold",
          "description": "Know how much to invest to make your future goals a reality"
        }
      ],
      "bannerTemplate": "investmentPlansBanner"
    },
    {
      "l1Label": "All Plans",
      "l1Href": "/product-list",
      "items": [
        {
          "label": "Term Insurance",
          "href": "/term-insurance",
          "icon": "life-cover",
          "items": [
            {
              "label": "Young Term Plan",
              "href": "/term-insurance/young-term-plan",
              "badge": "Rs. 1 Cr Life cover at @ Rs. 21/day<sup>17</sup>",
              "badgeStyle": "price-badge"
            },
            {
              "label": "iSelect Smart360 Term Plan",
              "href": "/term-insurance/iselect-smart360-term-plan"
            },
            {
              "label": "Promise2Protect",
              "href": "/term-insurance/promise2protect"
            },
            {
              "label": "View All",
              "href": "/product-list#term-plans",
              "isLink": true
            }
          ]
        },
        {
          "label": "Unit Linked Insurance Plans",
          "href": "/ulips",
          "icon": "graph",
          "items": [
            {
              "label": "Promise4Wealth",
              "href": "/savings-and-investment-plans/promise-4-wealth",
              "badge": "New",
              "badgeStyle": "navigation__badge"
            },
            {
              "label": "Promise4Growth Plus",
              "href": "/ulips/promise4growth-plus",
              "badge": "Starts @ Rs.2k /month",
              "badgeStyle": "price-badge"
            },
            {
              "label": "SecureInvest",
              "href": "/ulips/secure-invest"
            },
            {
              "label": "View All",
              "href": "/product-list#ulips",
              "isLink": true
            }
          ]
        },
        {
          "label": "Tax Saving Plan",
          "href": "/tax-saving-plans",
          "icon": "tax-savings-1",
          "items": [
            {
              "label": "Young Term Plan",
              "href": "/term-insurance/young-term-plan",
              "badge": "Rs. 1 Cr Life cover at @ Rs. 21/day<sup>17</sup>",
              "badgeStyle": "price-badge"
            },
            {
              "label": "iSelect Smart360 Term Plan",
              "href": "/term-insurance/iselect-smart360-term-plan"
            },
            {
              "label": "iSelect Guaranteed Future",
              "href": "/savings-and-investment-plans/iselect-guaranteed-future"
            },
            {
              "label": "View All",
              "href": "/product-list#tax-saving-plans",
              "isLink": true
            }
          ]
        },
        {
          "label": "Retirement Plans",
          "href": "/retirement-plans",
          "icon": "retirement",
          "items": [
            {
              "label": "Legacy Builder",
              "href": "/retirement-plans/legacy-builder",
              "badge": "New",
              "badgeStyle": "navigation__badge"
            },
            {
              "label": "iSelect Guaranteed Future Plus",
              "href": "/savings-and-investment-plans/iselect-guaranteed-future-plus"
            },
            {
              "label": "EZ Pension",
              "href": "/retirement-plans/ez-pension"
            },
            {
              "label": "View All",
              "href": "/product-list#retirement-plans",
              "isLink": true
            }
          ]
        },
        {
          "label": "Saving Plans",
          "href": "/savings-and-investment-plans",
          "icon": "expenses",
          "items": [
            {
              "label": "IncomeNow",
              "href": "/savings-and-investment-plans/incomenow"
            },
            {
              "label": "Promise4Life",
              "href": "/savings-and-investment-plans/promise4life"
            },
            {
              "label": "View All",
              "href": "/product-list#savings-plans",
              "isLink": true
            }
          ]
        },
        {
          "label": "Child Insurance Plans",
          "href": "/child-insurance",
          "icon": "education-1",
          "items": [
            {
              "label": "iSelect Guaranteed Future Plus",
              "href": "/savings-and-investment-plans/iselect-guaranteed-future-plus"
            },
            {
              "label": "View All",
              "href": "/product-list#child-insurance-plans",
              "isLink": true
            }
          ]
        },
        {
          "label": "Insurance Riders",
          "href": "#",
          "icon": "financial-immunity",
          "items": [
            {
              "label": "Accidental Benefit Rider (Linked)",
              "href": "https://www.canarahsbclife.com/insurance-riders/accidental-benefit-rider"
            },
            {
              "label": "Linked Critical Illness Benefit Rider",
              "href": "/insurance-riders/linked-critical-illness-benefit-rider"
            },
            {
              "label": "Group Critical Illness Rider",
              "href": "/insurance-riders/group-critical-illness-rider",
              "badge": "New",
              "badgeStyle": "navigation__badge"
            }
          ]
        },
        {
          "label": "GIFT City",
          "href": "#",
          "icon": "paper-money",
          "items": [
            {
              "label": "Future Dollar Investment",
              "href": "/international/future-dollar-investment-plan"
            }
          ]
        },
        {
          "label": "Online Life Insurance",
          "href": "/life-insurance-plans",
          "icon": "child-education",
          "items": [
            {
              "label": "Promise4Wealth",
              "href": "/savings-and-investment-plans/promise-4-wealth",
              "badge": "New",
              "badgeStyle": "navigation__badge"
            },
            {
              "label": "Promise4Growth Plus",
              "href": "/ulips/promise4growth-plus",
              "badge": "New",
              "badgeStyle": "navigation__badge"
            },
            {
              "label": "Young Term Plan",
              "href": "/term-insurance/young-term-plan",
              "badge": "Rs. 1 Cr Life cover at @ Rs. 21/day<sup>17</sup>",
              "badgeStyle": "price-badge"
            },
            {
              "label": "iSelect Guaranteed Future Plus",
              "href": "/savings-and-investment-plans/iselect-guaranteed-future-plus"
            },
            {
              "label": "iSelect Smart360 Term Plan",
              "href": "/term-insurance/iselect-smart360-term-plan"
            }
          ]
        },
        {
          "label": "Group Insurance Plans",
          "href": "/group-insurance",
          "icon": "respect-2",
          "items": [
            {
              "label": "Group Secure Plus",
              "href": "/group-insurance/group-secure-plus"
            },
            {
              "label": "Group Secure Plan",
              "href": "/group-insurance/group-secure"
            },
            {
              "label": "Group Term Edge Plan",
              "href": "/group-insurance/group-term-edge-plan"
            },
            {
              "label": "View All",
              "href": "/product-list#group-insurance-plans",
              "isLink": true
            }
          ]
        }
      ]
    },
    {
      "l1Label": "Customer Service",
      "l1Href": "/customer-service",
      "items": [
        {
          "label": "Manage Policy",
          "href": "/customer-service",
          "icon": "check-claim-status",
          "items": [
            {
              "label": "Pay Premium",
              "href": "https://customer.canarahsbclife.com/PremiumPayment"
            },
            {
              "label": "Premium Receipt",
              "href": "https://customer.canarahsbclife.com/login"
            },
            {
              "label": "Update KYC",
              "href": "https://customer.canarahsbclife.com/login"
            },
            {
              "label": "Duplicate Policy Pack",
              "href": "https://customer.canarahsbclife.com/login"
            },
            {
              "label": "Latest NAV",
              "href": "/funds-navs/latest-nav-history"
            },
            {
              "label": "Service Booklet &amp; E-statements",
              "href": "/content/dam/chli/pdfs/service-booklet.pdf"
            },
            {
              "label": "ENACH Registration",
              "href": "https://customer.canarahsbclife.com/EnachRegistration"
            },
            {
              "label": "View All",
              "href": "/customer-service",
              "isLink": true
            }
          ]
        },
        {
          "label": "Claims",
          "href": "/customer-service/claims",
          "icon": "hands-meet",
          "items": [
            {
              "label": "Register Claim",
              "href": "https://customer.canarahsbclife.com/ClaimsRegister"
            },
            {
              "label": "Claim Form",
              "href": "/customer-service/claims#documentRequired"
            },
            {
              "label": "Claim Status",
              "href": "https://customer.canarahsbclife.com/search_claim"
            },
            {
              "label": "Get Claim Assistance",
              "href": "/customer-service/claims#claimsCompanion"
            },
            {
              "label": "View All",
              "href": "/customer-service/claims",
              "isLink": true
            }
          ]
        },
        {
          "label": "Others",
          "href": "#",
          "icon": "pie-chart-document",
          "items": [
            {
              "label": "Track Application",
              "href": "/customer-service/track-application#trackApplication"
            },
            {
              "label": "Contact Us",
              "href": "/customer-service/contact-details"
            }
          ]
        },
        {
          "label": "Unclaimed Policies",
          "href": "https://www.canarahsbclife.com/customer-service/claims/unclaimed-amount#unclaimedAmount",
          "icon": "grievance-redressal",
          "items": [
            {
              "label": "Unclaimed Amount",
              "href": "/customer-service/claims/unclaimed-amount#unclaimedAmount"
            },
            {
              "label": "Check unclaimed amount moved to Senior Citizen Account",
              "href": "/customer-service/claims/unclaimed-amount-movement-to-senior-citizens-welfare-fund"
            }
          ]
        },
        {
          "label": "Grievance Redressal",
          "href": "/customer-service/#grievanceRedressal",
          "icon": "group-3",
          "items": []
        }
      ],
      "bannerTemplate": "customerServiceBanner"
    },
    {
      "l1Label": "Investor Relations",
      "l1Href": "#",
      "items": [
        {
          "label": "About the Company",
          "href": "/about-us",
          "icon": "contact-details",
          "items": [
            {
              "label": "Board of Directors",
              "href": "/about-us/board-of-directors"
            },
            {
              "label": "Composition of the Board Committees",
              "href": "/about-us/composition-of-board-of-directors-committee"
            }
          ]
        },
        {
          "label": "Offer Documents",
          "href": "/investor-relations/offer-documents",
          "icon": "issue-duplicate-policy",
          "items": []
        },
        {
          "label": "Financials",
          "href": "/investor-relations/financials",
          "icon": "frame",
          "items": [
            {
              "label": "Financial Results",
              "href": "/investor-relations/financials"
            },
            {
              "label": "Public Disclosure",
              "href": "/public-disclosures"
            }
          ]
        },
        {
          "label": "Information to Shareholders",
          "href": "#",
          "icon": "article",
          "items": [
            {
              "label": "Shareholder Meetings &amp; Voting",
              "href": "/investor-relations/information-to-shareholders/shareholder-meetings-and-voting"
            },
            {
              "label": "Shareholding &amp; Governance Information",
              "href": "/investor-relations/information-to-shareholders/shareholding-and-governance-information"
            },
            {
              "label": "Other Disclosures",
              "href": "/investor-relations/information-to-shareholders/other-disclosures"
            }
          ]
        },
        {
          "label": "Policies and Code of Conduct",
          "href": "/investor-relations/policies-and-code-of-conduct",
          "icon": "date",
          "items": []
        },
        {
          "label": "Bulletin Board",
          "href": "/investor-relations/bulletin-board",
          "icon": "pending-requirement",
          "items": []
        }
      ]
    }
  ],
  "templates": {
    "notificationMobileMenu": "<div class=\"d-md-none flex-column z-2 header__notification--mobile\"><section class=\"d-flex flex-column header__notification--item header__notification--item-background\" data-notification-bgcolor=\"#7FDBFF\" style=\"background-color: rgb(127, 219, 255);\"><a href=\"https://buyonlineinsurance.canarahsbclife.com/promise4WealthPlan/?source=website\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex p-2 gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/homepage/image/p4w-mobile-notification.webp\" alt=\"Promise4wealth\" loading=\"lazy\"/></div><div class=\"d-flex flex-column justify-content-center gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--content-title\">New Fund Launched with Promise4Wealth</h4><div class=\"text-black-400 header__notification--content-description rte-text\"><div><p>BSE 500 Enhanced Value 50 Fund. Past 5-yr benchmark returns* of index - 31.69%</p></div></div></div></div></a></section><section class=\"d-flex flex-column header__notification--item header__notification--item-background\"><a href=\"https://customer.canarahsbclife.com/PremiumPayment\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex p-2 gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/homepage/image/pay-premium-mobile-notification.webp\" alt=\"Reinstate Your Lapsed Policy - Canara HSBC Life Insurance\" loading=\"lazy\"/></div><div class=\"d-flex flex-column justify-content-center gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--content-title\">Reinstate Your Lapsed Policy</h4><div class=\"text-black-400 header__notification--content-description rte-text\"><div><p>Pay premium now &amp; continue enjoying the benefits.</p></div></div></div></div></a></section><section class=\"d-flex flex-column header__notification--item header__notification--item-background\"><a href=\"https://customer.canarahsbclife.com/login\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex p-2 gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/images/home-page/notification-images/kyc-mobile-notification.webp\" alt=\"Notification 2\" loading=\"lazy\"/></div><div class=\"d-flex flex-column justify-content-center gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--content-title\">Mandatory KYC Update as per PML Rules 2005</h4><div class=\"text-black-400 header__notification--content-description rte-text\"><div><p>Update your KYC records within 30 days of any changes</p></div></div></div></div></a></section><section class=\"d-flex flex-column header__notification--item header__notification--item-background\"><a href=\"/content/dam/chli/pdfs/claim-support-ahmedabad-plane-crash.pdf\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex p-2 gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/images/notification/expedited-claim-mobile-icon.webp\" alt=\"Fast Claim Process for Ahemdabad Plane Crash - Canara HSBC Life Insurance\" loading=\"lazy\"/></div><div class=\"d-flex flex-column justify-content-center gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--content-title\">We Stand with Families Affected by the Ahemdabad Plane Crash</h4><div class=\"text-black-400 header__notification--content-description rte-text\"><div><p>We&#39;re here to support with a quicker, simpler claim process.</p></div></div></div></div></a></section></div>",
    "termInsuranceBanner": "<div id=\"container-410c7b46d5\" class=\"cmp-container\"><div class=\"seasonalbanner\"><section class=\"seasonal__banner right-column\"><div class=\"swiper-container position-relative\"><div class=\"swiper seasonal__banner--slider swiper-initialized swiper-horizontal swiper-backface-hidden\"><div class=\"seasonal__banner--list swiper-wrapper d-flex align-items-center\" id=\"swiper-wrapper-9a37c707394faa44\" aria-live=\"off\"><div class=\"seasonal__banner--item swiper-slide swiper-slide-active swiper-slide-next\" role=\"group\" aria-label=\"1 / 1\" data-swiper-slide-index=\"0\" style=\"width: 413px;\"><a href=\"https://buyonlineinsurance.canarahsbclife.com/youngTermPlan/?source=website\" class=\"\" target=\"_blank\"><picture><source media=\"(max-width:590px)\"/><source media=\"(min-width:591px)\" srcset=\"/content/dam/chli/images/home-page/header-navigation/term-plan-navbar-banner.webp\"/><img src=\"/content/dam/chli/images/home-page/header-navigation/term-plan-navbar-banner.webp\" class=\"seasonal__banner--image object-fit-contain\" alt=\"Young Term Plan\" loading=\"lazy\"/></picture><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></div></div><span class=\"swiper-notification\" aria-live=\"assertive\" aria-atomic=\"true\"></span></div><div class=\"seasonal-pagination\"><div class=\"custom-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock\"><span class=\"swiper-pagination-bullet swiper-pagination-bullet-active\" tabindex=\"0\" role=\"button\" aria-label=\"Go to slide 1\" aria-current=\"true\"></span></div></div></div></section></div></div>",
    "investmentPlansBanner": "<div id=\"container-711fbb82f1\" class=\"cmp-container\"><div class=\"seasonalbanner\"><section class=\"seasonal__banner right-column\"><div class=\"swiper-container position-relative\"><div class=\"swiper seasonal__banner--slider swiper-initialized swiper-horizontal swiper-backface-hidden\"><div class=\"seasonal__banner--list swiper-wrapper d-flex align-items-center\" id=\"swiper-wrapper-34db6f9d29469eb10\" aria-live=\"off\"><div class=\"seasonal__banner--item swiper-slide swiper-slide-active swiper-slide-next\" role=\"group\" aria-label=\"1 / 1\" data-swiper-slide-index=\"0\" style=\"width: 413px;\"><a href=\"https://buyonlineinsurance.canarahsbclife.com/promise4WealthPlan/?source=website\" class=\"\"><picture><source media=\"(max-width:590px)\"/><source media=\"(min-width:591px)\" srcset=\"/content/dam/chli/images/home-page/header-navigation/p4w-navbar-banner.webp\"/><img src=\"/content/dam/chli/images/home-page/header-navigation/p4w-navbar-banner.webp\" class=\"seasonal__banner--image object-fit-contain\" alt=\"Promise4Wealth - Canara HSBC Life Insurance\" loading=\"lazy\"/></picture></a></div></div><span class=\"swiper-notification\" aria-live=\"assertive\" aria-atomic=\"true\"></span></div><div class=\"seasonal-pagination\"><div class=\"custom-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock\"><span class=\"swiper-pagination-bullet swiper-pagination-bullet-active\" tabindex=\"0\" role=\"button\" aria-label=\"Go to slide 1\" aria-current=\"true\"></span></div></div></div></section></div></div>",
    "customerServiceBanner": "<div id=\"container-4d9d002ec8\" class=\"cmp-container\"><div class=\"seasonalbanner\"><section class=\"seasonal__banner right-column\"><div class=\"swiper-container position-relative\"><div class=\"swiper seasonal__banner--slider swiper-initialized swiper-horizontal swiper-backface-hidden\"><div class=\"seasonal__banner--list swer-wrapper d-flex align-items-center\" id=\"swiper-wrapper-f8fab13e715aa84b\" aria-live=\"off\"><div class=\"seasonal__banner--item swiper-slide swiper-slide-active swiper-slide-next\" role=\"group\" aria-label=\"1 / 1\" data-swiper-slide-index=\"0\" style=\"width: 413px;\"><a href=\"https://customer.canarahsbclife.com/PremiumPayment?_gl=1*a71cnb*_gcl_au*MTA2NzEyMDUxOC4xNzcwNzI4NzA4*_ga*OTQ1NzQ3MDcyLjE3NzA3MjUxNzU.*_ga_51XFB89N2W*czE3NzA3MjUxNzQkbzEkZzEkdDE3NzA3Mjg4NTAkajIkbDAkaDA.\" class=\"\" target=\"_blank\"><picture><source media=\"(max-width:590px)\"/><source media=\"(min-width:591px)\" srcset=\"/content/dam/chli/images/home-page/header-navigation/policy-revival-navigational-banner.webp\"/><img src=\"/content/dam/chli/images/home-page/header-navigation/policy-revival-navigational-banner.webp\" class=\"seasonal__banner--image object-fit-contain\" alt=\"Policy Revival Banner\" loading=\"lazy\"/></picture><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></div></div><span class=\"swiper-notification\" aria-live=\"assertive\" aria-atomic=\"true\"></span></div><div class=\"seasonal-pagination\"><div class=\"custom-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock\"><span class=\"swiper-pagination-bullet swiper-pagination-bullet-active\" tabindex=\"0\" role=\"button\" aria-label=\"Go to slide 1\" aria-current=\"true\"></span></div></div></div></section></div></div>",
    "globalSearchPanel": "<section class=\"position-absolute global__search--wrapper vw-100 bg-white start-0 end-0 section_container--primary\"><div class=\"d-flex flex-column global__search--container\"><svg class=\"close-search text-black-500\" role=\"icon\"><title>close search</title><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#close\"></use></svg><form class=\"global__search--form mt-2\" autocomplete=\"off\" data-search-path=\"/content/chli/\" data-redirection-path=\"/content/chli/in/en/search-result-page\" data-result-count=\"5\" data-view-result=\"View Results\" data-no-result=\"No Result Found\"><div class=\"global__search__input--wrapper position-relative\"><input class=\"global__search--input text-capitalize\" name=\"searchText\" type=\"search\" placeholder=\"Search\"/><svg class=\"search-icon text-blue-400\" role=\"img\"><title>Search</title><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#search\"></use></svg><svg class=\"arrow-icon search__submit text-blue-400 cursor-pointer\" role=\"img\"><title>Search CTA</title><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#arrow-right\"></use></svg><small class=\"global__search--info font-10 float-end text-black-500\">Hit to enter </small><div class=\"global__search--result--wrapper position-relative\"><ul class=\"w-100 global__search__result--list bg-white d-none position-static\"></ul><div class=\"text-blue-400 font-16 text-center global__search__viewall mb-8 w-100 start-0 end-0 d-none\"><a title=\"View Results\" class=\"global__search__viewall--link\">View Results</a></div></div></div></form><div class=\"global__search--popular\"><div class=\"chli_title d-flex flex-column global__search__popular--title mb-2\"><h2 class=\"heading-2 text-start text-black-500\">Popular Searches</h2><span class=\"primary-bar\"></span></div><div class=\"global__search__popular--cards\"><ul class=\"global__search__popular--items d-flex pl-0 flex-wrap gap-4\"><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Term Insurance</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Life Insurance Plans</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Savings &amp; Investment Plan</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Child Insurance Plan</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">BMI Calculator</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Income Tax Calculator</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">What is Investment</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Retirement Calculator</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Sukanya Samriddhi Yojana</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">What is Insurance</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Features of Life Insurance</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">What is Pension</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Section 194</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Retirement Plans</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Critical illness Insurance</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">Benefits of Term Insurance</li><li class=\"global__search__popular--item border-1 border border-black-200 font-16 text-black-500\">ULIP Plan</li></ul></div></div></section>",
    "desktopNotificationPanel": "<div class=\"p-3 flex-column position-absolute z-2 header__notification--panel\"><section class=\"header__notification--item header__notification--item-background\" data-notification-bgcolor=\"#7FDBFF\" style=\"background-color: rgb(127, 219, 255);\"><a href=\"https://buyonlineinsurance.canarahsbclife.com/promise4WealthPlan/?source=website\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/homepage/image/p4w-desktop-notification.webp\" alt=\"Promise4wealth\" loading=\"lazy\"/></div><div class=\"d-flex flex-column gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--title\">New Fund Launched with Promise4Wealth</h4><div class=\"text-black-400 header__notification--description rte-text\"><div><p>BSE 500 Enhanced Value 50 Fund. Past 5-yr benchmark returns* of index - 31.69%</p></div></div></div></div></a></section><section class=\"header__notification--item header__notification--item-background\"><a href=\"https://customer.canarahsbclife.com/PremiumPayment\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/homepage/image/pay-premium-desktop-notification.webp\" alt=\"Reinstate Your Lapsed Policy - Canara HSBC Life Insurance\" loading=\"lazy\"/></div><div class=\"d-flex flex-column gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--title\">Reinstate Your Lapsed Policy</h4><div class=\"text-black-400 header__notification--description rte-text\"><div><p>Pay premium now &amp; continue enjoying the benefits.</p></div></div></div></div></a></section><section class=\"header__notification--item header__notification--item-background\"><a href=\"https://customer.canarahsbclife.com/login\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/images/home-page/notification-images/kyc-desktop-notification.webp\" alt=\"Notification 2\" loading=\"lazy\"/></div><div class=\"d-flex flex-column gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--title\">Mandatory KYC Update as per PML Rules 2005</h4><div class=\"text-black-400 header__notification--description rte-text\"><div><p>Update your KYC records within 30 days of any changes</p></div></div></div></div></a></section><section class=\"header__notification--item header__notification--item-background\"><a href=\"/content/dam/chli/pdfs/claim-support-ahmedabad-plane-crash.pdf\" class=\"d-flex flex-column header__notification--item\"><div class=\"d-flex gap-5 header__notification--item-content\"><div class=\"header__notification--icon\"><img src=\"/content/dam/chli/images/notification/expedited-claim-desktop-icon.webp\" alt=\"Fast Claim Process for Ahemdabad Plane Crash - Canara HSBC Life Insurance\" loading=\"lazy\"/></div><div class=\"d-flex flex-column gap-3 header__notification--content\"><h4 class=\"text-black-500 header__notification--title\">We Stand with Families Affected by the Ahemdabad Plane Crash</h4><div class=\"text-black-400 header__notification--description rte-text\"><div><p>We&#39;re here to support with a quicker, simpler claim process.</p></div></div></div></div></a></section></div>",
    "mobileSocialMediaLinks": "<div class=\"flex-column gap-3 header__socials\"><h4 class=\"hamburger__socials--text header__socials--text\">Follow Us</h4><ul class=\"d-flex justify-content-between header__socials--list\"><li class=\"header__socials--item\"><a href=\"https://m.facebook.com/CanaraHSBCLifeInsurance\" target=\"_blank\" class=\"header__socials--link\" rel=\"noopener noreferrer\" icon=\"facebook\"><div class=\"header__socials--icon\"><svg aria-hidden=\"true\" role=\"icon\" class=\"text-blue-400\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#facebook\"></use></svg></div><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li><li class=\"header__socials--item\"><a href=\"https://www.youtube.com/c/CanaraHSBCLifeInsurance\" target=\"_blank\" class=\"header__socials--link\" rel=\"noopener noreferrer\" icon=\"youtube\"><div class=\"header__socials--icon\"><svg aria-hidden=\"true\" role=\"icon\" class=\"text-blue-400\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#youtube\"></use></svg></div><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li><li class=\"header__socials--item\"><a href=\"https://www.instagram.com/canarahsbcobc/\" target=\"_blank\" class=\"header__socials--link\" rel=\"noopener noreferrer\" icon=\"instagram\"><div class=\"header__socials--icon\"><svg aria-hidden=\"true\" role=\"icon\" class=\"text-blue-400\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#instagram\"></use></svg></div><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li><li class=\"header__socials--item\"><a href=\"https://x.com/CanaraHSBCLI\" target=\"_blank\" class=\"header__socials--link\" rel=\"noopener noreferrer\" icon=\"xLogo\"><div class=\"header__socials--icon\"><svg aria-hidden=\"true\" role=\"icon\" class=\"text-blue-400\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#xLogo\"></use></svg></div><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li><li class=\"header__socials--item\"><a href=\"https://in.linkedin.com/company/canara-hsbc-life-insurance-company\" target=\"_blank\" class=\"header__socials--link\" rel=\"noopener noreferrer\" icon=\"linkedin\"><div class=\"header__socials--icon\"><svg aria-hidden=\"true\" role=\"icon\" class=\"text-blue-400\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#linkedin\"></use></svg></div><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li></ul></div>",
    "mobileAppDownloadLinks": "<div class=\"flex-column gap-3 header__app\"><h4 class=\"header__app--text\">Download the Canara HSBC Mobile App</h4><ul class=\"d-flex justify-content-between header__app--list\"><li class=\"header__app--item\"><a href=\"https://play.google.com/store/apps/details?id=com.choiceapp.genius&amp;hl=en_IN&amp;pli=1\" target=\"_blank\" class=\"header__app--link\"><svg aria-hidden=\"true\" role=\"icon\" class=\"header__app--icon\" alt=\"google play store\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#get-it-on-google-play\"></use></svg><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li><li class=\"header__app--item\"><a href=\"https://apps.apple.com/in/app/canara-hsbc-life/id1637840399\" target=\"_blank\" class=\"header__app--link\"><svg aria-hidden=\"true\" role=\"icon\" class=\"header__app--icon\" alt=\"apple play store\"><use xlink:href=\"/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg#app-store-download\"></use></svg><span class=\"cmp-link__screen-reader-only\">opens in a new tab</span></a></li></ul></div>"
  }
};

const SPRITE_SVG_PATH = '/etc.clientlibs/chli/clientlibs/clientlib-site/resources/images/sprite/sprite.svg';

function createEl(tag, classes, attributes) {
  const el = document.createElement(tag);
  if (classes) {
    if (Array.isArray(classes)) {
      el.classList.add(...classes);
    } else {
      el.classList.add(classes);
    }
  }
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }
  return el;
}

function createSVG(id, classes, title) {
  const svg = createEl('svg', classes, { 'aria-hidden': 'true', role: 'icon' });
  if (title) {
    const titleEl = createEl('title');
    titleEl.textContent = title;
    svg.append(titleEl);
  }
  const use = createEl('use', null, { 'xlink:href': `${SPRITE_SVG_PATH}#${id}` });
  svg.append(use);
  return svg;
}

function renderBadge(parent, item) {
  if (item.badge) {
    const badgeSpan = createEl('span', item.badgeStyle || 'navigation__badge', {});
    badgeSpan.innerHTML = item.badge;
    parent.append(badgeSpan);
  }
}

function buildSublinksNavigator(item) {
  const linkWrapper = createEl('div', ['sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5']);

  const iconDiv = createEl('div', 'sublinks__navigator--icon');
  if (item.icon) {
    iconDiv.append(createSVG(item.icon, '', item.label));
  }
  linkWrapper.append(iconDiv);

  const contentDiv = createEl('div', ['sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3']);
  if (item.atElementClickTracking) {
    contentDiv.classList.add('at-element-click-tracking');
  }

  const link = createEl('a', ['sublinks__navigator--content--title', 'text-black-500'], {
    href: item.href,
    target: item.href.startsWith('http') || item.href.includes('.pdf') ? '_blank' : '_self',
  });
  link.textContent = item.label;
  if (item.target === '_blank') {
    link.append(createEl('span', 'cmp-link__screen-reader-only', { 'aria-hidden': 'true' })).textContent = 'opens in a new tab';
  }
  renderBadge(link, item);
  contentDiv.append(link);

  if (item.description) {
    const descriptionWrapper = createEl('div', 'd-flex');
    const description = createEl('div', ['sublinks__navigator--content--description', 'text-black-400', 'rte-text']);
    description.innerHTML = `<div><p>${item.description}</p></div>`;
    descriptionWrapper.append(description);
    contentDiv.append(descriptionWrapper);
  }

  linkWrapper.append(contentDiv);
  return linkWrapper;
}

function buildSubLevelLinks(item) {
  const sublinksNavigator = createEl('div', ['sublinks__navigator--link', 'p-5', 'd-flex', 'gap-2', 'gap-md-5']);

  const iconDiv = createEl('div', 'sublinks__navigator--icon');
  if (item.icon) {
    iconDiv.append(createSVG(item.icon, '', item.label));
  }
  sublinksNavigator.append(iconDiv);

  const contentDiv = createEl('div', ['sublinks__navigator--content', 'd-flex', 'flex-column', 'gap-3']);
  sublinksNavigator.append(contentDiv);

  const titleLink = createEl('a', ['sublinks__navigator--content--title', 'text-black-500'], {
    href: item.href,
    target: item.href.startsWith('http') || item.href.includes('.pdf') ? '_blank' : '_self',
  });
  titleLink.textContent = item.label;
  if (item.target === '_blank') {
    titleLink.append(createEl('span', 'cmp-link__screen-reader-only', { 'aria-hidden': 'true' })).textContent = 'opens in a new tab';
  }
  contentDiv.append(titleLink);

  if (item.items && item.items.length > 0) {
    const nestedLinksContainer = createEl('div', ['d-flex', 'flex-column', 'gap-3']);
    item.items.forEach((subItem) => {
      const nestedLink = createEl('a', ['d-flex'], {
        href: subItem.href,
        target: subItem.href.startsWith('http') || subItem.href.includes('.pdf') ? '_blank' : '_self',
      });
      const p = createEl('p', ['sublinks__navigator--content--description', 'text-black-400']);
      p.textContent = subItem.label;
      nestedLink.append(p);
      renderBadge(nestedLink, subItem);
      if (subItem.target === '_blank') {
        nestedLink.append(createEl('span', 'cmp-link__screen-reader-only', { 'aria-hidden': 'true' })).textContent = 'opens in a new tab';
      }
      nestedLinksContainer.append(nestedLink);
    });
    if (item.items.some((subItem) => subItem.isLink)) {
      const viewAllLink = item.items.find((subItem) => subItem.isLink);
      if (viewAllLink) {
        const linkEl = createEl('a', ['mt-3', 'text-blue-400', 'chli_btn--link'], { href: viewAllLink.href });
        linkEl.textContent = viewAllLink.label;
        nestedLinksContainer.append(linkEl);
      }
    }
    contentDiv.append(nestedLinksContainer);
  }
  return sublinksNavigator;
}

function addInteractiveListeners(element) {
  const overlay = document.querySelector('.header__overlay');
  // Hamburger Menu functionality
  const hamburgerButton = element.querySelector('.header__hamburger--button');
  const hamburgerMenu = element.querySelector('.header__hamburger--menu');
  const hamburgerCloseIcon = element.querySelector('.header__hamburger--close-icon');

  if (hamburgerButton && hamburgerMenu && overlay) {
    const toggleMenu = () => {
      hamburgerMenu.classList.toggle('is-open');
      overlay.classList.toggle('d-none');
      document.body.classList.toggle('scroll-locked');
      hamburgerButton.classList.toggle('is-open');
    };
    hamburgerButton.addEventListener('click', toggleMenu);
    hamburgerCloseIcon?.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  // Mobile Accordion functionality
  element.querySelectorAll('.header__accordion--button').forEach((button) => {
    const headerArrowIcon = button.nextElementSibling;
    if (headerArrowIcon) {
      const collapseId = headerArrowIcon.getAttribute('data-bs-target');
      const collapseElement = element.querySelector(collapseId);
      if (collapseElement) {
        headerArrowIcon.addEventListener('click', () => {
          const isExpanded = headerArrowIcon.classList.contains('collapsed');
          headerArrowIcon.classList.toggle('collapsed');
          collapseElement.classList.toggle('collapse');
          collapseElement.classList.toggle('show');
          headerArrowIcon.querySelector('svg').setAttribute('aria-expanded', !isExpanded);
        });
        // Make accordion button also toggle if it's not a direct link itself
        if (button.tagName === 'BUTTON') {
          button.addEventListener('click', () => {
            const isExpanded = headerArrowIcon.classList.contains('collapsed');
            headerArrowIcon.classList.toggle('collapsed');
            collapseElement.classList.toggle('collapse');
            collapseElement.classList.toggle('show');
            headerArrowIcon.querySelector('svg').setAttribute('aria-expanded', !isExpanded);
          });
        }
      }
    }
  });

  // Desktop Dropdown hover functionality
  element.querySelectorAll('.header__navbar--item').forEach((item) => {
    const dropdown = item.querySelector('.header__navbar--dropdown');
    if (dropdown) {
      item.addEventListener('mouseenter', () => {
        dropdown.classList.add('is-open');
        dropdown.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', () => {
        dropdown.classList.remove('is-open');
        dropdown.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Search functionality
  const searchTrigger = element.querySelector('.header__search');
  const searchPanel = element.querySelector('.global__search--wrapper');
  const closeSearchBtn = element.querySelector('.global__search--wrapper .close-search');

  if (searchTrigger && searchPanel) {
    searchTrigger.addEventListener('click', () => {
      searchPanel.classList.add('is-open');
      document.body.classList.add('scroll-locked');
    });
    closeSearchBtn?.addEventListener('click', () => {
      searchPanel.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    });
  }

  // Notification functionality
  const notificationTrigger = element.querySelector('.header__notification--trigger');
  const notificationPanel = element.querySelector('.header__notification--panel');

  if (notificationTrigger && notificationPanel) {
    notificationTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationPanel.classList.toggle('is-open');
      notificationTrigger.setAttribute('aria-expanded', notificationPanel.classList.contains('is-open'));
    });
    document.addEventListener('click', (e) => {
      if (!notificationPanel.contains(e.target) && notificationPanel.classList.contains('is-open')) {
        notificationPanel.classList.remove('is-open');
        notificationTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

export default async function decorate(block) {
  block.classList.add('header', 'header--container', 'position-fixed', 'top-0', 'w-100');
  block.innerHTML = ''; // Clear existing content

  const overlay = createEl('div', ['header__overlay', 'd-none', 'position-fixed', 'top-0', 'w-100', 'h-100']);
  block.append(overlay);

  const contentWrapper = createEl('div', ['position-absolute', 'w-100']);
  block.append(contentWrapper);

  // --- Mobile Hamburger Menu (hidden by default on desktop) ---
  const mobileNav = createEl('nav', ['position-fixed', 'top-0', 'end-0', 'd-flex', 'flex-column', 'gap-6', 'header__hamburger--menu']);
  contentWrapper.append(mobileNav);

  // Hamburger Head (Notifications Title & Close Icon)
  const hamburgerHead = createEl('div', ['align-self-end', 'd-flex', 'justify-content-between', 'w-100', 'd-md-none', 'header__hamburger--head']);
  hamburgerHead.append(createEl('div', 'header__hamburger--head-title', { textContent: 'Notifications' }));
  hamburgerHead.append(createSVG('close', ['arrow', 'header__hamburger--close-icon']));
  mobileNav.append(hamburgerHead);

  // Mobile Notification Menu
  mobileNav.insertAdjacentHTML('beforeend', BLUEPRINT_DATA.templates.notificationMobileMenu);

  // Accordion Menu Items (mobile)
  const mobileMenuWrapper = createEl('div', ['d-flex', 'flex-column', 'justify-content-between', 'mobile__menu--wrapper']);
  const mobileAccordion = createEl('div', ['accordion', 'header__accordion']);
  mobileMenuWrapper.append(mobileAccordion);

  BLUEPRINT_DATA.sections.forEach((section, index) => {
    const accordionItem = createEl('section', ['accordion-item', 'd-md-none', 'header__accordion--item']);
    const headingId = `panel-heading-${index + 1}`;
    const collapseId = `panel-collapse-${index + 1}-norm-nav`;

    const h2 = createEl('h2', ['accordion-header', 'header__accordion--heading'], { id: headingId });

    const linkEl = createEl('a', ['accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'header__accordion--button', 'navigation_link'], {
      type: 'button',
      href: section.l1Href,
      textContent: section.l1Label,
    });
    h2.append(linkEl);

    const arrowSpan = createEl('span', ['header__accordion--button', 'collapsed', 'header_arrow_icon'], {
      'data-bs-toggle': 'collapse',
      'data-bs-target': `#${collapseId}`,
    });
    const arrowSvg = createSVG('drop-up-caret', ['arrow', 'header__accordion--arrow'], null, { 'aria-expanded': 'true', 'aria-controls': collapseId });
    arrowSpan.append(arrowSvg);
    h2.append(arrowSpan);
    accordionItem.append(h2);

    const collapseDiv = createEl('div', ['accordion-collapse', 'collapse', 'header__accordion--collapse'], {
      id: collapseId,
      'aria-labelledby': headingId,
      'data-label': section.l1Label,
    });
    const accordionBody = createEl('div', ['accordion-body', 'header__accordion--body']);
    collapseDiv.append(accordionBody);

    const dropdownItemsContainer = createEl('div', ['d-flex', 'flex-wrap']); // Use flex-wrap for columns
    const columnCount = section.items?.length > 0 ? (section.bannerTemplate ? 3 : 2) : 1; // Heuristic based on HTML structure
    if (columnCount > 0) {
        // Group items into columns, for mobile it's often just a single column of items
        const itemContainer = createEl('div', ['dropdown-item', 'header__accordion--dropdown-item']);
        itemContainer.setAttribute('data-coloumn-count', columnCount);

        const sublinksNavigatorContainer = createEl('div', 'sublinks__naviagator');
        section.items?.forEach((item) => {
            if (item.items && item.items.length > 0) {
                sublinksNavigatorContainer.append(buildSubLevelLinks(item));
            } else {
                sublinksNavigatorContainer.append(buildSublinksNavigator(item));
            }
        });
        itemContainer.append(sublinksNavigatorContainer);
        accordionBody.append(itemContainer);
    }

    if (section.bannerTemplate) {
        const bannerCol = createEl('div', ['dropdown-item', 'header__accordion--dropdown-item']);
        bannerCol.setAttribute('data-coloumn-count', columnCount);
        bannerCol.innerHTML = BLUEPRINT_DATA.templates[section.bannerTemplate];
        accordionBody.append(bannerCol);
    }

    accordionItem.append(collapseDiv);
    mobileAccordion.append(accordionItem);
  });

  // Static Accordion Items for Mobile (About Us, Blogs, etc.)
  const staticMobileSections = [
    { label: 'About Us', href: '/about-us', items: [
      { label: 'About Canara HSBC Life Insurance', href: '/about-us' },
      { label: 'Vision &amp; Values', href: '/about-us/vision-and-values' },
      { label: 'Leadership Team', href: '/about-us/leadership-team' },
      { label: 'Corporate Social Responsibility', href: '/about-us/corporate-social-responsibility' },
      { label: 'Awards &amp; Recognition', href: '/about-us/awards-recognition' },
      { label: 'GARV', href: '/garv' },
    ]},
    { label: 'Blogs', href: '#', badge: 'New Articles', badgeStyle: 'navigation__badge--text', items: [
      { label: 'Tax Saving Plans', href: '/blog/tax-saving' },
      { label: 'Child Plan', href: '/blog/child-plan' },
      { label: 'Life Insurance', href: '/blog/life-insurance' },
      { label: 'Term Insurance', href: '/blog/term-insurance' },
      { label: 'Savings Plan', href: '/blog/saving-plan' },
      { label: 'Retirement Plan', href: '/blog/retirement-plan' },
      { label: 'ULIP', href: '/blog/ulip' },
      { label: 'Budget News', href: '/blog/budget-news' },
    ]},
    { label: 'Tools &amp; Calculators', href: '#', items: [
      { label: 'Income Tax Calculator', href: '/tools-and-calculators/income-tax-calculator' },
      { label: 'Investment Calculator', href: '/tools-and-calculators/investment-calculator' },
      { label: 'Child Insurance Calculator', href: '/tools-and-calculators/child-calculator' },
      { label: 'Retirement Calculator', href: '/tools-and-calculators/retirement-calculator' },
      { label: 'Term Insurance Calculator', href: '/tools-and-calculators/term-insurance-calculator' },
      { label: 'BMI Calculator', href: '/tools-and-calculators/bmi-calculator' },
      { label: 'PPF Calculator', href: '/tools-and-calculators/ppf-calculator' },
      { label: 'ULIP Calculator', href: '/tools-and-calculators/ulip-calculator' },
    ]},
    { label: 'Bima Bharosa', href: 'https://bimabharosa.irdai.gov.in/', target: '_blank' },
    { label: 'Careers', href: '#', items: [
      { label: 'HR Connect', href: '/careers' },
      { label: 'Job Vacancies', href: '/careers/vacancies' },
    ]},
    { label: 'Media Center', href: '#', items: [
      { label: 'News and Press Release', href: '/media-center' },
    ]},
  ];

  staticMobileSections.forEach((section, index) => {
    const accordionItem = createEl('section', ['accordion-item', 'header__accordion--item']);
    const headingId = `panel-heading-static-${index + 1}`;
    const collapseId = `panel-collapse-static-${index + 1}`;

    const h2 = createEl('h2', ['accordion-header', 'header__accordion--heading'], { id: headingId });
    const buttonDiv = createEl('button', ['accordion-button', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'text-black-500', 'header__accordion--button'], { type: 'button' });
    const innerDiv = createEl('div', ['d-flex', 'w-100']);
    const link = createEl('a', ['d-flex', 'w-100'], { href: section.href });
    link.innerHTML = section.label;
    if (section.target === '_blank') {
      link.append(createEl('span', 'cmp-link__screen-reader-only', { 'aria-hidden': 'true' })).textContent = 'opens in a new tab';
    }
    if (section.badge) {
      const badgeDiv = createEl('div', section.badgeStyle);
      badgeDiv.textContent = section.badge;
      link.append(badgeDiv);
    }
    innerDiv.append(link);
    buttonDiv.append(innerDiv);
    h2.append(buttonDiv);

    if (section.items) {
      const arrowSpan = createEl('span', ['header__accordion--button', 'collapsed', 'header_arrow_icon'], {
        'data-bs-toggle': 'collapse',
        'data-bs-target': `#${collapseId}`,
      });
      const arrowSvg = createSVG('drop-up-caret', ['arrow', 'header__accordion--arrow'], null, { 'aria-expanded': 'true', 'aria-controls': collapseId });
      arrowSpan.append(arrowSvg);
      buttonDiv.append(arrowSpan);
    }

    accordionItem.append(h2);

    if (section.items) {
      const collapseDiv = createEl('div', ['accordion-collapse', 'collapse', 'header__accordion--collapse'], {
        id: collapseId,
        'aria-labelledby': headingId,
      });
      const accordionBody = createEl('div', ['accordion-body', 'header__accordion--body']);
      section.items.forEach((item) => {
        const itemLink = createEl('a', ['text-black-500', 'header__accordion--link'], { href: item.href });
        itemLink.innerHTML = item.label;
        if (item.target === '_blank') {
          itemLink.append(createEl('span', 'cmp-link__screen-reader-only', { 'aria-hidden': 'true' })).textContent = 'opens in a new tab';
        }
        accordionBody.append(itemLink);
      });
      collapseDiv.append(accordionBody);
      accordionItem.append(collapseDiv);
    }

    mobileAccordion.append(accordionItem);
  });

  mobileMenuWrapper.append(mobileAccordion);

  // Social Media Links (mobile)
  const socialAppContainer = createEl('div', ['header__accordion--app', 'bg-white'], { style: 'margin-top: 10051.1px;' }); // Replicating inline style
  socialAppContainer.insertAdjacentHTML('beforeend', BLUEPRINT_DATA.templates.mobileSocialMediaLinks);
  socialAppContainer.append(createEl('div', ['w-100', 'header__accordion--divider', 'my-4', 'bg-black-200']));
  // Mobile App Links
  socialAppContainer.insertAdjacentHTML('beforeend', BLUEPRINT_DATA.templates.mobileAppDownloadLinks);
  mobileMenuWrapper.append(socialAppContainer);

  mobileNav.append(mobileMenuWrapper);

  // --- Main Desktop Navigation ---
  const desktopNav = createEl('nav', ['position-relative', 'top-0', 'header__navbar', 'w-100']);
  contentWrapper.append(desktopNav);

  const navbarInner = createEl('div', ['navbar', 'navbar-expand-md', 'd-flex', 'section_container--primary', 'py-3', 'justify-content-between', 'align-items-center', 'w-100', 'bg-white']);
  desktopNav.append(navbarInner);

  // Logo
  const logoLink = createEl('a', ['navbar-brand', 'p-0', 'header__logo', 'position-relative'], { href: '/' });
  const logoImg = createOptimizedPicture(
    '/content/dam/chli/homepage/image/canara-hsbc-life-insurance-logo.svg',
    'Canara HSBC Life Insurance',
    true,
    [{ width: '150' }],
  );
  logoImg.classList.add('w-100', 'h-100', 'header__logo--image', 'position-absolute', 'z-2');
  logoLink.append(logoImg);
  navbarInner.append(logoLink);

  // Desktop Nav Links
  const navbarCollapse = createEl('div', ['collapse', 'navbar-collapse', 'justify-content-center', 'header__navbar--collapse'], { id: 'navbarNavDropdown' });
  const navbarList = createEl('ul', ['navbar-nav', 'gap-10', 'header__navbar--list']);
  navbarCollapse.append(navbarList);

  BLUEPRINT_DATA.sections.forEach((section, index) => {
    const navItem = createEl('li', ['nav-item', 'header__navbar--item', 'text-center']);
    const linkWrapper = createEl('div', 'd-flex');
    const navLink = createEl('a', ['nav-link', 'header__navbar--link'], {
      href: section.l1Href,
      id: `navbarDropdownMenuLink${index}`,
      role: 'button',
      'aria-expanded': 'false',
      textContent: section.l1Label,
    });
    navLink.append(createEl('span', 'header__navbar--item-underline'));
    linkWrapper.append(navLink);
    navItem.append(linkWrapper);

    if (section.items && section.items.length > 0 || section.bannerTemplate) {
      const dropdown = createEl('ul', ['bg-white', 'nav__dropdown', 'header__navbar--dropdown', 'position-fixed', 'section_container--primary', 'pt-12', 'pb-8', 'start-0', 'w-100', 'border-0', 'rounded-0', 'published__height'], {
        'aria-labelledby': `navbarDropdownMenuLink${index}`,
        'data-column-count': section.bannerTemplate ? '3' : '2',
        style: `grid-template-columns: repeat(${section.bannerTemplate ? 3 : 2}, minmax(0px, 1fr)); gap: 20px;`,
      });

      // Distribute items into columns
      const itemsPerColumn = Math.ceil(section.items.length / (section.bannerTemplate ? 2 : 2));
      let currentItemIndex = 0;
      for (let i = 0; i < (section.bannerTemplate ? 2 : 1); i += 1) { // Two columns for items, third for banner if exists
        const column = createEl('li', ['dropdown-item', 'header__navbar--dropdown-column']);
        const sublinksNavigatorContainer = createEl('div', 'sublinks__naviagator');
        const columnItems = section.items.slice(currentItemIndex, currentItemIndex + itemsPerColumn);
        columnItems.forEach((item) => {
          if (item.items && item.items.length > 0) {
            sublinksNavigatorContainer.append(buildSubLevelLinks(item));
          } else {
            sublinksNavigatorContainer.append(buildSublinksNavigator(item));
          }
        });
        column.append(sublinksNavigatorContainer);
        dropdown.append(column);
        currentItemIndex += itemsPerColumn;
      }

      if (section.bannerTemplate) {
        const bannerCol = createEl('li', ['dropdown-item', 'header__navbar--dropdown-column']);
        bannerCol.innerHTML = BLUEPRINT_DATA.templates[section.bannerTemplate];
        dropdown.append(bannerCol);
      }
      navItem.append(dropdown);
    }
    navbarList.append(navItem);
  });

  navbarInner.append(navbarCollapse);

  // Global Buttons (Search, Notification, Login, Hamburger)
  const headerButtons = createEl('div', ['navigation__buttons', 'd-flex', 'align-items-center', 'gap-5', 'header__buttons']);
  navbarInner.append(headerButtons);

  // Search
  const searchDiv = createEl('div', ['bg-transparent', 'header__search', 'cursor-pointer']);
  searchDiv.append(createSVG('search', ['header__search--svg-find']));
  const searchPanelContainer = createEl('div'); // Wrapper for search template
  searchPanelContainer.innerHTML = BLUEPRINT_DATA.templates.globalSearchPanel;
  searchDiv.append(searchPanelContainer);
  headerButtons.append(searchDiv);

  // Notifications
  const notificationTrigger = createEl('div', ['d-flex', 'flex-column', 'align-items-end', 'gap-2', 'position-relative', 'header__notification--trigger']);
  const notificationCount = createEl('span', ['header__notification--trigger-text', 'text-center', 'position-absolute'], { 'data-notification-text': 'true', 'data-text-color': 'rgb(255,255,255)', 'data-background-color': '#Db0011', style: 'color: rgb(255, 255, 255); background-color: rgb(219, 0, 17);' });
  notificationCount.textContent = '1'; // Example count
  notificationTrigger.append(notificationCount);
  notificationTrigger.append(createSVG('bell-icon', ['text-blue-400', 'header__notification--trigger-svg']));
  const desktopNotificationPanelContainer = createEl('div');
  desktopNotificationPanelContainer.innerHTML = BLUEPRINT_DATA.templates.desktopNotificationPanel;
  notificationTrigger.append(desktopNotificationPanelContainer);
  headerButtons.append(notificationTrigger);

  // Login
  const loginLink = createEl('a', ['d-flex', 'align-items-center', 'gap-2', 'text-blue-400', 'header__login'], {
    href: 'https://customer.canarahsbclife.com/login',
    target: '_blank',
  });
  loginLink.append(createSVG('user-icon'));
  loginLink.append(createEl('span', ['logntext', 'd-none', 'd-md-block', 'header__login--text', 'text-nowrap'], { textContent: 'Login' }));
  loginLink.append(createEl('span', 'cmp-link__screen-reader-only', { textContent: 'opens in a new tab' }));
  headerButtons.append(loginLink);

  // Hamburger button (desktop hidden, mobile visible)
  const hamburgerButton = createEl('button', ['position-relative', 'text-blue-400', 'header__hamburger--button']);
  hamburgerButton.append(createSVG('hamburger-icon', 'header__hamburger--open'));
  hamburgerButton.append(createSVG('close', ['position-absolute', 'start-0', 'bottom-0', 'header__hamburger--close']));
  headerButtons.append(hamburgerButton);

  addInteractiveListeners(block);
}
