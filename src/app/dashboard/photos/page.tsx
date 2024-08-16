"use client";
import AddPhotoModal from "@/app/components/addPhotoModal";
import AppMenuBar from "@/app/components/appMenuBar";
import PhotoList from "@/app/components/photoList";
import AppSideBar from "@/app/components/sidebar";
import { useAuthContext } from "@/app/contexts/authContext";
import useRefreshToken from "@/app/hooks/useRefreshToken";
import { samplePhotos } from "@/app/utils/sampleArticles";
import { PhotoPayload } from "@/app/utils/types"; // Adjust this import
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoList, setPhotoList] = useState<PhotoPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [singlePhotoLoading, setSinglePhotoLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuthContext();
  const privateApi = useRefreshToken();

  useEffect(() => {
    async function fetchPhotos() {
      if (!user) return;
      try {
        setLoading(true);
        const response = await privateApi.get("/photos/");
        setPhotoList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [user]);

  async function updatePhotoList(value: string) {
    try {
      setSinglePhotoLoading(true);
      const response = await privateApi.delete(`/photos/${value}`);
      console.log(response.data);
      const newPhotoList = photoList.filter((photo) => photo.id !== value);
      setPhotoList(newPhotoList);
    } catch (error) {
      console.log("Error deleting photo", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting photo",
        life: 3000,
      });
    } finally {
      setSinglePhotoLoading(false);
    }
  }

  function addPhoto(newItem: PhotoPayload) {
    const newPhotoList = [...photoList, newItem];
    setPhotoList(newPhotoList);
  }

  const modalHeader = AddPhotoModalTitle;

  return (
    <div className="flex">
      <Toast ref={toast} position="top-center" />
      <AppSideBar />
      <div className="container mx-auto">
        <div className="justify-end flex px-6">
          <AppMenuBar />
        </div>
        <PhotoList
          photoList={photoList}
          loading={loading}
          singlePhotoLoading={singlePhotoLoading}
          updatePhotoList={updatePhotoList}
          setShowPhotoModal={setShowPhotoModal}
        />
        <Dialog
          visible={showPhotoModal}
          className="w-[95%] sm:max-w-md md:max-w-lg"
          onHide={() => setShowPhotoModal(false)}
          header={modalHeader}
        >
          <AddPhotoModal
            setShowPhotoModal={setShowPhotoModal}
            addPhoto={addPhoto}
          />
        </Dialog>
      </div>
    </div>
  );
}

function AddPhotoModalTitle() {
  return (
    <div>
      <p>Add Photo</p>
    </div>
  );
}
