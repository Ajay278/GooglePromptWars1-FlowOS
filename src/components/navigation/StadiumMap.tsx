
import { useAppStore } from '../../store';
import { NodeId } from '../../utils/routingEngine';
import { MapPin } from 'lucide-react';

export default function StadiumMap() {
  const { activePath, congestion } = useAppStore();
  
  // Define node positions on the map (percentages)
  const nodePositions: Record<NodeId, { top: string, left: string, label: string }> = {
    entrance: { top: '85%', left: '50%', label: 'Gate A' },
    concourse_a: { top: '65%', left: '30%', label: 'Concourse A' },
    concourse_b: { top: '65%', left: '70%', label: 'Concourse B' },
    food_court: { top: '35%', left: '30%', label: 'Food Court' },
    restrooms: { top: '50%', left: '15%', label: 'Restrooms' },
    seat_112: { top: '20%', left: '50%', label: 'Seat 112' },
    exit_north: { top: '10%', left: '80%', label: 'North Exit' }
  };

  return (
    <div className="relative w-full h-full bg-surface-variant overflow-hidden">
      {/* Pitch/Field Simulation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-72 border-4 border-white/20 rounded-full bg-green-900/20 shadow-inner">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full"></div>
      </div>

      {/* Nodes & Congestion Heatmaps */}
      {Object.entries(nodePositions).map(([id, pos]) => {
        const nodeId = id as NodeId;
        const crowdLevel = congestion[nodeId] || 1;
        
        let crowdColor = 'bg-green-500/20';
        if (crowdLevel > 1.5) crowdColor = 'bg-yellow-500/40';
        if (crowdLevel > 2) crowdColor = 'bg-red-500/50';

        const isActive = activePath.includes(nodeId);

        return (
          <div key={id} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ top: pos.top, left: pos.left }}>
            {/* Heatmap blur */}
            <div className={`absolute -inset-6 rounded-full blur-xl ${crowdColor} transition-colors duration-1000`} />
            
            {/* Node Dot */}
            <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-white shadow-md transition-colors duration-300 ${isActive ? 'bg-primary scale-125' : 'bg-surface-variant'}`} />
            
            {/* Label */}
            <span className="absolute top-5 left-1/2 transform -translate-x-1/2 text-[10px] font-bold bg-surface/80 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20">
              {pos.label}
            </span>
          </div>
        );
      })}

      {/* Highlight Active Path (SVG lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {activePath.map((node, index) => {
          if (index === 0) return null;
          const prev = nodePositions[activePath[index - 1]];
          const curr = nodePositions[node];
          return (
            <line
              key={`${activePath[index - 1]}-${node}`}
              x1={prev.left}
              y1={prev.top}
              x2={curr.left}
              y2={curr.top}
              stroke="#0b57d0"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8,8"
              className="animate-[dash_1s_linear_infinite]"
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
      `}</style>
      
      {/* Current Location Pin */}
      <div className="absolute top-[85%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-30">
        <MapPin fill="#00639b" className="text-white drop-shadow-md" size={28} />
      </div>
    </div>
  );
}
