import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

// Create audio elements function to help with initialization
const createAudio = (src: string, volume = 0.5, loop = false): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  return audio;
};

// Initialize with audio already loaded
const bgMusic = createAudio("/sounds/background.mp3", 0.5, true);
const hitSfx = createAudio("/sounds/hit.mp3", 0.6);
const successSfx = createAudio("/sounds/success.mp3", 0.7);

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: bgMusic,
  hitSound: hitSfx,
  successSound: successSfx,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Handle background music state
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        // Only play if we're in the game
        if (document.querySelector('canvas')) {
          backgroundMusic.play().catch(err => console.log("Couldn't play bg music:", err));
        }
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      try {
        // Clone the sound to allow overlapping playback
        const soundClone = hitSound.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.3;
        soundClone.play().catch(error => {
          console.log("Hit sound play prevented:", error);
        });
      } catch (err) {
        console.log("Error playing hit sound:", err);
      }
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      try {
        successSound.currentTime = 0;
        successSound.play().catch(error => {
          console.log("Success sound play prevented:", error);
        });
      } catch (err) {
        console.log("Error playing success sound:", err);
      }
    }
  }
}));
