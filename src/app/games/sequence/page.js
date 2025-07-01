// src/app/games/sequence/page.js
'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import AccessibilityControls from '@/components/AccessibilityControls';
import RewardAnimation from '@/components/RewardAnimation';
import gameConfig from '@/config/game_config.json';
import { Volume2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { salvarProgresso, salvarConquista } from '@/utils/persistenciaHelpers';

function SequenceGame() {
  const router = useRouter();
  const { increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const [sequence] = useState(['1', '2', '3']);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [dashboardPath, setDashboardPath] = useState('/dashboard/usuario');

  useEffect(() => {
    const tipo = localStorage.getItem('userType');
    const id = localStorage.getItem('userId');
    setUserId(id);
    if (tipo === 'guest') setDashboardPath('/dashboard/convidado');

    const idade = parseInt(localStorage.getItem('userAge'), 10);
    const suporte = localStorage.getItem('userSupport');
    const faixa = idade >= 10 ? '10-12' : '7-9';
    const desbloqueio = gameConfig[faixa]?.[suporte]?.find(j => j.id === 'sequence');
    if (!desbloqueio && tipo !== 'guest') setIsLocked(true);

    const embaralhado = [...sequence].sort(() => Math.random() - 0.5);
    setShuffled(embaralhado);
  }, [sequence]);

  const handleSelect = (item) => {
    if (selected.includes(item)) return;
    const novaSelecao = [...selected, item];
    setSelected(novaSelecao);

    if (novaSelecao.length === sequence.length) {
      const acertou = novaSelecao.join('') === sequence.join('');

      if (acertou) {
        setFeedback('Parabéns! Sequência correta!');
        speak('Parabéns! Sequência correta!');
        setShowReward(true);
        increaseDifficulty('sequence');

        if (userId && localStorage.getItem('userType') !== 'guest') {
          salvarProgresso(userId, 6, 100);
          salvarConquista(userId, 6, 'Sequenciador', 'Completou o jogo de sequência corretamente.', 'medalha');
        }
      } else {
        setFeedback('Ops! Tente novamente.');
        speak('Ops! Tente novamente.');
        decreaseDifficulty('sequence');
        setTimeout(() => {
          setSelected([]);
          setFeedback('');
        }, 1500);
      }
    }
  };

  const speak = (text) => {
    const frase = new SpeechSynthesisUtterance(text);
    frase.lang = 'pt-BR';
    speechSynthesis.speak(frase);
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
      <Head><title>Jogo de Sequência - Interact Joy</title></Head>
      <div className="absolute top-2 right-2 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between text-white">
        <button onClick={() => router.back()}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Jogo: Sequência</h1>
        <button onClick={() => speak("Organize os números na ordem correta.")}><Volume2 /></button>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <p className="text-lg font-semibold mb-4 text-blue-800">Organize os números na ordem correta:</p>
        <motion.div className="flex gap-4 justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {shuffled.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleSelect(item)}
              className={`bg-white text-xl font-bold border-2 border-blue-400 px-6 py-3 rounded-xl shadow-md hover:bg-blue-100 ${selected.includes(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={selected.includes(item)}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex gap-2 justify-center mt-4">
          {selected.map((s, i) => (
            <span key={i} className="text-xl font-bold text-green-700">{s}</span>
          ))}
        </div>

        {feedback && <p className="text-center mt-4 text-purple-700 font-semibold">{feedback}</p>}
        {showReward && <RewardAnimation message="Ótimo trabalho!" type="stars" />}
      </main>
    </div>
  );
}

export default function SequenceGamePage() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  return (
    <DifficultyProvider userId={userId}>
      <SequenceGame />
    </DifficultyProvider>
  );
}
