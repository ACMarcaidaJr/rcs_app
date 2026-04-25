'use client'

import { useEffect, useState } from 'react'
import { IconChevronsLeft, IconMenu2, IconX, IconAffiliateFilled } from '@tabler/icons-react'
import { Layout } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/theme-switch'
import { useSession } from "next-auth/react"

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  const { data: session } = useSession()

  /* Prevent scrolling when mobile nav is open */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] bg-background md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-20' : 'md:w-64'
        }`,
        className
      )}
    >
      {/* Mobile Overlay */}
      <div
        onClick={() => setNavOpened(false)}
        className={cn(
          'absolute inset-0 transition-opacity duration-500 bg-black md:hidden',
          navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0 pointer-events-none'
        )}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        {/* Brand Header */}
        <Layout.Header
          sticky
          className={cn(
            'z-50 flex items-center py-3 shadow-sm transition-all',
            isCollapsed ? 'justify-center md:px-0' : 'justify-between px-4'
          )}
        >
          <div className={cn(
            'flex items-center overflow-hidden',
            isCollapsed ? 'justify-center w-full' : 'gap-2'
          )}>
            {/* Logo Icon - Always Visible */}
            <div className='flex items-center justify-center size-8 p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg shrink-0'>
              <IconAffiliateFilled className="size-full" />
            </div>

            {/* Text - Hidden when collapsed */}
            {!isCollapsed && (
              <div className='flex items-baseline animate-in fade-in slide-in-from-left-2 duration-300'>
                <p className='text-base font-bold tracking-tight text-foreground'>Records</p>
                <p className='text-base font-black tracking-tight text-blue-600 dark:text-blue-400'>Hub</p>
              </div>
            )}
          </div>

          {/* Actions - Completely hidden when collapsed */}
          {!isCollapsed && (
            <div className='flex items-center gap-2 animate-in fade-in duration-300'>
              <ThemeSwitch />
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                onClick={() => setNavOpened((prev) => !prev)}
              >
                {navOpened ? <IconX /> : <IconMenu2 />}
              </Button>
            </div>
          )}
        </Layout.Header>
        {/* Navigation Area */}
        <Layout.Body className={cn('flex flex-col p-0 m-0 overflow-hidden ', isCollapsed && 'md:px-0')}>
          {session?.moduleLinks?.length ? (
            <Nav
              navOpened={navOpened}
              id='sidebar-menu'
              className={cn(
                'z-40 h-full transition-all duration-300',
                navOpened ? 'max-h-screen opacity-100' : 'max-h-0 md:py-3 md:max-h-none md:opacity-100'
              )}
              closeNav={() => setNavOpened(false)}
              isCollapsed={isCollapsed}
              links={session?.moduleLinks}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center p-4 text-xs text-muted-foreground text-center'>
              No Side Links Available
            </div>
          )}
        </Layout.Body>

        {/* Desktop Collapse Toggle */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size='icon'
          variant='outline'
          className='absolute -right-5 top-1/2 z-50 hidden rounded-full bg-background md:inline-flex'
        >
          <IconChevronsLeft
            stroke={1.5}
            className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
          />
        </Button>
      </Layout>
    </aside>
  )
}