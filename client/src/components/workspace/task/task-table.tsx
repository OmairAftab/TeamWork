import { FC, useState } from "react";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/table";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./table/table-faceted-filter";
import { priorities, statuses } from "./table/data";
import useTaskTableFilter from "@/hooks/use-task-table-filter";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import {
  getAllMembersInWorkspaceQueryFn,
  getAllTasksQueryFn,
  getProjectsInWorkspaceQueryFn,
} from "@/lib/api";

type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  projectId?: string;
  filters: Filters;
  setFilters: SetFilters;
}

const TaskTable = () => {
  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useTaskTableFilter();
  const columns = getColumns(projectId);

  const activeProjectId = projectId || filters.projectId || undefined;

  const { data, isLoading } = useQuery({
    queryKey: [
      "workspaceTasks",
      workspaceId,
      activeProjectId,
      filters.keyword,
      filters.status,
      filters.priority,
      filters.assigneeId,
      pageNumber,
      pageSize,
    ],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        projectId: activeProjectId,
        keyword: filters.keyword,
        status: filters.status,
        priority: filters.priority,
        assignedTo: filters.assigneeId,
        pageNumber,
        pageSize,
      }),
    enabled: !!workspaceId,
  });

  const tasks = data?.tasks || [];
  const totalCount = data?.pagination?.totalCount || 0;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className="w-full relative">
      <DataTable
        isLoading={isLoading}
        data={tasks}
        columns={columns}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          totalCount,
          pageNumber,
          pageSize,
        }}
        filtersToolbar={
          <DataTableFilterToolbar
            isLoading={isLoading}
            projectId={projectId}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </div>
  );
};

const DataTableFilterToolbar: FC<DataTableFilterToolbarProps> = ({
  isLoading,
  projectId,
  filters,
  setFilters,
}) => {
  const workspaceId = useWorkspaceId();

  // Fetch projects for filter dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["workspaceProjects", workspaceId],
    queryFn: () => getProjectsInWorkspaceQueryFn({ workspaceId, pageSize: 100 }),
    enabled: !!workspaceId && !projectId,
  });

  // Fetch members for assignee filter dropdown
  const { data: membersData } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getAllMembersInWorkspaceQueryFn(workspaceId),
    enabled: !!workspaceId,
  });

  const projectOptions = (projectsData?.projects || []).map((p) => ({
    label: `${p.emoji || "📊"} ${p.name}`,
    value: p._id,
  }));

  const assigneeOptions = (membersData?.members || []).map((m) => ({
    label: m.userId?.name || "Member",
    value: m.userId?._id,
  }));

  const handleFilterChange = (key: keyof Filters, values: string[]) => {
    setFilters({
      ...filters,
      [key]: values.length > 0 ? values.join(",") : null,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2 lg:space-y-0">
      <Input
        placeholder="Filter tasks..."
        value={filters.keyword || ""}
        onChange={(e) =>
          setFilters({
            keyword: e.target.value || null,
          })
        }
        className="h-8 w-full lg:w-[250px]"
      />
      {/* Status filter */}
      <DataTableFacetedFilter
        title="Status"
        multiSelect={true}
        options={statuses}
        disabled={isLoading}
        selectedValues={filters.status?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("status", values)}
      />

      {/* Priority filter */}
      <DataTableFacetedFilter
        title="Priority"
        multiSelect={true}
        options={priorities}
        disabled={isLoading}
        selectedValues={filters.priority?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("priority", values)}
      />

      {/* Assigned To filter */}
      <DataTableFacetedFilter
        title="Assigned To"
        multiSelect={true}
        options={assigneeOptions}
        disabled={isLoading}
        selectedValues={filters.assigneeId?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("assigneeId", values)}
      />

      {!projectId && (
        <DataTableFacetedFilter
          title="Projects"
          multiSelect={false}
          options={projectOptions}
          disabled={isLoading}
          selectedValues={filters.projectId?.split(",") || []}
          onFilterChange={(values) => handleFilterChange("projectId", values)}
        />
      )}

      {Object.values(filters).some(
        (value) => value !== null && value !== ""
      ) && (
        <Button
          disabled={isLoading}
          variant="ghost"
          className="h-8 px-2 lg:px-3"
          onClick={() =>
            setFilters({
              keyword: null,
              status: null,
              priority: null,
              projectId: null,
              assigneeId: null,
            })
          }
        >
          Reset
          <X className="ml-1 w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default TaskTable;
