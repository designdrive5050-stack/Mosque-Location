
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { QuranIcon } from './icons/QuranIcon';

interface Verse {
    text: string;
    translation: string;
    reference: string;
}

export const DailyVerseView: React.FC = () => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!process.env.API_KEY) {
      setError("API key is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide a random inspiring short verse (ayah) from the Quran. Format the response as a JSON object with three keys: "text" (the Arabic verse), "translation" (the English translation), and "reference" (the Surah name and verse number, e.g., "Surah Al-Baqarah, 2:255"). Do not include markdown formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
      });
      
      const text = response.text.trim();
      const parsedVerse = JSON.parse(text);
      
      if(parsedVerse.text && parsedVerse.translation && parsedVerse.reference) {
          setVerse(parsedVerse);
      } else {
        throw new Error("Received an invalid verse format from the API.");
      }

    } catch (err) {
       console.error("Error fetching verse:", err);
       if(err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError("An unknown error occurred while fetching a verse.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto text-center flex flex-col justify-center h-full">
        <div className="bg-black bg-opacity-20 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800 min-h-[20rem] flex flex-col justify-center items-center">
        {isLoading ? (
            <div className="flex items-center text-gray-300">
                <svg className="animate-spin h-6 w-6 text-teal-400 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching a verse...
            </div>
        ) : error ? (
            <p className="text-red-300">{error}</p>
        ) : verse ? (
            <div>
                <p className="text-2xl text-right font-serif leading-loose mb-4">{verse.text}</p>
                <p className="text-lg text-gray-300 italic mb-4">"{verse.translation}"</p>
                <p className="text-md text-teal-400 font-semibold">{verse.reference}</p>
            </div>
        ) : (
            <div className="text-center text-gray-400">
                 <QuranIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p>Click the button to get a daily dose of inspiration from the Holy Quran.</p>
            </div>
        )}
        </div>
      <button
        onClick={fetchVerse}
        disabled={isLoading}
        className="mt-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 self-center"
      >
        {verse ? 'Get Another Verse' : 'Get Daily Verse'}
      </button>
    </div>
  );
};
