'use client'

import { createTheme } from '@mui/material/styles'

// VolMe's green scale, carried over from the v1 theme (frontend/src/theme.js).
export const green = {
  50: '#F6FEF6',
  100: '#E3FBE3',
  200: '#C7F7C7',
  300: '#A1E8A1',
  400: '#51BC51',
  450: '#5CBC63',
  500: '#1F7A1F',
  600: '#136C13',
  700: '#0A470A',
  800: '#042F04',
  900: '#021D02',
}

// CSS-variable theme with automatic light/dark color schemes.
// Dark mode follows the OS preference via InitColorSchemeScript in the layout.
//
// Deliberately no `components` block: v2 starts on stock MUI components and adds
// overrides only once a real screen proves one is needed.
// See docs/decisions/0003-no-component-styleoverrides-yet.md.
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: green[450] },
        secondary: { main: green[500] },
        background: { default: '#FCFCF6', paper: '#FFFFFF' },
      },
    },
    dark: {
      palette: {
        // The light scale is too dark to read on a dark ground — step up two rungs.
        primary: { main: green[300] },
        secondary: { main: green[400] },
        background: { default: '#0E1210', paper: '#161B17' },
      },
    },
  },
  typography: {
    // var(--font-roboto) is set by next/font in layout.tsx; fallbacks kick in
    // if the variable hasn't resolved yet or the font fails to load.
    fontFamily: 'var(--font-roboto), Roboto, Helvetica, Arial, sans-serif',
  },
})

export default theme
