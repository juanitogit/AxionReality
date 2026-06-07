import React, { useState } from "react";
import { useLocation } from "wouter";
import { Reveal, Btn } from "@/components/ui";
import SiteNav from "@/components/SiteNav";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          name: isRegister ? name : email.split("@")[0],
          google_id: null,
        }),
      });
      const data = await res.json();
      if (data.success) window.location.href = "/editor/";
      else alert("Error al iniciar sesión");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: "demo@axionreality.com",
          name: "Usuario Google",
          google_id: "google_demo_" + Date.now(),
        }),
      });
      const data = await res.json();
      if (data.success) window.location.href = "/editor/";
      else alert("Error al iniciar sesión");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-300 flex flex-col" style={{ fontFamily: "var(--font-tt-norms-pro)" }}>
      <SiteNav />

      <div className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none"
             style={{ background: "var(--color-deep-space-gradient)", filter: "blur(100px)", borderRadius: "50%" }} />

        <div className="w-full max-w-[420px] relative z-10">
          <Reveal>
            <div className="bg-bg-subtle border border-border-subtle rounded-[24px] p-8 md:p-10 shadow-xl">

              {/* Heading */}
              <div className="mb-8 text-center">
                <h1 className="text-[28px] font-bold leading-[1.2] text-text-base mb-2">
                  {isRegister ? "Crea tu cuenta" : "Bienvenido de nuevo"}
                </h1>
                <p className="text-[14px] text-text-muted">
                  {isRegister
                    ? "Registra tu cuenta para guardar proyectos en la nube."
                    : "Accede a tu panel para gestionar tus proyectos AR."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {isRegister && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-text-muted">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                      className="bg-bg-base text-text-base placeholder:text-text-muted/50 border border-border-subtle focus:border-primary outline-none rounded-[10px] py-3 px-4 text-[14px] transition-colors"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-text-muted">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    required
                    className="bg-bg-base text-text-base placeholder:text-text-muted/50 border border-border-subtle focus:border-primary outline-none rounded-[10px] py-3 px-4 text-[14px] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-text-muted">
                      Contraseña
                    </label>
                    {!isRegister && (
                      <a href="#" className="text-[12px] text-primary hover:brightness-110 transition-colors font-medium">
                        ¿Olvidaste tu contraseña?
                      </a>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-bg-base text-text-base placeholder:text-text-muted/50 border border-border-subtle focus:border-primary outline-none rounded-[10px] py-3 px-4 text-[14px] transition-colors"
                  />
                </div>

                <Btn type="submit" variant="primary" size="lg" className="mt-2 w-full">
                  {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
                </Btn>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 border-t border-border-subtle" />
                <span className="text-[12px] font-semibold text-text-muted">o</span>
                <div className="flex-1 border-t border-border-subtle" />
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 bg-bg-base text-text-base border border-border-subtle hover:bg-bg-subtle transition-colors rounded-[10px] py-3.5 px-4 font-semibold text-[14px] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar con Google
              </button>

            </div>

            <p className="text-center text-[14px] text-text-muted mt-8 font-medium">
              {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary hover:underline underline-offset-2 bg-transparent border-none cursor-pointer font-semibold text-[14px]"
              >
                {isRegister ? "Iniciar Sesión" : "Crear una gratis"}
              </button>
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
