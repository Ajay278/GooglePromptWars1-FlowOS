import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { triggerHaptic } from '../utils/a11y';

export default function ConnectivityManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      triggerHaptic('light');
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      triggerHaptic('alert');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div 
        className="absolute top-0 left-0 w-full z-[150] bg-orange-600 text-white p-3 flex items-center gap-3 animate-in slide-in-from-top duration-300"
        role="alert"
        aria-live="assertive"
      >
        <WifiOff size={20} className="shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-wider">Offline Mode</p>
          <p className="text-[10px] font-medium opacity-90 leading-tight">
            Navigation and map data are limited. Local party tracking still active.
          </p>
        </div>
      </div>
    );
  }

  if (showStatus) {
    return (
      <div 
        className="absolute top-0 left-0 w-full z-[150] bg-green-600 text-white p-3 flex items-center gap-3 animate-in slide-in-from-top fade-out fill-mode-forwards delay-2000 duration-500"
        role="status"
      >
        <Wifi size={20} className="shrink-0" />
        <p className="text-xs font-black uppercase tracking-wider">Back Online</p>
      </div>
    );
  }

  return null;
}
