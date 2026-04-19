import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import GroupMap from '../components/group/GroupMap';
import MemberList from '../components/group/MemberList';
import LostPersonAlert from '../components/group/LostPersonAlert';
import EvacuationMap from '../components/safety/EvacuationMap';
import PushAlert from '../components/safety/PushAlert';
import LostFoundPanel, { LostFoundItem } from '../components/safety/LostFoundPanel';
import { ShieldAlert, X } from 'lucide-react';

export default function Safety() {
  const { groupMembers, updateMemberStatus, setPrivacyMode, isEmergencyMode, setEmergencyMode, emergencyType } = useAppStore();
  const [showAlert, setShowAlert] = useState(true);
  const [showPushAlert, setShowPushAlert] = useState(false);
  const [lostFoundAnnouncement, setLostFoundAnnouncement] = useState<LostFoundItem | null>(null);

  // Background simulation for dynamic separation and lost person
  useEffect(() => {
    if (isEmergencyMode || emergencyType === 'evacuate') return;

    const sepTimer = setTimeout(() => {
      updateMemberStatus('u2', 'separated', 'concourse_b');
      setPrivacyMode(false);
    }, 5000);

    const lostTimer = setTimeout(() => {
      updateMemberStatus('u3', 'lost', 'exit_north');
      setShowAlert(true);
    }, 12000);

    return () => {
      clearTimeout(sepTimer);
      clearTimeout(lostTimer);
      updateMemberStatus('u2', 'nearby', 'concourse_a');
      updateMemberStatus('u3', 'nearby', 'concourse_b');
    };
  }, [updateMemberStatus, setPrivacyMode, isEmergencyMode, emergencyType]);

  // Push alert on evacuation
  useEffect(() => {
    if (emergencyType === 'evacuate') setShowPushAlert(true);
    else setShowPushAlert(false);
  }, [emergencyType]);

  const handleLostFoundAnnouncement = (item: LostFoundItem) => {
    setLostFoundAnnouncement(item);
  };

  const hasLostMember = groupMembers.some(m => m.status === 'lost');
  const isEvacuating = emergencyType === 'evacuate';

  return (
    <div className="relative h-[100dvh] w-full bg-[#121212]">

      {/* Map Layer — fills top 48% */}
      <div className="absolute inset-0 bottom-[52%] z-10">
        {isEvacuating ? <EvacuationMap /> : <GroupMap />}
      </div>

      {/* Bottom Panel — always visible scrollable sheet */}
      {!isEvacuating && !isEmergencyMode && (
        <div className="absolute bottom-0 left-0 w-full h-[52%] flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20 space-y-3 no-scrollbar">
            <MemberList />
            <LostFoundPanel onAnnounce={handleLostFoundAnnouncement} />
          </div>
        </div>
      )}

      {/* Group / Person Alerts */}
      {hasLostMember && showAlert && !isEmergencyMode && !isEvacuating && (
        <LostPersonAlert onDismiss={() => setShowAlert(false)} />
      )}

      {/* Emergency evacuation push notification */}
      {showPushAlert && (
        <PushAlert
          message="EMERGENCY: EVACUATE IMMEDIATELY"
          subtext="Follow the highlighted safe route to the nearest exit. Avoid Concourse A."
          type="error"
        />
      )}

      {/* Lost & Found announcement banner */}
      {lostFoundAnnouncement && (
        <PushAlert
          message={`📦 Found: ${lostFoundAnnouncement.description}`}
          subtext={`Submitted at ${lostFoundAnnouncement.location}. Contact the desk to claim.`}
          type="warning"
          onDismiss={() => setLostFoundAnnouncement(null)}
        />
      )}

      {/* SOS Button */}
      {!isEmergencyMode && !isEvacuating && (
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => setEmergencyMode(true)}
            className="bg-error text-white p-3 rounded-full shadow-lg border-2 border-white/20 active:scale-95 transition-transform animate-pulse"
            aria-label="Open Emergency Menu"
          >
            <ShieldAlert size={24} />
          </button>
        </div>
      )}

      {/* Exit Evacuation */}
      {isEvacuating && (
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => useAppStore.getState().setEmergencyType(null)}
            className="bg-surface text-on-surface p-2 rounded-full shadow-lg border-2 border-outline-variant/30 active:scale-95 transition-transform"
            aria-label="Exit Evacuation Mode"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Top Header */}
      {!isEmergencyMode && (
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent z-30 pointer-events-none">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            {isEvacuating ? 'Evacuation Mode' : 'Party Tracker'}
          </h1>
        </div>
      )}
    </div>
  );
}
