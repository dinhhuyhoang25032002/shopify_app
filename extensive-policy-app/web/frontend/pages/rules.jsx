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
import { ProductsCard } from "../components/ProductsCard";
import RuleTable from "../components/common/RuleTable";
import { useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useQuery } from "react-query";

export default function RulePage() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const { handleFetchApi } = useFetchApi();
  const {
    data:rulesData,
    refetch: refetchRules,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["rules", index],
    queryFn: async () => handleFetchApi(`rules?index=${index}`),
    onError: (err) => {
      if (err.message === "UNAUTHORIZED") {
        refetchRules(); // Gọi lại API lấy token mới
      }
    },
    // staleTime: Infinity,
    // refetchOnWindowFocus: false,
    // keepPreviousData: true,
  });
  return (
    <Page>
      <TitleBar title={t("RulePage.title")} />
      <Layout>
        <Layout.Section>
          <RuleTable
            rules={rulesData?.rules ?? []}
            isLoadingCount={isLoadingCount}
            refetchRules={refetchRules}
            index={index}
            setIndex={setIndex}
            total={rulesData?.total}
          />
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
    </Page>
  );
}
