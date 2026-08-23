'use client';

import { useI18n } from 'fumadocs-ui/contexts/i18n';

export interface TidasImageProps {
  /**
   * 图片基础名或含扩展名（如 "TIDAS"、"MCP-inspector.png"）。
   * 组件按当前 locale 解析 /img/{locale-dir}/{base}-{locale-dir}{.ext}
   * 与 -dark 变体；非 zh 语言回退 en 资源。
   */
  filename: string;
  /** 无障碍标题（必填，替代旧实现用文件名充当 alt 的做法） */
  title: string;
}

const darkVariantNames = new Set([
  'MCP-inspector',
  'TIDAS',
  'TIDAS-blockchain',
  'TIDAS-dataspace',
  'TIDAS-permission-control',
]);

/** Locale-aware static image with an optional light/dark asset pair. */
export function TidasImage({ filename, title }: TidasImageProps) {
  const { locale } = useI18n();
  const m = filename.match(/^(.+?)(\.(svg|png|webp))?$/i);
  const base = m?.[1] ?? filename;
  const ext = m?.[3]?.toLowerCase() ?? 'svg';
  // 图片资产只有 zh-CN 与 en 两套；非 zh 语言回退 en
  const dir = locale === 'zh' ? 'zh-CN' : 'en';
  const light = `/img/${dir}/${base}-${dir}.${ext}`;
  const dark = `/img/${dir}/${base}-${dir}-dark.${ext}`;
  const hasDarkVariant = darkVariantNames.has(base);

  return (
    <span className="my-4 block">
      <img src={light} alt={title} loading="lazy" className={`mx-auto block w-full max-w-4xl ${hasDarkVariant ? 'dark:hidden' : ''}`} />
      {hasDarkVariant && <img src={dark} alt={title} loading="lazy" className="mx-auto hidden w-full max-w-4xl dark:block" />}
    </span>
  );
}
