import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";

export default function AppMenuBar() {
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
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              className="mr-2"
              shape="circle"
            />
            <div className="flex flex-col align">
              <span className="font-bold">John Doe</span>
              <span className="text-sm">Author</span>
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
