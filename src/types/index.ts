export interface Product {
  id?: string;
  code: string;
  name: string;
  price: number;
  materials?: {
    rawMaterialId: string;
    quantityNeeded: number;
  }[];
  ProductRawMaterials?: any[];
}

export interface RawMaterial {
  id?: string | number;
  code: string;
  name: string;
  stock_quantity: number; 
  stockQuantity?: number;
}

export interface Production {
  id: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  observation?: string;
  createdAt?: string;
  product?: { name: string; code: string };
}