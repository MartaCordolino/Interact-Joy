'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '@/components/AccessibilityControls';
import AudioFeedback, { AudioFeedbackSpeak } from '@/components/AudioFeedback';
import { salvarProgresso, salvarConquista } from '@/utils/persistencia';
import { motion } from 'framer-motion';

const emotionsData = [
  {
    image: '/images/happy.png',
    correct: 'Feliz',
    options: ['Triste', 'Bravo', 'Feliz', 'Assustado']
  },
  {
    image: '/images/sad.png',
    correct: 'Triste',
    options: ['Triste', 'Animado', 'Zangado', 'Confuso']
  },
  {
    image: '/images/angry.png',
    correct: 'Bravo',
    options: ['Feliz', 'Bravo', 'Cansado', 'Assustado']
  },
  {
    image: '/images/tired.png',
    correct: 'Cansado',
    options: ['Cansado', 'Calmo', 'Triste', 'Animado']
  }
];

export default function EmotionsGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [playInstruction, setPlayInstruction] = useState(true);
  const [nomeCrianca, setNomeCrianca] = useState('jogador');

  const router = useRouter();
  const currentEmotion = emotionsData[currentIndex];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nomeCompleto = localStorage.getItem('userName') || 'jogador';
      const primeiroNome = nomeCompleto.split(' ')[0];
      setNomeCrianca(primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (playInstruction) {
      AudioFeedbackSpeak('Qual é essa emoção?');
    }
  }, [currentIndex, playInstruction]);

  const handleOptionClick = (option) => {
    if (selected !== null) return;

    setSelected(option);
    setPlayInstruction(false);

    const isCorrect = option === currentEmotion.correct;
    setFeedback(isCorrect ? 'Parabéns! Você acertou!' : `Ops! Era ${currentEmotion.correct}`);
    AudioFeedbackSpeak(isCorrect ? 'Parabéns! Você acertou!' : `Ops! Era ${currentEmotion.correct}`);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < emotionsData.length) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setFeedback('');
        setPlayInstruction(true);
      } else {
        setShowResult(true);
        setIsGameFinished(true);

        const porcentagem = Math.round(((correctCount + (isCorrect ? 1 : 0)) / emotionsData.length) * 100);
        const criancaId = localStorage.getItem("userId");

        if (criancaId) {
          salvarProgresso({
            id_crianca: parseInt(criancaId),
            id_jogo: "emotions",
            porcentagem,
          });

          if (porcentagem === 100) {
            salvarConquista({
              id_crianca: parseInt(criancaId),
              id_jogo: "emotions",
              tipo_conquista: "trofeu",
              descricao: "Acertou todas as emoções!",
            });
          }
        }
      }
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFeedback('');
    setShowResult(false);
    setIsGameFinished(false);
    setPlayInstruction(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 text-center">
      <header className="flex justify-between items-center mb-4">
        <Link href="/dashboard/usuario" className="text-blue-700 hover:underline ml-2">← Voltar</Link>
        <div className="flex items-center gap-3">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={60} height={60} className="animate-spin-slow" />
          <h1 className="text-xl font-bold text-blue-800">Olá, {nomeCrianca}!</h1>
        </div>
        <AudioFeedback type="instruction" autoPlay={false} />
      </header>

      {!showResult ? (
        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Jogo das Emoções</h2>
          <div className="max-w-sm mx-auto">
            <Image src={currentEmotion.image} alt="Expressão" width={200} height={200} className="mx-auto mb-4 rounded-xl shadow-md" />
            <div className="grid grid-cols-2 gap-4">
              {currentEmotion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`py-3 px-4 rounded-xl text-white text-lg font-medium transition-all duration-300 focus:outline-none ${
                    selected === option
                      ? option === currentEmotion.correct
                        ? 'bg-green-500 scale-105'
                        : 'bg-red-500 scale-105'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && <p className="mt-6 text-lg text-gray-800 font-semibold">{feedback}</p>}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-green-600">Fim do jogo!</h2>
          <p className="text-lg mt-2">Você acertou {correctCount} de {emotionsData.length} emoções.</p>

          {correctCount === emotionsData.length && (
            <motion.div
              className="mt-6 text-3xl text-yellow-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              🏆 Parabéns! Você acertou todas as emoções!
            </motion.div>
          )}

          <div className="mt-6 flex flex-col gap-3 items-center">
            <button
              onClick={handleRestart}
              className="bg-purple-600 text-white py-2 px-6 rounded-xl hover:bg-purple-700"
            >
              Jogar Novamente
            </button>
            <Link href="/dashboard/usuario" className="text-blue-700 hover:underline">
              Voltar ao painel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
