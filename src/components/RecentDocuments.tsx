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
    <div className="glass rounded-3xl border border-border overflow-hidden w-full shadow-lg relative z-10 transition-all duration-300">
      <div className="p-5 md:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-text">Недавние документы</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchDocs}
            className="p-2 text-text-muted hover:text-text transition-colors bg-surface rounded-xl border border-border"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial bg-primary text-black hover:bg-primary-dark px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,193,7,0.2)]"
          >
            <Plus size={16} /> <span className="sm:inline">Загрузить</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide max-h-[450px] overflow-y-auto no-scrollbar">
        <div className="min-w-[600px] md:min-w-full">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[10px] text-text-muted uppercase bg-surface/50 font-black tracking-widest sticky top-0 z-20 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-6 py-4">Название</th>
                <th scope="col" className="px-6 py-4 hidden md:table-cell">Загружен</th>
                <th scope="col" className="px-6 py-4">Статус</th>
                <th scope="col" className="px-6 py-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted opacity-50 italic">
                    Документов пока нет
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-text">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-surface border border-border group-hover:text-primary transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="truncate max-w-[120px] md:max-w-xs">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs hidden md:table-cell">
                      {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase
                        ${doc.status === 'Проверен' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-primary/10 text-primary border border-primary/20'}
                      `}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-black text-xs transition-all uppercase tracking-tighter">
                        Открыть
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDocs} 
      />
    </div>
  );
}
