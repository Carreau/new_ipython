import { useEffect, useState } from 'react';

type Theme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  dotGradient: string; // CSS linear-gradient string
};

const themes: Theme[] = [
  {
    id: 'default',
    name: 'IPython Default',
    colors: {
      primary: '#0D5C63',   // ipython-blue
      secondary: '#008B95',  // ipython-cyan
      accent: '#059669',     // ipython-green
    },
    dotGradient: 'linear-gradient(to bottom right, #0D5C63, #008B95, #059669)',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Pride',
    colors: {
      primary: '#E40303',   // Red
      secondary: '#FF8C00', // Orange
      accent: '#FFED00',    // Yellow
    },
    dotGradient: 'linear-gradient(to bottom right, #E40303 0%, #E40303 16.67%, #FF8C00 16.67%, #FF8C00 33.33%, #FFED00 33.33%, #FFED00 50%, #008026 50%, #008026 66.67%, #004CFF 66.67%, #004CFF 83.33%, #732982 83.33%, #732982 100%)',
  },
  {
    id: 'gay',
    name: 'Gay Pride',
    colors: {
      primary: '#078D70',   // Green
      secondary: '#26CEAA', // Light green/teal
      accent: '#98E8C1',    // Pale green/mint
    },
    dotGradient: 'linear-gradient(to bottom right, #078D70 0%, #078D70 14.28%, #26CEAA 14.28%, #26CEAA 28.56%, #98E8C1 28.56%, #98E8C1 42.84%, #FFFFFF 42.84%, #FFFFFF 57.12%, #7BADE2 57.12%, #7BADE2 71.4%, #5049CC 71.4%, #5049CC 85.68%, #3D1A78 85.68%, #3D1A78 100%)',
  },
  {
    id: 'lesbian',
    name: 'Lesbian Pride',
    colors: {
      primary: '#D52D00',   // Dark orange/red
      secondary: '#EF7627', // Orange
      accent: '#FF9A56',    // Light orange
    },
    dotGradient: 'linear-gradient(to bottom right, #D52D00 0%, #D52D00 14.28%, #EF7627 14.28%, #EF7627 28.56%, #FF9A56 28.56%, #FF9A56 42.84%, #FFFFFF 42.84%, #FFFFFF 57.12%, #D162A4 57.12%, #D162A4 71.4%, #B55690 71.4%, #B55690 85.68%, #A30262 85.68%, #A30262 100%)',
  },
  {
    id: 'trans',
    name: 'Trans Pride',
    colors: {
      primary: '#5BCEFA',   // Light blue
      secondary: '#F5A9B8', // Pink
      accent: '#FFFFFF',    // White
    },
    dotGradient: 'linear-gradient(to bottom right, #5BCEFA 0%, #5BCEFA 20%, #F5A9B8 20%, #F5A9B8 40%, #FFFFFF 40%, #FFFFFF 60%, #F5A9B8 60%, #F5A9B8 80%, #5BCEFA 80%, #5BCEFA 100%)',
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: {
      primary: '#6B21A8',
      secondary: '#9333EA',
      accent: '#C084FC',
    },
    dotGradient: 'linear-gradient(to bottom right, #6B21A8, #9333EA, #C084FC)',
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: '#C2410C',
      secondary: '#EA580C',
      accent: '#FB923C',
    },
    dotGradient: 'linear-gradient(to bottom right, #C2410C, #EA580C, #FB923C)',
  },
  {
    id: 'pink',
    name: 'Pink',
    colors: {
      primary: '#BE185D',
      secondary: '#EC4899',
      accent: '#F472B6',
    },
    dotGradient: 'linear-gradient(to bottom right, #BE185D, #EC4899, #F472B6)',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    colors: {
      primary: '#4338CA',
      secondary: '#6366F1',
      accent: '#818CF8',
    },
    dotGradient: 'linear-gradient(to bottom right, #4338CA, #6366F1, #818CF8)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      primary: '#047857',
      secondary: '#059669',
      accent: '#34D399',
    },
    dotGradient: 'linear-gradient(to bottom right, #047857, #059669, #34D399)',
  },
  {
    id: 'winter',
    name: 'Winter',
    colors: {
      primary: '#1e40af',   // Deep blue
      secondary: '#3b82f6', // Bright blue
      accent: '#e0f2fe',    // Light blue/ice
    },
    dotGradient: 'linear-gradient(to bottom right, #1e40af 0%, #1e40af 33%, #3b82f6 33%, #3b82f6 66%, #93c5fd 66%, #93c5fd 100%)',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    colors: {
      primary: '#c8102e',   // Deep Christmas Red
      secondary: '#006b3c', // Forest Green
      accent: '#ffffff',    // White/Snow
    },
    dotGradient: 'linear-gradient(to bottom right, #c8102e 0%, #c8102e 40%, #006b3c 40%, #006b3c 80%, #ffffff 80%, #ffffff 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0a2540',   // Deep ocean blue
      secondary: '#006994', // Ocean blue
      accent: '#00d4ff',    // Bright cyan
    },
    dotGradient: 'linear-gradient(to bottom right, #0a2540 0%, #0a2540 40%, #006994 40%, #006994 70%, #00d4ff 70%, #00d4ff 100%)',
  },
  {
    id: 'velvet',
    name: 'Red Velvet',
    colors: {
      primary: '#6b0f2a',   // Deep velvet red
      secondary: '#8b1538', // Rich carmine
      accent: '#a91d3d',    // Warm velvet
    },
    dotGradient: 'linear-gradient(to bottom right, #6b0f2a 0%, #6b0f2a 40%, #8b1538 40%, #8b1538 70%, #a91d3d 70%, #a91d3d 100%)',
  },
  {
    id: 'sun',
    name: 'Sun',
    colors: {
      primary: '#f59e0b',   // Bright amber/yellow
      secondary: '#fbbf24', // Golden yellow
      accent: '#fcd34d',     // Light yellow
    },
    dotGradient: 'linear-gradient(to bottom right, #f59e0b 0%, #f59e0b 40%, #fbbf24 40%, #fbbf24 70%, #fcd34d 70%, #fcd34d 100%)',
  },
];

export default function ColorThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-color-theme') || 
                    localStorage.getItem('colorTheme') || 
                    'default';
      setCurrentTheme(theme);
    };

    // Check initial theme
    const savedTheme = localStorage.getItem('colorTheme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);

    // Watch for theme changes from other components
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

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    
    // Update Tailwind colors via data attribute
    root.setAttribute('data-color-theme', themeId);
    
    // Store preference
    localStorage.setItem('colorTheme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Color theme:</span>
      <div className="flex gap-2 flex-wrap">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`w-6 h-6 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-secondary ${
              currentTheme === theme.id
                ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 scale-110'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundImage: theme.dotGradient }}
            aria-label={`Switch to ${theme.name} theme`}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}
