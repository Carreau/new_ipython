import { useEffect, useState } from 'react';
import VelvetFabric from './VelvetFabric';

export default function ConditionalVelvet() {
  const [showVelvet, setShowVelvet] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-color-theme');
      setShowVelvet(theme === 'velvet');
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

  return showVelvet ? <VelvetFabric /> : null;
}
