import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { Product, SelectionState, Category } from './types';
import { calculateItemEIS, formatNOK } from './utils';

export const exportDOCX = async (
  selections: SelectionState[],
  products: Product[],
  categories: { id: Category, label: string, defaultQuantity: number }[],
  totals: any
) => {
  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Kategori", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Produktnavn", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Antall", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Totalkostnad (NOK)", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Miljø-Score (EIS)", bold: true })] })] }),
      ],
    }),
  ];

  selections.forEach(sel => {
    const p = products.find(prod => prod.id === sel.selectedId);
    if (!p) return;

    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(categories.find(c => c.id === p.category)?.label || '')] }),
          new TableCell({ children: [new Paragraph(p.name)] }),
          new TableCell({ children: [new Paragraph(sel.quantity.toString())] }),
          new TableCell({ children: [new Paragraph(formatNOK(p.unit_price_NOK * sel.quantity))] }),
          new TableCell({ children: [new Paragraph(calculateItemEIS(p).toFixed(1))] }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Investeringstilbud - Firewall & Sorcery AS",
                bold: true,
                size: 32,
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Klinisk dashboard for IT-innkjøp og livssyklus-analyse. Vurderer ytelse, kostnad og miljøpåvirkning (EIS) i sanntid.",
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Produktoversikt",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Table({
            rows: rows,
            width: { size: 100, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
          }),
          new Paragraph({ spacing: { before: 400, after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Telemetri",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Engangskostnad: `, bold: true }),
              new TextRun({ text: formatNOK(totals.oneTimeCost) }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Løpende per år: `, bold: true }),
              new TextRun({ text: formatNOK(totals.recurringAnnually) }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Totalkostnad (TCO): `, bold: true }),
              new TextRun({ text: formatNOK(totals.tco) }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Miljøavtrykk (EIS): `, bold: true }),
              new TextRun({ text: totals.aggregatedEis.toFixed(1) }),
            ],
          }),
           new Paragraph({
            children: [
              new TextRun({ text: `Estimert strøm pr år: `, bold: true }),
              new TextRun({ text: formatNOK(totals.yearlyPowerCost) }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Investeringstilbud_Firewall_Sorcery.docx");
};
