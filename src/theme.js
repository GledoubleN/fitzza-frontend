import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#d1d4f4" },
          100: { value: "#bdc2ef" },
          200: { value: "#a3aae9" },
          300: { value: "#8892e3" },
          400: { value: "#6e79dd" },
          500: { value: "#5a67d8" },
          600: { value: "#3c4cd1" },
          700: { value: "#2a38b2" },
          800: { value: "#212c8b" },
          900: { value: "#171f63" },
        },

        background: {
          50: { value: "#f3f5f8" },
          100: { value: "#c7cfde" },
          200: { value: "#8c9cbb" },
          300: { value: "#576b93" },
          400: { value: "#344058" },
          500: { value: "#1a202c" },
          600: { value: "#171c27" },
          700: { value: "#131720" },
          800: { value: "#0f1219" },
          900: { value: "#0a0d12" },
        },

        secondary: {
          50: { value: "#e4e8ed" },
          100: { value: "#d9dfe6" },
          200: { value: "#cad2dc" },
          300: { value: "#bbc5d2" },
          400: { value: "#abb8c8" },
          500: { value: "#a0aec0" },
          600: { value: "#8496ad" },
          700: { value: "#617692" },
          800: { value: "#48586c" },
          900: { value: "#2f3946" },
        },

        accent: {
          50: { value: "#c8f2d6" },
          100: { value: "#b0ecc5" },
          200: { value: "#90e5ae" },
          300: { value: "#70dd97" },
          400: { value: "#51d67f" },
          500: { value: "#39d06e" },
          600: { value: "#2dbc5f" },
          700: { value: "#259a4e" },
          800: { value: "#1c783d" },
          900: { value: "#14562b" },
        },
      },
    },

    semanticTokens: {
      colors: {
        primary: {
          solid: {
            value: {
              base: "{colors.primary.500}",
              _dark: "{colors.primary.400}",
            },
          },
          contrast: {
            value: "#ffffff",
          },
          fg: {
            value: {
              base: "{colors.primary.700}",
              _dark: "{colors.primary.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.primary.100}",
              _dark: "{colors.primary.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.primary.50}",
              _dark: "{colors.primary.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.primary.600}",
              _dark: "{colors.primary.300}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.primary.500}",
              _dark: "{colors.primary.400}",
            },
          },
        },

        secondary: {
          solid: {
            value: {
              base: "{colors.secondary.500}",
              _dark: "{colors.secondary.400}",
            },
          },
          contrast: {
            value: "#ffffff",
          },
          fg: {
            value: {
              base: "{colors.secondary.700}",
              _dark: "{colors.secondary.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.secondary.100}",
              _dark: "{colors.secondary.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.secondary.50}",
              _dark: "{colors.secondary.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.secondary.600}",
              _dark: "{colors.secondary.300}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.secondary.500}",
              _dark: "{colors.secondary.400}",
            },
          },
        },

        accent: {
          solid: {
            value: {
              base: "{colors.accent.500}",
              _dark: "{colors.accent.400}",
            },
          },
          contrast: {
            value: "#ffffff",
          },
          fg: {
            value: {
              base: "{colors.accent.700}",
              _dark: "{colors.accent.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.accent.100}",
              _dark: "{colors.accent.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.accent.50}",
              _dark: "{colors.accent.900}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.accent.600}",
              _dark: "{colors.accent.300}",
            },
          },
          focusRing: {
            value: {
              base: "{colors.accent.500}",
              _dark: "{colors.accent.400}",
            },
          },
        },

        bg: {
          canvas: {
            value: {
              base: "{colors.background.50}",
              _dark: "{colors.background.500}",
            },
          },
          surface: {
            value: {
              base: "#ffffff",
              _dark: "{colors.background.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.background.50}",
              _dark: "{colors.background.600}",
            },
          },
          muted: {
            value: {
              base: "{colors.background.100}",
              _dark: "{colors.background.700}",
            },
          },
          emphasized: {
            value: {
              base: "{colors.background.200}",
              _dark: "{colors.background.800}",
            },
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

export default system