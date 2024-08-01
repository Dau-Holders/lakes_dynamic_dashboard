import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useArticles } from "../contexts/articlesContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticleList() {
  const { articles, loading, dispatch } = useArticles();

  const router = useRouter();

  function showArticlesModal() {
    dispatch({
      type: "SHOW_ARTICLES_MODAL",
    });
  }

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Publications</p>
        <Button
          icon="pi pi-plus"
          label="Add Article"
          onClick={showArticlesModal}
          outlined
        />
      </div>
      <DataTable
        value={articles}
        paginator
        rows={6}
        dataKey="id"
        style={{ backgroundColor: "red" }}
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
        <Column header="Actions" body={iconsBodyTemplate} />
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
    <div className="flex items-center space-x-2 ">
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
  return (
    <div className="flex items-center space-x-2 ">
      {rowData.lake.map((lake: string) => (
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
  const status = rowData.is_published;
  let chipClass = "";
  let chipLabel = "";
  let iconClass = "";

  switch (status) {
    case true:
      chipClass =
        "bg-[#A0E6BA] text-[#237640] font-bold w-fit px-2 py-1 rounded-md text-sm";
      chipLabel = "Approved";
      iconClass = "pi pi-check text-green-600";
      break;
    case false:
      chipClass =
        "bg-[#F6DE95] text-[#816204] w-fit font-bold px-2 py-1 rounded-md text-sm";
      chipLabel = "Pending";
      iconClass = "pi pi-hourglass text-yellow-600";
      break;
    case "Rejected":
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
  const router = useRouter();

  function handleEditArticle() {
    dispatch({
      type: "SET_SELECTED_ARTICLE",
      id: rowData.id,
    });
  }

  function handleDeleteArticle() {
    console.log("Testing");
  }

  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="w-10 h-10"
        disabled={rowData.status !== "pending"}
        onClick={() => handleEditArticle()}
      />
      {/* <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        disabled={false}
        onClick={() => handleDeleteArticle()}
      /> */}
      <Link href={rowData.file} target="blank">
        <Button icon="pi pi-download" className="w-10 h-10" disabled={false} />
      </Link>
    </div>
  );
}
