import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const YELLOW = "#ebfb10";
const VIOLET = "#1019ec";

const LogoMark = () => (
  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
    <rect x="1" y="1" width="9" height="9" stroke={YELLOW} strokeWidth="1.5" />
    <rect x="12" y="1" width="9" height="9" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.45" />
    <rect x="1" y="12" width="9" height="9" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.45" />
    <rect x="12" y="12" width="9" height="9" stroke={YELLOW} strokeWidth="1.5" strokeOpacity="0.35" />
  </svg>
);

// Mini canvas point cloud for the demo panel
const MiniCloud = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let raf: number;
    const pts: { x: number; y: number; vx: number; vy: number; a: number }[] = [];
    const init = () => {
      c.width = c.offsetWidth; c.height = c.offsetHeight;
      pts.length = 0;
      for (let i = 0; i < 80; i++)
        pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, a: Math.random() * 0.4 + 0.05 });
    };
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 0.8, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    init(); draw();
    const ro = new ResizeObserver(init); ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className={`w-full h-full ${className}`} />;
};

const metrics = [
  { label: "Objetos detectados", value: "247", unit: "objs", live: true },
  { label: "Latencia IA", value: "2.1", unit: "ms", live: false },
  { label: "Resolución espacial", value: "0.012", unit: "mm", live: false },
  { label: "Confianza del modelo", value: "99.4", unit: "%", live: true },
];

const layers = [
  { name: "Capa AR — Objetos físicos", active: true, color: YELLOW },
  { name: "Capa IA — Reconocimiento", active: true, color: "#ffffff" },
  { name: "Capa VR — Entorno virtual", active: false, color: "#9d9d9d" },
  { name: "Capa Datos — Sensores IoT", active: true, color: "#ffffff" },
];

export default function Demo() {
  const [activeLayer, setActiveLayer] = useState<number[]>([0, 1, 3]);
  const [, setLocation] = useLocation();

  const toggleLayer = (i: number) => {
    setActiveLayer(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="min-h-screen bg-midnight-ink text-cloud-white font-abcoracle flex flex-col">

      {/* Top bar */}
      <header className="border-b border-white/[0.07] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 select-none bg-transparent border-none cursor-pointer">
            <LogoMark />
            <span className="font-gtpantheon text-[16px] tracking-widest text-cloud-white">
              AXION <span style={{ color: YELLOW }}>Reality</span>
            </span>
          </button>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-pewter border-l border-white/10 pl-4">
            Modo Demo — sin guardar
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-dove-gray">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            En vivo
          </span>
          <button onClick={() => setLocation("/login")}
            className="text-[12px] bg-electric-yellow text-midnight-ink rounded-md px-4 py-2 font-abcoracle hover:brightness-105 transition-all cursor-pointer border-none">
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/[0.07] p-5 flex flex-col gap-6 shrink-0">

          {/* Layers */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-dove-gray mb-3">Capas activas</p>
            <div className="flex flex-col gap-1">
              {layers.map((l, i) => (
                <button
                  key={i}
                  onClick={() => toggleLayer(i)}
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-white/5 transition-colors text-left group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm border shrink-0 transition-all"
                    style={{
                      background: activeLayer.includes(i) ? l.color : "transparent",
                      borderColor: activeLayer.includes(i) ? l.color : "#585858",
                    }}
                  />
                  <span className={`text-[12px] transition-colors ${activeLayer.includes(i) ? "text-cloud-white" : "text-pewter"}`}>
                    {l.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-dove-gray mb-3">Métricas en tiempo real</p>
            <div className="flex flex-col gap-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px] text-dove-gray">{m.label}</span>
                  <div className="flex items-center gap-1">
                    {m.live && <span className="w-1 h-1 rounded-full bg-electric-yellow animate-pulse" />}
                    <span className="text-[13px] font-gtpantheon" style={{ color: YELLOW }}>
                      {m.value}
                    </span>
                    <span className="text-[10px] text-pewter">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-white/[0.07]">
            <p className="text-[12px] text-dove-gray mb-3 leading-[1.5]">
              Inicia sesión para guardar proyectos y acceder a todas las funciones.
            </p>
            <button onClick={() => setLocation("/login")}
              className="w-full flex items-center justify-center bg-electric-yellow text-midnight-ink rounded-md py-2.5 text-[12px] font-abcoracle hover:brightness-105 transition-all cursor-pointer border-none">
              Crear cuenta gratis
            </button>
          </div>
        </aside>

        {/* Main viewport */}
        <main className="flex-1 flex flex-col min-h-0">

          {/* Toolbar */}
          <div className="border-b border-white/[0.07] px-5 py-2.5 flex items-center gap-4 shrink-0">
            <span className="text-[11px] text-dove-gray tracking-wide">Vista AR · Escena de demostración</span>
            <div className="ml-auto flex items-center gap-2">
              {["2D", "3D", "AR"].map(v => (
                <button key={v}
                  className={`text-[11px] px-3 py-1 rounded transition-all ${v === "AR" ? "bg-electric-yellow text-midnight-ink" : "text-dove-gray border border-white/10 hover:border-white/25"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Viewport area */}
          <div className="flex-1 relative overflow-hidden" style={{ background: "#020208" }}>
            <MiniCloud />

            {/* Center HUD overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                {/* Brackets */}
                <div className="w-48 h-48 relative">
                  {/* top-left */}
                  <span className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: YELLOW }} />
                  {/* top-right */}
                  <span className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: YELLOW }} />
                  {/* bottom-left */}
                  <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: YELLOW }} />
                  {/* bottom-right */}
                  <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: YELLOW }} />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: YELLOW }}>Objeto detectado</span>
                    <span className="text-[22px] font-gtpantheon text-white">Humano · 1.78m</span>
                    <span className="text-[11px] text-dove-gray">Confianza: 99.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] px-5 py-3 flex items-center gap-6"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
              <span className="text-[11px] text-dove-gray">AXION Reality · Demo sin cuenta</span>
              <span className="text-[11px]" style={{ color: YELLOW }}>Los datos no se guardan en esta sesión</span>
              <button onClick={() => setLocation("/login")}
                className="ml-auto text-[11px] underline underline-offset-2 text-dove-gray hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                Iniciar sesión para guardar →
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
