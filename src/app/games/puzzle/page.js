//src/app/games/puzzle/page.js:
'use client';

import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import AccessibilityControls from '@/components/AccessibilityControls';
import RewardAnimation from '@/components/RewardAnimation';
import gameConfig from '@/config/game_config.json';
import { Volume2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { salvarProgresso, salvarConquista } from '@/utils/persistenciaHelpers';

function PuzzleGame() {
  const router = useRouter();
  const { increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const [puzzlePieces, setPuzzlePieces] = useState(['🧩', '🎯', '🚀']);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [dashboardPath, setDashboardPath] = useState('/dashboard/usuario');

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  };

  const embaralharPecas = useCallback(() => {
    const embaralhado = [...puzzlePieces]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ item, id: index + '-' + Math.random() }));
    setShuffled(embaralhado);
  }, [puzzlePieces]);

  useEffect(() => {
    const tipo = localStorage.getItem('userType');
    const id = localStorage.getItem('userId');
    setUserId(id);
    if (tipo === 'guest') setDashboardPath('/dashboard/convidado');

    const idade = parseInt(localStorage.getItem('userAge'), 10);
    const suporte = localStorage.getItem('userSupport');
    const faixa = idade >= 10 ? '10-12' : '7-9';

    const desbloqueado = gameConfig[faixa]?.[suporte]?.puzzle?.unlocked;
    if (!desbloqueado && tipo !== 'guest') setIsLocked(true);

    embaralharPecas();
  }, [embaralharPecas]);

  const handleSelect = (item) => {
    if (selected.includes(item.item)) return;
    const novaSelecao = [...selected, item.item];
    setSelected(novaSelecao);

    if (novaSelecao.length === puzzlePieces.length) {
      if (novaSelecao.join('') === puzzlePieces.join('')) {
        setFeedback('Parabéns! Puzzle completo!');
        setShowReward(true);
        speak('Parabéns! Puzzle completo!');
        increaseDifficulty('puzzle');

        if (userId && localStorage.getItem('userType') !== 'guest') {
          salvarProgresso(userId, 5, 100, 0, () => speak("Progresso salvo com sucesso"));
          salvarConquista(userId, 5, 'Montador', 'Concluiu o jogo de quebra-cabeça com sucesso.', 'troféu', () => speak("Conquista registrada com sucesso"));
        }
      } else {
        setFeedback('Tente novamente.');
        speak('Tente novamente.');
        decreaseDifficulty('puzzle');
        setTimeout(() => {
          setSelected([]);
          setFeedback('');
        }, 1500);
      }
    }
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
      <Head><title>Jogo Quebra-Cabeça - Interact Joy</title></Head>
      <div className="absolute top-2 right-2 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between text-white">
        <button onClick={() => router.back()}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Jogo: Quebra-Cabeça</h1>
        <button onClick={() => speak("Monte o quebra-cabeça na ordem correta.")}><Volume2 /></button>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <p className="text-lg font-semibold mb-4 text-blue-800">Monte o quebra-cabeça na ordem correta:</p>
        <motion.div className="flex gap-4 justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {shuffled.map(({ item, id }) => (
            <motion.button
              key={id}
              onClick={() => handleSelect({ item })}
              className={`bg-white text-xl font-bold border-2 border-blue-400 px-6 py-3 rounded-xl shadow-md hover:bg-blue-100 ${
                selected.includes(item) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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

export default function PuzzleGamePage() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  return (
    <DifficultyProvider userId={userId}>
      <PuzzleGame />
    </DifficultyProvider>
  );
}
