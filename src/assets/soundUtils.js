// Sound utility for generating a bell sound using Web Audio API
let audioContext = null;

export function playBellSound() {
  try {
    // Only create AudioContext when needed (after user interaction)
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set parameters
    oscillator.type = 'sine';
    oscillator.frequency.value = 830;
    gainNode.gain.value = 0.5;
    
    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    // Start and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
    return Promise.resolve(); // Return resolved promise even if sound fails
  }
}
