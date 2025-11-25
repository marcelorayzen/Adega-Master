
import React from 'react';
import { Wine, Beer, GlassWater, Droplets, Utensils, Package, Gift } from 'lucide-react';

interface ProductIconProps {
  category: string;
  size?: number;
  className?: string;
}

const ProductIcon: React.FC<ProductIconProps> = ({ category, size = 24, className = "" }) => {
  const normalizedCat = category.toLowerCase();

  let Icon = Package;

  if (normalizedCat.includes('vinho')) Icon = Wine;
  else if (normalizedCat.includes('cerveja') || normalizedCat.includes('chope')) Icon = Beer;
  else if (normalizedCat.includes('destilado') || normalizedCat.includes('whisky') || normalizedCat.includes('gin')) Icon = GlassWater;
  else if (normalizedCat.includes('água') || normalizedCat.includes('refr') || normalizedCat.includes('suco')) Icon = Droplets;
  else if (normalizedCat.includes('petisco') || normalizedCat.includes('comida')) Icon = Utensils;
  else if (normalizedCat.includes('kit') || normalizedCat.includes('combo')) Icon = Gift;

  return (
    <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
      <Icon size={size} className="text-gray-500" />
    </div>
  );
};

export default ProductIcon;
