//src/components/DifficultyManager.js
import { useState, useEffect, createContext, useContext } from 'react';

// Cria um contexto para compartilhar o estado de dificuldade em toda a aplicação
const DifficultyContext = createContext();

/**
 * Hook personalizado para usar o gerenciador de dificuldade em componentes
 */
export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error('useDifficulty deve ser usado dentro de um DifficultyProvider');
  }
  return context;
};

/**
 * Provedor de contexto para o gerenciador de dificuldade
 */
export const DifficultyProvider = ({ children, initialSettings, userId }) => {
  const value = useDifficultyManager(initialSettings, userId);
  return (
    <DifficultyContext.Provider value={value}>
      {children}
    </DifficultyContext.Provider>
  );
};

/**
 * Gerenciador de dificuldade adaptativa para jogos
 * Implementa RNF-004 (dificuldade adaptativa)
 * 
 * @param {Object} initialSettings - Configurações iniciais de dificuldade
 * @param {string} userId - ID do usuário para persistir configurações
 */
const useDifficultyManager = (initialSettings = {}, userId = null) => {
  // Configurações padrão de dificuldade por categoria
  const defaultSettings = {
    global: {
      level: 1,
      maxLevel: 10,
      autoAdjust: true,
      timerDuration: 0, // 0 significa sem timer
      visualComplexity: 'low', // 'low', 'medium', 'high'
      audioVolume: 0.7,
      reinforcementFrequency: 'high', // 'low', 'medium', 'high'
    },
    communication: {
      level: 1,
      maxLevel: 10,
      vocabularySize: 10,
      sentenceComplexity: 'simple',
      conceptAbstraction: 'concrete',
    },
    emotions: {
      level: 1,
      maxLevel: 10,
      emotionVariety: 4, // número de emoções trabalhadas
      contextComplexity: 'simple',
      subtletyLevel: 'obvious',
    },
    social: {
      level: 1, 
      maxLevel: 10,
      interactionComplexity: 'one-on-one',
      socialCuesVariety: 'basic',
      decisionTimeLimit: 0, // sem limite de tempo
    }
  };

  // Combina as configurações iniciais com as padrão
  const combinedSettings = {
    ...defaultSettings,
    ...initialSettings
  };

  // Estado para as configurações atuais
  const [settings, setSettings] = useState(combinedSettings);
  
  // Estado para o histórico de desempenho (usado para ajuste automático)
  const [performanceHistory, setPerformanceHistory] = useState({
    communication: [],
    emotions: [],
    social: []
  });

  // Carregar configurações salvas quando o componente montar
  useEffect(() => {
    if (userId) {
      const savedSettings = loadSettings(userId);
      if (savedSettings) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...savedSettings
        }));
      }
    }
  }, [userId]);

  // Salvar configurações quando houver mudanças
  useEffect(() => {
    if (userId) {
      saveSettings(userId, settings);
    }
  }, [settings, userId]);

  // Função para carregar configurações do localStorage
  const loadSettings = (userId) => {
    try {
      const saved = localStorage.getItem(`difficulty_${userId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Erro ao carregar configurações de dificuldade:", error);
      return null;
    }
  };

  // Função para salvar configurações no localStorage
  const saveSettings = (userId, settings) => {
    try {
      localStorage.setItem(`difficulty_${userId}`, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações de dificuldade:", error);
    }
  };

  // Função para atualizar uma configuração específica
  const updateSetting = (category, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [key]: value
      }
    }));
  };

  // Função para registrar o desempenho do usuário
  const recordPerformance = (category, score, totalPossible) => {
    const performancePercent = (score / totalPossible) * 100;
    
    setPerformanceHistory(prev => ({
      ...prev,
      [category]: [...prev[category].slice(-9), performancePercent]
    }));
    
    // Se o ajuste automático estiver ativado, ajusta a dificuldade baseada no desempenho
    if (settings.global.autoAdjust) {
      adjustDifficultyBasedOnPerformance(category, performancePercent);
    }
    
    return performancePercent;
  };

  // Função para ajustar a dificuldade com base no desempenho
  const adjustDifficultyBasedOnPerformance = (category, performancePercent) => {
    // Obtém as últimas 3 performances (ou menos se não houver tantas)
    const recentPerformances = performanceHistory[category].slice(-3);
    const averagePerformance = recentPerformances.length > 0 
      ? recentPerformances.reduce((sum, val) => sum + val, 0) / recentPerformances.length
      : performancePercent;
    
    const currentLevel = settings[category].level;
    const maxLevel = settings[category].maxLevel;
    
    // Regras para ajuste de dificuldade
    if (averagePerformance >= 85 && currentLevel < maxLevel) {
      // Excelente desempenho - aumenta o nível
      updateSetting(category, 'level', currentLevel + 1);
      
      // Ajusta outros parâmetros baseados na categoria
      adjustCategorySpecificParameters(category, currentLevel + 1);
      
      return 'increased';
    } else if (averagePerformance <= 40 && currentLevel > 1) {
      // Dificuldade muito alta - diminui o nível
      updateSetting(category, 'level', currentLevel - 1);
      
      // Ajusta outros parâmetros baseados na categoria
      adjustCategorySpecificParameters(category, currentLevel - 1);
      
      return 'decreased';
    }
    
    return 'maintained';
  };

  // Função para ajustar parâmetros específicos de cada categoria com base no nível
  const adjustCategorySpecificParameters = (category, level) => {
    switch (category) {
      case 'communication':
        // Ajuste do tamanho do vocabulário baseado no nível
        updateSetting(category, 'vocabularySize', 10 + (level - 1) * 5);
        
        // Ajuste da complexidade das frases
        if (level <= 3) {
          updateSetting(category, 'sentenceComplexity', 'simple');
        } else if (level <= 7) {
          updateSetting(category, 'sentenceComplexity', 'moderate');
        } else {
          updateSetting(category, 'sentenceComplexity', 'complex');
        }
        
        // Ajuste do nível de abstração dos conceitos
        if (level <= 4) {
            updateSetting(category, 'conceptAbstraction', 'concrete');
          } else if (level <= 7) {
            updateSetting(category, 'conceptAbstraction', 'mixed');
          } else {
            updateSetting(category, 'conceptAbstraction', 'abstract');
          }
          break;
          case 'emotions':
            // Ajusta a variedade de emoções com base no nível
            updateSetting(category, 'emotionVariety', 4 + (level - 1));
    
            // Ajuste da complexidade do contexto
            if (level <= 3) {
              updateSetting(category, 'contextComplexity', 'simple');
            } else if (level <= 7) {
              updateSetting(category, 'contextComplexity', 'moderate');
            } else {
              updateSetting(category, 'contextComplexity', 'complex');
            }
    
            // Ajuste do nível de sutileza
            if (level <= 4) {
              updateSetting(category, 'subtletyLevel', 'obvious');
            } else if (level <= 8) {
              updateSetting(category, 'subtletyLevel', 'moderate');
            } else {
              updateSetting(category, 'subtletyLevel', 'subtle');
            }
            break;
    
          case 'social':
            // Ajuste da complexidade da interação
            if (level <= 3) {
              updateSetting(category, 'interactionComplexity', 'one-on-one');
            } else if (level <= 7) {
              updateSetting(category, 'interactionComplexity', 'group');
            } else {
              updateSetting(category, 'interactionComplexity', 'dynamic-group');
            }
    
            // Ajuste da variedade de pistas sociais
            if (level <= 4) {
              updateSetting(category, 'socialCuesVariety', 'basic');
            } else if (level <= 8) {
              updateSetting(category, 'socialCuesVariety', 'intermediate');
            } else {
              updateSetting(category, 'socialCuesVariety', 'advanced');
            }
    
            // Ajuste do limite de tempo para decisões
            updateSetting(category, 'decisionTimeLimit', level <= 3 ? 0 : 10 - Math.floor(level / 2));
            break;
    
          default:
            console.warn(`Categoria desconhecida: ${category}`);
        }
      };
    
      return {
        settings,
        updateSetting,
        recordPerformance
      };
    };