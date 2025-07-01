// src/app/games/communication/page.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AccessibilityControls from '@components/AccessibilityControls';
import { DndContext } from '@dnd-kit/core';
import { AccessibleButton, DraggableWord, DroppableArea } from '@components/DragDropWord';
import RewardAnimation from '@components/RewardAnimation';
import { AudioFeedbackSpeak } from '@components/AudioFeedback';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import gameConfig from '@/config/game_config.json';
import { Volume2, ArrowLeft } from 'lucide-react';
import { salvarConquista, salvarProgresso } from '@/utils/persistencia';

const levelData = {
  1: {
    instruction: 'Forme a frase: EU GOSTO DE BRINCAR',
    words: ['EU', 'GOSTO', 'DE', 'BRINCAR', 'COMER', 'VOCÊ'],
    correctSentence: ['EU', 'GOSTO', 'DE', 'BRINCAR']
  },
  2: {
    instruction: 'Forme a frase: O CACHORRO É GRANDE E PELUDO',
    words: ['O', 'CACHORRO', 'É', 'GRANDE', 'E', 'PELUDO', 'PEQUENO', 'GATO'],
    correctSentence: ['O', 'CACHORRO', 'É', 'GRANDE', 'E', 'PELUDO']
  },
  3: {
    instruction: 'Forme a frase: A MENINA ESTÁ FELIZ HOJE',
    words: ['A', 'MENINA', 'ESTÁ', 'FELIZ', 'HOJE', 'AMANHÃ', 'TRISTE'],
    correctSentence: ['A', 'MENINA', 'ESTÁ', 'FELIZ', 'HOJE']
  }
};

function CommunicationGameScreen() {
  const router = useRouter();
  const { settings, increaseDifficulty, decreaseDifficulty } = useDifficulty();
  const currentLevel = settings.communication?.level ?? 1;

  const [isGuest, setIsGuest] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [sentence, setSentence] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [userSentence, setUserSentence] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [helpText, setHelpText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [userId, setUserId] = useState(null);
  const [feedbackSaved, setFeedbackSaved] = useState('');

  useEffect(() => {
    const type = localStorage.getItem('userType');
    setIsGuest(type === 'guest');

    const faixa = localStorage.getItem('userFaixa') || '7-9';
    const suporte = localStorage.getItem('userSuporte') || 'leve';
    const gameKey = 'communication';
    const gameStatus = gameConfig[faixa]?.[suporte]?.[gameKey];

    if (type !== 'guest') setIsLocked(!gameStatus?.unlocked);

    const storedId = localStorage.getItem('userId');
    if (storedId) setUserId(parseInt(storedId));
  }, []);

  useEffect(() => {
    const level = levelData[currentLevel];
    if (level) {
      setSentence(level.correctSentence);
      setInstruction(level.instruction);
      const shuffled = [...level.words].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
      setUserSentence([]);
      setAttempts(0);
      setShowHelp(false);
      setShowOptions(false);
      setShowReward(false);
      setGameFinished(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (helpText) {
      window.speechSynthesis.cancel();
      AudioFeedbackSpeak(helpText);
    }
  }, [helpText]);

  const checkSentence = async () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const isCorrect = userSentence.length === sentence.length &&
      userSentence.every((word, index) => word === sentence[index]);

    if (isCorrect) {
      AudioFeedbackSpeak('Parabéns! Você acertou!');
      setShowReward(true);
      setShowOptions(true);
      await salvarConquista(userId, 1, currentLevel === 3 ? 'trofeu' : 'medalha', `Completou nível ${currentLevel} do jogo de comunicação`);
      await salvarProgresso(userId, 1, (currentLevel / Object.keys(levelData).length) * 100, attempts);
      setFeedbackSaved('✅ Progresso salvo com sucesso!');

      if (currentLevel < Object.keys(levelData).length) {
        increaseDifficulty('communication');
      } else {
        setGameFinished(true);
        unlockNextGame();
      }
    } else {
      AudioFeedbackSpeak('Tente novamente!');
      if (newAttempts >= 3) {
        setShowHelp(true);
        decreaseDifficulty('communication');
      }
    }
  };

  const unlockNextGame = () => {
    const faixa = localStorage.getItem('userFaixa');
    const suporte = localStorage.getItem('userSuporte');
    const nextGame = 'colors';
    if (faixa && suporte && gameConfig[faixa]?.[suporte]?.[nextGame]) {
      gameConfig[faixa][suporte][nextGame].unlocked = true;
      localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
    }
  };

  const repetirInstrucao = () => AudioFeedbackSpeak(instruction);

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 text-center p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Jogo Bloqueado</h2>
          <p className="text-gray-800 mb-4">Complete o jogo anterior para desbloquear este.</p>
          <Link href="/dashboard/usuario" className="text-blue-600 underline">Voltar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Head><title>Forme Palavras - Interact Joy</title></Head>

      <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center">
        <button onClick={() => router.back()}><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-2">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={40} height={40} className="animate-spin-slow" />
          <h1 className="text-xl font-bold">Interact <span className="text-green-300">Joy</span></h1>
        </div>
        <div className="bg-purple-600 rounded-full px-3 py-1 text-white text-sm font-semibold">
          Nível {currentLevel}
        </div>
      </header>

      <div className="p-4">
        <AccessibilityControls />

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-blue-700">Instrução:</h2>
            <button onClick={repetirInstrucao} className="text-blue-600 font-medium flex gap-1 items-center"><Volume2 /> Ouvir</button>
          </div>
          <p className="text-base">{instruction}</p>
        </div>

        {feedbackSaved && <p className="text-green-600 font-medium mt-2">{feedbackSaved}</p>}

        {/* Área de jogo e botões interativos aqui */}

        {showReward && (
          <RewardAnimation message="Muito bem! Você acertou!" type="confetti" />
        )}
      </div>
    </div>
  );
}

export default function CommunicationGame() {
  return (
    <DifficultyProvider userId="usuario123">
      <DndContext>
        <CommunicationGameScreen />
      </DndContext>
    </DifficultyProvider>
  );
}
