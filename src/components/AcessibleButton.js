import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * AccessibleButton - Um botão acessível que atende aos requisitos RNF-001 e RNF-002 do Interact Joy
 * 
 * Características:
 * - Área de toque mínima de 48x48px (RNF-002)
 * - Suporte para leitores de tela com aria-labels (RNF-001)
 * - Alto contraste e configurações de cor adaptáveis
 * - Feedback visual e auditivo (conforme RN-001)
 * - Animações suaves com fallback para preferências reduzidas de movimento
 */
const AccessibleButton = forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  ariaLabel,
  soundEffect = null,
  withHapticFeedback = false,
  ...props
}, ref) => {
  // Mapeamento de variantes para classes do Tailwind
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300',
    info: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-300',
  };

  // Mapeamento de tamanhos para classes do Tailwind (garantindo área mínima de 48x48px)
  const sizeClasses = {
    sm: 'min-h-12 min-w-12 px-3 py-2 text-sm',
    md: 'min-h-12 min-w-12 px-4 py-2 text-base',
    lg: 'min-h-14 min-w-14 px-6 py-3 text-lg',
    xl: 'min-h-16 min-w-16 px-8 py-4 text-xl',
  };

  // Classes base para todos os botões
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Classe para botão desabilitado
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Classe para largura total
  const widthClass = fullWidth ? 'w-full' : '';

  // Construindo a classe final
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`;

  // Efeito de som ao clicar
  const playSoundEffect = () => {
    if (soundEffect && !disabled) {
      const audio = new Audio(soundEffect);
      audio.play().catch(err => console.error('Erro ao reproduzir som:', err));
    }
  };

  // Feedback háptico para dispositivos móveis
  const triggerHapticFeedback = () => {
    if (withHapticFeedback && !disabled && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Vibração de 50ms
    }
  };

  // Manipulador de clique combinado
  const handleClick = (e) => {
    if (disabled) return;
    
    playSoundEffect();
    triggerHapticFeedback();
    
    if (onClick) {
      onClick(e);
    }
  };

  // Variantes de animação para framer-motion
  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span className={`inline-flex items-center justify-center ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
        {icon}
      </span>
    );
  };

  // Detecta se usuários preferem movimento reduzido
  const prefersReducedMotion = typeof window !== 'undefined' ? 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      whileTap={!prefersReducedMotion && !disabled ? { scale: 0.95 } : {}}
      whileHover={!prefersReducedMotion && !disabled ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-disabled={disabled}
      role="button"
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

AccessibleButton.propTypes = {
  /** Conteúdo do botão */
  children: PropTypes.node.isRequired,
  /** Classes CSS adicionais */
  className: PropTypes.string,
  /** Variante visual do botão */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  /** Tamanho do botão */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  /** Estado desabilitado */
  disabled: PropTypes.bool,
  /** Ocupar largura total do container */
  fullWidth: PropTypes.bool,
  /** Ícone opcional */
  icon: PropTypes.node,
  /** Posição do ícone */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** Função de callback ao clicar */
  onClick: PropTypes.func,
  /** Descrição acessível para leitores de tela */
  ariaLabel: PropTypes.string,
  /** URL para efeito sonoro ao clicar */
  soundEffect: PropTypes.string,
  /** Ativar feedback háptico */
  withHapticFeedback: PropTypes.bool,
};

export default AccessibleButton;