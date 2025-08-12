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
import { useAuth } from '@/context/MsalProvider'
import Link from 'next/link'
import { IconChevronRight, IconPower } from '@tabler/icons-react'
export function UserNav() {
  const { account, login, loading, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            {!loading && <AvatarFallback>{`${account?.idTokenClaims?.name && account?.idTokenClaims?.name[0]} `}</AvatarFallback>}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {`${account?.idTokenClaims?.name && account?.idTokenClaims?.name} `}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {`${account?.idTokenClaims?.preferred_username && account?.idTokenClaims?.preferred_username} `}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='flex flex-row justify-between w-full'  >
            <Button variant="ghost" className='h-full w-full '>
              <Link className='h-full w-full flex items-start justify-start  m-0' href='/page/profile'><p>Profile</p></Link>
            </Button>
            <DropdownMenuShortcut><IconChevronRight /></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=' flex flex-row justify-between w-full' onClick={logout}>
          <Button variant="ghost" className='h-full w-full flex items-start justify-start rounded-sm'>
            Log out
          </Button>
          <DropdownMenuShortcut> <IconPower /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}