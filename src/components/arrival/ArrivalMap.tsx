import { MapPin, Navigation } from 'lucide-react';

export default function ArrivalMap() {
  return (
    <div className="relative w-full h-64 bg-surface-variant rounded-3xl overflow-hidden shadow-inner border border-outline-variant/30 flex items-center justify-center">
      {/* Simulated Map Background - Grid Lines */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#1d1b20 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
      </div>

      {/* Simulated Traffic Routes */}
      <div className="absolute w-full h-full">
        {/* Route 1 - Heavy Traffic */}
        <div className="absolute top-1/4 left-0 w-1/2 h-1 bg-red-500 rounded-full transform rotate-12 blur-[1px]"></div>
        {/* Route 2 - Clear */}
        <div className="absolute bottom-1/4 right-0 w-3/4 h-1 bg-green-500 rounded-full transform -rotate-12 blur-[1px]"></div>
        {/* Optimal Route Highlight */}
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-2 bg-primary/40 rounded-full transform -rotate-12 blur-[2px]"></div>
      </div>

      {/* Stadium Pin */}
      <div className="absolute flex flex-col items-center justify-center z-10 animate-bounce" style={{ top: '35%', left: '45%' }}>
        <div className="bg-primary text-on-primary-container p-2 rounded-full shadow-lg border-2 border-white">
          <MapPin fill="currentColor" size={24} />
        </div>
        <span className="mt-1 font-bold text-xs bg-surface/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">FlowOS Stadium</span>
      </div>

      {/* User Location Pin */}
      <div className="absolute flex items-center justify-center z-10" style={{ bottom: '15%', right: '15%' }}>
        <div className="bg-secondary text-white p-1.5 rounded-full shadow-md border-2 border-white">
          <Navigation fill="currentColor" size={16} className="transform rotate-45" />
        </div>
      </div>

      {/* Overlay controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <button className="bg-surface p-2 rounded-full shadow-md text-on-surface hover:bg-surface-variant">
          <span className="font-bold text-lg leading-none">+</span>
        </button>
        <button className="bg-surface p-2 rounded-full shadow-md text-on-surface hover:bg-surface-variant">
          <span className="font-bold text-lg leading-none">-</span>
        </button>
      </div>
      
      {/* Traffic Legend */}
      <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-sm text-xs flex gap-3">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Fast</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Heavy</div>
      </div>
    </div>
  );
}
