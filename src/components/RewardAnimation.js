// components/RewardAnimation.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente de animação de recompensa que exibe estímulos visuais e auditivos
 * para reforço positivo conforme RF-002
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Controla se a animação deve ser exibida
 * @param {string} props.message - Mensagem motivacional a ser exibida
 * @param {string} props.type - Tipo de recompensa ('confetti', 'stars', 'trophy')
 * @param {Function} props.onComplete - Função chamada quando a animação termina
 */
const RewardAnimation = ({ 
  show = false, 
  message = "Parabéns!", 
  type = "confetti", 
  onComplete = () => {} 
}) => {
  const [audio] = useState(typeof Audio !== 'undefined' ? new Audio('/sounds/success.mp3') : null);
  const [particles, setParticles] = useState([]);

  // Gera partículas aleatórias com base no tipo de animação
  useEffect(() => {
    if (show) {
      // Tocar som de sucesso (RN-001: combinar estímulos visuais e auditivos)
      if (audio) {
        audio.volume = 0.5; // Volume mais baixo para não assustar
        audio.play().catch(err => console.log('Áudio bloqueado pelo navegador:', err));
      }

      // Criar partículas para animação
      const newParticles = [];
      const count = type === 'confetti' ? 50 : type === 'stars' ? 20 : 10;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 5,
          color: getRandomColor(),
        });
      }
      
      setParticles(newParticles);
      
      // Finalizar animação após 3 segundos
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, audio, type, onComplete]);

  // Função auxiliar para gerar cores aleatórias
  const getRandomColor = () => {
    const colors = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#9370DB', '#FF69B4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Renderização condicional da animação
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50" 
          role="alert"
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          
          {/* Partículas de animação */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                initial={{ 
                  x: `${window.innerWidth / 2}px`, 
                  y: `${window.innerHeight / 2}px`,
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: `calc(${particle.x}vw)`,
                  y: `calc(${particle.y}vh)`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5] 
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2, 
                  ease: "easeOut" 
                }}
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                }}
              />
            ))}
          </div>
          
          {/* Mensagem motivacional */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg text-center z-10 max-w-md"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {type === 'trophy' && (
              <div className="text-6xl mb-4" aria-hidden="true">🏆</div>
            )}
            {type === 'stars' && (
              <div className="text-6xl mb-4" aria-hidden="true">⭐</div>
            )}
            
            <h2 className="text-3xl font-bold mb-2 text-blue-600">{message}</h2>
            
            <p className="text-gray-700 mb-4">
              {type === 'confetti' && "Você conseguiu! Continue assim!"}
              {type === 'stars' && "Incrível trabalho! Você está brilhando!"}
              {type === 'trophy' && "Sensacional! Você é campeão!"}
            </p>
            
            <motion.button
              className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              autoFocus
            >
              Continuar
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RewardAnimation;