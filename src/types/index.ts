export interface RawMaterial {
  id?: number;
  code: string;
  name: string;
  stock_quantity: number; // Use o nome exato da sua coluna no banco
}

export interface Product {
  id?: number;
  code: string;
  name: string;
  price: number;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  stockQuantity: string | number;
  createdAt?: string;
  updatedAt?: string;
}