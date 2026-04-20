import { NavLink } from 'react-router-dom';
import { Home, Map, Compass, ShieldAlert, Settings2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { triggerHaptic } from '../utils/a11y';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Navigate', path: '/navigate', icon: Map },
    { name: 'Services', path: '/services', icon: Compass },
    { name: 'Safety', path: '/safety', icon: ShieldAlert },
    { name: 'Twin', path: '/admin', icon: Settings2 },
  ];

  return (
    <nav role="navigation" aria-label="Primary navigation" className="absolute bottom-0 w-full h-20 bg-white/20 backdrop-blur-xl border-t border-white/20 px-2 pb-2 pt-2 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          aria-label={`Navigate to ${item.name}`}
          onClick={() => triggerHaptic('light')}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all',
              isActive
                ? 'bg-white/30 text-white font-bold'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )
          }
        >
          <item.icon size={24} aria-hidden="true" />
          <span className="text-[10px] mt-1">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
