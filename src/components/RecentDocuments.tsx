"use client";

import { Download, Eye, FileText, Loader2, Plus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentUploadModal } from "./DocumentUploadModal";

interface Document {
  id: string;
  name: string;
  createdAt: string;
  status: string;
}

export function RecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке документов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden w-full max-w-4xl shadow-lg relative z-10">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Недавние документы</h3>
        <div className="flex gap-2">
          <button 
            onClick={fetchDocs}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black hover:bg-primary-dark px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(255,193,7,0.15)]"
          >
            <Plus size={14} /> Загрузить новый
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 uppercase bg-black/20">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Название</th>
              <th scope="col" className="px-6 py-4 font-medium">Загружен</th>
              <th scope="col" className="px-6 py-4 font-medium">Статус</th>
              <th scope="col" className="px-6 py-4 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>Загрузка документов...</span>
                  </div>
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  <div className="flex flex-col items-center gap-3 opacity-50">
                    <FileText className="w-8 h-8" />
                    <span>Документы пока не загружены</span>
                  </div>
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-neutral-200 flex items-center gap-3">
                    <div className="p-2 rounded bg-neutral-800/50 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <FileText size={16} />
                    </div>
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${doc.status === 'Проверен' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}
                    `}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-primary hover:text-white flex items-center gap-1 font-medium text-xs transition-colors">
                        <Download size={14} /> Скачать
                      </button>
                      <button className="text-primary hover:text-white flex items-center gap-1 font-medium text-xs transition-colors">
                        <Eye size={14} /> Открыть
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    <DocumentUploadModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSuccess={fetchDocs} 
    />
  </div>
  );
}
