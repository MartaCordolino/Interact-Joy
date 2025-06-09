import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { nome, email, senha, perfil } = await request.json();

    if (!nome || !email || !senha || !perfil) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const perfisValidos = ['autista', 'responsavel', 'especialista'];
    if (!perfisValidos.includes(perfil)) {
      return NextResponse.json(
        { error: 'Perfil inválido.' },
        { status: 400 }
      );
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido.' },
        { status: 400 }
      );
    }

    const emailExiste = await prisma.usuarios.findUnique({ where: { email } });
    if (emailExiste) {
      return NextResponse.json(
        { error: 'Email já cadastrado.' },
        { status: 400 }
      );
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        perfil,
      },
    });

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso.',
        user: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          perfil: novoUsuario.perfil,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
