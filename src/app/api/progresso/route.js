// src/app/api/progresso/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { id_crianca, id_jogo, porcentagem, tentativas } = await request.json();

    // Validação completa
    if (!id_crianca || !id_jogo || porcentagem === undefined || tentativas === undefined) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const jogoId = Number(id_jogo);
    if (isNaN(jogoId)) {
      return NextResponse.json(
        { error: 'ID do jogo inválido.' },
        { status: 400 }
      );
    }

    // Verifica se o jogo existe
    const jogo = await prisma.jogos.findUnique({
      where: { id: id_jogo },
    });

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 }
      );
    }

    // Verifica se já existe progresso
    const progressoExistente = await prisma.progresso.findFirst({
      where: {
        id_crianca,
        id_jogo: jogoId,
      },
    });

    if (progressoExistente) {
      await prisma.progresso.update({
        where: { id: progressoExistente.id },
        data: {
          porcentagem,
          tentativas,
          ultimo_acesso: new Date(),
        },
      });
    } else {
      await prisma.progresso.create({
        data: {
          id_crianca,
          id_jogo: jogoId,
          porcentagem,
          tentativas,
        },
      });
    }

    return NextResponse.json({ sucesso: true });

  } catch (erro) {
    console.error('❌ Erro ao salvar progresso:', erro);
    return NextResponse.json(
      { error: 'Erro interno ao salvar progresso.' },
      { status: 500 }
    );
  }
}
