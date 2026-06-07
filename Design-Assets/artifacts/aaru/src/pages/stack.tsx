import React from "react";
import { useLocation } from "wouter";
import SiteNav from "@/components/SiteNav";
import { Reveal, Btn } from "@/components/ui";

const TECH = [
  {
    name: "Three.js", role: "Motor 3D", status: "r169",
    desc: "Renderizado WebGL de toda la escena 3D — geometrías, materiales PBR, shaders y animaciones GLTF directamente en el navegador.",
    repo: "mrdoob/three.js",
  },
  {
    name: "WebXR API", role: "AR / VR nativo", status: "W3C",
    desc: "Estándar del navegador para experiencias AR y VR. Sin app, sin plugin — funciona en Chrome Android y Safari iOS desde el navegador.",
    repo: "immersive-web/webxr",
  },
  {
    name: "AR.js", role: "Tracking por marcador", status: "v3.4",
    desc: "Ancla modelos 3D a marcadores físicos o códigos QR escaneados con la cámara del celular. Basado en Three.js y WebXR.",
    repo: "AR-js-org/AR.js",
  },
  {
    name: "MindAR.js", role: "Face & Image tracking", status: "v1.2",
    desc: "Tracking de cara (468 puntos) e imágenes en tiempo real — la base del modo Accesorios AR para cara y manos.",
    repo: "hiukim/mind-ar-js",
  },
  {
    name: "MediaPipe", role: "Manos · Pose · Cara", status: "v0.10",
    desc: "Suite de modelos ML de Google para detección de manos (21 pts), estimación de pose corporal (33 pts) y face mesh (468 pts).",
    repo: "google/mediapipe",
  },
  {
    name: "Llama (tu API)", role: "Generación IA", status: "API",
    desc: "Conectas tu propia API de Llama para generar modelos 3D desde texto (Modo Construye IA) y responder preguntas contextuales del espacio.",
    repo: "meta-llama/llama",
  },
  {
    name: "QRCode.js", role: "Generación de QR", status: "v1.5",
    desc: "Genera el código QR del enlace de escena AR directamente en el cliente — sin servidor externo. Soporta corrección de errores nivel H.",
    repo: "davidshimjs/qrcodejs",
  },
  {
    name: "Model Viewer", role: "Visor AR móvil", status: "v4.0",
    desc: "Web component de Google para visualizar GLTF/GLB en AR en iOS (Quick Look) y Android (Scene Viewer) sin instalar ninguna app.",
    repo: "google/model-viewer",
  },
];

export default function Stack() {
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
          
          <Reveal>

            <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight text-text-base mb-6 max-w-[800px]">
              <span className="text-primary">100% Open Source.</span>
            </h1>
            <p className="text-[18px] text-text-muted leading-[1.4] max-w-[600px]">
              Sin vendor lock-in. Inspecciona, extiende y despliega donde quieras. La IA se conecta a tu propio modelo — tú controlas los datos y la infraestructura.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tech grid */}
      <section className="px-6 py-[112px] bg-bg-base">
        <div className="max-w-[1220px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: manifesto */}
          <div className="lg:col-span-1">
            <Reveal>
              <div className="sticky top-28">
                <h2 className="text-[32px] font-bold leading-[1.2] text-text-base mb-6">
                  Código abierto como ventaja competitiva.
                </h2>
                <p className="text-[16px] leading-[1.6] text-text-muted mb-4">
                  Construir sobre tecnologías abiertas significa que puedes auditar cada línea, extender cualquier componente y desplegar en tu propia infraestructura.
                </p>
                <p className="text-[16px] leading-[1.6] text-text-muted mb-8">
                  La IA es el único componente que debes conectar tú mismo — por diseño. Tus datos, tu modelo, tu control.
                </p>
                <div className="p-6 bg-bg-subtle rounded-[16px] border border-border-subtle shadow-sm">
                  <p className="text-[12px] uppercase font-bold text-secondary mb-3 tracking-wide">Tu stack mínimo</p>
                  <code className="text-[14px] leading-[1.8] block text-text-base font-mono">
                    three.js + webxr<br />
                    ar.js o mindar.js<br />
                    mediapipe<br />
                    llama api (tuya)<br />
                    qrcode.js
                  </code>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: tech cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TECH.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-bg-subtle rounded-[20px] p-6 flex flex-col h-full border border-border-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-[20px] font-bold text-text-base mb-1">{t.name}</h3>
                        <p className="text-[12px] font-semibold text-primary uppercase tracking-wide">{t.role}</p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-1 rounded bg-bg-base text-secondary border border-border-subtle">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[14px] text-text-muted leading-[1.6] mb-4 flex-1">{t.desc}</p>
                    <p className="text-[12px] font-mono text-text-muted opacity-70">github.com/{t.repo}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-[112px] px-6 bg-bg-base">
        <div className="max-w-[1220px] mx-auto bg-text-base rounded-[24px] p-16 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "var(--color-deep-space-gradient)" }} />
          <Reveal>
            <h2 className="text-[32px] font-bold text-bg-base mb-6 relative z-10 leading-[1.2]">¿Listo para construir?</h2>
            <p className="text-[18px] text-bg-subtle mb-10 max-w-[600px] mx-auto relative z-10 leading-[1.4] opacity-90">
              Empieza a construir tu primera escena AR con un stack abierto, potente y personalizable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Btn variant="primary" size="lg" onClick={() => window.location.href = "/editor/"} className="!text-text-base !bg-primary border-none">
                Abrir Editor
              </Btn>
              <Btn variant="ghost" size="lg" onClick={() => setLocation("/modos")} className="!text-bg-base !border-bg-base hover:!bg-bg-base/10">
                Explorar Modos
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
