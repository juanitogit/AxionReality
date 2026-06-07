import React from "react";
import { useLocation } from "wouter";
import SiteNav from "@/components/SiteNav";
import { Reveal, Btn } from "@/components/ui";
const ModosSlideshow = () => {
  const [current, setCurrent] = React.useState(0);
  const images = [
    "/modo1.svg",
    "/modo2.svg",
    "/modo3.svg",
    "/modo4.svg"
  ];
  React.useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % images.length), 3000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border-subtle bg-bg-subtle">
      {images.map((img, i) => (
        <img 
          key={img} 
          src={img} 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
          alt="Modos"
        />
      ))}
    </div>
  );
};

const MODES = [
  {
    n: "01", tag: "Construir",
    title: "Editor 3D en el navegador",
    desc: "Importa, moldea y anima objetos directamente desde el PC. Exporta como GLTF/GLB listo para desplegar en AR sin ninguna instalación.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="10" y="14" width="20" height="18" rx="2" />
        <path d="M10 14 20 8 30 14" />
        <path d="M20 8v24M10 14l10 6 10-6" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    n: "02", tag: "Construye IA",
    title: "Dile qué quieres — Llama lo genera",
    desc: "Escribe un prompt en lenguaje natural y la IA genera la geometría 3D, materiales y animaciones por ti.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="18" r="10" />
        <path d="M14 28h12M17 31h6" />
        <circle cx="16" cy="17" r="1.5" fill="currentColor" />
        <circle cx="24" cy="17" r="1.5" fill="currentColor" />
        <path d="M16 22 q4 3 8 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "03", tag: "Escanear QR",
    title: "Celular como portal AR",
    desc: "Genera un código QR desde el PC con toda la escena empaquetada. El celular abre el modelo en AR directamente en el navegador.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="10" height="10" rx="2" />
        <rect x="11" y="11" width="4" height="4" fill="currentColor" />
        <rect x="22" y="8" width="10" height="10" rx="2" />
        <rect x="25" y="11" width="4" height="4" fill="currentColor" />
        <rect x="8" y="22" width="10" height="10" rx="2" />
        <rect x="11" y="25" width="4" height="4" fill="currentColor" />
        <rect x="22" y="22" width="4" height="4" fill="currentColor" rx="1" />
        <rect x="28" y="22" width="4" height="4" fill="currentColor" rx="1" />
        <rect x="22" y="28" width="4" height="4" fill="currentColor" rx="1" />
      </svg>
    ),
  },
  {
    n: "04", tag: "AR + IA",
    title: "Superposición inteligente",
    desc: "La IA reconoce el entorno y ancla objetos sobre superficies reales con tracking submilimétrico. La escena se adapta al espacio.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="20" r="10" />
        <circle cx="20" cy="20" r="16" strokeDasharray="6 4" opacity="0.5" />
        <line x1="20" y1="0" x2="20" y2="4" />
        <line x1="20" y1="36" x2="20" y2="40" />
        <line x1="0" y1="20" x2="4" y2="20" />
        <line x1="36" y1="20" x2="40" y2="20" />
      </svg>
    ),
  },
  {
    n: "05", tag: "VR Inmersivo",
    title: "Entra al mundo digital",
    desc: "WebXR completo: entra a entornos virtuales, navega, manipula objetos y simula escenarios — todo desde el navegador.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 16 Q4 12 8 12 h24 Q36 12 36 16 v8 Q36 28 32 28 h-6 l-2 2h-8 l-2-2 H8 Q4 28 4 24 Z" />
        <circle cx="15" cy="20" r="3" />
        <circle cx="25" cy="20" r="3" />
      </svg>
    ),
  },
  {
    n: "06", tag: "Accesorios AR",
    title: "Manos · Cara · Cuerpo",
    desc: "Prueba relojes, anillos, gafas u outfits superpuestos en tiempo real con tracking avanzado y pose estimation.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 30 V16 a2 2 0 0 1 4 0 v8" />
        <path d="M20 16 V14 a2 2 0 0 1 4 0 v10" />
        <path d="M24 16 V15 a2 2 0 0 1 4 0 v9" />
        <path d="M12 20 a2 2 0 0 1 4 0 v10 q0 4 4 4 h4 q6 0 6-6 V18" />
      </svg>
    ),
  },
];

export default function Modos() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-300" style={{ fontFamily: "var(--font-tt-norms-pro)" }}>
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-full h-[600px] opacity-10 pointer-events-none" 
             style={{ background: "var(--color-deep-space-gradient)", maskImage: "radial-gradient(circle at top right, black, transparent 70%)" }} />
        
        <div className="max-w-[1220px] mx-auto">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 bg-transparent border-none cursor-pointer mb-8 font-semibold text-[14px] text-text-muted hover:text-primary transition-colors">
            ← Volver
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
            <Reveal>
              <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight text-text-base mb-6 max-w-[800px]">
                Elige tu <span className="text-primary">modo.</span>
              </h1>
              <p className="text-[18px] text-text-muted leading-[1.4] max-w-[600px]">
                6 formas distintas de interactuar con la realidad aumentada, la IA y los entornos 3D — úsalos solos o combínalos.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ModosSlideshow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mode cards */}
      <section className="px-6 py-[112px] bg-bg-base">
        <div className="max-w-[1220px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODES.map((m, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-bg-subtle rounded-[24px] p-8 flex flex-col h-full border border-border-subtle hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6">
                  <span className="font-bold text-[48px] text-border-subtle/50 group-hover:text-primary/10 transition-colors pointer-events-none select-none">
                    {m.n}
                  </span>
                </div>
                
                <div className="text-secondary mb-6 bg-bg-base p-3 rounded-xl w-fit shadow-sm relative z-10">
                  {m.icon}
                </div>
                
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2 relative z-10">{m.tag}</p>
                <h3 className="text-[22px] font-bold text-text-base leading-[1.2] mb-3 relative z-10">{m.title}</h3>
                <p className="text-[14px] text-text-muted leading-[1.6] relative z-10">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="max-w-[1220px] mx-auto mt-20 text-center">
          <Reveal>
            <Btn variant="primary" size="lg" onClick={() => window.location.href = "/editor/"}>
              Abrir el Editor →
            </Btn>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
