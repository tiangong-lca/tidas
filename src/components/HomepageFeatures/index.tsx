import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'User-Friendly Interface',
    Img: require('./img/1.png').default,
    description: (
      <>
        TianGong LCA is built with an intuitive interface, allowing you to easily input and manage your LCA data, getting your environmental impact assessments up and running with minimal effort.
      </>
    ),
  },
  {
    title: 'Focus on Your Analysis',
    Img: require('./img/2.png').default,
    description: (
      <>
        TianGong LCA enables you to concentrate on your LCA projects, while the platform handles data organization and standardization. Simply upload your data, and start analyzing.
      </>
    ),
  },
  {
    title: 'Compliance with Standards',
    Img: require('./img/3.png').default,
    description: (
      <>
        Leverage TianGong LCA's integration with global LCA standards like ISO and ILCD, ensuring your data is consistent, accurate, and ready for comprehensive assessments.
      </>
    ),
  },
];

function Feature({title, Img, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Img} alt={title} className={styles.featureSvg} role="img" /> {/* 使用 img 标签直接引入图片路径 */}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
