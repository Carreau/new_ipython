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
  const sectionDividersRef = useRef<Array<{ y: number; inverted: boolean }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const findSections = () => {
      const sections = document.querySelectorAll('section, main > div');
      sectionDividersRef.current = [];
      
      sections.forEach((section, index) => {
        if (index === 0) return; // Skip first section
        const rect = section.getBoundingClientRect();
        const scrollY = window.scrollY;
        const sectionTop = rect.top + scrollY;
        
        // Check if section has different background
        const computedStyle = window.getComputedStyle(section);
        const bgColor = computedStyle.backgroundColor;
        const prevSection = sections[index - 1] as HTMLElement;
        const prevBgColor = prevSection ? window.getComputedStyle(prevSection).backgroundColor : '';
        
        // Add divider if sections have different backgrounds or are substantial
        if (bgColor !== prevBgColor || rect.height > 200) {
          sectionDividersRef.current.push({
            y: sectionTop,
            inverted: index % 2 === 0, // Alternate wave direction
          });
        }
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create bubbles
      bubblesRef.current = [];
      const bubbleCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < bubbleCount; i++) {
        bubblesRef.current.push({
          x: Math.random() * canvas.width,
          y: window.scrollY + Math.random() * canvas.height,
          size: 2 + Math.random() * 8,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.2 + Math.random() * 0.4,
          drift: (Math.random() - 0.5) * 0.5,
        });
      }
      
      findSections();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', findSections, { passive: true });
    
    // Update sections periodically
    const sectionInterval = setInterval(findSections, 1000);

    const drawWave = (ctx: CanvasRenderingContext2D, screenY: number, amplitude: number, frequency: number, speed: number, color: string, opacity: number, inverted: boolean = false) => {
      ctx.save();
      ctx.beginPath();
      
      const direction = inverted ? -1 : 1;
      const waveSpeed = speed * direction;
      
      ctx.moveTo(0, screenY);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const waveY = screenY + Math.sin((x * frequency + waveOffsetRef.current * waveSpeed) * 0.01) * amplitude * direction;
        ctx.lineTo(x, waveY);
      }
      
      if (inverted) {
        // Wave going up - fill above
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
      } else {
        // Wave going down - fill below
        ctx.lineTo(canvas.width, window.innerHeight);
        ctx.lineTo(0, window.innerHeight);
      }
      ctx.closePath();
      
      const gradientStart = inverted ? screenY + amplitude : screenY - amplitude;
      const gradientEnd = inverted ? 0 : window.innerHeight;
      const gradient = ctx.createLinearGradient(0, gradientStart, 0, gradientEnd);
      gradient.addColorStop(0, color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, color + '00');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      const scrollY = window.scrollY;
      const screenX = bubble.x;
      const screenY = bubble.y - scrollY;
      
      // Draw bubble
      const gradient = ctx.createRadialGradient(
        screenX - bubble.size * 0.3,
        screenY - bubble.size * 0.3,
        0,
        screenX,
        screenY,
        bubble.size
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(0, 212, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, bubble.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(screenX - bubble.size * 0.3, screenY - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update wave offset
      waveOffsetRef.current += 1;
      
      const scrollY = window.scrollY;
      
      // Draw waves at section dividers
      sectionDividersRef.current.forEach((divider) => {
        const dividerScreenY = divider.y - scrollY;
        
        // Only draw if in or near viewport
        if (dividerScreenY > -150 && dividerScreenY < window.innerHeight + 150) {
          if (divider.inverted) {
            // Wave going up
            drawWave(ctx, dividerScreenY, 12, 0.5, 1.5, '#00d4ff', 0.12, true);
            drawWave(ctx, dividerScreenY - 15, 10, 0.6, 1.2, '#00b8e6', 0.1, true);
            drawWave(ctx, dividerScreenY - 30, 8, 0.7, 1, '#006994', 0.08, true);
          } else {
            // Wave going down
            drawWave(ctx, dividerScreenY, 12, 0.5, 1.5, '#00d4ff', 0.12, false);
            drawWave(ctx, dividerScreenY + 15, 10, 0.6, 1.2, '#00b8e6', 0.1, false);
            drawWave(ctx, dividerScreenY + 30, 8, 0.7, 1, '#006994', 0.08, false);
          }
        }
      });
      
      // Draw waves at the bottom of document (footer)
      const docHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const bottomWaveDocY = docHeight - 100;
      const bottomWaveScreenY = bottomWaveDocY - scrollY;
      
      // Only draw if in or near viewport
      if (bottomWaveScreenY > -150 && bottomWaveScreenY < window.innerHeight + 150) {
        drawWave(ctx, bottomWaveScreenY, 15, 0.5, 2, '#00d4ff', 0.15);
        drawWave(ctx, bottomWaveScreenY + 20, 12, 0.6, 1.5, '#00b8e6', 0.12);
        drawWave(ctx, bottomWaveScreenY + 40, 10, 0.7, 1, '#006994', 0.1);
      }
      
      // Update and draw bubbles
      bubblesRef.current.forEach((bubble) => {
        // Update bubble position
        bubble.y -= bubble.speed;
        bubble.x += bubble.drift;
        
        // Reset if off screen top
        if (bubble.y < scrollY - 100) {
          bubble.y = scrollY + window.innerHeight + 100;
          bubble.x = Math.random() * canvas.width;
        }
        
        // Reset if off screen bottom
        if (bubble.y > scrollY + window.innerHeight + 100) {
          bubble.y = scrollY - 100;
          bubble.x = Math.random() * canvas.width;
        }
        
        // Wrap horizontally
        if (bubble.x < -bubble.size) bubble.x = canvas.width + bubble.size;
        if (bubble.x > canvas.width + bubble.size) bubble.x = -bubble.size;
        
        // Only draw if in or near viewport
        const currentScreenY = bubble.y - scrollY;
        if (currentScreenY > -100 && currentScreenY < window.innerHeight + 100) {
          drawBubble(ctx, bubble);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', findSections);
      clearInterval(sectionInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
