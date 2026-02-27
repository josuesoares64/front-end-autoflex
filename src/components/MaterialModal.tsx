"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  createRawMaterial,
  updateRawMaterial,
} from "@/store/slices/rawMaterialSlice";
import { RawMaterial } from "@/types";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedMaterial: RawMaterial | null;
}

export default function MaterialModal({
  isOpen,
  onClose,
  selectedMaterial,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    stockQuantity: "",
  });

  useEffect(() => {
    if (selectedMaterial) {
      setFormData({
        code: selectedMaterial.code,
        name: selectedMaterial.name,
        stockQuantity: String((selectedMaterial as any).stock_quantity || (selectedMaterial as any).stockQuantity || ""),
      });
    } else {
      setFormData({ code: "", name: "", stockQuantity: "" });
    }
  }, [selectedMaterial, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: formData.code,
      name: formData.name,
      stock_quantity: Number(formData.stockQuantity), 
    } as any; 

    try {
      if (selectedMaterial?.id) {
        await dispatch(
          updateRawMaterial({
            id: String(selectedMaterial.id),
            data: payload,
          })
        );
      } else {
        await dispatch(createRawMaterial(payload));
      }
      onClose();
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {selectedMaterial ? "Edit Material" : "New Raw Material"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Material Code
            </label>
            <input
              required
              value={formData.code}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. RM-001"
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <input
              required
              value={formData.name}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Material name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Initial Stock
            </label>
            <input
              required
              type="number"
              step="0.01"
              value={formData.stockQuantity}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="0.00"
              onChange={(e) =>
                setFormData({ ...formData, stockQuantity: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
            >
              {selectedMaterial ? "Update Changes" : "Save Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}