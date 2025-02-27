import { useState } from "react";

const isJSON = (value: string | null) => {
  if (!value) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const useLocalStorage = () => {
  const [storedValue, setStoredValue] = useState(() => {
    const keys = Object.keys(window.localStorage);
    const allValues = keys.reduce((acc, key) => {
      const item = window.localStorage.getItem(key);
      acc[key] = isJSON(item) ? JSON.parse(item!) : item;
      return acc;
    }, {} as Record<string, any>);
    return allValues;
  });

  const getValue = (key: string) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const setValue = (key: string, value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue[key]) : value;
      setStoredValue((prev) => ({ ...prev, [key]: valueToStore }));
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = (key: string) => {
    try {
      setStoredValue((prev) => {
        const newValue = { ...prev };
        delete newValue[key];
        return newValue;
      });
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  };

  return { storedValue, getValue, setValue, removeValue };
};

export default useLocalStorage;
