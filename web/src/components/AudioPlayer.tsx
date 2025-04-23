import React, { useEffect, useRef, useState } from 'react';
import { AudioAnalyzer } from '../utils/AudioAnalyzer';
import AudioVisualizer from './AudioVisualizer';
import './AudioPlayer.css';

interface AudioPlayerProps {
  file: File;
  onVisualizationData?: (data: Uint8Array) => void;
  onFrequencyBands?: (bands: { low: number; mid: number; high: number }) => void;
  onClose?: () => void;
}

/**
 * 音频播放器组件
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ file, onVisualizationData, onFrequencyBands, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localFrequencyData, setLocalFrequencyData] = useState<Uint8Array | null>(null);
  const [localFrequencyBands, setLocalFrequencyBands] = useState<{ low: number; mid: number; high: number } | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const analyzer = new AudioAnalyzer();
    analyzerRef.current = analyzer;
    
    analyzer.loadAudio(file).then(() => {
      console.log('音频加载完成');
      setDuration(analyzer.getDuration());
    }).catch(error => {
      console.error('音频加载失败:', error);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      analyzer.dispose();
    };
  }, [file]);

  const togglePlayback = () => {
    if (!analyzerRef.current) return;

    if (isPlaying) {
      analyzerRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      analyzerRef.current.play();
      updateVisualization();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (analyzerRef.current) {
      analyzerRef.current.setVolume(newVolume);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !analyzerRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    
    analyzerRef.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleProgressDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleProgressDragEnd = () => {
    setIsDragging(false);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !analyzerRef.current || !isDragging) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    analyzerRef.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const updateVisualization = () => {
    if (!analyzerRef.current) return;

    if (isPlaying) {
      const currentPlayTime = analyzerRef.current.getCurrentTime();
      setCurrentTime(Math.min(currentPlayTime, duration));
    }

    const frequencyData = analyzerRef.current.getFrequencyData();
    setLocalFrequencyData(frequencyData);
    if (onVisualizationData) {
      onVisualizationData(frequencyData);
    }

    const bands = analyzerRef.current.getFrequencyBands();
    setLocalFrequencyBands(bands);
    if (onFrequencyBands) {
      onFrequencyBands(bands);
    }

    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  useEffect(() => {
    if (isPlaying) {
      updateVisualization();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (isPlaying) {
      analyzerRef.current?.stop();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="audio-player">
      <AudioVisualizer
        frequencyData={localFrequencyData}
        frequencyBands={localFrequencyBands}
      />
      
      <div className="player-header">
        <div className="song-info">
          <span className="song-name">{file.name}</span>
        </div>
        <button className="close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="play-pause-btn" onClick={togglePlayback}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </div>
      
      <div 
        className="progress-bar" 
        ref={progressRef}
        onClick={handleProgressClick}
        onMouseDown={handleProgressDragStart}
        onMouseUp={handleProgressDragEnd}
        onMouseLeave={handleProgressDragEnd}
        onMouseMove={handleProgressDrag}
      >
        <div className="progress" style={{ width: `${Math.min((currentTime / duration) * 100, 100)}%` }}>
          <div className="progress-handle"></div>
        </div>
      </div>
      
      <div className="time-info">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="volume-control">
        <div className="volume-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
        </div>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer; 