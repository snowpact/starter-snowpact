import type { LucideIcon } from 'lucide-react';

import { DataTableProps } from '@/components/molecules/DataTable';
import { ButtonVariants } from '@/components/shadcn/button';

export type ErrorResponse = {
  message: string;
  status: number;
};

export type MagicColumnConfig<T extends object> = {
  key: keyof T | '_extra' | '_extra_x' | `_extra_${number}`;
  label?: string;
  hidden?: boolean;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

export type BaseAction = {
  icon: LucideIcon;
  label: string;
  variant?: ButtonVariants;
};

export type EndpointAction<T, K> = BaseAction & {
  type: 'endpoint';
  endpoint: (item: T) => Promise<K>;
  onSuccess?: (data: K, variables: T, context: unknown) => void;
  onError?: (error: ErrorResponse, variables: T, context: unknown) => void;
  confirm?: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
  };
};

export type ClickAction<T> = BaseAction & {
  type: 'click';
  onClick: (item: T) => void;
};

export type TableAction<T, K> = EndpointAction<T, K> | ClickAction<T>;

export type MagicDataTableProps<T extends Record<string, unknown>, K> = Omit<
  DataTableProps<T>,
  'columns' | 'data'
> & {
  queryKey: string;
  fetchAllItemsEndpoint: () => Promise<T[]>;
  columnConfig: MagicColumnConfig<T>[];
  actions?: TableAction<T, K>[];
};
