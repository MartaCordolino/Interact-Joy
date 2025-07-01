'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { AudioFeedbackSpeak } from '@/components/AudioFeedback';

const conversas = [
  {
    pergunta: 'Como você começa uma conversa com um colega na escola?',
    opcoes: ['Oi, tudo bem?', 'Dá meu lápis!', 'Sai da frente!'],
    correta: 'Oi, tudo bem?'
  },
  {
    pergunta: 'Qual é uma boa maneira de iniciar uma conversa?',
    opcoes: ['Me empresta isso!', 'Olá! Posso brincar com você?', 'Você está no meu lugar!'],
    correta: 'Olá! Posso brincar com você?'
  },
  {
    pergunta: 'O que dizer para fazer amizade?',
    opcoes: ['Você é feio!', 'Quer jogar comigo?', 'Não gosto de você!'],
    correta: 'Quer jogar comigo?'
  }
];

export default function ConversasGuest() {
  const [indice, setIndice] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const conversaAtual = conversas[indice];

  const handleResposta = (opcao) => {
    const correta = opcao === conversaAtual.correta;
    const msg = correta ? 'Excelente! Resposta correta!' : 'Hmm, tente novamente!';
    setFeedback(msg);
    AudioFeedbackSpeak(msg);

    if (correta) {
      setTimeout(() => {
        if (indice + 1 < conversas.length) {
          setIndice(indice + 1);
          setFeedback('');
        } else {
          setFinalizado(true);
        }
      }, 2000);
    }
  };

  return (
    <motion.div
      className="bg-yellow-50 rounded-xl p-6 shadow-lg w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-yellow-700 mb-4 text-center">🗣️ Iniciando Conversas</h2>

      {!finalizado ? (
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">{conversaAtual.pergunta}</p>
          <button
            onClick={() => AudioFeedbackSpeak(conversaAtual.pergunta)}
            className="mb-4 flex items-center justify-center gap-2 text-yellow-700 hover:underline"
            aria-label="Repetir instrução"
          >
            <Volume2 size={20} /> Ouvir Pergunta
          </button>

          <div className="flex flex-col gap-4 items-center">
            {conversaAtual.opcoes.map((opcao, idx) => (
              <button
                key={idx}
                onClick={() => handleResposta(opcao)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-80 shadow"
                aria-label={`Escolha: ${opcao}`}
              >
                {opcao}
              </button>
            ))}
          </div>

          {feedback && (
            <p className="mt-4 text-md font-semibold text-yellow-800">{feedback}</p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">🎉 Parabéns! Você concluiu o jogo!</p>
        </div>
      )}
    </motion.div>
  );
}
