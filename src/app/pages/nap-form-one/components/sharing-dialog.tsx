"use client"
"use client"
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconImageInPicture, IconPlus, IconShare3 } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";
import { assignAccessSchema } from '../data/assign-access-schema';


export default function SharingDialog({ headerGuid }: { headerGuid: string }) {
  // dialog states
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // ASSIGNING ASSISTANT
  // form for assigning assistance
  const assignAsstForm = useForm<z.infer<typeof assignAccessSchema>>({
    resolver: zodResolver(assignAccessSchema),
    defaultValues: {
      user: ''
    }
  })
  //  submit form
  async function onSubmit(values: z.infer<typeof assignAccessSchema>) {
    if (!values) return
    try {

    } catch (error) {

    }
  }
  // get team member
  const [teamMember, setTeamMember] = useState<any[]>([])
  const [loeadingTeamMember, setLoadingTeamMember] = useState<boolean>(false)
  const fetchTeamMember = async () => {
    try {
      setLoadingTeamMember(true)
      const res = await fetch('/api/user/get-by-office')
      const data = await res.json()
      setTeamMember(data?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingTeamMember(false)
    }
  }



  // RUN FETCHES
  useEffect(() => {
    fetchTeamMember()
    assignAsstForm.reset
  }, [open])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="w-full flex flex-row justify-start items-center gap-2"
          variant="ghost" // Outline often looks better for action buttons like Share
        >
          <IconShare3 size={18} />
          <span>Share</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Share with others</DialogTitle>
          <DialogDescription>
            Select team members to grant them view or edit access.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="assistance" className="flex flex-col  w-full overflow-y-auto">
          <TabsList className="grid w-full h-auto grid-cols-1 md:grid-cols-2">
            <TabsTrigger
              className="w-full text-nowrap"
              value="assistance"
            >
              Assign Access
            </TabsTrigger>

            <TabsTrigger
              className="w-full text-nowrap"
              value="with-access"
            >
              Who has acccess
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assistance" className="mt-4 text-sm">
            <Form {...assignAsstForm}>
              <form
                onSubmit={assignAsstForm.handleSubmit(onSubmit)}
                className='flex flex-wrap md:flex-nowrap gap-4 p-4 border rounded-lg border-secondary items-end justify-evenly'
              >
                <FormField
                  control={assignAsstForm.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Member</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a user..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamMember.filter(Boolean).map((user: any) => (
                            <SelectItem className='flex-1' key={user?.rcs_userid} value={user?.rcs_userid}>
                              {user.given_name} {user.middle_name.charAt(0)}  {user.family_name} {user.suffix ?? ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Access Type Selection */}
                <FormField
                  control={assignAsstForm.control}
                  name="access_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='flex-1'>
                          {["view", "edit", "download", "assistance", "approver"].map((role) => (
                            <SelectItem key={role} value={role} className="capitalize">
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-start md:justify-end">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full md:w-fit"
                  >
                    {loading ? "Assigning..." : "Assign Access"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>


          <TabsContent value="with-access" className="mt-4 text-sm">
            <div className="p-6 space-y-6 overflow-y-auto">


              <div className="space-y-4">
                <h4 className="text-sm font-medium">People with access</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">JD</div>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">Editor</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-red-500">Remove</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs >
        <div className="mt-auto border-t p-4 flex justify-end gap-2 bg-muted/30">
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
