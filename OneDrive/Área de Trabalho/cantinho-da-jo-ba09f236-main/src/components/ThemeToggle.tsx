
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'toggle' | 'button';
  className?: string;
}

const ThemeToggle = ({ variant = 'toggle', className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className={`rounded-full w-9 h-9 ${className} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-beauty-purple" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Toggle
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      className={`rounded-full w-9 h-9 p-0 ${className} ${theme === 'dark' ? 'bg-gray-800 data-[state=on]:bg-gray-700' : 'data-[state=on]:bg-beauty-purple/20'}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-beauty-purple" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Toggle>
  );
};

export default ThemeToggle;
