"use client";

import React, { useState } from "react";
import { Preloader } from "@/components/Preloader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CinematicJourney } from "@/components/CinematicJourney";

export default function Home() {
  const [isStarting, setIsStarting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);

  const active = hasEntered || isStarting;

  return (
    <main className="relative min-h-screen bg-[#070605] overflow-x-hidden selection:bg-gold selection:text-charcoal-dark">
      {/* Intro Preloader */}
      {!hasEntered && (
        <Preloader
          onStartEnter={() => setIsStarting(true)}
          onComplete={() => {
            setHasEntered(true);
            setIsStarting(false);
          }}
        />
      )}

      {/* Floating Sound Toggle */}
      <AudioPlayer hasEntered={active} />

      {/* Main Cinematic Visuals & Journey Controller */}
      <CinematicJourney
        hasEntered={active}
        onCelebrationStateChange={(isActive) => setIsCelebrationActive(isActive)}
      />
    </main>
  );
}

