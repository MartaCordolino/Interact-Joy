'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

import AccessibleButton from '@/components/AccessibleButton';
import AudioFeedback from '@/components/AudioFeedback';

export default function Achievements() {
  const router = useRouter();
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [playSound, setPlaySound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealAchievements = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // Buscar dados do usuário
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();
        const crianca = userData.crianca;
        if (!crianca) return;

        const criancaId = crianca.id;

        // Buscar conquistas reais
        const conquistasRes = await fetch(`/api/conquistas/${criancaId}`);
        const conquistasData = await conquistasRes.json();

        const mappedAchievements = conquistasData.map((conquista) => ({
          id: conquista.id,
          title: conquista.titulo,
          description: conquista.descricao,
          icon: conquista.tipo === 'trofeu' ? '🏆' : '🎖️',
          dateEarned: conquista.data,
          isNew: false,
        }));

        setAchievements(mappedAchievements);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        setIsLoading(false);
      }
    };

    fetchRealAchievements();
  }, []);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 1000);
  };

  const handleBackClick = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-indigo-700">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Minhas Conquistas | Interact Joy</title>
        <meta name="description" content="Veja suas conquistas no aplicativo Interact Joy" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 p-4 md:p-6">
        <AudioFeedback
          play={playSound}
          type="achievement"
          volume={0.7}
          playbackRate={1}
        />

        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <AccessibleButton
              onClick={handleBackClick}
              variant="secondary"
              size="md"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              }
              label="Voltar"
            >
              Voltar
            </AccessibleButton>

            <h1 className="text-2xl font-bold text-indigo-700 text-center">
              🏆 Minhas Conquistas
            </h1>

            <div className="w-16"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-4xl mb-2">
              {achievements.length}
            </div>
            <p className="text-gray-600">conquistas desbloqueadas</p>
          </div>
        </header>

        <main>
          {achievements.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Nenhuma conquista registrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <button
                  key={achievement.id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => handleAchievementClick(achievement)}
                  aria-label={`Conquista: ${achievement.title}`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-medium text-lg mb-1">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    Conquistado em {new Date(achievement.dateEarned).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Modal de conquista selecionada */}
          {selectedAchievement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-in">
                <div className="text-6xl mb-4 text-center">{selectedAchievement.icon}</div>
                <h3 className="text-2xl font-bold text-center mb-2">{selectedAchievement.title}</h3>
                <p className="text-gray-600 text-center mb-4">{selectedAchievement.description}</p>

                <div className="text-green-600 text-center mb-6">
                  <div className="text-lg font-medium">Conquistado!</div>
                  <div className="text-sm">{new Date(selectedAchievement.dateEarned).toLocaleDateString()}</div>
                </div>

                <AccessibleButton
                  onClick={() => setSelectedAchievement(null)}
                  variant="primary"
                  size="lg"
                  fullWidth={true}
                >
                  Fechar
                </AccessibleButton>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
