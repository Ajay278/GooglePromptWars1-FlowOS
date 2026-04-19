import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ErrorBoundary from '../components/ErrorBoundary';
import EmergencyOverlay from '../components/safety/EmergencyOverlay';
import ConnectivityManager from '../components/ConnectivityManager';
import { useAppStore } from '../store';

export default function MainLayout() {
  const { highContrast } = useAppStore();

  return (
    <div className={`flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-surface relative shadow-xl overflow-hidden ${highContrast ? 'high-contrast' : ''}`}>
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar" role="main" aria-label="Main content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <BottomNav />
      {/* Graceful degradation managers */}
      <ConnectivityManager />
      {/* Emergency overlay lives here so it covers the full app frame */}
      <EmergencyOverlay />
    </div>
  );
}
