import {
  Button,
  ButtonGroup,
  Form,
  InlineGrid,
  TextField,
} from "@shopify/polaris";
import { Dispatch, useState } from "react";
import { useSelector } from "react-redux";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useAppBridge } from "@shopify/app-bridge-react";
type ChangeEmailProp = {
  value: string;
  setEditting: Dispatch<React.SetStateAction<boolean>>;
};
export default function ChangeEmail({ value, setEditting }: ChangeEmailProp) {
  const [email, setEmail] = useState(value ?? "");
  const { shop } = useSelector((state) => state.shop);
  const shopify = useAppBridge();
  const { handleFetchApi } = useFetchApi();
  const handleSubmit = async () => {
    try {
      await handleFetchApi(`shop/${shop}`, {
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
