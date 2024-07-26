import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function FullPageLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ProgressSpinner />
    </div>
  );
}
