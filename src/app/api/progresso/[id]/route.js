import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
  const { id } = await context.params; // ← uso correto com await
  const criancaId = parseInt(id);

  if (isNaN(criancaId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const progresso = await prisma.progresso.findMany({
      where: { id_crianca: criancaId },
      include: {
        jogo: {
          select: {
            id: true,
            nome: true,
            url_path: true, // necessário para desbloqueio no dashboard
          },
        },
      },
    });

    return NextResponse.json(progresso);
  } catch (erro) {
    console.error('Erro ao buscar progresso:', erro);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
