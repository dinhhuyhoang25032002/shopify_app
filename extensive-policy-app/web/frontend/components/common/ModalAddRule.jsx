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
import { useState } from "react";
import { STATUS_ROLES } from "../../const";
import { useFetchApi } from "../../hooks/useFetchApi";
export default function ModalAddRule({ refetchRules }) {
  const [rule, setRule] = useState({
    name: "",
    status: STATUS_ROLES.ENABLE,
    priority: 0,
  });
  const { isLoading, handleFetchApi } = useFetchApi();

  const options = [
    { label: STATUS_ROLES.ENABLE, value: STATUS_ROLES.ENABLE },
    { label: STATUS_ROLES.DISABLE, value: STATUS_ROLES.DISABLE },
  ];
  const handleSubmit = async () => {
    try {
      const res = await handleFetchApi(`role`, {
        method: "POST",
        body: JSON.stringify(rule),
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
        status: STATUS_ROLES.ENABLE,
        priority: 0,
      });
    }
  };

  return (
    <Modal id="my-modal">
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <Box padding={400}>
            <InlineGrid columns={1} gap="400">
              <TextField
                autoFocus
                value={rule.name}
                onChange={(value) => setRule({ ...rule, name: value })}
                label="Name"
                type="text"
              />
              <InlineGrid columns={2} gap="400">
                <TextField
                  value={rule.priority}
                  onChange={(value) => setRule({ ...rule, priority: value })}
                  label="Priority"
                  type="text"
                />
                <Select
                  label="Status"
                  options={options}
                  onChange={(value) => setRule({ ...rule, status: value })}
                  value={rule.status}
                />
              </InlineGrid>
              <InlineStack align="end">
                <ButtonGroup>
                  <Button onClick={() => shopify.modal.hide("my-modal")}>
                    Cancel
                  </Button>
                  {isLoading ? (
                    <Button loading>Saving...</Button>
                  ) : (
                    <Button variant="primary" submit>
                      Save
                    </Button>
                  )}
                </ButtonGroup>
              </InlineStack>
            </InlineGrid>
          </Box>
        </FormLayout>
      </Form>
    </Modal>
  );
}
