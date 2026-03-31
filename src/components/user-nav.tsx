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
import { IconChevronRight, IconPower } from '@tabler/icons-react';
import { signIn, signOut, useSession } from "next-auth/react"

export function UserNav() {
  const { data: session, status } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row gap-2 items-center cursor-pointer">
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={`${session?.user?.image ?? "/"}`} alt='@shadcn' />
              <AvatarFallback>{`${session?.user?.name?.charAt(0) ?? ""}`}</AvatarFallback>
            </Avatar>
          </Button>
          <div className='flex flex-col space-y-1 max-w-[130px]'>
            <p className='text-sm font-medium leading-none truncate'>
              {`${session?.user?.name} `}
            </p>
            <p className='text-xs leading-none text-muted-foreground truncate'>
              {`${session?.user?.email} `}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {`${session?.user?.name} `}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {`${session?.user?.email} `}
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
        <DropdownMenuItem className=' flex flex-row justify-between w-full' >
          <Button onClick={() => signOut({ redirect: true, callbackUrl: "/" })} variant="ghost" className='h-full w-full flex items-start justify-start rounded-sm'>
            Log out
          </Button>
          <DropdownMenuShortcut> <IconPower /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}