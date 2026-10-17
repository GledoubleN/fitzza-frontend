import {
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#f8c9c9' },
          100: { value: '#f5b2b2' },
          200: { value: '#f09393' },
          300: { value: '#ec7474' },
          400: { value: '#e85555' },
          500: { value: '#e53e3e' },
          600: { value: '#e11f1f' },
          700: { value: '#b91919' },
          800: { value: '#901313' },
          900: { value: '#670e0e' },
        },

        background: {
          50: { value: '#f0f0f0' },
          100: { value: '#cfcfcf' },
          200: { value: '#a3a3a3' },
          300: { value: '#777777' },
          400: { value: '#4b4b4b' },
          500: { value: '#2a2a2a' },
          600: { value: '#252525' },
          700: { value: '#1e1e1e' },
          800: { value: '#181818' },
          900: { value: '#111111' },
        },

        secondary: {
          50: { value: '#f7f9fb' },
          100: { value: '#f3f6f9' },
          200: { value: '#eff2f7' },
          300: { value: '#eaeef4' },
          400: { value: '#e5ebf2' },
          500: { value: '#e2e8f0' },
          600: { value: '#afbfd5' },
          700: { value: '#6a89b2' },
          800: { value: '#3e5677' },
          900: { value: '#1a2533' },
        },

        accent: {
          50: { value: '#b8f0fc' },
          100: { value: '#9aeafa' },
          200: { value: '#71e2f8' },
          300: { value: '#49daf6' },
          400: { value: '#20d1f5' },
          500: { value: '#0bc5ea' },
          600: { value: '#0aadce' },
          700: { value: '#088ea8' },
          800: { value: '#066e83' },
          900: { value: '#044f5e' },
        },
      },

      fonts: {
        heading: { value: '\'Nanum Gothic\', sans-serif' },
        body: { value: '\'Nanum Gothic\', sans-serif' },
        mono: { value: '\'Nanum Gothic Coding\', monospace' },
      },
    },

    semanticTokens: {
      colors: {
        primary: {
          solid: { value: '{colors.primary.500}' },
          contrast: { value: '#ffffff' },
          fg: { value: '{colors.primary.700}' },
          muted: { value: '{colors.primary.100}' },
          subtle: { value: '{colors.primary.50}' },
          emphasized: { value: '{colors.primary.600}' },
          focusRing: { value: '{colors.primary.500}' },
        },

        secondary: {
          solid: { value: '{colors.secondary.500}' },
          contrast: { value: '#000000' },
          fg: { value: '{colors.secondary.800}' },
          muted: { value: '{colors.secondary.300}' },
          subtle: { value: '{colors.secondary.100}' },
          emphasized: { value: '{colors.secondary.600}' },
          focusRing: { value: '{colors.secondary.500}' },
        },

        accent: {
          solid: { value: '{colors.accent.500}' },
          contrast: { value: '#000000' },
          fg: { value: '{colors.accent.700}' },
          muted: { value: '{colors.accent.100}' },
          subtle: { value: '{colors.accent.50}' },
          emphasized: { value: '{colors.accent.600}' },
          focusRing: { value: '{colors.accent.500}' },
        },

        background: {
          canvas: { value: '{colors.background.900}' },
          surface: { value: '{colors.background.800}' },
          muted: { value: '{colors.background.700}' },
          emphasized: { value: '{colors.background.600}' },
        },
      },
    },
  },
  globalCss: {
    html: {
      scrollbarGutter: 'stable',
    },
  },
})

const system = createSystem(defaultConfig, config)

export default system