// components/GameCard.js
import { useState } from 'react';
import Image from 'next/image';
import { Play, Lock, Sparkles } from 'lucide-react';

const GameCard = ({
  title = 'Jogo sem título',
  description = 'Descrição indisponível',
  imageUrl = '/images/game-placeholder.png',
  difficulty = 'easy',
  targetSkill = 'comunicação',
  locked = false,
  completionRate = 0,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const difficultyMap = {
    easy: {
      color: 'bg-green-200',
      textColor: 'text-green-800',
      label: 'Fácil'
    },
    medium: {
      color: 'bg-yellow-200',
      textColor: 'text-yellow-800',
      label: 'Médio'
    },
    hard: {
      color: 'bg-red-200',
      textColor: 'text-red-800',
      label: 'Difícil'
    }
  };

  const skillMap = {
    comunicação: {
      color: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    'habilidades sociais': {
      color: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    'regulação emocional': {
      color: 'bg-pink-100',
      textColor: 'text-pink-700'
    },
    'desenvolvimento cognitivo': {
      color: 'bg-teal-100',
      textColor: 'text-teal-700'
    },
    concentração: {
      color: 'bg-indigo-100',
      textColor: 'text-indigo-700'
    }
  };

  const difficultyStyle = difficultyMap[difficulty] || difficultyMap.easy;
  const skillStyle = skillMap[targetSkill.toLowerCase()] || skillMap.comunicação;

  const isHighlighted = isHovered || isFocused;
  const transformClass = !locked && isHighlighted ? 'scale-105' : 'scale-100';

  const handleLockedClick = () => {
    const audio = new Audio('/audio/gentle-error.mp3');
    audio.play();
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg shadow-md transition-transform duration-200 ${transformClass} ${locked ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      data-testid={`game-card-${title?.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div
        onClick={locked ? handleLockedClick : onClick}
        onKeyDown={(e) => {
          if (!locked && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick && onClick();
          }
        }}
        className={`h-full group cursor-pointer bg-white rounded-lg border-2 ${locked ? 'border-gray-300' : isHighlighted ? 'border-blue-500' : 'border-blue-300'}`}
        role="button"
        tabIndex={locked ? -1 : 0}
        aria-disabled={locked}
        aria-label={`${locked ? 'Jogo bloqueado: ' : ''}${title}, ${difficultyStyle.label}, foco em ${targetSkill}`}
        title={locked ? 'Jogo bloqueado' : `Jogar ${title}`}
        aria-describedby={`desc-${title?.toLowerCase().replace(/\s/g, '-')}`}
      >
        {/* Imagem do Jogo */}
        <div className="relative h-32 overflow-hidden">
          <div className="w-full h-full relative">
            <Image
              src={imageUrl}
              alt={`Ilustração do jogo ${title || 'indefinido'}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          {/* Selo de dificuldade */}
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyStyle.color} ${difficultyStyle.textColor}`}
            aria-hidden="true"
          >
            {difficultyStyle.label}
          </div>

          {/* Barra de progresso */}
          {!locked && completionRate > 0 && (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200"
                role="progressbar"
                aria-valuenow={completionRate}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${completionRate}% completo`}
              >
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <span className="absolute bottom-2 right-2 text-xs bg-white bg-opacity-80 px-2 py-0.5 rounded shadow">
                {completionRate}% concluído
              </span>
            </>
          )}

          {/* Selo 100% concluído */}
          {!locked && completionRate === 100 && (
            <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
              <Sparkles size={14} /> 100%
            </div>
          )}

          {/* Sobreposição de bloqueio com imagem visível */}
          {locked && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center backdrop-brightness-50"
              title="Complete o jogo anterior para desbloquear"
            >
              <Lock size={32} className="text-white drop-shadow" />
              <p className="text-white font-bold mt-2 drop-shadow" aria-hidden="true">Bloqueado</p>
              <span className="sr-only">Jogo bloqueado</span>
            </div>
          )}
        </div>

        {/* Informações do jogo */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p id={`desc-${title?.toLowerCase().replace(/\s/g, '-')}`} className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

          {/* Tag da habilidade */}
          <div className="flex items-center mt-3">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs ${skillStyle.color} ${skillStyle.textColor}`}
            >
              {targetSkill}
            </span>
          </div>

          {/* Botão Jogar */}
          <div className={`mt-3 flex justify-end ${locked ? 'opacity-50' : ''}`}>
            <button
              disabled={locked}
              aria-disabled={locked}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full ${locked ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'}`}
              title={locked ? 'Jogo bloqueado' : `Jogar ${title}`}
            >
              <span className="text-sm">Jogar</span>
              <Play size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
