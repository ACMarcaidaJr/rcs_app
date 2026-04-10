"use client"

import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { useAuth } from "@/context/AuthProvider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  IconLayoutDashboard, 
  IconFileText, 
  IconAlertTriangle, 
  IconCalendarCheck, 
  IconInfinity,
  IconSettings,
  IconUserCheck,
  IconHistory
} from '@tabler/icons-react'
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  total_records: number
  overdue: number
  due_this_year: number
  permanent: number
}

export default function Dashboard() {
  const { account } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Derived role for easy logic
  const role = account?.name || 'user';
 
  useEffect(() => {
    const getStats = async () => {
      try {
        // You can eventually pass the role to the API if needed: `/api/sample?role=${role}`
        const res = await fetch('/api/sample') 
        const result = await res.json()
        if (result.success) setStats(result.data)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [role])

  return (
    <Layout>
      <Layout.Header sticky className="bg-background/95 backdrop-blur border-b">
        <div className="flex flex-row gap-3 items-center">
          <div className="flex items-center justify-center p-2.5 bg-secondary rounded-lg shadow-sm">
            <IconLayoutDashboard size={20} className="text-secondary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">
              {role === 'admin' ? 'System Administration' : 'Overview of Your Recent Activities'}
            </p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body className="space-y-6">
        {/* Dynamic Welcome Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold italic">Welcome back, {account?.name || 'User'}</h2>
          <p className="text-muted-foreground">
            {role === 'custodian' && "Monitor your office's record retention and lifecycle status."}
            {role === 'approver' && "Review pending disposal requests and office compliance."}
            {role === 'admin' && "Manage system users, logs, and global configurations."}
            {!['custodian', 'approver', 'admin'].includes(role) && "Access your personal workspace and recent tasks."}
          </p>
        </div>

        {/* Dynamic Stats Grid - These could be swapped entirely based on role */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={role === 'admin' ? "Total Users" : "Total Records"}
            value={stats?.total_records}
            loading={loading}
            icon={<IconFileText className="h-4 w-4 text-muted-foreground" />}
            description={role === 'admin' ? "Active system accounts" : "All official record series"}
          />
          <StatCard
            title={role === 'approver' ? "Pending Review" : "Overdue"}
            value={stats?.overdue}
            loading={loading}
            icon={<IconAlertTriangle className="h-4 w-4 text-destructive" />}
            description="Requires immediate attention"
            trend={stats?.overdue && stats.overdue > 0 ? "text-destructive" : ""}
          />
          <StatCard
            title="Scheduled"
            value={stats?.due_this_year}
            loading={loading}
            icon={<IconCalendarCheck className="h-4 w-4 text-blue-500" />}
            description="Upcoming tasks this year"
          />
          <StatCard
            title="Archives"
            value={stats?.permanent}
            loading={loading}
            icon={<IconInfinity className="h-4 w-4 text-emerald-500" />}
            description="Permanent data storage"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Snapshot</TabsTrigger>
            {role === 'admin' && <TabsTrigger value="system">System Logs</TabsTrigger>}
            <TabsTrigger value="reports">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Summary of operations for the current fiscal period.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[240px] flex items-center justify-center bg-muted/20 border-2 border-dashed rounded-md m-6 mt-0">
                  <span className="text-sm text-muted-foreground italic">Visualization Module</span>
                </CardContent>
              </Card>

              {/* Dynamic Quick Actions */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequent tasks for your role</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {role === 'custodian' && (
                    <>
                      <ActionButton label="Request Disposal" />
                      <ActionButton label="Update Inventory" />
                    </>
                  )}
                  {role === 'approver' && (
                    <>
                      <ActionButton label="Review Requests" icon={<IconUserCheck size={16}/>} />
                      <ActionButton label="Generate Compliance Report" />
                    </>
                  )}
                  {role === 'admin' && (
                    <>
                      <ActionButton label="User Management" icon={<IconSettings size={16}/>} />
                      <ActionButton label="System Audit" icon={<IconHistory size={16}/>} />
                    </>
                  )}
                  <ActionButton label="Export Data" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

// Sub-component for buttons to keep code clean
function ActionButton({ label, icon }: { label: string, icon?: React.ReactNode }) {
  return (
    <button className="group w-full flex items-center justify-between p-3 text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground transition-all">
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
      <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </button>
  )
}

function StatCard({ title, value, icon, description, loading, trend = "" }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className={`text-2xl font-bold tracking-tight ${trend}`}>{value ?? 0}</div>
        )}
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">{description}</p>
      </CardContent>
    </Card>
  )
}