import { Product } from './types';

// Realistic hardware placeholders based on current enterprise pricing in Norway
// URLs point to Prisjakt or manufacturer to avoid 502 Bad Gateway errors when clicked from within Excel.

export const products: Product[] = [
  // LAPTOPS (Target: IT Nerds / Developers)
  {
    id: 'lap-1',
    name: 'Lenovo ThinkPad L14 Gen 4 (Ryzen 5 PRO, 16GB RAM)',
    category: 'Laptop',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 11500,
    energy_use_W: 45,
    recyclable_percent: 65,
    expected_lifetime_years: 3,
    repairability_score: 6,
    eco_certifications: ['TCO Certified'],
    vendor_link: 'https://www.lenovo.com/no/no/p/laptops/thinkpad/thinkpadl/thinkpad-l14-gen-4-(14-inch-amd)/len101t0068',
    notes: 'God ytelse for kontorbruk, men kanskje litt sped for tunge utviklingsoppgaver.',
    justificationTemplate: 'Valgt for lav innkjøpspris og OK reparerbarhet, passer best for administrative oppgaver.'
  },
  {
    id: 'lap-2',
    name: 'Lenovo ThinkPad T14 Gen 4 (Core i7, 32GB RAM)',
    category: 'Laptop',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 18500,
    energy_use_W: 65,
    recyclable_percent: 75,
    expected_lifetime_years: 4,
    repairability_score: 7,
    eco_certifications: ['TCO Certified', 'ENERGY STAR'],
    vendor_link: 'https://www.lenovo.com/no/no/p/laptops/thinkpad/thinkpadt/thinkpad-t14-gen-4-(14-inch-intel)/len101t0057',
    notes: 'Veldig solid arbeidshest for IT-nerds. Nok RAM til virtualisering.',
    justificationTemplate: 'Balanserer kraft for utviklere med bransjeledende holdbarhet og ENERGY STAR-sertifisering.'
  },
  {
    id: 'lap-3',
    name: 'Apple MacBook Pro 14" (M3 Pro, 36GB Unified Memory)',
    category: 'Laptop',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 32990,
    energy_use_W: 24, // Extreme efficiency
    recyclable_percent: 85, // Highly recyclable aluminum
    expected_lifetime_years: 5,
    repairability_score: 4, // Apple is hard to repair
    eco_certifications: ['ENERGY STAR', 'EPEAT Gold'],
    vendor_link: 'https://www.apple.com/no/shop/buy-mac/macbook-pro/14-tommer-m3-pro',
    notes: 'Glimrende ytelse per watt, laget av resirkulert aluminium.',
    justificationTemplate: 'Ekstremt lavt strømforbruk (ARM-arkitektur) og EPEAT Gold for materialbruk, overlegen levetid.'
  },

  // DESKTOPS (Target: IT Support stationary / general use)
  {
    id: 'desk-1',
    name: 'HP Pro SFF 400 G9 (Core i5, 16GB RAM)',
    category: 'Desktop',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 8500,
    energy_use_W: 180,
    recyclable_percent: 50,
    expected_lifetime_years: 4,
    repairability_score: 6,
    eco_certifications: [],
    vendor_link: 'https://www.hp.com/no-no/shop/product.aspx?id=6B243EA&opt=UUW&sel=DTP',
    notes: 'Kompakt PC for resepsjon/enkel support.',
    justificationTemplate: 'Lav pris og tilstrekkelig for support-oppgaver, men høyere relativt energiforbruk.'
  },
  {
    id: 'desk-2',
    name: 'Dell OptiPlex Micro Plus 7010 (Core i5, 16GB RAM)',
    category: 'Desktop',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 10500,
    energy_use_W: 90,
    recyclable_percent: 60,
    expected_lifetime_years: 4,
    repairability_score: 7,
    eco_certifications: ['ENERGY STAR'],
    vendor_link: 'https://www.dell.com/no-no/shop/bærbare-og-stasjonære-datorer/optiplex-micro-form-factor/spd/optiplex-7010-micro',
    notes: 'Liten formfaktor som trekker veldig lite strøm.',
    justificationTemplate: 'Lavt strømforbruk for stasjonær enhet og ENERGY STAR-sertifisert, perfekt for IT-support.'
  },
  {
    id: 'desk-3',
    name: 'Lenovo ThinkStation P3 Tiny (Core i7, 32GB RAM)',
    category: 'Desktop',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 16900,
    energy_use_W: 135,
    recyclable_percent: 85, // Recycled plastics in Lenovo P series
    expected_lifetime_years: 6,
    repairability_score: 8, // Workstations are modular
    eco_certifications: ['EPEAT Gold', 'ENERGY STAR', 'TCO Certified', 'RoHS'],
    vendor_link: 'https://www.lenovo.com/no/no/p/workstations/thinkstation-p-series/thinkstation-p3-tiny-workstation/len102s0015',
    notes: 'Arbeidsstasjon-nivå kvalitet, strøm-effektiv og modulær.',
    justificationTemplate: 'EPEAT Gold og modulært design sikrer lang levetid og høy sirkulær verdi, til tross for høyere innkjøpspris.'
  },

  // MONITORS
  {
    id: 'mon-1',
    name: 'AOC 27" IPS (27B2H)',
    category: 'Monitor',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 1490,
    energy_use_W: 24,
    recyclable_percent: 40,
    expected_lifetime_years: 3,
    repairability_score: 3,
    eco_certifications: [],
    vendor_link: 'https://aoc.com/no/products/monitors/27b2h-eu',
    notes: 'Veldig billig. Mangler justeringer (kun tilt).',
    justificationTemplate: 'Svært lav pris, men mangler ergonomi og offisielle miljøsertifiseringer.'
  },
  {
    id: 'mon-2',
    name: 'Dell 27" P2722H IPS',
    category: 'Monitor',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 2690,
    energy_use_W: 15,
    recyclable_percent: 75,
    expected_lifetime_years: 5,
    repairability_score: 5,
    eco_certifications: ['ENERGY STAR', 'TCO Certified Displays 8'],
    vendor_link: 'https://www.dell.com/no-no/shop/dell-27-skjerm-p2722h/apd/210-azkz/skjermer-og-tilbehør',
    notes: 'God standardkontorskjerm med ergonomi og bra strømforbruk.',
    justificationTemplate: 'Utmerket balanse mellom TCO-sertifisert miljøansvar, ergonomi og lavt strømforbruk (15W).'
  },
  {
    id: 'mon-3',
    name: 'Philips 27" B-Line (272B1G) Eco-friendly',
    category: 'Monitor',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 3490,
    energy_use_W: 11, // Super low power
    recyclable_percent: 85, // Built with post-consumer recycled plastics
    expected_lifetime_years: 6,
    repairability_score: 6,
    eco_certifications: ['ENERGY STAR', 'EPEAT', 'TCO Edge', 'RoHS'],
    vendor_link: 'https://www.philips.no/c-p/272B1G_00/lcd-skjerm-med-powersensortm',
    notes: 'Lyssensor og personer-sensor for å skru av strøm.',
    justificationTemplate: 'Designet spesifikt for minimalt økologisk fotavtrykk med PowerSensor og maskinvare uten kvikksølv/PVC/BFR.'
  },

  // Keyboard / Mouse
  {
    id: 'km-1',
    name: 'Microsoft Wired Desktop 600',
    category: 'KeyboardMouse',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 349,
    energy_use_W: 0.5,
    recyclable_percent: 20,
    expected_lifetime_years: 2,
    repairability_score: 1,
    eco_certifications: [],
    vendor_link: 'https://www.microsoft.com/en-ww/accessories/products/keyboards/wired-desktop-600',
    notes: 'Bruk-og-kast plastikk.',
    justificationTemplate: 'Svært billig, men representerer kort levetid og lav resirkuleringsverdi.'
  },
  {
    id: 'km-2',
    name: 'Logitech MK540 Advanced Trådløs',
    category: 'KeyboardMouse',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 799,
    energy_use_W: 1, // Battery equivalent
    recyclable_percent: 50,
    expected_lifetime_years: 4,
    repairability_score: 4,
    eco_certifications: ['RoHS'],
    vendor_link: 'https://www.logitech.com/no-no/products/combos/mk540-advanced-wireless-keyboard-mouse.920-008684.html',
    notes: 'Grei standard standard.',
    justificationTemplate: 'Et pålitelig standardvalg med lengre forventet levetid.'
  },
  {
    id: 'km-3',
    name: 'Logitech MX Keys S Combo (Resirkulert plast)',
    category: 'KeyboardMouse',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 2390,
    energy_use_W: 1.5,
    recyclable_percent: 80, // High PCR plastic content
    expected_lifetime_years: 6,
    repairability_score: 5, // Replaceable battery
    eco_certifications: ['Carbon Neutral', 'FSC-certified packaging'],
    vendor_link: 'https://www.logitech.com/no-no/products/combos/mx-keys-s-combo-business.920-011885.html',
    notes: 'Laget av resirkulert plast (PCR).',
    justificationTemplate: 'Karbonnøytralt produkt laget med høy andel resirkulert plast (PCR), optimalisert for profesjonell holdbarhet.'
  },

  // Network Switch
  {
    id: 'sw-1',
    name: 'TP-Link 24-Port Gigabit (TL-SG1024D)',
    category: 'Switch',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 1190,
    energy_use_W: 14,
    recyclable_percent: 40,
    expected_lifetime_years: 4,
    repairability_score: 2,
    eco_certifications: [],
    vendor_link: 'https://www.tp-link.com/no/business-networking/unmanaged-switch/tl-sg1024d/',
    notes: 'Umanagert svitsj uten PoE. Grunnleggende.',
    justificationTemplate: 'Lav inngangspris, men mangler styringsfunksjoner og strømsparing.'
  },
  {
    id: 'sw-2',
    name: 'Ubiquiti UniFi Switch 24 PoE+',
    category: 'Switch',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 5290,
    energy_use_W: 55, // Baselines around 25W + PoE overhead
    recyclable_percent: 65,
    expected_lifetime_years: 5,
    repairability_score: 5,
    eco_certifications: [],
    vendor_link: 'https://eu.store.ui.com/eu/en/pro/category/all-switching/products/usw-24-poe',
    notes: 'Standard i moderne SMB bedrifter.',
    justificationTemplate: 'Balanserer funksjonalitet (PoE) med lang forventet levetid i nettverksmiljø.'
  },
  {
    id: 'sw-3',
    name: 'Cisco Catalyst 1200 24-port PoE+',
    category: 'Switch',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 7490,
    energy_use_W: 45, // Enhanced EEE standard
    recyclable_percent: 85,
    expected_lifetime_years: 8,
    repairability_score: 8,
    eco_certifications: ['Energy Efficient Ethernet (IEEE 802.3az)'],
    vendor_link: 'https://www.cisco.com/c/en/us/products/switches/catalyst-1200-series-switches/index.html',
    notes: 'Enterprise-grade byggekvalitet med EEE for å kutte strøm til inaktive porter.',
    justificationTemplate: 'Energy Efficient Ethernet kutter strøm automatisk og overlegen Cisco-kvalitet gir ekstremt lang levetid.'
  },

  // Router / Firewall
  {
    id: 'rt-1',
    name: 'D-Link DSR-250V2 VPN Router',
    category: 'Router',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 1490,
    energy_use_W: 12,
    recyclable_percent: 40,
    expected_lifetime_years: 3,
    repairability_score: 2,
    eco_certifications: [],
    vendor_link: 'https://www.dlink.com/en/products/dsr-250v2-unified-services-router',
    notes: 'Enkel brannmur for små kontorer.',
    justificationTemplate: 'Budsjettvennlig maskinvare men krever hyppigere utskifting i et raskt voksende selskap.'
  },
  {
    id: 'rt-2',
    name: 'Ubiquiti UniFi Dream Machine Pro',
    category: 'Router',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 5190,
    energy_use_W: 33,
    recyclable_percent: 70,
    expected_lifetime_years: 5,
    repairability_score: 6,
    eco_certifications: [],
    vendor_link: 'https://eu.store.ui.com/eu/en/pro/category/all-unifi-cloud-gateways/products/udm-pro',
    notes: 'Kombinert brannmur og kontroller. Svært populær i bedrifter.',
    justificationTemplate: 'Moderne SMB-standard med god levetid og effektiv alt-i-ett ruting/filtrering.'
  },
  {
    id: 'rt-3',
    name: 'Fortinet FortiGate 40F',
    category: 'Router',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 7990,
    energy_use_W: 15, // Custom ASIC draws low power per throughput
    recyclable_percent: 80,
    expected_lifetime_years: 7,
    repairability_score: 8,
    eco_certifications: ['ENERGY STAR rating potential', 'RoHS'],
    vendor_link: 'https://www.fortinet.com/products/next-generation-firewall/entry-level',
    notes: 'Dedikert sikkerhetsakselerert maskinvare som gir ekstrem ytelse per watt.',
    justificationTemplate: 'Egenutviklede ASIC-brikker gir best ytelse-per-watt på sikkerhet, og hardware varer lenge.'
  },

  // Wireless AP
  {
    id: 'ap-1',
    name: 'TP-Link Omada EAP610 (WiFi 6)',
    category: 'WirelessAP',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 1290,
    energy_use_W: 14,
    recyclable_percent: 40,
    expected_lifetime_years: 3,
    repairability_score: 2,
    eco_certifications: [],
    vendor_link: 'https://www.tp-link.com/no/business-networking/omada-sdn-access-point/eap610/',
    notes: 'Bredbånd på budsjett.',
    justificationTemplate: 'Lav pris for WiFi 6, men materialer er knapt resirkulerbare og levetid er kortere.'
  },
  {
    id: 'ap-2',
    name: 'Ubiquiti UniFi U6 Pro',
    category: 'WirelessAP',
    tier: 'Standard',
    costType: 'Engangskostnad',
    unit_price_NOK: 2290,
    energy_use_W: 13,
    recyclable_percent: 65,
    expected_lifetime_years: 5,
    repairability_score: 4,
    eco_certifications: [],
    vendor_link: 'https://eu.store.ui.com/eu/en/pro/category/all-wifi/products/u6-pro',
    notes: 'Pålitelig standard for bedrifter.',
    justificationTemplate: 'Energieffektiv AP for enterprise-bruk som harmonerer godt med øvrig svitsj-valg.'
  },
  {
    id: 'ap-3',
    name: 'Aruba Instant On AP22 (TCO Certified)',
    category: 'WirelessAP',
    tier: 'Eco-Premium',
    costType: 'Engangskostnad',
    unit_price_NOK: 2490,
    energy_use_W: 10,
    recyclable_percent: 80,
    expected_lifetime_years: 6,
    repairability_score: 6,
    eco_certifications: ['WFA Certified', 'RoHS', 'Low Power standard'],
    vendor_link: 'https://www.arubainstanton.com/products/access-points/access-point-22/',
    notes: 'Høy sikkerhet og energieffektiv fra HPE/Aruba.',
    justificationTemplate: 'Ekstremt energieffektiv maskinvare (10W maks) fra et selskap dedikert til sirkulær økonomi.'
  },

  // SOFTWARE (Licenses) // Redirect directly to MS to avoid blockages
  {
    id: 'sw-win-1',
    name: 'Windows 11 Pro OEM',
    category: 'SoftwareLicense',
    tier: 'Budget',
    costType: 'Engangskostnad',
    unit_price_NOK: 1990,
    energy_use_W: 0,
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Digital'],
    vendor_link: 'https://www.microsoft.com/nb-no/d/windows-11-pro/dg7gmgf0d8h4',
    notes: 'Engangskjøp som knyttes til hovedkortet.',
    justificationTemplate: 'Budsjettvennlig OEM-lisens som varer maskinens fulle levetid (Zero hardware waste).'
  },
  {
    id: 'sw-win-2',
    name: 'Windows 11 Enterprise E3',
    category: 'SoftwareLicense',
    tier: 'Standard',
    costType: 'Løpende',
    unit_price_NOK: 1200, // per year
    energy_use_W: 0,
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Digital'],
    vendor_link: 'https://www.microsoft.com/nb-no/microsoft-365/enterprise/windows-enterprise',
    notes: 'Abonnementsbasert Windows med forbedret sikkerhet (f.eks Credential Guard).',
    justificationTemplate: 'Løpende kostnad som sikrer at programvaren alltid er oppdatert, gunstig for IT-miljøer.'
  },
  {
    id: 'sw-win-3',
    name: 'Windows 365 Cloud PC (Eco/Thin-client drift)',
    category: 'SoftwareLicense',
    tier: 'Eco-Premium',
    costType: 'Løpende',
    unit_price_NOK: 4500, // per year
    energy_use_W: 0, // Server-side impact is massive but offset by thin-clients
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Microsoft Cloud Neutral'],
    vendor_link: 'https://www.microsoft.com/nb-no/windows-365',
    notes: 'Lar utviklere bruke lette/gamle tynnklienter.',
    justificationTemplate: 'Cloud PC reduserer behovet for kraftig lokal maskinvare og flytter regnekraft til karbonnøytrale datasentre.'
  },

  // Microsoft 365
  {
    id: 'm365-1',
    name: 'Microsoft 365 Business Basic (Månedlig)',
    category: 'SoftwareLicense',
    tier: 'Budget',
    costType: 'Løpende',
    unit_price_NOK: 750, // per year (~62/mo)
    energy_use_W: 0,
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Digital'],
    vendor_link: 'https://www.microsoft.com/nb-no/microsoft-365/business/microsoft-365-business-basic',
    notes: 'Bare web-apps pluss Teams/Mail.',
    justificationTemplate: 'Rent cloud-produkt i karbonnøytrale datasentre. Billig og effektivt.'
  },
  {
    id: 'm365-2',
    name: 'Microsoft 365 Business Standard (Månedlig)',
    category: 'SoftwareLicense',
    tier: 'Standard',
    costType: 'Løpende',
    unit_price_NOK: 1600, // per year (~130/mo)
    energy_use_W: 0,
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Digital'],
    vendor_link: 'https://www.microsoft.com/nb-no/microsoft-365/business/microsoft-365-business-standard',
    notes: 'Inkluderer desktop Office apps.',
    justificationTemplate: 'Sikrer produktivitet med offline apps; MS karbonnøytral Cloud.'
  },
  {
    id: 'm365-3',
    name: 'Microsoft 365 Business Premium (Månedlig)',
    category: 'SoftwareLicense',
    tier: 'Eco-Premium',
    costType: 'Løpende',
    unit_price_NOK: 2800, // per year (~230/mo)
    energy_use_W: 0,
    recyclable_percent: 100,
    expected_lifetime_years: 10,
    repairability_score: 10,
    eco_certifications: ['Digital'],
    vendor_link: 'https://www.microsoft.com/nb-no/microsoft-365/business/microsoft-365-business-premium',
    notes: 'Inkluderer Intune og forbedret sikkerhet, ideelt for IT-bedrift.',
    justificationTemplate: 'Full pakke med MDM for å administrere lokal enhets-levetid, forlenger utstyrets holdbarhet.'
  }
];
