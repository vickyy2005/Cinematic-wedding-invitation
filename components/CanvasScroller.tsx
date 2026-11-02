"use client";

import React, { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";
import { SCENES, SceneConfig } from "@/types/wedding";
import { frameLoader, FRAME_CONFIG } from "@/lib/frame-loader";

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private lastRenderedImage: HTMLImageElement | null = null;
  private dpr = 1;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.resize();
  }

  public resize() {
    if (!this.canvas) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    const targetW = Math.floor(this.width * this.dpr);
    const targetH = Math.floor(this.height * this.dpr);

    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "medium";
    }

    if (this.lastRenderedImage) {
      this.renderImage(this.lastRenderedImage);
    }
  }

  public render(img: HTMLImageElement | null) {
    if (!this.ctx) return;
    const valid = img && img.complete && img.naturalWidth > 0 ? img : null;
    const target = valid || this.lastRenderedImage;
    if (target) {
      this.renderImage(target);
      if (valid) {
        this.lastRenderedImage = valid;
      }
    }
  }

  public renderImage(img: HTMLImageElement) {
    if (!this.ctx || !img.naturalWidth || !img.naturalHeight) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (cw === 0 || ch === 0) return;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.max(cw / nw, ch / nh);
    const drawW = nw * scale;
    const drawH = nh * scale;
    const offsetX = (cw - drawW) * 0.5;
    const offsetY = (ch - drawH) * 0.5;

    this.ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  public destroy() {
    this.lastRenderedImage = null;
    this.ctx = null;
  }
}

interface CanvasScrollerProps {
  progress: MotionValue<number>;
  isActive?: boolean;
}

export function calculateSceneFrame(p: number) {
  const t = Math.max(0, Math.min(1, p));
  let sceneIndex = 0;

  for (let idx = 0; idx < SCENES.length; idx++) {
    const s = SCENES[idx];
    if (t >= s.timelineStart && t <= s.timelineEnd) {
      sceneIndex = idx;
      break;
    }
  }

  if (t >= 0.999) {
    sceneIndex = SCENES.length - 1;
  }

  const activeScene = SCENES[sceneIndex];
  const span = activeScene.timelineEnd - activeScene.timelineStart;
  const localProgress = Math.max(
    0,
    Math.min(1, span > 0 ? (t - activeScene.timelineStart) / span : 0)
  );

  const step = FRAME_CONFIG.frameStep || 1;
  const stepCount = Math.floor((activeScene.frameCount - 1) / step);
  const currentStep = Math.round(localProgress * stepCount);
  const frameNumber = activeScene.startFrame + currentStep * step;

  return {
    globalProgress: t,
    activeScene,
    localProgress,
    frameNumber,
    sceneIndex,
  };
}

export const CanvasScroller: React.FC<CanvasScrollerProps> = ({ progress, isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new CanvasRenderer(canvas);
    rendererRef.current = renderer;

    const firstFrame = frameLoader.getFrame("/assets/frames/aerial/", 1);
    if (firstFrame && firstFrame.complete && firstFrame.naturalWidth > 0) {
      renderer.render(firstFrame);
      lastKeyRef.current = "aerial-1";
    }

    const handleResize = () => {
      renderer.resize();
      lastKeyRef.current = "";
    };
    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => handleResize());
      ro.observe(containerRef.current);
    }

    const loop = () => {
      if (!isActive) return;
      const currentProg = progress.get();
      const calc = calculateSceneFrame(currentProg);
      const frameImg = frameLoader.getFrame(
        calc.activeScene.folder,
        calc.frameNumber,
        calc.activeScene.startFrame,
        calc.activeScene.endFrame
      );

      if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
        const key = `${calc.activeScene.id}-${calc.frameNumber}`;
        if (key !== lastKeyRef.current) {
          renderer.render(frameImg);
          lastKeyRef.current = key;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (isActive) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.destroy();
    };
  }, [progress, isActive]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#070605] select-none pointer-events-none z-0 flex items-center justify-center">
      {/* Desktop side glow backdrop */}
      <div className="hidden md:block absolute inset-0 bg-radial from-gold/5 via-charcoal-dark/40 to-[#070605] pointer-events-none" />

      {/* Frame canvas container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[500px] h-full overflow-hidden shadow-[0_0_90px_rgba(0,0,0,0.95)] md:border-x md:border-gold/20"
      >
        <img
          src="/assets/frames/aerial/ezgif-frame-001.jpg"
          alt="Palace Aerial Approach"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full object-cover block"
          style={{ display: "block" }}
        />
        <div className="hidden md:block absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] z-20" />
      </div>
    </div>
  );
};

