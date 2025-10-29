
import React from 'react';
import { PrayerTimeIcon } from './icons/PrayerTimeIcon';
import { QiblaIcon } from './icons/QiblaIcon';
import { MosqueIcon } from './icons/MosqueIcon';
import { TasbihIcon } from './icons/TasbihIcon';
import { QuranIcon } from './icons/QuranIcon';

type View = 'prayer' | 'qibla' | 'mosques' | 'tasbih' | 'verse';

interface BottomNavProps {
  activeView: View;
  setView: (view: View) => void;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${isActive ? 'text-teal-300 scale-110' : 'text-gray-400 hover:text-teal-400'}`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView }) => {
  const iconClasses = "h-6 w-6";
  const navItems = [
    { id: 'prayer', label: 'Prayers', icon: <PrayerTimeIcon className={iconClasses} /> },
    { id: 'qibla', label: 'Qibla', icon: <QiblaIcon className={iconClasses} /> },
    { id: 'mosques', label: 'Mosques', icon: <MosqueIcon className={iconClasses} /> },
    { id: 'tasbih', label: 'Tasbih', icon: <TasbihIcon className={iconClasses} /> },
    { id: 'verse', label: 'Verse', icon: <QuranIcon className={iconClasses} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-lg border-t border-gray-700 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex justify-around p-2">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.id}
            onClick={() => setView(item.id as View)}
          />
        ))}
      </div>
    </nav>
  );
};
