import React, { useEffect, useRef } from 'react';
import './WaveBackground.css';

const WaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸为窗口大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 粒子系统
    const particles: Particle[] = [];
    const particleCount = 100;

    class Particle {
      x: number;
      y: number;
      speed: number;
      angle: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 0.5 + Math.random() * 1;
        this.angle = Math.random() * Math.PI * 2;
        this.size = 1 + Math.random() * 3;
        this.color = `rgba(${Math.random() * 255}, ${100 + Math.random() * 155}, 0, 0.6)`;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 声波圆环参数
    let waveRadius = 200;
    let waveAngle = 0;
    const waveSpeed = 0.02;
    const waveLayers = 8;

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制声波圆环
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < waveLayers; i++) {
        const radius = waveRadius + i * 30;
        const segments = 100;
        const amplitude = 20 - i * 2;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, ${180 + i * 10}, ${100 + i * 20}, 0.5)`;
        ctx.lineWidth = 2;

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const distortion = Math.sin(angle * 8 + waveAngle) * amplitude;
          const x = centerX + Math.cos(angle) * (radius + distortion);
          const y = centerY + Math.sin(angle) * (radius + distortion);

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      waveAngle += waveSpeed;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="wave-background" />;
};

export default WaveBackground; 