"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDifficulty, DifficultyProvider } from "@/components/DifficultyManager";
import { Volume2 } from "lucide-react";

// Dados do jogo
const emotionsData = [
  {
    image: "/images/happy.png",
    correct: "Feliz",
    options: ["Triste", "Bravo", "Feliz", "Assustado"],
  },
  {
    image: "/images/sad.png",
    correct: "Triste",
    options: ["Triste", "Animado", "Zangado", "Confuso"],
  },
  {
    image: "/images/angry.png",
    correct: "Bravo",
    options: ["Feliz", "Bravo", "Cansado", "Assustado"],
  },
  {
    image: "/images/tired.png",
    correct: "Cansado",
    options: ["Cansado", "Calmo", "Triste", "Animado"],
  },
];

// Função de leitura por voz
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  speechSynthesis.speak(utterance);
};

function EmotionsGameCore() {
  const { settings, recordPerformance } = useDifficulty();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showContinueOptions, setShowContinueOptions] = useState(false);

  const currentEmotion = emotionsData[currentIndex];

  useEffect(() => {
    if (!gameOver && !showFeedback) {
      speak("Qual é essa emoção?");
    }
  }, [currentIndex, gameOver]);

  const handleSelectEmotion = (selected) => {
    if (showFeedback || gameOver) return;
    const isCorrect = selected === currentEmotion.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedbackText("Correto! Muito bem!");
      speak("Correto! Muito bem!");
    } else {
      const texto = `Ops! Era ${currentEmotion.correct}`;
      setFeedbackText(texto);
      speak(texto);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setShowContinueOptions(true);
    }, 1000);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= emotionsData.length) {
      setGameOver(true);
      recordPerformance("emotions", score, emotionsData.length);
      speak(`Você acertou ${score} de ${emotionsData.length} emoções.`);
    } else {
      setCurrentIndex(nextIndex);
      setShowContinueOptions(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setShowContinueOptions(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-left space-x-4 animate-spin-slow">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={100} height={100} />
        </div>
        <div className="flex-1 text-left">  
          <h1 className="text-3xl flex space-x-1">
            <span className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">'>
              Interact 
            </span>
            <span className='text-lime-400'>
              Joy
            </span>
          </h1>
        </div>
        <button
          onClick={() => speak("Este é o jogo de emoções. Você deve identificar a emoção correta.")}
          className="text-blue-700 hover:text-blue-900"
          aria-label="Ajuda de acessibilidade"
        >
          <Volume2 size={28} />
        </button>
      </header>

      <div className="flex flex-col items-center justify-center text-center mt-8 px-4">
        <h2 className="text-3xl font-bold mb-2 text-blue-900">Identifique a Emoção</h2>
        <p className="text-purple-800 text-6x1 font-bold  mb-6">Jogo: Emoções</p>

        {gameOver ? (
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <p className="text-xl font-semibold mb-2">Parabéns!</p>
            <p className="mb-4">Você acertou {score} de {emotionsData.length} emoções.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
              >
                Jogar novamente
              </button>
              <Link href="/dashboard/usuario" className="text-blue-600 text-base pt-2">
              Voltar
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-4 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <Image
                src={currentEmotion.image}
                alt="Expressão emocional"
                width={200}
                height={200}
                className="rounded"
              />
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-medium text-blue-800 mb-2"
              >
                {feedbackText}
              </motion.div>
            )}

            {!showContinueOptions ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {currentEmotion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectEmotion(option)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl"
                >
                  Próxima emoção
                </button>
                <button
                  onClick={handleRestart}
                  className=" text-3x1 font-bold border border-gray-400 text-blue-800 py-2 px-4 rounded-xl hover:bg-blue-100"
                >
                  Reiniciar
                </button>
                <Link href="/dashboard/usuario" className="text-blue-600 font-bold underline text-base">
                  Voltar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal com provider
export default function EmotionsGamePage() {
  const mockUserId = "usuario_teste_001"; // Substituir por ID real se disponível

  return (
    <DifficultyProvider userId={mockUserId}>
      <EmotionsGameCore />
    </DifficultyProvider>
  );
}
