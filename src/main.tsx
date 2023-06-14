import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { render } from "preact";
import { App } from "./app.tsx";

const { Container, Heading, Tabs } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Container,
    Heading,
    Tabs,
  },
});

render(
  <ChakraBaseProvider theme={theme}>
    <App />
  </ChakraBaseProvider>,
  document.getElementById("app") as HTMLElement
);
