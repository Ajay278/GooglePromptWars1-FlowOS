import { useState } from 'react';
import { Package, MapPin, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useAppStore } from '../../store';

export interface LostFoundItem {
  id: string;
  description: string;
  location: string;
  time: string;
}

const SUBMISSION_POINTS = [
  'Gate A – Lost & Found Desk',
  'Gate B – Security Post',
  'Main Concourse Info Booth',
  'North Exit Help Desk',
];

const ITEM_PRESETS = [
  '🔑 Keys', '👜 Bag / Wallet', '📱 Phone', '👓 Glasses',
  '🎒 Backpack', '🧢 Hat / Cap', '💳 ID / Card', 'Other',
];

interface Props {
  onAnnounce: (item: LostFoundItem) => void;
}

export default function LostFoundPanel({ onAnnounce }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(SUBMISSION_POINTS[0]);
  const [submitted, setSubmitted] = useState(false);
  const { lostFoundItems } = useAppStore();

  const handleSubmit = () => {
    if (!selectedItem) return;
    const item: LostFoundItem = {
      id: Date.now().toString(),
      description: selectedItem,
      location: selectedLocation,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAnnounce(item);
    useAppStore.getState().addLostFoundItem(item);
    setSubmitted(true);
    setSelectedItem('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={isExpanded}
        aria-controls="lost-found-panel"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-700 p-2 rounded-xl">
            <Package size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface">Lost & Found</p>
            <p className="text-xs text-on-surface-variant">
              {lostFoundItems.length > 0
                ? `${lostFoundItems.length} item${lostFoundItems.length > 1 ? 's' : ''} reported today`
                : 'Report a found item'}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-on-surface-variant" /> : <ChevronDown size={18} className="text-on-surface-variant" />}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div id="lost-found-panel" className="px-4 pb-4 space-y-4">

          {/* Submit Form */}
          <div className="bg-surface-variant rounded-2xl p-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">I found something</p>

            {/* Item type chips */}
            <div className="flex flex-wrap gap-2">
              {ITEM_PRESETS.map(preset => (
                <button
                  key={preset}
                  onClick={() => setSelectedItem(preset)}
                  aria-pressed={selectedItem === preset}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    selectedItem === preset
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-surface text-on-surface-variant border-outline-variant/40 hover:bg-amber-50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Drop-off location */}
            <div>
              <label htmlFor="dropoff-select" className="text-xs font-bold text-on-surface-variant mb-1 block">
                Dropping off at
              </label>
              <select
                id="dropoff-select"
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-sm font-medium text-on-surface outline-none focus:ring-2 focus:ring-primary/50"
              >
                {SUBMISSION_POINTS.map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            {submitted ? (
              <div className="bg-green-100 text-green-800 font-bold text-sm text-center py-3 rounded-xl">
                ✅ Announcement sent! Thank you.
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!selectedItem}
                aria-label="Submit found item and broadcast announcement"
                className={`w-full font-bold py-3 rounded-xl text-sm transition-all active:scale-95 ${
                  selectedItem
                    ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                    : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
                }`}
              >
                📢 Submit & Broadcast Announcement
              </button>
            )}
          </div>

          {/* Recent submissions log */}
          {lostFoundItems.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Recent Found Items</p>
              <div className="space-y-2">
                {[...lostFoundItems].reverse().map(item => (
                  <div key={item.id} className="flex items-start gap-3 bg-surface-variant rounded-xl p-3">
                    <Package size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">{item.description}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {item.location}
                      </p>
                    </div>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1 shrink-0">
                      <Clock size={10} /> {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
