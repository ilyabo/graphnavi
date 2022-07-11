import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
    cssVarPrefix: "fmc",
  } as ThemeConfig,
});

export default theme;
