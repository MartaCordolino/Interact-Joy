///src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAudio = localStorage.getItem('audioEnabled');
    if (storedAudio !== null) {
      setAudioEnabled(storedAudio === 'true');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = () => {
    const updated = !audioEnabled;
    setAudioEnabled(updated);
    localStorage.setItem('audioEnabled', updated);
  };

  const handleStart = () => {
    if (audioEnabled) {
      const welcomeAudio = new Audio('/audio/welcome.mp3');
      welcomeAudio.volume = 0.7;
      welcomeAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
    }
    router.push('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-500">
        <div className="w-32 h-32 relative">
          <Image
            src="/images/Logo_Interact_Joy.png"
            alt="Logo Interact Joy"
            width={128}
            height={128}
            className="animate-pulse"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <h1 className="text-white text-2xl font-bold mt-4">Interact Joy</h1>
        <p className="text-white mt-2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-500">
      <Head>
        <title>Bem-vindo ao Interact Joy</title>
      </Head>

      <div className="animate-spin" style={{ animationDuration: '8s' }}>
        <Image
          src="/images/Logo_Interact_Joy.png"
          alt="Logotipo do Interact Joy"
          width={300}
          height={300}
          priority
        />
      </div>

      <h1 className="text-5xl font-bold mt-6 mb-20 text-center">
        <span className="text-blue-800">Interact </span>
        <span className="text-green-300">Joy</span>
      </h1>

      <h3 className="text-white text-3xl italic mb-5 text-center">
        Clique no botão abaixo para começar sua jornada
      </h3>

      <button
        onClick={handleStart}
        className="cursor-pointer relative bg-white text-blue-600 text-3xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 tracking-wide group"
        aria-label="Iniciar a experiência com áudio de boas-vindas"
      >
        Iniciar Experiência
      </button>

      {/* Botão de áudio opcional */}
      <button
        onClick={toggleAudio}
        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md"
        aria-label={audioEnabled ? "Desativar áudio" : "Ativar áudio"}
      >
        {audioEnabled ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.5 8C15.5 8 17 9.5 17 12C17 14.5 15.5 16 15.5 16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 5C18 5 21 7 21 12C21 17 18 19 18 19" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 10.5V13.5C3 14.6 3.5 15.5 4.5 16H7.5L12.5 20V4L7.5 8H4.5C3.5 8.5 3 9.4 3 10.5Z" fill="#4B5563" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 10.5V13.5C3 14.6 3.5 15.5 4.5 16H7.5L12.5 20V4L7.5 8H4.5C3.5 8.5 3 9.4 3 10.5Z" fill="#4B5563" />
            <path d="M20 9L16 13M16 9L20 13" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
