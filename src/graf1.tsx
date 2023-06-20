import { ChakraProvider } from "@chakra-ui/react";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

import {
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { SlopeChart } from "./components/SlopeChart";
import { usePostMessageWithHeight } from "./hooks/usePostHeightMessage";

const charts = [
  {
    title: "Kolik procent příjmů dávají za bydlení",
    filename: "vydaje-procenta",
    line: [0],
    unit: " %",
    groups: [
      {
        name: "Typ domácnosti – děti a příjem",
        visible: ["S dětmi – příjem pod medián"],
      },
      {
        name: "Příjem domácnosti",
        visible: ["Pod hranicí chudoby (< 60 % mediánu)"],
      },
      {
        name: "Region",
        visible: ["Severozápad (Karlovarský a Ústecký kraj)"],
      },
    ],
  },
];

const App = () => {
  const { containerRef, postHeightMessage } =
    usePostMessageWithHeight("rok-nezap-graf1");
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    postHeightMessage();
  }, [activeTab]);

  return (
    <Container maxW={620} ref={containerRef} px={0}>
      {charts.map((chart) => {
        return (
          <Container px={0}>
            <Heading fontSize={"2xl"} pb={3}>
              {chart.title}
            </Heading>
            <Tabs
              key={chart.filename}
              variant="enclosed"
              size={"sm"}
              onChange={(index) => setActiveTab(index)}
            >
              <TabList>
                {chart.groups.map((group) => {
                  return (
                    <Tab key={group.name} fontSize={"sm"}>
                      {group.name}
                    </Tab>
                  );
                })}
              </TabList>
              <TabPanels>
                {chart.groups.map((group) => {
                  return (
                    <TabPanel key={group.name}>
                      <SlopeChart
                        filename={chart.filename}
                        line={chart.line}
                        group={group.name}
                        unit={chart.unit}
                        visible={group.visible}
                      ></SlopeChart>
                    </TabPanel>
                  );
                })}
              </TabPanels>
            </Tabs>
          </Container>
        );
      })}
    </Container>
  );
};

render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("app") as HTMLElement
);
