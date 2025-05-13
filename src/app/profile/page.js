'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RewardAnimation from '@/components/RewardAnimation';
import AccessibilityControls from '@/components/AccessibilityControls';
import AccessibleButton from '@/components/AccessibleButton';

/**
 * Página de perfil do usuário com opções de personalização
 * Atendendo aos requisitos:
 * - RF-004: Personalização
 * - RNF-001: Interface acessível
 */
export default function ProfilePage() {
  // Estado para armazenar dados do perfil do usuário
  const [profile, setProfile] = useState({
    name: 'Miguel',
    age: 9,
    avatar: 'boy-1',
    favoriteColor: '#4f46e5',
    themePreference: 'default',
    soundEnabled: true,
    difficultyLevel: 'medium',
    achievements: 5,
    gamesCompleted: 12,
    totalPoints: 350
  });
  
  // Estado para gerenciar a edição do perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [showReward, setShowReward] = useState(false);
  
  // Opções de avatares disponíveis
  const avatarOptions = [
    { id: 'boy-1', label: 'Menino 1', emoji: '👦' },
    { id: 'girl-1', label: 'Menina 1', emoji: '👧' },
    { id: 'boy-2', label: 'Menino 2', emoji: '👦🏽' },
    { id: 'girl-2', label: 'Menina 2', emoji: '👧🏽' },
    { id: 'robot', label: 'Robô', emoji: '🤖' },
    { id: 'cat', label: 'Gato', emoji: '🐱' },
    { id: 'dog', label: 'Cachorro', emoji: '🐶' },
    { id: 'astronaut', label: 'Astronauta', emoji: '👨‍🚀' }
  ];
  
  // Temas disponíveis para personalização
  const themeOptions = [
    { id: 'default', label: 'Padrão', color: '#4f46e5' },
    { id: 'space', label: 'Espaço', color: '#312e81' },
    { id: 'ocean', label: 'Oceano', color: '#0369a1' },
    { id: 'forest', label: 'Floresta', color: '#166534' },
    { id: 'sunset', label: 'Pôr do Sol', color: '#ea580c' },
    { id: 'candy', label: 'Doces', color: '#db2777' }
  ];
  
  // Níveis de dificuldade disponíveis
  const difficultyOptions = [
    { id: 'easy', label: 'Fácil' },
    { id: 'medium', label: 'Médio' },
    { id: 'hard', label: 'Difícil' },
    { id: 'adaptive', label: 'Adaptativo' }
  ];
  
  // Controlar se deve mostrar a aba de configurações
  const [showSettings, setShowSettings] = useState(false);
  
  // Simular carregamento de dados do perfil
  useEffect(() => {
    // Em uma implementação real, carregaria dados do backend
    const timer = setTimeout(() => {
      // Dados simulados carregados
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Função para salvar alterações no perfil
  const saveProfile = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    setShowReward(true);
    // Em uma implementação real, enviaria dados para o backend
    // saveProfileToAPI(editedProfile);
  };
  
  // Função para cancelar edição
  const cancelEditing = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };
  
  // Obter tema atual
  const getCurrentTheme = () => {
    return themeOptions.find(theme => theme.id === profile.themePreference) || themeOptions[0];
  };
  
  // Função para fechar a animação de recompensa
  const handleCloseReward = () => {
    setShowReward(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${getCurrentTheme().color}20` }}>
      <header className="text-white p-4" style={{ backgroundColor: getCurrentTheme().color }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <AccessibilityControls />
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {/* Navegação de volta */}
        <Link href="/dashboard" className="inline-flex items-center mb-6 text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar ao Menu Principal
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna do perfil */}
          <motion.div
            className="w-full md:w-2/3 bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cabeçalho do perfil */}
            <div
              className="p-6 text-white"
              style={{ backgroundColor: getCurrentTheme().color }}
            >
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mr-4">
                  {avatarOptions.find(a => a.id === profile.avatar)?.emoji || '👦'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-white text-opacity-90">{profile.age} anos</p>
                  {!isEditing && (
                    <AccessibleButton
                      onClick={() => setIsEditing(true)}
                      className="mt-2"
                      variant="secondary"
                      size="sm"
                      ariaLabel="Editar perfil"
                    >
                      Editar Perfil
                    </AccessibleButton>
                  )}
                </div>
              </div>
            </div>
            
            {/* Conteúdo do perfil */}
            <div className="p-6">
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{profile.gamesCompleted}</div>
                      <div className="text-sm text-gray-600">Jogos Completos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{profile.achievements}</div>
                      <div className="text-sm text-gray-600">Conquistas</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{profile.totalPoints}</div>
                      <div className="text-sm text-gray-600">Pontos Totais</div>
                    </div>
                  </div>
                  
                  {/* Informações de Preferências */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Minhas Preferências</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <div className="w-6 h-6 mr-3 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Tema: <strong>{themeOptions.find(t => t.id === profile.themePreference)?.label}</strong></span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 mr-3 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Avatar: <strong>{avatarOptions.find(a => a.id === profile.avatar)?.label}</strong></span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 mr-3 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Nível de Dificuldade: <strong>{difficultyOptions.find(d => d.id === profile.difficultyLevel)?.label}</strong></span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 mr-3 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-2.828a1 1 0 001.414 0l2.828-2.828a1 1 0 000-1.414L11.242 7.05a1 1 0 00-1.414 0l-2.828 2.829a1 1 0 000 1.414l2.828 2.828z" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Sons: <strong>{profile.soundEnabled ? 'Ativados' : 'Desativados'}</strong></span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <AccessibleButton
                      onClick={() => setShowSettings(!showSettings)}
                      variant="info"
                      ariaLabel="Configurações de acessibilidade"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      }
                    >
                      Configurações
                    </AccessibleButton>
                    
                    <Link href="/achievements">
                      <AccessibleButton
                        variant="success"
                        ariaLabel="Ver todas as conquistas"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        }
                      >
                        Minhas Conquistas
                      </AccessibleButton>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Editar Perfil</h3>
                  
                  {/* Formulário de edição */}
                  <form>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-describedby="name-description"
                      />
                      <p id="name-description" className="mt-1 text-sm text-gray-500">
                        Como você quer ser chamado nos jogos
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Idade
                      </label>
                      <input
                        type="number"
                        id="age"
                        min="3"
                        max="99"
                        value={editedProfile.age}
                        onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Escolha seu Avatar
                      </span>
                      <div className="grid grid-cols-4 gap-3">
                        {avatarOptions.map((avatar) => (
                          <button
                            key={avatar.id}
                            type="button"
                            className={`h-16 w-16 flex items-center justify-center text-3xl rounded-lg border-2 ${
                              editedProfile.avatar === avatar.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setEditedProfile({...editedProfile, avatar: avatar.id})}
                            aria-label={`Escolher avatar ${avatar.label}`}
                            aria-pressed={editedProfile.avatar === avatar.id}
                          >
                            {avatar.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Tema Preferido
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((theme) => (
                          <button
                            key={theme.id}
                            type="button"
                            className={`p-3 rounded-lg border-2 flex items-center ${
                              editedProfile.themePreference === theme.id
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setEditedProfile({...editedProfile, themePreference: theme.id})}
                            aria-label={`Escolher tema ${theme.label}`}
                            aria-pressed={editedProfile.themePreference === theme.id}
                          >
                            <div
                              className="w-6 h-6 rounded-full mr-2"
                              style={{ backgroundColor: theme.color }}
                              aria-hidden="true"
                            ></div>
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Nível de Dificuldade
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {difficultyOptions.map((difficulty) => (
                          <button
                            key={difficulty.id}
                            type="button"
                            className={`p-3 rounded-lg border-2 ${
                              editedProfile.difficultyLevel === difficulty.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setEditedProfile({...editedProfile, difficultyLevel: difficulty.id})}
                            aria-label={`Escolher nível de dificuldade ${difficulty.label}`}
                            aria-pressed={editedProfile.difficultyLevel === difficulty.id}
                          >
                            {difficulty.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedProfile.soundEnabled}
                          onChange={(e) => setEditedProfile({...editedProfile, soundEnabled: e.target.checked})}
                          className="h-5 w-5 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-gray-700">Ativar sons e músicas</span>
                      </label>
                    </div>
                    
                    <div className="flex space-x-3">
                      <AccessibleButton
                        onClick={saveProfile}
                        variant="primary"
                        ariaLabel="Salvar alterações do perfil"
                        soundEffect="/sounds/success.mp3"
                      >
                        Salvar Alterações
                      </AccessibleButton>
                      
                      <AccessibleButton
                        onClick={cancelEditing}
                        variant="secondary"
                        ariaLabel="Cancelar edição"
                      >
                        Cancelar
                      </AccessibleButton>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Coluna lateral - Configurações avançadas ou dicas */}
          <motion.div
            className="w-full md:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {showSettings ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Configurações de Acessibilidade
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                      <span className="ml-2 text-gray-700">Alto contraste</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                      <span className="ml-2 text-gray-700">Texto maior</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                      <span className="ml-2 text-gray-700">Reduzir animações</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-5 w-5 text-blue-600 rounded" />
                      <span className="ml-2 text-gray-700">Narração de texto</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Velocidade de Jogo
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      className="w-full"
                      aria-label="Controle de velocidade do jogo"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Lento</span>
                      <span>Normal</span>
                      <span>Rápido</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Próximas Conquistas
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 text-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Mestre das Emoções</h4>
                      <p className="text-sm text-gray-600">Complete 5 jogos de reconhecimento emocional</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">3 de 5 completos</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Comunicador Especial</h4>
                      <p className="text-sm text-gray-600">Complete 10 tarefas de comunicação</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">4 de 10 completos</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Superação Diária</h4>
                      <p className="text-sm text-gray-600">Jogue por 7 dias consecutivos</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">5 de 7 dias</p>
                    </div>
                  </li>
                </ul>
                <Link href="/games" className="block mt-6">
                  <AccessibleButton
                    variant="primary"
                    fullWidth={true}
                    ariaLabel="Jogar agora"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 11.5V6.5l5 3-5 3z" />
                    </svg>
                  }
                >
                  Jogar Agora
                </AccessibleButton>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>

    {/* Animação de recompensa ao salvar o perfil */}
    {showReward && (
      <RewardAnimation onClose={handleCloseReward} />
    )}
  </div>
);
}
