import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  Box,
  Button,
  ButtonGroup,
  InlineGrid,
  InlineStack,
  Select,
} from "@shopify/polaris";
import { Form, FormLayout, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { STATUS_RULES } from "../../const";
import { useFetchApi } from "../../hooks/useFetchApi";
import EditRule from "./EditRule";
import { PolarisProvider } from "../providers/PolarisProvider";

export default function ModalAddRule({ refetchRules, setConfirmDelete }) {
  const [rule, setRule] = useState({
    name: "",
    status: STATUS_RULES.ENABLE,
    priority: 0,
  });
  const { isLoading, handleFetchApi } = useFetchApi();

  const options = [
    { label: STATUS_RULES.ENABLE, value: STATUS_RULES.ENABLE },
    { label: STATUS_RULES.DISABLE, value: STATUS_RULES.DISABLE },
  ];
  const handleSubmit = useCallback(async (formData) => {
    try {
      await handleFetchApi(`rules`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      shopify.modal.hide("my-modal");
      await refetchRules();
      shopify.toast.show("Create rule success.");
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setRule({
        name: "",
        status: STATUS_RULES.ENABLE,
        priority: 0,
      });
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
