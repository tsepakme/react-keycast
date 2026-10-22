import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "use-hotkeys-ts";
import { PressedKey } from "../types";

const DEFAULT_TIMEOUT = 1500;
const DEFAULT_MAX_ITEMS = 10;
type KeyModifiers = PressedKey["modifiers"];

interface PendingModifierKey {
  key: string;
  modifiers: KeyModifiers;
}

interface KeyPressesOptions {
  timeout?: number;
  maxItems?: number;
}

export function useKeyPresses(options: KeyPressesOptions = {}) {
  const { timeout = DEFAULT_TIMEOUT, maxItems = DEFAULT_MAX_ITEMS } = options;

  const [pressedKeys, setPressedKeys] = useState<PressedKey[]>([]);
  const heldKeys = useRef(new Set<string>());
  const pendingModifierKeys = useRef(new Map<string, PendingModifierKey>());
  const maxItemsRef = useRef(maxItems);
  maxItemsRef.current = maxItems;

  const getKeyId = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const isModifier = ["shift", "control", "alt", "meta"].includes(key);

    // Use the logical name for modifiers so left/right variants count as one key.
    return isModifier ? key : event.code || key;
  };

  const getModifiers = (event: KeyboardEvent): KeyModifiers => ({
    shift: event.shiftKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    meta: event.metaKey,
  });

  const getModifierId = (key: string) => {
    switch (key.toLowerCase()) {
      case "shift":
      case "control":
      case "alt":
      case "meta":
        return key.toLowerCase();
      default:
        return undefined;
    }
  };

  const addPressedKey = (key: string, modifiers: KeyModifiers) => {
    const newKey: PressedKey = {
      key,
      modifiers,
      timestamp: Date.now(),
      id: generateId(),
    };

    setPressedKeys((prev) => {
      const updatedKeys = [...prev, newKey];
      return updatedKeys.slice(
        Math.max(0, updatedKeys.length - maxItemsRef.current)
      );
    });
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

    if (getModifierId(e.key)) {
      pendingModifierKeys.current.set(keyId, {
        key: e.key,
        modifiers: getModifiers(e),
      });
      return;
    }

    // A pending modifier is part of this chord, so don't also show it on release.
    pendingModifierKeys.current.clear();
    addPressedKey(e.key, getModifiers(e));
  });

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const keyId = getKeyId(event);
      heldKeys.current.delete(keyId);

      const pendingModifier = pendingModifierKeys.current.get(keyId);
      if (pendingModifier) {
        pendingModifierKeys.current.delete(keyId);
        addPressedKey(pendingModifier.key, pendingModifier.modifiers);
      }
    };
    const clearHeldKeys = () => {
      heldKeys.current.clear();
      pendingModifierKeys.current.clear();
    };

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
      pendingModifierKeys.current.clear();
    };
  }, [timeout]);

  return pressedKeys;
}
