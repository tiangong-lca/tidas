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
    title: '这里提供哪些文件？',
    description: '以下数量从本站公开文件清单自动统计。',
    published: '可下载的 JSON 文件', contracts: '用于检查数据的规则文件', datasets: 'LCA 数据类型', classifications: '分类表', shared: '共用字段规则', viewer: '仅供网页展示的结构',
    note: '规则文件用于说明或检查实际数据；标记为“仅供网页展示的结构”的文件只帮助浏览内容，不能用来判断数据是否通过格式检查。文件名与工具中的文件相同，也不一定表示内容完全一致。',
  },
  en: {
    title: 'Which files are available?', description: 'These counts are generated from the list of files published on this site.',
    published: 'Downloadable JSON files', contracts: 'Rule files used to check data', datasets: 'LCA data types', classifications: 'Classification tables', shared: 'Shared field rules', viewer: 'Structure used only by this website',
    note: 'Rule files describe or check real data. The file labelled “Structure used only by this website” only helps display content and cannot tell you whether data passes a format check. A matching file name in the tools does not guarantee identical contents.',
  },
  de: {
    title: 'Welche Dateien stehen bereit?', description: 'Die Zahlen werden aus der Liste der auf dieser Website veröffentlichten Dateien erzeugt.',
    published: 'Herunterladbare JSON-Dateien', contracts: 'Regeldateien zur Datenprüfung', datasets: 'LCA-Datentypen', classifications: 'Klassifikationstabellen', shared: 'Gemeinsame Feldregeln', viewer: 'Struktur nur für die Website-Anzeige',
    note: 'Regeldateien beschreiben oder prüfen echte Daten. Die Datei mit der Kennzeichnung „Struktur nur für die Website-Anzeige“ dient nur zum Lesen auf der Website und kann keine bestandene Formatprüfung belegen. Gleiche Dateinamen in den Werkzeugen garantieren keine identischen Inhalte.',
  },
  fr: {
    title: 'Quels fichiers sont disponibles ?', description: 'Ces nombres sont calculés à partir de la liste des fichiers publiés sur ce site.',
    published: 'Fichiers JSON téléchargeables', contracts: 'Fichiers de règles utilisés pour les contrôles', datasets: 'Types de données d’ACV', classifications: 'Tables de classification', shared: 'Règles de champs partagées', viewer: 'Structure réservée à l’affichage du site',
    note: 'Les fichiers de règles décrivent ou contrôlent des données réelles. Le fichier intitulé « Structure réservée à l’affichage du site » facilite uniquement la lecture et ne peut pas établir qu’un fichier passe un contrôle de format. Un nom identique dans les outils ne garantit pas un contenu identique.',
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
