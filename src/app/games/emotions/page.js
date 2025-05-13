import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import AccessibleButton from '../../components/AccessibleButton';
import AudioFeedback from '../../components/AudioFeedback';
import ProgressTracker from '../../components/ProgressTracker';
import { useDifficulty } from '../../components/DifficultyManager';

export default function EmotionsGame() {
  const router = useRouter();
  const { userId } = router.query;
  const difficultyManager = useDifficulty();

  const [gameState, setGameState] = useState('intro');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [scenariosCompleted, setScenariosCompleted] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const [soundType, setSoundType] = useState('info');
  const [scenariosPool, setScenariosPool] = useState([]);
  const [settings, setSettings] = useState({
    level: 1,
    emotionVariety: 4,
    contextComplexity: 'simple',
    subtletyLevel: 'obvious',
  });

  const narrationRef = useRef(null);

  useEffect(() => {
    if (difficultyManager) {
      const emotionsSettings = difficultyManager.settings.emotions;
      setSettings({
        level: emotionsSettings.level,
        emotionVariety: emotionsSettings.emotionVariety,
        contextComplexity: emotionsSettings.contextComplexity,
        subtletyLevel: emotionsSettings.subtletyLevel,
      });
    }
  }, [difficultyManager]);

  useEffect(() => {
    if (settings) {
      const scenarios = generateScenarios(settings);
      setScenariosPool(scenarios);
    }
  }, [settings]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTotalAttempts(0);
    setScenariosCompleted(0);
    loadNextScenario();

    setSoundType('info');
    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 1000);
  };

  const loadNextScenario = () => {
    if (scenariosPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenariosPool.length);
      const scenario = scenariosPool[randomIndex];
      const updatedPool = [...scenariosPool];
      updatedPool.splice(randomIndex, 1);
      setScenariosPool(updatedPool);
      setCurrentScenario(scenario);
      setSelectedEmotion(null);
      setGameState('playing');
    } else {
      setGameState('complete');
      setSoundType('achievement');
      setPlaySound(true);
      setTimeout(() => setPlaySound(false), 1500);

      if (difficultyManager) {
        difficultyManager.recordPerformance('emotions', score, totalAttempts);
      }
    }
  };

  const generateScenarios = (settings) => {
    const emotions = [
      { id: 'happy', name: 'Feliz', icon: '😊', color: 'bg-yellow-200' },
      { id: 'sad', name: 'Triste', icon: '😢', color: 'bg-blue-200' },
      { id: 'angry', name: 'Bravo', icon: '😠', color: 'bg-red-200' },
      { id: 'scared', name: 'Assustado', icon: '😨', color: 'bg-purple-200' },
      { id: 'surprised', name: 'Surpreso', icon: '😲', color: 'bg-green-200' },
      { id: 'disgusted', name: 'Enojado', icon: '🤢', color: 'bg-emerald-200' },
      { id: 'calm', name: 'Calmo', icon: '😌', color: 'bg-blue-100' },
      { id: 'proud', name: 'Orgulhoso', icon: '😎', color: 'bg-amber-200' },
      { id: 'jealous', name: 'Ciumento', icon: '😒', color: 'bg-lime-200' },
      { id: 'confused', name: 'Confuso', icon: '😕', color: 'bg-gray-200' },
      { id: 'worried', name: 'Preocupado', icon: '😟', color: 'bg-slate-200' },
      { id: 'shy', name: 'Tímido', icon: '😳', color: 'bg-rose-200' },
      { id: 'disappointed', name: 'Decepcionado', icon: '😞', color: 'bg-zinc-200' }
    ];

    const availableEmotions = emotions.slice(0, Math.min(settings.emotionVariety, emotions.length));

    const scenarios = {
      simple: [
        { id: 's1', description: 'Seu amigo te deu um presente de aniversário', emotion: 'happy', image: '/images/emotions/birthday_gift.jpg' },
        { id: 's2', description: 'Seu sorvete caiu no chão', emotion: 'sad', image: '/images/emotions/dropped_icecream.jpg' },
        { id: 's3', description: 'Um amigo quebrou seu brinquedo favorito', emotion: 'angry', image: '/images/emotions/broken_toy.jpg' },
        { id: 's4', description: 'Você ouviu um barulho forte durante a noite', emotion: 'scared', image: '/images/emotions/night_noise.jpg' },
        { id: 's5', description: 'Sua amiga te convidou para brincar', emotion: 'happy', image: '/images/emotions/play_invite.jpg' }
      ],
      moderate: [
        { id: 'm1', description: 'Você ganhou um concurso na escola', emotion: 'proud', image: '/images/emotions/contest_winner.jpg' },
        { id: 'm2', description: 'Você viu uma aranha grande no banheiro', emotion: 'scared', image: '/images/emotions/spider.jpg' },
        { id: 'm3', description: 'Seu amigo ganhou o prêmio que você queria', emotion: 'jealous', image: '/images/emotions/friend_prize.jpg' },
        { id: 'm4', description: 'Você não entendeu a lição da escola', emotion: 'confused', image: '/images/emotions/confusing_lesson.jpg' },
        { id: 'm5', description: 'Você vai fazer uma apresentação na frente da turma', emotion: 'worried', image: '/images/emotions/class_presentation.jpg' }
      ],
      complex: [
        { id: 'c1', description: 'Seu amigo disse que iria ao seu aniversário mas não foi', emotion: 'sad', image: '/images/emotions/missed_birthday.jpg' },
        { id: 'c2', description: 'Você não foi convidado para a festa onde todos estão falando', emotion: 'jealous', image: '/images/emotions/no_invitation.jpg' },
        { id: 'c3', description: 'Você fez um projeto incrível mas ninguém parece notar', emotion: 'disappointed', image: '/images/emotions/unnoticed_project.jpg' },
        { id: 'c4', description: 'Alguém te elogiou na frente de muitas pessoas', emotion: 'shy', image: '/images/emotions/public_praise.jpg' },
        { id: 'c5', description: 'Seu amigo parece triste e você não sabe como ajudar', emotion: 'worried', image: '/images/emotions/sad_friend.jpg' }
      ]
    };

    const selectedScenarios = [...scenarios[settings.contextComplexity]];

    const scenariosWithOptions = selectedScenarios.map(scenario => {
      const correctEmotion = emotions.find(e => e.id === scenario.emotion);
      let options = [correctEmotion];

      while (options.length < 4) {
        const randomEmotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
        if (!options.find(e => e.id === randomEmotion.id)) {
          options.push(randomEmotion);
        }
      }

      options = options.sort(() => Math.random() - 0.5);

      return {
        ...scenario,
        options,
        correctEmotionId: correctEmotion.id
      };
    });

    return scenariosWithOptions;
  };

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
    setTotalAttempts(totalAttempts + 1);
    const isCorrect = emotionId === currentScenario.correctEmotionId;

    if (isCorrect) {
      setScore(score + 1);
      setSoundType('success');
    } else {
      setSoundType('error');
    }

    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 1000);
    setGameState('feedback');

    setTimeout(() => {
      setScenariosCompleted(scenariosCompleted + 1);
      loadNextScenario();
    }, 3000);
  };

  const narrateScenario = () => {
    if (narrationRef.current) {
      narrationRef.current.play = true;
    }
  };

  const handleBackClick = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Jogo de Emoções | Interact Joy</title>
        <meta name="description" content="Aprenda a identificar e entender emoções" />
      </Head>
      {/* ... restante do componente permanece inalterado ... */}
    </>
  );
}
