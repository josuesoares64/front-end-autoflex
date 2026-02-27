import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { Product } from '@/types';

// Busca todos os produtos
export const fetchProducts = createAsyncThunk(
  'products/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar produtos');
    }
  }
);

// Cria um produto
export const createProduct = createAsyncThunk(
  'products/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro no servidor');
    }
  }
);

// Atualiza um produto
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/products/${id}`, data);
      
      console.log("RESPOSTA BRUTA DO BACK-END:", response.data);

      const updatedProduct = {
        ...(response.data || {}),
        id: id, 
        ProductRawMaterials: response.data?.ProductRawMaterials || data.materials?.map((m: any) => ({
          rawMaterialId: m.rawMaterialId,
          quantity: m.quantity || m.quantityNeeded
        }))
      };

      return updatedProduct;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar produto');
    }
  }
);

// Deleta um produto
export const deleteProduct = createAsyncThunk(
  'products/delete', 
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao deletar produto');
    }
  }
);

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = 'succeeded';
      })

      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { 
            ...state.items[index], 
            ...action.payload 
          };
        }
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;