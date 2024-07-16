"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { useArticles } from "../contexts/articlesContext";
import { nanoid } from "nanoid";

export default function AddArticleModal() {
  const { dispatch } = useArticles();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [abstract, setAbstract] = useState("");
  const [publicationDate, setPublicationDate] = useState<Date>(new Date());
  const [keywords, setKeywords] = useState("");
  const [selectedLakes, setSelectedLakes] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    title: "",
    authors: "",
    abstract: "",
    publicationDate: "",
    keywords: "",
    selectedLakes: "",
  });

  const validateField = (fieldName: string, value: any) => {
    if (!value.trim()) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    return "";
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    newErrors.title = validateField("title", title);
    newErrors.authors =
      authors.length > 0 && authors.every((author) => author.trim() !== "")
        ? ""
        : "At least one author is required";
    newErrors.abstract = validateField("abstract", abstract);
    newErrors.publicationDate = publicationDate
      ? ""
      : "Publication Date is required";
    newErrors.selectedLakes =
      selectedLakes.length > 0 ? "" : "At least one lake must be selected";
    newErrors.keywords = validateField("keywords", keywords);

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange = (fieldName: string, value: any) => {
    const errorMessage = validateField(fieldName, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));

    // Update state based on field
    switch (fieldName) {
      case "title":
        setTitle(value);
        break;
      case "abstract":
        setAbstract(value);
        break;
      case "keywords":
        setKeywords(value);
        break;
      default:
        break;
    }
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);

    const errorMessage =
      newAuthors.length > 0 &&
      newAuthors.every((author) => author.trim() !== "")
        ? ""
        : "At least one author is required";
    setErrors((prevErrors) => ({
      ...prevErrors,
      authors: errorMessage,
    }));
  };

  const addAuthorField = () => {
    const newAuthors = [...authors, ""];
    setAuthors(newAuthors);

    const errorMessage =
      newAuthors.length > 0 &&
      newAuthors.every((author) => author.trim() !== "")
        ? ""
        : "At least one author is required";
    setErrors((prevErrors) => ({
      ...prevErrors,
      authors: errorMessage,
    }));
  };

  const removeAuthorField = (index: number) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);

    const errorMessage =
      newAuthors.length > 0 &&
      newAuthors.every((author) => author.trim() !== "")
        ? ""
        : "At least one author is required";
    setErrors((prevErrors) => ({
      ...prevErrors,
      authors: errorMessage,
    }));
  };

  const handlePublicationDateChange = (e: any) => {
    setPublicationDate(e.value);

    const errorMessage = e.value ? "" : "Publication Date is required";
    setErrors((prevErrors) => ({
      ...prevErrors,
      publicationDate: errorMessage,
    }));
  };

  const handleLakeChange = (e: any) => {
    setSelectedLakes(e.value);

    const errorMessage =
      e.value.length > 0 ? "" : "At least one lake must be selected";
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedLakes: errorMessage,
    }));
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      dispatch({
        type: "ADD_ARTICLE",
        article: {
          id: nanoid(),
          title,
          authors,
          abstract,
          publicationDate,
          keywords,
          selectedLakes,
          approved: "Pending",
        },
      });
    }

    dispatch({
      type: "HIDE_ARTICLES_MODAL",
    });
  };

  const greatLakes = [
    { label: "Lake Victoria", value: "Lake Victoria" },
    { label: "Lake Tanganyika", value: "Lake Tanganyika" },
    { label: "Lake Malawi", value: "Lake Malawi" },
    { label: "Lake Turkana", value: "Lake Turkan" },
    { label: "Lake Albert", value: "Lake Albert" },
    { label: "Lake Kivu", value: "Lake Kivu" },
    { label: "Lake Edward", value: "Lake Edward" },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-2">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <InputText
          id="title"
          className="w-full p-inputtext-sm"
          value={title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="authors" className="block mb-2">
          Authors
        </label>
        {authors.map((author, index) => (
          <div key={index} className="flex items-center mb-2">
            <InputText
              value={author}
              onChange={(e) => handleAuthorChange(index, e.target.value)}
              className="w-full p-inputtext-sm"
            />
            {authors.length > 1 && (
              <Button
                icon="pi pi-minus"
                className="ml-2 p-button-sm p-button-danger"
                onClick={() => removeAuthorField(index)}
              />
            )}
          </div>
        ))}
        {errors.authors && (
          <p className="text-red-500 mt-1">{errors.authors}</p>
        )}
        <Button
          icon="pi pi-plus"
          label="Add Author"
          className="p-button-sm p-button-secondary"
          onClick={addAuthorField}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="abstract" className="block font-medium mb-2">
          Abstract
        </label>
        <InputTextarea
          id="abstract"
          rows={3}
          className="w-full p-inputtextarea-sm"
          value={abstract}
          onChange={(e) => handleInputChange("abstract", e.target.value)}
        />
        {errors.abstract && (
          <p className="text-red-500 mt-1">{errors.abstract}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-2">
          Publication Date
        </label>
        <Calendar
          id="date"
          className="w-full p-calendar-sm"
          value={publicationDate}
          onChange={handlePublicationDateChange}
        />
        {errors.publicationDate && (
          <p className="text-red-500 mt-1">{errors.publicationDate}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="lakes" className="block font-medium mb-2">
          Great Lakes of Africa
        </label>
        <MultiSelect
          id="lakes"
          options={greatLakes}
          className="w-full p-multiselect-sm"
          value={selectedLakes}
          display="chip"
          onChange={handleLakeChange}
        />
        {errors.selectedLakes && (
          <p className="text-red-500 mt-1">{errors.selectedLakes}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="keywords" className="block font-medium mb-2">
          Keywords
        </label>
        <InputText
          id="keywords"
          className="w-full p-inputtext-sm"
          value={keywords}
          onChange={(e) => handleInputChange("keywords", e.target.value)}
        />
        {errors.keywords && (
          <p className="text-red-500 mt-1">{errors.keywords}</p>
        )}
      </div>
      <div className="mb-4">
        <Button label="Submit" className="w-full" onClick={handleSubmit} />
      </div>
    </div>
  );
}
