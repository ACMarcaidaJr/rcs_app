"use client"

import { z } from "zod"

export const NewSeriesSchema = z.object({
    record_series_title: z.string().nonempty("Records Series Title is required"),
})

export const NewRecordSchema = z.object({
    rcs_records_seriesid: z.string().nullable(),
    series_item_title: z.string().nonempty('Series Item Title is Required'),
    restrictions: z.string(),
    years_or_months: z.string(),
    is_nap_grds: z.boolean(),
    frequency_of_use: z.string(),
    duplication: z.string(),
    time_value: z.string().nonempty('Time Value is Required'),
    utility_value: z.array(z.string()).nonempty('Utility Value is Required'),
    retention_period_active: z.number().min(0),
    retention_period_storage: z.number().min(0),
    retention_period_total: z.number().min(0),
    disposition_provision: z.string(),
})
