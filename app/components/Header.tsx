"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/" || pathname === "/register" || pathname === "/login";

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="border-b border-[#1e2631] bg-[#11161d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-bold tracking-widest text-white uppercase text-sm">
            SDR / Analyzer
          </span>
        </div>
        <div className="flex gap-1 bg-[#0b0f14] p-1 rounded-lg border border-[#1e2631]">
          <Link
            href="/diagrams"
            className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-[#1e2631] text-slate-300 hover:text-white transition-colors"
          >
            Генератор (Модель)
          </Link>
          <Link
            href="/upload"
            className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-[#1e2631] text-slate-300 hover:text-white transition-colors"
          >
            Аналіз файлу (Реал)
          </Link>
        </div>
      </div>
    </nav>
  );
}
