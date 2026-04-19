import { useEffect } from 'react';
import { Ticket, Clock } from 'lucide-react';
import { useAppStore } from '../../store';

export default function DigitalTicket() {
  const { gateWaitTime, setGateWaitTime } = useAppStore();

  // Simulate real-time wait time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate wait time between 8 and 15 minutes
      const newWait = Math.max(8, Math.min(15, gateWaitTime + (Math.random() > 0.5 ? 1 : -1)));
      setGateWaitTime(newWait);
    }, 5000);
    return () => clearInterval(interval);
  }, [gateWaitTime, setGateWaitTime]);

  return (
    <div className="flex flex-col gap-4 mt-2 items-center">
      <div className="bg-surface w-full max-w-sm rounded-[2rem] p-6 shadow-lg border border-outline-variant/30 flex flex-col items-center relative overflow-hidden">
        {/* Ticket Header */}
        <div className="w-full border-b-2 border-dashed border-outline-variant/50 pb-6 mb-6 flex justify-between items-center relative">
          {/* Edge cutouts */}
          <div className="absolute -left-10 -bottom-3 w-6 h-6 bg-surface-variant rounded-full"></div>
          <div className="absolute -right-10 -bottom-3 w-6 h-6 bg-surface-variant rounded-full"></div>
          
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Entry Gate</p>
            <h2 className="text-3xl font-black text-primary">Gate A</h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Time Slot</p>
            <h2 className="text-xl font-bold text-on-surface">6:30 PM</h2>
          </div>
        </div>

        {/* Mock QR Code */}
        <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-inner border border-outline-variant/20 mb-6 flex flex-col items-center justify-center relative">
          {/* Simple CSS grid to look like a QR code */}
          <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-80">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`bg-on-surface rounded-sm ${Math.random() > 0.3 ? 'opacity-100' : 'opacity-0'}`}></div>
            ))}
            {/* Position markers */}
            <div className="absolute top-2 left-2 w-10 h-10 border-4 border-on-surface rounded-md"></div>
            <div className="absolute top-2 right-2 w-10 h-10 border-4 border-on-surface rounded-md"></div>
            <div className="absolute bottom-2 left-2 w-10 h-10 border-4 border-on-surface rounded-md"></div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-pulse pointer-events-none"></div>
        </div>

        <div className="flex items-center gap-2 text-on-surface font-semibold bg-primary-container text-on-primary-container px-4 py-2 rounded-full">
          <Ticket size={18} />
          <span>Tap to add to Apple Wallet</span>
        </div>
      </div>

      {/* Real-time Wait Indicator */}
      <div className="w-full bg-surface-variant rounded-3xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${gateWaitTime < 10 ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>
            <Clock size={24} />
          </div>
          <div>
            <p className="font-bold text-sm">Live Gate A Wait</p>
            <p className="text-xs text-on-surface-variant">Optimal time to enter</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black">{gateWaitTime}</span>
          <span className="text-sm font-bold text-on-surface-variant ml-1">min</span>
        </div>
      </div>
    </div>
  );
}
