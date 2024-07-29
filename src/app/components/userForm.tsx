import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { useAuthContext } from "../contexts/authContext";
import useRefreshToken from "../hooks/useRefreshToken";
import { Toast } from "primereact/toast";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const UserForm: React.FC = () => {
  const { user } = useAuthContext();
  const privateApi = useRefreshToken();

  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const { handleSubmit, control, setValue } = useForm<{
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    designation: string;
    gender: string;
    organization: string;
    photo: File | null;
  }>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      designation: user?.designation || "",
      gender: user?.gender || "",
      organization: user?.organization || "",
      photo: null,
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "photo" && data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      setLoading(true);
      // toast.current?.clear();
      const response = await privateApi.patch(
        `/profile/update/${user?.username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error submitting form data:", error);
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Error",
      //   detail: "Error updating user details",
      //   life: 3000,
      // });
    } finally {
      // toast.current?.clear();
      setLoading(false);
    }
  };

  const handleFileUpload = (e: FileUploadHandlerEvent) => {
    if (e.files && e.files?.[0] instanceof File) {
      setValue("photo", e.files[0]);
    }
  };

  return (
    <div className="p-6">
      <Toast ref={toast} position="top-center" />
      <div className="w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg mb-4 text-gray-600 font-semibold">Profile</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-600"
                >
                  Username
                </label>
                <span className="text-xs text-gray-400 block">
                  This is your display name.
                </span>
              </div>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="username"
                    {...field}
                    required
                    maxLength={25}
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email Address
                </label>
                <span className="text-xs text-gray-400 block">
                  We'll never share your email.
                </span>
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="email"
                    {...field}
                    type="email"
                    required
                    pattern="^\S+@\S+$"
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="first_name"
                  className="text-sm font-medium text-gray-600"
                >
                  First Name
                </label>
                <span className="text-xs text-gray-400 block">
                  Enter your first name.
                </span>
              </div>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="first_name"
                    {...field}
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="last_name"
                  className="text-sm font-medium text-gray-600"
                >
                  Last Name
                </label>
                <span className="text-xs text-gray-400 block">
                  Enter your last name.
                </span>
              </div>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="last_name"
                    {...field}
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="designation"
                  className="text-sm font-medium text-gray-600"
                >
                  Designation
                </label>
                <span className="text-xs text-gray-400 block">
                  Your professional designation.
                </span>
              </div>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="designation"
                    {...field}
                    required
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-600"
                >
                  Gender
                </label>
                <span className="text-xs text-gray-400 block">
                  Select your gender.
                </span>
              </div>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="gender"
                    {...field}
                    options={genderOptions}
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="organization"
                  className="text-sm font-medium text-gray-600"
                >
                  Organization
                </label>
                <span className="text-xs text-gray-400 block">
                  The name of your organization.
                </span>
              </div>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="organization"
                    {...field}
                    required
                    className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="w-1/2">
                <label
                  htmlFor="photo"
                  className="text-sm font-medium text-gray-600"
                >
                  Photo
                </label>
                <span className="text-xs text-gray-400 block">
                  Upload a profile photo.
                </span>
              </div>
              <FileUpload
                id="photo"
                name="photo"
                accept="image/*"
                mode="basic"
                customUpload
                uploadHandler={handleFileUpload}
                chooseLabel="Choose Photo"
              />
            </div>
          </div>
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
                <p className="text-center">Save Changes</p>
              )}
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
