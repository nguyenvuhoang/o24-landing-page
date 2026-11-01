import type { ReactNode } from "react";
import { getPublishedArticles } from "@/data/blog";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export default function BlogLayout({ children }: { children: ReactNode }) {
  const articles = getPublishedArticles().map(({ slug, title, description, category }) => ({ slug, title, description, category }));
  return <>{children}<RelatedArticles articles={articles} /></>;
}
