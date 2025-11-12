import {
  Badge,
  Button,
  Card,
  Icon,
  Image,
  InlineGrid,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { QuestionCircleIcon, EditIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { trophyImage } from "../../assets";
import ChangeEmail from "./ChangeEmail";
export default function ShopInfor() {
  const { first_name, email } = useSelector((state) => state.shop);
  const [isOpenEmail, setOpenEmail] = useState(true);
  const [isEditting, setEditting] = useState(false);
  return (
    <Card padding={800}>
      <InlineGrid gap="500" columns={1}>
        <Text variant="headingXl" as="h4" alignment="center">
          <span className="animate-gradient-flow">
            Welcome "{first_name}" to Our Platform
          </span>{" "}
          🚀
        </Text>
        <InlineGrid gap="400" columns={2}>
          <InlineGrid gap="400" columns={1}>
            <Card background="bg-surface-emphasis">
              <Text alignment="justify" as="p" variant="bodyLg">
                Welcome and thank you for choosing our application. We are truly
                pleased to have you with us. To ensure the best possible
                experience, we encourage you to review our Rules and explore our
                Product offerings through the links below:
                <Text>
                  🔹<Link to={"/rules"}>Rules</Link>: Set up and control all
                  policy configurations to ensure your system operates smoothly.
                </Text>
                <Text>
                  🔹<Link to={"/products"}>Product</Link>: View, organize, and
                  optimize your product data with ease and flexibility.
                </Text>
              </Text>
            </Card>
            <Card background="bg-surface-emphasis">
              <Text alignment="justify" variant="bodyLg">
                By using our services, you acknowledge and agree to our
                guidelines, designed to provide a secure and efficient
                environment for all users. Should you have any questions or
                require assistance, our support team is always ready to help. We
                are committed to accompanying you on your journey and
                continuously improving to serve you better. Thank you once again
                for trusting our platform. We wish you a successful and
                enjoyable experience.
              </Text>
            </Card>
          </InlineGrid>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={trophyImage}
              style={{
                width: "80%",
              }}
            />
          </div>
        </InlineGrid>
        <Card background="bg-surface-info">
          <div style={{ display: "flex", gap: "6px" }}>
            <Text alignment="start" fontWeight="bold" as="legend">
              Allow the app to send information via email
            </Text>
            <Badge tone={isOpenEmail ? "success" : "warning"} size="medium">
              <Text fontWeight="medium">{isOpenEmail ? "On" : "Off"}</Text>
            </Badge>

            <Tooltip
              active
              content="If disabled, you will not receive any app updates or important notifications via email."
            >
              <Icon source={QuestionCircleIcon} tone="base" />
            </Tooltip>
          </div>
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "space-between",
            }}
          >
            <Text>
              All updates and notifications about the app will be sent to the
              email address:
              {!isEditting ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <Text fontWeight="medium">{email} </Text>
                  <div onClick={() => setEditting(true)}>
                    <Icon source={EditIcon} tone="base" />
                  </div>
                </div>
              ) : (
                <ChangeEmail value={email} setEditting={setEditting} />
              )}
            </Text>
            <div>
              <Button
                variant="primary"
                tone={!isOpenEmail ? "success" : "critical"}
                onClick={() => setOpenEmail(!isOpenEmail)}
              >
                {!isOpenEmail ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </Card>
      </InlineGrid>
    </Card>
  );
}
