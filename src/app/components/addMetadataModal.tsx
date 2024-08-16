"use client";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useAuthContext } from "../contexts/authContext";
import useRefreshToken from "../hooks/useRefreshToken";
import { Messages } from "primereact/messages";
import { MetadataPayload } from "../utils/types";
import { nanoid } from "nanoid";

interface MetadataFormValues {
  title: string;
  email: string;
  period: string;
  description: string;
  lake: string;
  file: File | null;
}

interface MetadataModalProps {
  setShowMetadataModal: (value: boolean) => void;
  addMetadata: (value: MetadataPayload) => void;
}

export default function AddMetadataModal({
  setShowMetadataModal,
  addMetadata,
}: MetadataModalProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const privateApi = useRefreshToken();
  const messages = useRef<Messages>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<MetadataFormValues>({
    defaultValues: {
      title: "",
      email: "",
      period: "",
      description: "",
      lake: "",
      file: null,
    },
  });

  const onSubmit = async (data: MetadataFormValues) => {
    if (!data.file) {
      setError("file", { type: "manual", message: "Please select a file" });
      return;
    }

    try {
      setLoading(true);
      messages.current?.clear();
      if (!user) return;
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("email", data.email);
      formData.append("period", data.period);
      formData.append("description", data.description);
      formData.append("lake", data.lake);
      formData.append("uploader", user.username);

      if (data.file) {
        formData.append("file", data.file);
      }

      const response = await privateApi.post("/metadata/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Metadata creation response payload", response.data);
      const file = response.data.file;
      const newMetadataItem: MetadataPayload = {
        id: nanoid(),
        title: data.title,
        email: data.email,
        period: data.period,
        description: data.description,
        lake: data.lake,
        uploader: user.username,
        file: file,
        status: "pending",
      };
      addMetadata(newMetadataItem);
      setShowMetadataModal(false);
    } catch (error) {
      console.error("Error submitting metadata:", error);
      messages.current?.show([
        {
          severity: "error",
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
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <InputText
          id="email"
          className="w-full p-inputtext-sm"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="period" className="block mb-2">
          Period
        </label>
        <InputText
          id="period"
          className="w-full p-inputtext-sm"
          {...register("period", { required: "Period is required" })}
        />
        {errors.period && (
          <p className="text-red-500 mt-1">{errors.period.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-medium mb-2">
          Description
        </label>
        <InputTextarea
          id="description"
          rows={3}
          className="w-full p-inputtextarea-sm"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="lake" className="block font-medium mb-2">
          Great Lakes of Africa
        </label>
        <Controller
          control={control}
          name="lake"
          rules={{ required: "Please select a lake" }}
          render={({ field }) => (
            <Dropdown
              id="lake"
              options={greatLakes}
              className="w-full p-dropdown-sm"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              placeholder="Select a Lake"
            />
          )}
        />
        {errors.lake && (
          <p className="text-red-500 mt-1">{errors.lake.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block font-medium mb-2">
          Select Metadata File (PDF only)
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
              chooseLabel="Choose File"
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
              <p className="text-center">Add Metadata</p>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}
