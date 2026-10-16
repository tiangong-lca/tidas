import styles from './data-relationships-diagram.module.css';

type Language = 'zh' | 'en' | 'de' | 'fr';
type Lines = string[];
type NodeCopy = { title: Lines; detail: Lines };
type Copy = {
  title: string;
  description: string;
  flow: NodeCopy;
  measure: Lines;
  existing: NodeCopy;
  result: NodeCopy;
  modelA: NodeCopy;
  modelB: NodeCopy;
  reference: Lines;
  compose: Lines;
  calculate: Lines;
  trace: Lines;
  reuse: Lines;
  legendReference: string;
  legendOperation: string;
  legendTrace: string;
  traceNote: string;
  supporting: string;
  sources: string;
  sourceDetail: string;
  contacts: string;
  contactDetail: string;
  boundary: string;
};

const copy: Record<Language, Copy> = {
  zh: {
    title: '模型、过程与流的关联',
    description: '过程引用流来描述交换。已有过程通过流连接组成模型甲；模型甲计算并保存结果过程；结果过程可用于模型乙，也可在来源信息保留时追溯模型甲。流属性和单位组提供计量依据。',
    flow: { title: ['流'], detail: ['交换对象与身份', '物质、能源、产品等'] },
    measure: ['流属性 → 单位组'],
    existing: { title: ['已有过程'], detail: ['明确版本的清单'] },
    result: { title: ['结果过程'], detail: ['模型计算得到的', '汇总清单'] },
    modelA: { title: ['模型甲'], detail: ['结构与计算目标'] },
    modelB: { title: ['模型乙'], detail: ['复用结果过程'] },
    reference: ['引用流'], compose: ['通过流连接'],
    calculate: ['计算并保存', '汇总清单'], trace: ['追溯来源模型'], reuse: ['作为过程再次使用'],
    legendReference: '流引用', legendOperation: '组成、生成与复用', legendTrace: '来源回溯',
    traceNote: '回溯需要保留来源模型及其关联信息；汇总清单本身不能还原模型结构。',
    supporting: '支撑资料，与数量交换分开理解',
    sources: '来源', sourceDetail: '文献、报告与证据',
    contacts: '联系人', contactDetail: '人员、机构与责任',
    boundary: '支撑资料按具体字段引用。计算与保存由使用 TIDAS 的软件实现，数据结构规范本身不执行这些操作。',
  },
  en: {
    title: 'Models, processes and flows are connected',
    description: 'Processes reference flows to describe exchanges. Existing processes form Model A through flow connections. Model A calculates and saves a result process, which can be reused in Model B and traced to Model A when its provenance is retained. Flow properties and unit groups provide measurement definitions.',
    flow: { title: ['Flow'], detail: ['Exchange identity', 'Products, materials, energy'] },
    measure: ['Flow property', '→ Unit group'],
    existing: { title: ['Existing', 'processes'], detail: ['Versioned inventories'] },
    result: { title: ['Result process'], detail: ['Calculated inventory'] },
    modelA: { title: ['Model A'], detail: ['Structure and', 'calculation target'] },
    modelB: { title: ['Model B'], detail: ['Reuse the result', 'process'] },
    reference: ['Reference', 'flow'], compose: ['Connect through', 'flows'],
    calculate: ['Calculate and save', 'the inventory'], trace: ['Trace the source', 'model'], reuse: ['Reuse in another', 'model'],
    legendReference: 'Flow reference', legendOperation: 'Composition, generation and reuse', legendTrace: 'Provenance trace',
    traceNote: 'Tracing requires the source model and its provenance links. An aggregate inventory alone cannot reconstruct the model structure.',
    supporting: 'Supporting records, distinct from quantity exchanges',
    sources: 'Sources', sourceDetail: 'Publications, reports and evidence',
    contacts: 'Contacts', contactDetail: 'People, organizations and responsibilities',
    boundary: 'Supporting records are referenced through their applicable fields. Software using TIDAS performs calculation and saving; the data structure specification does not execute these operations.',
  },
  de: {
    title: 'Modelle, Prozesse und Flüsse hängen zusammen',
    description: 'Prozesse referenzieren Flüsse zur Beschreibung von Austauschen. Vorhandene Prozesse bilden über Flussverbindungen Modell A. Modell A berechnet und speichert einen Ergebnisprozess. Dieser kann in Modell B weiterverwendet und bei erhaltener Herkunftsinformation auf Modell A zurückgeführt werden. Flusseigenschaften und Einheitengruppen definieren die Messgrundlage.',
    flow: { title: ['Fluss'], detail: ['Austauschobjekt', 'Identität und Messgrundlage'] },
    measure: ['Flusseigenschaft', '→ Einheitengruppe'],
    existing: { title: ['Vorhandene', 'Prozesse'], detail: ['Bestimmte Versionen'] },
    result: { title: ['Ergebnisprozess'], detail: ['Berechnete Bilanz'] },
    modelA: { title: ['Modell A'], detail: ['Struktur und', 'Berechnungsziel'] },
    modelB: { title: ['Modell B'], detail: ['Ergebnisprozess', 'weiterverwenden'] },
    reference: ['Flussreferenz'], compose: ['Über Flüsse', 'verbinden'],
    calculate: ['Berechnen und', 'Bilanz speichern'], trace: ['Zum Quellmodell', 'zurückverfolgen'], reuse: ['In anderem Modell', 'verwenden'],
    legendReference: 'Flussreferenz', legendOperation: 'Zusammensetzung, Erzeugung und Nutzung', legendTrace: 'Herkunft nachvollziehen',
    traceNote: 'Für die Rückverfolgung müssen Quellmodell und Herkunftsverknüpfungen erhalten bleiben. Eine aggregierte Bilanz allein stellt die Modellstruktur nicht wieder her.',
    supporting: 'Begleitdaten, getrennt von Mengenaustauschen',
    sources: 'Quellen', sourceDetail: 'Publikationen, Berichte und Belege',
    contacts: 'Kontakte', contactDetail: 'Personen, Organisationen und Verantwortung',
    boundary: 'Begleitdaten werden über die jeweiligen Felder referenziert. Berechnung und Speicherung übernimmt die TIDAS nutzende Software; die Datenstrukturspezifikation führt diese Vorgänge nicht aus.',
  },
  fr: {
    title: 'Modèles, processus et flux sont liés',
    description: 'Les processus référencent les flux pour décrire les échanges. Des processus existants forment le modèle A par des connexions de flux. Le modèle A calcule et enregistre un processus de résultat, réutilisable dans le modèle B et traçable au modèle A si sa provenance est conservée. Les propriétés de flux et groupes d’unités définissent les mesures.',
    flow: { title: ['Flux'], detail: ['Objet de l’échange', 'Identité et mesure'] },
    measure: ['Propriété de flux', '→ Groupe d’unités'],
    existing: { title: ['Processus', 'existants'], detail: ['Versions précises'] },
    result: { title: ['Processus', 'résultat'], detail: ['Inventaire calculé'] },
    modelA: { title: ['Modèle A'], detail: ['Structure et', 'cible du calcul'] },
    modelB: { title: ['Modèle B'], detail: ['Réutiliser le', 'processus résultat'] },
    reference: ['Référence', 'au flux'], compose: ['Relier par', 'les flux'],
    calculate: ['Calculer et enregistrer', 'la synthèse'], trace: ['Retrouver le', 'modèle source'], reuse: ['Réutiliser dans', 'un autre modèle'],
    legendReference: 'Référence au flux', legendOperation: 'Composition, génération et réutilisation', legendTrace: 'Traçabilité',
    traceNote: 'La traçabilité nécessite le modèle source et ses liens de provenance. Un inventaire agrégé seul ne permet pas de reconstruire la structure du modèle.',
    supporting: 'Données complémentaires, distinctes des échanges quantitatifs',
    sources: 'Sources', sourceDetail: 'Publications, rapports et preuves',
    contacts: 'Contacts', contactDetail: 'Personnes, organismes et responsabilités',
    boundary: 'Les données complémentaires sont référencées par les champs applicables. Le logiciel utilisant TIDAS effectue les calculs et les enregistrements ; la spécification des structures de données ne les exécute pas.',
  },
};

