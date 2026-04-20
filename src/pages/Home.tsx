import { Map, ShieldAlert, Users, Utensils, CloudSun, CloudRain, Sun, Navigation2, Activity, MapPin } from 'lucide-react';
import { cn } from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { triggerHaptic } from '../utils/a11y';
import NotificationsPanel from '../components/NotificationsPanel';
import { useState } from 'react';
import SmartExitModal from '../components/transit/SmartExitModal';
import FeedbackModal from '../components/feedback/FeedbackModal';
import { MessageSquarePlus } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent } from '../lib/firebase';

import { getStadiumInsight } from '../lib/gemini';

export default function Home() {
  const navigate = useNavigate();
  const { weather, reducedMotion, congestion, eventStatus } = useAppStore();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState("Stadium intelligence initializing...");

  useEffect(() => {
    trackEvent('home_view', { status: eventStatus });
    
    // Generate Smart AI Insight
    const loadInsight = async () => {
      const avgCongestion = (Object.values(congestion).reduce((a, b) => a + b, 0) / Object.keys(congestion).length).toFixed(1);
      const insight = await getStadiumInsight(weather, eventStatus, `${avgCongestion}x`);
      setAiInsight(insight);
    };
    loadInsight();
  }, [eventStatus, weather, congestion]);

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
    <div className="flex flex-col h-full p-4 gap-5 overflow-y-auto pb-5 no-scrollbar">
      {/* App Bar */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">FlowOS</h1>
          <p className="text-sm text-white/70">Gate A • Section 112</p>
        </div>
        <NotificationsPanel />
      </header>

      {/* AI Smart Insight Engine (Google Gemini Powered) */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          <div className="bg-white/10 p-3 rounded-2xl shrink-0 border border-white/10">
            <Activity className="text-indigo-300 animate-pulse" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-300">AI Stadium Insight</span>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" />
            </div>
            <p className="text-sm font-semibold text-white/95 leading-snug italic">
              "{aiInsight}"
            </p>
          </div>
        </div>
      </section>

      {/* Smart Suggestions Banner (Weather) */}
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

      {/* Dynamic Lifecycle Card (Arrival vs Exit) */}
      {eventStatus === 'post-game' ? (
        <button
          onClick={() => { triggerHaptic('light'); setIsExitModalOpen(true); }}
          aria-label="Open Smart Exit Planner"
          className={`w-full text-left bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-4 shadow-md flex items-center gap-4 transition-transform ${reducedMotion ? '' : 'active:scale-[0.98]'}`}
        >
          <div className="bg-white/20 p-3 rounded-2xl shrink-0">
            <MapPin size={28} className="text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">Plan Your Exit</p>
            <p className="text-white/80 text-xs font-medium mt-0.5">Live Transit · Uber Surge · Rewards</p>
          </div>
          <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0 animate-pulse">
            View →
          </div>
        </button>
      ) : (
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
      )}

      {/* Global Heatmap Overview */}
      <section className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Activity className="text-blue-300" size={20} />
            Live Congestion Map
          </h2>
          <span className="text-xs font-medium bg-green-400/30 text-green-200 border border-green-400/40 px-2 py-1 rounded-full">Live</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(congestion).map(([nodeId, level]) => {
            let color = 'bg-green-500';
            if (level > 1.5) color = 'bg-yellow-500';
            if (level > 2.5) color = 'bg-red-500';

            return (
              <div key={nodeId} className="flex items-center justify-between bg-white/10 border border-white/10 p-2 rounded-xl">
                <span className="text-[10px] font-bold capitalize text-white/90 truncate pr-1">{nodeId.replace('_', ' ')}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-black text-white/60">{level.toFixed(1)}x</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weather Widget */}
      <section className="bg-white/15 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/20 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/70">Stadium Weather</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl font-bold text-white">{currentW.temp}</h2>
            <p className="text-sm font-medium text-white/80 pb-1">{currentW.label}</p>
          </div>
        </div>
        <currentW.icon size={48} className="text-white/80" strokeWidth={1.5} />
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-lg font-semibold mb-4 px-1 text-white drop-shadow">Quick Actions</h2>
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

      {/* Floating Feedback Button */}
      <button
        onClick={() => { triggerHaptic('light'); setIsFeedbackOpen(true); }}
        className="absolute bottom-6 right-4 z-50 bg-white/10 backdrop-blur-xl border border-white/20 p-3.5 rounded-full shadow-xl hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Provide Feedback"
      >
        <MessageSquarePlus size={24} className="text-white drop-shadow-md group-hover:text-primary-300 transition-colors" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-white font-bold text-sm">
          <span className="pl-2 pr-1">Feedback</span>
        </span>
      </button>

      {/* Modals */}
      {isExitModalOpen && (
        <SmartExitModal onClose={() => setIsExitModalOpen(false)} />
      )}
      {isFeedbackOpen && (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      )}
    </div>
  );
}
