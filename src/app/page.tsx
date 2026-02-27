import Link from "next/link";
import { 
  Boxes, 
  Layers, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Factory
} from "lucide-react";

export default function Home() {
  // Dados para o Dashboard Industrial
  const stats = [
    { label: "Produtos", value: "12", icon: Boxes, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Matéria-Prima", value: "48", icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Produções Hoje", value: "5", icon: ClipboardList, color: "text-green-600", bg: "bg-green-50" },
    { label: "Alertas Estoque", value: "2", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <main className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Profissional */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Factory className="text-blue-600" size={32} />
              Autoflex <span className="text-blue-600">ERP</span>
            </h1>
            <p className="text-slate-500 font-medium">Controle de Produção e Insumos Industriais</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status do Sistema</p>
            <p className="text-sm font-bold text-green-500 flex items-center justify-end gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Operacional
            </p>
          </div>
        </header>

        {/* Stats Grid - Ícones corrigidos aqui */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Módulos de Gestão */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={22} className="text-blue-600" />
            Módulos Operacionais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link href="/products" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-between">
                Produtos 
                <ArrowRight className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">Gerencie o catálogo de produtos finais e suas composições de matéria-prima.</p>
            </Link>

            <Link href="/raw-materials" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-between">
                Matéria-Prima
                <ArrowRight className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">Controle o inventário de insumos básicos para evitar paradas na produção.</p>
            </Link>

            <Link href="/production" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-between">
                Simulador (RF008)
                <ArrowRight className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">Calcule a capacidade de produção baseada no estoque atual e priorize lucros.</p>
            </Link>

          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          Autoflex Industrial Management © 2026
        </footer>
      </main>
    </div>
  );
}