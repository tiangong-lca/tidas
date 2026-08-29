import inventory from '@/content/schema-inventory.json';

type Language = 'zh' | 'en' | 'de' | 'fr';

const copy: Record<Language, {
  title: string;
  description: string;
  published: string;
  contracts: string;
  datasets: string;
  classifications: string;
  shared: string;
  viewer: string;
  note: string;
}> = {
  zh: {
    title: 'Schema 资产口径',
    description: '数量由版本库中的机器可读清单生成。',
    published: '公开 JSON 资产', contracts: '逻辑合同 Schema', datasets: '数据集对象', classifications: '分类词表', shared: '共享类型', viewer: '查看器投影',
    note: '“合同”是本清单的角色声明。查看器投影是派生、非规范资产，不得用于校验或符合性证明；与工具锁文件同名不代表内容逐字或结构一致。',
  },
  en: {
    title: 'Schema asset inventory', description: 'Counts are generated from the machine-readable inventory committed with the site.',
    published: 'Published JSON assets', contracts: 'Logical contract Schemas', datasets: 'Dataset objects', classifications: 'Classification vocabularies', shared: 'Shared types', viewer: 'Viewer projection',
    note: '“Contract” is a role declared by this inventory. The viewer projection is derived and non-normative: never use it for validation or conformance. Matching the tools lock by file name does not assert structural or byte-for-byte parity.',
  },
  de: {
    title: 'Inventar der Schema-Assets', description: 'Die Zahlen stammen aus dem maschinenlesbaren Inventar im Repository.',
    published: 'Veröffentlichte JSON-Assets', contracts: 'Logische Vertrags-Schemas', datasets: 'Datensatzobjekte', classifications: 'Klassifikationsvokabulare', shared: 'Gemeinsame Typen', viewer: 'Viewer-Projektion',
    note: '„Vertrag“ ist eine Rollenangabe dieses Inventars. Die Viewer-Projektion ist abgeleitet und nicht normativ; sie darf weder zur Validierung noch als Konformitätsnachweis dienen. Gleiche Dateinamen wie im Tool-Lock bedeuten keine strukturelle oder bytegenaue Gleichheit.',
  },
  fr: {
    title: 'Inventaire des ressources de schéma', description: 'Les nombres proviennent de l’inventaire lisible par machine conservé dans le dépôt.',
    published: 'Ressources JSON publiées', contracts: 'Schémas de contrat logiques', datasets: 'Objets de jeu de données', classifications: 'Vocabulaires de classification', shared: 'Types partagés', viewer: 'Projection pour l’explorateur',
    note: '« Contrat » est un rôle déclaré par cet inventaire. La projection de l’explorateur est dérivée et non normative : elle ne doit servir ni à la validation ni à une preuve de conformité. Des noms identiques à ceux du verrouillage des outils n’impliquent pas une parité structurelle ou octet par octet.',
  },
};

export function SchemaInventorySummary({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];
  const metrics = [
    [content.published, inventory.counts.publishedAssets],
    [content.contracts, inventory.counts.contractSchemas],
    [content.datasets, inventory.counts.datasetObjects],
    [content.classifications, inventory.counts.classificationVocabularies],
    [content.shared, inventory.counts.sharedTypes],
    [content.viewer, inventory.counts.viewerProjections],
  ] as const;

  return (
    <section className="not-prose my-6 rounded-[2px] border border-fd-border bg-fd-muted/30 p-5" data-schema-inventory="v1">
      <h2 className="m-0 text-lg font-semibold">{content.title}</h2>
      <div className="mt-1 text-sm leading-6 text-fd-muted-foreground">{content.description}</div>
      <dl className="mt-4 grid grid-cols-2 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[40rem]:grid-cols-1">
        {metrics.map(([name, value]) => (
          <div className="flex items-center justify-between gap-4 bg-fd-background p-3" key={name}>
            <dt className="text-sm text-fd-muted-foreground">{name}</dt>
            <dd className="m-0 text-lg font-semibold text-fd-primary">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 text-xs leading-5 text-fd-muted-foreground">{content.note}</div>
    </section>
  );
}
