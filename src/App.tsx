import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { ToastList } from './components/common/ToastList';
import { ShortcutsModal } from './components/stream/ShortcutsModal';
import { StreamModal } from './components/stream/StreamModal';
import { HomeView } from './components/views/HomeView';
import { WatchView } from './components/views/WatchView';
import { TrendingView } from './components/views/TrendingView';
import { LibraryView } from './components/views/LibraryView';
import { NotFoundView } from './components/views/NotFoundView';

const MainContent: React.FC = () => {
  const { activeRoute } = usePlayer();

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-[#090C10] text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 w-full flex overflow-x-hidden">
        <Sidebar />

        <main className="flex-1 w-full flex flex-col min-w-0 overflow-x-hidden bg-[#090C10]">
          {activeRoute === 'home' && <HomeView />}
          {activeRoute === 'watch' && <WatchView />}
          {activeRoute === 'trending' && <TrendingView />}
          {(activeRoute === 'library' || activeRoute === 'history' || activeRoute === 'saved') && (
            <LibraryView />
          )}
          {activeRoute === 'not-found' && <NotFoundView />}

          <Footer />
        </main>
      </div>

      {/* Global Modals and Notifications */}
      <ShortcutsModal />
      <StreamModal />
      <ToastList />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <MainContent />
      </PlayerProvider>
    </ToastProvider>
  );
}

export default App;
