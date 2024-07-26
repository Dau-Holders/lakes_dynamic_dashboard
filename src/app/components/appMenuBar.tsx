import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useAuthContext } from "../contexts/authContext";

export default function AppMenuBar() {
  const { user } = useAuthContext();

  const fullName = `${user?.first_name} ${user?.last_name}`;
  const hasName = fullName.trim() !== "";

  console.log("Full Name", fullName);

  const items = [
    {
      command: () => {
        console.log("Clicked");
      },
      template: (item: any, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={`${options.className} p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround cursor-pointer`}
          >
            <Avatar image={user?.photo} className="mr-2" shape="circle" />
            <div className="flex flex-col align">
              {hasName ? <span className="font-bold">J</span> : null}
              <span className="text-sm">{user?.designation}</span>
            </div>
          </button>
        );
      },
    },
  ];
  return (
    <div>
      <Menu
        model={items}
        style={{ backgroundColor: "#EFF3F7", border: "none" }}
        className="w-fit md:w-15rem"
      />
    </div>
  );
}
