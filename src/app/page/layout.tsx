
'use client'
import Sidebar from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'
import useIsCollapsed from '@/hooks/use-is-collapsed'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useIsCollapsed()
    return (
        <div className='relative h-full overflow-hidden bg-background'>
            {/* <SkipToMain /> */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main
                id='content'
                className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
            >
                {children}
            </main>
        </div>
    )
}