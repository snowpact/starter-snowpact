/* eslint-disable @typescript-eslint/no-unused-vars */
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    disableColumnClick?: boolean;
    disableColumnPadding?: boolean;
    center?: boolean;
    width?: string;
  }
}
