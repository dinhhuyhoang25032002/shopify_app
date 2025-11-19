import { Page } from "@shopify/polaris";

import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useFetchApi } from "../../hooks/useFetchApi";
import SkeletonExample from "../../components/layout/SkeletonPage";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import EditRule from "../../components/common/EditRule";
export default function EditRulePage() {
  const { slug } = useParams();
  const { handleFetchApi } = useFetchApi();

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

  // Fill form with fetched API data

  const onSubmit = useCallback(async (formData) => {
    try {
      await handleFetchApi(`rules/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      shopify.toast.show("Change rule successfully.");
      await refetch();
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log("ruleInfo", ruleInfo);
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
