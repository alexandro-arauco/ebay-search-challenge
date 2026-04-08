"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MockApiCtx = {
  isMock: boolean;
  toggle: () => void;
};

const MockApiContext = createContext<MockApiCtx | null>(null);

export function MockApiProvider({ children }: { children: ReactNode }) {
  const [isMock, setIsMock] = useState(false);

  const toggle = () => setIsMock((prev) => !prev);

  return (
    <MockApiContext.Provider value={{ isMock, toggle }}>
      {children}
    </MockApiContext.Provider>
  );
}

export const useMockApi = () => {
  const ctx = useContext(MockApiContext);
  if (!ctx) throw new Error("useMockApi must be inside MockApiProvider");
  return ctx;
};
