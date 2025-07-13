"use client"

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { useAuth } from "@/context/MsalProvider";

export default function Dashboard() {
  const { logout, account, login } = useAuth();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sample', {
        method: 'GET',
      })
      const result = await res.json()
      console.log(result)
    } catch (err) {
      console.error('Error fetching:', err)
    }
  }
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            {account ? <button onClick={logout}>Logout account</button> :
              <button onClick={login}>Login account</button>}
            <button className="samplefetch" onClick={fetchData}>Fetch data</button>
          </div>
          <div className="user">{account?.name}</div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  }
]
