

// used to filter the fetched data in the util
export interface RecordItem {
  records_series_title_and_description: string;
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

export interface RecordItemForDataverse {
  records_series_title_and_description: string;
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
  is_editing: boolean;
  is_single_unit: boolean;
  items: RecordItem[];
  group_values: RecordItem[]
}

export interface GroupItemFromDataverse {
  nap_form_one_group_id: string;
  id: number;
  group_title: string;
  is_editing: boolean;
  is_single_unit: boolean;
  items: RecordItem[];
  group_values: RecordItem[]
}

//  used as initial item in useReducer
// used to filter the fetched data in the util
export const initialItem = {
  records_series_title_and_description: '',
  period_covered_or_inclusive_dates: '',
  volume: '',
  records_medium: '',
  restrictions: '',
  location_of_records: '',
  frequency_of_use: '',
  duplication: '',
  time_value: '',
  utility_value: '',
  retention_period_active: '',
  retention_period_storage: '',
  retention_period_total: '',
  disposition_provision: '',
}

export const createInitialGroup = (id: number, isEditing?: boolean): GroupItem => ({
  id: id,
  group_title: '',
  is_editing: isEditing ?? false,
  is_single_unit: false,
  group_values: [
    initialItem
  ],
  items: [
    initialItem
  ],
}
)
