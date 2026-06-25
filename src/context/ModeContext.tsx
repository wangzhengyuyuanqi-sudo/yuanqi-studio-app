"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type AppMode = "edit" | "preview" | null;

interface ModeContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isEdit: boolean;
  isPreview: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: null,
  setMode: () => {},
  isEdit: false,
  isPreview: false,
});

const STORAGE_KEY = "yuanqi-app-mode";

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "edit" || stored === "preview") {
      setModeState(stored);
    }
    setHydrated(true);
  }, []);

  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
    if (newMode) {
      localStorage.setItem(STORAGE_KEY, newMode);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        isEdit: mode === "edit",
        isPreview: mode === "preview",
      }}
    >
      {hydrated ? children : null}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
