import { useEffect, useState } from 'react';

type TerminalExample = {
  lines: string[];
  delay: number; // Delay before starting next example
};

const examples: TerminalExample[] = [
  {
    lines: [
      '$ ipython',
      'IPython 8.18.1 -- An enhanced Interactive Python',
      "Type 'copyright', 'credits' or 'license' for more information",
      '',
      'In [1]: import numpy as np',
      '',
      'In [2]: data = np.array([1, 2, 3, 4, 5])',
      '',
      'In [3]: data.mean()',
      'Out[3]: 3.0',
    ],
    delay: 4000,
  },
  {
    lines: [
      '$ ipython',
      'IPython 8.18.1 -- An enhanced Interactive Python',
      '',
      'In [1]: %timeit sum(range(1000))',
      '14.2 µs ± 245 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)',
      '',
      'In [2]: %matplotlib inline',
      '',
      'In [3]: import matplotlib.pyplot as plt',
    ],
    delay: 4000,
  },
  {
    lines: [
      '$ ipython',
      'IPython 8.18.1 -- An enhanced Interactive Python',
      '',
      'In [1]: def fibonacci(n):',
      '   ...:     if n <= 1:',
      '   ...:         return n',
      '   ...:     return fibonacci(n-1) + fibonacci(n-2)',
      '   ...: ',
      '',
      'In [2]: fibonacci(10)',
      'Out[2]: 55',
    ],
    delay: 4000,
  },
];

export default function AnimatedTerminal() {
  const [currentExample, setCurrentExample] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const example = examples[currentExample];
    if (!example) return;

    const lineDelay = 400; // delay between lines appearing

    if (currentLineIndex < example.lines.length) {
      // Show next line
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, example.lines[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
      }, lineDelay);

      return () => clearTimeout(timer);
    } else {
      // All lines displayed, wait then cycle to next example
      const timer = setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % examples.length);
        setCurrentLineIndex(0);
        setDisplayedLines([]);
      }, example.delay);

      return () => clearTimeout(timer);
    }
  }, [currentExample, currentLineIndex]);

  const getLinePrefix = (line: string): { prefix: string; content: string; prefixColor: string } => {
    if (line.startsWith('In [')) {
      const match = line.match(/^(In \[\d+\]:\s*)(.*)$/);
      if (match) {
        return { prefix: match[1], content: match[2], prefixColor: 'text-blue-400' };
      }
    }
    if (line.startsWith('Out[')) {
      const match = line.match(/^(Out\[\d+\]:\s*)(.*)$/);
      if (match) {
        return { prefix: match[1], content: match[2], prefixColor: 'text-yellow-300' };
      }
    }
    if (line.startsWith('   ...:')) {
      return { prefix: '   ...: ', content: line.substring(8), prefixColor: 'text-gray-400' };
    }
    return { prefix: '', content: line, prefixColor: '' };
  };

  const getLineColor = (line: string): string => {
    if (line.startsWith('$')) {
      return 'text-green-400';
    }
    if (line.startsWith('Out[')) {
      return 'text-yellow-300';
    }
    if (line.startsWith('IPython') || line.includes('Type')) {
      return 'text-gray-300';
    }
    if (line.trim() === '') {
      return 'text-gray-400';
    }
    return 'text-gray-300';
  };

  // Calculate max height based on the longest example
  const maxLines = Math.max(...examples.map(ex => ex.lines.length));
  const lineHeight = 1.5; // rem (24px for text-sm)
  const padding = 1.5 * 2; // rem (top + bottom padding)
  const minHeight = `${maxLines * lineHeight + padding}rem`;

  return (
    <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm" style={{ minHeight }}>
      {displayedLines.map((line, index) => {
        const { prefix, content, prefixColor } = getLinePrefix(line);
        const lineColor = getLineColor(line);

        return (
          <div key={index} className={lineColor}>
            {prefix && <span className={prefixColor}>{prefix}</span>}
            {content}
          </div>
        );
      })}
      {displayedLines.length === 0 && (
        <div className="text-green-400">$ ipython</div>
      )}
    </div>
  );
}
