import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variants = {
  primary:
    "neumorph-gold-raised text-[#0c0b08] font-bold tracking-wide active:scale-[0.97] transition-all duration-200",
  secondary:
    "neumorph-raised text-champagne-300 border-gold-500/10 hover:shadow-gold-sm hover:border-gold-500/20 active:scale-[0.97] transition-all duration-300",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.97]",
  ghost:
    "text-noir-400 hover:text-champagne-300 hover:bg-[#1e1e2e]/60 active:scale-[0.97]",
};

const sizes = {
  sm: "px-4 py-2 text-xs rounded-xl",
  md: "px-6 py-3 text-sm rounded-2xl",
  lg: "px-8 py-4 text-base rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
