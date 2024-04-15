import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {

  const eduardo = await bcrypt.hash('007oterrordosmlk', roundsOfHashing);
  const tom = await bcrypt.hash('tomtom157', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'doandradejr@gmail.com' },
    update: {
      password: eduardo
    },
    create: {
      email: 'doandradejr@gmail.com',
      name: 'Eduardo Torres',
      password: eduardo,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'tom@gmail.com' },
    update: {
      password: tom
    },
    create: {
      email: 'tom@gmail.com',
      name: 'Tom Richard',
      password: tom,
    },
  });

  // create three dummy articles
  
  console.log({ user1, user2 });

}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });