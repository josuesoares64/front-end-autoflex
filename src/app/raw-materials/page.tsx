'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchRawMaterials, deleteRawMaterial } from '@/store/slices/rawMaterialSlice';
import MaterialModal from '@/components/MaterialModal';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { RawMaterial } from '@/types';

export default function RawMaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawMaterial | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.rawMaterials);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleEdit = (item: RawMaterial) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header com Visual Projedata */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-blue-600" /> Raw Materials
          </h1>
          <p className="text-slate-500">Inventory and stock management</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 font-semibold"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {/* Card da Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">{item.code}</td>
                <td className="px-6 py-4 text-slate-700 font-medium">{item.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                    {Number(item.stockQuantity).toFixed(2)} units
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete this item?')) dispatch(deleteRawMaterial(item.id)) }}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {items.length === 0 && status !== 'loading' && (
          <div className="p-12 text-center text-slate-400">
            No materials found. Click "Add Material " to start.
          </div>
        )}
      </div>

      <MaterialModal 
        isOpen={isModalOpen} 
        selectedMaterial={selectedItem} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}