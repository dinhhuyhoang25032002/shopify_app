import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  BlockStack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard, RoleTable } from "../components";


export default function RulePage() {
  const { t } = useTranslation();

  return (
    <Page >
      <TitleBar title={t("HomePage.title")} />
      <Layout>
        <Layout.Section>
          <RoleTable />
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}