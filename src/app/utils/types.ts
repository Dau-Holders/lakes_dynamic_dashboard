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

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  gender: string;
  organization: string;
  designation: string;
  photo: string;
}
