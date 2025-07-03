import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
  const { id } = await context.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: userId },
      include: {
        // Especialistas: vínculo N:N com crianças
        criancas: { include: { crianca: true } },
        // Responsável: vínculo direto com um filho (perfil autista)
        filhos: true,
      }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    let criancasTransformadas = [];

    // Se for especialista, reestruturamos os dados de vínculo com crianças
    if (usuario.perfil === 'especialista') {
      criancasTransformadas = (usuario.criancas || [])
        .map(relacao => {
          const c = relacao.crianca;
          return {
            id: c?.id ?? null,
            nome: c?.nome ?? '',
            idade: isNaN(c?.idade) ? null : c?.idade,
            email: c?.email ?? '',
            nivelSuporte: c?.nivel_suporte ?? '',
          };
        })
        .filter(c => c.id !== null);
    }

    return NextResponse.json({
      ...usuario,
      criancas: criancasTransformadas.length > 0 ? criancasTransformadas : undefined,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 });
  }
}
