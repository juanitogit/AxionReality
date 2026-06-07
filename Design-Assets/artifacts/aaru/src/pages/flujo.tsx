import React from "react";
import { useLocation } from "wouter";
import SiteNav from "@/components/SiteNav";
import { Reveal, Btn } from "@/components/ui";
const FlujoSlideshow = () => {
  const [current, setCurrent] = React.useState(0);
  const images = [
    "/flujo_slide_1_1780592431339.png",
    "/flujo_slide_2_1780592445072.png",
    "/flujo_slide_3_1780592458391.png",
    "/flujo_slide_4_1780592470302.png"
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
          alt="Flujo"
        />
      ))}
    </div>
  );
};

const EditorMockup = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[16px] border border-border-subtle bg-bg-base shadow-sm" style={{ minHeight: 220 }}>
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      opacity: 0.3
    }} />
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none" stroke="var(--primary)" strokeWidth="2">
        <path d="M50 10 L80 30 L80 60 L50 80 L20 60 L20 30 Z" />
        <path d="M50 10 L50 80M20 30 L80 60M80 30 L20 60" strokeOpacity="0.35" />
        <circle cx="50" cy="10" r="4" fill="var(--bg-base)" />
        <circle cx="80" cy="30" r="4" fill="var(--bg-base)" />
        <circle cx="80" cy="60" r="4" fill="var(--bg-base)" />
        <circle cx="50" cy="80" r="4" fill="var(--bg-base)" />
        <circle cx="20" cy="60" r="4" fill="var(--bg-base)" />
        <circle cx="20" cy="30" r="4" fill="var(--bg-base)" />
      </svg>
    </div>
    <div className="absolute top-0 left-0 w-full h-10 border-b border-border-subtle flex items-center px-4 gap-2 bg-bg-base">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
    </div>
    <div className="absolute bottom-3 right-4 text-[11px] font-semibold text-text-muted">Editor Web</div>
  </div>
);

const QRMockup = () => (
  <div className="w-full h-full relative flex items-center justify-center rounded-[16px] bg-bg-base border border-border-subtle shadow-sm" style={{ minHeight: 220 }}>
    <div className="relative">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="0" y="0" width="50" height="50" stroke="var(--text-base)" strokeWidth="3" strokeOpacity="0.7" fill="none" rx="4" />
        <rect x="12" y="12" width="26" height="26" fill="var(--text-base)" fillOpacity="0.8" rx="2" />
        <rect x="70" y="0" width="50" height="50" stroke="var(--text-base)" strokeWidth="3" strokeOpacity="0.7" fill="none" rx="4" />
        <rect x="82" y="12" width="26" height="26" fill="var(--text-base)" fillOpacity="0.8" rx="2" />
        <rect x="0" y="70" width="50" height="50" stroke="var(--text-base)" strokeWidth="3" strokeOpacity="0.7" fill="none" rx="4" />
        <rect x="12" y="82" width="26" height="26" fill="var(--text-base)" fillOpacity="0.8" rx="2" />
        {[[70,70],[82,70],[94,70],[70,82],[94,82],[82,94],[70,106],[94,106],[106,70],[106,94],[106,106]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="12" height="12" fill="var(--text-base)" fillOpacity="0.6" rx="2" />
        ))}
        <rect x="44" y="44" width="12" height="12" fill="var(--primary)" rx="2" />
        <rect x="64" y="44" width="12" height="12" fill="var(--primary)" rx="2" />
        <rect x="44" y="64" width="12" height="12" fill="var(--primary)" rx="2" />
      </svg>
    </div>
  </div>
);

