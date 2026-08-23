import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
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
  titleParts?: readonly [string, string, string, string];
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
    title: '连接方法、结构与数据，构建生命周期数据系统',
    titleParts: ['连接方法、结构', '与数据，', '构建', '生命周期数据系统'],
    description:
      'TIDAS 以 JSON Schema 为结构层，结合数据生产方法与开放数据资源，为 LCA 与碳足迹数据提供建模、校验、无损转换和系统集成基础。',
    primary: '了解系统架构',
    secondary: '浏览 JSON Schema',
    systemLabel: 'TIDAS 由方法论、数据结构和数据资源三层组成，并支持校验、转换、发布与集成。',
    systemTitle: '系统组成',
    layers: [
      { code: 'METHOD', title: '方法论', description: '定义数据如何生产、验证与维护' },
      { code: 'FORMAT', title: '数据结构', description: '17 个 JSON Schema 描述字段、约束与引用' },
      { code: 'DATA', title: '数据资源', description: '参考分类与基础数据支持一致交换' },
    ],
    capabilitiesLabel: '系统能力',
    capabilities: ['校验', '转换', '发布', '集成'],
    pathsEyebrow: '从系统能力开始',
    pathsTitle: '找到与你当前任务对应的入口',
    pathsDescription: '先理解系统边界，再进入数据结构、工具或集成细节。',
    paths: [
      { title: '理解系统组成', description: '了解方法论、数据结构、数据资源以及它们之间的边界。', slug: 'intro', label: 'SYSTEM' },
      { title: '浏览 JSON Schema', description: '按数据集与分类体系检查字段、约束和引用关系。', slug: 'core-modules/schema/schema-content/json-schema-flows', label: 'SCHEMA' },
      { title: '校验与转换', description: '使用统一 CLI 校验数据，并在 TIDAS 与 eILCD 之间转换。', slug: 'core-modules/schema/tidas-schema-validation', label: 'TOOLS' },
      { title: '接入现有系统', description: '通过 TIDAS CLI、MCP 与集成指南连接现有工作流。', slug: 'tool/tidas-tool-intro', label: 'INTEGRATION' },
    ],
    closingTitle: '从系统总览开始',
    closingDescription: '先明确 TIDAS 的组成和边界，再查看 Schema 中的真实数据约束。',
    closingAction: '阅读系统简介',
  },
  en: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'A life cycle data system connecting methods, structures, and data',
    description:
      'TIDAS combines data-production methods, JSON Schema, and open data resources into a common foundation for LCA and carbon-footprint modelling, validation, lossless conversion, and system integration.',
    primary: 'Understand the system',
    secondary: 'Explore JSON Schema',
    systemLabel: 'TIDAS combines methodology, data structures, and data resources, with capabilities for validation, conversion, publication, and integration.',
    systemTitle: 'System composition',
    layers: [
      { code: 'METHOD', title: 'Methodology', description: 'How data is produced, reviewed, and maintained' },
      { code: 'FORMAT', title: 'Data structure', description: '17 JSON Schemas define fields, constraints, and references' },
      { code: 'DATA', title: 'Data resources', description: 'Reference classifications and data support consistent exchange' },
    ],
    capabilitiesLabel: 'System capabilities',
    capabilities: ['Validate', 'Convert', 'Publish', 'Integrate'],
    pathsEyebrow: 'Start with a system capability',
    pathsTitle: 'Choose the entry point for the task in front of you',
    pathsDescription: 'Understand the system boundary first, then move into structures, tools, or integrations.',
    paths: [
      { title: 'Understand the system', description: 'Learn how methodology, data structures, and data resources fit together.', slug: 'intro', label: 'SYSTEM' },
      { title: 'Explore JSON Schema', description: 'Inspect fields, constraints, and references by dataset and taxonomy.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: 'SCHEMA' },
      { title: 'Validate and convert', description: 'Use the unified CLI to validate data and convert between TIDAS and eILCD.', slug: 'core-modules/schema/tidas-schema-validation', label: 'TOOLS' },
      { title: 'Connect existing systems', description: 'Use the TIDAS CLI, MCP, and integration guides in existing workflows.', slug: 'tool/tidas-tool-intro', label: 'INTEGRATION' },
    ],
    closingTitle: 'Begin with the system overview',
    closingDescription: 'Establish what TIDAS contains and where its boundary lies, then inspect real constraints in the Schema explorer.',
    closingAction: 'Read the system introduction',
  },
  de: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'Ein System für Lebenszyklusdaten, das Methoden, Strukturen und Daten verbindet',
    description:
      'TIDAS vereint Methoden zur Datenerstellung, JSON-Schemas und offene Datenressourcen zu einer gemeinsamen Grundlage für Modellierung, Prüfung, verlustfreie Konvertierung und Systemintegration von Ökobilanz- und CO₂-Fußabdruckdaten.',
    primary: 'Systemarchitektur verstehen',
    secondary: 'JSON Schema erkunden',
    systemLabel: 'TIDAS verbindet Methodik, Datenstrukturen und Datenressourcen mit Funktionen für Prüfung, Konvertierung, Veröffentlichung und Integration.',
    systemTitle: 'Systemaufbau',
    layers: [
      { code: 'METHOD', title: 'Methodik', description: 'Wie Daten erstellt, geprüft und gepflegt werden' },
      { code: 'FORMAT', title: 'Datenstruktur', description: '17 JSON-Schemas definieren Felder, Regeln und Referenzen' },
      { code: 'DATA', title: 'Datenressourcen', description: 'Referenzklassifikationen und Daten sichern konsistenten Austausch' },
    ],
    capabilitiesLabel: 'Systemfunktionen',
    capabilities: ['Prüfen', 'Konvertieren', 'Veröffentlichen', 'Integrieren'],
    pathsEyebrow: 'Mit einer Systemfunktion beginnen',
    pathsTitle: 'Wählen Sie den Einstieg für Ihre aktuelle Aufgabe',
    pathsDescription: 'Klären Sie zuerst die Systemgrenze und gehen Sie dann zu Strukturen, Werkzeugen oder Integrationen.',
    paths: [
      { title: 'System verstehen', description: 'Erfahren Sie, wie Methodik, Datenstrukturen und Datenressourcen zusammenspielen.', slug: 'intro', label: 'SYSTEM' },
      { title: 'JSON Schema erkunden', description: 'Felder, Einschränkungen und Referenzen nach Datensatz und Klassifikation prüfen.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: 'SCHEMA' },
      { title: 'Prüfen und konvertieren', description: 'Daten mit der einheitlichen CLI prüfen und zwischen TIDAS und eILCD konvertieren.', slug: 'core-modules/schema/tidas-schema-validation', label: 'TOOLS' },
      { title: 'Bestehende Systeme anbinden', description: 'TIDAS CLI, MCP und Integrationsleitfäden in bestehenden Abläufen einsetzen.', slug: 'tool/tidas-tool-intro', label: 'INTEGRATION' },
    ],
    closingTitle: 'Mit dem Systemüberblick beginnen',
    closingDescription: 'Klären Sie Aufbau und Grenzen von TIDAS, bevor Sie reale Regeln im Schema-Explorer untersuchen.',
    closingAction: 'Systemeinführung lesen',
  },
  fr: {
    eyebrow: 'TIDAS · TianGong Data System',
    title: 'Un système de données de cycle de vie reliant méthodes, structures et données',
    description:
      'TIDAS réunit les méthodes de production, JSON Schema et des ressources de données ouvertes dans un socle commun pour la modélisation ACV et empreinte carbone, la validation, la conversion sans perte et l’intégration de systèmes.',
    primary: 'Comprendre le système',
    secondary: 'Explorer JSON Schema',
    systemLabel: 'TIDAS associe méthodologie, structures et ressources de données à des fonctions de validation, conversion, publication et intégration.',
    systemTitle: 'Composition du système',
    layers: [
      { code: 'METHOD', title: 'Méthodologie', description: 'Comment les données sont produites, vérifiées et maintenues' },
      { code: 'FORMAT', title: 'Structure de données', description: '17 schémas JSON définissent champs, contraintes et références' },
      { code: 'DATA', title: 'Ressources de données', description: 'Classifications et données de référence assurent des échanges cohérents' },
    ],
    capabilitiesLabel: 'Fonctions du système',
    capabilities: ['Valider', 'Convertir', 'Publier', 'Intégrer'],
    pathsEyebrow: 'Commencer par une fonction du système',
    pathsTitle: 'Choisissez l’entrée adaptée à votre tâche',
    pathsDescription: 'Comprenez d’abord le périmètre du système, puis accédez aux structures, outils ou intégrations.',
    paths: [
      { title: 'Comprendre le système', description: 'Découvrez comment méthodologie, structures et ressources de données s’articulent.', slug: 'intro', label: 'SYSTEM' },
      { title: 'Explorer JSON Schema', description: 'Examinez champs, contraintes et références par jeu de données et taxonomie.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: 'SCHEMA' },
      { title: 'Valider et convertir', description: 'Validez les données et convertissez-les entre TIDAS et eILCD avec la CLI unifiée.', slug: 'core-modules/schema/tidas-schema-validation', label: 'TOOLS' },
      { title: 'Connecter les systèmes', description: 'Utilisez la CLI TIDAS, MCP et les guides dans vos flux existants.', slug: 'tool/tidas-tool-intro', label: 'INTEGRATION' },
    ],
    closingTitle: 'Commencer par la vue d’ensemble',
    closingDescription: 'Définissez la composition et le périmètre de TIDAS avant d’examiner les contraintes réelles dans l’explorateur.',
    closingAction: 'Lire la présentation du système',
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
              <h1 className={content.titleParts ? 'whitespace-nowrap' : undefined} data-controlled-title>
                {content.titleParts
                  ? (
                      <>
                        {content.titleParts[0]}
                        <br className="hidden max-[40rem]:block" />
                        {content.titleParts[1]}
                        <br className="max-[40rem]:hidden" />
                        {content.titleParts[2]}
                        <br className="hidden max-[40rem]:block" />
                        {content.titleParts[3]}
                      </>
                    )
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
