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
import { ProductsCard, } from "../components/ProductsCard";
import RoleTable from "../components/common/RoleTable";
import { useState } from "react";
import { useFetchApi } from "../hooks/useFetchApi";
import { useQuery } from "react-query";


export default function RulePage() {
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
  return (
    <Page >
      <TitleBar title={t("RulePage.title")} />
      <Layout>
        <Layout.Section>
          <RoleTable
            rules={data?.roles ?? []}
            isLoadingCount={isLoadingCount}
            refetchRules={refetchRules}
            index={index}
            setIndex={setIndex}
            total={data?.total}
          />
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
    </Page>
  );
}