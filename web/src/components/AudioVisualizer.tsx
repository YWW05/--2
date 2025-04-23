import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  frequencyData?: Uint8Array;
  frequencyBands?: {
    low: number;
    mid: number;
    high: number;
  };
}

/**
 * 音频可视化组件
 */
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ frequencyData, frequencyBands }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frequencyData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制频谱
    const barWidth = (canvas.width / frequencyData.length) * 2;
    const barSpacing = 2;
    const maxBarHeight = canvas.height * 0.8;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    frequencyData.forEach((value, index) => {
      const percent = value / 256;
      const barHeight = percent * maxBarHeight;
      const x = index * (barWidth + barSpacing);
      const y = canvas.height - barHeight;

      ctx.fillRect(x, y, barWidth, barHeight);
    });

    // 绘制频段指示器
    if (frequencyBands) {
      const bands = [
        { value: frequencyBands.low, color: '#ff0055' },
        { value: frequencyBands.mid, color: '#00ff99' },
        { value: frequencyBands.high, color: '#0099ff' }
      ];

      const indicatorWidth = canvas.width / 6;
      const spacing = canvas.width / 12;
      
      bands.forEach((band, index) => {
        const x = spacing + (indicatorWidth + spacing) * index;
        const height = band.value * maxBarHeight;
        const y = canvas.height - height;

        ctx.fillStyle = band.color;
        ctx.fillRect(x, y, indicatorWidth, height);
      });
    }
  }, [frequencyData, frequencyBands]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px'
      }}
    />
  );
};

export default AudioVisualizer; 