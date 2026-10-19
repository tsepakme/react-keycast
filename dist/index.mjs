import { useState, useEffect } from 'react';
import { useHotkeys } from 'use-hotkeys-ts';
import { jsx } from 'react/jsx-runtime';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var DEFAULT_TIMEOUT = 1500;
var DEFAULT_MAX_ITEMS = 10;
function useKeyPresses(options = {}) {
  const { timeout = DEFAULT_TIMEOUT, maxItems = DEFAULT_MAX_ITEMS } = options;
  const [pressedKeys, setPressedKeys] = useState([]);
  const generateId = () => {
    return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  };
  useHotkeys("*", (e) => {
    const newKey = {
      key: e.key,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      timestamp: Date.now(),
      id: generateId()
    };
    setPressedKeys((prev) => {
      const updatedKeys = [...prev, newKey];
      return updatedKeys.slice(Math.max(0, updatedKeys.length - maxItems));
    });
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setPressedKeys(
        (keys) => keys.filter((k) => Date.now() - k.timestamp < timeout)
      );
    }, 200);
    return () => clearInterval(interval);
  }, [timeout]);
  return pressedKeys;
}
var KeyItem = ({ keyData, style = {} }) => {
  const { key, modifiers } = keyData;
  const modKeys = [
    modifiers.ctrl && "Ctrl",
    modifiers.alt && "Alt",
    modifiers.shift && "Shift",
    modifiers.meta && "Meta"
  ].filter(Boolean).join(" + ");
  const label = modKeys ? `${modKeys} + ${key}` : key;
  return /* @__PURE__ */ jsx("div", { className: "key-item", style, children: label });
};
var KeyOverlay = ({
  position = "bottom-right",
  style = {},
  keyStyle = {},
  maxKeys = 5,
  timeout = 1500,
  filterKeys = () => true,
  className = ""
}) => {
  const keys = useKeyPresses({
    timeout,
    maxItems: maxKeys
  });
  const filteredKeys = keys.filter((k) => filterKeys(k.key));
  const positionStyles = {
    "top-left": { top: 16, left: 16, bottom: "auto", right: "auto" },
    "top-right": { top: 16, right: 16, bottom: "auto", left: "auto" },
    "bottom-left": { bottom: 16, left: 16, top: "auto", right: "auto" },
    "bottom-right": { bottom: 16, right: 16, top: "auto", left: "auto" },
    "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `key-overlay ${className}`,
      style: __spreadValues(__spreadValues({}, positionStyles[position]), style),
      children: filteredKeys.map((keyData) => /* @__PURE__ */ jsx(
        KeyItem,
        {
          keyData,
          style: __spreadValues({ animationDuration: `${timeout}ms` }, keyStyle)
        },
        keyData.id
      ))
    }
  );
};

export { KeyOverlay };
