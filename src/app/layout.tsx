import { Providers } from "@/components/Providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-slate-900 min-h-screen flex">
        <Providers>
          <aside className="w-64 bg-[#0a0a2e] text-white hidden md:flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-slate-700">
              Projedata <span className="text-blue-500">Stock</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/raw-materials" className="block p-3 rounded hover:bg-blue-600 transition">Raw Materials</a>
              <a href="/products" className="block p-3 rounded hover:bg-blue-600 transition">Products</a>
              <a href="/production" className="block p-3 rounded hover:bg-blue-600 transition">Production Plan</a>
            </nav>
          </aside>

          <main className="flex-1 flex flex-col">
            <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between">
              <span className="font-medium text-slate-500">Inventory Management</span>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                AD
              </div>
            </header>
            <section className="p-8">
              {children}
            </section>
          </main>
        </Providers>
      </body>
    </html>
  );
}