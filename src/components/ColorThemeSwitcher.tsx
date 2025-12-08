import { useEffect, useState } from 'react';

type Theme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  dotColor: string;
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
    dotColor: 'bg-gradient-to-br from-[#0D5C63] via-[#008B95] to-[#059669]',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Pride',
    colors: {
      primary: '#E40303',   // Red
      secondary: '#FF8C00', // Orange
      accent: '#FFED00',    // Yellow
    },
    dotColor: 'bg-gradient-to-r from-[#E40303] via-[#FF8C00] via-[#FFED00] via-[#008026] via-[#004DFF] via-[#750787]',
  },
  {
    id: 'gay',
    name: 'Gay Pride',
    colors: {
      primary: '#078D70',   // Green
      secondary: '#26CEAA', // Light green
      accent: '#98E8C1',    // Pale green
    },
    dotColor: 'bg-gradient-to-r from-[#078D70] via-[#26CEAA] to-[#98E8C1]',
  },
  {
    id: 'lesbian',
    name: 'Lesbian Pride',
    colors: {
      primary: '#D62900',   // Dark orange
      secondary: '#FF9B55', // Orange
      accent: '#D60270',    // Pink
    },
    dotColor: 'bg-gradient-to-r from-[#D62900] via-[#FF9B55] via-[#FFFFFF] via-[#D60270] to-[#9B4F96]',
  },
  {
    id: 'trans',
    name: 'Trans Pride',
    colors: {
      primary: '#5BCEFA',   // Light blue
      secondary: '#F5A9B8', // Pink
      accent: '#FFFFFF',    // White
    },
    dotColor: 'bg-gradient-to-r from-[#5BCEFA] via-[#F5A9B8] via-[#FFFFFF] via-[#F5A9B8] to-[#5BCEFA]',
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: {
      primary: '#6B21A8',
      secondary: '#9333EA',
      accent: '#C084FC',
    },
    dotColor: 'bg-gradient-to-br from-[#6B21A8] via-[#9333EA] to-[#C084FC]',
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: '#C2410C',
      secondary: '#EA580C',
      accent: '#FB923C',
    },
    dotColor: 'bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#FB923C]',
  },
  {
    id: 'pink',
    name: 'Pink',
    colors: {
      primary: '#BE185D',
      secondary: '#EC4899',
      accent: '#F472B6',
    },
    dotColor: 'bg-gradient-to-br from-[#BE185D] via-[#EC4899] to-[#F472B6]',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    colors: {
      primary: '#4338CA',
      secondary: '#6366F1',
      accent: '#818CF8',
    },
    dotColor: 'bg-gradient-to-br from-[#4338CA] via-[#6366F1] to-[#818CF8]',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      primary: '#047857',
      secondary: '#059669',
      accent: '#34D399',
    },
    dotColor: 'bg-gradient-to-br from-[#047857] via-[#059669] to-[#34D399]',
  },
];

