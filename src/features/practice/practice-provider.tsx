"use client";
import { createContext, useContext, type ReactNode } from "react";
import { PrefetchRoutes } from "./components/prefetch-routes";
import { usePracticeStore } from "./hooks/use-practice-store";
const PracticeContext = createContext<ReturnType<
  typeof usePracticeStore
> | null>(null);
export function PracticeProvider({ children }: { children: ReactNode }) {
  const store = usePracticeStore();
  return (
    <PracticeContext.Provider value={store}>
      <PrefetchRoutes />
      {children}
    </PracticeContext.Provider>
  );
}
export function usePractice() {
  const store = useContext(PracticeContext);
  if (!store) throw new Error("PracticeProvider is required");
  return store;
}
