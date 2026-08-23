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

/**
 * Docusaurus TidasImage 的静态替代：locale 图片 + 深/浅主题双变体。
 * 旧实现运行时 useDocusaurusContext + MutationObserver；
 * 静态导出下 locale 从 fumadocs i18n 上下文读取、主题用 CSS dark: 变体。
 */
export function TidasImage({ filename, title }: TidasImageProps) {
  const { locale } = useI18n();
  const m = filename.match(/^(.+?)(\.(svg|png|webp))?$/i);
  const base = m?.[1] ?? filename;
  const ext = m?.[3]?.toLowerCase() ?? 'svg';
  // 图片资产只有 zh-CN 与 en 两套；非 zh 语言回退 en
  const dir = locale === 'zh' ? 'zh-CN' : 'en';
  const light = `/img/${dir}/${base}-${dir}.${ext}`;
  const dark = `/img/${dir}/${base}-${dir}-dark.${ext}`;

  return (
    <span className="my-4 block">
      <img src={light} alt={title} loading="lazy" className="mx-auto block w-full max-w-4xl dark:hidden" />
      <img src={dark} alt={title} loading="lazy" className="mx-auto hidden w-full max-w-4xl dark:block" />
    </span>
  );
}
