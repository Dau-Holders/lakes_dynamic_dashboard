"use client";

import { ArticlesProvider } from "../contexts/articlesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ArticlesProvider>{children}</ArticlesProvider>;
}
