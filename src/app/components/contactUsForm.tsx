"use client";

import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const ContactUsForm: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("https://api.example.com/send-message", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Message sent successfully!");
        // Additional success handling
      } else {
        console.error("Failed to send message:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle network error
    }
  };

  return (
    <div className="px-6">
      <div className="w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg mb-4 text-gray-600 font-semibold">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <InputText
                id="name"
                name="name"
                placeholder="Name"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <InputText
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="p-inputtext mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-600"
            >
              Message
            </label>
            <InputTextarea
              id="message"
              name="message"
              rows={5}
              placeholder="Message"
              className="p-inputtextarea mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mt-4 flex items-center justify-end w-full">
            <Button
              type="submit"
              label="Send Message"
              className="p-mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsForm;
