import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ErrorBoundary from '../components/ErrorBoundary';
import EmergencyOverlay from '../components/safety/EmergencyOverlay';
import ConnectivityManager from '../components/ConnectivityManager';
import { useAppStore } from '../store';

import { useEffect } from 'react';

import { useStadiumData } from '../hooks/useStadiumData';

export default function MainLayout() {
  const { highContrast } = useAppStore();
  
  // Initialize Global Stadium Data Sync (Zod Validated)
  useStadiumData();

  return (
    <div className={`flex flex-col h-[100dvh] w-full max-w-md mx-auto app-sports-bg relative shadow-2xl overflow-hidden rounded-none ${highContrast ? 'high-contrast' : ''}`}>
      <main className="flex-1 overflow-y-auto no-scrollbar" role="main" aria-label="Main content">
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
