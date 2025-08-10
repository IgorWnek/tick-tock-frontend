import React, { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

interface JiraIdHighlighterProps {
  text: string;
  className?: string;
  highlightClassName?: string;
}

const JIRA_ID_REGEX = /([A-Z]+-\d+)/g;

export const JiraIdHighlighter: React.FC<JiraIdHighlighterProps> = ({
  text,
  className,
  highlightClassName = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1 py-0.5 rounded font-medium',
}) => {
  const highlightedText = useMemo(() => {
    if (!text) return null;

    const parts = text.split(JIRA_ID_REGEX);
    return parts.map((part, index) => {
      if (JIRA_ID_REGEX.test(part)) {
        return (
          <span key={`jira-${part}-${index}`} className={highlightClassName}>
            {part}
          </span>
        );
      }
      return <React.Fragment key={`text-${part.slice(0, 10)}-${index}`}>{part}</React.Fragment>;
    });
  }, [text, highlightClassName]);

  return <div className={cn('whitespace-pre-wrap', className)}>{highlightedText}</div>;
};

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  showHighlighting?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  placeholder = 'Describe your work in natural language...',
  className,
  disabled = false,
  maxLength = 1000,
  showHighlighting = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const jiraIds = useMemo(() => {
    if (!value) return [];
    return Array.from(value.matchAll(JIRA_ID_REGEX)).map((match) => match[1]);
  }, [value]);

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className={cn('relative space-y-2', className)}>
      {/* Main Input Area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={6}
          className={cn(
            'w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            isFocused && 'border-primary',
          )}
        />
      </div>

      {/* Highlighting Preview (when not focused and has content) */}
      {showHighlighting && !isFocused && value && jiraIds.length > 0 && (
        <div className="bg-muted/30 border rounded-lg p-3 text-sm">
          <div className="text-xs text-muted-foreground mb-2">Preview with Jira ID highlighting:</div>
          <JiraIdHighlighter text={value} />
        </div>
      )}

      {/* Bottom Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {jiraIds.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>
                {jiraIds.length} Jira {jiraIds.length === 1 ? 'ID' : 'IDs'} detected
              </span>
            </div>
          )}
        </div>

        <div className={cn('tabular-nums', isNearLimit && 'text-amber-600 dark:text-amber-400')}>
          {characterCount}/{maxLength}
        </div>
      </div>
    </div>
  );
};
