import {
  Button,
  Popover,
  ActionList,
  Icon,
  TextField,
  Badge,
  InlineStack,
  SkeletonBodyText,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { useState, useCallback, memo } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useQuery } from "react-query";
import { APPLY_TYPE } from "../../const";

export default memo(function ProductTag({ activeTags, handleSetTags, apply }) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [listTags, setListTags] = useState(activeTags);
  const { handleFetchApi } = useFetchApi();
  const { data: productTags, isLoading } = useQuery({
    queryKey: ["product-tag"],
    queryFn: async () => handleFetchApi(`products/tags`),
  });
  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  if (isLoading) return <SkeletonBodyText />;

  const handleSelect = (item) => {
    const updatedTags = listTags.includes(item)
      ? listTags.filter((v) => v !== item)
      : [...listTags, item];
    setListTags(updatedTags);
    handleSetTags(updatedTags);
    console.log("listTags", listTags);
  };
  const activator = (
    <Button
      onClick={togglePopoverActive}
      disclosure
      disabled={apply === APPLY_TYPE.ALL ? true : false}
    >
      Product Tags {listTags.length ? `(${listTags.length})` : ""}
    </Button>
  );

  const verticalContentMarkup =
    listTags.length > 0 ? (
      <InlineStack gap="200" spacing="extraTight">
        {listTags.map((tag) => (
          <Badge tone="success" key={tag}>
            {tag}
          </Badge>
        ))}
      </InlineStack>
    ) : null;
  return (
    <>
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
              prefix: listTags.includes(item) ? (
                <Icon source={CheckIcon} />
              ) : null,
              onAction: () => handleSelect(item),
            }))}
          />
        </Popover>
      </div>
      {listTags.length > 0 && (
        <TextField
          label=""
          // value={textFieldValue}
          //onChange={handleTextFieldChange}
          placeholder="Tags Selected"
          //autoComplete="off"
          verticalContent={verticalContentMarkup}
        />
      )}
    </>
  );
});
