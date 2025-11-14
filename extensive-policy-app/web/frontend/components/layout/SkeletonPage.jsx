import {
  SkeletonPage,
  Layout,
  Card,
  SkeletonBodyText,
  Text,
  SkeletonDisplayText,
  InlineGrid,
} from "@shopify/polaris";

export default function SkeletonExample() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <InlineGrid columns={1} gap={400}>
            <Card>
              <SkeletonBodyText />
            </Card>
            <Card>
              <Text>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </Text>
            </Card>
            <Card>
              <Text>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </Text>
            </Card>
          </InlineGrid>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <InlineGrid columns={1} gap={400}>
            <Card>
              <Card>
                <Text>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </Text>
              </Card>
              <Card>
                <SkeletonBodyText lines={1} />
              </Card>
            </Card>
            <Card>
              <Card>
                <Text>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </Text>
              </Card>
              <Card>
                <SkeletonBodyText lines={2} />
              </Card>
            </Card>
          </InlineGrid>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
