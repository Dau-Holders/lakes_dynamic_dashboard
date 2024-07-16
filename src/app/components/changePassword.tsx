import React, { useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

const ChangePasswordForm: React.FC = () => {
  const [value, setValue] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Example: Submitting form data
    try {
      const response = await fetch("https://api.example.com/change-password", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Password changed successfully!");
        // Additional success handling
      } else {
        console.error("Failed to change password:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error changing password:", error);
      // Handle network error
    }
  };

  return (
    <div className="px-6">
      <div className="w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg mb-4 text-gray-600 font-semibold">
          Change Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="current_password"
              className="text-sm font-medium text-gray-600"
            >
              Current Password
            </label>
            <Password
              id="current_password"
              name="current_password"
              required
              toggleMask
              feedback={false}
              tabIndex={1}
              className="mt-2"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="new_password"
              className="text-sm font-medium text-gray-600"
            >
              New Password
            </label>
            <Password
              id="new_password"
              name="new_password"
              required
              toggleMask
              feedback={false}
              tabIndex={1}
              className="mt-2"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="new_password"
              className="text-sm font-medium text-gray-600"
            >
              Repeat Password
            </label>
            <Password
              id="repeat_password"
              name="repeat_password"
              required
              toggleMask
              feedback={false}
              tabIndex={1}
              className="mt-2"
            />
          </div>
          <div className="mt-4 flex items-center justify-end w-full">
            <Button
              type="submit"
              label="Change Password"
              className="p-mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
