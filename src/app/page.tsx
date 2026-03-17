import prisma from "@/app/lib/prisma";
import { Key } from "react";

export default async function Home() {
  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="grid grid-cols-3 gap-4 p-10">
      {photos.map((photo: { id: Key | null | undefined; imageUrl: string | Blob | undefined; title: string | undefined; }) => (
        <img
          key={photo.id}
          src={photo.imageUrl}
          alt={photo.title}
          className="rounded-lg"
        />
      ))}
    </div>
  );
}