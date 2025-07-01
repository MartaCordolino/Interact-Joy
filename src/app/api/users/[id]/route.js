import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_,{params}) {
  const { id } = await params;
  const userId = parseInt(id);
  
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: userId },
      include: {
        filhos: true, // Se for responsável
        especialistas: {
          include: { especialista: true } // Se for criança
        },
        criancas: {
          include: { crianca: true } // Se for especialista
        },
        conquistas: true,
        progresso: true,
        planos_assinatura: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
