import { Wifi, Zap, Sparkles, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * UI metadata for products - maps backend product names to visual presentation
 */
export interface ProductUIMetadata {
  icon: LucideIcon;
  color: string;
}

/**
 * Product catalog mapping backend product names to UI metadata
 */
export const productCatalog: Record<string, ProductUIMetadata> = {
  'NEO': {
    icon: Wifi,
    color: 'from-purple-600 to-purple-700',
  },
  'VELO': {
    icon: Wifi,
    color: 'from-purple-700 to-pink-600',
  },
  'NEXUS': {
    icon: Zap,
    color: 'from-pink-600 to-purple-600',
  },
  'PRIME': {
    icon: Zap,
    color: 'from-purple-600 to-indigo-600',
  },
  'WONDER': {
    icon: Sparkles,
    color: 'from-indigo-600 to-purple-700',
  },
  'ULTRA': {
    icon: Rocket,
    color: 'from-purple-700 to-pink-700',
  },
};

/**
 * Get UI metadata for a product by name
 */
export function getProductUIMetadata(productName: string): ProductUIMetadata {
  return productCatalog[productName] || {
    icon: Wifi,
    color: 'from-purple-600 to-pink-600',
  };
}
