import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses = {
  primary:
    "glass-gold text-sm tracking-[0.08em] active:scale-[0.97] transition-all duration-300",
  secondary:
    "neumorph-raised text-champagne-300/80 border-gold-500/10 hover:text-champagne-300 active:scale-[0.97] transition-all duration-300",
  danger:
    "bg-red-500/8 text-red-400/80 border border-red-500/15 hover:bg-red-500/12 hover:text-red-400 active:scale-[0.97] transition-all duration-200",
  ghost:
    "text-noir-400 hover:text-champagne-300/80 hover:bg-white/[0.03] active:scale-[0.97] transition-all duration-200",
};

const sizeClasses = {
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
      className={`inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
