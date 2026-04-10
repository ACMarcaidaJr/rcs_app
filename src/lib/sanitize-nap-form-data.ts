/**
 * Sanitizes the NAP Form data specifically for Dataverse Date requirements.
 * Converts empty strings ("") to null for date_period_from and date_period_to.
 */
export const sanitizeNapFormData = (groups: any[]) => {
  return groups.map((group) => ({
    ...group,
    // Sanitize the group_values array (often used as a template)
    group_values: group.group_values.map((val: any) => ({
      ...val,
      date_period_from: val.date_period_from === "" ? null : val.date_period_from,
      date_period_to: val.date_period_to === "" ? null : val.date_period_to,
    })),
    // Sanitize the actual items array
    items: group.items.map((item: any) => ({
      ...item,
      date_period_from: item.date_period_from === "" ? null : item.date_period_from,
      date_period_to: item.date_period_to === "" ? null : item.date_period_to,
    })),
  }));
};