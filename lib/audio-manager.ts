export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isLoaded = false;
  private isPlaying = false;
  private isPreloading = false;
  private progressListeners = new Set<(percent: number, msg?: string) => void>();
  private stateListeners = new Set<(playing: boolean) => void>();
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.stateListeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.stateListeners.delete(cb);
    };
  }

  public subscribeProgress(cb: (percent: number, msg?: string) => void): () => void {
    this.progressListeners.add(cb);
    return () => {
      this.progressListeners.delete(cb);
    };
  }

  private notifyState() {
    this.stateListeners.forEach((cb) => cb(this.isPlaying));
  }

  private notifyProgress(percent: number, msg?: string) {
    this.progressListeners.forEach((cb) => cb(percent, msg));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsLoaded(): boolean {
    return this.isLoaded;
  }

  public async preload(onProgress?: (percent: number) => void): Promise<void> {
    if (typeof window === "undefined") return;
    if (this.isLoaded) {
      onProgress?.(100);
      this.notifyProgress(100, "Royal Soundtrack Ready");
      return;
    }

    if (this.isPreloading) {
      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(interval);
            onProgress?.(100);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 3000);
      });
    }

    this.isPreloading = true;
    if (!this.audio) {
      this.audio = new Audio("/assets/audio/audio.m4a");
      this.audio.loop = true;
      this.audio.preload = "auto";
      this.audio.volume = 0;
    }

    return new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          this.isLoaded = true;
          this.isPreloading = false;
          onProgress?.(100);
          this.notifyProgress(100, "Royal Soundtrack Ready");
          resolve();
        }
      };

      const timer = setTimeout(() => done(), 2500);
      const a = this.audio;
      if (!a) {
        done();
        return;
      }

      if (a.readyState >= 2) {
        clearTimeout(timer);
        done();
        return;
      }

      const handler = () => {
        clearTimeout(timer);
        done();
      };

      a.addEventListener("canplaythrough", handler, { once: true });
      a.addEventListener("canplay", handler, { once: true });
      a.addEventListener("loadeddata", handler, { once: true });
      a.addEventListener("error", () => {
        clearTimeout(timer);
        done();
      }, { once: true });

      try {
        fetch("/assets/audio/audio.m4a", { method: "HEAD" }).catch(() => {});
      } catch {}
    });
  }

  public async play(targetVolume = 0.22, durationMs = 1500): Promise<void> {
    if (typeof window === "undefined") return;
    if (!this.audio) {
      this.audio = new Audio("/assets/audio/audio.m4a");
      this.audio.loop = true;
      this.audio.preload = "auto";
    }

    try {
      this.audio.volume = 0;
      await this.audio.play();
      this.isPlaying = true;
      this.notifyState();
      this.fadeIn(targetVolume, durationMs);
    } catch (err) {
      console.warn("Audio play prevented or deferred:", err);
      this.isPlaying = false;
      this.notifyState();
    }
  }

  public pause(durationMs = 400): void {
    if (this.audio && this.isPlaying) {
      this.fadeOut(durationMs, () => {
        this.isPlaying = false;
        this.notifyState();
      });
    }
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause(300);
    } else {
      this.play(0.22, 600);
    }
  }

  private fadeIn(targetVolume: number, durationMs: number) {
    if (!this.audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = Math.max(16, durationMs / 25);
    const stepVol = targetVolume / 25;
    let currentVol = 0;
    this.audio.volume = 0;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        return;
      }
      currentVol = Math.min(targetVolume, currentVol + stepVol);
      this.audio.volume = currentVol;
      if (currentVol >= targetVolume && this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }
    }, stepMs);
  }

  private fadeOut(durationMs: number, onComplete?: () => void) {
    if (!this.audio) {
      onComplete?.();
      return;
    }
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = Math.max(16, durationMs / 15);
    const currentVol = this.audio.volume;
    const stepVol = currentVol / 15;
    let vol = currentVol;

    this.fadeInterval = setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        onComplete?.();
        return;
      }
      vol = Math.max(0, vol - stepVol);
      this.audio.volume = vol;
      if (vol <= 0) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.audio.pause();
        onComplete?.();
      }
    }, stepMs);
  }
}

export const audioManager = new AudioManager();

