import * as React from 'react';
import { PrimitiveType } from 'react-intl';

import { useLocale } from '@/hooks/useLocale/useLocale';
import { AppMessages, Translation as TranslationKey } from '@/i18n/messages';

export type TranslationProps = {
  id: TranslationKey;
  values?: Record<string, PrimitiveType>;
  className?: string;
  asChild?: boolean;
};

export const Translation = ({ id, values, className, asChild = false }: TranslationProps) => {
  const { formatMessage } = useLocale();

  const content = formatMessage({ id: AppMessages[id] }, values);

  if (asChild) {
    return <>{content}</>;
  }

  return (
    <span data-slot="translation" className={className}>
      {content}
    </span>
  );
};
