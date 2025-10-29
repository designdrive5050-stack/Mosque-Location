
import React, { useState } from 'react';

export const TasbihCounterView: React.FC = () => {
  const [count, setCount] = useState(0);
  const [lap, setLap] = useState(0);
  const [target, setTarget] = useState(33);

  const handleIncrement = () => {
    if (count + 1 === target) {
      setLap(lap + 1);
      setCount(0);
    } else {
      setCount(count + 1);
    }
  };

  const handleReset = () => {
    setCount(0);
    setLap(0);
  };
  
  const progressPercentage = (count / target) * 100;

  return (
    <div className="p-4 flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tasbih Counter</h2>
      
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="stroke-current text-gray-700" strokeWidth="5" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-current text-teal-400"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage / 100)}
            transform="rotate(-90 50 50)"
            style={{transition: 'stroke-dashoffset 0.3s ease'}}
          />
        </svg>
        <div className="flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold">{count}</span>
            <span className="text-gray-400">/ {target}</span>
            <span className="mt-2 text-teal-300 text-lg">Lap: {lap}</span>
        </div>
      </div>
      
      <button
        onClick={handleIncrement}
        className="w-48 h-48 bg-teal-600 rounded-full text-white text-2xl font-bold shadow-2xl transform active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
        aria-label="Increment count"
      >
        Tap
      </button>

      <div className="flex items-center space-x-4 mt-8">
         <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-sm">Target:</span>
            {[33, 99, 100].map(num => (
                <button key={num} onClick={() => setTarget(num)} className={`px-2 py-0.5 text-sm rounded-full ${target === num ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                    {num}
                </button>
            ))}
         </div>
         <button onClick={handleReset} className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm">
            Reset
         </button>
      </div>
    </div>
  );
};