type Box = { x: number; y: number; width: number; height: number };
function TextLines({ lines, x, y, size, lineHeight, className }: {
  lines: Lines; x: number; y: number; size: number; lineHeight: number; className?: string;
}) {
  return <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={size} className={className}>
    {lines.map((line, index) => <tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>{line}</tspan>)}
  </text>;
}

function Node({ box, text, mobile, flow = false, model = false, flowMeasure }: { box: Box; text: NodeCopy; mobile: boolean; flow?: boolean; model?: boolean; flowMeasure?: Lines }) {
  const titleSize = mobile ? 16.5 : 19;
  const detailSize = mobile ? 13 : 14;
  const titleLine = mobile ? 20 : 24;
  const detailLine = mobile ? 16 : 18;
  const center = box.x + box.width / 2;
  const total = text.title.length * titleLine + 8 + text.detail.length * detailLine;
  const titleY = flowMeasure ? box.y + (mobile ? 25 : 34) : box.y + (box.height - total) / 2 + titleLine / 2;
  const detailY = titleY + (text.title.length - 1) * titleLine + titleLine / 2 + 8 + detailLine / 2;
  return <g className={flow ? styles.flowNode : model ? styles.modelNode : styles.coreNode} data-relationship-node="true">
    <rect {...box} rx="10" />
    <TextLines lines={text.title} x={center} y={titleY} size={titleSize} lineHeight={titleLine} className={styles.nodeTitle} />
    <TextLines lines={text.detail} x={center} y={detailY} size={detailSize} lineHeight={detailLine} className={styles.nodeDetail} />
    {flowMeasure && <>
      <line x1={box.x + 15} x2={box.x + box.width - 15} y1={box.y + box.height - 52} y2={box.y + box.height - 52} className={styles.measureDivider} />
      <TextLines lines={flowMeasure} x={center} y={box.y + box.height - (flowMeasure.length > 1 ? 34 : 25)} size={mobile ? 12 : 14} lineHeight={17} />
    </>}
  </g>;
}

