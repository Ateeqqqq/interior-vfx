"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function BentoGridSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeMaterial, setActiveMaterial] = useState("gold");

  // Handle before/after slider drag or mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  return (
    <section id="bento-grid" className="relative w-full py-28 sm:py-36 bg-black text-white overflow-hidden border-t border-zinc-900/90">
      {/* Background ambient lighting matching the hero section */}
      <div
        className="absolute top-1/4 right-10 w-[700px] h-[500px] rounded-full blur-[170px] opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(223, 180, 121, 0.4), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-10 w-[600px] h-[500px] rounded-full blur-[160px] opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #713f12, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-[#dfb479]/35 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] shrink-0" />
              <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.22em] text-[#e8d5bc] uppercase font-mono">
                PRECISION ARCHITECTURAL PORTFOLIO
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-white leading-[1.1]"
              style={{
                fontFamily:
                  "var(--font-syne), var(--font-geist-sans), sans-serif",
              }}
            >
              The Science of <br />
              <span className="bg-gradient-to-r from-white via-[#f7f2ea] to-[#cfab75] bg-clip-text text-transparent">
                Architectural Realization
              </span>
            </h2>
          </div>

          <p className="text-sm text-zinc-400 font-light max-w-md leading-relaxed">
            Bridging heavy structural engineering and transcendent luxury
            interior realization through proprietary neural diffusion digital
            twins.
          </p>
        </div>

        {/* ================= ASYMMETRIC BENTO GRID ================= */}
        {/* Mathematically aligned grid matching the reference blueprint */}
        <div className="flex flex-col gap-6">
          {/* ================= ROW 1: TOP SEGMENT ================= */}
          {/* Card A (8 cols: ~67%) + Card B (4 cols: ~33%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ================= CARD A (TOP-LEFT: WIDE 8 COLS) ================= */}
            {/* High-end before-and-after construction transformation */}
            <div className="lg:col-span-8 group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-zinc-950 border border-zinc-800/90 hover:border-[#dfb479]/45 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex flex-col justify-between min-h-[320px] sm:min-h-[400px] lg:min-h-[440px]">
              {/* Interactive Before/After Split Container with Touch Support */}
              <div
                className="absolute inset-0 cursor-ew-resize select-none touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                <Image
                  src="/images/before-after.jpg"
                  alt="Construction to Luxury Penthouse Transformation"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Dynamic Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)] z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/90 border border-[#dfb479] backdrop-blur-md flex items-center justify-center text-[10px] sm:text-[11px] text-[#dfb479] shadow-xl">
                    ↔
                  </div>
                </div>

                {/* Gradient Scrim for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/25 pointer-events-none z-10" />
              </div>

              {/* Top Badges */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 border border-zinc-700/80 backdrop-blur-md text-[9.5px] sm:text-[11px] font-mono text-zinc-300">
                  <span className="hidden xs:inline">CONSTRUCTION PHASE</span>
                  <span className="xs:hidden">STAGE 01</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479]" />
                  <span className="text-[#dfb479]">REALIZATION</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 border border-[#dfb479]/40 backdrop-blur-md text-[9.5px] sm:text-[11px] font-mono text-[#dfb479]">
                  <span>DRAG / TOUCH</span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6">
                <div className="max-w-md">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#dfb479] font-mono font-medium">
                    RAW REBAR → PENTHOUSE REALIZATION
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white mt-1">
                    From Heavy Structure to Finished Luxury
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-zinc-300 font-light mt-1.5 leading-relaxed">
                    Map structural steel and rough-in conduit directly to finished
                    travertine, bronze cove details, and ambient twilight.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 pt-1 sm:pt-0">
                  <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-black/85 border border-zinc-700/80 backdrop-blur-md text-center">
                    <div className="text-[10px] uppercase font-mono text-zinc-400">
                      Lead Time
                    </div>
                    <div className="text-lg font-bold font-mono text-[#dfb479]">
                      -65%
                    </div>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-black/85 border border-zinc-700/80 backdrop-blur-md text-center">
                    <div className="text-[10px] uppercase font-mono text-zinc-400">
                      Pre-Sales
                    </div>
                    <div className="text-lg font-bold font-mono text-white">
                      +340%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CARD B (TOP-RIGHT: 4 COLS) ================= */}
            {/* Wireframe digital twin & volumetric lighting */}
            <div className="lg:col-span-4 group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-zinc-950 border border-zinc-800/90 hover:border-[#dfb479]/45 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex flex-col justify-between min-h-[320px] sm:min-h-[400px] lg:min-h-[440px]">
              <Image
                src="/images/digital-twin.jpg"
                alt="Digital Twin Wireframe Lighting Simulation"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 z-10" />

              {/* Top Row: Title + Circular 2026 Badge matching reference */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8 flex items-start justify-between">
                <span className="text-[10px] sm:text-[10.5px] uppercase font-mono tracking-widest px-2.5 py-1 sm:px-3 rounded-full bg-black/75 border border-zinc-700/80 text-zinc-300">
                  UE5 SIMULATION
                </span>

                {/* Circular Year Badge matching reference image */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 border border-[#dfb479] backdrop-blur-md flex flex-col items-center justify-center text-[9.5px] sm:text-[10.5px] font-mono font-bold leading-tight text-[#dfb479] shadow-lg">
                  <span>20</span>
                  <span>26</span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8">
                <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#dfb479] font-mono">
                  CAD-ACCURATE PHOTOMETRICS
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mt-1">
                  Volumetric Ray Tracing
                </h3>
                <p className="text-xs text-zinc-300 font-light mt-1.5 leading-relaxed">
                  Solar path simulations, pool water caustics, and board-formed
                  concrete bounce verified to 0.1 lux.
                </p>
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-zinc-400">
                  <span>UNREAL ENGINE 5</span>
                  <span className="text-[#dfb479]">99.8% FIDELITY</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ROW 2: BOTTOM SEGMENT ================= */}
          {/* Card C (Left 4 cols, tall) + Right Stack (Right 8 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* ================= CARD C (BOTTOM-LEFT: TALL 4 COLS) ================= */}
            {/* Monumental vertical atrium staircase matching reference tall card */}
            <div className="lg:col-span-4 group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-zinc-950 border border-zinc-800/90 hover:border-[#dfb479]/45 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex flex-col justify-between min-h-[440px] sm:min-h-[520px] lg:min-h-[620px] h-full">
              <Image
                src="/images/monumental-atrium.jpg"
                alt="Monumental Luxury Atrium with Cantilevered Staircase"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25 z-10" />

              {/* Top-Left Circular Indicator matching reference */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb479] flex items-center justify-center text-black font-bold text-[10px] sm:text-[11px] shadow-[0_0_14px_rgba(223,180,121,0.6)]">
                    01
                  </div>
                  <span className="text-[11px] sm:text-[11.5px] font-mono text-white/95 tracking-wider font-semibold">
                    TRIBECA PENTHOUSE
                  </span>
                </div>

                <span className="text-[9.5px] sm:text-[10px] font-mono text-zinc-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/70 border border-zinc-800">
                  40.7128° N
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-20 p-5 sm:p-7 md:p-8">
                <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#dfb479] font-mono">
                  MONUMENTAL SCALE
                </span>
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-semibold tracking-tight text-white mt-1 sm:mt-1.5 leading-snug">
                  Double-Height Cantilever Atrium
                </h3>
                <p className="text-xs text-zinc-300 font-light mt-1.5 sm:mt-2 leading-relaxed">
                  42-foot double-height glass curtain wall with bookmatched Nero
                  Marquina marble and integrated LED bronze handrail reveal.
                </p>

                <div className="mt-3.5 sm:mt-4 pt-3.5 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
                  <span>CEILING: 42 FT</span>
                  <span className="text-[#dfb479]">COMPLETED 2026</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT STACK (8 COLS TOTAL) ================= */}
            {/* Card D (Top) + Subgrid [Card E + Mini-Stack (F + G)] */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-6 h-full">
              {/* ================= CARD D (WIDE METRICS & ACTION CARD) ================= */}
              {/* Bold typography, metric numbers, and large circular arrow button from reference */}
              <div className="group relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-zinc-800 hover:border-[#dfb479]/45 p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex-1 min-h-[240px] sm:min-h-[260px]">
                {/* Subtle gold ambient glow in top right */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#dfb479]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#dfb479] font-mono font-medium">
                      ARCHITECTURAL SCALE &amp; PERFORMANCE
                    </span>
                    <h3
                      className="text-xl sm:text-2xl md:text-[30px] font-bold tracking-tight text-white mt-1.5 sm:mt-2 leading-[1.18] sm:leading-[1.14] max-w-xl"
                      style={{
                        fontFamily:
                          "var(--font-syne), var(--font-geist-sans), sans-serif",
                      }}
                    >
                      Precision Digital Twins for Ultra-Prime Real Estate
                    </h3>
                  </div>

                  {/* Large Circular Arrow Button matching reference */}
                  <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-zinc-700/80 group-hover:border-[#dfb479] group-hover:bg-[#dfb479] flex items-center justify-center text-white group-hover:text-black shrink-0 transition-all duration-300 shadow-xl group-hover:scale-105 cursor-pointer">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
                  </div>
                </div>

                {/* Large Metric Counters - mobile responsive */}
                <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-zinc-800/80">
                  <div>
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                      3.2M<span className="text-[#dfb479]">+</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 font-light mt-0.5">
                      Sq Ft Designed
                    </div>
                  </div>

                  <div>
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                      180<span className="text-[#dfb479]">+</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 font-light mt-0.5">
                      Megastructures
                    </div>
                  </div>

                  <div>
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#dfb479] font-mono">
                      99.8%
                    </div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 font-light mt-0.5">
                      Structural Tol.
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SUB-GRID: CARDS E, F, G ================= */}
              {/* Perfectly 1-column on mobile (<768px), 12-column on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* ================= CARD E (BIM & ENGINEERING SPEC: 7 COLS) ================= */}
                {/* Matching reference diploma/spec sheet card */}
                <div className="md:col-span-7 rounded-[24px] sm:rounded-[32px] bg-zinc-950 border border-zinc-800 p-5 sm:p-7 flex flex-col justify-between hover:border-[#dfb479]/40 transition-colors shadow-xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[10.5px] uppercase font-mono tracking-wider text-[#dfb479]">
                        STRUCTURAL ENGINEERING AUDIT
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        ISO 19650 BIM
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mt-2 sm:mt-2.5">
                      BIM Level 3 Bidirectional Sync
                    </h4>
                    <p className="text-xs text-zinc-400 font-light mt-1.5 sm:mt-2 leading-relaxed">
                      Zero-loss translation from Revit, Rhino, and ArchiCAD models
                      into millimetric digital twin geometry with structural load
                      verification.
                    </p>
                  </div>

                  {/* Decorative blueprint CAD coordinates */}
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] sm:text-[10.5px] font-mono text-zinc-500">
                    <span>CAD TOLERANCE: ±1.2MM</span>
                    <span className="text-emerald-400">● VERIFIED</span>
                  </div>
                </div>

                {/* ================= MINI-STACK (5 COLS): CARDS F + G ================= */}
                {/* Stacks cleanly on mobile, 5 cols on md+ */}
                <div className="md:col-span-5 flex flex-col justify-between gap-4">
                  {/* ================= CARD F (TACTILE MATERIAL PALETTES) ================= */}
                  <div className="rounded-[24px] sm:rounded-[28px] bg-zinc-950 border border-zinc-800 p-5 sm:p-6 flex flex-col justify-between hover:border-[#dfb479]/40 transition-colors shadow-xl flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] sm:text-[10px] uppercase font-mono tracking-wider text-[#dfb479]">
                          PBR SHADERS
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">
                          TACTILE
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-white mt-1">
                        Curated Material Palette
                      </h4>
                    </div>

                    {/* Interactive Material Swatches */}
                    <div className="flex items-center gap-3 my-2 sm:my-2.5">
                      {/* Concrete Swatch */}
                      <button
                        onClick={() => setActiveMaterial("concrete")}
                        title="Board-Formed Concrete"
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-700 border transition-all cursor-pointer shadow-inner ${
                          activeMaterial === "concrete"
                            ? "border-[#dfb479] scale-110 shadow-[0_0_12px_rgba(223,180,121,0.5)]"
                            : "border-zinc-700 opacity-60"
                        }`}
                      />
                      {/* Gold Swatch */}
                      <button
                        onClick={() => setActiveMaterial("gold")}
                        title="Brushed Tuscan Gold"
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#f3e5ab] via-[#dfb479] to-[#8c6d31] border transition-all cursor-pointer shadow-md ${
                          activeMaterial === "gold"
                            ? "border-white scale-110 shadow-[0_0_14px_rgba(223,180,121,0.6)]"
                            : "border-zinc-700 opacity-60"
                        }`}
                      />
                      {/* Marble Swatch */}
                      <button
                        onClick={() => setActiveMaterial("marble")}
                        title="Calacatta Marble"
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-white via-zinc-200 to-zinc-400 border transition-all cursor-pointer shadow-inner ${
                          activeMaterial === "marble"
                            ? "border-[#dfb479] scale-110 shadow-[0_0_12px_rgba(223,180,121,0.5)]"
                            : "border-zinc-700 opacity-60"
                        }`}
                      />
                    </div>

                    <div className="text-[9.5px] sm:text-[10px] font-mono text-zinc-400 truncate">
                      {activeMaterial === "gold" && "Brushed Tuscan Gold (Rough 0.18)"}
                      {activeMaterial === "concrete" && "Cast Concrete (Displace 4mm)"}
                      {activeMaterial === "marble" && "Calacatta Viola (Specular 0.94)"}
                    </div>
                  </div>

                  {/* ================= CARD G (GLOBAL STUDIOS PILL) ================= */}
                  <div className="rounded-[20px] sm:rounded-[24px] bg-zinc-950 border border-zinc-800 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between hover:border-[#dfb479]/40 transition-colors shadow-xl">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-white font-mono tracking-wider">
                        NYC • LON • DXB
                      </span>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-mono text-[#dfb479] uppercase">
                      24/7 ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
