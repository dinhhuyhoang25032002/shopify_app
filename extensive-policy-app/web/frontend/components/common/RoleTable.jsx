import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
} from '@shopify/polaris';
import { formatDate } from '../../helper/formatDate'
import { useState, useCallback, useEffect } from 'react';
import { useFetchApi } from '../../hooks/useFetchApi'
import { STATUS_ROLES, LIMIT } from '../../const';
import { useNavigate } from "react-router-dom";
import {
  PlusIcon
} from '@shopify/polaris-icons';
import { Button } from '@shopify/polaris';
import { Pagination, Spinner } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useDebounce } from '../../hooks/useDebounce';
import {
  DuplicateIcon, EditIcon, DeleteIcon
} from '@shopify/polaris-icons';

export function RoleTable({
  setEditting,
  rules,
  isLoadingCount,
  refetchRules,
  index,
  setIndex, setRuleEdit,
  total,
}) {

  const { handleFetchApi } = useFetchApi()
  const navigate = useNavigate();
  const [sortSelected, setSortSelected] = useState(['id asc']);
  const shopify = useAppBridge()
  const [search, setSearch] = useState(null);
  const debouncedValue = useDebounce(search);
  const [searchData, setSearchData] = useState(null);
  const [isSearching, setSearching] = useState(false)
  const [isLoadingSearch, setLoadingSearch] = useState(false)

  let listRules;
  if (isSearching) {
    listRules = searchData ?? [];   // searchData luôn là array
  } else {
    listRules = rules ?? [];  // default từ useQuery
  }
  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([]);

  useEffect(() => {
    if (rules.length !== undefined && total !== undefined) {
      setItemStrings([`Show ${rules.length} of ${total} rules`,]);
    }
  }, [rules, total]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

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
  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
          {
            type: 'rename',
            onAction: () => { },
            onPrimaryAction: async (value) => {
              const newItemsStrings = tabs.map((item, idx) => {
                if (idx === index) {
                  return value;
                }
                return item.content;
              });
              await sleep(1);
              setItemStrings(newItemsStrings);
              return true;
            },
          },
          {
            type: 'duplicate',
            onPrimaryAction: async (value) => {
              await sleep(1);
              duplicateView(value);
              return true;
            },
          },
          {
            type: 'edit',
          },
          {
            type: 'delete',
            onPrimaryAction: async () => {
              await sleep(1);
              deleteView(index);
              return true;
            },
          },
        ],
  }));
  const [selected, setSelected] = useState(0);

  const sortOptions = [
    // { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
    // { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
    // { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
    // { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    { label: 'ID', value: 'id asc', directionLabel: 'Ascending' },
    { label: 'ID', value: 'id desc', directionLabel: 'Descending' },
    { label: 'Priority', value: 'priority asc', directionLabel: 'Ascending' },
    { label: 'Priority', value: 'priority desc', directionLabel: 'Descending' },
  ];

  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => { };

  const primaryAction = {

  };
  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedValue) {
        setSearchData(null); // nếu xoá search thì reset về list gốc
        setSearching(false);
        return;
      }
      setSearching(true)
      try {
        setLoadingSearch(true)
        const result = await handleFetchApi(`roles/search?name=${debouncedValue}`);
        setSearchData(result);
      } catch (error) {
        throw error
      } finally {
        setLoadingSearch(false)
      }
    };

    fetchSearch();
  }, [debouncedValue]);

  const handleFiltersQueryChange = useCallback(
    async (value) => {
      setSearch(value)
    },
    [],
  );


  // const resourceName = {
  //   singular: 'order',
  //   plural: 'orders',
  // };
  const handleDuplicateRule = async (id) => {
    try {
      await handleFetchApi(`/role/${id}`, { method: "POST" })
    } catch (error) {
      throw error
    } finally {
      shopify.toast.show("Created Copy Rule.")
      await refetchRules()
    }
  }

  const handleDeleteRule = async (id) => {
    try {
      await handleFetchApi(`/role/${id}`, { method: "DELETE" })
    } catch (error) {
      throw error
    } finally {
      shopify.toast.show("Deleted Rule successfully.")
      await refetchRules()
    }
  }

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(listRules);
  const rowMarkup = listRules.map(
    (
      { id, name, priority, createdAt, updatedAt, status },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text as="span" >
            {id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell >
          <Text numeric as="span" fontWeight="bold">
            {name}
          </Text></IndexTable.Cell>
        <IndexTable.Cell >
          <Badge tone={status === STATUS_ROLES.ENABLE ? "success" : "warning"}>{status}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text numeric alignment='start'>
            {priority}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{formatDate(createdAt)}</IndexTable.Cell>
        <IndexTable.Cell>{formatDate(updatedAt)}</IndexTable.Cell>
        <IndexTable.Cell >
          <div style={{
            display: "flex", justifyContent: "center", width: "100%", alignItems: "center", gap: 5
          }
          }>
            <Button icon={EditIcon} accessibilityLabel="Edit Role" disabled={allResourcesSelected} onClick={(e) => {
              e.stopPropagation()
              setRuleEdit(id)
              setEditting(true)
            }} />
            <Button icon={DuplicateIcon} accessibilityLabel="Duplicate Role" onClick={(e) => {
              e.stopPropagation()
              handleDuplicateRule(id)
            }} />
            <Button icon={DeleteIcon} accessibilityLabel="Delete Role" onClick={(e) => {
              e.stopPropagation()
              handleDeleteRule(id)
            }} />
          </div></IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  console.log(allResourcesSelected);

  return (
    <Card >
      <div style={{ width: '100%', display: "flex", justifyContent: "end", padding: "8px 12px 3px 8px" }}>
        <Button icon={PlusIcon} variant="primary" onClick={() => navigate("/rule")}>Add Rule</Button>
      </div>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={search}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setSearch('')}
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
        onClearAll={() => { }}
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
          { title: 'ID' },
          { title: 'Name' },
          { title: 'Status' },
          { title: 'Priority', alignment: 'start' },
          { title: 'Create Date' },
          { title: 'Update Date' },
          { title: "Actions", alignment: 'center' }
        ]}
      >
        {(isLoadingCount || isLoadingSearch) ? (
          <IndexTable.Row>
            <IndexTable.Cell colSpan={6}>
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
        <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
          <Pagination
            onPrevious={() => setIndex((p) => Math.max(p - 1, 0))}
            onNext={() => setIndex((p) => p + 1)}
            hasNext
            label={`${index * LIMIT + 1}-${Math.min((index + 1) * LIMIT, total) || 0} of ${total ?? 0} rules`}
          />
        </div>
      )}
    </Card>
  );
}