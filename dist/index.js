'use strict';

var react = require('react');
var useHotkeysTs = require('use-hotkeys-ts');
var jsxRuntime = require('react/jsx-runtime');

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
  const [pressedKeys, setPressedKeys] = react.useState([]);
  const heldKeys = react.useRef(/* @__PURE__ */ new Set());
  const getKeyId = (event) => {
    const key = event.key.toLowerCase();
    const isModifier = ["shift", "control", "alt", "meta"].includes(key);
    return isModifier ? key : event.code || key;
  };
  const generateId = () => {
    return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  };
  useHotkeysTs.useHotkeys("*", (e) => {
    const keyId = getKeyId(e);
    if (heldKeys.current.has(keyId)) return;
    heldKeys.current.add(keyId);
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
  react.useEffect(() => {
    const handleKeyUp = (event) => {
      heldKeys.current.delete(getKeyId(event));
    };
    const clearHeldKeys = () => heldKeys.current.clear();
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearHeldKeys);
    const interval = setInterval(() => {
      setPressedKeys(
        (keys) => keys.filter((k) => Date.now() - k.timestamp < timeout)
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
var KeyItem = ({ keyData, style = {} }) => {
  var _a;
  const { key, modifiers } = keyData;
  const normalizedKey = key.toLowerCase();
  const keyLabels = {
    shift: "Shift",
    control: "Ctrl",
    ctrl: "Ctrl",
    alt: "Alt",
    meta: "Meta",
    " ": "Space"
  };
  const keyLabel = (_a = keyLabels[normalizedKey]) != null ? _a : key;
  const isPrintableCharacter = key.length === 1 && key !== " ";
  const modKeys = [
    modifiers.ctrl && normalizedKey !== "control" && "Ctrl",
    modifiers.alt && normalizedKey !== "alt" && "Alt",
    modifiers.shift && normalizedKey !== "shift" && !isPrintableCharacter && "Shift",
    modifiers.meta && normalizedKey !== "meta" && "Meta"
  ].filter(Boolean).join(" + ");
  const label = modKeys ? `${modKeys} + ${keyLabel}` : keyLabel;
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "key-item", style, children: label });
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: `key-overlay ${className}`,
      style: __spreadValues(__spreadValues({}, positionStyles[position]), style),
      children: filteredKeys.map((keyData) => /* @__PURE__ */ jsxRuntime.jsx(
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

exports.KeyOverlay = KeyOverlay;
