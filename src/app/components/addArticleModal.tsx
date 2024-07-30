"use client";
import React, { useRef, useState, useEffect } from "react";
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
import { Article } from "../utils/types";

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
  const { dispatch, selectedArticle, articles } = useArticles();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const privateApi = useRefreshToken();
  const messages = useRef<Messages>(null);

  const selectedArticleDetails = articles.find(
    (article) => article.id === selectedArticle
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<ArticleFormValues>({
    defaultValues: selectedArticleDetails
      ? {
          title: selectedArticleDetails.title,
          authors: selectedArticleDetails.author.split(",").map((author) => {
            return { name: author };
          }),
          abstract: selectedArticleDetails.abstract,
          publicationDate: new Date(selectedArticleDetails.year),
          keywords: selectedArticleDetails.keywords,
          selectedLakes: selectedArticleDetails.lake,
          file: null,
        }
      : {
          title: "",
          authors: [{ name: "" }],
          abstract: "",
          publicationDate: new Date(),
          keywords: "",
          selectedLakes: [],
          file: null,
        },
  });

  useEffect(() => {
    if (selectedArticleDetails) {
      setValue("title", selectedArticleDetails.title);
      setValue(
        "authors",
        selectedArticleDetails.author.split(",").map((author) => {
          return { name: author };
        })
      );
      setValue("abstract", selectedArticleDetails.abstract);
      setValue("publicationDate", new Date(selectedArticleDetails.year));
      setValue("keywords", selectedArticleDetails.keywords);
      setValue("selectedLakes", selectedArticleDetails.lake);
    }
  }, [selectedArticleDetails, setValue]);

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

    if (!data.file && !selectedArticleDetails) {
      setError("file", { type: "manual", message: "Please select a file" });
      return;
    }

    try {
      setLoading(true);
      messages.current?.clear();
      if (!user) return;
      const formData = new FormData();
      const selectedLakes = data.selectedLakes.join(",");
      const authors = data.authors.map((author) => author.name).join(",");
      formData.append("title", data.title);
      formData.append("abstract", data.abstract);
      formData.append("publicationDate", data.publicationDate.toISOString());
      formData.append("keywords", data.keywords);
      formData.append("lake", selectedLakes);
      formData.append("uploader", user.username);
      formData.append("author", authors);

      if (data.file) {
        formData.append("file", data.file);
      }

      if (selectedArticleDetails) {
        // Update existing article
        await privateApi.patch(
          `/publications/${selectedArticleDetails.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedArticle: Article = {
          ...selectedArticleDetails,
          title: data.title,
          author: authors,
          abstract: data.abstract,
          year: data.publicationDate.getFullYear().toString(),
          keywords: data.keywords,
          lake: data.selectedLakes,
        };

        dispatch({
          type: "UPDATE_ARTICLE",
          article: updatedArticle,
        });
      } else {
        await privateApi.post("/publications/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newArticle: Article = {
          id: nanoid(),
          title: data.title,
          author: authors,
          abstract: data.abstract,
          year: data.publicationDate.getFullYear().toString(),
          keywords: data.keywords,
          lake: data.selectedLakes,
          is_published: false,
          status: "pending",
        };

        dispatch({
          type: "ADD_ARTICLE",
          article: newArticle,
        });
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      messages.current?.clear();
      messages.current?.show([
        {
          severity: "info",
          detail: "An unexpected error occurred. Please try again.",
          sticky: true,
          closable: false,
        },
      ]);
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
          rules={{
            required: !selectedArticleDetails && "Please select a file",
          }}
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
              <p className="text-center">
                {selectedArticleDetails
                  ? "Update Publication"
                  : "Add Publication"}
              </p>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}
