import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';

// Cria o contexto de dificuldade
const DifficultyContext = createContext();

// Hook principal que gerencia a dificuldade adaptativa
const useDifficultyManager = (initialSettings = {}, userId = null) => {
  const defaultSettings = {
    global: {
      level: 1,
      maxLevel: 10,
      autoAdjust: true,
      timerDuration: 0,
      visualComplexity: 'low',
      audioVolume: 0.7,
      reinforcementFrequency: 'high',
      allowRepeatInstruction: true, // Novo: controle do botão repetir
    },
    communication: {
      level: 1,
      maxLevel: 10,
      vocabularySize: 10,
      sentenceComplexity: 'simple',
      conceptAbstraction: 'concrete',
      instructionComplexity: 'basic', // Novo
    },
    emotions: {
      level: 1,
      maxLevel: 10,
      emotionVariety: 4,
      contextComplexity: 'simple',
      subtletyLevel: 'obvious',
      instructionComplexity: 'basic', // Novo
    },
    social: {
      level: 1,
      maxLevel: 10,
      interactionComplexity: 'one-on-one',
      socialCuesVariety: 'basic',
      decisionTimeLimit: 0,
      instructionComplexity: 'basic', // Novo
    },
  };

  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...initialSettings,
  }));

  const [performanceHistory, setPerformanceHistory] = useState({
    communication: [],
    emotions: [],
    social: [],
  });

  const loadSettings = useCallback((userId) => {
    try {
      const saved = localStorage.getItem(`difficulty_${userId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Erro ao carregar configurações de dificuldade:", error);
      return null;
    }
  }, []);

  const saveSettings = useCallback((userId, settings) => {
    try {
      localStorage.setItem(`difficulty_${userId}`, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações de dificuldade:", error);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const saved = loadSettings(userId);
    if (saved) {
      setSettings((prev) => ({ ...prev, ...saved }));
    }
  }, [userId, loadSettings]);

  useEffect(() => {
    if (userId) {
      saveSettings(userId, settings);
    }
  }, [settings, userId, saveSettings]);

  const updateSetting = useCallback((category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);

  const adjustCategorySpecificParameters = useCallback((category, level) => {
    const set = (key, val) => updateSetting(category, key, val);

    switch (category) {
      case 'communication':
        set('vocabularySize', 10 + (level - 1) * 5);
        set('sentenceComplexity',
          level <= 3 ? 'simple' :
          level <= 7 ? 'moderate' : 'complex'
        );
        set('conceptAbstraction',
          level <= 4 ? 'concrete' :
          level <= 7 ? 'mixed' : 'abstract'
        );
        set('instructionComplexity',
          level <= 3 ? 'basic' :
          level <= 7 ? 'detailed' : 'concise'
        );
        break;

      case 'emotions':
        set('emotionVariety', 4 + (level - 1));
        set('contextComplexity',
          level <= 3 ? 'simple' :
          level <= 7 ? 'moderate' : 'complex'
        );
        set('subtletyLevel',
          level <= 4 ? 'obvious' :
          level <= 8 ? 'moderate' : 'subtle'
        );
        set('instructionComplexity',
          level <= 3 ? 'basic' :
          level <= 7 ? 'detailed' : 'concise'
        );
        break;

      case 'social':
        set('interactionComplexity',
          level <= 3 ? 'one-on-one' :
          level <= 7 ? 'group' : 'dynamic-group'
        );
        set('socialCuesVariety',
          level <= 4 ? 'basic' :
          level <= 8 ? 'intermediate' : 'advanced'
        );
        set('decisionTimeLimit', level <= 3 ? 0 : 10 - Math.floor(level / 2));
        set('instructionComplexity',
          level <= 3 ? 'basic' :
          level <= 7 ? 'detailed' : 'concise'
        );
        break;

      default:
        console.warn(`Categoria desconhecida: ${category}`);
    }

    // Ajuste global relacionado à repetição de instruções
    updateSetting('global', 'allowRepeatInstruction', level <= 4);
  }, [updateSetting]);

  const adjustDifficultyBasedOnPerformance = useCallback((category, performancePercent) => {
    const recent = performanceHistory[category].slice(-3);
    const average = recent.length
      ? recent.reduce((sum, val) => sum + val, 0) / recent.length
      : performancePercent;

    const current = settings[category].level;
    const max = settings[category].maxLevel;

    if (average >= 85 && current < max) {
      const newLevel = current + 1;
      updateSetting(category, 'level', newLevel);
      adjustCategorySpecificParameters(category, newLevel);
      return 'increased';
    } else if (average <= 40 && current > 1) {
      const newLevel = current - 1;
      updateSetting(category, 'level', newLevel);
      adjustCategorySpecificParameters(category, newLevel);
      return 'decreased';
    }

    return 'maintained';
  }, [settings, performanceHistory, updateSetting, adjustCategorySpecificParameters]);

  const recordPerformance = useCallback((category, score, totalPossible) => {
    const percent = (score / totalPossible) * 100;

    setPerformanceHistory((prev) => ({
      ...prev,
      [category]: [...prev[category].slice(-9), percent],
    }));

    if (settings.global.autoAdjust) {
      return adjustDifficultyBasedOnPerformance(category, percent);
    }

    return percent;
  }, [adjustDifficultyBasedOnPerformance, settings.global.autoAdjust]);

  return useMemo(() => ({
    settings,
    updateSetting,
    recordPerformance,
  }), [settings, updateSetting, recordPerformance]);
};

// Hook personalizado para acessar o contexto
export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error('useDifficulty deve ser usado dentro de um DifficultyProvider');
  }
  return context;
};

// Componente provedor do contexto de dificuldade
export const DifficultyProvider = ({ children, initialSettings = {}, userId = null }) => {
  const value = useDifficultyManager(initialSettings, userId);
  return (
    <DifficultyContext.Provider value={value}>
      {children}
    </DifficultyContext.Provider>
  );
};
