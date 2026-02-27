'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchProductions } from '@/store/slices/productionSlice';
import ProductionModal from '@/components/ProductioModal'; 
import ProductionSimulator from '@/components/ProductionSimulator';
import { Activity, TrendingUp, DollarSign, Package, ChevronRight } from 'lucide-react';

export default function ProductionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const { items, status } = useSelector((state: RootState) => state.productions);

  useEffect(() => {
    dispatch(fetchProductions());
  }, [dispatch]);

  const productionData = items as any; 
  const products = productionData?.products || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-black pb-24 md:pb-6">
      
      {/* HEADER & KPIs*/}
      <div className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card Potencial */}
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
          
          {/* Card Realizado */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0"><TrendingUp size={20} /></div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Realizado</p>
                <p className="text-xl md:text-2xl font-black truncate">
                  R$ {Number(productionData?.totalRealizedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação - No Mobile vira largura total e ganha destaque */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 shadow-lg shadow-blue-200 flex items-center justify-center gap-3 font-bold transition-all active:scale-95"
        >
          <Package size={20} /> NOVA ORDEM DE SAÍDA
        </button>
      </div>

      {/* --- SEÇÃO DO SIMULADOR --- */}
      <div className="mb-8">
        <ProductionSimulator />
      </div>

      {/* SEÇÃO DA TABELA / LISTA RESPONSIVA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <Activity className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800">Análise de Capacidade</h2>
        </div>
        
        {/* VIEW DESKTOP: TABELA (Oculta em telas pequenas) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase">Produto</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Possível</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Vendido</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-center">Restante</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase text-right">Valor Potencial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: any) => (
                <tr key={p.productId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{p.productId}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50/20">
                    {p.quantity !== undefined ? p.quantity : p.possibleQuantity}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{p.soldQuantity || 0}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{p.remainingQuantity || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-900 text-sm">R$ {Number(p.totalPotentialValue || p.totalValue || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">UNIT: R$ {p.price}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-slate-100">
          {products.map((p: any) => (
            <div key={p.productId} className="p-5 active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-slate-900 leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{p.productId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-600">R$ {Number(p.totalPotentialValue || p.totalValue || 0).toFixed(2)}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-blue-50/50 p-2 rounded-lg text-center border border-blue-100">
                  <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tighter">Possível</p>
                  <p className="text-sm font-bold text-blue-800">{p.quantity !== undefined ? p.quantity : p.possibleQuantity}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Vendido</p>
                  <p className="text-sm font-bold text-slate-700">{p.soldQuantity || 0}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Restante</p>
                  <p className="text-sm font-bold text-slate-700">{p.remainingQuantity || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}