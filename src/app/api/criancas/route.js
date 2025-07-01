import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/utils/auth'; // para hash seguro

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nome,
      email,
      senha,
      idade,
      faixaEtaria,       // ← corrigido
      nivelSuporte,      // ← corrigido
      responsavelId,
      especialistaId
    } = body;

    if (!nome || !email || !idade || !nivelSuporte) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    const senhaHash = await hashSenha(senha);

    // Cria o usuário com perfil autista
    const novaCrianca = await prisma.usuarios.create({
      data: {
        nome: nome.toUpperCase(),
        email,
        senha: senhaHash,
        idade,
        faixa_etaria: faixaEtaria,
        nivel_suporte: nivelSuporte,
        perfil: 'autista',
        responsavel_id: responsavelId || null
      },
    });

    if (especialistaId) {
      await prisma.especialistas_criancas.create({
        data: {
          especialista_id: especialistaId,
          crianca_id: novaCrianca.id,
        },
      });
    }

    return NextResponse.json(
      {
        message: 'Criança cadastrada com sucesso.',
        novaCrianca,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao cadastrar criança:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
