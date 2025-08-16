import { TimeEntry } from 'api/actions/timeLogs/timeLogs.types';
import { TimeLogEntry, CalendarDayStatus } from 'api/actions/calendar/calendar.types';

/**
 * Shared mock data store for time logs
 * This simulates a persistent backend storage that all endpoints can read/write
 */
class MockDataStore {
  private readonly timeEntries: Map<string, TimeEntry[]> = new Map();

  /**
   * Add time entries for a specific date
   */
  addTimeEntries(date: string, entries: TimeEntry[]): void {
    const existingEntries = this.timeEntries.get(date) || [];

    // Add new entries, avoiding duplicates by ID
    const updatedEntries = [...existingEntries];
    entries.forEach((newEntry) => {
      const existingIndex = updatedEntries.findIndex((e) => e.id === newEntry.id);
      if (existingIndex >= 0) {
        // Replace existing entry
        updatedEntries[existingIndex] = newEntry;
      } else {
        // Add new entry
        updatedEntries.push(newEntry);
      }
    });

    this.timeEntries.set(date, updatedEntries);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(
        `🗄️ MockDataStore: Added ${entries.length} entries for ${date}. Total for date: ${updatedEntries.length}`,
      );
    }
  }

  /**
   * Get time entries for a specific date
   */
  getTimeEntries(date: string): TimeEntry[] {
    const entries = this.timeEntries.get(date) || [];

    if (import.meta.env.DEV && entries.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`🗄️ MockDataStore.getTimeEntries: Retrieved ${entries.length} entries for ${date}`);
    }

    return entries;
  }

  /**
   * Set/replace all time entries for a specific date
   */
  setTimeEntries(date: string, entries: TimeEntry[]): void {
    this.timeEntries.set(date, entries);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`🗄️ MockDataStore.setTimeEntries: Set ${entries.length} entries for ${date}`);
    }
  }

  /**
   * Get all dates that have time entries
   */
  getAllDatesWithEntries(): string[] {
    const dates = Array.from(this.timeEntries.keys());

    if (import.meta.env.DEV && dates.length > 0) {
      // eslint-disable-next-line no-console
      console.log('🗄️ MockDataStore.getAllDatesWithEntries:', dates);
    }

    return dates;
  }

  /**
   * Convert TimeEntry to TimeLogEntry for calendar endpoints
   */
  convertToTimeLogEntry(entry: TimeEntry, date: string): TimeLogEntry {
    return {
      id: entry.id,
      userId: 'user-123', // Mock user ID
      date,
      jiraTaskId: entry.jiraTaskId,
      description: entry.description,
      duration: entry.duration,
      status: entry.status,
      originalMessage: entry.originalMessage,
      refinementHistory: entry.status === 'draft' ? [] : undefined,
      createdAt: entry.createdAt,
      loggedAt: entry.status === 'logged' ? entry.createdAt : undefined,
    };
  }

  /**
   * Get calendar day status based on stored entries
   */
  getDayStatus(date: string): { status: CalendarDayStatus; entryCount: number; totalMinutes: number } {
    const entries = this.getTimeEntries(date);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(
        `🗄️ MockDataStore.getDayStatus: Checking ${date}, found ${entries.length} entries`,
        entries.map((e) => ({ id: e.id, status: e.status })),
      );
    }

    if (entries.length === 0) {
      // Check if this is a working day and in the past/present for random mock data
      const dayDate = new Date(date);
      const today = new Date();
      const dayOfWeek = dayDate.getDay();
      const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isPastOrToday = dayDate <= today;

      if (isWorkingDay && isPastOrToday) {
        // Generate some random mock data for working days without explicit entries
        const rand = Math.random();
        if (rand < 0.3) {
          // 30% chance of having mock logged entries
          return {
            status: 'logged',
            entryCount: Math.floor(Math.random() * 3) + 1,
            totalMinutes: Math.floor(Math.random() * 240) + 240,
          };
        } else if (rand < 0.5) {
          // 20% chance of having mock draft entries
          return {
            status: 'draft',
            entryCount: Math.floor(Math.random() * 2) + 1,
            totalMinutes: Math.floor(Math.random() * 180) + 120,
          };
        }
      }

      return { status: 'no-logs', entryCount: 0, totalMinutes: 0 };
    }

    const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const hasLoggedEntries = entries.some((entry) => entry.status === 'logged');
    const hasDraftEntries = entries.some((entry) => entry.status === 'draft');

    let status: CalendarDayStatus;
    if (hasLoggedEntries) {
      status = 'logged';
    } else if (hasDraftEntries) {
      status = 'draft';
    } else {
      status = 'no-logs';
    }

    return {
      status,
      entryCount: entries.length,
      totalMinutes,
    };
  }

  /**
   * Get day entries converted to calendar format
   */
  getDayEntries(date: string): TimeLogEntry[] {
    const entries = this.getTimeEntries(date);
    return entries.map((entry) => this.convertToTimeLogEntry(entry, date));
  }

  /**
   * Update entry status (for shipping entries)
   */
  updateEntryStatus(entryId: string, status: 'draft' | 'logged'): boolean {
    for (const [date, entries] of this.timeEntries.entries()) {
      const entryIndex = entries.findIndex((e) => e.id === entryId);
      if (entryIndex >= 0) {
        entries[entryIndex].status = status;
        if (status === 'logged') {
          entries[entryIndex].loggedAt = new Date().toISOString();
        }
        this.timeEntries.set(date, entries);

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(`🗄️ MockDataStore: Updated entry ${entryId} status to ${status}`);
        }

        return true;
      }
    }
    return false;
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.timeEntries.clear();
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🗄️ MockDataStore: Cleared all data');
    }
  }
}

// Create a singleton instance
export const mockDataStore = new MockDataStore();

// Helper to generate some initial mock data for demo purposes
export const initializeMockData = () => {
  // Only run once
  if (mockDataStore.getAllDatesWithEntries().length > 0) {
    return;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Add some mock entries for yesterday as "logged"
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  mockDataStore.addTimeEntries(yesterdayStr, [
    {
      id: `mock-${Date.now()}-1`,
      jiraTaskId: 'XYZ-1111',
      description: 'Implemented user authentication system',
      duration: 180, // 3 hours
      status: 'logged',
      originalMessage: 'Worked on XYZ-1111 for 3 hours implementing user authentication',
      createdAt: yesterday.toISOString(),
      loggedAt: yesterday.toISOString(),
    },
    {
      id: `mock-${Date.now()}-2`,
      jiraTaskId: 'ABC-2222',
      description: 'Fixed UI bugs in dashboard component',
      duration: 120, // 2 hours
      status: 'logged',
      originalMessage: 'Spent 2 hours on ABC-2222 fixing UI bugs in dashboard',
      createdAt: yesterday.toISOString(),
      loggedAt: yesterday.toISOString(),
    },
  ]);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('🗄️ MockDataStore: Initialized with demo data');
  }
};
