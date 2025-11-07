import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
} from '@shopify/polaris';
import { useQuery } from "react-query";
import { formatDate } from '../../helper/formatDate'
import { useState, useCallback, useEffect } from 'react';
import { useFetchApi } from '../../hooks/useFetchApi'
import { STATUS_ROLES, LIMIT } from '../../const';
import {
  PlusIcon
} from '@shopify/polaris-icons';
import { Button, Modal, TextField } from '@shopify/polaris';
import { Pagination } from '@shopify/polaris';
import ModalAddRule from './ModalAddRule';
import { useAppBridge } from '@shopify/app-bridge-react';
export function RoleTable() {
  const [index, setIndex] = useState(0)
  const { handleFetchApi } = useFetchApi()

  const shopify = useAppBridge();
  const {
    data,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["roles", index],
    queryFn: async () => handleFetchApi(`roles?index=${index}`),
  });
  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([]);

  useEffect(() => {
    if (data?.roles?.length !== undefined && data?.total !== undefined) {
      setItemStrings([`Show ${data.roles.length} of ${data.total} rules`,]);
    } console.log(data);
  }, [data]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };
  const listRules = data?.roles ?? [];
  console.log(listRules);
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
    { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
    { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
    { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
    { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
    { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
    { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
    { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
  ];
  const [sortSelected, setSortSelected] = useState(['order asc']);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => { };



  const primaryAction = {

  };

  const [queryValue, setQueryValue] = useState('');

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );


  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

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
          <Text numeric as="span" >
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
      </IndexTable.Row>
    ),
  );

  return (
    <LegacyCard >
      <div style={{ width: '100%', display: "flex", justifyContent: "end", padding: "8px 12px 3px 8px" }}>
        <Button icon={PlusIcon} primary onClick={() => shopify.modal.show('my-modal')}>Add Rule</Button>
      </div>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setQueryValue('')}
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
        resourceName={resourceName}
        itemCount={listRules.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'ID' },
          { title: 'Name' },
          { title: 'Status' },
          { title: 'Priority', alignment: 'start' },
          { title: 'Create Date' },
          { title: 'Update Date' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
      <div
        style={{
          maxWidth: '100%',
          display: "flex",
          justifyContent: "center",
          padding: "8px 0px",
          margin: 'auto',

        }}
      >
        <Pagination
          onPrevious={() => {
            console.log('Previous');
          }}
          onNext={() => {
            console.log('Next');
          }}
          type="table"
          hasNext
          label={`${index * LIMIT + 1}-${Math.min((index + 1) * LIMIT, data?.total)} of ${data?.total} rules`}
        />
      </div>
      <ModalAddRule />
    </LegacyCard>
  );
}