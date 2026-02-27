import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from './slices/rawMaterialSlice';
import productReducer from './slices/producSlice';
import productionReducer from './slices/productionSlice';

export const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialReducer,
    products: productReducer,
    productions: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;