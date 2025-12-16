"use client";
import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { useAuthContext } from "../contexts/authContext";
import { privateApi } from "../lib/api";
import useLakes from "../hooks/useLakes";
import { Messages } from "primereact/messages";

interface PhotoFormValues {
  capture_date: Date | null;
  lake: string;
  file: File | null;
  description: string;
}

interface PhotoModalProps {
  setShowPhotoModal: (value: boolean) => void;
  addPhoto: (photo: any) => void;
}

export default function AddPhotoModal({
  setShowPhotoModal,
  addPhoto,
}: PhotoModalProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  // privateApi is now imported globally
  const messages = useRef<Messages>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhotoFormValues>({
    defaultValues: {
      capture_date: null,
      lake: "",
      file: null,
      description: "",
    },
  });

  const onSubmit = async (data: PhotoFormValues) => {
    try {
      setLoading(true);
      messages.current?.clear();
      if (!user) return;

      const formData = new FormData();
      if (data.file) {
        formData.append("image", data.file);
      }
      formData.append("capture_date", data.capture_date?.toISOString() || "");
      formData.append("lake", data.lake);
      formData.append("description", data.description);
      formData.append("uploader", user.username);
      formData.append("published_by", user.username);

      const response = await privateApi.post("/photos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newPhotoItem = {
        id: response.data.id,
        capture_date: data.capture_date,
        lake: data.lake,
        description: data.description,
        uploader: user.username,
        image: response.data.image,
      };
      addPhoto(newPhotoItem);
      // Reset form and file upload
      fileUploadRef.current?.clear();
      // We don't have setValue here? Wait, addPhotoModal uses useForm but didn't destructure setValue.
      // I need to add setValue to useForm destructuring.
      setShowPhotoModal(false);
    } catch (error) {
      console.error("Error submitting photo:", error);
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

  const { lakes: greatLakes, loading: lakesLoading, error: lakesError } = useLakes();

  // Show error message if lakes failed to load
  useEffect(() => {
    if (lakesError) {
      messages.current?.show([
        {
          severity: "warn",
          detail: "Failed to load lakes. Please refresh the page.",
          sticky: true,
          closable: true,
        },
      ]);
    }
  }, [lakesError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <Messages ref={messages} />
      <div className="mb-4">
        <label htmlFor="capture_date" className="block mb-2">
          Capture Date
        </label>
        <Controller
          control={control}
          name="capture_date"
          rules={{ required: "Capture date is required" }}
          render={({ field }) => (
            <Calendar
              id="capture_date"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              dateFormat="yy-mm-dd"
              className="w-full p-inputtext-sm"
              placeholder="Select a capture date"
            />
          )}
        />
        {errors.capture_date && (
          <p className="text-red-500 mt-1">{errors.capture_date.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="lake" className="block mb-2">
          Lake
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
              placeholder={lakesLoading ? "Loading lakes..." : "Select a Lake"}
              disabled={lakesLoading}
            />
          )}
        />
        {errors.lake && (
          <p className="text-red-500 mt-1">{errors.lake.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block mb-2">
          Upload Image
        </label>
        <Controller
          control={control}
          name="file"
          rules={{ required: "Please upload an image" }}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <FileUpload
                ref={fileUploadRef}
                id="file"
                mode="basic"
                accept="image/*"
                chooseLabel="Select Image"
                className="w-full"
                onSelect={(e) => {
                  if (e.files && e.files.length > 0) {
                    field.onChange(e.files[0]);
                  }
                }}
              />
              {field.value instanceof File && (
                <span className="text-sm text-gray-600">
                  Selected: {field.value.name}
                </span>
              )}
            </div>
          )}
        />
        {errors.file && (
          <p className="text-red-500 mt-1">{errors.file.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
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
              <p className="text-center">Add Photo</p>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}
