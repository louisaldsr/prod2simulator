"use client";

import { useEffect } from "react";
import { InitializeGameStoreParams, useGameStore } from "../context/GameStore";

interface GameStoreLoaderProps {
  params: InitializeGameStoreParams;
}

export default function GameStoreLoader(props: GameStoreLoaderProps) {
  const initialized = useGameStore((store) => store.initialized);
  const initialize = useGameStore((store) => store.initialize);

  useEffect(() => {
    if (!initialized) {
      initialize(props.params);
    }
  });
  return <></>;
}
