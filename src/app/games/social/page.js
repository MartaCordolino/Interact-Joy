'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import { Volume2 } from 'lucide-react';
import AccessibilityControls from '@/components/AccessibilityControls';
import RewardAnimation from '@/components/RewardAnimation';
import Link from 'next/link';
import Image from 'next/image';
import gameConfig from '@/config/game_config.json';
import { salvarProgresso, salvarConquista } from '@/utils/persistencia';

function SocialGame() {
  const router = useRouter();
  const { increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dashboardPath, setDashboardPath] = useState('/dashboard/usuario');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

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
    const nome = localStorage.getItem('userName');
    setUserId(id);
    setUserName(nome || '');

    if (tipo === 'guest') {
      setDashboardPath('/dashboard/convidado');
    }

    const idade = parseInt(localStorage.getItem('userAge'), 10);
    const suporte = localStorage.getItem('userSupport');
    const faixa = idade >= 10 ? '10-12' : '7-9';
    const desbloqueado = gameConfig[faixa]?.[suporte]?.some(j => j.id === 'social');

    if (!desbloqueado && tipo !== 'guest') {
      setIsLocked(true);
    }

    // 🔊 Instrução por áudio
    const instrucao = new SpeechSynthesisUtterance("Escolha a opção correta para cada situação social.");
    instrucao.lang = 'pt-BR';
    speechSynthesis.speak(instrucao);
  }, []);

  const handleOpcao = async (opcao) => {
    if (opcao === perguntas[indice].correta) {
      setScore((prev) => prev + 1);
      setFeedback('Muito bem!');

      // 🔊 Reforço positivo
      const frase = new SpeechSynthesisUtterance("Muito bem! Você acertou!");
      frase.lang = 'pt-BR';
      speechSynthesis.speak(frase);

      increaseDifficulty('social');
    } else {
        setFeedback('Ops, tente novamente!');
        const fraseErro = new SpeechSynthesisUtterance("Tente novamente.");
        fraseErro.lang = 'pt-BR';
        speechSynthesis.speak(fraseErro);
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
          await salvarProgresso({
            id_crianca: parseInt(userId),
            id_jogo: 4,
            porcentagem: 100,
            tentativas: attempts,
          });

          await salvarConquista({
            id_crianca: parseInt(userId),
            id_jogo: 4,
            descricao: 'Completou o jogo social com sucesso!',
            tipo_conquista: 'trofeu',
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
          <Link href={dashboardPath} className="text-blue-700 underline font-semibold cursor-pointer">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const primeiroNome = userName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 text-center">
      <Head><title>Jogos Sociais - Interact Joy</title></Head>

      <header className="relative flex justify-between items-center flex-wrap bg-gradient-to-br from-purple-600 to-blue-300 px-4 py-6 mb-6 min-h-[100px]">
        {/* Voltar à esquerda */}
        <Link
          href={dashboardPath}
          className="text-white hover:underline text-lg cursor-pointer mb-2 sm:mb-0"
        >
          ← Voltar
        </Link>

        {/* Logo e título centralizados */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-0 -ml-8">
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo"
            width={100}
            height={100}
            className="animate-spin-slow"
          />
          <h1 className="text-3xl font-bold whitespace-nowrap">
            <span className="text-blue-600">Interact</span>{' '}
            <span className="text-green-300">Joy</span>
          </h1>
        </div>

        {/* Saudação e acessibilidade */}
        <div className="flex items-center gap-x-6 mt-2 sm:mt-0">
          <p className="text-blue-950 text-2xl font-bold whitespace-nowrap">
            Olá, {primeiroNome}!
          </p>
          <AccessibilityControls />
        </div>
      </header>

      {/* Título no corpo */}
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Jogos Sociais</h2>

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
