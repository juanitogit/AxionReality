import React from "react";
import { useLocation } from "wouter";
import SiteNav from "@/components/SiteNav";
import { Reveal, Btn } from "@/components/ui";
const InteractSlideshow = () => {
  const [current, setCurrent] = React.useState(0);
  const images = [
    "/interact_slide_1_1780592481730.png",
    "/interact_slide_2_1780592495564.png"
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
          alt="Interaccion"
        />
      ))}
    </div>
  );
};

const INTERACTIONS = [
  {
    tag: "Mover",
    title: "Objeto con la mano",
    desc: "Pincha y arrastra objetos AR en el espacio 3D usando gestos de la mano detectados en tiempo real por la cámara — sin tocar la pantalla.",
    detail: "MediaPipe Hands (21 puntos)",
    icon: (
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M40 60 V30 a4 4 0 0 1 8 0 v14" strokeLinecap="round" />
        <path d="M48 32 V26 a4 4 0 0 1 8 0 v18" strokeLinecap="round" />
        <path d="M56 30 V28 a4 4 0 0 1 8 0 v16" strokeLinecap="round" />
        <path d="M32 44 a4 4 0 0 1 8 0 v16 q0 8 8 8 h8 q12 0 12-12 V36" strokeLinecap="round" />
        <circle cx="48" cy="22" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="56" cy="24" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="64" cy="24" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    tag: "Escalar",
    title: "Acercar y alejar",
    desc: "Gesto de pellizco con pulgar e índice para escalar el objeto AR en tiempo real. Igual que en la pantalla pero proyectado en el espacio físico.",
    detail: "WebXR pinch + MediaPipe",
    icon: (
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="40" cy="40" r="18" strokeDasharray="6 4" />
        <circle cx="40" cy="40" r="8" />
        <path d="M18 18 L28 28M62 18 L52 28M18 62 L28 52M62 62 L52 52" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    tag: "Manos AR",
    title: "Accesorios para manos",
    desc: "Prueba relojes, anillos o guantes virtuales que siguen el movimiento exacto de tus manos fotograma a fotograma.",
    detail: "MindAR.js + Three.js overlay",
    icon: (
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M40 60 V32 a4 4 0 0 1 8 0 v12M48 32 V28 a4 4 0 0 1 8 0 v16M56 30 V28 a4 4 0 0 1 8 0 v16M32 44 a4 4 0 0 1 8 0 v16 q0 8 8 8 h8 q12 0 12-12 V36" strokeLinecap="round" />
        <rect x="42" y="42" width="16" height="8" rx="2" fill="none" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    tag: "Cara y Cuerpo",
    title: "Accesorios faciales y full-body",
    desc: "Gafas, sombreros y prendas con face mesh de 468 puntos. Outfits completos sobre el cuerpo con pose estimation de 33 puntos.",
    detail: "MediaPipe Face Mesh + BlazePose",
    icon: (
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="40" cy="32" rx="18" ry="22" />
        <circle cx="32" cy="30" r="4" strokeOpacity="0.5" />
        <circle cx="48" cy="30" r="4" strokeOpacity="0.5" />
        <path d="M34 40 q6 4 12 0" strokeLinecap="round" />
        <rect x="26" y="27" width="28" height="8" rx="4" fill="none" strokeWidth="2.5" />
      </svg>
    ),
  },
];

export default function Interaccion() {
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
                Tu cuerpo es <br /><span className="text-primary">el controlador.</span>
              </h1>
              <p className="text-[18px] text-text-muted leading-[1.4] max-w-[600px]">
                Sin mandos, sin botones. La cámara detecta tus manos, cara y postura corporal en tiempo real y los convierte en input para la escena AR.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <InteractSlideshow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Interaction cards */}
      <section className="px-6 py-[112px] bg-bg-base">
        <div className="max-w-[1220px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTERACTIONS.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-bg-subtle rounded-[24px] p-10 flex flex-col h-full border border-border-subtle hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110" />
                
                <div className="text-primary mb-6 bg-bg-base p-4 rounded-2xl w-fit shadow-sm">
                  {item.icon}
                </div>
                
                <p className="text-[12px] font-bold text-secondary uppercase tracking-wide mb-2">{item.tag}</p>
                <h3 className="text-[28px] font-bold text-text-base leading-[1.2] mb-4">{item.title}</h3>
                <p className="text-[16px] text-text-muted leading-[1.6] mb-6 flex-1">{item.desc}</p>
                
                <div className="pt-4 border-t border-border-subtle">
                  <p className="text-[13px] font-semibold text-text-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Tecnología: {item.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="max-w-[1220px] mx-auto mt-16 text-center">
          <Reveal>
            <Btn variant="primary" size="lg" onClick={() => window.location.href = "/editor/"}>
              Probar interacción en el Editor →
            </Btn>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
