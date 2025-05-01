import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { DEFAULT_PAGE_SIZES } from './Pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';

export type PageSizeSelectorProps<Data extends object> = {
  table: Table<Data>;
  paginationSizes?: number[];
  enableElementLabel?: boolean;
};

export function PageSizeSelector<Data extends object>({
  table,
  paginationSizes = DEFAULT_PAGE_SIZES,
  enableElementLabel = true,
}: PageSizeSelectorProps<Data>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      {enableElementLabel && (
        <span className="text-sm text-muted-foreground">{t('dataTable.paginationSize')}</span>
      )}
      <Select
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={value => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paginationSizes.map((pageSize, index) => (
            <SelectItem key={pageSize + index} value={pageSize.toString()}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
