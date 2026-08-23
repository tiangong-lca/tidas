import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';

type Language = 'zh' | 'en' | 'de' | 'fr';

interface PortalLink {
  code: string;
  title: string;
  description: string;
  slug: string;
}

interface PortalCopy {
  startEyebrow: string;
  startTitle: string;
  startDescription: string;
  openLabel: string;
  starts: [PortalLink, PortalLink, PortalLink, PortalLink];
  mapEyebrow: string;
  mapTitle: string;
  mapDescription: string;
  mapAriaLabel: string;
  definitionLabel: string;
  definition: [PortalLink, PortalLink, PortalLink];
  operationLabel: string;
  operation: [PortalLink, PortalLink, PortalLink, PortalLink];
  schemaEyebrow: string;
  schemaTitle: string;
  schemaDescription: string;
  schemas: [PortalLink, PortalLink, PortalLink, PortalLink];
}

const copy: Record<Language, PortalCopy> = {
  zh: {
    startEyebrow: '推荐入口',
    startTitle: '先确认你要理解或执行什么',
    startDescription: 'TIDAS 是数据系统，不只是一组 Schema。先选系统、结构、校验或集成，再进入对应规范。',
    openLabel: '打开文档',
    starts: [
      { code: 'SYSTEM', title: '理解 TIDAS 系统', description: '了解方法论、数据结构、数据资源以及系统边界。', slug: 'intro' },
      { code: 'SCHEMA', title: '认识数据结构', description: '理解 JSON Schema 如何描述字段、约束与引用关系。', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'VALIDATE', title: '校验 TIDAS 数据', description: '查看 Schema 校验规则、工具入口和错误处理方式。', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'CONNECT', title: '接入现有系统', description: '浏览权限、隐私计算、区块链与 AI 集成方案。', slug: 'integration' },
    ],
    mapEyebrow: '系统导航',
    mapTitle: '从定义层进入，再选择执行能力',
    mapDescription: '上层回答“数据是什么”，下层回答“数据如何被使用”。所有模块均直接连接到当前文档。',
    mapAriaLabel: 'TIDAS 文档系统地图：方法与边界、数据结构、分类与参考，以及校验、工具、集成和案例。',
    definitionLabel: '定义层 · 统一语义与约束',
    definition: [
      { code: 'METHOD', title: '方法与边界', description: '系统组成和适用范围', slug: 'intro' },
      { code: 'FORMAT', title: '数据结构', description: 'JSON Schema 规范', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'REFERENCE', title: '分类与参考', description: '流与分类体系示例', slug: 'core-modules/schema/schema-content/json-schema-flows' },
    ],
    operationLabel: '执行层 · 在真实系统中使用数据',
    operation: [
      { code: 'CHECK', title: '校验规则', description: '验证结构和约束', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'TOOL', title: '命令行工具', description: '转换与自动化', slug: 'tool/tidas-tool-intro' },
      { code: 'INTEGRATE', title: '集成方案', description: '可信互操作', slug: 'integration' },
      { code: 'CASES', title: '实践案例', description: '真实场景落地', slug: 'use-case' },
    ],
    schemaEyebrow: '结构参考',
    schemaTitle: '直接查看代表性 Schema',
    schemaDescription: '从常用数据集进入结构表，查看字段、必填项、引用和语义化联合类型。',
    schemas: [
      { code: 'PROCESS', title: '过程数据集', description: '建模信息、交换与 LCIA 结果', slug: 'core-modules/schema/schema-content/json-schema-processes' },
      { code: 'FLOW', title: '流数据集', description: '流属性、分类与定量信息', slug: 'core-modules/schema/schema-content/json-schema-flows' },
      { code: 'LCIA', title: 'LCIA 方法', description: '影响类别、因子与引用', slug: 'core-modules/schema/schema-content/json-schema-lciamethods' },
      { code: 'COMMON', title: '通用数据类型', description: '跨 Schema 复用的基础定义', slug: 'core-modules/schema/schema-content/json-schema-datatype' },
    ],
  },
  en: {
    startEyebrow: 'Recommended entry points',
    startTitle: 'Start with what you need to understand or do',
    startDescription: 'TIDAS is a data system, not only a set of Schemas. Choose system, structure, validation, or integration before opening the specification.',
    openLabel: 'Open documentation',
    starts: [
      { code: 'SYSTEM', title: 'Understand the TIDAS system', description: 'Learn its methodology, data structures, data resources, and system boundary.', slug: 'intro' },
      { code: 'SCHEMA', title: 'Understand the data structure', description: 'See how JSON Schema describes fields, constraints, and references.', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'VALIDATE', title: 'Validate TIDAS data', description: 'Review Schema validation rules, tool entry points, and error handling.', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'CONNECT', title: 'Connect an existing system', description: 'Browse permission, privacy computing, blockchain, and AI integrations.', slug: 'integration' },
    ],
    mapEyebrow: 'System navigation',
    mapTitle: 'Enter through a definition layer, then choose an operational capability',
    mapDescription: 'The upper layer answers what the data means; the lower layer shows how it is used. Every module links to current documentation.',
    mapAriaLabel: 'TIDAS documentation system map: methods and boundaries, data structures, classifications and references, plus validation, tools, integrations, and cases.',
    definitionLabel: 'Definition layer · shared semantics and constraints',
    definition: [
      { code: 'METHOD', title: 'Methods and boundaries', description: 'System composition and scope', slug: 'intro' },
      { code: 'FORMAT', title: 'Data structures', description: 'JSON Schema specification', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'REFERENCE', title: 'Classifications and references', description: 'Flow and taxonomy example', slug: 'core-modules/schema/schema-content/json-schema-flows' },
    ],
    operationLabel: 'Operational layer · use data in real systems',
    operation: [
      { code: 'CHECK', title: 'Validation rules', description: 'Verify structures and constraints', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'TOOL', title: 'Command-line tools', description: 'Convert and automate', slug: 'tool/tidas-tool-intro' },
      { code: 'INTEGRATE', title: 'Integrations', description: 'Trusted interoperability', slug: 'integration' },
      { code: 'CASES', title: 'Use cases', description: 'Real-world applications', slug: 'use-case' },
    ],
    schemaEyebrow: 'Structure reference',
    schemaTitle: 'Open a representative Schema directly',
    schemaDescription: 'Start from common datasets and inspect fields, required items, references, and semantic union types.',
    schemas: [
      { code: 'PROCESS', title: 'Process dataset', description: 'Modelling information, exchanges, and LCIA results', slug: 'core-modules/schema/schema-content/json-schema-processes' },
      { code: 'FLOW', title: 'Flow dataset', description: 'Flow properties, classifications, and quantities', slug: 'core-modules/schema/schema-content/json-schema-flows' },
      { code: 'LCIA', title: 'LCIA methods', description: 'Impact categories, factors, and references', slug: 'core-modules/schema/schema-content/json-schema-lciamethods' },
      { code: 'COMMON', title: 'Common data types', description: 'Definitions reused across Schemas', slug: 'core-modules/schema/schema-content/json-schema-datatype' },
    ],
  },
  de: {
    startEyebrow: 'Empfohlene Einstiege',
    startTitle: 'Beginnen Sie mit dem, was Sie verstehen oder ausführen möchten',
    startDescription: 'TIDAS ist ein Datensystem und nicht nur eine Sammlung von Schemas. Wählen Sie System, Struktur, Prüfung oder Integration.',
    openLabel: 'Dokumentation öffnen',
    starts: [
      { code: 'SYSTEM', title: 'Das TIDAS-System verstehen', description: 'Methodik, Datenstrukturen, Datenressourcen und Systemgrenzen kennenlernen.', slug: 'intro' },
      { code: 'SCHEMA', title: 'Die Datenstruktur verstehen', description: 'Nachvollziehen, wie JSON Schema Felder, Regeln und Referenzen beschreibt.', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'VALIDATE', title: 'TIDAS-Daten prüfen', description: 'Schema-Regeln, Werkzeugeinstiege und Fehlerbehandlung ansehen.', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'CONNECT', title: 'Bestehende Systeme anbinden', description: 'Berechtigungs-, Privacy-Computing-, Blockchain- und KI-Integrationen erkunden.', slug: 'integration' },
    ],
    mapEyebrow: 'Systemnavigation',
    mapTitle: 'Über die Definition einsteigen und dann eine Ausführungsfunktion wählen',
    mapDescription: 'Die obere Ebene erklärt die Bedeutung der Daten, die untere ihre Verwendung. Jedes Modul führt zur aktuellen Dokumentation.',
    mapAriaLabel: 'TIDAS-Dokumentationskarte: Methoden und Grenzen, Datenstrukturen, Klassifikationen und Referenzen sowie Prüfung, Werkzeuge, Integrationen und Fälle.',
    definitionLabel: 'Definitionsebene · gemeinsame Semantik und Regeln',
    definition: [
      { code: 'METHOD', title: 'Methoden und Grenzen', description: 'Systemaufbau und Geltungsbereich', slug: 'intro' },
      { code: 'FORMAT', title: 'Datenstrukturen', description: 'JSON-Schema-Spezifikation', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'REFERENCE', title: 'Klassifikationen und Referenzen', description: 'Beispiel für Flüsse und Taxonomien', slug: 'core-modules/schema/schema-content/json-schema-flows' },
    ],
    operationLabel: 'Ausführungsebene · Daten in realen Systemen verwenden',
    operation: [
      { code: 'CHECK', title: 'Prüfregeln', description: 'Strukturen und Regeln prüfen', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'TOOL', title: 'Kommandozeilenwerkzeuge', description: 'Konvertieren und automatisieren', slug: 'tool/tidas-tool-intro' },
      { code: 'INTEGRATE', title: 'Integrationen', description: 'Vertrauenswürdiger Austausch', slug: 'integration' },
      { code: 'CASES', title: 'Anwendungsfälle', description: 'Einsatz in der Praxis', slug: 'use-case' },
    ],
    schemaEyebrow: 'Strukturreferenz',
    schemaTitle: 'Repräsentative Schemas direkt öffnen',
    schemaDescription: 'Beginnen Sie mit häufigen Datensätzen und prüfen Sie Felder, Pflichtangaben, Referenzen und semantische Union-Typen.',
    schemas: [
      { code: 'PROCESS', title: 'Prozessdatensatz', description: 'Modellierung, Austausche und LCIA-Ergebnisse', slug: 'core-modules/schema/schema-content/json-schema-processes' },
      { code: 'FLOW', title: 'Flussdatensatz', description: 'Flusseigenschaften, Klassifikationen und Mengen', slug: 'core-modules/schema/schema-content/json-schema-flows' },
      { code: 'LCIA', title: 'LCIA-Methoden', description: 'Wirkungskategorien, Faktoren und Referenzen', slug: 'core-modules/schema/schema-content/json-schema-lciamethods' },
      { code: 'COMMON', title: 'Gemeinsame Datentypen', description: 'Schemaübergreifend verwendete Definitionen', slug: 'core-modules/schema/schema-content/json-schema-datatype' },
    ],
  },
  fr: {
    startEyebrow: 'Entrées recommandées',
    startTitle: 'Commencez par ce que vous devez comprendre ou réaliser',
    startDescription: 'TIDAS est un système de données, pas seulement un ensemble de schémas. Choisissez système, structure, validation ou intégration.',
    openLabel: 'Ouvrir la documentation',
    starts: [
      { code: 'SYSTEM', title: 'Comprendre le système TIDAS', description: 'Découvrez sa méthodologie, ses structures, ses ressources et son périmètre.', slug: 'intro' },
      { code: 'SCHEMA', title: 'Comprendre la structure de données', description: 'Voyez comment JSON Schema décrit les champs, contraintes et références.', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'VALIDATE', title: 'Valider des données TIDAS', description: 'Consultez les règles de validation, les outils et le traitement des erreurs.', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'CONNECT', title: 'Connecter un système existant', description: 'Explorez les intégrations de permissions, calcul confidentiel, blockchain et IA.', slug: 'integration' },
    ],
    mapEyebrow: 'Navigation du système',
    mapTitle: 'Entrez par une couche de définition, puis choisissez une capacité opérationnelle',
    mapDescription: 'La couche supérieure explique le sens des données ; la couche inférieure montre leur usage. Chaque module mène à la documentation actuelle.',
    mapAriaLabel: 'Carte documentaire TIDAS : méthodes et périmètre, structures, classifications et références, puis validation, outils, intégrations et cas.',
    definitionLabel: 'Couche de définition · sémantique et contraintes communes',
    definition: [
      { code: 'METHOD', title: 'Méthodes et périmètre', description: 'Composition et champ du système', slug: 'intro' },
      { code: 'FORMAT', title: 'Structures de données', description: 'Spécification JSON Schema', slug: 'core-modules/schema/tidas-schema-intro' },
      { code: 'REFERENCE', title: 'Classifications et références', description: 'Exemple de flux et taxonomies', slug: 'core-modules/schema/schema-content/json-schema-flows' },
    ],
    operationLabel: 'Couche opérationnelle · utiliser les données dans les systèmes',
    operation: [
      { code: 'CHECK', title: 'Règles de validation', description: 'Vérifier structures et contraintes', slug: 'core-modules/schema/tidas-schema-validation' },
      { code: 'TOOL', title: 'Outils en ligne de commande', description: 'Convertir et automatiser', slug: 'tool/tidas-tool-intro' },
      { code: 'INTEGRATE', title: 'Intégrations', description: 'Interopérabilité de confiance', slug: 'integration' },
      { code: 'CASES', title: 'Cas d’usage', description: 'Applications concrètes', slug: 'use-case' },
    ],
    schemaEyebrow: 'Référence de structure',
    schemaTitle: 'Ouvrir directement un schéma représentatif',
    schemaDescription: 'Partez des jeux de données courants et examinez champs, éléments requis, références et types union sémantiques.',
    schemas: [
      { code: 'PROCESS', title: 'Jeu de données de procédé', description: 'Modélisation, échanges et résultats d’ACVI', slug: 'core-modules/schema/schema-content/json-schema-processes' },
      { code: 'FLOW', title: 'Jeu de données de flux', description: 'Propriétés, classifications et quantités', slug: 'core-modules/schema/schema-content/json-schema-flows' },
      { code: 'LCIA', title: 'Méthodes d’ACVI', description: 'Catégories d’impact, facteurs et références', slug: 'core-modules/schema/schema-content/json-schema-lciamethods' },
      { code: 'COMMON', title: 'Types de données communs', description: 'Définitions réutilisées entre schémas', slug: 'core-modules/schema/schema-content/json-schema-datatype' },
    ],
  },
};

