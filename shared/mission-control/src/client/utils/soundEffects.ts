let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio playback is not possible
  }
}

export function playAlertSound(): void {
  playTone(880, 0.15, 'sine', 0.3);
  setTimeout(() => {
    playTone(1046.5, 0.15, 'sine', 0.2);
  }, 100);
}

export function playSuccessSound(): void {
  playTone(523.25, 0.1, 'sine', 0.2);
  setTimeout(() => {
    playTone(659.25, 0.1, 'sine', 0.2);
  }, 80);
  setTimeout(() => {
    playTone(783.99, 0.15, 'sine', 0.2);
  }, 160);
}

export function playErrorSound(): void {
  playTone(300, 0.2, 'square', 0.15);
  setTimeout(() => {
    playTone(250, 0.3, 'square', 0.1);
  }, 150);
}

export function playClickSound(): void {
  playTone(1000, 0.05, 'sine', 0.1);
}
