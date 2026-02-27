'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchProducts, deleteProduct } from '@/store/slices/producSlice';
import { fetchRawMaterials } from '@/store/slices/rawMaterialSlice'; 
import ProductModal from '@/components/ProductModal';
import { Plus, Edit2, Trash2, Box, Loader2 } from 'lucide-react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Box className="text-blue-600" size={28} /> Produtos
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">Gerenciamento de produtos acabados e estoque</p>
        </div>
        
        <button 
          onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition-all font-bold text-sm sm:text-base whitespace-nowrap"
        >
          <Plus size={20} /> Adicionar Produto
        </button>
      </div>

      {/* TABELA COM CONTAINER DE SCROLL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    Carregando produtos...
                  </td>
                </tr>
              ) : items.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-600 font-bold text-sm">{product.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">R$ {Number(product.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id as string)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 && status !== 'loading' && (
          <div className="p-16 text-center text-slate-400">
            <Box className="mx-auto mb-4 opacity-20" size={48} />
            <p className="font-medium">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>

      {/* MODAL DAS MATÉRIAS-PRIMAS CARREGADAS */}
      <ProductModal 
        isOpen={isModalOpen} 
        selectedProduct={selectedProduct} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}