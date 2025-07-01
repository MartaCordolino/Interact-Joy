// Envia dados de progresso para o backend
export async function salvarProgresso({ id_crianca, id_jogo, porcentagem }) {
  try {
    const resposta = await fetch('/api/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_crianca, id_jogo, porcentagem }),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao salvar progresso.');
    }
  } catch (erro) {
    console.error('Erro na persistência do progresso:', erro);
  }
}

// Envia dados de conquista para o backend
export async function salvarConquista({ id_crianca, id_jogo, tipo, titulo, descricao }) {
  try {
    // Validação prévia
    if (!id_crianca || !id_jogo || !tipo || !titulo || !descricao) {
      throw new Error('Dados insuficientes para salvar conquista.');
    }

    const resposta = await fetch('/api/conquistas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_crianca: Number(id_crianca),
        id_jogo: Number(id_jogo),
        tipo_conquista: tipo, // deve ser 'trofeu' ou 'medalha'
        titulo: titulo.trim(),
        descricao: descricao.trim(),
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro?.error || 'Erro ao salvar conquista.');
    }

  } catch (erro) {
    console.error('Erro na persistência da conquista:', erro.message);
  }
}

