import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

export default function OceanWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const bubblesRef = useRef<Bubble[]>([]);
  const waveOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create bubbles
      bubblesRef.current = [];
      const bubbleCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < bubbleCount; i++) {
        bubblesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 200,
          size: 2 + Math.random() * 8,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.2 + Math.random() * 0.4,
          drift: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawWave = (ctx: CanvasRenderingContext2D, y: number, amplitude: number, frequency: number, speed: number, color: string, opacity: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const waveY = y + Math.sin((x * frequency + waveOffsetRef.current * speed) * 0.01) * amplitude;
        ctx.lineTo(x, waveY);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, y - amplitude, 0, canvas.height);
      gradient.addColorStop(0, color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      // Draw bubble
      const gradient = ctx.createRadialGradient(
        bubble.x - bubble.size * 0.3,
        bubble.y - bubble.size * 0.3,
        0,
        bubble.x,
        bubble.y,
        bubble.size
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(0, 212, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update wave offset
      waveOffsetRef.current += 1;
      
      // Draw waves at the bottom
      const waveY = canvas.height * 0.7;
      drawWave(ctx, waveY, 15, 0.5, 2, '#00d4ff', 0.15);
      drawWave(ctx, waveY + 20, 12, 0.6, 1.5, '#00b8e6', 0.12);
      drawWave(ctx, waveY + 40, 10, 0.7, 1, '#006994', 0.1);
      
      // Update and draw bubbles
      bubblesRef.current.forEach((bubble) => {
        bubble.y -= bubble.speed;
        bubble.x += bubble.drift;
        
        // Reset if off screen
        if (bubble.y < -bubble.size) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }
        
        // Wrap horizontally
        if (bubble.x < -bubble.size) bubble.x = canvas.width + bubble.size;
        if (bubble.x > canvas.width + bubble.size) bubble.x = -bubble.size;
        
        drawBubble(ctx, bubble);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none z-0"
    />
  );
}
