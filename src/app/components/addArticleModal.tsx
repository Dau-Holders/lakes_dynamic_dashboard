"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

export default function AddArticleModal() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]); // Initialize with one empty author field
  const [abstract, setAbstract] = useState("");
  const [publicationDate, setPublicationDate] = useState<Date | null>(null);
  const [keywords, setKeywords] = useState("");
  const [selectedLakes, setSelectedLakes] = useState<any[]>([]);
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

    // Clear authors error if there's at least one non-empty author field
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

    // Update authors error when removing fields
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
    // Validate the entire form before submission
    const isValid = validateForm();

    // Submit logic here if form is valid
    if (isValid) {
      console.log({
        title,
        authors,
        abstract,
        publicationDate,
        keywords,
        selectedLakes,
      });
    }
  };

  const greatLakes = [
    { label: "Lake Victoria", value: "victoria" },
    { label: "Lake Tanganyika", value: "tanganyika" },
    { label: "Lake Malawi", value: "malawi" },
    { label: "Lake Turkana", value: "turkana" },
    { label: "Lake Albert", value: "albert" },
    { label: "Lake Kivu", value: "kivu" },
    { label: "Lake Edward", value: "edward" },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Journal Article</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium mb-2">
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
        <label htmlFor="authors" className="block text-lg font-medium mb-2">
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
        <label htmlFor="abstract" className="block text-lg font-medium mb-2">
          Abstract
        </label>
        <InputTextarea
          id="abstract"
          rows={5}
          className="w-full p-inputtextarea-sm"
          value={abstract}
          onChange={(e) => handleInputChange("abstract", e.target.value)}
        />
        {errors.abstract && (
          <p className="text-red-500 mt-1">{errors.abstract}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-lg font-medium mb-2">
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
        <label htmlFor="lakes" className="block text-lg font-medium mb-2">
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
        <label htmlFor="keywords" className="block text-lg font-medium mb-2">
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
        <Button
          label="Submit"
          className="w-full p-button-sm"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
