import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_, {params}) {
  const { id } = await params;
  const criancaId = parseInt(id);
  
  if (isNaN(criancaId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const progresso = await prisma.progresso.findMany({
      where: { id_crianca: criancaId },
    });

    return NextResponse.json(progresso);
  } catch (erro) {
    console.error('Erro ao buscar progresso:', erro);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
