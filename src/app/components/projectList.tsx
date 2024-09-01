import { Button } from "primereact/button";
import { ProjectPayload } from "../utils/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import useRefreshToken from "../hooks/useRefreshToken";
import Link from "next/link";
import { useAuthContext } from "../contexts/authContext";

interface ProjectListProps {
  loading: boolean;
  singleProjectLoading: boolean;
  setShowProjectModal: (value: boolean) => void;
  updateProjectList: (value: string) => void;
  removeFromProjectList: (value: string) => void;
  projectList: ProjectPayload[];
}

export default function ProjectList({
  loading,
  setShowProjectModal,
  projectList,
  updateProjectList,
  removeFromProjectList,
  singleProjectLoading,
}: ProjectListProps) {
  const { user } = useAuthContext();
  const isAdmin = user?.designation === "admin";
  const toast = useRef<Toast>(null);

  function showProjectModal() {
    setShowProjectModal(true);
  }

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Projects</p>
        <Button
          icon="pi pi-plus"
          label="Add Project"
          onClick={showProjectModal}
          outlined
        />
      </div>
      <DataTable
        value={projectList}
        paginator
        rows={6}
        dataKey="id"
        loading={loading}
        emptyMessage="No projects found"
      >
        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
          body={titleBodyTemplate}
        />
        <Column
          field="description"
          header="Description"
          body={descriptionBodyTemplate}
        />
        <Column field="lake" header="Lake" body={lakeBodyTemplate} />
        <Column field="latitude" header="Latitude" />
        <Column field="longitude" header="Longitude" />
        <Column field="status" header="Status" body={statusBodyTemplate} />
        <Column
          header="Actions"
          body={(rowData) =>
            isAdmin
              ? actionsAdminBodyTemplate(
                  rowData,
                  removeFromProjectList,
                  singleProjectLoading
                )
              : actionsBodyTemplate(
                  rowData,
                  updateProjectList,
                  singleProjectLoading
                )
          }
        />
      </DataTable>
    </div>
  );
}

function titleBodyTemplate(rowData: any) {
  const title =
    rowData.title.length > 20
      ? rowData.title.slice(0, 20) + "..."
      : rowData.title;
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <i className="pi pi-book text-xs text-[#6366F1] mr-1" />
      <p className="text-gray-600 text-sm mt-1">{title}</p>
    </div>
  );
}

function descriptionBodyTemplate(rowData: any) {
  const description =
    rowData.description.length > 30
      ? rowData.description.slice(0, 30) + "..."
      : rowData.description;
  return (
    <div className="flex items-center space-x-1">
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  );
}

function lakeBodyTemplate(rowData: any) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center" key={rowData.lake}>
        <p className="text-gray-600 text-sm mt-1">{rowData.lake}</p>
      </div>
    </div>
  );
}

function statusBodyTemplate(rowData: any) {
  const status = rowData.status;
  let chipClass = "";
  let chipLabel = "";
  let iconClass = "";

  switch (status) {
    case "approved":
      chipClass =
        "bg-[#A0E6BA] text-[#237640] font-bold w-fit px-2 py-1 rounded-md text-sm";
      chipLabel = "Approved";
      iconClass = "pi pi-check text-green-600";
      break;
    case "pending":
      chipClass =
        "bg-[#F6DE95] text-[#816204] w-fit font-bold px-2 py-1 rounded-md text-sm";
      chipLabel = "Pending";
      iconClass = "pi pi-hourglass text-yellow-600";
      break;
    case "rejected":
      chipClass =
        "bg-[#F6B0D2] text-[#822854] w-fit font-bold px-2 py-1 rounded-md text-sm";
      chipLabel = "Rejected";
      iconClass = "pi pi-times text-red-600";
      break;
    default:
      break;
  }

  return <p className={chipClass}>{chipLabel}</p>;
}

function actionsBodyTemplate(
  rowData: any,
  updateProjectList: (value: string) => void,
  loading: boolean
) {
  function handleDelete() {
    updateProjectList(rowData.id);
  }

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        disabled={loading || rowData.status !== "pending"}
        onClick={() => handleDelete()}
      />
    </div>
  );
}

function actionsAdminBodyTemplate(
  rowData: any,
  removeFromProjectList: (value: string) => void,
  loading: boolean
) {
  const privateApi = useRefreshToken();
  const toast = useRef<Toast>(null);

  async function handleApprove() {
    const id = rowData.id;
    try {
      await privateApi.patch(`/projects/unpublished/${id}/`, {
        status: "approved",
      });

      removeFromProjectList(id);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Project approved successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error approving project",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    }
  }

  async function handleReject() {
    const id = rowData.id;
    try {
      await privateApi.patch(`/projects/unpublished/${id}/`, {
        status: "rejected",
      });

      removeFromProjectList(id);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Project rejected successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error rejecting project",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    }
  }

  return (
    <div className="flex gap-2">
      <Toast ref={toast} />
      <Button
        icon="pi pi-check"
        className="w-10 h-10 bg-green-500 border border-green-500 text-white hover:bg-green-600"
        disabled={rowData.status !== "pending" || loading}
        onClick={handleApprove}
      />
      <Button
        icon="pi pi-times"
        className="w-10 h-10 bg-red-500 text-white border border-red-500 hover:bg-red-600"
        disabled={rowData.status !== "pending" || loading}
        onClick={handleReject}
      />
    </div>
  );
}
