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
import { MySkill } from "@/types";
import { UserSkillForm } from "../forms/user-skill-form";
import DeleteModel from "../delete-model";
import { toast } from "@/hooks/use-toast";
import SkillBadge from "../skillbadge";

type RowData = {
  skill: {
    id: string;
    name: string;
    category: string;
  };
};

export function MySkillsTable() {
  const trpcUtils = api.useUtils();
  const [data, setData] = React.useState<MySkill[]>([]);
  const { data: skills } = api.userSkills.list.useQuery();

  const { mutate: deleteSkill, isPending } = api.userSkills.delete.useMutation({
    onSuccess: () => {
      void trpcUtils.userSkills.invalidate();
      toast({
        title: "Success",
        description: "Skill deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
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
          skill: {
            ...skill.skill,
            createdAt: skill.skill.createdAt.toISOString(),
            updatedAt: skill.skill.updatedAt.toISOString(),
          },
        })),
      );
    }
  }, [skills]);

  const columns: ColumnDef<MySkill>[] = [
    {
      accessorKey: "skill",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Skill
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const skill = row.getValue("skill") as RowData["skill"];
        return <div className="capitalize">{skill?.name}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        const skill = row.getValue(columnId) as RowData["skill"];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        return skill?.name.toLowerCase().includes(filterValue.toLowerCase());
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
        const skill = row.getValue("skill") as RowData["skill"];
        return <SkillBadge category={skill?.category.toLowerCase()} />;
      },
    },
    {
      accessorKey: "proficiencyLevel",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Proficiency Level
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("proficiencyLevel")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Added on At</div>,
      cell: ({ row }) => {
        const formatted = new Date(row?.original.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: () => <div className="text-right">Updated At</div>,
      cell: ({ row }) => {
        const formatted = new Date(row?.original.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end space-x-4">
            <UserSkillForm
              button={editButton}
              initialSkills={[
                {
                  skillId: row.original.skill.id,
                  id: row.original.id,
                  skillName: row.original.skill.name,
                  proficiencyLevel: row.original.proficiencyLevel as
                    | "BEGINNER"
                    | "INTERMEDIATE"
                    | "ADVANCED",
                },
              ]}
            />
            <DeleteModel
              button={deleteButton}
              isPending={isPending}
              onDelete={() => handleDelete(row.original.id)}
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
      <Plus /> Add Skill(s) To My Skills
    </Button>
  );

  const editButton = (
    <Button variant="outline" title="Edit">
      <Pencil />
    </Button>
  );

  const deleteButton = (
    <Button variant="outline">
      <Trash />
    </Button>
  );

  const handleDelete = (id: string) => {
    deleteSkill({ id });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <Input
          placeholder="Filter skills..."
          value={(table.getColumn("skill")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("skill")?.setFilterValue(value);
          }}
          className="max-w-sm"
        />
        <UserSkillForm button={addButton} />
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
