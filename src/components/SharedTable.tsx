'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface ColumnProps<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface SharedTableProps<T> {
  columns: ColumnProps<T>[];
  dataSource: T[];
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  actionsLabel?: string;
}

export default function SharedTable<T extends { id: string }>({
  columns,
  dataSource,
  onEdit,
  onDelete,
  actionsLabel = 'Actions',
}: SharedTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tint)]">
      <table className="w-full text-left border-collapse table-auto group/table">
        <thead>
          <tr className="border-b border-[var(--color-border)]/20">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)] font-semibold"
              >
                {col.title}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)] font-semibold text-right">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record) => (
            <tr
              key={record.id}
              className="border-b border-[var(--color-border)]/10 hover:bg-[var(--color-accent)]/[0.03] hover:!opacity-100 group/row transition-all duration-200 group-hover/table:opacity-60"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-[var(--color-fg)]">
                  {col.render ? col.render(record[col.dataIndex], record) : (record[col.dataIndex] as any)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-right text-sm">
                  {/* Actions visible only on row hover */}
                  <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(record)}
                        className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all duration-150 cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(record)}
                        className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-all duration-150 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {dataSource.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                className="px-6 py-12 text-center text-sm text-[var(--color-muted-fg)]"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
