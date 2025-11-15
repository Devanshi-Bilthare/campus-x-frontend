export const typography = {
  h1: {
    fontSize: '3rem', // 48px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  h2: {
    fontSize: '2.5rem', // 40px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  h3: {
    fontSize: '2rem', // 32px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  h4: {
    fontSize: '1.5rem', // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  h5: {
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  h6: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    color: '#101828',
    fontFamily: 'var(--font-bricolage-grotesque)',
  },
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    color: '#535862',
    fontFamily: 'var(--font-inter)',
  },
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    color: '#535862',
    fontFamily: 'var(--font-inter)',
  },
  subtitle1: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    color: '#535862',
    fontFamily: 'var(--font-inter)',
  },
  subtitle2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    color: '#535862',
    fontFamily: 'var(--font-inter)',
  },
  button: {
    fontSize: '0.875rem', // 14px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
};


export const button = {
  fontSize: '0.875rem', // 14px
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  textTransform: 'none' as const,
  width: '100%',
  height: '50px',
  borderRadius: '8px',
  backgroundColor: '#25666e',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#25666e',
  },
  '&:active': {
    backgroundColor: '#1a4a50',
  },
  '&:focus': {
    backgroundColor: '#1a4a50',
  },
  '&:disabled': {
    backgroundColor: '#1a4a50',
  },
  '&:loading': {
    backgroundColor: '#1a4a50',
  },
};


export const outlineButton = {
  fontSize: '0.875rem', // 14px
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  textTransform: 'none' as const,
  width: 'max-content',
  borderRadius: '8px',
  border: '1px solid #25666e',
  color: '#25666e',
};