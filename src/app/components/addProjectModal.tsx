"use client";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useAuthContext } from "../contexts/authContext";
import useRefreshToken from "../hooks/useRefreshToken";
import { Messages } from "primereact/messages";
import { ProjectPayload } from "../utils/types";
import { nanoid } from "nanoid";

interface ProjectFormValues {
  title: string;
  description: string;
  longitude: string;
  latitude: string;
  lake: string;
}

interface ProjectModalProps {
  setShowProjectModal: (value: boolean) => void;
  addProject: (value: ProjectPayload) => void;
}

export default function AddProjectModal({
  setShowProjectModal,
  addProject,
}: ProjectModalProps) {
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
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      longitude: "",
      latitude: "",
      lake: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setLoading(true);
      messages.current?.clear();
      if (!user) return;

      // Prepare FormData
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("longitude", data.longitude);
      formData.append("latitude", data.latitude);
      formData.append("lake", data.lake);
      formData.append("uploader", user.username);

      const response = await privateApi.post("/projects/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProjectItem: ProjectPayload = {
        id: nanoid(),
        title: data.title,
        description: data.description,
        longitude: data.longitude,
        latitude: data.latitude,
        lake: data.lake,
        uploader: user.username,
        status: "pending",
      };
      addProject(newProjectItem);
      setShowProjectModal(false);
    } catch (error) {
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
        <label htmlFor="description" className="block font-medium mb-2">
          Description
        </label>
        <InputTextarea
          id="description"
          rows={3}
          className="w-full p-inputtextarea-sm"
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description && (
          <p className="text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="longitude" className="block font-medium mb-2">
          Longitude
        </label>
        <InputText
          id="longitude"
          className="w-full p-inputtext-sm"
          {...register("longitude", {
            required: "Longitude is required",
          })}
        />
        {errors.longitude && (
          <p className="text-red-500 mt-1">{errors.longitude.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="latitude" className="block font-medium mb-2">
          Latitude
        </label>
        <InputText
          id="latitude"
          className="w-full p-inputtext-sm"
          {...register("latitude", {
            required: "Latitude is required",
          })}
        />
        {errors.latitude && (
          <p className="text-red-500 mt-1">{errors.latitude.message}</p>
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
              <p className="text-center">Add Project</p>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}
