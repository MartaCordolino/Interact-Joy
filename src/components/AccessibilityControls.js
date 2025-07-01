// components/AccessibilityControls.js
'use client';

import { useState, useEffect } from 'react';

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    narration: true,
    animationReduced: false,
    volume: 80
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.classList.toggle('reduced-motion', settings.animationReduced);

    const volumeLevel = settings.volume / 100;
    document.querySelectorAll('audio').forEach(audio => {
      audio.volume = volumeLevel;
    });
  }, [settings]);

  const toggleSetting = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleVolumeChange = (e) => {
    setSettings({ ...settings, volume: parseInt(e.target.value) });
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      {/* Botão de acessibilidade com cursor-pointer */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full p-3 shadow-lg cursor-pointer"
        aria-label="Abrir configurações de acessibilidade"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" fill="currentColor"/>
          <path d="M12 6a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H7a1 1 0 110-2h4V7a1 1 0 011-1z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 bg-white rounded-lg shadow-xl p-4 w-64 border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-blue-800">Acessibilidade</h3>

          <div className="space-y-4">
            {/* Configurações de acessibilidade */}
            {[
              { id: 'highContrast', label: 'Alto contraste' },
              { id: 'largeText', label: 'Texto grande' },
              { id: 'narration', label: 'Narração de texto' },
              { id: 'animationReduced', label: 'Reduzir animações' }
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between">
                <label htmlFor={id} className="text-gray-700">{label}</label>
                <button
                  id={id}
                  onClick={() => toggleSetting(id)}
                  className={`w-12 h-6 rounded-full ${settings[id] ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200 cursor-pointer`}
                >
                  <span
                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${settings[id] ? 'translate-x-6' : 'translate-x-1'}`}
                    style={{ top: '2px' }}
                  />
                </button>
              </div>
            ))}

            {/* Volume */}
            <div>
              <label htmlFor="volume" className="block text-gray-700 mb-1">
                Volume: {settings.volume}%
              </label>
              <input
                type="range"
                id="volume"
                min="0"
                max="100"
                value={settings.volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
