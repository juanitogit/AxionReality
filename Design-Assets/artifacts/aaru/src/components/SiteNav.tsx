import React, { useState } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth";

const NAV_LINKS = [
  { label: "Modos", href: "/modos" },
  { label: "Flujo", href: "/flujo" },
  { label: "Interacción", href: "/interaccion" },
];

const LogoMark = () => (
  <img src={`${import.meta.env.BASE_URL}logo-cube.png`} alt="AXION" width={28} height={28} className="shrink-0" style={{ objectFit: 'contain' }} />
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function SiteNav() {
  const [location, setLocation] = useLocation();
  const { isDark, toggle } = useTheme();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md border-b border-border-subtle transition-colors duration-300">
      <div className="max-w-[1220px] mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-3 select-none bg-transparent border-none cursor-pointer"
        >
          <LogoMark />
          <span className="font-bold text-[20px] tracking-tight text-text-base">
            AXION <span className="font-normal text-text-muted">Reality</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => setLocation(href)}
              className="bg-transparent border-none cursor-pointer font-semibold text-[14px] transition-colors"
              style={{
                color: location === href ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-bg-subtle text-text-muted hover:text-text-base transition-colors"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {loading ? null : user ? (
            /* ── Usuario logueado ── */
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-bg-subtle border border-border-subtle rounded-full px-3 py-1.5 cursor-pointer hover:bg-border-subtle transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[13px] font-bold text-bg-base">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] font-semibold text-text-base hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-bg-subtle border border-border-subtle rounded-[12px] shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border-subtle">
                    <p className="text-[13px] font-bold text-text-base">{user.name}</p>
                    <p className="text-[11px] text-text-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); setLocation("/dashboard"); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-text-base hover:bg-bg-base transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Mis Proyectos
                  </button>
                  <button
                    onClick={() => { window.location.href = "/editor/"; }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-text-base hover:bg-bg-base transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Abrir Editor
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#ff4d4d] hover:bg-bg-base transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── No logueado ── */
            <>
              <button
                onClick={() => setLocation("/login")}
                className="text-[14px] font-semibold text-text-muted hover:text-text-base cursor-pointer transition-colors bg-transparent border-none mr-2"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => window.location.href = "/editor/"}
                className="bg-bg-subtle text-secondary hover:bg-border-subtle rounded-[40px] px-[24px] py-[10px] font-semibold text-[14px] cursor-pointer transition-colors border-none"
              >
                Abrir Editor
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
