"use client";
import Navbar from "./components/navbar";
import UserDashboard from "./components/userDashboard";
import { ArticlesProvider } from "./contexts/articlesContext";

export default function Home() {
  return <UserDashboard />;
}
