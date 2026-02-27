'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createProduct, updateProduct } from '@/store/slices/producSlice';
import { Trash2, Plus, X, Save } from 'lucide-react';

export default function ProductModal({ isOpen, selectedProduct, onClose }: any) {
  const dispatch = useDispatch<AppDispatch>();
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [materials, setMaterials] = useState([{ rawMaterialId: '', quantity: '' }]);

  const { items: rawMaterials } = useSelector((state: RootState) => state.rawMaterials);

  useEffect(() => {
    if (selectedProduct && isOpen) {
      setCode(selectedProduct.code || '');
      setName(selectedProduct.name || '');
      setPrice(selectedProduct.price?.toString() || '');
      if (selectedProduct.ProductRawMaterials) {
        setMaterials(selectedProduct.ProductRawMaterials.map((m: any) => ({
          rawMaterialId: m.rawMaterialId,
          quantity: m.quantity?.toString() || m.quantityNeeded?.toString() || ''
        })));
      }
    } else {
      setCode('');
      setName('');
      setPrice('');
      setMaterials([{ rawMaterialId: '', quantity: '' }]);
    }
  }, [selectedProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      code: code.trim(),
      name: name.trim(),
      price: Number(price),
      materials: materials
        .filter(m => m.rawMaterialId !== '')
        .map(m => ({
          rawMaterialId: m.rawMaterialId,
          quantity: Number(m.quantity),
          quantityNeeded: Number(m.quantity) 
        }))
    };

    console.log("OBJETO ENVIADO:", dataToSend);

    try {
      if (selectedProduct?.id) {
        await dispatch(updateProduct({ id: selectedProduct.id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createProduct(dataToSend)).unwrap();
      }
      onClose();
    } catch (error: any) {
      console.error("ERRO NO FRONT:", error);
      alert(`ERRO CRÍTICO: ${error.error || JSON.stringify(error)}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{selectedProduct ? 'Editar' : 'Novo'} Produto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Código</label>
              <input required className="w-full border rounded-lg p-3 text-slate-900" value={code} onChange={e => setCode(e.target.value)} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Preço (R$)</label>
              <input required type="number" step="0.01" className="w-full border rounded-lg p-3 text-slate-900" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome</label>
              <input required className="w-full border rounded-lg p-3 text-slate-900" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Composição (Materiais)</label>
            {materials.map((item, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg">
                <select 
                  required 
                  className="flex-[3] border rounded-lg p-2 text-slate-900"
                  value={item.rawMaterialId}
                  onChange={e => {
                    const newM = [...materials];
                    newM[index].rawMaterialId = e.target.value;
                    setMaterials(newM);
                  }}
                >
                  <option value="">Selecione...</option>
                  {rawMaterials?.map((rm: any) => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
                </select>
                <input 
                  required 
                  type="number" 
                  step="any"
                  placeholder="Qtd"
                  className="flex-1 border rounded-lg p-2 text-slate-900"
                  value={item.quantity}
                  onChange={e => {
                    const newM = [...materials];
                    newM[index].quantity = e.target.value;
                    setMaterials(newM);
                  }}
                />
                <button type="button" onClick={() => setMaterials(materials.filter((_, i) => i !== index))} className="text-red-500 p-2"><Trash2 size={20} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setMaterials([...materials, { rawMaterialId: '', quantity: '' }])} className="text-blue-600 text-sm font-bold">+ Adicionar Material</button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Save size={20} /> SALVAR AGORA
          </button>
        </form>
      </div>
    </div>
  );
}