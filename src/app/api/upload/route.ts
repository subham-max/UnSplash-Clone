import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);

    await fs.writeFile(filePath, buffer);

    const photo = await prisma.photo.create({
  data: {
    title: file.name,
    imageUrl: `/uploads/${file.name}`,
    userId: "PASTE_USER_ID_HERE"
  }
});

    return NextResponse.json({
      message: "Upload successful",
      url: `/uploads/${file.name}`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}