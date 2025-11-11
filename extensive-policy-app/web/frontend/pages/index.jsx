import {
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useQuery } from "react-query";
import { trophyImage } from "../assets";

import RoleTable from "../components/common/RoleTable";
import { useEffect, useState } from "react";
import EditRule from "../components/common/EditRule";
import { useFetchApi } from "../hooks/useFetchApi";

export default function HomePage() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0)
  const [isEditting, setEditting] = useState(false)
  const [ruleEdit, setRuleEdit] = useState(null)
  const { handleFetchApi } = useFetchApi()
  const {
    data, refetch: refetchRules,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["roles", index],
    queryFn: async () => handleFetchApi(`roles?index=${index}`),
    onError: (err) => {
      if (err.message === "UNAUTHORIZED") {
        refetchRules(); // Gọi lại API lấy token mới
      }
    }
    // staleTime: Infinity,
    // refetchOnWindowFocus: false,
    // keepPreviousData: true,
  });

  const rule = data?.roles?.find((r) => r.id === ruleEdit) || null;

  return (
    <Page >
      <TitleBar title={t("HomePage.title")} />
      <Layout>
        <Layout.Section>
          <RoleTable
            setEditting={setEditting}
            isEditting={isEditting}
            rules={data?.roles ?? []}
            isLoadingCount={isLoadingCount}
            refetchRules={refetchRules}
            index={index}
            setIndex={setIndex}
            total={data?.total}

            setRuleEdit={setRuleEdit}
          />
        </Layout.Section>
        {isEditting &&
          <Layout.Section>
            <EditRule
              rule={rule}
            />
          </Layout.Section>}
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