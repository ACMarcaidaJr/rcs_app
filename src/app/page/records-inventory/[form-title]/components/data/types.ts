export interface RecordItem {
  title_and_description: string;
  period_covered_or_inclusive_dates: string;
  volume: string;
  records_medium: string;
  restrictions: string;
  location_of_records: string;
  frequency_of_use: string;
  duplication: string;
  time_value: string;
  utility_value: string;
  retention_period_active: string;
  retention_period_storage: string;
  retention_period_total: string;
  disposition_provision: string;
}

export interface GroupItem {
  id: number;
  group_title: string;
  isEditing: boolean;
  items: RecordItem[];
}

