'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import AccessibilityControls from '../../components/AccessibilityControls';
import GameCard from '../../components/GameCard';
import GuideCharacter from '../../components/GuideCharacter';
import AchievementBanner from '../../components/AchievementBanner';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [games, setGames] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setUserName('Alex');

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
          description: 'Você completou 5 jogos de comunicação!',
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
      playAudio('unlock-required.mp3');
      showHelpMessage('Complete os jogos anteriores para desbloquear este jogo!');
    }
  };

  const playAudio = (file) => {
    const audio = new Audio(`/audio/${file}`);
    audio.play();
  };

  const showHelpMessage = (message) => {
    const helpBox = document.createElement('div');
    helpBox.textContent = message;
    helpBox.setAttribute('role', 'alert');
    helpBox.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-lg";
    document.body.appendChild(helpBox);
    setTimeout(() => helpBox.remove(), 4000);
  };
 
  return (
    <div className="min-h-screen bg-blue-50 relative">
      <Head>
        <title>Interact Joy - Jogos</title>
        <meta name="description" content="Jogos educativos para desenvolvimento de habilidades" />
      </Head>

      {/* Acessibilidade posicionada no topo direito, sem sobreposição */}
     <div className="flex items-center gap-2 absolute top-4 right-4 z-50">
        <AccessibilityControls />
      </div>

      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 flex flex-col md:flex-row justify-between items-center gap-2 relative">
        <div className="flex items-center gap-2 ">
          <Image 
            src="/images/Logo_Interact_Joy.png" 
            alt="Logo do Interact Joy" 
            width={80} 
            height={80} 
            className="animate-spin-slow"
          />
          <h1 className="text-white text-3xl font-bold">
            <span className="text-blue-800">Interact</span> <span className="text-green-300">Joy</span>
          </h1>
      </div>
      <div className="flex items-center gap-2 ml-auto mr-30">
        <span className="text-[#FFE082] text-xl font-semibold drop-shadow-md">
          Olá, {userName}!
        </span>
        <Link href="/profile" className="bg-white rounded-full p-1">
          <Image 
            src="/images/games/avatar.png" 
            alt="Avatar do usuário" 
            width={60} 
            height={60} 
            className="w-10 h-10 rounded-full"
          />
        </Link>
      </div>
     </header>
     {/* Balão com personagem guia 
      <div className="absolute bottom-28 left-4 z-40 flex items-start gap-3 animate-fade-in">
        <div className="bg-white border-2 border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-800 shadow-md max-w-[180px]">
          Escolha um jogo para começar!
        </div>
        <GuideCharacter emotion="happy" />
      </div>*/}

      {/* Conteúdo principal */}
      <main className="max-w-5xl mx-auto px-6 py-6">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-4">Meus Jogos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-5xl justify-center">
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


      {/* Menu inferior fixo */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-1 flex justify-around z-20">
        <Link href="/" className="flex flex-col items-center p-2">
            <Image src="/images/icons/back.png" alt="Início" width={32} height={32} />
            <span className="text-gray-600 text-sm">Início</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center p-2 bg-blue-100 rounded-lg">
            <Image src="/images/icons/games.png" alt="Jogos" width={32} height={32} />
            <span className="text-purple-800 text-sm">Jogos</span>
        </Link>
        <Link href="/achievements" className="flex flex-col items-center p-2">
            <Image src="/images/icons/trophy.png" alt="Conquistas" width={32} height={32} />
            <span className="text-gray-600 text-sm">Conquistas</span>
        </Link>
        <Link href="/parent-dashboard" className="flex flex-col items-center p-2">
            <Image src="/images/icons/report.png" alt="Relatórios" width={32} height={32} />
            <span className="text-gray-600 text-sm">Relatórios</span>
        </Link>
      </nav>


      {/* Banner de conquista */}
      {showAchievement && (
        <AchievementBanner
          achievement={achievementData}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}
