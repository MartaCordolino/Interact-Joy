'use client';

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '@components/AccessibilityControls';
import { DndContext } from '@dnd-kit/core';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import { AudioFeedbackSpeak } from '@components/AudioFeedback';
import RewardAnimation from '@/components/RewardAnimation';
import { ArrowLeft, Volume2 } from 'lucide-react';
import gameConfig from '@/config/game_config.json';
import { salvarConquista, salvarProgresso } from '@/utils/persistencia';

function Shape({ type, color }) {
  switch (type) {
    case 'círculo': return <circle cx="60" cy="60" r="50" fill={color} />;
    case 'quadrado': return <rect x="20" y="20" width="80" height="80" fill={color} />;
    case 'triângulo': return <polygon points="60,10 110,110 10,110" fill={color} />;
    case 'retângulo': return <rect x="10" y="40" width="100" height="40" fill={color} />;
    case 'hexágono': return <polygon points="60,10 100,35 100,85 60,110 20,85 20,35" fill={color} />;
    case 'cilindro':
      return (
        <>
          <ellipse cx="60" cy="30" rx="40" ry="15" fill={color} />
          <rect x="20" y="30" width="80" height="60" fill={color} />
          <ellipse cx="60" cy="90" rx="40" ry="15" fill={color} />
        </>
      );
    default: return null;
  }
}

const shapes = ['círculo', 'quadrado', 'triângulo', 'retângulo', 'hexágono', 'cilindro'];
const colors = [
  { name: 'vermelho', code: '#FF0000' },
  { name: 'azul', code: '#0000FF' },
  { name: 'amarelo', code: '#FFFF00' },
  { name: 'verde', code: '#00FF00' },
  { name: 'roxo', code: '#800080' },
  { name: 'laranja', code: '#FFA500' },
];

function ColorGameScreen({ userId }) {
  const router = useRouter();
  const { settings, increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const currentLevel = settings.colors?.level ?? 0;

  const [userType, setUserType] = useState('usuario');
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [instructionMessage] = useState('Clique na cor correta para a forma exibida.');
  const [currentChallenge, setCurrentChallenge] = useState({ shape: '', color: {} });
  const [previousChallenge, setPreviousChallenge] = useState(null);
  const [dashboardPath, setDashboardPath] = useState('/dashboard/usuario');
  const [confirmationMsg, setConfirmationMsg] = useState('');

  const generateChallenge = useCallback(() => {
    let newChallenge;
    do {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newChallenge = { shape: randomShape, color: randomColor };
    } while (
      previousChallenge &&
      newChallenge.shape === previousChallenge.shape &&
      newChallenge.color.name === previousChallenge.color.name
    );
    setPreviousChallenge(newChallenge);
    return newChallenge;
  }, [previousChallenge]);

  const resetChallenge = useCallback(() => {
    setFeedbackMessage('');
    setAttempts(0);
    setCurrentChallenge(generateChallenge());
  }, [generateChallenge]);

  useEffect(() => {
    const storedType = localStorage.getItem("userType");
    setUserType(storedType || "usuario");
    if (storedType === "guest") {
      setDashboardPath('/dashboard/convidado');
    }

    const faixa = localStorage.getItem("faixaEtaria") ?? "7-9";
    const suporte = localStorage.getItem("nivelSuporte") ?? "leve";
    const config = gameConfig["colors"]?.[`${faixa}_${suporte}`] ?? { locked: false };
    setIsLocked(config.locked);

    if (!config.locked || storedType === "guest") resetChallenge();
  }, [resetChallenge]);

  const handleDrop = async (selectedColor) => {
    if (selectedColor.name === currentChallenge.color.name) {
      const msg = `Muito bem! Você acertou: ${currentChallenge.color.name} do ${currentChallenge.shape}`;
      setFeedbackMessage(msg);
      AudioFeedbackSpeak(msg);
      setScore(prev => prev + 1);
      setShowReward(true);
      increaseDifficulty('colors');

      if (score + 1 >= 5 && userType !== 'guest') {
        await salvarProgresso(userId, 3, Math.round(((score + 1) / 5) * 100), attempts);
        await salvarConquista(userId, 3, 'medalha', `Acertou ${score + 1} desafios no Mundo das Cores`);
        setConfirmationMsg('🏅 Conquista registrada!');
        setTimeout(() => setConfirmationMsg(''), 2000);
      }

      setTimeout(() => {
        setShowReward(false);
        resetChallenge();
      }, 3000);
    } else {
      const failMsg = 'Ops! Tente novamente.';
      setFeedbackMessage(failMsg);
      AudioFeedbackSpeak(failMsg);
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= 3) {
        decreaseDifficulty('colors');
      }
      setTimeout(() => {
        resetChallenge();
      }, 3000);
    }
  };

  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Jogo bloqueado</h2>
          <p className="text-gray-800 mb-2">Este jogo ainda não está disponível para seu nível de suporte ou faixa etária.</p>
          <p className="mb-4">Complete os jogos anteriores para desbloquear.</p>
          <button onClick={() => router.push(dashboardPath)} className="text-blue-700 underline font-semibold">
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 relative">
      <Head><title>Mundo das Cores - Interact Joy</title></Head>

      <div className="absolute top-2 right-2 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-pink-400 to-yellow-400 p-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="text-white"><ArrowLeft size={24} /></button>
          <h1 className="text-white text-xl font-bold">Mundo das Cores</h1>
          <div className="bg-yellow-400 rounded-full px-3 py-1">
            <span className="text-white font-bold">Nível {currentLevel + 1}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-pink-800 mb-2">Instrução:</h2>
            <button onClick={() => AudioFeedbackSpeak(instructionMessage)} className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 px-4 rounded-lg shadow flex items-center gap-2">
              <Volume2 size={20} /> Repetir Instrução
            </button>
          </div>
          <p className="text-lg">{instructionMessage}</p>
        </div>

        <div className="flex justify-center mb-6">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <Shape type={currentChallenge.shape} color={currentChallenge.color.code} />
          </svg>
        </div>

        {feedbackMessage && (
          <div className="mt-4 text-center">
            <p className="text-lg text-purple-700 font-semibold">{feedbackMessage}</p>
          </div>
        )}

        {confirmationMsg && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600 italic">{confirmationMsg}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {shuffledColors.map((color) => (
            <div
              key={color.name}
              tabIndex="0"
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter') handleDrop(color); }}
              onClick={() => handleDrop(color)}
              className="h-16 w-16 rounded-full border-4 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
              style={{ backgroundColor: color.code }}
              aria-label={`Selecionar a cor ${color.name}`}
            ></div>
          ))}
        </div>

        {showReward && (
          <RewardAnimation message="Muito bem! Você acertou a cor." type="confetti" />
        )}
      </main>
    </div>
  );
}

export default function ColorGame() {
  const userId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId')) : null;
  return (
    <DifficultyProvider userId={userId}>
      <DndContext>
        <ColorGameScreen userId={userId} />
      </DndContext>
    </DifficultyProvider>
  );
}
