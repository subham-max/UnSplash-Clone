require("dotenv").config();
const prisma = require("./src/app/lib/prisma").default;

async function test() {
  try {
    console.log("Attempting to connect to Prisma...");
    const userCount = await prisma.user.count();
    console.log("Prisma connection successful! User count:", userCount);
  } catch (err) {
    console.error("Prisma connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
