import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchProductions = createAsyncThunk('productions/fetchAll', async () => {
  const response = await api.get('/production');
  return response.data;
});

export const createProduction = createAsyncThunk(
  'productions/create',
  async (data: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      // CORREÇÃO DEFINITIVA: Rota exata para o seu POST
      const response = await api.post('/production/output', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao registrar produção');
    }
  }
);

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
        if (state.items && state.items.products) {
          // Ajustado para pegar o objeto de output que volta da rota /output
          state.items.products.unshift(action.payload.output || action.payload);
        }
      })
      .addCase(simulateProduction.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      });
  },
});

export default productionSlice.reducer;