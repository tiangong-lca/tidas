import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

type Language = 'zh' | 'en' | 'de' | 'fr';

interface HomeCopy {
  eyebrow: string;
  title: string;
  description: string;
  primary: string;
  secondary: string;
  mapLabel: string;
  mapNodes: [string, string, string, string];
  pathsEyebrow: string;
  pathsTitle: string;
  pathsDescription: string;
  paths: Array<{ title: string; description: string; slug: string; label: string; accent: string }>;
  closingTitle: string;
  closingDescription: string;
  closingAction: string;
}

const copy: Record<Language, HomeCopy> = {
  zh: {
    eyebrow: 'TianGong Data Atlas · 开放的 LCA 数据契约',
    title: '让生命周期数据可以验证、转换与共享',
    description:
      'TIDAS 以 JSON Schema 描述 LCA 数据，保留 ILCD 语义，并为现代数据空间、自动化工具与可信协作提供统一接口。',
    primary: '开始了解 TIDAS',
    secondary: '浏览数据结构',
    mapLabel: 'TIDAS 数据从定义、验证、转换到共享的循环',
    mapNodes: ['定义', '验证', '转换', '共享'],
    pathsEyebrow: '按任务探索',
    pathsTitle: '从你现在要解决的数据问题开始',
    pathsDescription: '先选择目标，再逐步进入规范细节；每条路径都指向可验证的结果。',
    paths: [
      { title: '理解数据契约', description: '了解 TIDAS 的定位、核心模块与 ILCD 语义边界。', slug: 'intro', label: '01 · INTRO', accent: 'plum' },
      { title: '浏览 JSON Schema', description: '按数据集与分类体系探索字段、约束和引用关系。', slug: 'core-modules/schema/schema-content/json-schema-flows', label: '02 · SCHEMA', accent: 'violet' },
      { title: '校验数据', description: '使用统一 CLI 产生稳定、可自动化处理的校验结果。', slug: 'core-modules/schema/tidas-schema-validation', label: '03 · VALIDATE', accent: 'amber' },
      { title: '连接你的工具', description: '使用 TIDAS CLI、MCP 与集成方案接入数据能力。', slug: 'tool/tidas-tool-intro', label: '04 · INTEGRATE', accent: 'plum' },
    ],
    closingTitle: '只想走最短路径？',
    closingDescription: '先用一分钟理解 TIDAS，再进入 Schema 浏览器查看真实的数据约束。',
    closingAction: '阅读简介',
  },
  en: {
    eyebrow: 'TianGong Data Atlas · An open contract for LCA data',
    title: 'Make life cycle data verifiable, convertible, and shareable',
    description:
      'TIDAS describes LCA data with JSON Schema, preserves ILCD semantics, and provides a common interface for data spaces, automation, and trusted collaboration.',
    primary: 'Understand TIDAS',
    secondary: 'Explore the schema',
    mapLabel: 'The TIDAS data cycle from definition and validation to conversion and sharing',
    mapNodes: ['Define', 'Validate', 'Convert', 'Share'],
    pathsEyebrow: 'Explore by task',
    pathsTitle: 'Start with the data problem in front of you',
    pathsDescription: 'Choose an outcome first, then move into the specification detail with a verifiable result in view.',
    paths: [
      { title: 'Understand the contract', description: 'Learn the purpose, core modules, and ILCD semantic boundary of TIDAS.', slug: 'intro', label: '01 · INTRO', accent: 'plum' },
      { title: 'Explore JSON Schema', description: 'Inspect fields, constraints, and references by dataset and taxonomy.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: '02 · SCHEMA', accent: 'violet' },
      { title: 'Validate data', description: 'Use the unified CLI to produce stable, automation-ready validation evidence.', slug: 'core-modules/schema/tidas-schema-validation', label: '03 · VALIDATE', accent: 'amber' },
      { title: 'Connect your tools', description: 'Integrate data capabilities through the TIDAS CLI, MCP, and guides.', slug: 'tool/tidas-tool-intro', label: '04 · INTEGRATE', accent: 'plum' },
    ],
    closingTitle: 'Looking for the shortest path?',
    closingDescription: 'Learn the purpose of TIDAS first, then inspect real constraints in the schema explorer.',
    closingAction: 'Read the introduction',
  },
  de: {
    eyebrow: 'TianGong Data Atlas · Ein offener Vertrag für Ökobilanzdaten',
    title: 'Lebenszyklusdaten prüfbar, konvertierbar und teilbar machen',
    description:
      'TIDAS beschreibt Ökobilanzdaten mit JSON Schema, bewahrt die ILCD-Semantik und bietet eine gemeinsame Schnittstelle für Datenräume, Automatisierung und vertrauensvolle Zusammenarbeit.',
    primary: 'TIDAS verstehen',
    secondary: 'Schema erkunden',
    mapLabel: 'Der TIDAS-Datenkreislauf von Definition und Prüfung bis Konvertierung und Austausch',
    mapNodes: ['Definieren', 'Prüfen', 'Konvertieren', 'Teilen'],
    pathsEyebrow: 'Nach Aufgabe erkunden',
    pathsTitle: 'Beginnen Sie mit Ihrem aktuellen Datenproblem',
    pathsDescription: 'Wählen Sie zuerst das Ziel und gehen Sie dann mit einem prüfbaren Ergebnis vor Augen in die Details der Spezifikation.',
    paths: [
      { title: 'Datenvertrag verstehen', description: 'Zweck, Kernmodule und die ILCD-Semantikgrenze von TIDAS kennenlernen.', slug: 'intro', label: '01 · INTRO', accent: 'plum' },
      { title: 'JSON Schema erkunden', description: 'Felder, Einschränkungen und Referenzen nach Datensatz und Taxonomie prüfen.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: '02 · SCHEMA', accent: 'violet' },
      { title: 'Daten validieren', description: 'Mit der einheitlichen CLI stabile, automatisierbare Prüfnachweise erzeugen.', slug: 'core-modules/schema/tidas-schema-validation', label: '03 · VALIDATE', accent: 'amber' },
      { title: 'Werkzeuge anbinden', description: 'Datenfunktionen über TIDAS CLI, MCP und Integrationsleitfäden verbinden.', slug: 'tool/tidas-tool-intro', label: '04 · INTEGRATE', accent: 'plum' },
    ],
    closingTitle: 'Sie suchen den kürzesten Weg?',
    closingDescription: 'Verstehen Sie zuerst TIDAS und untersuchen Sie danach echte Regeln im Schema-Explorer.',
    closingAction: 'Einführung lesen',
  },
  fr: {
    eyebrow: 'TianGong Data Atlas · Un contrat ouvert pour les données d’ACV',
    title: 'Rendre les données de cycle de vie vérifiables, convertibles et partageables',
    description:
      'TIDAS décrit les données d’ACV avec JSON Schema, préserve la sémantique ILCD et fournit une interface commune aux espaces de données, à l’automatisation et à la collaboration de confiance.',
    primary: 'Comprendre TIDAS',
    secondary: 'Explorer le schéma',
    mapLabel: 'Le cycle de données TIDAS, de la définition et la validation à la conversion et au partage',
    mapNodes: ['Définir', 'Valider', 'Convertir', 'Partager'],
    pathsEyebrow: 'Explorer par tâche',
    pathsTitle: 'Commencez par le problème de données à résoudre',
    pathsDescription: 'Choisissez d’abord le résultat, puis entrez dans le détail de la spécification en gardant un objectif vérifiable.',
    paths: [
      { title: 'Comprendre le contrat', description: 'Découvrez le rôle, les modules clés et la limite sémantique ILCD de TIDAS.', slug: 'intro', label: '01 · INTRO', accent: 'plum' },
      { title: 'Explorer JSON Schema', description: 'Examinez les champs, contraintes et références par jeu de données et taxonomie.', slug: 'core-modules/schema/schema-content/json-schema-flows', label: '02 · SCHEMA', accent: 'violet' },
      { title: 'Valider les données', description: 'Produisez avec la CLI unifiée des preuves stables, prêtes pour l’automatisation.', slug: 'core-modules/schema/tidas-schema-validation', label: '03 · VALIDATE', accent: 'amber' },
      { title: 'Connecter vos outils', description: 'Intégrez les capacités de données via la CLI TIDAS, MCP et les guides.', slug: 'tool/tidas-tool-intro', label: '04 · INTEGRATE', accent: 'plum' },
    ],
    closingTitle: 'Vous cherchez le chemin le plus court ?',
    closingDescription: 'Comprenez d’abord TIDAS, puis inspectez des contraintes réelles dans l’explorateur de schéma.',
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
      <main className="atlas-home">
        <section className="atlas-hero">
          <div className="atlas-shell atlas-hero-grid">
            <div className="atlas-hero-copy">
              <p className="atlas-eyebrow">{content.eyebrow}</p>
              <h1>{content.title}</h1>
              <p className="atlas-lede">{content.description}</p>
              <div className="atlas-actions">
                <Link className="atlas-button atlas-button-primary" href={`/${language}/docs/intro/`}>
                  {content.primary}
                  <Arrow />
                </Link>
                <Link className="atlas-button atlas-button-secondary" href={`/${language}/docs/core-modules/schema/schema-content/json-schema-flows/`}>
                  {content.secondary}
                </Link>
              </div>
            </div>

            <div className="atlas-map" role="img" aria-label={content.mapLabel}>
              <div className="atlas-map-grid" aria-hidden="true" />
              <div className="atlas-orbit atlas-orbit-one" aria-hidden="true" />
              <div className="atlas-orbit atlas-orbit-two" aria-hidden="true" />
              <div className="atlas-map-core" aria-hidden="true">
                <span>Data</span>
                <strong>Contract</strong>
              </div>
              {content.mapNodes.map((node, index) => (
                <div className={`atlas-map-node atlas-map-node-${index + 1}`} key={node} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {node}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="atlas-paths">
          <div className="atlas-shell">
            <div className="atlas-section-heading">
              <p className="atlas-eyebrow">{content.pathsEyebrow}</p>
              <h2>{content.pathsTitle}</h2>
              <p>{content.pathsDescription}</p>
            </div>
            <div className="atlas-path-grid">
              {content.paths.map((path) => (
                <Link className={`atlas-path-card atlas-accent-${path.accent}`} href={`/${language}/docs/${path.slug}/`} key={path.slug}>
                  <span className="atlas-card-kicker">{path.label}</span>
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                  <span className="atlas-card-arrow"><Arrow /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="atlas-closing">
          <div className="atlas-shell atlas-closing-card">
            <div>
              <h2>{content.closingTitle}</h2>
              <p>{content.closingDescription}</p>
            </div>
            <Link className="atlas-button atlas-button-primary" href={`/${language}/docs/intro/`}>
              {content.closingAction}
              <Arrow />
            </Link>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
