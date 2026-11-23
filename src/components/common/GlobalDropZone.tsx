import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { UploadIcon } from './Icons';

export const GlobalDropZone: React.FC = () => {
  const { loadLocalFile } = usePlayer();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingOver(false);
        dragCounter = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        loadLocalFile(file);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [loadLocalFile]);

  if (!isDraggingOver) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 select-none animate-pop">
      <div className="w-full max-w-xl p-10 rounded-xl bg-[#0E121A] border-2 border-dashed border-[#E50914] flex flex-col items-center justify-center text-center gap-4 shadow-elevated">
        <div className="w-16 h-16 rounded-full bg-[#161B26] border border-[#232A3B] flex items-center justify-center text-[#E50914] shadow-solid">
          <UploadIcon size={32} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Release to Play Video
          </h2>
          <p className="text-xs text-slate-400">
            Hardware-accelerated local decoding • Zero upload latency • Runs directly from your disk
          </p>
        </div>
        <div className="px-3 py-1 rounded bg-[#161B26] border border-[#232A3B] text-[11px] font-mono text-[#10B981]">
          Supported: MP4, WebM, MKV, MOV, AVI, M4V
        </div>
      </div>
    </div>
  );
};
