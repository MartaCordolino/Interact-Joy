"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import AccessibilityControls from '@/components/AccessibilityControls';
import GameCard from '@/components/GameCard';
import GuideCharacter from '@/components/GuideCharacter';
import AchievementBanner from '@/components/AchievementBanner';

export default function UsuarioDashboard() {
  const [userName, setUserName] = useState('Alex');
  const [games, setGames] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setGames([
      {
        id: 'communication',
        title: 'Forme Palavras',
        imageUrl: '/images/games/communication.png',
        level: 2,
        unlocked: true,
        description: 'Aprenda a formar frases arrastando palavras',
        category: 'Comunicação',
        completionRate: 100,
        difficulty: 'easy'
      },
      {
        id: 'emotions',
        title: 'Meu Sentimento',
        imageUrl: '/images/games/emotions.png',
        level: 1,
        unlocked: true,
        description: 'Identifique emoções em diferentes situações',
        category: 'Regulação Emocional',
        completionRate: 60,
        difficulty: 'medium'
      },
      {
        id: 'social',
        title: 'Amigos na Escola',
        imageUrl: '/images/games/social.svg',
        level: 1,
        unlocked: true,
        description: 'Aprenda interações sociais em diferentes situações',
        category: 'Habilidades Sociais',
        completionRate: 45,
        difficulty: 'easy'
      },
      {
        id: 'colors',
        title: 'Mundo das Cores',
        imageUrl: '/images/games/colors.svg',
        level: 3,
        unlocked: true,
        description: 'Combine cores e formas',
        category: 'Desenvolvimento Cognitivo',
        completionRate: 80,
        difficulty: 'hard'
      },
      {
        id: 'sequence',
        title: 'Sequência Divertida',
        imageUrl: '/images/games/sequence.svg',
        level: 1,
        unlocked: false,
        description: 'Complete a sequência de imagens',
        category: 'Concentração',
        completionRate: 0,
        difficulty: 'medium'
      },
      {
        id: 'puzzle',
        title: 'Quebra-cabeça',
        imageUrl: '/images/games/puzzle.svg',
        level: 2,
        unlocked: false,
        description: 'Monte imagens divertidas',
        category: 'Habilidades Motoras',
        completionRate: 0,
        difficulty: 'medium'
      }
    ]);

    const hasNewAchievement = localStorage.getItem('newAchievement');
    if (hasNewAchievement) {
      setTimeout(() => {
        setAchievementData({
          title: 'Mestre das Palavras',
          description: 'Você completou 5 jogos de comunicação! 🎉',
          icon: '/images/achievements/communication-master.svg'
        });
        setShowAchievement(true);
        localStorage.removeItem('newAchievement');
      }, 1000);
    }
  }, []);

  const handleGameSelect = (gameId) => {
    const selectedGame = games.find((g) => g.id === gameId);
    if (selectedGame?.unlocked) {
      router.push(`/games/${gameId}`);
    } else {
      playAudio('gentle-error.mp3');
      showHelpMessage('Complete os jogos anteriores para desbloquear este jogo.');
    }
  };

  const playAudio = (file) => {
    const audio = new Audio(`/audio/${file}`);
    audio.volume = 0.7;
    audio.play();
  };

  const showHelpMessage = (message) => {
    const helpBox = document.createElement('div');
    helpBox.textContent = message;
    helpBox.setAttribute('role', 'alert');
    helpBox.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-lg text-lg font-medium";
    document.body.appendChild(helpBox);
    setTimeout(() => helpBox.remove(), 4000);
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-800 relative">
      <Head>
        <title>Dashboard - Interact Joy</title>
        <meta name="description" content="Área de jogos para usuários do Interact Joy" />
      </Head>

      <div className="absolute top-4 right-4 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-left space-x-4 animate-spin-slow">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={100} height={100} />
        </div>
        <div className="flex-1 text-left">  
          <h1 className="text-3xl flex space-x-1">
            <span className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">'>
              Interact 
            </span>
            <span className='text-lime-400'>
              Joy
            </span>
          </h1>
        </div>
        <div className="text-yellow-100 text-xl font-semibold pr-12">Olá, Vamos Brincar! {/*{userName}!*/}</div>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">Meus Jogos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              difficulty={game.difficulty}
              targetSkill={game.category}
              locked={!game.unlocked}
              completionRate={game.completionRate}
              onClick={() => handleGameSelect(game.id)}
            />
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 flex justify-around p-2 z-40">
        <Link href="/" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/back.png" alt="Início" width={32} height={32} />
          <span className="text-sm">Voltar</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-blue-700 font-semibold">
          <Image src="/images/icons/games.png" alt="Jogos" width={32} height={32} />
          <span className="text-sm">Jogos</span>
        </Link>
        <Link href="/achievements" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/trophy.png" alt="Conquistas" width={32} height={32} />
          <span className="text-sm">Conquistas</span>
        </Link>
        <Link href="/parent-dashboard" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/report.png" alt="Relatórios" width={32} height={32} />
          <span className="text-sm">Relatórios</span>
        </Link>
      </nav>

      {showAchievement && (
        <AchievementBanner
          achievement={achievementData}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}
