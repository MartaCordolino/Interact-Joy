// src/app/games/social/guest/SituacoesSociaisGuest.js
"use client";

import { useState } from "react";
import { AudioFeedbackSpeak } from "@/components/AudioFeedback";
import { motion } from "framer-motion";

const situacoes = [
  {
    pergunta: "Você vê alguém triste no recreio. O que faz?",
    opcoes: ["Ignora", "Conversa com a pessoa", "Corre para longe"],
    correta: "Conversa com a pessoa"
  },
  {
    pergunta: "Você quer brincar com um grupo. O que diz?",
    opcoes: ["Me deixem jogar!", "Posso brincar com vocês?", "Vocês são chatos"],
    correta: "Posso brincar com vocês?"
  }
];

export default function SituacoesSociaisGuest() {
  const [indice, setIndice] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mostrandoFeedback, setMostrandoFeedback] = useState(false);

  const atual = situacoes[indice];

  const verificar = (resposta) => {
    const correta = resposta === atual.correta;
    const mensagem = correta ? "Muito bem!" : "Tente novamente.";
    setFeedback(mensagem);
    AudioFeedbackSpeak(mensagem);
    setMostrandoFeedback(true);

    setTimeout(() => {
      setMostrandoFeedback(false);
      if (correta) setIndice((prev) => (prev + 1) % situacoes.length);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center max-w-xl mx-auto">
      <h3 className="text-2xl text-purple-800 font-bold mb-4">Situações Sociais</h3>
      <p className="mb-4 text-lg">{atual.pergunta}</p>

      <div className="space-y-2">
        {atual.opcoes.map((opcao, idx) => (
          <button
            key={idx}
            onClick={() => verificar(opcao)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {opcao}
          </button>
        ))}
      </div>

      {mostrandoFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg text-green-700"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
}
