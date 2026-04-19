import { useAppStore } from '../../store';
import { NodeId } from '../../utils/routingEngine';
import { ShieldAlert, EyeOff, MapPin } from 'lucide-react';

export default function GroupMap() {
  const { groupMembers, isPrivacyMode } = useAppStore();
  
  // Reusing the same stadium map coordinates
  const nodePositions: Record<NodeId, { top: string, left: string, label: string }> = {
    entrance: { top: '85%', left: '50%', label: 'Gate A' },
    concourse_a: { top: '65%', left: '30%', label: 'Concourse A' },
    concourse_b: { top: '65%', left: '70%', label: 'Concourse B' },
    food_court: { top: '35%', left: '30%', label: 'Food Court' },
    restrooms: { top: '50%', left: '15%', label: 'Restrooms' },
    seat_112: { top: '20%', left: '50%', label: 'Seat 112' },
    exit_north: { top: '10%', left: '80%', label: 'North Exit' }
  };

  const hasLostMember = groupMembers.some(m => m.status === 'lost');

  return (
    <div className="relative w-full h-full bg-surface-variant overflow-hidden">
      {/* Privacy Mode Overlay */}
      {isPrivacyMode && !hasLostMember && (
        <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-surface p-3 rounded-full shadow-md text-on-surface-variant opacity-80 mb-2">
            <EyeOff size={32} />
          </div>
          <p className="font-bold text-sm bg-surface/80 px-4 py-1 rounded-full shadow-sm">Privacy Mode Active</p>
          <p className="text-xs mt-1 text-on-surface-variant bg-surface/80 px-3 py-1 rounded-full">Zone-based tracking only</p>
        </div>
      )}

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#1d1b20 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Nodes / Zones */}
      {Object.entries(nodePositions).map(([id, pos]) => (
        <div key={id} className="absolute w-2 h-2 bg-outline-variant rounded-full transform -translate-x-1/2 -translate-y-1/2 z-0" style={{ top: pos.top, left: pos.left }}></div>
      ))}

      {/* Members */}
      {groupMembers.map(member => {
        const pos = nodePositions[member.locationId];
        // Jitter position slightly so avatars don't overlap exactly
        const jitterTop = `calc(${pos.top} + ${(Math.random() - 0.5) * 20}px)`;
        const jitterLeft = `calc(${pos.left} + ${(Math.random() - 0.5) * 20}px)`;

        const isLost = member.status === 'lost';
        const isSeparated = member.status === 'separated';

        return (
          <div 
            key={member.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000" 
            style={{ top: jitterTop, left: jitterLeft }}
          >
            {/* Avatar Pulse for Lost/Separated */}
            {(isLost || isSeparated) && (
              <div className={`absolute -inset-4 rounded-full animate-ping ${isLost ? 'bg-red-500/50' : 'bg-yellow-500/50'}`}></div>
            )}
            
            <div className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs ${isLost ? 'bg-error animate-pulse' : member.avatarColor}`}>
              {isLost ? <ShieldAlert size={20} /> : member.name.charAt(0)}
            </div>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold bg-surface/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              {member.name}
            </span>
          </div>
        );
      })}

      {/* Regroup Path (if separated) */}
      {groupMembers.some(m => m.status === 'separated') && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Mock line between entrance and concourse_b as a safe route */}
          <line
            x1={nodePositions['entrance'].left}
            y1={nodePositions['entrance'].top}
            x2={nodePositions['concourse_b'].left}
            y2={nodePositions['concourse_b'].top}
            stroke="#0b57d0"
            strokeWidth="3"
            strokeDasharray="6,6"
            className="animate-[dash_1s_linear_infinite] opacity-50"
          />
        </svg>
      )}

      {/* Regroup Target Pin */}
      {groupMembers.some(m => m.status === 'separated') && (
        <div className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" style={{ top: nodePositions['entrance'].top, left: nodePositions['entrance'].left }}>
          <div className="bg-primary text-white p-1 rounded-full shadow-lg border-2 border-white">
            <MapPin size={16} fill="currentColor" />
          </div>
          <span className="absolute top-8 left-1/2 transform -translate-x-1/2 text-[10px] font-black text-primary bg-primary-container px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            Regroup Here
          </span>
        </div>
      )}
    </div>
  );
}
