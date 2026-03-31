'use client'
import {
  IconChecklist,
  IconLayoutDashboard,
  IconColumns,
  IconCheckupList,
  IconTools,
  IconRubberStamp,
  IconSearch,
  IconClipboardPlus
} from '@tabler/icons-react'
import { Icon } from "@iconify/react";

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