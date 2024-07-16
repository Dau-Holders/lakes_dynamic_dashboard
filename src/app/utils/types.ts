export interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  keywords: string;
  selectedLakes: string[];
  approved: "Pending" | "Approved" | "Rejected";
}
