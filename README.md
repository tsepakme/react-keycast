# react-keycast

React HUD for showing recent keyboard input in recordings, demos, and tutorials.

## Install

```sh
npm install react-keycast
```

React 17 or later is required.

## Use

```tsx
import { KeyOverlay } from "react-keycast";
import "react-keycast/style.css";

export function Demo() {
  return <KeyOverlay position="bottom-right" />;
}
```

The overlay listens for key presses outside form controls and editable content. The underlying `use-hotkeys-ts` package provides the global keyboard listener.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `position` | `"bottom-right"` | One of `top-left`, `top-right`, `bottom-left`, `bottom-right`, or `center`. |
| `maxKeys` | `5` | Maximum number of recent key entries to display. |
| `timeout` | `1500` | Time in milliseconds before a key entry is removed. |
| `filterKeys` | Show all keys | Predicate that receives the key name and decides whether to display it. |
| `style` | `{}` | Inline styles for the overlay container. |
| `keyStyle` | `{}` | Inline styles for each key entry. |
| `className` | `""` | Additional class for the overlay container. |

## Styling

Import `react-keycast/style.css` once in the application entry point. You can override `.key-overlay` and `.key-item` with your own CSS, or use `style`, `keyStyle`, and `className` props.

## License

MIT
