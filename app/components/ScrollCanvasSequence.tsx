"use client";

import React, { useEffect, useRef } from "react";

interface ScrollCanvasSequenceProps {
  totalFrames?: number;
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
  overlayClassName?: string;
}

export default function ScrollCanvasSequence({
  totalFrames = 232,
  containerRef,
  className = "",
  overlayClassName = "",
}: ScrollCanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadedFramesSet = useRef<Set<number>>(new Set());

  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isRunningRef = useRef<boolean>(true);
  const animationFrameIdRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  // Helper to format frame path
  const getFrameUrl = (frameIndex: number, ext: "jpg" | "png" = "jpg") => {
    const padded = String(frameIndex).padStart(3, "0");
    return `/frames/ezgif-frame-${padded}.${ext}`;
  };

  // Find the closest loaded frame to avoid any black frame or flicker
  const getClosestLoadedImage = (target: number): HTMLImageElement | null => {
    if (loadedFramesSet.current.has(target)) {
      return imagesCacheRef.current.get(target) || null;
    }

    // Search outward for the nearest available loaded frame
    for (let offset = 1; offset < totalFrames; offset++) {
      const lower = target - offset;
      if (lower >= 1 && loadedFramesSet.current.has(lower)) {
        return imagesCacheRef.current.get(lower) || null;
      }
      const upper = target + offset;
      if (upper <= totalFrames && loadedFramesSet.current.has(upper)) {
        return imagesCacheRef.current.get(upper) || null;
      }
    }
    return null;
  };

  // Draw frame on canvas with object-fit: cover and DPR support
  const renderFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = getClosestLoadedImage(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = dprRef.current;
    const canvasLogicalWidth = canvas.width / dpr;
    const canvasLogicalHeight = canvas.height / dpr;

    // Calculate object-fit: cover
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = canvasLogicalWidth / canvasLogicalHeight;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (canvasAspect > imgAspect) {
      drawWidth = canvasLogicalWidth;
      drawHeight = canvasLogicalWidth / imgAspect;
      drawX = 0;
      drawY = (canvasLogicalHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasLogicalHeight;
      drawWidth = canvasLogicalHeight * imgAspect;
      drawX = (canvasLogicalWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvasLogicalWidth, canvasLogicalHeight);
    // Draw high quality image
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    lastDrawnFrameRef.current = frameNum;
  };

  // Adjust canvas resolution for high-DPI (Retina) displays
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cap DPR at 1.5 for optimal mobile & desktop performance without GPU throttling
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    dprRef.current = dpr;

    const width = window.innerWidth;
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    // Force redraw current frame on resize
    renderFrame(Math.round(currentFrameRef.current));
  };

  // Calculate scroll position relative to container
  const updateScrollProgress = () => {
    const container = containerRef?.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const scrollableDistance = rect.height - vh;

    if (scrollableDistance > 0) {
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      const target = 1 + progress * (totalFrames - 1);
      targetFrameRef.current = target;
    }
  };

  useEffect(() => {
    isRunningRef.current = true;

    // Initialize canvas size
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("orientationchange", resizeCanvas, { passive: true });

    // Scroll & Touch listeners for smooth mobile touch feedback
    const onScroll = () => {
      updateScrollProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    updateScrollProgress();

    // Check user motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener?.("change", onMotionChange);

    // ================= PERSISTENT ANIMATION LOOP =================
    const animationLoop = () => {
      if (!isRunningRef.current) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      // Smooth interpolation (lerp)
      const lerpFactor = prefersReducedMotion ? 1 : 0.14;
      const delta = target - current;

      if (Math.abs(delta) > 0.001) {
        currentFrameRef.current = current + delta * lerpFactor;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastDrawnFrameRef.current) {
        renderFrame(frameToDraw);
      }

      animationFrameIdRef.current = requestAnimationFrame(animationLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(animationLoop);

    // ================= PROGRESSIVE FRAME PRELOADING =================
    // Helper to load a single frame with fallback
    const loadSingleFrame = (frameNum: number): Promise<void> => {
      return new Promise((resolve) => {
        if (loadedFramesSet.current.has(frameNum)) {
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          imagesCacheRef.current.set(frameNum, img);
          loadedFramesSet.current.add(frameNum);

          // If this loaded frame is what we are currently viewing, redraw immediately!
          const activeFrame = Math.round(currentFrameRef.current);
          if (
            activeFrame === frameNum ||
            lastDrawnFrameRef.current === -1 ||
            Math.abs(activeFrame - frameNum) < 3
          ) {
            renderFrame(activeFrame);
          }
          resolve();
        };

        img.onerror = () => {
          // Fallback to .png if .jpg failed
          const fallback = new Image();
          fallback.crossOrigin = "anonymous";
          fallback.onload = () => {
            imagesCacheRef.current.set(frameNum, fallback);
            loadedFramesSet.current.add(frameNum);
            renderFrame(Math.round(currentFrameRef.current));
            resolve();
          };
          fallback.onerror = () => resolve();
          fallback.src = getFrameUrl(frameNum, "png");
        };

        img.src = getFrameUrl(frameNum, "jpg");
      });
    };

    // Preload Strategy:
    // 1. Immediately load Frame 1 (critical initial paint)
    // 2. Load evenly spaced keyframes (step 10) so scrubbing is instant
    // 3. Incrementally load all remaining frames in non-blocking batches
    loadSingleFrame(1).then(() => {
      renderFrame(1);

      // Phase 2: Keyframes across the sequence
      const keyframes: number[] = [];
      for (let i = 1; i <= totalFrames; i += 8) {
        keyframes.push(i);
      }
      if (!keyframes.includes(totalFrames)) {
        keyframes.push(totalFrames);
      }

      const loadKeyframes = async () => {
        for (const k of keyframes) {
          if (!isRunningRef.current) break;
          await loadSingleFrame(k);
        }

        // Phase 3: Fill in all other frames in progressive chunks
        const allFrames: number[] = [];
        for (let i = 1; i <= totalFrames; i++) {
          if (!loadedFramesSet.current.has(i)) {
            allFrames.push(i);
          }
        }

        // Load 4 at a time to prevent saturating the network or UI thread
        const CHUNK_SIZE = 4;
        for (let i = 0; i < allFrames.length; i += CHUNK_SIZE) {
          if (!isRunningRef.current) break;
          const chunk = allFrames.slice(i, i + CHUNK_SIZE);
          await Promise.all(chunk.map((num) => loadSingleFrame(num)));
          // Yield to main thread
          await new Promise((r) => setTimeout(r, 12));
        }
      };

      loadKeyframes();
    });

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
      mediaQuery.removeEventListener?.("change", onMotionChange);
    };
  }, [totalFrames, containerRef]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Pinned HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Cinematic Vignette & Gradient Overlay for Contrast & Luxury Feel */}
      <div
        className={`absolute inset-0 pointer-events-none ${overlayClassName}`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%), linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </div>
  );
}