function Arrow() {
  return (
    <svg aria-hidden="true" height="16" viewBox="0 0 20 20" width="16">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function routeHref(language: Language, slug: string) {
  return `/${language}/docs/${slug}/`;
}

function MapLink({ item, language }: { item: PortalLink; language: Language }) {
  return (
    <Link className="group grid min-h-32 content-between gap-5 bg-fd-background p-4 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent" href={routeHref(language, item.slug)}>
      <span className="flex items-center justify-between gap-2 text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">
        {item.code}
        <Arrow />
      </span>
      <span className="grid gap-1">
        <strong className="text-sm leading-snug font-semibold">{item.title}</strong>
        <span className="text-xs leading-5 text-fd-muted-foreground">{item.description}</span>
      </span>
    </Link>
  );
}

export function DocsPortal({ lang }: { lang: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];

  return (
    <div className="not-prose mt-8 grid gap-12 pb-3" data-docs-portal="tidas-system-hub">
      <section aria-labelledby="docs-portal-start">
        <div className="mb-5 grid max-w-[42rem] gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.startEyebrow}</p>
          <h2 className="m-0 text-2xl leading-tight font-semibold tracking-[-0.025em]" id="docs-portal-start">{content.startTitle}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.startDescription}</p>
        </div>
        <Cards className="grid-cols-2 gap-3 max-[40rem]:grid-cols-1">
          {content.starts.map((item) => (
            <Card
              className="grid min-h-44 content-start gap-3 rounded-[2px] border-fd-border bg-fd-card p-4 text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent [&>div:last-child]:self-end [&_h3]:m-0 [&_h3]:text-base [&_h3]:leading-snug [&_h3]:font-semibold [&_p]:m-0! [&_p]:text-sm [&_p]:leading-6 [&_p]:text-fd-muted-foreground"
              description={item.description}
              href={routeHref(language, item.slug)}
              key={item.slug}
              title={item.title}
            >
              <span className="inline-flex items-center justify-between gap-3 text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">
                {item.code}
                <span className="inline-flex items-center gap-1 font-medium tracking-normal normal-case">
                  {content.openLabel}
                  <Arrow />
                </span>
              </span>
            </Card>
          ))}
        </Cards>
      </section>

      <section aria-labelledby="docs-portal-map" className="rounded-[2px] border border-fd-border bg-fd-muted/30 p-5 max-[40rem]:p-4" data-docs-portal-map="tidas-system-matrix">
        <div className="mb-5 grid max-w-[42rem] gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.mapEyebrow}</p>
          <h2 className="m-0 text-xl leading-tight font-semibold tracking-[-0.02em]" id="docs-portal-map">{content.mapTitle}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.mapDescription}</p>
        </div>
        <div aria-label={content.mapAriaLabel} className="grid gap-4" role="group">
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold text-fd-muted-foreground">{content.definitionLabel}</p>
            <div className="grid grid-cols-3 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[46rem]:grid-cols-1">
              {content.definition.map((item) => <MapLink item={item} key={item.slug} language={language} />)}
            </div>
          </div>
          <div aria-hidden="true" className="mx-auto h-5 w-[2px] bg-fd-primary" />
          <div className="grid gap-2">
            <p className="m-0 text-xs font-semibold text-fd-muted-foreground">{content.operationLabel}</p>
            <div className="grid grid-cols-4 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[52rem]:grid-cols-2 max-[32rem]:grid-cols-1">
              {content.operation.map((item) => <MapLink item={item} key={item.slug} language={language} />)}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="docs-portal-schema">
        <div className="mb-5 grid max-w-[42rem] gap-2">
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-fd-primary uppercase">{content.schemaEyebrow}</p>
          <h2 className="m-0 text-xl leading-tight font-semibold tracking-[-0.02em]" id="docs-portal-schema">{content.schemaTitle}</h2>
          <p className="m-0 text-sm leading-6 text-fd-muted-foreground">{content.schemaDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-[2px] overflow-hidden rounded-[2px] border-2 border-fd-border bg-fd-border max-[40rem]:grid-cols-1">
          {content.schemas.map((item) => (
            <Link className="group grid min-h-28 content-between gap-4 bg-fd-background p-4 text-fd-foreground no-underline transition-colors duration-100 hover:bg-fd-accent" href={routeHref(language, item.slug)} key={item.slug}>
              <span className="flex items-center justify-between gap-3 text-xs font-semibold tracking-[0.05em] text-fd-primary uppercase">
                {item.code}
                <Arrow />
              </span>
              <span className="grid gap-1">
                <strong className="text-sm font-semibold">{item.title}</strong>
                <span className="text-xs leading-5 text-fd-muted-foreground">{item.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
