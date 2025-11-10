import React from 'react'
import {
    Card,
    Page,
    Layout,
    TextContainer,
    Image,
    DataTable,
    Link,
    Text,
} from "@shopify/polaris";
export default function ProductionList() {
    const rows = [
        ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
        [
            'Navy Merino Wool Blazer with khaki chinos and yellow belt',
            '$445.00',
            124518,
            32,
            '$14,240.00',
        ],
    ];
    return (

        <Card>
            <DataTable
                columnContentTypes={[
                    'text',
                    'text',
                    'text',
                    'text',
                    'text',
                ]}
                headings={[
                    'ID',
                    'Image',
                    'Title',
                    'Original Price',
                    'Modified Price',
                ]}
                rows={rows}
              
                pagination={{
                    hasNext: true,
                    onNext: () => { },
                }}
            />
        </Card>

    )
}
