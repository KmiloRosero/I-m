import type { ReactNode } from 'react'

interface ButtonLinkProps {
  children: ReactNode
  href: string
  variant: 'primary' | 'secondary'
}

export function ButtonLink({ children, href, variant }: ButtonLinkProps) {
  return (
    <a className="button-link" data-variant={variant} href={href}>
      {children}
    </a>
  )
}
