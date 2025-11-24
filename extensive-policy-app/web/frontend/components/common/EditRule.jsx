import { memo, useCallback, useEffect, useState } from "react";
import { ruleSchema } from "../../helper/validate/RuleForm";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { APPLY_TYPE, DISCOUNT_TYPE, STATUS_RULES } from "../../const";
import ProductTag from "../../components/common/ProductTag";
import ProductionList from "../../components/common/ProductionList";
import _ from "lodash";
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
  Badge,
  Box,
  ChoiceList,
  BlockStack,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import SaveBarComponent from "./SaveBar";
import { useAppBridge } from "@shopify/app-bridge-react";

export default memo(function EditRule({ ruleInfo, onSubmit, title, edit }) {
  const {
    handleSubmit,
    setValue: setFormValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(ruleSchema),
    defaultValues: {
      name: "",
      status: STATUS_RULES.ENABLE,
      apply: APPLY_TYPE.ALL,
      tags: [],
      type: "",
      priority: "",
      value: "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const apply = watch("apply");
  const type = watch("type");
  const tags = watch("tags") ?? [];
  const value = watch("value");
  const [isEditMode, setIsEditMode] = useState(false);
  const [prevRuleInfo, setPrevRuleInfo] = useState(null);
  useEffect(() => {
    if (ruleInfo) {
      Object.entries(ruleInfo).forEach(([key, val]) => {
        setFormValue(key, val);
      });
    }
    setPrevRuleInfo(ruleInfo);
  }, [ruleInfo]);
  useEffect(() => {
    if (_.isEqual(prevRuleInfo, watch())) {
      setIsEditMode(false);
      shopify.saveBar.hide("my-save-bar");
      return;
    }
    setIsEditMode(true);
    shopify.saveBar.show("my-save-bar");
  }, [prevRuleInfo, watch()]);

  const handleSetTags = useCallback(
    (updater) => {
      setFormValue("tags", updater);
    },
    [setFormValue]
  );

  const handleDiscard = () => {
    setIsEditMode(false);
    shopify.saveBar.hide("my-save-bar");
    Object.entries(ruleInfo).forEach(([key, val]) => {
      setFormValue(key, val);
    });
  };
  console.log(onSubmit);

  return (
    <Box padding={400} background="bg-surface">
      <Form>
        <FormLayout>
          {edit && (
            <InlineStack align="space-between">
              <InlineStack gap="400" columns={2} align="center">
                <Button
                  icon={ArrowLeftIcon}
                  accessibilityLabel="Back"
                  onClick={() => {
                    if (isEditMode) {
                      return shopify.saveBar.leaveConfirmation();
                    } else {
                      navigate("/rules");
                    }
                  }}
                />

                <Text variant="headingXl" as="h3">
                  {title}
                </Text>
                <Button onClick={onSubmit(watch())}>Submit</Button>
              </InlineStack>
            </InlineStack>
          )}

          {/* Name + Priority */}
          <InlineGrid gap="400" columns={2}>
            <TextField
              label="Name"
              value={watch("name")}
              onChange={(v) => {
                setFormValue("name", v, { shouldValidate: true });
              }}
              error={errors.name?.message}
            />

            <TextField
              label="Priority"
              value={watch("priority")}
              onChange={(v) =>
                setFormValue("priority", v, { shouldValidate: true })
              }
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
                    handleSetTags={handleSetTags}
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
                    onChange={(value) => setFormValue("type", value[0])}
                  />
                  <Divider />
                  <Text variant="bodyLg" as="h3">
                    {type === DISCOUNT_TYPE.PERCENT ? "Percent (%)" : "Amount"}
                  </Text>

                  <TextField
                    value={value}
                    onChange={(v) =>
                      setFormValue("value", v, { shouldValidate: true })
                    }
                    error={errors.value?.message}
                    helpText={
                      <span>
                        The price will be adjusted based on your Shopify Markets
                        setting.
                      </span>
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
                type === DISCOUNT_TYPE.PERCENT && errors.value?.message
                  ? null
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

          <SaveBarComponent
            handleSave={() => onSubmit({ ...watch() })}
            handleDiscard={handleDiscard}
          />
        </FormLayout>
      </Form>
    </Box>
  );
});
