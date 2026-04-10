export type RecordStatus = 'permanent' | 'overdue' | 'partial' | 'due' | 'active' | 'pending';

interface StatusResult {
  status: RecordStatus;
  label: string;
  disposalYearStart: number | null;
  disposalYearEnd: number | null;
}

export const calculateRecordStatus = (
  retentionRaw: string | number,
  dateFrom: string | number | Date | null,
  dateTo: string | number | Date | null
): StatusResult => {
  const currentYear = new Date().getFullYear();

  // 1. Permanent Check
  const isPermanent = retentionRaw?.toString().toLowerCase().includes("permanent");
  if (isPermanent) {
    return { status: 'permanent', label: 'Permanent', disposalYearStart: null, disposalYearEnd: null };
  }

  // 2. Parse Years
  const startYear = dateFrom ? new Date(dateFrom).getFullYear() : null;
  const endYear = dateTo ? new Date(dateTo).getFullYear() : null;
  const retentionYears = parseInt(retentionRaw as string) || 0;

  if (!startYear || isNaN(startYear)) {
    return { status: 'pending', label: 'Pending Date', disposalYearStart: null, disposalYearEnd: null };
  }

  // 3. Calculation: (Year + Retention) + 1
  const disposalYearStart = startYear + retentionYears + 1;
  const disposalYearEnd = endYear ? (endYear + retentionYears + 1) : disposalYearStart;

  // 4. Logic Determination
  if (currentYear > disposalYearEnd) {
    return { status: 'overdue', label: 'Overdue (Full)', disposalYearStart, disposalYearEnd };
  }

  if (currentYear > disposalYearStart && currentYear <= disposalYearEnd) {
    return { status: 'partial', label: 'Partial Disposal', disposalYearStart, disposalYearEnd };
  }

  if (currentYear === disposalYearStart || currentYear === disposalYearEnd) {
    return { status: 'due', label: 'Due for Disposal', disposalYearStart, disposalYearEnd };
  }

  return { status: 'active', label: 'Active', disposalYearStart, disposalYearEnd };
};