import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
} from "@shopify/polaris";
import { formatDate } from "../../helper/formatDate";
import { useState, useCallback, useEffect, memo } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { STATUS_RULES, LIMIT } from "../../const";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@shopify/polaris-icons";
import { Button } from "@shopify/polaris";
import { Spinner } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useDebounce } from "../../hooks/useDebounce";
import { DuplicateIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import PaginationTable from "./PaginationTable";

import ModalConfirmDeleteRule from "./ModalConfirmDeleteRule";

export default memo(function RuleTable({
  rules,
  isLoadingCount,
  refetchRules,
  index,
  setIndex,
  total,
}) {
  const { handleFetchApi } = useFetchApi();
  const navigate = useNavigate();
  const [sortSelected, setSortSelected] = useState([""]);
  const shopify = useAppBridge();
  const [search, setSearch] = useState(null);
  const debouncedValue = useDebounce(search);
  const [searchData, setSearchData] = useState(null);
  const [isSearching, setSearching] = useState(false);
  const [isLoadingSearch, setLoadingSearch] = useState(false);
  const [ruleDelete, setRuleDelete] = useState(null);
  let listRules;
  if (isSearching) {
    listRules = searchData ?? []; // searchData luôn là array
  } else {
    listRules = rules ?? []; // default từ useQuery
  }

  const [itemStrings, setItemStrings] = useState([]);

  useEffect(() => {
    if (rules.length !== undefined && total !== undefined) {
      setItemStrings([`Show ${rules.length} of ${total} rules`]);
    }
  }, [rules, total]);

  switch (sortSelected[0]) {
    case "id asc":
      listRules = [...listRules].sort((a, b) => a.id - b.id);
      break;

    case "id desc":
      listRules = [...listRules].sort((a, b) => b.id - a.id);
      break;

    case "priority asc":
      listRules = [...listRules].sort((a, b) => a.priority - b.priority);
      break;

    case "priority desc":
      listRules = [...listRules].sort((a, b) => b.priority - a.priority);
      break;
  }

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));
  const [selected, setSelected] = useState(0);

  const sortOptions = [
    { label: "ID", value: "id asc", directionLabel: "Ascending" },
    { label: "ID", value: "id desc", directionLabel: "Descending" },
    { label: "Priority", value: "priority asc", directionLabel: "Ascending" },
    { label: "Priority", value: "priority desc", directionLabel: "Descending" },
  ];

  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};
  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedValue) {
        setSearchData(null); // nếu xoá search thì reset về list gốc
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        setLoadingSearch(true);
        const result = await handleFetchApi(
          `rules/search?name=${debouncedValue}`
        );
        setSearchData(result);
      } catch (error) {
        throw error;
      } finally {
        setLoadingSearch(false);
      }
    };

    fetchSearch();
  }, [debouncedValue]);

  const handleFiltersQueryChange = useCallback(async (value) => {
    setSearch(value);
  }, []);

  const handleDuplicateRule = async (id) => {
    try {
      await handleFetchApi(`/rules/${id}/duplication`, {
        method: "PUT",
      });
      shopify.toast.show("Created Copy Rule.");
      await refetchRules();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteRule = async (id, name) => {
    setRuleDelete({ id, name });
    shopify.modal.show("confirm-delete-modal");
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(listRules);
  const rowMarkup = listRules.map(
    ({ id, name, priority, createdAt, updatedAt, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span">{id}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text numeric as="span" fontWeight="bold">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="center">
            <Badge
              tone={status === STATUS_RULES.ENABLE ? "success" : "warning"}
            >
              {status}
            </Badge>
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text numeric alignment="center">
            {priority}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{formatDate(createdAt)}</IndexTable.Cell>
        <IndexTable.Cell>{formatDate(updatedAt)}</IndexTable.Cell>
        <IndexTable.Cell>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Button
              icon={EditIcon}
              accessibilityLabel="Edit Role"
              disabled={allResourcesSelected}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rules/${id}`);
              }}
            />
            <Button
              icon={DuplicateIcon}
              accessibilityLabel="Duplicate Role"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateRule(id);
              }}
            />
            <Button
              icon={DeleteIcon}
              accessibilityLabel="Delete Role"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRule(id, name);
              }}
            />
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Card>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          padding: "8px 12px 3px 8px",
        }}
      >
        <Button
          icon={PlusIcon}
          variant="primary"
          onClick={() => navigate("/rules/create")}
        >
          Add Rule
        </Button>
      </div>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={search}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setSearch("")}
        onSort={setSortSelected}
        //    primaryAction={primaryAction}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        filters={[]}
        appliedFilters={[]}
        onClearAll={() => {}}
        mode={mode}
        setMode={setMode}
        hideFilters
        filteringAccessibilityTooltip="Search (F)"
      />
      <IndexTable
        itemCount={isLoadingCount || isLoadingSearch ? 1 : listRules.length}
        selectedItemsCount={
          isLoadingCount || isLoadingSearch
            ? 0
            : allResourcesSelected
            ? "All"
            : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "ID" },
          { title: "Name" },
          { title: "Status", alignment: "center" },
          { title: "Priority", alignment: "center" },
          { title: "Create Date" },
          { title: "Update Date" },
          { title: "Actions", alignment: "center" },
        ]}
      >
        {isLoadingCount || isLoadingSearch ? (
          <IndexTable.Row>
            <IndexTable.Cell colSpan={7}>
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
      {!isLoadingCount && !isLoadingSearch && (
        <PaginationTable
          index={index}
          onNext={() => setIndex((p) => p + 1)}
          onPrevious={() => setIndex((p) => Math.max(p - 1, 0))}
          total={total}
          pageSize={LIMIT}
          disableNext={(index + 1) * LIMIT >= total}
          disablePrev={index === 0}
          type={"Rules"}
        />
      )}
      <ModalConfirmDeleteRule
        refetchRules={refetchRules}
        ruleDelete={ruleDelete}
      />
    </Card>
  );
});
