// components/AccessibilityControls.js
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
  
  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings to document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.classList.toggle('reduced-motion', settings.animationReduced);
    
    // Set volume for audio elements
    const volumeLevel = settings.volume / 100;
    document.querySelectorAll('audio').forEach(audio => {
      audio.volume = volumeLevel;
    });
  }, [settings]);
  
  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  const handleVolumeChange = (e) => {
    setSettings({
      ...settings,
      volume: parseInt(e.target.value)
    });
  };
  
  return (
    <div className="fixed right-4 top-4 z-50">
      {/* Accessibility button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full p-3 shadow-lg"
        aria-label="Configurações de acessibilidade"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" fill="currentColor"/>
          <path d="M12 6a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H7a1 1 0 110-2h4V7a1 1 0 011-1z" fill="currentColor"/>
        </svg>
      </button>
      
      {/* Settings panel */}
      {isOpen && (
        <div className="absolute right-0 top-14 bg-white rounded-lg shadow-xl p-4 w-64 border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-blue-800">Acessibilidade</h3>
          
          <div className="space-y-4">
            {/* High contrast */}
            <div className="flex items-center justify-between">
              <label htmlFor="highContrast" className="text-gray-700">
                Alto contraste
              </label>
              <button 
                id="highContrast"
                onClick={() => toggleSetting('highContrast')}
                className={`w-12 h-6 rounded-full ${settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200`}
              >
                <span 
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}`}
                  style={{top: '2px'}}
                />
              </button>
            </div>
            
            {/* Large text */}
            <div className="flex items-center justify-between">
              <label htmlFor="largeText" className="text-gray-700">
                Texto grande
              </label>
              <button 
                id="largeText"
                onClick={() => toggleSetting('largeText')}
                className={`w-12 h-6 rounded-full ${settings.largeText ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200`}
              >
                <span 
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${settings.largeText ? 'translate-x-6' : 'translate-x-1'}`}
                  style={{top: '2px'}}
                />
              </button>
            </div>
            
            {/* Text narration */}
            <div className="flex items-center justify-between">
              <label htmlFor="narration" className="text-gray-700">
                Narração de texto
              </label>
              <button 
                id="narration"
                onClick={() => toggleSetting('narration')}
                className={`w-12 h-6 rounded-full ${settings.narration ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200`}
              >
                <span 
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${settings.narration ? 'translate-x-6' : 'translate-x-1'}`}
                  style={{top: '2px'}}
                />
              </button>
            </div>
            
            {/* Reduced animation */}
            <div className="flex items-center justify-between">
              <label htmlFor="animationReduced" className="text-gray-700">
                Reduzir animações
              </label>
              <button 
                id="animationReduced"
                onClick={() => toggleSetting('animationReduced')}
                className={`w-12 h-6 rounded-full ${settings.animationReduced ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors duration-200`}
              >
                <span 
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${settings.animationReduced ? 'translate-x-6' : 'translate-x-1'}`}
                  style={{top: '2px'}}
                />
              </button>
            </div>
            
            {/* Volume control */}
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