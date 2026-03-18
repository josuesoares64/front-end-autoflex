'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchProductions } from '@/store/slices/productionSlice';
import ProductionModal from '@/components/ProductioModal'; 
import ProductionSimulator from '@/components/ProductionSimulator';
import { Activity, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function ProductionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const { items } = useSelector((state: RootState) => state.productions);

  useEffect(() => {
    dispatch(fetchProductions());
  }, [dispatch]);

  const productionData = items as any; 
  const products = productionData?.products || [];
  
  // Detecta se estamos simulando (se não tiver dados de 'realizado', é simulação)
  const isSimulating = productionData?.totalRealizedValue === undefined && !!productionData?.totalPotentialValue;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-black pb-24 md:pb-6">
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0"><DollarSign size={20} /></div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Potencial Total</p>
                <p className="text-xl md:text-2xl font-black truncate">
                  R$ {Number(productionData?.totalPotentialValue || productionData?.totalProductionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0"><TrendingUp size={20} /></div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Realizado</p>
                <p className="text-xl md:text-2xl font-black truncate">
                  {isSimulating ? "---" : `R$ ${Number(productionData?.totalRealizedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 shadow-lg shadow-blue-200 flex items-center justify-center gap-3 font-bold transition-all active:scale-95"
        >
          <Package size={20} /> NOVA ORDEM DE SAÍDA
        </button>
      </div>

      <div className="mb-8">
        <ProductionSimulator />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <Activity className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800">
            {isSimulating ? "Resultado da Simulação" : "Análise de Capacidade"}
          </h2>
        </div>
        
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Produto</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Qtd Planejada</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Vendido</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: any) => (
                <tr key={p.productId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50/20">
                    {p.quantity ?? p.possibleQuantity}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{isSimulating ? "---" : (p.soldQuantity || 0)}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    R$ {Number(p.totalValue ?? p.totalPotentialValue ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Adicionei o mesmo tratamento de 'isSimulating' para a view mobile abaixo se desejar */}
      </div>

      <ProductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}