import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageSizeSelector } from './PageSizeSelector';
import { Pagination, DEFAULT_PAGE_SIZES } from './Pagination';
import { SearchBar } from './SearchBar';
import { SortButton } from './SortButton';
import { fuzzyFilter } from './utils';

import { Skeleton } from '@/components/shadcn/skeleton';
import { cn } from '@/utils/common';

export type DataTableProps<T extends object> = {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  enableGlobalSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  displayTotalNumber?: boolean;
  enableElementLabel?: boolean;
  onRowClick?: (data: T) => void;
  advancedBarRightElement?: React.ReactNode;
  defaultSortingState?: SortingState;
  isLoading?: boolean;
  activeRowId?: string | number;
  texts?: {
    searchPlaceholder?: string;
    emptyTitle?: string;
    itemLabel?: string;
  };
};

export function DataTable<Data extends object>({
  data,
  columns,
  enableGlobalSearch,
  enablePagination = true,
  enableSorting = true,
  enableElementLabel = true,
  displayTotalNumber,
  onRowClick,
  advancedBarRightElement,
  defaultSortingState,
  isLoading,
  activeRowId,
  texts,
}: DataTableProps<Data>) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>(defaultSortingState ?? []);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: enablePagination
        ? {
            pageSize: DEFAULT_PAGE_SIZES[0],
          }
        : undefined,
    },
    state: {
      sorting: enableSorting ? sorting : undefined,
      globalFilter: enableGlobalSearch ? globalFilter : undefined,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    ...(enableGlobalSearch
      ? {
          onGlobalFilterChange: setGlobalFilter,
          getFilteredRowModel: getFilteredRowModel(),
          globalFilterFn: fuzzyFilter,
        }
      : {}),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  const displayAdvancedBar = enableGlobalSearch || displayTotalNumber || !!advancedBarRightElement;

  const itemCount = useMemo(() => {
    return table.getRowModel().rows.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, globalFilter]);

  return (
    <div className="flex flex-col flex-1">
      {displayAdvancedBar && (
        <div className="flex items-center justify-between py-4">
          {advancedBarRightElement && (
            <div className="flex justify-end">{advancedBarRightElement}</div>
          )}
          {displayTotalNumber && (
            <div className="text-sm text-muted-foreground">
              {itemCount} {texts?.itemLabel || t('dataTable.element.elements')}
            </div>
          )}
          {enableGlobalSearch && (
            <SearchBar
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder={texts?.searchPlaceholder || t('dataTable.search')}
              rightIcon={<Filter className="w-5 h-5 text-muted-foreground" />}
            />
          )}
          <PageSizeSelector table={table} enableElementLabel={enableElementLabel} />
        </div>
      )}

      <div className="rounded-lg border overflow-x-auto">
        <table className={cn('w-full text-sm table-fixed')}>
          <thead className="bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left align-middle text-muted-foreground',
                      enableSorting && 'cursor-pointer'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.columnDef?.meta?.width }}
                  >
                    {header.isPlaceholder ? null : (
                      <span className="flex gap-2 items-center">
                        {enableSorting && <SortButton column={header.column} />}
                        <h3>{flexRender(header.column.columnDef.header, header.getContext())}</h3>
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className={cn({ 'bg-muted/50': index % 2 === 1 })}>
                  {columns.map((_, colIndex) => (
                    <td key={`skeleton-table-${colIndex}`} className="px-4 py-3 align-middle">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : itemCount > 0 ? (
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={cn({
                    'hover:bg-accent/60': true,
                    'bg-muted/20': rowIndex % 2 === 1,
                    'bg-primary/10 hover:bg-primary/20': activeRowId === row.original.id,
                    'transition-all ease-in-out duration-300': true,
                  })}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      onClick={() =>
                        onRowClick &&
                        !cell.column.columnDef?.meta?.disableColumnClick &&
                        onRowClick(row.original)
                      }
                      className={cn({
                        'px-4 py-3 align-middle': true,
                        'cursor-pointer':
                          onRowClick && !cell.column.columnDef?.meta?.disableColumnClick,
                        'text-center': cell.column.columnDef?.meta?.center,
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <caption className="h-24 flex items-center justify-center text-muted-foreground w-full">
              {texts?.emptyTitle || t('dataTable.searchEmpty')}
            </caption>
          )}
        </table>
      </div>

      {enablePagination && <Pagination table={table} />}
    </div>
  );
}
