import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  console.log("🛍️ Seeding products... ");
  const products = await prisma.products.createMany({
    data: [
      {
        name: "FLOW Hydration Lemonade",
        description:
          "FLOW Lemonade brings you clean hydration with our classic Lemonade taste. Refreshing and tangy this classic flavour is sure to keep your fatigue away. Containing essential salts and vitamins, FLOW Lemonade is sure to keep your thirst away.",
        price: 0,
        stock: 0,
        imageUrl: "lemonade",
        searchTags: ["lemon", "lemonade", "citrus", "refreshing", "tangy"],
      },
      {
        name: "FLOW Hydration Original",
        description:
          "FLOW Original brings you clean hydration with our unique original flavour. We’ve pushed the boundaries of flavour to come up with a unique taste that certainly keeps your tastebuds guessing.Containing 5 essential salts and 7 vitamins, FLOW Original is sure to keep your thirst away.",
        price: 0,
        stock: 0,
        imageUrl: "original",
        searchTags: ["original", "regular", "classic"],
      },
      {
        name: "FLOW Hydration Mango",
        description:
          "FLOW Mango brings you a balanced mango flavour thats sure to evoke nostalgia. Stay hydrated with mango through all seasons. Containing 5 essential salts and 7 vitamins, FLOW Mango is sure to keep your thirst away",
        price: 0,
        stock: 0,
        imageUrl: "mango",
        searchTags: ["mango", "tropical", "fruity", "sweet"],
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${products.count} products`);

  const totalProducts = await prisma.products.count();
  console.log(`🔍 Total products in database: ${totalProducts}`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
