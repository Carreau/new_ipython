import { useEffect, useRef, useState } from 'react';

export default function VelvetSilkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [showSilk, setShowSilk] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-color-theme');
      setShowSilk(theme === 'velvet');
    };

    // Check initial theme
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-theme'],
    });

    // Also check localStorage changes
    const handleStorageChange = () => {
      checkTheme();
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll for changes (fallback)
    const interval = setInterval(checkTheme, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!showSilk) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    const handleWindowBlur = () => {
      isVisibleRef.current = false;
    };

    const handleWindowFocus = () => {
      isVisibleRef.current = true;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    isVisibleRef.current = !document.hidden && document.hasFocus();

    const drawSilk = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create flowing silk patterns using multiple overlapping gradients
      const numLayers = 4;
      
      for (let layer = 0; layer < numLayers; layer++) {
        const layerTime = timeRef.current * (0.3 + layer * 0.1);
        const offsetX = Math.sin(layerTime * 0.5) * width * 0.1;
        const offsetY = Math.cos(layerTime * 0.3) * height * 0.1;
        
        // Create flowing gradient
        const gradient = ctx.createLinearGradient(
          width * 0.2 + offsetX,
          height * 0.3 + offsetY,
          width * 0.8 + offsetX * 1.5,
          height * 0.7 + offsetY * 1.5
        );
        
        // Velvet colors with varying opacity
        const baseOpacity = 0.15;
        const layerOpacity = baseOpacity * (1 - layer * 0.2);
        
        if (layer === 0) {
          gradient.addColorStop(0, `rgba(107, 15, 42, ${layerOpacity})`);
          gradient.addColorStop(0.3, `rgba(139, 21, 56, ${layerOpacity * 0.8})`);
          gradient.addColorStop(0.6, `rgba(169, 29, 61, ${layerOpacity * 0.6})`);
          gradient.addColorStop(1, `rgba(196, 30, 58, ${layerOpacity * 0.4})`);
        } else if (layer === 1) {
          gradient.addColorStop(0, `rgba(139, 21, 56, ${layerOpacity})`);
          gradient.addColorStop(0.4, `rgba(169, 29, 61, ${layerOpacity * 0.7})`);
          gradient.addColorStop(0.7, `rgba(196, 30, 58, ${layerOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(107, 15, 42, ${layerOpacity * 0.3})`);
        } else if (layer === 2) {
          gradient.addColorStop(0, `rgba(169, 29, 61, ${layerOpacity})`);
          gradient.addColorStop(0.5, `rgba(196, 30, 58, ${layerOpacity * 0.6})`);
          gradient.addColorStop(1, `rgba(139, 21, 56, ${layerOpacity * 0.4})`);
        } else {
          gradient.addColorStop(0, `rgba(196, 30, 58, ${layerOpacity})`);
          gradient.addColorStop(0.6, `rgba(169, 29, 61, ${layerOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(107, 15, 42, ${layerOpacity * 0.3})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Add flowing wave patterns
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#8b1538';
      ctx.lineWidth = 1;
      
      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        const waveTime = timeRef.current * 0.4 + i * Math.PI * 0.3;
        const waveY = height * 0.2 + (i * height * 0.15);
        const amplitude = 30 + Math.sin(waveTime) * 10;
        const frequency = 0.01;
        
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const y = waveY + Math.sin(x * frequency + waveTime) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // Add subtle shimmer effect
      const shimmerX = (timeRef.current * 20) % (width + 200) - 100;
      const shimmerGradient = ctx.createLinearGradient(shimmerX, 0, shimmerX + 300, 0);
      shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
      shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      shimmerGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)');
      shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.save();
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.01;
      drawSilk();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showSilk]);

  if (!showSilk) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
