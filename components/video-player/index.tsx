import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VideoPlayerProps {
  width?: string | number;
  height?: string | number;
  url: string;
  onProgressUpdate?: (
    data: { progressValue: number } & Record<string, any>
  ) => void;
  progressData?: Record<string, any>;
}

export default function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData = {},
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0); // 0–1
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef<ReactPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = () => setPlaying((p) => !p);

  const handleProgress = (state: { played: number }) => {
    if (!seeking) setPlayed(state.played);
  };

  const seek = (offset: number) => {
    const current = playerRef.current?.getCurrentTime() ?? 0;
    playerRef.current?.seekTo(current + offset);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0] / 100);
    setSeeking(true);
  };

  const handleSeekCommit = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  };

  const handleVolumeChange = (value: number[]) => setVolume(value[0] / 100);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    return hh ? `${hh}:${pad(mm)}:${ss}` : `${mm}:${ss}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullScreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const onChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (played === 1 && onProgressUpdate) {
      onProgressUpdate({ ...progressData, progressValue: played });
    }
  }, [played, onProgressUpdate, progressData]);

  const duration = playerRef.current?.getDuration() ?? 0;

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
        isFullScreen ? "w-screen h-screen" : ""
      }`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800/75 p-4 transition-opacity duration-300">
          {/* Seek Slider */}
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekCommit}
            className="w-full mb-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(-5)}>
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => seek(5)}>
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            <div className="flex items-center space-x-2 text-white">
              <span>
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
              <Button variant="ghost" size="icon" onClick={handleFullScreen}>
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
