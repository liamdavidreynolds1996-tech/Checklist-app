import { useEffect } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`relative p-3 rounded-xl transition-all border-2 ${
        isListening
          ? 'bg-yellow-400 text-black border-yellow-400 voice-pulse'
          : 'bg-zinc-900 border-zinc-800 hover:border-yellow-400 text-white'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}

      {isListening && transcript && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-zinc-900 border border-yellow-400 rounded-lg text-sm text-white whitespace-nowrap max-w-xs truncate">
          {transcript}
        </div>
      )}
    </button>
  );
}
