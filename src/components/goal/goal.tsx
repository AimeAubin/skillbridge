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
import { Goal } from "@/types";
import { toast } from "@/hooks/use-toast";
import SkillBadge from "../skill/skillbadge";
import DeleteModel from "../skill/delete-model";
import { GoalForm } from "./goalForm";
import NotesModal from "./notesModal";

type RowData = {
  skill: {
    id: string;
    name: string;
    category: string;
  };
};

export function Goals() {
  const trpcUtils = api.useUtils();
  const [data, setData] = React.useState<Goal[]>([]);
  const { data: goals } = api.goals.list.useQuery();
  const [selectedGoal, setSelectedGoal] = React.useState<string>("");

  const { mutate: complete, isPending: completing } =
    api.goals.complete.useMutation({
      onSuccess: () => {
        void trpcUtils.goals.invalidate();
        toast({
          title: "Success",
          description: "Goal completed successfully!",
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

  const handleComplete = ({
    id,
    status,
  }: {
    id: string;
    status: "ACTIVE" | "COMPLETED";
  }) => {
    complete({ goalId: id, status: status });
  };

  const { mutate: deleteGoal, isPending } = api.goals.delete.useMutation({
    onSuccess: () => {
      void trpcUtils.goals.invalidate();
      toast({
        title: "Success",
        description: "Goal deleted successfully!",
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
    if (goals) {
      setData(
        goals.map((goal) => ({
          ...goal,
          createdAt: goal.createdAt.toISOString(),
          updatedAt: goal.updatedAt.toISOString(),
          skill: {
            ...goal.skill,
            createdAt: goal.skill.createdAt.toISOString(),
            updatedAt: goal.skill.updatedAt.toISOString(),
          },
        })),
      );
    }
  }, [goals]);

  const columns: ColumnDef<Goal>[] = [
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
        return skill?.name.includes(filterValue);
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
        return <SkillBadge category={skill?.category} />;
      },
    },
    {
      accessorKey: "desiredProficiency",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Desired Proficiency
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="custom-capitalize">{row.getValue("desiredProficiency")}</div>
      ),
    },
    {
      accessorKey: "notes",
      header: () => <span>Notes</span>,
      cell: ({ row }) =>
        row.getValue("notes") === "" ? (
          <span className="mx-5">_</span>
        ) : (
          <NotesModal notes={row.getValue("notes")} />
        ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            className="pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) =>
        row?.original.status === "COMPLETED" ? (
          <div className=" text-green-600 custom-capitalize">
            {row.getValue("status")}
          </div>
        ) : (
          <div className="text-yellow-600 custom-capitalize">
            {row.getValue("status")}
          </div>
        ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Created At</div>,
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
            {row.original.status === "COMPLETED" ? null : (
              <Button
                className="mt-2 h-6 bg-slate-500 p-1"
                onClick={() => {
                  setSelectedGoal(row.original.id);
                  handleComplete({ id: row.original.id, status: "COMPLETED" });
                }}
              >
                {completing && row.original.id === selectedGoal
                  ? "Completing..."
                  : "Mark as completed"}
              </Button>
            )}
            <GoalForm
              button={editButton}
              initialSkills={{
                skillId: row.original.skill.id,
                id: row.original.id,
                notes: row.original.notes ?? "",
                desiredProficiency: row.original.desiredProficiency as
                  | "BEGINNER"
                  | "INTERMEDIATE"
                  | "ADVANCED",
              }}
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
    <Button>
      <Plus /> Create Goal
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
    deleteGoal({ goalId: id });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <Input
          placeholder="Filter Goals..."
          value={(table.getColumn("skill")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            table.getColumn("skill")?.setFilterValue(value);
          }}
          className="max-w-sm"
        />
        <GoalForm button={addButton} />
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
