import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useArticles } from "../contexts/articlesContext";

export default function ArticleList() {
  const { articles, loading, dispatch } = useArticles();

  console.log(articles);

  function showArticlesModal() {
    dispatch({
      type: "SHOW_ARTICLES_MODAL",
    });
  }

  const authorBodyTemplate = (rowData: any) => {
    return <div>{rowData.authors.join(", ")}</div>;
  };

  const approvedBodyTemplate = (rowData: any) => {
    const status = rowData.approved;
    let chipClass = "";
    let chipLabel = "";

    switch (status) {
      case "Approved":
        chipClass =
          "bg-[#A0E6BA] text-[#237640] font-bold w-fit px-2 py-1 rounded-md text-sm";
        chipLabel = "Approved";
        break;
      case "Pending":
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
  };

  return (
    <div className="bg-white p-6 rounded-lg m-4">
      <div className="flex justify-between mb-4">
        <p className="font-bold text-xl">Article List</p>
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
        emptyMessage="No articles found."
      >
        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
        />
        <Column
          field="authors"
          header="Authors"
          body={authorBodyTemplate}
          filter
          filterPlaceholder="Search by authors"
        />
        <Column
          field="publicationDate"
          header="Publication Date"
          body={(rowData: any) =>
            new Date(rowData.publicationDate).toLocaleDateString()
          }
        />
        <Column field="keywords" header="Keywords" />
        <Column
          field="selectedLakes"
          header="Selected Lakes"
          body={(rowData: any) =>
            rowData.selectedLakes.map((lake: any) => lake).join(", ")
          }
        />
        <Column
          field="approved"
          header="Approval Status"
          body={approvedBodyTemplate}
        />
      </DataTable>
    </div>
  );
}
