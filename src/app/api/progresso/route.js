// src/app/api/progresso/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { id_crianca, id_jogo, porcentagem, tentativas } = await request.json();
    console.log('🔍 ID do jogo recebido:', id_jogo); // ← aqui

    if (!id_crianca || !id_jogo || porcentagem == null || tentativas == null) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando.' },
        { status: 400 }
      );
    }

    // Buscar o jogo pelo url_path
    const jogo = await prisma.jogos.findUnique({
      where: { url_path: id_jogo }, // id_jogo vem como 'emotions', 'colors' etc.
    });

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 }
      );
    }

    // Verifica se já existe progresso para essa criança e jogo
    const progressoExistente = await prisma.progresso.findFirst({
      where: {
        id_crianca,
        id_jogo: jogo.id,
      },
    });

    if (progressoExistente) {
      // Atualizar progresso existente
      await prisma.progresso.update({
        where: { id: progressoExistente.id },
        data: {
          porcentagem,
          tentativas,
          ultimo_acesso: new Date(),
        },
      });
    } else {
      // Criar novo registro de progresso
      await prisma.progresso.create({
        data: {
          id_crianca,
          id_jogo: jogo.id,
          porcentagem,
          tentativas,
        },
      });
    }

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao salvar progresso:', erro);
    return NextResponse.json({ error: 'Erro ao salvar progresso.' }, { status: 500 });
  }
}
