
import { initialItem, RecordItem } from "@/app/pages/nap-submission/[form_id]/components/data/types";
const allowedKeys = Object.keys(initialItem);

export const pickOnlyRecordItemFields = (row: any): RecordItem => ({
    record_series_item_id: row.record_series_item_id || '', // IMPORTANT
    records_series_title_and_description: row.records_series_title_and_description || '',
    date_period_from: row.date_period_from || null,
    date_period_to: row.date_period_to || null,
    volume: row.volume || '',
    records_medium: row.records_medium || '',
    restrictions: row.restrictions || '',
    location_of_records: row.location_of_records || '',
    frequency_of_use: row.frequency_of_use || '',
    duplication: row.duplication || '',
    time_value: row.time_value || '',
    utility_value: row.utility_value || '',
    retention_period_active: row.retention_period_active || 0,
    retention_period_storage: row.retention_period_storage || 0,
    retention_period_total: row.retention_period_total || 0,
    disposition_provision: row.disposition_provision || '',
    is_full_date: row.is_full_date ?? 0,
});