export interface VideoEmbedProps {
  /** 嵌入源 URL（如 bilibili 播放器） */
  src: string;
  /** 无障碍标题（必填，替代旧站无 title 的 iframe） */
  title: string;
}

/**
 * v4 §2：旧站 iframe JSX（demonstrations.md 内联样式定位）的类型安全、可访问替代。
 */
export function VideoEmbed({ src, title }: VideoEmbedProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
