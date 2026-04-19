import { useAppStore } from '../../store';
import { User, AlertCircle, ShieldAlert, Settings } from 'lucide-react';
import { cn } from '../BottomNav';

export default function MemberList() {
  const { groupMembers, isPrivacyMode, setPrivacyMode } = useAppStore();

  return (
    <div className="bg-surface rounded-3xl shadow-xl border border-outline-variant/30 p-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-on-surface">My Party</h2>
            <p className="text-xs text-on-surface-variant">3 Members</p>
          </div>
          <button 
            onClick={() => setPrivacyMode(!isPrivacyMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
              isPrivacyMode ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"
            )}
          >
            <Settings size={14} />
            Privacy: {isPrivacyMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {groupMembers.map(member => {
            const isMe = member.name === 'You';
            const isLost = member.status === 'lost';
            const isSeparated = member.status === 'separated';
            
            return (
              <div key={member.id} className="flex items-center gap-3 p-2 bg-surface-variant rounded-2xl">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", member.avatarColor)}>
                  {isLost ? <ShieldAlert size={20} /> : member.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-on-surface">
                    {member.name} {isMe && <span className="text-on-surface-variant text-xs font-normal">(Me)</span>}
                  </h4>
                  <p className="text-xs text-on-surface-variant capitalize">
                    {isPrivacyMode && !isLost ? 'Zone: ' : 'Location: '}
                    {member.locationId.replace('_', ' ')}
                  </p>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center">
                  {isLost ? (
                    <span className="text-xs font-bold text-error flex items-center gap-1 bg-error-container px-2 py-1 rounded-md">
                      <ShieldAlert size={12} /> LOST
                    </span>
                  ) : isSeparated ? (
                    <span className="text-xs font-bold text-yellow-700 flex items-center gap-1 bg-yellow-200 px-2 py-1 rounded-md">
                      <AlertCircle size={12} /> SEPARATED
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1 bg-green-200 px-2 py-1 rounded-md">
                      <User size={12} /> NEARBY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <button className="w-full mt-4 bg-surface-variant text-on-surface font-bold py-3.5 rounded-full shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-outline-variant/50">
          <User size={18} />
          Invite to Party
        </button>
      </div>
  );
}
