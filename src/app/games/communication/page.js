'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

import AccessibilityControls from '@components/AccessibilityControls';
import { DndContext } from '@dnd-kit/core';
import { AccessibleButton, DraggableWord, DroppableArea } from '@components/DragDropWord';
import RewardAnimation from '@components/RewardAnimation';
import { AudioFeedbackSpeak } from '@components/AudioFeedback';

export default function CommunicationGame() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sentence, setSentence] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [userSentence, setUserSentence] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    const levelData = {
      1: {
        instruction: "Forme a frase: EU GOSTO DE BRINCAR",
        words: ["EU", "GOSTO", "DE", "BRINCAR", "COMER", "VOCÊ"],
        correctSentence: ["EU", "GOSTO", "DE", "BRINCAR"]
      },
      2: {
        instruction: "Forme a frase: O CACHORRO É GRANDE E PELUDO",
        words: ["O", "CACHORRO", "É", "GRANDE", "E", "PELUDO", "PEQUENO", "GATO"],
        correctSentence: ["O", "CACHORRO", "É", "GRANDE", "E", "PELUDO"]
      }
    };

    if (levelData[currentLevel]) {
      const level = levelData[currentLevel];
      setSentence(level.correctSentence);
      setInstruction(level.instruction);
      const shuffled = [...level.words].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
    }
  }, [currentLevel]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over?.id === 'userSentence') {
      if (!userSentence.includes(active.id)) {
        setUserSentence([...userSentence, active.id]);
        setAvailableWords(availableWords.filter(w => w !== active.id));
        AudioFeedbackSpeak("Palavra adicionada à frase");
      }
    }
  };

  const handleRemoveWord = (index) => {
    AudioFeedbackSpeak("Palavra removida da frase");
    const removedWord = userSentence[index];
    const newSentence = [...userSentence];
    newSentence.splice(index, 1);
    setUserSentence(newSentence);
    setAvailableWords([...availableWords, removedWord]);
  };

  const checkSentence = () => {
    setAttempts(attempts + 1);
    const isCorrect = userSentence.length === sentence.length &&
                      userSentence.every((word, index) => word === sentence[index]);
    if (isCorrect) {
      AudioFeedbackSpeak("Parabéns! Você acertou!");
      setShowReward(true);
      localStorage.setItem(`level_${currentLevel}_complete`, 'true');
      setTimeout(() => {
        setShowReward(false);
        if (currentLevel < 2) {
          setCurrentLevel(currentLevel + 1);
          setUserSentence([]);
        } else {
          localStorage.setItem('newAchievement', 'communication_complete');
          router.push('/dashboard');
        }
      }, 3000);
    } else {
      AudioFeedbackSpeak("Tente novamente!");
      if (attempts >= 2) {
        setShowHelp(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Head>
        <title>Forme Palavras - Interact Joy</title>
      </Head>

      <AccessibilityControls />

      <header className="bg-gradient-to-r from-blue-400 to-green-400 p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 rounded-full p-2 transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Voltar para o menu"
            title="Voltar para o menu"
          >
            <Image
              src="/images/icons/back.png"
              alt="Ícone de voltar"
              width={40}
              height={40}
            />
          </button>
          <h1 className="text-white text-xl font-bold">Forme Palavras</h1>
          <div className="bg-yellow-400 rounded-full px-3 py-1 mr-15">
            <span className="text-white font-bold">Nível {currentLevel}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div 
          className="bg-white rounded-lg p-4 mb-6 shadow-md"
          onClick={() => AudioFeedbackSpeak(instruction)}
        >
          <h2 className="text-xl text-blue-800 mb-2">Instrução:</h2>
          <p className="text-lg">{instruction}</p>
          <button 
            className="mt-2 text-blue-500 underline"
            onClick={() => setShowHelp(!showHelp)}
            aria-expanded={showHelp}
            aria-controls="help-panel"
          >
            {showHelp ? 'Ocultar ajuda' : 'Preciso de ajuda'}
          </button>
          {showHelp && (
            <div
              id="help-panel"
              className="mt-3 p-3 bg-blue-50 rounded border border-blue-200"
              aria-live="polite"
            >
              <p><strong>Dica:</strong> Comece com a palavra &quot;<em>{sentence[0]}</em>&quot; e depois continue na ordem da frase esperada.</p>
              <p>As palavras devem estar na ordem correta.</p>
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
                  aria-label={`Remover palavra ${word}`}
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

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md block mx-auto text-lg"
          onClick={checkSentence}
          disabled={userSentence.length === 0}
        >
          Verificar
        </button>
      </main>

      {showReward && (
        <RewardAnimation 
          message="Parabéns! Você formou a frase corretamente!"
          type="confetti"
        />
      )}
    </div>
  );
}
