import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

import { MagicDataTable } from '@/components/nuclei/MagicDataTable/MagicDataTable';
import { MagicColumnConfig } from '@/components/nuclei/MagicDataTable/types';

// Typings and endpoints
// ----------------------
type ExampleType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

const deleteExampleEnpoint = async (id: string): Promise<void> => {
  await axios.delete(`/example/${id}`);
};

export const getExamplesEndpoint = async (): Promise<ExampleType[]> => {
  // const { data } = await axios.get<XXXX>('/xxxx', {});
  const data = [
    {
      id: '1',
      title: 'Title',
      subtitle: 'Subtitle',
      description: 'Description',
    },
    {
      id: '2',
      title: 'Title 2',
      subtitle: 'Subtitle 2',
      description: 'Description 2',
    },
    {
      id: '3',
      title: 'Title 3',
      subtitle: 'Subtitle 3',
      description: 'Description 3',
    },
  ];

  return data;
};

// Real example
// ----------------------
const columnConfig: MagicColumnConfig<ExampleType>[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
  },
  {
    key: 'subtitle',
    label: 'Subtitle',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
    sortable: false,
  },
  {
    key: '_extra_0',
    label: 'Extra',
    sortable: false,
    render: item => (
      <div>
        {item.id} | {item.title}
      </div>
    ),
  },
];

interface ExampleMagicDataTableProps {
  onRowClick?: (item: ExampleType) => void;
}

export const ExampleMagicDataTable: React.FC<ExampleMagicDataTableProps> = ({ onRowClick }) => {
  return (
    <MagicDataTable
      queryKey="example"
      fetchAllItemsEndpoint={getExamplesEndpoint}
      columnConfig={columnConfig}
      actions={[
        {
          type: 'endpoint',
          icon: Trash2,
          label: 'Delete',
          endpoint: (item: ExampleType) => deleteExampleEnpoint(item.id),
          variant: 'destructive',
          confirm: {
            title: 'Delete Example Type',
            description: 'Are you sure you want to delete this example type?',
          },
        },
        {
          type: 'click',
          icon: Edit,
          label: 'Edit',
          onClick: (item: ExampleType) => onRowClick?.(item),
        },
      ]}
      enableGlobalSearch
      enablePagination
      enableSorting
    />
  );
};
