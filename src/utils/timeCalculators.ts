/**
 * Parse a time string into minutes since midnight.
 * Handles "09:02", "17:32", "09:02 AM", "05:32 PM" formats.
 */
export function parseTimeToMinutes(timeStr: string | null): number | null {
  if (!timeStr || timeStr === '--') return null;

  const clean = timeStr.trim();

  // Check for AM/PM format
  const ampmMatch = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3]?.toUpperCase();

    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  // Fallback split
  const parts = clean.split(':');
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m)) {
      return h * 60 + m;
    }
  }

  return null;
}

/**
 * Calculate working minutes between check-in and check-out.
 */
export function calculateWorkingMinutes(
  checkIn: string | null,
  checkOut: string | null
): number {
  if (!checkIn) return 0;

  const inMinutes = parseTimeToMinutes(checkIn);
  if (inMinutes === null) return 0;

  if (checkOut) {
    const outMinutes = parseTimeToMinutes(checkOut);
    if (outMinutes === null || outMinutes <= inMinutes) return 0;
    return outMinutes - inMinutes;
  }

  // If currently working and no checkout yet, calculate against current time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  if (currentMinutes > inMinutes) {
    return currentMinutes - inMinutes;
  }

  return 0;
}

/**
 * Format total minutes to "08h 30m" format.
 */
export function formatMinutesToHours(minutes: number): string {
  if (!minutes || minutes <= 0) return '--';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
}

/**
 * Calculate and format working hours between check-in and check-out.
 */
export function calculateWorkingHoursString(
  checkIn: string | null,
  checkOut: string | null,
  status?: string
): string {
  if (status === 'Leave' || status === 'Absent') return '--';
  if (!checkIn) return '--';

  const mins = calculateWorkingMinutes(checkIn, checkOut);
  if (mins === 0 && checkOut === null) return 'In Progress';
  return formatMinutesToHours(mins);
}

/**
 * Get current system time formatted as "HH:mm" (24h) or "hh:mm A"
 */
export function getCurrentTimeString(format24: boolean = true): string {
  const now = new Date();
  if (format24) {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get YYYY-MM-DD string for today or offset days
 */
export function getDateString(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}
