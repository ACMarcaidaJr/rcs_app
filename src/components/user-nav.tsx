"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { IconChevronRight, IconPower } from '@tabler/icons-react'
import { signOut, useSession } from "next-auth/react"
import { cn } from '@/lib/utils'

export function UserNav({ isCollapsed }: { isCollapsed?: boolean }) {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn(
          "flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-accent transition-colors",
          isCollapsed ? "justify-center" : "justify-start px-2"
        )}>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full p-0'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={session?.user?.image ?? ""} alt='user' />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {session?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
          
          {!isCollapsed && (
            <div className='flex flex-col space-y-0.5 text-left animate-in fade-in slide-in-from-left-2'>
              <p className='text-sm font-semibold truncate max-w-[110px]'>
                {session?.user?.name}
              </p>
              <p className='text-[10px] leading-none text-muted-foreground truncate max-w-[110px]'>
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className='w-56' align={isCollapsed ? 'center' : 'end'} side={isCollapsed ? 'right' : 'bottom'} forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{session?.user?.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/page/profile' className="flex w-full items-center justify-between">
              <span>Profile</span>
              <IconChevronRight size={16} />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirect: true, callbackUrl: "/" })} className="text-destructive">
          <span>Log out</span>
          <DropdownMenuShortcut> <IconPower size={16} /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}