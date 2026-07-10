import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const base =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-base font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-azul text-white shadow-card hover:bg-azul-dark hover:shadow-pop',
  secondary: 'border border-line bg-white text-ink hover:border-azul/40 hover:bg-panel',
  ghost: 'text-azul hover:bg-azul-soft',
}

export function Button({ variant = 'secondary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
