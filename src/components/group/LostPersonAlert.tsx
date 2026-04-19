import { ShieldAlert, Camera, X } from 'lucide-react';
import { useAppStore } from '../../store';

interface Props {
  onDismiss: () => void;
}

export default function LostPersonAlert({ onDismiss }: Props) {
  const { groupMembers } = useAppStore();
  const lostMember = groupMembers.find(m => m.status === 'lost');

  if (!lostMember) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-50 animate-in slide-in-from-top fade-in duration-300">
      <div className="bg-error-container border-2 border-error text-on-error-container rounded-3xl p-4 shadow-2xl relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-error/10 animate-pulse pointer-events-none"></div>
        
        <button onClick={onDismiss} className="absolute top-3 right-3 p-1.5 bg-error/10 rounded-full hover:bg-error/20 text-error transition-colors z-10">
          <X size={16} />
        </button>

        <div className="flex gap-4 relative z-10">
          <div className="bg-error text-white p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-sm animate-bounce">
            <ShieldAlert size={32} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-black text-lg text-error uppercase tracking-wider mb-1">Lost Person Alert</h3>
            <p className="font-bold text-sm mb-2">{lostMember.name} has been reported missing.</p>
            
            <div className="bg-white/60 p-3 rounded-xl border border-error/20">
              <div className="flex items-start gap-2 mb-2">
                <Camera size={16} className="text-error mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-error">Security Camera Match</p>
                  <p className="text-sm font-medium">Last seen near <strong>{lostMember.locationId.replace('_', ' ')}</strong></p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Security personnel have been dispatched to this location. Please proceed to the highlighted Regroup Target.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
