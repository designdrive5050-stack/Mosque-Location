
import React, { useState, useEffect, useCallback } from 'react';
import type { Coordinates } from '../types';
import { KAABA_COORDS } from '../constants';
import { calculateBearing } from '../utils/geo';
import { CompassIcon } from './icons/CompassIcon';

interface QiblaFinderViewProps {
  userLocation: Coordinates;
}

export const QiblaFinderView: React.FC<QiblaFinderViewProps> = ({ userLocation }) => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const direction = calculateBearing(userLocation.latitude, userLocation.longitude, KAABA_COORDS.latitude, KAABA_COORDS.longitude);
    setQiblaDirection(direction);
  }, [userLocation]);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let alpha = event.alpha;
    if (typeof (event as any).webkitCompassHeading !== 'undefined') {
      alpha = (event as any).webkitCompassHeading; // iOS
    }
    if (alpha !== null) {
      setHeading(alpha);
    }
  }, []);
  
  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
        }
      } catch (error) {
        console.error("Error requesting device orientation permission:", error);
        setPermissionGranted(false);
      }
    } else {
      // For non-iOS 13+ browsers
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    // Automatically try to set up listener for non-iOS devices.
    if (!('requestPermission' in (DeviceOrientationEvent as any))) {
        requestPermission();
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleOrientation]);

  const renderContent = () => {
    if (permissionGranted === false) {
      return <p className="text-red-300">Device orientation permission denied.</p>;
    }
    if (permissionGranted === null) {
      return (
        <button onClick={requestPermission} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Enable Compass
        </button>
      );
    }

    if (heading === null) {
      return <p className="text-gray-400">Searching for compass heading...</p>;
    }

    const rotation = 360 - heading; // Adjust for CSS rotation
    const qiblaPointerRotation = qiblaDirection - heading;

    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
        <div 
          className="w-full h-full bg-black bg-opacity-20 rounded-full transition-transform duration-200 ease-linear"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <CompassIcon />
        </div>
        <div 
          className="absolute top-0 left-0 w-full h-full flex justify-center transition-transform duration-200 ease-linear"
          style={{ transform: `rotate(${qiblaPointerRotation}deg)` }}
        >
          <div className="w-2 h-1/2 bg-teal-400 rounded-full origin-bottom" style={{ transform: 'translateY(-10px)' }}></div>
           <div className="absolute top-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-16 border-b-teal-400"></div>
        </div>
      </div>
    );
  };
  
  const qiblaAngle = Math.round(qiblaDirection);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Qibla Direction</h2>
      <p className="text-gray-400 mb-6">Point the top of your device to the Kaaba icon.</p>
      
      <div className="w-full h-80 flex items-center justify-center mb-6">
        {renderContent()}
      </div>
      
      {permissionGranted && (
        <>
            <p className="text-lg font-semibold">Qibla is at {qiblaAngle}° from North</p>
            {heading !== null && <p className="text-md text-gray-400">Your device is pointing at {Math.round(heading)}°</p>}
        </>
      )}
    </div>
  );
};
