export function SiteBrand() {
  return (
    <span className="atlas-brand" aria-label="TIDAS — TianGong Data System">
      <span className="atlas-brand-mark" aria-hidden="true">
        {/* Static export serves the public SVGs directly. */}
        <img src="/logo-light.svg" alt="" width={28} height={28} className="dark:hidden" />
        <img src="/logo-dark.svg" alt="" width={28} height={28} className="hidden dark:block" />
      </span>
      <span className="atlas-brand-name" aria-hidden="true">
        <span className="atlas-brand-compact">TIDAS</span>
        <span className="atlas-brand-full">
          TIDAS <span className="atlas-brand-product">/ TianGong Data System</span>
        </span>
      </span>
    </span>
  );
}
