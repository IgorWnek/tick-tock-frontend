export interface TimeEntry {
  id: string;
  jiraTaskId: string;
  description: string;
  duration: number; // minutes
  status: 'draft' | 'logged';
  originalMessage: string;
  createdAt: string;
  loggedAt?: string;
}

export interface ParseMessageArgs {
  message: string;
  date?: string; // ISO date string, defaults to today
}

export interface ParseMessageResponse {
  entries: TimeEntry[];
  confidence: number;
  suggestions?: string[];
  totalDuration: number; // total minutes across all entries
}

export interface RefineEntryArgs {
  entryId: string;
  refinementRequest: string;
  originalMessage: string;
  date?: string; // ISO date string for proper cache invalidation
}

export interface RefineEntryResponse {
  entries: TimeEntry[];
  confidence: number;
  suggestions?: string[];
}

export interface ShipEntriesArgs {
  entryIds: string[];
  date: string;
}

export interface ShipEntriesResponse {
  success: boolean;
  loggedEntries: TimeEntry[];
  errors?: Array<{
    entryId: string;
    error: string;
  }>;
}
