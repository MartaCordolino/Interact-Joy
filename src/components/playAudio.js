// components/playAudio.js
export default function playAudio(src, volume = 0.7) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch((err) => console.error('Erro ao tocar o áudio:', err));
  }
  