export type Tier = 'Budget' | 'Standard' | 'Eco-Premium';
export type Category = 'Laptop' | 'Desktop' | 'Monitor' | 'KeyboardMouse' | 'Switch' | 'Router' | 'WirelessAP' | 'SoftwareLicense';
export type CostType = 'Engangskostnad' | 'Løpende';

export interface Product {
  id: string;
  name: string;
  category: Category;
  tier: Tier;
  costType: CostType;
  unit_price_NOK: number;
  energy_use_W: number; // TDP or active power
  recyclable_percent: number; // 0-100
  expected_lifetime_years: number;
  repairability_score: number; // 0-10
  eco_certifications: string[];
  vendor_link: string;
  notes: string;
  justificationTemplate: string;
}

export interface SelectionState {
  categoryId: Category;
  selectedId: string;
  quantity: number;
}
