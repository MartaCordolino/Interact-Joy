// utils/persistencia.js

// Envia dados de progresso para o backend
export async function salvarProgresso({ id_crianca, id_jogo, porcentagem, tentativas }) {
  try {
    // Validação mínima
    if (!id_crianca || !id_jogo || porcentagem === undefined || tentativas === undefined) {
      throw new Error('Dados obrigatórios ausentes para salvar progresso.');
    }

    console.log('🔄 Enviando progresso:', { id_crianca, id_jogo, porcentagem, tentativas });

    const resposta = await fetch('/api/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_crianca: Number(id_crianca),
        id_jogo: Number(id_jogo),
        porcentagem: Number(porcentagem),
        tentativas: Number(tentativas),
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro?.error || 'Erro ao salvar progresso.');
    }
  } catch (erro) {
    console.error('❌ Erro na persistência do progresso:', erro.message);
  }
}

// Envia dados de conquista para o backend
export async function salvarConquista({ id_crianca, id_jogo, tipo_conquista, descricao }) {
  try {
    if (!id_crianca || !id_jogo || !tipo_conquista || !descricao) {
      throw new Error('Dados obrigatórios ausentes para salvar conquista.');
    }

    console.log('🎖️ Enviando conquista:', { id_crianca, id_jogo, tipo_conquista, descricao });

    const resposta = await fetch('/api/conquistas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_crianca: Number(id_crianca),
        id_jogo: Number(id_jogo),
        tipo_conquista,
        descricao: descricao.trim(),
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro?.error || 'Erro ao salvar conquista.');
    }

  } catch (erro) {
    console.error('❌ Erro na persistência da conquista:', erro.message);
  }
}
