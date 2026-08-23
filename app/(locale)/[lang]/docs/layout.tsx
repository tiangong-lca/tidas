import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default async function DocsLayoutWrapper({
  children,
  params,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsLayout {...baseOptions(lang)} tree={source.getPageTree(lang)}>
      {children}
    </DocsLayout>
  );
}
