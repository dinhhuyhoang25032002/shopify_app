import {
  Form,
  FormLayout,
  Divider,
  Card,
  TextField,
  RadioButton,
  Button,
  Text,
  InlineGrid,
  InlineStack,
  Page,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { APPLY_TYPE, DISCOUNT_TYPE, STATUS_ROLES } from "../../const";
import ProductTag from "../../components/common/ProductTag";
import ProductionList from "../../components/common/ProductionList";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useFetchApi } from "../../hooks/useFetchApi";
import SkeletonExample from "../../components/layout/SkeletonPage";
import { useAppBridge } from "@shopify/app-bridge-react";
export default function EditRule() {
  const { slug } = useParams();
  const { handleFetchApi } = useFetchApi();
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["rule", slug],
    queryFn: () => handleFetchApi(`rules/${slug}`),
    refetchOnWindowFocus: false,
  });
  const [statusValue, setStatusValue] = useState(STATUS_ROLES.ENABLE);
  const [applyType, setApplyType] = useState(APPLY_TYPE.ALL); // all | tags
  const [discountType, setDiscountType] = useState(DISCOUNT_TYPE.SET_PRICE);
  const [activeTags, setActiveTags] = useState([]); // mảng chứa item đã chọn
  const shopify = useAppBridge();
  const [value, setValue] = useState("");
  useEffect(() => {
    if (data?.status) {
      setStatusValue(data.status);
    }
  }, [data?.status]);
  if (isLoading) return <SkeletonExample />;
  if (error) return <div>try again</div>;
  const { name, priority } = data;
  console.log("data", applyType);
  const handleSubmit = async () => {
    try {
      await handleFetchApi(`rules/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: statusValue,
          type: discountType,
          tags: activeTags,
          apply: applyType,
        }),
      });
      shopify.toast.show("Change rule successfully.");
      await refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Page>
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <InlineStack align="space-between">
              <Text variant="headingXl" as="h3">
                Edit custom pricing rule "{name}"
              </Text>
              <Button tone="success" variant="primary" submit>
                Submit
              </Button>
            </InlineStack>

            <InlineGrid gap="500" columns={2}>
              <TextField
                value={name}
                readOnly
                label="Name"
                type="text"
                helpText={
                  <span>
                    We’ll use this email address to inform you on future changes
                    to Polaris.
                  </span>
                }
              />
              <TextField
                value={priority}
                readOnly
                //    onChange={handleEmailChange}
                label="Priority"
                type="text"
                helpText={
                  <span>
                    We’ll use this email address to inform you on future changes
                    to Polaris.
                  </span>
                }
              />
            </InlineGrid>
            <Text variant="bodyLg" as="h3">
              Status
            </Text>
            <InlineGrid gap="500" columns={2}>
              <Card background="bg-surface-success">
                <RadioButton
                  label={STATUS_ROLES.ENABLE}
                  helpText="Customers will only be able to check out as guests."
                  checked={statusValue === STATUS_ROLES.ENABLE}
                  id={STATUS_ROLES.ENABLE}
                  name="status"
                  onChange={() => setStatusValue(STATUS_ROLES.ENABLE)}
                />
              </Card>
              <Card background="bg-surface-warning">
                <RadioButton
                  label={STATUS_ROLES.DISABLE}
                  helpText="Customers will only be able to check out as guests."
                  checked={statusValue === STATUS_ROLES.DISABLE}
                  id={STATUS_ROLES.DISABLE}
                  name="status"
                  onChange={() => setStatusValue(STATUS_ROLES.DISABLE)}
                />
              </Card>
            </InlineGrid>
            <InlineGrid gap="500" columns={2}>
              <Text variant="bodyLg" as="h3">
                Apply to Products
              </Text>
              <Text variant="bodyLg" as="h3">
                Choose B2B discount type
              </Text>
            </InlineGrid>
            <InlineGrid gap="500" columns={2}>
              <Card>
                <InlineGrid gap="100" columns={1}>
                  <RadioButton
                    label={"All products"}
                    helpText="Customers will only be able to check out as guests."
                    checked={applyType === APPLY_TYPE.ALL}
                    id={APPLY_TYPE.ALL}
                    name="apply_price"
                    onChange={() => {
                      setApplyType(APPLY_TYPE.ALL);
                      setActiveTags([]);
                    }}
                  />
                  <Divider />
                  <RadioButton
                    label={"Product tags"}
                    helpText="Customers will only be able to check out as guests."
                    checked={applyType === APPLY_TYPE.TAGS}
                    id={APPLY_TYPE.TAGS}
                    name="apply_price"
                    onChange={() => setApplyType(APPLY_TYPE.TAGS)}
                  />
                  <ProductTag
                    setActiveTags={setActiveTags}
                    activeTags={activeTags}
                    applyType={applyType}
                  />
                </InlineGrid>
              </Card>
              <Card>
                <InlineGrid gap="100" columns={1}>
                  <RadioButton
                    label={"Apply a price to selected products/variants"}
                    // helpText="Customers will only be able to check out as guests."
                    checked={discountType === DISCOUNT_TYPE.SET_PRICE}
                    id={DISCOUNT_TYPE.SET_PRICE}
                    name="discount"
                    onChange={() => setDiscountType(DISCOUNT_TYPE.SET_PRICE)}
                  />
                  <RadioButton
                    label={"Decrease a fixed amount of the original price"}
                    //    helpText="Customers will only be able to check out as guests."
                    checked={discountType === DISCOUNT_TYPE.FIXED}
                    id={DISCOUNT_TYPE.FIXED}
                    name="discount"
                    onChange={() => setDiscountType(DISCOUNT_TYPE.FIXED)}
                  />
                  <RadioButton
                    label={"Decrease the original price by a percentage (%)"}
                    //    helpText="Customers will only be able to check out as guests."
                    checked={discountType === DISCOUNT_TYPE.PERCENT}
                    id="disabled"
                    name="accounts"
                    onChange={() => setDiscountType(DISCOUNT_TYPE.PERCENT)}
                  />
                  <Divider />
                  <Text variant="bodyLg" as="h3">
                    {discountType === DISCOUNT_TYPE.PERCENT
                      ? "Percent(%)"
                      : "Amount"}
                  </Text>
                  <TextField
                    value={value}
                    onChange={(value) => setValue(value)}
                    //label="Name"
                    type="text"
                    helpText={
                      <span>
                        The price will be adjusted based on your Shopify Markets
                        setting.
                      </span>
                    }
                  />
                </InlineGrid>
              </Card>
            </InlineGrid>
            <ProductionList
              status={statusValue}
              activeTags={activeTags}
              applyType={applyType}
              discountType={discountType}
              value={value}
            />
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
