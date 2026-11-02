import { SCENES, SceneConfig } from "@/types/wedding";

export interface FrameConfig {
  prefix: string;
  padding: number;
  frameStep: number;
}

export const FRAME_CONFIG: FrameConfig = {
  prefix: "ezgif-frame-",
  padding: 3,
  frameStep: 2,
};

export function getFrameUrl(folder: string, frameNumber: number): string {
  const normalizedFolder = folder.endsWith("/") ? folder : `${folder}/`;
  const padded = String(frameNumber).padStart(FRAME_CONFIG.padding, "0");
  return `${normalizedFolder}${FRAME_CONFIG.prefix}${padded}.jpg`;
}

export type ProgressCallback = (percent: number, message?: string) => void;

export class FrameLoader {
  private anchorCache = new Map<string, HTMLImageElement>();
  private cache = new Map<string, HTMLImageElement>();
  private inFlight = new Map<string, Promise<HTMLImageElement>>();
  private loadedScenes = new Set<number>();
  private backgroundQueue: number[] = [];
  private isBackgroundLoading = false;
  private isPreloading = false;
  private isInitialReady = false;
  private progressListeners: ProgressCallback[] = [];

  public subscribeProgress(cb: ProgressCallback): () => void {
    this.progressListeners.push(cb);
    return () => {
      this.progressListeners = this.progressListeners.filter((l) => l !== cb);
    };
  }

  private notifyProgress(percent: number, msg?: string) {
    for (const listener of this.progressListeners) {
      listener(percent, msg);
    }
  }

