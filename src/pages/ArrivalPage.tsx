import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrivalMap from '../components/arrival/ArrivalMap';
import TransitOptions from '../components/arrival/TransitOptions';
import ParkingInfo from '../components/arrival/ParkingInfo';
import DigitalTicket from '../components/arrival/DigitalTicket';
import { ArrowLeft, MapPin, Bus, ParkingSquare, Ticket, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../components/BottomNav';

type Tab = 'plan' | 'transit' | 'parking' | 'ticket';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'plan',    label: 'Plan',    icon: MapPin },
  { id: 'transit', label: 'Transit', icon: Bus },
  { id: 'parking', label: 'Parking', icon: ParkingSquare },
  { id: 'ticket',  label: 'Ticket',  icon: Ticket },
];

export default function ArrivalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [gateWait, setGateWait] = useState(12);
  const [eta, setEta] = useState(22);

  // Simulate live wait-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGateWait(w => Math.max(2, w + (Math.random() > 0.5 ? 1 : -1)));
      setEta(e => Math.max(5, e - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-surface min-h-full pb-28">

      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-surface-variant transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-on-surface" />
        </button>
        <div>
          <h1 className="text-xl font-black text-on-surface">Arrival Planner</h1>
          <p className="text-xs text-on-surface-variant">FlowOS Stadium · Event Day</p>
        </div>
      </header>

      {/* Live Status Bar */}
      <div className="mx-4 mb-4 bg-primary-container rounded-2xl px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-on-primary-container">
          <Clock size={16} />
          <span className="text-sm font-bold">ETA: {eta} min</span>
        </div>
        <div className={`text-xs font-black px-3 py-1 rounded-full ${gateWait < 8 ? 'bg-green-500 text-white' : gateWait < 15 ? 'bg-yellow-500 text-black' : 'bg-error text-white'}`}>
          Gate Wait: {gateWait} min
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex px-4 gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all',
              activeTab === tab.id
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-surface text-on-surface-variant border-outline-variant/50 hover:bg-surface-variant'
            )}
          >
            <tab.icon size={14} aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 flex flex-col gap-4">

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
          <>
            <ArrivalMap />

            {/* Step-by-step guide */}
            <div className="bg-surface-variant rounded-3xl p-4 border border-outline-variant/30">
              <h2 className="font-bold text-sm uppercase tracking-wider text-on-surface-variant mb-3">Your Arrival Steps</h2>
              {[
                { step: 1, title: 'Leave by 5:45 PM', sub: 'Traffic heavy on Main Ave · Take bypass route', color: 'bg-primary text-white' },
                { step: 2, title: 'Board Metro Blue Line', sub: 'Departs Central Station at 5:52 PM', color: 'bg-secondary text-white' },
                { step: 3, title: 'Walk to Gate A', sub: '4 min walk · Parking Zone P2 is closest', color: 'bg-tertiary text-white' },
                { step: 4, title: 'Scan Ticket at Gate A', sub: 'Entry slot: 6:15–6:30 PM · Estimated wait: 3 min', color: 'bg-green-600 text-white' },
              ].map(({ step, title, sub, color }) => (
                <div key={step} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-black text-sm ${color}`}>
                    {step}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface">{title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-on-surface-variant mt-1 shrink-0" />
                </div>
              ))}
            </div>

            {/* Quick jump buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Transit', tab: 'transit' as Tab, icon: Bus, color: 'bg-primary-container text-on-primary-container' },
                { label: 'Parking', tab: 'parking' as Tab, icon: ParkingSquare, color: 'bg-secondary-container text-on-secondary-container' },
                { label: 'Ticket',  tab: 'ticket'  as Tab, icon: Ticket,         color: 'bg-tertiary-container text-on-tertiary-container' },
              ].map(({ label, tab, icon: Icon, color }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${color} rounded-2xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* TRANSIT TAB */}
        {activeTab === 'transit' && (
          <TransitOptions />
        )}

        {/* PARKING TAB */}
        {activeTab === 'parking' && (
          <ParkingInfo />
        )}

        {/* TICKET TAB */}
        {activeTab === 'ticket' && (
          <DigitalTicket />
        )}
      </div>
    </div>
  );
}
