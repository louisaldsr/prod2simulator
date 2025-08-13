'use client';
import { createContext, useContext, useState } from 'react';

const ScoreContext = createContext<{ updated: number; notify: () => void }>({
  updated: 0,
  notify: () => {},
});

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [updated, setUpdated] = useState(0);
  const notify = () => setUpdated((u) => u + 1);
  return (
    <ScoreContext.Provider value={{ updated, notify }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScoreUpdate() {
  return useContext(ScoreContext);
}
