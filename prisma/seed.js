import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.jogos.upsert({
    where: { url_path: 'emotions' },
    update: {},
    create: {
      nome: 'Jogo das Emoções',
      url_path: 'emotions',
      categoria: 'Habilidades Socioemocionais',
    },
  });

  await prisma.jogos.upsert({
    where: { url_path: 'communication' },
    update: {},
    create: {
      nome: 'Forme Palavras',
      url_path: 'communication',
      categoria: 'Comunicação',
    },
  });

  await prisma.jogos.upsert({
    where: { url_path: 'colors' },
    update: {},
    create: {
      nome: 'Mundo das Cores',
      url_path: 'colors',
      categoria: 'Percepção Visual',
    },
  });

  await prisma.jogos.upsert({
    where: { url_path: 'social' },
    update: {},
    create: {
      nome: 'Jogos Sociais',
      url_path: 'social',
      categoria: 'Habilidades Sociais',
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
