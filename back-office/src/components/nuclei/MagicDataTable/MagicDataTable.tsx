import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MagicDataTableProps, TableAction } from './types';
import { printValue } from './utils';

import { Tooltip } from '@/components/atoms/Tooltip';
import { useConfirm } from '@/components/molecules/ConfirmDialog/ConfirmDialogProvider';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/shadcn/button';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';

export const MagicDataTable = <T extends Record<string, unknown>, K>({
  queryKey,
  fetchAllItemsEndpoint,
  columnConfig,
  actions,
  ...props
}: MagicDataTableProps<T, K>) => {
  const { confirm } = useConfirm();
  const { t } = useTranslation();

  const { data: items = [], isLoading } = useApiQuery<T[]>([queryKey], async () => {
    const response = await fetchAllItemsEndpoint();
    return { data: response };
  });

  const { mutate: mutateEndpoint } = useApiMutation<
    K,
    { item: T; endpoint: (item: T) => Promise<K> }
  >(async params => {
    const data = await params.endpoint(params.item);
    return { data };
  });

  const handleAction = async (action: TableAction<T, K>, item: T) => {
    if (action.type === 'endpoint') {
      if (action.confirm) {
        const confirmed = await confirm({
          title: action.confirm.title,
          description: action.confirm.description,
          confirmText: action.confirm.confirmText,
          cancelText: action.confirm.cancelText,
        });

        if (!confirmed) return;
      }

      mutateEndpoint(
        {
          item: item,
          endpoint: action.endpoint,
        },
        {
          onError: (error, variables, context) => action.onError?.(error, variables.item, context),
          onSuccess: (data, variables, context) =>
            action.onSuccess?.(data, variables.item, context),
        }
      );
    } else {
      action.onClick(item);
    }
  };

  const columns = useMemo<ColumnDef<T, unknown>[]>(() => {
    const columns = columnConfig
      .filter(column => !column.hidden)
      .map(column => ({
        accessorKey: column.key as string,
        header: column.label ?? t(`data.${column.key as string}`),
        enableSorting: column.sortable ?? true,
        cell: ({ row }: { row: { original: T } }) => {
          const value = row.original[column.key];
          return column.render ? column.render(row.original) : printValue(value);
        },
      })) as ColumnDef<T, unknown>[];

    if (actions?.length) {
      columns.push({
        accessorKey: 'actions',
        header: '',
        meta: {
          width: '140px',
        },
        enableSorting: false,
        cell: ({ row }: { row: { original: T } }) => (
          <div className="flex gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip content={action.label} key={`${row.original.id}-${action.label}-${index}`}>
                  <Button
                    size="icon"
                    variant={action.variant}
                    onClick={() => handleAction(action, row.original)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Tooltip>
              );
            })}
          </div>
        ),
      });
    }

    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnConfig, actions]);

  return <DataTable columns={columns} data={items} isLoading={isLoading} {...props} />;
};