  public async preloadLogos(): Promise<void> {
    if (typeof window === "undefined") return;
    const logos = ["/assets/logo/nk-locked-logo.png", "/assets/logo/nk-short.png"];
    await Promise.all(
      logos.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              if ("decode" in img) {
                img.decode().then(() => resolve()).catch(() => resolve());
              } else {
                resolve();
              }
            };
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    );
  }

  public loadAnchor(url: string): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    const existing = this.anchorCache.get(url);
    if (existing && existing.complete && existing.naturalWidth > 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
      if ("decode" in img) {
        img.decode().then(() => resolve()).catch(() => resolve());
      }
      this.anchorCache.set(url, img);
    });
  }

  public loadImage(url: string): HTMLImageElement {
    const anchor = this.anchorCache.get(url);
    if (anchor) return anchor;

    const cached = this.cache.get(url);
    if (cached) {
      this.cache.delete(url);
      this.cache.set(url, cached);
      return cached;
    }

    if (this.cache.size >= 800) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        const old = this.cache.get(firstKey);
        if (old) {
          old.onload = null;
          old.onerror = null;
        }
        this.cache.delete(firstKey);
      }
    }

    const img = new Image();
    img.src = url;
    this.cache.set(url, img);
    return img;
  }

  public loadFrameAsync(url: string): Promise<HTMLImageElement> {
    const anchor = this.anchorCache.get(url);
    if (anchor && anchor.complete && anchor.naturalWidth > 0) {
      return Promise.resolve(anchor);
    }
    const cached = this.cache.get(url);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
    const inFlight = this.inFlight.get(url);
    if (inFlight) return inFlight;

    const promise = new Promise<HTMLImageElement>((resolve) => {
      const img = this.loadImage(url);
      if (img.complete && img.naturalWidth > 0) {
        resolve(img);
        return;
      }
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          img.onload = null;
          img.onerror = null;
          resolve(img);
        }
      };
      img.onload = done;
      img.onerror = done;
      setTimeout(done, 1200);
    }).finally(() => {
      this.inFlight.delete(url);
    });

    this.inFlight.set(url, promise);
    return promise;
  }

  public async loadBatch(
    urls: string[],
    concurrency = 8,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    if (urls.length === 0) return;
    const total = urls.length;
    let loaded = 0;
    let index = 0;

    const worker = async () => {
      while (index < urls.length) {
        const url = urls[index++];
        await this.loadFrameAsync(url);
        loaded++;
        onProgress?.(loaded, total);
      }
    };

    const count = Math.min(concurrency, urls.length);
    const workers = Array.from({ length: count }, () => worker());
    await Promise.all(workers);
  }

  public getFrame(
    folder: string,
    frameNumber: number,
    startFrame = 1,
    endFrame = 240
  ): HTMLImageElement | null {
    const url = getFrameUrl(folder, frameNumber);
    const anchor = this.anchorCache.get(url);
    if (anchor && anchor.complete && anchor.naturalWidth > 0) {
      return anchor;
    }

    const cached = this.cache.get(url);
    if (cached) {
      this.cache.delete(url);
      this.cache.set(url, cached);
    }

    const step = FRAME_CONFIG.frameStep || 1;
    const maxLookahead = Math.min(frameNumber + 12 * step, endFrame);
    for (let f = frameNumber + step; f <= maxLookahead; f += step) {
      const u = getFrameUrl(folder, f);
      if (!this.cache.has(u) && !this.anchorCache.has(u)) {
        this.loadImage(u);
      }
    }

    const minLookbehind = Math.max(frameNumber - 4 * step, startFrame);
    for (let f = frameNumber - step; f >= minLookbehind; f -= step) {
      const u = getFrameUrl(folder, f);
      if (!this.cache.has(u) && !this.anchorCache.has(u)) {
        this.loadImage(u);
      }
    }

    if (frameNumber > endFrame - 20 * step) {
      this.warmNextScene(folder);
    }

    if (cached && cached.complete && cached.naturalWidth > 0) {
      return cached;
    }

    if (!cached) {
      this.loadImage(url);
    }

    // Fallback search in proximity
    for (let offset = step; offset <= 12 * step; offset += step) {
      const prev = frameNumber - offset;
      if (prev >= startFrame) {
        const u = getFrameUrl(folder, prev);
        const near = this.cache.get(u) || this.anchorCache.get(u);
        if (near && near.complete && near.naturalWidth > 0) return near;
      }
      const next = frameNumber + offset;
      if (next <= endFrame) {
        const u = getFrameUrl(folder, next);
        const near = this.cache.get(u) || this.anchorCache.get(u);
        if (near && near.complete && near.naturalWidth > 0) return near;
      }
    }

    const firstAnchor = this.anchorCache.get(getFrameUrl(folder, startFrame));
    if (firstAnchor && firstAnchor.complete && firstAnchor.naturalWidth > 0) {
      return firstAnchor;
    }

    const globalFirst = this.anchorCache.get(getFrameUrl("/assets/frames/aerial/", 1));
    return globalFirst && globalFirst.complete && globalFirst.naturalWidth > 0
      ? globalFirst
      : null;
  }

  public warmNextScene(folder: string) {
    const clean = (f: string) => f.replace(/%20/g, " ");
    const idx = SCENES.findIndex((s) => clean(s.folder) === clean(folder));
    if (idx !== -1) {
      this.ensureScenesAhead(idx, 2);
    }
  }

  public ensureScenesAhead(sceneIndex: number, lookahead = 2) {
    const needed: number[] = [];
    const maxIdx = SCENES.length - 1;

    for (let i = sceneIndex; i <= Math.min(maxIdx, sceneIndex + lookahead); i++) {
      if (!this.loadedScenes.has(i)) needed.push(i);
    }
    for (let i = sceneIndex + lookahead + 1; i <= maxIdx; i++) {
      if (!this.loadedScenes.has(i) && !needed.includes(i)) needed.push(i);
    }
    for (let i = 0; i < sceneIndex; i++) {
      if (!this.loadedScenes.has(i) && !needed.includes(i)) needed.push(i);
    }

    if (needed.length === 0) return;

    const queue = [...needed];
    for (const item of this.backgroundQueue) {
      if (!queue.includes(item) && !this.loadedScenes.has(item)) {
        queue.push(item);
      }
    }
    this.backgroundQueue = queue;
    this.processBackgroundQueue();
  }

  private async processBackgroundQueue() {
    if (this.isBackgroundLoading) return;
    this.isBackgroundLoading = true;
    try {
      while (this.backgroundQueue.length > 0) {
        const nextScene = this.backgroundQueue.shift();
        if (nextScene === undefined || this.loadedScenes.has(nextScene)) continue;
        const scene = SCENES[nextScene];
        if (!scene) continue;

        const step = FRAME_CONFIG.frameStep || 2;
        const urls: string[] = [];
        for (let f = scene.startFrame; f <= scene.endFrame; f += step) {
          urls.push(getFrameUrl(scene.folder, f));
        }
        await this.loadBatch(urls, 6);
        this.loadedScenes.add(nextScene);
        await new Promise((r) => setTimeout(r, 60));
      }
    } finally {
      this.isBackgroundLoading = false;
    }
  }

  public async startPreload(onReady?: () => void): Promise<void> {
    if (this.isInitialReady) {
      this.notifyProgress(100, "Welcome to Nisarg Weds Khushi's Celebration");
      onReady?.();
      return;
    }

    if (this.isPreloading) return;
    this.isPreloading = true;

    try {
      this.notifyProgress(5, "“Preparing the doors to our celebration…”");
      const pLogos = this.preloadLogos();

      const pAnchors = Promise.all(
        SCENES.map((s) => this.loadAnchor(getFrameUrl(s.folder, s.startFrame)))
      );

      const step = FRAME_CONFIG.frameStep || 2;
      const initialUrls: string[] = [];

      // Preload first 10 frames of Scene 0 for instant start
      const s0 = SCENES[0];
      if (s0) {
        const limit = Math.min(s0.startFrame + 10 * step, s0.endFrame);
        for (let f = s0.startFrame; f <= limit; f += step) {
          initialUrls.push(getFrameUrl(s0.folder, f));
        }
      }

      const totalInitial = initialUrls.length;
      const pBatch = this.loadBatch(initialUrls, 20, (loaded) => {
        const pct = Math.min(99, Math.round(10 + (loaded / totalInitial) * 89));
        const phrase =
          pct < 32
            ? "Gathering the colours…"
            : pct < 50
            ? "Lighting the way…"
            : pct < 70
            ? "Setting the stage…"
            : pct < 88
            ? "Unfolding the story…"
            : "Almost ready…";
        this.notifyProgress(pct, phrase);
      });

      await Promise.all([pLogos, pAnchors, pBatch]);
      this.loadedScenes.add(0);
    } catch (err) {
      console.warn("Preload warning:", err);
    } finally {
      this.isInitialReady = true;
      this.notifyProgress(100, "“The celebration begins.”");
      onReady?.();
      this.ensureScenesAhead(0, 2);
    }
  }
}

export const frameLoader = new FrameLoader();

