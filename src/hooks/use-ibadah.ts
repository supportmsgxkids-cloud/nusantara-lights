import { useEffect, useState } from "react";

export function useIbadahVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const h = () => setV((x) => x + 1);
    window.addEventListener("nu-ibadah-changed", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("nu-ibadah-changed", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
}
