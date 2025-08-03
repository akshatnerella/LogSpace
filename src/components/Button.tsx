import React from 'react'
import Link from 'next/link'

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

interface ButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: never
}

interface LinkButtonProps extends BaseButtonProps {
  href: string
  onClick?: never
}

type ButtonComponentProps = ButtonProps | LinkButtonProps

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  href,
  ...props 
}: ButtonComponentProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3 text-base rounded-xl'
  }
  
  const variantClasses = {
    primary: 'bg-primary text-background hover:bg-primary-hover focus:ring-primary shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent shadow-lg hover:shadow-xl hover:scale-105',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface-hover focus:ring-border',
    outline: 'border border-border text-foreground hover:bg-surface-hover focus:ring-border'
  }
  
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
