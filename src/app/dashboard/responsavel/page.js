// src/app/dashboard/responsavel/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import AccessibilityControls from '@/components/AccessibilityControls';
import html2pdf from 'html2pdf.js';
import { utils, writeFile } from 'xlsx';

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [childProfile, setChildProfile] = useState({
    id: 'child-001',
    name: 'Miguel Silva',
    age: 9,
    avatarUrl: '/avatars/child-avatar.png'
  });

  const dashboardRef = useRef(null);

  const [progressData, setProgressData] = useState({
    weeklyActivity: [
      { day: 'Dom', minutes: 15 },
      { day: 'Seg', minutes: 25 },
      { day: 'Ter', minutes: 35 },
      { day: 'Qua', minutes: 20 },
      { day: 'Qui', minutes: 30 },
      { day: 'Sex', minutes: 40 },
      { day: 'Sáb', minutes: 10 },
    ],
    skillsProgress: [
      { name: 'Comunicação', progress: 65 },
      { name: 'Habilidades Sociais', progress: 45 },
      { name: 'Regulação Emocional', progress: 70 },
      { name: 'Concentração', progress: 50 },
      { name: 'Habilidades Motoras', progress: 80 },
    ],
    achievements: [
      { id: 1, title: 'Mestre das Emoções', date: '25/04/2025', icon: '🏆' },
      { id: 2, title: 'Comunicador Iniciante', date: '23/04/2025', icon: '🎯' },
      { id: 3, title: 'Primeiro Jogo Completo', date: '20/04/2025', icon: '🎮' },
    ],
    recentActivities: [
      { id: 1, game: 'Jogo das Emoções', date: '26/04/2025', duration: '15 min', score: 80 },
      { id: 2, game: 'Situações Sociais', date: '24/04/2025', duration: '20 min', score: 65 },
      { id: 3, game: 'Reconhecimento Facial', date: '22/04/2025', duration: '10 min', score: 90 },
      { id: 4, game: 'Jogo de Comunicação', date: '21/04/2025', duration: '25 min', score: 75 },
    ],
    monthlyProgress: [
      { month: 'Jan', communication: 20, social: 10, emotional: 15 },
      { month: 'Fev', communication: 30, social: 20, emotional: 25 },
      { month: 'Mar', communication: 40, social: 35, emotional: 30 },
      { month: 'Abr', communication: 65, social: 45, emotional: 70 },
    ]
  });

  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    simplifiedView: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressData(prevData => {
        const updatedWeeklyActivity = prevData.weeklyActivity.map(day => ({
          ...day,
          minutes: Math.max(0, day.minutes + (Math.random() > 0.5 ? 1 : -1))
        }));

        return {
          ...prevData,
          weeklyActivity: updatedWeeklyActivity
        };
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const textClass = settings.largeText ? 'text-lg' : 'text-base';

  const exportToPDF = () => {
    const element = dashboardRef.current;
    html2pdf().set({
      margin: 0.5,
      filename: 'relatorio_interactjoy.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save();
  };

  const exportToCSV = () => {
    const data = progressData.recentActivities.map(item => ({
      Jogo: item.game,
      Data: item.date,
      Duracao: item.duration,
      Pontuacao: item.score
    }));
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Atividades Recentes');
    writeFile(workbook, 'relatorio_interactjoy.csv');
  };

  return (
    <div className={`min-h-screen ${settings.highContrast ? 'bg-black text-white' : 'bg-blue-50'}`}>
      <header className={`${settings.highContrast ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'} p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className={`${settings.largeText ? 'text-3xl' : 'text-2xl'} font-bold`}>
            Dashboard para Pais
          </h1>
          <AccessibilityControls 
            settings={settings}
            onSettingsChange={setSettings}
          />
        </div>
      </header>

      <main className="container mx-auto p-4" ref={dashboardRef}>
        <div className="flex justify-end gap-4 mb-6">
          <button onClick={exportToPDF} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow">
            Exportar PDF
          </button>
          <button onClick={exportToCSV} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
            Exportar CSV
          </button>
        </div>

        {/* ... resto do conteúdo ... */}

      </main>
    </div>
  );
}
