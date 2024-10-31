import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileImage from "./profileImage";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const activeClass = (path: string) =>
    pathname === path
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-700";

  return (
    <nav className="bg-white p-4 shadow-md mb-4">
      <div className="container mx-auto flex justify-end">
        <div className="flex items-center space-x-4">
          <Link href="/articles" className={activeClass("/articles")}>
            Articles
          </Link>
          <Link href="/profile" className="flex items-center space-x-2">
            <ProfileImage />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
