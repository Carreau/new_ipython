import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("auto");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = (localStorage.getItem("theme") || "auto") as ThemeMode;
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    let isDark: boolean;

    if (mode === "auto") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = mode === "dark";
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-ipython-slate text-ipython-blue dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-ipython-slate/70 transition-all"
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
    >
      {theme === "light" ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="2.81" y2="2.81" />
          <line x1="19.78" y1="19.78" x2="21.19" y2="21.19" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="2.81" y2="21.19" />
          <line x1="19.78" y1="4.22" x2="21.19" y2="2.81" />
        </svg>
      ) : theme === "dark" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <defs>
            <clipPath id="sunHalf">
              <polygon points="0,0 24,0 0,24" />
            </clipPath>
            <clipPath id="moonHalf">
              <polygon points="24,0 24,24 0,24" />
            </clipPath>
          </defs>
          <g clipPath="url(#sunHalf)">
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="4.22" x2="2.81" y2="2.81" stroke="currentColor" strokeWidth="2" />
            <line x1="19.78" y1="19.78" x2="21.19" y2="21.19" stroke="currentColor" strokeWidth="2" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="19.78" x2="2.81" y2="21.19" stroke="currentColor" strokeWidth="2" />
            <line x1="19.78" y1="4.22" x2="21.19" y2="2.81" stroke="currentColor" strokeWidth="2" />
          </g>
          <g clipPath="url(#moonHalf)">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
          </g>
        </svg>
      )}
    </button>
  );
}
