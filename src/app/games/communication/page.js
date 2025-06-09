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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over?.id === 'userSentence') {
      if (!userSentence.includes(active.id)) {
        setUserSentence([...userSentence, active.id]);
        setAvailableWords(availableWords.filter(w => w !== active.id));
        AudioFeedbackSpeak('Palavra adicionada à frase');
      }
    }
  };

  const handleRemoveWord = (index) => {
    AudioFeedbackSpeak('Palavra removida da frase');
    const removedWord = userSentence[index];
    const newSentence = [...userSentence];
    newSentence.splice(index, 1);
    setUserSentence(newSentence);
    setAvailableWords([...availableWords, removedWord]);
  };

  const checkSentence = () => {
    setAttempts(prev => prev + 1);
    const isCorrect = userSentence.length === sentence.length &&
      userSentence.every((word, index) => word === sentence[index]);

    if (isCorrect) {
      AudioFeedbackSpeak('Parabéns! Você acertou!');
      setShowReward(true);
      setShowOptions(true);
      if (currentLevel < Object.keys(levelData).length) {
        increaseDifficulty('communication');
      } else {
        setGameFinished(true);
      }
    } else {
      AudioFeedbackSpeak('Tente novamente!');
      if (attempts >= 2) {
        setShowHelp(true);
        decreaseDifficulty('communication');
      }
    }
  };

  const restartLevel = () => {
    setUserSentence([]);
    setAvailableWords([...sentence, ...availableWords].sort(() => 0.5 - Math.random()));
    setAttempts(0);
    setShowHelp(false);
    setShowReward(false);
    setShowOptions(false);
    setGameFinished(false);
  };

  const nextLevel = () => {
    if (currentLevel < Object.keys(levelData).length) {
      setShowReward(false);
      setShowOptions(false);
      increaseDifficulty('communication');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-xl">
      <Head>
        <title>Forme Palavras - Interact Joy</title>
      </Head>

      <header className="bg-gradient-to-r from-blue-400 to-green-400 p-4">
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard/usuario"
            className="text-blue-800 font-bold"
            aria-label="Voltar para o menu"
          >
            &larr; Voltar
          </Link>

          <h1 className="text-white text-2xl font-bold">Forme Palavras</h1>

          <div className="flex items-center space-x-4">
            <div className="bg-yellow-400 rounded-full px-10 py-2 min-w-[90px]">
              <span className="text-white font-bold text-lg">Nível {currentLevel}</span>
            </div>
            <AccessibilityControls />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div
          className="bg-white rounded-lg p-4 mb-6 shadow-md cursor-pointer"
          onClick={() => AudioFeedbackSpeak(instruction)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && AudioFeedbackSpeak(instruction)}
          aria-label="Repetir instrução"
        >
          <h2 className="text-xl text-blue-800 mb-2">Instrução:</h2>
          <p className="text-lg">{instruction}</p>
          <button
            className="mt-2 text-blue-500 underline"
            onClick={() => {
              const tip = `Dica: Comece com a palavra '${sentence[0]}' e continue na ordem correta.`;
              setHelpText(tip);
              setShowHelp(!showHelp);
            }}
            aria-expanded={showHelp}
          >
            {showHelp ? 'Ocultar ajuda' : 'Preciso de ajuda'}
          </button>
          {showHelp && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p>{helpText}</p>
            </div>
          )}
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <DroppableArea id="userSentence">
            {userSentence.length === 0 ? (
              <p className="text-gray-400 italic">Arraste palavras para formar a frase...</p>
            ) : (
              userSentence.map((word, index) => (
                <div
                  key={`sentence-${index}`}
                  className="bg-blue-100 rounded-lg px-4 py-2 font-bold text-blue-800 cursor-pointer"
                  onClick={() => handleRemoveWord(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRemoveWord(index)}
                >
                  {word}
                </div>
              ))
            )}
          </DroppableArea>

          <div className="bg-gray-100 rounded-lg p-4 flex flex-wrap gap-3 mb-6">
            {availableWords.map((word, index) => (
              <DraggableWord key={`word-${index}`} id={word} word={word} />
            ))}
          </div>
        </DndContext>

        {!showOptions && !gameFinished && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md block mx-auto text-lg"
            onClick={checkSentence}
            disabled={userSentence.length === 0}
          >
            Verificar
          </button>
        )}

        {showOptions && (
          <div className="mt-6 text-center">
            {gameFinished ? (
              <p className="mb-4 text-lg font-semibold text-green-700">
                Você concluiu todos os níveis disponíveis! 🥳
              </p>
            ) : (
              <p className="mb-4 text-lg font-semibold text-green-700">Você deseja continuar?</p>
            )}
            {!gameFinished && (
              <button
                onClick={nextLevel}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-4"
              >
                Próximo nível
              </button>
            )}
            <button
              onClick={restartLevel}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
            >
              Jogar novamente
            </button>
            <button              
      onClick={() => router.push('/dashboard/usuario')}
      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
    >
      Sair do jogo
    </button>
          </div>
        )}
      </main>

      {showReward && (
        <RewardAnimation message="Parabéns! Você formou a frase corretamente!" type="confetti" />
      )}
    </div>
  );
}

export default function CommunicationGame() {
  return (
    <DifficultyProvider userId="usuario123">
      <CommunicationGameScreen />
    </DifficultyProvider>
  );
}
