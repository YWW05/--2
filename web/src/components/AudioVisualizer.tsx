import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  frequencyData: Uint8Array | null;
  frequencyBands: { low: number; mid: number; high: number } | null;
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
    const barSpacing = 1;
    const maxBarHeight = canvas.height * 0.8;

    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    frequencyData.forEach((value, index) => {
      const percent = value / 256;
      const barHeight = percent * maxBarHeight;
      const x = index * (barWidth + barSpacing);
      const y = canvas.height - barHeight;

      // 创建渐变色
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)');
      ctx.fillStyle = gradient;

      ctx.fillRect(x, y, barWidth, barHeight);
    });

    // 绘制频段指示器
    if (frequencyBands) {
      const bands = [
        { value: frequencyBands.low, color: 'rgba(255, 0, 85, 0.2)' },
        { value: frequencyBands.mid, color: 'rgba(0, 255, 153, 0.2)' },
        { value: frequencyBands.high, color: 'rgba(0, 153, 255, 0.2)' }
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
      className="visualizer-background"
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export default AudioVisualizer; 