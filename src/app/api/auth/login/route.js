import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
      where: { email }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Senha incorreta.' },
        { status: 401 }
      );
    }

    // Aqui você pode implementar geração de token ou sessão, se desejar

    return NextResponse.json(
      {
        message: 'Login bem-sucedido.',
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
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
