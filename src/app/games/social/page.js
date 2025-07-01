// src/app/games/social/page.js
'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import { Volume2, ArrowLeft } from 'lucide-react';
import AccessibilityControls from '@/components/AccessibilityControls';
import RewardAnimation from '@/components/RewardAnimation';
import gameConfig from '@/config/game_config.json';
import { registrarProgresso, registrarConquista } from '@/utils/persistencia';

function SocialGame() {
  const router = useRouter();
  const { settings, increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dashboardPath, setDashboardPath] = useState('/dashboard/usuario');
  const [userId, setUserId] = useState(null);

  const perguntas = [
    {
      pergunta: 'O que você deve dizer ao encontrar um colega?',
      opcoes: ['Tchau', 'Bom dia', 'Nada'],
      correta: 'Bom dia',
    },
    {
      pergunta: 'Como pedir algo educadamente?',
      opcoes: ['Me dá logo', 'Por favor', 'Agora'],
      correta: 'Por favor',
    },
  ];

  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const tipo = localStorage.getItem('userType');
    const id = localStorage.getItem('userId');
    setUserId(id);
    if (tipo === 'guest') {
      setDashboardPath('/dashboard/convidado');
    }

    const idade = parseInt(localStorage.getItem('userAge'), 10);
    const suporte = localStorage.getItem('userSupport');
    const faixa = idade >= 10 ? '10-12' : '7-9';
    const chave = `${faixa}_${suporte}`;
    const desbloqueado = gameConfig[chave]?.social?.unlocked;

    if (!desbloqueado && tipo !== 'guest') {
      setIsLocked(true);
    }
  }, []);

  const handleOpcao = async (opcao) => {
    if (opcao === perguntas[indice].correta) {
      setScore((prev) => prev + 1);
      setFeedback('Muito bem!');
      increaseDifficulty('social');
    } else {
      setFeedback('Ops, tente novamente!');
      setAttempts((prev) => prev + 1);
      if (attempts + 1 >= 3) decreaseDifficulty('social');
    }

    setShowReward(true);
    setTimeout(async () => {
      setShowReward(false);
      setFeedback('');
      const novoIndice = indice + 1;
      if (novoIndice < perguntas.length) {
        setIndice(novoIndice);
      } else {
        if (userId && localStorage.getItem('userType') !== 'guest') {
          await registrarProgresso({
            id_crianca: userId,
            id_jogo: 4,
            porcentagem: Math.round((score / perguntas.length) * 100),
            tentativas: attempts,
          });

          await registrarConquista({
            id_crianca: userId,
            id_jogo: 4,
            titulo: 'Sociável',
            descricao: 'Completou o jogo social com sucesso!',
            tipo: 'troféu',
          });
        }
      }
    }, 2000);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Jogo bloqueado</h2>
          <p className="mb-4 text-gray-800">Este jogo ainda não está disponível para seu nível de suporte ou faixa etária.</p>
          <button onClick={() => router.push(dashboardPath)} className="text-blue-700 underline font-semibold">
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 relative">
      <Head><title>Jogos Sociais - Interact Joy</title></Head>
      <div className="absolute top-2 right-2 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between text-white">
        <button onClick={() => router.back()}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Jogos Sociais</h1>
        <button onClick={() => {
          const frase = new SpeechSynthesisUtterance("Jogo de habilidades sociais.");
          speechSynthesis.speak(frase);
        }}><Volume2 /></button>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl text-purple-700 font-bold mb-4">{perguntas[indice]?.pergunta}</h2>
          <div className="space-y-3">
            {perguntas[indice]?.opcoes.map((op, i) => (
              <button
                key={i}
                onClick={() => handleOpcao(op)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl"
              >
                {op}
              </button>
            ))}
          </div>
        </div>
        {feedback && <p className="text-lg text-center font-medium text-green-700">{feedback}</p>}
        {showReward && <RewardAnimation message="Ótimo trabalho!" type="stars" />}
      </main>
    </div>
  );
}

export default function SocialGamePage() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  return (
    <DifficultyProvider userId={userId}>
      <SocialGame />
    </DifficultyProvider>
  );
}
