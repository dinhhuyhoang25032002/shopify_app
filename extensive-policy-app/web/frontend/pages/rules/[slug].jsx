import { Page } from "@shopify/polaris";

import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useFetchApi } from "../../hooks/useFetchApi";
import SkeletonExample from "../../components/layout/SkeletonPage";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import EditRule from "../../components/common/EditRule";
import { useShopInfo } from "../../hooks/useShopInfo";
export default function EditRulePage() {
  const { slug } = useParams();
  const { handleFetchApi } = useFetchApi();
  const { shopInfo } = useShopInfo();
  const {
    isLoading,
    data: ruleInfo,
    refetch,
  } = useQuery({
    queryKey: ["rule", slug],
    queryFn: () => handleFetchApi(`rules/${slug}`),
    refetchOnWindowFocus: false,
  });

  const shopify = useAppBridge();

  const onSubmit = useCallback(async (formData) => {
    try {
      console.log("formData", formData);

      await handleFetchApi(`rules/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({ ...formData, shop: shopInfo?.shop }),
      });

      shopify.toast.show("Change rule successfully.");
      await refetch();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isLoading) return <SkeletonExample />;
  return (
      <Page>
        <EditRule
          ruleInfo={ruleInfo}
          onSubmit={onSubmit}
          title={`Edit custom pricing rule "${ruleInfo.name}"`}
          edit={true}
        />
      </Page>
  );
}
