import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AccessibleButton from '../components/AccessibleButton';
import AudioFeedback from '../components/AudioFeedback';
import ProgressTracker from '../components/ProgressTracker';

export default function Achievements() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simula carregamento do usuário
  useEffect(() => {
    // Em produção, pegaria o ID do usuário da autenticação
    const mockUserId = localStorage.getItem('userId') || 'user-123';
    setUserId(mockUserId);
    
    // Simula carregamento inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Carregar conquistas do usuário
    fetchAchievements(mockUserId);
  }, []);

  // Simula busca de conquistas da API ou localStorage
  const fetchAchievements = (userId) => {
    // Em produção, isto seria uma chamada API
    const mockAchievements = [
      {
        id: 'ach-001',
        title: 'Primeiro Passo',
        description: 'Completou seu primeiro jogo',
        icon: '🚀',
        dateEarned: '2025-03-15',
        category: 'general',
        isNew: false,
        progress: 100
      },
      {
        id: 'ach-002',
        title: 'Comunicador',
        description: 'Completou 5 jogos de comunicação',
        icon: '💬',
        dateEarned: '2025-03-18',
        category: 'communication',
        isNew: false,
        progress: 100
      },
      {
        id: 'ach-003',
        title: 'Sentimentos em Dia',
        description: 'Identificou corretamente 10 emoções diferentes',
        icon: '😊',
        dateEarned: '2025-03-20',
        category: 'emotions',
        isNew: true,
        progress: 100
      },
      {
        id: 'ach-004',
        title: 'Amizade',
        description: 'Completou seu primeiro cenário social',
        icon: '👋',
        dateEarned: '2025-03-22',
        category: 'social',
        isNew: false,
        progress: 100
      },
      {
        id: 'ach-005',
        title: 'Perseverança',
        description: 'Jogou por 5 dias consecutivos',
        icon: '📅',
        dateEarned: null,
        category: 'general',
        isNew: false,
        progress: 80
      },
      {
        id: 'ach-006',
        title: 'Superação',
        description: 'Aumentou a dificuldade de um jogo',
        icon: '🏆',
        dateEarned: null,
        category: 'general',
        isNew: false,
        progress: 40
      },
      {
        id: 'ach-007',
        title: 'Explorador',
        description: 'Experimentou todos os tipos de jogos',
        icon: '🧭',
        dateEarned: null,
        category: 'general',
        isNew: false,
        progress: 66
      }
    ];
    
    setAchievements(mockAchievements);
  };

  // Agrupa conquistas por categoria
  const getAchievementsByCategory = () => {
    const categories = {
      'general': { title: 'Conquistas Gerais', achievements: [] },
      'communication': { title: 'Comunicação', achievements: [] },
      'emotions': { title: 'Emoções', achievements: [] },
      'social': { title: 'Habilidades Sociais', achievements: [] }
    };
    
    achievements.forEach(achievement => {
      if (categories[achievement.category]) {
        categories[achievement.category].achievements.push(achievement);
      } else {
        categories.general.achievements.push(achievement);
      }
    });
    
    return categories;
  };

  // Lidar com clique em uma conquista
  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    
    if (achievement.dateEarned) {
      // Tocar som de conquista completa
      setPlaySound(true);
      setTimeout(() => setPlaySound(false), 1000);
    }
  };

  // Voltar para o dashboard
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            
            <div className="w-16"></div> {/* Espaçador para centralizar o título */}
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-4xl mb-2">
              {achievements.filter(a => a.dateEarned).length}/{achievements.length}
            </div>
            <p className="text-gray-600">conquistas desbloqueadas</p>
          </div>
        </header>
        
        <main>
          {/* Seções de conquistas por categoria */}
          {Object.values(getAchievementsByCategory()).map((category, index) => (
            category.achievements.length > 0 && (
              <section key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-indigo-800 mb-3">{category.title}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.achievements.map(achievement => (
                    <button
                      key={achievement.id}
                      className={`bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${achievement.isNew ? 'ring-2 ring-yellow-400' : ''} ${!achievement.dateEarned ? 'opacity-70' : ''}`}
                      onClick={() => handleAchievementClick(achievement)}
                      aria-label={`Conquista: ${achievement.title}`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-medium text-lg mb-1">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                      
                      {achievement.dateEarned ? (
                        <div className="mt-2 text-green-600 text-sm font-medium">
                          Conquistado em {new Date(achievement.dateEarned).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="w-full mt-2">
                          <ProgressTracker
                            currentScore={achievement.progress}
                            targetScore={100}
                            showDetails={false}
                            visualType="bar"
                          />
                          <div className="text-xs text-gray-500 mt-1">{achievement.progress}% concluído</div>
                        </div>
                      )}
                      
                      {achievement.isNew && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Novo!
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )
          ))}
          
          {/* Modal de detalhes da conquista */}
          {selectedAchievement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-in">
                <div className="text-6xl mb-4 text-center">{selectedAchievement.icon}</div>
                <h3 className="text-2xl font-bold text-center mb-2">{selectedAchievement.title}</h3>
                <p className="text-gray-600 text-center mb-4">{selectedAchievement.description}</p>
                
                {selectedAchievement.dateEarned ? (
                  <div className="text-green-600 text-center mb-6">
                    <div className="text-lg font-medium">Conquistado!</div>
                    <div className="text-sm">{new Date(selectedAchievement.dateEarned).toLocaleDateString()}</div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <ProgressTracker
                      currentScore={selectedAchievement.progress}
                      targetScore={100}
                      showDetails={true}
                      visualType="circle"
                    />
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Continue jogando para desbloquear esta conquista!
                    </p>
                  </div>
                )}
                
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