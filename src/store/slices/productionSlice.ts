import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchProductions = createAsyncThunk('productions/fetchAll', async () => {
  const response = await api.get('/production');
  return response.data;
});

export const createProduction = createAsyncThunk('productions/create', async (data: { productId: string; quantity: number }) => {
  const response = await api.post('/productions', data);
  return response.data;
});

// Movi para cima para organizar, mas o importante é o extraReducers abaixo
export const simulateProduction = createAsyncThunk(
  'production/simulate',
  async (limits: { productId: string, max: number }[]) => {
    const response = await api.patch('/production/plan', { limits });
    return response.data;
  }
);

const productionSlice = createSlice({
  name: 'productions',
  initialState: {
    items: { products: [], totalPotentialValue: 0, totalRealizedValue: 0 },
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createProduction.fulfilled, (state: any, action) => {
        // Verificamos se a estrutura existe e usamos tipagem 'any' para o unshift
        if (state.items && state.items.products) {
          (state.items.products as any[]).unshift(action.payload);
        }
      })
      // --- ADICIONE ESTA LINHA AQUI EMBAIXO ---
      .addCase(simulateProduction.fulfilled, (state, action) => {
        state.items = action.payload; // Sobrescreve os itens com o plano calculado pelo back
        state.status = 'succeeded';
      });
  },
});

export default productionSlice.reducer;