const PhoneMockup = () => (
  <div className="w-full h-full relative flex items-center justify-center rounded-[16px] bg-bg-base border border-border-subtle shadow-sm" style={{ minHeight: 220 }}>
    <div className="relative">
      <svg width="80" height="150" viewBox="0 0 80 150" fill="none">
        <rect x="4" y="4" width="72" height="142" rx="12" stroke="var(--text-base)" strokeWidth="2" strokeOpacity="0.8" />
        <rect x="8" y="10" width="64" height="130" rx="6" fill="var(--bg-subtle)" />
        <rect x="30" y="6" width="20" height="4" rx="2" fill="var(--text-base)" fillOpacity="0.8" />
        <path d="M16 80 l12-20 10 14 8-10 14 20Z" fill="var(--primary)" fillOpacity="0.1" stroke="var(--primary)" strokeOpacity="0.8" strokeWidth="2" />
        <ellipse cx="38" cy="50" rx="10" ry="6" fill="var(--secondary)" fillOpacity="0.1" stroke="var(--secondary)" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="40" cy="120" r="14" stroke="var(--primary)" strokeOpacity="0.5" strokeWidth="2" fill="var(--primary)" fillOpacity="0.1" />
        <circle cx="40" cy="120" r="6" fill="var(--primary)" />
      </svg>
    </div>
  </div>
);

const STEPS = [
  {
    n: "01", tag: "En el PC", 
    title: "Construye o genera",
    desc: "Usa el editor 3D en el navegador para modelar manualmente, o escribe un prompt y la IA genera la geometría, materiales y animaciones.",
    visual: <EditorMockup />,
    tip: "También puedes importar modelos existentes (.glb, .obj, .fbx)",
  },
  {
    n: "02", tag: "Genera el QR",
    title: "Un QR, toda la escena",
    desc: "AXION empaqueta el modelo y la configuración de la escena AR en un enlace seguro y genera el código QR al instante. Compártelo o imprímelo.",
    visual: <QRMockup />,
    tip: "El enlace incluye geometría, texturas y posición inicial del objeto",
  },
  {
    n: "03", tag: "Celular AR",
    title: "Escanea y visualiza",
    desc: "El navegador del celular abre la escena AR directamente. El objeto aparece en el espacio físico: muévelo, rótalo y escálalo con gestos naturales.",
    visual: <PhoneMockup />,
    tip: "Funciona en Chrome (Android) y Safari (iOS) sin instalar ninguna app",
  },
];

export default function Flujo() {
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
                Del modelo <br /><span className="text-primary">al mundo real.</span>
              </h1>
              <p className="text-[18px] text-text-muted leading-[1.4] max-w-[600px]">
                Sin apps. Sin cables. Construyes en el PC, generas el QR y lo escaneas con el celular — el objeto aparece en tu espacio en segundos.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <FlujoSlideshow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-[112px] bg-bg-base">
        <div className="max-w-[1220px] mx-auto flex flex-col gap-12">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-bg-subtle rounded-[32px] overflow-hidden border border-border-subtle shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  
                  {/* Text side */}
                  <div className="p-10 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-bg-base flex items-center justify-center text-primary font-bold text-[18px] shadow-sm">
                        {s.n}
                      </div>
                      <span className="text-[14px] font-bold uppercase tracking-wide text-secondary">{s.tag}</span>
                    </div>
                    <h2 className="text-[32px] font-bold text-text-base leading-[1.2] mb-4">
                      {s.title}
                    </h2>
                    <p className="text-[16px] text-text-muted leading-[1.6] mb-6">
                      {s.desc}
                    </p>
                    <div className="p-4 bg-bg-base rounded-[12px] border border-border-subtle flex items-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <p className="text-[13px] text-text-muted font-semibold leading-[1.4]">{s.tip}</p>
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className="p-10 lg:p-16 bg-border-subtle/20 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-border-subtle">
                    <div className="w-full max-w-[320px]">
                      {s.visual}
                    </div>
                  </div>
                  
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-[1220px] mx-auto mt-20 text-center">
          <Reveal>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Btn variant="primary" size="lg" onClick={() => window.location.href = "/editor/"}>
                Comenzar Flujo →
              </Btn>
              <Btn variant="ghost" size="lg" onClick={() => setLocation("/modos")}>
                Ver todos los modos
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
