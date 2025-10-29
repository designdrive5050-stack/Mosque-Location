
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Coordinates } from '../types';

interface MosqueLocatorViewProps {
  coords: Coordinates;
}

interface Mosque {
  title: string;
  uri: string;
}

export const MosqueLocatorView: React.FC<MosqueLocatorViewProps> = ({ coords }) => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMosques = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMosques([]);

    if (!process.env.API_KEY) {
      setError("API key is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Find mosques near me",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              }
            }
          }
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks && groundingChunks.length > 0) {
        const foundMosques = groundingChunks
          .filter(chunk => chunk.maps?.title && chunk.maps?.uri)
          .map(chunk => ({
            title: chunk.maps!.title!,
            uri: chunk.maps!.uri!,
          }));
        
        if(foundMosques.length > 0) {
          setMosques(foundMosques);
        } else {
           setError("Could not find any mosques nearby from the search results.");
        }
      } else {
        setError("No mosques found nearby. Try again later.");
      }
    } catch (err) {
      console.error("Error finding mosques:", err);
      if(err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError("An unknown error occurred while searching for mosques.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [coords]);

  return (
    <div className="p-4 max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Nearby Mosques</h2>
      <button
        onClick={findMosques}
        disabled={isLoading}
        className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 w-full md:w-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </div>
        ) : 'Find Mosques'}
      </button>

      {error && <p className="text-red-300 mt-4">{error}</p>}

      <div className="mt-6 text-left">
        {mosques.length > 0 && (
          <ul className="space-y-3">
            {mosques.map((mosque, index) => (
              <li key={index} className="bg-black bg-opacity-20 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-800 flex justify-between items-center">
                <span className="font-semibold text-gray-200">{mosque.title}</span>
                <a
                  href={mosque.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 text-teal-300 font-semibold py-1 px-3 rounded-md text-sm transition duration-300"
                >
                  Directions
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
       {mosques.length === 0 && !isLoading && !error && (
         <p className="text-gray-400 mt-6">Click the button to search for mosques in your area.</p>
       )}
    </div>
  );
};
