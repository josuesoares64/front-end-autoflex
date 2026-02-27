"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchRawMaterials,
  deleteRawMaterial,
} from "@/store/slices/rawMaterialSlice";
import MaterialModal from "@/components/MaterialModal";
import { Plus, Edit2, Trash2, Package, Layers } from "lucide-react";
import { RawMaterial } from "@/types";

export default function RawMaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawMaterial | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector(
    (state: RootState) => state.rawMaterials,
  );

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
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-blue-600" /> Raw Materials
          </h1>
          <p className="text-slate-500 text-sm md:text-base">Inventory and stock management</p>
        </div>
        <button
          onClick={handleAddNew}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 font-bold active:scale-95"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {/* Card da Tabela / Lista */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* VIEW DESKTOP: TABELA (Oculta no Mobile) */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
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
                    <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if (item.id && confirm("Delete this item?")) {
                          dispatch(deleteRawMaterial(String(item.id)));
                        }
                      }} 
                      className="text-slate-400 hover:text-red-600 transition-colors p-1" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW MOBILE: CARDS (Oculta no Desktop) */}
        <div className="md:hidden divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-5 space-y-4 active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mb-1 font-mono">#{item.code}</p>
                  <h3 className="font-bold text-slate-800 leading-tight truncate">{item.name}</h3>
                </div>
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-2.5 text-slate-500 bg-slate-100 rounded-lg active:bg-blue-100 active:text-blue-600">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (item.id && confirm("Delete this item?")) {
                        dispatch(deleteRawMaterial(String(item.id)));
                      }
                    }} 
                    className="p-2.5 text-slate-500 bg-slate-100 rounded-lg active:bg-red-100 active:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Current Stock</span>
                <span className="font-black text-blue-800 text-lg">
                  {Number(item.stockQuantity).toFixed(2)} <span className="text-[10px] font-bold">UN</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && status !== "loading" && (
          <div className="p-12 text-center text-slate-400">
            <Package size={40} className="mx-auto mb-4 opacity-20" />
            No materials found. Click "Add Material" to start.
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