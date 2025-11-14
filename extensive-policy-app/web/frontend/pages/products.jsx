import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import ProductionList from "../components/common/ProductionList";
import { ProductsCard } from "../components/ProductsCard";

export default function PageName() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title={t("Products.title")}>
        {/* <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("Products.primaryAction")}
        </button>
        <button onClick={() => console.log("Secondary action")}>
          {t("Products.secondaryAction")}
        </button> */}
      </TitleBar>
      <Layout>
        <Layout.Section secondary>
          <ProductsCard />
        </Layout.Section>
        <Layout.Section>
          <Card>
            <ProductionList />
          </Card>
          {/* <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("PageName.heading")}
            </Text>
            <TextContainer>
              <p>{t("PageName.body")}</p>
            </TextContainer>
          </Card>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("PageName.heading")}
            </Text>
            <TextContainer>
              <p>{t("PageName.body")}</p>
            </TextContainer>
          </Card> */}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
