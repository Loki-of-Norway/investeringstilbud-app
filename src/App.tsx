import { useState, useMemo } from 'react';
import { products } from './data';
import { Category, SelectionState } from './types';
import { calculateItemEIS, getEisBadge, formatNOK, generateAlternativer } from './utils';
import { FileText, FileSpreadsheet, AlertTriangle, Info, Terminal, FileDown, ShieldAlert } from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { exportDOCX } from './exportUtils';
import logo from './assets/Best_IT-portalen_Transparent_Logo.png';
import Risikoanalyse from './Risikoanalyse';

const categories: { id: Category, label: string, defaultQuantity: number }[] = [
  { id: 'Laptop', label: 'Laptops (Utviklere / Nerd)', defaultQuantity: 8 },
  { id: 'Desktop', label: 'Stasjonære PCer (IT Support/Server)', defaultQuantity: 4 },
  { id: 'Monitor', label: 'Skjermer', defaultQuantity: 12 },
  { id: 'KeyboardMouse', label: 'Tastatur & Mus', defaultQuantity: 12 },
  { id: 'Switch', label: 'Nettverkssvitsj', defaultQuantity: 1 },
  { id: 'Router', label: 'Ruter / Brannmur', defaultQuantity: 1 },
  { id: 'WirelessAP', label: 'Trådløse Aksesspunkt', defaultQuantity: 3 },
  { id: 'SoftwareLicense', label: 'Programvare & Lisenser (Estimert fiktivt)', defaultQuantity: 12 }
];
export interface SavedPackage {
  id: string;
  name: string;
  selections: SelectionState[];
  totals: any; // We'll use the totals object structure
  tcoYears: number;
  powerCostKwh: number;
}

