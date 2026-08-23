import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

const hero: Record<string, { title: string; description: string; cta: string; ecosystemTitle: string; ecosystemDescription: string }> = {
  zh: {
    title: '天工LCA数据系统（TIDAS）',
    description: '全球数据共享 LCA数据格式无损转换',
    cta: '⏱️ 一分钟了解TIDAS',
    ecosystemTitle: 'TIDAS 数据生态',
    ecosystemDescription:
      'TIDAS 数据生态致力于推动碳足迹数据的标准化和共享，通过创新的数据转换技术，实现不同LCA系统间的无缝对接，促进全球碳足迹数据的互联互通。',
  },
  en: {
    title: 'TianGong LCA Data System (TIDAS)',
    description: 'Global Sharing, Lossless LCA Data Conversion',
    cta: '⏱️ Learn TIDAS in 1 Minute',
    ecosystemTitle: 'TIDAS Data Ecosystem',
    ecosystemDescription:
      'The TIDAS Data Ecosystem promotes the standardization and sharing of carbon footprint data. Through innovative data conversion technology, it enables seamless interconnection between LCA systems and advances global carbon footprint data interoperability.',
  },
  de: {
    title: 'TianGong LCA Datensystem (TIDAS)',
    description: 'Globale gemeinsame Nutzung, verlustfreie Konvertierung von LCA-Daten',
    cta: '⏱️ TIDAS in 1 Minute kennenlernen',
    ecosystemTitle: 'TIDAS-Datenökosystem',
    ecosystemDescription:
      'Das TIDAS-Datenökosystem fördert die Standardisierung und gemeinsame Nutzung von CO₂-Fußabdruckdaten. Durch innovative Datenkonvertierungstechnologie ermöglicht es die nahtlose Verbindung zwischen LCA-Systemen und treibt die globale Interoperabilität von CO₂-Fußabdruckdaten voran.',
  },
  fr: {
    title: "Système de données TianGong LCA (TIDAS)",
    description: "Partage mondial, conversion sans perte des données d'ACV",
    cta: '⏱️ Découvrir TIDAS en 1 minute',
    ecosystemTitle: 'Écosystème de données TIDAS',
    ecosystemDescription:
      "L'écosystème de données TIDAS promeut la standardisation et le partage des données d'empreinte carbone. Grâce à une technologie innovante de conversion de données, il permet une interconnexion sans rupture entre les systèmes d'ACV et fait avancer l'interopérabilité mondiale des données d'empreinte carbone.",
  },
};

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const c = hero[lang] ?? hero.en;

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="container flex flex-1 flex-col items-center gap-14 py-20 text-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight">{c.title}</h1>
          <p className="mt-3 text-lg text-fd-muted-foreground">{c.description}</p>
          <Link
            href={`/${lang}/docs/intro/`}
            className="mt-6 inline-block rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            {c.cta}
          </Link>
        </div>

        <section className="w-full">
          <h2 className="text-2xl font-bold">{c.ecosystemTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-fd-muted-foreground">
            {c.ecosystemDescription}
          </p>
        </section>
      </div>
    </HomeLayout>
  );
}
