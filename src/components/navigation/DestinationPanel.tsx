import { useAppStore } from '../../store';
import { NodeId } from '../../utils/routingEngine';
import { Armchair, Coffee, DoorOpen, Bath, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../BottomNav';

export default function DestinationPanel() {
  const { destination, setDestination, eta, activePath, congestion } = useAppStore();

  const destinations: { id: NodeId, label: string, icon: any }[] = [
    { id: 'seat_112', label: 'My Seat', icon: Armchair },
    { id: 'food_court', label: 'Food & Drink', icon: Coffee },
    { id: 'restrooms', label: 'Restrooms', icon: Bath },
    { id: 'exit_north', label: 'North Exit', icon: DoorOpen },
  ];

  // Calculate if any node in the active path is highly congested
  const hasCongestionOnRoute = activePath.some(node => (congestion[node] || 1) > 1.8);

  return (
    <div className="absolute bottom-4 left-0 w-full px-4 z-40 pb-2">
      <div className="bg-surface rounded-3xl shadow-xl border border-outline-variant/30 p-4">
        
        {/* Header / Current Status */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Where to?</h2>
            <p className="text-xs text-on-surface-variant">Gate A • Level 1</p>
          </div>
          {destination && (
            <div className="flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full">
              <Clock size={16} />
              <span className="font-bold text-sm">{eta} min ETA</span>
            </div>
          )}
        </div>

        {/* Dynamic Route Alert */}
        {destination && hasCongestionOnRoute && (
          <div className="mb-4 bg-yellow-100 text-yellow-800 p-2.5 rounded-2xl flex items-start gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>Heavy crowd detected ahead. We've rerouted you to the fastest available path.</p>
          </div>
        )}

        {/* Destination Grid */}
        <div className="grid grid-cols-4 gap-2">
          {destinations.map((dest) => {
            const isSelected = destination === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setDestination(dest.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200',
                  isSelected 
                    ? 'bg-primary text-white shadow-md transform scale-105' 
                    : 'bg-surface-variant text-on-surface-variant hover:bg-outline-variant/50'
                )}
              >
                <dest.icon size={24} strokeWidth={isSelected ? 2.5 : 2} className="mb-1" />
                <span className="text-[10px] font-bold text-center leading-tight">{dest.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {destination && (
          <button className="w-full mt-4 bg-secondary text-white font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform animate-in fade-in zoom-in duration-300">
            <Navigation size={18} fill="currentColor" />
            Start Navigation
          </button>
        )}
      </div>
    </div>
  );
}
