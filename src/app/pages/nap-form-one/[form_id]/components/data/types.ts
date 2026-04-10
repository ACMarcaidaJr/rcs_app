import { string } from "zod";


export interface RecordItem {
  record_series_item_id: string;
  records_series_title_and_description: string;
  date_period_from: string;
  date_period_to: string;
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
  is_full_date: number;
}

export interface RecordItemForDataverse {
  record_series_item_id: string;
  records_series_title_and_description: string;
  date_period_from: string | null;
  date_period_to: string | null;
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
  is_full_date: number;
}

export interface GroupItem {
  id: number;
  group_title: string;
  is_editing: boolean;
  is_single_unit: boolean;
  items: RecordItem[];
}

export interface GroupItemFromDataverse {
  nap_form_one_group_id: string;
  id: number;
  group_title: string;
  is_editing: boolean;
  is_single_unit: boolean;
  items: RecordItem[];
}

//  used as initial item in useReducer
// used to filter the fetched data in the util
export const initialItem: RecordItem = {
  record_series_item_id: '',
  records_series_title_and_description: '',
  date_period_from: '',
  date_period_to: '',
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
  is_full_date: 0,
}

export const createInitialGroup = (id: number, isEditing?: boolean): GroupItem => ({
  id: id,
  group_title: '', // record series title
  is_editing: isEditing ?? false,
  is_single_unit: true,
  items: [
    initialItem
  ],
}
)
