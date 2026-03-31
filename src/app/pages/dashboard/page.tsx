"use client"

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { useAuth } from "@/context/AuthProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
          <Tabs defaultValue="draft">
            <TabsList>
              <TabsTrigger className="" value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="assisting">Assisting</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="draft">
              Drafts
            </TabsContent>
            <TabsContent value="submitted">
              Submitted
            </TabsContent>
            <TabsContent value="assisting">
              Assisting
            </TabsContent>
            <TabsContent value="all">
              All
            </TabsContent>
          </Tabs>
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
