import { initialItem, RecordItem } from "@/app/page/records-inventory/[form_id]/components/data/types";

const allowedKeys = Object.keys(initialItem);

export function pickOnlyRecordItemFields(data: any): RecordItem {
    const cleaned: RecordItem = {} as RecordItem;
    for (const key of allowedKeys) {
        cleaned[key as keyof RecordItem] = data[key] ?? '';
    }
    return cleaned;
}