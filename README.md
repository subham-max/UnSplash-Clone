This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




-------------------------------------------------------------------------------------

Codebase Overview: Unsplash Clone
This project is a modern, full-stack Unsplash Clone built with the latest web technologies. It provides a platform for users to upload, discover, and organize high-quality photos.

🚀 Tech Stack
Framework: Next.js 15+ (App Router)
Language: TypeScript
Database: Prisma with Neon PostgreSQL
Authentication: Next Auth
Styling: Tailwind CSS 4
Image Storage: Cloudinary (Integration for cloud-based image handling)
📂 Core Structure
/src/app: Contains the application routes and UI.
page.tsx: The main gallery feed.
/upload: Logic for uploading new photos.
/api: Server-side endpoints (e.g., handling uploads).
/prisma: Defines the database schema and migrations.
/public: Static assets.
📊 Data Model
The application uses a robust relational database schema:

Model	Description
User	Stores profile info, likes, and collections.
Photo	Main entity with title, image URL, and metadata like blurHash.
Collection	Allows users to group photos together.
Tag	For categorizing and searching photos.
Like	Tracks interactions between users and photos.
✨ Main Features
Photo Feed: Displays a responsive grid of the latest uploaded photos on the home page.
Image Uploads: Users can upload photos via a dedicated interface that integrates with Cloudinary.
Authentication: Secure user login/signup using Next Auth.
Social Interactions: Support for liking photos and managing collections.
SEO & Performance: Optimized image loading and semantic HTML structure.


-------------------------------------------

UnSplash-Clone Codebase Analysis
This project is a full-stack web application designed to clone the core functionality of Unsplash. It allows users to view, upload, and manage high-quality photos.

🛠️ Technology Stack
Framework: Next.js (App Router) - Provides both the frontend pages and backend API routes.
Database: PostgreSQL (via Neon) - A serverless database for storing user data, photo metadata, and relationships.
ORM: Prisma - Used to interact with the database using TypeScript types.
Authentication: Next-Auth - Handles secure login using email/password (Credentials provider).
Storage: Cloudinary - Used for hosting and optimizing uploaded images.
Styling: Tailwind CSS - For modern, responsive UI design.
🏗️ Core Architecture & Process Flow
The application follows the modern Next.js architecture where the frontend and backend are tightly integrated.

1. Photo Discovery (The Homepage)
File: 
src/app/page.tsx
Flow:
When you visit the homepage (/), the server executes 
page.tsx
.
It uses Prisma to fetch all photos from the database, ordered by creation date.
The photos are rendered in a responsive grid layout.
2. Authentication (Login)
Configuration: 
src/app/lib/auth.ts
Flow:
User enters credentials on the /login page.
Next-Auth sends these to the 
authorize
 callback in 
auth.ts
.
The system searches for the user in the database via Prisma and compares the hashed password using bcrypt.
If valid, a secure JWT session is created and stored in a cookie.
3. Image Upload (The "Creator" Flow)
UI Page: 
src/app/upload/page.tsx
API Route: 
src/app/api/upload/route.ts
Flow:
User selects a file and enters a title in the upload form.
The form sends a multipart/form-data POST request to /api/upload.
The server verifies the user's session (must be logged in).
The file is streamed to Cloudinary.
Cloudinary returns a secure URL for the image.
Prisma saves a new Photo record in the database with the Cloudinary URL and the userId.
🗄️ Database Models (Prisma)
The 
schema.prisma
 defines how your data is structured:

User: Stores email, hashed password, name, and bio.
Photo: Stores title, imageUrl (from Cloudinary), and links to the User who uploaded it.
Like / Collection / Tag: Infrastructure is ready for social features like liking photos, organizing them into collections, and tagging them for search.
🚦 Current Status & "Hidden" Logic
Registration: There is currently no public registration page. Users are created using a maintenance script: 
create-test-user.js
.
Debugging: The project has detailed logging in 
upload-debug.txt
 and 
auth-debug.txt
 to help track any issues with Cloudinary or Authentication.
