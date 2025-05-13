import { useState, useEffect } from 'react';
import { Star, Award, ChevronRight } from 'lucide-react';
import Image from 'next/image';

/**
 * AchievementBanner Component
 * 
 * Exibe um banner animado quando o usuário desbloqueia uma conquista
 * Implementa RF-002 (reforço positivo) e RN-001 (feedback combinando visual e áudio)
 * Foco em acessibilidade para usuários com TEA
 * 
 * @param {Object} props
 * @param {string} props.title - Título da conquista
 * @param {string} props.description - Descrição da conquista
 * @param {string} props.type - Tipo da conquista (bronze, prata, ouro)
 * @param {boolean} props.show - Se deve mostrar o banner
 * @param {function} props.onClose - Callback quando o banner é fechado
 */
const AchievementBanner = ({ 
  title = "Nova Conquista!",
  description = "Você desbloqueou uma conquista!",
  type = "bronze",
  show = false,
  onClose = () => {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  
  // URLs dos efeitos sonoros para diferentes tipos de conquistas
  const achievementSounds = {
    bronze: '/sounds/achievement-bronze.mp3',
    silver: '/sounds/achievement-silver.mp3',
    gold: '/sounds/achievement-gold.mp3'
  };

  // Esquemas de cores para diferentes tipos de conquistas
  const colorSchemes = {
    bronze: {
      background: 'bg-amber-100',
      border: 'border-amber-500',
      icon: 'text-amber-600',
      text: 'text-amber-900'
    },
    silver: {
      background: 'bg-slate-100',
      border: 'border-slate-400',
      icon: 'text-slate-600',
      text: 'text-slate-800'
    },
    gold: {
      background: 'bg-yellow-100',
      border: 'border-yellow-500',
      icon: 'text-yellow-600',
      text: 'text-yellow-900'
    }
  };

  const colors = colorSchemes[type] || colorSchemes.bronze;

  // Mostrar animação e tocar som quando props.show muda
  useEffect(() => {
    let timer;
    if (show) {
      setIsVisible(true);
      
      // Tocar som de conquista (implementa RN-001)
      if (!audioPlayed) {
        const audio = new Audio(achievementSounds[type]);
        audio.volume = 0.5; // Ajustar volume para não ser muito alto
        audio.play().catch(e => console.log('Erro de áudio:', e));
        setAudioPlayed(true);
      }
      
      // Auto-esconder após 5 segundos
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Aguardar animação de saída
      }, 5000);
    } else {
      setIsVisible(false);
      setAudioPlayed(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, type, audioPlayed, onClose]);

  // Classes de animação
  const animationClasses = isVisible 
    ? 'translate-y-0 opacity-100' 
    : 'translate-y-10 opacity-0';
    
  // Evitar renderizar se não estiver visível
  if (!show && !isVisible) return null;

  return (
    <div 
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 transform ${animationClasses} shadow-lg rounded-lg ${colors.background} ${colors.border} border-2 p-4 max-w-sm flex items-center space-x-3`}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex-shrink-0 ${colors.icon}`}>
        {type === 'gold' ? (
          <Award size={36} aria-hidden="true" />
        ) : (
          <Star size={36} aria-hidden="true" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className={`font-bold text-lg ${colors.text}`} aria-label={`Conquista ${title}`}>
          {title}
        </h3>
        <p className={`text-sm ${colors.text}`}>
          {description}
        </p>
      </div>
      
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className={`flex-shrink-0 ${colors.text} hover:text-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        aria-label="Fechar notificação de conquista"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default AchievementBanner;