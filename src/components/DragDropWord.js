'use client';

import { useState, useRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import React from 'react';

/** COMPONENTE ACESSÍVEL - AccessibleButton */
export const AccessibleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  icon = null,
  label,
  disabled = false,
  fullWidth = false,
  soundEffect = '/sounds/button-click.mp3',
  animateOnHover = true,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef(null);

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
    info: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    danger: 'bg-red-400 hover:bg-red-500 text-white',
  };

  const sizeClasses = {
    sm: 'text-sm py-2 px-3 min-h-10 min-w-16',
    md: 'text-base py-3 px-4 min-h-12 min-w-24',
    lg: 'text-lg py-4 px-6 min-h-14 min-w-32',
    xl: 'text-xl py-5 px-8 min-h-16 min-w-40',
  };

  const handleClick = (e) => {
    if (disabled) return;

    if (audioRef.current && soundEffect) {
      audioRef.current.play().catch(err => {
        console.error('Erro ao reproduzir som de botão:', err);
      });
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);

    if (onClick) onClick(e);
  };

  const focusRingClass = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  const pressedClass = isPressed ? 'transform scale-95 transition-transform' : '';
  const hoverAnimClass = animateOnHover ? 'transition-all duration-200 ease-in-out hover:scale-105' : '';
  const minSizeClass = 'min-h-12 min-w-12';

  return (
    <>
      <button
        className={`
          ${variantClasses[variant] || variantClasses.primary}
          ${sizeClasses[size] || sizeClasses.lg}
          ${focusRingClass}
          ${pressedClass}
          ${hoverAnimClass}
          ${minSizeClass}
          ${fullWidth ? 'w-full' : ''}
          rounded-lg font-medium shadow-md
          flex items-center justify-center gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={handleClick}
        disabled={disabled}
        aria-label={label || (typeof children === 'string' ? children : undefined)}
        role="button"
        {...props}
      >
        {icon && <span className="icon-wrapper">{icon}</span>}
        <span>{children}</span>
      </button>

      {soundEffect && (
        <audio 
          ref={audioRef} 
          src={soundEffect} 
          preload="auto"
          aria-hidden="true"
        />
      )}
    </>
  );
};

/** COMPONENTE DRAGGABLEWORD */
export const DraggableWord = ({ id, word }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white px-4 py-2 rounded shadow font-bold cursor-move text-blue-800"
    >
      {word}
    </div>
  );
};

/** COMPONENTE DROPPABLEAREA */
export const DroppableArea = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    border: isOver ? '2px dashed #3b82f6' : '2px dashed #e5e7eb',
    backgroundColor: isOver ? '#ebf8ff' : '#f9fafb',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-h-[60px] flex flex-wrap gap-2 p-4 rounded mb-6"
    >
      {children}
    </div>
  );
};

// Exporta o botão como default e os outros como named
export default DraggableWord;

