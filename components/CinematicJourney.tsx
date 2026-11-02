"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Play, Pause, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { TIMELINE_VIEWS, SCENES } from "@/types/wedding";
import { frameLoader } from "@/lib/frame-loader";
import { CanvasScroller } from "@/components/CanvasScroller";
import { SceneOverlays } from "@/components/SceneOverlays";
import { CelebrationsScreen } from "@/components/CelebrationsScreen";

interface CinematicJourneyProps {
  hasEntered?: boolean;
  isJourneyActive?: boolean;
  onCelebrationStateChange?: (active: boolean) => void;
  onExploreCelebration?: () => void;
}

export const CinematicJourney: React.FC<CinematicJourneyProps> = ({
  hasEntered = true,
  isJourneyActive = true,
  onCelebrationStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const progressMotion = useMotionValue(0);

  const touchStartY = useRef<number | null>(null);
  const [showCelebrations, setShowCelebrations] = useState(false);
  const [isAutoTourActive, setIsAutoTourActive] = useState(false);
  const autoTourRunningRef = useRef(false);
  const [autoTourTimer, setAutoTourTimer] = useState(5);
  const [, setLastAnimTimestamp] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showFloatingScrollDown, setShowFloatingScrollDown] = useState(true);

  const autoTourTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTourIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Monitor scroll in celebrations view
  useEffect(() => {
    if (!showCelebrations) {
      setShowFloatingScrollDown(true);
      return;
    }
    setShowFloatingScrollDown(true);
    const handleScroll = () => {
      const container = document.getElementById("celebrations-scroll-container");
      if (container) {
        setShowFloatingScrollDown(container.scrollTop < 120);
      }
    };
    const t = setTimeout(() => {
      const container = document.getElementById("celebrations-scroll-container");
      container?.addEventListener("scroll", handleScroll, { passive: true });
    }, 150);

    return () => {
      clearTimeout(t);
      const container = document.getElementById("celebrations-scroll-container");
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [showCelebrations]);

  const scrollToCelebrationsEvents = useCallback(() => {
    const el = document.getElementById("celebrations");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const clearAutoTourTimers = useCallback(() => {
    if (autoTourTimeoutRef.current) {
      clearTimeout(autoTourTimeoutRef.current);
      autoTourTimeoutRef.current = null;
    }
    if (autoTourIntervalRef.current) {
      clearInterval(autoTourIntervalRef.current);
      autoTourIntervalRef.current = null;
    }
  }, []);

  // Show scroll hint with delay
  useEffect(() => {
    if (!hasEntered || showCelebrations) {
      setShowScrollHint(false);
      return;
    }
    setShowScrollHint(false);
    if (isTransitioningRef.current) return;
    const t = setTimeout(() => {
      setShowScrollHint(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [currentIndex, hasEntered, showCelebrations]);

  useEffect(() => {
    if (hasEntered) {
      frameLoader.ensureScenesAhead(0, 2);
    }
  }, [hasEntered]);

  // Lock body scroll during journey
  useEffect(() => {
    if (isJourneyActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isJourneyActive]);

  // Open celebrations screen
  const openCelebrations = useCallback(() => {
    if (showCelebrations) return;
    clearAutoTourTimers();
    setIsAutoTourActive(false);
    autoTourRunningRef.current = false;
    setShowScrollHint(false);
    setShowCelebrations(true);
    onCelebrationStateChange?.(true);

    frameLoader.ensureScenesAhead(0, 2);
    const t = setTimeout(() => {
      isTransitioningRef.current = true;
      animate(progressMotion, 0, {
        duration: 5.2,
        ease: [0.33, 1, 0.68, 1],
        onComplete: () => {
          isTransitioningRef.current = false;
          currentIndexRef.current = 0;
          setCurrentIndex(0);
          setLastAnimTimestamp(Date.now());
        },
      });
    }, 150);
    return () => clearTimeout(t);
  }, [progressMotion, showCelebrations, clearAutoTourTimers, onCelebrationStateChange]);

  // Navigate to specific timeline view index
  const goToView = useCallback(
    (targetIndex: number) => {
      if (
        targetIndex < 0 ||
        targetIndex >= TIMELINE_VIEWS.length ||
        isTransitioningRef.current
      ) {
        return;
      }
      clearAutoTourTimers();
      setShowScrollHint(false);
      isTransitioningRef.current = true;
      currentIndexRef.current = targetIndex;
      setCurrentIndex(targetIndex);

      const targetProgress = TIMELINE_VIEWS[targetIndex].progress;
      const sceneIdx = SCENES.findIndex(
        (s) => targetProgress >= s.timelineStart && targetProgress <= s.timelineEnd
      );
      if (sceneIdx >= 0) {
        frameLoader.ensureScenesAhead(sceneIdx, 2);
      }

      let dur = Math.max(
        2.6,
        Math.min(3.5, 16 * Math.abs(targetProgress - progressMotion.get()))
      );

      const sid = TIMELINE_VIEWS[targetIndex]?.sceneId;
      if (sid === "gate") dur = 3.0;
      if (sid === "haldi") dur = 3.2;
      if (sid === "sangeet") dur = 4.2;
      if (sid === "wedding") dur = 4.8;
      if (sid === "reception") dur = 4.6;

      const fallbackTimer = setTimeout(() => {
        isTransitioningRef.current = false;
        setLastAnimTimestamp(Date.now());
      }, (dur + 0.25) * 1000);

      animate(progressMotion, targetProgress, {
        duration: dur,
        ease: [0.25, 0.1, 0.25, 1],
        onComplete: () => {
          clearTimeout(fallbackTimer);
          isTransitioningRef.current = false;
          setLastAnimTimestamp(Date.now());
          if (targetIndex >= TIMELINE_VIEWS.length - 1) {
            openCelebrations();
          }
        },
      });
    },
    [progressMotion, clearAutoTourTimers, openCelebrations]
  );

  useEffect(() => {
    if (
      hasEntered &&
      !showCelebrations &&
      currentIndex >= TIMELINE_VIEWS.length - 1 &&
      !isTransitioningRef.current
    ) {
      openCelebrations();
    }
  }, [currentIndex, hasEntered, showCelebrations, openCelebrations]);

  const replayJourney = useCallback(() => {
    setShowCelebrations(false);
    onCelebrationStateChange?.(false);
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    progressMotion.set(0);
    setLastAnimTimestamp(Date.now());
  }, [progressMotion, onCelebrationStateChange]);

  const advanceNext = useCallback(() => {
    if (isTransitioningRef.current || showCelebrations) return;
    if (currentIndexRef.current < TIMELINE_VIEWS.length - 1) {
      goToView(currentIndexRef.current + 1);
    } else {
      openCelebrations();
    }
  }, [goToView, openCelebrations, showCelebrations]);

  const retreatPrev = useCallback(() => {
    if (isTransitioningRef.current || showCelebrations || !(currentIndexRef.current > 0)) {
      return;
    }
    goToView(currentIndexRef.current - 1);
  }, [goToView, showCelebrations]);

  // Auto-tour timer loop
  useEffect(() => {
    if (!isAutoTourActive || !hasEntered || showCelebrations || isTransitioningRef.current) {
      clearAutoTourTimers();
      return;
    }
    if (currentIndexRef.current >= TIMELINE_VIEWS.length - 1) {
      openCelebrations();
      return;
    }

    setAutoTourTimer(5);
    let secondsLeft = 5;

    if (autoTourIntervalRef.current) clearInterval(autoTourIntervalRef.current);
    autoTourIntervalRef.current = setInterval(() => {
      secondsLeft = Math.max(0, secondsLeft - 1);
      setAutoTourTimer(secondsLeft);
      if (secondsLeft <= 0 && autoTourIntervalRef.current) {
        clearInterval(autoTourIntervalRef.current);
        autoTourIntervalRef.current = null;
      }
    }, 1000);

    if (autoTourTimeoutRef.current) clearTimeout(autoTourTimeoutRef.current);
    autoTourTimeoutRef.current = setTimeout(() => {
      if (autoTourRunningRef.current && !isTransitioningRef.current) {
        advanceNext();
      }
    }, 5000);

    return () => {
      clearAutoTourTimers();
    };
  }, [isAutoTourActive, currentIndex, hasEntered, showCelebrations, clearAutoTourTimers, advanceNext, openCelebrations]);

  const toggleAutoTour = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isAutoTourActive) {
      setIsAutoTourActive(false);
      autoTourRunningRef.current = false;
      clearAutoTourTimers();
    } else {
      setIsAutoTourActive(true);
      autoTourRunningRef.current = true;
      if (currentIndexRef.current >= TIMELINE_VIEWS.length - 1) {
        goToView(0);
      } else if (!isTransitioningRef.current) {
        setLastAnimTimestamp(Date.now());
      }
    }
  };

  // Wheel listener
  useEffect(() => {
    if (!isJourneyActive || showCelebrations) return;
    let accumulatedDelta = 0;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (showCelebrations) return;
      if (currentIndexRef.current === TIMELINE_VIEWS.length - 1 && e.deltaY > 0) {
        openCelebrations();
        return;
      }
      e.preventDefault();
      if (!isTransitioningRef.current) {
        accumulatedDelta += e.deltaY;
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          accumulatedDelta = 0;
        }, 180);

        if (accumulatedDelta > 25) {
          accumulatedDelta = 0;
          advanceNext();
        } else if (accumulatedDelta < -25) {
          accumulatedDelta = 0;
          retreatPrev();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [isJourneyActive, showCelebrations, advanceNext, retreatPrev, openCelebrations]);

  // Keyboard navigation
  useEffect(() => {
    if (!isJourneyActive || showCelebrations) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCelebrations) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        advanceNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        retreatPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJourneyActive, showCelebrations, advanceNext, retreatPrev]);

  const activeSceneId = TIMELINE_VIEWS[currentIndex]?.sceneId;

  return (
    <div
      ref={containerRef}
      onTouchStart={(e) => {
        if (!isJourneyActive || showCelebrations) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest("button")) return;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (!isJourneyActive || showCelebrations || touchStartY.current === null) return;
        const delta = touchStartY.current - e.changedTouches[0].clientY;
        touchStartY.current = null;
        if (Math.abs(delta) > 35) {
          if (delta > 0) advanceNext();
          else retreatPrev();
        }
      }}
      className="relative w-full h-screen overflow-hidden bg-transparent select-none"
    >
      {/* Canvas sequence renderer */}
      <CanvasScroller progress={progressMotion} isActive={hasEntered} />

      {/* 3D Scene typography and overlays */}
      {!showCelebrations && (
        <SceneOverlays
          sceneId={activeSceneId}
          onExplore={openCelebrations}
          hasEntered={hasEntered}
        />
      )}

      {/* Auto Tour Floating Button */}
      {hasEntered && !showCelebrations && (
        <button
          type="button"
          onClick={toggleAutoTour}
          aria-label={isAutoTourActive ? "Pause cinematic tour" : "Play cinematic auto tour"}
          title={
            isAutoTourActive
              ? "Pause Auto-Tour"
              : "Start Auto-Tour (Plays through scenes with 5s pause)"
          }
          className="fixed bottom-[3.5rem] right-3.5 sm:bottom-[4.15rem] sm:right-5 z-50 group flex flex-col items-center justify-center w-8 sm:w-8.5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/50 hover:border-[#D4AF37] bg-black/80 hover:bg-black/95 text-[#FFF4E3] backdrop-blur-md transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] cursor-pointer select-none pointer-events-auto active:scale-95"
        >
          {isAutoTourActive ? (
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex items-center justify-center w-3.5 h-3.5">
                <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 16 16">
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    className="stroke-[#D4AF37]/30"
                    strokeWidth="2.2"
                    fill="none"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    className="stroke-[#D4AF37] transition-all duration-1000 ease-linear"
                    strokeWidth="2.2"
                    fill="none"
                    strokeDasharray="37.7"
                    strokeDashoffset={37.7 * (1 - autoTourTimer / 5)}
                  />
                </svg>
                <Pause className="w-1.5 h-1.5 text-[#D4AF37] absolute" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-wider font-medium text-[#FFF4E3] [writing-mode:vertical-rl] py-0.5">
                Pause ({autoTourTimer}s)
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Play className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-sans text-[8px] uppercase tracking-wider font-medium text-[#FFF4E3] group-hover:text-[#D4AF37] transition-colors [writing-mode:vertical-rl] py-0.5">
                Auto Tour
              </span>
            </div>
          )}
        </button>
      )}

      {/* Auto-tour hint toast at scene 1 */}
      <AnimatePresence>
        {hasEntered && !showCelebrations && currentIndex === 1 && !isAutoTourActive && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.45 }}
            onClick={toggleAutoTour}
            className="fixed bottom-[3.35rem] right-[3.25rem] sm:bottom-[3.95rem] sm:right-[4.25rem] z-50 flex items-center gap-2 cursor-pointer select-none pointer-events-auto group"
            title="Click here to play automatically"
          >
            <div className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-black/95 via-[#1A1408]/95 to-black/95 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.7),0_4px_20px_rgba(0,0,0,0.85)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 animate-pulse" />
              <span className="font-sans text-[10.5px] sm:text-xs font-bold text-[#FFF4E3] tracking-wide whitespace-nowrap">
                Click here to play automatically or{" "}
                <span className="text-[#FFE066] font-black drop-shadow-[0_0_6px_rgba(255,224,102,0.8)]">
                  scroll up
                </span>
              </span>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#D4AF37]" />
            </div>
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3DE98] text-charcoal-dark shadow-[0_0_15px_#D4AF37] shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-charcoal-dark stroke-[2.5]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side navigation dots */}
      {hasEntered && !showCelebrations && (
        <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 items-center pointer-events-auto select-none">
          {TIMELINE_VIEWS.map((item, idx) => (
            <button
              key={item.sceneId}
              onClick={() => goToView(idx)}
              title={`${item.name} (View ${idx + 1})`}
              aria-label={`Jump to view ${idx + 1}: ${item.name}`}
              className="group relative flex items-center justify-center p-1 focus:outline-none cursor-pointer"
            >
              <span
                className={`rounded-full transition-all duration-500 block ${
                  currentIndex === idx
                    ? "w-2.5 h-2.5 bg-gold shadow-[0_0_12px_#D4AF37] scale-110"
                    : "w-1.5 h-1.5 bg-ivory/30 group-hover:bg-gold/60 group-hover:scale-125"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Scroll Up Chevrons */}
      {!showCelebrations && hasEntered && currentIndex < TIMELINE_VIEWS.length - 1 && (
        <div
          onClick={advanceNext}
          aria-label="Scroll up to advance"
          title="Scroll up to advance"
          className={`fixed ${
            currentIndex === 0 ? "bottom-5 sm:bottom-7" : "bottom-4 sm:bottom-6"
          } left-1/2 -translate-x-1/2 z-30 flex flex-col items-center justify-center cursor-pointer pointer-events-auto select-none group transition-all duration-700 ease-out ${
            showScrollHint
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div
            className={`relative flex flex-col items-center justify-center transition-all duration-500 ${
              currentIndex === 0
                ? "w-24 h-36 sm:w-32 sm:h-44"
                : "w-16 h-20 sm:w-20 sm:h-24"
            }`}
          >
            <div
              className={`absolute rounded-full pointer-events-none transition-all duration-500 ${
                currentIndex === 0
                  ? "w-28 h-40 sm:w-36 sm:h-48 bg-gold/35 blur-3xl group-hover:bg-gold/50"
                  : "w-14 h-18 bg-gold/20 blur-xl group-hover:bg-gold/35"
              }`}
            />
            <motion.div
              animate={{
                y: currentIndex === 0 ? [50, -56] : [24, -26],
                scaleY: [0.3, 1.4, 0.3],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute bg-gradient-to-t from-transparent via-[#D4AF37] to-[#FFF4E3] rounded-full shadow-[0_0_18px_#D4AF37] ${
                currentIndex === 0 ? "w-[3.5px] h-28" : "w-[2px] h-12"
              }`}
            />
            <motion.div
              animate={{
                y: currentIndex === 0 ? [34, -54] : [22, -28],
                opacity: [0, 1, 0],
                scale: currentIndex === 0 ? [0.95, 1.35, 1] : [0.85, 1.15, 0.9],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute"
            >
              <ChevronUp
                className={`${
                  currentIndex === 0
                    ? "w-18 h-18 sm:w-24 sm:h-24 stroke-[3.5] filter drop-shadow-[0_0_24px_rgba(212,175,55,1)]"
                    : "w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5] filter drop-shadow-[0_0_14px_rgba(212,175,55,0.95)]"
                } text-[#D4AF37]`}
              />
            </motion.div>
          </div>
          <span
            className={`font-sans uppercase text-[#FFF4E3]/90 font-medium group-hover:text-[#D4AF37] transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,1)] ${
              currentIndex === 0
                ? "text-xs sm:text-sm tracking-[0.35em] font-extrabold mt-2.5"
                : "text-[10px] sm:text-[11px] tracking-[0.25em] -mt-1"
            }`}
          >
            Scroll Up
          </span>
        </div>
      )}

      {/* Celebrations Full Screen Modal */}
      <AnimatePresence>
        {showCelebrations && (
          <motion.div
            id="celebrations-scroll-container"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 overflow-y-auto pointer-events-auto selection:bg-gold selection:text-charcoal-dark"
          >
            <CelebrationsScreen onReplayJourney={replayJourney} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Scroll Down button on celebrations top */}
      <AnimatePresence>
        {showCelebrations && showFloatingScrollDown && (
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.9 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            onClick={scrollToCelebrationsEvents}
            className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-auto group select-none"
          >
            <div className="relative flex items-center justify-center w-14 h-12">
              <div className="absolute w-12 h-12 rounded-full bg-[#D4AF37]/35 blur-xl pointer-events-none" />
              <motion.div
                animate={{ y: [-16, 14], opacity: [0, 1, 0], scale: [0.85, 1.15, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
              >
                <ChevronDown className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFE066] stroke-[3] filter drop-shadow-[0_0_16px_rgba(255,224,102,1)]" />
              </motion.div>
            </div>
            <div className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#E5C158] via-[#FFF3C2] to-[#E5C158] border-2 border-white shadow-[0_0_30px_rgba(229,193,88,0.9),0_6px_25px_rgba(0,0,0,0.85)] ring-4 ring-[#D4AF37]/40 transition-all duration-300 group-hover:scale-105">
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] font-black text-[#110E09] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                Scroll Down ↓
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

