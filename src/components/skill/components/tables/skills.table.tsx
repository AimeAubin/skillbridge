"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash, ArrowUpDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { Skill } from "@/types";
import { UserSkillForm } from "../forms/user-skill-form";
import { toast } from "@/hooks/use-toast";
import SkillBadge from "../skillbadge";
import { SkillForm } from "../forms/skill-form";

export function SkillsTable() {
  const { data: skills } = api.skills.list.useQuery();
  const [data, setData] = React.useState<Skill[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    if (skills) {
      setData(
        skills.map((skill) => ({
          ...skill,
          createdAt: skill.createdAt.toISOString(),
          updatedAt: skill.updatedAt.toISOString(),
        })),
      );
    }
  }, [skills]);

  const columns: ColumnDef<Skill>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="lowercase">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <SkillBadge
            category={(row.getValue("category") as string).toLowerCase()}
          />
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: () => <div className="text-right">Added on At</div>,
    //   cell: ({ row }) => {
    //     const formatted = row?.original.createdAt
    //       ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
    //           year: "numeric",
    //           month: "long",
    //           day: "numeric",
    //         })
    //       : null;

    //     return <div className="text-right font-medium">{formatted}</div>;
    //   },
    // },
    {
      accessorKey: "updatedAt",
      header: () => <div className="text-right">Updated At</div>,
      cell: ({ row }) => {
        const formatted = row?.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null;

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end space-x-4">
            <SkillForm
              button={editButton}
              initialSkills={[
                {
                  id: row.original.id,
                  name: row.original.name,
                  category: row.original.category as
                    | "SOFTSKILLS"
                    | "TECHNICAL"
                    | "LEADERSHIP"
                    | "COMMUNICATION",
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

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

  const addButton = (
    <Button variant="outline">
      <Plus /> Add Skill
    </Button>
  );

  const editButton = (
    <Button variant="outline" title="Edit">
      <Pencil />
    </Button>
  );

  //   const deleteButton = (
  //     <Button variant="outline">
  //       <Trash />
  //     </Button>
  //   );

  //   //   const handleDelete = (id: string) => {
  //   //     deleteSkill({ id });
  //   //   };

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <Input
          placeholder="Filter skills..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("name")?.setFilterValue(value);
          }}
          className="max-w-sm"
        />
        <SkillForm button={addButton} />
      </div>
      <div className="rounded-md border">
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
                            header.column.columnDef.header,
                            header.getContext(),
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Result.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
