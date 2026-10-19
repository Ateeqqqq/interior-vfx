"use client";

import React from "react";

interface PartnerBrand {
  name: string;
  category: string;
  brandColor: string;
  renderLogo: (colorClass: string) => React.ReactNode;
}

const ROW_ONE_PARTNERS: PartnerBrand[] = [
  {
    name: "Foster + Partners",
    category: "Architecture & Design",
    brandColor: "#E31B23", // Foster Red
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <circle cx="12" cy="16" r="8" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    name: "Zaha Hadid Architects",
    category: "Parametric Design",
    brandColor: "#00D2FF", // Cyan / Electric
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M4 8C14 6 18 26 28 24M4 16C12 14 20 18 28 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Skidmore, Owings & Merrill",
    category: "Supertalls & Urbanism",
    brandColor: "#006699", // Architectural Blue
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="5" width="22" height="22" stroke="currentColor" strokeWidth="2" />
        <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="5" x2="16" y2="27" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Herzog & de Meuron",
    category: "Museums & Towers",
    brandColor: "#E2001A", // Swiss Red
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M7 6V26M25 6V26M7 16H25M11 11L21 21M21 11L11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Gensler",
    category: "Global Architecture",
    brandColor: "#E41E26", // Gensler Red
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M25 10C23 6 18 5 14 7C8 10 7 19 12 24C16 27 23 26 26 21V16H16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Arup",
    category: "Structural Engineering",
    brandColor: "#EA1D2D", // Arup Crimson
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 28,26 4,26" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="16" y1="4" x2="16" y2="26" stroke="currentColor" strokeWidth="1.8" />
        <line x1="10" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: "Kohn Pedersen Fox",
    category: "Commercial Megastructures",
    brandColor: "#00A3E0", // KPF Cyan
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M6 6V26M6 16L18 6M6 16L18 26M26 6V26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const ROW_TWO_PARTNERS: PartnerBrand[] = [
  {
    name: "Buro Happold",
    category: "Structural Optimization",
    brandColor: "#B2005A", // Magenta
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <circle cx="8" cy="16" r="3" fill="currentColor" />
        <circle cx="16" cy="8" r="3" fill="currentColor" />
        <circle cx="24" cy="16" r="3" fill="currentColor" />
        <circle cx="16" cy="24" r="3" fill="currentColor" />
        <path d="M8 16L16 8L24 16L16 24Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: "Thornton Tomasetti",
    category: "High-Rise Engineering",
    brandColor: "#F26522", // TT Orange
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <rect x="7" y="7" width="18" height="18" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Related Companies",
    category: "Luxury Development",
    brandColor: "#D4AF37", // Warm Gold
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <polygon points="16,5 27,11 27,23 16,29 5,23 5,11" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11V23M10 14L22 20M10 20L22 14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Hines",
    category: "Global Real Estate",
    brandColor: "#007A53", // Hines Emerald
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M8 6V26M24 6V26M8 16H24M12 6L20 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "SHoP Architects",
    category: "Architectural Tech",
    brandColor: "#FF5722", // Copper Orange
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M6 10H16M6 16H26M16 22H26M16 6V26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "WSP Global",
    category: "Infrastructure & Towers",
    brandColor: "#ED1C24", // Ruby Red
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <path d="M4 8L10 24L16 11L22 24L28 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Extell Development",
    category: "Ultra-Prime Residential",
    brandColor: "#C5A059", // Champagne Gold
    renderLogo: (color) => (
      <svg className="w-7 h-7 transition-colors duration-300" viewBox="0 0 32 32" fill="none">
        <polygon points="16,3 24,14 20,28 12,28 8,14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <line x1="16" y1="3" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function BrandItem({ partner }: { partner: PartnerBrand }) {
  return (
    <div
      className="group relative shrink-0 mx-4 sm:mx-8 md:mx-12 lg:mx-16 flex items-center gap-2.5 sm:gap-3.5 select-none cursor-pointer transition-all duration-300"
      style={
        {
          "--brand-color": partner.brandColor,
        } as React.CSSProperties
      }
    >
      {/* Brand Icon: Monochrome grayscale/zinc-500 by default -> Transitions smoothly to brand color on hover */}
      <div className="text-zinc-500 group-hover:text-[var(--brand-color)] transition-colors duration-400 shrink-0 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7">
        {partner.renderLogo(partner.brandColor)}
      </div>

      {/* Brand Text: Clean minimalist typography */}
      <div className="flex flex-col text-left">
        <span className="text-sm sm:text-base md:text-[17px] font-semibold tracking-tight text-zinc-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
          {partner.name}
        </span>
        <span className="text-[9px] sm:text-[10.5px] uppercase font-mono tracking-widest text-zinc-600 group-hover:text-[var(--brand-color)] transition-colors duration-300 mt-0.5">
          {partner.category}
        </span>
      </div>
    </div>
  );
}

export default function InfiniteLogoCarousel() {
  return (
    <section id="partners" className="relative w-full py-16 sm:py-20 md:py-24 bg-black text-white overflow-hidden border-t border-zinc-900">
      {/* Subtle atmospheric ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(223, 180, 121, 0.4), transparent 75%)",
        }}
      />

      <div className="relative max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 mb-8 sm:mb-12 text-center">
        {/* Minimal pill header badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-zinc-950/80 border border-[#dfb479]/30 backdrop-blur-md mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] animate-pulse shrink-0" />
          <span className="text-[9px] sm:text-[10.5px] md:text-[11px] font-medium tracking-[0.14em] sm:tracking-[0.22em] text-[#e8d5bc] uppercase font-mono truncate">
            TRUSTED BY PREMIER ARCHITECTURAL STUDIOS &amp; DEVELOPERS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfb479] animate-pulse shrink-0" />
        </div>

        <h3
          className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.03em] max-w-xl mx-auto px-2 bg-gradient-to-br from-white via-[#f7f2ea] to-[#cfab75] bg-clip-text text-transparent"
          style={{
            filter: "drop-shadow(0 2px 14px rgba(0,0,0,0.8))",
          }}
        >
          Engineering the Future of Global Megastructures
        </h3>
      </div>

      {/* Marquee Wrapper with smooth edge masks and NO container boxes around logos */}
      <div
        className="relative w-full flex flex-col gap-10 sm:gap-12 overflow-hidden py-4"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {/* ROW 1: Moves Right -> Left */}
        <div className="animate-marquee-left">
          {ROW_ONE_PARTNERS.map((partner, i) => (
            <BrandItem key={`row1-${i}`} partner={partner} />
          ))}
          {/* Duplicate set for continuous seamless loop */}
          {ROW_ONE_PARTNERS.map((partner, i) => (
            <BrandItem key={`row1-dup-${i}`} partner={partner} />
          ))}
        </div>

        {/* ROW 2: Moves Left -> Right */}
        <div className="animate-marquee-right">
          {ROW_TWO_PARTNERS.map((partner, i) => (
            <BrandItem key={`row2-${i}`} partner={partner} />
          ))}
          {/* Duplicate set for continuous seamless loop */}
          {ROW_TWO_PARTNERS.map((partner, i) => (
            <BrandItem key={`row2-dup-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
