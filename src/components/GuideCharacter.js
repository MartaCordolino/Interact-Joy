import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Volume2, VolumeX } from 'lucide-react';

/**
 * GuideCharacter Component
 * 
 * Um personagem guia amigável que fornece instruções e suporte
 * Implementa RF-002 (reforço positivo) e RF-003 (estímulos auditivos e visuais)
 * Projetado com acessibilidade para pessoas com TEA
 * 
 * @param {Object} props
 * @param {string} props.message - Mensagem de texto para exibir no balão de fala
 * @param {string} props.characterType - Tipo de personagem (default, teacher, friend, helper)
 * @param {string} props.audioUrl - URL para arquivo de áudio para narração da mensagem
 * @param {string} props.emotion - Emoção/estado do personagem (happy, thinking, excited, neutral)
 * @param {boolean} props.show - Se deve mostrar o personagem
 * @param {function} props.onClose - Callback quando o personagem é dispensado
 * @param {boolean} props.autoHide - Se deve auto-esconder após um atraso
 * @param {number} props.autoHideDelay - Atraso em ms antes do auto-esconder
 * @param {string} props.position - Posição na tela (bottomLeft, bottomRight, topLeft, topRight)
 */
const GuideCharacter = ({
  message = "Olá! Estou aqui para te ajudar!",
  characterType = "default",
  audioUrl,
  emotion = "happy",
  show = true,
  onClose = () => {},
  autoHide = false,
  autoHideDelay = 8000,
  position = "bottomLeft"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef(null);
  
  // Mapear tipos de personagens para imagens-base
  const characterImages = {
    default: "/images/guide-default",
    teacher: "/images/guide-teacher",
    friend: "/images/guide-friend",
    helper: "/images/guide-helper"
  };
  
  const baseImagePath = characterImages[characterType] || characterImages.default;
  
  // Mapear emoções para sufixos de imagem
  const emotionSuffixes = {
    happy: "-happy.png",
    thinking: "-thinking.png",
    excited: "-excited.png",
    neutral: ".png"
  };
  
  // Construir caminho da imagem
  const imagePath = `${baseImagePath}${emotionSuffixes[emotion] || emotionSuffixes.neutral}`;
  
  // Classes de animação para diferentes emoções
  const emotionAnimations = {
    happy: "animate-bounce-gentle",
    thinking: "animate-pulse",
    excited: "animate-wiggle",
    neutral: ""
  };
  
  // Classes de posição
  const positionClasses = {
    bottomLeft: "bottom-5 left-5",
    bottomRight: "bottom-5 right-5",
    topLeft: "top-5 left-5",
    topRight: "top-5 right-5"
  };
  
  const positionClass = positionClasses[position] || positionClasses.bottomLeft;

  // Configurar visibilidade e auto-esconder
  useEffect(() => {
    let timer;
    if (show) {
      setIsVisible(true);
      
      if (autoHide) {
        timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 500);
        }, autoHideDelay);
      }
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, autoHide, autoHideDelay, onClose]);

  // Manipular reprodução de áudio
  useEffect(() => {
    if (audioUrl && audioEnabled && isVisible) {
      // Criar elemento de áudio se ainda não existir
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
          console.error("Falha ao carregar áudio");
          setIsSpeaking(false);
        };
      }
      
      // Reproduzir áudio
      audioRef.current.play().catch(e => {
        console.error("Reprodução de áudio impedida:", e);
        setIsSpeaking(false);
      });
    }
    
    // Limpar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, audioEnabled, isVisible]);

  // Alternar narração de áudio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
        setIsSpeaking(false);
      } else {
        audioRef.current.play().catch(e => console.error("Reprodução de áudio impedida:", e));
      }
    }
    
    setAudioEnabled(!audioEnabled);
  };

  // Classes de animação
  const containerAnimation = isVisible 
    ? 'translate-y-0 opacity-100' 
    : position.startsWith('bottom') ? 'translate-y-20 opacity-0' : 'translate-y-(-20) opacity-0';
    
  const characterAnimation = emotionAnimations[emotion] || "";
  
  // Não renderiza nada se não estiver visível
  if (!show && !isVisible) return null;

  return (
    <div 
      className={`fixed ${positionClass} z-40 transition-all duration-500 transform ${containerAnimation}`}
      aria-hidden={!isVisible}
    >
      {isVisible && (
        <div className="flex items-end">
          {/* Character Image */}
          <div className={`relative flex-shrink-0 ${characterAnimation}`}>
            <div className="h-32 w-32 relative">
              <Image 
                src={imagePath}
                alt={`Personagem guia com expressão ${emotion}`}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
            
            {/* Speaking Animation */}
            {isSpeaking && (
              <div className="absolute -right-1 top-8 flex space-x-1">
                <div className="bg-blue-500 h-2 w-2 rounded-full animate-pulse"></div>
                <div className="bg-blue-500 h-3 w-2 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="bg-blue-500 h-4 w-2 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
          
          {/* Speech Bubble */}
          <div className="relative mx-2 bg-white rounded-lg p-4 shadow-lg max-w-xs border-2 border-blue-300">
            {/* Close Button */}
            <button 
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsVisible(false);
                setTimeout(() => onClose(), 500);
              }}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              aria-label="Fechar assistente"
            >
              <X size={16} />
            </button>
            
            {/* Audio Toggle Button */}
            {audioUrl && (
              <button 
                onClick={toggleAudio}
                className="absolute top-1 right-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label={audioEnabled ? "Desativar narração" : "Ativar narração"}
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            )}
            
            {/* Message Text */}
            <p 
              className="text-sm text-gray-800 pt-2 pr-12"
              // Usar role="status" para que leitores de tela anunciem mudanças de mensagem
              role="status"
            >
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideCharacter;