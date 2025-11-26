import {
  Button,
  ButtonGroup,
  Form,
  InlineGrid,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";

import { useFetchApi } from "../../hooks/useFetchApi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useShopInfo } from "../../hooks/useShopInfo";

export default function ChangeEmail({ value, setEditting }) {
  const [email, setEmail] = useState(value ?? "");
  const shop = useShopInfo();
  const shopify = useAppBridge();
  const { handleFetchApi } = useFetchApi();
  const handleSubmit = async () => {
    try {
      await handleFetchApi(`shop/${shop?.shop}`, {
        method: "PATCH",
        body: JSON.stringify({ sender_email: email }),
      });
      shopify.toast.show("Changed email successfully.");
      setEditting(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <InlineGrid columns={1} gap="200">
        <TextField
          label=""
          value={email}
          type="email"
          autoComplete="email"
          onChange={(value) => setEmail(value)}
          autoFocus
        />
        <ButtonGroup variant="segmented">
          <Button onClick={() => setEditting(false)}>Cancel</Button>
          <Button variant="primary" submit>
            Save
          </Button>
        </ButtonGroup>
      </InlineGrid>
    </Form>
  );
}
