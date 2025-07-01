'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccessibilityControls from '@/components/AccessibilityControls';
import { motion } from 'framer-motion';

export default function GuestDashboard() {
  useEffect(() => {
    const audioEnabled = localStorage.getItem('audioEnabled');
    if (audioEnabled === 'true') {
      const audio = new Audio('/audio/visitor_welcome.mp3');
      audio.volume = 0.6;
      audio.play().catch(err => console.log('Áudio bloqueado:', err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-400 text-white">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
          >
            <Image
              src="/images/Logo_Interact_Joy.png"
              alt="Logo Interact Joy"
              width={150}
              height={150}
              className="rounded-full"
            />
          </motion.div>
          <h1 className="text-5xl font-bold mt-6 mb-4 text-center">
            <span className="text-blue-600">Interact </span>
            <span className="text-green-300">Joy</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow">
            Visitante
          </div>
          <AccessibilityControls />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="p-6">
        <section className="bg-gradient-to-br from-purple-500 to-blue-400 rounded-xl shadow-xl p-8 max-w-5xl mx-auto mt-10 border-4 border-purple-300">
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-4">Explore os Jogos Sociais</h2>
          <p className="text-center text-2xl text-white/90 mb-6">
            Acesse gratuitamente o jogo das emoções e outras experiências como visitante.
          </p>

          {/* Botão principal diferenciado */}
          <div className="flex justify-center mb-8">
            <Link href="/games/social/guest">
              <button
                className="w-64 bg-blue-500 hover:bg-blue-600 text-2xl text-white font-bold py-3 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-label="Acessar Jogos Sociais como Visitante"
              >
                Acessar Jogos Sociais
              </button>
            </Link>
          </div>

          {/* Conquistas ilustrativas */}
          <div className="flex justify-center gap-12 flex-wrap mt-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-6xl" role="img" aria-label="Troféu de Participação">🏆</span>
              <p className="text-lg text-white font-semibold mt-2">Troféu de Participação</p>
              <p className="text-sm text-white/80">Explorou nossos jogos</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-6xl" role="img" aria-label="Medalha de Empatia">🥈</span>
              <p className="text-lg text-white font-semibold mt-2">Medalha de Empatia</p>
              <p className="text-sm text-white/80">Identificou emoções com sucesso</p>
            </div>
          </div>

          {/* Botões centralizados */}
          <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6">
            <Link href="/home">
              <button
                className="w-64 bg-white text-gray-800 text-xl font-bold py-3 px-6 rounded-lg shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                aria-label="Voltar ao início"
              >
               Tela Inicial
              </button>
            </Link>

            <Link href="/register/select">
              <button
                className="w-64 bg-green-400 hover:bg-green-500 text-white text-xl font-bold py-3 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                aria-label="Criar uma conta no sistema"
              >
                Criar Conta
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
