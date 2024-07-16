// components/Navbar.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const activeClass = (path: string) =>
    pathname === path
      ? "text-blue-500 border-b-2 border-blue-500"
      : "text-gray-700";

  return (
    <nav className="bg-white p-4 shadow-md mb-4">
      <div className="container mx-auto flex justify-end">
        <div className="flex space-x-4">
          <Link href="/profile">Profile</Link>
          <Link href="/articles">Articles</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
