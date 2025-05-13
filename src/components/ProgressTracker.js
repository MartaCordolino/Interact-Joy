import { useState, useEffect } from 'react';

/**
 * Componente para rastrear e exibir o progresso do usuário em diferentes atividades
 * Implementa RNF-005 (monitoramento de progresso)
 * 
 * @param {Object} props
 * @param {string} props.userId - ID do usuário para rastrear progresso
 * @param {string} props.activityId - ID da atividade atual
 * @param {string} props.skill - Habilidade trabalhada (comunicação, emoções, habilidades sociais)
 * @param {number} props.currentLevel - Nível atual na atividade
 * @param {number} props.totalLevels - Total de níveis na atividade
 * @param {number} props.currentScore - Pontuação atual
 * @param {number} props.targetScore - Pontuação alvo para completar o nível
 * @param {Function} props.onLevelComplete - Callback quando o nível for concluído
 * @param {boolean} props.showDetails - Se deve mostrar detalhes ou versão simplificada
 * @param {string} props.visualType - Tipo de visualização ('bar', 'circle', 'stars')
 * @param {boolean} props.isParentView - Se está na visualização dos pais/terapeutas
 */
const ProgressTracker = ({
  userId,
  activityId,
  skill = 'general',
  currentLevel = 1,
  totalLevels = 10,
  currentScore = 0,
  targetScore = 100,
  onLevelComplete = () => {},
  showDetails = true,
  visualType = 'bar',
  isParentView = false
}) => {
  // Calcular porcentagem de progresso
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);

  // Mapeia tipos de habilidades para cores
  const skillColors = {
    communication: 'bg-blue-500',
    emotions: 'bg-purple-500',
    social: 'bg-green-500',
    general: 'bg-indigo-500'
  };

  const barColor = skillColors[skill] || skillColors.general;

  useEffect(() => {
    // Calcula o percentual de progresso
    const percent = Math.min(Math.round((currentScore / targetScore) * 100), 100);
    setProgressPercent(percent);

    // Verifica se o nível foi completado
    if (currentScore >= targetScore && !isLevelCompleted) {
      setIsLevelCompleted(true);
      onLevelComplete(currentLevel, skill);
      
      // Pode salvar em localStorage ou API
      saveProgress();
    }
  }, [currentScore, targetScore, currentLevel, skill]);

  useEffect(() => {
    // Carregar histórico de progresso quando o componente montar
    loadProgressHistory();
  }, [userId, activityId]);

  // Carrega histórico de progresso do localStorage ou API
  const loadProgressHistory = () => {
    // Simulação - em produção, isso deve vir de uma API
    try {
      const storedProgress = localStorage.getItem(`progress_${userId}_${skill}`);
      if (storedProgress) {
        setProgressHistory(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  // Salva progresso no localStorage ou envia para API
  const saveProgress = () => {
    try {
      const currentDate = new Date().toISOString();
      const newProgressEntry = {
        date: currentDate,
        level: currentLevel,
        score: currentScore,
        skill,
        activityId
      };
      
      const updatedHistory = [...progressHistory, newProgressEntry];
      setProgressHistory(updatedHistory);
      
      // Salvar em localStorage (temporário, em produção usar API)
      localStorage.setItem(`progress_${userId}_${skill}`, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  };

  // Renderiza diferentes tipos de visualizações de progresso
  const renderProgressVisual = () => {
    switch (visualType) {
      case 'circle':
        return (
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Círculo de fundo */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-current text-gray-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                className={`stroke-current ${barColor.replace('bg-', 'text-')}`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent}, 100`}
              />
            </svg>
            <div className="absolute font-bold text-lg">
              {progressPercent}%
            </div>
          </div>
        );
        
      case 'stars':
        // Calcular quantas estrelas (máximo 5)
        const fullStars = Math.floor((progressPercent / 100) * 5);
        return (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            ))}
          </div>
        );
        
      case 'bar':
      default:
        return (
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full ${barColor} transition-all duration-500 ease-out`}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        );
    }
  };

  // Versão detalhada para pais/terapeutas
  const renderDetailedView = () => {
    if (!isParentView) return null;
    
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-gray-700 mb-2">Histórico de Progresso</h3>
        
        {progressHistory.length > 0 ? (
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {progressHistory.slice(-5).map((entry, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span>Nível {entry.level}</span>
                <span>{entry.score} pontos</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sem histórico disponível</p>
        )}
        
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-600">Estatísticas</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Tempo médio por nível</p>
              <p className="font-bold">12 min</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Taxa de acertos</p>
              <p className="font-bold">78%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="progress-tracker">
      {/* Cabeçalho com informações básicas */}
      <div className="flex justify-between items-center mb-2">
        <div>
          {showDetails && (
            <p className="text-sm font-medium text-gray-700">
              Nível {currentLevel} de {totalLevels}
            </p>
          )}
        </div>
        
        {showDetails && (
          <div className="text-sm text-gray-600">
            {currentScore}/{targetScore} pontos
          </div>
        )}
      </div>
      
      {/* Visualização do progresso */}
      {renderProgressVisual()}
      
      {/* Exibe mensagem quando completar nível */}
      {isLevelCompleted && (
        <div className="mt-2 text-center">
          <p className="text-green-600 font-semibold animate-bounce">
            Nível Completo!
          </p>
        </div>
      )}
      
      {/* Exibe a visão detalhada para pais/terapeutas */}
      {renderDetailedView()}
    </div>
  );
};

export default ProgressTracker;