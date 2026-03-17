require("dotenv").config({ path: ".env" });
const { PrismaClient } = require("./src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
const bcrypt = require("bcryptjs");

neonConfig.webSocketConstructor = ws;

console.log("DATABASE_URL check:", process.env.DATABASE_URL ? "Defined" : "Undefined");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env file");
}
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        name: "Test User",
        password: hashedPassword,
      },
    });

    console.log("-----------------------------------------");
    console.log("✅ Test user created/updated successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
