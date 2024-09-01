"use client";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { useAuthContext } from "../contexts/authContext";
import useRefreshToken from "../hooks/useRefreshToken";
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
  const privateApi = useRefreshToken();
  const messages = useRef<Messages>(null);

  const {
    register,
    control,
    handleSubmit,
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

  const greatLakes = [
    { label: "Lake Victoria", value: "Lake Victoria" },
    { label: "Lake Tanganyika", value: "Lake Tanganyika" },
    { label: "Lake Malawi/Niassa/Nyasa", value: "Lake Malawi/Niassa/Nyasa" },
    { label: "Lake Turkana", value: "Lake Turkana" },
    { label: "Lake Albert", value: "Lake Albert" },
    { label: "Lake Kivu", value: "Lake Kivu" },
    { label: "Lake Edward", value: "Lake Edward" },
  ];

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
              placeholder="Select a Lake"
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
            <FileUpload
              id="file"
              mode="basic"
              accept="image/*"
              customUpload
              auto
              chooseLabel="Select Image"
              className="w-full"
              uploadHandler={(e) => field.onChange(e.files[0])}
            />
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
