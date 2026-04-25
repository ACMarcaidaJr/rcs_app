"use client"

import * as React from "react"
// import { DataTable } from "@/components/records/data-table" // Using your existing component
import { Button } from "@/components/custom/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconDatabaseImport, IconAlertTriangle, IconPlus } from "@tabler/icons-react"
import { Toast } from "@/components/ui/toast"

export default function MigrationPage() {
    const [migrationData, setMigrationData] = React.useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Function to add a blank row for manual entry of old NAP Form 1 data
    const addRow = () => {
        const newRow = {
            id: crypto.randomUUID(),
            crc9f_series_title: "",
            crc9f_period_covered: "",
            crc9f_volume: "",
            crc9f_time_value: "T", // Default to Temporary
            crc9f_retention_active: 0,
            crc9f_retention_storage: 0,
            crc9f_is_disposed: false, // Core constraint check
        }
        setMigrationData([...migrationData, newRow])
    }

    const handleMigrate = async () => {
        setIsSubmitting(true)
        // Filter out disposed records before sending to Dataverse
        const validRecords = migrationData.filter(record => !record.crc9f_is_disposed)
        
        try {
            // Your logic to POST to /api/records/migrate
            // toast.success(`Successfully migrated ${validRecords.length} records to the system.`)
        } catch (error) {
            // toast.error("Migration failed. Please check field mappings.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold italic text-blue-900 dark:text-blue-500">
                        NAP Form 1: Legacy Migration
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Input existing records to the National Archives system. Disposed records will be filtered out automatically.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addRow}>
                        <IconPlus size={18} className="mr-2" /> Add Row
                    </Button>
                    <Button 
                        onClick={handleMigrate} 
                        disabled={migrationData.length === 0 || isSubmitting}
                        className="bg-blue-800 hover:bg-blue-700 text-white"
                    >
                        <IconDatabaseImport size={18} className="mr-2" /> 
                        Run Migration ({migrationData.filter(r => !r.crc9f_is_disposed).length})
                    </Button>
                </div>
            </div>

            {migrationData.some(r => r.crc9f_is_disposed) && (
                <Alert variant="destructive">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Disposed Records Detected</AlertTitle>
                    <AlertDescription>
                        Records marked as "Disposed" will be excluded from the migration process to maintain an active inventory.
                    </AlertDescription>
                </Alert>
            )}

            {/* In a real scenario, you'd pass a custom column set here for inputs */}
            <div className="border rounded-md bg-white dark:bg-slate-950 shadow-sm">
                 {/* Table implementation goes here */}
            </div>
        </div>
    )
}