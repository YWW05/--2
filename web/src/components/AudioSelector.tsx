import React, { useState, useCallback } from 'react';
import './AudioSelector.css';
import AudioPlayer from './AudioPlayer';
import AudioVisualizer from './AudioVisualizer';

const AudioSelector: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [visualizationData, setVisualizationData] = useState<Uint8Array | null>(null);
  const [frequencyBands, setFrequencyBands] = useState<{ low: number; mid: number; high: number } | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleAudioFile(files[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAudioFile = (file: File) => {
    if (file.type.startsWith('audio/')) {
      setSelectedFile(file);
    } else {
      alert('请选择音频文件');
    }
  };

  const handleVisualizationData = useCallback((data: Uint8Array) => {
    setVisualizationData(data);
  }, []);

  const handleFrequencyBands = useCallback((bands: { low: number; mid: number; high: number }) => {
    setFrequencyBands(bands);
  }, []);

  const handleClose = () => {
    setSelectedFile(null);
  };

  return (
    <div className="audio-selector">
      {!selectedFile ? (
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3m0 0L8 7m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
            </svg>
          </div>
          <h2>选择您的音乐</h2>
          <p>从我们的收藏中选择或使用您自己的音乐来创作令人惊叹的东西</p>
          <div className="buttons">
            <label className="upload-button">
              使用您自己的音乐
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <button className="library-button">
              从我们的系统中选择
            </button>
          </div>
        </div>
      ) : (
        <div className="player-container">
          <AudioPlayer
            file={selectedFile}
            onVisualizationData={handleVisualizationData}
            onFrequencyBands={handleFrequencyBands}
            onClose={handleClose}
          />
          <div className="visualizer-container">
            <AudioVisualizer
              frequencyData={visualizationData}
              frequencyBands={frequencyBands}
            />
          </div>
          <button
            className="back-button"
            onClick={() => setSelectedFile(null)}
          >
            选择其他音乐
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioSelector; 