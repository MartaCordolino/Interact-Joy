'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '@components/AccessibilityControls';
import { DndContext } from '@dnd-kit/core';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import { AudioFeedbackSpeak } from '@components/AudioFeedback';
import RewardAnimation from '@/components/RewardAnimation';
import { ArrowLeft, Volume2 } from 'lucide-react';

function Shape({ type, color }) {
  switch (type) {
    case 'círculo':
      return <circle cx="60" cy="60" r="50" fill={color} />;
    case 'quadrado':
      return <rect x="20" y="20" width="80" height="80" fill={color} />;
    case 'triângulo':
      return <polygon points="60,10 110,110 10,110" fill={color} />;
    case 'retângulo':
      return <rect x="10" y="40" width="100" height="40" fill={color} />;
    case 'hexágono':
      return <polygon points="60,10 100,35 100,85 60,110 20,85 20,35" fill={color} />;
    case 'cilindro':
      return (
        <>
          <ellipse cx="60" cy="30" rx="40" ry="15" fill={color} />
          <rect x="20" y="30" width="80" height="60" fill={color} />
          <ellipse cx="60" cy="90" rx="40" ry="15" fill={color} />
        </>
      );
    default:
      return null;
  }
}

function ColorGameScreen() {
  const router = useRouter();
  const { settings, increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const currentLevel = settings.colors?.level ?? 0;

  const shapes = ['círculo', 'quadrado', 'triângulo', 'retângulo', 'hexágono', 'cilindro'];
  const colors = [
    { name: 'vermelho', code: '#FF0000' },
    { name: 'azul', code: '#0000FF' },
    { name: 'amarelo', code: '#FFFF00' },
    { name: 'verde', code: '#00FF00' },
    { name: 'roxo', code: '#800080' },
    { name: 'laranja', code: '#FFA500' },
  ];

  function generateChallenge() {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return { shape: randomShape, color: randomColor };
  }

  function resetChallenge() {
    setFeedbackMessage('');
    setAttempts(0);
    setCurrentChallenge(generateChallenge());
  }

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [instructionMessage] = useState('Clique na cor correta para a forma exibida.');
  const [currentChallenge, setCurrentChallenge] = useState(generateChallenge());

  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());

  const handleDrop = (selectedColor) => {
    if (selectedColor.name === currentChallenge.color.name) {
      const successMsg = `Muito bem! Você acertou: ${currentChallenge.color.name} do ${currentChallenge.shape}`;
      setFeedbackMessage(successMsg);
      AudioFeedbackSpeak(successMsg);
      setScore(score + 1);
      setShowReward(true);
      increaseDifficulty('colors');
      setTimeout(() => {
        setShowReward(false);
        resetChallenge();
      }, 3000);
    } else {
      const failMsg = 'Ops! Tente novamente.';
      setFeedbackMessage(failMsg);
      AudioFeedbackSpeak(failMsg);
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        decreaseDifficulty('colors');
      }
      setTimeout(() => {
        resetChallenge();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 relative">
      <Head>
        <title>Mundo das Cores - Interact Joy</title>
      </Head>

      <div className="absolute top-2 right-2 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-pink-400 to-yellow-400 p-4">
        <div className="flex justify-between items-center">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft size={24} />
          </button>
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
            <button
              onClick={() => AudioFeedbackSpeak(instructionMessage)}
              className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 px-4 rounded-lg shadow flex items-center gap-2"
            >
              <Volume2 size={20} /> Repetir Instrução
            </button>
          </div>
          <p className="text-lg">{instructionMessage}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <Shape type={currentChallenge.shape} color={currentChallenge.color.code} />
            </svg>
          </div>
        </div>

        {feedbackMessage && (
          <div className="mt-4 text-center">
            <p className="text-lg text-purple-700 font-semibold">{feedbackMessage}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {shuffledColors.map((color) => (
            <div
              key={color.name}
              tabIndex="0"
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDrop(color);
              }}
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
  return (
    <DifficultyProvider userId="usuario123">
      <DndContext>
        <ColorGameScreen />
      </DndContext>
    </DifficultyProvider>
  );
}
