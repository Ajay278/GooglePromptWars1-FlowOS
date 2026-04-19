import { useState } from 'react';
import { Bell, X, Package, CloudRain, Users, Clock } from 'lucide-react';
import { useAppStore } from '../store';

interface Notification {
  id: string;
  type: 'lostfound' | 'crowd' | 'weather' | 'group';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

function buildNotifications(
  weather: string,
  lostFoundItems: { id: string; description: string; location: string; time: string }[],
  readIds: string[]
): Notification[] {
  const base: Notification[] = [];

  // Lost & Found notifications
  lostFoundItems.forEach(item => {
    const id = `lf-${item.id}`;
    base.push({
      id,
      type: 'lostfound',
      title: `Found Item: ${item.description}`,
      body: `Submitted at ${item.location}. Contact the desk to claim.`,
      time: item.time,
      read: readIds.includes(id),
    });
  });

  // Weather alert
  const weatherId = `wx-${weather}`;
  if (weather === 'rain') {
    base.push({
      id: weatherId,
      type: 'weather',
      title: 'Inclement Weather Alert',
      body: 'Routes updated to covered concourses. Carry an umbrella.',
      time: 'Now',
      read: readIds.includes(weatherId),
    });
  } else if (weather === 'heat') {
    base.push({
      id: weatherId,
      type: 'weather',
      title: 'Extreme Heat Warning',
      body: 'Hydration stations marked on your map. Stay cool.',
      time: 'Now',
      read: readIds.includes(weatherId),
    });
  }

  // Static seeded notifications
  const staticAlerts: Notification[] = [
    {
      id: 'crowd-1',
      type: 'crowd',
      title: 'High Crowd at Concourse A',
      body: 'Consider using Concourse B for a faster route to your seat.',
      time: '6:12 PM',
      read: readIds.includes('crowd-1'),
    },
    {
      id: 'group-1',
      type: 'group',
      title: 'Party Member Separated',
      body: 'Sarah is now at Gate B. Tap to view regroup suggestion.',
      time: '6:05 PM',
      read: readIds.includes('group-1'),
    }
  ];
  
  staticAlerts.forEach(a => base.push(a));

  return base;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  lostfound: { icon: Package,       color: 'text-amber-600',   bg: 'bg-amber-100' },
  crowd:     { icon: Users,         color: 'text-orange-600',  bg: 'bg-orange-100' },
  weather:   { icon: CloudRain,     color: 'text-blue-600',    bg: 'bg-blue-100' },
  group:     { icon: Users,         color: 'text-purple-600',  bg: 'bg-purple-100' },
};

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const { weather, lostFoundItems, readNotificationIds, markNotificationRead } = useAppStore();
  
  const notifications = buildNotifications(weather, lostFoundItems, readNotificationIds);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = () => {
    setOpen(true);
    // Mark all currently visible notifications as read
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        aria-label={`Notifications${unreadCount > 0 ? ` – ${unreadCount} unread` : ''}`}
        className="relative p-2 rounded-full bg-surface-variant text-on-surface-variant hover:bg-outline-variant/40 transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface animate-bounce shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-in Panel */}
      {open && (
        <div
          className="absolute inset-0 z-[110] flex flex-col bg-surface animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-label="Notifications"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-xl font-black text-on-surface">Notifications</h2>
              <p className="text-xs text-on-surface-variant">{notifications.length} alerts today</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-surface-variant transition-colors"
              aria-label="Close notifications"
            >
              <X size={22} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar pb-24">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant">
                <Bell size={40} className="opacity-20" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              [...notifications].reverse().map(n => {
                const cfg = typeConfig[n.type] || typeConfig.crowd;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 bg-surface-variant rounded-2xl p-4 border transition-all ${n.read ? 'border-outline-variant/20 opacity-70' : 'border-primary/40 shadow-md bg-primary-container/10'}`}
                  >
                    <div className={`${cfg.bg} p-2 rounded-xl shrink-0 self-start`}>
                      <Icon size={18} className={cfg.color} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-on-surface leading-tight">{n.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">{n.body}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1">
                        <Clock size={10} aria-hidden="true" /> {n.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
