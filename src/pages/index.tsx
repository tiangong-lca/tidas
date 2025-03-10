import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="homepage.title">天工LCA数据系统</Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">
          全球数据共享 LCA数据格式无损转换
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            <Translate id="homepage.button1">⏱️ 一分钟了解TIDAS</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={translate({
        message: "TIDAS",
        description: "The title of the website",
      })}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className={styles.customBackground}>
        <div className={styles.ecosystemSection}>
          <div className={styles.ecosystemContent}>
            <h2 className={styles.ecosystemTitle}>
              <Translate id="homepage.ecosystem">TIDAS 数据生态</Translate>
            </h2>
            <p className={styles.ecosystemDescription}>
              <Translate id="homepage.ecosystem.description">
                TIDAS 数据生态致力于推动碳足迹数据的标准化和共享，通过创新的数据转换技术，
                实现不同LCA系统间的无缝对接，促进全球碳足迹数据的互联互通。
              </Translate>
            </p>
          </div>
        </div>

        <div className={styles.partnersSection}>
          <div className="container">
            <h2 className={styles.ecosystemTitle}>
              <Translate id="homepage.partners">合作伙伴</Translate>
            </h2>
            <div className={styles.partnersGrid}>
              {[1, 2, 3].map((num) => (
                <img
                  key={num}
                  src={`/img/partners/partner${num}.png`}
                  data-src-dark={`/img/partners/partner${num}-dark.png`}
                  alt={`Partner ${num}`}
                  className={styles.partnerLogo}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    const updateImage = () => {
                      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                      img.src = isDark 
                        ? img.dataset.srcDark || img.src
                        : img.src.replace('-dark', '');
                    };
                    
                    // Initial update
                    updateImage();
                    
                    // Setup theme change listener
                    const observer = new MutationObserver(updateImage);
                    observer.observe(document.documentElement, {
                      attributes: true,
                      attributeFilter: ['data-theme']
                    });
                    
                    // Cleanup observer when component unmounts
                    const cleanup = () => {
                      observer.disconnect();
                      img.removeEventListener('unload', cleanup);
                    };
                    img.addEventListener('unload', cleanup);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
