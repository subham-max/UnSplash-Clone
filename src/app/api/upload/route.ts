// app/api/upload/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Type assertion to help TypeScript
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as File;
    const title = data.get("title") as string || file.name;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "unsplash-clone",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );
      uploadStream.end(buffer);
    });

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        title: title,
        imageUrl: result.secure_url,
        userId: userId, // Use the userId variable
      },
    });

    return NextResponse.json({ 
      success: true, 
      photo: photo 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") }, 
      { status: 500 }
    );
  }
}