// src/app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compararSenha } from '@/utils/auth';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { email },
      include: { planos_assinatura: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    const senhaValida = await compararSenha(senha, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Senha incorreta.' },
        { status: 401 }
      );
    }

    const planoAtivo = usuario.planos_assinatura?.ativo === true;

    // Bloco simplificado para perfis autistas
    let dadosAutista = null;
    if (usuario.perfil === 'autista') {
      dadosAutista = {
        criancaId: usuario.id,
        idade: usuario.idade ?? null,
        faixa_etaria: usuario.faixa_etaria ?? null,
        nivel_suporte: usuario.nivel_suporte ?? null,
      };
    }

    return NextResponse.json(
      {
        message: 'Login bem-sucedido.',
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil,
          planoAtivo,
          ...dadosAutista, // será ignorado se for null
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro interno no login.' },
      { status: 500 }
    );
  }
}
