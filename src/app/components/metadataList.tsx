import { Button } from "primereact/button";
import { MetadataPayload } from "../utils/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import Link from "next/link";
import useRefreshToken from "../hooks/useRefreshToken";
import { useRef, useState } from "react";

interface MetadataListProps {
  loading: boolean;
  singleMetadataLoading: boolean;
  setShowMetadataModal: (value: boolean) => void;
  updateMetadataList: (value: string) => void;
  metadataList: MetadataPayload[];
}

export default function MetadataList({
  loading,
  setShowMetadataModal,
  metadataList,
  updateMetadataList,
  singleMetadataLoading,
}: MetadataListProps) {
  function showMetadataModal() {
    setShowMetadataModal(true);
  }

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Metadata</p>
        <Button
          icon="pi pi-plus"
          label="Add Metadata"
          onClick={showMetadataModal}
          outlined
        />
      </div>
      <DataTable
        value={metadataList}
        paginator
        rows={6}
        dataKey="id"
        style={{ backgroundColor: "red" }}
        loading={loading}
        emptyMessage="No metadata found"
      >
        <Column
          field="title"
          header="Title"
          filter
          style={{ backgroundColor: "white" }}
          filterPlaceholder="Search by title"
          body={titleBodyTemplate}
        />
        <Column
          field="period"
          header="Collection Period"
          body={collectionPeriodBodyTemplate}
        />
        <Column field="lake" header="Selected Lakes" body={lakeBodyTemplate} />
        <Column
          field="approved"
          header="Approval Status"
          body={approvedBodyTemplate}
        />
        <Column
          header="Actions"
          body={(rowData) =>
            iconsBodyTemplate(
              rowData,
              updateMetadataList,
              singleMetadataLoading
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

function collectionPeriodBodyTemplate(rowData: any) {
  return (
    <div className="flex items-center space-x-1">
      <p className="text-gray-600 text-sm mt-1">{rowData.period}</p>
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

function approvedBodyTemplate(rowData: any) {
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

function iconsBodyTemplate(
  rowData: any,
  updateMetadataList: (value: string) => void,
  loading: boolean
) {
  function handleDelete() {
    updateMetadataList(rowData.id);
  }

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        disabled={loading}
        onClick={() => handleDelete()}
      />
      <Link href={rowData.file} target="blank">
        <Button icon="pi pi-download" className="w-10 h-10" disabled={false} />
      </Link>
    </div>
  );
}
