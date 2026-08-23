'use client';

import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import type { ReactNode } from 'react';

export function Provider({
  children,
  i18n,
}: {
  children: ReactNode;
  i18n?: I18nProviderProps;
}) {
  return (
    <RootProvider i18n={i18n} search={{ SearchDialog }}>
      {children}
    </RootProvider>
  );
}
