/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const firstPostId = "5c03994c-fc16-47e0-bd02-d218a370a078";
  const hashtagId = "1960e2c0-c885-4b67-8b81-f8372151c063";

  await prisma.hashtag.upsert({
    where: { id: hashtagId },
    create: { id: hashtagId, name: "Pregnancy" },
    update: {},
  });
  await prisma.room.upsert({
    where: {
      id: firstPostId,
    },
    create: {
      id: firstPostId,
      authorName: "Наталья",
      title: "Первый месяц беременности",
      description: "что посоветуете? какие медикаменты принимать?",
      isQuestion: false,
      hashtagId,
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
