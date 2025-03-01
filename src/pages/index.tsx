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
            促进产业协同，推动技术创新，支撑国家战略
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            <Translate id="homepage.button1">开放知识中心</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://lca.tiangong.earth"
          >
            <Translate id="homepage.button2">天工 LCA 数据平台</Translate>
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
        message: "web-title",
        description: "The title of the website",
      })}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className={styles.customBackground}>
        <div className={styles.customBackgroundSection1}>
          <div className="container">
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-chair-unit">
                理事长单位
              </Translate>
            </p>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-vice-chair-unit">
                副理事长单位
              </Translate>
            </p>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-member-unit">
                会员单位
              </Translate>
            </p>
          </div>
        </div>
        <div className={styles.customBackgroundSection2}>
          <div className="container">
          <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-chair">理事长</Translate>
            </p>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-vice-chair">副理事长</Translate>
            </p>
          </div>
        </div>
        <div className={styles.customBackgroundSection3}>
          <div className="container">
          <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-secretariat">秘书处</Translate>
            </p>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-secretariat-general">
                秘书长
              </Translate>
            </p>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.sub-title-vice-secretariat-general">
                副秘书长
              </Translate>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
