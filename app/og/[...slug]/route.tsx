import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { source } from '@/lib/source';

export const revalidate = false;

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    // 末段固定 image.png：既给出 .png 文件名，也避免与子页面目录路径冲突
    slug: [page.locale, 'docs', ...page.slugs, 'image.png'].filter(Boolean),
  }));
}

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params;
  const lang = slug[0];
  const docSlugs = slug.slice(2, -1);
  const page = source.getPage(docSlugs, lang);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="TIDAS"
    />,
    { width: 1200, height: 630 },
  );
}
