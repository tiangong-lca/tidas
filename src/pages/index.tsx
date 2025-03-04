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
          <Translate id="homepage.title">碳足迹产业技术创新联盟</Translate>
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
        <div className={styles.customBackgroundSection1}>
          <div className="container">
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.section1">
                内容待补充
              </Translate>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