function EdgeLabel({ box, lines, mobile, reference = false }: { box: Box; lines: Lines; mobile: boolean; reference?: boolean }) {
  const lineHeight = mobile ? 15 : 19;
  return <g className={reference ? styles.referenceLabel : styles.operationLabel} data-relationship-label="true">
    <TextLines lines={lines} x={box.x + box.width / 2} y={box.y + box.height / 2 - (lines.length - 1) * lineHeight / 2} size={mobile ? 12 : 14} lineHeight={lineHeight} />
  </g>;
}

function Network({ text, lang, mobile }: { text: Copy; lang: Language; mobile: boolean }) {
  const id = `relationship-${lang}-${mobile ? 'mobile' : 'desktop'}`;
  const boxes = mobile ? {
    flow: { x: 18, y: 282, width: 144, height: 130 },
    existing: { x: 18, y: 90, width: 144, height: 96 },
    modelA: { x: 198, y: 90, width: 144, height: 96 },
    result: { x: 18, y: 526, width: 144, height: 100 },
    modelB: { x: 198, y: 526, width: 144, height: 100 },
  } : {
    flow: { x: 24, y: 165, width: 190, height: 110 },
    existing: { x: 298, y: 20, width: 200, height: 100 },
    modelA: { x: 648, y: 20, width: 200, height: 100 },
    result: { x: 298, y: 300, width: 200, height: 100 },
    modelB: { x: 648, y: 300, width: 200, height: 100 },
  };
  const paths = mobile ? {
    referenceA: 'M90 186 V282',
    referenceR: 'M90 526 V412',
    compose: 'M140 90 V66 Q140 50 156 50 H254 Q270 50 270 66 V90',
    calculate: 'M214 186 C214 270 180 350 130 526',
    trace: 'M148 526 C148 456 326 416 326 186',
    reuse: 'M140 626 V654 Q140 670 156 670 H254 Q270 670 270 654 V626',
  } : {
    referenceA: 'M298 70 H267 Q255 70 255 82 V184 Q255 196 243 196 H214',
    referenceR: 'M298 350 H267 Q255 350 255 338 V256 Q255 244 243 244 H214',
    compose: 'M498 70 H648',
    calculate: 'M670 120 V150 Q670 174 646 174 H422 Q398 174 398 198 V300',
    trace: 'M472 300 V262 Q472 238 496 238 H798 Q822 238 822 214 V120',
    reuse: 'M498 350 H648',
  };
  const labels = mobile ? {
    referenceA: { x: 38, y: 214, width: 104, height: 40 },
    referenceR: { x: 38, y: 450, width: 104, height: 40 },
    compose: { x: 143, y: 30, width: 132, height: 40 },
    calculate: { x: 158, y: 270, width: 156, height: 48 },
    trace: { x: 198, y: 394, width: 132, height: 48 },
    reuse: { x: 138, y: 650, width: 144, height: 40 },
  } : {
    referenceA: { x: 203, y: 122, width: 104, height: 40 },
    referenceR: { x: 203, y: 265, width: 104, height: 40 },
    compose: { x: 508, y: 50, width: 130, height: 40 },
    calculate: { x: 444, y: 152, width: 180, height: 44 },
    trace: { x: 567, y: 216, width: 168, height: 44 },
    reuse: { x: 508, y: 330, width: 130, height: 40 },
  };
  return <svg className={mobile ? styles.mobile : styles.desktop} viewBox={mobile ? '0 0 360 710' : '0 0 876 430'} role="img" aria-label={text.description} data-network-layout={mobile ? 'mobile' : 'desktop'}>
    <title>{text.title}</title>
    <desc>{text.description}</desc>
    <defs>
      <marker id={`${id}-reference`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" className={styles.referenceArrow} /></marker>
      <marker id={`${id}-operation`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" className={styles.operationArrow} /></marker>
    </defs>
    <g className={styles.edges}>
      <path d={paths.referenceA} className={styles.referenceEdge} markerEnd={`url(#${id}-reference)`} data-relationship-edge="reference" />
      <path d={paths.referenceR} className={styles.referenceEdge} markerEnd={`url(#${id}-reference)`} data-relationship-edge="reference" />
      <path d={paths.compose} className={styles.operationEdge} markerEnd={`url(#${id}-operation)`} data-relationship-edge="composition" />
      <path d={paths.calculate} className={styles.operationEdge} markerEnd={`url(#${id}-operation)`} data-relationship-edge="generation" />
      <path d={paths.trace} className={styles.traceEdge} markerEnd={`url(#${id}-reference)`} data-relationship-edge="trace" />
      <path d={paths.reuse} className={styles.operationEdge} markerEnd={`url(#${id}-operation)`} data-relationship-edge="reuse" />
    </g>
    <Node box={boxes.flow} text={mobile ? { ...text.flow, detail: text.flow.detail.slice(0, 1) } : text.flow} mobile={mobile} flow flowMeasure={mobile ? text.measure : undefined} />
    {!mobile && <g className={styles.measurement}>
      <path d="M119 275v13" />
      <TextLines lines={text.measure} x={119} y={text.measure.length > 1 ? 306 : 314} size={13} lineHeight={17} />
    </g>}
    <Node box={boxes.existing} text={text.existing} mobile={mobile} />
    <Node box={boxes.modelA} text={text.modelA} mobile={mobile} model />
    <Node box={boxes.result} text={text.result} mobile={mobile} />
    <Node box={boxes.modelB} text={text.modelB} mobile={mobile} model />
    <EdgeLabel box={labels.referenceA} lines={text.reference} mobile={mobile} reference />
    <EdgeLabel box={labels.referenceR} lines={text.reference} mobile={mobile} reference />
    <EdgeLabel box={labels.compose} lines={text.compose} mobile={mobile} />
    <EdgeLabel box={labels.calculate} lines={text.calculate} mobile={mobile} />
    <EdgeLabel box={labels.trace} lines={text.trace} mobile={mobile} reference />
    <EdgeLabel box={labels.reuse} lines={text.reuse} mobile={mobile} />
  </svg>;
}

export function DataRelationshipsDiagram({ lang }: { lang: Language }) {
  const text = copy[lang];
  return <figure className={`${styles.figure} not-prose`} data-data-relationships-diagram={lang}>
    <figcaption className={styles.caption}>{text.title}</figcaption>
    <div className={styles.legend}>
      <span><i className={styles.legendReference} aria-hidden="true" />{text.legendReference}</span>
      <span><i className={styles.legendOperation} aria-hidden="true" />{text.legendOperation}</span>
      <span><i className={styles.legendTrace} aria-hidden="true" />{text.legendTrace}</span>
    </div>
    <Network text={text} lang={lang} mobile={false} />
    <Network text={text} lang={lang} mobile />
    <p className={styles.traceNote}>{text.traceNote}</p>
    <div className={styles.support}>
      <h3>{text.supporting}</h3>
      <dl>
        <div><dt>{text.sources}</dt><dd>{text.sourceDetail}</dd></div>
        <div><dt>{text.contacts}</dt><dd>{text.contactDetail}</dd></div>
      </dl>
      <p>{text.boundary}</p>
    </div>
  </figure>;
}
