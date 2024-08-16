import { Button } from "primereact/button";
import { ProjectPayload } from "../utils/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ProjectListProps {
  loading: boolean;
  singleProjectLoading: boolean;
  setShowProjectModal: (value: boolean) => void;
  updateProjectList: (value: string) => void;
  projectList: ProjectPayload[];
}

export default function ProjectList({
  loading,
  setShowProjectModal,
  projectList,
  updateProjectList,
  singleProjectLoading,
}: ProjectListProps) {
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
            actionsBodyTemplate(
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
    <div className="flex items-center space-x-2 ">
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
        disabled={loading}
        onClick={() => handleDelete()}
      />
    </div>
  );
}
