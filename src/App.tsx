import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastList } from './components/common/ToastList';
import { GlobalDropZone } from './components/common/GlobalDropZone';
import { ShortcutsModal } from './components/stream/ShortcutsModal';
import { PlayerView } from './components/views/PlayerView';
import type { BeforeInstallPromptEvent } from './types/media';

const MainLayout: React.FC = () => {
  const { loadLocalFile } = usePlayer();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Web App File Handling API: Allows Windows/Mac/Linux to open files directly in VM Player
  useEffect(() => {
    if ('launchQueue' in window && window.launchQueue) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (launchParams.files && launchParams.files.length > 0) {
          try {
            const handle = launchParams.files[0];
            const file = await handle.getFile();
            if (file) {
              loadLocalFile(file);
            }
          } catch (err) {
            console.error('Failed to open file from OS launchQueue:', err);
          }
        }
      });
    }
  }, [loadLocalFile]);

  // Capture PWA installation prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-[#090C10] text-white overflow-x-hidden">
      <Navbar
        installPrompt={installPrompt}
        onInstallAccepted={() => setInstallPrompt(null)}
      />

      <main className="flex-1 w-full flex flex-col min-w-0 overflow-x-hidden bg-[#090C10]">
        <PlayerView />
      </main>

      <Footer />

      {/* Global Modals, Drag-and-drop Overlay & Notifications */}
      <GlobalDropZone />
      <ShortcutsModal />
      <ToastList />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <MainLayout />
      </PlayerProvider>
    </ToastProvider>
  );
}

export default App;

