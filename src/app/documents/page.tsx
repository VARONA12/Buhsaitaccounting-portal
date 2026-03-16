"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { RecentDocuments } from "@/components/RecentDocuments";
import { Folder, Upload, Search, Share2, Trash2, MoreHorizontal, Grid, List as ListIcon } from "lucide-react";

export default function DocumentsPage() {
  const folders = [
    { name: "Отчетность 2024", count: "12 файлов", size: "4.2 MB" },
    { name: "Учредительные", count: "5 файлов", size: "1.8 MB" },
    { name: "Сотрудники", count: "28 файлов", size: "12.5 MB" },
    { name: "Архив", count: "450 файлов", size: "1.2 GB" },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Облако документов</h1>
            <p className="text-neutral-400">Надежное хранилище ваших бухгалтерских данных</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-all">
              Создать папку
            </button>
            <button className="bg-primary text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
              <Upload size={20} /> Загрузить
            </button>
          </div>
        </div>

        {/* Categories / Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <Folder size={24} />
                </div>
                <button className="text-neutral-600 hover:text-white">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{folder.name}</h3>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{folder.count}</span>
                <span>{folder.size}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Files Table Section */}
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Все файлы</h2>
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              <button className="p-1.5 bg-white/10 rounded text-primary"><ListIcon size={18} /></button>
              <button className="p-1.5 text-neutral-500 hover:text-white"><Grid size={18} /></button>
            </div>
          </div>

          {/* We reuse the RecentDocuments component logic but embedded in a page context */}
          <RecentDocuments />
        </div>
      </div>
    </DashboardShell>
  );
}
