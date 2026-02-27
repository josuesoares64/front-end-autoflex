import { Providers } from "@/components/Providers";
import "./globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Layers, 
  Boxes, 
  ClipboardCheck, 
  User, 
  Database 
} from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col md:flex-row font-sans antialiased">
        <Providers>
          {/* SIDEBAR - DESKTOP ONLY */}
          <aside className="w-64 bg-[#0f172a] text-slate-400 hidden md:flex flex-col shadow-2xl border-r border-white/5 shrink-0">
            <div className="p-8 text-white font-bold text-xl flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg"><Database size={20} /></div>
              <span>Autoflex <span className="text-blue-500">ERP</span></span>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              <SidebarLink href="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <SidebarLink href="/raw-materials" icon={<Layers size={18} />} label="Raw Materials" />
              <SidebarLink href="/products" icon={<Boxes size={18} />} label="Final Products" />
              <SidebarLink href="/production" icon={<ClipboardCheck size={18} />} label="Production Plan" />
            </nav>
          </aside>

          <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:px-8 justify-between shadow-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="md:hidden bg-blue-600 p-1.5 rounded-lg text-white">
                  <Database size={18} />
                </div>
                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Inventory Control</span>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <User size={18} />
              </div>
            </header>

            {/* PAGE CONTENT */}
            <section className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </section>
          </main>

          {/* BOTTOM NAVIGATION - MOBILE ONLY */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <MobileNavLink href="/" icon={<LayoutDashboard size={20} />} label="Home" />
            <MobileNavLink href="/raw-materials" icon={<Layers size={20} />} label="Stock" />
            <MobileNavLink href="/products" icon={<Boxes size={20} />} label="Products" />
            <MobileNavLink href="/production" icon={<ClipboardCheck size={20} />} label="Plan" />
          </nav>
        </Providers>
      </body>
    </html>
  );
}

// Link para Desktop Sidebar
function SidebarLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-all text-sm font-semibold">
      {icon} <span>{label}</span>
    </Link>
  );
}

// Link para Mobile Bottom Bar
function MobileNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-3 py-1 text-slate-500 hover:text-blue-600 transition-colors">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  );
}