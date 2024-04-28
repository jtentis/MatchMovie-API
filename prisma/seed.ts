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

  const movie1 = await prisma.movie.create({
    data: {
      title: 'The Shawshank Redemption',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      releaseDate: new Date('1994-09-23'),
      favoritedBy: { connect: { id: user1.id } },
      watchedBy: { connect: { id: user2.id } },
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      title: 'The Godfather',
      description: 'An organized crime dynastys aging patriarch transfers control of his clandestine empire to his reluctant son.',
      releaseDate: new Date('1972-03-24'),
      favoritedBy: { connect: { id: user1.id } },
      watchedBy: { connect: { id: user2.id } },
    },
  });

  const group = await prisma.group.create({
    data: {
      name: 'Grupo do Eduardo e Tom',
      image: 'src/assets/images/funny-cat-closeup3.jpg', 
      users: { connect: [{ id: user1.id }, { id: user2.id }] }, 
    },
  });

  console.log({ user1, user2, movie1, movie2, group });
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
