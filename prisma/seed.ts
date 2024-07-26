import prisma from "../src/lib/prisma/db";
import { hashPassword } from "../src/utils/bcrypt";

async function main() {
  await prisma.rating.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await hashPassword("ankit123");

  await prisma.user.create({
    data: {
      name: "Ankit",
      email: "ankit@mail.com",
      password: hashedPassword,
      avatar: `https://avatar.iran.liara.run/username?username=Ankit`,
      addresses: {
        create: [
          {
            address: "123 Main St, Springfield",
          },
        ],
      },
      ratings: {
        create: [
          {
            score: 4,
            product: {
              create: {
                name: "Laptop",
                price: 1000,
                rating: 4,
                discount: 100,
                no_of_sales: 150,
              },
            },
          },
        ],
      },
    },
    include: {
      addresses: true,
      ratings: {
        include: {
          product: true,
        },
      },
    },
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
