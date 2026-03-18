export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  supplier: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}
