import { useEffect, useRef } from 'react';

export default function VelvetFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const shimmerOffsetRef = useRef(0);
  const textureOffsetRef = useRef(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

    // Create fabric texture pattern
    const createTexturePattern = (): ImageData => {
      const patternSize = 64;
      const pattern = ctx.createImageData(patternSize, patternSize);
      const data = pattern.data;

      for (let y = 0; y < patternSize; y++) {
        for (let x = 0; x < patternSize; x++) {
          const index = (y * patternSize + x) * 4;
          
          // Create a subtle noise pattern for fabric texture
          const noise = Math.random() * 0.15;
          const wave = Math.sin((x + y) * 0.3) * 0.05;
          const value = noise + wave;
          
          // Very subtle dark red texture
          data[index] = Math.floor(107 * (1 - value));     // R
          data[index + 1] = Math.floor(15 * (1 - value));  // G
          data[index + 2] = Math.floor(42 * (1 - value)); // B
          data[index + 3] = Math.floor(8 + value * 10);   // A - very subtle
        }
      }

      return pattern;
    };

    const texturePattern = createTexturePattern();

    const drawFabricTexture = () => {
      // Draw subtle texture pattern across the canvas
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 64;
      patternCanvas.height = 64;
      const patternCtx = patternCanvas.getContext('2d');
      if (!patternCtx) return;

      patternCtx.putImageData(texturePattern, 0, 0);
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (!pattern) return;

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = pattern;
      ctx.translate(textureOffsetRef.current % 64, textureOffsetRef.current % 64);
      ctx.fillRect(-64, -64, canvas.width + 128, canvas.height + 128);
      ctx.restore();
    };

    const drawShimmer = () => {
      // Create a moving shimmer effect across the fabric
      const shimmerWidth = canvas.width * 0.6;
      const shimmerX = (shimmerOffsetRef.current % (canvas.width + shimmerWidth)) - shimmerWidth;
      
      const gradient = ctx.createLinearGradient(shimmerX, 0, shimmerX + shimmerWidth, 0);
      gradient.addColorStop(0, 'rgba(169, 29, 61, 0)');
      gradient.addColorStop(0.3, 'rgba(201, 30, 58, 0.12)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      gradient.addColorStop(0.7, 'rgba(201, 30, 58, 0.12)');
      gradient.addColorStop(1, 'rgba(169, 29, 61, 0)');

      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const drawNap = () => {
      // Draw fabric nap (direction of fibers) with subtle wave
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#6b0f2a';
      ctx.lineWidth = 1;

      const napSpacing = 8;
      const waveAmplitude = 2;
      const waveFrequency = 0.02;

      for (let y = 0; y < canvas.height; y += napSpacing) {
        ctx.beginPath();
        const offset = (textureOffsetRef.current * 0.1) % (Math.PI * 2);
        const waveY = y + Math.sin(y * waveFrequency + offset) * waveAmplitude;
        ctx.moveTo(0, waveY);
        
        for (let x = 0; x < canvas.width; x += 4) {
          const nextY = y + Math.sin((x + y) * waveFrequency + offset) * waveAmplitude;
          ctx.lineTo(x, nextY);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawDepth = () => {
      // Add subtle depth with varying opacity
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      
      gradient.addColorStop(0, 'rgba(107, 15, 42, 0.05)');
      gradient.addColorStop(0.5, 'rgba(107, 15, 42, 0.02)');
      gradient.addColorStop(1, 'rgba(107, 15, 42, 0)');

      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const animate = () => {
      // Pause animation when page is not visible
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update offsets
      shimmerOffsetRef.current += 0.8;
      textureOffsetRef.current += 0.1;

      // Draw fabric effects in order (back to front)
      drawDepth();
      drawNap();
      drawFabricTexture();
      drawShimmer();

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
