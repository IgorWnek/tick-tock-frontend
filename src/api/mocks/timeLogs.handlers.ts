import {
  ParseMessageResponse,
  RefineEntryResponse,
  ShipEntriesResponse,
  TimeEntry,
} from 'api/actions/timeLogs/timeLogs.types';

import { mockDataStore } from './mockDataStore';

/**
 * Simple message parser that extracts Jira IDs and durations from natural language
 * This is a mock implementation for development - real version would use NLP/AI
 */
class MockMessageParser {
  private static readonly jiraIdRegex = /([A-Z]+-\d+)/g;
  private static readonly durationRegex = /(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h|minute|minutes|min|mins|m)/gi;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static parse(message: string, date?: string): ParseMessageResponse {
    // Log date for debugging
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔧 MockMessageParser: parsing message for date:', date || 'today');
    }

    const jiraIds = Array.from(message.matchAll(this.jiraIdRegex)).map((match) => match[1]);
    const durations = Array.from(message.matchAll(this.durationRegex));

    if (jiraIds.length === 0) {
      return {
        entries: [],
        confidence: 0,
        suggestions: ['Try including a Jira task ID like "XYZ-123" in your message'],
        totalDuration: 0,
      };
    }

    const entries: TimeEntry[] = [];
    const createdAt = new Date().toISOString();

    // Simple parsing logic - in reality this would be much more sophisticated
    if (durations.length === 0) {
      // No explicit duration found, assume 1 hour per task
      jiraIds.forEach((jiraId, index) => {
        entries.push({
          id: `entry-${Date.now()}-${index}`,
          jiraTaskId: jiraId,
          description: this.extractDescription(message, jiraId),
          duration: 60, // 1 hour default
          status: 'draft',
          originalMessage: message,
          createdAt,
        });
      });
    } else if (durations.length === 1 && jiraIds.length === 1) {
      // Single duration and single task
      const duration = this.parseDuration(durations[0]);
      entries.push({
        id: `entry-${Date.now()}`,
        jiraTaskId: jiraIds[0],
        description: this.extractDescription(message, jiraIds[0]),
        duration,
        status: 'draft',
        originalMessage: message,
        createdAt,
      });
    } else if (durations.length === jiraIds.length) {
      // Duration per task
      jiraIds.forEach((jiraId, index) => {
        const duration = this.parseDuration(durations[index]);
        entries.push({
          id: `entry-${Date.now()}-${index}`,
          jiraTaskId: jiraId,
          description: this.extractDescription(message, jiraId),
          duration,
          status: 'draft',
          originalMessage: message,
          createdAt,
        });
      });
    } else {
      // Distribute total duration across tasks
      const totalDuration = durations.reduce((sum, duration) => sum + this.parseDuration(duration), 0);
      const durationPerTask = Math.round(totalDuration / jiraIds.length);

      jiraIds.forEach((jiraId, index) => {
        entries.push({
          id: `entry-${Date.now()}-${index}`,
          jiraTaskId: jiraId,
          description: this.extractDescription(message, jiraId),
          duration: durationPerTask,
          status: 'draft',
          originalMessage: message,
          createdAt,
        });
      });
    }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const confidence = this.calculateConfidence(message, entries);

    return {
      entries,
      confidence,
      suggestions: this.generateSuggestions(message, entries),
      totalDuration,
    };
  }

  private static parseDuration(match: RegExpMatchArray): number {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('h')) {
      return Math.round(value * 60); // Convert hours to minutes
    } else {
      return Math.round(value); // Already in minutes
    }
  }

  private static extractDescription(message: string, jiraId: string): string {
    // Simple extraction - look for text near the Jira ID
    let description = '';

    // Look for common patterns
    const patterns = [
      new RegExp(`${jiraId}[^.]*`, 'i'),
      new RegExp(`working on ${jiraId}[^.]*`, 'i'),
      new RegExp(`${jiraId} for [^.]*`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(message);
      if (match) {
        description = match[0].replace(jiraId, '').trim();
        break;
      }
    }

    if (!description) {
      // Fallback: extract words around the Jira ID
      const words = message.split(' ');
      const jiraWordIndex = words.findIndex((word) => word.includes(jiraId));
      if (jiraWordIndex !== -1) {
        const start = Math.max(0, jiraWordIndex - 3);
        const end = Math.min(words.length, jiraWordIndex + 4);
        description = words.slice(start, end).join(' ').replace(jiraId, '').trim();
      }
    }

    return description || 'Work on task';
  }

  private static calculateConfidence(message: string, entries: TimeEntry[]): number {
    let confidence = 50; // Base confidence

    // Boost confidence for clear patterns
    if (message.includes('worked on') || message.includes('working on')) confidence += 20;
    if (message.includes('hour') || message.includes('minute')) confidence += 15;
    if (entries.length > 0) confidence += 10;
    if (message.length > 20) confidence += 5; // More detailed messages

    return Math.min(95, confidence); // Cap at 95%
  }

  private static generateSuggestions(message: string, entries: TimeEntry[]): string[] {
    const suggestions: string[] = [];

    if (entries.length === 0) {
      suggestions.push('Include a Jira task ID (e.g., "XYZ-123") in your message');
    }

    if (!this.durationRegex.exec(message)) {
      suggestions.push('Consider specifying time spent (e.g., "3 hours" or "30 minutes")');
    }

    const durationMatches = message.matchAll(this.durationRegex);
    if (entries.length > 1 && Array.from(durationMatches).length === 1) {
      suggestions.push('You mentioned multiple tasks but one duration - I distributed the time evenly');
    }

    return suggestions;
  }
}

export const timeLogsHandlers = {
  async parseMessage(message: string, date?: string): Promise<ParseMessageResponse> {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔧 timeLogsHandlers.parseMessage called with date:', date);
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = MockMessageParser.parse(message, date);

    // Store the parsed entries in the mock data store
    if (response.entries.length > 0 && date) {
      mockDataStore.addTimeEntries(date, response.entries);

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`🔧 Stored ${response.entries.length} entries for ${date} in mockDataStore`);
      }
    }

    return response;
  },

  async refineEntry(entryId: string, refinementRequest: string, originalMessage: string): Promise<RefineEntryResponse> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // For now, just re-parse the original message with slight modifications
    // In reality, this would apply the refinement request
    const baseResponse = MockMessageParser.parse(originalMessage);

    return {
      entries: baseResponse.entries.map((entry) => ({
        ...entry,
        id: `refined-${entry.id}`,
        description: `${entry.description} (refined)`,
      })),
      confidence: Math.min(baseResponse.confidence + 10, 95),
      suggestions: ['Refinement applied successfully'],
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async shipEntries(entryIds: string[], _date: string): Promise<ShipEntriesResponse> {
    // Simulate Jira API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock successful shipping
    const loggedEntries: TimeEntry[] = entryIds.map((id, index) => ({
      id,
      jiraTaskId: `SHIPPED-${index + 1}`,
      description: `Shipped entry ${index + 1}`,
      duration: 60,
      status: 'logged' as const,
      originalMessage: 'Mock shipped entry',
      createdAt: new Date().toISOString(),
      loggedAt: new Date().toISOString(),
    }));

    return {
      success: true,
      loggedEntries,
    };
  },
};
