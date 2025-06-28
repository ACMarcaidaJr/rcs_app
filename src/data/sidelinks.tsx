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
import { JSX } from 'react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/page/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },

  {
    title: 'Records Inventory',
    label: '',
    href: '',
    icon: <IconCheckupList size={18} />,
    sub: [
      {
        title: 'NAP Form 1',
        label: '3',
        href: '/page/nap-form-one',
        icon: <IconClipboardPlus size={18} />,
      },
      {
        title: 'Records',
        label: '3',
        href: '/page/records',
        icon: <IconClipboardPlus size={18} />,
      },
    ]
  },
  {
    title: 'Tracking System',
    label: '',
    href: '',
    icon: <IconCheckupList size={18} />,
    sub: [
      {
        title: 'New Record',
        label: '3',
        href: '/page/tracking',
        icon: <IconClipboardPlus size={18} />,
      },
      {
        title: 'Find',
        label: '3',
        href: '/page/find',
        icon: <IconSearch size={18} />,
      },
      {
        title: 'Issuances',
        label: '3',
        href: '/page/issuances',
        icon: <IconColumns size={18} />,
      }
    ]
  },
  {
    title: 'Mini-Tools',
    label: '',
    href: '',
    icon: <IconTools size={18} />,
    sub: [
      {
        title: 'Stamping',
        label: '',
        href: '/page/stamping',
        icon: <IconRubberStamp size={18} />,
      },

    ]
  },

  // {
  //   title: 'Apps',
  //   label: '',
  //   href: '/apps',
  //   icon: <IconApps size={18} />,
  // },

  // {
  //   title: 'Authentication',
  //   label: '',
  //   href: '',
  //   icon: <IconUserShield size={18} />,
  //   sub: [
  //     {
  //       title: 'Sign In (email + password)',
  //       label: '',
  //       href: '/sign-in',
  //       icon: <IconHexagonNumber1 size={18} />,
  //     },
  //     {
  //       title: 'Sign In (Box)',
  //       label: '',
  //       href: '/sign-in-2',
  //       icon: <IconHexagonNumber2 size={18} />,
  //     },
  //     {
  //       title: 'Sign Up',
  //       label: '',
  //       href: '/sign-up',
  //       icon: <IconHexagonNumber3 size={18} />,
  //     },
  //     {
  //       title: 'Forgot Password',
  //       label: '',
  //       href: '/forgot-password',
  //       icon: <IconHexagonNumber4 size={18} />,
  //     },
  //     {
  //       title: 'OTP',
  //       label: '',
  //       href: '/otp',
  //       icon: <IconHexagonNumber5 size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Users',
  //   label: '',
  //   href: '/users',
  //   icon: <IconUsers size={18} />,
  // },
  // {
  //   title: 'Requests',
  //   label: '10',
  //   href: '/requests',
  //   icon: <IconRouteAltLeft size={18} />,
  //   sub: [
  //     {
  //       title: 'Trucks',
  //       label: '9',
  //       href: '/trucks',
  //       icon: <IconTruck size={18} />,
  //     },
  //     {
  //       title: 'Cargos',
  //       label: '',
  //       href: '/cargos',
  //       icon: <IconBoxSeam size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Analysis',
  //   label: '',
  //   href: '/analysis',
  //   icon: <IconChartHistogram size={18} />,
  // },
  // {
  //   title: 'Extra Components',
  //   label: '',
  //   href: '/extra-components',
  //   icon: <IconComponents size={18} />,
  // },
  // {
  //   title: 'Error Pages',
  //   label: '',
  //   href: '',
  //   icon: <IconExclamationCircle size={18} />,
  //   sub: [
  //     {
  //       title: 'Not Found',
  //       label: '',
  //       href: '/404',
  //       icon: <IconError404 size={18} />,
  //     },
  //     {
  //       title: 'Internal Server Error',
  //       label: '',
  //       href: '/500',
  //       icon: <IconServerOff size={18} />,
  //     },
  //     {
  //       title: 'Maintenance Error',
  //       label: '',
  //       href: '/503',
  //       icon: <IconBarrierBlock size={18} />,
  //     },
  //     {
  //       title: 'Unauthorised Error',
  //       label: '',
  //       href: '/401',
  //       icon: <IconLock size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Settings',
  //   label: '',
  //   href: '/settings',
  //   icon: <IconSettings size={18} />,
  // },
]
