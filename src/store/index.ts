import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from './slices/rawMaterialSlice';

export const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialReducer,
    // Adicionaremos os outros slices (products, production) conforme avançarmos
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;