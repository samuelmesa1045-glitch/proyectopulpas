import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getStoreSettings, saveStoreSettings } from "../services/api";

const StoreSettingsContext = createContext(null);
const defaults = {
  whatsappNumber: "573103636112",
  location: "Santa Rosa de Osos, Antioquia",
  tagline: "Una criatura, muchos sabores, infinitas aventuras.",
};

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const current = await getStoreSettings();
    setSettings(current);
    return current;
  }, []);

  useEffect(() => {
    let mounted = true;
    getStoreSettings().then((data) => { if (mounted) setSettings(data); }).catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const save = useCallback(async (token, nextSettings) => {
    const updated = await saveStoreSettings(token, nextSettings);
    setSettings(updated);
    return updated;
  }, []);

  const value = useMemo(() => ({ settings, loading, refresh, save }), [settings, loading, refresh, save]);
  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export const useStoreSettings = () => useContext(StoreSettingsContext);
export const formatWhatsapp = (number) => {
  const digits = String(number || "").replace(/\D/g, "");
  return digits.startsWith("57") && digits.length === 12
    ? `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : `+${digits}`;
};
