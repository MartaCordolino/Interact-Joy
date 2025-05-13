// src/app/parent-dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import AccessibilityControls from '@/components/AccessibilityControls';

/**
 * Dashboard para pais e responsáveis acompanharem o progresso da criança
 * Atendendo aos requisitos:
 * - RNF-005: Dashboard de relatórios em tempo real
 * - RNF-001: Interface acessível
 */
export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [childProfile, setChildProfile] = useState({
    id: 'child-001',
    name: 'Miguel Silva',
    age: 9,
    avatarUrl: '/avatars/child-avatar.png'
  });
  
  // Dados simulados de progresso
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
  
  // Configurações de acessibilidade
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    simplifiedView: false
  });
    
  // Função que simula obtenção de dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulando uma pequena mudança aleatória nos dados de atividade semanal
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
    }, 30000); // Atualiza a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  // Classes condicionais para acessibilidade
  const textClass = settings.largeText ? 'text-lg' : 'text-base';
  const contrastClass = settings.highContrast ? 'bg-black text-white' : '';
  
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

      <main className="container mx-auto p-4">
        {/* Navegação de volta */}
        <Link href="/dashboard" className={`inline-flex items-center mb-6 ${settings.highContrast ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:underline'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar ao Menu Principal
        </Link>

        {/* Perfil da criança */}
        <div className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <span className="text-4xl">👦</span>
            </div>
            
            <div>
              <h2 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-2 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                {childProfile.name}
              </h2>
              <p className={`${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                {childProfile.age} anos
              </p>
            </div>
            
            <div className="ml-auto">
              <Link href="/child/settings" className={`px-4 py-2 rounded-lg ${settings.highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'} font-medium`}>
                Configurações do Perfil
              </Link>
            </div>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="flex overflow-x-auto mb-6 space-x-2">
          {['overview', 'progress', 'achievements', 'settings'].map((tab) => (
            <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${textClass} ${
              activeTab === tab 
                ? (settings.highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white') 
                : (settings.highContrast ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700')
            }`}
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
          >
            {tab === 'overview' && 'Visão Geral'}
            {tab === 'progress' && 'Progresso'}
            {tab === 'achievements' && 'Conquistas'}
            {tab === 'settings' && 'Configurações'}
          </button>          
          ))}
        </div>

        {/* Conteúdo da aba selecionada */}
        <div className="space-y-8" id={`panel-${activeTab}`} role="tabpanel">
          {activeTab === 'overview' && (
            <>
              {/* Resumo de atividades recentes */}
              <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-4 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                  Atividades Recentes
                </h3>
                
                <div className="overflow-x-auto">
                  <table className={`w-full ${settings.simplifiedView ? '' : 'border-collapse'}`}>
                    <thead>
                      <tr className={`${settings.highContrast ? 'border-b border-gray-600' : 'border-b-2 border-gray-200'}`}>
                        <th className={`py-3 text-left ${textClass} ${settings.highContrast ? 'text-yellow-400' : 'text-gray-600'}`}>Jogo</th>
                        <th className={`py-3 text-left ${textClass} ${settings.highContrast ? 'text-yellow-400' : 'text-gray-600'}`}>Data</th>
                        <th className={`py-3 text-left ${textClass} ${settings.highContrast ? 'text-yellow-400' : 'text-gray-600'}`}>Duração</th>
                        <th className={`py-3 text-left ${textClass} ${settings.highContrast ? 'text-yellow-400' : 'text-gray-600'}`}>Pontuação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progressData.recentActivities.map((activity) => (
                        <tr key={activity.id} className={`${settings.highContrast ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
                          <td className={`py-3 ${textClass}`}>{activity.game}</td>
                          <td className={`py-3 ${textClass}`}>{activity.date}</td>
                          <td className={`py-3 ${textClass}`}>{activity.duration}</td>
                          <td className={`py-3 ${textClass}`}>
                            <div className="flex items-center">
                              <div className={`w-full h-2 bg-gray-200 rounded-full mr-2 ${settings.highContrast ? 'bg-gray-700' : ''}`}>
                                <div 
                                  className={`h-2 rounded-full ${
                                    settings.highContrast 
                                      ? 'bg-yellow-500' 
                                      : activity.score >= 80 ? 'bg-green-500' : activity.score >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${activity.score}%` }}
                                ></div>
                              </div>
                              <span className={`${textClass} ${settings.highContrast ? 'text-white' : ''}`}>{activity.score}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Gráfico de atividade semanal */}
              <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-4 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                  Atividade Semanal
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={progressData.weeklyActivity}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={settings.highContrast ? "#555" : "#eee"} />
                      <XAxis 
                        dataKey="day" 
                        stroke={settings.highContrast ? "#fff" : "#666"} 
                        tick={{ fontSize: settings.largeText ? 14 : 12 }}
                      />
                      <YAxis 
                        stroke={settings.highContrast ? "#fff" : "#666"} 
                        tick={{ fontSize: settings.largeText ? 14 : 12 }}
                        label={{ 
                          value: 'Minutos', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: settings.highContrast ? "#fff" : "#666" }
                        }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: settings.highContrast ? '#333' : '#fff',
                          color: settings.highContrast ? '#fff' : '#333',
                          border: `1px solid ${settings.highContrast ? '#555' : '#ddd'}`
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: settings.largeText ? 14 : 12 }} />
                      <Bar 
                        dataKey="minutes" 
                        name="Minutos de Atividade" 
                        fill={settings.highContrast ? "#f59e0b" : "#4f46e5"} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg border ${settings.highContrast ? 'border-gray-600 bg-gray-700' : 'border-blue-100 bg-blue-50'}`}>
                  <h4 className={`font-medium mb-2 ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                    Interpretação
                  </h4>
                  <p className={`${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    Miguel está mostrando um padrão consistente de uso, com picos às terças e sextas-feiras. 
                    A duração média diária de 25 minutos está dentro da faixa recomendada para sua idade.
                  </p>
                </div>
              </section>
              
              {/* Progresso de habilidades */}
              <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-4 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                  Desenvolvimento de Habilidades
                </h3>
                
                <div className="space-y-4">
                  {progressData.skillsProgress.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className={`${textClass} ${settings.highContrast ? 'text-white' : 'text-gray-700'}`}>{skill.name}</span>
                        <span className={`${textClass} ${settings.highContrast ? 'text-yellow-400' : 'text-blue-600'}`}>{skill.progress}%</span>
                      </div>
                      <div className={`w-full h-3 ${settings.highContrast ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                        <div 
                          className={`h-3 rounded-full ${settings.highContrast ? 'bg-yellow-500' : 'bg-blue-600'}`}
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={`mt-6 p-4 rounded-lg border ${settings.highContrast ? 'border-gray-600 bg-gray-700' : 'border-green-100 bg-green-50'}`}>
                  <h4 className={`font-medium mb-2 ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-green-800'}`}>
                    Recomendações
                  </h4>
                  <p className={`${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    Miguel está progredindo bem em Habilidades Motoras e Regulação Emocional.
                    Recomendamos mais atividades de Habilidades Sociais e Concentração para um desenvolvimento equilibrado.
                  </p>
                </div>
              </section>
            </>
          )}

          {activeTab === 'progress' && (
            <>
              {/* Gráfico de progresso mensal */}
              <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-4 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                  Progresso Mensal
                </h3>
                
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressData.monthlyProgress}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={settings.highContrast ? "#555" : "#eee"} />
                      <XAxis 
                        dataKey="month" 
                        stroke={settings.highContrast ? "#fff" : "#666"}
                        tick={{ fontSize: settings.largeText ? 14 : 12 }} 
                      />
                      <YAxis 
                        stroke={settings.highContrast ? "#fff" : "#666"}
                        tick={{ fontSize: settings.largeText ? 14 : 12 }}
                        label={{ 
                          value: 'Pontuação', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: settings.highContrast ? "#fff" : "#666" }
                        }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: settings.highContrast ? '#333' : '#fff',
                          color: settings.highContrast ? '#fff' : '#333',
                          border: `1px solid ${settings.highContrast ? '#555' : '#ddd'}`
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: settings.largeText ? 14 : 12 }} />
                      <Line 
                        type="monotone" 
                        dataKey="communication" 
                        name="Comunicação" 
                        stroke={settings.highContrast ? "#f59e0b" : "#4f46e5"} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="social" 
                        name="Habilidades Sociais" 
                        stroke={settings.highContrast ? "#10b981" : "#10b981"} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="emotional" 
                        name="Regulação Emocional" 
                        stroke={settings.highContrast ? "#f43f5e" : "#f43f5e"} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className={`mt-6 p-4 rounded-lg border ${settings.highContrast ? 'border-gray-600 bg-gray-700' : 'border-blue-100 bg-blue-50'}`}>
                  <h4 className={`font-medium mb-2 ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                    Análise de Tendências
                  </h4>
                  <p className={`${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                    Miguel demonstrou progresso significativo em todas as áreas principais nos últimos 4 meses.
                    Particularmente notável é o progresso em Comunicação e Regulação Emocional em abril,
                    possivelmente devido ao aumento do uso dos jogos educativos.
                  </p>
                </div>
              </section>
            </>
          )}

          {activeTab === 'achievements' && (
            <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-6 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                Conquistas Desbloqueadas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progressData.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border ${settings.highContrast ? 'border-yellow-600 bg-gray-700' : 'border-blue-200 bg-blue-50'}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-3xl mr-3" aria-hidden="true">{achievement.icon}</span>
                      <div>
                        <h4 className={`font-bold ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${settings.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                          Conquistado em {achievement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 p-4 rounded-lg border ${settings.highContrast ? 'border-gray-600 bg-gray-700' : 'border-purple-100 bg-purple-50'}`}>
                <h4 className={`font-medium mb-2 ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-purple-800'}`}>
                  Próximas Conquistas
                </h4>
                <ul className={`list-disc pl-5 space-y-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Comunicador Avançado: Complete 10 jogos de comunicação</li>
                  <li>Herói da Persistência: Jogue por 7 dias consecutivos</li>
                  <li>Explorador Social: Complete todos os níveis de Situações Sociais</li>
                </ul>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className={`${settings.highContrast ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`${settings.largeText ? 'text-2xl' : 'text-xl'} font-bold mb-6 ${settings.highContrast ? 'text-white' : 'text-blue-800'}`}>
                Configurações de Acompanhamento
              </h3>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <h4 className={`font-medium ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-gray-800'}`}>
                    Notificações
                  </h4>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="notify-achievements" 
                      className="w-4 h-4 text-blue-600" 
                      defaultChecked={true}
                    />
                    <label 
                      htmlFor="notify-achievements" 
                      className={`ml-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Novas conquistas
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="notify-progress" 
                      className="w-4 h-4 text-blue-600" 
                      defaultChecked={true}
                    />
                    <label 
                      htmlFor="notify-progress" 
                      className={`ml-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Relatórios semanais de progresso
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="notify-inactivity" 
                      className="w-4 h-4 text-blue-600" 
                      defaultChecked={false}
                    />
                    <label 
                      htmlFor="notify-inactivity" 
                      className={`ml-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Alertas de inatividade
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className={`font-medium ${settings.largeText ? 'text-lg' : 'text-base'} ${settings.highContrast ? 'text-white' : 'text-gray-800'}`}>
                    Compartilhamento de Dados
                  </h4>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="share-therapist" 
                      className="w-4 h-4 text-blue-600" 
                      defaultChecked={true}
                    />
                    <label 
                      htmlFor="share-therapist" 
                      className={`ml-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Compartilhar com terapeuta
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="share-school" 
                      className="w-4 h-4 text-blue-600" 
                      defaultChecked={false}
                    />
                    <label 
                      htmlFor="share-school" 
                      className={`ml-2 ${textClass} ${settings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Compartilhar com escola
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className={`px-6 py-2 rounded-lg ${settings.highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'} font-medium`}
                  >
                    Salvar Configurações
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}