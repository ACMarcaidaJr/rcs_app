import * as React from "react";
import { cn } from "@/lib/utils";

// Standard NAP Form Column Headers
const columnHeaders = [
  "9. RECORDS SERIES TITLE AND DESCRIPTION",
  "10. PERIOD COVERED / INCLUSIVE DATES",
  "11. VOLUME",
  "12. RECORDS MEDIUM",
  "13. RESTRICTION/S",
  "14. LOCATION OF RECORDS",
  "15. FREQUENCY OF USE",
  "16. DUPLICATION",
  "17. TIME VALUE (T/P)",
  "18. UTILITY VALUE Adm/F/L/Arc",
  "19. RETENTION PERIOD",
  "20. DISPOSITION PROVISION",
];

export default function NAPForm1() {
  return (
    <div className="p-4 font-sans text-foreground bg-background space-y-2">
      {/* 0. Top Metadata */}
      <div className="text-[10px] text-muted-foreground uppercase">
        <p>NAP Records Inventory and Appraisal Form</p>
        <p className="font-bold text-foreground">2024</p>
      </div>

      <div className="border-2 border-foreground dark:border-border overflow-hidden">
        
        {/* --- SECTION 1-8: HEADER --- */}
        <div className="grid grid-cols-12 border-b-2 border-foreground dark:border-border">
          
          {/* Logo/Title Box */}
          <div className="col-span-3 border-r-2 border-foreground dark:border-border p-4 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold">NATIONAL ARCHIVES OF THE PHILIPPINES</p>
            <p className="text-[9px] italic italic">Pambansang Sinupan ng Pilipinas</p>
            <p className="mt-4 font-bold text-xs">RECORDS INVENTORY AND APPRAILSAL</p>
          </div>

          {/* Center Info: Name & Address */}
          <div className="col-span-4 border-r-2 border-foreground dark:border-border grid grid-rows-2">
            <HeaderCell label="1. NAME OF OFFICE:">
              <p className="font-bold uppercase text-sm">Department of Tourism</p>
            </HeaderCell>
            <HeaderCell label="6. ADDRESS:" className="border-t-2 border-foreground dark:border-border" />
          </div>

          {/* Right Info: Dept/Unit/Person/Date */}
          <div className="col-span-2 border-r-2 border-foreground dark:border-border grid grid-rows-4">
            <HeaderCell label="2. DEPARTMENT/DIVISION:" isSub />
            <HeaderCell label="3. SECTION/UNIT:" isSub />
            <HeaderCell label="7. PERSON-IN-CHARGE OF FILES:" isSub />
            <HeaderCell label="8. DATE PREPARED:" isSub isLast />
          </div>

          {/* Far Right: Contact Info (Corrected Email Placement) */}
          <div className="col-span-3 grid grid-rows-2">
            <HeaderCell label="4. TELEPHONE NO.:" />
            <HeaderCell label="5. EMAIL ADDRESS:" className="border-t-2 border-foreground dark:border-border" />
          </div>
        </div>

        {/* --- SECTION 9-20: COLUMN HEADERS --- */}
        <div className="grid grid-cols-[3fr,1.5fr,0.8fr,1fr,1fr,1fr,0.8fr,1fr,0.8fr,1fr,2fr,1.5fr] text-center uppercase font-bold text-[9px] bg-muted/30">
          {columnHeaders.map((header, index) => {
            const isRetention = index === 10;
            return (
              <div key={index} className={cn("border-r border-foreground dark:border-border flex items-center justify-center min-h-[45px]", isRetention && "flex-col p-0")}>
                {!isRetention ? header : (
                  <div className="w-full h-full flex flex-col">
                    <p className="p-1 border-b border-foreground dark:border-border">{header}</p>
                    <div className="flex-1 grid grid-cols-3 text-[8px]">
                        <span className="border-r border-foreground dark:border-border flex items-center justify-center px-1">Active</span>
                        <span className="border-r border-foreground dark:border-border flex items-center justify-center px-1">Storage</span>
                        <span className="flex items-center justify-center px-1">Total</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- EXAMPLE DATA ROW --- */}
        <div className="grid grid-cols-[3fr,1.5fr,0.8fr,1fr,1fr,1fr,0.8fr,1fr,0.8fr,1fr,2fr,1.5fr] text-[10px] border-t border-foreground dark:border-border">
          <DataCell className="font-bold">NOTICES (e.g., Call for Submission of Inventory/Audit Reports, Staff Meetings, etc.)</DataCell>
          <DataCell>2020-Present</DataCell>
          <DataCell>1 folder</DataCell>
          <DataCell>Paper</DataCell>
          <DataCell>Restricted</DataCell>
          <DataCell>Cabinet 2</DataCell>
          <DataCell>Weekly</DataCell>
          <DataCell>Accounting</DataCell>
          <DataCell>T</DataCell>
          <DataCell>Adm/F</DataCell>
          <div className="border-r border-foreground dark:border-border grid grid-cols-3 text-center overflow-hidden">
            <span className="border-r border-foreground dark:border-border p-1 text-wrap">PERMANENT</span>
            <span className="border-r border-foreground dark:border-border p-1 ">PERMANENT</span>
            <span className="p-1 ">PERMANENT</span>
          </div>
          <DataCell className="border-r-0">Dispose after Audit</DataCell>
        </div>
      </div>
    </div>
  );
}

// Utility Components for Header/Data cells
const HeaderCell = ({ label, children, className, isSub, isLast }: any) => (
  <div className={cn("p-1 flex flex-col h-full", className, isSub && "border-b border-foreground dark:border-border", isLast && "border-b-0")}>
    <span className="text-[8px] font-bold uppercase leading-none">{label}</span>
    <div className="flex-1 flex items-center px-1">{children}</div>
  </div>
);

const DataCell = ({ children, className }: any) => (
  <div className={cn("border-r border-foreground dark:border-border p-1 flex items-center", className)}>
    {children}
  </div>
);