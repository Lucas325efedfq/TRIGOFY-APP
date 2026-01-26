import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    // Carrega tema do localStorage
    const savedTheme = localStorage.getItem('trigofy-theme');
    if (savedTheme === 'dark') {
      setTemaEscuro(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !temaEscuro;
    setTemaEscuro(newTheme);
    localStorage.setItem('trigofy-theme', newTheme ? 'dark' : 'light');
  };

  // Classes de estilo baseadas no tema
  const bgMain = temaEscuro ? 'bg-zinc-900' : 'bg-white';
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';
  const borderColor = temaEscuro ? 'border-zinc-700' : 'border-zinc-200';

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
