import { Form, FormLayout, Card, TextField, RadioButton, Button, Text, InlineGrid } from '@shopify/polaris';
import { useState } from 'react';
import { STATUS_ROLES } from '../../const';
import ProductionList from './ProductionList';
import ProductTag from './ProductTag';
export default function EditRule({ rule }) {
    const [value, setValue] = useState('disabled');
    if (!rule) return null;
    const handleSubmit = () => { }
    const { id, name, priority, createdAt, updatedAt, status } = rule;
    const handleChange = (_, newValue) => setValue(newValue)

    return (
        <Card> <Form onSubmit={handleSubmit}>
            <FormLayout>
                <Text variant="heading2xl" as="h3">
                    Edit custom pricing rule "{name}"
                </Text>


                <InlineGrid gap="500" columns={2} >
                    <TextField
                        value={""}
                        //    onChange={handleEmailChange}
                        label="Name"
                        type="email"

                        autoComplete="email"
                    helpText={
                        <span>
                            We’ll use this email address to inform you on future changes to
                            Polaris.
                        </span>
                    }
                    />
                    <TextField
                        value={""}
                        //    onChange={handleEmailChange}
                        label="Priority"
                        type="email"
                        autoComplete="email"
                    helpText={
                        <span>
                            We’ll use this email address to inform you on future changes to
                            Polaris.
                        </span>
                    }
                    />

                </InlineGrid>
                <Text variant="bodyLg" as="h3">
                    Status
                </Text>
                <InlineGrid gap="500" columns={2} >
                    <Card background='bg-surface-success'>
                        <RadioButton
                            label={STATUS_ROLES.ENABLE}
                            helpText="Customers will only be able to check out as guests."
                            checked={value === 'disabled'}
                            id="disabled"
                            name="accounts"
                            onChange={handleChange}
                        />
                    </Card>
                    <Card background='bg-surface-warning'>
                        <RadioButton
                            label={STATUS_ROLES.DISABLE}
                            helpText="Customers will only be able to check out as guests."
                            checked={value === 'disabled'}
                            id="disabled"
                            name="accounts"
                            onChange={handleChange}
                        />
                    </Card>
                </InlineGrid>
                <InlineGrid gap="500" columns={2} >
                    <Text variant="bodyLg" as="h3">
                        Apply to Products
                    </Text>
                    <Text variant="bodyLg" as="h3">
                        Choose B2B discount type
                    </Text>
                </InlineGrid>
                <InlineGrid gap="500" columns={2} >
                    <Card>
                        <InlineGrid gap="100" columns={1} >
                            <RadioButton
                                label={"All products"}
                                // helpText="Customers will only be able to check out as guests."
                                checked={value === 'disabled'}
                                id="disabled"
                                name="accounts"
                                onChange={handleChange}
                            />
                            <RadioButton
                                label={"Product tags"}
                                //    helpText="Customers will only be able to check out as guests."
                                checked={value === 'disabled'}
                                id="disabled"
                                name="accounts"
                                onChange={handleChange}
                            />
                            <ProductTag />
                        </InlineGrid>

                    </Card>
                    <Card>
                        <InlineGrid gap="100" columns={1} >
                            <RadioButton
                                label={"Apply a price to selected products/variants"}
                                // helpText="Customers will only be able to check out as guests."
                                checked={value === 'disabled'}
                                id="disabled"
                                name="accounts"
                                onChange={handleChange}
                            />
                            <RadioButton
                                label={"Decrease a fixed amount of the original price"}
                                //    helpText="Customers will only be able to check out as guests."
                                checked={value === 'disabled'}
                                id="disabled"
                                name="accounts"
                                onChange={handleChange}
                            />
                            <RadioButton
                                label={"Decrease the original price by a percentage (%)"}
                                //    helpText="Customers will only be able to check out as guests."
                                checked={value === 'disabled'}
                                id="disabled"
                                name="accounts"
                                onChange={handleChange}
                            />
                            <Text variant="bodyLg" as="h3">
                                Amount
                            </Text>
                            <TextField
                                value={""}
                                //    onChange={handleEmailChange}
                                //label="Name"
                                type="email"

                                autoComplete="email"
                            helpText={
                                <span>
                                    The price will be adjusted based on your Shopify Markets setting.
                                </span>
                            }
                            />
                        </InlineGrid>
                    </Card>
                </InlineGrid>
                <ProductionList />
                <Button submit>Submit</Button>
            </FormLayout>
        </Form>

        </Card>

    )
}
