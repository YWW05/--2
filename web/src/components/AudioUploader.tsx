/**
 * 音频上传和分析组件
 */
import React, { useRef, useState } from 'react';
import { AudioAnalyzer } from './AudioAnalyzer';

export const AudioUploader: React.FC = () => {
  const [audioContext] = useState(() => new AudioContext());
  const [audioSource, setAudioSource] = useState<AudioNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 创建音频元素
    const audioElement = new Audio();
    audioElement.src = URL.createObjectURL(file);
    audioElementRef.current = audioElement;

    // 创建音频源
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(audioContext.destination); // 连接到扬声器
    setAudioSource(source);

    // 自动播放
    audioElement.play();
  };

  return (
    <div className="audio-uploader">
      <input 
        type="file" 
        accept="audio/*" 
        onChange={handleFileUpload}
        style={{ margin: '20px' }}
      />
      
      {audioSource && (
        <div>
          <audio 
            ref={audioElementRef} 
            controls 
            style={{ margin: '20px' }}
          />
          <AudioAnalyzer 
            audioSource={audioSource}
            audioContext={audioContext}
          />
        </div>
      )}
    </div>
  );
}; 