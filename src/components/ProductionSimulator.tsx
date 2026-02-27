'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { simulateProduction, fetchProductions } from '@/store/slices/productionSlice';
import { Play, RotateCcw, X, AlertCircle } from 'lucide-react';

export default function ProductionSimulator() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.productions);
  const availableProducts = (items as any)?.products || [];

  // Estado iniciado como vazio para evitar o "0" fixo
  const [selectedLimits, setSelectedLimits] = useState<Record<string, string>>({});

  const handleSelectProduct = (productId: string) => {
    if (!productId) return;
    if (selectedLimits[productId] === undefined) {
      setSelectedLimits(prev => ({ ...prev, [productId]: "" })); // String vazia em vez de 0
    }
  };

  const handleInputChange = (id: string, value: string) => {
    // Remove zeros à esquerda para não ficar 010
    const cleanValue = value.replace(/^0+/, '');
    setSelectedLimits(prev => ({ ...prev, [id]: cleanValue }));
  };

  const removeProduct = (id: string) => {
    const newLimits = { ...selectedLimits };
    delete newLimits[id];
    setSelectedLimits(newLimits);
  };

  const handleSimulate = async () => {
    const payload = Object.entries(selectedLimits).map(([productId, max]) => ({
      productId,
      max: Number(max) || 0
    }));
    
    // Dispara a simulação. O slice deve atualizar o state.items
    await dispatch(simulateProduction(payload));
  };

  const resetSimulation = () => {
    setSelectedLimits({});
    dispatch(fetchProductions());
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl border border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">
            <Play size={20} /> Simulador de Escassez
          </h3>
          <p className="text-slate-400 text-sm">Defina limites para redistribuir a matéria-prima</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={resetSimulation} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-all text-sm">
            <RotateCcw size={16} /> Resetar
          </button>
          <button 
            onClick={handleSimulate}
            disabled={Object.keys(selectedLimits).length === 0}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-30 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all"
          >
            SIMULAR IMPACTO
          </button>
        </div>
      </div>

      <div className="mb-6">
        <select 
          onChange={(e) => handleSelectProduct(e.target.value)}
          value=""
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="">Clique aqui para selecionar um produto...</option>
          {availableProducts.map((p: any) => (
            <option key={p.productId} value={p.productId}>
              {p.name} (Original: {p.possibleQuantity || p.quantity})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(selectedLimits).map((id) => {
          const product = availableProducts.find((p: any) => p.productId === id);
          return (
            <div key={id} className="bg-slate-800 border border-slate-600 p-4 rounded-xl relative">
              <button onClick={() => removeProduct(id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                <X size={18} />
              </button>
              
              <div className="flex flex-col gap-2">
                <span className="font-bold text-blue-400">{product?.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Simular Limite</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500"
                      placeholder="Digite a qtd..."
                      value={selectedLimits[id]}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                    />
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Original</label>
                    <span className="text-lg font-mono text-slate-400">{product?.possibleQuantity || product?.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}