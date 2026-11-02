"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, ChevronDown } from "lucide-react";
import { CELEBRATION_EVENTS, CelebrationEvent } from "@/types/wedding";

interface CelebrationsScreenProps {
  onReplayJourney: () => void;
}

const TARGET_WEDDING_DATE = new Date("2026-11-21T09:30:00+05:30").getTime();

export const CelebrationsScreen: React.FC<CelebrationsScreenProps> = ({ onReplayJourney }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const updateCountdown = () => {
      const diff = Math.max(0, TARGET_WEDDING_DATE - Date.now());
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToCelebrations = () => {
    const el = document.getElementById("celebrations");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadSingleIcs = (event: CelebrationEvent) => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nisarg Weds Khushi Wedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Nisarg Weds Khushi: ${event.title}`,
      `DESCRIPTION:${event.subtitle}\\n${event.note || ""}\\n\\nGoogle Maps: ${event.mapUrl}`,
      `LOCATION:${event.venue}`,
      `DTSTART:${event.isoDateStart}`,
      `DTEND:${event.isoDateEnd}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `NWK-${event.id}-2026.ics`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllIcs = () => {
    const eventsBlock = CELEBRATION_EVENTS.map((e) =>
      [
        "BEGIN:VEVENT",
        `SUMMARY:Nisarg Weds Khushi: ${e.title}`,
        `DESCRIPTION:${e.subtitle}\\n${e.note || ""}\\n\\nGoogle Maps: ${e.mapUrl}`,
        `LOCATION:${e.venue}`,
        `DTSTART:${e.isoDateStart}`,
        `DTEND:${e.isoDateEnd}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n")
    ).join("\r\n");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nisarg Weds Khushi Wedding//EN",
      eventsBlock,
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "Nisarg-Weds-Khushi-All-Celebrations.ics");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getGoogleCalendarUrl = (event: CelebrationEvent) => {
    const text = encodeURIComponent(`Nisarg Weds Khushi: ${event.title}`);
    const details = encodeURIComponent(
      `${event.subtitle}\n${event.note || ""}\n\nGoogle Maps: ${event.mapUrl}`
    );
    const location = encodeURIComponent(event.venue);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${event.isoDateStart}/${event.isoDateEnd}&details=${details}&location=${location}`;
  };

  return (
    <div
      id="wedding-website"
      className="relative z-20 bg-black/45 sm:bg-black/50 backdrop-blur-sm text-ivory selection:bg-gold selection:text-charcoal-dark w-full max-w-[500px] mx-auto min-h-screen md:border-x md:border-gold/30 shadow-[0_0_100px_rgba(0,0,0,0.85)] pb-14"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 bg-black/50 backdrop-blur-sm border-b border-gold/20">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-md overflow-hidden border border-gold/30 bg-[#FAF3EA]">
            <Image
              src="/assets/logo/nk-locked-logo.png"
              alt="NK Locked Monogram"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-sm tracking-wider text-ivory uppercase font-medium">
            Nisarg Weds Khushi
          </span>
        </div>

        <button
          onClick={onReplayJourney}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold/50 bg-gold/15 hover:bg-gold hover:text-charcoal-dark text-gold text-xs font-sans uppercase tracking-wider transition-all cursor-pointer shadow-sm font-semibold"
        >
          <span>Replay</span>
          <span>↑</span>
        </button>
      </div>

      {/* Hero Welcome */}
      <section className="relative pt-16 pb-8 px-4 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_8px_25px_rgba(0,0,0,0.4)] bg-[#FAF3EA]">
            <Image
              src="/assets/logo/nk-locked-logo.png"
              alt="Nisarg Weds Khushi Monogram"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h1 className="font-serif text-[clamp(2rem,8.4vw,3.75rem)] font-normal tracking-wide text-ivory mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Nisarg Weds Khushi
          </h1>

          <p className="font-serif italic text-[clamp(1.15rem,4.65vw,1.875rem)] text-gold-light mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            “A Celebration of Love &amp; Happiness”
          </p>

          <div className="flex items-center gap-3 text-[clamp(0.8rem,3.25vw,1rem)] font-sans tracking-luxury uppercase text-ivory-warm/90 font-medium">
            <span>21 Nov</span>
            <span className="text-gold">•</span>
            <span>23 Nov</span>
            <span className="text-gold">•</span>
            <span>24 Nov 2026</span>
          </div>

          <button
            onClick={scrollToCelebrations}
            className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold text-[11px] sm:text-xs font-sans tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-sm group"
            aria-label="Scroll down to itinerary"
          >
            <span>Scroll Down to Itinerary</span>
            <ChevronDown className="w-3.5 h-3.5 text-gold group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Countdown section */}
      <section id="countdown" className="px-3.5 sm:px-4 py-6 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-[clamp(10px,2.5vw,12px)] font-sans tracking-luxury uppercase text-gold font-medium">
                Counting Down To The Celebration
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.75rem,7vw,3rem)] text-ivory font-light tracking-wide mb-2">
              The Grand Countdown
            </h2>
            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-2.5 mb-2.5" />
            <p className="font-sans text-[clamp(0.8rem,3.25vw,0.95rem)] text-ivory-warm/80">
              Until the sacred festivities commence on 21 November 2026
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl border border-gold/30 bg-black/20 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center py-3 sm:py-4 px-1 rounded-xl bg-black/30 border border-white/10 relative overflow-hidden shadow-inner"
              >
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <span className="font-serif text-[clamp(1.75rem,7vw,3.75rem)] text-[#FFF4E3] font-normal tracking-tight drop-shadow-[0_2px_14px_rgba(212,175,55,0.5)]">
                  {hasMounted ? String(item.value).padStart(2, "0") : "--"}
                </span>
                <span className="font-sans text-[clamp(9px,2.3vw,12px)] uppercase tracking-luxury text-gold mt-1.5 font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <button
              onClick={scrollToCelebrations}
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/50 bg-black/45 hover:bg-gold hover:text-charcoal-dark text-gold transition-all duration-300 shadow-md cursor-pointer select-none"
              aria-label="Scroll down to view events"
            >
              <span className="font-sans text-[clamp(11px,2.6vw,12px)] uppercase tracking-[0.25em] font-semibold">
                Scroll Down to View Events
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-gold group-hover:text-charcoal-dark" />
              </motion.div>
            </button>
          </div>
        </div>
      </section>

      {/* Celebrations itinerary section */}
      <section id="celebrations" className="py-8 sm:py-12 px-3.5 sm:px-4 relative">
        <div className="w-full mx-auto">
          <div className="text-center max-w-md mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs font-sans tracking-luxury uppercase text-gold font-medium">
                Ceremonies &amp; Festivities
              </span>
            </div>
            <h2 className="font-serif text-[clamp(1.75rem,7vw,3rem)] text-ivory font-light tracking-wide mb-2.5">
              The Celebrations
            </h2>
            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-3.5" />
            <p className="font-sans text-[clamp(0.85rem,3.25vw,1rem)] text-ivory-warm/80 leading-relaxed px-2">
              Each ceremony marks a sacred milestone in our journey of eternal love. We cordially
              invite you to partake in every cherished celebration.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={downloadAllIcs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/50 bg-gold/15 hover:bg-gold hover:text-charcoal-dark text-gold font-sans text-[clamp(0.75rem,2.8vw,0.875rem)] uppercase tracking-luxury font-semibold transition-all shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Add All Events to Calendar (.ics)</span>
            </button>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {CELEBRATION_EVENTS.map((event, idx) => (
              <div
                key={event.id}
                className="relative rounded-2xl border border-white/15 bg-black/35 hover:bg-black/45 backdrop-blur-md p-4 sm:p-5 hover:border-gold/50 transition-all duration-300 shadow-xl overflow-hidden group"
              >
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gold-muted uppercase tracking-wider font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="text-white/20">•</span>
                      <span
                        className={`text-[clamp(9px,2.4vw,11px)] font-sans tracking-luxury uppercase font-semibold px-2.5 py-0.5 rounded-full border ${event.themeAccent} bg-white/5`}
                      >
                        {event.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Google Calendar Link */}
                      <a
                        href={getGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Add to Google Calendar"
                        aria-label={`Add ${event.title} to Google Calendar`}
                        className="p-1.5 sm:p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 hover:border-gold/60 transition-all cursor-pointer flex items-center justify-center group/btn shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                      </a>

                      {/* Apple Calendar Download */}
                      <button
                        onClick={() => downloadSingleIcs(event)}
                        title="Add to Apple Calendar (.ics)"
                        aria-label={`Add ${event.title} to Apple Calendar`}
                        className="p-1.5 sm:p-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 hover:border-gold/60 transition-all cursor-pointer flex items-center justify-center text-white/90 hover:text-white shadow-sm"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                          viewBox="0 0 170 170"
                        >
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.79-11.77-14.23-6.2-9.67-11.07-20.91-14.61-33.71-3.53-12.8-5.3-24.87-5.3-36.21 0-14.93 3.6-27.42 10.8-37.47 7.21-10.05 16.51-15.17 27.9-15.39 5.34 0 11.07 1.3 17.18 3.9 6.11 2.61 10.15 4.02 12.12 4.24 1.85-.22 5.99-1.63 12.42-4.24 6.43-2.61 12.04-3.8 16.84-3.59 13.29.65 23.86 5.56 31.7 14.73-11.75 7.18-17.51 16.97-17.29 29.37.22 9.68 3.92 17.84 11.11 24.48 7.18 6.64 15.66 10.34 25.46 11.1-2.39 7.4-5.34 14.68-8.86 21.84zm-37.19-111.4c0-7.07 2.53-13.67 7.59-19.8 5.06-6.14 11.39-10.17 18.99-12.09.22 1.3.33 2.5.33 3.59 0 7.18-2.67 14.03-8.01 20.56-5.34 6.53-11.97 10.45-19.9 11.75-.43-1.3-.67-2.61-1-4.01z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-[clamp(1.25rem,5.6vw,1.875rem)] text-ivory font-normal tracking-wide group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                    <p className="font-serif italic text-[clamp(0.8rem,3.25vw,1rem)] text-ivory-warm/85 mt-0.5">
                      {event.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[clamp(0.75rem,2.8vw,0.875rem)] text-ivory-warm/90 pt-0.5 font-medium">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      {event.mapUrl ? (
                        <a
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leading-snug hover:text-gold transition-colors underline decoration-gold/40 hover:decoration-gold underline-offset-2 flex flex-wrap items-center gap-1.5"
                          title={`Open ${event.venue} in Google Maps`}
                        >
                          <span>{event.venue}</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] uppercase font-sans tracking-wider px-1.5 py-0.5 rounded bg-gold/15 text-gold font-semibold border border-gold/40 no-underline shrink-0 shadow-xs">
                            Maps →
                          </span>
                        </a>
                      ) : (
                        <span className="leading-snug">{event.venue}</span>
                      )}
                    </div>
                  </div>

                  {event.note && (
                    <p className="text-xs sm:text-sm font-sans tracking-wide text-gold-light/95 italic bg-gold/5 border-l-2 border-gold/60 pl-2.5 py-1 rounded-r">
                      {event.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-4 border-t border-gold/20 text-center relative overflow-hidden bg-black/45">
        <div className="w-full flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_6px_20px_rgba(0,0,0,0.35)] bg-[#FAF3EA]">
            <Image
              src="/assets/logo/nk-locked-logo.png"
              alt="Nisarg Weds Khushi Insignia"
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-serif text-[clamp(1.15rem,4.8vw,1.75rem)] tracking-[0.14em] text-ivory uppercase font-normal mb-1.5 whitespace-nowrap">
            Nisarg Weds Khushi
          </h3>

          <p className="font-serif italic text-[clamp(0.8rem,3.25vw,1rem)] text-gold-muted mb-6 tracking-wide">
            “A Celebration of Love &amp; Happiness”
          </p>

          <button
            onClick={onReplayJourney}
            className="px-7 py-3 rounded-full border border-gold/40 bg-gold/10 hover:bg-gold hover:text-charcoal-dark text-gold text-[clamp(0.75rem,2.8vw,0.875rem)] font-sans uppercase tracking-regal transition-all cursor-pointer mb-6 shadow-lg flex items-center gap-2 group font-semibold"
          >
            <span>Replay Cinematic Journey</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>

          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-3.5" />
          <p className="font-sans text-xs tracking-widest text-ivory-warm/60 uppercase font-medium">
            21 • 23 • 24 November 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

