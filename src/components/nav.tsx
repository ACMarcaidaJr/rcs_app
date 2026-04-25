'use client'
import Link from 'next/link'
import { IconChevronDown, IconLogout } from '@tabler/icons-react'
import { Button, buttonVariants } from './custom/button'
import { signOut } from 'next-auth/react'
import { UserNav } from '@/components/user-nav'
import { DynamicTablerIcon } from './dynamic-tabler-icon'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { SideLink } from '@/data/sidelinks'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: SideLink[]
  closeNav: () => void
  navOpened?: any
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
  navOpened,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`
    if (isCollapsed && sub)
      return <NavLinkIconDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />

    if (sub)
      return <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />

    return <NavLink {...rest} key={key} closeNav={closeNav} />
  }

  return (
    <div className={cn('group flex flex-col h-full bg-background transition-all', className)}>
      <TooltipProvider delayDuration={0}>
        <nav className={cn(
          'flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden ', // Added gap-2 for vertical breathing room
          isCollapsed ? 'items-center px-0' : 'items-stretch ' // Center items and remove horizontal padding when collapsed
        )}>
          {links.map(renderLink)}
        </nav>

        {/* Pinned Footer Area */}
        <div className={cn(
          'mt-auto flex items-center border-t border-secondary p-2 gap-2 bg-background',
          isCollapsed ? 'flex-col justify-center' : 'flex-row justify-between'
        )}>
          <UserNav isCollapsed={isCollapsed} />

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <IconLogout size={18} />
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Logout</TooltipContent>
            )}
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

function NavLink({ title, icon, label, href, is_sidelink, closeNav, subLink = false }: any) {
  const { checkActiveNav } = useCheckActiveNav()
  if (!is_sidelink) return null
  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: checkActiveNav(href) ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-10 justify-start text-wrap rounded-md px-3',
        subLink && 'h-9 w-full border-l border-l-muted rounded-none ml-4 px-3'
      )}
    >
      <div className='mr-3 flex h-5 w-5 items-center justify-center shrink-0'>
        <DynamicTablerIcon iconName={`${icon}`} size={18} />
      </div>
      <span className="truncate text-sm">{title}</span>
      {label && (
        <div className='ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'>
          {label}
        </div>
      )}
    </Link>
  )
}

function NavLinkDropdown({ title, icon, label, sub, closeNav }: any) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s: any) => checkActiveNav(s.href))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-10 w-full justify-start rounded-md px-3'
        )}
      >
        <div className='mr-3 flex h-5 w-5 items-center justify-center shrink-0'>
          <DynamicTablerIcon iconName={`${icon}`} size={18} />
        </div>
        <span className="truncate text-sm">{title}</span>
        <span className={cn('ml-auto transition-transform group-data-[state="open"]:-rotate-180')}>
          <IconChevronDown size={16} stroke={1.5} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <ul className="mt-1 flex flex-col gap-1">
          {sub!.map((sublink: any) => (
            <li key={sublink.title}>
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

// For single icons
function NavLinkIcon({ title, icon, href, is_sidelink }: any) {
  const { checkActiveNav } = useCheckActiveNav()
  if (!is_sidelink) return null
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-10 w-10 shrink-0 my-0.5' // Added 'my-0.5' for slight vertical spacing
          )}
        >
          <DynamicTablerIcon iconName={`${icon}`} size={22} /> {/* Increased size from 20 to 22 */}
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right'>{title}</TooltipContent>
    </Tooltip>
  )
}

function NavLinkIconDropdown({ title, icon, sub }: any) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s: any) => checkActiveNav(s.href))

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size='icon'
              className='h-10 w-10 shrink-0'
            >
              <DynamicTablerIcon iconName={`${icon}`} size={20} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4'>
          {title} <IconChevronDown size={16} className="-rotate-90 text-muted-foreground" />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='right' align='start' sideOffset={10}>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }: any) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link href={href} className={cn('flex items-center gap-2', checkActiveNav(href) && 'bg-secondary')}>
              <DynamicTablerIcon iconName={`${icon}`} size={18} />
              <span>{title}</span>
              {label && <span className='ml-auto text-xs opacity-60'>{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}