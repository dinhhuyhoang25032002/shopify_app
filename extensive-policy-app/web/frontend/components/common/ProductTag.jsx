import { Button, Popover, ActionList, Icon, Tag, TextField, LegacyStack, BlockStack, Badge, InlineStack } from '@shopify/polaris';
import { CheckIcon } from '@shopify/polaris-icons';
import { useState, useCallback, memo } from 'react';
import { useFetchApi } from '../../hooks/useFetchApi';
import { useQuery } from 'react-query';
import { APPLY_TYPE } from '../../const';

export default memo(function ProductTag({ activeTags, setActiveTags, applyType }) {
    const [popoverActive, setPopoverActive] = useState(false);

    const { handleFetchApi } = useFetchApi()
    const { data, isLoading } = useQuery({
        queryKey: ['product-tag'],
        queryFn: async () => handleFetchApi(`products/tags`)
    })
    const togglePopoverActive = useCallback(
        () => setPopoverActive((active) => !active),
        [],
    );

    if (isLoading) return <div>Loading...</div>

    const handleSelect = (item) => {

        setActiveTags(prev =>
            prev.includes(item)
                ? prev.filter(v => v !== item) // nếu có rồi thì bỏ chọn
                : [...prev, item]              // nếu chưa có thì thêm vào
        );

    };

    const activator = (
        <Button onClick={togglePopoverActive} disclosure disabled={applyType === APPLY_TYPE.ALL ? true : false}>
            Product Tags {activeTags.length ? `(${activeTags.length})` : ""}
        </Button>
    );
    console.log(activeTags);
    const verticalContentMarkup =
        activeTags.length > 0 ? (
            <InlineStack gap="200" spacing="extraTight" >
                {activeTags.map((tag) => (
                    <Badge tone="success" key={tag}>{tag}</Badge>
                ))}
            </InlineStack  >
        ) : null;
    return (
        <> <TextField
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
                    onClose={togglePopoverActive}
                >
                    <ActionList
                        actionRole="menuitem"
                        items={data.map(item => ({
                            content: item,
                            prefix: activeTags.includes(item) ? <Icon source={CheckIcon} /> : null,
                            onAction: () => handleSelect(item),
                        }))}
                    />
                </Popover>

                {/* Debug xem giá trị đã chọn */}

            </div>

        </>
    );
})

