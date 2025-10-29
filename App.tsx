
import React, { useState, useEffect } from 'react';
import { PrayerTimesView } from './components/PrayerTimesView';
import { QiblaFinderView } from './components/QiblaFinderView';
import { MosqueLocatorView } from './components/MosqueLocatorView';
import { TasbihCounterView } from './components/TasbihCounterView';
import { DailyVerseView } from './components/DailyVerseView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import type { Coordinates } from './types';

type View = 'prayer' | 'qibla' | 'mosques' | 'tasbih' | 'verse';

const App: React.FC = () => {
  const [view, setView] = useState<View>('prayer');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Loading...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
        fetchCityName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationError(error.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village;
      const country = data.address.country;
      if (city && country) {
        setCity(`${city}, ${country}`);
      } else {
        setCity('Unknown Location');
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      setCity("Could not fetch location");
    }
  };


  const renderView = () => {
    if (locationError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-300 p-4">
          <p className="font-bold">Location Error</p>
          <p>{locationError}</p>
          <p className="mt-4 text-sm text-gray-400">Please enable location services in your browser and refresh the page to use this app.</p>
        </div>
      );
    }

    if (!coords) {
      return (
        <div className="flex items-center justify-center h-full text-gray-300">
          <svg className="animate-spin h-8 w-8 text-teal-400 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Fetching your location...
        </div>
      );
    }

    switch (view) {
      case 'prayer':
        return <PrayerTimesView coords={coords} />;
      case 'qibla':
        return <QiblaFinderView userLocation={coords} />;
      case 'mosques':
        return <MosqueLocatorView coords={coords} />;
      case 'tasbih':
        return <TasbihCounterView />;
      case 'verse':
        return <DailyVerseView />;
      default:
        return <PrayerTimesView coords={coords} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1a26] text-white font-sans flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
      <div className="relative z-10 flex flex-col h-screen">
        <Header city={city} />
        <main className="flex-grow overflow-y-auto pb-20">
            {renderView()}
        </main>
        <BottomNav activeView={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;
