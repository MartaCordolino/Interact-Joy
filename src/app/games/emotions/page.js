'use client';

import React, { useEffect, useState } from 'react';
import { DifficultyProvider, useDifficulty } from '@/components/DifficultyManager';
import  {AudioFeedback, AudioFeedbackSpeak} from '@/components/AudioFeedback';
import GuideCharacter from '@/components/GuideCharacter';
import AccessibilityControls from '@/components/AccessibilityControls';
import RewardAnimation from '@/components/RewardAnimation';
import EmotionInstruction from '@/components/EmotionInstruction';

const allEmotions = [
  { id: 1, image: '/images/happy.png', label: 'Feliz' },
  { id: 2, image: '/images/sad.png', label: 'Triste' },
  { id: 3, image: '/images/angry.jpg', label: 'Bravo' },
  { id: 4, image: '/images/surprised.png', label: 'Surpreso' },
  { id: 5, image: '/images/tired.png', label: 'Cansado' },     // Substituição
  { id: 6, image: '/images/fear.png', label: 'Medo' }           // Novo item
];

function EmotionsGameScreen() {
  const { settings, increaseDifficulty, decreaseDifficulty } = useDifficulty();

  const [scenarios, setScenarios] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [expression, setExpression] = useState('neutral');
  const [showReward, setShowReward] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const [firstLoad, setFirstLoad] = useState(true); // novo estado

  const currentLevel = settings.emotions?.level ?? 0;

  useEffect(() => {
    if (firstLoad) {
      AudioFeedbackSpeak('Vamos jogar! Escolha a imagem que representa a emoção correta.');
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const generateScenarios = () => {
    const availableEmotions = [...allEmotions];
    const correctEmotion = availableEmotions.splice(
      Math.floor(Math.random() * availableEmotions.length),
      1
    )[0];

    const numOptions = Math.min(currentLevel + 2, allEmotions.length);
    const distractors = availableEmotions.sort(() => 0.5 - Math.random()).slice(0, numOptions - 1);
    const mixedScenarios = [...distractors, { ...correctEmotion, correct: true }]
      .map(s => ({ ...s, correct: s.correct || false }))
      .sort(() => 0.5 - Math.random());

    setScenarios(mixedScenarios);

    const newInstruction = `Escolha a imagem que representa a emoção "${correctEmotion.label}".`;
    setInstructionText(newInstruction);

    // Só fala instrução se não for a primeira vez (para evitar sobreposição com "Vamos jogar")
    if (!firstLoad) {
      AudioFeedbackSpeak(newInstruction);
    }
  };

  useEffect(() => {
    generateScenarios();
  }, [currentLevel]);

  // ... restante do componente permanece igual ...



  const handleSelectEmotion = (selected) => {
    const isCorrect = selected.correct;

    if (isCorrect) {
      playFeedback('/sounds/correct.mp3');
      setFeedbackMsg('Muito bem!');
      setExpression('happy');
      setShowReward(true);
      increaseDifficulty('emotions');
    } else {
      playFeedback('/sounds/wrong.mp3');
      setFeedbackMsg('Tente novamente!');
      setExpression('sad');
      decreaseDifficulty('emotions');
    }

    setTimeout(() => {
      setFeedbackMsg('');
      setExpression('neutral');
      setShowReward(false);
      generateScenarios(); // Nova rodada
    }, 2000);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <GuideCharacter expression={expression} />
      <EmotionInstruction text={instructionText} />

      <h1 style={{ textAlign: 'center' }}>Jogo das Emoções</h1>
      <p style={{ textAlign: 'center' }}>{instructionText}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1.5rem',
          justifyContent: 'center',
          marginTop: '2rem'
        }}
      >
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelectEmotion(scenario)}
            style={{
              border: '2px solid #ccc',
              borderRadius: '12px',
              padding: '0.5rem',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            aria-label={`Selecionar emoção ${scenario.label}`}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={scenario.image}
              alt={scenario.label}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{scenario.label}</p>
          </button>
        ))}
      </div>

      {feedbackMsg && (
        <p style={{ fontSize: '1.5rem', textAlign: 'center', marginTop: '1.5rem' }}>{feedbackMsg}</p>
      )}
      {showReward && <RewardAnimation />}
      <AccessibilityControls />
    </main>
  );
}

export default function EmotionsGame() {
  return (
    <DifficultyProvider userId="usuario123">
      <EmotionsGameScreen />
    </DifficultyProvider>
  );
}
