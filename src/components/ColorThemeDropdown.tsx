import { useEffect, useState, useRef } from "react";

type Theme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  dotGradient: string;
};

const themes: Theme[] = [
  {
    id: "default",
    name: "IPython Default",
    colors: {
      primary: "#0D5C63",
      secondary: "#008B95",
      accent: "#059669",
    },
    dotGradient:
      "linear-gradient(to bottom right, #0D5C63, #008B95, #059669)",
  },
  {
    id: "rainbow",
    name: "Rainbow Pride",
    colors: {
      primary: "#E40303",
      secondary: "#FF8C00",
      accent: "#FFED00",
    },
    dotGradient:
      "linear-gradient(to bottom right, #E40303 0%, #E40303 16.67%, #FF8C00 16.67%, #FF8C00 33.33%, #FFED00 33.33%, #FFED00 50%, #008026 50%, #008026 66.67%, #004CFF 66.67%, #004CFF 83.33%, #732982 83.33%, #732982 100%)",
  },
  {
    id: "gay",
    name: "Gay Pride",
    colors: {
      primary: "#078D70",
      secondary: "#26CEAA",
      accent: "#98E8C1",
    },
    dotGradient:
      "linear-gradient(to bottom right, #078D70 0%, #078D70 14.28%, #26CEAA 14.28%, #26CEAA 28.56%, #98E8C1 28.56%, #98E8C1 42.84%, #FFFFFF 42.84%, #FFFFFF 57.12%, #7BADE2 57.12%, #7BADE2 71.4%, #5049CC 71.4%, #5049CC 85.68%, #3D1A78 85.68%, #3D1A78 100%)",
  },
  {
    id: "lesbian",
    name: "Lesbian Pride",
    colors: {
      primary: "#D52D00",
      secondary: "#EF7627",
      accent: "#FF9A56",
    },
    dotGradient:
      "linear-gradient(to bottom right, #D52D00 0%, #D52D00 14.28%, #EF7627 14.28%, #EF7627 28.56%, #FF9A56 28.56%, #FF9A56 42.84%, #FFFFFF 42.84%, #FFFFFF 57.12%, #D162A4 57.12%, #D162A4 71.4%, #B55690 71.4%, #B55690 85.68%, #A30262 85.68%, #A30262 100%)",
  },
  {
    id: "trans",
    name: "Trans Pride",
    colors: {
      primary: "#5BCEFA",
      secondary: "#F5A9B8",
      accent: "#FFFFFF",
    },
    dotGradient:
      "linear-gradient(to bottom right, #5BCEFA 0%, #5BCEFA 20%, #F5A9B8 20%, #F5A9B8 40%, #FFFFFF 40%, #FFFFFF 60%, #F5A9B8 60%, #F5A9B8 80%, #5BCEFA 80%, #5BCEFA 100%)",
  },
  {
    id: "purple",
    name: "Purple",
    colors: {
      primary: "#6B21A8",
      secondary: "#9333EA",
      accent: "#C084FC",
    },
    dotGradient:
      "linear-gradient(to bottom right, #6B21A8, #9333EA, #C084FC)",
  },
  {
    id: "orange",
    name: "Orange",
    colors: {
      primary: "#C2410C",
      secondary: "#EA580C",
      accent: "#FB923C",
    },
    dotGradient:
      "linear-gradient(to bottom right, #C2410C, #EA580C, #FB923C)",
  },
  {
    id: "pink",
    name: "Pink",
    colors: {
      primary: "#BE185D",
      secondary: "#EC4899",
      accent: "#F472B6",
    },
    dotGradient:
      "linear-gradient(to bottom right, #BE185D, #EC4899, #F472B6)",
  },
  {
    id: "indigo",
    name: "Indigo",
    colors: {
      primary: "#4338CA",
      secondary: "#6366F1",
      accent: "#818CF8",
    },
    dotGradient:
      "linear-gradient(to bottom right, #4338CA, #6366F1, #818CF8)",
  },
  {
    id: "emerald",
    name: "Emerald",
    colors: {
      primary: "#047857",
      secondary: "#059669",
      accent: "#34D399",
    },
    dotGradient:
      "linear-gradient(to bottom right, #047857, #059669, #34D399)",
  },
  {
    id: "winter",
    name: "Winter",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#e0f2fe",
    },
    dotGradient:
      "linear-gradient(to bottom right, #1e40af 0%, #1e40af 33%, #3b82f6 33%, #3b82f6 66%, #93c5fd 66%, #93c5fd 100%)",
  },
  {
    id: "christmas",
    name: "Christmas",
    colors: {
      primary: "#c8102e",
      secondary: "#006b3c",
      accent: "#ffffff",
    },
    dotGradient:
      "linear-gradient(to bottom right, #c8102e 0%, #c8102e 40%, #006b3c 40%, #006b3c 80%, #ffffff 80%, #ffffff 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: "#0a2540",
      secondary: "#006994",
      accent: "#00d4ff",
    },
    dotGradient:
      "linear-gradient(to bottom right, #0a2540 0%, #0a2540 40%, #006994 40%, #006994 70%, #00d4ff 70%, #00d4ff 100%)",
  },
  {
    id: "velvet",
    name: "Red Velvet",
    colors: {
      primary: "#6b0f2a",
      secondary: "#8b1538",
      accent: "#a91d3d",
    },
    dotGradient:
      "linear-gradient(to bottom right, #6b0f2a 0%, #6b0f2a 40%, #8b1538 40%, #8b1538 70%, #a91d3d 70%, #a91d3d 100%)",
  },
];

export default function ColorThemeDropdown() {
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-color-theme") || 
                    localStorage.getItem("colorTheme") || 
                    "default";
      setCurrentTheme(theme);
    };

    // Check initial theme
    const savedTheme = localStorage.getItem("colorTheme") || "default";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);

    // Watch for theme changes from other components
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-theme"],
    });

    // Also check localStorage changes
    const handleStorageChange = () => {
      checkTheme();
    };
    window.addEventListener("storage", handleStorageChange);

    // Poll for changes (fallback)
    const interval = setInterval(checkTheme, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId) || themes[0];
    const root = document.documentElement;

    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);

    root.setAttribute("data-color-theme", themeId);

    localStorage.setItem("colorTheme", themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    setIsOpen(false);
  };

  if (!isMounted) return null;

  const currentThemeData = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-ipython-slate text-theme-primary dark:text-theme-secondary hover:bg-gray-200 dark:hover:bg-ipython-slate/70 transition-all flex items-center justify-center overflow-hidden"
        aria-label="Select color theme"
        title={`Color theme: ${currentThemeData.name}`}
      >
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundImage: currentThemeData.dotGradient }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-ipython-slate border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentTheme === theme.id
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundImage: theme.dotGradient }}
                />
                <span className="text-sm font-medium">{theme.name}</span>
                {currentTheme === theme.id && (
                  <svg
                    className="w-4 h-4 ml-auto text-theme-primary dark:text-theme-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
