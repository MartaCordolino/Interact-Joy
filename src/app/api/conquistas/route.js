import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      id_crianca,
      id_jogo, // pode ser um número (id) ou uma string (url_path)
      tipo_conquista,
      titulo,
      descricao,
    } = body;

    // 🔍 Validações básicas
    if (!id_crianca || !id_jogo || !tipo_conquista || !titulo || !descricao) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // 🔁 Flexibilidade: aceitar id numérico ou url_path (string)
    let jogo;
    if (typeof id_jogo === 'number') {
      jogo = await prisma.jogos.findUnique({ where: { id: id_jogo } });
    } else if (typeof id_jogo === 'string') {
      jogo = await prisma.jogos.findUnique({ where: { url_path: id_jogo } });
    }

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado.' },
        { status: 404 }
      );
    }

    // 🎯 Criação da conquista
    const novaConquista = await prisma.conquistas.create({
      data: {
        id_crianca: Number(id_crianca),
        id_jogo: jogo.id,
        tipo_conquista,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
      },
    });

    return NextResponse.json(novaConquista, { status: 201 });
  } catch (erro) {
    console.error('Erro ao salvar conquista:', erro);
    return NextResponse.json(
      { error: 'Erro interno ao salvar conquista.' },
      { status: 500 }
    );
  }
}

