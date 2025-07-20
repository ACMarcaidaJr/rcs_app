"use client"
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
export function Search({ className }:any) {
  return (
    <div>
      <Input
        type='search'
        placeholder='Search...'
        // className='md:w-[130px] '
        className={cn(`md:min-w-[130px]`, className)}
      />
    </div>
  )
}
