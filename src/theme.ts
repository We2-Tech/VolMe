'use client'

import { createTheme } from '@mui/material/styles'

// CSS-variable theme with automatic light/dark color schemes.
// Dark mode follows the OS preference via InitColorSchemeScript in the layout.
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    // var(--font-roboto) is set by next/font in layout.tsx; fallbacks kick in
    // if the variable hasn't resolved yet or the font fails to load.
    fontFamily: 'var(--font-roboto), Roboto, Helvetica, Arial, sans-serif',
  },
})

export default theme
