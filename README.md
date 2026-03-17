# Investeringstilbud App

Teknisk dokumentasjon for konfiguratoren for IT-innkjøp.

## Funksjoner

- **Interaktiv Konfigurator**: Velg maskinvare og lisenser for ulike bedriftsbehov.
- **Telemetri & Analyse**: Sanntidskalkulering av:
  - **TCO (Total Cost of Ownership)** over 3, 5 eller 10 år.
  - **EIS (Environmental Impact Score)**: Miljøscore basert på TDP og levetid.
  - **Strømkostnader**: Estimerte årlige utgifter basert på forbruk.
- **Eksport-muligheter**:
  - Fullstendig tilbud i **Excel (.XLSX)** med formatering og linker.
  - Enkel oversikt i **CSV**.
  - Formelt dokument i **Word (.DOCX)**.

## Teknisk Stakk

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Språk**: TypeScript
- **Styling**: Tailwind CSS
- **Ikoner**: Lucide React
- **Biblioteker**:
  - `xlsx-js-style`: Avansert Excel-eksport med styling.
  - `docx`: Generering av Word-dokumenter.
  - `jspdf` / `html2canvas`: Verktøy for dokumentgenerering.

## Kom i gang

### Installasjon

```bash
cd investeringstilbud-app
npm install
```

### Utvikling

Kjør utviklingsserveren:

```bash
npm run dev
```

### Bygging

Klargjør for produksjon:

```bash
npm run build
```

---

*Utviklet som en del av IT-portalen for Firewall & Sorcery AS.*
