"use client";

import React, { useState, useEffect, useRef } from "react";
import ScrollCanvasSequence from "./components/ScrollCanvasSequence";
import InfiniteLogoCarousel from "./components/InfiniteLogoCarousel";
import BentoGridSection from "./components/BentoGridSection";
import ArchitecturalVisualizerSection from "./components/ArchitecturalVisualizerSection";

// Curated minimalist prompt inspirations
const SAMPLE_PROMPTS = [
  "Minimalist architectural pavilion in volcanic black stone, ambient twilight, 8k",
  "Monochrome sculptural glass prism refracting soft white light in pure void",
  "Editorial haute couture portrait, stark high-contrast studio chiaroscuro",
  "Brutalist concrete monolith surrounded by still black water, misty dawn",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState("Minimalist");
  const [copied, setCopied] = useState(false);

  // Cycle prompt examples automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleStartCreating = () => {
    setUserPrompt(SAMPLE_PROMPTS[activePromptIndex]);
    setModalOpen(true);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(SAMPLE_PROMPTS[activePromptIndex]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runMockGeneration = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div className="relative w-full bg-black text-white selection:bg-zinc-800 selection:text-white">
      {/* ================= EXISTING HERO SECTION (400vh PINNED CANVAS) ================= */}
      <div
        ref={containerRef}
        className="relative w-full h-[400vh] bg-black"
      >
        {/* Sticky full-screen viewport pinned during the 400vh scroll */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Cinematic scroll-linked HTML5 canvas sequence */}
        <ScrollCanvasSequence totalFrames={232} containerRef={containerRef} />

        {/* Large smooth cinematic dark shadow/gradient behind left headline (strongest at 10-25%, fading out to 45-50%) */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.82) 15%, rgba(0,0,0,0.65) 25%, rgba(0,0,0,0.3) 38%, rgba(0,0,0,0.08) 46%, rgba(0,0,0,0) 52%)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 left-0 w-[55vw] pointer-events-none z-[6]"
          style={{
            background:
              "radial-gradient(ellipse 90% 75% at 5% 42%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.62) 32%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 85%)",
          }}
        />

      {/* ================= TOP HEADER / BRAND BADGE ================= */}
      <header className="relative z-40 w-full px-4 pt-5 sm:px-10 sm:pt-8 md:px-12 md:pt-10 flex items-center justify-between pointer-events-auto shrink-0">
        {/* Minimalist Brand Pill Badge with Burger Menu Toggle */}
        <div className="relative">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 group shadow-lg">
            {/* Orange/gold iris glyph */}
            <div className="relative flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0">
              <span className="absolute inset-0 rounded-full border-[1.8px] border-[#dfb479]" />
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border-[1.4px] border-[#dfb479]" />
              <span className="w-1 h-1 rounded-full bg-[#dfb479]" />
            </div>

            {/* Brand text */}
            <span className="text-[13px] sm:text-[15px] font-medium tracking-tight text-white select-none">
              INT-VFX
            </span>

            {/* Subtle separator */}
            <div className="w-[1px] h-3 bg-zinc-800 mx-0.5" />

            {/* Minimalist hamburger menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center gap-[4px] w-5 h-5 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
              id="brand-menu-toggle"
            >
              <span
                className={`w-3.5 h-[1.5px] bg-zinc-300 rounded-full transition-transform duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[2.8px] bg-[#dfb479]" : ""
                }`}
              />
              <span
                className={`w-3.5 h-[1.5px] bg-zinc-300 rounded-full transition-transform duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[2.8px] bg-[#dfb479]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Top-Right Prompt Pill - Minimalist Accent */}
        <div className="hidden md:flex items-center gap-3">
          <div
            onClick={handleCopyPrompt}
            title="Click to copy prompt"
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-zinc-400 max-w-[280px] truncate font-mono font-normal">
              {SAMPLE_PROMPTS[activePromptIndex]}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 group-hover:text-zinc-200 transition-colors">
              {copied ? "Copied" : "Copy"}
            </span>
          </div>
        </div>
      </header>

      {/* ================= FULL-SCREEN GLASSMORPHISM MOBILE BURGER OVERLAY ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/85 backdrop-blur-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
          {/* Top Header inside overlay */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                <span className="absolute inset-0 rounded-full border-[1.8px] border-[#dfb479]" />
                <span className="w-3 h-3 rounded-full border-[1.4px] border-[#dfb479]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479]" />
              </div>
              <span className="text-base font-semibold tracking-wider font-mono text-white">
                INT-VFX
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#dfb479] font-mono border border-[#dfb479]/30">
                SPATIAL OS
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-base transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links with numbers and hover gold states */}
          <nav className="flex flex-col gap-4 sm:gap-6 my-auto py-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#dfb479]">
              Spatial Navigation
            </span>
            {[
              { num: "01", label: "Structural Partners", href: "#partners" },
              { num: "02", label: "Architectural Realization", href: "#bento-grid" },
              { num: "03", label: "BIM Level 3 Digital Twins", href: "#bento-grid" },
              { num: "04", label: "3D Spatial Visualizer", href: "#architectural-visualizer" },
              { num: "05", label: "Diurnal Lighting & Climate", href: "#architectural-visualizer" },
            ].map((link) => (
              <a
                key={link.num}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between text-2xl sm:text-3xl font-light text-zinc-300 hover:text-white transition-all py-1.5 border-b border-white/5 hover:border-[#dfb479]/30"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-mono text-[#dfb479] group-hover:translate-x-1 transition-transform">
                    {link.num}
                  </span>
                  <span className="font-sans group-hover:translate-x-1.5 transition-transform">
                    {link.label}
                  </span>
                </div>
                <span className="text-zinc-600 group-hover:text-[#dfb479] transition-colors text-lg">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom Info & CTA inside overlay */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300 font-medium">
                NYC • LON • DXB
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                | 24/7 ACTIVE
              </span>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleStartCreating();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#dfb479] via-[#cfa062] to-[#b88544] text-black font-semibold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-lg text-center"
            >
              Launch Studio Experience →
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN HERO EDITORIAL CONTENT AREA ================= */}
      <main className="relative flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-10 md:px-14 lg:px-16 flex flex-col justify-between pt-6 sm:pt-10 md:pt-14 pb-0 z-20">
        {/* Desktop & Tablet Split Columns */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start gap-3 sm:gap-4 z-30 pointer-events-auto">
            {/* Luxury Architectural Visualization Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/60 border border-[#c5a880]/35 backdrop-blur-md shadow-[0_2px_14px_rgba(0,0,0,0.6)] max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] shrink-0" />
              <span className="text-[9.5px] xs:text-[10px] sm:text-[11.5px] font-medium tracking-[0.14em] sm:tracking-[0.2em] text-[#e8d5bc] uppercase font-mono truncate">
                ARCHITECTURAL VISUALIZATION &amp; INTERIOR DESIGN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] shrink-0" />
            </div>

            {/* Main Editorial Headline - Scaled gracefully on mobile screens */}
            <h1
              className="text-[25px] xs:text-[28px] sm:text-4xl md:text-[44px] lg:text-[50px] font-semibold sm:font-bold tracking-[-0.03em] leading-[1.16] sm:leading-[1.12] max-w-[480px] bg-gradient-to-br from-white via-[#f7f2ea] to-[#d8b584] bg-clip-text text-transparent"
              style={{
                filter:
                  "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(216, 181, 132, 0.22))",
              }}
            >
              Next-Gen Interior <br className="hidden sm:inline" />
              Design &amp; Construction <br className="hidden sm:inline" />
              for Bold Builders
            </h1>
          </div>

          {/* Spacer for Balanced Negative Space */}
          <div className="hidden md:block md:col-span-1 lg:col-span-2" />

          {/* ================= RIGHT COLUMN ================= */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col items-start md:items-start lg:pl-8 gap-4 sm:gap-6 z-30 pointer-events-auto">
            {/* Supporting Description */}
            <p className="text-[13.5px] sm:text-[15px] text-zinc-300/90 font-light leading-[1.65] sm:leading-[1.7] max-w-[370px] tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Transform raw construction sites into hyper-realistic luxury
              living spaces, cinematic architectural arts, and high-end property
              concepts in milliseconds with state-of-the-art latent diffusion.
            </p>

            {/* Warm-Gold Luxury CTA Button matching screenshot */}
            <button
              onClick={handleStartCreating}
              id="cta-start-creating"
              className="group relative inline-flex items-center gap-3.5 pl-2 pr-5 sm:pl-2.5 sm:pr-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#dfb479] via-[#cfa062] to-[#b88544] hover:from-[#e8be85] hover:to-[#c6914f] text-black shadow-[0_4px_22px_rgba(207,160,98,0.35)] hover:shadow-[0_6px_30px_rgba(207,160,98,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {/* Circular black button inside with gold arrow */}
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/90 flex items-center justify-center text-[#dfb479] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>

              {/* Button Label */}
              <span className="text-[12.5px] sm:text-[13.5px] font-semibold tracking-wider uppercase select-none text-black">
                Explore Portfolio
              </span>
            </button>
          </div>
        </div>

        {/* ================= OVERSIZED BRAND TEXT "INT-VFX" ================= */}
        {/* Centered horizontally, ~90vw wide, positioned at bottom, scaled safely on mobile */}
        <div className="relative w-full z-10 pointer-events-none select-none overflow-hidden flex items-end justify-center pt-12 sm:pt-24 pb-2 sm:pb-3">
          <div className="w-[90vw] max-w-[90vw] mx-auto flex items-center justify-center">
            <h2
              className="w-full text-center font-bold tracking-[-0.035em] uppercase leading-[0.78] whitespace-nowrap bg-gradient-to-b from-white via-[#f7f2ea] to-[#cfab75] bg-clip-text text-transparent select-none"
              style={{
                fontSize: "clamp(2.75rem, 14vw, 17.5rem)",
                fontFamily:
                  "var(--font-syne), var(--font-geist-sans), system-ui, sans-serif",
                filter:
                  "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 45px rgba(207, 171, 117, 0.22))",
              }}
            >
              INT-VFX
            </h2>
          </div>
        </div>

        {/* ================= BOTTOM RIGHT FLOATING CIRCULAR BUTTON ================= */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-12 z-30 pointer-events-auto">
          <button
            onClick={() => setModalOpen(true)}
            id="bottom-explore-btn"
            title="Explore AI Prompt Studio"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 group cursor-pointer"
            aria-label="Explore prompt showcase"
          >
            <svg
              className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </button>
        </div>
      </main>
      </div>
      </div>

      {/* ================= SECTION 1: INFINITE LOGO CAROUSEL ================= */}
      <InfiniteLogoCarousel />

      {/* ================= SECTION 2: ASYMMETRIC BENTO GRID ================= */}
      <BentoGridSection />

      {/* ================= SECTION 3: 3D ARCHITECTURAL VISUALIZER ================= */}
      <ArchitecturalVisualizerSection />

      {/* ================= SLEEK LUXURY DARK ARCHITECTURAL FOOTER ================= */}
      <footer className="relative w-full bg-[#050507] text-white overflow-hidden border-t border-zinc-800/80">
        {/* Subtle top gold accent line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#dfb479]/40 to-transparent" />
        
        {/* Ambient background glow */}
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#dfb479]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-12">
          {/* Main 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-zinc-800/80">
            {/* Column 1: Brand & Identity (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start gap-5">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                  <span className="absolute inset-0 rounded-full border-[1.8px] border-[#dfb479]" />
                  <span className="w-3 h-3 rounded-full border-[1.4px] border-[#dfb479]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479]" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  INT-VFX
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#dfb479] font-mono border border-[#dfb479]/30">
                  SPATIAL DIGITAL TWINS
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
                Next-generation architectural visualization and precision digital twin engineering. Synthesizing structural BIM intelligence into ultra-prime visual reality.
              </p>

              {/* Live Studio Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NYC • LON • DXB</span>
                <span className="text-zinc-600">|</span>
                <span className="text-[#dfb479]">24/7 Global Studios</span>
              </div>
            </div>

            {/* Column 2: Architectural Solutions (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dfb479] font-medium mb-1">
                Platform Solutions
              </span>
              <ul className="flex flex-col gap-2.5 text-xs text-zinc-400 font-light">
                <li>
                  <a href="#partners" className="hover:text-white transition-colors">
                    Structural Engineering
                  </a>
                </li>
                <li>
                  <a href="#bento-grid" className="hover:text-white transition-colors">
                    Before &amp; After Twins
                  </a>
                </li>
                <li>
                  <a href="#architectural-visualizer" className="hover:text-white transition-colors">
                    3D Spatial Visualizer
                  </a>
                </li>
                <li>
                  <a href="#bento-grid" className="hover:text-white transition-colors">
                    BIM Level 3 Bidirectional
                  </a>
                </li>
                <li>
                  <a href="#architectural-visualizer" className="hover:text-white transition-colors">
                    PBR Material Palettes
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Studio Locations (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dfb479] font-medium mb-1">
                Studio Coordinates
              </span>
              <div className="flex flex-col gap-3 text-xs text-zinc-400 font-light">
                <div>
                  <div className="text-white font-mono text-[11px] font-medium">NEW YORK (HQ)</div>
                  <div className="text-zinc-500">432 Park Avenue, Floor 54 • NY 10022</div>
                </div>
                <div>
                  <div className="text-white font-mono text-[11px] font-medium">LONDON</div>
                  <div className="text-zinc-500">100 Bishopsgate • EC2N 4AG</div>
                </div>
                <div>
                  <div className="text-white font-mono text-[11px] font-medium">DUBAI</div>
                  <div className="text-zinc-500">DIFC Gate Precinct 4 • Level 07</div>
                </div>
              </div>
            </div>

            {/* Column 4: Social & Inquiries (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#dfb479] font-medium mb-1">
                Connect
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-light">
                <a
                  href="mailto:studio@int-vfx.com"
                  className="text-white hover:text-[#dfb479] transition-colors font-mono text-[11px]"
                >
                  studio@int-vfx.com
                </a>
                <span className="text-[11px] text-zinc-500">Ultra-Prime Inquiries</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2.5 mt-2">
                {[
                  {
                    name: "X (Twitter)",
                    href: "https://twitter.com",
                    icon: (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    name: "LinkedIn",
                    href: "https://linkedin.com",
                    icon: (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Behance",
                    href: "https://behance.net",
                    icon: (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.659 0-6-2.747-6-6 0-3.447 2.457-6 6-6 4.093 0 5.484 3.018 5 6.5h-8.873c.176 1.95 1.638 3.193 3.654 3.193 1.411 0 2.531-.692 2.945-1.693h2zm-4.726-7.5c-1.84 0-2.88 1.157-3.087 2.7h6.055c-.179-1.57-1.196-2.7-2.968-2.7zm-12.015 9.5h-6.985v-14h7.02c2.812 0 4.98 1.489 4.98 4.225 0 1.637-.899 2.915-2.28 3.551 1.738.647 2.68 2.067 2.68 3.901 0 2.997-2.482 4.323-5.415 4.323zm-4.2-8.3h3.5c1.378 0 2.3-.672 2.3-1.875 0-1.258-.938-1.825-2.247-1.825h-3.553v3.7zm0 6.3h3.753c1.558 0 2.647-.733 2.647-2.083 0-1.425-1.077-2.117-2.647-2.117h-3.753v4.2z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#dfb479] hover:text-[#dfb479] text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Copyright and Precision Spec */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479]" />
              <span>
                © 2026 INT-VFX STUDIO INC. ALL RIGHTS RESERVED.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500">
              <span className="text-[#dfb479]">ISO 19650 BIM COMPLIANT</span>
              <span>•</span>
              <span>99.8% STRUCTURAL TOLERANCE</span>
              <span>•</span>
              <a href="#hero" className="hover:text-zinc-300 transition-colors">
                BACK TO TOP ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MINIMALIST PROMPT STUDIO MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-7 flex flex-col gap-4 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full border-[1.8px] border-[#ff5500] flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#ff5500]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white tracking-tight">
                    DreamFrame Studio
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Diffusion Model v3.5
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Prompt Input Box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-normal text-zinc-400 uppercase tracking-wider font-mono">
                Prompt
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-black border border-zinc-800 p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all font-sans font-light resize-none"
                placeholder="Describe your visual concept..."
              />
            </div>

            {/* Style Selector Chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-normal text-zinc-400 uppercase tracking-wider font-mono">
                Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Minimalist",
                  "Monochrome",
                  "Cinematic",
                  "Architectural",
                  "High Fashion",
                  "Analog 35mm",
                ].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-1 rounded-full text-xs font-normal transition-all cursor-pointer ${
                      selectedStyle === style
                        ? "bg-white text-black"
                        : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Progress Bar */}
            {isGenerating && (
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Synthesizing tensors...</span>
                  <span className="text-white font-mono">
                    {generationProgress}%
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-150"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Ready</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-normal text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={runMockGeneration}
                  disabled={isGenerating}
                  className="px-4.5 py-1.5 rounded-full bg-[#ff5500] hover:bg-[#ff6417] text-white text-xs font-medium tracking-wide transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? "Synthesizing..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
