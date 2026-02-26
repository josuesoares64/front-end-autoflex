import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { RawMaterial } from '@/types';

// Action para BUSCAR todos
export const fetchRawMaterials = createAsyncThunk('rawMaterials/fetchAll', async () => {
  const response = await api.get('/raw-materials');
  return response.data;
});

// Action para CRIAR um novo
export const createRawMaterial = createAsyncThunk(
  'rawMaterials/create',
  async (newMaterial: Omit<RawMaterial, 'id'>) => {
    const response = await api.post('/raw-materials', newMaterial);
    return response.data;
  }
);

// Action para EDITAR (PATCH)
export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, data }: { id: string; data: Partial<RawMaterial> }) => {
    const response = await api.patch(`/raw-materials/${id}`, data);
    return response.data;
  }
);

// Action para DELETAR
export const deleteRawMaterial = createAsyncThunk('rawMaterials/delete', async (id: string) => {
  await api.delete(`/raw-materials/${id}`);
  return id;
});

const rawMaterialSlice = createSlice({
  name: 'rawMaterials',
  initialState: { items: [] as RawMaterial[], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      // Create
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default rawMaterialSlice.reducer;