"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audioManager } from "@/lib/audio-manager";

interface AudioPlayerProps {
  hasEntered?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ hasEntered = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = audioManager.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsub();
  }, []);

  if (!hasEntered) return null;

  return (
    <button
      onClick={() => audioManager.toggle()}
      aria-label={isPlaying ? "Mute wedding soundtrack" : "Play wedding soundtrack"}
      title={isPlaying ? "Mute Soundtrack" : "Play Soundtrack"}
      className="fixed bottom-4 right-3.5 sm:bottom-5 sm:right-5 z-50 group flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-[#D4AF37]/50 hover:border-[#D4AF37] bg-black/80 hover:bg-black/95 text-[#FFF4E3] backdrop-blur-md transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] cursor-pointer select-none active:scale-95 pointer-events-auto"
    >
      {isPlaying ? (
        <div className="flex items-center gap-0.5">
          <div className="flex items-end gap-[1.5px] h-3">
            <span className="w-[1.5px] bg-[#D4AF37] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-1.5" />
            <span className="w-[1.5px] bg-[#FFF4E3] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3" />
            <span className="w-[1.5px] bg-[#D4AF37] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
          </div>
          <Volume2 className="w-3 h-3 text-[#D4AF37]" />
        </div>
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-[#FFF4E3]/60 group-hover:text-[#D4AF37] transition-colors" />
      )}
    </button>
  );
};

