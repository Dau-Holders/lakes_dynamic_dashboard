"use client";
import React, { useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useArticles } from "../contexts/articlesContext";
import { nanoid } from "nanoid";
import { useAuthContext } from "../contexts/authContext";
import useRefreshToken from "../hooks/useRefreshToken";
import { Messages } from "primereact/messages";

interface ArticleFormValues {
  title: string;
  authors: { name: string }[];
  abstract: string;
  publicationDate: Date;
  keywords: string;
  selectedLakes: string[];
  file: File | null;
}

export default function AddArticleModal() {
  const { dispatch } = useArticles();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const privateApi = useRefreshToken();
  const messages = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<ArticleFormValues>({
    defaultValues: {
      title: "",
      authors: [{ name: "" }],
      abstract: "",
      publicationDate: new Date(),
      keywords: "",
      selectedLakes: [],
      file: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authors",
  });

  const onSubmit = async (data: ArticleFormValues) => {
    if (
      data.authors.length === 0 ||
      data.authors.some((author) => !author.name.trim())
    ) {
      setError("authors", {
        type: "manual",
        message: "At least one author is required",
      });
      return;
    }

    if (!data.file) {
      setError("file", { type: "manual", message: "Please select a file" });
      return;
    }

    try {
      setLoading(true);
      // messages.current?.clear();
      if (!user) return;
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("abstract", data.abstract);
      formData.append("publicationDate", "2012");
      formData.append("keywords", data.keywords);
      formData.append("lake", "Lake Victoria");
      formData.append("uploader", user.username);
      formData.append("author", "Alex Masinde");

      if (data.file) {
        formData.append("file", data.file);
      }

      await privateApi.post("/publications/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        type: "ADD_ARTICLE",
        article: {
          id: nanoid(),
          title: data.title,
          authors: data.authors.map((author) => author.name),
          abstract: data.abstract,
          publicationDate: data.publicationDate,
          keywords: data.keywords,
          selectedLakes: data.selectedLakes,
          approved: "Pending",
        },
      });

      dispatch({ type: "HIDE_ARTICLES_MODAL" });
    } catch (error) {
      // Handle error appropriately
      console.error("Error submitting article:", error);
      // messages.current?.clear();
      // messages.current?.show([
      //   {
      //     severity: "info",
      //     detail: "An unexpected error occurred. Please try again.",
      //     sticky: true,
      //     closable: false,
      //   },
      // ]);
    } finally {
      setLoading(false);
    }
  };

  const greatLakes = [
    { label: "Lake Victoria", value: "Lake Victoria" },
    { label: "Lake Tanganyika", value: "Lake Tanganyika" },
    { label: "Lake Malawi/Nissa/Nyasa", value: "Lake Malawi/Nissa/Nyasa" },
    { label: "Lake Turkana", value: "Lake Turkana" },
    { label: "Lake Albert", value: "Lake Albert" },
    { label: "Lake Kivu", value: "Lake Kivu" },
    { label: "Lake Edward", value: "Lake Edward" },
  ];

  const handleFileUpload = (e: FileUploadHandlerEvent) => {
    if (e.files && e.files[0]) {
      setValue("file", e.files[0]);
      clearErrors("file");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <Messages ref={messages} />
      <div className="mb-2">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <InputText
          id="title"
          className="w-full p-inputtext-sm"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="authors" className="block mb-2">
          Authors
        </label>
        {fields.map((author, index) => (
          <div key={author.id} className="flex items-center mb-2">
            <InputText
              {...register(`authors.${index}.name`, {
                required: "Author name is required",
              })}
              className="w-full p-inputtext-sm"
            />
            {fields.length > 1 && (
              <Button
                icon="pi pi-minus"
                className="ml-2 p-button-sm p-button-danger"
                onClick={() => {
                  remove(index);
                  clearErrors("authors");
                }}
              />
            )}
          </div>
        ))}
        {errors.authors && (
          <p className="text-red-500 mt-1 mb-2">
            {errors?.authors[0]?.name?.message}
          </p>
        )}
        <Button
          icon="pi pi-plus"
          label="Add Author"
          className="p-button-sm p-button-secondary"
          onClick={() => {
            append({ name: "" });
            clearErrors("authors");
          }}
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
          {...register("abstract", { required: "Abstract is required" })}
        />
        {errors.abstract && (
          <p className="text-red-500 mt-1">{errors.abstract.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-2">
          Publication Date
        </label>
        <Controller
          control={control}
          name="publicationDate"
          rules={{ required: "Publication Date is required" }}
          render={({ field }) => (
            <Calendar
              id="date"
              view="year"
              className="w-full p-calendar-sm"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
        {errors.publicationDate && (
          <p className="text-red-500 mt-1">{errors.publicationDate.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="lakes" className="block font-medium mb-2">
          Great Lakes of Africa
        </label>
        <Controller
          control={control}
          name="selectedLakes"
          rules={{ required: "At least one lake must be selected" }}
          render={({ field }) => (
            <MultiSelect
              id="lakes"
              options={greatLakes}
              className="w-full p-multiselect-sm"
              value={field.value}
              display="chip"
              onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
            />
          )}
        />
        {errors.selectedLakes && (
          <p className="text-red-500 mt-1">{errors.selectedLakes.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="keywords" className="block font-medium mb-2">
          Keywords
        </label>
        <InputText
          id="keywords"
          className="w-full p-inputtext-sm"
          {...register("keywords", { required: "Keywords are required" })}
        />
        {errors.keywords && (
          <p className="text-red-500 mt-1">{errors.keywords.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block font-medium mb-2">
          Select Publication (PDF only)
        </label>
        <Controller
          control={control}
          name="file"
          rules={{ required: "Please select a file" }}
          render={({ field }) => (
            <FileUpload
              id="file"
              name="file"
              accept=".pdf"
              mode="basic"
              auto
              customUpload
              uploadHandler={handleFileUpload}
              chooseLabel="Choose Publication"
            />
          )}
        />
        {errors.file && (
          <p className="text-red-500 mt-1">{errors.file.message}</p>
        )}
      </div>
      <div className="mt-4 w-full">
        <Button
          style={{ width: "100%" }}
          type="submit"
          size="small"
          disabled={loading}
        >
          <div className="flex w-full justify-center">
            {loading ? (
              <i className="pi pi-spin pi-spinner"></i>
            ) : (
              <p className="text-center">Add Publication</p>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}
