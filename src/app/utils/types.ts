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

export interface MetadataPayload {
  id: string;
  title: string;
  description: string;
  period: string;
  email: string;
  file: string;
  uploader: string;
  lake: string;
  status: string;
}

export interface ProjectPayload {
  id: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  uploader: string;
  status: string;
  lake: string;
}

export interface PhotoPayload {
  id: string;

  description: string;
  capture_date: Date;
  lake: string;
  uploader: string;
  image: string;
}
