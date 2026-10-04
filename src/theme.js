import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  theme: {

  },
  globalCss: {
    html: {
      scrollbarGutter: "stable",
    },
  },
})

const system = createSystem(defaultConfig, config)

export default system