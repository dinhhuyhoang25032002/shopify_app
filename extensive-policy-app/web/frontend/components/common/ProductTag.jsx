import { Button, Popover, ActionList, Icon } from '@shopify/polaris';
import { CheckIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export default function ProductTag() {
    const [popoverActive, setPopoverActive] = useState(false);
    const [values, setValues] = useState([]); // mảng chứa item đã chọn

    const togglePopoverActive = useCallback(
        () => setPopoverActive((active) => !active),
        [],
    );

    const options = ["Import", "Export", "Sale", "New", "Limited"];

    const handleSelect = (item) => {
        setValues(prev =>
            prev.includes(item)
                ? prev.filter(v => v !== item) // nếu có rồi thì bỏ chọn
                : [...prev, item]              // nếu chưa có thì thêm vào
        );
    };

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            Product Tags {values.length ? `(${values.length})` : ""}
        </Button>
    );
    console.log(values);

    return (
        <div >
            <Popover
                active={popoverActive}
                activator={activator}
                autofocusTarget="first-node"
                onClose={togglePopoverActive}
            >
                <ActionList
                    actionRole="menuitem"
                    items={options.map(item => ({
                        content: item,
                        prefix: values.includes(item) ? <Icon source={CheckIcon} /> : null,
                        onAction: () => handleSelect(item),
                    }))}
                />
            </Popover>

            {/* Debug xem giá trị đã chọn */}
            <div style={{ marginTop: 10 }}>
                <strong>Selected:</strong> {values.join(", ") || "None"}
            </div>
        </div>
    );
}
