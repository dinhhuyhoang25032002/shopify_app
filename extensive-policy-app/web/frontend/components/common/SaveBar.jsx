import { SaveBar } from "@shopify/app-bridge-react";
import { Button } from "@shopify/polaris";
import { memo } from "react";
export default memo(function SaveBarComponent({ handleDiscard, handleSave }) {
  console.log("handleSave", handleSave);

  return (
    <SaveBar id="my-save-bar">
      <Button variant="primary" onClick={handleSave}></Button>
      <Button onClick={handleDiscard}></Button>
    </SaveBar>
  );
});
