import { Page } from "@shopify/polaris";
import { useParams } from "react-router-dom";
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
    refetch: refetchRule,
  } = useQuery({
    queryKey: ["rule", slug],
    queryFn: () => handleFetchApi(`rules/${slug}`),
    refetchOnWindowFocus: false,
    enabled: slug !== "create",
  });
  const shopify = useAppBridge();
  const handleSubmitUpdateRule = useCallback(
    async (formData) => {
      try {
        console.log("formData", formData);
        await handleFetchApi(`rules/${slug}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        shopify.toast.show("Change rule successfully.");
        await refetchRule();
      } catch (error) {
        console.log(error);
      }
    },
    [handleFetchApi, refetchRule]
  );
  const handleSubmitCreateRule = useCallback(
    async (formData) => {
      try {
        await handleFetchApi(`rules`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        shopify.toast.show("Create rule success.");
      } catch (error) {
        throw error;
      }
    },
    [handleFetchApi]
  );

  if (isLoading) return <SkeletonExample />;

  return (
    <Page>
      {slug === "create" ? (
        <Page>
          <EditRule
            onSubmit={handleSubmitCreateRule}
            title={"Create New Rule"}
          />
        </Page>
      ) : (
        <EditRule
          ruleInfo={ruleInfo}
          onSubmit={handleSubmitUpdateRule}
          title={`Edit custom pricing rule "${ruleInfo.name}"`}
          edit={true}
        />
      )}
    </Page>
  );
}
