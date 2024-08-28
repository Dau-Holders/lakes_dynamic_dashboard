import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useArticles } from "../contexts/articlesContext";
import Link from "next/link";
import useRefreshToken from "../hooks/useRefreshToken";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../contexts/authContext";

export default function ArticleList() {
  const { articles, loading, dispatch } = useArticles();
  const { user } = useAuthContext();

  const isAdmin = user?.designation === "admin";

  function showArticlesModal() {
    dispatch({
      type: "SHOW_ARTICLES_MODAL",
    });
  }

  const buttonsBodyTemplate = isAdmin
    ? iconsAdminBodyTemplate
    : iconsBodyTemplate;

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Publications</p>
        <Button
          icon="pi pi-plus"
          label="Add Publication"
          onClick={showArticlesModal}
          outlined
        />
      </div>
      <DataTable
        value={articles}
        paginator
        rows={6}
        dataKey="id"
        loading={loading}
        emptyMessage="No publications found"
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
          field="publicationDate"
          header="Published"
          body={yearBodyTemplate}
        />
        <Column
          field="keywords"
          header="Keywords"
          body={keywordsBodyTemplate}
        />
        <Column
          field="selectedLakes"
          header="Selected Lakes"
          body={lakeBodyTemplate}
        />
        <Column
          field="approved"
          header="Approval Status"
          body={approvedBodyTemplate}
        />
        <Column header="Actions" body={buttonsBodyTemplate} />
      </DataTable>
    </div>
  );
}

function titleBodyTemplate(rowData: any) {
  const title =
    rowData.title.length > 20
      ? rowData.title.slice(0, 20) + "..."
      : rowData.title;

  const router = useRouter();

  function handleClick() {
    console.log("Title Clicked");

    const testId = "1256871i2mklp";
    router.push(`/articles/${testId}`);
  }

  return (
    <div
      className="flex items-center space-x-2"
      // onClick={handleClick}
    >
      <i className="pi pi-book text-xs text-[#6366F1] mr-1" />
      <p className="text-gray-600 text-sm mt-1">{title}</p>
    </div>
  );
}

function yearBodyTemplate(rowData: any) {
  return (
    <div className="flex items-center space-x-1">
      <p className="text-gray-600 text-sm mt-1">{rowData.year}</p>
    </div>
  );
}

function lakeBodyTemplate(rowData: any) {
  const lakeList = rowData.lake;
  return (
    <div className="flex items-center space-x-2 ">
      {lakeList.map((lake: string) => (
        <div className="flex items-center" key={lake}>
          <p className="text-gray-600 text-sm mt-1">{lake}</p>
        </div>
      ))}
    </div>
  );
}

function keywordsBodyTemplate(rowData: any) {
  const keyWordList = rowData.keywords.split(",");

  return (
    <div className="flex flex-col">
      {keyWordList.map((keyword: string) => (
        <div
          className="flex items-center space-x-2 text-gray-700 text-sm mb-1"
          key={keyword}
        >
          <i className="pi pi-tags text-xs text-green-600 mr-1" />
          <p className="text-gray-600 text-sm mt-1" key={keyword}>
            {keyword}
          </p>
        </div>
      ))}
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

function iconsBodyTemplate(rowData: any) {
  const { dispatch } = useArticles();
  const privateApi = useRefreshToken();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  function handleEditArticle() {
    dispatch({
      type: "SET_SELECTED_ARTICLE",
      id: rowData.id,
    });
  }

  async function handleDeleteArticle() {
    const id = rowData.id;
    try {
      setDeleteLoading(true);
      const response = await privateApi.delete(`/publications/${id}`);
      dispatch({
        type: "DELETE_ARTICLE",
        id,
      });
      console.log(response);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting publication",
      });
      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Toast ref={toast} />

      <Button
        icon="pi pi-pencil"
        className="w-10 h-10"
        disabled={rowData.status !== "pending"}
        onClick={() => handleEditArticle()}
      />
      <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        disabled={deleteLoading || rowData.status === "approved"}
        onClick={() => handleDeleteArticle()}
      />
      <Link href={rowData.file} target="blank">
        <Button icon="pi pi-download" className="w-10 h-10" disabled={false} />
      </Link>
    </div>
  );
}

function iconsAdminBodyTemplate(rowData: any) {
  const { dispatch } = useArticles();
  const privateApi = useRefreshToken();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  async function handleApprove() {
    const id = rowData.id;
    setLoading(true);
    try {
      await privateApi.patch(`/publications/unpublished/${id}`, {
        status: "approved",
      });

      dispatch({
        type: "APPROVE_ARTICLE",
        id,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Publication approved successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error approving publication",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);

      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    const id = rowData.id;
    setLoading(true);
    try {
      await privateApi.patch(`/publications/unpublished/${id}`, {
        status: "rejected",
      });

      dispatch({
        type: "REJECT_ARTICLE",
        id,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Publication rejected successfully",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error rejecting publication",
      });

      setTimeout(() => {
        toast.current?.clear();
      }, 5000);

      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
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
      <Link href={rowData.file} target="blank">
        <Button
          icon="pi pi-download"
          className="w-10 h-10"
          disabled={loading}
        />
      </Link>
    </div>
  );
}
