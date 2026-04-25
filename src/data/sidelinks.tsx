'use client'

import { JSX } from 'react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element,
  is_sidelink: number,
}
export interface SideLink extends NavLink {
  sub?: NavLink[]
}