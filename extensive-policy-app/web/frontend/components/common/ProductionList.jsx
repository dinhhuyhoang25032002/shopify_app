import {
  Card,
  Page,
  Layout,
  Thumbnail,
  Image,
  DataTable,
  Link,
  Text,
  IndexTable,
  useIndexResourceState,
  Spinner,
} from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import { useQuery } from "react-query";
import { useFetchApi } from "../../hooks/useFetchApi";
import { DISCOUNT_TYPE, LIMIT, STATUS_RULES } from "../../const";
import { memo, useEffect, useState } from "react";
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
  const [cursorStack, setCursorStack] = useState([]);
  const currentCursor = cursorStack[cursorStack.length - 1] ?? null;

  const { data:productData, isLoading } = useQuery({
    queryKey: ["products", activeTags, currentCursor],
    queryFn: async () => {
      const last = currentCursor || undefined;
      const query = `products?${params.toString()}${
        last ? `&last=${last}` : ""
      }`;
      return handleFetchApi(query);
    },
    // enabled: !!params.toString()|| ,
  });
  console.log("ProductionList is here!", value);

  // const { data, isLoading } = useQuery({
  //   queryKey: ["products", activeTags, index],
  //   queryFn: async () => {
  //     const lastId = index > 0 ? data.pageInfo.endCursor : undefined;
  //     const query = `products?${params.toString()}${
  //       lastId ? `&last=${lastId}` : ""
  //     }`;
  //     return handleFetchApi(query);
  //   },
  // });

  const { data: productCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ["productCount"],
    queryFn: async () => {
      const response = await fetch("/api/products/count");
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(productData ?? []);
  const rowMarkup = productData?.items.map(({ id, title, image, price }, index) => {
    // ✅ Compute modified price
    let modifiedPrice = price;
    if (status === STATUS_RULES.ENABLE) {
      switch (discountType) {
        case DISCOUNT_TYPE.FIXED:
          modifiedPrice = price - value;
          break;

        case DISCOUNT_TYPE.PERCENT:
          // Kiểm tra giá trị percent hợp lệ
          if (value > 0 && value <= 100) {
            modifiedPrice = price - (price * value) / 100;
          } else {
            modifiedPrice = "-"; // hoặc null
          }
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
          <Text alignment="center">${parseFloat(price).toFixed(2)}</Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text
            alignment="center"
            tone={status === STATUS_RULES.ENABLE ? "success" : "critical"}
            fontWeight={status === STATUS_RULES.ENABLE ? "bold" : "regular"}
          >
            {modifiedPrice === "-"
              ? "-"
              : `$${parseFloat(modifiedPrice).toFixed(2)}`}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  // if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <IndexTable
        itemCount={isLoading ? 1 : productData?.items.length}
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
          { title: "Original Price", alignment: "center" },
          { title: "Modified Price", alignment: "center" },
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
      {!isLoadingCount && (
        <PaginationTable
          index={index}
          onNext={() => {
            if (productData.pageInfo?.hasNextPage) {
              setCursorStack((prev) => [...prev, productData.pageInfo.endCursor]);
            }
          }}
          onPrevious={() => {
            setCursorStack((prev) => prev.slice(0, -1));
          }}
          disableNext={!productData?.pageInfo?.hasNextPage}
          disablePrev={cursorStack.length === 0}
          pageSize={LIMIT}
          type={"products"}
          total={productCount?.count}
        />
      )}
    </>
  );
});
