'use client';

import { createTheme } from '@mui/material/styles';
import { typography as typographyConfig } from './theme/typography';

const theme = createTheme({
  palette: {
    primary: {
      main: '#25666e',
      light: '#4a8a92',
      dark: '#1a4a50',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    ...typographyConfig,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'var(--font-inter), Inter, sans-serif',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bricolage: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    bricolage?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bricolage: true;
  }
}

const extendedTheme = createTheme(theme, {
  typography: {
    bricolage: {
      fontFamily: 'var(--font-bricolage-grotesque), "Bricolage Grotesque", sans-serif',
    },
  },
});

export default extendedTheme;

