// src/components/usePlayAudio.js
import { useCallback } from 'react';

export default function usePlayAudio() {
  const speak = useCallback((text, volume = 0.7) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.lang = 'pt-BR';

    // Cancela fala anterior para não sobrepor
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  return speak;
}
