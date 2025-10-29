
import React, { useState, useEffect } from 'react';
import type { Coordinates, PrayerTimeData } from '../types';

interface PrayerTimesViewProps {
  coords: Coordinates;
}

const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ coords }) => {
  const [prayerData, setPrayerData] = useState<PrayerTimeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const date = new Date();
        const response = await fetch(`https://api.aladhan.com/v1/timings/${date.getTime()/1000}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2`);
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times.');
        }
        const data = await response.json();
        setPrayerData(data.data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      }
    };
    fetchPrayerTimes();
  }, [coords]);

  useEffect(() => {
    if (!prayerData) return;

    const interval = setInterval(() => {
      const now = new Date();
      let nextPrayerFound = null;

      const prayerTimesToday = prayerNames.map(name => {
        const timeStr = prayerData.timings[name as keyof typeof prayerData.timings];
        const [hours, minutes] = timeStr.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        return { name, time: prayerDate };
      });

      for (const prayer of prayerTimesToday) {
        if (prayer.time > now) {
          nextPrayerFound = prayer;
          break;
        }
      }

      // If all prayers for today are done, the next prayer is Fajr of the next day
      if (!nextPrayerFound) {
        const fajrTimeStr = prayerData.timings.Fajr;
        const [hours, minutes] = fajrTimeStr.split(':').map(Number);
        const tomorrowFajr = new Date();
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        tomorrowFajr.setHours(hours, minutes, 0, 0);
        nextPrayerFound = { name: 'Fajr', time: tomorrowFajr };
      }
      
      const diff = nextPrayerFound.time.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setNextPrayer({
        name: nextPrayerFound.name,
        time: nextPrayerFound.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  if (error) return <div className="text-center p-4 text-red-300">{error}</div>;
  if (!prayerData) return <div className="text-center p-4 text-gray-300">Loading prayer times...</div>;
  
  const hijriDate = prayerData.date.hijri;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6 text-center shadow-lg border border-gray-800">
        {nextPrayer ? (
          <>
            <h2 className="text-2xl font-bold text-teal-300">{nextPrayer.name}</h2>
            <p className="text-4xl font-mono my-2">{nextPrayer.time}</p>
            <p className="text-lg text-gray-400">Time until next prayer:</p>
            <p className="text-2xl font-mono text-teal-400">{nextPrayer.countdown}</p>
          </>
        ) : (
          <p>Calculating next prayer...</p>
        )}
      </div>

      <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
        <div className="text-center mb-4 pb-2 border-b border-gray-700">
          <p className="font-bold text-lg">{hijriDate.month.en} {hijriDate.day}, {hijriDate.year} AH</p>
          <p className="text-sm text-gray-400">{prayerData.date.readable}</p>
        </div>
        <ul className="space-y-2">
          {prayerNames.map((name) => (
            <li key={name} className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${nextPrayer?.name === name ? 'bg-teal-500 bg-opacity-20' : ''}`}>
              <span className={`font-semibold ${nextPrayer?.name === name ? 'text-teal-300' : 'text-gray-300'}`}>{name}</span>
              <span className={`font-mono text-lg ${nextPrayer?.name === name ? 'text-white' : 'text-gray-400'}`}>{prayerData.timings[name as keyof typeof prayerData.timings]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
