"use client";
import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";

// Mock data for articles
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Sample Article 1",
    authors: ["John Doe", "Jane Smith"],
    abstract: "This is the abstract of Sample Article 1.",
    publicationDate: new Date("2023-01-15"),
    keywords: "sample, article, keywords",
    selectedLakes: [{ label: "Lake Victoria", value: "victoria" }],
    approved: true,
  },
  {
    id: 2,
    title: "Sample Article 2",
    authors: ["Alice Johnson"],
    abstract: "This is the abstract of Sample Article 2.",
    publicationDate: new Date("2023-02-20"),
    keywords: "sample, article",
    selectedLakes: [{ label: "Lake Malawi", value: "malawi" }],
    approved: false,
  },
  {
    id: 3,
    title: "Sample Article 3",
    authors: ["Bob Williams", "Eve Brown"],
    abstract: "This is the abstract of Sample Article 3.",
    publicationDate: new Date("2023-03-10"),
    keywords: "article, example",
    selectedLakes: [{ label: "Lake Tanganyika", value: "tanganyika" }],
    approved: true,
  },
];

interface Article {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  keywords: string;
  selectedLakes: { label: string; value: string }[];
  approved: boolean;
}

export default function BasicFilterDemo() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    authors: { value: null, matchMode: FilterMatchMode.CONTAINS },
    approved: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  useEffect(() => {
    // Simulating fetching data from a service
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setGlobalFilterValue(value);

    let newFilters = { ...filters };
    newFilters["global"].value = value; // Correctly accesses value property
    setFilters(newFilters);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const authorBodyTemplate = (rowData: Article) => {
    return <div>{rowData.authors.join(", ")}</div>;
  };

  const approvedBodyTemplate = (rowData: Article) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.approved,
          "false-icon pi-times-circle": !rowData.approved,
        })}
      ></i>
    );
  };

  const approvedRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <TriStateCheckbox
        value={options.value as boolean}
        onChange={(e: TriStateCheckboxChangeEvent) =>
          options.filterApplyCallback(e.value)
        }
      />
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={articles}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={["title", "authors"]}
        header={header}
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
          body={(rowData) =>
            new Date(rowData.publicationDate).toLocaleDateString()
          }
        />
        <Column field="keywords" header="Keywords" />
        <Column
          field="selectedLakes"
          header="Selected Lakes"
          body={(rowData) =>
            rowData.selectedLakes.map((lake: any) => lake.label).join(", ")
          }
        />
        <Column
          field="approved"
          header="Approved"
          body={approvedBodyTemplate}
          filter
          filterElement={approvedRowFilterTemplate}
        />
      </DataTable>
    </div>
  );
}
