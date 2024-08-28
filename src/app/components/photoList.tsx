import { Button } from "primereact/button";
import { PhotoPayload } from "../utils/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import Link from "next/link";

interface PhotoListProps {
  loading: boolean;
  singlePhotoLoading: boolean;
  setShowPhotoModal: (value: boolean) => void;
  updatePhotoList: (value: string) => void;
  photoList: PhotoPayload[];
}

export default function PhotoList({
  loading,
  setShowPhotoModal,
  photoList,
  updatePhotoList,
  singlePhotoLoading,
}: PhotoListProps) {
  function showPhotoModal() {
    setShowPhotoModal(true);
  }

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Photos</p>
        <Button
          icon="pi pi-plus"
          label="Add Photo"
          onClick={showPhotoModal}
          outlined
        />
      </div>
      <DataTable
        value={photoList}
        paginator
        rows={6}
        dataKey="id"
        loading={loading}
        emptyMessage="No photos found"
      >
        <Column field="image" header="Image" body={imageBodyTemplate} />
        <Column
          field="description"
          header="Description"
          body={descriptionBodyTemplate}
        />
        <Column field="lake" header="Lake" body={lakeBodyTemplate} />
        <Column
          field="capture_date"
          header="Capture Date"
          body={dateBodyTemplate}
        />
        <Column field="uploader" header="Uploader" />
        <Column
          header="Actions"
          body={(rowData) =>
            actionsBodyTemplate(rowData, updatePhotoList, singlePhotoLoading)
          }
        />
      </DataTable>
    </div>
  );
}

function descriptionBodyTemplate(rowData: PhotoPayload) {
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

function lakeBodyTemplate(rowData: PhotoPayload) {
  return (
    <div className="flex items-center space-x-2 ">
      <div className="flex items-center" key={rowData.lake}>
        <p className="text-gray-600 text-sm mt-1">{rowData.lake}</p>
      </div>
    </div>
  );
}

function dateBodyTemplate(rowData: PhotoPayload) {
  return (
    <div className="flex items-center space-x-1">
      <p className="text-gray-600 text-sm mt-1">
        {new Date(rowData.capture_date).toLocaleDateString()}
      </p>
    </div>
  );
}

function imageBodyTemplate(rowData: PhotoPayload) {
  return (
    <div className="flex items-center">
      <Image src={rowData.image} alt={rowData.description} width="80" preview />
    </div>
  );
}

function actionsBodyTemplate(
  rowData: PhotoPayload,
  updatePhotoList: (value: string) => void,
  loading: boolean
) {
  function handleDelete() {
    updatePhotoList(rowData.id);
  }

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        disabled={loading}
        onClick={() => handleDelete()}
      />
      <Link href={rowData.image} target="blank">
        <Button icon="pi pi-download" className="w-10 h-10" disabled={false} />
      </Link>
    </div>
  );
}
