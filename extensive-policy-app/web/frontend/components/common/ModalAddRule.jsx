import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import EditRule from "./EditRule";
import { PolarisProvider } from "../providers/PolarisProvider";
import { useShopInfo } from "../../hooks/useShopInfo";

export default function ModalAddRule({ refetchRules }) {
  const { handleFetchApi } = useFetchApi();
  const { shopInfo } = useShopInfo();

  const handleSubmit = useCallback(async (formData) => {
    console.log("shopInfo.shop", shopInfo);

    try {
      await handleFetchApi(`rules`, {
        method: "POST",
        body: JSON.stringify({ ...formData, shop: shopInfo.shop }),
      });
      shopify.modal.hide("add-rule-modal");
      shopify.toast.show("Create rule success.");
      await refetchRules();
    } catch (error) {
        console.log(error);
      return;
    }
  }, []);

  return (
    <Modal id="add-rule-modal">
      <TitleBar title={"Create New Rule"}></TitleBar>
      <PolarisProvider>
        <EditRule onSubmit={handleSubmit} />
      </PolarisProvider>
    </Modal>
  );
}
