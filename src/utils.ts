import { Product } from './types';

// Formulas from specification
export function calculateItemEIS(product: Product): number {
  if (product.category === 'SoftwareLicense') return 0; // Software doesn't impact EIS hardware score directly

  // Dynamic baseline expected watts for standard/high power draw for that specific category
  let max_expected_W = 60; 
  switch(product.category) {
    case 'Laptop': max_expected_W = 50; break;
    case 'Desktop': max_expected_W = 150; break;
    case 'Monitor': max_expected_W = 20; break;
    case 'KeyboardMouse': max_expected_W = 1.5; break;
    case 'Switch': max_expected_W = 60; break;
    case 'Router': max_expected_W = 40; break;
    case 'WirelessAP': max_expected_W = 15; break;
    default: max_expected_W = 60;
  }
  
  // Energy Use (35%)
  const energyScore = Math.min(100, (product.energy_use_W / max_expected_W) * 100) * 0.35;
  
  // Recyclability (25%) -> Budget items (~40% recyc) get max penalty. Eco (~85% recyc) get ~3 points.
  // Using formula where anything under 50% is heavily penalized.
  const recycRaw = Math.min(100, Math.max(0, (90 - product.recyclable_percent) * 2.5));
  const recyclabilityScore = recycRaw * 0.25;
  
  // Expected Lifetime (25%) -> 6 years is perfect (0 pts). 3 years gives max penalty (100).
  const lifeRaw = Math.min(100, Math.max(0, (6 - product.expected_lifetime_years) * 33.33));
  const lifetimeScore = lifeRaw * 0.25;
  
  // Certifications (15%) - Brutal penalty for 0 certs
  let certScoreRaw = 100; // Assume worst
  if (product.eco_certifications.length >= 2) {
    certScoreRaw = 0; // Perfect, 2+ certs
  } else if (product.eco_certifications.length === 1) {
    certScoreRaw = 60; // Penalty for only 1
  } 
  const certScore = certScoreRaw * 0.15;
  
  return Math.min(100, Math.max(0, energyScore + recyclabilityScore + lifetimeScore + certScore));
}

export function getEisBadge(score: number): { label: string, color: string, textColor: string } {
  if (score < 40) return { label: 'Lav miljøpåvirkning', color: 'bg-success', textColor: 'text-bg' };
  if (score < 80) return { label: 'Middels miljøpåvirkning', color: 'bg-warn', textColor: 'text-bg' };
  return { label: 'Høy miljøpåvirkning', color: 'bg-alert', textColor: 'text-white' };
}

export function formatNOK(amount: number): string {
  return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount);
}

export function generateAlternativer(products: Product[], currentSelected: Product): { cheaper: Product | null, expensive: Product | null } {
  const categoryProducts = products.filter(p => p.category === currentSelected.category).sort((a, b) => a.unit_price_NOK - b.unit_price_NOK);
  
  const currentIndex = categoryProducts.findIndex(p => p.id === currentSelected.id);
  return {
    cheaper: currentIndex > 0 ? categoryProducts[currentIndex - 1] : null,
    expensive: currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : null
  };
}
