import { useEffect, useState } from "react";
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

  const generateId = () => {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15);
  };

  useHotkeys("*", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

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
    const interval = setInterval(() => {
      setPressedKeys((keys) =>
        keys.filter((k) => Date.now() - k.timestamp < timeout)
      );
    }, 200);
    return () => clearInterval(interval);
  }, [timeout]);

  return pressedKeys;
}
