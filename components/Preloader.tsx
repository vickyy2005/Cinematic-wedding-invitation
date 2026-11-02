"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Music } from "lucide-react";
import { frameLoader } from "@/lib/frame-loader";
import { audioManager } from "@/lib/audio-manager";

interface PreloaderProps {
  onStartEnter?: () => void;
  onComplete: () => void;
}

const getProgressPhrase = (progress: number, isReady: boolean) => {
  if (isReady || progress >= 100) return "“The celebration begins.”";
  if (progress < 15) return "“Preparing the doors to our celebration…”";
  if (progress < 32) return "Gathering the colours…";
  if (progress < 50) return "Lighting the way…";
  if (progress < 70) return "Setting the stage…";
  if (progress < 88) return "Unfolding the story…";
  return "Almost ready…";
};

export const Preloader: React.FC<PreloaderProps> = ({ onStartEnter, onComplete }) => {
  const [visualsProgress, setVisualsProgress] = useState(0);
  const [musicProgress, setMusicProgress] = useState(0);
  const [visualsReady, setVisualsReady] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const [phrase, setPhrase] = useState("“Preparing the doors to our celebration…”");
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setVisualsProgress(100);
        setMusicProgress(100);
        setVisualsReady(true);
        setMusicReady(true);
        setIsReady(true);
      }
    }, 15000);

    const unsubVisuals = frameLoader.subscribeProgress((pct, msg) => {
      if (mounted) {
        setVisualsProgress(pct);
        if (msg && !isReady) setPhrase(msg);
        if (pct >= 100) setVisualsReady(true);
      }
    });

    try {
      frameLoader
        .startPreload(() => {
          if (mounted) {
            setVisualsProgress(100);
            setVisualsReady(true);
          }
        })
        .catch(() => {
          if (mounted) {
            setVisualsProgress(100);
            setVisualsReady(true);
          }
        });
    } catch {
      if (mounted) {
        setVisualsProgress(100);
        setVisualsReady(true);
      }
    }

    try {
      audioManager
        .preload((pct) => {
          if (mounted) {
            setMusicProgress(pct);
            if (pct >= 100) setMusicReady(true);
          }
        })
        .then(() => {
          if (mounted) {
            setMusicProgress(100);
            setMusicReady(true);
          }
        })
        .catch(() => {
          if (mounted) {
            setMusicProgress(100);
            setMusicReady(true);
          }
        });
    } catch {
      if (mounted) {
        setMusicProgress(100);
        setMusicReady(true);
      }
    }

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      unsubVisuals();
    };
  }, [isReady]);

  useEffect(() => {
    if (visualsReady && musicReady) {
      setIsReady(true);
      setPhrase("“The celebration begins.”");
    }
  }, [visualsReady, musicReady]);

  const combinedPercent = isReady
    ? 100
    : Math.min(99, Math.round(0.55 * visualsProgress + 0.45 * musicProgress));

  const handleEnter = () => {
    audioManager.play();
    frameLoader.ensureScenesAhead(0, 2);
    onStartEnter?.();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal-dark px-6 select-none transition-opacity duration-700 ease-in-out ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div className="relative w-36 h-36 md:w-48 md:h-48 mb-6 animate-float rounded-3xl overflow-hidden border border-gold/30 shadow-[0_8px_30px_rgba(212,175,55,0.25)] bg-[#FAF3EA]">
          <Image
            src="/assets/logo/nk-locked-logo.png"
            alt="Nisarg Weds Khushi Master Monogram"
            fill
            priority
            className="object-contain"
          />
        </div>

        <h1 className="font-serif text-2xl md:text-3xl tracking-regal text-ivory uppercase font-light mb-2">
          NISARG WEDS KHUSHI
        </h1>

        <p className="font-serif italic text-sm md:text-base text-gold-muted mb-8 tracking-wide">
          “A Celebration of Love &amp; Happiness”
        </p>

        {isReady ? (
          <button
            onClick={handleEnter}
            className="group relative px-8 py-3.5 rounded-full border border-gold/70 bg-gradient-to-b from-charcoal to-charcoal-dark text-gold hover:bg-gold hover:text-charcoal-dark transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 font-sans text-xs md:text-sm uppercase tracking-regal font-semibold">
              Enter The Celebration
            </span>
            <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        ) : (
          <div className="w-full max-w-xs flex flex-col items-center">
            <div className="w-full h-[2px] bg-charcoal-light/70 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-300 ease-out"
                style={{ width: `${Math.max(6, combinedPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[11px] font-sans text-ivory-warm/75 tracking-wider">
              <span className="italic transition-all duration-300">
                {getProgressPhrase(combinedPercent, isReady)}
              </span>
              <span className="font-mono text-gold">{combinedPercent}%</span>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3.5 text-[10px] uppercase tracking-wider font-sans">
              <span
                className={`flex items-center gap-1.5 transition-colors duration-300 ${
                  visualsReady ? "text-gold font-medium" : "text-ivory-warm/50"
                }`}
              >
                <Eye className="w-3 h-3 text-gold/70" />
                Visuals {visualsProgress}%
              </span>
              <span className="text-gold/30">•</span>
              <span
                className={`flex items-center gap-1.5 transition-colors duration-300 ${
                  musicReady ? "text-gold font-medium" : "text-ivory-warm/50"
                }`}
              >
                <Music className="w-3 h-3 text-gold/70" />
                Music {musicProgress}%
              </span>
            </div>
          </div>
        )}

        <p className="font-sans text-[10px] uppercase tracking-widest text-ivory-warm/40 mt-12">
          18 • 20 • 21 October 2026
        </p>
      </div>
    </div>
  );
};

