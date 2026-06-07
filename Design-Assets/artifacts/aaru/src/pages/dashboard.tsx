import React, { useEffect, useState, useCallback } from "react";

import { useLocation } from "wouter";
import SiteNav from "@/components/SiteNav";
import { Reveal, Btn } from "@/components/ui";

interface Project {
  id: number;
  name: string;
  model_id: string;
  created_at: string;
  updated_at: string;
}

/* ── Custom Confirm Modal ─────────────────────────────── */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "info";
}) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "transparent",
          maxWidth: 420,
          width: "90%",
          animation: "modalPop .25s cubic-bezier(.34,1.56,.64,1)",
          textAlign: "center",
        }}
      >
        <div style={{
          fontSize: 64,
          lineHeight: 1,
          color: variant === "danger" ? "#ef4444" : "#0073d3",
          fontWeight: 300,
          marginBottom: 16,
          textShadow: variant === "danger" ? "0 0 30px rgba(239,68,68,0.5)" : "0 0 30px rgba(0,115,211,0.5)",
          animation: "pulseFloat 3s ease-in-out infinite"
        }}>
          {variant === "danger" ? "✕" : "!"}
        </div>

        <h3 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
          {title}
        </h3>
        <p style={{ fontSize: 16, color: "#a1a1aa", lineHeight: 1.5, marginBottom: 32 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "12px 32px",
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#e4e4e7",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "12px 32px",
              borderRadius: 30,
              border: "none",
              background: variant === "danger" ? "#ef4444" : "#0073d3",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .2s",
              boxShadow: variant === "danger" ? "0 4px 20px rgba(239,68,68,0.4)" : "0 4px 20px rgba(0,115,211,0.4)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = variant === "danger" ? "0 8px 25px rgba(239,68,68,0.5)" : "0 8px 25px rgba(0,115,211,0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = variant === "danger" ? "0 4px 20px rgba(239,68,68,0.4)" : "0 4px 20px rgba(0,115,211,0.4)";
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalPop { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes pulseFloat { 0%,100% { transform:translateY(0) scale(1) } 50% { transform:translateY(-5px) scale(1.05) } }
      `}</style>
    </div>
  );
}

/* ── Toast Notification ───────────────────────────────── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        padding: "12px 28px",
        borderRadius: 14,
        background: type === "success" ? "rgba(0,224,92,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${type === "success" ? "rgba(0,224,92,0.3)" : "rgba(239,68,68,0.3)"}`,
        backdropFilter: "blur(12px)",
        color: type === "success" ? "#00e05c" : "#ef4444",
        fontSize: 14,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        animation: "toastSlide .3s ease",
      }}
    >
      {type === "success" ? "✓" : "✕"} {message}
      <style>{`@keyframes toastSlide { from { opacity:0; transform:translateX(-50%) translateY(20px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }`}</style>
    </div>
  );
}

/* ── Dashboard Page ───────────────────────────────────── */
export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Modal state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; projectId: number | null; projectName: string }>({
    open: false,
    projectId: null,
    projectName: "",
  });

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (res.status === 401) {
          setLocation("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setProjects(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [setLocation]);

  const handleOpenEditor = (modelId: string, projectName: string) => {
    window.location.href = `/editor/?load=${modelId}&name=${encodeURIComponent(projectName)}`;
  };

  const requestDelete = (id: number, name: string) => {
    setDeleteModal({ open: true, projectId: id, projectName: name });
  };

  const confirmDelete = useCallback(async () => {
    const id = deleteModal.projectId;
    if (!id) return;
    setDeleteModal({ open: false, projectId: null, projectName: "" });

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setToast({ show: true, message: "Proyecto eliminado correctamente", type: "success" });
      } else {
        const errorMsg = data?.error || "Error al eliminar el proyecto";
        setToast({ show: true, message: errorMsg, type: "error" });
      }
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Error de conexión al eliminar", type: "error" });
    }
  }, [deleteModal.projectId]);

  return (
    <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-300 flex flex-col" style={{ fontFamily: "var(--font-tt-norms-pro)" }}>
      <SiteNav />

      {/* Custom Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Eliminar proyecto"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.projectName}"? Esta acción es irreversible y se borrarán todos los archivos asociados.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, projectId: null, projectName: "" })}
        variant="danger"
      />

      {/* Toast */}
      {toast?.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12 pt-32">
        <Reveal>
          <div className="mb-8">
            <button onClick={() => setLocation("/")} className="text-text-muted hover:text-text-base flex items-center gap-2 transition-colors text-[14px] font-medium bg-transparent border-none cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Volver al inicio
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-[32px] font-bold text-text-base leading-tight">Gestionar Mis Proyectos</h1>
              <p className="text-[16px] text-text-muted mt-2">Visualiza y edita tus diseños AR guardados en la nube.</p>
            </div>
            <Btn onClick={() => window.location.href = "/editor/"} variant="primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Crear Nuevo Proyecto
            </Btn>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-bg-subtle border border-border-subtle rounded-[24px] p-12 text-center">
              <div className="w-20 h-20 bg-bg-base rounded-full flex items-center justify-center mx-auto mb-6 border border-border-subtle shadow-sm">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="text-[20px] font-bold text-text-base mb-3">Aún no tienes proyectos</h3>
              <p className="text-[15px] text-text-muted max-w-md mx-auto mb-8">
                Empieza a crear increíbles experiencias de Realidad Aumentada usando AXION Studio. Es fácil y rápido.
              </p>
              <Btn onClick={() => window.location.href = "/editor/"} variant="primary" size="lg">
                Comenzar mi primer proyecto
              </Btn>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-bg-subtle border border-border-subtle rounded-[16px] hover:border-primary/50 transition-all duration-300 group flex flex-col md:flex-row p-4 gap-6">
                  {/* Model Preview using model-viewer */}
                  <div className="w-full md:w-[200px] h-[200px] bg-bg-base relative border border-border-subtle rounded-[12px] overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--color-fg) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <model-viewer 
                      src={`/models/${project.model_id}`} 
                      auto-rotate 
                      camera-controls 
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%', outline: 'none' }}
                      interaction-prompt="none"
                    ></model-viewer>

                    <div className="absolute inset-0 bg-bg-base/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                      <Btn onClick={(e) => { e.stopPropagation(); handleOpenEditor(project.model_id, project.name); }} variant="primary" className="pointer-events-auto shadow-lg scale-90">
                        Abrir Editor
                      </Btn>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <h3 className="text-[20px] font-bold text-text-base truncate" title={project.name}>
                      {project.name}
                    </h3>
                    <p className="text-[14px] text-text-muted">
                      Última modificación: {new Date(project.updated_at).toLocaleDateString()} a las {new Date(project.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-3">
                      <Btn onClick={() => handleOpenEditor(project.model_id, project.name)} variant="primary" className="shadow-sm">
                        Continuar editando
                      </Btn>
                      <button onClick={() => requestDelete(project.id, project.name)} className="text-text-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-bg-base cursor-pointer border border-transparent hover:border-red-500/20" title="Eliminar proyecto">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </main>
    </div>
  );
}
