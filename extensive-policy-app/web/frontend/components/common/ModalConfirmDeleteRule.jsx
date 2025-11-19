import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Divider,
  InlineGrid,
  InlineStack,
  Select,
  Text,
} from "@shopify/polaris";
import { Form, FormLayout, TextField } from "@shopify/polaris";
import { useState } from "react";
import { STATUS_RULES } from "../../const";
import { useFetchApi } from "../../hooks/useFetchApi";

export default function ModalConfirmDeleteRule({ refetchRules, ruleDelete }) {
  const [rule, setRule] = useState({
    name: "",
    status: STATUS_RULES.ENABLE,
    priority: 0,
  });
  const { isLoading, handleFetchApi } = useFetchApi();
  const shopify = useAppBridge();
  const options = [
    { label: STATUS_RULES.ENABLE, value: STATUS_RULES.ENABLE },
    { label: STATUS_RULES.DISABLE, value: STATUS_RULES.DISABLE },
  ];
  const handleDeleteSubmit = async () => {
    try {
      await handleFetchApi(`/rules/${ruleDelete}`, { method: "DELETE" });
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
      <TitleBar title={`Delete ${ruleDelete}`}></TitleBar>
      <Box padding={500}>
        <Text fontWeight="medium">
          If you are sure you want to delete
          <Text as="strong"> {ruleDelete}</Text>.<br /> Press the{" "}
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
            <Button
              variant="primary"
              tone="critical"
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </ButtonGroup>
        </BlockStack>
      </Box>
    </Modal>
  );
}
