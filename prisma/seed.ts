import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {

  const eduardo = await bcrypt.hash('senha123', roundsOfHashing);
  const joao = await bcrypt.hash('senha123', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'eduardo@gmail.com' },
    update: {
      password: eduardo
    },
    create: {
      email: 'eduardo@gmail.com',
      name: 'Eduardo',
      second_name: 'Torres',
      user: 'duds',
      password: eduardo,
      cpf: '11111111111',
      location: '22740010',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'joao@lindo.com' },
    update: {
      password: joao
    },
    create: {
      email: 'joao@lindo.com',
      name: 'joao',
      second_name: 'pedro',
      user: 'jtentis',
      password: joao,
      cpf: '12312312312',
      location: '22740010',
    },
  });

  const group1 = await prisma.group.create({
    data: {
      name: 'Grupo escola',
      image: null,
      users: {
        create: [
          { user: { connect: { id: user1.id } } },
          { user: { connect: { id: user2.id } } },
        ],
      },
    },
  });

  const group2 = await prisma.group.create({
    data: {
      name: 'Grupo trabalho',
      image: null,
      users: {
        create: [
          { user: { connect: { id: user1.id } } },
          { user: { connect: { id: user2.id } } },
        ],
      },
    },
  });

  const group3 = await prisma.group.create({
    data: {
      name: 'Grupo familia',
      image: null,
      users: {
        create: [
          { user: { connect: { id: user1.id } } },
        ],
      },
    },
  });

  const group4 = await prisma.group.create({
    data: {
      name: 'Grupo faculdade',
      image: null,
      users: {
        create: [
          { user: { connect: { id: user2.id } } },
        ],
      },
    },
  });

  console.log({ user1, user2, group1, group2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });