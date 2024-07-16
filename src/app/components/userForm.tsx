import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const UserForm: React.FC = () => {
  const [gender, setGender] = useState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Example: Submitting form data
    try {
      const response = await fetch("https://api.example.com/submit-form", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Form data submitted successfully!");
        // Additional success handling
      } else {
        console.error("Failed to submit form data:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      // Handle network error
    }
  };

  return (
    <div className="p-6">
      <div className="w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg mb-4 text-gray-600 font-semibold">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  This will be your display name.
                </span>
              </div>
              <InputText
                id="username"
                name="username"
                required
                maxLength={25}
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <InputText
                id="email"
                name="email"
                type="email"
                required
                pattern="^\S+@\S+$"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <InputText
                id="first_name"
                name="first_name"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <InputText
                id="last_name"
                name="last_name"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <InputText
                id="designation"
                name="designation"
                required
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <Dropdown
                id="gender"
                name="gender"
                options={genderOptions}
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
              <InputText
                id="organization"
                name="organization"
                required
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
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
                name="photo"
                url="https://your-upload-url.com"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                mode="basic"
                accept="image/*"
                maxFileSize={1000000} // Example: 1MB limit
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end w-full">
            <Button
              type="submit"
              label="Save Changes"
              className="p-mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
