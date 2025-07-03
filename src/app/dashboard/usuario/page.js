"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AccessibilityControls from "@/components/AccessibilityControls";
import GameCard from "@/components/GameCard";
import GuideCharacter from "@/components/GuideCharacter";
import AchievementBanner from "@/components/AchievementBanner";
import gameConfig from "@/config/game_config.json";

export default function UsuarioDashboard() {
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchAndProcessGames = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();

        let crianca;
        if (userData.perfil === "autista") {
          crianca = {
            id: userData.criancaId || userData.id,
            nome: userData.nome,
            idade: userData.idade,
            faixa_etaria: userData.faixa_etaria,
            nivel_suporte: userData.nivel_suporte,
          };
        } else {
          crianca = userData.criancas?.[0];
        }

        if (!crianca) return;

        setUserName(crianca.nome);
        const criancaId = crianca.id;

        const faixaEtariaFormatada = crianca.faixa_etaria === "faixa_10_12" ? "10-12" : "7-9";

        const progressoRes = await fetch(`/api/progresso/${criancaId}`);
        const progressoData = await progressoRes.json();
        const progressoPorJogo = {};
        progressoData.forEach((p) => {
          if (p.jogo && p.jogo.url_path !== undefined) {
            progressoPorJogo[p.jogo.url_path] = p.porcentagem;
          }
        });

        const conquistasRes = await fetch(`/api/conquistas/${criancaId}`);
        const conquistasData = await conquistasRes.json();

        if (conquistasData.length > 0) {
          const ultimaConquista = conquistasData[0];
          setTimeout(() => {
            setAchievementData({
              title: ultimaConquista.titulo || "Nova Conquista!",
              description: ultimaConquista.descricao,
              icon:
                ultimaConquista.tipo === "trofeu"
                  ? "/images/achievements/trophy.svg"
                  : "/images/achievements/medal.svg",
            });
            setShowAchievement(true);
          }, 1000);
        }

        const jogosPermitidos = gameConfig?.[faixaEtariaFormatada]?.[crianca.nivel_suporte] || [];

        const predefinedGames = {
          emotions: {
            id: "emotions",
            title: "Meu Sentimento",
            imageUrl: "/images/games/emotions.png",
            description: "Identifique emoções em diferentes situações",
            category: "Regulação Emocional",
            difficulty: "easy",
          },
          communication: {
            id: "communication",
            title: "Forme Palavras",
            imageUrl: "/images/games/communication.png",
            description: "Aprenda a formar frases arrastando palavras",
            category: "Comunicação",
            difficulty: "medium",
          },
          social: {
            id: "social",
            title: "Amigos na Escola",
            imageUrl: "/images/games/social.svg",
            description: "Aprenda interações sociais em diferentes situações",
            category: "Habilidades Sociais",
            difficulty: "medium",
          },
          colors: {
            id: "colors",
            title: "Mundo das Cores",
            imageUrl: "/images/games/colors.svg",
            description: "Combine cores e formas",
            category: "Desenvolvimento Cognitivo",
            difficulty: "hard",
          },
          sequence: {
            id: "sequence",
            title: "Sequência Divertida",
            imageUrl: "/images/games/sequence.svg",
            description: "Complete a sequência de imagens",
            category: "Concentração",
            difficulty: "medium",
          },
          puzzle: {
            id: "puzzle",
            title: "Quebra-cabeça",
            imageUrl: "/images/games/puzzle.svg",
            description: "Monte imagens divertidas",
            category: "Habilidades Motoras",
            difficulty: "medium",
          },
        };

        let desbloqueioAtivo = true;
        const jogosComStatus = jogosPermitidos.map((jogoPermitido) => {
          const jogoBase = predefinedGames[jogoPermitido.id];
          const progresso = progressoPorJogo[jogoPermitido.id] || 0;
          const unlocked = desbloqueioAtivo;

          if (progresso < 100) {
            desbloqueioAtivo = false;
          }

          return {
            ...jogoBase,
            id: jogoPermitido.id,
            unlocked,
            completionRate: progresso,
          };
        });

        setGames(jogosComStatus);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchAndProcessGames();
  }, []);

  const handleGameSelect = (gameId) => {
    const selectedGame = games.find((g) => g.id === gameId);
    if (selectedGame?.unlocked) {
      router.push(`/games/${gameId}`);
    } else {
      playAudio("gentle-error.mp3");
      showHelpMessage("Complete os jogos anteriores para desbloquear este jogo.");
    }
  };

  const playAudio = (file) => {
    const audio = new Audio(`/audio/${file}`);
    audio.volume = 0.7;
    audio.play();
  };

  const showHelpMessage = (message) => {
    const helpBox = document.createElement("div");
    helpBox.textContent = message;
    helpBox.setAttribute("role", "alert");
    helpBox.className =
      "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-lg text-lg font-medium";
    document.body.appendChild(helpBox);
    setTimeout(() => helpBox.remove(), 4000);
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-800 relative">
      <Head>
        <title>Dashboard - Interact Joy</title>
        <meta name="description" content="Área de jogos para usuários do Interact Joy" />
      </Head>

      <div className="absolute top-4 right-4 z-50">
        <AccessibilityControls />
      </div>

      <header className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-left space-x-4 animate-spin-slow">
          <Image src="/images/Logo_Interact_Joy.png" alt="Logo" width={128} height={128} />
        </div>
        <div className="flex-1 text-left">
          <h1 className="text-4xl flex space-x-1">
            <span className="bg-gradient-to-r from-blue-900 to-purple-500 bg-clip-text text-transparent">
              Interact
            </span>
            <span className="text-lime-400">Joy</span>
          </h1>
        </div>
        <div className="text-yellow-100 text-xl font-semibold pr-12">Vamos Brincar!</div>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">Meus Jogos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              difficulty={game.difficulty}
              targetSkill={game.category}
              locked={!game.unlocked}
              completionRate={game.completionRate}
              onClick={() => handleGameSelect(game.id)}
            />
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 flex justify-around p-2 z-40">
        <Link href="/" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/back.png" alt="Início" width={32} height={32} />
          <span className="text-sm">Voltar</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-blue-700 font-semibold">
          <Image src="/images/icons/games.png" alt="Jogos" width={32} height={32} />
          <span className="text-sm">Jogos</span>
        </Link>
        <Link href="/achievements" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/trophy.png" alt="Conquistas" width={32} height={32} />
          <span className="text-sm">Conquistas</span>
        </Link>
        <Link href="/parent-dashboard" className="flex flex-col items-center hover:text-blue-600">
          <Image src="/images/icons/report.png" alt="Relatórios" width={32} height={32} />
          <span className="text-sm">Relatórios</span>
        </Link>
      </nav>

      {showAchievement && (
        <AchievementBanner
          achievement={achievementData}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}
