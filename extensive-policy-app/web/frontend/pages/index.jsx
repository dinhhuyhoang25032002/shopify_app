import {
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import ShopInfor from "../components/common/ShopInfor";
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Page >
      <TitleBar title={t("HomePage.title")} />
      <Layout >
        <Layout.Section>
          <ShopInfor />
        </Layout.Section>
        {/* <Layout.Section>

        </Layout.Section> */}
      </Layout>
    </Page>
  );
}

/*
   <Card  sectioned>
            <BlockStack 
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <BlockStack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    {t("HomePage.heading")}
                  </Text>
                  <p>
                    <Trans
                      i18nKey="HomePage.yourAppIsReadyToExplore"
                      components={{
                        PolarisLink: (
                          <Link url="https://polaris.shopify.com/" external />
                        ),
                        AdminApiLink: (
                          <Link
                            url="https://shopify.dev/api/admin-graphql"
                            external
                          />
                        ),
                        AppBridgeLink: (
                          <Link
                            url="https://shopify.dev/apps/tools/app-bridge"
                            external
                          />
                        ),
                      }}
                    />
                  </p>
                  <p>{t("HomePage.startPopulatingYourApp")}</p>
                  <p>
                    <Trans
                      i18nKey="HomePage.learnMore"
                      components={{
                        ShopifyTutorialLink: (
                          <Link
                            url="https://shopify.dev/apps/getting-started/add-functionality"
                            external
                          />
                        ),
                      }}
                    />
                  </p>
                </TextContainer>
              </BlockStack.Item>
              <BlockStack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt={t("HomePage.trophyAltText")}
                    width={120}
                  />
                </div>
              </BlockStack.Item>
            </BlockStack >
          </Card >
          */