import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    isShuffled,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="font-semibold">{currentSong.title}</h3>
            <p className="text-gray-400">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-2/4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full hover:bg-gray-800 ${
                isShuffled ? "text-green-500" : "text-gray-400"
              }`}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={playPrevious}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white text-black hover:bg-gray-200"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={playNext}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full hover:bg-gray-800 ${
                repeatMode !== "none" ? "text-green-500" : "text-gray-400"
              }`}
            >
              <Repeat size={20} />
              {repeatMode === "one" && (
                <span className="absolute -top-1 -right-1 text-xs">1</span>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <button
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <Slider
            value={[volume * 100]}
            onValueChange={([value]) => setVolume(value / 100)}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.audioUrl} onEnded={playNext} />
    </div>
  );
};
