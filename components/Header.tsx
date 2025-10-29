
import React, { useState, useEffect } from 'react';
import { LocationIcon } from './icons/LocationIcon';

interface HeaderProps {
  city: string;
}

export const Header: React.FC<HeaderProps> = ({ city }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="p-4 bg-black bg-opacity-20 backdrop-blur-md sticky top-0 z-20 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-teal-300 tracking-wider">Guidance</h1>
        <div className="flex items-center text-sm text-gray-300 mt-1">
          <LocationIcon className="h-4 w-4 mr-2" />
          <span>{city}</span>
        </div>
        <p className="text-sm text-gray-400">{currentDate}</p>
      </div>
    </header>
  );
};
