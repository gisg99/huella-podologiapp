/* eslint-disable react-refresh/only-export-components -- módulo de contexto: provider + hook + helper de arranque conviven aquí */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { settingsRepo } from '../db/index.js';

// Tema: 'light' | 'dark' | null (seguir al sistema).
// Fuente de verdad en IndexedDB (settings); se replica en localStorage solo
// para aplicarlo sin parpadeo al arrancar (no es dato clínico).
const LS_KEY = 'huella.theme';
const ThemeContext = createContext(null);

function applyTheme(theme) {
  const el = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    el.setAttribute('data-theme', theme);
  } else {
    el.removeAttribute('data-theme');
  }
}

/** Lee el tema guardado en localStorage (arranque rápido, sin esperar IndexedDB). */
export function readBootTheme() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readBootTheme());

  // Al montar, concilia con IndexedDB (fuente de verdad).
  useEffect(() => {
    let active = true;
    settingsRepo.getTheme().then((stored) => {
      if (!active) return;
      if (stored !== theme) {
        setThemeState(stored);
        applyTheme(stored);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    applyTheme(next);
    try {
      if (next) localStorage.setItem(LS_KEY, next);
      else localStorage.removeItem(LS_KEY);
    } catch {
      /* almacenamiento bloqueado: seguimos igual */
    }
    settingsRepo.setTheme(next);
  }, []);

  const cycle = useCallback(() => {
    // sistema → claro → oscuro → sistema
    setTheme(theme === null ? 'light' : theme === 'light' ? 'dark' : null);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
