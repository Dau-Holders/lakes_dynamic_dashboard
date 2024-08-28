"use client";
import AddProjectModal from "@/app/components/addProjectModal";
import AppMenuBar from "@/app/components/appMenuBar";
import ProjectList from "@/app/components/projectList";
import AppSideBar from "@/app/components/sidebar";
import { useAuthContext } from "@/app/contexts/authContext";
import useRefreshToken from "@/app/hooks/useRefreshToken";
import { sampleProjects } from "@/app/utils/sampleArticles";
import { ProjectPayload } from "@/app/utils/types";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectList, setProjectList] =
    useState<ProjectPayload[]>(sampleProjects);
  const [loading, setLoading] = useState(false);
  const [singleProjectLoading, setSingleProjectLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { user } = useAuthContext();
  const privateApi = useRefreshToken();

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      if (projectList.length > 0) return;
      try {
        setLoading(true);
        const response = await privateApi.get("/projects/");
        setProjectList(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  async function updateProjectList(value: string) {
    try {
      setSingleProjectLoading(true);
      const response = await privateApi.delete(`/projects/${value}`);
      const newProjectList = projectList.filter(
        (project) => project.id !== value
      );
      setProjectList(newProjectList);
    } catch (error) {
      console.log("Error deleting project", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting project",
        life: 3000,
      });
    } finally {
      setSingleProjectLoading(false);
    }
  }

  function addProject(newItem: ProjectPayload) {
    const newProjectList = [...projectList, newItem];
    setProjectList(newProjectList);
  }

  const modalHeader = AddProjectModalTitle;

  return (
    <div className="flex">
      <Toast ref={toast} position="top-center" />
      <AppSideBar />
      <div className="container mx-auto">
        <div className="justify-end flex px-6">
          <AppMenuBar />
        </div>
        <ProjectList
          projectList={projectList}
          loading={loading}
          singleProjectLoading={singleProjectLoading}
          updateProjectList={updateProjectList}
          setShowProjectModal={setShowProjectModal}
        />
        <Dialog
          visible={showProjectModal}
          className="w-[95%] sm:max-w-md md:max-w-lg"
          onHide={() => setShowProjectModal(false)}
          header={modalHeader}
        >
          <AddProjectModal
            setShowProjectModal={setShowProjectModal}
            addProject={addProject}
          />
        </Dialog>
      </div>
    </div>
  );
}

function AddProjectModalTitle() {
  return (
    <div>
      <p>Add Project</p>
    </div>
  );
}
