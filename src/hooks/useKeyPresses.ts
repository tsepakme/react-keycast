import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "use-hotkeys-ts";
import { PressedKey } from "../types";

const DEFAULT_TIMEOUT = 1500;
const DEFAULT_MAX_ITEMS = 10;

interface KeyPressesOptions {
  timeout?: number;
  maxItems?: number;
}

export function useKeyPresses(options: KeyPressesOptions = {}) {
  const { timeout = DEFAULT_TIMEOUT, maxItems = DEFAULT_MAX_ITEMS } = options;

  const [pressedKeys, setPressedKeys] = useState<PressedKey[]>([]);
  const heldKeys = useRef(new Set<string>());

  const getKeyId = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const isModifier = ["shift", "control", "alt", "meta"].includes(key);

    // Use the logical name for modifiers so left/right variants count as one key.
    return isModifier ? key : event.code || key;
  };

  const generateId = () => {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
  };

  useHotkeys("*", (e: KeyboardEvent) => {
    const keyId = getKeyId(e);
    if (heldKeys.current.has(keyId)) return;
    heldKeys.current.add(keyId);

    const newKey: PressedKey = {
      key: e.key,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
      },
      timestamp: Date.now(),
      id: generateId(),
    };

    setPressedKeys((prev) => {
      const updatedKeys = [...prev, newKey];
      return updatedKeys.slice(Math.max(0, updatedKeys.length - maxItems));
    });
  });

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      heldKeys.current.delete(getKeyId(event));
    };
    const clearHeldKeys = () => heldKeys.current.clear();

    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearHeldKeys);

    const interval = setInterval(() => {
      setPressedKeys((keys) =>
        keys.filter((k) => Date.now() - k.timestamp < timeout)
      );
    }, 200);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearHeldKeys);
      clearInterval(interval);
      heldKeys.current.clear();
    };
  }, [timeout]);

  return pressedKeys;
}
