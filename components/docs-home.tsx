import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import schemaInventory from '@/content/schema-inventory.json';
import { baseOptions } from '@/lib/layout.shared';

type Language = 'zh' | 'en' | 'de' | 'fr';

interface SystemLayer {
  code: string;
  title: string;
  description: string;
}

interface HomeCopy {
  eyebrow: string;
  title: string;
  titleParts?: readonly [string, string, string];
  description: string;
  primary: string;
  secondary: string;
  systemLabel: string;
  systemTitle: string;
  layers: [SystemLayer, SystemLayer, SystemLayer];
  capabilitiesLabel: string;
  capabilities: [string, string, string, string];
  pathsEyebrow: string;
  pathsTitle: string;
  pathsDescription: string;
  paths: Array<{ title: string; description: string; slug: string; label: string }>;
  closingTitle: string;
  closingDescription: string;
  closingAction: string;
}

const copy: Record<Language, HomeCopy> = {
  zh: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: '让 LCA 数据按同一套规则保存、检查和交换',
    titleParts: ['让 LCA 数据', '按同一套规则', '保存、检查和交换'],
    description:
      'TIDAS 规定过程、流、单位、来源以及它们之间的引用怎样写入同一套数据结构。不同团队和软件因此更容易保存、检查、转换和交换 LCA 数据。它不会替代系统边界、分配、数据质量或评审等专业判断。',
    primary: '先了解 TIDAS',
    secondary: '查看数据结构',
    systemLabel: 'TIDAS 把 LCA 工作要求、数据填写规则和参考数据连接起来；工具帮助检查格式与引用。',
    systemTitle: 'TIDAS 包含什么',
    layers: [
      { code: 'LCA', title: 'LCA 工作要求', description: '说明数据为什么创建、适用于哪里，以及需要怎样的质量和评审' },
      { code: '数据结构', title: '数据填写规则', description: `${schemaInventory.counts.contractSchemas} 组检查规则说明字段、取值和引用怎样组织` },
      { code: '参考数据', title: '参考数据', description: '统一分类、单位和基础数据，方便不同系统交换' },
    ],
    capabilitiesLabel: '可以做什么',
    capabilities: ['整理', '检查', '转换', '交换'],
    pathsEyebrow: '你想完成什么？',
    pathsTitle: '从当前任务开始',
    pathsDescription: '选择最接近你现在工作的入口；遇到术语时可随时查看集中解释。',
    paths: [
      { title: '第一次了解 TIDAS', description: '先看 TIDAS 解决什么问题，以及它和 LCA 方法、工具、数据资源的关系。', slug: 'intro', label: '入门' },
      { title: '查看数据怎样填写', description: '了解过程、流、单位、来源和相互引用怎样统一整理。', slug: 'core-modules', label: '数据结构' },
      { title: '检查或转换数据', description: '用 TIDAS 工具检查文件结构和引用，或在 TIDAS 与 eILCD 之间转换。', slug: 'tool', label: '工具' },
      { title: '查术语和缩写', description: '集中查看 LCA、LCI、LCIA、功能单位、系统边界等概念。', slug: 'glossary', label: '术语' },
    ],
    closingTitle: '第一次来？先用两分钟了解 TIDAS',
    closingDescription: '先了解它能帮你整理和交换什么，也了解哪些 LCA 判断仍需要专业人员完成。',
    closingAction: '阅读简介',
  },
  en: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'Save, check, and exchange LCA data with one shared set of rules',
    description:
      'TIDAS defines how processes, flows, units, sources, and their references are stored in a shared data structure. This makes LCA data easier to save, check, convert, and exchange across teams and software. It does not replace professional judgement about the system boundary, allocation, data quality, or review.',
    primary: 'What is TIDAS?',
    secondary: 'See how data is organized',
    systemLabel: 'TIDAS connects LCA work requirements, data-entry rules, and reference data; tools help check file structure and references.',
    systemTitle: 'What TIDAS contains',
    layers: [
      { code: 'LCA', title: 'LCA work requirements', description: 'Why data is created, where it applies, and what quality and review it needs' },
      { code: 'STRUCTURE', title: 'Data-entry rules', description: `${schemaInventory.counts.contractSchemas} sets of checks describe fields, values, and references` },
      { code: 'REFERENCE', title: 'Reference data', description: 'Shared classifications, units, and base data support exchange between systems' },
    ],
    capabilitiesLabel: 'What it helps you do',
    capabilities: ['Organize', 'Check', 'Convert', 'Exchange'],
    pathsEyebrow: 'What do you want to do?',
    pathsTitle: 'Start with your current task',
    pathsDescription: 'Choose the closest task. Open the glossary whenever an LCA term is new to you.',
    paths: [
      { title: 'Learn what TIDAS is', description: 'See the problem TIDAS solves and how it relates to LCA methods, tools, and data resources.', slug: 'intro', label: 'START' },
      { title: 'See how data is organized', description: 'Learn how processes, flows, units, sources, and links are recorded consistently.', slug: 'core-modules', label: 'STRUCTURE' },
      { title: 'Check or convert data', description: 'Use TIDAS tools to check file structure and links, or convert between TIDAS and eILCD.', slug: 'tool', label: 'TOOLS' },
      { title: 'Look up terms and abbreviations', description: 'Find plain explanations of LCA, LCI, LCIA, functional units, system boundaries, and more.', slug: 'glossary', label: 'TERMS' },
    ],
    closingTitle: 'New here? Understand TIDAS in two minutes',
    closingDescription: 'Learn what TIDAS can organize and exchange—and which LCA decisions still need professional judgement.',
    closingAction: 'Read the introduction',
  },
  de: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'LCA-Daten nach gemeinsamen Regeln speichern, prüfen und austauschen',
    description:
      'TIDAS legt fest, wie Prozesse, Flüsse, Einheiten, Quellen und ihre Verweise in einer gemeinsamen Datenstruktur gespeichert werden. So lassen sich LCA-Daten leichter zwischen Teams und Software speichern, prüfen, konvertieren und austauschen. Fachliche Entscheidungen zu Systemgrenze, Allokation, Datenqualität oder Review ersetzt TIDAS nicht.',
    primary: 'Was ist TIDAS?',
    secondary: 'Datenaufbau ansehen',
    systemLabel: 'TIDAS verbindet Anforderungen der LCA-Arbeit, Regeln für die Dateneingabe und Referenzdaten; Werkzeuge prüfen Dateistruktur und Verweise.',
    systemTitle: 'Was TIDAS umfasst',
    layers: [
      { code: 'ÖKOBILANZ', title: 'Anforderungen der LCA-Arbeit', description: 'Warum Daten erstellt werden, wo sie gelten und welche Qualität und Prüfung nötig sind' },
      { code: 'STRUKTUR', title: 'Regeln für die Dateneingabe', description: `${schemaInventory.counts.contractSchemas} Prüfsätze beschreiben Felder, Werte und Verweise` },
      { code: 'REFERENZ', title: 'Referenzdaten', description: 'Gemeinsame Klassifikationen, Einheiten und Basisdaten erleichtern den Austausch' },
    ],
    capabilitiesLabel: 'Wobei TIDAS hilft',
    capabilities: ['Ordnen', 'Prüfen', 'Konvertieren', 'Austauschen'],
    pathsEyebrow: 'Was möchten Sie tun?',
    pathsTitle: 'Mit der aktuellen Aufgabe beginnen',
    pathsDescription: 'Wählen Sie die passende Aufgabe. Unbekannte LCA-Begriffe finden Sie im Glossar.',
    paths: [
      { title: 'TIDAS kennenlernen', description: 'Erfahren Sie, welches Problem TIDAS löst und wie Methoden, Werkzeuge und Daten zusammenhängen.', slug: 'intro', label: 'START' },
      { title: 'Datenaufbau verstehen', description: 'Sehen Sie, wie Prozesse, Flüsse, Einheiten, Quellen und Verweise einheitlich erfasst werden.', slug: 'core-modules', label: 'STRUKTUR' },
      { title: 'Daten prüfen oder konvertieren', description: 'Prüfen Sie Dateistruktur und Verweise oder konvertieren Sie zwischen TIDAS und eILCD.', slug: 'tool', label: 'WERKZEUGE' },
      { title: 'Begriffe nachschlagen', description: 'Finden Sie verständliche Erklärungen zu LCA, LCI, LCIA, funktioneller Einheit und Systemgrenze.', slug: 'glossary', label: 'BEGRIFFE' },
    ],
    closingTitle: 'Neu hier? TIDAS in zwei Minuten verstehen',
    closingDescription: 'Erfahren Sie, was TIDAS ordnen und austauschen kann und welche LCA-Entscheidungen Fachwissen erfordern.',
    closingAction: 'Einführung lesen',
  },
  fr: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'Enregistrer, vérifier et échanger les données d’ACV selon des règles communes',
    description:
      'TIDAS définit comment les processus, flux, unités, sources et leurs références sont enregistrés dans une structure de données commune. Les équipes et logiciels peuvent ainsi enregistrer, vérifier, convertir et échanger plus facilement les données d’ACV. TIDAS ne remplace pas le jugement professionnel sur la frontière du système, l’allocation, la qualité des données ou la revue.',
    primary: 'Qu’est-ce que TIDAS ?',
    secondary: 'Voir l’organisation des données',
    systemLabel: 'TIDAS relie les exigences du travail d’ACV, les règles de saisie et les données de référence ; les outils vérifient la structure des fichiers et les références.',
    systemTitle: 'Ce que contient TIDAS',
    layers: [
      { code: 'ACV', title: 'Exigences du travail d’ACV', description: 'Pourquoi les données sont créées, où elles s’appliquent et quelle qualité ou revue est requise' },
      { code: 'STRUCTURE', title: 'Règles de saisie', description: `${schemaInventory.counts.contractSchemas} ensembles de contrôles décrivent les champs, les valeurs et les références` },
      { code: 'RÉFÉRENCE', title: 'Données de référence', description: 'Des classifications, unités et données de base communes facilitent les échanges' },
    ],
    capabilitiesLabel: 'Ce que TIDAS aide à faire',
    capabilities: ['Organiser', 'Vérifier', 'Convertir', 'Échanger'],
    pathsEyebrow: 'Que souhaitez-vous faire ?',
    pathsTitle: 'Commencer par votre tâche actuelle',
    pathsDescription: 'Choisissez la tâche la plus proche. Le glossaire explique les termes d’ACV moins familiers.',
    paths: [
      { title: 'Découvrir TIDAS', description: 'Comprenez le problème traité par TIDAS et le lien entre méthodes, outils et données.', slug: 'intro', label: 'DÉBUT' },
      { title: 'Comprendre l’organisation des données', description: 'Voyez comment processus, flux, unités, sources et références sont enregistrés de façon cohérente.', slug: 'core-modules', label: 'STRUCTURE' },
      { title: 'Vérifier ou convertir des données', description: 'Vérifiez la structure et les références, ou convertissez entre TIDAS et eILCD.', slug: 'tool', label: 'OUTILS' },
      { title: 'Consulter les termes et sigles', description: 'Trouvez des explications simples pour ACV, ICV, ACVI, unité fonctionnelle et frontière du système.', slug: 'glossary', label: 'TERMES' },
    ],
    closingTitle: 'Vous débutez ? Comprendre TIDAS en deux minutes',
    closingDescription: 'Voyez ce que TIDAS peut organiser et échanger, et quelles décisions d’ACV exigent toujours un jugement professionnel.',
    closingAction: 'Lire l’introduction',
  },
};

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocsHome({ lang, root = false }: { lang: string; root?: boolean }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];

  return (
    <HomeLayout {...baseOptions(language, root ? '/' : undefined)}>
      <div className="atlas-home">
        <section className="atlas-hero">
          <div className="atlas-shell atlas-hero-grid">
            <div className="atlas-hero-copy">
              <p className="atlas-eyebrow">{content.eyebrow}</p>
              <h1 className={content.titleParts ? 'tidas-controlled-title' : undefined} data-controlled-title>
                {content.titleParts
                  ? content.titleParts.map((line) => (
                      <span className="block" data-controlled-title-line key={line}>{line}</span>
                    ))
                  : content.title}
              </h1>
              <p className="atlas-lede">{content.description}</p>
              <div className="atlas-actions">
                <Link className={`${buttonVariants({ variant: 'primary' })} atlas-action`} data-primary-action href={`/${language}/docs/intro/`}>
                  {content.primary}
                  <Arrow />
                </Link>
                <Link className={`${buttonVariants({ variant: 'outline' })} atlas-action`} href={`/${language}/docs/core-modules/schema/schema-content/json-schema-flows/`}>
                  {content.secondary}
                </Link>
              </div>
            </div>

            <aside
              aria-label={content.systemLabel}
              className="tidas-system-map"
              data-hero-signature="tidas-system-map"
            >
              <header className="tidas-system-header">
                <strong>TIDAS</strong>
                <span>{content.systemTitle}</span>
              </header>
              <div className="tidas-system-layers">
                {content.layers.map((layer) => (
                  <div className="tidas-system-layer" key={layer.code}>
                    <code>{layer.code}</code>
                    <div>
                      <strong>{layer.title}</strong>
                      <p>{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <footer aria-label={content.capabilitiesLabel} className="tidas-system-capabilities">
                {content.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
              </footer>
            </aside>
          </div>
        </section>

        <section className="atlas-paths">
          <div className="atlas-shell">
            <div className="atlas-section-heading">
              <p className="atlas-eyebrow">{content.pathsEyebrow}</p>
              <h2>{content.pathsTitle}</h2>
              <p>{content.pathsDescription}</p>
            </div>
            <Cards className="grid-cols-2 gap-3 max-[40rem]:grid-cols-1">
              {content.paths.map((path) => (
                <Card
                  className="grid min-h-52 content-start gap-2.5 rounded-[2px] border-fd-border bg-fd-card p-5 text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent max-[40rem]:min-h-48 [&>div:last-child]:self-end [&_h3]:m-0 [&_h3]:text-lg [&_h3]:leading-[1.35] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_p]:m-0! [&_p]:text-sm [&_p]:leading-[1.6] [&_p]:text-fd-muted-foreground"
                  description={path.description}
                  href={`/${language}/docs/${path.slug}/`}
                  key={path.slug}
                  title={path.title}
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-fd-primary">
                    {path.label}
                    <Arrow />
                  </span>
                </Card>
              ))}
            </Cards>
          </div>
        </section>

        <section className="atlas-closing">
          <div className="atlas-shell atlas-closing-card">
            <div>
              <h2>{content.closingTitle}</h2>
              <p>{content.closingDescription}</p>
            </div>
            <Link className={`${buttonVariants({ variant: 'primary' })} atlas-action`} data-primary-action href={`/${language}/docs/intro/`}>
              {content.closingAction}
              <Arrow />
            </Link>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
