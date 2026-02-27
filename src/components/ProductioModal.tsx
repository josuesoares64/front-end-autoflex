'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { createProduction } from '@/store/slices/productionSlice';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductionModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);
  
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity) return alert("Please fill all fields");

    await dispatch(createProduction({ 
      productId, 
      quantity: Number(quantity) 
    }));
    
    setProductId('');
    setQuantity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">New Production Order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Product</label>
            <select 
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black transition"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity to Produce</label>
            <input 
              required
              type="number"
              min="1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black transition"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 mt-4 text-black">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              Start Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}