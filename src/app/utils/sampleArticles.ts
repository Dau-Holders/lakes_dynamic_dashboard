// import { Article } from "./types";

import { MetadataPayload, PhotoPayload, ProjectPayload } from "./types";

// export const sampleArticles: Article[] = [
//   {
//     id: "1",
//     title: "Sample Article 1",
//     author: "John Doe, Jane Smith",
//     abstract: "This is the abstract of Sample Article 1.",
//     y: new Date("2023-01-15"),
//     keywords: "sample, article, keywords",
//     selectedLakes: ["Lake Victoria"],
//     approved: "Approved",
//   },
//   {
//     id: "2",
//     title: "Sample Article 2",
//     authors: ["Alice Johnson"],
//     abstract: "This is the abstract of Sample Article 2.",
//     publicationDate: new Date("2023-02-20"),
//     keywords: "sample, article",
//     selectedLakes: ["Lake Malawi"],
//     approved: "Pending",
//   },
//   {
//     id: "3",
//     title: "Sample Article 3",
//     authors: ["Bob Williams", "Eve Brown"],
//     abstract: "This is the abstract of Sample Article 3.",
//     publicationDate: new Date("2023-03-10"),
//     keywords: "article, example",
//     selectedLakes: ["Lake Tanganyika"],
//     approved: "Rejected",
//   },
// ];

export const sampleMetadata: MetadataPayload[] = [
  {
    title: "Test metadata",
    id: "9997ee94-ffd4-4f8e-a25d-026a4ce44f0f",
    description: "this is metadata",
    period: "2012 - 2014",
    email: "daktari2033@gmail.com",
    file: "https://dau-bucket.ams3.cdn.digitaloceanspaces.com/dau-bucket/static/metadata/9PkJpW8Ql9.pdf",
    uploader: "masinde",
    lake: "Lake Victoria",
    status: "pending",
  },
  {
    title: "Metadata test two",
    id: "9cfa32c8-d8f8-4a9b-840b-5c45616c76d1",
    description: "Sample metadata two",
    period: "2012 - 2014",
    email: "daktari2033@gmail.com",
    file: "https://dau-bucket.ams3.cdn.digitaloceanspaces.com/dau-bucket/static/metadata/9PkJpW8Ql9.pdf",
    uploader: "masinde",
    lake: "Lake Kivu",
    status: "approved",
  },
];

export const sampleProjects: ProjectPayload[] = [
  {
    id: "1",
    title: "Lake Victoria Conservation Initiative",
    description:
      "A project focused on the conservation of biodiversity in Lake Victoria, with an emphasis on sustainable fishing practices and pollution control.",
    latitude: "-1.286389",
    longitude: "32.817222",
    uploader: "jdoe",
    status: "pending",
    lake: "Lake Victoria",
  },
  {
    id: "2",
    title: "Lake Tanganyika Water Quality Study",
    description:
      "This project aims to monitor and improve the water quality in Lake Tanganyika by analyzing various pollutants and implementing corrective measures.",
    latitude: "-6.274444",
    longitude: "29.480833",
    uploader: "asmith",
    status: "approved",
    lake: "Lake Tanganyika",
  },
];

export const samplePhotos: PhotoPayload[] = [
  {
    id: "1",
    description: "A beautiful sunset captured over Lake Victoria.",
    capture_date: new Date("2024-01-15"),
    lake: "Lake Victoria",
    uploader: "John Doe",
    image:
      "https://dau-bucket.ams3.cdn.digitaloceanspaces.com/dau-bucket/static/lakephotos/PHOTO-2024-08-02-17-58-02.jpg",
  },
  {
    id: "2",
    description: "A misty morning with calm waters at Lake Tanganyika.",
    capture_date: new Date("2024-03-10"),
    lake: "Lake Tanganyika",
    uploader: "Jane Smith",
    image:
      "https://dau-bucket.ams3.cdn.digitaloceanspaces.com/dau-bucket/static/lakephotos/turkana1.jpg",
  },
  {
    id: "3",
    description:
      "Colorful fishing boats lined up on the shores of Lake Malawi.",
    capture_date: new Date("2024-02-22"),
    lake: "Lake Malawi",
    uploader: "Samuel Johnson",
    image:
      "https://dau-bucket.ams3.cdn.digitaloceanspaces.com/dau-bucket/static/lakephotos/turkana1.jpg",
  },
];
