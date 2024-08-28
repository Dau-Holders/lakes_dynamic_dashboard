"use client";
import AddMetadataModal from "@/app/components/addMetadataModal";
import AppMenuBar from "@/app/components/appMenuBar";
import MetadataList from "@/app/components/metadataList";
import AppSideBar from "@/app/components/sidebar";
import { useAuthContext } from "@/app/contexts/authContext";
import useRefreshToken from "@/app/hooks/useRefreshToken";
import { MetadataPayload } from "@/app/utils/types";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metadataList, setMetadataList] = useState<MetadataPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [singleMetadataLoading, setSingleMetadataLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuthContext();
  const privateApi = useRefreshToken();

  useEffect(() => {
    async function fetchMetadata() {
      if (!user) return;
      if (metadataList.length > 0) return;
      try {
        setLoading(true);
        const response = await privateApi.get("/metadata/");
        setMetadataList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [user]);

  async function updateMetadataList(value: string) {
    try {
      setSingleMetadataLoading(true);
      const response = await privateApi.delete(`/metadata/${value}`);
      const newMetadataList = metadataList.filter(
        (metadata) => metadata.id !== value
      );
      setMetadataList(newMetadataList);
    } catch (error) {
      console.log("Error deleting toast", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting metadata",
        life: 3000,
      });
    } finally {
      setSingleMetadataLoading(false);
    }
  }

  function addMetadata(newItem: MetadataPayload) {
    const newMetadataList = [...metadataList, newItem];
    setMetadataList(newMetadataList);
  }

  const modalHeader = AddArticleModalTitle;

  return (
    <div className="flex">
      <Toast ref={toast} position="top-center" />
      <AppSideBar />
      <div className="container mx-auto">
        <div className="justify-end flex px-6">
          <AppMenuBar />
        </div>
        <MetadataList
          metadataList={metadataList}
          loading={loading}
          singleMetadataLoading={singleMetadataLoading}
          updateMetadataList={updateMetadataList}
          setShowMetadataModal={setShowMetadataModal}
        />
        <Dialog
          visible={showMetadataModal}
          className="w-[95%] sm:max-w-md md:max-w-lg"
          onHide={() => setShowMetadataModal(false)}
          header={modalHeader}
        >
          <AddMetadataModal
            setShowMetadataModal={setShowMetadataModal}
            addMetadata={addMetadata}
          />
        </Dialog>
      </div>
    </div>
  );
}

function AddArticleModalTitle() {
  return (
    <div>
      <p>Add Metadata</p>
    </div>
  );
}
