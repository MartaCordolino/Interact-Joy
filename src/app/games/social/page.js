// src/app/games/social/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RewardAnimation from '@/components/RewardAnimation';
import AccessibilityControls from '@/components/AccessibilityControls';
import Image from 'next/image';

/**
 * Página de jogos sociais para desenvolver habilidades sociais
 * Atendendo aos requisitos:
 * - RF-001: Recursos visuais
 * - RF-002: Reforço positivo
 * - RF-003: Estímulos auditivos e visuais
 * - RNF-001: Interface acessível
 */
export default function SocialGamesPage() {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);
  const [expressionToGuess, setExpressionToGuess] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState(null);
  
  // Lista de emoções com suas expressões faciais
  const emotions = [
    { name: 'Feliz', emoji: '😊', description: 'Quando alguém está contente', audio: '/sounds/emotions/happy.mp3' },
    { name: 'Triste', emoji: '😢', description: 'Quando alguém está chateado', audio: '/sounds/emotions/sad.mp3' },
    { name: 'Surpreso', emoji: '😮', description: 'Quando alguém não esperava algo', audio: '/sounds/emotions/surprised.mp3' },
    { name: 'Com Medo', emoji: '😨', description: 'Quando alguém está assustado', audio: '/sounds/emotions/scared.mp3' },
    { name: 'Bravo', emoji: '😠', description: 'Quando alguém está irritado', audio: '/sounds/emotions/angry.mp3' },
    { name: 'Confuso', emoji: '😕', description: 'Quando alguém não entende algo', audio: '/sounds/emotions/confused.mp3' },
  ];

  // Lista de jogos sociais disponíveis
  const games = [
    { 
      id: 'emotion-match', 
      title: 'Jogo das Emoções', 
      description: 'Combine as emoções com as expressões faciais corretas.',
      icon: '🙂',
      level: 'Iniciante',
      skills: ['Reconhecimento Emocional', 'Empatia']
    },
    { 
      id: 'social-scenarios', 
      title: 'Situações Sociais', 
      description: 'O que fazer em diferentes situações sociais?',
      icon: '👥',
      level: 'Intermediário',
      skills: ['Interação Social', 'Tomada de Decisão']
    },
    { 
      id: 'conversation-starter', 
      title: 'Iniciando Conversas', 
      description: 'Aprenda como começar uma conversa com outras pessoas.',
      icon: '💬',
      level: 'Avançado',
      skills: ['Comunicação', 'Habilidades Conversacionais']
    }
  ];

  // Iniciar jogo das emoções
  const startEmotionMatchGame = () => {
    setCurrentGame('emotion-match');
    selectRandomEmotion();
    setScore(0);
    setGameComplete(false);
  };

  // Seleciona uma emoção aleatória para adivinhar
  const selectRandomEmotion = () => {
    const randomIndex = Math.floor(Math.random() * emotions.length);
    setExpressionToGuess(emotions[randomIndex]);
    setSelectedExpression(null);
  };

  // Verifica se a resposta está correta
  const checkAnswer = (emotion) => {
    setSelectedExpression(emotion);
    
    setTimeout(() => {
      if (emotion.name === expressionToGuess.name) {
        // Acertou
        setScore(prevScore => prevScore + 10);
        setShowReward(true);
        
        // Se atingiu pontuação para completar o jogo
        if (score + 10 >= 30) {
          setGameComplete(true);
        } else {
          setTimeout(() => {
            selectRandomEmotion();
          }, 3500);
        }
      } else {
        // Feedback corretivo conforme RN-007
        const audio = new Audio('/sounds/try-again.mp3');
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Áudio bloqueado:', err));
        
        setTimeout(() => {
          setSelectedExpression(null);
        }, 1500);
      }
    }, 500);
  };

  // Reproduz áudio da emoção quando solicitado
  const playEmotionAudio = (emotion) => {
    if (typeof Audio !== 'undefined') {
      const audio = new Audio(emotion.audio);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Áudio bloqueado:', err));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jogos Sociais</h1>
          <AccessibilityControls />
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Navegação de volta */}
        <Link href="/games" className="inline-flex items-center mb-6 text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar aos Jogos
        </Link>

        {!currentGame ? (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Jogos Sociais Disponíveis</h2>
              <p className="mb-6 text-gray-700">
                Escolha um jogo para desenvolver suas habilidades sociais e de comunicação.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-6">
                      <div className="text-4xl mb-4">{game.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-blue-700">{game.title}</h3>
                      <p className="text-gray-600 mb-4">{game.description}</p>
                      
                      <div className="flex items-center mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {game.level}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Habilidades desenvolvidas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {game.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => game.id === 'emotion-match' ? startEmotionMatchGame() : null}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        aria-label={`Jogar ${game.title}`}
                      >
                        {game.id === 'emotion-match' ? 'Jogar Agora' : 'Em breve'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        ) : currentGame === 'emotion-match' ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Jogo das Emoções</h2>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                Pontos: {score}
              </div>
            </div>
            
            {!gameComplete ? (
              <>
                <div className="mb-8 text-center">
                  <p className="text-lg mb-4">Qual emoção está expressando:</p>
                  
                  {expressionToGuess && (
                    <motion.div
                      className="text-8xl mb-4" 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      aria-label={`Expressão para adivinhar: ${expressionToGuess.name}`}
                    >
                      {expressionToGuess.emoji}
                    </motion.div>
                  )}
                  
                  <button 
                    onClick={() => expressionToGuess && playEmotionAudio(expressionToGuess)}
                    className="p-2 bg-blue-500 text-white rounded-full"
                    aria-label="Ouvir descrição da emoção"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414a5 5 0 001.414 1.414m0 0l4 4m-4-4v-4m0 4h4m-4 0a9 9 0 01-2.12-9.38 9 9 0 0110.496-5.452" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.name}
                      className={`p-4 rounded-lg border-2 ${
                        selectedExpression?.name === emotion.name 
                          ? (selectedExpression?.name === expressionToGuess?.name 
                              ? 'border-green-500 bg-green-100' 
                              : 'border-red-500 bg-red-100') 
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                      onClick={() => checkAnswer(emotion)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={selectedExpression !== null}
                      aria-label={`Escolher a emoção ${emotion.name}`}
                    >
                      <div className="text-3xl mb-2">{emotion.emoji}</div>
                      <div className="font-medium">{emotion.name}</div>
                      <div className="text-sm text-gray-600">{emotion.description}</div>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2 text-green-600">Jogo Completo!</h3>
                <p className="text-gray-700 mb-6">
                  Você completou o Jogo das Emoções e conquistou {score} pontos!
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={startEmotionMatchGame}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Jogar Novamente
                  </button>
                  <button
                    onClick={() => setCurrentGame(null)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Escolher Outro Jogo
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Componente de recompensa (RF-002) */}
      <RewardAnimation 
        show={showReward}
        message="Muito bem!"
        type="stars"
        onComplete={() => setShowReward(false)}
      />
    </div>
  );
}