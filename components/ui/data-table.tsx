'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
}

interface CustomDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available.',
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  totalItems,
}: CustomDataTableProps<T>) {
  const isManualPagination = pageCount !== undefined && onPageChange !== undefined;
  const currentPage = pageIndex + 1;
  const totalPages = pageCount || 1;

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        {isLoading ? (
          <table className="w-full text-left text-xs min-w-max">
            <thead className="border-b border-border bg-muted/50 font-medium text-muted-foreground">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 whitespace-nowrap">
                      <div className="h-4 rounded-md bg-muted/70 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : data.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full text-left text-xs min-w-max">
            <thead className="border-b border-border bg-muted/50 font-medium text-muted-foreground">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="hover:bg-accent/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.cell(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Responsive Pagination Controls */}
      {isManualPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
          <div>
            Showing {data.length > 0 ? pageIndex * pageSize + 1 : 0} to{' '}
            {Math.min((pageIndex + 1) * pageSize, totalItems ?? 0)} of{' '}
            {totalItems ?? data.length} items
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={pageIndex <= 0 || isLoading}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>

            <span className="text-xs font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