export default function App() {
  const [selections, setSelections] = useState<SelectionState[]>(() => {
    return categories.map(cat => ({
      categoryId: cat.id,
      selectedId: products.find(p => p.category === cat.id && p.tier === 'Standard')?.id || '',
      quantity: cat.defaultQuantity
    }));
  });

  const [tcoYears, setTcoYears] = useState<number>(5);
  const [powerCostKwh] = useState<number>(1.50);
  const [energyWeighting, setEnergyWeighting] = useState<boolean>(false); // toggle cost vs energy weighting for EIS

  const [savedPackages, setSavedPackages] = useState<SavedPackage[]>([]);
  const [packageName, setPackageName] = useState('Alternativ 1');
  
  const [mainTab, setMainTab] = useState<'configurator' | 'risikoanalyse'>('configurator');

  const updateSelection = (categoryId: string, field: 'selectedId' | 'quantity', value: any) => {
    setSelections(prev => prev.map(s => s.categoryId === categoryId ? { ...s, [field]: value } : s));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  // Totals Calculation
  const totals = useMemo(() => {
    let oneTimeCost = 0;
    let totalHardwareCostOverTime = 0;
    let recurringAnnually = 0;
    let totalEnergyW = 0;
    
    let weightedEisSum = 0;
    let totalWeight = 0;

    selections.forEach(sel => {
      const product = getProduct(sel.selectedId);
      if (!product || sel.quantity <= 0) return;

      const productCostNoK = product.unit_price_NOK * sel.quantity;
      const productEnergy = product.energy_use_W * sel.quantity;
      
      if (product.costType === 'Engangskostnad') {
        oneTimeCost += productCostNoK;
        // Calculate factor based on lifetime
        const numPurchases = Math.ceil(tcoYears / product.expected_lifetime_years);
        totalHardwareCostOverTime += numPurchases * productCostNoK;
      } else {
        recurringAnnually += productCostNoK;
      }

      totalEnergyW += productEnergy;

      // Calculate baseline EIS per item
      const itemEisRaw = calculateItemEIS(product);
      
      // Determine weight
      if (product.category !== 'SoftwareLicense') {
        const weight = energyWeighting ? (productEnergy || 1) : productCostNoK; 
        weightedEisSum += itemEisRaw * weight;
        totalWeight += weight;
      }
    });

    const yearlyPowerCost = (totalEnergyW / 1000) * 2000 * powerCostKwh;
    recurringAnnually += yearlyPowerCost;

    const tco = totalHardwareCostOverTime + (recurringAnnually * tcoYears);
    const aggregatedEis = totalWeight > 0 ? (weightedEisSum / totalWeight) : 0;

    return {
      oneTimeCost,
      totalHardwareCostOverTime,
      recurringAnnually,
      yearlyPowerCost,
      tco,
      aggregatedEis
    };
  }, [selections, tcoYears, powerCostKwh, energyWeighting]);

  const eisBadge = getEisBadge(totals.aggregatedEis);

  const savePackage = () => {
    setSavedPackages(prev => [...prev, {
      id: crypto.randomUUID(),
      name: packageName || `Pakke ${prev.length + 1}`,
      selections: [...selections],
      totals: { ...totals },
      tcoYears,
      powerCostKwh
    }]);
    setPackageName(`Alternativ ${savedPackages.length + 2}`);
  };

  const removePackage = (id: string) => {
    setSavedPackages(prev => prev.filter(p => p.id !== id));
  };

  const exportExcel = () => {
    const packagesToExport = savedPackages.length > 0 
      ? savedPackages 
      : [{ name: 'Aktiv Pakke', selections, totals, tcoYears, powerCostKwh }];

    const rows: any[] = [];
    const totalRowIndices: number[] = []; // Keep track of where we place "TOTAL" rows to style them later
    const headerRowIndices: number[] = [];

    packagesToExport.forEach((pkg, index) => {
      // Add package header
      rows.push({
        'Kategori': `--- PAKKE: ${pkg.name.toUpperCase()} ---`,
        'Produktnavn': '',
        'Lenke': '',
        'Kort begrunnelse': '',
        'Pris/Enhet (NOK)': '',
        'Antall': '',
        'Totalkostnad (NOK)': '',
        'Type': '',
        'Alternativ (Billigere)': '',
        'Alternativ (Dyrere)': '',
        'Miljø-Score (EIS)': ''
      });
      headerRowIndices.push(rows.length);

      // Add item rows
      pkg.selections.forEach(sel => {
        const p = getProduct(sel.selectedId);
        if (!p) return;
        const { cheaper, expensive } = generateAlternativer(products, p);
        rows.push({
          'Kategori': categories.find(c => c.id === p.category)?.label,
          'Produktnavn': p.name,
          'Lenke': p.vendor_link,
          'Kort begrunnelse': p.justificationTemplate,
          'Pris/Enhet (NOK)': p.unit_price_NOK,
          'Antall': sel.quantity,
          'Totalkostnad (NOK)': p.unit_price_NOK * sel.quantity,
          'Type': p.costType,
          'Alternativ (Billigere)': cheaper?.name || 'Ingen',
          'Alternativ (Dyrere)': expensive?.name || 'Ingen',
          'Miljø-Score (EIS)': calculateItemEIS(p).toFixed(1)
        });
      });

      // Calculate hardware total for this package
      const hardwareTotal = pkg.selections.reduce((sum, sel) => {
        const p = getProduct(sel.selectedId);
        if (p && p.costType === 'Engangskostnad') {
          return sum + (p.unit_price_NOK * sel.quantity);
        }
        return sum;
      }, 0);

      // Add empty row
      rows.push({
        'Kategori': '',
        'Produktnavn': '',
        'Lenke': '',
        'Kort begrunnelse': '',
        'Pris/Enhet (NOK)': '',
        'Antall': '',
        'Totalkostnad (NOK)': '',
        'Type': '',
        'Alternativ (Billigere)': '',
        'Alternativ (Dyrere)': '',
        'Miljø-Score (EIS)': ''
      });

      // Add total row
      rows.push({
        'Kategori': '>>> TOTAL MASKINVARE',
        'Produktnavn': '',
        'Lenke': '',
        'Kort begrunnelse': '',
        'Pris/Enhet (NOK)': '',
        'Antall': '',
        'Totalkostnad (NOK)': hardwareTotal as any,
        'Type': '',
        'Alternativ (Billigere)': '',
        'Alternativ (Dyrere)': '',
        'Miljø-Score (EIS)': ''
      });
      totalRowIndices.push(rows.length);

      // Add spacing between packages if not the last one
      if (index < packagesToExport.length - 1) {
        rows.push({
          'Kategori': '', 'Produktnavn': '', 'Lenke': '', 'Kort begrunnelse': '', 'Pris/Enhet (NOK)': '',
          'Antall': '', 'Totalkostnad (NOK)': '', 'Type': '', 'Alternativ (Billigere)': '', 'Alternativ (Dyrere)': '', 'Miljø-Score (EIS)': ''
        });
        rows.push({
          'Kategori': '', 'Produktnavn': '', 'Lenke': '', 'Kort begrunnelse': '', 'Pris/Enhet (NOK)': '',
          'Antall': '', 'Totalkostnad (NOK)': '', 'Type': '', 'Alternativ (Billigere)': '', 'Alternativ (Dyrere)': '', 'Miljø-Score (EIS)': ''
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(rows as any[]);
    
    const range = XLSX.utils.decode_range(ws['!ref'] as string);
    
    // Style the TOTAL rows to make them pop
    totalRowIndices.forEach(rowIndex => {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({c: C, r: rowIndex}); // rowIndex is 1-based length, Excel sheet is 0-based, but encode_cell is 0-based... Wait.
        // Actually, rowIndex is rows.length at the time of insertion, which is a 1-based count.
        // Row 0 is headers in XLSX.json_to_sheet. So data row 1 is `rows[0]`.
        // If a row is added at index K, `rows.length` becomes K+1.
        // The index in the `rows` array is `length - 1`.
        // json_to_sheet pushes properties as row 0. 
        // So the row in the sheet corresponding to `rows[i]` is at `r: i + 1`.
        // Thus, `rowIndex` (which equals `rows.length`) is perfectly `i + 1`.
        if (!ws[cellRef]) {
          ws[cellRef] = { t: 's', v: '' }; // create cell if missing
        }
        ws[cellRef].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "20B2E0" } }
        };
      }
    });

    // Style the Header rows to make them distinct
    headerRowIndices.forEach(rowIndex => {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({c: C, r: rowIndex});
        if (!ws[cellRef]) {
          ws[cellRef] = { t: 's', v: '' };
        }
        ws[cellRef].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "E2E8F0" } }
        };
      }
    });

    // Add clickable hyperlinks post-generation
    // Lenke is the 3rd column (index 2) -> column 'C'
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({c: 2, r: R});
        if (!ws[cellRef]) continue;
        const linkStr = ws[cellRef].v;
        // Turn the text cell into a hyperlink cell
        ws[cellRef].l = { Target: linkStr, Tooltip: "Gå til leverandør" };
        ws[cellRef].s = { font: { color: { rgb: "0563C1" }, underline: true } }; // Optional styling hints if Pro engine used
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investeringstilbud");
    XLSX.writeFile(wb, "Investeringstilbud_Firewall_Sorcery.xlsx");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(selections.map(sel => {
        const p = getProduct(sel.selectedId);
        return p ? { Produktnavn: p.name, Antall: sel.quantity, Pris: p.unit_price_NOK } : {};
    }));
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Investeringstilbud.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in font-body">
      {/* HEADER */}
      <header className="mb-8 border-b border-[#20B2E0]/20 pb-4 flex justify-between items-end relative">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-4xl font-title text-[#20B2E0] flex items-center gap-3">
            <Terminal size={32} /> Firewall & Sorcery AS
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-body max-w-xl">
            Klinisk dashboard for IT-innkjøp og livssyklus-analyse. Vurderer ytelse, kostnad og miljøpåvirkning (EIS) i sanntid.
          </p>
        </div>
        <div className="hidden md:block absolute right-0 bottom-4 pointer-events-none">
          <img 
            src={logo} 
            alt="Best IT-portalen Logo" 
            className="h-24 lg:h-28 object-contain origin-bottom-right drop-shadow-md"
          />
        </div>
      </header>

      {/* MAIN NAVIGATION */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMainTab('configurator')}
          className={`px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${mainTab === 'configurator' ? 'bg-[#20B2E0] text-[#030304]' : 'bg-[#0a0a0e] text-[#20B2E0] border border-[#20B2E0] hover:bg-[#20B2E0]/10'}`}
        >
          <Terminal size={18} /> Investeringstilbud
        </button>
        <button 
          onClick={() => setMainTab('risikoanalyse')}
          className={`px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${mainTab === 'risikoanalyse' ? 'bg-[#13BD56] text-[#030304]' : 'bg-[#0a0a0e] text-[#13BD56] border border-[#13BD56] hover:bg-[#13BD56]/10'}`}
        >
          <ShieldAlert size={18} /> Risikoanalyse
        </button>
      </div>

      {mainTab === 'risikoanalyse' ? (
        <Risikoanalyse selections={selections} />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CENTER PANE: SELECTION GRID */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-title border-l-4 border-[#13BD56] pl-3">Maskinvare & Lisenser</h2>
          </div>

          <div className="space-y-4">
            {categories.map(cat => {
              const catProducts = products.filter(p => p.category === cat.id);
              const selection = selections.find(s => s.categoryId === cat.id);
              const selectedProduct = getProduct(selection?.selectedId || '');

              return (
                <div key={cat.id} className="bg-[#0a0a0e] border border-gray-800 p-4 rounded-sm hover:border-[#20B2E0]/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-[#20B2E0] uppercase tracking-wider mb-1 block">{cat.label}</label>
                      <select 
                        value={selection?.selectedId} 
                        onChange={e => updateSelection(cat.id, 'selectedId', e.target.value)}
                        className="w-full bg-[#0a0a0e] border border-gray-600 text-white p-3 text-sm font-medium focus:border-[#20B2E0] focus:ring-1 focus:ring-[#20B2E0] focus:outline-none rounded-sm transition-all"
                      >
                        {catProducts.map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.tier}] {p.name} - {formatNOK(p.unit_price_NOK)}
                          </option>
                        ))}
                      </select>
                      
                      {selectedProduct && (
                        <div className="mt-3 text-xs text-gray-400">
                          <p className="flex items-start gap-2">
                            <Info size={14} className="text-[#13BD56] shrink-0 mt-0.5" /> 
                            <span>{selectedProduct.justificationTemplate}</span>
                          </p>
                          <div className="flex gap-4 mt-2">
                             <span className="text-[#F14237]">TDP: {selectedProduct.energy_use_W}W</span>
                             <span className="text-[#FFD116]">Levetid: {selectedProduct.expected_lifetime_years} år</span>
                             {selectedProduct.costType === 'Engangskostnad' && Math.ceil(tcoYears / selectedProduct.expected_lifetime_years) > 1 && (
                               <span className="text-[#20B2E0] font-bold">
                                 (Må kjøpes {Math.ceil(tcoYears / selectedProduct.expected_lifetime_years)} ganger på {tcoYears} år)
                               </span>
                             )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-32 flex flex-col justify-start">
                      <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Antall</label>
                      <input 
                        type="number" 
                        min="0"
                        value={selection?.quantity}
                        onChange={e => updateSelection(cat.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#0a0a0e] border border-gray-600 text-white p-3 text-sm font-bold focus:border-[#20B2E0] focus:ring-1 focus:ring-[#20B2E0] focus:outline-none text-right rounded-sm transition-all"
                      />
                      {selectedProduct && selection && (
                        <div className="text-right mt-2 text-sm font-bold text-[#13BD56]">
                           {formatNOK(selectedProduct.unit_price_NOK * selection.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: SUMMARY PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0e] border border-gray-700 p-6 rounded-sm sticky top-4">
            <h2 className="text-2xl font-title mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
              Telemetri <AlertTriangle size={18} className="text-[#FFD116]"/>
            </h2>

            <div className="space-y-6">
              {/* Cost Summary */}
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Økonomi (NOK)</h3>
                <div className="flex justify-between items-end border-b border-gray-800 border-dashed pb-2 mb-2">
                  <span className="text-gray-400">Investeringstilbud (Nå)</span>
                  <span className="font-bold text-lg">{formatNOK(totals.oneTimeCost)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-gray-800 border-dashed pb-2 mb-2">
                  <span className="text-gray-400">Total Hardware ({tcoYears} år)</span>
                  <span className="font-bold text-lg">{formatNOK(totals.totalHardwareCostOverTime)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-gray-800 border-dashed pb-2 mb-2">
                  <span className="text-gray-400">Lisenser & Strøm / år</span>
                  <span className="font-bold text-lg">{formatNOK(totals.recurringAnnually)}</span>
                </div>
                
                <div className="mt-4 p-3 bg-[#030304] border border-[#20B2E0]/30 rounded-sm">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-title text-[#20B2E0]">TCO ({tcoYears} år)</span>
                      <select 
                        value={tcoYears}
                        onChange={(e) => setTcoYears(Number(e.target.value))}
                        className="bg-transparent text-xs border-b border-[#20B2E0] focus:outline-none"
                      >
                         <option value={3}>3 År</option>
                         <option value={5}>5 År</option>
                         <option value={10}>10 År</option>
                      </select>
                   </div>
                   <div className="text-2xl font-bold text-white text-right">
                     {formatNOK(totals.tco)}
                   </div>
                </div>
              </div>

              {/* Environmental Summary */}
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Miljøavtrykk (EIS)</h3>
                
                <div className="flex items-center justify-between mb-2 mt-4 space-x-2">
                    <div className="flex-1 text-xs text-gray-400 leading-tight">Vekta snittverdi (0-100, lavere er bedre)</div>
                    <button 
                      onClick={() => setEnergyWeighting(!energyWeighting)}
                      className="text-[10px] uppercase border p-1 rounded-sm border-gray-700 hover:text-white"
                    >
                      Vekting: {energyWeighting ? 'Energi' : 'Kostnad'}
                    </button>
                </div>

                <div className={`p-4 rounded-sm flex flex-col items-center justify-center gap-2 ${eisBadge.color} ${eisBadge.textColor}`}>
                  <span className="text-4xl font-bold font-title">{totals.aggregatedEis.toFixed(1)}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">{eisBadge.label}</span>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400 bg-[#030304] p-2 border border-gray-800">
                    <span>Estimert strøm ({powerCostKwh} kr/kWh):</span>
                    <span className="font-bold text-[#FFD116]">{formatNOK(totals.yearlyPowerCost)} / år</span>
                </div>
              </div>

             {/* Actions */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                 <button onClick={exportExcel} className="w-full bg-[#20B2E0] text-[#030304] font-bold py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors uppercase text-sm tracking-wider">
                   <FileSpreadsheet size={18} /> Eksporter som (.XLSX)
                 </button>
                 <button onClick={exportCSV} className="w-full bg-transparent border border-[#20B2E0] text-[#20B2E0] font-bold py-3 flex items-center justify-center gap-2 hover:bg-[#20B2E0]/10 transition-colors uppercase text-sm tracking-wider">
                   <FileText size={18} /> Eksporter som (.CSV)
                 </button>
                 <div className="text-center mt-2 group relative">
                    <button onClick={() => exportDOCX(selections, products, categories, totals)} className="w-full text-gray-500 text-sm hover:text-white transition-colors flex justify-center items-center gap-2">
                       <FileDown size={18}/> Eksporter som (.DOCX)
                    </button>
                 </div>
              </div>

            {/* Saved Packages Box */}
              <aside 
                className="bg-[#030304] border border-[#20B2E0]/30 p-5 rounded-sm flex flex-col mt-6" 
                aria-label="Lagrede utstyrspakker"
              >
                <h3 className="text-lg font-title text-[#20B2E0] mb-2 tracking-wide">Lagrede Pakker</h3>
                
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Gi pakken et navn..."
                    className="flex-1 bg-[#0a0a0e] border border-gray-600 text-white p-2 text-sm focus:border-[#20B2E0] focus:ring-1 focus:ring-[#20B2E0] outline-none rounded-sm transition-all"
                  />
                  <button 
                    onClick={savePackage}
                    className="bg-[#13BD56] text-[#030304] font-bold px-3 py-2 text-sm uppercase tracking-wider hover:bg-white transition-colors rounded-sm"
                  >
                    Lagre
                  </button>
                </div>

                {savedPackages.length > 0 ? (
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {savedPackages.map(pkg => (
                      <li key={pkg.id} className="bg-[#0a0a0e] border border-gray-800 p-3 rounded-sm flex justify-between items-center group">
                        <div>
                          <div className="font-bold text-sm text-gray-200">{pkg.name}</div>
                          <div className="text-xs text-gray-500">TCO ({pkg.tcoYears} år): {formatNOK(pkg.totals.tco)}</div>
                        </div>
                        <button 
                          onClick={() => removePackage(pkg.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          title="Slett pakke"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic">Ingen pakker lagret. Velg utstyr og trykk lagre for å sammenligne alternativer i Excel-eksporten.</p>
                )}
              </aside>

            {/* Order Summary Box */}
              <aside 
                className="bg-[#030304] border border-[#20B2E0]/30 p-5 rounded-sm flex flex-col h-full" 
                aria-label="Oppsummering av utvalgt utstyr og miljøpåvirkning"
              >
                <h3 className="text-lg font-title text-[#20B2E0] mb-1 tracking-wide">Komplett Utstyrsoppsett</h3>
                <p className="text-xs text-gray-400 mb-4 font-body">Alt du trenger for å jobbe effektivt.</p>
                
                <ul className="text-sm space-y-3 mb-6 list-none font-body text-gray-300 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-[#13BD56] font-bold">›</span>
                    <span>Inkluderer <b>{selections.reduce((sum, sel) => sum + sel.quantity, 0)}</b> valgte enheter og lisenser, skreddersydd for din bedrift.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#13BD56] font-bold">›</span>
                    <span>Gjennomsnittlig levetid for maskinvaren er beregnet til <b>{
                      (selections.reduce((sum, sel) => {
                        const p = getProduct(sel.selectedId);
                        return sum + (p && p.category !== 'SoftwareLicense' ? p.expected_lifetime_years * sel.quantity : 0);
                      }, 0) / Math.max(1, selections.filter(s => s.categoryId !== 'SoftwareLicense').reduce((sum, sel) => sum + sel.quantity, 0))).toFixed(1)
                    } år</b>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#13BD56] font-bold">›</span>
                    <span>
                      {totals.aggregatedEis < 40 ? 'Utmerket miljøprofil' : totals.aggregatedEis < 60 ? 'Akseptabel miljøprofil' : 'Krevende miljøprofil'} med snittscore <b>{totals.aggregatedEis.toFixed(1)}</b> og estimert strømforbruk på <b>{totals.yearlyPowerCost > 0 ? (totals.yearlyPowerCost / powerCostKwh).toFixed(0) : 0} kWh/år</b>.
                    </span>
                  </li>
                </ul>
                
                <button className="w-full bg-[#13BD56] text-[#030304] font-bold py-3 uppercase tracking-widest text-sm hover:bg-white transition-colors mt-auto">
                  Gjennomgå og Bestill
                </button>
              </aside>
              
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
