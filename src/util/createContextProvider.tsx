import { createContext, useContext, type ReactNode } from "react";

export function createContextProvider<T, P>(useValue: (props: P) => T) {
  const Context = createContext<T | undefined>(undefined);

  const Provider = ({ children, ...props }: P & { children: ReactNode }) => {
    // Gọi hook truyền vào để lấy toàn bộ logic/state
    const value = useValue(props as P);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useRes = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error("useContext must be used within its Provider");
    }
    return context;
  };

  return [Provider, useRes, Context] as const;
}
