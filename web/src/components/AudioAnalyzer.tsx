/**
 * 音频分析器组件
 * @module AudioAnalyzer
 */

import React, { useEffect, useRef, useState } from 'react';
import { AnalysisDataSender } from '../audio/analyzers/AnalysisDataSender';
import { audioSocket } from '../ws/audioSocket';

interface AudioAnalyzerProps {
  audioSource: AudioNode;
  audioContext: AudioContext;
}

export const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({
  audioSource,
  audioContext
}) => {
  const analyzerRef = useRef<AnalysisDataSender | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 监听WebSocket连接状态
    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    audioSocket.addEventListener('open', handleOpen);
    audioSocket.addEventListener('close', handleClose);

    // 创建分析器实例
    const analyzer = new AnalysisDataSender(audioContext);
    analyzerRef.current = analyzer;

    // 连接音频源
    analyzer.connectSource(audioSource);
    
    // 开始发送数据
    analyzer.startSending();

    // 清理函数
    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.stopSending();
      }
      audioSocket.removeEventListener('open', handleOpen);
      audioSocket.removeEventListener('close', handleClose);
    };
  }, [audioSource, audioContext]);

  return (
    <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>音频分析状态</h3>
      <p>
        TouchDesigner连接状态：
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? '已连接' : '未连接'}
        </span>
      </p>
      <p>
        提示：请确保TouchDesigner已启动并监听8000端口
      </p>
    </div>
  );
}; 