import prisma from "../src/lib/prisma/db";

async function main() {
  const product = await prisma.product.create({
    data: {
      name: "Product A",
      price: 100,
      rating: 4.5,
      discount: 10,
      no_of_sales: 50,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@mail.com",
      avatar: "https://avatar.iran.liara.run/public/alice",
      addresses: {
        create: {
          address: "123 Main St, Wonderland",
        },
      },
      ratings: {
        create: {
          score: 5,
          productId: product.id,
        },
      },
    },
  });

  console.log("User created:", user);
  console.log("Product created:", product);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
