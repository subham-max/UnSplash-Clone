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
