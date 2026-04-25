"use client"

import { Layout } from '@/components/custom/layout'
import { useAuth } from "@/context/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  IconLayoutDashboard,
  IconPhone,
  IconPlayerPlay,
  IconCode,
  IconExternalLink,
  IconBook,
  IconCircleCheck
} from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { account } = useAuth()
  const role = account?.name || 'user'

  return (
    <Layout>
      <Layout.Header sticky className="bg-background/95 backdrop-blur border-b">
        <div className="flex flex-row gap-3 items-center">
          <div className="flex items-center justify-center p-2.5 bg-primary/10 rounded-lg shadow-sm">
            <IconLayoutDashboard size={20} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">Information Hub</h1>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Announcements, Tutorials, and System Updates
            </p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body className="space-y-8 max-w-7xl mx-auto">

        {/* 1. ANNOUNCEMENTS SECTION (Hero Style) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <IconPhone className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold tracking-tight uppercase text-slate-600 dark:text-slate-400">Latest Announcements</h2>
          </div>
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-bold">NEW UPDATE</Badge>
                  <h3 className="text-3xl font-black">2026 Records Inventory Now Open</h3>
                  <p className="text-blue-100 max-w-2xl leading-relaxed">
                    All departments are advised to update their NAP Form No. 1 records by the end of the second quarter.
                    Please ensure all inclusive dates are verified against official issuances.
                  </p>
                </div>
                <Button variant="secondary" className="font-bold shadow-xl">
                  View Full Memo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 2. TUTORIALS SECTION (Left/Center) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <IconBook className="text-blue-500" size={20} />
              <h2 className="text-lg font-bold tracking-tight uppercase text-slate-600 dark:text-slate-400">System Tutorials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TutorialCard
                title="Adding New Records"
                description="Learn how to properly fill out the NAP Form No. 1 title and description fields."
                duration="3 mins"
              />
              <TutorialCard
                title="Date Mode Management"
                description="Switching between Year Only and Full Date modes for inclusive dates."
                duration="2 mins"
              />
              <TutorialCard
                title="Exporting for Submission"
                description="How to generate the final document for National Archives submission."
                duration="5 mins"
              />
              <TutorialCard
                title="Retention Logic"
                description="Understanding Active vs. Storage retention periods in the system."
                duration="4 mins"
              />
            </div>
          </div>

          {/* 3. ABOUT THE DEVELOPER (Right Side) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconCode className="text-emerald-500" size={20} />
              <h2 className="text-lg font-bold tracking-tight uppercase text-slate-600 dark:text-slate-400">Developer Info</h2>
            </div>
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4">
                <CardTitle className="text-md font-bold">RCS-Tools</CardTitle>
                <CardDescription>Version 1.0 Build 2026</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-black">
                    ACM
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Adam C. Marcaida Jr.</p>
                    <p className="text-xs text-muted-foreground font-medium">Software Developer</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Specializing in administrative and records management software designed for government compliance and archival efficiency.
                </p>

                <div className="pt-4 border-t space-y-2">
                  <DevContactItem icon={<IconCircleCheck size={14} />} text="React & Tailwind Focused" />
                  <DevContactItem icon={<IconCircleCheck size={14} />} text="RA 9470 Compliance Specialist" />
                  <DevContactItem icon={<IconExternalLink size={14} />} text="Contact Support" isLink />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </Layout.Body>
    </Layout>
  )
}

function TutorialCard({ title, description, duration }: { title: string, description: string, duration: string }) {
  return (
    <Card className="group cursor-pointer hover:border-blue-400 transition-all border-slate-200 dark:border-slate-800">
      <CardContent className="p-0">
        <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
          <IconPlayerPlay size={32} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm">{title}</h4>
            <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{duration}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function DevContactItem({ icon, text, isLink = false }: { icon: React.ReactNode, text: string, isLink?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${isLink ? 'text-blue-600 cursor-pointer hover:underline' : 'text-slate-500'}`}>
      {icon}
      <span>{text}</span>
    </div>
  )
}