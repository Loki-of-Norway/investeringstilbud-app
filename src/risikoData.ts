export interface RisikoDefinition {
  id: string;
  hendelse: string;
  beskrivelse: string;
  k: boolean;
  i: boolean;
  t: boolean;
  baseSannsynlighet: number;
  baseKonsekvens: number;
  tiltak: string;
  kostnad: string;
  frist: string;
  ansvarlig: string;
}

export const sannsynlighetLevels = [
  { level: 1, name: "Svært liten", desc: "Det er svært lite sannsynlig at hendelsen vil inntreffe.", veiledning: "Sjeldnere enn hvert 10. år." },
  { level: 2, name: "Liten", desc: "Det er liten sannsynlighet for at hendelsen vil inntreffe.", veiledning: "En eller flere ganger i løpet av 5-10 år." },
  { level: 3, name: "Moderat", desc: "Det er moderat sannsynlighet for at hendelsen vil inntreffe.", veiledning: "En eller flere ganger i løpet av 1-5 år." },
  { level: 4, name: "Stor", desc: "Det er høy sannsynlighet for at hendelsen vil inntreffe.", veiledning: "I løpet av kommende år." },
  { level: 5, name: "Svært stor", desc: "Det er svært høy sannsynlighet for at hendelsen vil inntreffe.", veiledning: "Flere ganger i løpet av kommende år." }
];

export const konsekvensLevels = [
  { level: 1, name: "Ubetydelig", desc: "Konsekvensen vurderes som ubetydelig", veiledning: "Kun ubetydelig skade." },
  { level: 2, name: "Liten", desc: "Konsekvensen vurderes som liten", veiledning: "Forbigående økonomisk tap eller begrenset tap av omdømme." },
  { level: 3, name: "Moderat", desc: "Konsekvensen vurderes som moderat", veiledning: "Økonomisk tap av noe varighet. Tap av omdømme." },
  { level: 4, name: "Stor", desc: "Konsekvensen vurderes som stor", veiledning: "Betydelig økonomisk tap. Varig eller alvorlig tap av omdømme." },
  { level: 5, name: "Svært stor", desc: "Konsekvensen vurderes som svært stor", veiledning: "Varig og betydelig økonomisk tap. Katastrofalt tap av omdømme." }
];

export const baseRisikoData: RisikoDefinition[] = [
  {
    id: "1",
    hendelse: "Tyveri av bærbart utstyr (PC/Mobil)",
    beskrivelse: "Ansatte mister eller får frastjålet utstyr på reise/hjemmekontor.",
    k: true, i: false, t: true,
    baseSannsynlighet: 3,
    baseKonsekvens: 4,
    tiltak: "Kryptering av alle harddisker (BitLocker), MDM-løsning for fjernsletting, gode rutiner for fysisk sikring.",
    kostnad: "Lav (Lisenser/Tid)",
    frist: "Snarest",
    ansvarlig: "IT-ansvarlig"
  },
  {
    id: "2",
    hendelse: "Phishing-angrep mot ansatte",
    beskrivelse: "Ansatte lures til å gi fra seg passord eller installere skadevare via e-post.",
    k: true, i: true, t: false,
    baseSannsynlighet: 4,
    baseKonsekvens: 4,
    tiltak: "Opplæring av ansatte (sikkerhetskultur), tofaktorautentisering (MFA) på alle kontoer, e-postfiltrering.",
    kostnad: "Lav/Middels (Tid)",
    frist: "Løpende",
    ansvarlig: "Daglig leder"
  },
  {
    id: "3",
    hendelse: "Nedetid på internett/nettverk",
    beskrivelse: "Utfall av internettlinje eller svikt i sentralt nettverksutstyr.",
    k: false, i: false, t: true,
    baseSannsynlighet: 2,
    baseKonsekvens: 3,
    tiltak: "Redundant internettlinje (f.eks. 4G/5G backup), serviceavtale på nettverksutstyr, UPS (nødstrøm).",
    kostnad: "Middels (Innkjøp)",
    frist: "K2 2026",
    ansvarlig: "IT-ansvarlig"
  },
  {
    id: "4",
    hendelse: "Datatap grunnet manglende backup",
    beskrivelse: "Viktige data slettes ved uhell eller systemfeil uten fungerende kopi.",
    k: false, i: true, t: true,
    baseSannsynlighet: 2,
    baseKonsekvens: 5,
    tiltak: "Automatisert backup til sky/ekstern lokasjon, jevnlig testing av restore, versjonskontroll.",
    kostnad: "Middels (Mnd. pris)",
    frist: "Umiddelbart",
    ansvarlig: "IT-Drift"
  },
  {
    id: "5",
    hendelse: "Innside-trussel / Utroskap",
    beskrivelse: "Ansatt tar med seg sensitiv kundedata eller saboterer ved oppsigelse.",
    k: true, i: true, t: false,
    baseSannsynlighet: 2,
    baseKonsekvens: 4,
    tiltak: "Tilgangsstyring (Least Privilege), gode rutiner ved fratredelse, loggføring.",
    kostnad: "Lav (Interntid)",
    frist: "Ved behov",
    ansvarlig: "HR / Leder"
  },
  {
    id: "6",
    hendelse: "Ransomware-angrep (Løsepengevirus)",
    beskrivelse: "Alle filer krypteres av angripere som krever penger for nøkkelen.",
    k: true, i: true, t: true,
    baseSannsynlighet: 3,
    baseKonsekvens: 5,
    tiltak: "Offline backup, oppdatert antivirus/EDR-løsning, segmentering av nettverk, patch-management.",
    kostnad: "Middels (Lisenser)",
    frist: "Kontinuerlig",
    ansvarlig: "IT-ansvarlig"
  },
  {
    id: "7",
    hendelse: "Brann/Vannskade på kontor",
    beskrivelse: "Fysisk skade på utstyr og lokaler som hindrer drift.",
    k: false, i: false, t: true,
    baseSannsynlighet: 1,
    baseKonsekvens: 5,
    tiltak: "Brannvarsling, slukkeutstyr, forsikring, gode rutiner for hjemmekontor som reserveløsning.",
    kostnad: "Lav (Huseier?)",
    frist: "K1 2026",
    ansvarlig: "Verneombud"
  }
];

export const getRiskColor = (score: number) => {
  if (score <= 5) return 'bg-[#13BD56] text-black font-bold'; // Green
  if (score <= 12) return 'bg-[#FFD116] text-black font-bold'; // Yellow
  return 'bg-[#F14237] text-white font-bold'; // Red
};

export const getRiskHexColor = (score: number) => {
  if (score <= 5) return 'C6E0B4'; // Excel Green 
  if (score <= 12) return 'FFE699'; // Excel Yellow
  return 'F4B084'; // Excel Red/Orange
};
