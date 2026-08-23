export function SiteBrand() {
  return (
    <span className="atlas-brand">
      <span className="atlas-brand-mark" aria-hidden="true">
        {/* Static export serves the public SVGs directly. */}
        <img src="/logo-light.svg" alt="" width={30} height={30} className="dark:hidden" />
        <img src="/logo-dark.svg" alt="" width={30} height={30} className="hidden dark:block" />
      </span>
      <span className="atlas-brand-name">
        TIDAS <span className="atlas-brand-product">Data Specification</span>
      </span>
    </span>
  );
}
