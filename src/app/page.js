// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const storedAudio = localStorage.getItem('audioEnabled');
    if (storedAudio !== null) {
      setAudioEnabled(storedAudio === 'true');
    }
  }, []);

  useEffect(() => {
    if (hasStarted) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (audioEnabled) {
          const welcomeAudio = new Audio('/audio/welcome.mp3');
          welcomeAudio.volume = 0.7;
          welcomeAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido:', e));
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasStarted, audioEnabled]);

  useEffect(() => {
    if (!isLoading) {
      document.querySelector('#mainTitle')?.focus();
    }
  }, [isLoading]);

  const handleContinueAsGuest = () => {
    localStorage.setItem('userType', 'guest');
    router.push('/dashboard');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    localStorage.setItem('audioEnabled', !audioEnabled);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-500">
        <Head>
          <title>Bem-vindo ao Interact Joy</title>
        </Head>

        <div className="animate-spin" style={{ animationDuration: '4s' }}>
          <Image 
            src="/images/Logo_Interact_Joy.png" 
            alt="Logotipo do Interact Joy" 
            width={300} 
            height={300} 
            priority
          />
        </div>

        <h1 className="text-blue text-4xl font-bold mt-6 mb-4 text-center">Bem-vindo ao Interact Joy</h1>
        <h3 className="text-white text-lg italic mb-5 text-center">
          Clique no botão abaixo para começar sua jornada</h3>
        
        <button
            onClick={() => setHasStarted(true)}
          className="relative bg-white text-blue-600 text-2xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 tracking-wide group"
          aria-label="Iniciar a experiência com áudio de boas-vindas"
          >
          Iniciar Experiência
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-purple-500">
        <div className="w-32 h-32 relative">
          <Image 
              src="/images/Logo_Interact_Joy.png" 
              alt="Logotipo do Interact Joy, representando inclusão e diversão" 
              width={128}  
              height={128} 
              className="animate-pulse"
              style={{ objectFit: 'cover' }}
              priority 
          />
        </div>
        <h1 className="text-white text-2xl font-bold mt-4" tabIndex="-1">Interact Joy</h1>
        <p className="text-white mt-2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 relative">
      <Head>
        <title>Bem-vindo ao Interact Joy</title>
        <meta name="description" content="Aplicativo de jogos educativos para desenvolvimento de habilidades" />
      </Head>

      {/* Exibir título visual no canto superior esquerdo */}
      {/*<div className="absolute top-16 left-8 bg-white bg-opacity-80 px-6 py-3 rounded-xl shadow-lg animate-bounce">
        <h2 className="text-pink-700 font-extrabold text-2xl italic tracking-wide" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
          Bem-vindo ao Interact Joy!
        </h2>
      </div>*/}

      {/* Botão de áudio */}
      <button 
        onClick={toggleAudio}
        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md"
        aria-label={audioEnabled ? "Desativar áudio" : "Ativar áudio"}
      >
        {audioEnabled ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 8C15.5 8 17 9.5 17 12C17 14.5 15.5 16 15.5 16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 5C18 5 21 7 21 12C21 17 18 19 18 19" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10.5V13.5C3 14.6046 3.5 15.5 4.5 16H7.5L12.5 20V4L7.5 8H4.5C3.5 8.5 3 9.39543 3 10.5Z" fill="#4B5563"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10.5V13.5C3 14.6046 3.5 15.5 4.5 16H7.5L12.5 20V4L7.5 8H4.5C3.5 8.5 3 9.39543 3 10.5Z" fill="#4B5563"/>
            <path d="M20 9L16 13M16 9L20 13" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      <main className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-1 animate-spin" style={{ animationDuration: '5s' }}>
          <Image
            src="/images/Logo_Interact_Joy.png" 
            alt="Logotipo do Interact Joy, representando inclusão e diversão" 
            width={300}
            height={300}
            className="w-auto h-auto"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="mb-1 animate-fadeSlideUp">
          <h1 id="mainTitle" className="text-6xl font-bold text-center" tabIndex="-1">
            <span className="text-blue-600">Interact</span>{' '}
            <span className="text-green-900">Joy</span>
          </h1>
        </div>

        <p className="text-3xl md:text-4xl font-extrabold italic text-[#F1E4D1] text-center mb-25 max-w-2xl mx-auto leading-tight">
          Onde a Inclusão é o Nosso Jogo!
        </p>   

        <div className="w-full max-w-sm space-y-4">
          <Link 
            href="/login" className="block w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-6 rounded-lg shadow-lg text-center text-xl transition duration-300"> 
            Entrar
          </Link>
          
          <Link
            href="/register" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center text-xl transition duration-300">
            Criar Conta
          </Link>
          
          <button 
            onClick={handleContinueAsGuest}
            className="block w-full bg-teal-400 hover:bg-teal-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center text-xl transition duration-300"
          >
            Continuar como Convidado
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
            <Image
              src="/images/diversidade.png"
              alt="Ilustração com crianças diversas simbolizando inclusão"
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
            alt="Crianças brincando felizes representando alegria e diversidade"
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
