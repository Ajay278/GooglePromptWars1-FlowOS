import { useState, useEffect } from 'react';
import { X, Navigation2, Car, Train, Gift, Bus, Clock } from 'lucide-react';
import { getTransitWaitTimes } from '../../services/transitService';

interface TransitData {
  id: string;
  type: 'bus' | 'train' | 'metro';
  line: string;
  waitTime: number;
  status: 'on-time' | 'delayed' | 'crowded';
  lastUpdated: number;
}

interface Props {
  onClose: () => void;
}

export default function SmartExitModal({ onClose }: Props) {
  const [transitData, setTransitData] = useState<TransitData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransit = async () => {
      try {
        const data = await getTransitWaitTimes();
        // Typescript cast to local interface
        setTransitData(data as TransitData[]);
      } catch (err) {
        console.error('Failed to load transit data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTransit();
  }, []);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] w-full rounded-t-[2.5rem] p-8 pb-14 shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom-full duration-500">
        <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Smart Exit</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live Data</span>
              </div>
              <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Optimizing Departure</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Option 1: Leave Now */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 shadow-inner">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5 flex items-center gap-2">
              <Clock size={12} />
              Immediate Departure
            </h3>
            
            <div className="space-y-4">
              {/* Rideshare (Always show surge for stadium context) */}
              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-2xl group hover:bg-red-500/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-3 rounded-xl shadow-lg shadow-red-500/10">
                    <Car className="text-red-400" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Rideshare</p>
                    <p className="text-xs text-red-400 font-semibold tracking-wide">Surge Pricing 🔥</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">45+ min</p>
                  <p className="text-[10px] text-white/40 font-medium">Wait Time</p>
                </div>
              </div>

              {/* Transit Options from Service */}
              {loading ? (
                <div className="h-20 flex items-center justify-center bg-white/5 rounded-2xl animate-pulse">
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Loading Transit...</p>
                </div>
              ) : (
                transitData.map((transit) => (
                  <div key={transit.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">
                        {transit.type === 'bus' ? <Bus className="text-primary-300" size={24} /> : <Train className="text-primary-300" size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{transit.line}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${
                          transit.status === 'delayed' ? 'text-red-400' : 
                          transit.status === 'crowded' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {transit.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white">{transit.waitTime} min</p>
                      <p className="text-[10px] text-white/40 font-medium">ETA</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 bg-white/5 text-white/80 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-white/10 border border-white/5 transition-all active:scale-[0.98]">
              <Navigation2 size={16} />
              Navigation Path Active
            </button>
          </div>

          {/* Option 2: Wait it Out (Gamified) */}
          <div className="bg-gradient-to-br from-primary/30 to-purple-500/20 border border-primary/40 rounded-[2rem] p-7 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <Gift size={180} />
            </div>
            
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-200 mb-3">VIP Strategy</h3>
            <h4 className="text-xl font-black text-white mb-2 leading-tight">Relax & Save.<br/>Beat the Rush.</h4>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Traffic clears in <span className="text-primary-300 font-bold">25 mins</span>. Stay comfortable and enjoy a <span className="text-primary-300 font-bold">50% discount</span> on post-game snacks!
            </p>
            
            <button className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95 hover:brightness-110 transition-all">
              <Gift size={20} />
              Claim My Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
