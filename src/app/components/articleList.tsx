import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useArticles } from "../contexts/articlesContext";

export default function ArticleList() {
  const { articles, loading, dispatch } = useArticles();

  function showArticlesModal() {
    dispatch({
      type: "SHOW_ARTICLES_MODAL",
    });
  }

  // function handleEditArticle(rowData: any) {
  //   dispatch({
  //     type: "SHOW_EDIT_ARTICLE_MODAL",
  //     payload: rowData,
  //   });
  // }

  // function handleDeleteArticle(rowData: any) {
  //   dispatch({
  //     type: "DELETE_ARTICLE",
  //     payload: rowData.id,
  //   });
  // }

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
        rows={10}
        dataKey="id"
        loading={loading}
        emptyMessage="No publications found"
      >
        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
        />
        <Column
          field="publicationDate"
          header="Published"
          body={(rowData: any) => rowData.year}
        />
        <Column field="keywords" header="Keywords" />
        <Column
          field="selectedLakes"
          header="Selected Lakes"
          body={(rowData: any) => rowData.lake}
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

function approvedBodyTemplate(rowData: any) {
  const status = rowData.is_published;
  let chipClass = "";
  let chipLabel = "";

  switch (status) {
    case true:
      chipClass =
        "bg-[#A0E6BA] text-[#237640] font-bold w-fit px-2 py-1 rounded-md text-sm";
      chipLabel = "Approved";
      break;
    case false:
      chipClass =
        "bg-[#F6DE95] text-[#816204] w-fit font-bold px-2 py-1 rounded-md text-sm";
      chipLabel = "Pending";
      break;
    case "Rejected":
      chipClass =
        "bg-[#F6B0D2] text-[#822854] w-fit font-bold px-2 py-1 rounded-md text-sm";
      chipLabel = "Rejected";
      break;
    default:
      break;
  }

  return (
    <div>
      <p className={chipClass}>{chipLabel}</p>
    </div>
  );
}

function iconsBodyTemplate(rowData: any) {
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="w-10 h-10"
        // onClick={() => handleEditArticle(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="w-10 h-10"
        // onClick={() => handleDeleteArticle(rowData)}
      />
    </div>
  );
}
