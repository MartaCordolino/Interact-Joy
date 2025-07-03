'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccessibilityControls from '@/components/AccessibilityControls';
import AudioFeedback, { AudioFeedbackSpeak } from '@/components/AudioFeedback';
import { salvarProgresso, salvarConquista } from '@/utils/persistencia';
import { jogosIds } from '@/utils/jogosIds';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';


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
  const [tentativas, setTentativas] = useState(0);

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
    setTentativas(prev => prev + 1); // ← incrementa tentativa  

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
            id_jogo: jogosIds.emotions,
            porcentagem,
            tentativas,
          });

          if (porcentagem === 100) {
            salvarConquista({
              id_crianca: parseInt(criancaId),
              id_jogo: jogosIds.emotions,
              tipo_conquista: "trofeu",
              descricao: "Acertou todas as emoções!",
            });
          }
        }
      }
    }, 1200);
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

      <header className="relative flex justify-between items-center flex-wrap bg-gradient-to-br from-purple-600 to-blue-300 px-4 py-6 mb-6 min-h-[100px]">

  {/* Botão Voltar à esquerda */}
  <Link
    href="/dashboard/usuario"
    className="text-white hover:underline text-lg mb-2 sm:mb-0"
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

  {/* Saudação + Acessibilidade à direita */}
  <div className="flex items-center gap-x-6 mt-2 sm:mt-0">
    <p className="text-blue-950  text-2xl font-bold whitespace-nowrap">
      Olá, {nomeCrianca}!
    </p>
     <div className="shrink-0">
        <AccessibilityControls />
      </div>
  </div>
</header>


      {!showResult ? (
        <div>
          <h2 className="text-4xl font-semibold text-purple-700 mt-12 mb-6">Jogo das Emoções</h2>
          <div className="max-w-md mx-auto">
            <Image src={currentEmotion.image} alt="Expressão" width={280} height={280} className="mx-auto mb-6 rounded-2xl shadow-lg" 
            priority/>
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
          <h2 className="text-3xl font-bold text-green-600">Fim do jogo!</h2>
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
              className="bg-purple-600 text-white py-2 px-6 rounded-xl hover:bg-purple-700 text-2xl"
            >
              Jogar Novamente
            </button>
            <Link href="/dashboard/usuario" className="text-blue-700 text-2xl hover:underline">
              Voltar ao painel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
