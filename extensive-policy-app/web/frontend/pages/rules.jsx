import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import RuleTable from "../components/common/RuleTable";
import { useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useQuery } from "react-query";

export default function RulePage() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const { handleFetchApi } = useFetchApi();
  const {
    data: rulesData,
    refetch: refetchRules,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["rules", index],
    queryFn: async () => handleFetchApi(`rules?index=${index}`),
    onError: (err) => {
      if (err.message === "UNAUTHORIZED") {
        refetchRules();
      }
    },
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
      </Layout>
    </Page>
  );
}
