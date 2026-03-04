import React from 'react';
import Lanyard from './components/Lanyard/Lanyard.jsx';
import Terminal from './components/Terminal/Terminal.jsx';
import MatrixRain from './components/MatrixRain';


export default function App() {
  return (
    <main className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-12 overflow-hidden">
      <MatrixRain />
      
      {/* Increased max-width to 7xl for a more expansive feel */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-7xl">
        
        {/* Lanyard Side: Increased height to 600px */}
        <div className="w-full md:w-1/2 h-[600px] bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <Lanyard />
        </div>

        {/* Terminal Side: Centered and matched to height */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Terminal />
        </div>

      </div>
    </main>
  );
}