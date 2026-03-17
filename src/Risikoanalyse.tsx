import React, { useState, useMemo } from 'react';
import { SelectionState } from './types';
import { products } from './data';
import * as XLSX from 'xlsx-js-style';
import { ShieldAlert, ShieldCheck, HelpCircle, FileDown, Activity, Layers } from 'lucide-react';
import { baseRisikoData, konsekvensLevels, sannsynlighetLevels, getRiskColor, getRiskHexColor, RisikoDefinition } from './risikoData';

interface Props {
  selections: SelectionState[];
}

export default function Risikoanalyse({ selections }: Props) {
  const [activeTab, setActiveTab] = useState<'oversikt' | 'tiltaksplan' | 'konsekvens' | 'sannsynlighet' | 'matrise'>('oversikt');

  // Dynamically calculate risk based on selected equipment
  const calculatedRisks = useMemo(() => {
    // Determine the tier of selected network/security equipment
    const switchSelection = selections.find(s => s.categoryId === 'Switch');
    const routerSelection = selections.find(s => s.categoryId === 'Router');
    
    const switchProduct = products.find(p => p.id === switchSelection?.selectedId);
    const routerProduct = products.find(p => p.id === routerSelection?.selectedId);

    const hasBudgetNetwork = switchProduct?.tier === 'Budget' || routerProduct?.tier === 'Budget';
    const hasPremiumSecurity = routerProduct?.name.includes('Fortinet') || routerProduct?.tier === 'Eco-Premium';

    // Clone base data
    let risks: (RisikoDefinition & { currentSannsynlighet: number, currentKonsekvens: number, score: number })[] = baseRisikoData.map(r => ({
      ...r,
      currentSannsynlighet: r.baseSannsynlighet,
      currentKonsekvens: r.baseKonsekvens,
      score: r.baseSannsynlighet * r.baseKonsekvens
    }));

    // Apply modifiers based on equipment choices
    risks = risks.map(risk => {
      let tempS = risk.baseSannsynlighet;
      let tempK = risk.baseKonsekvens;

      if (risk.id === "3" && hasBudgetNetwork) {
        // Nedetid på nettverk
        tempS = Math.min(5, tempS + 1);
      }
      if (risk.id === "6" && hasPremiumSecurity) {
        // Ransomware defense
        tempS = Math.max(1, tempS - 1);
      }
      if (risk.id === "4") {
         // Datatap, if no backup software selected (not in configurator right now, just an example)
         // Assuming we could add software later...
      }

      return {
        ...risk,
        currentSannsynlighet: tempS,
        currentKonsekvens: tempK,
        score: tempS * tempK
      };
    }).sort((a,b) => b.score - a.score);

    return risks;
  }, [selections]);

  const exportRisikoExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Risikoanalyse Tab
    const wsRisikoData = [['Hendelse/Risiko', 'Beskrivelse', 'K (Konfidensialitet)', 'I (Integritet)', 'T (Tilgjengelighet)', 'Sannsynlighet (1-5)', 'Konsekvens (1-5)', 'Risiko-score']];
    calculatedRisks.forEach(r => {
      wsRisikoData.push([r.hendelse, r.beskrivelse, r.k ? 'Ja' : 'Nei', r.i ? 'Ja' : 'Nei', r.t ? 'Ja' : 'Nei', r.currentSannsynlighet.toString(), r.currentKonsekvens.toString(), r.score.toString()]);
    });
    const wsRisiko = XLSX.utils.aoa_to_sheet(wsRisikoData);
    calculatedRisks.forEach((r, idx) => {
      const cellRef = XLSX.utils.encode_cell({ c: 7, r: idx + 1 });
      if(!wsRisiko[cellRef]) return;
      wsRisiko[cellRef].s = {
        fill: { fgColor: { rgb: getRiskHexColor(r.score) } },
        font: { bold: true, color: { rgb: r.score > 12 ? 'FFFFFF' : '000000' } },
        alignment: { horizontal: 'center' }
      };
    });
    XLSX.utils.book_append_sheet(wb, wsRisiko, 'Risikoanalyse');

    // 2. Tiltaksplan Tab
    const wsTiltakData = [['Risiko/Hendelse', 'Nødvendig Tiltak', 'Estimert Kostnad', 'Frist', 'Ansvarlig', 'Oppdatert Risiko-score (Mål)']];
    calculatedRisks.forEach(r => {
      // Goal logic: Reduce probability by 1, consequences by 1 (minimum 1)
      const goalScore = Math.max(1, r.currentSannsynlighet - 1) * Math.max(1, r.currentKonsekvens - 1);
      wsTiltakData.push([r.hendelse, r.tiltak, r.kostnad, r.frist, r.ansvarlig, goalScore.toString()]);
    });
    const wsTiltak = XLSX.utils.aoa_to_sheet(wsTiltakData);
    calculatedRisks.forEach((r, idx) => {
      const cellRef = XLSX.utils.encode_cell({ c: 5, r: idx + 1 });
      if(!wsTiltak[cellRef]) return;
      const goalScore = Math.max(1, r.currentSannsynlighet - 1) * Math.max(1, r.currentKonsekvens - 1);
      wsTiltak[cellRef].s = {
        fill: { fgColor: { rgb: getRiskHexColor(goalScore) } },
        font: { bold: true, color: { rgb: goalScore > 12 ? 'FFFFFF' : '000000' } },
        alignment: { horizontal: 'center' }
      };
    });
    XLSX.utils.book_append_sheet(wb, wsTiltak, 'Tiltaksplan');

    // 3. Konsekvenser Tab
    const wsKonsData = [['Nivå', 'Navn', 'Beskrivelse', 'Veiledning']];
    konsekvensLevels.forEach(k => wsKonsData.push([k.level.toString(), k.name, k.desc, k.veiledning]));
    const wsKons = XLSX.utils.aoa_to_sheet(wsKonsData);
    XLSX.utils.book_append_sheet(wb, wsKons, 'Konsekvenser');

    // 4. Sannsynlighet Tab
    const wsSannData = [['Nivå', 'Navn', 'Beskrivelse', 'Veiledning']];
    sannsynlighetLevels.forEach(s => wsSannData.push([s.level.toString(), s.name, s.desc, s.veiledning]));
    const wsSann = XLSX.utils.aoa_to_sheet(wsSannData);
    XLSX.utils.book_append_sheet(wb, wsSann, 'Sannsynlighet');

    // 5. Risikomatrise Tab
    const wsMatriseData = [
      ['RISIKOMATRISE', 'Konsekvens ->'],
      ['Sannsynlighet', '1. Ubetydelig', '2. Liten', '3. Moderat', '4. Stor', '5. Svært stor'],
      ['5. Svært stor', '', '', '', '', ''],
      ['4. Stor', '', '', '', '', ''],
      ['3. Moderat', '', '', '', '', ''],
      ['2. Liten', '', '', '', '', ''],
      ['1. Svært liten', '', '', '', '', '']
    ];
    const wsMatrise = XLSX.utils.aoa_to_sheet(wsMatriseData);
    
    // Style Matrise Colors
    for(let s = 1; s <= 5; s++) {
      for(let k = 1; k <= 5; k++) {
        const score = s * k;
        const cellRef = XLSX.utils.encode_cell({ c: k, r: 7 - s }); // Plotting inversely
        if(!wsMatrise[cellRef]) wsMatrise[cellRef] = { v: '', t: 's' };
        
        let riskNames = calculatedRisks.filter(r => r.currentSannsynlighet === s && r.currentKonsekvens === k).map(r => r.id).join(', ');
        wsMatrise[cellRef].v = riskNames ? `[${riskNames}]` : `${score}`;
        wsMatrise[cellRef].s = {
          fill: { fgColor: { rgb: getRiskHexColor(score) } },
          font: { bold: !!riskNames, color: { rgb: score > 12 ? 'FFFFFF' : '000000' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    }
    XLSX.utils.book_append_sheet(wb, wsMatrise, 'Risikomatrise');

    // Adjust column widths across sheets
    [wsRisiko, wsTiltak, wsKons, wsSann, wsMatrise].forEach(ws => {
      ws['!cols'] = [{ wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    });

    XLSX.writeFile(wb, 'IT_Risikoanalyse_Komplett.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            Risikoanalyse IT
          </h1>
          <p className="text-slate-500 mt-2">Dynamisk vurdering basert på dine maskinvarevalg.</p>
        </div>
        <button 
          onClick={exportRisikoExcel}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all flex items-center gap-2 transform hover:scale-105"
        >
          <FileDown className="w-5 h-5" />
          Eksporter til Excel (5 Ark)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button onClick={() => setActiveTab('oversikt')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'oversikt' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Activity className="w-4 h-4"/> Risikooversikt
          </button>
          <button onClick={() => setActiveTab('tiltaksplan')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tiltaksplan' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <ShieldCheck className="w-4 h-4"/> Tiltaksplan
          </button>
          <button onClick={() => setActiveTab('matrise')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'matrise' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Layers className="w-4 h-4"/> Risikomatrise
          </button>
          <button onClick={() => setActiveTab('sannsynlighet')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'sannsynlighet' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <HelpCircle className="w-4 h-4"/> Sannsynlighet-skala
          </button>
          <button onClick={() => setActiveTab('konsekvens')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'konsekvens' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <HelpCircle className="w-4 h-4"/> Konsekvens-skala
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'oversikt' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 uppercase">
                  <tr>
                    <th className="p-4 border-b">Risiko ID</th>
                    <th className="p-4 border-b">Hendelse</th>
                    <th className="p-4 border-b">Sannsynlighet (1-5)</th>
                    <th className="p-4 border-b">Konsekvens (1-5)</th>
                    <th className="p-4 border-b">Risikoscore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculatedRisks.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-500">#{r.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{r.hendelse}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{r.beskrivelse}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{r.currentSannsynlighet}</div>
                        <div className="text-xs text-slate-500">{sannsynlighetLevels.find(s => s.level === r.currentSannsynlighet)?.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{r.currentKonsekvens}</div>
                        <div className="text-xs text-slate-500">{konsekvensLevels.find(k => k.level === r.currentKonsekvens)?.name}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(r.score)}`}>
                          {r.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tiltaksplan' && (
            <div className="space-y-4">
               {calculatedRisks.map((r) => {
                 const goalScore = Math.max(1, r.currentSannsynlighet - 1) * Math.max(1, r.currentKonsekvens - 1);
                 return (
                  <div key={r.id} className="p-5 border border-slate-200 rounded-lg flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded text-xs">#{r.id}</span>
                        <h3 className="font-bold text-slate-800">{r.hendelse}</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-2"><strong>Tiltak:</strong> {r.tiltak}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span><strong>Ansvarlig:</strong> {r.ansvarlig}</span>
                        <span><strong>Frist:</strong> {r.frist}</span>
                        <span><strong>Kostnad:</strong> {r.kostnad}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Nåværende Score</div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(r.score)}`}>{r.score}</span>
                      </div>
                      <div className="text-slate-300">→</div>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Mål Score</div>
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(goalScore)}`}>{goalScore}</span>
                      </div>
                    </div>
                  </div>
                 )
               })}
            </div>
          )}

          {activeTab === 'konsekvens' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase">
                  <tr>
                    <th className="p-4 border-b">Nivå</th>
                    <th className="p-4 border-b">Navn</th>
                    <th className="p-4 border-b">Beskrivelse</th>
                    <th className="p-4 border-b">Veiledning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {konsekvensLevels.map((k) => (
                    <tr key={k.level} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-700">{k.level}</td>
                      <td className="p-4 font-medium">{k.name}</td>
                      <td className="p-4 text-slate-600">{k.desc}</td>
                      <td className="p-4 text-slate-500 italic">{k.veiledning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sannsynlighet' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase">
                  <tr>
                    <th className="p-4 border-b">Nivå</th>
                    <th className="p-4 border-b">Navn</th>
                    <th className="p-4 border-b">Beskrivelse</th>
                    <th className="p-4 border-b">Veiledning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sannsynlighetLevels.map((s) => (
                    <tr key={s.level} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-700">{s.level}</td>
                      <td className="p-4 font-medium">{s.name}</td>
                      <td className="p-4 text-slate-600">{s.desc}</td>
                      <td className="p-4 text-slate-500 italic">{s.veiledning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'matrise' && (
            <div className="flex flex-col items-center">
               <div className="grid grid-cols-6 gap-1 max-w-3xl w-full">
                  <div className="col-span-1"></div>
                  <div className="col-span-5 text-center font-bold text-slate-600 mb-2">Konsekvens →</div>
                  
                  {/* Rows (5 to 1 downward) */}
                  {[5,4,3,2,1].map(s => (
                    <React.Fragment key={`row-${s}`}>
                      <div className="flex items-center justify-end pr-4 text-sm font-medium text-slate-600">
                        {s === 3 ? <span className="-rotate-90 absolute -ml-24 whitespace-nowrap tracking-widest uppercase">Sannsynlighet</span> : ''}
                        {s}
                      </div>
                      {[1,2,3,4,5].map(k => {
                        const score = s * k;
                        // Find risks mapped here
                        const mappedRisks = calculatedRisks.filter(r => r.currentSannsynlighet === s && r.currentKonsekvens === k);
                        
                        return (
                          <div 
                            key={`${s}-${k}`} 
                            style={{ backgroundColor: `#${getRiskHexColor(score)}` }}
                            className={`aspect-square flex items-center justify-center p-2 rounded-md shadow-inner text-sm font-bold min-h-[80px]
                              ${score > 12 ? 'text-white' : 'text-black'}`}
                          >
                            {mappedRisks.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {mappedRisks.map(mr => (
                                  <span key={mr.id} title={mr.hendelse} className="bg-black/20 px-2 py-0.5 rounded cursor-help">
                                    #{mr.id}
                                  </span>
                                ))}
                              </div>
                            ) : score}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                  
                  <div className="col-span-1 mt-2"></div>
                  {[1,2,3,4,5].map(k => (
                    <div key={`col-${k}`} className="text-center font-medium text-slate-600 mt-2">{k}</div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
