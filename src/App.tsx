import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { PlayerProvider } from './context/PlayerContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastList } from './components/common/ToastList';
import { GlobalDropZone } from './components/common/GlobalDropZone';
import { ShortcutsModal } from './components/stream/ShortcutsModal';
import { PlayerView } from './components/views/PlayerView';

const MainLayout: React.FC = () => {
  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-[#090C10] text-white overflow-x-hidden">
      <Navbar />

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
