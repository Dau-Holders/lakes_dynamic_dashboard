export interface Article {
  id: string;
  title: string;
  author: string;
  abstract: string;
  year: string;
  keywords: string;
  lake: string[];
  is_published: boolean;
  status: "pending" | "approved" | "rejected";
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
