import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Text,
} from "@shopify/polaris";

import { useFetchApi } from "../../hooks/useFetchApi";

export default function ModalConfirmDeleteRule({ refetchRules, ruleDelete }) {
  const { isLoading, handleFetchApi } = useFetchApi();
  const shopify = useAppBridge();

  const handleDeleteSubmit = async () => {
    try {
      await handleFetchApi(`/rules/${ruleDelete.id}`, { method: "DELETE" });
      shopify.toast.show("Deleted Rule successfully.");
      await refetchRules();
      shopify.modal.hide("confirm-delete-modal");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Modal id="confirm-delete-modal">
      <TitleBar title={`Delete ${ruleDelete?.name}`}></TitleBar>
      <Box padding={500}>
        <Text fontWeight="medium">
          If you are sure you want to delete
          <Text as="strong"> {ruleDelete?.name}</Text>.<br /> Press the{" "}
          <Text as="strong"> Delete</Text> button.
        </Text>
      </Box>
      <Divider />
      <Box padding={300}>
        <BlockStack inlineAlign="end">
          <ButtonGroup>
            <Button onClick={() => shopify.modal.hide("confirm-delete-modal")}>
              Cancel
            </Button>
            {!isLoading ? (
              <Button
                variant="primary"
                tone="critical"
                onClick={handleDeleteSubmit}
              >
                Delete
              </Button>
            ) : (
              <Button loading>Save product</Button>
            )}
          </ButtonGroup>
        </BlockStack>
      </Box>
    </Modal>
  );
}
