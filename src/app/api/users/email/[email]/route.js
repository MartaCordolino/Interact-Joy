import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
  const {email} = await context.params;
  
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
  }
  const decodeEmail = decodeURIComponent(email);
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { email: decodeEmail }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
