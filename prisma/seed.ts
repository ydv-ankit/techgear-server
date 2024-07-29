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
            address_line_1: "123 Townsend St",
            address_line_2: "Floor 6",
            street_name: "CP",
            city: "Delhi",
            postal_code: "237479",
            country: "India",
          },
        ],
      },
      ratings: {
        create: [
          {
            score: 4,
            Product: {
              create: {
                name: "Laptop",
                image: `https://res.cloudinary.com/db4xfdj2m/image/upload/f_auto,q_auto/v1/techgear/udhc4xzxrrwyo3mqsrol`,
                price: 263.32,
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
          Product: true,
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
