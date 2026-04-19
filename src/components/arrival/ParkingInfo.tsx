import { Car, Footprints, Info } from 'lucide-react';

export default function ParkingInfo() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="bg-tertiary-container text-on-tertiary-container rounded-3xl p-5 border border-outline-variant/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-surface/50 p-2 rounded-xl">
            <Car size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Assigned Zone</p>
            <h3 className="text-xl font-black">Lot C - Blue</h3>
          </div>
        </div>
        
        <div className="bg-surface/40 rounded-2xl p-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Footprints size={16} />
            <span>Walking route to Gate A</span>
          </div>
          <span className="font-bold bg-surface px-2 py-1 rounded-lg text-xs">8 min</span>
        </div>
      </div>

      <div className="bg-surface-variant p-4 rounded-3xl flex items-start gap-3">
        <Info className="text-primary mt-0.5 shrink-0" size={20} />
        <p className="text-sm text-on-surface-variant">
          Your parking spot is dynamically assigned based on current traffic to minimize your exit time after the event.
        </p>
      </div>
      
      <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-md active:scale-95 transition-all">
        Get Directions to Lot C
      </button>
    </div>
  );
}
