import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
}

const variants = {
  primary:
    "bg-gold-500 text-[#08080c] hover:bg-gold-400 shadow-[0_0_20px_rgba(245,166,35,0.12)] hover:shadow-[0_0_28px_rgba(245,166,35,0.18)]",
  secondary:
    "bg-white/[0.04] text-noir-300 border border-white/[0.08] hover:border-white/[0.14] hover:text-noir-100 hover:bg-white/[0.06]",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  ghost:
    "text-noir-500 hover:text-noir-200 hover:bg-white/[0.04]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
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
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
