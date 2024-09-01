import { Button } from "primereact/button";
import { MetadataPayload } from "../utils/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import Link from "next/link";
import useRefreshToken from "../hooks/useRefreshToken";
import { useRef, useState } from "react";
import { useAuthContext } from "../contexts/authContext";

interface MetadataListProps {
  loading: boolean;
  singleMetadataLoading: boolean;
  setShowMetadataModal: (value: boolean) => void;
  updateMetadataList: (value: string) => void;
  removeFromMetadataList: (value: string) => void;
  metadataList: MetadataPayload[];
}

export default function MetadataList({
  loading,
  setShowMetadataModal,
  metadataList,
  updateMetadataList,
  removeFromMetadataList,
  singleMetadataLoading,
}: MetadataListProps) {
  const { user } = useAuthContext();
  const isAdmin = user?.designation === "admin";

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
            isAdmin
              ? iconsAdminBodyTemplate(
                  rowData,
                  removeFromMetadataList,
                  singleMetadataLoading
                )
              : iconsBodyTemplate(
                  rowData,
                  removeFromMetadataList,
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
        disabled={loading || rowData.status !== "pending"}
        onClick={() => handleDelete()}
      />
      <Link href={rowData.file} target="blank">
        <Button icon="pi pi-download" className="w-10 h-10" disabled={false} />
      </Link>
    </div>
  );
}

function iconsAdminBodyTemplate(
  rowData: any,
  removeFromMetadataList: (value: string) => void,
  loading: boolean
) {
  const privateApi = useRefreshToken();
  const toast = useRef<Toast>(null);

  async function handleApprove() {
    const id = rowData.id;
    try {
      await privateApi.patch(`/metadata/unpublished/${id}/`, {
        status: "approved",
      });

      removeFromMetadataList(id);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Metadata approved successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error approving metadata",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    }
  }

  async function handleReject() {
    const id = rowData.id;
    try {
      await privateApi.patch(`/metadata/unpublished/${id}/`, {
        status: "rejected",
      });

      removeFromMetadataList(id);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Metadata rejected successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error rejecting metadata",
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
      {/* <Link href={rowData.file} target="blank"> */}
      <Button icon="pi pi-download" className="w-10 h-10" disabled={loading} />
      {/* </Link> */}
    </div>
  );
}
