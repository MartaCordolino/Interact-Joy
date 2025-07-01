// Página de perfil personalizada para usuário infantil - Saudação por nome
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AccessibilityControls from '@/components/AccessibilityControls';
import AccessibleButton from '@/components/AccessibleButton';
import RewardAnimation from '@/components/RewardAnimation';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Miguel',
    age: 9,
    themePreference: 'default',
    soundEnabled: true,
    difficultyLevel: 'medium',
    achievements: 5,
    gamesCompleted: 12,
    totalPoints: 350
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [showReward, setShowReward] = useState(false);

  const themeOptions = [
    { id: 'default', label: 'Padrão', color: '#4f46e5' },
    { id: 'space', label: 'Espaço', color: '#312e81' },
    { id: 'ocean', label: 'Oceano', color: '#0369a1' },
    { id: 'forest', label: 'Floresta', color: '#166534' },
    { id: 'sunset', label: 'Pôr do Sol', color: '#ea580c' },
    { id: 'candy', label: 'Doces', color: '#db2777' }
  ];

  const difficultyOptions = [
    { id: 'easy', label: 'Fácil' },
    { id: 'medium', label: 'Médio' },
    { id: 'hard', label: 'Difícil' },
    { id: 'adaptive', label: 'Adaptativo' }
  ];

  const saveProfile = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    setShowReward(true);
  };

  const cancelEditing = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const getCurrentTheme = () => {
    return themeOptions.find(theme => theme.id === profile.themePreference) || themeOptions[0];
  };

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
        <Link href="/dashboard" className="inline-flex items-center mb-6 text-blue-600 hover:underline">
          ← Voltar ao Menu Principal
        </Link>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Olá, {profile.name}!</h2>
          <p className="text-gray-700 mb-6">{profile.age} anos</p>

          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-blue-50 p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">{profile.gamesCompleted}</div>
                  <p className="text-sm text-gray-600">Jogos</p>
                </div>
                <div className="text-center bg-green-50 p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">{profile.achievements}</div>
                  <p className="text-sm text-gray-600">Conquistas</p>
                </div>
                <div className="text-center bg-purple-50 p-4 rounded">
                  <div className="text-2xl font-bold text-purple-600">{profile.totalPoints}</div>
                  <p className="text-sm text-gray-600">Pontos</p>
                </div>
              </div>

              <div className="pt-4">
                <AccessibleButton onClick={() => setIsEditing(true)} ariaLabel="Editar perfil" variant="secondary">
                  Editar Perfil
                </AccessibleButton>
              </div>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nome</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Idade</label>
                <input
                  type="number"
                  min="3"
                  max="99"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tema</label>
                <select
                  value={editedProfile.themePreference}
                  onChange={(e) => setEditedProfile({ ...editedProfile, themePreference: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  {themeOptions.map((theme) => (
                    <option key={theme.id} value={theme.id}>{theme.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Dificuldade</label>
                <select
                  value={editedProfile.difficultyLevel}
                  onChange={(e) => setEditedProfile({ ...editedProfile, difficultyLevel: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  {difficultyOptions.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedProfile.soundEnabled}
                  onChange={(e) => setEditedProfile({ ...editedProfile, soundEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Ativar sons</label>
              </div>

              <div className="flex gap-3">
                <AccessibleButton onClick={saveProfile} variant="primary" ariaLabel="Salvar perfil">Salvar</AccessibleButton>
                <AccessibleButton onClick={cancelEditing} variant="secondary" ariaLabel="Cancelar">Cancelar</AccessibleButton>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {showReward && <RewardAnimation onClose={handleCloseReward} />}
    </div>
  );
}
