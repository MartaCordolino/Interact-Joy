// src/app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/utils/auth';

export async function POST(request) {
  try {
    const { nome, email, senha, perfil, cpf, tipoPlano } = await request.json();

    if (!nome || !email || !senha || !perfil) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    if (!['responsavel', 'especialista'].includes(perfil)) {
      return NextResponse.json({ error: 'Perfil inválido para este endpoint.' }, { status: 400 });
    }

    const existente = await prisma.usuarios.findUnique({ where: { email } });
    if (existente) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const senhaHash = await hashSenha(senha);

    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome: nome.toUpperCase(),
        email,
        senha: senhaHash,
        perfil,
        cpf,
        planos_assinatura: {
          create: {
            tipo: tipoPlano || 'mensal'  // ← padrão caso não venha do front
          }
        }
      }
    });

    return NextResponse.json(
      { message: 'Cadastro realizado com sucesso.', userId: novoUsuario.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário.' },
      { status: 500 }
    );
  }
}
