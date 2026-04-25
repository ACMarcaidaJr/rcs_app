import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Folder,
  History,
  Database,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { IconDownload, IconEye } from "@tabler/icons-react";

interface RecordDetailsDrawerProps {
  data: any;
}

export const RecordDetailsDrawer = ({ data }: RecordDetailsDrawerProps) => {
  if (!data) return null;

  const utilities = React.useMemo(() => {
    try {
      return typeof data.utility_value === "string"
        ? JSON.parse(data.utility_value)
        : data.utility_value || [];
    } catch { return []; }
  }, [data.utility_value]);

  const downloadAsPDF = async (form_id: string) => {
    window.open(`/api/nap-form-one-output/${form_id}`, '_blank');
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full h-8 gap-2 font-semibold">
          <FileText size={14} /> View Details
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] sm:h-full sm:max-w-[500px] sm:ml-auto rounded-t-[20px] sm:rounded-t-none sm:rounded-l-[20px] border-l bg-background shadow-xl">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4 sm:hidden" />
        <ScrollArea className="h-full px-6">
          <DrawerHeader className="px-0 space-y-4">
            <DrawerTitle className="sr-only">
              {data.series_item_title || "Record Details"}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Detailed view of record series and NAP history.
            </DrawerDescription>
            <div className="flex flex-col w-full">
              {data.record_series_id ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/40">
                      <Folder size={18} className="text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <span className="text-[11px] font-medium text-muted-foreground uppercase text-start">Record Series</span>
                      <span className="text-base font-semibold text-foreground">
                        {data.record_series_id?.record_series_title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="ml-0 flex flex-col items-center">
                      <div className="w-px h-6 bg-border" />
                      <div className="w-4 ml-3 h-px bg-border rounded-full" />
                    </div>
                    <div className="mt-4 ml-0 flex-1 p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/40">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col justify-start">
                          <span className="text-[11px] font-medium text-blue-600 uppercase text-start">Subseries</span>
                          <span className="text-sm font-bold">{data.series_item_title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. SIMPLE SINGLE ENTITY VIEW */
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/20">
                  <div className="p-3 rounded-md bg-background border shadow-sm">
                    <FileText size={24} className="text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase text-start">Independent Record</span>
                    <span className="text-lg font-bold leading-tight">
                      {data.series_item_title || "Untitled Record"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* <div className=""> */}
            {/* <DrawerTitle className="text-2xl font-black text-foreground tracking-tight leading-tight">
                {data.series_item_title}
              </DrawerTitle> */}

            {/* <DrawerDescription className="flex items-center gap-2 mt-2 font-mono text-[11px] text-muted-foreground bg-muted/50 w-fit px-2 py-0.5 rounded border">
                <Database size={12} /> ID: {data.rcs_record_series_itemid}
              </DrawerDescription> */}
            {/* </div> */}
          </DrawerHeader>

          <div className="space-y-6 py-4">
            {/* METRICS GRID */}
            <div className="space-y-4">
              {/* TOP METRICS: RETENTION & VOLUME */}
              <div className="grid grid-cols-2 gap-4">
                {/* Retention Card */}
                <div className="p-4 border rounded-xl bg-card space-y-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                        Retention Status
                      </h4>
                      {/* Visual Badge for T vs P */}
                      <Badge
                        variant={data.time_value === 'P' ? "default" : "outline"}
                        className="text-[9px] h-4 px-1.5 font-black uppercase"
                      >
                        {data.time_value === 'P' ? "Permanent" : "Temporary"}
                      </Badge>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-foreground">
                        {data.time_value === 'P' ? (
                          "Permanent"
                        ) : (
                          <>
                            {data.retention_period_total || "0"}
                            <span className="ml-1 text-xs font-bold text-muted-foreground uppercase">
                              {data.years_or_months || "Years"}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Only show the breakdown if it's not a Permanent record */}
                  {data.time_value !== 'P' && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed">
                      <div>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Active</p>
                        <p className="text-sm font-bold">{data.retention_period_active || 0}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase">Storage</p>
                        <p className="text-sm font-bold">{data.retention_period_storage || 0}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Volume & Range Card */}
                <div className="p-4 border rounded-xl bg-card space-y-3">
                  <div className="flex flex-col">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Volume</h4>
                    <div className="flex items-baseline gap-1">
                      <div className="text-2xl font-black text-foreground flex flex-wrap gap-2">
                        {data.totalVolumeList?.map((volume: any, idx: any) => (
                          <Badge key={idx} variant="outline">{volume}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase">Accumulated Date Period</p>
                    <p className="text-sm font-bold truncate">{data.accumulatedRange || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* UTILITY CLASSIFICATION (Simplified Badges) */}
              <div className="p-4 border rounded-xl bg-muted/20">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Utility Classification</h4>
                <div className="flex flex-wrap gap-2">
                  {utilities.length > 0 ? (
                    utilities.map((u: string) => (
                      <Badge
                        key={u}
                        variant="outline"
                        className="rounded-xl px-2 py-0 font-semibold text-[12px] bg-background border"
                      >
                        {u}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No utility values assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* CLASSIFICATION BADGES */}
            {/* <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Utility Classification</h4>
              <div className="flex flex-wrap gap-2">
                {utilities.map((u: string) => (
                  <Badge key={u}
                    className="rounded-full p-2 transition-colors bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-900/50"                  >

                    {u}
                  </Badge>
                ))}
              </div>
            </div> */}

            <Separator />

            {/* TIMELINE SECTION */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-foreground">
                  <History size={16} className="text-gray-500" /> NAP History
                </h3>
                {/* <Badge variant="outline" className="text-[10px] font-bold rounded-full">
                  {data.record_series_item_in_nap_rows?.length || 0} Records
                </Badge> */}
              </div>

              <div className="space-y-4 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-muted" />

                {data.record_series_item_in_nap_rows?.map((row: any, idx: number) => {
                  const header = row.nap_form_one_group_id?.nap_form_one_header_id;
                  const tasks = header?.nap_form_one_from_submitted_task || [];

                  return !!tasks?.length && <div key={idx} className="relative pl-9 group/item">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-muted group-hover/item:border-gray-500 flex items-center justify-center z-10 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted group-hover/item:bg-gray-500" />
                    </div>

                    <div className="bg-card border rounded-xl p-4 shadow-sm group-hover/item:border-gray-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            {header?.date_prepared || "PENDING"}
                          </p>
                          <h5 className="text-sm font-bold text-foreground group-hover/item:text-gray-600 dark:group-hover/item:text-gray-400">
                            {header?.form_name || "Form No. 1"}
                          </h5>
                        </div>
                        <Button
                          size="sm"
                          variant='outline'
                          className="gap-2"
                          onClick={() => downloadAsPDF(header.rcs_nap_form_one_headerid)}>
                          <IconEye size={14} className="text-destructive" /> <span>Preview</span>
                        </Button>

                      </div>

                      <div className="space-y-2">
                        {tasks.map((task: any) => (
                          <div key={task.rcs_submitted_taskid} className="flex items-center justify-between bg-muted/30 border border-border rounded-lg p-2 transition-colors hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                              {task.approver_status === "received" ? (
                                <CheckCircle2 size={13} className="text-emerald-500" />
                              ) : (
                                <Clock size={13} className="text-amber-500" />
                              )}
                              <span className="text-[11px] font-bold text-foreground capitalize">{task.approver_status}</span>
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground font-mono">#{task.submitted_task_id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t bg-muted/20 pb-8 sm:pb-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full font-bold shadow-sm">
              Close Panel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};