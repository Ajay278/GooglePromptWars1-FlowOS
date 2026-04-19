import { useEffect } from 'react';
import { useAppStore } from '../../store';
import { NodeId, findOptimalRoute } from '../../utils/routingEngine';
import { ShieldAlert, DoorOpen } from 'lucide-react';

export default function EvacuationMap() {
  const { setCachedEvacuationRoute, cachedEvacuationRoute } = useAppStore();

  const nodePositions: Record<NodeId, { top: string, left: string, label: string }> = {
    entrance: { top: '85%', left: '50%', label: 'Gate A' },
    concourse_a: { top: '65%', left: '30%', label: 'Concourse A' },
    concourse_b: { top: '65%', left: '70%', label: 'Concourse B' },
    food_court: { top: '35%', left: '30%', label: 'Food Court' },
    restrooms: { top: '50%', left: '15%', label: 'Restrooms' },
    seat_112: { top: '20%', left: '50%', label: 'Seat 112' },
    exit_north: { top: '10%', left: '80%', label: 'North Exit' }
  };

  useEffect(() => {
    // Generate an evacuation route simulating high congestion at concourse_a to force routing via concourse_b
    const heavyCongestion: Record<NodeId, number> = {
      entrance: 1, concourse_a: 5, concourse_b: 1, food_court: 3, restrooms: 1, seat_112: 1, exit_north: 1
    };
    // Starting from entrance to exit_north as a mock scenario
    const result = findOptimalRoute('entrance', 'exit_north', heavyCongestion);
    setCachedEvacuationRoute(result.path);
  }, [setCachedEvacuationRoute]);

  const path = cachedEvacuationRoute.length > 0 ? cachedEvacuationRoute : ['entrance', 'concourse_b', 'exit_north'] as NodeId[];

  return (
    <div className="absolute inset-0 bg-surface-variant z-10 overflow-hidden">
      {/* Evacuation styling */}
      <div className="absolute inset-0 bg-error/10 pointer-events-none"></div>
      
      {/* Nodes / Zones */}
      {Object.entries(nodePositions).map(([id, pos]) => (
        <div key={id} className="absolute w-2 h-2 bg-outline-variant rounded-full transform -translate-x-1/2 -translate-y-1/2 z-0" style={{ top: pos.top, left: pos.left }}></div>
      ))}

      {/* Evacuation Route */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {path.map((node, index) => {
          if (index === 0) return null;
          const prev = nodePositions[path[index - 1]];
          const curr = nodePositions[node];
          return (
            <line
              key={`${path[index - 1]}-${node}`}
              x1={prev.left}
              y1={prev.top}
              x2={curr.left}
              y2={curr.top}
              stroke="#B3261E" // Error color
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10,10"
              className="animate-[dash_0.5s_linear_infinite]"
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>

      {/* Exit Marker */}
      <div className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" style={{ top: nodePositions['exit_north'].top, left: nodePositions['exit_north'].left }}>
        <div className="bg-error text-white p-2 rounded-full shadow-lg border-2 border-white">
          <DoorOpen size={24} fill="currentColor" />
        </div>
        <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-black text-white bg-error px-3 py-1 rounded-full shadow-md whitespace-nowrap uppercase tracking-widest">
          Exit
        </span>
      </div>

      {/* Danger Zone Marker (simulated congestion) */}
      <div className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2" style={{ top: nodePositions['concourse_a'].top, left: nodePositions['concourse_a'].left }}>
        <div className="absolute -inset-10 bg-error/40 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-surface text-error p-1 rounded-full shadow-sm">
          <ShieldAlert size={16} />
        </div>
      </div>
    </div>
  );
}
