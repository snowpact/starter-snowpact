/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import React from 'react';

import { useConfirm } from '@/components/molecules/ConfirmDialog/ConfirmDialogProvider';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/shadcn/button';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const DATA: Person[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    visits: 10,
    status: 'active',
    progress: 50,
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 25,
    visits: 5,
    status: 'inactive',
    progress: 25,
  },
];

export const DEFAULT_SORTING_EMAIL: SortingState = [
  {
    id: 'firstName',
    desc: false,
  },
];

export const configurePersonColumns = ({
  handleDelete,
}: {
  handleDelete: (person: Person) => void;
}): ColumnDef<Person, any>[] => {
  const columnHelper = createColumnHelper<Person>();

  const defaultColumns = [
    columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      footer: props => props.column.id,
    }),
    columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => info.getValue(),
      header: () => <span>Last Name</span>,
      footer: props => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: props => props.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: props => props.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: props => props.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: props => props.column.id,
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        const person = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(person)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    }),
  ];

  return defaultColumns;
};

export const ExampleDataTable: React.FC = () => {
  const { confirm } = useConfirm();

  const handleDelete = async (person: Person) => {
    const confirmed = await confirm({
      title: 'Supprimer la personne',
      description: `Êtes-vous sûr de vouloir supprimer ${person.firstName} ${person.lastName} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
    });

    if (confirmed) {
      // TODO: Implement delete logic here
      console.log('Deleting person:', person);
    }
  };

  return (
    <DataTable
      displayTotalNumber
      enableGlobalSearch
      data={DATA}
      defaultSortingState={DEFAULT_SORTING_EMAIL}
      columns={configurePersonColumns({ handleDelete })}
      enablePagination
    />
  );
};
