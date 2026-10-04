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

      spacing: {
        1: { value: "0.25rem" },
        2: { value: "0.5rem" },
        3: { value: "0.75rem" },
        4: { value: "1rem" },
        5: { value: "1.25rem" },
        6: { value: "1.5rem" },
        7: { value: "1.75rem" },
        8: { value: "2rem" },
        9: { value: "2.25rem" },
        10: { value: "2.5rem" },
        12: { value: "3rem" },
        14: { value: "3.5rem" },
        16: { value: "4rem" },
        20: { value: "5rem" },
        24: { value: "6rem" },
        28: { value: "7rem" },
        32: { value: "8rem" },
        36: { value: "9rem" },
        40: { value: "10rem" },
        44: { value: "11rem" },
        48: { value: "12rem" },
        52: { value: "13rem" },
        56: { value: "14rem" },
        60: { value: "15rem" },
        64: { value: "16rem" },
        72: { value: "18rem" },
        80: { value: "20rem" },
        96: { value: "24rem" },

        px: { value: "1px" },
        "0.5": { value: "0.125rem" },
        "1.5": { value: "0.375rem" },
        "2.5": { value: "0.625rem" },
        "3.5": { value: "0.875rem" },

        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
        "7xl": { value: "4.5rem" },
        "8xl": { value: "6rem" },
        "9xl": { value: "8rem" },
      },

      radii: {
        none: { value: "0" },
        sm: { value: "0.125rem" },
        base: { value: "0.25rem" },
        md: { value: "0.375rem" },
        lg: { value: "0.5rem" },
        xl: { value: "0.75rem" },
        "2xl": { value: "1rem" },
        "3xl": { value: "1.5rem" },
        full: { value: "9999px" },
      },

      shadows: {
        xs: {
          value: "0 0 0 1px rgba(0, 0, 0, 0.05)",
        },
        sm: {
          value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        },
        base: {
          value:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        md: {
          value:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        lg: {
          value:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        xl: {
          value:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        "2xl": {
          value: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        outline: {
          value: "0 0 0 3px rgba(66, 153, 225, 0.6)",
        },
        inner: {
          value: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
        },
        none: {
          value: "none",
        },
        "dark-lg": {
          value:
            "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px",
        },
      },

      fonts: {
        heading: {
          value: "Montserrat, sans-serif",
        },
        body: {
          value: "Open Sans, sans-serif",
        },
        mono: {
          value: "Roboto Mono, monospace",
        },
      },

      fontWeights: {
        hairline: { value: "100" },
        thin: { value: "200" },
        light: { value: "300" },
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
        extrabold: { value: "800" },
        black: { value: "900" },
      },

      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
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