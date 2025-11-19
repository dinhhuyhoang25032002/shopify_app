import {
  Button,
  Popover,
  ActionList,
  Icon,
  Tag,
  TextField,
  BlockStack,
  Badge,
  InlineStack,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { useState, useCallback, memo } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useQuery } from "react-query";
import { APPLY_TYPE } from "../../const";
import SkeletonExample from "../layout/SkeletonPage";

export default memo(function ProductTag({ activeTags, setRule, apply }) {
  const [popoverActive, setPopoverActive] = useState(false);
  console.log("ProductTag is here!", activeTags);
  const { handleFetchApi } = useFetchApi();
  const { data: productTags, isLoading } = useQuery({
    queryKey: ["product-tag"],
    queryFn: async () => handleFetchApi(`products/tags`),
  });
  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  if (isLoading) return <SkeletonExample />;

  const handleSelect = (item) => {
    setRule((prevTags) =>
      prevTags.includes(item)
        ? prevTags.filter((v) => v !== item)
        : [...prevTags, item]
    );
  };
  const activator = (
    <Button
      onClick={togglePopoverActive}
      disclosure
      disabled={apply === APPLY_TYPE.ALL ? true : false}
    >
      Product Tags {activeTags.length ? `(${activeTags.length})` : ""}
    </Button>
  );

  const verticalContentMarkup =
    activeTags.length > 0 ? (
      <InlineStack gap="200" spacing="extraTight">
        {activeTags.map((tag) => (
          <Badge tone="success" key={tag}>
            {tag}
          </Badge>
        ))}
      </InlineStack>
    ) : null;
  return (
    <>
      <TextField
        label=""
        // value={textFieldValue}
        //onChange={handleTextFieldChange}
        placeholder="Tags"
        //autoComplete="off"
        verticalContent={verticalContentMarkup}
      />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Popover
          active={popoverActive}
          activator={activator}
          // autofocusTarget="first-node"
          zIndexOverride={900}
          onClose={togglePopoverActive}
        >
          <ActionList
            actionRole="menuitem"
            items={productTags.map((item) => ({
              content: item,
              prefix: activeTags.includes(item) ? (
                <Icon source={CheckIcon} />
              ) : null,
              onAction: () => handleSelect(item),
            }))}
          />
        </Popover>

        {/* Debug xem giá trị đã chọn */}
      </div>
    </>
  );
});
