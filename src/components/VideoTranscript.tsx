"use client";

import { useState } from "react";
import { Play, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface VideoTranscriptProps {
  videoUrl: string;
  transcript: string;
}

export function VideoTranscript({ videoUrl, transcript }: VideoTranscriptProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) return null;

  return (
    <div className="my-12 space-y-6">
      <div className="relative aspect-video rounded-[40px] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video content"
        />
      </div>

      {transcript && (
        <div className="rounded-[32px] bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-300">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center gap-4 text-white group-hover:text-white transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-1">AEO Оптимизация</div>
                <div className="text-sm font-bold text-white uppercase tracking-widest">Транскрипт видео</div>
              </div>
            </div>
            {isOpen ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
          </button>
          
          {isOpen && (
            <div className="px-8 pb-8 pt-2">
              <div className="h-px bg-white/5 mb-6" />
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-medium font-sans">
                {transcript}
              </p>
            </div>
          )}
          
          {/* Hidden for humans if not open, but always visible to bots in the DOM if we don't conditional render */}
          {!isOpen && (
            <div className="sr-only" aria-hidden="true">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
