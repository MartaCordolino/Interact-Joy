'use client';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomeNavigation() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(true);

  const handleContinueAsGuest = () => {
    localStorage.setItem('userType', 'guest');
    router.push('/dashboard/convidado');
  };

  const toggleAudio = () => {
  const newValue = !audioEnabled;
  setAudioEnabled(newValue);
  localStorage.setItem('audioEnabled', newValue);

  if (newValue) {
    const audio = new Audio('/audio/home.mp3'); // Certifique-se de que está em public/audio/
    audio.volume = 0.7;
    audio.play().catch((e) =>
      console.log('O áudio não pôde ser reproduzido até que o usuário interaja:', e)
    );
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 relative">
      <Head>
        <title>Menu Principal - Interact Joy</title>
        <meta name="description" content="Menu de navegação do Interact Joy" />
      </Head>

      {/* Botão de áudio */}
      <button 
        onClick={toggleAudio}
        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md cursor-pointer"
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
            <path d="M20 9L16 13M16 9L20 13" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      <main className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-1 animate-spin" style={{ animationDuration: '8s' }}>
          <Image
            src="/images/Logo_Interact_Joy.png" 
            alt="Logotipo do Interact Joy" 
            width={200}
            height={200}
            className="w-auto h-auto"
            style={{ objectFit: "contain" }}
          />
        </div>

        <h1 id="mainTitle" className="text-5xl font-bold text-center" tabIndex="-1">
          <span className="text-blue-600">Interact</span>{' '}
          <span className="text-green-900">Joy</span>
        </h1>

        <p className="text-3xl md:text-4xl font-extrabold italic text-[#F1E4D1] text-center mb-10 max-w-2xl leading-tight">
          Onde a Inclusão é o Nosso Jogo!
        </p>   

        <div className="w-full max-w-sm space-y-4">
          <Link 
            href="/login" 
            className="block w-full bg-white hover:bg-gray-100 text-2xl text-blue-600 font-bold py-4 px-6 rounded-lg shadow-lg text-center transition duration-300"
          > 
            Entrar
          </Link>

          <Link
            href="/register/select" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-2xl text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition duration-300"
          >
            Criar Conta
          </Link>

          <button 
            onClick={handleContinueAsGuest}
            className="cursor-pointer block w-full bg-teal-400 hover:bg-teal-500 text-2xl text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition duration-300"
          >
            Continuar como Convidado
          </button>

          <Link
            href="/"
            className="cursor-pointer block w-full bg-purple-400 hover:bg-purple-300 text-2xl text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center transition duration-300"
          >
            Voltar para Início
          </Link>
        </div>

        <div className="absolute bottom-4 left-4">
          <Image
            src="/images/diversidade.png"
            alt="Ilustração com crianças diversas"
            width={96}
            height={96}
            className="w-24 h-24 animate-bounce"
            style={{ animationDuration: '2.5s' }}
            role="presentation"
          />
        </div>

        <div className="absolute bottom-4 right-4">
          <Image 
            src="/images/crianças.png" 
            alt="Crianças brincando felizes"
            width={96}
            height={96}
            className="w-24 h-24 animate-bounce"
            style={{ animationDuration: '2.5s' }}
            role="presentation"
          />
        </div>
      </main>
    </div>
  );
}