export default function ColorThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('colorTheme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
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
    
    // Inject dynamic styles for Tailwind gradient classes
    let styleElement = document.getElementById('theme-gradient-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-gradient-styles';
      document.head.appendChild(styleElement);
    }
    
    // Pride themes with stronger color stops
    const isPrideTheme = ['rainbow', 'gay', 'lesbian', 'trans'].includes(themeId);
    
    let gradientStyles = '';
    
    if (isPrideTheme) {
      // Pride themes: Use explicit multi-color gradients with strong stops
      if (themeId === 'rainbow') {
        gradientStyles = `
          .from-ipython-blue.via-ipython-cyan.to-ipython-green,
          .bg-gradient-to-br.from-ipython-blue.via-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to bottom right, 
              #E40303 0%, #E40303 14%,
              #FF8C00 14%, #FF8C00 28%,
              #FFED00 28%, #FFED00 42%,
              #008026 42%, #008026 57%,
              #004DFF 57%, #004DFF 71%,
              #750787 71%, #750787 85%,
              #E40303 85%, #E40303 100%) !important;
          }
          .from-ipython-blue.to-ipython-cyan,
          .bg-gradient-to-r.from-ipython-blue.to-ipython-cyan {
            background-image: linear-gradient(to right, 
              #E40303 0%, #E40303 33%,
              #FF8C00 33%, #FF8C00 66%,
              #FFED00 66%, #FFED00 100%) !important;
          }
          .from-ipython-cyan.to-ipython-green,
          .bg-gradient-to-r.from-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to right, 
              #FFED00 0%, #FFED00 33%,
              #008026 33%, #008026 66%,
              #004DFF 66%, #004DFF 100%) !important;
          }
          .from-ipython-green.to-ipython-blue,
          .bg-gradient-to-r.from-ipython-green.to-ipython-blue {
            background-image: linear-gradient(to right, 
              #004DFF 0%, #004DFF 33%,
              #750787 33%, #750787 66%,
              #E40303 66%, #E40303 100%) !important;
          }
        `;
      } else if (themeId === 'gay') {
        gradientStyles = `
          .from-ipython-blue.via-ipython-cyan.to-ipython-green,
          .bg-gradient-to-br.from-ipython-blue.via-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to bottom right, 
              #078D70 0%, #078D70 33%,
              #26CEAA 33%, #26CEAA 66%,
              #98E8C1 66%, #98E8C1 100%) !important;
          }
          .from-ipython-blue.to-ipython-cyan,
          .bg-gradient-to-r.from-ipython-blue.to-ipython-cyan {
            background-image: linear-gradient(to right, 
              #078D70 0%, #078D70 50%,
              #26CEAA 50%, #26CEAA 100%) !important;
          }
          .from-ipython-cyan.to-ipython-green,
          .bg-gradient-to-r.from-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to right, 
              #26CEAA 0%, #26CEAA 50%,
              #98E8C1 50%, #98E8C1 100%) !important;
          }
        `;
      } else if (themeId === 'lesbian') {
        gradientStyles = `
          .from-ipython-blue.via-ipython-cyan.to-ipython-green,
          .bg-gradient-to-br.from-ipython-blue.via-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to bottom right, 
              #D62900 0%, #D62900 20%,
              #FF9B55 20%, #FF9B55 40%,
              #FFFFFF 40%, #FFFFFF 60%,
              #D60270 60%, #D60270 80%,
              #9B4F96 80%, #9B4F96 100%) !important;
          }
          .from-ipython-blue.to-ipython-cyan,
          .bg-gradient-to-r.from-ipython-blue.to-ipython-cyan {
            background-image: linear-gradient(to right, 
              #D62900 0%, #D62900 33%,
              #FF9B55 33%, #FF9B55 66%,
              #FFFFFF 66%, #FFFFFF 100%) !important;
          }
          .from-ipython-cyan.to-ipython-green,
          .bg-gradient-to-r.from-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to right, 
              #FFFFFF 0%, #FFFFFF 33%,
              #D60270 33%, #D60270 66%,
              #9B4F96 66%, #9B4F96 100%) !important;
          }
          .from-ipython-green.to-ipython-blue,
          .bg-gradient-to-r.from-ipython-green.to-ipython-blue {
            background-image: linear-gradient(to right, 
              #9B4F96 0%, #9B4F96 33%,
              #D60270 33%, #D60270 66%,
              #D62900 66%, #D62900 100%) !important;
          }
        `;
      } else if (themeId === 'trans') {
        gradientStyles = `
          .from-ipython-blue.via-ipython-cyan.to-ipython-green,
          .bg-gradient-to-br.from-ipython-blue.via-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to bottom right, 
              #5BCEFA 0%, #5BCEFA 20%,
              #F5A9B8 20%, #F5A9B8 40%,
              #FFFFFF 40%, #FFFFFF 60%,
              #F5A9B8 60%, #F5A9B8 80%,
              #5BCEFA 80%, #5BCEFA 100%) !important;
          }
          .from-ipython-blue.to-ipython-cyan,
          .bg-gradient-to-r.from-ipython-blue.to-ipython-cyan {
            background-image: linear-gradient(to right, 
              #5BCEFA 0%, #5BCEFA 33%,
              #F5A9B8 33%, #F5A9B8 66%,
              #FFFFFF 66%, #FFFFFF 100%) !important;
          }
          .from-ipython-cyan.to-ipython-green,
          .bg-gradient-to-r.from-ipython-cyan.to-ipython-green {
            background-image: linear-gradient(to right, 
              #FFFFFF 0%, #FFFFFF 33%,
              #F5A9B8 33%, #F5A9B8 66%,
              #5BCEFA 66%, #5BCEFA 100%) !important;
          }
        `;
      }
    }
    
    // Override Tailwind gradient classes with CSS variables (for non-Pride themes) or explicit gradients (for Pride themes)
    styleElement.textContent = gradientStyles + `
      .from-ipython-blue {
        --tw-gradient-from: var(--theme-primary) var(--tw-gradient-from-position);
        --tw-gradient-to: rgb(13 92 99 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .via-ipython-cyan {
        --tw-gradient-to: rgb(0 139 149 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--theme-secondary) var(--tw-gradient-via-position), var(--tw-gradient-to);
      }
      .to-ipython-cyan {
        --tw-gradient-to: var(--theme-secondary) var(--tw-gradient-to-position);
      }
      .to-ipython-green {
        --tw-gradient-to: var(--theme-accent) var(--tw-gradient-to-position);
      }
      .from-ipython-cyan {
        --tw-gradient-from: var(--theme-secondary) var(--tw-gradient-from-position);
        --tw-gradient-to: rgb(0 139 149 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .from-ipython-green {
        --tw-gradient-from: var(--theme-accent) var(--tw-gradient-from-position);
        --tw-gradient-to: rgb(5 150 105 / 0) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .text-ipython-cyan {
        color: var(--theme-secondary);
      }
      .hover\\:text-ipython-cyan:hover {
        color: var(--theme-secondary);
      }
      .border-ipython-cyan {
        border-color: var(--theme-secondary);
      }
    `;
    
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
            className={`w-6 h-6 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ipython-cyan ${
              theme.dotColor
            } ${
              currentTheme === theme.id
                ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 scale-110'
                : 'opacity-60 hover:opacity-100'
            }`}
            aria-label={`Switch to ${theme.name} theme`}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}
