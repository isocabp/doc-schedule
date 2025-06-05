import { createUploadthing, type FileRouter } from "uploadthing/next";

const uploadthing = createUploadthing();

export const ourFileRouter = {
  imageUploader: uploadthing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(({ file }) => {
    console.log("Upload concluído. URL do arquivo:", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
