import { useCallback, useEffect, useState } from "react";
import { ruleSchema } from "../../helper/validate/RuleForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { APPLY_TYPE, DISCOUNT_TYPE, STATUS_RULES } from "../../const";
import ProductTag from "../../components/common/ProductTag";
import ProductionList from "../../components/common/ProductionList";
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
  Badge,
  Box,
  ChoiceList,
  Bleed,
  BlockStack,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";

export default function EditRule({ ruleInfo, onSubmit, title, edit }) {
  const {
    handleSubmit,
    setValue: setFormValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ruleSchema),
    defaultValues: {
      name: "",
      status: STATUS_RULES.ENABLE,
      apply: APPLY_TYPE.ALL,
      tags: [],
      type: "",
      priority: 0,
      value: "",
    },
  });
  const navigate = useNavigate();
  const [isOpenWarnig, setOpenWarning] = useState(false);
  const apply = watch("apply");
  const type = watch("type");
  const tags = watch("tags");
  const value = watch("value");
  useEffect(() => {
    if (ruleInfo) {
      Object.entries(ruleInfo).forEach(([key, val]) => {
        setFormValue(key, val);
      });
    }
  }, [ruleInfo]);
  useEffect(() => {
    if (type[0] === DISCOUNT_TYPE.PERCENT && (value < 0 || value > 100))
      setOpenWarning(true);
    else setOpenWarning(false);
  }, [type, value]);
  const handleSetTags = useCallback(
    (updater) => {
      setFormValue("tags", (prev) => updater(prev ?? []));
    },
    [setFormValue]
  );

  return (
    <Box padding={400}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout>
          {edit && (
            <InlineStack align="space-between">
              <InlineStack gap="400" columns={2} align="center">
                <Button
                  icon={ArrowLeftIcon}
                  accessibilityLabel="Back"
                  onClick={() => navigate("/rules")}
                />

                <Text variant="headingXl" as="h3">
                  {title}
                </Text>
              </InlineStack>

              <Button tone="success" variant="primary" submit>
                Submit
              </Button>
            </InlineStack>
          )}

          {/* Name + Priority */}
          <InlineGrid gap="400" columns={2}>
            <TextField
              label="Name"
              value={watch("name")}
              onChange={(v) => setFormValue("name", v)}
              error={errors.name?.message}
            />

            <TextField
              label="Priority"
              type="number"
              value={watch("priority")}
              onChange={(v) => setFormValue("priority", Number(v))}
              error={errors.priority?.message}
            />
          </InlineGrid>
          <Card>
            <InlineStack align="space-between">
              <InlineGrid columns={2} gap={200}>
                <Text variant="bodyLg" as="h3">
                  Status Rule:
                </Text>
                <Box>
                  <Badge
                    tone={
                      watch("status") === STATUS_RULES.ENABLE
                        ? "success"
                        : "critical"
                    }
                  >
                    {watch("status")}
                  </Badge>
                </Box>
              </InlineGrid>

              <Button
                tone={
                  watch("status") !== STATUS_RULES.ENABLE
                    ? "success"
                    : "critical"
                }
                variant="primary"
                onClick={() =>
                  setFormValue(
                    "status",
                    watch("status") === STATUS_RULES.ENABLE
                      ? STATUS_RULES.DISABLE
                      : STATUS_RULES.ENABLE
                  )
                }
              >
                {watch("status") === "ENABLE" ? "Disable" : "Enable"}
              </Button>
            </InlineStack>
          </Card>

          <InlineGrid gap="400" columns={edit ? 2 : 1}>
            {/* APPLY TO PRODUCTS */}

            <BlockStack gap="300">
              <Text variant="bodyLg">Apply to Products</Text>

              <Box
                background="bg-surface-info"
                minHeight="215px"
                shadow="100"
                borderWidth="025"
                borderRadius="200"
                padding="400"
                borderColor="border"
              >
                <InlineGrid gap="100" columns={1}>
                  <RadioButton
                    label="All products"
                    checked={apply === APPLY_TYPE.ALL}
                    onChange={() => {
                      setFormValue("apply", APPLY_TYPE.ALL);
                      setFormValue("tags", []);
                    }}
                    helpText="All products of your store will be applied this discount."
                  />

                  <Divider />

                  <RadioButton
                    label="Product tags"
                    checked={apply === APPLY_TYPE.TAGS}
                    onChange={() => {
                      setFormValue("apply", APPLY_TYPE.TAGS);
                    }}
                    helpText="Only products with the tags specified below will be applied.."
                  />

                  <ProductTag
                    activeTags={tags}
                    setRule={handleSetTags}
                    apply={apply}
                  />

                  {errors.tags && (
                    <Text tone="critical">{errors.tags.message}</Text>
                  )}
                </InlineGrid>
              </Box>
            </BlockStack>

            {/* DISCOUNT TYPE */}
            <BlockStack gap="300">
              <Text variant="bodyLg">Choose B2B discount type</Text>
              <Box
                background="bg-surface-info"
                minHeight="215px"
                shadow="100"
                borderWidth="025"
                borderRadius="200"
                padding="400"
                borderColor="border"
              >
                <InlineGrid gap="100" columns={1}>
                  <ChoiceList
                    choices={[
                      {
                        label: "Apply a price to selected products/variants",
                        value: DISCOUNT_TYPE.SET_PRICE,
                      },
                      {
                        label: "Decrease a fixed amount of the original price",
                        value: DISCOUNT_TYPE.FIXED,
                      },
                      {
                        label:
                          "Decrease the original price by a percentage (%)",
                        value: DISCOUNT_TYPE.PERCENT,
                      },
                    ]}
                    selected={type}
                    onChange={(value) => setFormValue("type", value)}
                  />
                  <Divider />
                  <Text variant="bodyLg" as="h3">
                    {type[0] === DISCOUNT_TYPE.PERCENT
                      ? "Percent (%)"
                      : "Amount"}
                  </Text>

                  <TextField
                    type="number"
                    value={value}
                    onChange={(v) => setFormValue("value", Number(v))}
                    error={errors.value?.message}
                    helpText={
                      isOpenWarnig ? (
                        <span style={{ color: "red" }}>Invalid Value</span>
                      ) : (
                        <span>
                          The price will be adjusted based on your Shopify
                          Markets setting.
                        </span>
                      )
                    }
                  />
                </InlineGrid>
              </Box>
            </BlockStack>
          </InlineGrid>

          {/* PRODUCT PREVIEW */}
          {edit && (
            <ProductionList
              status={watch("status")}
              activeTags={tags}
              applyType={apply}
              discountType={type}
              value={
                type === DISCOUNT_TYPE.PERCENT
                  ? value > 0 && value <= 100
                    ? value
                    : null
                  : value
              }
            />
          )}
          {!edit && (
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button tone="success" variant="primary" submit>
                Submit
              </Button>
            </div>
          )}
        </FormLayout>
      </Form>
    </Box>
  );
}
