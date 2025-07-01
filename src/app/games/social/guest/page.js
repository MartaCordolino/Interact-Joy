'use client';

import { useState } from 'react';
import EmotionsGuest from './EmotionsGuest';
import SituacoesGuest from './SituacoesGuest';
import ConversasGuest from './ConversasGuest';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';

export default function GuestSocialGamesPage() {
  const [activeGame, setActiveGame] = useState('emocoes');

  const renderGame = () => {
    switch (activeGame) {
      case 'emocoes':
        return <EmotionsGuest />;
      case 'situacoes':
        return <SituacoesGuest />;
      case 'conversas':
        return <ConversasGuest />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-4 text-white">
      <header className="flex flex-col items-center justify-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        >
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo Interact Joy"
            width={120}
            height={120}
            className="rounded-full"
          />
        </motion.div>
        <h1 className="text-5xl font-bold mt-4 text-center">
          <span className="text-blue-200">Interact </span>
          <span className="text-green-300">Joy</span>
        </h1>
        <div className="absolute top-4 right-4">
          <AccessibilityControls />
        </div>
        <Link href="/dashboard/convidado" className="absolute top-4 left-4 text-white hover:underline">
          ← Voltar
        </Link>
      </header>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setActiveGame('emocoes')}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${activeGame === 'emocoes' ? 'bg-white text-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Emoções
        </button>
        <button
          onClick={() => setActiveGame('situacoes')}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${activeGame === 'situacoes' ? 'bg-white text-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Situações Sociais
        </button>
        <button
          onClick={() => setActiveGame('conversas')}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${activeGame === 'conversas' ? 'bg-white text-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Iniciando Conversas
        </button>
      </div>

      <motion.div 
        className="bg-white rounded-xl p-6 shadow-xl max-w-4xl mx-auto text-gray-900"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderGame()}
      </motion.div>

      <div className="text-center mt-10">
        <p className="text-xl font-medium mb-4 text-white">
          Gostou da experiência? Crie uma conta para desbloquear todos os jogos e salvar seu progresso!
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/register/select">
            <button className="bg-green-400 hover:bg-green-500 text-white text-lg font-bold px-6 py-3 rounded-xl shadow-lg transition">
              Criar Conta
            </button>
          </Link>
          <Link href="/home">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-bold px-6 py-3 rounded-xl shadow-lg transition">
              Tela Inicial
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
