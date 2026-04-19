import { Map, ShieldAlert, Users, Utensils, CloudSun, CloudRain, Sun, Navigation2, Activity } from 'lucide-react';
import { cn } from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { triggerHaptic } from '../utils/a11y';
import NotificationsPanel from '../components/NotificationsPanel';

export default function Home() {
  const navigate = useNavigate();
  const { weather, reducedMotion, congestion } = useAppStore();

  const quickActions = [
    { name: 'Navigate', icon: Map, color: 'bg-primary-container text-on-primary-container', path: '/navigate' },
    { name: 'SOS', icon: ShieldAlert, color: 'bg-error-container text-on-error-container', path: '/safety' },
    { name: 'Find Group', icon: Users, color: 'bg-secondary-container text-on-secondary-container', path: '/safety' },
    { name: 'Order Food', icon: Utensils, color: 'bg-tertiary-container text-on-tertiary-container', path: '/services' },
  ];
  const arrivalPath = '/arrival';

  const weatherConfig: Record<string, any> = {
    clear: { temp: '22°C', label: 'Clear', icon: CloudSun },
    rain: { temp: '18°C', label: 'Rain', icon: CloudRain },
    heat: { temp: '35°C', label: 'Heatwave', icon: Sun },
  };

  const currentW = weatherConfig[weather];

  return (
    <div className="flex flex-col h-full bg-surface p-4 gap-6 overflow-y-auto pb-24 no-scrollbar">
      {/* App Bar */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">FlowOS</h1>
          <p className="text-sm text-on-surface-variant">Gate A • Section 112</p>
        </div>
        <NotificationsPanel />
      </header>

      {/* Smart Suggestions Banner */}
      {weather !== 'clear' && (
        <div className={`rounded-2xl p-4 flex gap-3 shadow-sm ${weather === 'rain' ? 'bg-blue-100 text-blue-900' : 'bg-orange-100 text-orange-900'}`}>
          <Navigation2 size={24} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm mb-1">{weather === 'rain' ? 'Inclement Weather' : 'Extreme Heat Warning'}</h4>
            <p className="text-xs font-medium">
              {weather === 'rain' 
                ? 'Routing has been updated to prioritize covered concourses.' 
                : 'Hydration stations have been added to your map.'}
            </p>
          </div>
        </div>
      )}

      {/* Arrival Planner Entry Card */}
      <button
        onClick={() => { triggerHaptic('light'); navigate(arrivalPath); }}
        aria-label="Open Arrival Planner"
        className={`w-full text-left bg-gradient-to-r from-primary to-secondary rounded-3xl p-4 shadow-md flex items-center gap-4 transition-transform ${reducedMotion ? '' : 'active:scale-[0.98]'}`}
      >
        <div className="bg-white/20 p-3 rounded-2xl shrink-0">
          <Navigation2 size={28} className="text-white" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-base">Plan Your Arrival</p>
          <p className="text-white/80 text-xs font-medium mt-0.5">Traffic · Transit · Parking · Ticket</p>
        </div>
        <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
          Open →
        </div>
      </button>

      {/* Global Heatmap Overview */}
      <section className="bg-surface-variant rounded-3xl p-5 border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="text-primary" size={20} />
            Live Congestion Map
          </h2>
          <span className="text-xs font-medium bg-green-200 text-green-900 px-2 py-1 rounded-full">Live</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(congestion).map(([nodeId, level]) => {
            let color = 'bg-green-500';
            if (level > 1.5) color = 'bg-yellow-500';
            if (level > 2.5) color = 'bg-red-500';

            return (
              <div key={nodeId} className="flex items-center justify-between bg-surface p-2 rounded-xl">
                <span className="text-[10px] font-bold capitalize text-on-surface truncate pr-1">{nodeId.replace('_', ' ')}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-black text-on-surface-variant">{level.toFixed(1)}x</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weather Widget */}
      <section className="bg-secondary-container rounded-3xl p-5 shadow-sm border border-outline-variant/20 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-on-secondary-container opacity-80">Stadium Weather</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl font-bold text-on-secondary-container">{currentW.temp}</h2>
            <p className="text-sm font-medium text-on-secondary-container pb-1">{currentW.label}</p>
          </div>
        </div>
        <currentW.icon size={48} className="text-on-secondary-container opacity-90" strokeWidth={1.5} />
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-lg font-semibold mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4" role="group">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => {
                triggerHaptic('light');
                navigate(action.path);
              }}
              aria-label={`Quick action: ${action.name}`}
              className={cn(
                `flex flex-col items-start p-4 rounded-3xl shadow-sm transition-transform ${reducedMotion ? '' : 'active:scale-95'}`,
                action.color
              )}
            >
              <div className="bg-surface/30 p-2 rounded-2xl mb-3" aria-hidden="true">
                <action.icon size={24} strokeWidth={2} />
              </div>
              <span className="font-semibold text-sm">{action.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
