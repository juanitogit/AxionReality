import React, { useRef, useLayoutEffect } from "react";
import { useLocation } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteNav from "@/components/SiteNav";

gsap.registerPlugin(ScrollTrigger);

// ─── Reveal ───────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    gsap.fromTo(el, 
      { opacity: 0, y: y },
      {
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  }, [delay, y]);

  return <div ref={ref} className="opacity-0">{children}</div>;
};

// ─── Dynamic Button ──────────────────────────────────────────────────────────
const Btn = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "nav";
  size?: "sm" | "md" | "lg";
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const base = "inline-flex items-center justify-center font-semibold transition-all cursor-pointer whitespace-nowrap border-none";
  
  const sizes = { 
    sm: "text-[13px] px-[10px] py-[3px]", 
    md: "text-[16px] px-[22px] py-[14px]", 
    lg: "text-[16px] px-[32px] py-[16px]" 
  };
  
  const vars = {
    primary: "bg-primary text-bg-base hover:brightness-110 rounded-[12px] shadow-sm",
    secondary: "bg-bg-subtle text-text-base hover:brightness-95 dark:hover:brightness-110 rounded-[12px]",
    ghost: "bg-transparent text-text-base hover:bg-bg-subtle border border-text-base border-solid rounded-[4px]",
    nav: "bg-bg-subtle text-secondary hover:brightness-95 dark:hover:brightness-110 rounded-[40px] px-[32px] py-[10px]",
  };
  
  return (
    <button ref={ref} className={`${base} ${sizes[size]} ${vars[variant]} ${className}`} {...p}>
      {children}
    </button>
  );
};

// ─── Feature Card ────────────────────────────────────────────────────
const FeatureCard = ({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) => {
  return (
    <div className="bg-bg-subtle rounded-[20px] p-8 flex flex-col items-start transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
      <div className="mb-6 p-4 bg-bg-base rounded-[12px] text-secondary shadow-sm">
        {icon}
      </div>
      <h3 className="text-[24px] font-semibold text-text-base mb-3 leading-[1.2]">{title}</h3>
      <p className="text-[16px] text-text-muted leading-[1.5]">{desc}</p>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [, setLocation] = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    // Subtle entry animation for hero
    if (heroRef.current) {
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-text-base overflow-x-hidden selection:bg-primary selection:text-bg-base transition-colors duration-300" style={{ fontFamily: "var(--font-tt-norms-pro)" }}>

      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-full h-[600px] opacity-10 pointer-events-none" 
             style={{ background: "var(--color-deep-space-gradient)", maskImage: "radial-gradient(circle at top right, black, transparent 70%)" }} />

        <div className="max-w-[1220px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[64px] items-center" ref={heroRef}>
          <div className="max-w-[600px]">

            <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight text-text-base mb-6">
              El entorno digital para <span className="text-primary">realidad aumentada.</span>
            </h1>
            
            <p className="text-[18px] text-text-muted leading-[1.4] mb-10 max-w-[500px]">
              Arquitectura de alta fidelidad, gestión multiusuario y Live Sync en tiempo real. Construye y exporta modelos GLB directamente desde tu navegador con precisión profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Btn variant="primary" size="lg" onClick={() => window.location.href = "/editor/"} className="w-full sm:w-auto">Comenzar a Editar</Btn>
              <Btn variant="ghost" size="md" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto">Explorar Plataforma</Btn>
            </div>
          </div>

          {/* Hero Video Section */}
          <div className="relative w-full h-[500px] rounded-[24px] shadow-2xl overflow-hidden border border-border-subtle bg-black group">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              poster="https://cdn.aaru.com/website/hero-poster.webp"
            >
              <source src="https://cdn.aaru.com/website/hero.webm" type="video/webm" />
              <source src="https://cdn.aaru.com/website/hero.mp4" type="video/mp4" />
            </video>
            
            {/* Subtle Gradient Overlay for Branding */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay pointer-events-none" />
            
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-[112px] px-6 bg-bg-base transition-colors duration-300">
        <div className="max-w-[1220px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-[32px] font-bold text-text-base mb-4 leading-[1.2]">Herramientas de Nivel Profesional</h2>
              <p className="text-[20px] text-text-muted max-w-[600px] mx-auto leading-[1.25]">
                Todo lo necesario para gestionar activos 3D, desde el modelado hasta la visualización en dispositivos móviles.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            <Reveal delay={0.1}>
              <FeatureCard 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                title="Pipeline de Exportación"
                desc="Lógica robusta que limpia la interfaz del editor para transmisiones GLB binarias puras, listas para su renderizado."
              />
            </Reveal>
            <Reveal delay={0.2}>
              <FeatureCard 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                title="Gestión Multiusuario"
                desc="Backend en Node.js persistente que facilita sesiones concurrentes mediante el alojamiento de archivos basado en IDs únicos."
              />
            </Reveal>
            <Reveal delay={0.3}>
              <FeatureCard 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                title="Live Sync Integrado"
                desc="Actualizaciones automáticas vía Socket.io. Los visores AR reflejan instantáneamente cualquier modificación en la escena 3D."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Call to Action ─────────────────────────────────────────── */}
      <section className="py-[112px] px-6 bg-bg-base transition-colors duration-300">
        <div className="max-w-[1220px] mx-auto bg-text-base rounded-[24px] p-16 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "var(--color-deep-space-gradient)" }} />
          
          <Reveal>
            <h2 className="text-[32px] font-bold text-bg-base mb-6 relative z-10 leading-[1.2]">Optimiza tu flujo de trabajo en AR</h2>
            <p className="text-[18px] text-bg-subtle mb-10 max-w-[600px] mx-auto relative z-10 leading-[1.4] opacity-90">
              Usa atajos de teclado profesionales (copiar, pegar, duplicar) y olvídate de los problemas de CORS con nuestro servicio de activos directo.
            </p>
            <Btn variant="primary" size="lg" onClick={() => window.location.href = "http://localhost:3000"} className="relative z-10 !text-text-base !bg-primary border-none">
              Acceder al Editor
            </Btn>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-border-subtle bg-bg-subtle mt-auto transition-colors duration-300">
        <div className="max-w-[1220px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo-cube.png`} alt="AXION" width={24} height={24} className="shrink-0" />
            <span className="font-semibold text-text-muted tracking-tight">AXION <span className="font-normal opacity-80">Reality</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[14px] font-semibold text-text-muted">
            <a href="#" className="hover:text-secondary transition-colors">Soporte</a>
            <a href="#" className="hover:text-secondary transition-colors">Documentación API</a>
            <a href="#" className="hover:text-secondary transition-colors">Términos</a>
          </div>
          
          <span className="text-[14px] text-text-muted opacity-80">© 2026 AXION Reality. Todos los derechos reservados.</span>
        </div>
      </footer>

    </div>
  );
}
