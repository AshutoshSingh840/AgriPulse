import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';

interface VoiceInterfaceProps {
  onVoiceCommand: (command: string) => void;
  className?: string;
}

export default function VoiceInterface({ onVoiceCommand, className = '' }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  ];

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      if (transcript) {
        onVoiceCommand(transcript);
        setTranscript('');
      }
    } else {
      setIsListening(true);
      // In a real app, this would start speech recognition
      // For demo purposes, we'll simulate voice input
      setTimeout(() => {
        const demoCommands = [
          'What crops should I plant this season?',
          'How much should I water my tomatoes?',
          'What is the weather forecast for tomorrow?',
          'When should I harvest my corn?',
          'Are there any pest alerts in my area?'
        ];
        const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
        setTranscript(randomCommand);
      }, 2000);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Voice Assistant</h3>
        <div className="flex items-center space-x-2">
          <Languages className="text-gray-500" size={20} />
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <motion.button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-medium transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </motion.button>
        
        <p className="text-sm text-gray-600 mt-2">
          {isListening ? 'Listening...' : 'Tap to speak'}
        </p>
      </div>
      
      {transcript && (
        <motion.div 
          className="bg-gray-50 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">{transcript}</p>
            <motion.button
              onClick={() => speakText(transcript)}
              className="text-blue-500 hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        <p className="text-xs text-gray-500 mb-2">Try saying:</p>
        {[
          'What crops should I plant?',
          'Check weather forecast',
          'Irrigation schedule',
          'Pest alerts'
        ].map((example, index) => (
          <motion.button
            key={index}
            onClick={() => onVoiceCommand(example)}
            className="text-left text-sm text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
            whileHover={{ x: 5 }}
          >
            • {example}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}