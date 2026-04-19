import { useAppStore } from '../store';

/**
 * Trigger haptic feedback if supported by the device.
 * @param type 'light' | 'heavy' | 'alert'
 */
export const triggerHaptic = (type: 'light' | 'heavy' | 'alert' = 'light') => {
  if (!navigator.vibrate) return;

  switch (type) {
    case 'light':
      navigator.vibrate(50);
      break;
    case 'heavy':
      navigator.vibrate(100);
      break;
    case 'alert':
      navigator.vibrate([100, 50, 100, 50, 200]);
      break;
  }
};

/**
 * Speak an alert message if Voice Guidance is enabled in the global store.
 * @param message The message to speak
 */
export const speakAlert = (message: string) => {
  const { voiceGuidance } = useAppStore.getState();
  
  if (!voiceGuidance || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Prefer English voices if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en-'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
};
