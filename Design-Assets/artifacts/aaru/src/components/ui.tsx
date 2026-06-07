import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Reveal = ({ children, delay = 0, y = 30, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) => {
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

  return <div ref={ref} className={`opacity-0 ${className}`}>{children}</div>;
};

export const Btn = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "nav";
  size?: "sm" | "md" | "lg";
}) => {
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
    <button className={`${base} ${sizes[size]} ${vars[variant]} ${className}`} {...p}>
      {children}
    </button>
  );
};
