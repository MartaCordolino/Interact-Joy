import { useState, useEffect, useRef } from 'react';

/**
 * Componente React para fornecer feedback auditivo com áudio.
 */
const AudioFeedback = ({
  src,
  play = false,
  volume = 0.7,
  playbackRate = 1,
  onComplete = () => {},
  loop = false,
  type = 'info',
  autoPlay = false
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay || play);
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultSounds = {
    success: '/sounds/success.mp3',
    error: '/sounds/gentle_error.mp3',
    info: '/sounds/info_tone.mp3',
    achievement: '/sounds/achievement.mp3',
    instruction: '/sounds/instruction.mp3'
  };

  const audioSrc = src || defaultSounds[type] || defaultSounds.info;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.loop = loop;

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete();
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay && !isPlaying) playAudio();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [volume, playbackRate, loop, onComplete, autoPlay]);

  useEffect(() => {
    if (play && isLoaded && !isPlaying) {
      playAudio();
    } else if (!play && isPlaying) {
      pauseAudio();
    }
  }, [play, isLoaded]);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Erro ao reproduzir áudio:", error);
          setIsPlaying(false);
        });
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    isPlaying ? pauseAudio() : playAudio();
  };

  return (
    <div className="audio-feedback">
      <audio 
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        aria-live="polite" 
        aria-atomic="true"
      />

      {!autoPlay && (
        <button
          onClick={toggleAudio}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
        >
          <span className="sr-only">{isPlaying ? "Pausar" : "Reproduzir"}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isPlaying ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Utilitário para leitura por voz com Speech Synthesis API.
 * Exemplo: AudioFeedbackSpeak('Parabéns! Você acertou!');
 */
export const AudioFeedbackSpeak = (text) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('speechSynthesis não é suportado neste ambiente.');
    return;
  }

  const synth = window.speechSynthesis;

  if (synth.speaking) {
    synth.cancel(); // Cancela qualquer fala anterior
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  const voices = synth.getVoices();
  const ptVoice = voices.find(voice => voice.lang === 'pt-BR');
  if (ptVoice) utterance.voice = ptVoice;

  synth.speak(utterance);
};

export default AudioFeedback;
