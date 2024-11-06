"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import AppIcon from "../AppIcon";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { DateRangePicker } from "./DateRangePicker";

export default function DataTable({ apiUrl }) {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = apiUrl;
      if (dateRange.from && dateRange.to) {
        url += `?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const jsonData = await response.json();
      setData(jsonData.data || jsonData);

      const apiColumns =
        jsonData.columns || generateColumnsFromData(jsonData);
      setColumns([
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...apiColumns,
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateColumnsFromData = (data) => {
    if (data.length > 0) {
      const firstItem = data[0];
      return Object.keys(firstItem).flatMap((key) => {
        if (typeof firstItem[key] === "object" && firstItem[key] !== null) {
          return generateColumnsFromData([firstItem[key]]).map((col) => ({
            ...col,
            accessorKey: `${key}.${col.accessorKey}`,
            header: `${key.toUpperCase()}: ${col.header}`,
          }));
        } else {
          return {
            accessorKey: key,
            header: key.toUpperCase(),
            meta: {},
          };
        }
      });
    }
    return [];
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isAnyRowSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected();

  const handleRowClick = (row) => {
    const columnWithNavigation = columns.find(
      (col) => col.meta && col.meta.navigationUrl
    );

    if (columnWithNavigation) {
      const navigationUrl = columnWithNavigation.meta.navigationUrl;
      const detailUrl = navigationUrl.replace("[id]", row.original.id);
      router.push(detailUrl);
    }
  };

  const handleDelete = async () => {
    const selectedRowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedRowIds.length === 0) {
      alert("No rows selected.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedRowIds }),
      });

      if (!response.ok) {
        toast.error("Failed to delete selected rows!");
        throw new Error("Failed to delete items.");
      }

      setRowSelection({});
      toast.success("Deleted Selected Rows Successfully!");
      await fetchData();
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
      alert("Error deleting items: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full bg-background p-1 md:p-4 my-3 rounded-md shadow-md">
      <div className="flex justify-end p-2 overflow-x-hidden w-full md:p-0">
        <DateRangePicker onDateChange={setDateRange} />
      </div>
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Search all columns..."
          value={(table.getState().globalFilter ?? "") || ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm bg-white dark:bg-gray-800 text-black dark:text-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    className="dark:hover:bg-gray-600 capitalize cursor-pointer"
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.meta?.displayName || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isAnyRowSelected && (
        <div className="p-2 flex flex-wrap items-center gap-2">
          <button disabled={loading} onClick={handleDelete}>
            <AppIcon icon="Trash2" className="w-6 h-6 text-red-500" />
          </button>
        </div>
      )}
      <div className="rounded-md border border-gray-300 dark:border-gray-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.meta?.displayName ||
                              header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`text-black dark:text-white ${
                        cell.column.id !== "select" && "h-full"
                      }`}
                    >
                      {cell.column.columnDef.meta?.navigationUrl ? (
                        <div onClick={() => handleRowClick(row)}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {loading && (
                  <TableRow>
                    {[...Array(5)].map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton className="w-7 md:w-10 h-5" />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
        {!loading && (!data || data.length === 0) && (
          <div className="w-full flex font-medium justify-center mx-auto text-center py-6 items-center">
            Nothing to show here.
          </div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground dark:text-gray-400">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
