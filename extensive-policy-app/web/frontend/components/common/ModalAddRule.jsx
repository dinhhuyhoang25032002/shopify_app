import { Modal, TitleBar } from '@shopify/app-bridge-react';
import {
    Box,

} from '@shopify/polaris';
import { Form, FormLayout, TextField } from '@shopify/polaris';
import { useState } from 'react';
export default function ModalAddRule({ isOpen, onClose, }) {
    const [rule, setRule] = useState({
        name: "", status: "", priority: 0
    })
    const handleSubmit = () => { }
    const handleEmailChange = () => { }
    return (
        // <Modal
        //     // primaryAction={{
        //     //     content: 'Add Instagram',
        //     //     onAction: handleChange,
        //     // }}
        //     // secondaryActions={[
        //     //     {
        //     //         content: 'Learn more',
        //     //         onAction: handleChange,
        //     //     },
        //     // ]}
        //     open={isOpen}
        // >    <TextField

        //         value={rule.name}
        //         onChange={handleEmailChange}
        //         label="Email"
        //         type="email"
        //         autoComplete="email"
        //         helpText={
        //             <span>
        //                 We’ll use this email address to inform you on future changes to
        //                 Polaris.
        //             </span>
        //         }
        //     />
        //     {/* <Form onSubmit={handleSubmit}>
        //         <FormLayout>

        //             <TextField
        //                 value={rule.name}
        //                 onChange={handleEmailChange}
        //                 label="Email"
        //                 type="email"
        //                 autoComplete="email"
        //                 helpText={
        //                     <span>
        //                         We’ll use this email address to inform you on future changes to
        //                         Polaris.
        //                     </span>
        //                 }
        //             />
        //             <TextField
        //                 value={rule.name}
        //                 onChange={handleEmailChange}
        //                 label="Email"
        //                 type="email"
        //                 autoComplete="email"
        //                 helpText={
        //                     <span>
        //                         We’ll use this email address to inform you on future changes to
        //                         Polaris.
        //                     </span>
        //                 }
        //             />
        //             <Button submit>Submit</Button>
        //         </FormLayout>
        //     </Form> */}
        // </Modal>

        <Modal id="my-modal">
            <Box padding={400}>
                {/* {shopify.} */}
                <TextField
                    value={rule.name}
                    onChange={handleEmailChange}
                    label="Email"
                    type="email"
                    autoComplete="email"
                // helpText={
                //     <span>
                //         We’ll use this email address to inform you on future changes to
                //         Polaris.
                //     </span>
                // }
                />
            </Box>
            <TitleBar title="Title">
                <button variant="primary">Label</button>
                <button onClick={() => shopify.modal.hide('my-modal')}>Label</button>
            </TitleBar>
        </Modal>
    )
}
