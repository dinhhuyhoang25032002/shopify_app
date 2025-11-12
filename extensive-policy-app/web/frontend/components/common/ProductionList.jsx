import {
  Card,
  Page,
  Layout,
  TextContainer,
  Thumbnail,
  Image,
  DataTable,
  Link,
  Text,
  IndexTable,
  useIndexResourceState,
} from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import { useQuery } from "react-query";
import { useFetchApi } from "../../hooks/useFetchApi";
import { DISCOUNT_TYPE, STATUS_ROLES } from "../../const";
import { memo, useState } from "react";
import PaginationTable from "./PaginationTable";

export default memo(function ProductionList({
  status,
  activeTags,
  discountType,
  value,
}) {
  const params = new URLSearchParams();
  activeTags?.forEach((tag) => params.append("tag", tag));
  const { handleFetchApi } = useFetchApi();
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["products", activeTags],
    queryFn: async () => handleFetchApi(`products?${params.toString()}`),
  });

  const {
    data: productCount,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["productCount"],
    queryFn: async () => {
      const response = await fetch("/api/products/count");
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });
  console.log(discountType, value);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data ?? []);
  const rowMarkup = data?.map(({ id, title, image, price }, index) => {
    // ✅ Compute modified price
    let modifiedPrice = price;
    if (status === STATUS_ROLES.ENABLE) {
      switch (discountType) {
        case DISCOUNT_TYPE.FIXED:
          modifiedPrice = price - value;
          break;

        case DISCOUNT_TYPE.PERCENT:
          modifiedPrice = price - (price * value) / 100;
          break;
        case DISCOUNT_TYPE.SET_PRICE:
          modifiedPrice = value || price;
          break;
        default:
          modifiedPrice = price;
      }
    }

    return (
      <IndexTable.Row
        id={id.split("/").pop()}
        key={id.split("/").pop()}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span">{id.split("/").pop()}</Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          {image ? (
            <Image
              width={80}
              height={80}
              source={image}
              alt={title}
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <Thumbnail source={NoteIcon} size="small" alt="Small document" />
          )}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text as="span" fontWeight="bold">
            {title}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text>${parseFloat(price).toFixed(2)}</Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text
            tone={status === STATUS_ROLES.ENABLE ? "success" : "critical"}
            fontWeight={status === STATUS_ROLES.ENABLE ? "bold" : "regular"}
          >
            ${parseFloat(modifiedPrice).toFixed(2)}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <IndexTable
        itemCount={isLoading ? 1 : data.length}
        selectable={false}
        selectedItemsCount={
          isLoading
            ? 0
            : allResourcesSelected
            ? "All"
            : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "ID" },
          { title: "Image" },

          { title: "Title" },
          { title: "Original Price" },
          { title: "Modified Price" },
        ]}
      >
        {isLoading ? (
          <IndexTable.Row>
            <IndexTable.Cell colSpan={5}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <Spinner size="small" />
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        ) : (
          rowMarkup
        )}
      </IndexTable>
      <PaginationTable
        index={index}
        type={"products"}
        total={productCount?.count}
      />
    </>
  );
});
