'use client';

import { useState } from 'react';
import { AudioFeedbackSpeak } from '@/components/AudioFeedback';
import RewardAnimation from '@/components/RewardAnimation';
import Image from 'next/image';

const emotionsData = [
  {
    image: '/images/happy.png',
    correct: 'Feliz',
    options: ['Triste', 'Bravo', 'Feliz', 'Assustado']
  },
  {
    image: '/images/sad.png',
    correct: 'Triste',
    options: ['Triste', 'Animado', 'Zangado', 'Confuso']
  },
  {
    image: '/images/angry.png',
    correct: 'Bravo',
    options: ['Feliz', 'Bravo', 'Cansado', 'Assustado']
  }
];

export default function EmotionsGameGuest() {
  const [current, setCurrent] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [message, setMessage] = useState('');
  const emotion = emotionsData[current];

  const handleSelect = (choice) => {
    if (choice === emotion.correct) {
      const msg = `Muito bem! Você escolheu: ${choice}`;
      setMessage(msg);
      AudioFeedbackSpeak(msg);
      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
        setCurrent((prev) => (prev + 1) % emotionsData.length);
        setMessage('');
      }, 2500);
    } else {
      const msg = 'Tente novamente!';
      setMessage(msg);
      AudioFeedbackSpeak(msg);
    }
  };

  return (
    <div className="bg-purple-100 p-4 rounded-xl text-center shadow-md">
      <h3 className="text-xl font-bold text-purple-800 mb-2">Jogo das Emoções</h3>
      <Image
        src={emotion.image}
        alt={`Expressão: ${emotion.correct}`}
        width={128} // ← Aqui foram incluídos os valores exigidos
        height={128}
        className="mx-auto mb-4 rounded-full border-4 border-purple-300"
      />
      <div className="flex flex-wrap justify-center gap-4">
        {emotion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-lg"
            aria-label={`Escolher emoção ${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-purple-700 font-semibold">{message}</p>}
      {showReward && <RewardAnimation message="Parabéns!" type="confetti" />}
    </div>
  );
}
