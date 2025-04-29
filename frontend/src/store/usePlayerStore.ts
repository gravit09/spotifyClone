import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: "none" | "one" | "all";

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.5,
  isShuffled: false,
  repeatMode: "none",

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue, repeatMode } = get();
    const nextIndex = currentIndex + 1;

    // Handle repeat modes
    if (repeatMode === "one") {
      const currentSong = get().currentSong;
      if (currentSong) {
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${currentSong.title} by ${currentSong.artist}`,
          });
        }
        set({ isPlaying: true });
        return;
      }
    }

    // if there is a next song to play, let's play it
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else if (repeatMode === "all") {
      // Start from beginning if repeat all is enabled
      const firstSong = queue[0];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
        });
      }
      set({
        currentSong: firstSong,
        currentIndex: 0,
        isPlaying: true,
      });
    } else {
      // no next song
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue, repeatMode } = get();
    const prevIndex = currentIndex - 1;

    // Handle repeat modes
    if (repeatMode === "one") {
      const currentSong = get().currentSong;
      if (currentSong) {
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${currentSong.title} by ${currentSong.artist}`,
          });
        }
        set({ isPlaying: true });
        return;
      }
    }

    // theres a prev song
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else if (repeatMode === "all") {
      // Go to last song if repeat all is enabled
      const lastSong = queue[queue.length - 1];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${lastSong.title} by ${lastSong.artist}`,
        });
      }
      set({
        currentSong: lastSong,
        currentIndex: queue.length - 1,
        isPlaying: true,
      });
    } else {
      // no prev song
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  toggleShuffle: () => {
    const { isShuffled, queue } = get();
    if (!isShuffled) {
      // Shuffle the queue
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [
          shuffledQueue[j],
          shuffledQueue[i],
        ];
      }
      set({ queue: shuffledQueue, isShuffled: true });
    } else {
      // Restore original order
      const originalQueue = [...queue].sort((a, b) =>
        a._id.localeCompare(b._id)
      );
      set({ queue: originalQueue, isShuffled: false });
    }
  },

  toggleRepeat: () => {
    const { repeatMode } = get();
    const nextMode =
      repeatMode === "none" ? "all" : repeatMode === "all" ? "one" : "none";
    set({ repeatMode: nextMode });
  },
}));
