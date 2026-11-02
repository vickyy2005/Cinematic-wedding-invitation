"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, ChevronDown } from "lucide-react";

interface SceneOverlaysProps {
  sceneId?: string;
  onExplore?: () => void;
  hasEntered?: boolean;
}

const getSceneVariants = (sceneId?: string) => {
  if (sceneId === "aerial") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.3 } },
      exit: {
        opacity: 0,
        y: -20,
        filter: "blur(8px)",
        transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
      },
    };
  }
  return {
    initial: { opacity: 0, rotateX: 28, y: 48, scale: 0.9, filter: "blur(12px)" },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        delay:
          sceneId === "gate"
            ? 1
            : sceneId === "haldi"
            ? 1.3
            : sceneId === "sangeet"
            ? 1.8
            : sceneId === "wedding"
            ? 2.2
            : sceneId === "reception"
            ? 2
            : 0.85,
        duration: 1.3,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.18,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(8px)",
      transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
    },
  };
};

const vSub = {
  initial: { opacity: 0, rotateX: 20, y: 20, scale: 0.95, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.15, duration: 1.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const vTitle = {
  initial: { opacity: 0, rotateX: 28, y: 45, scale: 0.9, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const vInvite = {
  initial: { opacity: 0, rotateX: 22, y: 36, scale: 0.92, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 1.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const vCommon = {
  initial: { opacity: 0, y: 24, rotateX: 18, scale: 0.94, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export const SceneOverlays: React.FC<SceneOverlaysProps> = ({
  sceneId,
  hasEntered = true,
}) => {
  const [animDone, setAnimDone] = useState(false);
  const [showLocationHint, setShowLocationHint] = useState(false);

  useEffect(() => {
    if (sceneId !== "haldi") {
      setAnimDone(false);
      setShowLocationHint(false);
      return;
    }
    const t = setTimeout(() => {
      setShowLocationHint(true);
    }, 4200);
    return () => {
      clearTimeout(t);
      setAnimDone(false);
      setShowLocationHint(false);
    };
  }, [sceneId]);

  useEffect(() => {
    if (!animDone) return;
    const t = setTimeout(() => {
      setShowLocationHint(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [animDone]);

  const isVisible = Boolean(hasEntered && sceneId && sceneId !== "finale");

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-between p-4 sm:p-6 text-center select-none"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={`${sceneId}-${hasEntered}`}
            variants={getSceneVariants(sceneId)}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformStyle: "preserve-3d" }}
            className={`fixed inset-0 z-10 w-full h-full flex flex-col items-center justify-between pointer-events-none text-center select-none ${
              sceneId === "aerial"
                ? "pt-1.5 sm:pt-3.5 px-3 sm:px-6 pb-4 sm:pb-6"
                : "p-4 sm:p-6"
            }`}
          >
            {/* Aerial Scene */}
            {sceneId === "aerial" && (
              <div
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                className="w-full max-w-[950px] flex flex-col items-center mt-0.5 sm:mt-1.5 md:mt-2 px-2 sm:px-6"
              >
                <motion.p
                  variants={vSub}
                  style={{ transformStyle: "preserve-3d" }}
                  className="font-serif font-semibold text-[clamp(0.68rem,2vw,0.88rem)] text-[#2A1713]/90 tracking-[0.26em] sm:tracking-[0.36em] uppercase text-center mb-1 sm:mb-2 drop-shadow-[0_1.5px_6px_rgba(255,248,240,0.9)]"
                >
                  || Jay Shree Swaminarayan ||
                </motion.p>
                <motion.h1
                  variants={vTitle}
                  style={{ transformStyle: "preserve-3d" }}
                  className="font-serif font-black text-[clamp(1.5rem,7vw,4.5rem)] text-[#2A1713] tracking-wide text-center leading-[1.12] drop-shadow-[0_2px_10px_rgba(255,248,240,0.95)] [-webkit-text-stroke:0.7px_#2A1713]"
                >
                  Virat H. Rajoriya and Family
                </motion.h1>
                <motion.p
                  variants={vInvite}
                  style={{ transformStyle: "preserve-3d" }}
                  className="font-serif font-bold italic text-[clamp(1.25rem,5.6vw,3.75rem)] text-[#2A1713] mt-2 sm:mt-4 drop-shadow-[0_2px_10px_rgba(255,248,240,0.95)] [-webkit-text-stroke:0.5px_#2A1713] text-center"
                >
                  Invites you
                </motion.p>
              </div>
            )}

            {/* The Royal Gate */}
            {sceneId === "gate" && (
              <div className="w-fit max-w-[min(92vw,500px)] mx-auto my-auto flex flex-col items-center px-[clamp(1.25rem,5.5vw,2.25rem)] py-[clamp(1rem,4.5vw,1.75rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)]">
                <motion.p
                  variants={vCommon}
                  className="font-serif italic font-medium text-[clamp(1rem,4.2vw,1.875rem)] text-[#E5C07B] tracking-wide mb-2 text-center max-w-xl leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                >
                  “A celebration of love and happiness”
                </motion.p>
                <motion.h1
                  variants={vCommon}
                  className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider uppercase leading-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] my-0.5 [-webkit-text-stroke:0.6px_#FFF4E3]"
                >
                  Nisarg Weds Khushi
                </motion.h1>
                <motion.div
                  variants={vCommon}
                  className="w-[clamp(4.5rem,18vw,7.5rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                />
                <motion.p
                  variants={vCommon}
                  className="font-sans font-extrabold text-[clamp(0.6875rem,2.8vw,1rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-0.5"
                >
                  21 — 24 NOVEMBER 2026
                </motion.p>
              </div>
            )}

            {/* Haldi Carnival */}
            {sceneId === "haldi" && (
              <>
                <div className="w-full max-w-[500px] flex flex-col items-center mt-[25vh] sm:mt-[23.5vh]">
                  <motion.h1
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.35rem,5.6vw,3.25rem)] text-[#2A1713] tracking-wider uppercase leading-tight drop-shadow-[0_1px_3px_rgba(255,248,240,0.85)] [-webkit-text-stroke:0.6px_#2A1713]"
                  >
                    HALDI CARNIVAL
                  </motion.h1>
                </div>
                <div className="relative flex flex-col items-center mb-16 sm:mb-20">
                  <div className="w-fit max-w-[min(92vw,420px)] mx-auto flex flex-col items-center px-[clamp(1rem,4.5vw,1.75rem)] py-[clamp(0.7rem,3vw,1.25rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)] pointer-events-auto">
                    <motion.p
                      variants={vCommon}
                      className="font-sans font-extrabold text-[clamp(0.75rem,3.25vw,1.125rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                    >
                      21 NOVEMBER 2026
                    </motion.p>
                    <motion.div
                      variants={vCommon}
                      className="w-[clamp(4.5rem,18vw,7rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                    />
                    <motion.p
                      variants={vCommon}
                      className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] my-0.5"
                    >
                      9:30 AM ONWARDS
                    </motion.p>
                    <motion.p
                      variants={vCommon}
                      className="font-sans font-bold text-[clamp(0.6875rem,2.8vw,0.95rem)] tracking-[0.3em] text-[#FFF4E3] uppercase mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                    >
                      Followed by Lunch
                    </motion.p>
                    <motion.div
                      variants={vCommon}
                      onAnimationComplete={() => {
                        if (sceneId === "haldi") setAnimDone(true);
                      }}
                      className="flex flex-col items-center mt-2.5 sm:mt-3"
                    >
                      <a
                        href="https://maps.app.goo.gl/rtibd9T4wfgAoWbs6"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open The Primo in Google Maps"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/75 hover:bg-[#FFB300]/25 border-2 border-[#FFB300] text-[#FFF4E3] hover:text-[#FFB300] transition-all duration-300 shadow-[0_0_20px_rgba(255,179,0,0.5)] cursor-pointer group/map active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FFB300] group-hover/map:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-[clamp(10px,2.55vw,13px)] font-sans tracking-wide font-medium truncate max-w-[210px] sm:max-w-[270px]">
                          The Primo, Ambli Road
                        </span>
                        <span className="text-[#FFB300] text-[clamp(9px,2.3vw,11px)] font-sans font-bold tracking-wider ml-0.5">
                          Maps →
                        </span>
                      </a>
                    </motion.div>
                  </div>

                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-20">
                    <AnimatePresence>
                      {showLocationHint && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.88 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.9 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="flex flex-col items-center"
                        >
                          <motion.div
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-[#FFB300] stroke-[3] filter drop-shadow-[0_0_8px_rgba(255,179,0,0.9)] -mb-0.5 rotate-180" />
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-black/95 via-[#231A05]/95 to-black/95 border border-[#FFB300] shadow-[0_0_15px_rgba(255,179,0,0.65)] backdrop-blur-md">
                              <Sparkles className="w-3 h-3 text-[#FFB300] shrink-0 animate-pulse" />
                              <span className="font-sans text-[10px] sm:text-[11px] font-bold text-[#FFF4E3] tracking-wide whitespace-nowrap">
                                Click here for location
                              </span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}

            {/* Sangeet Darbar */}
            {sceneId === "sangeet" && (
              <>
                <div className="w-full max-w-[500px] flex flex-col items-center mt-[34vh] sm:mt-[32vh]">
                  <motion.h1
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.85rem,8.4vw,4.5rem)] text-[#FFF4E3] tracking-wider uppercase leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] drop-shadow-[0_0_30px_rgba(255,244,227,0.35)] [-webkit-text-stroke:0.6px_#FFF4E3]"
                  >
                    SANGEET
                  </motion.h1>
                </div>
                <div className="w-fit max-w-[min(92vw,420px)] mx-auto flex flex-col items-center mb-14 sm:mb-18 px-[clamp(1rem,4.5vw,1.75rem)] py-[clamp(0.7rem,3vw,1.25rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)] pointer-events-auto">
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-extrabold text-[clamp(0.75rem,3.25vw,1.125rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  >
                    21 NOVEMBER 2026
                  </motion.p>
                  <motion.div
                    variants={vCommon}
                    className="w-[clamp(4.5rem,18vw,7rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                  />
                  <motion.p
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] my-0.5"
                  >
                    6:30 PM ONWARDS
                  </motion.p>
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-bold text-[clamp(0.6875rem,2.8vw,0.95rem)] tracking-[0.3em] text-[#FFF4E3] uppercase mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                  >
                    Followed by Dinner
                  </motion.p>
                  <motion.a
                    variants={vCommon}
                    href="https://maps.app.goo.gl/rtibd9T4wfgAoWbs6"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open The Primo in Google Maps"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-[#FFB300]/20 border border-[#FFB300]/50 hover:border-[#FFB300] text-[#FFF4E3] hover:text-[#FFB300] transition-all duration-300 shadow-md cursor-pointer group/map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFB300] group-hover/map:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[clamp(10px,2.55vw,13px)] font-sans tracking-wide font-medium truncate max-w-[210px] sm:max-w-[270px]">
                      The Primo, Ambli Road
                    </span>
                    <span className="text-[#FFB300] text-[clamp(9px,2.3vw,11px)] font-sans font-semibold tracking-wider ml-0.5">
                      Maps →
                    </span>
                  </motion.a>
                </div>
              </>
            )}

            {/* Wedding Ceremony (Ganesh Sthapan) */}
            {sceneId === "wedding" && (
              <>
                <div className="w-full max-w-[540px] flex flex-col items-center mt-[18vh] sm:mt-[16.5vh]">
                  <motion.div
                    variants={vCommon}
                    className="relative w-[clamp(7.5rem,33vw,13rem)] aspect-[597/418] drop-shadow-[0_2px_12px_rgba(255,248,240,0.6)] mb-4 sm:mb-6"
                  >
                    <Image
                      src="/assets/logo/nk-short.png"
                      alt="Nisarg Weds Khushi Monogram"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                  <motion.h1
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.35rem,5.6vw,3.25rem)] text-[#2A1713] tracking-wider uppercase leading-[1.08] sm:leading-[1.1] drop-shadow-[0_1px_3px_rgba(255,248,240,0.85)] [-webkit-text-stroke:0.6px_#2A1713] mt-2 sm:mt-3 text-center"
                  >
                    <span>WEDDING</span>
                    <span className="block">CEREMONY</span>
                  </motion.h1>
                </div>
                <div className="w-fit max-w-[min(92vw,440px)] mx-auto flex flex-col items-center mb-14 sm:mb-18 px-[clamp(1rem,4.5vw,1.75rem)] py-[clamp(0.7rem,3vw,1.25rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)] pointer-events-auto">
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-extrabold text-[clamp(0.75rem,3.25vw,1.125rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  >
                    23 NOVEMBER 2026
                  </motion.p>
                  <motion.div
                    variants={vCommon}
                    className="w-[clamp(4.5rem,18vw,7rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                  />
                  <motion.h3
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(0.75rem,3.25vw,1.125rem)] text-[#FFF4E3] tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-snug text-center my-1.5 [-webkit-text-stroke:0.7px_#FFF4E3]"
                  >
                    <span>GANESH STHAPAN • MANDAP MUHURT</span>
                    <span className="block mt-0.5">&amp; GRAH SHANTI</span>
                  </motion.h3>
                  <motion.p
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] mt-1"
                  >
                    9:00 AM ONWARDS
                  </motion.p>
                  <motion.a
                    variants={vCommon}
                    href="https://maps.app.goo.gl/TWerfBVXVJGyiVGR6"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Shri Swaminarayan Gurukul in Google Maps"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-[#FFB300]/20 border border-[#FFB300]/50 hover:border-[#FFB300] text-[#FFF4E3] hover:text-[#FFB300] transition-all duration-300 shadow-md cursor-pointer group/map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFB300] group-hover/map:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[clamp(10px,2.55vw,13px)] font-sans tracking-wide font-medium truncate max-w-[210px] sm:max-w-[270px]">
                      Gurukul, Vaghasi, Anand
                    </span>
                    <span className="text-[#FFB300] text-[clamp(9px,2.3vw,11px)] font-sans font-semibold tracking-wider ml-0.5">
                      Maps →
                    </span>
                  </motion.a>
                </div>
              </>
            )}

            {/* Mandap / Hast Melap */}
            {sceneId === "mandap" && (
              <>
                <div className="w-full max-w-[720px] flex flex-col items-center mt-[4.5vh] sm:mt-[3.5vh]">
                  <motion.div
                    variants={vCommon}
                    className="relative w-[clamp(7.5rem,33vw,14rem)] aspect-[597/418] drop-shadow-[0_2px_12px_rgba(255,248,240,0.6)] mb-5 sm:mb-8 md:mb-10"
                  >
                    <Image
                      src="/assets/logo/nk-short.png"
                      alt="Nisarg Weds Khushi Monogram"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                  <motion.h1
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.35rem,5.6vw,3.75rem)] text-[#2A1713] tracking-wider uppercase leading-tight drop-shadow-[0_1px_4px_rgba(255,248,240,0.85)] [-webkit-text-stroke:0.7px_#2A1713] mt-2 sm:mt-3 text-center whitespace-nowrap"
                  >
                    WEDDING CEREMONY
                  </motion.h1>
                </div>
                <div className="w-fit max-w-[min(92vw,460px)] mx-auto flex flex-col items-center mb-14 sm:mb-18 px-[clamp(1rem,4.5vw,1.75rem)] py-[clamp(0.7rem,3vw,1.25rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)] pointer-events-auto">
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-extrabold text-[clamp(0.75rem,3.25vw,1.125rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  >
                    23 NOVEMBER 2026
                  </motion.p>
                  <motion.div
                    variants={vCommon}
                    className="w-[clamp(4.5rem,18vw,7rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                  />
                  <motion.h3
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.35rem,5.6vw,2.5rem)] text-[#FFF4E3] tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-tight text-center my-1 sm:my-1.5 [-webkit-text-stroke:0.7px_#FFF4E3]"
                  >
                    HAST MELAP
                  </motion.h3>
                  <motion.p
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] my-0.5 sm:my-1"
                  >
                    12:40 PM
                  </motion.p>
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-bold text-[clamp(0.6875rem,2.8vw,0.95rem)] tracking-[0.25em] text-[#FFF4E3] uppercase mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                  >
                    Followed by Lunch • 12:45 PM
                  </motion.p>
                  <motion.a
                    variants={vCommon}
                    href="https://maps.app.goo.gl/TWerfBVXVJGyiVGR6"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Shri Swaminarayan Gurukul in Google Maps"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-[#FFB300]/20 border border-[#FFB300]/50 hover:border-[#FFB300] text-[#FFF4E3] hover:text-[#FFB300] transition-all duration-300 shadow-md cursor-pointer group/map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFB300] group-hover/map:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[clamp(10px,2.55vw,13px)] font-sans tracking-wide font-medium truncate max-w-[210px] sm:max-w-[270px]">
                      Gurukul, Vaghasi, Anand
                    </span>
                    <span className="text-[#FFB300] text-[clamp(9px,2.3vw,11px)] font-sans font-semibold tracking-wider ml-0.5">
                      Maps →
                    </span>
                  </motion.a>
                </div>
              </>
            )}

            {/* Reception Gala */}
            {sceneId === "reception" && (
              <>
                <div className="w-full max-w-[500px] flex flex-col items-center mt-[31.5vh] sm:mt-[30vh]">
                  <motion.h1
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.65rem,7vw,4rem)] text-[#FFF4E3] tracking-wider uppercase leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] drop-shadow-[0_0_30px_rgba(255,244,227,0.35)] [-webkit-text-stroke:0.6px_#FFF4E3] -translate-x-2 sm:-translate-x-2.5 md:-translate-x-3"
                  >
                    RECEPTION
                  </motion.h1>
                </div>
                <div className="w-fit max-w-[min(92vw,420px)] mx-auto flex flex-col items-center mb-14 sm:mb-18 px-[clamp(1rem,4.5vw,1.75rem)] py-[clamp(0.7rem,3vw,1.25rem)] rounded-3xl bg-black/40 backdrop-blur-md border border-[#FFB300]/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)] pointer-events-auto">
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-extrabold text-[clamp(0.75rem,3.25vw,1.125rem)] tracking-[0.35em] text-[#FFF4E3] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                  >
                    24 NOVEMBER 2026
                  </motion.p>
                  <motion.div
                    variants={vCommon}
                    className="w-[clamp(4.5rem,18vw,7rem)] h-[2px] bg-gradient-to-r from-transparent via-[#FFB300] to-transparent my-1.5"
                  />
                  <motion.p
                    variants={vCommon}
                    className="font-serif font-black text-[clamp(1.5rem,7vw,3.75rem)] text-[#FFF4E3] tracking-wider drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] my-0.5"
                  >
                    6:30 PM ONWARDS
                  </motion.p>
                  <motion.p
                    variants={vCommon}
                    className="font-sans font-bold text-[clamp(0.6875rem,2.8vw,0.95rem)] tracking-[0.3em] text-[#FFF4E3] uppercase mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                  >
                    Followed by Dinner
                  </motion.p>
                  <motion.a
                    variants={vCommon}
                    href="https://maps.app.goo.gl/ktUswsu33Fu1Scyv8"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open The Gravity Greens in Google Maps"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-[#FFB300]/20 border border-[#FFB300]/50 hover:border-[#FFB300] text-[#FFF4E3] hover:text-[#FFB300] transition-all duration-300 shadow-md cursor-pointer group/map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFB300] group-hover/map:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[clamp(10px,2.55vw,13px)] font-sans tracking-wide font-medium truncate max-w-[210px] sm:max-w-[270px]">
                      The Gravity Greens, Rancharda
                    </span>
                    <span className="text-[#FFB300] text-[clamp(9px,2.3vw,11px)] font-sans font-semibold tracking-wider ml-0.5">
                      Maps →
                    </span>
                  </motion.a>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

