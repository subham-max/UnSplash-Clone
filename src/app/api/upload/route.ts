// app/api/upload/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const logPath = path.join(process.cwd(), "upload-debug.txt");
  const log = (msg: string) => {
    const logMsg = `${new Date().toISOString()} - ${msg}\n`;
    fs.appendFileSync(logPath, logMsg);
  };

  try {
    log("--- UPLOAD ATTEMPT START ---");
    // Check authentication
    log("Checking session...");
    const session = await getServerSession(authOptions);
    log("Session found: " + (session ? "YES" : "NO"));
    
    if (!session?.user) {
      log("Result: FAILED (Unauthorized - No user)");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    log("User ID: " + userId);
    if (!userId) {
      log("Result: FAILED (Unauthorized - No userId)");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    log("Parsing form data...");
    const data = await req.formData();
    const file = data.get("file") as File;
    const title = data.get("title") as string || file?.name;

    if (!file) {
      log("Result: FAILED (No file)");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    log("File: " + file.name + " (" + file.type + ", " + file.size + " bytes)");

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      log("Result: FAILED (Invalid type)");
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      log("Result: FAILED (File too large)");
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    log("Converting file to buffer...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    log("Starting Cloudinary upload...");
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "unsplash-clone",
        },
        (error, result) => {
          if (error) {
            log("Cloudinary error: " + JSON.stringify(error));
            reject(error);
          } else {
            log("Cloudinary upload successful");
            resolve(result as UploadApiResponse);
          }
        }
      );
      uploadStream.end(buffer);
    });

    log("Saving to database...");
    const photo = await prisma.photo.create({
      data: {
        title: title,
        imageUrl: result.secure_url,
        userId: userId,
      },
    });

    log("Result: SUCCESS");
    return NextResponse.json({ 
      success: true, 
      photo: photo 
    });

  } catch (error: any) {
    log("CRITICAL ERROR: " + error.message);
    if (error.stack) log("STACK: " + error.stack);
    return NextResponse.json(
      { error: "Upload failed: " + (error.message || "Unknown error") }, 
      { status: 500 }
    );
  }
}