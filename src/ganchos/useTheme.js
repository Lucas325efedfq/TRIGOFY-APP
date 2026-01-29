import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('trigofy-theme');
    if (savedTheme === 'dark') {
      setTemaEscuro(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !temaEscuro;
    setTemaEscuro(newTheme);
    localStorage.setItem('trigofy-theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Classes de estilo baseadas no tema - Refinadas para um visual mais moderno
  const bgMain = temaEscuro ? 'bg-zinc-950' : 'bg-zinc-50';
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-zinc-100' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800' : 'border-zinc-200';

  return {
    temaEscuro,
    toggleTheme,
    bgMain,
    bgCard,
    textMain,
    textSub,
    borderColor
  };
};
