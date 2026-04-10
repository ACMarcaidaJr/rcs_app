/**
 * Formats a date string or Date object.
 * Returns an empty string if the input is falsy.
 */

export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "";

    const d = new Date(date);

    // Check if the date is actually valid (prevents "Invalid Date" strings)
    if (isNaN(d.getTime())) return "";

    return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(d);
};
export const getYearUtil = (date: string | Date | null | undefined): string => {
    if (!date) return "";

    const d = new Date(date);

    // Check if the date is actually valid (prevents "Invalid Date" strings)
    // Also handles the "12024" year typo by checking if the year is realistic
    if (isNaN(d.getTime()) || d.getFullYear() > 9999) return "";

    // Simply return the 4-digit year as a string
    return d.getFullYear().toString();
};
/**
 * Converts a date string (from Input or Dataverse) to an Epoch number (ms).
 * Returns 0 if the date is invalid or empty.
 */
export const dateToEpoch = (dateValue: string | Date | null | undefined): number => {
    if (!dateValue) return 0;

    const date = new Date(dateValue);
    const timestamp = date.getTime();

    return isNaN(timestamp) ? 0 : timestamp;
};

/**
 * Converts an Epoch number (ms) back to a formatted date string.
 * Supports 'input' mode (YYYY-MM-DD) for your <input type="date"> 
 * or 'display' mode (MMM DD, YYYY) for your Table/UI.
 */
export const epochToDate = (
    epoch: number | null | undefined,
    mode: 'input' | 'display' = 'display'
): string => {
    if (!epoch || epoch === 0) return "";

    const date = new Date(epoch);
    if (isNaN(date.getTime())) return "";

    if (mode === 'input') {
        // Returns YYYY-MM-DD (Required for <input type="date" />)
        return date.toISOString().split('T')[0];
    }

    // Returns Mar 25, 2026 (Standard for Philippine Records)
    return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(date);
};